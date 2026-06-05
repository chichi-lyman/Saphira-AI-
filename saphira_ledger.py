import time
import uuid
from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

# --- STAGE 1: FINANCIAL SCHEMAS ---

class TransactionEntry(BaseModel):
    transaction_id: str = Field(default_factory=lambda: f"TXN_{uuid.uuid4().hex[:12].upper()}")
    user_id: str
    skill_name: str
    compute_overhead_ms: int
    token_cost_usd: float
    priced_value_usd: float
    margin_generated_usd: float
    timestamp: float = Field(default_factory=time.time)
    status: str = Field(description="States: HELD, SETTLED, REFUNDED_BY_BREAKER")

# --- STAGE 2: THE MONETIZATION ENGINE ---

class SaphiraLedger:
    def __init__(self, base_token_cost: float = 0.00002, platform_markup: float = 1.5):
        self.base_token_cost = base_token_cost  # Cost coefficient per LLM token input/output
        self.platform_markup = platform_markup  # Multiplier for raw compute costs to ensure net margin
        self.active_escrows: Dict[str, TransactionEntry] = {}
        self.settled_ledger: Dict[str, TransactionEntry] = {}

    def calculate_dynamic_price(self, total_tokens: int, compute_ms: int, complexity_score: float = 1.0) -> Dict[str, float]:
        """Dynamically builds value pricing based on compute friction and task density."""
        raw_token_expense = total_tokens * self.base_token_cost
        raw_compute_expense = (compute_ms / 1000) * 0.005  # Arbitrary base hardware dollar cost per second
        
        cost_basis = raw_token_expense + raw_compute_expense
        final_price = round(cost_basis * self.platform_markup * complexity_score, 4)
        
        # Ensure a micro-transaction floor price to handle minimal executions safely
        if final_price < 0.01:
            final_price = 0.01
            
        return {
            "cost_basis": round(cost_basis, 4),
            "market_price": final_price,
            "net_margin": round(final_price - cost_basis, 4)
        }

    def open_micro_escrow(self, user_id: str, skill_name: str, max_budget: float) -> str:
        """Places a transactional authorization hold on an incoming runtime execution call."""
        # Generate an early escrow entry before code execution begins
        txn = TransactionEntry(
            user_id=user_id,
            skill_name=skill_name,
            compute_overhead_ms=0,
            token_cost_usd=0.0,
            priced_value_usd=max_budget,
            margin_generated_usd=0.0,
            status="HELD"
        )
        self.active_escrows[txn.transaction_id] = txn
        return txn.transaction_id

    def finalize_settlement(self, transaction_id: str, real_tokens: int, real_compute_ms: int) -> Optional[TransactionEntry]:
        """Settles payment when Forensic Filter passes execution criteria."""
        if transaction_id not in self.active_escrows:
            return None

        escrow_txn = self.active_escrows.pop(transaction_id)
        pricing = self.calculate_dynamic_price(real_tokens, real_compute_ms)

        escrow_txn.compute_overhead_ms = real_compute_ms
        escrow_txn.token_cost_usd = pricing["cost_basis"]
        escrow_txn.priced_value_usd = pricing["market_price"]
        escrow_txn.margin_generated_usd = pricing["net_margin"]
        escrow_txn.status = "SETTLED"

        self.settled_ledger[transaction_id] = escrow_txn
        return escrow_txn

    def trigger_breaker_refund(self, transaction_id: str, reason: str) -> Optional[TransactionEntry]:
        """Releases the escrow instantly if the pipeline trips the 5-loop lock breaker."""
        if transaction_id not in self.active_escrows:
            return None

        escrow_txn = self.active_escrows.pop(transaction_id)
        escrow_txn.status = f"REFUNDED_BY_BREAKER: {reason}"
        self.settled_ledger[transaction_id] = escrow_txn
        return escrow_txn
