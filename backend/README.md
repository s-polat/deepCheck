# DeepCheck Backend API

AI-powered photo and video verification backend service using OpenAI GPT-4 Vision and Cloudinary.

## 🚀 Features

- **AI Analysis**: GPT-4 Vision powered deepfake and AI-generated content detection
- **File Upload**: Support for images and videos up to 30MB
- **URL Analysis**: Direct analysis of media URLs from social platforms
- **Cloud Storage**: Cloudinary integration for temporary file handling
- **RESTful API**: Clean REST endpoints for frontend integration
- **Security**: Helmet, CORS, and input validation
- **Monitoring**: Request logging and health checks

## 🛠 Tech Stack

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js
- **AI Service**: OpenAI GPT-4 Vision API
- **Storage**: Cloudinary (Free Tier)
- **Security**: Helmet, CORS
- **File Upload**: Multer
- **Environment**: dotenv

## 📋 Prerequisites

1. **Node.js** (v18+ recommended)
2. **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/api-keys)
3. **Cloudinary Account** - Create free account at [Cloudinary](https://cloudinary.com/)

## 🔧 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your `.env` file with:
   ```env
   OPENAI_API_KEY=sk-your_openai_api_key_here
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **For production:**
   ```bash
   npm start
   ```

## 📡 API Endpoints

### Health Check
```http
GET /health
```

### File Analysis
```http
POST /api/analyze/file
Content-Type: multipart/form-data

file: [image/video file]
```

### URL Analysis
```http
POST /api/analyze/url
Content-Type: application/json

{
  "url": "https://example.com/image.jpg"
}
```

## 📊 Response Format

```json
{
  "success": true,
  "result": {
    "is_ai_generated": false,
    "confidence": 0.85,
    "analysis_time": 2.5,
    "model_version": "GPT-4 Vision v1.0",
    "details": {
      "reasoning": "Detailed analysis explanation...",
      "artifacts": ["list", "of", "indicators"],
      "probability_scores": {
        "AI Generated": 0.15,
        "Real Image": 0.85,
        "Edited Image": 0.10
      }
    }
  }
}
```

## 🔒 Security Features

- **File Type Validation**: Only allowed image/video formats
- **Size Limits**: 30MB maximum file size
- **CORS Protection**: Configured for frontend domain
- **Helmet**: Security headers
- **Input Sanitization**: URL and file validation

## 💰 Cost Optimization

- **Cloudinary Free Tier**: 25GB storage, 25GB bandwidth/month
- **OpenAI GPT-4 Vision**: ~$0.01 per image analysis
- **Render Free Tier**: Hosting for hobby projects

Estimated cost for 100 analyses/month: **~$1-2**

## 🚀 Deployment

### Render (Recommended)

1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Deploy automatically on git push

### Environment Variables for Production

```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-frontend-domain.com
OPENAI_API_KEY=your_production_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 📝 Development

```bash
# Start with nodemon (auto-reload)
npm run dev

# Check health
curl http://localhost:3000/health

# Test file upload
curl -X POST \
  -F "file=@test-image.jpg" \
  http://localhost:3000/api/analyze/file
```

## 🤝 Integration with Frontend

The API is designed to work with the Angular frontend. Make sure to:

1. Update frontend `ApiService` with correct backend URL
2. Handle CORS in both development and production
3. Implement proper error handling for API responses

## 📄 License

MIT License - see LICENSE file for details
