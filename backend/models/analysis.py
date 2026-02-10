from pydantic import BaseModel, Field, ConfigDict
from typing import List, Dict, Optional
from datetime import datetime, timezone
import uuid

class FileMetrics(BaseModel):
    filename: str
    language: str
    loc: int
    functions: int
    classes: int
    complexity: float
    nesting_depth: int
    smells: List[str]

class CodeSmell(BaseModel):
    type: str
    severity: str
    file: str
    line: int
    message: str
    suggestion: str

class Hotspot(BaseModel):
    file: str
    risk_score: float
    complexity: float
    smells_count: int
    priority: str

class RefactorAction(BaseModel):
    priority: str
    action: str
    file: str
    impact: str
    effort: str
    description: str

class AnalysisResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    project_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    health_index: float
    total_files: int
    total_loc: int
    avg_complexity: float
    files: List[FileMetrics]
    smells: List[CodeSmell]
    hotspots: List[Hotspot]
    refactor_actions: List[RefactorAction]

class AnalysisRequest(BaseModel):
    project_name: str
    file_content: Optional[str] = None
    file_name: Optional[str] = None
    files: Optional[Dict[str, str]] = None

class CompilerRequest(BaseModel):
    language: str
    code: str
    input_data: Optional[str] = None

class CompilerResponse(BaseModel):
    success: bool
    output: str
    error: Optional[str] = None
    execution_time: float

class AIInsightRequest(BaseModel):
    analysis_id: str
    intent: str = "maintainability"

class AIInsightResponse(BaseModel):
    available: bool
    insights: Optional[str] = None
    message: str