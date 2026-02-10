# def get_adapter(language: str):
#     language = language.lower()

#     if language in ["python", "py"]:
#         return "python_adapter"

#     if language in ["javascript", "js"]:
#         return "javascript_adapter"

#     if language in ["cpp", "c++"]:
#         return "cpp_adapter"

#     if language in ["java"]:
#         return "java_adapter"

#     if language in ["go"]:
#         return "go_adapter"

#     if language in ["rust"]:
#         return "rust_adapter"

#     if language in ["sql"]:
#         return "sql_adapter"

#     if language in ["bash", "sh"]:
#         return "bash_adapter"

#     return "generic_adapter"
# Language Adapter Registry

# LANGUAGE_MAP = {
#     "python": "python",
#     "py": "python",

#     "javascript": "javascript",
#     "js": "javascript",
#     "typescript": "typescript",
#     "ts": "typescript",

#     "java": "java",

#     "cpp": "cpp",
#     "c++": "cpp",
#     "c": "c",

#     "go": "go",
#     "rust": "rust",

#     "sql": "sql",

#     "bash": "shell",
#     "sh": "shell",

#     "csharp": "csharp",
#     "cs": "csharp",

#     "kotlin": "kotlin",
#     "swift": "swift",
#     "ruby": "ruby",
#     "php": "php",
#     "r": "r",
#     "scala": "scala"
# }


# def get_adapter(language, *args, **kwargs):
#     """
#     Returns normalized adapter name based on language.
#     Accepts extra args so existing calls don't break.
#     """

#     if not language:
#         return "generic"

#     language = str(language).lower().strip()

#     return LANGUAGE_MAP.get(language, "generic")
# class BaseAdapter:
#     def analyze(self, code=None):
#         if code is None:
#             code = ""
#         if not isinstance(code, str):
#             code = str(code)

#         lines = code.splitlines()

#         return {
#             "lines": len(lines),
#             "functions": code.count("def "),
#             "complexity": int(1),
#             "smells": []
#         }

class BaseAdapter:
    def analyze(self, code=None):
        if code is None:
            code = ""
        if not isinstance(code, str):
            code = str(code)

        lines = code.splitlines()

        # very simple detection (safe)
        functions = []
        classes = []

        for line in lines:
            stripped = line.strip()

            if stripped.startswith("def ") or stripped.startswith("function "):
                functions.append(stripped)

            if stripped.startswith("class "):
                classes.append(stripped)

        return {
            "functions": functions,      # MUST be list
            "classes": classes,          # MUST be list
            "complexity": 1,
            "nesting_depth": 0
        }



class PythonAdapter(BaseAdapter):
    pass


class JavaScriptAdapter(BaseAdapter):
    pass


class CppAdapter(BaseAdapter):
    pass


class JavaAdapter(BaseAdapter):
    pass


class GoAdapter(BaseAdapter):
    pass


class RustAdapter(BaseAdapter):
    pass


class SqlAdapter(BaseAdapter):
    pass


class BashAdapter(BaseAdapter):
    pass


def get_adapter(language, *args, **kwargs):
    if not language:
        return BaseAdapter()

    language = str(language).lower().strip()

    if language in ["python", "py"]:
        return PythonAdapter()

    if language in ["javascript", "js", "typescript", "ts"]:
        return JavaScriptAdapter()

    if language in ["cpp", "c++", "c"]:
        return CppAdapter()

    if language == "java":
        return JavaAdapter()

    if language == "go":
        return GoAdapter()

    if language == "rust":
        return RustAdapter()

    if language == "sql":
        return SqlAdapter()

    if language in ["bash", "sh"]:
        return BashAdapter()

    return BaseAdapter()
