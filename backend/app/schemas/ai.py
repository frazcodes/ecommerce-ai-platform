"""
AI Service Schemas

Purpose: Pydantic schemas for AI-powered features
Why it exists: Type-safe validation for AI endpoints
Features: Product recommendations, comparison, smart search
"""

from typing import Optional, List
from pydantic import BaseModel, Field


class RecommendationRequest(BaseModel):
    """
    Product recommendation request schema
    """
    user_id: Optional[str] = Field(default=None, description="User ID for personalized recommendations")
    product_id: Optional[str] = Field(default=None, description="Product ID for similar products")
    category_id: Optional[str] = Field(default=None, description="Category ID for category-based recommendations")
    limit: int = Field(default=10, ge=1, le=50, description="Number of recommendations")


class RecommendationResponse(BaseModel):
    """
    Product recommendation response schema
    """
    products: List[dict] = Field(..., description="Recommended products")
    reason: str = Field(..., description="Recommendation reason")
    algorithm: str = Field(..., description="Algorithm used")


class ComparisonRequest(BaseModel):
    """
    Product comparison request schema
    """
    product_ids: List[str] = Field(..., min_length=2, max_length=5, description="Product IDs to compare")


class ComparisonResponse(BaseModel):
    """
    Product comparison response schema
    """
    products: List[dict] = Field(..., description="Products being compared")
    comparison: dict = Field(..., description="Comparison data (prices, features, ratings)")
    recommendation: Optional[str] = Field(default=None, description="AI recommendation")


class SmartSearchRequest(BaseModel):
    """
    Smart search request schema
    """
    query: str = Field(..., min_length=2, description="Natural language search query")
    category_id: Optional[str] = Field(default=None, description="Filter by category")
    min_price: Optional[float] = Field(default=None, ge=0, description="Minimum price")
    max_price: Optional[float] = Field(default=None, ge=0, description="Maximum price")
    page: int = Field(default=1, ge=1, description="Page number")
    page_size: int = Field(default=20, ge=1, le=100, description="Items per page")


class SmartSearchResponse(BaseModel):
    """
    Smart search response schema
    """
    products: List[dict] = Field(..., description="Search results")
    total: int = Field(..., description="Total results")
    page: int = Field(..., description="Current page")
    page_size: int = Field(..., description="Items per page")
    total_pages: int = Field(..., description="Total pages")
    query_understanding: dict = Field(..., description="AI query analysis")
