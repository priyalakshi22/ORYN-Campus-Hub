const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all active jobs (no login required)
router.get("/", async(req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM jobs WHERE deadline >= CURDATE() ORDER BY posted_date DESC");
        res.json({ success: true, jobs: results });
    } catch (err) {
        console.error("Error fetching jobs:", err);
        res.status(500).json({ success: false, message: "Database error" });
    }
});

// Get a single job by ID (no login required)
router.get("/:id", async(req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM jobs WHERE id = ?", [req.params.id]);
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "Job not found" });
        }
        res.json({ success: true, job: results[0] });
    } catch (err) {
        console.error("Error fetching job:", err);
        res.status(500).json({ success: false, message: "Database error" });
    }
});

// Apply for a job (NO LOGIN REQUIRED - anyone can apply)
router.post("/apply", async(req, res) => {
    const { user_id, job_id, cover_letter, resume_path } = req.body;

    console.log("📝 Received application:", { user_id, job_id });

    // Validate required fields
    if (!user_id || !job_id || !cover_letter) {
        return res.status(400).json({
            success: false,
            message: "Missing required fields: user_id, job_id, cover_letter"
        });
    }

    try {
        // Check if job exists
        const [jobExists] = await db.query("SELECT id, title FROM jobs WHERE id = ?", [job_id]);
        if (jobExists.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Job does not exist"
            });
        }

        console.log("✅ Job found:", jobExists[0].title);

        // Optional: Check if user already applied (remove this if you want multiple applications)
        const [existing] = await db.query(
            "SELECT id FROM job_applications WHERE user_id = ? AND job_id = ?", [user_id, job_id]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: "You have already applied for this position"
            });
        }

        // Insert the application
        const [result] = await db.query(
            `INSERT INTO job_applications 
            (user_id, job_id, cover_letter, resume_path, status, application_date) 
            VALUES (?, ?, ?, ?, 'pending', NOW())`, [user_id, job_id, cover_letter, resume_path || null]
        );

        console.log("✅ Application inserted, ID:", result.insertId);
        res.json({
            success: true,
            message: "Application submitted successfully!",
            application_id: result.insertId
        });
    } catch (err) {
        console.error("❌ Error submitting application:", err);
        res.status(500).json({
            success: false,
            message: "Failed to submit application: " + err.message
        });
    }
});

// Get applications by user_id (no login required)
router.get("/applications/:user_id", async(req, res) => {
    try {
        const [results] = await db.query(
            `SELECT a.*, j.title, j.company, j.job_type, j.location 
            FROM job_applications a
            JOIN jobs j ON a.job_id = j.id
            WHERE a.user_id = ?
            ORDER BY a.application_date DESC`, [req.params.user_id]
        );
        res.json({ success: true, applications: results });
    } catch (err) {
        console.error("Error fetching applications:", err);
        res.status(500).json({ success: false, message: "Database error" });
    }
});

module.exports = router;