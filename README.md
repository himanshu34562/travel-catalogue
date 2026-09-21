# Travel Catalogue (MERN + AWS)

A simple travel destination catalogue: add entries, list them, filter by country/category/price, with graceful input validation. Built with MongoDB Atlas, Express, React (Vite), and Node — deployable on a single AWS EC2 instance.

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
4. Network Access → allow access from anywhere (0.0.0.0/0) for simplicity, or your Azure VM's public IP once you have it.
5. Connect → Drivers → copy the connection string into `backend/.env` as `MONGODB_URI`.

## 3. Deploy to Azure

### Create the VM
1. Sign up at azure.microsoft.com/en-in/free/students (no credit card required).
2. In the Azure Portal, create a **Virtual Machine**:
   - Image: Ubuntu Server 22.04 LTS
   - Size: B1s (free-tier eligible)
   - Authentication: SSH public key (or password, simpler for beginners)
3. Under **Networking**, add an inbound rule allowing port **80** (HTTP) and confirm port **22** (SSH) is open.
4. Once created, note the VM's **public IP address**.

### Deploy the app
1. SSH into the VM:
```bash
   ssh azureuser@<VM-public-IP>
```
2. Install Node.js and git:
```bash
   sudo apt update && sudo apt install -y nodejs npm git
```
3. Clone/copy this project onto the VM.
4. Build the frontend and install backend deps:
```bash
   cd frontend && npm install && npm run build && cd ..
   cd backend && npm install
```
5. Create `backend/.env` with your `MONGODB_URI` and set `NODE_ENV=production`.
6. Run the server with pm2 so it stays alive:
```bash
   sudo npm install -g pm2
   sudo pm2 start server.js --name travel-app -- --port 80
```
   (Or run on port 5000 and set up an Nginx reverse proxy if you want port 80 without `sudo`.)
7. Your **public URL** is `http://<VM-public-IP>`.

## 4. Extra cloud features to add
- **Azure Blob Storage** — store uploaded destination images in a blob container instead of raw URLs. Create a Storage Account → Container, get the connection string, and use the `@azure/storage-blob` SDK in the backend to upload files and save the resulting blob URL in MongoDB.
- **Azure Monitor** — enable basic logging/metrics on your VM (Azure Portal → your VM → Monitoring) so you can screenshot request/error activity for your report.
- (Optional alternative: Azure AD B2C for user authentication.)

## 5. Before submitting
- Take screenshots of the working app (add/list/filter).
- Note your public URL, architecture decisions, and the two features you added, with a diagram, in your PDF.
- **Stop or deallocate the VM when not grading**, to avoid running up costs (deallocating, not just stopping, avoids charges).