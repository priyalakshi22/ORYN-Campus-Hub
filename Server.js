require("dotenv").config();
const express = require("express");
const cors = require("cors");

process.on("uncaughtException", (err) => {
    console.error("❌ Uncaught Exception:", err.message);
    console.log("Server will continue running...");
});

process.on("unhandledRejection", (reason) => {
    console.error("❌ Unhandled Rejection:", reason);
    console.log("Server will continue running...");
});

if (!process.env.JWT_SECRET) {
    console.warn("⚠️  WARNING: JWT_SECRET not set. Using default (not secure for production)");
    process.env.JWT_SECRET = "your-secret-key-change-this-in-production";
}

const app = express();

app.use(cors({
    origin: ["http://localhost:5500", "http://127.0.0.1:5500", "http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));

app.use(express.json());

const db = require("./db");

app.use("/api", require("./routes/Auth"));
app.use("/api/users", require("./routes/Users"));
app.use("/api/events", require("./routes/Events"));
app.use("/api/clubs", require("./routes/Clubs"));
app.use("/api/rewards", require("./routes/Rewards"));
app.use("/api/facilities", require("./routes/Facilities"));
app.use("/api/transit", require("./routes/Transit"));
app.use("/api/library", require("./routes/Libarary"));
app.use("/api/gym", require("./routes/Gym"));
app.use("/api/jobs", require("./routes/Jobs"));
app.use("/api/cafe", require("./routes/Cafe"));
app.use("/api/marketplace", require("./routes/Marketplace"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/opinions", require("./routes/opinions"));

app.get("/api/test", async(req, res) => {
    let dbConnected = false;
    try {
        const connection = await db;
        dbConnected = connection && connection.connection;
    } catch (err) {
        dbConnected = false;
    }

    res.json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
        dbConnected: dbConnected
    });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: "Endpoint not found" });
});

app.use((err, req, res, next) => {
    console.error("Server error:", err);
    res.status(500).json({ success: false, message: "Something went wrong!" });
});

const PORT = process.env.PORT || 5500;

const server = app.listen(PORT, () => {
    console.log(`\n=================================`);
    console.log(`✅ Server is running!`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🔗 Test:      http://localhost:${PORT}/api/test`);
    console.log(`🔑 Login:     http://localhost:${PORT}/api/login`);
    console.log(`📝 Register:  http://localhost:${PORT}/api/register`);
    console.log(`🎉 Events:    http://localhost:${PORT}/api/events`);
    console.log(`🏆 Rewards:   http://localhost:${PORT}/api/rewards`);
    console.log(`=================================\n`);
}).on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`\n❌ ERROR: Port ${PORT} is already in use!`);
        console.log(`\nSolutions:`);
        console.log(`1. Kill the process: netstat -ano | findstr :${PORT} (Windows)`);
        console.log(`2. Use a different port: PORT=5501 node server.js`);
        console.log(`3. Change PORT in your .env file\n`);
        process.exit(1);
    } else {
        console.error("Server error:", err);
        process.exit(1);
    }
});