"""
Cart Service

Purpose: Business logic for cart operations
Why it exists: Separate cart logic from route handlers
Features: Add to cart, update quantity, remove item, clear cart, get cart
"""

from typing import Dict, Any
from datetime import datetime
from bson import ObjectId
from app.database.mongodb import mongodb
from app.utils.exceptions import NotFoundException, BadRequestException


class CartService:
    """
    Cart service
    
    Handles cart operations for users.
    """
    
    async def get_cart(self, user_id: str) -> Dict[str, Any]:
        """
        Get user's cart
        
        Args:
            user_id: User ID
        
        Returns:
            Cart data
        """
        cart_collection = mongodb.get_collection("carts")
        
        cart = await cart_collection.find_one({"user_id": user_id})
        
        if not cart:
            # Create empty cart
            cart = {
                "user_id": user_id,
                "items": [],
                "subtotal": 0.0,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            result = await cart_collection.insert_one(cart)
            cart["_id"] = str(result.inserted_id)
        else:
            cart["_id"] = str(cart["_id"])
        
        return cart
    
    async def add_to_cart(
        self,
        user_id: str,
        product_id: str,
        quantity: int = 1,
        variant: Dict = None
    ) -> Dict[str, Any]:
        """
        Add item to cart
        
        Args:
            user_id: User ID
            product_id: Product ID
            quantity: Quantity to add
            variant: Product variant (optional)
        
        Returns:
            Updated cart data
        """
        cart_collection = mongodb.get_collection("carts")
        products_collection = mongodb.get_collection("products")
        
        # Get product details
        try:
            product = await products_collection.find_one({"_id": ObjectId(product_id)})
        except:
            raise BadRequestException("Invalid product ID")
        
        if not product:
            raise NotFoundException("Product not found")
        
        if not product.get("is_active", True):
            raise BadRequestException("Product is not available")
        
        if product.get("stock", 0) < quantity:
            raise BadRequestException("Insufficient stock")
        
        # Get or create cart
        cart = await cart_collection.find_one({"user_id": user_id})
        
        if not cart:
            cart = {
                "user_id": user_id,
                "items": [],
                "subtotal": 0.0,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
        
        # Check if item already exists in cart
        item_found = False
        for item in cart["items"]:
            if item["product_id"] == product_id:
                # Update quantity
                item["quantity"] += quantity
                item["total"] = item["quantity"] * item["price"]
                item_found = True
                break
        
        if not item_found:
            # Add new item
            cart_item = {
                "product_id": product_id,
                "product_name": product.get("name", ""),
                "quantity": quantity,
                "price": product.get("price", 0),
                "total": quantity * product.get("price", 0),
                "image": product.get("thumbnail") or (product.get("images", [None])[0] if product.get("images") else None),
                "variant": variant
            }
            cart["items"].append(cart_item)
        
        # Recalculate subtotal
        cart["subtotal"] = sum(item.get("total", 0) for item in cart["items"])
        cart["updated_at"] = datetime.utcnow()
        
        # Save cart
        if "_id" in cart:
            await cart_collection.update_one(
                {"_id": cart["_id"]},
                {"$set": cart}
            )
            cart["_id"] = str(cart["_id"])
        else:
            result = await cart_collection.insert_one(cart)
            cart["_id"] = str(result.inserted_id)
        
        return cart
    
    async def update_cart_item(
        self,
        user_id: str,
        product_id: str,
        quantity: int
    ) -> Dict[str, Any]:
        """
        Update cart item quantity
        
        Args:
            user_id: User ID
            product_id: Product ID
            quantity: New quantity
        
        Returns:
            Updated cart data
        
        Raises:
            NotFoundException: If cart or item not found
        """
        cart_collection = mongodb.get_collection("carts")
        
        cart = await cart_collection.find_one({"user_id": user_id})
        
        if not cart:
            raise NotFoundException("Cart not found")
        
        # Find and update item
        item_found = False
        for item in cart["items"]:
            if item["product_id"] == product_id:
                item["quantity"] = quantity
                item["total"] = item["quantity"] * item["price"]
                item_found = True
                break
        
        if not item_found:
            raise NotFoundException("Item not found in cart")
        
        # Recalculate subtotal
        cart["subtotal"] = sum(item.get("total", 0) for item in cart["items"])
        cart["updated_at"] = datetime.utcnow()
        
        # Save cart
        await cart_collection.update_one(
            {"_id": cart["_id"]},
            {"$set": cart}
        )
        
        cart["_id"] = str(cart["_id"])
        
        return cart
    
    async def remove_cart_item(self, user_id: str, product_id: str) -> Dict[str, Any]:
        """
        Remove item from cart
        
        Args:
            user_id: User ID
            product_id: Product ID
        
        Returns:
            Updated cart data
        
        Raises:
            NotFoundException: If cart or item not found
        """
        cart_collection = mongodb.get_collection("carts")
        
        cart = await cart_collection.find_one({"user_id": user_id})
        
        if not cart:
            raise NotFoundException("Cart not found")
        
        # Remove item
        initial_count = len(cart["items"])
        cart["items"] = [item for item in cart["items"] if item["product_id"] != product_id]
        
        if len(cart["items"]) == initial_count:
            raise NotFoundException("Item not found in cart")
        
        # Recalculate subtotal
        cart["subtotal"] = sum(item.get("total", 0) for item in cart["items"])
        cart["updated_at"] = datetime.utcnow()
        
        # Save cart
        await cart_collection.update_one(
            {"_id": cart["_id"]},
            {"$set": cart}
        )
        
        cart["_id"] = str(cart["_id"])
        
        return cart
    
    async def clear_cart(self, user_id: str) -> Dict[str, Any]:
        """
        Clear all items from cart
        
        Args:
            user_id: User ID
        
        Returns:
            Updated cart data
        """
        cart_collection = mongodb.get_collection("carts")
        
        cart = await cart_collection.find_one({"user_id": user_id})
        
        if not cart:
            raise NotFoundException("Cart not found")
        
        # Clear items
        cart["items"] = []
        cart["subtotal"] = 0.0
        cart["updated_at"] = datetime.utcnow()
        
        # Save cart
        await cart_collection.update_one(
            {"_id": cart["_id"]},
            {"$set": cart}
        )
        
        cart["_id"] = str(cart["_id"])
        
        return cart
    
    async def get_cart_stats(self, user_id: str) -> Dict[str, Any]:
        """
        Get cart statistics
        
        Args:
            user_id: User ID
        
        Returns:
            Cart statistics
        """
        cart = await self.get_cart(user_id)
        
        item_count = len(cart.get("items", []))
        total_quantity = sum(item.get("quantity", 0) for item in cart.get("items", []))
        subtotal = cart.get("subtotal", 0.0)
        
        return {
            "item_count": item_count,
            "total_quantity": total_quantity,
            "subtotal": subtotal
        }


# Global cart service instance
cart_service = CartService()
