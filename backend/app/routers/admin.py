"""
Admin Router

Purpose: API endpoints for admin operations
Why it exists: Handle admin-only operations for product, user, and order management
Features: Product CRUD, user management, order management, statistics
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query
from bson import ObjectId
from app.database.mongodb import mongodb
from app.schemas.admin import (
    CreateProductRequest,
    UpdateProductRequest,
    UpdateUserRoleRequest,
    UserManagementResponse,
    UpdateOrderStatusRequest,
    AdminStatsResponse
)
from app.schemas.product import ProductResponse, ProductListResponse
from app.schemas.order import OrderResponse, OrderListResponse
from app.services.product_service import product_service
from app.services.admin_service import admin_service
from app.services.order_service import order_service
from app.auth.dependencies import get_current_user, require_role
from app.utils.response import success_response

router = APIRouter()


@router.get("/stats", response_model=AdminStatsResponse)
async def get_admin_stats(current_user: dict = Depends(require_role("admin"))):
    """
    Get admin dashboard statistics
    
    Returns statistics for the admin dashboard.
    Requires admin role.
    """
    stats = await admin_service.get_admin_stats()
    return stats


# ==================== Product Management ====================
@router.get("/products", response_model=ProductListResponse)
async def get_all_products_admin(
    page: int = Query(default=1, ge=1, description="Page number"),
    page_size: int = Query(default=20, ge=1, le=100, description="Items per page"),
    include_inactive: bool = Query(default=False, description="Include inactive products"),
    current_user: dict = Depends(require_role("admin"))
):
    """
    Get all products (admin)
    
    Returns all products including inactive ones.
    Requires admin role.
    """
    result = await product_service.get_all_products_admin(
        page=page,
        page_size=page_size,
        include_inactive=include_inactive
    )
    return result


@router.post("/products", response_model=ProductResponse)
async def create_product(
    request: CreateProductRequest,
    current_user: dict = Depends(require_role("admin"))
):
    """
    Create a new product (admin)
    
    Creates a new product with the provided data.
    Requires admin role.
    """
    product = await product_service.create_product(product_data=request.model_dump())
    return product


@router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: str,
    request: UpdateProductRequest,
    current_user: dict = Depends(require_role("admin"))
):
    """
    Update a product (admin)
    
    Updates an existing product with the provided data.
    Requires admin role.
    """
    # Filter out None values
    update_data = {k: v for k, v in request.model_dump().items() if v is not None}
    product = await product_service.update_product(product_id=product_id, update_data=update_data)
    return product


@router.delete("/products/{product_id}")
async def delete_product(
    product_id: str,
    current_user: dict = Depends(require_role("admin"))
):
    """
    Delete a product (admin)
    
    Deletes a product permanently.
    Requires admin role.
    """
    await product_service.delete_product(product_id=product_id)
    return success_response(message="Product deleted successfully")


# ==================== User Management ====================
@router.get("/users")
async def get_all_users(
    page: int = Query(default=1, ge=1, description="Page number"),
    page_size: int = Query(default=20, ge=1, le=100, description="Items per page"),
    current_user: dict = Depends(require_role("admin"))
):
    """
    Get all users (admin)
    
    Returns a paginated list of all users.
    Requires admin role.
    """
    result = await admin_service.get_all_users(page=page, page_size=page_size)
    return result


@router.put("/users/{user_id}", response_model=UserManagementResponse)
async def update_user_role(
    user_id: str,
    request: UpdateUserRoleRequest,
    current_user: dict = Depends(require_role("admin"))
):
    """
    Update user role and status (admin)
    
    Updates a user's role and active status.
    Requires admin role.
    """
    user = await admin_service.update_user_role(
        user_id=user_id,
        role=request.role,
        is_active=request.is_active
    )
    return user


# ==================== Order Management ====================
@router.get("/orders", response_model=OrderListResponse)
async def get_all_orders_admin(
    page: int = Query(default=1, ge=1, description="Page number"),
    page_size: int = Query(default=20, ge=1, le=100, description="Items per page"),
    status: Optional[str] = Query(default=None, description="Filter by status"),
    current_user: dict = Depends(require_role("admin"))
):
    """
    Get all orders (admin)
    
    Returns a paginated list of all orders.
    Requires admin role.
    """
    # Get all orders (not filtered by user_id)
    orders_collection = mongodb.get_collection("orders")
    
    # Build filter query
    filter_query = {}
    if status:
        filter_query["status"] = status
    
    # Get total count
    total = await orders_collection.count_documents(filter_query)
    
    # Calculate pagination
    skip = (page - 1) * page_size
    total_pages = (total + page_size - 1) // page_size if page_size > 0 else 0
    
    # Get orders
    cursor = orders_collection.find(filter_query).sort([("created_at", -1)]).skip(skip).limit(page_size)
    orders = await cursor.to_list(length=page_size)
    
    # Convert ObjectId to string
    for order in orders:
        order["_id"] = str(order["_id"])
    
    return {
        "orders": orders,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages
    }


@router.put("/orders/{order_id}/status", response_model=OrderResponse)
async def update_order_status_admin(
    order_id: str,
    request: UpdateOrderStatusRequest,
    current_user: dict = Depends(require_role("admin"))
):
    """
    Update order status (admin)
    
    Updates an order's status and adds tracking information.
    Requires admin role.
    """
    order = await order_service.update_order_status(
        order_id=order_id,
        status=request.status,
        note=request.note
    )
    
    # Update tracking number if provided
    if request.tracking_number:
        orders_collection = mongodb.get_collection("orders")
        await orders_collection.update_one(
            {"_id": ObjectId(order_id)},
            {"$set": {"tracking_number": request.tracking_number}}
        )
        order["tracking_number"] = request.tracking_number
    
    return order
