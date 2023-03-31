const express = require('express');
const router = express.Router();
// const createError = require('http-errors');

const userExercisePlan = require('../controllers/userExercisePlan');

router.get('/:userID', userExercisePlan.getAll);

router.get('/:userID/:planID', userExercisePlan.getSingle);

router.post('/:userID', userExercisePlan.createUserExercisePlan);

router.put('/:userID/:planID', userExercisePlan.updateUserExercisePlan);

router.delete('/:planID', userExercisePlan.deleteUserExercisePlan);

module.exports = router;
