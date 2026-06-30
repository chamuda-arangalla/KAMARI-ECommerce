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

  // Upsert: promote existing user with that email or create fresh
  await User.findOneAndUpdate(
    { email },
    { $set: { role: "admin", password: hashedPassword, firstName: "Admin", lastName: "" } },
    { upsert: true, new: true }
  );
  console.log(`Admin account created/promoted: ${email}`);
};

const dropStaleIndexes = async () => {
  const col = mongoose.connection.collection("users");
  for (const idx of ["username_1", "email_1"]) {
    try {
      await col.dropIndex(idx);
    } catch (_) {}
  }

  // Remove duplicate emails, keeping the admin or most recent document
  const dupes = await col.aggregate([
    { $match: { email: { $ne: null } } },
    { $group: { _id: "$email", count: { $sum: 1 }, ids: { $push: "$_id" } } },
    { $match: { count: { $gt: 1 } } },
  ]).toArray();
  for (const { ids } of dupes) {
    ids.shift(); // keep the first, delete the rest
    await col.deleteMany({ _id: { $in: ids } });
  }

  try {
    await User.syncIndexes();
  } catch (_) {}
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, { autoIndex: false });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await dropStaleIndexes();
    await syncAdmin();
  } catch (error) {
    console.error(`MongoDB Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
