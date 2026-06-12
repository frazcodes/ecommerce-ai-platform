"""
Category Schemas

Purpose: Pydantic schemas for category request/response validation
Why it exists: Type-safe validation for category endpoints
Features: Category list, category details, hierarchy
"""

from typing import Optional, List
from pydantic import BaseModel, Field


class CategoryResponse(BaseModel):
    """
    Category response schema
    """
    id: str = Field(..., description="Category ID")
    name: str = Field(..., description="Category name")
    description: Optional[str] = Field(default=None, description="Category description")
    parent_id: Optional[str] = Field(default=None, description="Parent category ID")
    level: int = Field(..., description="Category level in hierarchy")
    image: Optional[str] = Field(default=None, description="Category image URL")
    icon: Optional[str] = Field(default=None, description="Category icon URL")
    slug: Optional[str] = Field(default=None, description="URL-friendly slug")
    is_active: bool = Field(..., description="Active status")
    is_featured: bool = Field(..., description="Featured status")
    display_order: int = Field(..., description="Display order")
    product_count: int = Field(..., description="Number of products")
    created_at: str = Field(..., description="Creation timestamp")


class CategoryListResponse(BaseModel):
    """
    Category list response schema
    """
    categories: List[CategoryResponse] = Field(..., description="List of categories")
    total: int = Field(..., description="Total number of categories")
