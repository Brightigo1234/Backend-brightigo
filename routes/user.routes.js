const express = require('express');
const router = express.Router();

// import controller
const {
  readController,
  updateController,
  updateUserScoreController,
} = require('../controllers/user.controller');

router.get('/user/:id', readController);
router.put('/user/update', updateController);
router.put('/user/test/result/:id', updateUserScoreController);

module.exports = router;
