from prometheus_client import Counter, Gauge, Histogram, start_http_server
import time

# --- SAPHIRA ENTERPRISE CORE CORE METRICS DEFINITIONS ---
SANDBOX_EXECUTIONS_TOTAL = Counter(
    'saphira_sandbox_executions_total', 
    'Total untrusted scripts submitted to the crucible workers',
    ['status', 'exit_code']
)
TOKEN_BUCKET_LEVEL = Gauge(
    'saphira_rate_limiter_tokens_available', 
    'Current residual tokens inside the active tenant bucket allocations'
)
CIRCUIT_BREAKER_STATE = Gauge(
    'saphira_circuit_breaker_tripped', 
    'Binary state representing if the execution circuit breaker is actively tripped (1) or operational (0)'
)
LEDGER_TRANSACTION_VALUE = Counter(
    'saphira_ledger_gross_revenue_settled_cents', 
    'Aggregated gross financial turnover processed by saphira_ledger in cents'
)
EXECUTION_LATENCY_SECONDS = Histogram(
    'saphira_sandbox_execution_latency_seconds',
    'Latencies mapped across the ephemeral script worker execution lifetimes',
    buckets=(0.1, 0.5, 1.0, 2.0, 5.0, 10.0, 30.0, 60.0)
)

def start_metrics_exporter(port: int = 9090):
    """Launches the dedicated scrape endpoint background web thread."""
    start_http_server(port)

# --- INLINE MONITORING CONTEXT MANAGERS ---
def record_execution(status: str, exit_code: int, latency: float):
    SANDBOX_EXECUTIONS_TOTAL.labels(status=status, exit_code=exit_code).inc()
    EXECUTION_LATENCY_SECONDS.observe(latency)

def update_tenant_tokens(tokens: float):
    TOKEN_BUCKET_LEVEL.set(tokens)

def set_circuit_breaker(tripped: bool):
    CIRCUIT_BREAKER_STATE.set(1 if tripped else 0)

def record_transaction(value_usd: float):
    # Convert to fixed-point integer cents to maintain precision across telemetry lines
    cents = int(value_usd * 100)
    LEDGER_TRANSACTION_VALUE.inc(cents)
