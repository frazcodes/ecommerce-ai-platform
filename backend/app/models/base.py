"""
Base Models Module

Purpose: Base Pydantic models for MongoDB documents
Why it exists: Common fields and structure for all database models
Features: Timestamps, ObjectId handling, base model inheritance
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field, ConfigDict
from bson import ObjectId


class PyObjectId(ObjectId):
    """
    Custom ObjectId type for Pydantic
    
    Allows MongoDB ObjectId to be used in Pydantic models.
    """
    
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)
    
    @classmethod
    def __get_pydantic_json_schema__(cls, core_schema, handler):
        return {"type": "string"}


class BaseDocument(BaseModel):
    """
    Base document model for MongoDB collections
    
    Provides common fields that all documents should have.
    All MongoDB document models should inherit from this class.
    """
    
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str}
    )
    
    id: Optional[PyObjectId] = Field(
        default=None,
        alias="_id",
        description="MongoDB ObjectId"
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Document creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Document last update timestamp"
    )
    
    def to_dict(self) -> dict:
        """
        Convert model to dictionary
        
        Returns:
            Dictionary representation of the model
        """
        return self.model_dump(by_alias=True, exclude_none=True)
    
    def to_json(self) -> str:
        """
        Convert model to JSON string
        
        Returns:
            JSON string representation of the model
        """
        return self.model_dump_json(by_alias=True, exclude_none=True)


class TimestampMixin(BaseModel):
    """
    Timestamp mixin for models that only need timestamps
    
    Provides created_at and updated_at fields without id.
    """
    
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Creation timestamp"
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="Last update timestamp"
    )
