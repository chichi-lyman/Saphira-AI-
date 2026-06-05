import sys
import json
from sovereign_pipeline import SovereignPipelineController

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Missing arguments"}))
        sys.exit(1)
        
    task_id = sys.argv[1]
    code = sys.argv[2]
    
    controller = SovereignPipelineController()
    payload = {
        "task_id": task_id,
        "execution_logic": code
    }
    
    result = controller.process_and_execute(payload)
    print(json.dumps(result))
