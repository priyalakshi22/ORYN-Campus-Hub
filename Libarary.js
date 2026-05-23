const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all available books
router.get("/books", (req, res) => {
    const { category, search } = req.query;
    let sql = "SELECT * FROM library_books WHERE available_copies > 0";
    const params = [];

    if (category && category !== "all") {
        sql += " AND category = ?";
        params.push(category);
    }
    if (search) {
        sql += " AND (title LIKE ? OR author LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
    }

    db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        res.json({ success: true, books: results });
    });
});

// Borrow a book
router.post("/borrow", (req, res) => {
    const { user_id, book_id } = req.body;

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ success: false, message: err.message });

        db.query("SELECT available_copies FROM library_books WHERE id = ? FOR UPDATE", [book_id], (err, results) => {
            if (err) return db.rollback(() => res.status(500).json({ success: false }));
            if (results[0].available_copies <= 0) {
                return db.rollback(() => res.status(400).json({ success: false, message: "No copies available" }));
            }

            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 14);

            db.query(
                "INSERT INTO library_borrowings (user_id, book_id, borrow_date, due_date) VALUES (?, ?, CURDATE(), ?)", [user_id, book_id, dueDate], (err) => {
                    if (err) return db.rollback(() => res.status(500).json({ success: false }));

                    db.query("UPDATE library_books SET available_copies = available_copies - 1 WHERE id = ?", [book_id], (err) => {
                        if (err) return db.rollback(() => res.status(500).json({ success: false }));

                        db.query("UPDATE users SET reward_points = reward_points + 50 WHERE id = ?", [user_id], (err) => {
                            if (err) return db.rollback(() => res.status(500).json({ success: false }));

                            db.commit(err => {
                                if (err) return db.rollback(() => res.status(500).json({ success: false }));
                                res.json({ success: true, message: "Book borrowed successfully! +50 points" });
                            });
                        });
                    });
                }
            );
        });
    });
});

module.exports = router;