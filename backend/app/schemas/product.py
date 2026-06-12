"""
Product Schemas

Purpose: Pydantic schemas for product request/response validation
Why it exists: Type-safe validation for product endpoints
Features: Product list, product details, filter params, search params
"""

from typing import Optional, List
from pydantic import BaseModel, Field


class ProductResponse(BaseModel):
    """
    Product response schema
    """
    id: str = Field(..., description="Product ID")
    name: str = Field(..., description="Product name")
    description: str = Field(..., description="Product description")
    sku: str = Field(..., description="Stock Keeping Unit")
    category_id: str = Field(..., description="Category ID")
    brand: Optional[str] = Field(default=None, description="Product brand")
    price: float = Field(..., description="Current price")
    compare_at_price: Optional[float] = Field(default=None, description="Original price")
    stock: int = Field(..., description="Available stock")
    images: List[str] = Field(default_factory=list, description="Product images")
    thumbnail: Optional[str] = Field(default=None, description="Thumbnail image")
    is_active: bool = Field(..., description="Active status")
    is_featured: bool = Field(..., description="Featured status")
    rating: float = Field(..., description="Average rating")
    review_count: int = Field(..., description="Number of reviews")
    created_at: str = Field(..., description="Creation timestamp")


class ProductListResponse(BaseModel):
    """
    Product list response schema
    """
    products: List[ProductResponse] = Field(..., description="List of products")
    total: int = Field(..., description="Total number of products")
    page: int = Field(..., description="Current page number")
    page_size: int = Field(..., description="Items per page")
    total_pages: int = Field(..., description="Total number of pages")


class ProductFilterParams(BaseModel):
    """
    Product filter parameters
    """
    category_id: Optional[str] = Field(default=None, description="Filter by category")
    min_price: Optional[float] = Field(default=None, ge=0, description="Minimum price")
    max_price: Optional[float] = Field(default=None, ge=0, description="Maximum price")
    brand: Optional[str] = Field(default=None, description="Filter by brand")
    in_stock: Optional[bool] = Field(default=None, description="Only in stock products")
    is_featured: Optional[bool] = Field(default=None, description="Only featured products")
    sort_by: Optional[str] = Field(default="created_at", description="Sort field (created_at, price, rating, name)")
    sort_order: Optional[str] = Field(default="desc", description="Sort order (asc, desc)")


class ProductSearchParams(BaseModel):
    """
    Product search parameters
    """
    query: str = Field(..., min_length=1, description="Search query")
    page: int = Field(default=1, ge=1, description="Page number")
    page_size: int = Field(default=20, ge=1, le=100, description="Items per page")
