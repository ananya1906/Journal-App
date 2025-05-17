const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');
const { Journal, User } = require('../models');
const { Op } = require('sequelize');

// TEACHER FEED
router.get('/teacher', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can view this feed' });
  }

  try {
    const journals = await Journal.findAll({
      where: { created_by: req.user.id },
      include: [{ model: User, as: 'taggedStudents', attributes: ['id', 'name'] }]
    });

    res.json({ message: 'Teacher feed', journals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching teacher feed' });
  }
});

// STUDENT FEED
router.get('/student', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Only students can view this feed' });
  }

  try {
    const journals = await Journal.findAll({
      include: [
        {
          model: User,
          as: 'taggedStudents',
          where: { id: req.user.id },
          attributes: []
        }
      ],
      where: {
        published_at: {
          [Op.lte]: new Date()
        }
      }
    });

    res.json({ message: 'Student feed', journals });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching student feed' });
  }
});

module.exports = router;
