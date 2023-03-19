const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = (req, res) => {
  mongodb
    .getDb()
    .db('Lift')
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
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid exercise id.');
  }
  const workoutId = new ObjectId(req.params.id);
  mongodb
    .getDb()
    .db('Lift')
    .collection('exercises')
    .find({ _id: workoutId })
    .toArray((err, result) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result[0]);
    });
};

const getCategory = (req, res) => {
  let category = req.params.category;

  mongodb
    .getDb()
    .db('Lift')
    .collection('exercises')
    .find({ exercise_category: category })
    .toArray((err, result) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result[0]);
    });
};

const createExercise = async (req, res) => {
  const exercise = {
    exercise_category: req.body.exercise_category,
    name: req.body.name,
    muscle_group: req.body.muscle_group,
    sets: req.body.sets,
    reps: req.body.reps,
    description: req.body.description,
    equipment: req.body.equipment
  };

  const response = await mongodb.getDb().db('Lift').collection('exercises').insertOne(exercise);
  if (response.acknowledged) {
    res.status(201).json(response);
  } else {
    res.status(500).json(response.error || 'Some error occurred while creating the exercise.');
  }
  console.log(exercise);
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
  getCategory,
  createExercise
  // updatePlayer,
  // deletePlayer
};
