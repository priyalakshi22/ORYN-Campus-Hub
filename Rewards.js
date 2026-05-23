const express = require("express");
const router = express.Router();
const db = require("../db");

// Get user reward points
router.get("/:user_id", (req, res) => {
    db.query("SELECT reward_points FROM users WHERE id = ?", [req.params.user_id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (results.length === 0) return res.status(404).json({ success: false, message: "User not found" });
        res.json({ success: true, points: results[0].reward_points || 0 });
    });
});

// Get all available rewards
// NOTE: defined before /:user_id so "list" isn't captured as a user_id param
router.get("/list", (req, res) => {
    db.query("SELECT * FROM rewards WHERE is_available = TRUE ORDER BY points_cost ASC", (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, rewards: results });
    });
});

// Get earn methods (static data)
router.get("/earn-methods", (req, res) => {
    const earnMethods = [
        { label: "Library", title: "Borrow Library Books", description: "Visit the library and borrow any book from the collection. Bonus points for on-time returns.", points: 50 },
        { label: "Events", title: "Attend Campus Events", description: "Show up to workshops, cultural nights, sports days, and all events tracked via your digital ID.", points: 100 },
        { label: "Fitness", title: "Gym Class Attendance", description: "Register and attend fitness classes at ORYN Fitness Centre. Weekly consistency bonuses apply.", points: 30 },
        { label: "Cafe", title: "Cafe Purchases", description: "Every Rs. 50 spent at ORYN Cafe earns you 1 point. Pre-ordering doubles your earned points.", points: 1 },
        { label: "Transit", title: "Transit Location Sharing", description: "Share your live location on transit routes to help fellow students track campus buses.", points: 5 },
        { label: "Feedback", title: "Write Reviews", description: "Submit a verified review for any campus service — cafe, library, fitness, transit, and more.", points: 20 },
        { label: "Community", title: "Volunteer on Campus", description: "Sign up to volunteer at campus events, orientation, or community outreach programmes.", points: 200 },
        { label: "Academic", title: "Submit Assignments Early", description: "Submit coursework before the deadline and earn academic bonus points tracked by faculty.", points: 75 },
        { label: "Referral", title: "Refer a Friend", description: "Refer a new student to ORYN Campus and earn bonus points when they complete registration.", points: 150 },
        { label: "Surveys", title: "Complete Surveys", description: "Fill in campus satisfaction surveys and help improve services — every response is rewarded.", points: 30 },
        { label: "Marketplace", title: "Marketplace Sales", description: "List and sell items in the ORYN Marketplace. Points are credited for every completed sale.", points: 25 },
        { label: "Academic", title: "Academic Achievements", description: "Make the Dean's List, win competitions, or earn certifications — faculty submit bonus points.", points: 500 }
    ];
    res.json({ success: true, methods: earnMethods });
});

// Redeem a reward
router.post("/redeem", (req, res) => {
    const { user_id, points_cost, reward_name } = req.body;

    db.query("SELECT reward_points FROM users WHERE id = ? FOR UPDATE", [user_id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (results.length === 0) return res.status(404).json({ success: false, message: "User not found" });
        if (results[0].reward_points < points_cost) return res.status(400).json({ success: false, message: "Insufficient points" });

        db.query("UPDATE users SET reward_points = reward_points - ? WHERE id = ?", [points_cost, user_id], (err) => {
            if (err) return res.status(500).json({ success: false, message: err.message });

            db.query("INSERT INTO reward_transactions (user_id, points, reason) VALUES (?, ?, ?)", [user_id, -points_cost, `Redeemed: ${reward_name}`], (err) => {
                if (err) return res.status(500).json({ success: false, message: err.message });
                res.json({ success: true, message: `Redeemed ${reward_name}!` });
            });
        });
    });
});

// Add points manually
router.post("/add-points", (req, res) => {
    const { user_id, points, reason } = req.body;

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ success: false });

        db.query("UPDATE users SET reward_points = reward_points + ? WHERE id = ?", [points, user_id], (err) => {
            if (err) return db.rollback(() => res.status(500).json({ success: false }));

            db.query("INSERT INTO reward_transactions (user_id, points, reason) VALUES (?, ?, ?)", [user_id, points, reason], (err) => {
                if (err) return db.rollback(() => res.status(500).json({ success: false }));

                db.commit(err => {
                    if (err) return db.rollback(() => res.status(500).json({ success: false }));
                    res.json({ success: true, message: `Added ${points} points!` });
                });
            });
        });
    });
});

module.exports = router;