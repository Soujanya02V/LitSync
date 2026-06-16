# LitSync 📚

### AI-Powered Literature Review Assistant

**Live Link:** [https://litsync-3m78.onrender.com/](https://litsync-3m78.onrender.com/)

LitSync helps researchers, students, and developers organize research papers, generate literature survey metadata automatically, and compare papers in a structured format.

---

## 🚀 Features

* 🔐 Google Authentication (Firebase)
* 📁 Folder-based research organization
* 📄 PDF upload and cloud storage
* 🤖 AI-powered metadata generation
* 📝 Automatic extraction of:

  * Title
  * Authors
  * Publication Year
  * Keywords
  * Summary
  * Methodology
  * Advantages
  * Disadvantages
  * Limitations
  * Future Scope
* 📊 Literature comparison table
* ✏️ Editable paper metadata
* 📥 Export comparison tables to PDF
* ☁️ Cloudinary-based file management

---

## 🧠 AI Workflow

```text
PDF Upload
    ↓
Cloudinary Storage
    ↓
PDF Text Extraction
    ↓
AI Analysis (Groq)
    ↓
Metadata Generation
    ↓
MongoDB Storage
```

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* React Router
* Firebase Authentication
* Axios
* React Hot Toast

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose

### AI & Storage

* Groq API
* Cloudinary
* pdf-parse

---

## 📌 Use Cases

* Literature Reviews
* Research Paper Analysis
* Academic Projects
* Survey Paper Preparation
* Research Organization

---

## ⚙️ Setup

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Backend

```env
MONGO_URI=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
GROQ_API_KEY=
```

### Frontend

```env
VITE_BACKEND_API_URL=
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

---

## 🎯 Future Improvements

* AI-powered paper recommendations
* Advanced search and filtering
* Citation generation
* Research analytics dashboard
* Multi-user collaboration

---

## 👨‍💻 Author

**Soujanya Maharudra**
