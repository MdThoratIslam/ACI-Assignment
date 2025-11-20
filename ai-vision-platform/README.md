# 🤖 AI Vision Platform

A modern, full-stack web application for advanced object detection and AI-powered analysis. Built with Next.js 14+, TypeScript, YOLO for real-time object detection, and Google Gemini AI for intelligent Q&A capabilities.

![AI Vision Platform](https://img.shields.io/badge/Next.js-14+-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🔐 Authentication System
- **JWT-based Authentication**: Secure token-based authentication with bcrypt password hashing
- **User Registration & Login**: Complete signup/login flow with form validation
- **Protected Routes**: Client-side route protection with token verification
- **Persistent Sessions**: Token storage in localStorage for seamless user experience

### 📸 Image Upload & Processing
- **Drag & Drop Upload**: Intuitive drag-and-drop interface for image uploads
- **File Validation**: Automatic validation for image types (PNG, JPG, JPEG)
- **Image Preview**: Real-time preview before processing
- **Base64 Encoding**: Efficient image handling and transmission

### 🎯 YOLO Object Detection
- **Real-time Detection**: Advanced YOLO model integration via Hugging Face API
- **Bounding Boxes**: Precise object localization with coordinate data
- **Confidence Scores**: Accuracy metrics for each detected object
- **Multiple Object Support**: Detect and track multiple objects simultaneously
- **Annotated Images**: Visual representation with bounding boxes overlaid

### 💬 Gemini AI Q&A System
- **Context-Aware Responses**: Ask questions about detected objects
- **Natural Language Processing**: Powered by Google Gemini 2.0 Flash
- **Chat Interface**: Interactive conversation UI with message history
- **Detection Context**: AI uses detection results to provide accurate answers

### 📊 Results Visualization
- **Sortable Tables**: Interactive table with sortable columns (object class, confidence, bbox)
- **Progress Bars**: Visual representation of confidence scores
- **Statistics Cards**: Quick overview of detection results
- **Responsive Design**: Mobile-friendly layout with grid system

### 🎨 Modern UI/UX
- **Tailwind CSS 4**: Modern, utility-first styling
- **Gradient Backgrounds**: Beautiful gradient designs
- **Smooth Animations**: Hover effects and transitions
- **Mobile Responsive**: Fully responsive across all devices
- **Custom Icons**: SVG icons for enhanced visual appeal

## 🚀 Tech Stack

### Frontend
- **Next.js 14+**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS 4**: Utility-first CSS framework
- **React Hooks**: Modern React patterns

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **JWT (jsonwebtoken & jose)**: Authentication tokens
- **bcryptjs**: Password hashing
- **Node.js**: Runtime environment

### AI/ML Services
- **YOLO (Hugging Face)**: Object detection model
- **Google Gemini AI**: Natural language processing
- **@google/generative-ai**: Gemini SDK

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)
- **Git**: For cloning the repository

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-vision-platform.git
cd ai-vision-platform
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:

```env
# JWT Secret - Generate with: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Google Gemini API Key - Get from: https://makersuite.google.com/app/apikey
GOOGLE_GEMINI_API_KEY=your-gemini-api-key-here

# Hugging Face API Key - Get from: https://huggingface.co/settings/tokens
HUGGINGFACE_API_KEY=your-huggingface-api-key-here
```

### 4. Get Your API Keys

#### Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key to your `.env.local` file

#### Hugging Face API Key
1. Visit [Hugging Face](https://huggingface.co/settings/tokens)
2. Sign up or log in
3. Create a new access token with "Read" permissions
4. Copy the token to your `.env.local` file

#### JWT Secret
Generate a secure random string:
```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 5. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
ai-vision-platform/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts       # Login endpoint
│   │   │   ├── signup/route.ts      # Signup endpoint
│   │   │   └── verify/route.ts      # Token verification
│   │   ├── detect/route.ts          # Object detection endpoint
│   │   └── qa/route.ts              # Gemini Q&A endpoint
│   ├── auth/
│   │   └── page.tsx                 # Login/Signup page
│   ├── dashboard/
│   │   └── page.tsx                 # Main dashboard
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Landing page
│   └── globals.css                  # Global styles
├── lib/
│   ├── auth.ts                      # JWT utilities
│   ├── db.ts                        # User storage
│   ├── gemini.ts                    # Gemini AI integration
│   ├── types.ts                     # TypeScript types
│   └── yolo.ts                      # YOLO detection
├── public/                          # Static assets
├── .env.example                     # Environment template
├── .env.local                       # Your environment variables
├── next.config.ts                   # Next.js configuration
├── tailwind.config.ts               # Tailwind configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies
└── README.md                        # This file
```

## 🔌 API Endpoints

### Authentication

#### `POST /api/auth/signup`
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "abc123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### `POST /api/auth/login`
Login an existing user.

#### `GET /api/auth/verify`
Verify authentication token.

### Object Detection

#### `POST /api/detect`
Detect objects in an image using YOLO model.

### AI Q&A

#### `POST /api/qa`
Ask questions about detection results using Gemini AI.

## 🎯 Usage Guide

### 1. Create an Account
1. Navigate to the login page
2. Click "Sign Up" tab
3. Enter your name, email, and password
4. Click "Create Account"

### 2. Upload an Image
1. After logging in, you'll see the dashboard
2. Drag and drop an image or click "Select Image"
3. Preview your image before processing

### 3. Detect Objects
1. Click "Detect Objects" button
2. Wait for YOLO to process the image
3. View detected objects in the results table

### 4. Ask Questions
1. Type your question in the Q&A section
2. Ask about specific objects, confidence scores, or counts
3. Get AI-powered answers from Gemini

### 5. Analyze Results
- **Sort Table**: Click column headers to sort by object, confidence, or bounding box
- **View Annotated Image**: See bounding boxes drawn on your image
- **Check Confidence**: Progress bars show detection accuracy

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🐛 Troubleshooting

### Issue: "API Key not found"
**Solution**: Ensure `.env.local` exists and contains valid API keys.

### Issue: "Token expired"
**Solution**: Log out and log back in to refresh your token.

### Issue: "Detection failed"
**Solution**: 
- Check your Hugging Face API key
- Ensure image is under 10MB
- Verify image format (PNG, JPG, JPEG)

### Issue: "Gemini AI not responding"
**Solution**: 
- Verify your Google Gemini API key
- Check API quotas in Google AI Studio
- Ensure you have detections before asking questions

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built for the Full Stack AI Developer Assignment

## 🙏 Acknowledgments

- **YOLO**: You Only Look Once object detection
- **Google Gemini**: AI language model
- **Hugging Face**: Model hosting and inference
- **Next.js Team**: Amazing React framework
- **Tailwind CSS**: Utility-first CSS framework

---

Made with ❤️ using Next.js, TypeScript, and AI
