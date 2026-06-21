# AI Customer Support Assistant (8-Bit Retro Theme)

### 🔗 Live Demo: [https://ai-customer-support-assistant-gray.vercel.app](https://ai-customer-support-assistant-gray.vercel.app)

An AI-powered customer support platform featuring a highly stylized, blocky **8-bit indie game interface**. This application enables users to authenticate securely, converse with a context-aware AI support chatbot, and manage support ticket workflows in real-time.

---

## 🛠️ Tech Stack

### Frontend
- **React.js**: Component-based user interface library.
- **Vite**: Ultra-fast build tool and dev server.
- **Tailwind CSS v3**: Utility-first CSS framework configured for custom arcade/retro styling.
- **Axios**: Promise-based HTTP client for API requests, complete with JWT authorization interceptors.
- **React Router**: Client-side routing for seamless page navigation.
- **Lucide React**: Crisp vector icons library.

### Backend
- **Python**: Core backend programming language.
- **FastAPI**: Modern, high-performance ASGI framework for building APIs.
- **PyMongo**: Python driver for MongoDB interaction.
- **Python-Jose**: Library for generating and verifying JSON Web Tokens (JWT).
- **Bcrypt**: Library for secure password hashing.

### Database & AI
- **MongoDB Atlas**: Fully-managed cloud NoSQL database for users, chat sessions, and tickets.
- **Gemini API**: Integration with Google's Gemini generative AI model (using the official `google-generativeai` SDK) to drive the support chatbot.
