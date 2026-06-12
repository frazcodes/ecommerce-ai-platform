"""
Categories Router

Purpose: API endpoints for categories
Why it exists: Handle category retrieval and hierarchy
Features: Get categories, get category details, root categories, subcategories
"""

from typing import Optional
from fastapi import APIRouter, Query
from app.schemas.category import CategoryResponse, CategoryListResponse
from app.services.category_service import category_service
from app.utils.response import success_response

router = APIRouter()


@router.get("", response_model=CategoryListResponse)
async def get_categories(
    active_only: bool = Query(default=True, description="Only active categories")
):
    """
    Get all categories
    
    Returns a list of all categories.
    """
    result = await category_service.get_categories(active_only=active_only)
    return result


@router.get("/root")
async def get_root_categories():
    """
    Get root categories
    
    Returns categories without a parent (top-level categories).
    """
    categories = await category_service.get_root_categories()
    return success_response(data={"categories": categories})


@router.get("/featured")
async def get_featured_categories(
    limit: int = Query(default=10, ge=1, le=50, description="Maximum number of categories")
):
    """
    Get featured categories
    
    Returns a list of featured categories.
    """
    categories = await category_service.get_featured_categories(limit=limit)
    return success_response(data={"categories": categories})


@router.get("/{category_id}/subcategories")
async def get_subcategories(category_id: str):
    """
    Get subcategories of a parent category
    
    Returns all subcategories of the specified parent category.
    """
    categories = await category_service.get_subcategories(parent_id=category_id)
    return success_response(data={"categories": categories})


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(category_id: str):
    """
    Get category by ID
    
    Returns detailed information about a specific category.
    """
    category = await category_service.get_category_by_id(category_id=category_id)
    return category
