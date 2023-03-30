const express = require('express');
const router = express.Router();
// const createError = require('http-errors');

const userExercisePlan = require('../controllers/userExercisePlan');

router.get('/:userID', userExercisePlan.getAll);

router.get('/:userID/:planID', userExercisePlan.getSingle);

router.post('/:userID', userExercisePlan.createUserExercisePlan);

// router.put('/:id', user_info.updatePlayer);

// router.delete('/:id', user_info.deletePlayer);

module.exports = router;
