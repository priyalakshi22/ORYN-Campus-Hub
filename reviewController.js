const db = require('./Db');

exports.createReview = async(req, res) => {
    try {
        const { name, student_id, service, rating, title, review, recommendation } = req.body;

        if (!name || !student_id || !service || !rating || !review) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const sql = `
            INSERT INTO reviews 
            (name, student_id, service, rating, title, review, recommendation)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await db.query(sql, [name, student_id, service, rating, title, review, recommendation]);

        res.json({ message: 'Review saved successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getReviews = async(req, res) => {
    const [rows] = await db.query("SELECT * FROM reviews ORDER BY created_at DESC");
    res.json(rows);
};