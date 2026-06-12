"""
Order Service

Purpose: Business logic for order operations
Why it exists: Separate order logic from route handlers
Features: Create order, get order history, get order status, checkout
"""

from typing import Dict, Any, List
from datetime import datetime
import random
import string
from bson import ObjectId
from app.database.mongodb import mongodb
from app.services.cart_service import cart_service
from app.utils.exceptions import NotFoundException, BadRequestException


class OrderService:
    """
    Order service
    
    Handles order creation, retrieval, and status tracking.
    """
    
    def _generate_order_number(self) -> str:
        """
        Generate unique order number
        
        Returns:
            Unique order number
        """
        timestamp = datetime.utcnow().strftime("%Y%m%d")
        random_str = ''.join(random.choices(string.digits, k=6))
        return f"ORD-{timestamp}-{random_str}"
    
    async def create_order(
        self,
        user_id: str,
        items: List[Dict],
        shipping_address: Dict,
        billing_address: Dict = None,
        payment_method: str = "credit_card",
        customer_notes: str = None
    ) -> Dict[str, Any]:
        """
        Create a new order
        
        Args:
            user_id: User ID
            items: Order items
            shipping_address: Shipping address
            billing_address: Billing address (optional)
            payment_method: Payment method
            customer_notes: Customer notes (optional)
        
        Returns:
            Created order data
        """
        orders_collection = mongodb.get_collection("orders")
        
        # Calculate totals
        subtotal = sum(item.get("total", 0) for item in items)
        shipping_cost = 0.0  # Calculate based on shipping method
        tax_amount = subtotal * 0.1  # 10% tax
        total = subtotal + shipping_cost + tax_amount
        
        # Generate order number
        order_number = self._generate_order_number()
        
        # Create status history
        status_history = [
            {
                "status": "pending",
                "timestamp": datetime.utcnow().isoformat(),
                "note": "Order placed"
            }
        ]
        
        # Create order document
        order_doc = {
            "order_number": order_number,
            "user_id": user_id,
            "items": items,
            "subtotal": subtotal,
            "discount_amount": 0.0,
            "shipping_cost": shipping_cost,
            "tax_amount": tax_amount,
            "total": total,
            "shipping_address": shipping_address,
            "billing_address": billing_address or shipping_address,
            "payment_method": payment_method,
            "payment_status": "pending",
            "payment_id": None,
            "status": "pending",
            "status_history": status_history,
            "shipping_method": "standard",
            "tracking_number": None,
            "estimated_delivery": None,
            "actual_delivery": None,
            "customer_notes": customer_notes,
            "admin_notes": None,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert order
        result = await orders_collection.insert_one(order_doc)
        order_id = str(result.inserted_id)
        
        # Clear user's cart
        try:
            await cart_service.clear_cart(user_id=user_id)
        except:
            pass  # Don't fail order creation if cart clear fails
        
        # Return order
        order_doc["_id"] = order_id
        return order_doc
    
    async def checkout(
        self,
        user_id: str,
        shipping_address: Dict,
        billing_address: Dict = None,
        payment_method: str = "credit_card",
        customer_notes: str = None
    ) -> Dict[str, Any]:
        """
        Checkout - Create order from cart
        
        Args:
            user_id: User ID
            shipping_address: Shipping address
            billing_address: Billing address (optional)
            payment_method: Payment method
            customer_notes: Customer notes (optional)
        
        Returns:
            Created order data
        """
        # Get user's cart
        cart = await cart_service.get_cart(user_id=user_id)
        
        if not cart.get("items"):
            raise BadRequestException("Cart is empty")
        
        # Create order from cart items
        order = await self.create_order(
            user_id=user_id,
            items=cart["items"],
            shipping_address=shipping_address,
            billing_address=billing_address,
            payment_method=payment_method,
            customer_notes=customer_notes
        )
        
        return order
    
    async def get_order_by_id(self, order_id: str, user_id: str) -> Dict[str, Any]:
        """
        Get order by ID
        
        Args:
            order_id: Order ID
            user_id: User ID (for authorization)
        
        Returns:
            Order data
        
        Raises:
            NotFoundException: If order not found
        """
        orders_collection = mongodb.get_collection("orders")
        
        try:
            order = await orders_collection.find_one({"_id": ObjectId(order_id)})
        except:
            raise NotFoundException("Invalid order ID")
        
        if not order:
            raise NotFoundException("Order not found")
        
        # Check if order belongs to user
        if order.get("user_id") != user_id:
            raise NotFoundException("Order not found")
        
        order["_id"] = str(order["_id"])
        
        return order
    
    async def get_user_orders(
        self,
        user_id: str,
        page: int = 1,
        page_size: int = 20,
        status: str = None
    ) -> Dict[str, Any]:
        """
        Get user's order history
        
        Args:
            user_id: User ID
            page: Page number
            page_size: Items per page
            status: Filter by status (optional)
        
        Returns:
            Orders list with pagination metadata
        """
        orders_collection = mongodb.get_collection("orders")
        
        # Build filter query
        filter_query = {"user_id": user_id}
        
        if status:
            filter_query["status"] = status
        
        # Get total count
        total = await orders_collection.count_documents(filter_query)
        
        # Calculate pagination
        skip = (page - 1) * page_size
        total_pages = (total + page_size - 1) // page_size if page_size > 0 else 0
        
        # Get orders
        cursor = orders_collection.find(filter_query).sort([("created_at", -1)]).skip(skip).limit(page_size)
        orders = await cursor.to_list(length=page_size)
        
        # Convert ObjectId to string
        for order in orders:
            order["_id"] = str(order["_id"])
        
        return {
            "orders": orders,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages
        }
    
    async def get_order_status(self, order_id: str, user_id: str) -> Dict[str, Any]:
        """
        Get order status
        
        Args:
            order_id: Order ID
            user_id: User ID (for authorization)
        
        Returns:
            Order status data
        
        Raises:
            NotFoundException: If order not found
        """
        order = await self.get_order_by_id(order_id=order_id, user_id=user_id)
        
        return {
            "order_id": order["_id"],
            "order_number": order["order_number"],
            "status": order["status"],
            "status_history": order["status_history"],
            "tracking_number": order.get("tracking_number"),
            "estimated_delivery": order.get("estimated_delivery")
        }
    
    async def update_order_status(
        self,
        order_id: str,
        status: str,
        note: str = None
    ) -> Dict[str, Any]:
        """
        Update order status (admin only)
        
        Args:
            order_id: Order ID
            status: New status
            note: Status note
        
        Returns:
            Updated order data
        """
        orders_collection = mongodb.get_collection("orders")
        
        try:
            order = await orders_collection.find_one({"_id": ObjectId(order_id)})
        except:
            raise NotFoundException("Invalid order ID")
        
        if not order:
            raise NotFoundException("Order not found")
        
        # Add to status history
        status_history = order.get("status_history", [])
        status_history.append({
            "status": status,
            "timestamp": datetime.utcnow().isoformat(),
            "note": note or f"Status changed to {status}"
        })
        
        # Update order
        update_data = {
            "status": status,
            "status_history": status_history,
            "updated_at": datetime.utcnow()
        }
        
        await orders_collection.update_one(
            {"_id": ObjectId(order_id)},
            {"$set": update_data}
        )
        
        order["_id"] = str(order["_id"])
        order.update(update_data)
        
        return order


# Global order service instance
order_service = OrderService()
