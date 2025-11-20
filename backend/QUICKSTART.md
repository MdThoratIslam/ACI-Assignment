# AI Vision Platform - Quick Start Guide (Backend)

Get the Python Flask backend running in 5 minutes!

## Prerequisites

- Python 3.9+
- pip

## Quick Setup

### 1. Navigate to Backend

```bash
cd backend
```

### 2. Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment

The `.env` file is already created. Update the API keys:

```env
JWT_SECRET=change_this_to_a_secure_secret_key_at_least_32_characters_long_12345
GOOGLE_GEMINI_API_KEY=your_actual_gemini_key_here
HUGGINGFACE_API_KEY=your_actual_hf_key_here
PORT=5000
FLASK_ENV=development
```

### 5. Run the Server

```bash
python app.py
```

The API will be available at:
- **Local:** http://localhost:5000
- **Health Check:** http://localhost:5000/health

## Test the API

### Health Check

```bash
curl http://localhost:5000/health
```

### Sign Up

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

## Connect Frontend

Update your Next.js frontend to use the Python backend:

In `app/dashboard/page.tsx` or wherever you make API calls, change the base URL:

```typescript
const API_BASE_URL = 'http://localhost:5000';
```

## Production Deployment

### Using Gunicorn

```bash
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Using Docker

```bash
docker build -t ai-vision-backend .
docker run -p 5000:5000 --env-file .env ai-vision-backend
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/verify` | Verify token |
| POST | `/api/detect` | Detect objects |
| POST | `/api/qa` | Ask AI questions |

## Troubleshooting

**Import errors?**
```bash
pip install -r requirements.txt
```

**Port already in use?**
```bash
# Change PORT in .env file
PORT=5001
```

**CORS errors?**
Update `app.py`:
```python
CORS(app, origins=['http://localhost:3000'])
```

## Next Steps

1. Get your API keys from:
   - Google AI Studio: https://makersuite.google.com/app/apikey
   - Hugging Face: https://huggingface.co/settings/tokens

2. Update `.env` with your keys

3. Test all endpoints

4. Connect your frontend

5. Deploy to production!

---

**Need help?** Check `README.md` for full documentation.
