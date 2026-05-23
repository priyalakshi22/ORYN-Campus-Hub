const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

router.post("/login", async(req, res) => {
    const { indexNo, password } = req.body;

    console.log("Login attempt:", { indexNo, hasPassword: !!password });

    if (!indexNo || !password) {
        return res.status(400).json({
            success: false,
            message: "Index number and password are required"
        });
    }

    try {
        const [users] = await db.query(
            "SELECT * FROM users WHERE index_no = ? OR username = ? OR email = ?", [indexNo, indexNo, indexNo]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const user = users[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign({ id: user.id, index_no: user.index_no, role: user.role },
            process.env.JWT_SECRET || "your-secret-key", { expiresIn: "7d" }
        );

        res.json({
            success: true,
            token: token,
            user: {
                id: user.id,
                indexNo: user.index_no,
                username: user.username,
                firstName: user.first_name,
                lastName: user.last_name,
                fullName: `${user.first_name} ${user.last_name}`,
                email: user.email,
                role: user.role,
                faculty: user.faculty,
                programme: user.programme,
                yearOfStudy: user.year_of_study,
                rewardPoints: user.reward_points
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});

module.exports = router;