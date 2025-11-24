const express = require('express');
const router = express.Router();
const { Tournament, Member } = require('../models');
const { Op } = require('sequelize');

// Create a new tournament
router.post('/', async (req, res) => {
  try {
    const tournament = await Tournament.create(req.body);
    res.status(201).json(tournament);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all tournaments
router.get('/', async (req, res) => {
  try {
    const tournaments = await Tournament.findAll({
      include: [{
        model: Member,
        as: 'members',
        through: { attributes: [] }
      }]
    });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get tournament by ID
router.get('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id, {
      include: [{
        model: Member,
        as: 'members',
        through: { attributes: [] }
      }]
    });
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    res.json(tournament);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add member to tournament
router.post('/:tournamentId/members/:memberId', async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.tournamentId);
    const member = await Member.findByPk(req.params.memberId);
    
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    
    await tournament.addMember(member);
    
    const updatedTournament = await Tournament.findByPk(req.params.tournamentId, {
      include: [{
        model: Member,
        as: 'members',
        through: { attributes: [] }
      }]
    });
    
    res.json(updatedTournament);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all members in a tournament
router.get('/:id/members', async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id, {
      include: [{
        model: Member,
        as: 'members',
        through: { attributes: [] }
      }]
    });
    
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    
    res.json(tournament.members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search tournaments by start date
router.get('/search/start-date/:date', async (req, res) => {
  try {
    const tournaments = await Tournament.findAll({
      where: {
        startDate: {
          [Op.gte]: new Date(req.params.date)
        }
      },
      include: [{
        model: Member,
        as: 'members',
        through: { attributes: [] }
      }]
    });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Search tournaments by location
router.get('/search/location/:location', async (req, res) => {
  try {
    const tournaments = await Tournament.findAll({
      where: {
        location: {
          [Op.like]: `%${req.params.location}%`
        }
      },
      include: [{
        model: Member,
        as: 'members',
        through: { attributes: [] }
      }]
    });
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update tournament
router.put('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    await tournament.update(req.body);
    res.json(tournament);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete tournament
router.delete('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    await tournament.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
