# Backend Deployment Skill

This skill documents how to deploy the Express TypeScript backend to cloud hosting platforms.

## Deployment Target Options

### Option A: Deploy to Render (Recommended)
Render is a cloud hosting provider that supports Node.js web services.

1. **Create Web Service**: Create a new Web Service on Render and link your GitHub repository.
2. **Configure Root Directory**: Set the root directory to `server/` (since this is a multi-repo umbrella project).
3. **Configure Environment**:
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
4. **Environment Variables**: Add environment variables in Render Dashboard:
   - `PORT=10000` (Render binds automatically to this port)
   - `MONGO_URI=mongodb+srv://...` (your production MongoDB cluster connection string)
   - `JWT_SECRET=your_production_secret`

### Option B: Deploy with Docker
If deploying to platforms like AWS ECS, Fly.io, or Google Cloud Run, use the Docker-based deployment:

1. Create a `Dockerfile` in the `server/` folder:
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
   docker build -t exclusive-backend ./server
   ```
3. Run the container:
   ```powershell
   docker run -p 5001:5001 --env-file ./server/.env exclusive-backend
   ```
