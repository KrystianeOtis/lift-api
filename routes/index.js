
const express = require('express');
const router = express.Router();

// ADD DB COLLECTION HERE
router.use('/', require('./'));
router.use('/', require('./swagger'));

module.exports = router;
