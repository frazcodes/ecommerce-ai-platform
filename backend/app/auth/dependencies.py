"""
Authentication Dependencies

Purpose: FastAPI dependencies for protected routes
Why it exists: Protect routes with JWT authentication
Features: Get current user, verify access token, optional auth
"""

from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.auth.jwt import verify_token
from app.services.auth_service import auth_service
from app.utils.exceptions import UnauthorizedException, NotFoundException

# HTTP Bearer scheme for token extraction
security = HTTPBearer()


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Get current authenticated user
    
    Dependency function to protect routes.
    Extracts and verifies JWT token from Authorization header.
    
    Args:
        credentials: HTTP Bearer credentials from Authorization header
    
    Returns:
        Current user data
    
    Raises:
        HTTPException: If token is invalid or user not found
    """
    # Extract token
    token = credentials.credentials
    
    # Verify token
    payload = verify_token(token, token_type="access")
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Get user ID from token
    user_id = payload.get("sub")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    # Get user from database
    try:
        user = await auth_service.get_current_user(user_id=user_id)
        return user
    except (UnauthorizedException, NotFoundException):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )


async def get_current_user_optional(credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))) -> Optional[dict]:
    """
    Get current user optionally
    
    Dependency function that doesn't require authentication.
    Returns user data if token is valid, None otherwise.
    
    Args:
        credentials: Optional HTTP Bearer credentials
    
    Returns:
        Current user data if authenticated, None otherwise
    """
    if not credentials:
        return None
    
    # Extract token
    token = credentials.credentials
    
    # Verify token
    payload = verify_token(token, token_type="access")
    
    if not payload:
        return None
    
    # Get user ID from token
    user_id = payload.get("sub")
    
    if not user_id:
        return None
    
    # Get user from database
    try:
        user = await auth_service.get_current_user(user_id=user_id)
        return user
    except (UnauthorizedException, NotFoundException):
        return None


def require_role(required_role: str):
    """
    Require specific role for access
    
    Dependency factory function to require specific user role.
    
    Args:
        required_role: Required role (user, admin, superadmin)
    
    Returns:
        Dependency function
    
    Usage:
        @app.get("/admin")
        async def admin_route(user: dict = Depends(require_role("admin"))):
            ...
    """
    async def role_dependency(current_user: dict = Depends(get_current_user)) -> dict:
        user_role = current_user.get("role", "user")
        
        if user_role != required_role and user_role != "superadmin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role '{required_role}' required"
            )
        
        return current_user
    
    return role_dependency
