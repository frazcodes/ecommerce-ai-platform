"""
Review Model

Purpose: MongoDB document model for product reviews
Why it exists: Store user reviews and ratings for products
Features: Rating, comment, user reference, product reference
"""

from typing import Optional
from pydantic import Field, field_validator
from app.models.base import BaseDocument


class Review(BaseDocument):
    """
    Review document model
    
    Stores product reviews and ratings from users.
    """
    
    # ==================== References ====================
    user_id: str = Field(..., description="User ID reference")
    product_id: str = Field(..., description="Product ID reference")
    order_id: Optional[str] = Field(default=None, description="Order ID reference (verified purchase)")
    
    # ==================== Rating ====================
    rating: int = Field(..., ge=1, le=5, description="Product rating (1-5)")
    
    # ==================== Review Content ====================
    title: Optional[str] = Field(default=None, max_length=100, description="Review title")
    comment: Optional[str] = Field(default=None, description="Review comment")
    
    # ==================== Images ====================
    images: list[str] = Field(default_factory=list, description="Review image URLs")
    
    # ==================== Verification ====================
    is_verified_purchase: bool = Field(default=False, description="Verified purchase flag")
    is_approved: bool = Field(default=True, description="Review approval status")
    
    # ==================== Helpful Votes ====================
    helpful_count: int = Field(default=0, ge=0, description="Number of helpful votes")
    
    @property
    def is_positive(self) -> bool:
        """Check if review is positive (4-5 stars)."""
        return self.rating >= 4
    
    @property
    def is_negative(self) -> bool:
        """Check if review is negative (1-2 stars)."""
        return self.rating <= 2
    
    @property
    def is_neutral(self) -> bool:
        """Check if review is neutral (3 stars)."""
        return self.rating == 3
