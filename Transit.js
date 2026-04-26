const express = require("express");
const router = express.Router();
const db = require("../db");

// Get bus schedules
router.get("/schedules", (req, res) => {
    const { day_type } = req.query;

    let sql = `
        SELECT tb.*, ts.id as schedule_id, ts.departure_time, ts.arrival_time, ts.route_direction, ts.day_type
        FROM transit_schedules ts
        JOIN transit_buses tb ON ts.bus_id = tb.id
    `;
    const params = [];

    if (day_type && day_type !== "all") {
        sql += " WHERE ts.day_type = ?";
        params.push(day_type);
    }

    sql += " ORDER BY ts.departure_time ASC";

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, schedules: results });
    });
});

// Share location for transit rewards
router.post("/share-location", (req, res) => {
    const { user_id, bus_id, latitude, longitude } = req.body;

    db.query(
        "INSERT INTO transit_location_shares (user_id, bus_id, latitude, longitude, points_earned) VALUES (?, ?, ?, ?, 5)", [user_id, bus_id || null, latitude || null, longitude || null],
        (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });

            db.query("UPDATE users SET reward_points = reward_points + 5 WHERE id = ?", [user_id], (err) => {
                if (err) return res.status(500).json({ success: false });
                res.json({ success: true, message: "Location shared! +5 points" });
            });
        }
    );
});

module.exports = router;