# import subprocess
# import tempfile
# import os
# import time
# from typing import Tuple

# class CodeExecutor:
#     """Safe code execution for multiple languages"""
    
#     TIMEOUT = 5  # seconds
    
#     @staticmethod
#     def execute(language: str, code: str, input_data: str = "") -> Tuple[bool, str, str, float]:
#         """Execute code safely and return results"""
        
#         executors = {
#             'python': CodeExecutor._execute_python,
#             'javascript': CodeExecutor._execute_javascript,
#             'java': CodeExecutor._execute_java,
#             'cpp': CodeExecutor._execute_cpp,
#             'c++': CodeExecutor._execute_cpp,
#             'go': CodeExecutor._execute_go,
#             'rust': CodeExecutor._execute_rust,
#             'bash': CodeExecutor._execute_bash,
#             'shell': CodeExecutor._execute_bash
#         }
        
#         executor = executors.get(language.lower())
#         if not executor:
#             return False, "", f"Unsupported language: {language}", 0.0
        
#         return executor(code, input_data)
    
#     @staticmethod
#     def _execute_python(code: str, input_data: str) -> Tuple[bool, str, str, float]:
#         """Execute Python code"""
#         try:
#             with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
#                 f.write(code)
#                 temp_file = f.name
            
#             start = time.time()
#             result = subprocess.run(
#                 ['python3', temp_file],
#                 input=input_data,
#                 capture_output=True,
#                 text=True,
#                 timeout=CodeExecutor.TIMEOUT
#             )
#             execution_time = time.time() - start
            
#             os.unlink(temp_file)
            
#             if result.returncode == 0:
#                 return True, result.stdout, "", execution_time
#             else:
#                 return False, result.stdout, result.stderr, execution_time
#         except subprocess.TimeoutExpired:
#             return False, "", "Execution timeout exceeded", CodeExecutor.TIMEOUT
#         except Exception as e:
#             return False, "", str(e), 0.0
    
#     @staticmethod
#     def _execute_javascript(code: str, input_data: str) -> Tuple[bool, str, str, float]:
#         """Execute JavaScript code using Node.js"""
#         try:
#             with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
#                 f.write(code)
#                 temp_file = f.name
            
#             start = time.time()
#             result = subprocess.run(
#                 ['node', temp_file],
#                 input=input_data,
#                 capture_output=True,
#                 text=True,
#                 timeout=CodeExecutor.TIMEOUT
#             )
#             execution_time = time.time() - start
            
#             os.unlink(temp_file)
            
#             if result.returncode == 0:
#                 return True, result.stdout, "", execution_time
#             else:
#                 return False, result.stdout, result.stderr, execution_time
#         except subprocess.TimeoutExpired:
#             return False, "", "Execution timeout exceeded", CodeExecutor.TIMEOUT
#         except Exception as e:
#             return False, "", str(e), 0.0
    
#     @staticmethod
#     def _execute_java(code: str, input_data: str) -> Tuple[bool, str, str, float]:
#         """Execute Java code"""
#         return False, "", "Java execution requires JDK installation", 0.0
    
#     @staticmethod
#     def _execute_cpp(code: str, input_data: str) -> Tuple[bool, str, str, float]:
#         """Execute C++ code"""
#         return False, "", "C++ execution requires g++ compiler", 0.0
    
#     @staticmethod
#     def _execute_go(code: str, input_data: str) -> Tuple[bool, str, str, float]:
#         """Execute Go code"""
#         try:
#             with tempfile.NamedTemporaryFile(mode='w', suffix='.go', delete=False) as f:
#                 f.write(code)
#                 temp_file = f.name
            
#             start = time.time()
#             result = subprocess.run(
#                 ['go', 'run', temp_file],
#                 input=input_data,
#                 capture_output=True,
#                 text=True,
#                 timeout=CodeExecutor.TIMEOUT
#             )
#             execution_time = time.time() - start
            
#             os.unlink(temp_file)
            
#             if result.returncode == 0:
#                 return True, result.stdout, "", execution_time
#             else:
#                 return False, result.stdout, result.stderr, execution_time
#         except subprocess.TimeoutExpired:
#             return False, "", "Execution timeout exceeded", CodeExecutor.TIMEOUT
#         except FileNotFoundError:
#             return False, "", "Go compiler not found", 0.0
#         except Exception as e:
#             return False, "", str(e), 0.0
    
#     @staticmethod
#     def _execute_rust(code: str, input_data: str) -> Tuple[bool, str, str, float]:
#         """Execute Rust code"""
#         return False, "", "Rust execution requires rustc compiler", 0.0
    
#     @staticmethod
#     def _execute_bash(code: str, input_data: str) -> Tuple[bool, str, str, float]:
#         """Execute Bash script"""
#         try:
#             start = time.time()
#             result = subprocess.run(
#                 ['bash', '-c', code],
#                 input=input_data,
#                 capture_output=True,
#                 text=True,
#                 timeout=CodeExecutor.TIMEOUT
#             )
#             execution_time = time.time() - start
            
#             if result.returncode == 0:
#                 return True, result.stdout, "", execution_time
#             else:
#                 return False, result.stdout, result.stderr, execution_time
#         except subprocess.TimeoutExpired:
#             return False, "", "Execution timeout exceeded", CodeExecutor.TIMEOUT
#         except Exception as e:
#             return False, "", str(e), 0.0
# import subprocess
# import tempfile
# import os
# import time
# from typing import Tuple


# class CodeExecutor:
#     """Safe code execution for multiple languages"""

#     TIMEOUT = 5

#     @staticmethod
#     def execute(language: str, code: str, input_data: str = "") -> Tuple[bool, str, str, float]:

#         executors = {
#             "python": CodeExecutor._execute_python,
#             "javascript": CodeExecutor._execute_javascript,
#             "java": CodeExecutor._execute_java,
#             "cpp": CodeExecutor._execute_cpp,
#             "c++": CodeExecutor._execute_cpp,
#             "go": CodeExecutor._execute_go,
#             "rust": CodeExecutor._execute_rust,
#             "bash": CodeExecutor._execute_bash,
#             "shell": CodeExecutor._execute_bash
#         }

#         executor = executors.get(language.lower())

#         if not executor:
#             return False, "", f"Unsupported language: {language}", 0.0

#         return executor(code, input_data)

#     # ---------------- PYTHON ----------------

#     @staticmethod
#     def _execute_python(code, input_data):
#         try:
#             with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
#                 f.write(code)
#                 path = f.name

#             start = time.time()

#             result = subprocess.run(
#                 ["python3", path],
#                 input=input_data,
#                 capture_output=True,
#                 text=True,
#                 timeout=CodeExecutor.TIMEOUT
#             )

#             os.unlink(path)
#             exec_time = time.time() - start

#             return result.returncode == 0, result.stdout, result.stderr, exec_time

#         except Exception as e:
#             return False, "", str(e), 0.0

#     # ---------------- JAVASCRIPT ----------------

#     @staticmethod
#     def _execute_javascript(code, input_data):
#         try:
#             with tempfile.NamedTemporaryFile(mode="w", suffix=".js", delete=False) as f:
#                 f.write(code)
#                 path = f.name

#             start = time.time()

#             result = subprocess.run(
#                 ["node", path],
#                 input=input_data,
#                 capture_output=True,
#                 text=True,
#                 timeout=CodeExecutor.TIMEOUT
#             )

#             os.unlink(path)
#             exec_time = time.time() - start

#             return result.returncode == 0, result.stdout, result.stderr, exec_time

#         except Exception as e:
#             return False, "", str(e), 0.0

#     # ---------------- JAVA ----------------

#     @staticmethod
#     def _execute_java(code, input_data):
#         try:
#             with tempfile.TemporaryDirectory() as temp_dir:

#                 file_path = os.path.join(temp_dir, "Main.java")

#                 with open(file_path, "w") as f:
#                     f.write(code)

#                 compile_proc = subprocess.run(
#                     ["javac", file_path],
#                     capture_output=True,
#                     text=True
#                 )

#                 if compile_proc.returncode != 0:
#                     return False, "", compile_proc.stderr, 0.0

#                 start = time.time()

#                 run_proc = subprocess.run(
#                     ["java", "-cp", temp_dir, "Main"],
#                     input=input_data,
#                     capture_output=True,
#                     text=True,
#                     timeout=CodeExecutor.TIMEOUT
#                 )

#                 exec_time = time.time() - start

#                 return run_proc.returncode == 0, run_proc.stdout, run_proc.stderr, exec_time

#         except FileNotFoundError:
#             return False, "", "Java compiler not installed", 0.0
#         except Exception as e:
#             return False, "", str(e), 0.0

#     # ---------------- C++ ----------------

#     @staticmethod
#     def _execute_cpp(code, input_data):
#         try:
#             with tempfile.TemporaryDirectory() as temp_dir:

#                 src = os.path.join(temp_dir, "main.cpp")
#                 binary = os.path.join(temp_dir, "a.out")

#                 with open(src, "w") as f:
#                     f.write(code)

#                 compile_proc = subprocess.run(
#                     ["g++", src, "-o", binary],
#                     capture_output=True,
#                     text=True
#                 )

#                 if compile_proc.returncode != 0:
#                     return False, "", compile_proc.stderr, 0.0

#                 start = time.time()

#                 run_proc = subprocess.run(
#                     [binary],
#                     input=input_data,
#                     capture_output=True,
#                     text=True,
#                     timeout=CodeExecutor.TIMEOUT
#                 )

#                 exec_time = time.time() - start

#                 return run_proc.returncode == 0, run_proc.stdout, run_proc.stderr, exec_time

#         except FileNotFoundError:
#             return False, "", "g++ compiler not installed", 0.0
#         except Exception as e:
#             return False, "", str(e), 0.0

#     # ---------------- GO ----------------

#     @staticmethod
#     def _execute_go(code, input_data):
#         try:
#             with tempfile.NamedTemporaryFile(mode="w", suffix=".go", delete=False) as f:
#                 f.write(code)
#                 path = f.name

#             start = time.time()

#             result = subprocess.run(
#                 ["go", "run", path],
#                 input=input_data,
#                 capture_output=True,
#                 text=True,
#                 timeout=CodeExecutor.TIMEOUT
#             )

#             os.unlink(path)

#             exec_time = time.time() - start

#             return result.returncode == 0, result.stdout, result.stderr, exec_time

#         except FileNotFoundError:
#             return False, "", "Go compiler not installed", 0.0
#         except Exception as e:
#             return False, "", str(e), 0.0

#     # ---------------- RUST ----------------

#     @staticmethod
#     def _execute_rust(code, input_data):
#         try:
#             with tempfile.TemporaryDirectory() as temp_dir:

#                 src = os.path.join(temp_dir, "main.rs")
#                 binary = os.path.join(temp_dir, "main")

#                 with open(src, "w") as f:
#                     f.write(code)

#                 compile_proc = subprocess.run(
#                     ["rustc", src, "-o", binary],
#                     capture_output=True,
#                     text=True
#                 )

#                 if compile_proc.returncode != 0:
#                     return False, "", compile_proc.stderr, 0.0

#                 start = time.time()

#                 run_proc = subprocess.run(
#                     [binary],
#                     input=input_data,
#                     capture_output=True,
#                     text=True,
#                     timeout=CodeExecutor.TIMEOUT
#                 )

#                 exec_time = time.time() - start

#                 return run_proc.returncode == 0, run_proc.stdout, run_proc.stderr, exec_time

#         except FileNotFoundError:
#             return False, "", "Rust compiler not installed", 0.0
#         except Exception as e:
#             return False, "", str(e), 0.0

#     # ---------------- BASH ----------------

#     @staticmethod
#     def _execute_bash(code, input_data):
#         try:
#             start = time.time()

#             result = subprocess.run(
#                 ["bash", "-c", code],
#                 input=input_data,
#                 capture_output=True,
#                 text=True,
#                 timeout=CodeExecutor.TIMEOUT
#             )

#             exec_time = time.time() - start

#             return result.returncode == 0, result.stdout, result.stderr, exec_time

#         except Exception as e:
#             return False, "", str(e), 0.0
import requests
import time
from typing import Tuple



class CodeExecutor:

    @staticmethod
    def execute(language: str, code: str, input_data: str = "") -> Tuple[bool, str, str, float]:

        language_map = {
            "python": "python",
            "javascript": "javascript",
            "typescript": "typescript",
            "cpp": "cpp",
            "c": "c",
            "java": "java",
            "go": "go",
            "rust": "rust",
            "csharp": "csharp",
            "kotlin": "kotlin",
            "swift": "swift",
            "ruby": "ruby",
            "php": "php",
            "r": "r",
            "scala": "scala",
            "bash": "bash",
            "sql": "mysql"
        }

        try:

            start = time.time()

            url = "https://onecompiler-apis.p.rapidapi.com/api/v1/run"

            payload = {
                "language": language_map.get(language.lower(), language),
                "stdin": input_data,
                "files": [
                    {
                        "name": "main",
                        "content": code
                    }
                ]
            }

            headers = {
                "content-type": "application/json",
                "X-RapidAPI-Key": RAPIDAPI_KEY,
                "X-RapidAPI-Host": "onecompiler-apis.p.rapidapi.com"
            }

            response = requests.post(url, json=payload, headers=headers)

            data = response.json()

            exec_time = time.time() - start

            return True, data.get("stdout", ""), data.get("stderr", ""), exec_time

        except Exception as e:
            return False, "", str(e), 0.0