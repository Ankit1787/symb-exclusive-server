import fs from "fs";
import path from "path";
import { connectDB } from "./config/database.js";
import ProductModel from "./models/product.model.js";

async function seed() {
  try {
    console.log("Connecting to database...");
    await connectDB();

    console.log("Reading products.json...");
    const filePath = path.join(process.cwd(), "products.json");
    if (!fs.existsSync(filePath)) {
      throw new Error(`products.json not found at ${filePath}`);
    }

    const rawData = fs.readFileSync(filePath, "utf-8");
    const products = JSON.parse(rawData);

    console.log(`Found ${products.length} products in JSON. Processing...`);

    // Filter and map products to match the schema requirements
    const formattedProducts = products
      .filter((product: any) => product.images && product.images.length > 2)
      .map((product: any) => {
        const discount = product.discountPercentage || 0;
        return {
          ...product,
          mrp: Math.round((product.price * 100) / (100 - discount)),
          variants: product.variants || [],
          collections: product.collections || []
        };
      });

    console.log(
      `Filtered down to ${formattedProducts.length} products (with >= 3 images).`
    );

    console.log("Clearing existing products in database...");
    await ProductModel.deleteMany({});
    console.log("Database cleared.");

    console.log("Seeding products...");
    const result = await ProductModel.insertMany(formattedProducts);
    console.log(`Successfully seeded ${result.length} products!`);

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
