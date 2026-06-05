from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
import torch

app = FastAPI(title="Saphira ASI - Llama 3.1 Service")

model_id = "meta-llama/Meta-Llama-3.1-8B-Instruct"

print(f"Loading {model_id} with 4-bit quantization...")
tokenizer = AutoTokenizer.from_pretrained(model_id)

quantization_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.bfloat16,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4",
)

model = AutoModelForCausalLM.from_pretrained(
    model_id,
    quantization_config=quantization_config,
    device_map="auto",
)
print("Model loaded successfully.")

class ChatRequest(BaseModel):
    prompt: str
    max_tokens: int = 512

class ChatResponse(BaseModel):
    response: str

from typing import List, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class OpenAIChatRequest(BaseModel):
    model: str
    messages: List[ChatMessage]
    max_tokens: Optional[int] = 512
    temperature: Optional[float] = 0.7

@app.post("/v1/chat/completions")
def chat_completions(req: OpenAIChatRequest):
    try:
        # Convert messages to a single prompt format (basic instruction formatting)
        # Using Llama-3 special conversation tokens format
        conversation = ""
        for msg in req.messages:
            conversation += f"<|start_header_id|>{msg.role}<|end_header_id|>\n\n{msg.content}<|eot_id|>"
        conversation += "<|start_header_id|>assistant<|end_header_id|>\n\n"
        
        inputs = tokenizer(conversation, return_tensors="pt").to("cuda")
        
        terminators = [
            tokenizer.eos_token_id,
            tokenizer.convert_tokens_to_ids("<|eot_id|>")
        ]
        
        outputs = model.generate(
            **inputs, 
            max_new_tokens=req.max_tokens,
            eos_token_id=terminators,
            do_sample=True,
            temperature=req.temperature,
            pad_token_id=tokenizer.eos_token_id
        )
        
        # Only get the new tokens
        input_length = inputs.input_ids.shape[1]
        response_tokens = outputs[0][input_length:]
        text = tokenizer.decode(response_tokens, skip_special_tokens=True)
        
        # OpanAI response schema
        return {
            "id": "chatcmpl-llama3",
            "object": "chat.completion",
            "model": req.model,
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": text
                    },
                    "finish_reason": "stop"
                }
            ]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/v1/completions")
def generate_response(req: ChatRequest):
    try:
        inputs = tokenizer(req.prompt, return_tensors="pt").to("cuda")
        output = model.generate(**inputs, max_new_tokens=req.max_tokens)
        text = tokenizer.decode(output[0], skip_special_tokens=True)
        return {"response": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
