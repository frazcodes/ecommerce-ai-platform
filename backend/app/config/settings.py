"""
Configuration Management Module

Purpose: Centralized configuration management with Pydantic Settings
Why it exists: Type-safe configuration loading from environment variables
Features: Validation, type hints, default values, environment-based config
"""

from typing import List
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application Settings
    
    Loads configuration from environment variables and .env file.
    Provides type safety and validation for all configuration values.
    """
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )
    
    # ==================== Application Settings ====================
    APP_NAME: str = Field(default="SmartCart AI Backend", description="Application name")
    APP_VERSION: str = Field(default="1.0.0", description="Application version")
    ENVIRONMENT: str = Field(default="development", description="Environment (development/production)")
    DEBUG: bool = Field(default=True, description="Debug mode flag")
    
    # ==================== Server Settings ====================
    HOST: str = Field(default="0.0.0.0", description="Server host")
    PORT: int = Field(default=8000, description="Server port")
    WORKERS: int = Field(default=4, description="Number of uvicorn workers")
    
    # ==================== API Settings ====================
    API_V1_PREFIX: str = Field(default="/api/v1", description="API version prefix")
    CORS_ORIGINS: str = Field(
        default='["http://localhost:5173","http://localhost:3000"]',
        description="CORS allowed origins"
    )
    
    # ==================== MongoDB Atlas ====================
    MONGODB_URI: str = Field(
        default="mongodb://localhost:27017",
        description="MongoDB connection string"
    )
    MONGODB_DATABASE: str = Field(default="smartcart_db", description="Database name")
    
    # ==================== JWT Settings ====================
    JWT_SECRET_KEY: str = Field(
        default="change-this-secret-key-in-production",
        description="JWT secret key"
    )
    JWT_ALGORITHM: str = Field(default="HS256", description="JWT algorithm")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(default=30, description="Access token expiration in minutes")
    REFRESH_TOKEN_EXPIRE_DAYS: int = Field(default=7, description="Refresh token expiration in days")
    
    # ==================== Security ====================
    SECRET_KEY: str = Field(
        default="change-this-secret-key-in-production",
        description="General secret key"
    )
    
    @field_validator("ENVIRONMENT")
    @classmethod
    def validate_environment(cls, v: str) -> str:
        """Validate environment value."""
        allowed = ["development", "production", "testing"]
        if v not in allowed:
            raise ValueError(f"ENVIRONMENT must be one of {allowed}")
        return v
    
    @field_validator("CORS_ORIGINS")
    @classmethod
    def parse_cors_origins(cls, v: str) -> List[str]:
        """Parse CORS origins from string to list."""
        if isinstance(v, str):
            try:
                import json
                return json.loads(v)
            except json.JSONDecodeError:
                return [origin.strip() for origin in v.split(",")]
        return v
    
    @property
    def is_development(self) -> bool:
        """Check if running in development mode."""
        return self.ENVIRONMENT == "development"
    
    @property
    def is_production(self) -> bool:
        """Check if running in production mode."""
        return self.ENVIRONMENT == "production"
    
    @property
    def is_testing(self) -> bool:
        """Check if running in testing mode."""
        return self.ENVIRONMENT == "testing"


# Global settings instance
settings = Settings()
