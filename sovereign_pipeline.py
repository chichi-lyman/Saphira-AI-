import logging
from typing import Dict, Any
# Assuming previous modules are saved as aura_scanner.py and agent_zero.py
from aura_scanner import AuraThreatScanner
from agent_zero import AgentZeroOrchestrator

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SaphiraPipelineController")

class SovereignPipelineController:
    def __init__(self):
        self.aura = AuraThreatScanner()
        self.agent_zero = AgentZeroOrchestrator()

    def process_and_execute(self, task_payload: Dict[str, Any]) -> Dict[str, Any]:
        """
        Orchestrates the transition from threat assessment to sandboxed execution.
        Intercepts raw logic, filters it through Aura, and handles zero-state execution.
        """
        task_id = task_payload.get("task_id", "unassigned")
        logger.info(f"Pipeline intercepting workflow injection for Task {task_id}.")

        # Step 1: Aura Forensic Filter Security Scan
        scan_result = self.aura.scan_task(task_payload)
        
        if scan_result["verdict"] != "CLEARED":
            logger.error(f"Pipeline Execution Blocked for Task {task_id}. Reason: Threat Detected.")
            return {
                "task_id": task_id,
                "pipeline_state": "BLOCKED",
                "security_verdict": scan_result
            }

        # Step 2: Extraction of clean payload string
        safe_code_string = task_payload.get("execution_logic", "")
        logger.info(f"Pipeline security cleared for Task {task_id}. Dispatching to Agent Zero.")

        # Step 3: Hot-loading directly into Agent Zero's isolated environment
        execution_result = self.agent_zero.execute_safe_script(safe_code_string)
        
        return {
            "task_id": task_id,
            "pipeline_state": "EXECUTED",
            "security_verdict": scan_result,
            "execution_runtime": execution_result
        }

# Operational System Test
if __name__ == "__main__":
    controller = SovereignPipelineController()
    
    # Valid operational intent payload
    validated_task = {
        "task_id": "1001",
        "execution_logic": (
            "import math\n"
            "matrix_dimension = [12, 45, 78]\n"
            "print(f'Processing local coordinates: {[math.sqrt(x) for x in matrix_dimension]}')"
        )
    }
    
    pipeline_output = controller.process_and_execute(validated_task)
    print("\n--- Pipeline Execution Output Summary ---")
    import json
    print(json.dumps(pipeline_output, indent=4))
