# SmartCart AI Platform

An AI-powered e-commerce platform built with React, FastAPI, and MongoDB Atlas. Features intelligent product recommendations, seamless shopping experience, and modern responsive design.

## 🚀 Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Recharts** - Data visualization

### Backend
- **FastAPI** - API framework
- **Python 3.11** - Runtime
- **MongoDB Atlas** - Database
- **Motor** - Async MongoDB driver
- **JWT** - Authentication
- **Pydantic** - Data validation

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Database hosting

## ✨ Features

- **AI-Powered Recommendations** - Intelligent product suggestions
- **User Authentication** - Secure JWT-based authentication
- **Shopping Cart** - Persistent cart functionality
- **Wishlist** - Save favorite products
- **Product Search** - Advanced search and filtering
- **Responsive Design** - Mobile-first approach
- **Dark Mode** - Theme switching support
- **Admin Dashboard** - Product and order management
- **Real-time Updates** - Live inventory and pricing

## 📁 Project Structure

```
ecommerce-ai/
├── frontend/              # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── contexts/     # React contexts
│   │   ├── hooks/        # Custom hooks
│   │   ├── services/     # API services
│   │   └── utils/        # Utility functions
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
├── backend/              # FastAPI backend application
│   ├── app/
│   │   ├── routers/      # API endpoints
│   │   ├── models/       # Database models
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── database/     # Database configuration
│   │   ├── auth/         # Authentication logic
│   │   └── utils/        # Utility functions
│   ├── requirements.txt  # Backend dependencies
│   └── main.py          # Application entry point
├── .gitignore           # Git ignore rules
├── README.md           # Project documentation
├── SECURITY.md         # Security guidelines
├── GIT_SETUP.md        # Git setup instructions
└── DEPLOYMENT.md       # Deployment guide
```

## 🛠️ Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- MongoDB Atlas account
- Git

### Frontend Setup

```bash
cd frontend
npm install
```

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Environment Variables

#### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_CATALOG_API_URL=https://dummyjson.com
```

#### Backend (.env)
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=smartcart_db
JWT_SECRET_KEY=your-secret-key
SECRET_KEY=your-secret-key
CORS_ORIGINS=["http://localhost:5173"]
```

## 🚀 Running Locally

### Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

### Start Backend
```bash
cd backend
uvicorn app.main:app --reload
```
Backend runs on http://localhost:8000

## 📦 Deployment

### Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel
2. Import the `frontend` directory
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Backend Deployment (Render)

1. Connect your GitHub repository to Render
2. Import the `backend` directory
3. Configure environment variables in Render dashboard
4. Deploy automatically on push to main branch

### Database Setup (MongoDB Atlas)

Follow the setup guide in `backend/MONGODB_ATLAS_SETUP.md`

For detailed deployment instructions, see `DEPLOYMENT.md`

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Environment variable management
- Input validation with Pydantic

See `SECURITY.md` for security best practices

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
pytest
```

## 📝 API Documentation

Once the backend is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👤 Author

**Fraz Codes**

- GitHub: [@frazcodes](https://github.com/frazcodes)

## 🙏 Acknowledgments

- DummyJSON for product data
- MongoDB Atlas for database hosting
- Vercel for frontend hosting
- Render for backend hosting

## 📞 Support

For support, email support@smartcart.ai or open an issue in the GitHub repository.
