import subprocess
import tempfile
import os
import time
from typing import Tuple

class CodeExecutor:
    """Safe code execution for multiple languages"""
    
    TIMEOUT = 5  # seconds
    
    @staticmethod
    def execute(language: str, code: str, input_data: str = "") -> Tuple[bool, str, str, float]:
        """Execute code safely and return results"""
        
        executors = {
            'python': CodeExecutor._execute_python,
            'javascript': CodeExecutor._execute_javascript,
            'java': CodeExecutor._execute_java,
            'cpp': CodeExecutor._execute_cpp,
            'c++': CodeExecutor._execute_cpp,
            'go': CodeExecutor._execute_go,
            'rust': CodeExecutor._execute_rust,
            'bash': CodeExecutor._execute_bash,
            'shell': CodeExecutor._execute_bash
        }
        
        executor = executors.get(language.lower())
        if not executor:
            return False, "", f"Unsupported language: {language}", 0.0
        
        return executor(code, input_data)
    
    @staticmethod
    def _execute_python(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        """Execute Python code"""
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
                f.write(code)
                temp_file = f.name
            
            start = time.time()
            result = subprocess.run(
                ['python3', temp_file],
                input=input_data,
                capture_output=True,
                text=True,
                timeout=CodeExecutor.TIMEOUT
            )
            execution_time = time.time() - start
            
            os.unlink(temp_file)
            
            if result.returncode == 0:
                return True, result.stdout, "", execution_time
            else:
                return False, result.stdout, result.stderr, execution_time
        except subprocess.TimeoutExpired:
            return False, "", "Execution timeout exceeded", CodeExecutor.TIMEOUT
        except Exception as e:
            return False, "", str(e), 0.0
    
    @staticmethod
    def _execute_javascript(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        """Execute JavaScript code using Node.js"""
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.js', delete=False) as f:
                f.write(code)
                temp_file = f.name
            
            start = time.time()
            result = subprocess.run(
                ['node', temp_file],
                input=input_data,
                capture_output=True,
                text=True,
                timeout=CodeExecutor.TIMEOUT
            )
            execution_time = time.time() - start
            
            os.unlink(temp_file)
            
            if result.returncode == 0:
                return True, result.stdout, "", execution_time
            else:
                return False, result.stdout, result.stderr, execution_time
        except subprocess.TimeoutExpired:
            return False, "", "Execution timeout exceeded", CodeExecutor.TIMEOUT
        except Exception as e:
            return False, "", str(e), 0.0
    
    @staticmethod
    def _execute_java(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        """Execute Java code"""
        return False, "", "Java execution requires JDK installation", 0.0
    
    @staticmethod
    def _execute_cpp(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        """Execute C++ code"""
        return False, "", "C++ execution requires g++ compiler", 0.0
    
    @staticmethod
    def _execute_go(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        """Execute Go code"""
        try:
            with tempfile.NamedTemporaryFile(mode='w', suffix='.go', delete=False) as f:
                f.write(code)
                temp_file = f.name
            
            start = time.time()
            result = subprocess.run(
                ['go', 'run', temp_file],
                input=input_data,
                capture_output=True,
                text=True,
                timeout=CodeExecutor.TIMEOUT
            )
            execution_time = time.time() - start
            
            os.unlink(temp_file)
            
            if result.returncode == 0:
                return True, result.stdout, "", execution_time
            else:
                return False, result.stdout, result.stderr, execution_time
        except subprocess.TimeoutExpired:
            return False, "", "Execution timeout exceeded", CodeExecutor.TIMEOUT
        except FileNotFoundError:
            return False, "", "Go compiler not found", 0.0
        except Exception as e:
            return False, "", str(e), 0.0
    
    @staticmethod
    def _execute_rust(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        """Execute Rust code"""
        return False, "", "Rust execution requires rustc compiler", 0.0
    
    @staticmethod
    def _execute_bash(code: str, input_data: str) -> Tuple[bool, str, str, float]:
        """Execute Bash script"""
        try:
            start = time.time()
            result = subprocess.run(
                ['bash', '-c', code],
                input=input_data,
                capture_output=True,
                text=True,
                timeout=CodeExecutor.TIMEOUT
            )
            execution_time = time.time() - start
            
            if result.returncode == 0:
                return True, result.stdout, "", execution_time
            else:
                return False, result.stdout, result.stderr, execution_time
        except subprocess.TimeoutExpired:
            return False, "", "Execution timeout exceeded", CodeExecutor.TIMEOUT
        except Exception as e:
            return False, "", str(e), 0.0