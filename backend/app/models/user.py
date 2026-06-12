"""
User Model

Purpose: MongoDB document model for users
Why it exists: Store user information for authentication and profile management
Features: User profile, authentication fields, timestamps
"""

from typing import Optional, List
from datetime import datetime
from pydantic import Field, EmailStr, field_validator
from app.models.base import BaseDocument


class User(BaseDocument):
    """
    User document model
    
    Stores user information including authentication credentials,
    profile details, and preferences.
    """
    
    # ==================== Authentication Fields ====================
    email: EmailStr = Field(..., description="User email address (unique)")
    username: str = Field(..., min_length=3, max_length=50, description="Username (unique)")
    password_hash: str = Field(..., description="Hashed password")
    
    # ==================== Profile Fields ====================
    first_name: Optional[str] = Field(default=None, max_length=50, description="First name")
    last_name: Optional[str] = Field(default=None, max_length=50, description="Last name")
    phone: Optional[str] = Field(default=None, max_length=20, description="Phone number")
    avatar: Optional[str] = Field(default=None, description="Avatar image URL")
    
    # ==================== Address Fields ====================
    address: Optional[dict] = Field(
        default=None,
        description="User address",
        examples=[
            {
                "street": "123 Main St",
                "city": "New York",
                "state": "NY",
                "zip_code": "10001",
                "country": "USA"
            }
        ]
    )
    
    # ==================== Role & Status ====================
    role: str = Field(default="user", description="User role (user, admin, superadmin)")
    is_active: bool = Field(default=True, description="Account active status")
    is_verified: bool = Field(default=False, description="Email verification status")
    
    # ==================== Preferences ====================
    preferences: Optional[dict] = Field(
        default=None,
        description="User preferences",
        examples=[
            {
                "language": "en",
                "currency": "USD",
                "notifications": {
                    "email": True,
                    "sms": False
                }
            }
        ]
    )
    
    # ==================== Metadata ====================
    last_login: Optional[datetime] = Field(default=None, description="Last login timestamp")
    
    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str) -> str:
        """Validate user role."""
        allowed_roles = ["user", "admin", "superadmin"]
        if v not in allowed_roles:
            raise ValueError(f"Role must be one of {allowed_roles}")
        return v
    
    @property
    def full_name(self) -> str:
        """Get user's full name."""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.username
