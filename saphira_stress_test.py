import uuid
import time
import random
from concurrent.futures import ThreadPoolExecutor

from saphira_ledger import SaphiraLedger

def run_stress_test(num_transactions: int = 1000):
    ledger = SaphiraLedger(base_token_cost=0.00002, platform_markup=1.5)
    
    print(f"[*] Initializing Saphira Ledger Autonomous Stress Test...")
    print(f"[*] Target Volume: {num_transactions} parallel value exchanges.")
    print(f"[*] Establishing threaded executor pool.")
    
    success_count = 0
    refund_count = 0
    total_margin = 0.0
    
    # Define some random intents to process
    skill_intents = [
        "autonomous_security_patch",
        "email_nurture_campaign",
        "data_ingestion_pipeline",
        "fuzz_vector_generator",
        "neural_translation_core",
        "cross_platform_ui_build",
        "error_log_analyzer"
    ]
    
    def simulate_pipeline_execution():
        user_id = f"USR_{uuid.uuid4().hex[:8].upper()}"
        intent = random.choice(skill_intents)
        budget = random.uniform(0.5, 5.0)
        
        # 1. Escrow hold
        tx_id = ledger.open_micro_escrow(user_id, intent, budget)
        
        # Simulate compute time
        time.sleep(random.uniform(0.01, 0.1))
        
        # Determine success / trip breaker
        pipeline_success = random.random() > 0.15 # 85% success rate
        
        if pipeline_success:
            simulated_tokens = random.randint(1000, 25000)
            simulated_ms = random.randint(100, 5000)
            receipt = ledger.finalize_settlement(tx_id, simulated_tokens, simulated_ms)
            return True, receipt.margin_generated_usd
        else:
            receipt = ledger.trigger_breaker_refund(tx_id, "Circuit Breaker Overload: Recursion Limit Reached")
            return False, 0.0

    start_time = time.time()
    
    # Run parallel
    with ThreadPoolExecutor(max_workers=50) as executor:
        results = executor.map(lambda _: simulate_pipeline_execution(), range(num_transactions))
        
        for success, margin in results:
            if success:
                success_count += 1
                total_margin += margin
            else:
                refund_count += 1

    end_time = time.time()
    duration = end_time - start_time
    
    print("\n--- SAPHIRA LEDGER STRESS TEST RESULTS ---")
    print(f"> Total Execution Time: {duration:.4f} seconds")
    print(f"> Transaction Velocity: {num_transactions / duration:.2f} TXN/sec")
    print(f"> Settled Transactions: {success_count}")
    print(f"> Refunded Transactions (Circuit Tripped): {refund_count}")
    print(f"> Mock Margins Generated: ${total_margin:.2f}")
    print(f"> Net Yield: {(success_count / num_transactions) * 100:.1f}%")
    
if __name__ == "__main__":
    run_stress_test(5000)  # Running 5000 test transactions
