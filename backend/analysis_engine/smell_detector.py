# from typing import List, Dict, Any
# from models.analysis import CodeSmell

# class SmellDetector:
#     """Detect code smells"""
    
#     def __init__(self, complexity_threshold: int = 10):
#         self.complexity_threshold = complexity_threshold
    
#     def detect(self, file_data: Dict[str, Any], ast_data: Dict[str, Any]) -> List[CodeSmell]:
#         """Detect all code smells in a file"""
#         smells = []
#         filename = file_data['filename']
#         code = file_data.get('code', '')
        
#         # Long function
#         smells.extend(self._detect_long_functions(filename, code, ast_data))
        
#         # Deep nesting
#         smells.extend(self._detect_deep_nesting(filename, ast_data))
        
#         # High complexity
#         smells.extend(self._detect_high_complexity(filename, ast_data))
        
#         # Large class
#         smells.extend(self._detect_large_class(filename, code, ast_data))
        
#         # Many parameters
#         smells.extend(self._detect_many_parameters(filename, code))
        
#         return smells
    
#     def _detect_long_functions(self, filename: str, code: str, ast_data: Dict) -> List[CodeSmell]:
#         """Detect functions that are too long"""
#         smells = []
#         functions = ast_data.get('functions', [])
        
#         lines = code.split('\n')
#         if len(lines) > 50 and functions:
#             smells.append(CodeSmell(
#                 type="Long Function",
#                 severity="medium",
#                 file=filename,
#                 line=1,
#                 message=f"File contains {len(lines)} lines with {len(functions)} functions",
#                 suggestion="Consider breaking down large functions into smaller, focused units"
#             ))
        
#         return smells
    
#     def _detect_deep_nesting(self, filename: str, ast_data: Dict) -> List[CodeSmell]:
#         """Detect deeply nested code"""
#         smells = []
#         nesting_depth = ast_data.get('nesting_depth', 0)
        
#         if nesting_depth > 4:
#             smells.append(CodeSmell(
#                 type="Deep Nesting",
#                 severity="high",
#                 file=filename,
#                 line=1,
#                 message=f"Maximum nesting depth of {nesting_depth} detected",
#                 suggestion="Refactor nested code into separate functions or use guard clauses"
#             ))
        
#         return smells
    
#     def _detect_high_complexity(self, filename: str, ast_data: Dict) -> List[CodeSmell]:
#         """Detect high cyclomatic complexity"""
#         smells = []
#         complexity = ast_data.get('complexity', 1)
        
#         if complexity > self.complexity_threshold:
#             smells.append(CodeSmell(
#                 type="High Complexity",
#                 severity="high",
#                 file=filename,
#                 line=1,
#                 message=f"Cyclomatic complexity of {complexity} exceeds threshold",
#                 suggestion="Simplify conditional logic and reduce branching"
#             ))
        
#         return smells
    
#     def _detect_large_class(self, filename: str, code: str, ast_data: Dict) -> List[CodeSmell]:
#         """Detect large classes"""
#         smells = []
#         classes = ast_data.get('classes', [])
#         functions = ast_data.get('functions', [])
        
#         if classes and len(functions) > 10:
#             smells.append(CodeSmell(
#                 type="Large Class",
#                 severity="medium",
#                 file=filename,
#                 line=1,
#                 message=f"Class contains {len(functions)} methods",
#                 suggestion="Consider splitting into multiple focused classes"
#             ))
        
#         return smells
    
#     def _detect_many_parameters(self, filename: str, code: str) -> List[CodeSmell]:
#         """Detect functions with too many parameters"""
#         smells = []
#         import re
        
#         # Find function definitions with parameters
#         patterns = re.findall(r'def\s+\w+\s*\((.*?)\)|function\s+\w+\s*\((.*?)\)', code)
        
#         for params in patterns:
#             param_str = params[0] if params[0] else params[1] if len(params) > 1 else ''
#             if param_str:
#                 count = len([p for p in param_str.split(',') if p.strip()])
#                 if count > 5:
#                     smells.append(CodeSmell(
#                         type="Too Many Parameters",
#                         severity="low",
#                         file=filename,
#                         line=1,
#                         message=f"Function has {count} parameters",
#                         suggestion="Consider using parameter objects or builder pattern"
#                     ))
        
#         return smells
from typing import List, Dict, Any
from models.analysis import CodeSmell
import re


class SmellDetector:
    """Detect code smells (safe version)"""

    def __init__(self, complexity_threshold: int = 10):
        self.complexity_threshold = complexity_threshold

    def _ensure_string(self, value):
        if value is None:
            return ""
        if not isinstance(value, str):
            return str(value)
        return value

    def _ensure_list(self, value):
        if isinstance(value, list):
            return value
        return []

    def _ensure_number(self, value, default=0):
        if isinstance(value, (int, float)):
            return value
        return default

    def detect(self, file_data: Dict[str, Any], ast_data: Dict[str, Any]) -> List[CodeSmell]:

        smells = []

        filename = file_data.get('filename', 'unknown')

        code = self._ensure_string(file_data.get('code', ''))
        ast_data = ast_data if isinstance(ast_data, dict) else {}

        smells.extend(self._detect_long_functions(filename, code, ast_data))
        smells.extend(self._detect_deep_nesting(filename, ast_data))
        smells.extend(self._detect_high_complexity(filename, ast_data))
        smells.extend(self._detect_large_class(filename, code, ast_data))
        smells.extend(self._detect_many_parameters(filename, code))

        return smells

    def _detect_long_functions(self, filename: str, code: str, ast_data: Dict) -> List[CodeSmell]:
        smells = []

        functions = self._ensure_list(ast_data.get('functions', []))
        lines = code.split('\n')

        if len(lines) > 50 and functions:
            smells.append(CodeSmell(
                type="Long Function",
                severity="medium",
                file=filename,
                line=1,
                message=f"File contains {len(lines)} lines with {len(functions)} functions",
                suggestion="Consider breaking down large functions"
            ))

        return smells

    def _detect_deep_nesting(self, filename: str, ast_data: Dict) -> List[CodeSmell]:
        smells = []

        nesting_depth = self._ensure_number(ast_data.get('nesting_depth', 0))

        if nesting_depth > 4:
            smells.append(CodeSmell(
                type="Deep Nesting",
                severity="high",
                file=filename,
                line=1,
                message=f"Nesting depth {nesting_depth}",
                suggestion="Refactor nested logic"
            ))

        return smells

    def _detect_high_complexity(self, filename: str, ast_data: Dict) -> List[CodeSmell]:
        smells = []

        complexity = self._ensure_number(ast_data.get('complexity', 1))

        if complexity > self.complexity_threshold:
            smells.append(CodeSmell(
                type="High Complexity",
                severity="high",
                file=filename,
                line=1,
                message=f"Complexity {complexity}",
                suggestion="Reduce branching"
            ))

        return smells

    def _detect_large_class(self, filename: str, code: str, ast_data: Dict) -> List[CodeSmell]:
        smells = []

        classes = self._ensure_list(ast_data.get('classes', []))
        functions = self._ensure_list(ast_data.get('functions', []))

        if classes and len(functions) > 10:
            smells.append(CodeSmell(
                type="Large Class",
                severity="medium",
                file=filename,
                line=1,
                message=f"{len(functions)} methods",
                suggestion="Split into smaller classes"
            ))

        return smells

    def _detect_many_parameters(self, filename: str, code: str) -> List[CodeSmell]:
        smells = []

        patterns = re.findall(r'def\s+\w+\s*\((.*?)\)|function\s+\w+\s*\((.*?)\)', code)

        for params in patterns:
            param_str = params[0] if params[0] else params[1] if len(params) > 1 else ''
            if param_str:
                count = len([p for p in param_str.split(',') if p.strip()])
                if count > 5:
                    smells.append(CodeSmell(
                        type="Too Many Parameters",
                        severity="low",
                        file=filename,
                        line=1,
                        message=f"{count} parameters",
                        suggestion="Use parameter objects"
                    ))

        return smells
