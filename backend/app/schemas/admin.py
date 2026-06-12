"""
Admin Schemas

Purpose: Pydantic schemas for admin request/response validation
Why it exists: Type-safe validation for admin endpoints
Features: Product CRUD, user management, order management
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class CreateProductRequest(BaseModel):
    """
    Create product request schema (admin)
    """
    name: str = Field(..., min_length=1, max_length=200, description="Product name")
    description: str = Field(..., min_length=1, description="Product description")
    sku: str = Field(..., description="Stock Keeping Unit")
    category_id: str = Field(..., description="Category ID")
    brand: Optional[str] = Field(default=None, max_length=100, description="Product brand")
    price: float = Field(..., gt=0, description="Current price")
    compare_at_price: Optional[float] = Field(default=None, gt=0, description="Original price")
    cost_price: Optional[float] = Field(default=None, gt=0, description="Cost price")
    stock: int = Field(default=0, ge=0, description="Available stock")
    low_stock_threshold: int = Field(default=10, ge=0, description="Low stock threshold")
    images: List[str] = Field(default_factory=list, description="Product images")
    thumbnail: Optional[str] = Field(default=None, description="Thumbnail image")
    is_active: bool = Field(default=True, description="Active status")
    is_featured: bool = Field(default=False, description="Featured status")


class UpdateProductRequest(BaseModel):
    """
    Update product request schema (admin)
    """
    name: Optional[str] = Field(default=None, min_length=1, max_length=200, description="Product name")
    description: Optional[str] = Field(default=None, min_length=1, description="Product description")
    sku: Optional[str] = Field(default=None, description="Stock Keeping Unit")
    category_id: Optional[str] = Field(default=None, description="Category ID")
    brand: Optional[str] = Field(default=None, max_length=100, description="Product brand")
    price: Optional[float] = Field(default=None, gt=0, description="Current price")
    compare_at_price: Optional[float] = Field(default=None, gt=0, description="Original price")
    cost_price: Optional[float] = Field(default=None, gt=0, description="Cost price")
    stock: Optional[int] = Field(default=None, ge=0, description="Available stock")
    low_stock_threshold: Optional[int] = Field(default=None, ge=0, description="Low stock threshold")
    images: Optional[List[str]] = Field(default=None, description="Product images")
    thumbnail: Optional[str] = Field(default=None, description="Thumbnail image")
    is_active: Optional[bool] = Field(default=None, description="Active status")
    is_featured: Optional[bool] = Field(default=None, description="Featured status")


class UpdateUserRoleRequest(BaseModel):
    """
    Update user role request schema (admin)
    """
    role: str = Field(..., description="User role (user, admin, superadmin)")
    is_active: Optional[bool] = Field(default=None, description="Account active status")


class UserManagementResponse(BaseModel):
    """
    User management response schema
    """
    id: str = Field(..., description="User ID")
    email: str = Field(..., description="User email")
    username: str = Field(..., description="Username")
    first_name: Optional[str] = Field(default=None, description="First name")
    last_name: Optional[str] = Field(default=None, description="Last name")
    role: str = Field(..., description="User role")
    is_active: bool = Field(..., description="Account active status")
    is_verified: bool = Field(..., description="Email verification status")
    created_at: datetime = Field(..., description="Creation timestamp")
    last_login: Optional[datetime] = Field(default=None, description="Last login timestamp")


class UpdateOrderStatusRequest(BaseModel):
    """
    Update order status request schema (admin)
    """
    status: str = Field(..., description="New order status")
    note: Optional[str] = Field(default=None, description="Status note")
    tracking_number: Optional[str] = Field(default=None, description="Tracking number")


class AdminStatsResponse(BaseModel):
    """
    Admin statistics response schema
    """
    total_users: int = Field(..., description="Total users")
    total_products: int = Field(..., description="Total products")
    total_orders: int = Field(..., description="Total orders")
    total_revenue: float = Field(..., description="Total revenue")
    pending_orders: int = Field(..., description="Pending orders")
    low_stock_products: int = Field(..., description="Low stock products")
