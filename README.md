# 🔍 DeepCheck — AI Image & Video Verification

DeepCheck is a full-stack web application that uses **GPT-4o Vision** to detect whether images or videos are AI-generated or real.

🌐 **Live Demo:** [aideepcheck.netlify.app](https://aideepcheck.netlify.app)

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 19, Bootstrap 5 |
| Backend | Node.js, Express |
| AI Analysis | OpenAI GPT-4o Vision |
| Media Storage | Cloudinary |
| Frontend Deploy | Netlify |
| Backend Deploy | Render |

---

## 📦 Project Structure

```
deepCheck/
├── frontend/        # Angular 19 app
│   ├── src/
│   │   ├── app/
│   │   ├── environments/
│   │   │   ├── environment.ts          # Local dev (localhost)
│   │   │   └── environment.prod.ts     # Production (Render URL)
│   │   └── assets/
│   └── netlify.toml
└── backend/         # Node.js + Express API
    ├── server.js
    └── .env         # (gitignored — never commit this!)
```

---

## 🌍 Deployments

### Frontend → Netlify
- **URL:** [aideepcheck.netlify.app](https://aideepcheck.netlify.app)
- **Platform:** [app.netlify.com](https://app.netlify.com)
- **Build Command:** `ng build --configuration=production`
- **Publish Directory:** `dist/frontend/browser`
- **Base Directory:** `frontend`
- Auto-deploys on push to `main` branch

### Backend → Render
- **URL:** [deepcheck-backend.onrender.com](https://deepcheck-backend.onrender.com)
- **Platform:** [render.com](https://render.com)
- **Start Command:** `npm start`
- **Environment:** Node.js
- **Health Check:** `/health`

---

## ⚙️ Environment Variables

### Backend (Render Dashboard → Environment)

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |
| `NODE_ENV` | `production` |
| `FRONTEND_URL` | `https://aideepcheck.netlify.app` |
| `OPENAI_API_KEY` | OpenAI API key |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

> ⚠️ **Never commit `.env` to GitHub!** Always set secrets via Render dashboard.

---

## 🖥️ Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your keys
npm start
# → http://localhost:3000
```

### Frontend
```bash
cd frontend
npm install
ng serve
# → http://localhost:4200
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Server health check |
| `POST` | `/api/analyze/file` | Analyze uploaded file |
| `POST` | `/api/analyze/url` | Analyze image from URL |
| `GET` | `/api/formats` | Supported file formats |

---

## 🧪 Supported Formats

### Images (max 10MB)
`JPEG` `PNG` `GIF` `WebP`

### Videos (max 30MB)
`MP4` `AVI` `MOV` `WMV` `WebM`

---

## 📄 License

MIT
