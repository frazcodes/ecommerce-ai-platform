"""
Orders Router

Purpose: API endpoints for order operations
Why it exists: Handle order creation, history, and status tracking
Features: Create order, checkout, order history, order status
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.schemas.order import (
    OrderResponse,
    OrderListResponse,
    CreateOrderRequest,
    CheckoutRequest,
    CheckoutResponse,
    OrderStatusResponse
)
from app.services.order_service import order_service
from app.auth.dependencies import get_current_user
from app.utils.response import success_response

router = APIRouter()


@router.post("", response_model=OrderResponse)
async def create_order(
    request: CreateOrderRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Create a new order
    
    Creates a new order with the provided items and shipping details.
    """
    order = await order_service.create_order(
        user_id=current_user["id"],
        items=[item.model_dump() for item in request.items],
        shipping_address=request.shipping_address.model_dump(),
        billing_address=request.billing_address.model_dump() if request.billing_address else None,
        payment_method=request.payment_method,
        customer_notes=request.customer_notes
    )
    return order


@router.post("/checkout", response_model=CheckoutResponse)
async def checkout(
    request: CheckoutRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Checkout - Create order from cart
    
    Creates an order from the user's current cart and clears the cart.
    """
    order = await order_service.checkout(
        user_id=current_user["id"],
        shipping_address=request.shipping_address.model_dump(),
        billing_address=request.billing_address.model_dump() if request.billing_address else None,
        payment_method=request.payment_method,
        customer_notes=request.customer_notes
    )
    return {
        "order": order,
        "message": "Order created successfully"
    }


@router.get("", response_model=OrderListResponse)
async def get_order_history(
    page: int = Query(default=1, ge=1, description="Page number"),
    page_size: int = Query(default=20, ge=1, le=100, description="Items per page"),
    status: Optional[str] = Query(default=None, description="Filter by status"),
    current_user: dict = Depends(get_current_user)
):
    """
    Get user's order history
    
    Returns a paginated list of the user's orders.
    """
    result = await order_service.get_user_orders(
        user_id=current_user["id"],
        page=page,
        page_size=page_size,
        status=status
    )
    return result


@router.get("/{order_id}", response_model=OrderResponse)
async def get_order(
    order_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get order by ID
    
    Returns detailed information about a specific order.
    """
    order = await order_service.get_order_by_id(
        order_id=order_id,
        user_id=current_user["id"]
    )
    return order


@router.get("/{order_id}/status", response_model=OrderStatusResponse)
async def get_order_status(
    order_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Get order status
    
    Returns the current status and status history of an order.
    """
    status = await order_service.get_order_status(
        order_id=order_id,
        user_id=current_user["id"]
    )
    return status
