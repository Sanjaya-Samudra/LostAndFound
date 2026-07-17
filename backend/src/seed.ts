import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./models/User";
import Item from "./models/Item";

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI as string);
  console.log("Connected to MongoDB");

  await Item.deleteMany({});
  console.log("Cleared all items");

  await User.deleteMany({ email: { $nin: ["testuser@example.com", "admin@example.com"] } });
  console.log("Removed all users except test accounts");

  const testPassword = await bcrypt.hash("test123", 10);
  const adminPassword = await bcrypt.hash("admin123", 10);

  const existingUser = await User.findOne({ email: "testuser@example.com" });
  if (!existingUser) {
    await User.create({
      firstName: "Test",
      lastName: "User",
      email: "testuser@example.com",
      password: testPassword,
      role: "student",
    });
    console.log("Created test user: testuser@example.com / test123");
  } else {
    console.log("Test user already exists");
  }

  const existingAdmin = await User.findOne({ email: "admin@example.com" });
  if (!existingAdmin) {
    await User.create({
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      password: adminPassword,
      role: "admin",
    });
    console.log("Created admin user: admin@example.com / admin123");
  } else {
    console.log("Admin user already exists");
  }

  await mongoose.disconnect();
  console.log("Done — clean slate. Only 2 test users remain, 0 items.");
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
