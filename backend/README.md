# SmartCart AI Backend

Production-ready FastAPI backend with MongoDB Atlas integration for SmartCart AI e-commerce platform.

## Tech Stack

- **FastAPI** - Modern, fast web framework for building APIs
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Motor** - Async MongoDB driver for Python
- **Pydantic** - Data validation and settings management
- **JWT** - JSON Web Token authentication
- **Python 3.12+**

## Project Structure

```
backend/
├── app/
│   ├── routers/          # API route handlers (endpoints)
│   │   └── health.py     # Health check endpoints
│   ├── models/           # MongoDB document models
│   │   └── base.py       # Base document models
│   ├── schemas/          # Pydantic schemas for request/response
│   ├── services/         # Business logic layer
│   ├── auth/             # Authentication utilities
│   ├── database/         # Database connection and utilities
│   │   └── mongodb.py    # MongoDB connection manager
│   ├── config/           # Configuration management
│   │   └── settings.py   # Settings with Pydantic
│   ├── utils/            # Utility functions
│   │   ├── exceptions.py # Custom exceptions
│   │   └── response.py   # Response helpers
│   └── main.py           # FastAPI application entry point
│
├── .env.example          # Environment variables template
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## Features

- ✅ FastAPI with async support
- ✅ MongoDB Atlas connection with Motor
- ✅ Centralized configuration management
- ✅ Custom exception handling
- ✅ Standardized response format
- ✅ CORS configuration for React frontend
- ✅ Health check endpoints
- ✅ API versioning (/api/v1)
- ✅ Type-safe with Pydantic
- ✅ Production-ready architecture

## Setup Instructions

### Prerequisites

- Python 3.12 or higher
- MongoDB Atlas account (free tier works)
- pip or poetry for package management

### Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - MongoDB Atlas connection string
   - JWT secret keys
   - CORS origins
   - Other settings

5. **Generate secure keys**
   ```bash
   python -c "import secrets; print('JWT Secret:', secrets.token_urlsafe(32))"
   python -c "import secrets; print('Secret Key:', secrets.token_urlsafe(32))"
   ```

## MongoDB Atlas Setup

1. **Create MongoDB Atlas account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free tier

2. **Create cluster**
   - Create a new cluster (free M0 cluster)
   - Wait for cluster to be created

3. **Get connection string**
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

4. **Configure database access**
   - Database Access → Create user
   - Set username and password
   - Add IP address (0.0.0.0/0 for development)

5. **Update .env**
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DATABASE=smartcart_db
   ```

## Running the Application

### Development Mode

```bash
# Run with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode

```bash
# Run with multiple workers
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Using Python

```bash
python -m app.main
```

## API Documentation

Once the server is running, access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## API Endpoints

### Health Check

- `GET /` - Root endpoint with API info
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health with database status
- `GET /health/readiness` - Readiness check
- `GET /health/liveness` - Liveness check

### API Versioning

All API endpoints are prefixed with `/api/v1`:
- `/api/v1/health` - Health check (v1)

## Configuration

### Environment Variables

See `.env.example` for all available configuration options:

- `APP_NAME` - Application name
- `APP_VERSION` - Application version
- `ENVIRONMENT` - Environment (development/production)
- `DEBUG` - Debug mode flag
- `HOST` - Server host
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `MONGODB_DATABASE` - Database name
- `JWT_SECRET_KEY` - JWT secret key
- `CORS_ORIGINS` - Allowed CORS origins

## Architecture

### Layered Architecture

```
Routers (app/routers/)
    ↓
Services (app/services/)
    ↓
Database (app/database/)
```

### Key Components

- **Routers** - Define API endpoints
- **Models** - MongoDB document models
- **Schemas** - Request/response validation
- **Services** - Business logic
- **Database** - MongoDB connection
- **Config** - Configuration management
- **Utils** - Helper functions

## Error Handling

Custom exceptions for consistent error responses:

- `AppException` - Base exception
- `DatabaseException` - Database errors (500)
- `NotFoundException` - Resource not found (404)
- `BadRequestException` - Bad request (400)
- `UnauthorizedException` - Unauthorized (401)
- `ForbiddenException` - Forbidden (403)
- `ConflictException` - Conflict (409)
- `ValidationException` - Validation failed (422)

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Optional message",
  "data": {},
  "timestamp": "2024-01-01T00:00:00"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": {},
  "timestamp": "2024-01-01T00:00:00"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [],
  "total": 100,
  "page": 1,
  "page_size": 10,
  "total_pages": 10,
  "timestamp": "2024-01-01T00:00:00"
}
```

## Development

### Adding a New Router

1. Create router in `app/routers/`
2. Define endpoints
3. Register in `app/main.py`

```python
from fastapi import APIRouter
router = APIRouter()

@router.get("/items")
async def get_items():
    return {"items": []}
```

### Adding a New Model

1. Create model in `app/models/`
2. Inherit from `BaseDocument`

```python
from app.models.base import BaseDocument

class Product(BaseDocument):
    name: str
    price: float
```

## Deployment

### Docker (Coming Soon)

```bash
# Build image
docker build -t smartcart-backend .

# Run container
docker run -p 8000:8000 smartcart-backend
```

### Environment Variables

Ensure all required environment variables are set in production:
- MongoDB connection string
- JWT secret keys
- CORS origins
- Production mode flag

## Security

- JWT token authentication (to be implemented)
- Password hashing with bcrypt (to be implemented)
- CORS configuration
- Environment variable protection
- Input validation with Pydantic

## Testing (Coming Soon)

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app
```

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
