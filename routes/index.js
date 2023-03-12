
const express = require('express');
const router = express.Router();

// ADD DB COLLECTION HERE
router.use('/player_info', require('./player_info'));
router.use('/', require('./swagger'));

module.exports = router;
