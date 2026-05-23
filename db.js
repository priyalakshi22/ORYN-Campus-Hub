const mysql = require("mysql2/promise");
require("dotenv").config();
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "e_commerce",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

(async() => {
    try {
        const connection = await pool.getConnection();
        console.log("✅ MySQL Connected Successfully");
        connection.release();
    } catch (err) {
        console.error("\n❌ Database connection failed!");
        console.error("Error:", err.message);
        console.log("\n💡 Please check your database credentials in .env file\n");
    }
})();

module.exports = pool;