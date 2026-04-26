const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all clubs
router.get("/", (req, res) => {
    db.query("SELECT * FROM clubs ORDER BY club_name ASC", (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error: " + err.message });
        res.json({ success: true, clubs: results });
    });
});

// Get club statistics
// NOTE: must be before /:id to avoid being matched as an id
router.get("/statistics", (req, res) => {
    db.query(`
        SELECT 
            COUNT(*) as total_clubs,
            SUM(member_count) as total_members,
            AVG(member_count) as avg_members_per_club,
            category,
            COUNT(*) as clubs_in_category
        FROM clubs
        GROUP BY category WITH ROLLUP
    `, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error: " + err.message });
        res.json({ success: true, statistics: results });
    });
});

// Get club by ID
router.get("/:id", (req, res) => {
    db.query("SELECT * FROM clubs WHERE id = ?", [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error: " + err.message });
        if (results.length === 0) return res.status(404).json({ success: false, message: "Club not found" });
        res.json({ success: true, club: results[0] });
    });
});

// Get club members
router.get("/:club_id/members", (req, res) => {
    db.query(`
        SELECT u.id, u.first_name, u.last_name, u.email, u.faculty, u.year_of_study,
               cm.joined_date, cm.role, cm.status
        FROM users u
        INNER JOIN club_members cm ON u.id = cm.user_id
        WHERE cm.club_id = ? AND cm.status = 'active'
        ORDER BY
            CASE WHEN cm.role = 'president'      THEN 1
                 WHEN cm.role = 'vice_president'  THEN 2
                 WHEN cm.role = 'secretary'       THEN 3
                 WHEN cm.role = 'treasurer'       THEN 4
                 ELSE 5
            END,
            cm.joined_date ASC
    `, [req.params.club_id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error: " + err.message });
        res.json({ success: true, members: results });
    });
});

// Get club details with member role summary
router.get("/:club_id/details", (req, res) => {
    db.query(`
        SELECT c.*,
               COUNT(DISTINCT cm.user_id) as active_members,
               SUM(CASE WHEN cm.role = 'president'      THEN 1 ELSE 0 END) as presidents,
               SUM(CASE WHEN cm.role = 'vice_president'  THEN 1 ELSE 0 END) as vice_presidents,
               SUM(CASE WHEN cm.role = 'secretary'       THEN 1 ELSE 0 END) as secretaries,
               SUM(CASE WHEN cm.role = 'treasurer'       THEN 1 ELSE 0 END) as treasurers
        FROM clubs c
        LEFT JOIN club_members cm ON c.id = cm.club_id AND cm.status = 'active'
        WHERE c.id = ?
        GROUP BY c.id
    `, [req.params.club_id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error: " + err.message });
        if (results.length === 0) return res.status(404).json({ success: false, message: "Club not found" });
        res.json({ success: true, club: results[0] });
    });
});

// Join a club
router.post("/join", (req, res) => {
    const { user_id, club_id } = req.body;

    if (!user_id || !club_id) {
        return res.status(400).json({ success: false, message: "User ID and Club ID are required" });
    }

    db.query("SELECT id FROM users WHERE id = ?", [user_id], (err, userResults) => {
        if (err) return res.status(500).json({ success: false, message: "Database error: " + err.message });
        if (userResults.length === 0) return res.status(404).json({ success: false, message: "User not found" });

        db.query("SELECT id, club_name, member_count FROM clubs WHERE id = ?", [club_id], (err, clubResults) => {
            if (err) return res.status(500).json({ success: false, message: "Database error: " + err.message });
            if (clubResults.length === 0) return res.status(404).json({ success: false, message: "Club not found" });

            const clubName = clubResults[0].club_name;
            const currentMemberCount = clubResults[0].member_count || 0;

            db.query("SELECT id, status FROM club_members WHERE user_id = ? AND club_id = ?", [user_id, club_id], (err, existing) => {
                if (err) return res.status(500).json({ success: false, message: "Database error: " + err.message });

                if (existing.length > 0) {
                    if (existing[0].status === "active") {
                        return res.status(400).json({ success: false, message: "You are already an active member of this club" });
                    }

                    // Reactivate inactive membership
                    db.beginTransaction(err => {
                        if (err) return res.status(500).json({ success: false, message: "Database error" });

                        db.query(
                            "UPDATE club_members SET status = 'active', joined_date = CURDATE() WHERE user_id = ? AND club_id = ?", [user_id, club_id], (err) => {
                                if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Failed to reactivate membership" }));

                                db.query("UPDATE clubs SET member_count = member_count + 1 WHERE id = ?", [club_id], (err) => {
                                    if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Failed to update member count" }));

                                    db.query("UPDATE users SET reward_points = reward_points + 50 WHERE id = ?", [user_id], (err) => {
                                        if (err) console.error("Reward points error:", err);

                                        db.query("INSERT INTO reward_transactions (user_id, points, reason) VALUES (?, ?, ?)", [user_id, 50, `Rejoined ${clubName} club`], (err) => {
                                            if (err) console.error("Transaction log error:", err);

                                            db.commit(err => {
                                                if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Database error" }));
                                                res.json({
                                                    success: true,
                                                    message: `Welcome back to ${clubName}! +50 points awarded!`,
                                                    membership: { user_id, club_id, role: "member", status: "active" }
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                    });
                } else {
                    // New membership
                    db.beginTransaction(err => {
                        if (err) return res.status(500).json({ success: false, message: "Database error" });

                        db.query(
                            "INSERT INTO club_members (user_id, club_id, joined_date, role, status) VALUES (?, ?, CURDATE(), 'member', 'active')", [user_id, club_id], (err) => {
                                if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Failed to join club: " + err.message }));

                                db.query("UPDATE clubs SET member_count = ? WHERE id = ?", [currentMemberCount + 1, club_id], (err) => {
                                    if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Failed to update member count" }));

                                    db.query("UPDATE users SET reward_points = reward_points + 50 WHERE id = ?", [user_id], (err) => {
                                        if (err) console.error("Reward points error:", err);

                                        db.query("INSERT INTO reward_transactions (user_id, points, reason) VALUES (?, ?, ?)", [user_id, 50, `Joined ${clubName} club`], (err) => {
                                            if (err) console.error("Transaction log error:", err);

                                            db.commit(err => {
                                                if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Database error" }));
                                                res.json({
                                                    success: true,
                                                    message: `Successfully joined ${clubName}! +50 points awarded!`,
                                                    membership: { user_id, club_id, role: "member", status: "active" }
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                    });
                }
            });
        });
    });
});

// Leave a club
router.delete("/leave", (req, res) => {
    const { user_id, club_id } = req.body;

    if (!user_id || !club_id) {
        return res.status(400).json({ success: false, message: "User ID and Club ID are required" });
    }

    db.query("SELECT member_count FROM clubs WHERE id = ?", [club_id], (err, clubResults) => {
        if (err) return res.status(500).json({ success: false, message: "Database error: " + err.message });
        if (clubResults.length === 0) return res.status(404).json({ success: false, message: "Club not found" });

        const currentMemberCount = clubResults[0].member_count || 0;

        db.query(
            "SELECT id, role FROM club_members WHERE user_id = ? AND club_id = ? AND status = 'active'", [user_id, club_id], (err, membershipResults) => {
                if (err) return res.status(500).json({ success: false, message: "Database error: " + err.message });
                if (membershipResults.length === 0) return res.status(404).json({ success: false, message: "You are not an active member of this club" });

                db.beginTransaction(err => {
                    if (err) return res.status(500).json({ success: false, message: "Database error" });

                    db.query("UPDATE club_members SET status = 'inactive' WHERE user_id = ? AND club_id = ?", [user_id, club_id], (err) => {
                        if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Failed to leave club" }));

                        const newCount = Math.max(0, currentMemberCount - 1);
                        db.query("UPDATE clubs SET member_count = ? WHERE id = ?", [newCount, club_id], (err) => {
                            if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Failed to update member count" }));

                            db.commit(err => {
                                if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Database error" }));
                                res.json({ success: true, message: "Successfully left the club" });
                            });
                        });
                    });
                });
            }
        );
    });
});

// Update member role
router.put("/update-member-role", (req, res) => {
    const { user_id, club_id, new_role } = req.body;

    if (!user_id || !club_id || !new_role) {
        return res.status(400).json({ success: false, message: "User ID, Club ID, and new role are required" });
    }

    db.query(
        "SELECT id FROM club_members WHERE user_id = ? AND club_id = ? AND status = 'active'", [user_id, club_id], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: "Database error: " + err.message });
            if (results.length === 0) return res.status(404).json({ success: false, message: "User is not an active member of this club" });

            db.query("UPDATE club_members SET role = ? WHERE user_id = ? AND club_id = ?", [new_role, user_id, club_id], (err) => {
                if (err) return res.status(500).json({ success: false, message: "Failed to update member role" });
                res.json({ success: true, message: `Member role updated to ${new_role}` });
            });
        }
    );
});

module.exports = router;