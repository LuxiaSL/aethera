"""
Rate limiting utilities to prevent spam.
Implements a simple in-memory rate limiter based on client IP address.
"""
import time
from collections import defaultdict
from typing import Dict, Tuple, Optional
from fastapi import HTTPException, Request, status

# Store for rate limiting: IP -> [(timestamp, count), ...]
RATE_LIMITS: Dict[str, list] = defaultdict(list)

# Default rate limit settings
DEFAULT_RATE_WINDOW = 60  # 1 minute window
DEFAULT_MAX_REQUESTS = 5  # 5 requests per minute


def get_client_ip(request: Request) -> str:
    """Extract the client IP address from a request."""
    # Check for X-Forwarded-For header first (for clients behind proxy)
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # Get the first IP if multiple are provided
        return forwarded_for.split(",")[0].strip()
    
    # Otherwise use the direct client IP
    return str(request.client.host if request.client and request.client.host else "unknown")


def check_rate_limit(
    ip_address: str, 
    window: int = DEFAULT_RATE_WINDOW, 
    max_requests: int = DEFAULT_MAX_REQUESTS
) -> Tuple[bool, Optional[int]]:
    """
    Check if an IP address has exceeded the rate limit.
    
    Args:
        ip_address: The client IP address
        window: Time window in seconds
        max_requests: Maximum number of requests allowed in the window
        
    Returns:
        A tuple (is_allowed, retry_after) where:
            - is_allowed: Boolean indicating if the request is allowed
            - retry_after: Seconds to wait before retrying, or None if allowed
    """
    now = time.time()
    records = RATE_LIMITS[ip_address]
    
    # Prune old records
    cutoff = now - window
    records = [record for record in records if record[0] >= cutoff]
    RATE_LIMITS[ip_address] = records
    
    # Check if rate limit exceeded
    if len(records) >= max_requests:
        # Calculate when they can try again
        oldest_timestamp = records[0][0]
        retry_after = int(oldest_timestamp + window - now) + 1
        return False, max(1, retry_after)  # Ensure at least 1 second delay
    
    # Add new record
    records.append((now, 1))
    return True, None


def rate_limit_comments(request: Request) -> None:
    """
    FastAPI dependency for rate limiting comment submissions.
    Raises an HTTPException if the rate limit is exceeded.
    """
    ip_address = get_client_ip(request)
    is_allowed, retry_after = check_rate_limit(ip_address)
    
    if not is_allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Please try again later.",
            headers={"Retry-After": str(retry_after)},
        )