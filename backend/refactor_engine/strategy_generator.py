from typing import List
from models.analysis import RefactorAction, Hotspot, CodeSmell

class RefactorStrategyGenerator:
    """Generate refactoring strategies based on analysis"""
    
    def generate(self, hotspots: List[Hotspot], smells: List[CodeSmell]) -> List[RefactorAction]:
        """Generate prioritized refactoring actions"""
        actions = []
        
        # Actions for critical hotspots
        for hotspot in hotspots:
            if hotspot.priority == "critical":
                actions.append(RefactorAction(
                    priority="critical",
                    action="Immediate Refactoring Required",
                    file=hotspot.file,
                    impact="high",
                    effort="high",
                    description=f"This file has a risk score of {hotspot.risk_score}. "
                                f"Break down complex logic, reduce nesting, and improve modularity."
                ))
        
        # Actions for high complexity
        high_complexity_smells = [s for s in smells if s.type == "High Complexity"]
        for smell in high_complexity_smells[:3]:  # Top 3
            actions.append(RefactorAction(
                priority="high",
                action="Reduce Cyclomatic Complexity",
                file=smell.file,
                impact="medium",
                effort="medium",
                description=smell.suggestion
            ))
        
        # Actions for deep nesting
        nesting_smells = [s for s in smells if s.type == "Deep Nesting"]
        for smell in nesting_smells[:2]:
            actions.append(RefactorAction(
                priority="high",
                action="Flatten Nested Code",
                file=smell.file,
                impact="medium",
                effort="low",
                description="Use guard clauses and extract methods to reduce nesting depth"
            ))
        
        # Actions for long functions
        long_func_smells = [s for s in smells if s.type == "Long Function"]
        for smell in long_func_smells[:2]:
            actions.append(RefactorAction(
                priority="medium",
                action="Split Long Functions",
                file=smell.file,
                impact="low",
                effort="low",
                description="Extract logical units into separate, well-named functions"
            ))
        
        # General improvements
        if len(smells) > 5:
            actions.append(RefactorAction(
                priority="medium",
                action="Address Code Smells",
                file="Multiple files",
                impact="medium",
                effort="medium",
                description=f"Review and fix {len(smells)} detected code smells across the codebase"
            ))
        
        return actions