# Deployment Guide

This guide explains how to deploy the AI Customer Support Assistant application to the cloud.

---

## 💾 Prerequisites
- A **MongoDB Atlas** account (already configured in the project).
- A **Google AI Studio** account (to get your Gemini API Key).
- A **GitHub** account (with your code pushed to a repository).
- Accounts on **Render** (for backend hosting) and **Vercel** (for frontend hosting).

---

## 1. Deploy the Backend (FastAPI) on Render

[Render](https://render.com/) is a cloud platform that makes it simple to host web APIs. We will use the existing `Dockerfile` in the `backend` directory to build and run the service.

1. **Sign In**: Go to [Render](https://render.com/) and sign in with your GitHub account.
2. **Create Web Service**:
   - Click the **New +** button in the dashboard and select **Web Service**.
   - Select your repository (`AI-Customer-Support-Assistant`) and click **Connect**.
3. **Configure Settings**:
   - **Name**: `ai-customer-support-backend` (or any name you prefer).
   - **Root Directory**: `backend` (very important!).
   - **Runtime**: Select **Docker** (Render will automatically detect the `Dockerfile` inside the `backend` directory).
   - **Instance Type**: Select the **Free** tier.
4. **Configure Environment Variables**:
   - Click the **Advanced** button or go to the **Environment** tab.
   - Add the following environment variables:
     *   `MONGO_URI`: `mongodb+srv://aditikhatri217_db_user:211030@cluster0.6r9sndp.mongodb.net/?appName=Cluster0` (or your custom MongoDB Atlas URI).
     *   `GEMINI_API_KEY`: Your Gemini API key from Google AI Studio.
     *   `JWT_SECRET`: A secure random password/string of your choice (e.g., `your_custom_jwt_secret_key_here`).
5. **Deploy**:
   - Click **Deploy Web Service**.
   - Render will build the Docker container and start your server.
   - Once successfully deployed, note down the provided Render URL (e.g., `https://ai-customer-support-backend.onrender.com`).

---

## 2. Deploy the Frontend (React / Vite) on Vercel

[Vercel](https://vercel.com/) is the optimal platform for deploying static frontend frameworks like React and Vite.

1. **Sign In**: Go to [Vercel](https://vercel.com/) and sign in with your GitHub account.
2. **Import Project**:
   - Click **Add New** -> **Project**.
   - Import your repository (`AI-Customer-Support-Assistant`).
3. **Configure Settings**:
   - **Project Name**: `ai-customer-support-assistant` (or any name you prefer).
   - **Root Directory**: Edit and set this to `frontend`.
   - **Framework Preset**: Vercel will automatically detect **Vite**.
4. **Configure Environment Variables**:
   - Expand the **Environment Variables** section.
   - Add the following key and value:
     *   **Key**: `VITE_API_URL`
     *   **Value**: `https://<YOUR-RENDER-BACKEND-URL>/api` (Replace `<YOUR-RENDER-BACKEND-URL>` with the live Render backend URL you saved in Step 1, e.g., `https://ai-customer-support-backend.onrender.com/api`).
5. **Deploy**:
   - Click **Deploy**.
   - Vercel will build the frontend and host it on a public URL (e.g., `https://ai-customer-support-assistant.vercel.app`).

---

## 3. Verify the Deployment
Open the live frontend Vercel URL in your browser. Register a new user, log in, open the AI chat, and create/manage tickets. All data will be saved securely to MongoDB Atlas, and the AI chatbot will use your live Gemini API key!
