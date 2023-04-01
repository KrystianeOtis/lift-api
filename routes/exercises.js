const express = require('express');
const router = express.Router();
// const createError = require('http-errors');

const exercises = require('../controllers/exercises.js');

router.get('/', exercises.getAll);

router.get('/:id', exercises.getSingle);

router.post('/', exercises.createExercise);

router.put('/:id', exercises.updateExercise);

router.delete('/:id', exercises.deleteExercise);

router.get('/category/:category', exercises.getByCategory);

module.exports = router;
