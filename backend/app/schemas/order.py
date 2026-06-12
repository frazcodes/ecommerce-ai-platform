"""
Order Schemas

Purpose: Pydantic schemas for order request/response validation
Why it exists: Type-safe validation for order endpoints
Features: Create order, order history, order status, checkout
"""

from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field


class OrderItem(BaseModel):
    """
    Order item schema
    """
    product_id: str = Field(..., description="Product ID")
    product_name: str = Field(..., description="Product name")
    quantity: int = Field(..., ge=1, description="Item quantity")
    price: float = Field(..., ge=0, description="Item price")
    total: float = Field(..., ge=0, description="Item total (price * quantity)")


class Address(BaseModel):
    """
    Address schema
    """
    first_name: str = Field(..., description="First name")
    last_name: str = Field(..., description="Last name")
    street: str = Field(..., description="Street address")
    city: str = Field(..., description="City")
    state: str = Field(..., description="State")
    zip_code: str = Field(..., description="Zip code")
    country: str = Field(..., description="Country")
    phone: str = Field(..., description="Phone number")


class CreateOrderRequest(BaseModel):
    """
    Create order request schema
    """
    items: List[OrderItem] = Field(..., description="Order items")
    shipping_address: Address = Field(..., description="Shipping address")
    billing_address: Optional[Address] = Field(default=None, description="Billing address")
    payment_method: str = Field(..., description="Payment method")
    customer_notes: Optional[str] = Field(default=None, description="Customer notes")


class OrderResponse(BaseModel):
    """
    Order response schema
    """
    id: str = Field(..., description="Order ID")
    order_number: str = Field(..., description="Order number")
    user_id: str = Field(..., description="User ID")
    items: List[OrderItem] = Field(..., description="Order items")
    subtotal: float = Field(..., ge=0, description="Subtotal")
    discount_amount: float = Field(..., ge=0, description="Discount amount")
    shipping_cost: float = Field(..., ge=0, description="Shipping cost")
    tax_amount: float = Field(..., ge=0, description="Tax amount")
    total: float = Field(..., ge=0, description="Total amount")
    shipping_address: Address = Field(..., description="Shipping address")
    billing_address: Optional[Address] = Field(default=None, description="Billing address")
    payment_method: str = Field(..., description="Payment method")
    payment_status: str = Field(..., description="Payment status")
    payment_id: Optional[str] = Field(default=None, description="Payment transaction ID")
    status: str = Field(..., description="Order status")
    status_history: List[dict] = Field(default_factory=list, description="Status history")
    shipping_method: Optional[str] = Field(default=None, description="Shipping method")
    tracking_number: Optional[str] = Field(default=None, description="Tracking number")
    estimated_delivery: Optional[datetime] = Field(default=None, description="Estimated delivery date")
    actual_delivery: Optional[datetime] = Field(default=None, description="Actual delivery date")
    customer_notes: Optional[str] = Field(default=None, description="Customer notes")
    admin_notes: Optional[str] = Field(default=None, description="Admin notes")
    created_at: datetime = Field(..., description="Creation timestamp")


class OrderListResponse(BaseModel):
    """
    Order list response schema
    """
    orders: List[OrderResponse] = Field(..., description="List of orders")
    total: int = Field(..., description="Total number of orders")
    page: int = Field(..., description="Current page number")
    page_size: int = Field(..., description="Items per page")
    total_pages: int = Field(..., description="Total number of pages")


class OrderStatusResponse(BaseModel):
    """
    Order status response schema
    """
    order_id: str = Field(..., description="Order ID")
    order_number: str = Field(..., description="Order number")
    status: str = Field(..., description="Current status")
    status_history: List[dict] = Field(..., description="Status history")
    tracking_number: Optional[str] = Field(default=None, description="Tracking number")
    estimated_delivery: Optional[datetime] = Field(default=None, description="Estimated delivery date")


class CheckoutRequest(BaseModel):
    """
    Checkout request schema
    """
    shipping_address: Address = Field(..., description="Shipping address")
    billing_address: Optional[Address] = Field(default=None, description="Billing address")
    payment_method: str = Field(..., description="Payment method")
    customer_notes: Optional[str] = Field(default=None, description="Customer notes")


class CheckoutResponse(BaseModel):
    """
    Checkout response schema
    """
    order: OrderResponse = Field(..., description="Created order")
    message: str = Field(..., description="Success message")
