const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = (req, res) => {
  mongodb
    .getDb()
    .db()
    .collection('player_info')
    .find()
    .toArray((err, lists) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });

};
const getSingle = (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid contact id to find a player.');  
  }
  const userId = new ObjectId(req.params.id);
  mongodb
    .getDb()
    .db()
    .collection('player_info')
    .find({ _id: userId })
    .toArray((err, result) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result[0]);
    });
};

const createPlayer = async (req, res) => {
  const player = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    expLvl: req.body.expLvl,
    favCourse: req.body.favCourse,
    favDisc: req.body.favDisc,
    throwStyle: req.body.throwStyle,
    longestShot: req.body.longestShot
  };
  const response = await mongodb.getDb().db().collection('player_info').insertOne(player);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the player.');
  }
};

const updatePlayer = async (req, res) => {
  const userId = new ObjectId(req.params.id);
  // be aware of updateOne if you only want to update specific fields
  const player = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    expLvl: req.body.expLvl,
    favCourse: req.body.favCourse,
    favDisc: req.body.favDisc,
    throwStyle: req.body.throwStyle,
    longestShot: req.body.longestShot
  };
  const response = await mongodb
    .getDb()
    .db()
    .collection('player_info')
    .replaceOne({ _id: userId }, player);
  console.log(response);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the player.');
  }
};

const deletePlayer = async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid contact id to delete a contact.');
  }
  const userId = new ObjectId(req.params.id);
  const response = await mongodb.getDb().db().collection('player_info').remove({ _id: userId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the player.');
  }
};

module.exports = {
  getAll,
  getSingle,
  createPlayer,
  updatePlayer,
  deletePlayer
};