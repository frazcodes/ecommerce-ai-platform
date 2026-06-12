"""
Category Model

Purpose: MongoDB document model for product categories
Why it exists: Organize products into hierarchical categories
Features: Category hierarchy, images, SEO, ordering
"""

from typing import Optional, List
from pydantic import Field, field_validator
from app.models.base import BaseDocument


class Category(BaseDocument):
    """
    Category document model
    
    Stores category information for organizing products.
    Supports hierarchical structure with parent-child relationships.
    """
    
    # ==================== Basic Information ====================
    name: str = Field(..., min_length=1, max_length=100, description="Category name")
    description: Optional[str] = Field(default=None, description="Category description")
    
    # ==================== Hierarchy ====================
    parent_id: Optional[str] = Field(default=None, description="Parent category ID for hierarchy")
    level: int = Field(default=0, ge=0, description="Category level in hierarchy")
    
    # ==================== Images ====================
    image: Optional[str] = Field(default=None, description="Category image URL")
    icon: Optional[str] = Field(default=None, description="Category icon URL")
    
    # ==================== SEO ====================
    slug: Optional[str] = Field(default=None, description="URL-friendly slug")
    meta_title: Optional[str] = Field(default=None, max_length=60, description="SEO meta title")
    meta_description: Optional[str] = Field(default=None, max_length=160, description="SEO meta description")
    
    # ==================== Display ====================
    is_active: bool = Field(default=True, description="Category active status")
    is_featured: bool = Field(default=False, description="Featured category flag")
    display_order: int = Field(default=0, ge=0, description="Display order for sorting")
    
    # ==================== Statistics ====================
    product_count: int = Field(default=0, ge=0, description="Number of products in category")
    
    @field_validator("slug")
    @classmethod
    def generate_slug_if_missing(cls, v: Optional[str], info) -> str:
        """Generate slug from name if not provided."""
        if v is None:
            name = info.data.get("name", "")
            v = name.lower().replace(" ", "-").replace("/", "-")
        return v
    
    @property
    def is_subcategory(self) -> bool:
        """Check if this is a subcategory."""
        return self.parent_id is not None
    
    @property
    def is_root_category(self) -> bool:
        """Check if this is a root category."""
        return self.parent_id is None
