"""
AI Service

Purpose: AI-powered shopping assistant features
Why it exists: Provide intelligent product recommendations, comparison, and search
Features: Product recommendations, product comparison, smart search
"""

from typing import Dict, Any, List
from bson import ObjectId
from app.database.mongodb import mongodb
from app.utils.exceptions import NotFoundException


class AIService:
    """
    AI service
    
    Handles AI-powered features including recommendations, comparison, and smart search.
    """
    
    async def get_recommendations(
        self,
        user_id: str = None,
        product_id: str = None,
        category_id: str = None,
        limit: int = 10
    ) -> Dict[str, Any]:
        """
        Get product recommendations
        
        Args:
            user_id: User ID for personalized recommendations
            product_id: Product ID for similar products
            category_id: Category ID for category-based recommendations
            limit: Number of recommendations
        
        Returns:
            Recommended products with reason and algorithm
        """
        products_collection = mongodb.get_collection("products")
        
        algorithm = "popular"
        reason = "Popular products"
        products = []
        
        if product_id:
            # Similar products based on category and price range
            algorithm = "similar_products"
            reason = "Products similar to the selected item"
            
            try:
                product = await products_collection.find_one({"_id": ObjectId(product_id)})
                if product:
                    price_range = product.get("price", 0) * 0.2  # 20% price range
                    min_price = product.get("price", 0) - price_range
                    max_price = product.get("price", 0) + price_range
                    
                    cursor = products_collection.find({
                        "_id": {"$ne": ObjectId(product_id)},
                        "category_id": product.get("category_id"),
                        "price": {"$gte": max(0, min_price), "$lte": max_price},
                        "is_active": True
                    }).sort([("rating", -1), ("review_count", -1)]).limit(limit)
                    
                    products = await cursor.to_list(length=limit)
            except:
                pass
        
        elif category_id:
            # Category-based recommendations
            algorithm = "category_based"
            reason = "Top products in this category"
            
            cursor = products_collection.find({
                "category_id": category_id,
                "is_active": True
            }).sort([("rating", -1), ("review_count", -1), ("is_featured", -1)]).limit(limit)
            
            products = await cursor.to_list(length=limit)
        
        elif user_id:
            # Personalized recommendations based on user's order history
            algorithm = "personalized"
            reason = "Recommended for you based on your purchase history"
            
            orders_collection = mongodb.get_collection("orders")
            orders = await orders_collection.find({"user_id": user_id}).to_list(length=10)
            
            # Get categories from user's orders
            product_ids = []
            for order in orders:
                for item in order.get("items", []):
                    product_ids.append(item.get("product_id"))
            
            # Get products from those categories
            if product_ids:
                cursor = products_collection.find({
                    "_id": {"$nin": [ObjectId(pid) for pid in product_ids if self._is_valid_objectid(pid)]},
                    "is_active": True
                }).sort([("rating", -1), ("is_featured", -1)]).limit(limit)
                
                products = await cursor.to_list(length=limit)
        
        else:
            # Popular products
            algorithm = "popular"
            reason = "Trending products"
            
            cursor = products_collection.find({
                "is_active": True
            }).sort([("rating", -1), ("review_count", -1), ("is_featured", -1)]).limit(limit)
            
            products = await cursor.to_list(length=limit)
        
        # Convert ObjectId to string
        for product in products:
            product["_id"] = str(product["_id"])
        
        return {
            "products": products,
            "reason": reason,
            "algorithm": algorithm
        }
    
    def _is_valid_objectid(self, id_str: str) -> bool:
        """Check if string is a valid ObjectId"""
        try:
            ObjectId(id_str)
            return True
        except:
            return False
    
    async def compare_products(self, product_ids: List[str]) -> Dict[str, Any]:
        """
        Compare multiple products
        
        Args:
            product_ids: List of product IDs to compare
        
        Returns:
            Products with comparison data and recommendation
        """
        products_collection = mongodb.get_collection("products")
        
        products = []
        for product_id in product_ids:
            try:
                product = await products_collection.find_one({"_id": ObjectId(product_id)})
                if product:
                    product["_id"] = str(product["_id"])
                    products.append(product)
            except:
                continue
        
        if not products:
            raise NotFoundException("No valid products found")
        
        # Build comparison data
        comparison = {
            "prices": [p.get("price", 0) for p in products],
            "ratings": [p.get("rating", 0) for p in products],
            "stock": [p.get("stock", 0) for p in products],
            "brands": [p.get("brand", "Unknown") for p in products],
            "features": {}
        }
        
        # Find best value (highest rating / price ratio)
        best_value_idx = 0
        best_ratio = 0
        for i, product in enumerate(products):
            price = product.get("price", 0)
            rating = product.get("rating", 0)
            if price > 0:
                ratio = rating / price
                if ratio > best_ratio:
                    best_ratio = ratio
                    best_value_idx = i
        
        # Find highest rated
        highest_rated_idx = max(range(len(products)), key=lambda i: products[i].get("rating", 0))
        
        # Find lowest price
        lowest_price_idx = min(range(len(products)), key=lambda i: products[i].get("price", float('inf')))
        
        comparison["best_value"] = best_value_idx
        comparison["highest_rated"] = highest_rated_idx
        comparison["lowest_price"] = lowest_price_idx
        
        # AI recommendation
        recommendation = f"We recommend {products[best_value_idx].get('name', 'Product')} as it offers the best value for money."
        
        return {
            "products": products,
            "comparison": comparison,
            "recommendation": recommendation
        }
    
    async def smart_search(
        self,
        query: str,
        category_id: str = None,
        min_price: float = None,
        max_price: float = None,
        page: int = 1,
        page_size: int = 20
    ) -> Dict[str, Any]:
        """
        Smart search with query understanding
        
        Args:
            query: Natural language search query
            category_id: Filter by category
            min_price: Minimum price
            max_price: Maximum price
            page: Page number
            page_size: Items per page
        
        Returns:
            Search results with query understanding
        """
        products_collection = mongodb.get_collection("products")
        
        # Query understanding
        query_lower = query.lower()
        query_understanding = {
            "intent": "search",
            "keywords": query_lower.split(),
            "price_mentioned": False,
            "category_mentioned": False
        }
        
        # Detect price in query
        price_keywords = ["cheap", "expensive", "under", "below", "above", "less than", "more than"]
        if any(keyword in query_lower for keyword in price_keywords):
            query_understanding["price_mentioned"] = True
        
        # Build search query
        filter_query = {
            "is_active": True,
            "$or": [
                {"name": {"$regex": query, "$options": "i"}},
                {"description": {"$regex": query, "$options": "i"}},
                {"tags": {"$regex": query, "$options": "i"}},
                {"brand": {"$regex": query, "$options": "i"}}
            ]
        }
        
        if category_id:
            filter_query["category_id"] = category_id
            query_understanding["category_mentioned"] = True
        
        if min_price is not None:
            if "price" in filter_query:
                filter_query["price"]["$gte"] = min_price
            else:
                filter_query["price"] = {"$gte": min_price}
        
        if max_price is not None:
            if "price" in filter_query:
                filter_query["price"]["$lte"] = max_price
            else:
                filter_query["price"] = {"$lte": max_price}
        
        # Get total count
        total = await products_collection.count_documents(filter_query)
        
        # Calculate pagination
        skip = (page - 1) * page_size
        total_pages = (total + page_size - 1) // page_size if page_size > 0 else 0
        
        # Get products
        cursor = products_collection.find(filter_query).sort([("rating", -1), ("review_count", -1)]).skip(skip).limit(page_size)
        products = await cursor.to_list(length=page_size)
        
        # Convert ObjectId to string
        for product in products:
            product["_id"] = str(product["_id"])
        
        return {
            "products": products,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages,
            "query_understanding": query_understanding
        }


# Global AI service instance
ai_service = AIService()
