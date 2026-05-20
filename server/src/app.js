import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import collectionRoutes from "./routes/collection.routes.js";
import homeContentRoutes from "./routes/homeContent.routes.js";
import siteContentRoutes from "./routes/siteContent.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow any localhost port in development, plus the configured CLIENT_URL
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin) || origin === process.env.CLIENT_URL) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "KAMARI API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/home-content", homeContentRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api/orders", orderRoutes);

export default app;
