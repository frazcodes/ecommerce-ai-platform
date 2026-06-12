"""
Health Check Router

Purpose: Health check endpoints for monitoring and load balancers
Why it exists: Provides application health status for monitoring
Features: Basic health, detailed health, database status
"""

from fastapi import APIRouter, Depends
from datetime import datetime
from app.config.settings import settings
from app.database.mongodb import mongodb
from app.utils.response import success_response

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    Basic health check endpoint
    
    Returns a simple health status for load balancers and monitoring.
    Suitable for quick health checks.
    """
    return success_response(
        data={
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "environment": settings.ENVIRONMENT,
        }
    )


@router.get("/health/detailed")
async def detailed_health_check():
    """
    Detailed health check endpoint
    
    Returns detailed health status including database connection.
    Suitable for comprehensive monitoring.
    """
    # Check database connection
    db_status = "unknown"
    db_latency_ms = None
    
    try:
        if mongodb.client:
            start_time = datetime.utcnow()
            await mongodb.client.admin.command('ping')
            end_time = datetime.utcnow()
            db_status = "connected"
            db_latency_ms = (end_time - start_time).total_seconds() * 1000
        else:
            db_status = "disconnected"
    except Exception as e:
        db_status = "error"
        db_latency_ms = None
    
    return success_response(
        data={
            "status": "healthy" if db_status == "connected" else "degraded",
            "timestamp": datetime.utcnow().isoformat(),
            "environment": settings.ENVIRONMENT,
            "version": settings.APP_VERSION,
            "database": {
                "status": db_status,
                "latency_ms": db_latency_ms,
            },
            "system": {
                "app_name": settings.APP_NAME,
                "debug": settings.DEBUG,
            }
        }
    )


@router.get("/health/readiness")
async def readiness_check():
    """
    Readiness check endpoint
    
    Returns whether the application is ready to serve requests.
    Checks if database connection is established.
    """
    try:
        if mongodb.client:
            await mongodb.client.admin.command('ping')
            return success_response(
                data={
                    "ready": True,
                    "timestamp": datetime.utcnow().isoformat(),
                }
            )
        else:
            return success_response(
                data={
                    "ready": False,
                    "reason": "Database not connected",
                    "timestamp": datetime.utcnow().isoformat(),
                }
            )
    except Exception as e:
        return success_response(
            data={
                "ready": False,
                "reason": str(e),
                "timestamp": datetime.utcnow().isoformat(),
            }
        )


@router.get("/health/liveness")
async def liveness_check():
    """
    Liveness check endpoint
    
    Returns whether the application is alive.
    Does not check external dependencies.
    """
    return success_response(
        data={
            "alive": True,
            "timestamp": datetime.utcnow().isoformat(),
        }
    )
