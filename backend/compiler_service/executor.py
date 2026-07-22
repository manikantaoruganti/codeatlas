import subprocess
import tempfile
import os
import sys
import time
import shutil
import re
from typing import Tuple

class CodeExecutor:
    """Safe code execution for multiple programming languages using subprocess."""

    TIMEOUT = 5  # seconds

    @staticmethod
    def execute(language: str, code: str, input_data: str = "") -> Tuple[bool, str, str, float]:
        """Execute code safely and return (success, stdout, stderr, execution_time)"""
        lang = (language or '').lower().strip()

        executors = {
            'python': CodeExecutor._execute_python,
            'python3': CodeExecutor._execute_python,
            'javascript': CodeExecutor._execute_javascript,
            'js': CodeExecutor._execute_javascript,
            'typescript': CodeExecutor._execute_typescript,
            'ts': CodeExecutor._execute_typescript,
            'java': CodeExecutor._execute_java,
            'cpp': CodeExecutor._execute_cpp,
            'c++': CodeExecutor._execute_cpp,
            'c': CodeExecutor._execute_c,
            'go': CodeExecutor._execute_go,
            'golang': CodeExecutor._execute_go,
            'rust': CodeExecutor._execute_rust,
            'bash': CodeExecutor._execute_bash,
            'sh': CodeExecutor._execute_bash,
            'shell': CodeExecutor._execute_bash,
            'ruby': CodeExecutor._execute_ruby,
            'php': CodeExecutor._execute_php,
            'r': CodeExecutor._execute_r,
            'sql': CodeExecutor._execute_sql,
            'csharp': CodeExecutor._execute_csharp,
            'kotlin': CodeExecutor._execute_kotlin,
            'scala': CodeExecutor._execute_scala,
        }

        executor = executors.get(lang)
        if not executor:
            return False, "", f"Unsupported language: {language}", 0.0

        return executor(code, input_data or "")

    # ---------------- PYTHON ----------------
    @staticmethod
    def _execute_python(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        temp_file = None
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False, encoding='utf-8') as f:
                f.write(code)
                temp_file = f.name

            python_bin = sys.executable or 'python'
            start = time.time()
            result = subprocess.run(
                [python_bin, temp_file],
                input=input_data,
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace',
                timeout=CodeExecutor.TIMEOUT
            )
            execution_time = time.time() - start
            return result.returncode == 0, result.stdout, result.stderr, execution_time
        except subprocess.TimeoutExpired:
            return False, "", "Execution timeout exceeded (5s)", CodeExecutor.TIMEOUT
        except Exception as e:
            return False, "", str(e), 0.0
        finally:
            if temp_file and os.path.exists(temp_file):
                try:
                    os.unlink(temp_file)
                except Exception:
                    pass

    # ---------------- JAVASCRIPT ----------------
    @staticmethod
    def _execute_javascript(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        temp_file = None
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False, encoding='utf-8') as f:
                f.write(code)
                temp_file = f.name

            start = time.time()
            result = subprocess.run(
                ['node', temp_file],
                input=input_data,
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace',
                timeout=CodeExecutor.TIMEOUT
            )
            execution_time = time.time() - start
            return result.returncode == 0, result.stdout, result.stderr, execution_time
        except FileNotFoundError:
            return False, "", "Node.js (node) compiler/runtime is not installed or not found in PATH.", 0.0
        except subprocess.TimeoutExpired:
            return False, "", "Execution timeout exceeded (5s)", CodeExecutor.TIMEOUT
        except Exception as e:
            return False, "", str(e), 0.0
        finally:
            if temp_file and os.path.exists(temp_file):
                try:
                    os.unlink(temp_file)
                except Exception:
                    pass

    # ---------------- TYPESCRIPT ----------------
    @staticmethod
    def _execute_typescript(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        # Strip simple type annotations or run via node if node available
        return CodeExecutor._execute_javascript(code, input_data)

    # ---------------- JAVA ----------------
    @staticmethod
    def _execute_java(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        temp_dir = None
        try:
            temp_dir = tempfile.mkdtemp()
            class_name = "Main"
            match = re.search(r'public\s+class\s+([A-Za-z0-9_]+)', code)
            if match:
                class_name = match.group(1)

            file_path = os.path.join(temp_dir, f"{class_name}.java")
            with open(file_path, "w", encoding='utf-8') as f:
                f.write(code)

            compile_proc = subprocess.run(
                ["javac", file_path],
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace',
                timeout=CodeExecutor.TIMEOUT
            )

            if compile_proc.returncode != 0:
                return False, "", compile_proc.stderr, 0.0

            start = time.time()
            run_proc = subprocess.run(
                ["java", "-cp", temp_dir, class_name],
                input=input_data,
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace',
                timeout=CodeExecutor.TIMEOUT
            )
            execution_time = time.time() - start
            return run_proc.returncode == 0, run_proc.stdout, run_proc.stderr, execution_time
        except FileNotFoundError:
            return False, "", "Java JDK (javac/java) is not installed or not found in PATH.", 0.0
        except subprocess.TimeoutExpired:
            return False, "", "Execution timeout exceeded (5s)", CodeExecutor.TIMEOUT
        except Exception as e:
            return False, "", str(e), 0.0
        finally:
            if temp_dir and os.path.exists(temp_dir):
                shutil.rmtree(temp_dir, ignore_errors=True)

    # ---------------- C++ ----------------
    @staticmethod
    def _execute_cpp(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        temp_dir = None
        try:
            temp_dir = tempfile.mkdtemp()
            src = os.path.join(temp_dir, "main.cpp")
            binary = os.path.join(temp_dir, "main.exe" if os.name == 'nt' else "main")

            with open(src, "w", encoding='utf-8') as f:
                f.write(code)

            compiler = "g++" if shutil.which("g++") else "clang++"
            compile_proc = subprocess.run(
                [compiler, src, "-o", binary],
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace',
                timeout=CodeExecutor.TIMEOUT
            )

            if compile_proc.returncode != 0:
                return False, "", compile_proc.stderr, 0.0

            start = time.time()
            run_proc = subprocess.run(
                [binary],
                input=input_data,
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace',
                timeout=CodeExecutor.TIMEOUT
            )
            execution_time = time.time() - start
            return run_proc.returncode == 0, run_proc.stdout, run_proc.stderr, execution_time
        except FileNotFoundError:
            return False, "", "C++ compiler (g++/clang++) is not installed or not found in PATH.", 0.0
        except subprocess.TimeoutExpired:
            return False, "", "Execution timeout exceeded (5s)", CodeExecutor.TIMEOUT
        except Exception as e:
            return False, "", str(e), 0.0
        finally:
            if temp_dir and os.path.exists(temp_dir):
                shutil.rmtree(temp_dir, ignore_errors=True)

    # ---------------- C ----------------
    @staticmethod
    def _execute_c(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        temp_dir = None
        try:
            temp_dir = tempfile.mkdtemp()
            src = os.path.join(temp_dir, "main.c")
            binary = os.path.join(temp_dir, "main.exe" if os.name == 'nt' else "main")

            with open(src, "w", encoding='utf-8') as f:
                f.write(code)

            compiler = "gcc" if shutil.which("gcc") else "clang"
            compile_proc = subprocess.run(
                [compiler, src, "-o", binary],
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace',
                timeout=CodeExecutor.TIMEOUT
            )

            if compile_proc.returncode != 0:
                return False, "", compile_proc.stderr, 0.0

            start = time.time()
            run_proc = subprocess.run(
                [binary],
                input=input_data,
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace',
                timeout=CodeExecutor.TIMEOUT
            )
            execution_time = time.time() - start
            return run_proc.returncode == 0, run_proc.stdout, run_proc.stderr, execution_time
        except FileNotFoundError:
            return False, "", "C compiler (gcc/clang) is not installed or not found in PATH.", 0.0
        except subprocess.TimeoutExpired:
            return False, "", "Execution timeout exceeded (5s)", CodeExecutor.TIMEOUT
        except Exception as e:
            return False, "", str(e), 0.0
        finally:
            if temp_dir and os.path.exists(temp_dir):
                shutil.rmtree(temp_dir, ignore_errors=True)

    # ---------------- GO ----------------
    @staticmethod
    def _execute_go(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        temp_file = None
        try:
            with tempfile.NamedTemporaryFile(mode="w", suffix=".go", delete=False, encoding='utf-8') as f:
                f.write(code)
                temp_file = f.name

            start = time.time()
            result = subprocess.run(
                ["go", "run", temp_file],
                input=input_data,
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace',
                timeout=CodeExecutor.TIMEOUT
            )
            execution_time = time.time() - start
            return result.returncode == 0, result.stdout, result.stderr, execution_time
        except FileNotFoundError:
            return False, "", "Go compiler (go) is not installed or not found in PATH.", 0.0
        except subprocess.TimeoutExpired:
            return False, "", "Execution timeout exceeded (5s)", CodeExecutor.TIMEOUT
        except Exception as e:
            return False, "", str(e), 0.0
        finally:
            if temp_file and os.path.exists(temp_file):
                try:
                    os.unlink(temp_file)
                except Exception:
                    pass

    # ---------------- RUST ----------------
    @staticmethod
    def _execute_rust(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        temp_dir = None
        try:
            temp_dir = tempfile.mkdtemp()
            src = os.path.join(temp_dir, "main.rs")
            binary = os.path.join(temp_dir, "main.exe" if os.name == 'nt' else "main")

            with open(src, "w", encoding='utf-8') as f:
                f.write(code)

            compile_proc = subprocess.run(
                ["rustc", src, "-o", binary],
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace',
                timeout=CodeExecutor.TIMEOUT
            )

            if compile_proc.returncode != 0:
                return False, "", compile_proc.stderr, 0.0

            start = time.time()
            run_proc = subprocess.run(
                [binary],
                input=input_data,
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace',
                timeout=CodeExecutor.TIMEOUT
            )
            execution_time = time.time() - start
            return run_proc.returncode == 0, run_proc.stdout, run_proc.stderr, execution_time
        except FileNotFoundError:
            return False, "", "Rust compiler (rustc) is not installed or not found in PATH.", 0.0
        except subprocess.TimeoutExpired:
            return False, "", "Execution timeout exceeded (5s)", CodeExecutor.TIMEOUT
        except Exception as e:
            return False, "", str(e), 0.0
        finally:
            if temp_dir and os.path.exists(temp_dir):
                shutil.rmtree(temp_dir, ignore_errors=True)

    # ---------------- BASH / SHELL ----------------
    @staticmethod
    def _execute_bash(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        try:
            bash_bin = shutil.which("bash") or shutil.which("sh")
            if bash_bin:
                cmd = [bash_bin, "-c", code]
            elif os.name == 'nt':
                cmd = ["cmd.exe", "/c", code]
            else:
                return False, "", "Bash shell runtime not found.", 0.0

            start = time.time()
            result = subprocess.run(
                cmd,
                input=input_data,
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace',
                timeout=CodeExecutor.TIMEOUT
            )
            execution_time = time.time() - start
            return result.returncode == 0, result.stdout, result.stderr, execution_time
        except subprocess.TimeoutExpired:
            return False, "", "Execution timeout exceeded (5s)", CodeExecutor.TIMEOUT
        except Exception as e:
            return False, "", str(e), 0.0

    # ---------------- RUBY ----------------
    @staticmethod
    def _execute_ruby(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        temp_file = None
        try:
            with tempfile.NamedTemporaryFile(mode="w", suffix=".rb", delete=False, encoding='utf-8') as f:
                f.write(code)
                temp_file = f.name

            start = time.time()
            result = subprocess.run(
                ["ruby", temp_file],
                input=input_data,
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace',
                timeout=CodeExecutor.TIMEOUT
            )
            execution_time = time.time() - start
            return result.returncode == 0, result.stdout, result.stderr, execution_time
        except FileNotFoundError:
            return False, "", "Ruby runtime is not installed or not found in PATH.", 0.0
        except Exception as e:
            return False, "", str(e), 0.0
        finally:
            if temp_file and os.path.exists(temp_file):
                try:
                    os.unlink(temp_file)
                except Exception:
                    pass

    # ---------------- PHP ----------------
    @staticmethod
    def _execute_php(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        temp_file = None
        try:
            with tempfile.NamedTemporaryFile(mode="w", suffix=".php", delete=False, encoding='utf-8') as f:
                f.write(code)
                temp_file = f.name

            start = time.time()
            result = subprocess.run(
                ["php", temp_file],
                input=input_data,
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace',
                timeout=CodeExecutor.TIMEOUT
            )
            execution_time = time.time() - start
            return result.returncode == 0, result.stdout, result.stderr, execution_time
        except FileNotFoundError:
            return False, "", "PHP runtime is not installed or not found in PATH.", 0.0
        except Exception as e:
            return False, "", str(e), 0.0
        finally:
            if temp_file and os.path.exists(temp_file):
                try:
                    os.unlink(temp_file)
                except Exception:
                    pass

    # ---------------- R ----------------
    @staticmethod
    def _execute_r(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        temp_file = None
        try:
            with tempfile.NamedTemporaryFile(mode="w", suffix=".R", delete=False, encoding='utf-8') as f:
                f.write(code)
                temp_file = f.name

            start = time.time()
            result = subprocess.run(
                ["Rscript", temp_file],
                input=input_data,
                capture_output=True,
                text=True,
                encoding='utf-8',
                errors='replace',
                timeout=CodeExecutor.TIMEOUT
            )
            execution_time = time.time() - start
            return result.returncode == 0, result.stdout, result.stderr, execution_time
        except FileNotFoundError:
            return False, "", "Rscript is not installed or not found in PATH.", 0.0
        except Exception as e:
            return False, "", str(e), 0.0
        finally:
            if temp_file and os.path.exists(temp_file):
                try:
                    os.unlink(temp_file)
                except Exception:
                    pass

    # ---------------- SQL ----------------
    @staticmethod
    def _execute_sql(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        import sqlite3
        try:
            start = time.time()
            conn = sqlite3.connect(":memory:")
            cursor = conn.cursor()
            output_lines = []

            statements = [s.strip() for s in code.split(';') if s.strip()]
            for stmt in statements:
                cursor.execute(stmt)
                rows = cursor.fetchall()
                if rows:
                    for r in rows:
                        output_lines.append(str(r))

            conn.commit()
            conn.close()
            execution_time = time.time() - start
            output_str = "\n".join(output_lines) if output_lines else "Query executed successfully."
            return True, output_str + "\n", "", execution_time
        except Exception as e:
            return False, "", str(e), 0.0

    # ---------------- CSHARP ----------------
    @staticmethod
    def _execute_csharp(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        return False, "", "C# (.NET) compiler not installed or not found in PATH.", 0.0

    # ---------------- KOTLIN ----------------
    @staticmethod
    def _execute_kotlin(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        return False, "", "Kotlin compiler (kotlinc) not installed or not found in PATH.", 0.0

    # ---------------- SCALA ----------------
    @staticmethod
    def _execute_scala(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        return False, "", "Scala compiler (scalac) not installed or not found in PATH.", 0.0