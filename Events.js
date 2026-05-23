const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all upcoming events
router.get("/", (req, res) => {
    db.query(
        "SELECT * FROM events WHERE event_date >= CURDATE() ORDER BY event_date ASC",
        (err, results) => {
            if (err) return res.status(500).json({ success: false, message: "Database error" });
            res.json({ success: true, events: results });
        }
    );
});

// Get event statistics
// NOTE: this route must be defined BEFORE /:id to avoid "statistics" being treated as an id
router.get("/statistics", (req, res) => {
    db.query(`
        SELECT 
            COUNT(*) as total_events,
            SUM(max_participants) as total_capacity,
            SUM(current_registrations) as total_registrations,
            AVG(current_registrations) as avg_registrations,
            COUNT(CASE WHEN event_date >= CURDATE() THEN 1 END) as upcoming_events,
            COUNT(CASE WHEN event_date < CURDATE() THEN 1 END) as past_events,
            SUM(CASE WHEN event_date >= CURDATE() THEN max_participants - current_registrations ELSE 0 END) as remaining_spots
        FROM events
    `, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, statistics: results[0] });
    });
});

// Get event by ID
router.get("/:id", (req, res) => {
    db.query("SELECT * FROM events WHERE id = ?", [req.params.id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        if (results.length === 0) return res.status(404).json({ success: false, message: "Event not found" });
        res.json({ success: true, event: results[0] });
    });
});

// Get registrations for an event
router.get("/:event_id/registrations", (req, res) => {
    db.query(`
        SELECT er.*, u.first_name, u.last_name, u.email, u.mobile, u.faculty, u.year_of_study
        FROM event_registrations er
        INNER JOIN users u ON er.user_id = u.id
        WHERE er.event_id = ? AND er.status = 'confirmed'
        ORDER BY er.registration_date DESC
    `, [req.params.event_id], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        res.json({ success: true, registrations: results });
    });
});

// Register for an event
router.post("/register", (req, res) => {
    const { user_id, event_id, attendees, special_requests } = req.body;

    if (!user_id || !event_id) {
        return res.status(400).json({ success: false, message: "User ID and Event ID are required" });
    }

    db.query("SELECT id, first_name, last_name, email FROM users WHERE id = ?", [user_id], (err, userResults) => {
        if (err) return res.status(500).json({ success: false, message: "Database error" });
        if (userResults.length === 0) return res.status(404).json({ success: false, message: "User not found" });

        db.query(`
            SELECT id, name, event_date, max_participants, current_registrations, points_awarded
            FROM events WHERE id = ? AND event_date >= CURDATE()
        `, [event_id], (err, eventResults) => {
            if (err) return res.status(500).json({ success: false, message: "Database error" });
            if (eventResults.length === 0) return res.status(404).json({ success: false, message: "Event not found or event has passed" });

            const event = eventResults[0];
            const currentRegistrations = event.current_registrations || 0;
            const maxParticipants = event.max_participants || 0;
            const pointsAwarded = event.points_awarded || 100;
            const numAttendees = attendees || 1;

            if (currentRegistrations + numAttendees > maxParticipants) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${maxParticipants - currentRegistrations} spots remaining. You requested ${numAttendees} spots.`
                });
            }

            db.query(
                "SELECT id, status FROM event_registrations WHERE user_id = ? AND event_id = ?", [user_id, event_id],
                (err, existing) => {
                    if (err) return res.status(500).json({ success: false, message: "Database error" });

                    if (existing.length > 0) {
                        const existingReg = existing[0];

                        if (existingReg.status === "confirmed") {
                            return res.status(400).json({ success: false, message: "You are already registered for this event" });
                        }

                        if (existingReg.status === "cancelled") {
                            // Reactivate cancelled registration
                            db.beginTransaction(err => {
                                if (err) return res.status(500).json({ success: false, message: "Database error" });

                                db.query(`
                                    UPDATE event_registrations
                                    SET status = 'confirmed', registration_date = NOW(), attendees = ?, special_requests = ?
                                    WHERE user_id = ? AND event_id = ?
                                `, [numAttendees, special_requests || null, user_id, event_id], (err) => {
                                    if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Failed to reactivate registration" }));

                                    db.query("UPDATE events SET current_registrations = current_registrations + ? WHERE id = ?", [numAttendees, event_id], (err) => {
                                        if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Failed to update event count" }));

                                        db.query("UPDATE users SET reward_points = reward_points + ? WHERE id = ?", [pointsAwarded, user_id], (err) => {
                                            if (err) console.error("Reward points error:", err);

                                            db.query("INSERT INTO reward_transactions (user_id, points, reason) VALUES (?, ?, ?)", [user_id, pointsAwarded, `Re-registered for event: ${event.name}`], (err) => {
                                                if (err) console.error("Transaction log error:", err);

                                                db.commit(err => {
                                                    if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Database error" }));
                                                    res.json({
                                                        success: true,
                                                        message: `Successfully re-registered for ${event.name}! +${pointsAwarded} points awarded!`,
                                                        event: { id: event.id, name: event.name, remaining_spots: maxParticipants - (currentRegistrations + numAttendees) }
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        }
                    } else {
                        // New registration
                        db.beginTransaction(err => {
                            if (err) return res.status(500).json({ success: false, message: "Database error" });

                            db.query(`
                                INSERT INTO event_registrations (user_id, event_id, registration_date, status, attendees, special_requests)
                                VALUES (?, ?, NOW(), 'confirmed', ?, ?)
                            `, [user_id, event_id, numAttendees, special_requests || null], (err) => {
                                if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Failed to register for event" }));

                                db.query("UPDATE events SET current_registrations = current_registrations + ? WHERE id = ?", [numAttendees, event_id], (err) => {
                                    if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Failed to update event registration count" }));

                                    db.query("UPDATE users SET reward_points = reward_points + ? WHERE id = ?", [pointsAwarded, user_id], (err) => {
                                        if (err) console.error("Reward points error:", err);

                                        db.query("INSERT INTO reward_transactions (user_id, points, reason) VALUES (?, ?, ?)", [user_id, pointsAwarded, `Registered for event: ${event.name}`], (err) => {
                                            if (err) console.error("Transaction log error:", err);

                                            db.commit(err => {
                                                if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Database error" }));
                                                res.json({
                                                    success: true,
                                                    message: `Successfully registered for ${event.name}! +${pointsAwarded} points awarded!`,
                                                    event: { id: event.id, name: event.name, remaining_spots: maxParticipants - (currentRegistrations + numAttendees) }
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    }
                }
            );
        });
    });
});

// Cancel event registration
router.delete("/cancel-registration", (req, res) => {
    const { user_id, event_id } = req.body;

    if (!user_id || !event_id) {
        return res.status(400).json({ success: false, message: "User ID and Event ID are required" });
    }

    db.query(
        "SELECT id, attendees FROM event_registrations WHERE user_id = ? AND event_id = ? AND status = 'confirmed'", [user_id, event_id],
        (err, regResults) => {
            if (err) return res.status(500).json({ success: false, message: "Database error" });
            if (regResults.length === 0) return res.status(404).json({ success: false, message: "Active registration not found" });

            const numAttendees = regResults[0].attendees || 1;

            db.beginTransaction(err => {
                if (err) return res.status(500).json({ success: false, message: "Database error" });

                db.query("UPDATE event_registrations SET status = 'cancelled' WHERE user_id = ? AND event_id = ?", [user_id, event_id], (err) => {
                    if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Failed to cancel registration" }));

                    db.query("UPDATE events SET current_registrations = current_registrations - ? WHERE id = ?", [numAttendees, event_id], (err) => {
                        if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Failed to update event count" }));

                        db.commit(err => {
                            if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Database error" }));
                            res.json({ success: true, message: "Registration cancelled successfully" });
                        });
                    });
                });
            });
        }
    );
});

// Update registration details
router.put("/update-registration", (req, res) => {
    const { user_id, event_id, attendees, special_requests } = req.body;

    if (!user_id || !event_id) {
        return res.status(400).json({ success: false, message: "User ID and Event ID are required" });
    }

    db.query(
        "SELECT id, attendees FROM event_registrations WHERE user_id = ? AND event_id = ? AND status = 'confirmed'", [user_id, event_id],
        (err, regResults) => {
            if (err) return res.status(500).json({ success: false, message: "Database error" });
            if (regResults.length === 0) return res.status(404).json({ success: false, message: "Registration not found" });

            const oldAttendees = regResults[0].attendees || 1;
            const newAttendees = attendees || oldAttendees;
            const attendeeDiff = newAttendees - oldAttendees;

            db.beginTransaction(err => {
                if (err) return res.status(500).json({ success: false, message: "Database error" });

                db.query(
                    "UPDATE event_registrations SET attendees = ?, special_requests = ? WHERE user_id = ? AND event_id = ?", [newAttendees, special_requests || null, user_id, event_id],
                    (err) => {
                        if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Failed to update registration" }));

                        if (attendeeDiff !== 0) {
                            db.query("UPDATE events SET current_registrations = current_registrations + ? WHERE id = ?", [attendeeDiff, event_id], (err) => {
                                if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Failed to update event count" }));

                                db.commit(err => {
                                    if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Database error" }));
                                    res.json({ success: true, message: "Registration updated successfully" });
                                });
                            });
                        } else {
                            db.commit(err => {
                                if (err) return db.rollback(() => res.status(500).json({ success: false, message: "Database error" }));
                                res.json({ success: true, message: "Registration updated successfully" });
                            });
                        }
                    }
                );
            });
        }
    );
});

module.exports = router;