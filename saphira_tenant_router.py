import time
from typing import Dict, Tuple

class SaphiraTenantQuotaRouter:
    def __init__(self):
        # --- ENTERPRISE SUBSCRIPTION PLAN SPECIFICATIONS ---
        self.TIER_CONFIGURATIONS = {
            "sandbox_free": {
                "max_concurrency": 2,
                "token_capacity": 50,
                "replenish_rate_per_sec": 0.5,
                "execution_timeout_sec": 2.0,
                "allowed_compute_mb": 64
            },
            "enterprise_growth": {
                "max_concurrency": 25,
                "token_capacity": 500,
                "replenish_rate_per_sec": 5.0,
                "execution_timeout_sec": 15.0,
                "allowed_compute_mb": 256
            },
            "sovereign_umbrella": {
                "max_concurrency": 200,
                "token_capacity": 5000,
                "replenish_rate_per_sec": 50.0,
                "execution_timeout_sec": 60.0,
                "allowed_compute_mb": 1024
            }
        }
        # In-memory tenant status tracking trees
        self.tenant_states: Dict[str, dict] = {}

    def register_or_update_tenant(self, tenant_id: str, plan_tier: str):
        if plan_tier not in self.TIER_CONFIGURATIONS:
            raise ValueError(f"Unknown system pricing tier profile definition: {plan_tier}")
            
        config = self.TIER_CONFIGURATIONS[plan_tier]
        self.tenant_states[tenant_id] = {
            "tier": plan_tier,
            "current_tokens": float(config["token_capacity"]),
            "last_replenish_time": time.time(),
            "active_connections": 0
        }

    def evaluate_routing_clearance(self, tenant_id: str) -> Tuple[bool, str, dict]:
        """
        Validates token limits and active connection density before routing requests to worker nodes.
        """
        if tenant_id not in self.tenant_states:
            return False, "UNREGISTERED_TENANT", {}

        state = self.tenant_states[tenant_id]
        config = self.TIER_CONFIGURATIONS[state["tier"]]
        current_time = time.time()

        # 1. Token Replenishment Calculation
        elapsed_time = current_time - state["last_replenish_time"]
        new_tokens = elapsed_time * config["replenish_rate_per_sec"]
        state["current_tokens"] = min(config["token_capacity"], state["current_tokens"] + new_tokens)
        state["last_replenish_time"] = current_time

        # 2. Concurrency Barrier Check
        if state["active_connections"] >= config["max_concurrency"]:
            return False, "CONCURRENCY_EXHAUSTED", config

        # 3. Token Depletion Check
        if state["current_tokens"] < 1.0:
            return False, "RATE_LIMIT_THROTTLED", config

        # Deduct execution processing token allocation
        state["current_tokens"] -= 1.0
        state["active_connections"] += 1
        
        return True, "ROUTING_AUTHORIZED", config

    def release_routing_slot(self, tenant_id: str):
        """Decrements the active connection trace count when an execution lifecycle ends."""
        if tenant_id in self.tenant_states and self.tenant_states[tenant_id]["active_connections"] > 0:
            self.tenant_states[tenant_id]["active_connections"] -= 1
