"""
Cart Schemas

Purpose: Pydantic schemas for cart request/response validation
Why it exists: Type-safe validation for cart endpoints
Features: Add to cart, update quantity, remove item, clear cart
"""

from typing import Optional, List
from pydantic import BaseModel, Field


class CartItem(BaseModel):
    """
    Cart item schema
    """
    product_id: str = Field(..., description="Product ID")
    product_name: str = Field(..., description="Product name")
    quantity: int = Field(..., ge=1, description="Item quantity")
    price: float = Field(..., ge=0, description="Item price")
    total: float = Field(..., ge=0, description="Item total (price * quantity)")
    image: Optional[str] = Field(default=None, description="Product image URL")
    variant: Optional[dict] = Field(default=None, description="Product variant (size, color, etc.)")


class CartResponse(BaseModel):
    """
    Cart response schema
    """
    id: str = Field(..., description="Cart ID")
    user_id: str = Field(..., description="User ID")
    items: List[CartItem] = Field(default_factory=list, description="Cart items")
    subtotal: float = Field(..., ge=0, description="Cart subtotal")
    created_at: str = Field(..., description="Creation timestamp")
    updated_at: str = Field(..., description="Last update timestamp")


class AddToCartRequest(BaseModel):
    """
    Add to cart request schema
    """
    product_id: str = Field(..., description="Product ID")
    quantity: int = Field(default=1, ge=1, le=100, description="Quantity to add")
    variant: Optional[dict] = Field(default=None, description="Product variant")


class UpdateCartItemRequest(BaseModel):
    """
    Update cart item request schema
    """
    quantity: int = Field(..., ge=1, le=100, description="New quantity")


class CartStatsResponse(BaseModel):
    """
    Cart statistics response schema
    """
    item_count: int = Field(..., description="Number of items in cart")
    total_quantity: int = Field(..., description="Total quantity of all items")
    subtotal: float = Field(..., ge=0, description="Cart subtotal")
