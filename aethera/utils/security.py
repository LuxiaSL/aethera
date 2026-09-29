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
        
        # Preview endpoints may also be framed by the admin panel. Everything
        # else may be framed by æthera itself and nobody else: /oikos tunes
        # its screens in to the real pages, and other origins still can't
        # clickjack them.
        if request.url.path.startswith("/preview/"):
            # Allow framing from admin panel origins
            response.headers["Content-Security-Policy"] = "frame-ancestors 'self' http://localhost:* https://admin.aetherawi.red"
        else:
            response.headers["Content-Security-Policy"] = "frame-ancestors 'self'"
            response.headers["X-Frame-Options"] = "SAMEORIGIN"  # for browsers that predate frame-ancestors
        
        return response