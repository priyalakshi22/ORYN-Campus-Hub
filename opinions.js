const express = require("express");
const router = express.Router();
const db = require("../db");

// CREATE OPINION
router.post("/", async(req, res) => {
    try {
        const { name, type, service, comment, email } = req.body;

        if (!comment) {
            return res.status(400).json({ success: false, message: "Comment required" });
        }

        const sql = `
            INSERT INTO opinions 
            (name, type, service, comment, email)
            VALUES (?, ?, ?, ?, ?)
        `;

        await db.query(sql, [name, type, service, comment, email]);

        res.json({ success: true, message: "Opinion submitted" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

module.exports = router;