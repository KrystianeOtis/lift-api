const express = require('express');
const router = express.Router();
// const createError = require('http-errors');

const player_infoController = require('../controllers/player_info');

router.get('/', player_infoController.getAll); 

router.get('/:id', player_infoController.getSingle);

router.post('/', player_infoController.createPlayer);

router.put('/:id', player_infoController.updatePlayer);

router.delete('/:id', player_infoController.deletePlayer);

module.exports = router;