const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = (req, res) => {
  /* #swagger.tags = ['Exercise Plans'] 
     #swagger.summary = 'Get all exercises'  
     #swagger.description = 'Return all exercises from the database'
    */
  mongodb
    .getDb()
    .db('Lift')
    .collection('userExercisePlan')
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
  /* #swagger.tags = ['Exercise Plans'] 
     #swagger.summary = 'Get all exercises'  
     #swagger.description = 'Return all exercises from the database'
    */
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid exercise id.');
  }
  const userID = new ObjectId(req.params.id);
  mongodb
    .getDb()
    .db('Lift')
    .collection('userExercisePlan')
    // CHANGE THIS TO MATCH THE USERID NAME
    .find({ userID: userID })
    .toArray((err, result) => {
      if (err) {
        res.status(400).json({ message: err });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result[0]);
    });
};

const createExercisePlan = async (req, res) => {
  /* #swagger.tags = ['Exercise Plans'] 
     #swagger.summary = 'Get all exercises'  
     #swagger.description = 'Return all exercises from the database'
    */

  const exercises = req.body.exercises.map((exercise) => ({
    exercise_id: exercise.exercise_id,
    reps: exercise.reps,
    sets: exercise.sets,
    weight: exercise.weight
  }));

  const document = {
    _id: req.body._id,
    exercises: exercises,
    user: req.body.user,
    toDoDate: new Date(req.body.toDoDate),
    planNumber: req.body.planNumber
  };

  const response = await mongodb
    .getDb()
    .db('Lift')
    .collection('userExercisePlan')
    .insertOne(document);
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
  createExercisePlan
  // updatePlayer,
  // deletePlayer
};
