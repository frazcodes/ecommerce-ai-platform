"""
Authentication Schemas

Purpose: Pydantic schemas for authentication request/response validation
Why it exists: Type-safe validation for authentication endpoints
Features: Register, login, refresh token schemas
"""

from typing import Optional
from pydantic import BaseModel, Field, EmailStr, field_validator


class RegisterRequest(BaseModel):
    """
    Registration request schema
    """
    email: EmailStr = Field(..., description="User email")
    username: str = Field(..., min_length=3, max_length=50, description="Username")
    password: str = Field(..., min_length=8, max_length=100, description="Password")
    first_name: Optional[str] = Field(default=None, max_length=50, description="First name")
    last_name: Optional[str] = Field(default=None, max_length=50, description="Last name")
    
    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str) -> str:
        """Validate password strength."""
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class LoginRequest(BaseModel):
    """
    Login request schema
    """
    email: EmailStr = Field(..., description="User email")
    password: str = Field(..., description="Password")


class RefreshTokenRequest(BaseModel):
    """
    Refresh token request schema
    """
    refresh_token: str = Field(..., description="Refresh token")


class UserResponse(BaseModel):
    """
    User response schema
    """
    id: str = Field(..., description="User ID")
    email: str = Field(..., description="User email")
    username: str = Field(..., description="Username")
    first_name: Optional[str] = Field(default=None, description="First name")
    last_name: Optional[str] = Field(default=None, description="Last name")
    role: str = Field(..., description="User role")
    is_active: bool = Field(..., description="Account active status")
    is_verified: bool = Field(..., description="Email verification status")
    created_at: str = Field(..., description="Creation timestamp")
    last_login: Optional[str] = Field(default=None, description="Last login timestamp")


class AuthResponse(BaseModel):
    """
    Authentication response schema
    """
    user: UserResponse = Field(..., description="User data")
    access_token: str = Field(..., description="JWT access token")
    refresh_token: str = Field(..., description="JWT refresh token")


class TokenResponse(BaseModel):
    """
    Token response schema
    """
    access_token: str = Field(..., description="JWT access token")


class LogoutResponse(BaseModel):
    """
    Logout response schema
    """
    message: str = Field(..., description="Logout message")


class ChangePasswordRequest(BaseModel):
    """Change password request schema."""
    current_password: str = Field(..., min_length=1, description="Current password")
    new_password: str = Field(..., min_length=8, max_length=100, description="New password")

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str = Field(..., description="Response message")
