# from typing import List, Dict, Any
# from models.analysis import Hotspot, FileMetrics, CodeSmell

# class HotspotDetector:
#     """Identify risky code hotspots"""
    
#     def detect(self, files: List[FileMetrics], smells: List[CodeSmell]) -> List[Hotspot]:
#         """Calculate risk scores and identify hotspots"""
#         hotspots = []
        
#         for file_metrics in files:
#             # Calculate risk score based on multiple factors
#             complexity_score = min(file_metrics.complexity / 20.0, 1.0) * 40
#             smell_score = min(len([s for s in smells if s.file == file_metrics.filename]) / 5.0, 1.0) * 30
#             size_score = min(file_metrics.loc / 500.0, 1.0) * 20
#             nesting_score = min(file_metrics.nesting_depth / 6.0, 1.0) * 10
            
#             risk_score = complexity_score + smell_score + size_score + nesting_score
            
#             # Determine priority
#             if risk_score >= 70:
#                 priority = "critical"
#             elif risk_score >= 50:
#                 priority = "high"
#             elif risk_score >= 30:
#                 priority = "medium"
#             else:
#                 priority = "low"
            
#             hotspots.append(Hotspot(
#                 file=file_metrics.filename,
#                 risk_score=round(risk_score, 2),
#                 complexity=file_metrics.complexity,
#                 smells_count=len([s for s in smells if s.file == file_metrics.filename]),
#                 priority=priority
#             ))
        
#         # Sort by risk score
#         hotspots.sort(key=lambda x: x.risk_score, reverse=True)
        
#         return hotspots
from typing import List
from models.analysis import Hotspot, FileMetrics, CodeSmell


class HotspotDetector:
    """Identify risky code hotspots (safe version)"""

    def _safe_list(self, value):
        if isinstance(value, list):
            return value
        return []

    def _safe_number(self, value, default=0):
        if isinstance(value, (int, float)):
            return value
        return default

    def detect(self, files: List[FileMetrics], smells: List[CodeSmell]) -> List[Hotspot]:
        hotspots = []

        files = self._safe_list(files)
        smells = self._safe_list(smells)

        for file_metrics in files:

            complexity = self._safe_number(getattr(file_metrics, "complexity", 0))
            loc = self._safe_number(getattr(file_metrics, "loc", 0))
            nesting = self._safe_number(getattr(file_metrics, "nesting_depth", 0))
            filename = getattr(file_metrics, "filename", "unknown")

            # Risk score components
            complexity_score = min(complexity / 20.0, 1.0) * 40

            smell_count = len([
                s for s in smells
                if getattr(s, "file", "") == filename
            ])
            smell_score = min(smell_count / 5.0, 1.0) * 30

            size_score = min(loc / 500.0, 1.0) * 20
            nesting_score = min(nesting / 6.0, 1.0) * 10

            risk_score = complexity_score + smell_score + size_score + nesting_score

            # Priority
            if risk_score >= 70:
                priority = "critical"
            elif risk_score >= 50:
                priority = "high"
            elif risk_score >= 30:
                priority = "medium"
            else:
                priority = "low"

            hotspots.append(Hotspot(
                file=filename,
                risk_score=round(risk_score, 2),
                complexity=complexity,
                smells_count=smell_count,
                priority=priority
            ))

        hotspots.sort(key=lambda x: getattr(x, "risk_score", 0), reverse=True)

        return hotspots
