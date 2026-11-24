
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import connectDB from "../src/config/db.js";
import User from "../src/models/User.js";

dotenv.config();

const seedAdmin = async () => {
    try {
        // 1. Connect to MongoDB
        await connectDB();

        console.log("Checking admin account...");

        // 2. Get admin details from environment
        const {
            ADMIN_NAME,
            ADMIN_EMAIL,
            ADMIN_PASSWORD
        } = process.env;

        // 3. Validate environment variables
        if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
            throw new Error(
                "ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD are required"
            );
        }

        if (ADMIN_PASSWORD.length < 8) {
            throw new Error(
                "Admin password must contain at least 8 characters"
            );
        }

        const email = ADMIN_EMAIL.toLowerCase().trim();

        // 4. Check whether admin already exists
        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            console.log("Admin account already exists.");
            console.log("No changes were made.");
            return;
        }

        // 5. Hash password
        const hashedPassword = await bcrypt.hash(
            ADMIN_PASSWORD,
            10
        );

        // 6. Create admin account
        const admin = await User.create({
            name: ADMIN_NAME.trim(),
            email,
            password: hashedPassword,
            role: "admin"
        });

        // 7. Success message
        console.log("Admin created successfully!");
        console.log("Admin ID:", admin._id);
        console.log("Admin Email:", admin.email);
        console.log("Admin Role:", admin.role);

    } catch (error) {
        console.error("Admin seed failed:", error.message);
        process.exitCode = 1;

    } finally {
        // 8. Close database connection
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
};

seedAdmin();
