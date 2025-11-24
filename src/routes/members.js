const express = require('express');
const router = express.Router();
const { Member, Tournament } = require('../models');
const { Op } = require('sequelize');

// Create a new member
router.post('/', async (req, res) => {
  try {
    const member = await Member.create(req.body);
    res.status(201).json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all members
router.get('/', async (req, res) => {
  try {
    const members = await Member.findAll({
      include: [{
        model: Tournament,
        as: 'tournaments',
        through: { attributes: [] }
      }]
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get member by ID
router.get('/:id', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id, {
      include: [{
        model: Tournament,
        as: 'tournaments',
        through: { attributes: [] }
      }]
    });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search members by name
router.get('/search/name/:name', async (req, res) => {
  try {
    const members = await Member.findAll({
      where: {
        name: {
          [Op.like]: `%${req.params.name}%`
        }
      },
      include: [{
        model: Tournament,
        as: 'tournaments',
        through: { attributes: [] }
      }]
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search members by phone
router.get('/search/phone/:phone', async (req, res) => {
  try {
    const members = await Member.findAll({
      where: {
        phone: {
          [Op.like]: `%${req.params.phone}%`
        }
      },
      include: [{
        model: Tournament,
        as: 'tournaments',
        through: { attributes: [] }
      }]
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search members by membership duration
router.get('/search/duration/:duration', async (req, res) => {
  try {
    const members = await Member.findAll({
      where: {
        membershipDuration: parseInt(req.params.duration)
      },
      include: [{
        model: Tournament,
        as: 'tournaments',
        through: { attributes: [] }
      }]
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search members by tournament start date
router.get('/search/tournament-date/:date', async (req, res) => {
  try {
    const members = await Member.findAll({
      include: [{
        model: Tournament,
        as: 'tournaments',
        where: {
          startDate: {
            [Op.gte]: new Date(req.params.date)
          }
        },
        through: { attributes: [] }
      }]
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update member
router.put('/:id', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    await member.update(req.body);
    res.json(member);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete member
router.delete('/:id', async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    await member.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
