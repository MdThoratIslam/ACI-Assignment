# AI Vision Platform - Object Detection & Q&A System

**Developed for:** ACI PLC - AI Engineer / Full Stack AI Developer Position  
**Candidate:** Md Thorat Islam  
**Submission Date:** 21 November 2025  
**Repository:** https://github.com/MdThoratIslam/ACI-Assignment

---

## 🎯 Project Overview

An advanced AI-powered vision platform that combines **YOLO object detection** with **Gemini AI-powered Q&A** capabilities. The system allows users to upload images, detect objects with bounding boxes, and ask natural language questions about the detected objects.

---

## ✨ Key Features

### 1. **User Authentication System**
- Secure JWT-based authentication
- User registration and login
- Protected routes and API endpoints
- SQLite database for user management

### 2. **Object Detection (YOLO)**
- Real-time object detection using Hugging Face YOLO models
- Visual bounding boxes with labels and confidence scores
- Color-coded annotations for different object types
- Support for multiple object detection in single image

### 3. **Interactive Q&A System (Gemini AI)**
- Natural language question answering about detected objects
- Context-aware responses based on detection results
- Supports complex queries:
  - "How many objects were detected?"
  - "What is the confidence score of the largest object?"
  - "How many objects have confidence above 85%?"
  - "Where is the car located?"

### 4. **Modern UI/UX**
- Responsive Next.js frontend with Tailwind CSS
- Drag-and-drop image upload
- Real-time detection results with sortable table
- Chat interface for Q&A interactions
- Professional dashboard with annotated images

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** Next.js 14 (React 18)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **State Management:** React Hooks

### **Backend**
- **Framework:** Flask (Python)
- **Authentication:** JWT (Flask-JWT-Extended)
- **Database:** SQLite
- **AI Models:**
  - YOLO (via Hugging Face API)
  - Google Gemini 2.0 Flash

### **APIs & Services**
- Hugging Face Inference API for object detection
- Google Gemini API for conversational AI
- RESTful API architecture

---

## 📁 Project Structure

```
ACI-Assignment/
├── ai-vision-platform/          # Next.js Frontend
│   ├── app/
│   │   ├── auth/                # Authentication pages
│   │   ├── dashboard/           # Main dashboard
│   │   └── api/                 # API routes (optional)
│   ├── lib/
│   │   ├── auth.ts              # Auth utilities
│   │   ├── types.ts             # TypeScript types
│   │   └── yolo.ts              # YOLO integration
│   └── public/                  # Static assets
│
├── backend/                     # Flask Backend
│   ├── routes/
│   │   ├── auth.py              # Authentication endpoints
│   │   ├── detect.py            # Object detection endpoint
│   │   └── qa.py                # Q&A endpoint
│   ├── utils/
│   │   ├── auth.py              # Auth utilities
│   │   ├── database.py          # Database operations
│   │   ├── yolo.py              # YOLO detection logic
│   │   └── gemini.py            # Gemini AI integration
│   ├── app.py                   # Flask application entry
│   └── requirements.txt         # Python dependencies
│
└── README.md                    # This file
```

---

## 🚀 Installation & Setup

### **Prerequisites**
- Node.js 18+ and npm
- Python 3.8+
- Git

### **1. Clone Repository**
```bash
git clone https://github.com/MdThoratIslam/ACI-Assignment.git
cd ACI-Assignment
```

### **2. Backend Setup**

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
# Copy .env.example and add your API keys:
JWT_SECRET=your_jwt_secret_key_here
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key
PORT=5000
FLASK_ENV=development

# Run backend
python app.py
```

Backend will run on: **http://localhost:5000**

### **3. Frontend Setup**

```bash
cd ai-vision-platform

# Install dependencies
npm install

# Create .env.local file
# Add your API keys:
JWT_SECRET=your_jwt_secret_key
GOOGLE_GEMINI_API_KEY=your_gemini_api_key
HUGGINGFACE_API_KEY=your_huggingface_api_key

# Run development server
npm run dev
```

Frontend will run on: **http://localhost:3000**

---

## 🎮 Usage Guide

### **1. User Registration & Login**
- Navigate to http://localhost:3000
- Click "Create Account" to register
- Login with credentials

### **2. Object Detection**
- Upload an image (drag-and-drop or click)
- Click "Detect Objects" button
- View annotated image with bounding boxes
- See detection results in sortable table

### **3. Ask Questions**
- After detection, use the Q&A section
- Type natural language questions
- Get intelligent responses about detected objects

### **Example Questions:**
- "How many objects were detected?"
- "What is the largest object?"
- "Which object has the highest confidence?"
- "How many objects have confidence above 85%?"
- "Where is the car located?"

---

## 🔑 API Endpoints

### **Authentication**
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify` - Token verification

### **Object Detection**
- `POST /api/detect` - Detect objects in image
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "image": "data:image/jpeg;base64,..." }`
  - Response: Detection results with annotated image

### **Q&A**
- `POST /api/qa` - Ask questions about detections
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ "question": "...", "detections": [...] }`
  - Response: AI-generated answer

---

## 🧪 Features Implemented

### ✅ **Core Requirements**
- [x] User authentication system
- [x] Image upload functionality
- [x] YOLO object detection
- [x] Bounding box visualization
- [x] AI-powered Q&A system
- [x] RESTful API architecture

### ✅ **Advanced Features**
- [x] JWT-based security
- [x] Responsive UI design
- [x] Real-time detection
- [x] Sortable results table
- [x] Context-aware AI responses
- [x] Multiple confidence threshold queries
- [x] Object size comparison
- [x] Location-based queries

### ✅ **Technical Excellence**
- [x] TypeScript for type safety
- [x] Clean code architecture
- [x] Error handling
- [x] API documentation
- [x] Environment variable management
- [x] Git version control
- [x] Security best practices

---

## 🎨 UI Screenshots

### Dashboard
- Modern, clean interface with gradient designs
- Drag-and-drop image upload area
- Split-panel view (Annotated Image + Detection Results)

### Detection Results
- Color-coded bounding boxes on image
- Sortable table with Object, Confidence, Bounding Box
- Progress bars for confidence visualization

### Q&A Interface
- Chat-style interface
- Real-time responses
- User and AI message differentiation

---

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- CORS configuration
- Environment variables for sensitive data
- API key protection

---

## 🚧 Future Enhancements

- Real-time video object detection
- Multi-language support
- Export detection results (JSON/CSV)
- Advanced filtering options
- User dashboard analytics
- Model performance comparison
- Batch image processing

---

## 📞 Contact Information

**Candidate:** Md Thorat Islam  
**Email:** mdthoratislam1993.oni@gmail.com
**Position:** AI Engineer / Full Stack AI Developer  
**Company:** ACI PLC

---

## 📝 Notes
### **API Keys Required:**
1. **Hugging Face API Key** - For YOLO object detection
   - Get from: https://huggingface.co/settings/tokens
2. **Google Gemini API Key** - For Q&A system
   - Get from: https://aistudio.google.com/apikey

### **Mock Data:**
- System includes intelligent mock responses when API keys are not configured
- Mock data demonstrates all features working correctly
- Production deployment should use real API keys
---

## 🙏 Acknowledgments
Developed as part of the case study assessment for ACI PLC's AI Engineer position.
Thank you for reviewing my submission!
---
**Repository:** https://github.com/MdThoratIslam/ACI-Assignment
