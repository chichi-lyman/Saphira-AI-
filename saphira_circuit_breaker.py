import hashlib
from typing import Dict, Tuple

class SaphiraCircuitBreaker:
    def __init__(self, max_attempts: int = 5):
        self.max_attempts = max_attempts
        self._failure_matrix: Dict[str, int] = {}
        self._tripped_breakers: Dict[str, str] = {}

    def _generate_task_fingerprint(self, task_description: str, base_code: str) -> str:
        """Generates a unique cryptographic signature for the unique logical problem."""
        raw_target = f"{task_description}_{base_code.strip()}"
        return hashlib.sha256(raw_target.encode('utf-8')).hexdigest()

    def check_state(self, task_description: str, base_code: str) -> Tuple[bool, str]:
        """
        Checks if a specific sub-routine has breached the safety ceiling.
        Returns: (is_allowed, status_message)
        """
        fingerprint = self._generate_task_fingerprint(task_description, base_code)
        
        if fingerprint in self._tripped_breakers:
            return False, f"HALT: Circuit broken. Reason: {self._tripped_breakers[fingerprint]}"
        
        return True, "PROCEED"

    def record_failure(self, task_description: str, base_code: str, error_reason: str) -> int:
        """Increments the fault matrix. Trips the breaker if it crosses the max threshold."""
        fingerprint = self._generate_task_fingerprint(task_description, base_code)
        
        self._failure_matrix[fingerprint] = self._failure_matrix.get(fingerprint, 0) + 1
        current_faults = self._failure_matrix[fingerprint]
        
        if current_faults >= self.max_attempts:
            self._tripped_breakers[fingerprint] = (
                f"Recursive loop exceeded maximum threshold of {self.max_attempts} attempts. "
                f"Last known fault: {error_reason}"
            )
        
        return current_faults

    def reset_breaker(self, task_description: str, base_code: str):
        """Allows manual reset of a code loop once manual maintenance is completed."""
        fingerprint = self._generate_task_fingerprint(task_description, base_code)
        self._failure_matrix.pop(fingerprint, None)
        self._tripped_breakers.pop(fingerprint, None)
