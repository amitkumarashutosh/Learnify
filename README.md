# Learnify

A full-stack e-learning platform that enables users to access and consume educational video content.

## 🚀 Live Demos

- [Render Deployment](https://learnify-wjw3.onrender.com/)
  <img width="1512" alt="Screenshot 2025-01-03 at 11 39 53 AM" src="https://github.com/user-attachments/assets/ca4f1aac-d926-48f1-af7e-15946cb6ac7a" />

## ✨ Features

### User Features

- User authentication and profile management
- Browse and purchase courses
- Video content playback with progress tracking
- Multiple video platform support (YouTube, Vimeo, Facebook, DailyMotion, etc.)
- Course progress tracking

### Course Features

- Video content integration from multiple platforms
- Course purchase functionality
- Progress tracking per course
- Media management system

## 💻 Tech Stack

- Frontend: React + Vite
- Backend: Node.js/Express
- Database: MongoDB
- Video Players: Support for multiple platforms

## 🛠️ Local Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/learnify.git
```

2. Create .env file in server

```bash
CLIENT_BASE_URL = <your-client-base-url>
CLOUDINARY_API_KEY = <your-cloudinary-api-key>
CLOUDINARY_API_SECRET = <your-cloudinary-api-secret>
CLOUDINARY_CLOUD_NAME = <your-cloudinary-cloud-name>
JWT_SECRET = <your-jwt-secret>
MONGO_URI = <your-mongo-uri>
PORT = 3000
STRIPE_PUBLISHABLE_KEY = <your-stripe-publishable-key>
STRIPE_SECRET_KEY = <your-stripe-secret-key>
WEBHOOK_ENDPOINT_SECRET = <your-webhook-endpoint-secret>
WEBAUTHN_RP_ID = <your-server-id>
WEBAUTHN_ORIGIN = <your-webauthn-origin>
WEBAUTHN_RP_NAME = <your-webauthn-rp-name>
RESEND_API_KEY = <your-resend-api-key>
```

3. Install dependencies,run client and server, then view the application at http://localhost:3000

```bash
cd client && npm install && npm run build && npm run dev
cd server && npm install && npm run build && npm run dev/npm start
```
