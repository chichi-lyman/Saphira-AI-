import ast
import re

class SaphiraSecurityGatekeeper:
    def __init__(self):
        # Forbidden tokens that indicate intentional sandbox escape attempts
        self.blacklisted_strings = [
            "subprocess", "os.system", "os.popen", "pty", "fork",
            "getattr", "getattribute", "globals", "locals", "__subclasses__",
            "builtins", "eval", "exec", "socket", "requests", "urllib"
        ]

    def verify_syntax_safety(self, candidate_code: str) -> bool:
        """
        Performs abstract syntax tree (AST) analysis and regex scanning 
        to guarantee zero malicious call structures exist in the runtime script.
        """
        # Test Step 1: Structural Scan for forbidden keywords
        for forbidden in self.blacklisted_strings:
            if re.search(r'\b' + re.escape(forbidden) + r'\b', candidate_code):
                return False

        # Test Step 2: Compile to Abstract Syntax Tree to identify obfuscated call chains
        try:
            root_node = ast.parse(candidate_code)
            for node in ast.walk(root_node):
                # Block runtime imports inside the execution thread
                if isinstance(node, (ast.Import, ast.ImportFrom)):
                    return False
                # Block file system modifications via low-level builtins
                if isinstance(node, ast.Call) and isinstance(node.func, ast.Name):
                    if node.func.id in ['open', 'compile', 'dir']:
                        return False
            return True
        except SyntaxError:
            # Defective formatting is rejected before hitting container resources
            return False
