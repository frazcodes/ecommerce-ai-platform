"""
Cart Model

Purpose: MongoDB document model for shopping cart
Why it exists: Store user's shopping cart items
Features: Cart items, quantity, pricing, user reference
"""

from typing import List
from pydantic import Field
from app.models.base import BaseDocument


class Cart(BaseDocument):
    """
    Cart document model
    
    Stores shopping cart items for a user.
    Each user has one cart document.
    """
    
    # ==================== User Reference ====================
    user_id: str = Field(..., description="User ID reference")
    
    # ==================== Cart Items ====================
    items: List[dict] = Field(
        default_factory=list,
        description="Cart items",
        examples=[
            [
                {
                    "product_id": "product-123",
                    "product_name": "Product Name",
                    "quantity": 2,
                    "price": 99.99,
                    "total": 199.98,
                    "image": "https://example.com/image.jpg",
                    "variant": {
                        "size": "M",
                        "color": "Red"
                    }
                }
            ]
        ]
    )
    
    # ==================== Pricing ====================
    subtotal: float = Field(default=0.0, ge=0, description="Cart subtotal")
    
    @property
    def item_count(self) -> int:
        """Get total number of items in cart."""
        return len(self.items)
    
    @property
    def total_quantity(self) -> int:
        """Get total quantity of all items."""
        return sum(item.get("quantity", 0) for item in self.items)
    
    @property
    def is_empty(self) -> bool:
        """Check if cart is empty."""
        return len(self.items) == 0
