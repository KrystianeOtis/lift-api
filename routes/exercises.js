const express = require('express');
const router = express.Router();
// const createError = require('http-errors');

const exercises = require('../controllers/exercises.js');

router.get('/', exercises.getAll); 

router.get('/:id', exercises.getSingle);

router.post('/', exercises.createExercise);

// router.put('/:id', user_info.updatePlayer);

// router.delete('/:id', user_info.deletePlayer);

module.exports = router;