"""
Retry logic with exponential backoff for rate limit handling.
"""

import asyncio
import logging
from functools import wraps
from typing import TypeVar, Callable, Any

from tenacity import (
    retry,
    stop_after_attempt,
    wait_exponential,
    retry_if_exception_type,
    before_sleep_log,
    RetryError,
)

logger = logging.getLogger(__name__)

T = TypeVar("T")


# Exception types that should trigger retries
RETRYABLE_EXCEPTIONS = (
    # Generic network errors
    ConnectionError,
    TimeoutError,
    asyncio.TimeoutError,
)


def is_rate_limit_error(exception: Exception) -> bool:
    """Check if exception is a rate limit error from any provider."""
    error_str = str(exception).lower()
    
    # Check for rate limit indicators
    rate_limit_indicators = [
        "rate_limit",
        "rate limit",
        "ratelimit",
        "429",
        "too many requests",
        "overloaded",
        "capacity",
    ]
    
    return any(indicator in error_str for indicator in rate_limit_indicators)


def extract_retry_after(exception: Exception) -> float | None:
    """Try to extract retry-after seconds from exception."""
    # Anthropic errors often have retry_after attribute
    if hasattr(exception, "response"):
        response = exception.response
        if hasattr(response, "headers"):
            retry_after = response.headers.get("retry-after")
            if retry_after:
                try:
                    return float(retry_after)
                except ValueError:
                    pass
    
    # Check for embedded retry info in message
    error_str = str(exception)
    import re
    match = re.search(r"retry.{0,10}?(\d+\.?\d*)\s*s", error_str, re.IGNORECASE)
    if match:
        return float(match.group(1))
    
    return None


class RateLimitRetry:
    """
    Retry decorator that handles rate limits with smart backoff.
    
    - Uses exponential backoff for general errors
    - Respects retry-after headers when available
    - Logs retry attempts for visibility
    """
    
    def __init__(
        self,
        max_attempts: int = 5,
        min_wait: float = 1.0,
        max_wait: float = 60.0,
    ):
        self.max_attempts = max_attempts
        self.min_wait = min_wait
        self.max_wait = max_wait
    
    def __call__(self, func: Callable[..., T]) -> Callable[..., T]:
        @wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> T:
            last_exception = None
            
            for attempt in range(1, self.max_attempts + 1):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
                    
                    # Check if this is a retryable error
                    is_retryable = (
                        isinstance(e, RETRYABLE_EXCEPTIONS) or
                        is_rate_limit_error(e)
                    )
                    
                    if not is_retryable or attempt == self.max_attempts:
                        raise
                    
                    # Calculate wait time
                    retry_after = extract_retry_after(e)
                    if retry_after:
                        wait_time = min(retry_after + 0.5, self.max_wait)  # Add buffer
                        logger.warning(
                            f"Rate limited, waiting {wait_time:.1f}s (from header). "
                            f"Attempt {attempt}/{self.max_attempts}"
                        )
                    else:
                        # Exponential backoff: min_wait * 2^attempt
                        wait_time = min(
                            self.min_wait * (2 ** (attempt - 1)),
                            self.max_wait
                        )
                        logger.warning(
                            f"Retrying after error: {type(e).__name__}. "
                            f"Waiting {wait_time:.1f}s. "
                            f"Attempt {attempt}/{self.max_attempts}"
                        )
                    
                    await asyncio.sleep(wait_time)
            
            # Should not reach here, but just in case
            raise last_exception  # type: ignore
        
        return wrapper  # type: ignore


# Pre-configured retry decorators
rate_limit_retry = RateLimitRetry(
    max_attempts=5,
    min_wait=1.0,
    max_wait=60.0,
)

# For batch operations - more patient
batch_retry = RateLimitRetry(
    max_attempts=7,
    min_wait=2.0,
    max_wait=120.0,
)

