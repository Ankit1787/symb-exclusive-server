# Backend Deployment Skill

This skill documents how to deploy the Express TypeScript backend to cloud hosting platforms like Render or using Docker containers.

## Deployment Target Options

### Option A: Automated Deploy via GitHub Actions & Render (Recommended)
We have configured a deployment trigger in `.github/workflows/deploy.yml` that fires on pushes to the `main` branch.

#### Setup Repository Secrets on GitHub:
1. Go to your server repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Add the following secret:
   - `RENDER_DEPLOY_HOOK_URL`: The Deploy Hook URL provided by Render in your Web Service dashboard settings (looks like `https://api.render.com/deploy/srv-...`).

---

### Option B: Direct Deploy to Render
1. **Create Web Service**: Create a new Web Service on Render and link your GitHub repository.
2. **Configure Root Directory**: Leave as default root (since this repository has Express at the root).
3. **Configure Environment**:
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
4. **Environment Variables**: Add environment variables in Render Dashboard:
   - `PORT=10000` (Render binds automatically to this port)
   - `MONGO_URI=mongodb+srv://...` (your production MongoDB cluster connection string)
   - `JWT_SECRET=your_production_secret`

---

### Option C: Deploy with Docker
If deploying to platforms like AWS ECS, Fly.io, or Google Cloud Run, use the Docker-based deployment:

1. Create a `Dockerfile` in the server root folder:
   ```dockerfile
   FROM node:20-alpine AS builder
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   COPY . .
   RUN npm run build

   FROM node:20-alpine AS runner
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --omit=dev
   COPY --from=builder /app/dist ./dist
   COPY products.json ./
   EXPOSE 5001
   ENV PORT=5001
   CMD ["node", "dist/index.js"]
   ```
2. Build the Docker image:
   ```powershell
   docker build -t exclusive-backend .
   ```
3. Run the container:
   ```powershell
   docker run -p 5001:5001 --env-file .env exclusive-backend
   ```
