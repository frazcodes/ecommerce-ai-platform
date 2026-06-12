"""
Response Utilities Module

Purpose: Helper functions for consistent API responses
Why it exists: Standardized response format across all endpoints
Features: Success, error, paginated responses, type safety
"""

from typing import Any, Optional, Generic, TypeVar
from pydantic import BaseModel, Field
from datetime import datetime


# Generic type for response data
T = TypeVar('T')


class SuccessResponse(BaseModel, Generic[T]):
    """
    Standard success response model
    
    Provides consistent structure for successful API responses.
    """
    
    success: bool = Field(default=True, description="Indicates successful operation")
    message: Optional[str] = Field(default=None, description="Optional success message")
    data: Optional[T] = Field(default=None, description="Response data")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Response timestamp")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "success": True,
                    "message": "Operation successful",
                    "data": {},
                    "timestamp": "2024-01-01T00:00:00"
                }
            ]
        }
    }


class ErrorResponse(BaseModel):
    """
    Standard error response model
    
    Provides consistent structure for error responses.
    """
    
    success: bool = Field(default=False, description="Indicates failed operation")
    error: str = Field(description="Error message")
    details: Optional[dict[str, Any]] = Field(default=None, description="Additional error details")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Response timestamp")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "success": False,
                    "error": "Resource not found",
                    "details": {"resource_id": "123"},
                    "timestamp": "2024-01-01T00:00:00"
                }
            ]
        }
    }


class PaginatedResponse(BaseModel, Generic[T]):
    """
    Paginated response model
    
    Provides consistent structure for paginated data responses.
    """
    
    success: bool = Field(default=True, description="Indicates successful operation")
    data: list[T] = Field(description="List of items")
    total: int = Field(description="Total number of items")
    page: int = Field(description="Current page number")
    page_size: int = Field(description="Number of items per page")
    total_pages: int = Field(description="Total number of pages")
    timestamp: datetime = Field(default_factory=datetime.utcnow, description="Response timestamp")
    
    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "success": True,
                    "data": [],
                    "total": 100,
                    "page": 1,
                    "page_size": 10,
                    "total_pages": 10,
                    "timestamp": "2024-01-01T00:00:00"
                }
            ]
        }
    }


def success_response(
    data: Optional[Any] = None,
    message: Optional[str] = None,
    status_code: int = 200
) -> dict[str, Any]:
    """
    Create a success response
    
    Args:
        data: Response data
        message: Optional success message
        status_code: HTTP status code (default: 200)
    
    Returns:
        Dictionary with success response structure
    """
    return {
        "success": True,
        "message": message,
        "data": data,
        "timestamp": datetime.utcnow().isoformat()
    }


def error_response(
    error: str,
    details: Optional[dict[str, Any]] = None,
    status_code: int = 500
) -> dict[str, Any]:
    """
    Create an error response
    
    Args:
        error: Error message
        details: Optional error details
        status_code: HTTP status code (default: 500)
    
    Returns:
        Dictionary with error response structure
    """
    return {
        "success": False,
        "error": error,
        "details": details,
        "timestamp": datetime.utcnow().isoformat()
    }


def paginated_response(
    data: list[Any],
    total: int,
    page: int,
    page_size: int
) -> dict[str, Any]:
    """
    Create a paginated response
    
    Args:
        data: List of items
        total: Total number of items
        page: Current page number
        page_size: Number of items per page
    
    Returns:
        Dictionary with paginated response structure
    """
    total_pages = (total + page_size - 1) // page_size if page_size > 0 else 0
    
    return {
        "success": True,
        "data": data,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "timestamp": datetime.utcnow().isoformat()
    }
