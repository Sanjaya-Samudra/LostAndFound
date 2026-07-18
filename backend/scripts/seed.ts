import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../src/models/User";
import Item from "../src/models/Item";

dotenv.config();

const categories = [
  "electronics",
  "accessories",
  "books",
  "clothing",
  "documents",
  "other",
];

const locations = [
  "Library",
  "Lecture Hall A",
  "Lecture Hall B",
  "Cafeteria",
  "Computer Lab",
  "Parking Area",
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);

    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});

    console.log("Old data removed");

    // Create Users
    const users = [];

    for (let i = 1; i <= 20; i++) {
      users.push({
        firstName: `User${i}`,
        lastName: "Test",
        email: `user${i}@lostfound.com`,
        password: "password123",
        role: i === 1 ? "admin" : "student",
      });
    }

    const createdUsers = await User.insertMany(users);

    console.log(`${createdUsers.length} users inserted`);

    // Create Items
    const items = [];

    for (let i = 1; i <= 50; i++) {
      const randomUser =
        createdUsers[Math.floor(Math.random() * createdUsers.length)];

      items.push({
        title: `Lost Item ${i}`,
        description: `Sample description for item ${i}`,
        category:
          categories[Math.floor(Math.random() * categories.length)],
        type: Math.random() > 0.5 ? "lost" : "found",
        status: "open",
        images: [],
        location:
          locations[Math.floor(Math.random() * locations.length)],
        postedBy: randomUser._id,
      });
    }

    const createdItems = await Item.insertMany(items);

    console.log(`${createdItems.length} items inserted`);

    console.log("Database seeded successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed");
    console.error(error);

    process.exit(1);
  }
}

seedDatabase();