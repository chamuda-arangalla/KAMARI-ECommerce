import "dotenv/config";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import collectionRoutes from "./routes/collection.routes.js";
import homeContentRoutes from "./routes/homeContent.routes.js";
import siteContentRoutes from "./routes/siteContent.routes.js";
import orderRoutes from "./routes/order.routes.js";

const app = express();

const getAllowedOrigins = () =>
  [process.env.CLIENT_URL, process.env.CORS_ORIGINS]
    .filter(Boolean)
    .flatMap((origin) => origin.split(","))
    .map((origin) => origin.trim())
    .filter(Boolean);

const isLocalhostOrigin = (origin) => {
  try {
    const { hostname } = new URL(origin);
    return ["localhost", "127.0.0.1"].includes(hostname);
  } catch {
    return false;
  }
};

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (getAllowedOrigins().includes(origin)) return true;
  return process.env.NODE_ENV !== "production" && isLocalhostOrigin(origin);
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  })
);

app.use(express.json());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

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
