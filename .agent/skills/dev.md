# Backend Development Skill

This skill explains how to start, monitor, and debug the Express server in the development environment.

## Prerequisites
- Node.js installed on the host.
- A local or remote MongoDB instance running.
- A configured `.env` file in the `server/` directory.

### Environment Setup (`.env`)
Make sure the following variables are configured in `server/.env`:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/exclusive
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
```

## Running the Dev Server
To start the development server with hot-reloading (using `tsx watch`):

1. Open a terminal and navigate to the `server/` directory:
   ```powershell
   cd server
   ```
2. Install dependencies (if not already done):
   ```powershell
   npm install
   ```
3. Run the development command:
   ```powershell
   npm run dev
   ```

## Verification
- Look for console output:
  - `Connected to MongoDB successfully`
  - `Server is running on http://localhost:5001`
- Open your browser or run a curl command to verify the root endpoint:
  ```powershell
  curl http://localhost:5001/
  ```
  Expected JSON response: `{"message":"Hello from server"}`
