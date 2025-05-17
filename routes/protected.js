const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');

router.get('/test', authenticateJWT, (req, res) => {
  res.json({
    message: 'You accessed a protected route!',
    user: req.user
  });
});

module.exports = router;
