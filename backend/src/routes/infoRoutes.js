const express = require('express');
const router = express.Router();

// PUBLIC: Get WhatsApp Information
// GET /api/info/whatsapp
router.get('/whatsapp', (req, res) => {
    res.json({
        primary: "9829128594",
        secondary: "8619053741",
        link: "https://wa.me/message/HEA455SLBBD7L1"
    });
});

module.exports = router;
