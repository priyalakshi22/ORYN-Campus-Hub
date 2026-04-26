const express = require("express");
const router = express.Router();
const db = require("../db");

// Get user by ID
router.get("/:user_id", (req, res) => {
    db.query(
        "SELECT id, first_name, last_name, email, reward_points FROM users WHERE id = ?", [req.params.user_id],
        (err, results) => {
            if (err) return res.status(500).json({ success: false, message: "Database error: " + err.message });
            if (results.length === 0) return res.status(404).json({ success: false, message: "User not found" });
            res.json({ success: true, user: results[0] });
        }
    );
});

// Get user profile (extended)
router.get("/:user_id/profile", (req, res) => {
    db.query(
        "SELECT id, first_name, last_name, index_no, email, mobile, faculty, programme, year_of_study, reward_points FROM users WHERE id = ?", [req.params.user_id],
        (err, results) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            if (results.length === 0) return res.status(404).json({ success: false, message: "User not found" });
            res.json({ success: true, profile: results[0] });
        }
    );
});

// Get user's registered events
router.get("/:user_id/events", (req, res) => {
    db.query(`
        SELECT e.*, er.registration_date, er.status, er.attendees, er.special_requests
        FROM events e
        INNER JOIN event_registrations er ON e.id = er.event_id
        WHERE er.user_id = ? AND er.status = 'confirmed'
        ORDER BY e.event_date ASC
    `, [req.params.user_id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, events: results });
    });
});

// Get user's clubs
router.get("/:user_id/clubs", (req, res) => {
    db.query(`
        SELECT c.*, cm.joined_date, cm.role, cm.status
        FROM clubs c
        INNER JOIN club_members cm ON c.id = cm.club_id
        WHERE cm.user_id = ? AND cm.status = 'active'
        ORDER BY cm.joined_date DESC
    `, [req.params.user_id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error: " + err.message });
        res.json({ success: true, clubs: results });
    });
});

module.exports = router;