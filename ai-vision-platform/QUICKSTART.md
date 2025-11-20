# 🚀 Quick Start Guide - AI Vision Platform

## ⚡ 5-Minute Setup

### Step 1: Environment Setup (2 minutes)

1. **Copy environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Get API Keys:**
   
   **Google Gemini API** (Free):
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with Google
   - Click "Create API Key"
   - Copy and paste into `.env.local`

   **Hugging Face Token** (Free):
   - Visit: https://huggingface.co/settings/tokens
   - Create account or login
   - Click "New token" → "Read" access
   - Copy and paste into `.env.local`

   **JWT Secret**:
   ```bash
   # Windows PowerShell
   [Convert]::ToBase64String((1..32|%{Get-Random -Max 256}))
   
   # Or use this pre-generated one for testing:
   # dGVzdC1zZWNyZXQta2V5LWZvci1qd3QtdG9rZW5z
   ```

3. **Your `.env.local` should look like:**
   ```env
   JWT_SECRET=your-generated-secret-here
   GOOGLE_GEMINI_API_KEY=AIzaSy...your-key-here
   HUGGINGFACE_API_KEY=hf_...your-token-here
   ```

### Step 2: Install & Run (2 minutes)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Step 3: Test the App (1 minute)

1. Open http://localhost:3000
2. You'll be redirected to the auth page
3. Click "Sign Up" tab
4. Create an account with any email/password
5. You'll be automatically logged in to the dashboard!

## 📱 Testing Object Detection

### Without API Keys (Demo Mode)
The app includes mock data, so you can test without real API keys:
- Upload any image
- Click "Detect Objects"
- See 5 pre-configured demo detections
- Test the Q&A with mock responses

### With Real API Keys
1. Upload an image (try a street scene with cars/people)
2. Click "Detect Objects"
3. YOLO will detect real objects with bounding boxes
4. Ask questions like:
   - "How many cars were detected?"
   - "What's the most confident detection?"
   - "List all detected objects"

## 🎯 Key Features to Test

### 1. Authentication ✅
- [x] Sign up with new account
- [x] Login with existing account
- [x] Auto-redirect to dashboard when logged in
- [x] Logout functionality

### 2. Image Upload ✅
- [x] Drag and drop an image
- [x] Click to browse and select
- [x] Image preview before detection
- [x] Remove image button

### 3. Object Detection ✅
- [x] Click "Detect Objects" button
- [x] View detection results in table
- [x] See confidence scores with progress bars
- [x] Sort table by clicking column headers
- [x] View bounding box coordinates

### 4. AI Q&A ✅
- [x] Type question in chat input
- [x] Press Enter or click "Send"
- [x] See AI response with context
- [x] Chat history maintained
- [x] Auto-scroll to latest message

### 5. UI/UX ✅
- [x] Responsive design (try mobile view)
- [x] Smooth animations on hover
- [x] Loading states during detection
- [x] Beautiful gradient backgrounds
- [x] Professional color scheme

## 🐛 Common Issues & Quick Fixes

### Issue: Page is blank
- **Fix**: Clear browser cache and reload
- Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

### Issue: "Token not found" error
- **Fix**: You're not logged in
- Go to `/auth` and create an account

### Issue: Detection shows mock data instead of real results
- **Fix**: Add your Hugging Face API key to `.env.local`
- Restart the dev server: `Ctrl+C` then `npm run dev`

### Issue: Gemini AI not responding
- **Fix**: Add your Google Gemini API key to `.env.local`
- Check you have active detections before asking questions

### Issue: Styles not loading correctly
- **Fix**: Tailwind CSS might need rebuilding
```bash
# Stop server (Ctrl+C)
# Delete .next folder
rm -rf .next
# Restart
npm run dev
```

## 📸 Sample Test Images

Try these image types for best results:
- Street scenes (cars, people, traffic signs)
- Indoor scenes (furniture, electronics)
- Nature photos (trees, animals)
- Sports photos (balls, players)

**Image requirements:**
- Format: PNG, JPG, or JPEG
- Max size: 10MB
- Clear, well-lit photos work best

## 🎨 Demo Workflow

1. **Sign Up** → Enter name, email, password
2. **Dashboard** → See upload area
3. **Upload** → Drag image or click to browse
4. **Detect** → Click "Detect Objects" button
5. **View Results** → See table with detections
6. **Sort** → Click column headers (Object, Confidence)
7. **Ask Questions** → Type in Q&A section
8. **Get Answers** → AI responds with context
9. **Upload New** → Click "Remove Image" and start over

## 💡 Pro Tips

- **Better Detection**: Use high-quality images with clear objects
- **Faster Response**: Images under 2MB process quicker
- **Better AI Answers**: Ask specific questions about the detections
- **Multiple Sessions**: Open multiple tabs to test different users
- **Mobile Testing**: Use Chrome DevTools device emulation

## 🚀 Next Steps

### For Development:
- Add database (PostgreSQL, MongoDB)
- Implement file upload to cloud storage (AWS S3, Cloudinary)
- Add user profile management
- Implement password reset flow
- Add rate limiting for API endpoints

### For Production:
- Deploy to Vercel (automatic HTTPS)
- Set up proper database
- Configure image optimization
- Add monitoring (Sentry, LogRocket)
- Implement proper error boundaries

## 📝 API Testing with curl

### Test Signup:
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","password":"password123"}'
```

### Test Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

## 🎓 Assignment Checklist

✅ **Technical Requirements:**
- [x] Next.js 14+ with TypeScript
- [x] YOLO object detection integration
- [x] Google Gemini AI Q&A system
- [x] JWT-based authentication
- [x] Image upload with validation
- [x] Sortable results table
- [x] Responsive UI with Tailwind CSS

✅ **Features:**
- [x] User signup/login
- [x] Protected dashboard route
- [x] Drag & drop image upload
- [x] Real-time object detection
- [x] Bounding box visualization
- [x] Confidence score display
- [x] AI-powered Q&A chat
- [x] Sortable detection results

✅ **Code Quality:**
- [x] TypeScript types defined
- [x] Reusable utility functions
- [x] Proper error handling
- [x] Clean code structure
- [x] Comprehensive README
- [x] Environment configuration

## 🎉 You're All Set!

The AI Vision Platform is ready to use. Start by creating an account and uploading your first image!

**Need help?** Check the main README.md for detailed documentation.

---

Made with ❤️ for the Full Stack AI Developer Assignment
