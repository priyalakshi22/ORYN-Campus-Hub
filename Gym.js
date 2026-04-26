const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all available gym classes
router.get("/classes", (req, res) => {
    db.query("SELECT * FROM gym_classes WHERE current_bookings < max_participants", (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, classes: results });
    });
});

// Book a gym class
router.post("/book", (req, res) => {
    const { user_id, class_id } = req.body;

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ success: false });

        db.query("SELECT current_bookings, max_participants FROM gym_classes WHERE id = ? FOR UPDATE", [class_id], (err, results) => {
            if (err) return db.rollback(() => res.status(500).json({ success: false }));
            if (results[0].current_bookings >= results[0].max_participants) {
                return db.rollback(() => res.status(400).json({ success: false, message: "Class is full" }));
            }

            db.query("INSERT INTO gym_bookings (user_id, class_id, booking_date) VALUES (?, ?, CURDATE())", [user_id, class_id], (err) => {
                if (err) return db.rollback(() => res.status(500).json({ success: false }));

                db.query("UPDATE gym_classes SET current_bookings = current_bookings + 1 WHERE id = ?", [class_id], (err) => {
                    if (err) return db.rollback(() => res.status(500).json({ success: false }));

                    db.query("UPDATE users SET reward_points = reward_points + 30 WHERE id = ?", [user_id], (err) => {
                        if (err) return db.rollback(() => res.status(500).json({ success: false }));

                        db.commit(err => {
                            if (err) return db.rollback(() => res.status(500).json({ success: false }));
                            res.json({ success: true, message: "Class booked! +30 points" });
                        });
                    });
                });
            });
        });
    });
});

module.exports = router;