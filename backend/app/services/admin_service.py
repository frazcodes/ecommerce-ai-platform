"""
Admin Service

Purpose: Business logic for admin operations
Why it exists: Separate admin logic from route handlers
Features: User management, statistics, admin operations
"""

from typing import Dict, Any, List
from bson import ObjectId
from app.database.mongodb import mongodb
from app.utils.exceptions import NotFoundException


class AdminService:
    """
    Admin service
    
    Handles admin operations including user management and statistics.
    """
    
    async def get_all_users(
        self,
        page: int = 1,
        page_size: int = 20
    ) -> Dict[str, Any]:
        """
        Get all users (admin)
        
        Args:
            page: Page number
            page_size: Items per page
        
        Returns:
            Users list with pagination metadata
        """
        users_collection = mongodb.get_collection("users")
        
        # Get total count
        total = await users_collection.count_documents({})
        
        # Calculate pagination
        skip = (page - 1) * page_size
        total_pages = (total + page_size - 1) // page_size if page_size > 0 else 0
        
        # Get users
        cursor = users_collection.find({}).sort([("created_at", -1)]).skip(skip).limit(page_size)
        users = await cursor.to_list(length=page_size)
        
        # Convert ObjectId to string and remove password
        for user in users:
            user["_id"] = str(user["_id"])
            user.pop("password_hash", None)
        
        return {
            "users": users,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages
        }
    
    async def update_user_role(
        self,
        user_id: str,
        role: str,
        is_active: bool = None
    ) -> Dict[str, Any]:
        """
        Update user role and status (admin)
        
        Args:
            user_id: User ID
            role: New role
            is_active: Active status (optional)
        
        Returns:
            Updated user data
        
        Raises:
            NotFoundException: If user not found
        """
        users_collection = mongodb.get_collection("users")
        
        try:
            user = await users_collection.find_one({"_id": ObjectId(user_id)})
        except:
            raise NotFoundException("Invalid user ID")
        
        if not user:
            raise NotFoundException("User not found")
        
        # Build update data
        update_data = {"role": role}
        if is_active is not None:
            update_data["is_active"] = is_active
        
        # Update user
        await users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        
        # Return updated user
        updated_user = await users_collection.find_one({"_id": ObjectId(user_id)})
        updated_user["_id"] = str(updated_user["_id"])
        updated_user.pop("password_hash", None)
        
        return updated_user
    
    async def get_admin_stats(self) -> Dict[str, Any]:
        """
        Get admin dashboard statistics
        
        Returns:
            Dashboard statistics
        """
        users_collection = mongodb.get_collection("users")
        products_collection = mongodb.get_collection("products")
        orders_collection = mongodb.get_collection("orders")
        
        # Get counts
        total_users = await users_collection.count_documents({})
        total_products = await products_collection.count_documents({})
        total_orders = await orders_collection.count_documents({})
        
        # Get pending orders
        pending_orders = await orders_collection.count_documents({"status": "pending"})
        
        # Get total revenue
        orders = await orders_collection.find({"status": {"$ne": "cancelled"}}).to_list(length=None)
        total_revenue = sum(order.get("total", 0) for order in orders)
        
        # Get low stock products
        low_stock_products = await products_collection.count_documents({
            "stock": {"$lte": "$low_stock_threshold"}
        })
        
        return {
            "total_users": total_users,
            "total_products": total_products,
            "total_orders": total_orders,
            "total_revenue": total_revenue,
            "pending_orders": pending_orders,
            "low_stock_products": low_stock_products
        }


# Global admin service instance
admin_service = AdminService()
