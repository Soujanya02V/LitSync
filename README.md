# LitSync 📚
# Literature Survey Assistant

LitSync is a full-stack literature review assistant that helps users organize, analyze, compare, and manage research papers efficiently through structured metadata extraction, comparison tables, cloud storage, and user-specific workspaces.

---

## 🚀 Features

### 🔐 Authentication
- Firebase Google Authentication
- Login-gated application flow
- Persistent user sessions
- Secure logout functionality

### 📁 Folder & Paper Management
- Create research folders
- Upload research papers (PDFs)
- User-specific folders and papers
- Delete papers and folders
- Cloudinary-powered cloud storage

### 📝 Research Metadata
Store and manage:
- Authors
- Publication Year
- Summary
- Methodology
- Advantages
- Disadvantages
- Limitations
- Future Scope
- Keywords

### 📊 Literature Comparison
- Dynamic paper cards UI
- Expand/collapse paper details
- Editable comparison table
- Structured literature survey view
- PDF export for comparison tables

### 🧱 Architecture Improvements
- Reusable React components
- Modular frontend structure
- Firebase auth integration
- Scalable component-based UI

---

# 🛠️ Tech Stack

## Frontend
- React (Vite)
- React Router
- Axios
- Firebase Authentication
- react-hot-toast

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

## Cloud & Storage
- Cloudinary

---
 // added toast message!
# 📂 Project Structure

```text
LR_Survey_Assistant/
├── client/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   │   ├── UploadModal.jsx
│   │   │   ├── PaperCard.jsx
│   │   │   ├── PaperTable.jsx
│   │   │   └── EmptyState.jsx
│   │   ├── contexts/
│   │   ├── firebase/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── .env
│
└── server/
    ├── Models/
    ├── Routes/
    ├── Controllers/
    ├── index.js
    └── .env
```

---

# ⚙️ Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone <repo-url>
cd LR_Survey_Assistant
```

---

## 2️⃣ Install Dependencies

### Client

```bash
cd client
npm install
```

### Server

```bash
cd server
npm install
```

---

# 🔑 Environment Variables

## Server (`server/.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_uri

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Client (`client/.env`)

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

# ▶️ Run Project

## Backend

```bash
cd server
npm run dev
```

## Frontend

```bash
cd client
npm run dev
```

---

# 🔐 Authentication Flow

- Users authenticate using Google Sign-In
- Firebase manages session persistence
- Unauthenticated users only see the login screen
- Authenticated users access:
  - folders
  - papers
  - comparison tables
  - exports

---

# 📄 PDF Export

Users can export literature comparison tables as PDF reports.

Export includes:
- Title
- Methodology
- Advantages
- Disadvantages
- Limitations
- Future Scope

---

# 📌 Future Improvements

## 🤖 AI Integration
- AI-powered metadata autofill
- Research paper summarization
- Semantic paper search
- Literature insights generation

## 🌐 Platform Improvements
- Deployment
- Advanced filtering/sorting
- Collaboration features
- Dashboard analytics

---

# 📸 Current Functionalities

✅ Firebase Authentication  
✅ User-specific workspaces  
✅ Cloudinary PDF uploads  
✅ Metadata management  
✅ Editable comparison tables  
✅ PDF export system  
✅ Modular React architecture  

---

# 👨‍💻 Author

Soujanya Maharudra