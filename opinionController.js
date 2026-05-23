const db = require('./Db');

exports.createOpinion = async(req, res) => {
    try {
        const { name, type, service, comment, email } = req.body;

        if (!comment) {
            return res.status(400).json({ message: 'Comment is required' });
        }

        const sql = `
            INSERT INTO opinions 
            (name, type, service, comment, email)
            VALUES (?, ?, ?, ?, ?)
        `;

        await db.query(sql, [name, type, service, comment, email]);

        res.json({ message: 'Opinion saved successfully' });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};