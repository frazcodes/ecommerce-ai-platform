"""
Wishlist Model

Purpose: MongoDB document model for user wishlist
Why it exists: Store user's wishlist items for later purchase
Features: Wishlist items, user reference, timestamps
"""

from typing import List
from pydantic import Field
from app.models.base import BaseDocument


class Wishlist(BaseDocument):
    """
    Wishlist document model
    
    Stores wishlist items for a user.
    Each user has one wishlist document.
    """
    
    # ==================== User Reference ====================
    user_id: str = Field(..., description="User ID reference")
    
    # ==================== Wishlist Items ====================
    items: List[str] = Field(
        default_factory=list,
        description="List of product IDs in wishlist"
    )
    
    @property
    def item_count(self) -> int:
        """Get number of items in wishlist."""
        return len(self.items)
    
    @property
    def is_empty(self) -> bool:
        """Check if wishlist is empty."""
        return len(self.items) == 0
