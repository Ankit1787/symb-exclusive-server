import express, { Request, Response } from "express";
import { connectDB } from "./config/database.js";
import { config } from "./config/config.js";
import cors from "cors"
const app = express();
const port = config.port;
app.use(cors())
app.use(express.json({ limit: "50mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);
app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "Hello from server" });
});
app.use("/api/products", (await import("./routes/product.route.js")).default);
app.use("/api/auth", (await import("./routes/user.routes.js")).default);
app.use("/api/orders", (await import("./routes/order.routes.js")).default);


async function startServer() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  }
}

startServer();