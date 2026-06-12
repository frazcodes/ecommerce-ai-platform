"""
AI Router

Purpose: API endpoints for AI-powered shopping assistant features
Why it exists: Provide intelligent product recommendations, comparison, and search
Features: Product recommendations, product comparison, smart search
"""

from typing import Optional
from fastapi import APIRouter, Depends, Query
from app.schemas.ai import (
    RecommendationRequest,
    RecommendationResponse,
    ComparisonRequest,
    ComparisonResponse,
    SmartSearchRequest,
    SmartSearchResponse
)
from app.services.ai_service import ai_service
from app.auth.dependencies import get_current_user, get_current_user_optional
from app.utils.response import success_response

router = APIRouter()


@router.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(
    request: RecommendationRequest,
    current_user: dict = Depends(get_current_user_optional)
):
    """
    Get product recommendations
    
    Returns AI-powered product recommendations based on user preferences,
    similar products, or category.
    """
    # If user is authenticated, use their ID for personalized recommendations
    user_id = current_user["id"] if current_user else request.user_id
    
    result = await ai_service.get_recommendations(
        user_id=user_id,
        product_id=request.product_id,
        category_id=request.category_id,
        limit=request.limit
    )
    return result


@router.post("/compare", response_model=ComparisonResponse)
async def compare_products(request: ComparisonRequest):
    """
    Compare multiple products
    
    Compares multiple products side by side and provides AI recommendations.
    """
    result = await ai_service.compare_products(product_ids=request.product_ids)
    return result


@router.post("/search", response_model=SmartSearchResponse)
async def smart_search(request: SmartSearchRequest):
    """
    Smart search with AI query understanding
    
    Performs intelligent search with natural language query understanding
    and returns relevant products.
    """
    result = await ai_service.smart_search(
        query=request.query,
        category_id=request.category_id,
        min_price=request.min_price,
        max_price=request.max_price,
        page=request.page,
        page_size=request.page_size
    )
    return result


@router.get("/recommendations/for-me", response_model=RecommendationResponse)
async def get_personalized_recommendations(
    limit: int = Query(default=10, ge=1, le=50, description="Number of recommendations"),
    current_user: dict = Depends(get_current_user)
):
    """
    Get personalized recommendations for authenticated user
    
    Returns personalized product recommendations based on the user's
    purchase history and preferences.
    """
    result = await ai_service.get_recommendations(
        user_id=current_user["id"],
        limit=limit
    )
    return result
