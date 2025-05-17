const express = require('express');
const router = express.Router();
const { Journal, JournalStudent } = require('../models');
const authenticateJWT = require('../middleware/auth');

// CREATE journal — only for teachers
router.post('/', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can create journals' });
  }

  const { description, attachment_type, attachment_url, taggedStudentIds } = req.body;

  try {
    const journal = await Journal.create({
      description,
      attachment_type,
      attachment_url,
      published_at: null,
      created_by: req.user.id
    });

    // Tag students
    if (Array.isArray(taggedStudentIds)) {
      for (const studentId of taggedStudentIds) {
        await JournalStudent.create({
          JournalId: journal.id,
          UserId: studentId
        });
      }
    }

    res.status(201).json({ message: 'Journal created', journal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating journal' });
  }
});

// UPDATE journal — only creator teacher
router.put('/:id', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can update journals' });
  }

  const journalId = req.params.id;
  const { description, attachment_type, attachment_url, taggedStudentIds } = req.body;

  try {
    const journal = await Journal.findByPk(journalId);
    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    if (journal.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Not your journal' });
    }

    await journal.update({ description, attachment_type, attachment_url });

    // Clear and re-tag students
    await JournalStudent.destroy({ where: { JournalId: journalId } });

    if (Array.isArray(taggedStudentIds)) {
      for (const studentId of taggedStudentIds) {
        await JournalStudent.create({ JournalId: journalId, UserId: studentId });
      }
    }

    res.json({ message: 'Journal updated', journal });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating journal' });
  }
});

// DELETE journal — only creator teacher
router.delete('/:id', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can delete journals' });
  }

  try {
    const journal = await Journal.findByPk(req.params.id);
    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    if (journal.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Not your journal' });
    }

    await JournalStudent.destroy({ where: { JournalId: journal.id } });
    await journal.destroy();

    res.json({ message: 'Journal deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting journal' });
  }
});

// PUBLISH journal — only creator teacher
router.post('/:id/publish', authenticateJWT, async (req, res) => {
  if (req.user.role !== 'teacher') {
    return res.status(403).json({ message: 'Only teachers can publish journals' });
  }

  try {
    const journal = await Journal.findByPk(req.params.id);
    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    if (journal.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Not your journal' });
    }

    journal.published_at = new Date();
    await journal.save();

    res.json({ message: 'Journal published', published_at: journal.published_at });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error publishing journal' });
  }
});

module.exports = router;
