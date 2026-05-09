const express = require('express');
const router = express.Router();
const {
  getAllMatches,
  getMatch,
  getMatchesByPhase,
  getMatchesByGroup,
  createMatch,
  updateMatch,
  updateMatchResult,
  deleteMatch,
  getUpcomingMatches,
  getLiveMatches,
  getFinishedMatches,
} = require('../controllers/matchesController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getAllMatches);
router.get('/upcoming', getUpcomingMatches);
router.get('/live', getLiveMatches);
router.get('/finished', getFinishedMatches);
router.get('/phase/:phase', getMatchesByPhase);
router.get('/group/:group', getMatchesByGroup);
router.get('/:id', getMatch);

// Admin routes (require authentication and admin role)
router.use(protect);
router.use(authorize('admin'));

router.post('/', createMatch);
router.put('/:id', updateMatch);
router.put('/:id/result', updateMatchResult);
router.delete('/:id', deleteMatch);

module.exports = router;

// Made with Bob