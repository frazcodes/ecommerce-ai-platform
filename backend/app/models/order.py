"""
Order Model

Purpose: MongoDB document model for orders
Why it exists: Store order information and track order status
Features: Order items, shipping, payment, status tracking
"""

from typing import Optional, List
from datetime import datetime
from pydantic import Field, field_validator
from app.models.base import BaseDocument


class Order(BaseDocument):
    """
    Order document model
    
    Stores order information including items, shipping details,
    payment information, and order status.
    """
    
    # ==================== Order Information ====================
    order_number: str = Field(..., unique=True, description="Unique order number")
    user_id: str = Field(..., description="User ID reference")
    
    # ==================== Order Items ====================
    items: List[dict] = Field(
        ...,
        description="Order items",
        examples=[
            [
                {
                    "product_id": "product-123",
                    "product_name": "Product Name",
                    "quantity": 2,
                    "price": 99.99,
                    "total": 199.98
                }
            ]
        ]
    )
    
    # ==================== Pricing ====================
    subtotal: float = Field(..., ge=0, description="Subtotal before discounts and shipping")
    discount_amount: float = Field(default=0.0, ge=0, description="Discount amount")
    shipping_cost: float = Field(default=0.0, ge=0, description="Shipping cost")
    tax_amount: float = Field(default=0.0, ge=0, description="Tax amount")
    total: float = Field(..., ge=0, description="Total order amount")
    
    # ==================== Shipping Address ====================
    shipping_address: dict = Field(
        ...,
        description="Shipping address",
        examples=[
            {
                "first_name": "John",
                "last_name": "Doe",
                "street": "123 Main St",
                "city": "New York",
                "state": "NY",
                "zip_code": "10001",
                "country": "USA",
                "phone": "+1234567890"
            }
        ]
    )
    
    # ==================== Billing Address ====================
    billing_address: Optional[dict] = Field(default=None, description="Billing address")
    
    # ==================== Payment ====================
    payment_method: str = Field(..., description="Payment method (credit_card, paypal, etc.)")
    payment_status: str = Field(default="pending", description="Payment status (pending, paid, failed, refunded)")
    payment_id: Optional[str] = Field(default=None, description="Payment transaction ID")
    
    # ==================== Status ====================
    status: str = Field(default="pending", description="Order status (pending, processing, shipped, delivered, cancelled)")
    status_history: List[dict] = Field(
        default_factory=list,
        description="Order status history",
        examples=[
            [
                {
                    "status": "pending",
                    "timestamp": "2024-01-01T00:00:00",
                    "note": "Order placed"
                }
            ]
        ]
    )
    
    # ==================== Shipping ====================
    shipping_method: Optional[str] = Field(default=None, description="Shipping method")
    tracking_number: Optional[str] = Field(default=None, description="Shipping tracking number")
    estimated_delivery: Optional[datetime] = Field(default=None, description="Estimated delivery date")
    actual_delivery: Optional[datetime] = Field(default=None, description="Actual delivery date")
    
    # ==================== Notes ====================
    customer_notes: Optional[str] = Field(default=None, description="Customer notes")
    admin_notes: Optional[str] = Field(default=None, description="Admin notes")
    
    @field_validator("status")
    @classmethod
    def validate_status(cls, v: str) -> str:
        """Validate order status."""
        allowed_statuses = ["pending", "processing", "shipped", "delivered", "cancelled", "refunded"]
        if v not in allowed_statuses:
            raise ValueError(f"Status must be one of {allowed_statuses}")
        return v
    
    @field_validator("payment_status")
    @classmethod
    def validate_payment_status(cls, v: str) -> str:
        """Validate payment status."""
        allowed_statuses = ["pending", "paid", "failed", "refunded"]
        if v not in allowed_statuses:
            raise ValueError(f"Payment status must be one of {allowed_statuses}")
        return v
    
    @property
    def is_paid(self) -> bool:
        """Check if order is paid."""
        return self.payment_status == "paid"
    
    @property
    def is_delivered(self) -> bool:
        """Check if order is delivered."""
        return self.status == "delivered"
    
    @property
    def is_cancelled(self) -> bool:
        """Check if order is cancelled."""
        return self.status == "cancelled"
