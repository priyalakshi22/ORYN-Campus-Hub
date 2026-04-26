const express = require("express");
const router = express.Router();
const db = require("../db");

// Get cafe menu
router.get("/menu", (req, res) => {
    db.query("SELECT * FROM cafe_menu WHERE is_available = TRUE", (err, results) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true, menu: results });
    });
});

// Place a cafe order
router.post("/order", (req, res) => {
    const { user_id, items, total_amount, pickup_time, special_instructions } = req.body;

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ success: false });

        db.query(
            "INSERT INTO cafe_orders (user_id, total_amount, pickup_time, special_instructions) VALUES (?, ?, ?, ?)", [user_id, total_amount, pickup_time, special_instructions],
            (err, result) => {
                if (err) return db.rollback(() => res.status(500).json({ success: false }));

                const orderId = result.insertId;
                const pointsEarned = Math.floor(total_amount / 50);

                for (const item of items) {
                    db.query(
                        "INSERT INTO cafe_order_items (order_id, menu_item_id, quantity, price) VALUES (?, ?, ?, ?)", [orderId, item.id, item.quantity, item.price],
                        (err) => {
                            if (err) return db.rollback(() => res.status(500).json({ success: false }));
                        }
                    );
                }

                db.query("UPDATE users SET reward_points = reward_points + ? WHERE id = ?", [pointsEarned, user_id], (err) => {
                    if (err) return db.rollback(() => res.status(500).json({ success: false }));

                    db.commit(err => {
                        if (err) return db.rollback(() => res.status(500).json({ success: false }));
                        res.json({ success: true, message: `Order placed! +${pointsEarned} points` });
                    });
                });
            }
        );
    });
});

module.exports = router;