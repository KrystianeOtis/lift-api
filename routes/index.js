const express = require('express');
const router = express.Router();

// ADD DB COLLECTION HERE
router.use('/users', require('./users.js'));
router.use('/exercises', require('./exercises.js'));
router.use('/userExercisePlan', require('./userExercisePlan.js'));
router.use('/', require('./swagger.js'));

module.exports = router;
