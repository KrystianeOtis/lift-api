
const express = require('express');
const router = express.Router();

// ADD DB COLLECTION HERE
router.use('/users', require('./users'));
router.use('/exercises', require('./exercises'));
router.use('/userExercisePlan', require('./userExercisePlan'));
router.use('/', require('./swagger'));

module.exports = router;
