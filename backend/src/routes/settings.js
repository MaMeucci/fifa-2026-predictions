const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  getTournamentStatus,
  getCapiscioneGroups,
  updateCapiscioneGroups,
  getScoringRules,
} = require('../controllers/settingsController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getSettings);
router.get('/status', getTournamentStatus);
router.get('/capiscione', getCapiscioneGroups);
router.get('/scoring', getScoringRules);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.put('/', updateSettings);
router.put('/capiscione', updateCapiscioneGroups);

module.exports = router;

// Made with Bob