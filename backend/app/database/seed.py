"""
Database Seed Script

Purpose: Seed initial data for the application
Why it exists: Create initial admin user and sample data
Features: Create admin user if not exists
"""

from datetime import datetime
from app.database.mongodb import mongodb
import bcrypt


async def seed_admin_user():
    """
    Create initial admin user if not exists
    
    Creates an admin user with email: admin@smartcart.com
    and password: admin123
    """
    users_collection = mongodb.get_collection("users")
    
    # Check if admin user already exists
    existing_admin = await users_collection.find_one({"email": "admin@smartcart.com"})
    
    if existing_admin:
        print("Admin user already exists: admin@smartcart.com")
        return existing_admin
    
    # Create admin user using bcrypt directly
    password = "admin123"
    password_bytes = password.encode('utf-8')
    password_hash = bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode('utf-8')
    
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
    
    result = await users_collection.insert_one(admin_user)
    print(f"Admin user created successfully: admin@smartcart.com (ID: {result.inserted_id})")
    
    return admin_user


async def seed_database():
    """
    Seed database with initial data
    """
    print("Seeding database...")
    
    try:
        await seed_admin_user()
        print("Database seeding completed successfully")
    except Exception as e:
        print(f"Error seeding database: {e}")
        print("Skipping seed - you can create admin manually via API or MongoDB")
