const express = require('express');
const router = express.Router();
// const createError = require('http-errors');

const userExercisePlan = require('../controllers/user_info');

router.get('/', userExercisePlan.getAll); 

router.get('/:id', userExercisePlan.getSingle);

router.post('/', userExercisePlan.createUser);

// router.put('/:id', user_info.updatePlayer);

// router.delete('/:id', user_info.deletePlayer);

module.exports = router;