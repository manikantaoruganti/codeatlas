from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
import zipfile
import io
from typing import Dict, List

from models.analysis import (
    AnalysisResult, AnalysisRequest, CompilerRequest, CompilerResponse,
    AIInsightRequest, AIInsightResponse, FileMetrics, CodeSmell, Hotspot, RefactorAction
)
from analysis_engine.language_adapters.adapters import get_adapter
from analysis_engine.metrics_calculator import MetricsCalculator
from analysis_engine.smell_detector import SmellDetector
from analysis_engine.hotspot_detector import HotspotDetector
from analysis_engine.health_index import HealthIndexCalculator
from refactor_engine.strategy_generator import RefactorStrategyGenerator
from compiler_service.executor import CodeExecutor
from ai_orchestrator.provider import AIOrchestrator

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="CodeAtlas AI", version="1.0.0")

# Create router with /api prefix
api_router = APIRouter(prefix="/api")

# Initialize services
metrics_calc = MetricsCalculator()
smell_detector = SmellDetector(complexity_threshold=int(os.environ.get('COMPLEXITY_THRESHOLD', 10)))
hotspot_detector = HotspotDetector()
health_calculator = HealthIndexCalculator()
refactor_generator = RefactorStrategyGenerator()
ai_orchestrator = AIOrchestrator()

# Language detection
def detect_language(filename: str) -> str:
    """Detect programming language from file extension"""
    ext_map = {
        '.py': 'python',
        '.js': 'javascript',
        '.jsx': 'javascript',
        '.ts': 'javascript',
        '.tsx': 'javascript',
        '.java': 'java',
        '.cpp': 'cpp',
        '.cc': 'cpp',
        '.cxx': 'cpp',
        '.c': 'cpp',
        '.h': 'cpp',
        '.hpp': 'cpp',
        '.go': 'go',
        '.rs': 'rust',
        '.sql': 'sql',
        '.sh': 'bash',
        '.bash': 'bash'
    }
    
    ext = Path(filename).suffix.lower()
    return ext_map.get(ext, 'unknown')

@api_router.get("/")
async def root():
    return {
        "message": "CodeAtlas AI API",
        "version": "1.0.0",
        "status": "operational"
    }

@api_router.get("/health")
async def health_check():
    ai_available = ai_orchestrator.is_available()
    return {
        "status": "healthy",
        "ai_enabled": ai_available,
        "ai_provider": os.environ.get('AI_PROVIDER', 'none')
    }

@api_router.post("/analyze")
async def analyze_code(request: AnalysisRequest):
    """Analyze single file or multiple files"""
    try:
        files_to_analyze = []
        
        # Single file
        if request.file_content and request.file_name:
            files_to_analyze.append({
                'filename': request.file_name,
                'code': request.file_content
            })
        
        # Multiple files
        elif request.files:
            for filename, content in request.files.items():
                files_to_analyze.append({
                    'filename': filename,
                    'code': content
                })
        
        if not files_to_analyze:
            raise HTTPException(status_code=400, detail="No files provided")
        
        # Analyze each file
        all_file_metrics = []
        all_smells = []
        total_loc = 0
        total_complexity = 0
        
        for file_data in files_to_analyze:
            filename = file_data['filename']
            code = file_data['code']
            language = detect_language(filename)
            
            if language == 'unknown':
                continue
            
            # Get adapter and analyze
            adapter = get_adapter(language, code, filename)
            ast_data = adapter.analyze(code)
            
            # Calculate metrics
            loc = metrics_calc.calculate_loc(code)
            complexity = metrics_calc.calculate_complexity(ast_data)
            
            # Detect smells
            file_data_with_code = {**file_data, 'code': code}
            smells = smell_detector.detect(file_data_with_code, ast_data)
            
            file_metrics = FileMetrics(
                filename=filename,
                language=language,
                loc=loc,
                functions=len(ast_data.get('functions', [])),
                classes=len(ast_data.get('classes', [])),
                complexity=complexity,
                nesting_depth=ast_data.get('nesting_depth', 0),
                smells=[s.type for s in smells]
            )
            
            all_file_metrics.append(file_metrics)
            all_smells.extend(smells)
            total_loc += loc
            total_complexity += complexity
        
        if not all_file_metrics:
            raise HTTPException(status_code=400, detail="No analyzable files found")
        
        # Calculate averages
        avg_complexity = total_complexity / len(all_file_metrics)
        
        # Detect hotspots
        hotspots = hotspot_detector.detect(all_file_metrics, all_smells)
        
        # Calculate health index
        health_index = health_calculator.calculate(
            all_file_metrics, all_smells, total_loc, avg_complexity
        )
        
        # Generate refactor strategies
        refactor_actions = refactor_generator.generate(hotspots, all_smells)
        
        # Create result
        result = AnalysisResult(
            project_name=request.project_name,
            health_index=health_index,
            total_files=len(all_file_metrics),
            total_loc=total_loc,
            avg_complexity=round(avg_complexity, 2),
            files=all_file_metrics,
            smells=all_smells,
            hotspots=hotspots,
            refactor_actions=refactor_actions
        )
        
        # Store in database
        doc = result.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        await db.analyses.insert_one(doc)
        
        return result
    
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
@api_router.post("/analyze/upload")
async def analyze_upload(file: UploadFile = File(...), project_name: str = "Uploaded Project"):
    """Analyze uploaded file or ZIP"""
    try:
        content = await file.read()
        files_dict = {}

        allowed_ext = (
            '.py', '.js', '.ts', '.java', '.cpp', '.c', '.go', '.rs', '.sql', '.sh'
        )

        ignore_folders = (
            'node_modules', 'venv', '__pycache__', '.git', 'dist', 'build'
        )

        # Check if ZIP
        if file.filename.endswith('.zip'):
            with zipfile.ZipFile(io.BytesIO(content)) as zf:
                for filename in zf.namelist():

                    # Skip folders
                    if filename.endswith('/'):
                        continue

                    # Skip heavy folders
                    if any(x in filename.lower() for x in ignore_folders):
                        continue

                    # Allow only source code files
                    if not filename.lower().endswith(allowed_ext):
                        continue

                    try:
                        raw = zf.read(filename)

                        try:
                            file_content = raw.decode('utf-8')
                        except:
                            file_content = str(raw)

                        if not isinstance(file_content, str):
                            file_content = str(file_content)

                        files_dict[filename] = file_content

                    except:
                        continue

        else:
            # Single file
            try:
                file_content = content.decode('utf-8')
                if not isinstance(file_content, str):
                    file_content = str(file_content)
                files_dict[file.filename] = file_content
            except:
                raise HTTPException(status_code=400, detail="Could not decode file")

        if not files_dict:
            raise HTTPException(status_code=400, detail="No valid source files found")

        # Create analysis request
        request = AnalysisRequest(
            project_name=project_name,
            files=files_dict
        )

        return await analyze_code(request)

    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Upload analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.get("/analyses")
async def get_analyses(limit: int = 10):
    """Get recent analyses"""
    try:
        analyses = await db.analyses.find({}, {"_id": 0}).sort("timestamp", -1).limit(limit).to_list(limit)
        return analyses
    except Exception as e:
        logging.error(f"Error fetching analyses: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/analyses/{analysis_id}")
async def get_analysis(analysis_id: str):
    """Get specific analysis"""
    try:
        analysis = await db.analyses.find_one({"id": analysis_id}, {"_id": 0})
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        return analysis
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error fetching analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/compile")
async def compile_code(request: CompilerRequest):
    """Execute code in specified language"""
    try:
        success, output, error, exec_time = CodeExecutor.execute(
            request.language,
            request.code,
            request.input_data or ""
        )
        
        return CompilerResponse(
            success=success,
            output=output,
            error=error,
            execution_time=round(exec_time, 3)
        )
    
    except Exception as e:
        logging.error(f"Compilation error: {str(e)}")
        return CompilerResponse(
            success=False,
            output="",
            error=str(e),
            execution_time=0.0
        )

@api_router.post("/ai-insights")
async def get_ai_insights(request: AIInsightRequest):
    """Get AI insights for analysis"""
    try:
        if not ai_orchestrator.is_available():
            return AIInsightResponse(
                available=False,
                insights=None,
                message="AI insights are currently disabled. Configure AI_PROVIDER in settings."
            )
        
        # Get analysis data
        analysis = await db.analyses.find_one({"id": request.analysis_id}, {"_id": 0})
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        # Prepare data for AI
        ai_data = {
            'health_index': analysis['health_index'],
            'total_files': analysis['total_files'],
            'avg_complexity': analysis['avg_complexity'],
            'smell_count': len(analysis['smells']),
            'hotspot_count': len(analysis['hotspots']),
            'risk_score': max([h['risk_score'] for h in analysis['hotspots']]) if analysis['hotspots'] else 0
        }
        
        insights = await ai_orchestrator.get_insights(ai_data, request.intent)
        
        return AIInsightResponse(
            available=True,
            insights=insights,
            message="AI insights generated successfully"
        )
    
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"AI insights error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# Include router
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()