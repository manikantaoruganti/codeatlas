# from typing import Dict, Any, List
# import re

# class MetricsCalculator:
#     """Calculate code metrics"""
    
#     @staticmethod
#     def calculate_loc(code: str) -> int:
#         """Calculate lines of code (excluding blanks and comments)"""
#         lines = code.split('\n')
#         loc = 0
#         in_multiline_comment = False
        
#         for line in lines:
#             stripped = line.strip()
            
#             # Handle multiline comments
#             if '"""' in stripped or "'''" in stripped:
#                 in_multiline_comment = not in_multiline_comment
#                 continue
            
#             if in_multiline_comment:
#                 continue
            
#             # Skip empty lines and comments
#             if stripped and not stripped.startswith('#') and not stripped.startswith('//'):
#                 loc += 1
        
#         return loc
    
#     @staticmethod
#     def calculate_complexity(ast_data: Dict[str, Any]) -> float:
#         """Calculate cyclomatic complexity"""
#         return float(ast_data.get('complexity', 1))
    
#     @staticmethod
#     def calculate_function_length(code: str, language: str) -> List[int]:
#         """Calculate length of each function"""
#         lengths = []
        
#         if language == 'python':
#             lines = code.split('\n')
#             in_function = False
#             func_length = 0
            
#             for line in lines:
#                 if line.strip().startswith('def '):
#                     if in_function and func_length > 0:
#                         lengths.append(func_length)
#                     in_function = True
#                     func_length = 1
#                 elif in_function:
#                     if line.strip() and not line[0].isspace():
#                         lengths.append(func_length)
#                         in_function = False
#                         func_length = 0
#                     else:
#                         func_length += 1
            
#             if in_function and func_length > 0:
#                 lengths.append(func_length)
        
#         return lengths or [0]
    
#     @staticmethod
#     def calculate_parameter_count(code: str, language: str) -> List[int]:
#         """Count parameters in function definitions"""
#         param_counts = []
        
#         if language == 'python':
#             patterns = re.findall(r'def\s+\w+\s*\((.*?)\)', code)
#             for params in patterns:
#                 if params.strip():
#                     count = len([p for p in params.split(',') if p.strip()])
#                     param_counts.append(count)
#         elif language in ['javascript', 'java', 'cpp']:
#             patterns = re.findall(r'\w+\s*\((.*?)\)\s*{', code)
#             for params in patterns:
#                 if params.strip():
#                     count = len([p for p in params.split(',') if p.strip()])
#                     param_counts.append(count)
        
#         return param_counts or [0]
    
#     @staticmethod
#     def detect_duplication(files: List[Dict[str, Any]]) -> int:
#         """Simple duplication detection"""
#         # Simple heuristic: check for repeated code blocks
#         all_code = '\n'.join([f.get('code', '') for f in files])
#         lines = [l.strip() for l in all_code.split('\n') if l.strip()]
        
#         duplicates = 0
#         seen = set()
#         for line in lines:
#             if len(line) > 20:  # Only check substantial lines
#                 if line in seen:
#                     duplicates += 1
#                 seen.add(line)
        
#         return duplicates
from typing import Dict, Any, List
import re


class MetricsCalculator:
    """Calculate code metrics (safe version)"""

    @staticmethod
    def _ensure_string(code):
        if code is None:
            return ""
        if not isinstance(code, str):
            return str(code)
        return code

    @staticmethod
    def calculate_loc(code: str) -> int:
        code = MetricsCalculator._ensure_string(code)

        lines = code.split('\n')
        loc = 0
        in_multiline_comment = False

        for line in lines:
            stripped = line.strip()

            if '"""' in stripped or "'''" in stripped:
                in_multiline_comment = not in_multiline_comment
                continue

            if in_multiline_comment:
                continue

            if stripped and not stripped.startswith('#') and not stripped.startswith('//'):
                loc += 1

        return loc

    @staticmethod
    def calculate_complexity(ast_data: Dict[str, Any]) -> float:
        if not isinstance(ast_data, dict):
            return 1.0
        return float(ast_data.get('complexity', 1))

    @staticmethod
    def calculate_function_length(code: str, language: str) -> List[int]:
        code = MetricsCalculator._ensure_string(code)
        lengths = []

        if language == 'python':
            lines = code.split('\n')
            in_function = False
            func_length = 0

            for line in lines:
                if line.strip().startswith('def '):
                    if in_function and func_length > 0:
                        lengths.append(func_length)
                    in_function = True
                    func_length = 1
                elif in_function:
                    if line.strip() and not line.startswith(' '):
                        lengths.append(func_length)
                        in_function = False
                        func_length = 0
                    else:
                        func_length += 1

            if in_function and func_length > 0:
                lengths.append(func_length)

        return lengths if lengths else [0]

    @staticmethod
    def calculate_parameter_count(code: str, language: str) -> List[int]:
        code = MetricsCalculator._ensure_string(code)
        param_counts = []

        if language == 'python':
            patterns = re.findall(r'def\s+\w+\s*\((.*?)\)', code)
            for params in patterns:
                if params.strip():
                    count = len([p for p in params.split(',') if p.strip()])
                    param_counts.append(count)

        elif language in ['javascript', 'java', 'cpp']:
            patterns = re.findall(r'\w+\s*\((.*?)\)\s*{', code)
            for params in patterns:
                if params.strip():
                    count = len([p for p in params.split(',') if p.strip()])
                    param_counts.append(count)

        return param_counts if param_counts else [0]

    @staticmethod
    def detect_duplication(files: List[Dict[str, Any]]) -> int:
        if not isinstance(files, list):
            return 0

        all_code = '\n'.join([str(f.get('code', '')) for f in files if isinstance(f, dict)])
        lines = [l.strip() for l in all_code.split('\n') if l.strip()]

        duplicates = 0
        seen = set()
        for line in lines:
            if len(line) > 20:
                if line in seen:
                    duplicates += 1
                seen.add(line)

        return duplicates
