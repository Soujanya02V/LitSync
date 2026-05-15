# LitSync Frontend 🎨

Frontend client for LitSync — a literature survey assistant built with React and Vite.

---

# 🚀 Features

- Firebase Google Authentication
- Login-gated UI
- Research folder management
- PDF upload interface
- Dynamic paper cards
- Editable literature comparison tables
- PDF export functionality
- Modular reusable React components

---

# 🛠️ Frontend Tech Stack

- React
- Vite
- React Router
- Axios
- Firebase Authentication
- react-hot-toast

---

# 📂 Frontend Structure

```text
src/
├── api/
├── components/
│   ├── UploadModal.jsx
│   ├── PaperCard.jsx
│   ├── PaperTable.jsx
│   └── EmptyState.jsx
├── contexts/
├── firebase/
├── pages/
├── App.jsx
└── main.jsx
```

---

# ⚙️ Environment Variables

Create a `.env` file inside `client/`

```env
VITE_BACKEND_API_URL=http://localhost:5000

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

# ▶️ Run Frontend

```bash
npm install
npm run dev
```

---

# 🔐 Authentication

The frontend uses Firebase Google Authentication.

- Logged-out users only see the login page
- Logged-in users access the LitSync dashboard

---

# 📌 Future Improvements

- AI-powered metadata autofill
- Responsive design improvements
- Better analytics dashboard
- Semantic research search

---

# 👨‍💻 Author

Soujanya Maharudra