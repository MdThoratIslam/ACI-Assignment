# AI Vision Platform - Python Flask Backend

A production-ready Flask backend for the AI Vision Platform, providing REST APIs for authentication, object detection, and AI-powered Q&A.

## 🚀 Features

- **JWT Authentication**: Secure user registration and login with bcrypt password hashing
- **Object Detection**: YOLO-based detection via Hugging Face API
- **AI Q&A System**: Context-aware responses using Google Gemini AI
- **RESTful API**: Clean, documented API endpoints
- **CORS Support**: Configured for Next.js frontend integration
- **Type Safety**: Well-structured code with proper error handling

## 📋 Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- API keys:
  - Google Gemini API key
  - Hugging Face API key (optional, falls back to mock data)

## 🛠️ Installation

### 1. Navigate to backend directory

```bash
cd backend
```

### 2. Create virtual environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters
GOOGLE_GEMINI_API_KEY=your_google_gemini_api_key_here
HUGGINGFACE_API_KEY=your_huggingface_api_key_here
PORT=5000
FLASK_ENV=development
```

## 🎯 Running the Application

### Development mode

```bash
python app.py
```

The API will start on `http://localhost:5000`

### Production mode

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 📚 API Documentation

### Health Check

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "message": "AI Vision Platform API is running"
}
```

---

### Authentication

#### Sign Up

**POST** `/api/auth/signup`

Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt-token"
}
```

**Errors:**
- `400`: Missing or invalid fields
- `400`: Email already exists

---

#### Login

**POST** `/api/auth/login`

Authenticate existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt-token"
}
```

**Errors:**
- `400`: Missing fields
- `401`: Invalid credentials

---

#### Verify Token

**GET** `/api/auth/verify`

Verify JWT token and get user info.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- `401`: Missing or invalid token
- `404`: User not found

---

### Object Detection

#### Detect Objects

**POST** `/api/detect`

Detect objects in an uploaded image using YOLO.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Response (200):**
```json
{
  "detections": [
    {
      "label": "person",
      "score": 0.95,
      "bbox": {
        "x": 100,
        "y": 50,
        "width": 200,
        "height": 300
      }
    },
    {
      "label": "car",
      "score": 0.88,
      "bbox": {
        "x": 350,
        "y": 200,
        "width": 180,
        "height": 150
      }
    }
  ]
}
```

**Errors:**
- `400`: Missing or invalid image
- `401`: Authentication required
- `500`: Detection service error

---

### AI Q&A

#### Ask Question

**POST** `/api/qa`

Ask AI a question about detected objects.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "question": "How many people are in the image?",
  "detections": [
    {
      "label": "person",
      "score": 0.95,
      "bbox": {
        "x": 100,
        "y": 50,
        "width": 200,
        "height": 300
      }
    }
  ]
}
```

**Response (200):**
```json
{
  "answer": "I can see 1 person in the image with high confidence (95%)."
}
```

**Errors:**
- `400`: Missing question or invalid detections
- `401`: Authentication required
- `500`: AI service error

---

## 🗂️ Project Structure

```
backend/
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── README.md             # This file
│
├── routes/               # API route handlers
│   ├── auth.py          # Authentication endpoints
│   ├── detect.py        # Object detection endpoint
│   └── qa.py            # Q&A endpoint
│
└── utils/               # Utility modules
    ├── auth.py          # JWT utilities and decorators
    ├── database.py      # In-memory database (user storage)
    ├── gemini.py        # Google Gemini AI integration
    └── yolo.py          # YOLO detection via Hugging Face
```

## 🔒 Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Authentication**: Secure token-based auth with 7-day expiration
3. **Input Validation**: Comprehensive request validation
4. **CORS Configuration**: Restricted to trusted origins
5. **Error Handling**: Secure error messages (no sensitive data leakage)

## 🧪 Testing

### Manual Testing with curl

```bash
# Health check
curl http://localhost:5000/health

# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Verify token (replace <token>)
curl http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer <token>"
```

## 🚢 Deployment

### Option 1: Heroku

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set GOOGLE_GEMINI_API_KEY=your-key
heroku config:set HUGGINGFACE_API_KEY=your-key

# Deploy
git push heroku main
```

### Option 2: AWS EC2

1. Launch EC2 instance (Ubuntu 22.04)
2. SSH into instance
3. Install Python and dependencies
4. Clone repository
5. Configure environment variables
6. Run with gunicorn + nginx

### Option 3: Docker

```bash
# Build image
docker build -t ai-vision-backend .

# Run container
docker run -p 5000:5000 --env-file .env ai-vision-backend
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | Yes |
| `GOOGLE_GEMINI_API_KEY` | Google Gemini API key | Yes |
| `HUGGINGFACE_API_KEY` | Hugging Face API key | No* |
| `PORT` | Server port (default: 5000) | No |
| `FLASK_ENV` | Environment (development/production) | No |

*Falls back to mock data if not provided

## 📝 Development Notes

### Database

The backend uses **SQLite** with SQLAlchemy ORM for persistent data storage:

- **Database File:** `ai_vision.db` (automatically created)
- **ORM:** SQLAlchemy with Flask-SQLAlchemy
- **Management:** Use `manage_db.py` for database operations
- **Documentation:** See `DATABASE.md` for complete guide

**Database Management Commands:**

```bash
# Create admin user (email: admin@example.com, password: admin123)
python manage_db.py create-admin

# View all users
python manage_db.py show-users

# Reset database
python manage_db.py reset
```

**Migration to PostgreSQL/MySQL:**

Simply update the database URI in `app.py`:

```python
# PostgreSQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:pass@localhost/ai_vision'

# MySQL
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://user:pass@localhost/ai_vision'
```

For complete database documentation, see **`DATABASE.md`**

### File Uploads

Current max upload size: 16MB (configured in `app.py`)

To increase:
```python
app.config['MAX_CONTENT_LENGTH'] = 32 * 1024 * 1024  # 32MB
```

## 🐛 Troubleshooting

### Issue: Import errors

**Solution:**
```bash
# Ensure virtual environment is activated
# Reinstall dependencies
pip install -r requirements.txt
```

### Issue: CORS errors

**Solution:**
Update `app.py` to include your frontend URL:
```python
CORS(app, origins=['http://localhost:3000', 'https://your-frontend.com'])
```

### Issue: API key errors

**Solution:**
- Check `.env` file exists and has correct keys
- Verify keys are not quoted in `.env`
- Restart Flask server after changing `.env`

## 📦 Dependencies

- **Flask 3.0.0**: Web framework
- **Flask-CORS 4.0.0**: CORS support
- **PyJWT 2.8.0**: JWT token handling
- **bcrypt 4.1.2**: Password hashing
- **google-generativeai 0.8.3**: Gemini AI SDK
- **requests 2.31.0**: HTTP client
- **Pillow 10.1.0**: Image processing
- **gunicorn 21.2.0**: Production WSGI server
- **python-dotenv 1.0.0**: Environment variable management

## 📄 License

MIT License - See LICENSE file for details

## 👤 Author

Created for ACI Assignment

## 🙏 Acknowledgments

- Google Gemini AI
- Hugging Face
- Flask community
