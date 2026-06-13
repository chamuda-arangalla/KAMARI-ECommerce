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

const allowedOrigins = new Set(
  [
    process.env.CLIENT_URL,
    ...(process.env.CORS_ORIGINS || "").split(","),
  ]
    .filter(Boolean)
    .map((origin) => origin.trim().replace(/\/$/, ""))
);

app.use(
  cors({
    origin: (origin, callback) => {
      const isAllowed =
        !origin || allowedOrigins.has(origin.replace(/\/$/, ""));
      callback(null, isAllowed);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
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
