const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const path = require("path")

// Load environment variables
require("dotenv").config({ path: path.resolve(__dirname, "../.env.local") })

const MONGODB_URI = process.env.MONGODB_URI
const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI is not defined")
    process.exit(1)
}

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("❌ ADMIN_EMAIL or ADMIN_PASSWORD is not defined")
    process.exit(1)
}

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },
        email: { type: String, required: true, unique: true },
        fullName: { type: String },
        degree: { type: String },
        graduationYear: { type: String },
        refreshToken: { type: String },
    },
    { timestamps: true }
)

const User = mongoose.models.User || mongoose.model("User", userSchema)

async function seedAdmin() {
    try {
        console.log("🔌 Connecting to MongoDB...")
        await mongoose.connect(MONGODB_URI)
        console.log("✅ Connected")

        const existingAdmin = await User.findOne({ email: ADMIN_EMAIL })
        if (existingAdmin) {
            console.log("ℹ️ Admin user already exists with email:", ADMIN_EMAIL)

            // Optional: Update password if needed
            // const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)
            // existingAdmin.password = hashedPassword
            // await existingAdmin.save()
            // console.log("✅ Admin password updated")

            process.exit(0)
        }

        console.log("🆕 Creating new admin user:", ADMIN_EMAIL)
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10)

        await User.create({
            username: "admin",
            email: ADMIN_EMAIL,
            password: hashedPassword,
            isAdmin: true,
            fullName: "System Admin",
        })

        console.log("✅ Admin user created successfully")
        process.exit(0)
    } catch (error) {
        console.error("❌ Error seeding admin:", error)
        process.exit(1)
    }
}

seedAdmin()
