# Backend Build & Type-checking Skill

This skill explains how to run TypeScript type-checks and compile the server for production.

## Commands

### 1. Run Type-checking
To check for TypeScript compiler errors without emitting JavaScript files:
1. Navigate to the `server/` directory:
   ```powershell
   cd server
   ```
2. Execute the typecheck command:
   ```powershell
   npm run typecheck
   ```

### 2. Run Production Build
To compile the TypeScript project to JavaScript:
1. Navigate to the `server/` directory:
   ```powershell
   cd server
   ```
2. Build the project:
   ```powershell
   npm run build
   ```
This will compile TypeScript files in `src/` to ES modules in the `dist/` directory.

### 3. Run Production Server
To run the compiled production build:
1. Ensure the build step completed successfully.
2. Start the compiled output:
   ```powershell
   npm start
   ```
