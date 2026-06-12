"""
Custom Exception Classes

Purpose: Centralized exception handling for the application
Why it exists: Type-safe custom exceptions for better error handling
Features: HTTP status codes, error messages, structured error responses
"""

from typing import Any, Optional


class AppException(Exception):
    """
    Base exception class for all application exceptions
    
    All custom exceptions should inherit from this class.
    Provides consistent error handling across the application.
    """
    
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        details: Optional[dict[str, Any]] = None
    ):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class DatabaseException(AppException):
    """
    Database-related exceptions
    
    Raised when database operations fail.
    """
    
    def __init__(
        self,
        message: str = "Database operation failed",
        details: Optional[dict[str, Any]] = None
    ):
        super().__init__(message, status_code=500, details=details)


class NotFoundException(AppException):
    """
    Resource not found exception
    
    Raised when a requested resource does not exist.
    """
    
    def __init__(
        self,
        message: str = "Resource not found",
        details: Optional[dict[str, Any]] = None
    ):
        super().__init__(message, status_code=404, details=details)


class BadRequestException(AppException):
    """
    Bad request exception
    
    Raised when the request is malformed or invalid.
    """
    
    def __init__(
        self,
        message: str = "Bad request",
        details: Optional[dict[str, Any]] = None
    ):
        super().__init__(message, status_code=400, details=details)


class UnauthorizedException(AppException):
    """
    Unauthorized exception
    
    Raised when authentication is required but not provided.
    """
    
    def __init__(
        self,
        message: str = "Unauthorized",
        details: Optional[dict[str, Any]] = None
    ):
        super().__init__(message, status_code=401, details=details)


class ForbiddenException(AppException):
    """
    Forbidden exception
    
    Raised when the user is authenticated but lacks permission.
    """
    
    def __init__(
        self,
        message: str = "Forbidden",
        details: Optional[dict[str, Any]] = None
    ):
        super().__init__(message, status_code=403, details=details)


class ConflictException(AppException):
    """
    Conflict exception
    
    Raised when the request conflicts with current state.
    """
    
    def __init__(
        self,
        message: str = "Conflict",
        details: Optional[dict[str, Any]] = None
    ):
        super().__init__(message, status_code=409, details=details)


class ValidationException(AppException):
    """
    Validation exception
    
    Raised when request validation fails.
    """
    
    def __init__(
        self,
        message: str = "Validation failed",
        details: Optional[dict[str, Any]] = None
    ):
        super().__init__(message, status_code=422, details=details)


class RateLimitException(AppException):
    """
    Rate limit exception
    
    Raised when rate limit is exceeded.
    """
    
    def __init__(
        self,
        message: str = "Rate limit exceeded",
        details: Optional[dict[str, Any]] = None
    ):
        super().__init__(message, status_code=429, details=details)


class InternalServerException(AppException):
    """
    Internal server error exception
    
    Raised when an unexpected error occurs.
    """
    
    def __init__(
        self,
        message: str = "Internal server error",
        details: Optional[dict[str, Any]] = None
    ):
        super().__init__(message, status_code=500, details=details)
