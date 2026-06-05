import os
import logging
from typing import Dict, Any, List
from pydantic import BaseModel, Field
import litellm

# Configure logging for audit trails
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SaphiraRouter")

# Fallback matrix definition
MODEL_FALLBACK_MAP = {
    "claude-3-5-sonnet": ["gpt-4o", "mistral-large"],
    "gpt-4o": ["claude-3-5-sonnet", "deepseek-chat"],
}

class RouterResponse(BaseModel):
    content: str
    model_used: str
    completion_tokens: int
    prompt_tokens: int

class SaphiraRouter:
    def __init__(self):
        # Enable LiteLLM's internal fault tolerance drops
        litellm.drop_params = True

    def generate_completion(self, messages: List[Dict[str, str]], preferred_model: str, temperature: float = 0.7) -> RouterResponse:
        """
        Executes an LLM call using a preferred model. Automatically falls back to secondary 
        and tertiary models on API timeouts, rate limits, or server errors.
        """
        models_to_try = [preferred_model] + MODEL_FALLBACK_MAP.get(preferred_model, [])
        
        for model in models_to_try:
            try:
                logger.info(f"Saphira Router attempting execution on: {model}")
                response = litellm.completion(
                    model=model,
                    messages=messages,
                    temperature=temperature
                )
                
                # Normalize and return standardized Pydantic data structure
                return RouterResponse(
                    content=response.choices[0].message.content,
                    model_used=model,
                    completion_tokens=response.usage.completion_tokens,
                    prompt_tokens=response.usage.prompt_tokens
                )
            except Exception as e:
                logger.warning(f"Failover triggered. Model {model} failed with error: {str(e)}")
                continue
                
        raise RuntimeError("CRITICAL: All configured LLM fallback routes exhausted.")
