import logging
import json
import re
from typing import Dict, Any, List

from saphira_rate_limiter import SaphiraRateLimiter
from saphira_router import SaphiraRouter
from saphira_sandbox import SaphiraAgentSandbox

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SaphiraEnterprisePipeline")

class SaphiraEnterprisePipeline:
    def __init__(self):
        self.rate_limiter = SaphiraRateLimiter()
        self.router = SaphiraRouter()
        self.sandbox = SaphiraAgentSandbox()

    def process_prompt(self, user_id: str, prompt: str, cost_tier: str = "premium", max_daily_budget: int = 500000) -> Dict[str, Any]:
        """
        Hardened execution lifecycle:
        1. Guardrail Intercepts (Rate Limit & Token Budget)
        2. Router Evaluates (LLM call)
        3. Sandbox Isolates (Regex extract code + Execute untrusted code)
        """
        logger.info(f"Incoming prompt from user {user_id}")

        # 1. The Guardrail Intercepts
        if not self.rate_limiter.is_request_allowed(user_id, cost_tier):
            logger.warning(f"User {user_id} hit rate limits.")
            return {"status": "error", "message": "Rate limit exceeded. Please slow down."}

        # Estimate a ceiling (e.g. 5000 tokens)
        estimated_ceiling_tokens = 5000
        if not self.rate_limiter.track_and_validate_token_budget(user_id, estimated_ceiling_tokens, max_daily_budget):
            return {"status": "error", "message": "Daily token budget exceeded"}

        # 2. The Router Evaluates
        messages = [{"role": "user", "content": prompt}]
        try:
            # SaphiraRouter selects preferred_model and falls back automatically
            llm_response = self.router.generate_completion(messages=messages, preferred_model="gpt-4o")
        except Exception as e:
            logger.error(f"Router failed: {str(e)}")
            return {"status": "error", "message": "System temporarily unavailable"}

        output_content = llm_response.content
        logger.info(f"Router generated response using {llm_response.model_used}")

        # Calculate difference to refund unused tokens or update actual usage
        # (Simplified: assumes track_and_validate already decremented the max budget by ceiling)
        actual_tokens_used = llm_response.completion_tokens + llm_response.prompt_tokens

        # 3. The Sandbox Isolates
        # Heuristic: Check if the LLM output contains python code blocks
        code_blocks = self._extract_python_code(output_content)
        sandbox_results = []
        
        if code_blocks:
            logger.info("Executable code detected. Routing to Sandbox Isolation.")
            for code in code_blocks:
                sandbox_res = self.sandbox.execute_untrusted_code(code)
                sandbox_results.append(sandbox_res)
        
        return {
            "status": "success",
            "model_used": llm_response.model_used,
            "actual_tokens": actual_tokens_used,
            "response": output_content,
            "sandbox_execution": sandbox_results
        }
        
    def _extract_python_code(self, text: str) -> List[str]:
        # Extracts python blocks from markdown text
        pattern = r"```(?:python|py)\n(.*?)```"
        matches = re.finditer(pattern, text, re.DOTALL)
        return [match.group(1).strip() for match in matches]

if __name__ == "__main__":
    pipeline = SaphiraEnterprisePipeline()
    # Simple test run
    res = pipeline.process_prompt("test_user_01", "Write a python script that prints 'Hello Saphira Enterprise'")
    print(json.dumps(res, indent=2))
