"""
Category Service

Purpose: Business logic for category operations
Why it exists: Separate category logic from route handlers
Features: Get categories, get category details, hierarchy
"""

from typing import List, Dict, Any
from bson import ObjectId
from app.database.mongodb import mongodb
from app.utils.exceptions import NotFoundException


class CategoryService:
    """
    Category service
    
    Handles category retrieval and hierarchy.
    """
    
    async def get_categories(self, active_only: bool = True) -> Dict[str, Any]:
        """
        Get all categories
        
        Args:
            active_only: Only return active categories
        
        Returns:
            Categories list with total count
        """
        categories_collection = mongodb.get_collection("categories")
        
        filter_query = {}
        if active_only:
            filter_query["is_active"] = True
        
        cursor = categories_collection.find(filter_query).sort([("display_order", 1), ("name", 1)])
        categories = await cursor.to_list(length=None)
        
        # Convert ObjectId to string
        for category in categories:
            category["_id"] = str(category["_id"])
        
        return {
            "categories": categories,
            "total": len(categories)
        }
    
    async def get_category_by_id(self, category_id: str) -> Dict[str, Any]:
        """
        Get category by ID
        
        Args:
            category_id: Category ID
        
        Returns:
            Category data
        
        Raises:
            NotFoundException: If category not found
        """
        categories_collection = mongodb.get_collection("categories")
        
        try:
            category = await categories_collection.find_one({"_id": ObjectId(category_id)})
        except:
            raise NotFoundException("Invalid category ID")
        
        if not category:
            raise NotFoundException("Category not found")
        
        category["_id"] = str(category["_id"])
        
        return category
    
    async def get_root_categories(self) -> List[Dict[str, Any]]:
        """
        Get root categories (categories without parent)
        
        Returns:
            List of root categories
        """
        categories_collection = mongodb.get_collection("categories")
        
        cursor = categories_collection.find({
            "parent_id": None,
            "is_active": True
        }).sort([("display_order", 1), ("name", 1)])
        
        categories = await cursor.to_list(length=None)
        
        for category in categories:
            category["_id"] = str(category["_id"])
        
        return categories
    
    async def get_subcategories(self, parent_id: str) -> List[Dict[str, Any]]:
        """
        Get subcategories of a parent category
        
        Args:
            parent_id: Parent category ID
        
        Returns:
            List of subcategories
        """
        categories_collection = mongodb.get_collection("categories")
        
        cursor = categories_collection.find({
            "parent_id": parent_id,
            "is_active": True
        }).sort([("display_order", 1), ("name", 1)])
        
        categories = await cursor.to_list(length=None)
        
        for category in categories:
            category["_id"] = str(category["_id"])
        
        return categories
    
    async def get_featured_categories(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get featured categories
        
        Args:
            limit: Maximum number of categories to return
        
        Returns:
            List of featured categories
        """
        categories_collection = mongodb.get_collection("categories")
        
        cursor = categories_collection.find({
            "is_active": True,
            "is_featured": True
        }).sort([("display_order", 1), ("name", 1)]).limit(limit)
        
        categories = await cursor.to_list(length=limit)
        
        for category in categories:
            category["_id"] = str(category["_id"])
        
        return categories


# Global category service instance
category_service = CategoryService()
