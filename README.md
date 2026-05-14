# LitSync 📚
# Literature Survey Assistant

LitSync is a full-stack literature review assistant designed to help users organize, upload, analyze, and compare research papers efficiently.

## 🚀 Features

- 🔐 **Firebase Authentication (Google Sign-In)** — guests see a centered login screen; signed-in users access the app
- 📁 Create and manage research folders
- 📄 Upload research papers (PDFs)
- ☁️ Cloudinary integration for file storage
- 📝 Add metadata for papers:
  - Authors
  - Year
  - Summary
  - Methodology
  - Advantages
  - Disadvantages
  - Limitations
  - Future Scope
  - Keywords
- 🗂️ Dynamic paper cards UI
- 📊 Table view for literature comparison
- ✏️ Editable comparison table
- 🧹 Delete papers
- 🔍 Expand/collapse paper details

---

## 🛠️ Tech Stack

### Frontend

- React (Vite)
- React Router
- Axios
- Firebase Auth (Google provider)
- react-hot-toast

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

### Storage

- Cloudinary

---

## 📂 Project Structure

```text
LR_Survey_Assistant/
├── client/                 # Vite + React SPA
│   ├── src/
│   │   ├── api/            # API helpers (e.g. folders)
│   │   ├── firebase/       # Firebase app + auth exports
│   │   ├── pages/          # Home, FolderPage, Login
│   │   ├── App.jsx         # Auth gating + routes
│   │   └── main.jsx
│   └── .env                # Client env (create locally; not committed if secrets)
└── server/                 # Express API
    └── ...
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <repo-url>
cd LR_Survey_Assistant
```

### 2️⃣ Install Dependencies

#### Client

```bash
cd client
npm install
```

#### Server

```bash
cd server
npm install
```

---

## 🔑 Environment Variables

### Server

Create a `.env` file inside `server/`:

```env
PORT=5000
MONGO_URI=your_mongodb_uri

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Client

Create a `.env` file inside `client/` (Vite exposes only variables prefixed with `VITE_`):

```env
VITE_BACKEND_API_URL=http://localhost:5000

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

In the [Firebase Console](https://console.firebase.google.com/), enable **Google** under Authentication → Sign-in method, and add your local dev origin (for example `http://localhost:5173`) under Authentication → Settings → **Authorized domains** if needed.

---

## ▶️ Run Project

Run the API and the client from **two terminals** (or background processes).

### Backend

```bash
cd server
npm run dev
```

### Frontend

```bash
cd client
npm run dev
```

The Vite dev server URL is printed in the terminal (typically `http://localhost:5173`).

---

## 🔐 Authentication Behavior

- The client initializes Firebase from `client/src/firebase/firebase.js`.
- `App.jsx` uses `onAuthStateChanged` to track the current user.
- **Not signed in:** only the **Login** view is shown (Google sign-in via popup).
- **Signed in:** the existing router, home dashboard, and folder routes are available.
- **Home** includes a **Logout** button that calls Firebase `signOut`; the listener then returns the user to the login screen.

---

## 📌 Future Improvements

- 🤖 AI-based metadata autofill from PDFs
- 🔗 Optional: verify Firebase ID tokens on the server and tie folders/papers to user accounts
- 🧠 AI-powered literature summarization
- 📊 Advanced analytics dashboard

---

## 📸 Current Functionalities

- Google Sign-In and session-aware UI (login gate + logout)
- Upload PDFs
- Store metadata in MongoDB
- Compare papers in table format
- Edit research analysis fields
- Export comparison tables
- Cloud-based file storage

---

## 👨‍💻 Author

Soujanya Maharudra
