"""
Create Admin User Script

Run this script to create the initial admin user in MongoDB
"""

import asyncio
from datetime import datetime
from pymongo import MongoClient
import bcrypt

# MongoDB connection
MONGODB_URI = "mongodb+srv://fraz24931:fraz24931@cluster0.9elsi.mongodb.net/?appName=Cluster0"

async def create_admin():
    # Connect to MongoDB
    client = MongoClient(MONGODB_URI)
    db = client.smartcart_db
    users_collection = db.users
    
    # Check if admin already exists
    existing_admin = users_collection.find_one({"email": "admin@smartcart.com"})
    if existing_admin:
        print("Admin user already exists: admin@smartcart.com")
        return
    
    # Hash password
    password = "admin123"
    password_bytes = password.encode('utf-8')
    password_hash = bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode('utf-8')
    
    # Create admin user
    admin_user = {
        "email": "admin@smartcart.com",
        "username": "admin",
        "password_hash": password_hash,
        "role": "admin",
        "is_active": True,
        "is_verified": True,
        "first_name": "Admin",
        "last_name": "User",
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    # Insert admin user
    result = users_collection.insert_one(admin_user)
    print(f"Admin user created successfully: admin@smartcart.com")
    print(f"User ID: {result.inserted_id}")
    print(f"Email: admin@smartcart.com")
    print(f"Password: admin123")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_admin())
