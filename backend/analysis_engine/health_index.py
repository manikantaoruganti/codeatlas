# from typing import List
# from models.analysis import FileMetrics, CodeSmell, Hotspot

# class HealthIndexCalculator:
#     """Calculate Code Health Index (0-100)"""
    
#     def calculate(self, files: List[FileMetrics], smells: List[CodeSmell], 
#                   total_loc: int, avg_complexity: float) -> float:
#         """Calculate overall health score"""
        
#         # Start with perfect score
#         score = 100.0
        
#         # Penalty for complexity (max -30 points)
#         if avg_complexity > 10:
#             complexity_penalty = min((avg_complexity - 10) * 2, 30)
#             score -= complexity_penalty
        
#         # Penalty for code smells (max -40 points)
#         high_severity = len([s for s in smells if s.severity == 'high'])
#         medium_severity = len([s for s in smells if s.severity == 'medium'])
#         low_severity = len([s for s in smells if s.severity == 'low'])
        
#         smell_penalty = min(
#             (high_severity * 5) + (medium_severity * 3) + (low_severity * 1),
#             40
#         )
#         score -= smell_penalty
        
#         # Penalty for large files (max -15 points)
#         if total_loc > 1000:
#             size_penalty = min((total_loc - 1000) / 1000 * 5, 15)
#             score -= size_penalty
        
#         # Penalty for deep nesting (max -15 points)
#         max_nesting = max([f.nesting_depth for f in files]) if files else 0
#         if max_nesting > 4:
#             nesting_penalty = min((max_nesting - 4) * 3, 15)
#             score -= nesting_penalty
        
#         # Ensure score is between 0 and 100
#         return max(0.0, min(100.0, round(score, 2)))
from typing import List
from models.analysis import FileMetrics, CodeSmell, Hotspot


class HealthIndexCalculator:
    """Calculate Code Health Index (0-100)"""

    def _safe_list(self, value):
        if isinstance(value, list):
            return value
        return []

    def _safe_number(self, value, default=0):
        if isinstance(value, (int, float)):
            return value
        return default

    def calculate(self, files: List[FileMetrics], smells: List[CodeSmell],
                  total_loc: int, avg_complexity: float) -> float:

        # Safety conversions
        files = self._safe_list(files)
        smells = self._safe_list(smells)
        total_loc = self._safe_number(total_loc)
        avg_complexity = self._safe_number(avg_complexity)

        score = 100.0

        # Complexity penalty
        if avg_complexity > 10:
            complexity_penalty = min((avg_complexity - 10) * 2, 30)
            score -= complexity_penalty

        # Smell penalties
        high_severity = len([s for s in smells if getattr(s, "severity", "") == "high"])
        medium_severity = len([s for s in smells if getattr(s, "severity", "") == "medium"])
        low_severity = len([s for s in smells if getattr(s, "severity", "") == "low"])

        smell_penalty = min(
            (high_severity * 5) + (medium_severity * 3) + (low_severity * 1),
            40
        )
        score -= smell_penalty

        # Large file penalty
        if total_loc > 1000:
            size_penalty = min((total_loc - 1000) / 1000 * 5, 15)
            score -= size_penalty

        # Nesting penalty
        nesting_values = [getattr(f, "nesting_depth", 0) for f in files]
        max_nesting = max(nesting_values) if nesting_values else 0

        if max_nesting > 4:
            nesting_penalty = min((max_nesting - 4) * 3, 15)
            score -= nesting_penalty

        return max(0.0, min(100.0, round(score, 2)))
