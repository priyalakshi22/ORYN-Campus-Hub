const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all available listings
router.get("/listings", (req, res) => {
    const { category } = req.query;
    let sql = `
        SELECT ml.*, u.first_name, u.last_name
        FROM marketplace_listings ml
        JOIN users u ON ml.user_id = u.id
        WHERE ml.status = 'available'
    `;
    const params = [];

    if (category && category !== "all") {
        sql += " AND ml.category = ?";
        params.push(category);
    }

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, listings: results });
    });
});

// Create a listing
router.post("/list", (req, res) => {
    const { user_id, title, category, description, price, condition } = req.body;

    db.query(
        "INSERT INTO marketplace_listings (user_id, title, category, description, price, condition) VALUES (?, ?, ?, ?, ?, ?)", [user_id, title, category, description, price, condition],
        (err) => {
            if (err) return res.status(500).json({ success: false });
            res.json({ success: true, message: "Listing created!" });
        }
    );
});

// Send a message about a listing
router.post("/message", (req, res) => {
    const { listing_id, sender_id, receiver_id, message } = req.body;

    db.query(
        "INSERT INTO marketplace_messages (listing_id, sender_id, receiver_id, message) VALUES (?, ?, ?, ?)", [listing_id, sender_id, receiver_id, message],
        (err) => {
            if (err) return res.status(500).json({ success: false });
            res.json({ success: true, message: "Message sent!" });
        }
    );
});

module.exports = router;