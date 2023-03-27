const mongodb = require('../db/connect');

const getAll = (req, res) => {
  mongodb
    .getDb()
    .db("Lift")
    .collection('exercises')
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
  const id = parseInt(req.params.id);
  mongodb
    .getDb()
    .db('Lift')
    .collection('exercises')
    .find({ id: id })
    .toArray(function (err, docs) {
      if (err) { // Mongo Error
        res.status(400).json({ message: err });
      } else if (isNaN(id)) { // ID is not an int
        res.status(400).json({ message: `Invalid Exercise ID : provided id is not an integer` });
      } else if (docs.length === 0) { // No results found
        res.status(404).json({ message: `Exercise with id ${id} not found` });
      } else if (docs.length > 1) { // More than one record has the same ID
        res.status(500).json({ message: `Multiple exercises found with id ${id}` });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(docs[0]);
      }
    });
};

const createExercise = async (req, res) => {
  const exercise = {
    name: req.body.name,
    description: req.body.description,
    image: req.body.image, //BASE 64
    categories: req.body.categories
  };
  const response = await mongodb.getDb().db("Lift").collection('exercises').insertOne(exercise);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the exercise.');
  }
};

// const updateExercise = async (req, res) => {
//   const userId = new ObjectId(req.params.id);
//   // be aware of updateOne if you only want to update specific fields
//   const player = {
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     expLvl: req.body.expLvl,
//     favCourse: req.body.favCourse,
//     favDisc: req.body.favDisc,
//     throwStyle: req.body.throwStyle,
//     longestShot: req.body.longestShot
//   };
//   const response = await mongodb
//     .getDb()
//     .db()
//     .collection('player_info')
//     .replaceOne({ _id: userId }, player);
//   console.log(response);
//   if (response.modifiedCount > 0) {
//     res.status(204).send();
//   } else {
//     res.status(500).json(response.error || 'Some error occurred while updating the player.');
//   }
// };

// const deleteExercise = async (req, res) => {
//   if (!ObjectId.isValid(req.params.id)) {
//     res.status(400).json('Must use a valid contact id to delete a contact.');
//   }
//   const userId = new ObjectId(req.params.id);
//   const response = await mongodb.getDb().db().collection('player_info').remove({ _id: userId }, true);
//   console.log(response);
//   if (response.deletedCount > 0) {
//     res.status(204).send();
//   } else {
//     res.status(500).json(response.error || 'Some error occurred while deleting the player.');
//   }
// };

module.exports = {
  getAll,
  getSingle,
  createExercise,
  // updatePlayer,
  // deletePlayer
};