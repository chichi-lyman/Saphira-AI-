import time
import logging
import redis

logger = logging.getLogger("SaphiraRateLimiter")

class SaphiraRateLimiter:
    def __init__(self, redis_host: str = "localhost", redis_port: int = 6379):
        # Initializing the operational datastore for state tracking
        self.db = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)

    def is_request_allowed(self, user_id: str, cost_tier: str) -> bool:
        """
        Standard request rate limiting based on architectural tiers (e.g., Free vs Premium).
        """
        limits = {"free": 60, "premium": 1000}  # Requests allowed per window
        window = 3600  # 1 hour window
        
        current_key = f"saphira:rate:{user_id}:{int(time.time() // window)}"
        current_requests = self.db.incr(current_key)
        
        if current_requests == 1:
            self.db.expire(current_key, window + 10)
            
        return current_requests <= limits.get(cost_tier, 60)

    def track_and_validate_token_budget(self, user_id: str, requested_tokens: int, max_daily_budget: int) -> bool:
        """
        Maintains a rolling operational lookback of financial spend (tokens consumer-side).
        Returns False if the user has hit their processing threshold for the billing cycle.
        """
        day_key = f"saphira:budget:{user_id}:{time.strftime('%Y-%m-%d')}"
        
        # Pull current allocation
        current_spend = self.db.get(day_key)
        current_spend = int(current_spend) if current_spend else 0
        
        if current_spend + requested_tokens > max_daily_budget:
            logger.warning(f"User {user_id} has exceeded their allocated financial token margin for today.")
            return False
            
        # Update spend dynamically on completion validation
        self.db.incrby(day_key, requested_tokens)
        self.db.expire(day_key, 90000) # Keep key alive for slightly over 24 hours
        return True
