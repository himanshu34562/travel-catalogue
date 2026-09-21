# Wayfarer — Travel Catalogue (MERN + GCP)

A travel destination catalogue: add entries, list them, filter by country/category/price, with graceful input validation. Built with MongoDB Atlas, Express, React (Vite), and Node — deployed on a Google Cloud Platform Compute Engine VM.

## Project structure
```
travel-catalogue/
  backend/    Express API + Mongoose models
  frontend/   React (Vite) UI
```

## 1. Local setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# edit .env: paste your MongoDB Atlas connection string
npm run dev        # starts on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev         # starts on http://localhost:5173, proxies /api to :5000
```
Open http://localhost:5173 and confirm you can add, list, and filter destinations.

## 2. Set up MongoDB Atlas (data layer)
1. Create a free account at mongodb.com/cloud/atlas.
2. Create a free (M0) cluster.
3. Database Access → add a user with a password.
4. Network Access → allow access from anywhere (0.0.0.0/0), or your GCP VM's external IP once you have it.
5. Connect → Drivers → copy the connection string into `backend/.env` as `MONGODB_URI`.

## 3. Deploy to Google Cloud Platform

### Create the VM
1. Sign in at console.cloud.google.com with your education-credit account.
2. Create a new project (e.g. `travel-catalogue`).
3. Go to **Compute Engine → VM instances → Create Instance**:
   - Name: `travel-catalogue-vm`
   - Region: your choice (e.g. `asia-south1`)
   - Machine type: `e2-micro` (free-tier eligible)
   - Boot disk: Ubuntu 22.04 or 24.04 LTS
   - Firewall: check **Allow HTTP traffic** and **Allow HTTPS traffic**
4. Once running, note the VM's **External IP**.

### Deploy the app
1. Click the **SSH** button next to your VM in the console to open a browser terminal (no key pair needed).
2. Install Node.js and git:
   ```bash
   sudo apt update && sudo apt install -y nodejs npm git
   ```
3. Clone the repo:
   ```bash
   git clone https://github.com/<your-username>/travel-catalogue.git
   cd travel-catalogue
   ```
4. Build the frontend and install backend deps:
   ```bash
   cd frontend && npm install && npm run build && cd ..
   cd backend && npm install
   ```
5. Create `backend/.env` (`nano .env`) with your `MONGODB_URI` and `NODE_ENV=production`.
6. In MongoDB Atlas → Network Access, add this VM's external IP (or keep 0.0.0.0/0).
7. Run the server with pm2 so it stays alive:
   ```bash
   sudo npm install -g pm2
   sudo pm2 start server.js --name travel-app -- --port 80
   ```
8. Your **public URL** is `http://<VM-external-IP>`.

## 4. Extra cloud features to add
- **Google Cloud Storage** — store uploaded destination images in a bucket instead of raw URLs. Create a bucket, use the `@google-cloud/storage` SDK in the backend to upload files and save the resulting public URL in MongoDB.
- **Cloud Logging / Cloud Monitoring** — view request and error logs for your VM under Compute Engine → your VM → Logs, or Cloud Monitoring's dashboards, and screenshot this for your report.
- (Optional alternative: Firebase Authentication for user login.)

## 5. Before submitting
- Take screenshots of the working app (add/list/filter).
- Note your public URL, architecture decisions, and the two features you added, with a diagram, in your PDF.
- **Stop the VM when not grading**, to avoid running up costs (Compute Engine → VM instances → select → Stop).