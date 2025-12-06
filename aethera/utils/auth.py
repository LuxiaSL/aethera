from typing import Optional
import os
from fastapi import Depends, HTTPException, status, Request
from passlib.context import CryptContext
from sqlmodel import Session

# We'll use a simple cookie-based approach for the admin panel
# instead of a full OAuth2 flow, to keep it lightweight but secure.

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def get_current_admin(request: Request):
    """
    Simple dependency to check if the user is logged in via session.
    In a real production app, you'd use signed cookies or JWTs.
    For this lightweight blog, we'll check a signed session cookie.
    """
    user = request.session.get("user")
    if not user or user != "admin":
        # If not logged in, redirect to login page or raise error depending on context
        # For API usage, we raise 401
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
