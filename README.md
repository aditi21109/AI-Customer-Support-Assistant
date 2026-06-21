# AI Customer Support Assistant (8-Bit Retro Theme)

An AI-powered customer support platform featuring a highly stylized, blocky **8-bit indie game interface**. This application enables users to authenticate securely, converse with a context-aware AI support chatbot, and manage support ticket workflows in real-time.

---

## 🚀 Key Features

*   **🎮 Indie Game Visual Aesthetic**: Features custom CRT scanline monitor overlays, retro grid wireframe backgrounds, and blocky custom offsets with classic 2D game interface properties.
*   **🔑 Secure Authentication**: Implements JSON Web Token (JWT) session persistence stored locally on the browser, backed by native bcrypt password hashing on the server.
*   **💬 Context-Aware AI Chatbot**: Integrates Google's **Gemini 1.5 Flash API** to generate real-time customer support replies and categorize messages automatically. Includes offline rules-based fallback triggers.
*   **🎫 Ticket Management Board**: Provides a dynamic panel where customers can submit support tickets, filter by status, and update severity or priority.

---

## 🛠️ Technology Stack

### Frontend
- **React.js** (Component-based user interface framework)
- **Vite** (Next-generation build tool & dev server)
- **Tailwind CSS v3** (Utility-first styling theme configurations)
- **Axios** (HTTP client with request/response authorization interceptors)
- **React Router** (Client-side page navigation routing)
- **Lucide React** (Vector icons library)

### Backend
- **Python** (Core application programming language)
- **FastAPI** (High-performance ASGI web framework for REST APIs)
- **PyMongo** (MongoDB Python client driver)
- **Python-Jose** (JWT token encoding/decoding)
- **Bcrypt** (Secure password hashing)

### Database & AI
- **MongoDB Atlas** (Cloud NoSQL document database)
- **Gemini API** (`google-generativeai` SDK integrations)

---

## ⚙️ Installation & Running Steps

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables in `backend/.env`:
   - Set `MONGO_URI` to your MongoDB Atlas connection string.
   - Set `GEMINI_API_KEY` to your Google AI Studio API key.
5. Launch the FastAPI Uvicorn server:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

### 2. Frontend Setup
1. Open a new terminal window, navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev -- --force
   ```
