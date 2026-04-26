const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

// REGISTER
router.post("/register", async(req, res) => {
    try {
        const {
            fullName,
            indexNo,
            password,
            email,
            mobile,
            nic,
            address,
            faculty,
            programme,
            year,
            username,
            dob,
            gender
        } = req.body;

        const role = "student";

        if (!fullName || !indexNo || !password || !email || !mobile ||
            !nic || !address || !faculty || !programme || !year ||
            !username || !dob || !gender) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email format" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        const nameParts = fullName.trim().split(" ");
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ") || "";

        db.query("SELECT id FROM users WHERE index_no = ?", [indexNo], async(err, results) => {
            if (err) return res.status(500).json({ success: false, message: "Database error" });
            if (results.length > 0) return res.status(409).json({ success: false, message: "Index number already registered" });

            db.query("SELECT id FROM users WHERE username = ?", [username], async(err, results) => {
                if (err) return res.status(500).json({ success: false, message: "Database error" });
                if (results.length > 0) return res.status(409).json({ success: false, message: "Username already taken" });

                db.query("SELECT id FROM users WHERE email = ?", [email], async(err, results) => {
                    if (err) return res.status(500).json({ success: false, message: "Database error" });
                    if (results.length > 0) return res.status(409).json({ success: false, message: "Email already registered" });

                    const hashedPassword = await bcrypt.hash(password, 10);

                    const sql = `
                        INSERT INTO users
                        (first_name, last_name, index_no, role, password, email, mobile, nic,
                         address, faculty, programme, year_of_study, username, dob, gender, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                    `;

                    db.query(sql, [
                        firstName, lastName, indexNo, role, hashedPassword,
                        email, mobile, nic, address,
                        faculty, programme, year,
                        username, dob, gender
                    ], (err) => {
                        if (err) {
                            console.error("Insert error:", err);
                            return res.status(500).json({ success: false, message: "Registration failed: " + err.message });
                        }
                        res.status(201).json({ success: true, message: "Registration successful" });
                    });
                });
            });
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
});

// LOGIN
router.post("/login", async(req, res) => {
    try {
        const { indexNo, password } = req.body;

        if (!indexNo || !password) {
            return res.status(400).json({ success: false, message: "All fields required" });
        }

        db.query("SELECT * FROM users WHERE index_no = ?", [indexNo], async(err, results) => {
            if (err) return res.status(500).json({ success: false, message: "Database error" });
            if (results.length === 0) return res.status(401).json({ success: false, message: "Invalid credentials" });

            const user = results[0];
            const match = await bcrypt.compare(password, user.password);

            if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

            const token = jwt.sign({ id: user.id, indexNo: user.index_no, role: user.role },
                process.env.JWT_SECRET, { expiresIn: "7d" }
            );

            db.query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id]);

            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    fullName: `${user.first_name} ${user.last_name}`,
                    role: user.role,
                    indexNo: user.index_no
                }
            });
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
});

module.exports = router;