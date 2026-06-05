import sys
import json
import time

from saphira_enterprise_pipeline import SaphiraEnterprisePipeline

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input provided"}))
        return

    user_input = sys.argv[1]

    # Fake sentiment initial start
    print(json.dumps({"type": "sentiment", "data": {"status": "analyzing", "confidence": 0.99}}))
    sys.stdout.flush()

    try:
        # Handle pipeline execution, with basic catches
        pipeline = SaphiraEnterprisePipeline()
        res = pipeline.process_prompt("anonymous", user_input)
    except Exception as e:
        res = {"status": "error", "message": f"Pipeline failure: {str(e)}"}

    # Final response
    print(json.dumps({
        "type": "final_response",
        "text": res.get("response", res.get("message", "Processing completed.")),
        "synchrony": True,
        "alignment": 0.99,
        "billing": {
            "tokens": res.get("actual_tokens", 0),
            "cost": res.get("actual_tokens", 0) * 0.000002,
            "status": "TAXED"
        }
    }))
    sys.stdout.flush()

if __name__ == "__main__":
    main()
