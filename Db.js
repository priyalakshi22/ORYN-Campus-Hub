const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "campus_hub_live"
});

db.connect(err => {
    if (err) {
        console.error("\n❌ Database connection failed!");
        console.error("Error:", err.message);
        console.log("\n💡 The server will continue running but database features won't work.");
        console.log("   Please fix the database connection and restart the server.\n");
    } else {
        console.log("✅ MySQL Connected Successfully");
    }
});

module.exports = db;