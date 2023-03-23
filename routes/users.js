const express = require('express');
const router = express.Router();
// const createError = require('http-errors');

const user_info = require('../controllers/user_info');

router.get('/', user_info.getAll); 

router.get('/:id', user_info.getSingle);

router.post('/', user_info.createUser);

router.put('/:id', user_info.updateUser);

// router.delete('/:id', user_info.deletePlayer);

module.exports = router;