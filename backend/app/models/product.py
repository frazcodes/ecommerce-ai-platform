"""
Product Model

Purpose: MongoDB document model for products
Why it exists: Store product information for the e-commerce platform
Features: Product details, pricing, inventory, images, ratings
"""

from typing import Optional, List
from pydantic import Field, field_validator
from app.models.base import BaseDocument


class Product(BaseDocument):
    """
    Product document model
    
    Stores product information including details, pricing,
    inventory, images, and ratings.
    """
    
    # ==================== Basic Information ====================
    name: str = Field(..., min_length=1, max_length=200, description="Product name")
    description: str = Field(..., min_length=1, description="Product description")
    sku: str = Field(..., unique=True, description="Stock Keeping Unit (unique)")
    
    # ==================== Category & Brand ====================
    category_id: str = Field(..., description="Category ID reference")
    brand: Optional[str] = Field(default=None, max_length=100, description="Product brand")
    
    # ==================== Pricing ====================
    price: float = Field(..., gt=0, description="Current price")
    compare_at_price: Optional[float] = Field(default=None, gt=0, description="Original price for discount display")
    cost_price: Optional[float] = Field(default=None, gt=0, description="Cost price for profit calculation")
    
    # ==================== Inventory ====================
    stock: int = Field(default=0, ge=0, description="Available stock quantity")
    low_stock_threshold: int = Field(default=10, ge=0, description="Low stock alert threshold")
    
    # ==================== Images ====================
    images: List[str] = Field(default_factory=list, description="Product image URLs")
    thumbnail: Optional[str] = Field(default=None, description="Thumbnail image URL")
    
    # ==================== Variants ====================
    variants: Optional[List[dict]] = Field(
        default=None,
        description="Product variants (size, color, etc.)",
        examples=[
            [
                {
                    "id": "variant-1",
                    "name": "Size",
                    "value": "M",
                    "price_adjustment": 0,
                    "stock": 10
                }
            ]
        ]
    )
    
    # ==================== Attributes ====================
    attributes: Optional[dict] = Field(
        default=None,
        description="Product attributes (weight, dimensions, material, etc.)",
        examples=[
            {
                "weight": "1.5kg",
                "dimensions": "10x5x3 inches",
                "material": "Cotton"
            }
        ]
    )
    
    # ==================== SEO & Marketing ====================
    slug: Optional[str] = Field(default=None, description="URL-friendly slug")
    meta_title: Optional[str] = Field(default=None, max_length=60, description="SEO meta title")
    meta_description: Optional[str] = Field(default=None, max_length=160, description="SEO meta description")
    tags: List[str] = Field(default_factory=list, description="Product tags for search")
    
    # ==================== Status ====================
    is_active: bool = Field(default=True, description="Product active status")
    is_featured: bool = Field(default=False, description="Featured product flag")
    
    # ==================== Ratings ====================
    rating: float = Field(default=0.0, ge=0, le=5, description="Average rating")
    review_count: int = Field(default=0, ge=0, description="Number of reviews")
    
    @field_validator("slug")
    @classmethod
    def generate_slug_if_missing(cls, v: Optional[str], info) -> str:
        """Generate slug from name if not provided."""
        if v is None:
            name = info.data.get("name", "")
            v = name.lower().replace(" ", "-").replace("/", "-")
        return v
    
    @property
    def is_in_stock(self) -> bool:
        """Check if product is in stock."""
        return self.stock > 0
    
    @property
    def is_low_stock(self) -> bool:
        """Check if product has low stock."""
        return self.stock <= self.low_stock_threshold
    
    @property
    def discount_percentage(self) -> float:
        """Calculate discount percentage."""
        if self.compare_at_price and self.compare_at_price > self.price:
            return round(((self.compare_at_price - self.price) / self.compare_at_price) * 100, 2)
        return 0
