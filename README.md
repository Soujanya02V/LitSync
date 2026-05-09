# LR Survey Assistant (LitSync)

Full-stack app to organize folders and upload papers (PDF/other docs) to Cloudinary, storing metadata in MongoDB.

## Tech stack

- **Client**: React + Vite
- **Server**: Node.js + Express
- **DB**: MongoDB (Mongoose)
- **File storage**: Cloudinary (raw uploads)

## Project structure

- `client/` — frontend (Vite)
- `server/` — backend API (Express)

## Setup

### 1) Server environment variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
```

### 2) Client environment variables

Create `client/.env`:

```env
VITE_BACKEND_API_URL=http://localhost:5000
```

## Install dependencies

From the repo root:

```bash
cd server
npm install
```

```bash
cd ../client
npm install
```

## Run locally

### Start the server

```bash
cd server
npm run dev
```

### Start the client

```bash
cd client
npm run dev
```

Open the client URL printed by Vite (usually `http://localhost:5173`).

## API overview

### Folders

- `GET /folders` — list folders
- `POST /folders` — create folder
- `DELETE /folders/:folderId` — delete folder + its papers (also removes Cloudinary assets)

### Papers

- `GET /papers/:folderId` — list papers in a folder
- `POST /papers/upload` — upload a paper file (multipart/form-data)
  - fields: `file`, `folderId`, `authors`, `year`, `summary`, `keywords`
  - `keywords` can be a JSON array string (e.g. `["a","b"]`) or a comma-separated string (server accepts both)
- `DELETE /papers/:paperId` — delete a paper (also removes the Cloudinary asset)

## Notes

- The server uploads files to Cloudinary using `resource_type: "raw"` and stores `secure_url` (with `?fl_attachment=false`) in the `Paper.fileUrl` field.

