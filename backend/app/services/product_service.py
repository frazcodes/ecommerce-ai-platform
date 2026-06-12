"""
Product Service

Purpose: Business logic for product operations
Why it exists: Separate product logic from route handlers
Features: Get products, get product details, search, filter, pagination
"""

from typing import List, Optional, Dict, Any
from bson import ObjectId
from datetime import datetime
from app.database.mongodb import mongodb
from app.utils.exceptions import NotFoundException


class ProductService:
    """
    Product service
    
    Handles product retrieval, search, filtering, and pagination.
    """
    
    async def get_products(
        self,
        page: int = 1,
        page_size: int = 20,
        category_id: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        brand: Optional[str] = None,
        in_stock: Optional[bool] = None,
        is_featured: Optional[bool] = None,
        sort_by: str = "created_at",
        sort_order: str = "desc"
    ) -> Dict[str, Any]:
        """
        Get products with filtering and pagination
        
        Args:
            page: Page number
            page_size: Items per page
            category_id: Filter by category
            min_price: Minimum price
            max_price: Maximum price
            brand: Filter by brand
            in_stock: Only in stock products
            is_featured: Only featured products
            sort_by: Sort field
            sort_order: Sort order (asc/desc)
        
        Returns:
            Products list with pagination metadata
        """
        products_collection = mongodb.get_collection("products")
        
        # Build filter query
        filter_query = {"is_active": True}
        
        if category_id:
            filter_query["category_id"] = category_id
        
        if min_price is not None:
            filter_query["price"] = {"$gte": min_price}
        
        if max_price is not None:
            if "price" in filter_query:
                filter_query["price"]["$lte"] = max_price
            else:
                filter_query["price"] = {"$lte": max_price}
        
        if brand:
            filter_query["brand"] = brand
        
        if in_stock:
            filter_query["stock"] = {"$gt": 0}
        
        if is_featured is not None:
            filter_query["is_featured"] = is_featured
        
        # Build sort query
        sort_direction = 1 if sort_order == "asc" else -1
        sort_query = [(sort_by, sort_direction)]
        
        # Get total count
        total = await products_collection.count_documents(filter_query)
        
        # Calculate pagination
        skip = (page - 1) * page_size
        total_pages = (total + page_size - 1) // page_size if page_size > 0 else 0
        
        # Get products
        cursor = products_collection.find(filter_query).sort(sort_query).skip(skip).limit(page_size)
        products = await cursor.to_list(length=page_size)
        
        # Convert ObjectId to string
        for product in products:
            product["_id"] = str(product["_id"])
        
        return {
            "products": products,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages
        }
    
    async def get_product_by_id(self, product_id: str) -> Dict[str, Any]:
        """
        Get product by ID
        
        Args:
            product_id: Product ID
        
        Returns:
            Product data
        
        Raises:
            NotFoundException: If product not found
        """
        products_collection = mongodb.get_collection("products")
        
        try:
            product = await products_collection.find_one({"_id": ObjectId(product_id)})
        except:
            raise NotFoundException("Invalid product ID")
        
        if not product:
            raise NotFoundException("Product not found")
        
        product["_id"] = str(product["_id"])
        
        return product
    
    async def search_products(
        self,
        query: str,
        page: int = 1,
        page_size: int = 20
    ) -> Dict[str, Any]:
        """
        Search products by name or description
        
        Args:
            query: Search query
            page: Page number
            page_size: Items per page
        
        Returns:
            Products list with pagination metadata
        """
        products_collection = mongodb.get_collection("products")
        
        # Build search query
        filter_query = {
            "is_active": True,
            "$or": [
                {"name": {"$regex": query, "$options": "i"}},
                {"description": {"$regex": query, "$options": "i"}},
                {"tags": {"$regex": query, "$options": "i"}}
            ]
        }
        
        # Get total count
        total = await products_collection.count_documents(filter_query)
        
        # Calculate pagination
        skip = (page - 1) * page_size
        total_pages = (total + page_size - 1) // page_size if page_size > 0 else 0
        
        # Get products
        cursor = products_collection.find(filter_query).sort([("created_at", -1)]).skip(skip).limit(page_size)
        products = await cursor.to_list(length=page_size)
        
        # Convert ObjectId to string
        for product in products:
            product["_id"] = str(product["_id"])
        
        return {
            "products": products,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages
        }
    
    async def get_featured_products(self, limit: int = 10) -> List[Dict[str, Any]]:
        """
        Get featured products
        
        Args:
            limit: Maximum number of products to return
        
        Returns:
            List of featured products
        """
        products_collection = mongodb.get_collection("products")
        
        cursor = products_collection.find({
            "is_active": True,
            "is_featured": True
        }).sort([("created_at", -1)]).limit(limit)
        
        products = await cursor.to_list(length=limit)
        
        for product in products:
            product["_id"] = str(product["_id"])
        
        return products
    
    async def create_product(self, product_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Create a new product (admin)
        
        Args:
            product_data: Product data
        
        Returns:
            Created product data
        """
        products_collection = mongodb.get_collection("products")
        
        # Check if SKU already exists
        existing = await products_collection.find_one({"sku": product_data["sku"]})
        if existing:
            raise ValueError("SKU already exists")
        
        # Add timestamps
        product_data["created_at"] = datetime.utcnow()
        product_data["updated_at"] = datetime.utcnow()
        product_data["rating"] = 0.0
        product_data["review_count"] = 0
        
        # Insert product
        result = await products_collection.insert_one(product_data)
        product_id = str(result.inserted_id)
        
        # Return created product
        product_data["_id"] = product_id
        return product_data
    
    async def update_product(self, product_id: str, update_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Update a product (admin)
        
        Args:
            product_id: Product ID
            update_data: Data to update
        
        Returns:
            Updated product data
        
        Raises:
            NotFoundException: If product not found
        """
        products_collection = mongodb.get_collection("products")
        
        try:
            product = await products_collection.find_one({"_id": ObjectId(product_id)})
        except:
            raise NotFoundException("Invalid product ID")
        
        if not product:
            raise NotFoundException("Product not found")
        
        # Check if SKU is being changed and if it already exists
        if "sku" in update_data and update_data["sku"] != product.get("sku"):
            existing = await products_collection.find_one({"sku": update_data["sku"]})
            if existing:
                raise ValueError("SKU already exists")
        
        # Update timestamp
        update_data["updated_at"] = datetime.utcnow()
        
        # Update product
        await products_collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": update_data}
        )
        
        # Return updated product
        updated_product = await products_collection.find_one({"_id": ObjectId(product_id)})
        updated_product["_id"] = str(updated_product["_id"])
        
        return updated_product
    
    async def delete_product(self, product_id: str) -> None:
        """
        Delete a product (admin)
        
        Args:
            product_id: Product ID
        
        Raises:
            NotFoundException: If product not found
        """
        products_collection = mongodb.get_collection("products")
        
        try:
            result = await products_collection.delete_one({"_id": ObjectId(product_id)})
        except:
            raise NotFoundException("Invalid product ID")
        
        if result.deleted_count == 0:
            raise NotFoundException("Product not found")
    
    async def get_all_products_admin(
        self,
        page: int = 1,
        page_size: int = 20,
        include_inactive: bool = False
    ) -> Dict[str, Any]:
        """
        Get all products (admin) - including inactive
        
        Args:
            page: Page number
            page_size: Items per page
            include_inactive: Include inactive products
        
        Returns:
            Products list with pagination metadata
        """
        products_collection = mongodb.get_collection("products")
        
        # Build filter query
        filter_query = {}
        if not include_inactive:
            filter_query["is_active"] = True
        
        # Get total count
        total = await products_collection.count_documents(filter_query)
        
        # Calculate pagination
        skip = (page - 1) * page_size
        total_pages = (total + page_size - 1) // page_size if page_size > 0 else 0
        
        # Get products
        cursor = products_collection.find(filter_query).sort([("created_at", -1)]).skip(skip).limit(page_size)
        products = await cursor.to_list(length=page_size)
        
        # Convert ObjectId to string
        for product in products:
            product["_id"] = str(product["_id"])
        
        return {
            "products": products,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages
        }


# Global product service instance
product_service = ProductService()
