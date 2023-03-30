const express = require('express');
const router = express.Router();
// const createError = require('http-errors');

const user_info = require('../controllers/users');

router.get('/', user_info.getAll);

router.get('/:userID', user_info.getSingle);

router.post('/', user_info.createUser);

router.put('/:userID', user_info.updateUser);

router.delete('/:userID', user_info.deleteUser);

module.exports = router;
