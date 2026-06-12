"""
MongoDB Database Connection Module

Purpose: Async MongoDB connection management using Motor
Why it exists: Centralized database connection with lifecycle management
Features: Connection pooling, async operations, FastAPI integration
"""

from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional, Dict, Any, List
from app.config.settings import settings


class MongoDB:
    """
    MongoDB Connection Manager
    
    Manages the async MongoDB connection using Motor.
    Provides connection lifecycle management for FastAPI application.
    """
    
    client: Optional[AsyncIOMotorClient] = None
    database = None
    use_mock = False
    mock_data: Dict[str, List[Dict[str, Any]]] = {}
    
    async def connect_to_database(self) -> None:
        """
        Establish connection to MongoDB Atlas
        
        Creates the Motor client and connects to the database.
        Should be called during FastAPI startup event.
        """
        if self.client is None:
            print("=" * 60)
            print("Attempting to connect to MongoDB Atlas...")
            print(f"MongoDB URI: {settings.MONGODB_URI[:30]}...{settings.MONGODB_URI[-10:]}")
            print(f"Database: {settings.MONGODB_DATABASE}")
            print("=" * 60)
            
            try:
                # Use the SRV URI directly (Motor handles SRV records)
                mongodb_uri = settings.MONGODB_URI
                
                print(f"Connection URI format: {'SRV' if 'mongodb+srv://' in mongodb_uri else 'Direct'}")
                
                self.client = AsyncIOMotorClient(
                    mongodb_uri,
                    serverSelectionTimeoutMS=15000,
                    socketTimeoutMS=15000,
                    connectTimeoutMS=15000,
                    retryWrites=True,
                    w="majority"
                )
                
                print("Testing connection with ping command...")
                # Test connection
                await self.client.admin.command('ping')
                self.database = self.client[settings.MONGODB_DATABASE]
                
                print("=" * 60)
                print("✅ Successfully connected to MongoDB Atlas!")
                print(f"Database: {settings.MONGODB_DATABASE}")
                print(f"Cluster: cluster0.9elsi.mongodb.net")
                print("=" * 60)
                
            except Exception as e:
                print("=" * 60)
                print("❌ MongoDB Atlas connection failed!")
                print(f"Error type: {type(e).__name__}")
                print(f"Error message: {str(e)}")
                print("=" * 60)
                
                # Analyze the error
                error_str = str(e).lower()
                if "authentication" in error_str or "auth" in error_str:
                    print("⚠️  Possible cause: Invalid username or password")
                elif "network" in error_str or "dns" in error_str or "getaddrinfo" in error_str:
                    print("⚠️  Possible cause: Network/DNS issue or Atlas Network Access not configured")
                elif "timeout" in error_str:
                    print("⚠️  Possible cause: Connection timeout - check network connectivity")
                elif "ssl" in error_str or "tls" in error_str:
                    print("⚠️  Possible cause: SSL/TLS configuration issue")
                
                print("Switching to in-memory mock database for testing")
                print("=" * 60)
                
                self.client = None
                self.database = None
                self.use_mock = True
                self._initialize_mock_data()
    
    async def close_database_connection(self) -> None:
        """
        Close MongoDB connection
        
        Closes the Motor client connection.
        Should be called during FastAPI shutdown event.
        """
        if self.client:
            self.client.close()
            self.client = None
            self.database = None
            print("Disconnected from MongoDB")
    
    def _initialize_mock_data(self):
        """Initialize mock data for testing"""
        from datetime import datetime
        from app.auth.password import hash_password
        from bson import ObjectId
        
        # Create admin user
        admin_password_hash = hash_password("admin123")
        admin_user = {
            "_id": str(ObjectId()),
            "email": "admin@smartcart.com",
            "username": "admin",
            "password_hash": admin_password_hash,
            "role": "admin",
            "is_active": True,
            "is_verified": True,
            "first_name": "Admin",
            "last_name": "User",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        self.mock_data = {
            "users": [admin_user],
            "products": [],
            "categories": [],
            "orders": [],
            "cart": [],
            "wishlist": [],
            "reviews": []
        }
        print("Mock database initialized with admin user: admin@smartcart.com / admin123")
    
    def get_database(self):
        """
        Get the database instance
        
        Returns:
            AsyncIOMotorDatabase: MongoDB database instance
        
        Raises:
            RuntimeError: If database connection is not established
        """
        if self.use_mock:
            return self  # Return self for mock operations
        if self.database is None:
            raise RuntimeError("Database connection not established. Call connect_to_database() first.")
        return self.database
    
    def get_collection(self, collection_name: str):
        """
        Get a specific collection from the database
        
        Args:
            collection_name: Name of the collection
        
        Returns:
            AsyncIOMotorCollection: MongoDB collection instance
        
        Raises:
            RuntimeError: If database connection is not established
        """
        if self.use_mock:
            return MockCollection(collection_name, self.mock_data)
        database = self.get_database()
        return database[collection_name]


class MockCollection:
    """Mock collection for in-memory testing"""
    
    def __init__(self, name: str, data: Dict[str, List[Dict[str, Any]]]):
        self.name = name
        self.data = data
        if name not in data:
            data[name] = []
    
    async def find_one(self, query: Dict[str, Any]):
        """Mock find_one"""
        collection = self.data.get(self.name, [])
        for item in collection:
            match = True
            for key, value in query.items():
                if key not in item or item[key] != value:
                    match = False
                    break
            if match:
                return item
        return None
    
    async def find(self, query: Dict[str, Any] = None):
        """Mock find"""
        collection = self.data.get(self.name, [])
        if not query:
            return MockCursor(collection)
        
        filtered = []
        for item in collection:
            match = True
            for key, value in query.items():
                if key not in item or item[key] != value:
                    match = False
                    break
            if match:
                filtered.append(item)
        return MockCursor(filtered)
    
    async def insert_one(self, document: Dict[str, Any]):
        """Mock insert_one"""
        from bson import ObjectId
        if "_id" not in document:
            document["_id"] = str(ObjectId())
        self.data[self.name].append(document)
        return type('obj', (object,), {'inserted_id': document["_id"]})
    
    async def update_one(self, query: Dict[str, Any], update: Dict[str, Any]):
        """Mock update_one"""
        collection = self.data.get(self.name, [])
        for item in collection:
            match = True
            for key, value in query.items():
                if key not in item or item[key] != value:
                    match = False
                    break
            if match:
                if "$set" in update:
                    item.update(update["$set"])
                return type('obj', (object,), {'modified_count': 1})
        return type('obj', (object,), {'modified_count': 0})
    
    async def delete_one(self, query: Dict[str, Any]):
        """Mock delete_one"""
        collection = self.data.get(self.name, [])
        for i, item in enumerate(collection):
            match = True
            for key, value in query.items():
                if key not in item or item[key] != value:
                    match = False
                    break
            if match:
                collection.pop(i)
                return type('obj', (object,), {'deleted_count': 1})
        return type('obj', (object,), {'deleted_count': 0})
    
    async def count_documents(self, query: Dict[str, Any] = None):
        """Mock count_documents"""
        collection = self.data.get(self.name, [])
        if not query:
            return len(collection)
        
        count = 0
        for item in collection:
            match = True
            for key, value in query.items():
                if key not in item or item[key] != value:
                    match = False
                    break
            if match:
                count += 1
        return count


class MockCursor:
    """Mock cursor for in-memory testing"""
    
    def __init__(self, data: List[Dict[str, Any]]):
        self.data = data
    
    def sort(self, sort_spec):
        """Mock sort"""
        return self
    
    def skip(self, skip: int):
        """Mock skip"""
        self.data = self.data[skip:]
        return self
    
    def limit(self, limit: int):
        """Mock limit"""
        self.data = self.data[:limit]
        return self
    
    async def to_list(self, length: int = None):
        """Mock to_list"""
        return self.data


# Global MongoDB instance
mongodb = MongoDB()


async def get_database():
    """
    Dependency function to get database instance
    
    Can be used as a FastAPI dependency:
        @app.get("/items")
        async def get_items(db = Depends(get_database)):
            ...
    
    Returns:
        AsyncIOMotorDatabase: MongoDB database instance
    """
    return mongodb.get_database()


async def get_collection(collection_name: str):
    """
    Dependency function to get a specific collection
    
    Can be used as a FastAPI dependency:
        @app.get("/items")
        async def get_items(items = Depends(get_collection("items"))):
            ...
    
    Args:
        collection_name: Name of the collection
    
    Returns:
        AsyncIOMotorCollection: MongoDB collection instance
    """
    return mongodb.get_collection(collection_name)
