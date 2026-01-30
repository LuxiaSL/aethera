"""Security utilities for the blog."""
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware to add security headers to responses."""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Add security headers
        response.headers["X-Content-Type-Options"] = "nosniff"  # Prevent MIME type sniffing
        response.headers["X-XSS-Protection"] = "1; mode=block"  # Enable XSS protection in older browsers
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"  # Control referrer information
        
        # Allow framing ONLY for preview endpoints (admin panel iframe preview)
        # All other pages are protected from clickjacking
        if request.url.path.startswith("/preview/"):
            # Allow framing from admin panel origins
            response.headers["Content-Security-Policy"] = "frame-ancestors 'self' http://localhost:* https://admin.aetherawi.red"
        else:
            response.headers["X-Frame-Options"] = "DENY"  # Prevent clickjacking
        
        return response