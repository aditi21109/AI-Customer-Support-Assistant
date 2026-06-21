# AI Customer Support Assistant (Full-Stack Platform)

Welcome to the **AI Customer Support Assistant** project repository! This production-style full-stack application enables users to chat with a contextualized AI customer support assistant, submit support tickets, modify ticket properties, and view their conversation histories.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- **MongoDB** (Local instance or MongoDB Atlas URL)

---

### 2. Backend Installation & Run
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install required packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables inside `backend/.env`:
   - Replace `GEMINI_API_KEY` with your actual Gemini API Key from Google AI Studio.
   - Adjust `MONGO_URI` if using MongoDB Atlas.
5. Run the validation test script:
   ```bash
   python test_app.py
   ```
6. Run the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload
   ```
   The backend API documentation will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 3. Frontend Installation & Run
1. Open a new terminal tab/window and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Launch the Vite local development server:
   ```bash
   npm run dev
   ```
   The application web panel will load at: [http://localhost:5173](http://localhost:5173)

---

## 📂 Project Structure

```
AI-Customer-Support-Assistant/
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── __init__.py
│   │   │   ├── utils.py          # Password hashing & JWT token generators
│   │   │   └── dependencies.py   # Security verify injectables
│   │   ├── database/
│   │   │   ├── __init__.py
│   │   │   └── connection.py     # MongoDB connection client
│   │   ├── models/
│   │   │   ├── __init__.py
│   │   │   └── schemas.py        # Pydantic validation schemas
│   │   ├── routes/
│   │   │   ├── __init__.py
│   │   │   ├── auth.py           # Register and login routes
│   │   │   ├── chat.py           # Message submission & history logs
│   │   │   ├── tickets.py        # Ticket CRUD pipelines
│   │   │   └── user.py           # User profiles
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── ai_service.py     # Gemini client + prompts & fallbacks
│   │   ├── __init__.py
│   │   └── main.py               # Uvicorn entrypoint & exception filters
│   ├── Dockerfile                # Production Docker configuration
│   ├── requirements.txt          # Python packages list
│   └── test_app.py               # Verification assertions script
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx        # Navigation bar with access rules
│   │   │   ├── ChatBox.jsx       # Chat layout with scroll anchors
│   │   │   ├── MessageCard.jsx   # Message box with auto-tagging
│   │   │   ├── TicketCard.jsx    # Card holding ticket update commands
│   │   │   ├── ProtectedRoute.jsx# Auth route gatekeeper
│   │   │   └── Loading.jsx       # Dynamic spinner loaders
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Global session state provider
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Card styling form login
│   │   │   ├── Register.jsx      # Card signup form
│   │   │   ├── Dashboard.jsx     # Overview statistics & recent tickets
│   │   │   ├── AIChat.jsx        # Chat interface container
│   │   │   ├── TicketManagement.jsx # Form submit & tickets list
│   │   │   └── Profile.jsx       # Client credential metadata page
│   │   ├── services/
│   │   │   └── api.js            # Axios client with interceptors
│   │   ├── App.jsx               # Routes tree mappings
│   │   ├── index.css             # TailwindCSS imports + styling variables
│   │   └── main.jsx              # React mounting root
│   ├── tailwind.config.js        # CSS rules matching classes
│   ├── postcss.config.js         # Autoprefixer imports
│   └── vercel.json               # SPA routing configurations for Vercel
```

---

## 🎨 Tech Stack & Decision Rationale

### 1. Why React.js + Vite?
- **Component-Based Architecture**: Allows modular, reusable building blocks (`MessageCard`, `TicketCard`, `ChatBox`).
- **State Optimization**: Re-renders elements dynamically only when local states change, ensuring smooth, instant interface response.
- **Vite Performance**: Provides Hot Module Replacement (HMR) for blazing fast development, bundling code using Rollup for optimal production speeds.

### 2. Why FastAPI?
- **Speed**: Built on top of Starlette and Uvicorn, making it one of the fastest Python web frameworks available.
- **Auto-Validation**: Automatic request validation using Pydantic, instantly rejecting bad client payloads with detailed `422 Unprocessable Entity` logs.
- **Swagger Documentation**: Self-generates interactive API documentation at `/docs` out-of-the-box.

### 3. Why MongoDB (Atlas)?
- **NoSQL Schema Flexibility**: Support tickets and chat scripts are semi-structured by nature. Document storage allows fields (like AI-detected category tags) to adapt without modifying database table schemas.
- **PyMongo Native Driver**: Extremely fast connection mapping with native Python dict parsing.

### 4. How JWT Works?
1. The user logs in via `POST /auth/login`.
2. The server verifies credentials and encodes a secure token using a secret key: `HMAC-SHA256(payload, secret)`.
3. The token is sent to the client, which stores it in `localStorage`.
4. For all subsequent requests, the Axios interceptor injects the token into the `Authorization: Bearer <token>` header.
5. FastAPI decodes and verifies the token signature on each protected route call, extracting the user email safely without repeatedly querying databases.

### 5. How AI Integration Works?
- The backend communicates with Google's **Gemini 1.5 Flash** model via the `google-generativeai` package.
- System prompt instructions configure the AI to act as a polite support agent and output replies formatted strictly as JSON (`{ "reply": "...", "category": "..." }`).
- If no Gemini API key is configured, the application automatically handles requests using deterministic offline mock rules, maintaining complete pipeline robustness.

---

## 🎯 Resume Description (Ideal for Internships)

**AI Customer Support Assistant | React, FastAPI, MongoDB, Gemini API**
- Designed and built a responsive customer support platform allowing users to log in, converse with a context-aware AI agent, and manage support tickets.
- Engineered a **FastAPI** backend with **JWT Token Authentication** and secure **bcrypt** password hashing.
- Integrated the **Gemini 1.5 Flash API** to generate real-time client support replies and automatically categorize/prioritize inbound tickets using robust system prompts.
- Configured a **React** client using **Vite**, **Tailwind CSS**, and **Axios** with request/response interceptors to manage token validation states.
- Handled persistent data storage using **MongoDB Atlas** with PyMongo, tracking chat history sequences and ticket statuses.

---

## 🎙️ 5-Minute Interview Explanation Outline

- **Project Introduction (1 Min)**: *"I built a production-style full-stack Customer Support Platform where users get instant, context-aware AI help. If the AI cannot resolve the request, the user can instantly open a support ticket to get assistance from our backend engineers."*
- **Frontend Details (1 Min)**: *"The frontend is a single-page app built with React, Vite, and Tailwind. Authentication is managed globally using React Context. I configured Axios request interceptors to automatically attach JWT authorization headers to subsequent requests."*
- **Backend & Database (1.5 Min)**: *"The backend is implemented with FastAPI. I used Pydantic schemas for payload validation, bcrypt for hashing user passwords, and python-jose to sign and decode JWT tokens. The DB is MongoDB. I chose NoSQL because support tickets and chats are highly flexible and semi-structured in terms of category metadata."*
- **AI Pipelines & Fallbacks (1 Min)**: *"For the AI helper, I integrated Gemini 1.5 Flash. I wrote system prompts to classify incoming messages into technical, billing, or account groups on the fly. To ensure the application is reliable, I implemented an offline fallback mechanism that uses rule-based systems if the API key is not present."*
- **Key Takeaways (0.5 Min)**: *"This project taught me how to manage end-to-end JWT sessions, structure clean FastAPI sub-routers, handle global errors on both frontend and backend, and write resilient integrations for third-party AI APIs."*

---

## 🛠️ Challenges Faced & Future Improvements

### Challenges
1. **JSON Parsing Resilience**: Early prompts sometimes returned markdown-wrapped JSON code blocks (e.g. ` ```json `), which caused python parser errors. Resolved this by building a clean-up string interceptor in `ai_service.py` to extract raw JSON keys.
2. **State Syncing on Page Refresh**: When the user refreshed their browser, React state was wiped, causing protected routes to redirect users to Login. Resolved by adding an app-level `useEffect` in `AuthContext` to fetch the current user's profile on boot if a JWT token is present in local storage.

### Future Improvements
1. **Real-time Live Chat Escalation**: Integrate WebSockets to allow immediate live agent chat takeovers when a ticket status switches to "In Progress".
2. **Automated E-mail Notifications**: Add a background worker task queue (e.g., Celery) to send email alerts to users when engineers update ticket statuses.
