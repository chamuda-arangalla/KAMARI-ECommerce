import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

const syncAdmin = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.warn("ADMIN_EMAIL or ADMIN_PASSWORD not set in .env — skipping admin sync");
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const existingAdmin = await User.findOne({ role: "admin" });

  if (existingAdmin) {
    const updates = {};

    if (existingAdmin.email !== email) {
      // Remove any non-admin user that already has the target email to avoid conflicts
      await User.deleteOne({ email, role: { $ne: "admin" } });
      updates.email = email;
    }

    const passwordMatch = await bcrypt.compare(password, existingAdmin.password);
    if (!passwordMatch) updates.password = hashedPassword;

    if (Object.keys(updates).length > 0) {
      await User.updateOne({ _id: existingAdmin._id }, { $set: updates });
      console.log(`Admin credentials synced from .env: ${email}`);
    }
    return;
  }

  // No admin yet — promote existing user with that email or create fresh
  const userWithEmail = await User.findOne({ email });
  if (userWithEmail) {
    await User.updateOne({ _id: userWithEmail._id }, { $set: { role: "admin", password: hashedPassword } });
    console.log(`User promoted to admin: ${email}`);
    return;
  }

  await User.create({ email, password: hashedPassword, role: "admin", firstName: "Admin", lastName: "" });
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
    await syncAdmin();
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
