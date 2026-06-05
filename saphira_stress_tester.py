import asyncio
import random
import time
from typing import List, Dict, Any
from saphira_ledger import SaphiraLedger
from saphira_circuit_breaker import SaphiraCircuitBreaker

class SaphiraEcosystemStressTester:
    def __init__(self, target_concurrency: int = 1000):
        self.concurrency = target_concurrency
        self.ledger = SaphiraLedger(base_token_cost=0.00002, platform_markup=1.5)
        self.circuit_breaker = SaphiraCircuitBreaker(max_attempts=5)
        self.test_metrics = {
            "total_simulated_runs": 0,
            "successful_settlements": 0,
            "tripped_circuit_refunds": 0,
            "total_revenue_generated": 0.0,
            "total_margin_generated": 0.0
        }

    async def simulate_single_transaction_flow(self, user_id: str, task_index: int):
        """Simulates a highly dynamic, asynchronous execution transaction thread."""
        task_intent = f"stress_test_routine_block_{random.randint(100, 999)}"
        base_code = "def placeholder_execution(): return True"
        max_budget = 5.00
        
        # 1. Open active escrow transaction loop
        tx_id = self.ledger.open_micro_escrow(user_id, task_intent, max_budget)
        
        # Introduce variable network / compilation latency simulation
        await asyncio.sleep(random.uniform(0.01, 0.1))
        
        # 2. Determine outcome behavior statistically (Simulating failures vs flawless commits)
        # 85% success rate, 15% probability of triggering iterative code faults
        is_faulty = random.choices([False, True], weights=[0.85, 0.15])[0]
        
        self.test_metrics["total_simulated_runs"] += 1
        
        if not is_faulty:
            # Flawless completion - Settle ledger entry
            tokens_used = random.randint(1200, 45000)
            compute_ms = random.randint(45, 1200)
            
            receipt = self.ledger.finalize_settlement(tx_id, tokens_used, compute_ms)
            
            if receipt:
                self.test_metrics["successful_settlements"] += 1
                self.test_metrics["total_revenue_generated"] += receipt.priced_value_usd
                self.test_metrics["total_margin_generated"] += receipt.margin_generated_usd
        else:
            # Code fault encountered - loop error incrementation up to maximum ceiling
            error_scenarios = ["SyntaxError", "TimeoutException", "MemoryLimitExceeded"]
            selected_error = random.choice(error_scenarios)
            
            # Record consecutive failures until circuit breaker triggers
            for _ in range(5):
                current_faults = self.circuit_breaker.record_failure(task_intent, base_code, selected_error)
            
            # Evaluate if the safety circuit is checked and correctly tripped
            is_allowed, _ = self.circuit_breaker.check_state(task_intent, base_code)
            if not is_allowed:
                receipt = self.ledger.trigger_breaker_refund(tx_id, reason=f"Fuzzing Crash: {selected_error}")
                if receipt:
                    self.test_metrics["tripped_circuit_refunds"] += 1

    async def execute_stress_matrix(self):
        """Orchestrates an ultra-dense, parallelized async execution block."""
        print(f"[+] Initializing Saphira Stress Matrix. Target Concurrency: {self.concurrency} parallel requests.")
        start_time = time.time()
        
        tasks: List[asyncio.Task] = []
        for i in range(self.concurrency):
            user_slug = f"USR_{random.randint(1000, 9999)}"
            tasks.append(asyncio.create_task(self.simulate_single_transaction_flow(user_slug, i)))
            
        await asyncio.gather(*tasks)
        duration = time.time() - start_time
        
        self._print_audit_report(duration)

    def _print_audit_report(self, duration: float):
        """Outputs a clean console summary mapping total architecture platform performance."""
        print("\n" + "="*50)
        print("          SAPHIRA AI ECOSYSTEM STRESS AUDIT          ")
        print("="*50)
        print(f"Total Simulation Runtime : {duration:.2f} seconds")
        print(f"Throughput Capacity      : {self.test_metrics['total_simulated_runs'] / duration:.2f} tx/sec")
        print(f"Total Requests Executed  : {self.test_metrics['total_simulated_runs']}")
        print(f"Successful Settlements   : {self.test_metrics['successful_settlements']}")
        print(f"Tripped Circuit Refunds  : {self.test_metrics['tripped_circuit_refunds']}")
        print(f"Gross Revenue Tracked    : ${self.test_metrics['total_revenue_generated']:.4f}")
        print(f"Net Margin Generated     : ${self.test_metrics['total_margin_generated']:.4f}")
        print(f"Average Gross Yield      : {(self.test_metrics['total_margin_generated'] / (self.test_metrics['total_revenue_generated'] or 1)) * 100:.2f}%")
        print("="*50 + "\n")

# --- CONSOLE ENTRY POINT ---
if __name__ == "__main__":
    tester = SaphiraEcosystemStressTester(target_concurrency=1500)
    asyncio.run(tester.execute_stress_matrix())
