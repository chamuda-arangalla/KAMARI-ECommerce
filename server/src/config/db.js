import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("ADMIN_EMAIL or ADMIN_PASSWORD not set in .env — skipping admin seed");
    return;
  }

  const existing = await User.findOne({ email, role: "admin" });
  if (existing) return;

  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    email,
    password: hashedPassword,
    role: "admin",
    firstName: "Admin",
    lastName: "",
  });

  console.log(`Admin account created: ${email}`);
};

const dropStaleIndexes = async () => {
  const col = mongoose.connection.collection("users");
  for (const idx of ["username_1", "email_1"]) {
    try {
      await col.dropIndex(idx);
    } catch (_) {}
  }
  await User.syncIndexes();
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await dropStaleIndexes();
    await seedAdmin();
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
