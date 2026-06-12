"""
Authentication Service

Purpose: Business logic for authentication operations
Why it exists: Separate authentication logic from route handlers
Features: Register, login, logout, refresh token, user lookup
"""

from typing import Optional, Dict, Any
from datetime import datetime
from bson import ObjectId
from app.database.mongodb import mongodb
from app.auth.password import hash_password, verify_password
from app.auth.jwt import create_access_token, create_refresh_token, verify_token
from app.utils.exceptions import (
    BadRequestException,
    UnauthorizedException,
    ConflictException,
    NotFoundException,
)
from app.utils.serializers import serialize_user


class AuthService:
    """
    Authentication service
    
    Handles user registration, login, logout, and token management.
    """
    
    async def register_user(
        self,
        email: str,
        username: str,
        password: str,
        first_name: Optional[str] = None,
        last_name: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Register a new user
        
        Args:
            email: User email
            username: Username
            password: Plain text password
            first_name: First name (optional)
            last_name: Last name (optional)
        
        Returns:
            User data with tokens
        
        Raises:
            ConflictException: If email or username already exists
        """
        # Check if user already exists
        users_collection = mongodb.get_collection("users")
        
        existing_user = await users_collection.find_one({
            "$or": [
                {"email": email},
                {"username": username}
            ]
        })
        
        if existing_user:
            if existing_user.get("email") == email:
                raise ConflictException("Email already registered")
            if existing_user.get("username") == username:
                raise ConflictException("Username already taken")
        
        # Hash password
        password_hash = hash_password(password)
        
        # Create user document
        user_doc = {
            "email": email,
            "username": username,
            "password_hash": password_hash,
            "first_name": first_name,
            "last_name": last_name,
            "role": "user",
            "is_active": True,
            "is_verified": False,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert user
        result = await users_collection.insert_one(user_doc)
        user_id = str(result.inserted_id)
        
        # Create tokens
        access_token = create_access_token(data={"sub": user_id})
        refresh_token = create_refresh_token(data={"sub": user_id})
        
        user_doc["_id"] = user_id

        return {
            "user": serialize_user(user_doc),
            "access_token": access_token,
            "refresh_token": refresh_token,
        }
    
    async def login_user(self, email: str, password: str) -> Dict[str, Any]:
        """
        Login a user with email and password
        
        Args:
            email: User email
            password: Plain text password
        
        Returns:
            User data with tokens
        
        Raises:
            UnauthorizedException: If credentials are invalid
        """
        # Find user by email
        users_collection = mongodb.get_collection("users")
        user = await users_collection.find_one({"email": email})
        
        if not user:
            raise UnauthorizedException("Invalid email or password")
        
        # Verify password
        if not verify_password(password, user.get("password_hash", "")):
            raise UnauthorizedException("Invalid email or password")
        
        # Check if user is active
        if not user.get("is_active", True):
            raise UnauthorizedException("Account is inactive")
        
        user_id = str(user["_id"])
        
        # Update last login
        await users_collection.update_one(
            {"_id": user["_id"]},
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        # Create tokens
        access_token = create_access_token(data={"sub": user_id})
        refresh_token = create_refresh_token(data={"sub": user_id})
        
        user["last_login"] = datetime.utcnow()

        return {
            "user": serialize_user(user),
            "access_token": access_token,
            "refresh_token": refresh_token,
        }
    
    async def refresh_token(self, refresh_token: str) -> Dict[str, Any]:
        """
        Refresh access token using refresh token
        
        Args:
            refresh_token: Refresh token string
        
        Returns:
            New access token
        
        Raises:
            UnauthorizedException: If refresh token is invalid
        """
        # Verify refresh token
        payload = verify_token(refresh_token, token_type="refresh")
        
        if not payload:
            raise UnauthorizedException("Invalid refresh token")
        
        user_id = payload.get("sub")
        
        # Check if user exists and is active
        users_collection = mongodb.get_collection("users")
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        
        if not user or not user.get("is_active", True):
            raise UnauthorizedException("User not found or inactive")
        
        # Create new access token
        access_token = create_access_token(data={"sub": user_id})
        
        return {
            "access_token": access_token
        }
    
    async def get_current_user(self, user_id: str) -> Dict[str, Any]:
        """
        Get current user by ID
        
        Args:
            user_id: User ID string
        
        Returns:
            User data without password
        
        Raises:
            NotFoundException: If user not found
        """
        users_collection = mongodb.get_collection("users")
        user = await users_collection.find_one({"_id": ObjectId(user_id)})
        
        if not user:
            raise NotFoundException("User not found")
        
        return serialize_user(user)

    async def change_password(
        self,
        user_id: str,
        current_password: str,
        new_password: str,
    ) -> Dict[str, Any]:
        """Change password for authenticated user."""
        users_collection = mongodb.get_collection("users")
        user = await users_collection.find_one({"_id": ObjectId(user_id)})

        if not user:
            raise NotFoundException("User not found")

        if not verify_password(current_password, user.get("password_hash", "")):
            raise UnauthorizedException("Current password is incorrect")

        if len(new_password) < 8:
            raise BadRequestException("Password must be at least 8 characters")

        password_hash = hash_password(new_password)
        await users_collection.update_one(
            {"_id": user["_id"]},
            {"$set": {"password_hash": password_hash, "updated_at": datetime.utcnow()}},
        )

        return {"message": "Password updated successfully"}
    
    async def logout_user(self, user_id: str) -> Dict[str, Any]:
        """
        Logout a user (client-side token invalidation)
        
        Args:
            user_id: User ID string
        
        Returns:
            Success message
        
        Note:
            JWT tokens are stateless, so logout is handled client-side
            by removing tokens from storage. For server-side logout,
            implement a token blacklist.
        """
        return {
            "message": "Logged out successfully"
        }


# Global auth service instance
auth_service = AuthService()
