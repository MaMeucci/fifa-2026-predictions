const express = require('express');
const router = express.Router();
const {
  getMyPredictions,
  updateMyPredictions,
  lockMyPredictions,
  getAllPredictions,
  getUserPredictions,
  getLeaderboard,
  calculateScores,
} = require('../controllers/predictionsController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/leaderboard', getLeaderboard);

// Protected routes (require authentication)
router.use(protect);

router.route('/my')
  .get(getMyPredictions)
  .put(updateMyPredictions);

router.post('/my/lock', lockMyPredictions);

router.get('/all', getAllPredictions);
router.get('/user/:userId', getUserPredictions);

// Admin routes
router.post('/calculate-scores', authorize('admin'), calculateScores);

module.exports = router;

// Made with Bob