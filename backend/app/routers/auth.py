"""
Authentication Router

Purpose: API endpoints for authentication
Why it exists: Handle register, login, logout, and token refresh
Features: Register, login, logout, refresh token, get current user, change password
"""

from fastapi import APIRouter, Depends
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    RefreshTokenRequest,
    ChangePasswordRequest,
    AuthResponse,
    TokenResponse,
    LogoutResponse,
    UserResponse,
    MessageResponse,
)
from app.services.auth_service import auth_service
from app.auth.dependencies import get_current_user

router = APIRouter()


@router.post("/register", response_model=AuthResponse)
async def register(request: RegisterRequest):
    """Register a new user account."""
    return await auth_service.register_user(
        email=request.email,
        username=request.username,
        password=request.password,
        first_name=request.first_name,
        last_name=request.last_name,
    )


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """Login with email and password."""
    return await auth_service.login_user(
        email=request.email,
        password=request.password,
    )


@router.post("/logout", response_model=LogoutResponse)
async def logout(current_user: dict = Depends(get_current_user)):
    """Logout current user."""
    return await auth_service.logout_user(user_id=current_user["id"])


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(request: RefreshTokenRequest):
    """Refresh access token using refresh token."""
    return await auth_service.refresh_token(refresh_token=request.refresh_token)


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user profile."""
    return current_user


@router.put("/change-password", response_model=MessageResponse)
async def change_password(
    request: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
):
    """Change password for the current user."""
    return await auth_service.change_password(
        user_id=current_user["id"],
        current_password=request.current_password,
        new_password=request.new_password,
    )
