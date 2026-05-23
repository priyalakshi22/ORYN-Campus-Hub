const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all available facilities
router.get("/", (req, res) => {
    db.query("SELECT * FROM facilities WHERE is_available = TRUE", (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, facilities: results });
    });
});

// Book a facility
router.post("/book", (req, res) => {
    const { user_id, facility_id, booking_date, start_time, end_time, purpose } = req.body;

    db.query(`
        SELECT id FROM facility_bookings
        WHERE facility_id = ? AND booking_date = ?
          AND ((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?))
    `, [facility_id, booking_date, start_time, start_time, end_time, end_time], (err, conflicts) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (conflicts.length > 0) return res.status(400).json({ success: false, message: "Facility already booked for this time slot" });

        db.query(
            "INSERT INTO facility_bookings (user_id, facility_id, booking_date, start_time, end_time, purpose) VALUES (?, ?, ?, ?, ?, ?)",
            [user_id, facility_id, booking_date, start_time, end_time, purpose],
            (err) => {
                if (err) return res.status(500).json({ success: false, message: err.message });

                db.query("UPDATE users SET reward_points = reward_points + 20 WHERE id = ?", [user_id]);
                res.json({ success: true, message: "Facility booked successfully! +20 points" });
            }
        );
    });
});

module.exports = router;