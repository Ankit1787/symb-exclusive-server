# Database Seeding Skill

This skill explains how to seed the MongoDB database with initial product data from `products.json`.

## Prerequisites
- MongoDB must be running (locally or remotely).
- The `.env` file in the `server/` directory must contain a valid `MONGO_URI`.

## Seeding Process

1. Navigate to the `server/` directory:
   ```powershell
   cd server
   ```
2. Run the seed command:
   ```powershell
   npm run seed
   ```

## Expected Behavior
- The script will connect to the MongoDB uri.
- It will read `products.json`.
- Products with less than 3 images will be filtered out.
- The `mrp` will be calculated automatically for the remaining products.
- All existing products in the `Product` collection will be deleted.
- The newly processed products will be bulk-inserted.
- You should see the following logs in your console:
  - `Clearing existing products in database...`
  - `Seeding products...`
  - `Successfully seeded X products!`
