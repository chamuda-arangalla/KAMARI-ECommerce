import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "KAMARI API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

export default app;