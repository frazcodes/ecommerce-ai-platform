"""
Cart Router

Purpose: API endpoints for cart operations
Why it exists: Handle cart operations for authenticated users
Features: Add to cart, update quantity, remove item, clear cart, get cart
"""

from fastapi import APIRouter, Depends
from app.schemas.cart import (
    CartResponse,
    AddToCartRequest,
    UpdateCartItemRequest,
    CartStatsResponse
)
from app.services.cart_service import cart_service
from app.auth.dependencies import get_current_user
from app.utils.response import success_response

router = APIRouter()


@router.get("", response_model=CartResponse)
async def get_cart(current_user: dict = Depends(get_current_user)):
    """
    Get user's cart
    
    Returns the current user's shopping cart.
    """
    cart = await cart_service.get_cart(user_id=current_user["id"])
    return cart


@router.get("/stats", response_model=CartStatsResponse)
async def get_cart_stats(current_user: dict = Depends(get_current_user)):
    """
    Get cart statistics
    
    Returns cart statistics (item count, total quantity, subtotal).
    """
    stats = await cart_service.get_cart_stats(user_id=current_user["id"])
    return stats


@router.post("/items", response_model=CartResponse)
async def add_to_cart(
    request: AddToCartRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Add item to cart
    
    Adds a product to the user's cart.
    If the item already exists, updates the quantity.
    """
    cart = await cart_service.add_to_cart(
        user_id=current_user["id"],
        product_id=request.product_id,
        quantity=request.quantity,
        variant=request.variant
    )
    return cart


@router.put("/items/{product_id}", response_model=CartResponse)
async def update_cart_item(
    product_id: str,
    request: UpdateCartItemRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Update cart item quantity
    
    Updates the quantity of a specific item in the cart.
    """
    cart = await cart_service.update_cart_item(
        user_id=current_user["id"],
        product_id=product_id,
        quantity=request.quantity
    )
    return cart


@router.delete("/items/{product_id}", response_model=CartResponse)
async def remove_cart_item(
    product_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Remove item from cart
    
    Removes a specific item from the user's cart.
    """
    cart = await cart_service.remove_cart_item(
        user_id=current_user["id"],
        product_id=product_id
    )
    return cart


@router.delete("", response_model=CartResponse)
async def clear_cart(current_user: dict = Depends(get_current_user)):
    """
    Clear cart
    
    Removes all items from the user's cart.
    """
    cart = await cart_service.clear_cart(user_id=current_user["id"])
    return cart
