# LitSync 📚

LitSync is a full-stack literature review assistant designed to help users organize, upload, analyze, and compare research papers efficiently.

## 🚀 Features

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
- React
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Storage
- Cloudinary

---

## 📂 Project Structure

```bash
client/
server/
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone <repo-url>
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

Create a `.env` file inside `server/`

```env
PORT=5000
MONGO_URI=your_mongodb_uri

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## ▶️ Run Project

### Backend

```bash
npm run dev
```

### Frontend

```bash
npm run dev
```

---

## 📌 Future Improvements

- 🤖 AI-based metadata autofill from PDFs
- 🔐 User authentication
- 📑 Export comparison tables
- 🧠 AI-powered literature summarization
- 📊 Advanced analytics dashboard

---

## 📸 Current Functionalities

- Upload PDFs
- Store metadata in MongoDB
- Compare papers in table format
- Edit research analysis fields
- Cloud-based file storage

---

## 👨‍💻 Author

Soujanya Maharudra