const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all reviews
router.get("/", async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM reviews ORDER BY created_at DESC");
        res.json({ success: true, reviews: rows });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get single review by ID
router.get("/:id", async(req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM reviews WHERE id = ?", [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }
        res.json({ success: true, review: rows[0] });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create a new review
router.post("/", async(req, res) => {
    const { name, student_id, service, rating, title, review, recommendation } = req.body;

    // Validate required fields
    if (!name || !student_id || !service || !rating || !title || !review) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: name, student_id, service, rating, title, and review are required",
            received: { name, student_id, service, rating, title, review }
        });
    }

    // Validate rating is between 1-5
    if (rating < 1 || rating > 5) {
        return res.status(400).json({
            success: false,
            message: "Rating must be between 1 and 5"
        });
    }

    try {
        const [result] = await db.query(
            "INSERT INTO reviews (name, student_id, service, rating, title, review, recommendation, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())", [name, student_id, service, rating, title, review, recommendation || null]
        );

        res.json({
            success: true,
            message: "Review added successfully",
            reviewId: result.insertId
        });
    } catch (error) {
        console.error("Error adding review:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update a review
router.put("/:id", async(req, res) => {
    const { name, student_id, service, rating, title, review, recommendation } = req.body;
    const reviewId = req.params.id;

    try {
        const [result] = await db.query(
            `UPDATE reviews 
             SET name = ?, student_id = ?, service = ?, rating = ?, 
                 title = ?, review = ?, recommendation = ? 
             WHERE id = ?`, [name, student_id, service, rating, title, review, recommendation, reviewId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        res.json({ success: true, message: "Review updated successfully" });
    } catch (error) {
        console.error("Error updating review:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete a review
router.delete("/:id", async(req, res) => {
    try {
        const [result] = await db.query("DELETE FROM reviews WHERE id = ?", [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Review not found" });
        }

        res.json({ success: true, message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get reviews by service (Cafe, Library, Gym, etc.)
router.get("/service/:service", async(req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM reviews WHERE service = ? ORDER BY created_at DESC", [req.params.service]
        );
        res.json({ success: true, reviews: rows });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get reviews by student
router.get("/student/:student_id", async(req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM reviews WHERE student_id = ? ORDER BY created_at DESC", [req.params.student_id]
        );
        res.json({ success: true, reviews: rows });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get average rating by service
router.get("/stats/average", async(req, res) => {
    try {
        const [rows] = await db.query(
            "SELECT service, AVG(rating) as average_rating, COUNT(*) as total_reviews FROM reviews GROUP BY service ORDER BY average_rating DESC"
        );
        res.json({ success: true, statistics: rows });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;