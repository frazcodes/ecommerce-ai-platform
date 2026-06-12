"""
Products Router

Purpose: API endpoints for products
Why it exists: Handle product retrieval, search, and filtering
Features: Get products, get product details, search, filter, featured products
"""

from typing import Optional
from fastapi import APIRouter, Query
from app.schemas.product import ProductResponse, ProductListResponse
from app.services.product_service import product_service
from app.utils.response import success_response

router = APIRouter()


@router.get("", response_model=ProductListResponse)
async def get_products(
    page: int = Query(default=1, ge=1, description="Page number"),
    page_size: int = Query(default=20, ge=1, le=100, description="Items per page"),
    category_id: Optional[str] = Query(default=None, description="Filter by category"),
    min_price: Optional[float] = Query(default=None, ge=0, description="Minimum price"),
    max_price: Optional[float] = Query(default=None, ge=0, description="Maximum price"),
    brand: Optional[str] = Query(default=None, description="Filter by brand"),
    in_stock: Optional[bool] = Query(default=None, description="Only in stock products"),
    is_featured: Optional[bool] = Query(default=None, description="Only featured products"),
    sort_by: str = Query(default="created_at", description="Sort field (created_at, price, rating, name)"),
    sort_order: str = Query(default="desc", description="Sort order (asc, desc)")
):
    """
    Get products with filtering and pagination
    
    Returns a paginated list of products with optional filtering.
    """
    result = await product_service.get_products(
        page=page,
        page_size=page_size,
        category_id=category_id,
        min_price=min_price,
        max_price=max_price,
        brand=brand,
        in_stock=in_stock,
        is_featured=is_featured,
        sort_by=sort_by,
        sort_order=sort_order
    )
    return result


@router.get("/search", response_model=ProductListResponse)
async def search_products(
    query: str = Query(..., min_length=1, description="Search query"),
    page: int = Query(default=1, ge=1, description="Page number"),
    page_size: int = Query(default=20, ge=1, le=100, description="Items per page")
):
    """
    Search products by name or description
    
    Returns products matching the search query.
    """
    result = await product_service.search_products(
        query=query,
        page=page,
        page_size=page_size
    )
    return result


@router.get("/featured")
async def get_featured_products(
    limit: int = Query(default=10, ge=1, le=50, description="Maximum number of products")
):
    """
    Get featured products
    
    Returns a list of featured products.
    """
    products = await product_service.get_featured_products(limit=limit)
    return success_response(data={"products": products})


@router.get("/{product_id}", response_model=ProductResponse)
async def get_product(product_id: str):
    """
    Get product by ID
    
    Returns detailed information about a specific product.
    """
    product = await product_service.get_product_by_id(product_id=product_id)
    return product
