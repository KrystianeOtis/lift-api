const mongodb = require('../db/connect');
var Double = require('mongodb').Double;

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

/** Retrieves all userExercisePlans */
const getAll = async (req, res) => {
  /* #swagger.tags = ['userExercisePlans']
     #swagger.summary = 'Get all userExercisePlans'
     #swagger.description = 'Return all userExercisePlans for a user from the database'
    */
  const userID = parseInt(req.params.userID);
  if (isNaN(userID)) res.status(400).json('userID is not an integer');
  try {
    const user = await mongodb
      .getDb()
      .db('Lift')
      .collection('users')
      .find({ userID: userID })
      .toArray();

    // Check if user exists
    const userExists = user.length != 0 ? true : false;
    if (!userExists) res.status(400).json(`User with id ${userID} does not exist`);

    const plan = await mongodb
      .getDb()
      .db('Lift')
      .collection('userExercisePlan')
      .find({ userID: userID })
      .toArray(function (err, docs) {
        if (err) {
          // Mongo Error
          /* #swagger.responses[400] = {
          schema: { $ref: '#/definitions/notFoundError' }
        } */
          console.log('err');
          res.status(400).json({ message: err });
        } else if (docs.length === 0) {
          // No results found
          res.status(404).json({ message: `No exercise plans found for user ${userID}` });
        } else {
          /* #swagger.responses[200] = {
        schema: { $ref: '#/definitions/userExercisePlan' }
        } */
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(docs);
        }
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

/** Retrieve a single userExercisePlan */
const getSingle = async (req, res) => {
  /* #swagger.tags = ['userExercisePlans']
     #swagger.summary = 'Get a single userExercisePlan'
     #swagger.description = 'Return a single userExercisePlan from the database by its id'
     #swagger.parameters['id'] = {
      description: 'The id of the userExercisePlan',
     }
  */
  const userID = parseInt(req.params.userID);
  const planID = parseInt(req.params.planID);
  if (isNaN(userID)) res.status(400).json('userID is not an integer');
  if (isNaN(planID)) res.status(400).json('planID is not an integer');
  try {
    const user = await mongodb
      .getDb()
      .db('Lift')
      .collection('users')
      .find({ userID: userID })
      .toArray();

    // Check if user exists
    const userExists = user.length != 0 ? true : false;
    if (!userExists) res.status(400).json(`User with id ${userID} does not exist`);

    const plan = await mongodb
      .getDb()
      .db('Lift')
      .collection('userExercisePlan')
      .find({ planID: planID, userID: userID })
      .toArray(function (err, docs) {
        if (err) {
          // Mongo Error
          /* #swagger.responses[400] = {
          schema: { $ref: '#/definitions/notFoundError' }
        } */
          console.log('err');
          res.status(400).json({ message: err });
        } else if (docs.length === 0) {
          // No results found
          res.status(404).json({ message: `userExercisePlan with id ${planID} not found` });
        } else if (docs.length > 1) {
          // More than one record has the same ID
          res.status(500).json({ message: `Multiple userExercisePlans found with id ${planID}` });
        } else {
          /* #swagger.responses[200] = {
        schema: { $ref: '#/definitions/userExercisePlan' }
        } */
          res.setHeader('Content-Type', 'application/json');
          res.status(200).json(docs[0]);
        }
      });
  } catch (err) {
    res.status(500).json(err);
  }
};

/** Creates a new userExercisePlan */
const createUserExercisePlan = async (req, res) => {
  /* #swagger.tags = ['userExercisePlans']  
     #swagger.summary = 'Create an userExercisePlan'   
     #swagger.description = 'Creates an userExercisePlan and adds it to the database, this will include the name, description,
     category and id of the userExercisePlan.' 
     #swagger.parameters['userExercisePlan'] = {
        in: 'body',
        description: 'Required information to add an userExercisePlan',
        schema: { $ref: '#/definitions/userExercisePlan' } 
     }
  */
  const userID = parseInt(req.params.userID);
  if (isNaN(userID)) {
    res.status(400).json('Provided userID is not in integer format');
  }
  const user = await mongodb
    .getDb()
    .db('Lift')
    .collection('users')
    .find({ userID: userID })
    .toArray();

  // Check if user exists
  const userExists = user.length != 0 ? true : false;
  if (!userExists) res.status(400).json(`User with id ${userID} does not exist`);

  // Validate fields and turn weight into Double
  const exercises = req.body.exercises;

  const keysToCheck = ['exerciseID', 'weight', 'reps', 'sets'];
  for (let i = 0; i < exercises.length; i++) {
    const x = exercises[i];
    keysToCheck.forEach((key) => {
      if (!x.hasOwnProperty(key)) {
        res.status(400).json(`Missing ${key} in exercise array at index ${i}`);
      }
    });
    x.weight = Double(x.weight);
    x.reps = parseInt(x.reps);
    x.sets = parseInt(x.sets);
    if (isNaN(x.reps)) res.status(400).json('Invalid Reps: Reps not a number');
    if (isNaN(x.sets)) res.status(400).json('Invalid sets: sets not a number');
  }

  // Check if each exercise exists
  const exerciseIDs = exercises.map((exercise) => exercise.exerciseID);

  const exerciseCheckPromises = exerciseIDs.map((exerciseID) => {
    return mongodb
      .getDb()
      .db('Lift')
      .collection('exercises')
      .find({ exerciseID: exerciseID })
      .toArray();
  });

  const exerciseChecks = await Promise.all(exerciseCheckPromises);

  // Figure out which exerciseIDs are invalid
  const invalidExerciseIDs = exerciseChecks
    .map((check, index) => {
      if (check.length === 0) {
        return exerciseIDs[index];
      }
    })
    .filter(Boolean);
  if (invalidExerciseIDs.length !== 0) {
    return res
      .status(400)
      .json(`The following exercise IDs do not exist: ${invalidExerciseIDs.join(', ')}`);
  }

  // Validate req.body.date
  const date = new Date(req.body.toDoDate);
  if (!isValidDate(date)) res.status(400).json('Date is not valid');

  try {
    const userExercisePlan = {
      userID: userID,
      toDoDate: date,
      exercises: exercises
    };
    const response = await mongodb
      .getDb()
      .db('Lift')
      .collection('userExercisePlan')
      .insertOne(userExercisePlan);
    console.log(response);
    if (response.acknowledged) {
      res.status(200).json(response);
    } else res.status(500).json(response);
  } catch (err) {
    let outputErr = {};
    if (err.errInfo.details.schemaRulesNotSatisfied.length > 0) {
      err.errInfo.details.schemaRulesNotSatisfied.forEach((rule) => {
        rule.propertiesNotSatisfied.forEach((property) => {
          outputErr[
            property.propertyName
          ] = `${property.propertyName} ${property.details[0].reason} type ${property.details[0].specifiedAs.bsonType} or is missing`;
        });
      });
      // Send 400 and the reason
      res.status(400).json(outputErr);
    } else {
      console.log(err.errInfo.details);
      res.status(500).json(err.errInfo.details || 'Something is not quite right');
    }
  }
};

/** Creates a new userExercisePlan */
const updateUserExercisePlan = async (req, res) => {
  /* #swagger.tags = ['userExercisePlans']  
     #swagger.summary = 'Update an userExercisePlan'   
     #swagger.description = 'Updates an userExercisePlan'
     #swagger.parameters['userExercisePlan'] = {
        in: 'body',
        description: 'Required information to add an userExercisePlan',
        schema: { $ref: '#/definitions/userExercisePlan' } 
     }
  */
  const userID = parseInt(req.params.userID);
  const planID = parseInt(req.params.planID);
  if (isNaN(userID)) res.status(400).json('userID is not an integer');
  if (isNaN(planID)) res.status(400).json('planID is not an integer');

  const user = await mongodb
    .getDb()
    .db('Lift')
    .collection('users')
    .find({ userID: userID })
    .toArray();

  // Check if user exists
  const userExists = user.length != 0 ? true : false;
  if (!userExists) res.status(400).json(`User with id ${userID} does not exist`);
  let targetUserExercisePlan = {};
  const docs = await mongodb
    .getDb()
    .db('Lift')
    .collection('userExercisePlan')
    .find({ planID: planID, userID: userID })
    .toArray();

  if (docs.length === 0) {
    // No results found
    res.status(404).json({ message: `Exercise with id ${id} not found` });
  } else if (docs.length > 1) {
    // More than one record has the same ID
    res.status(500).json({ message: `Multiple exercises found with id ${id}` });
  } else {
    targetUserExercisePlan = docs[0];
  }

  try {
    const userExercisePlan = {
      toDoDate: req.body.toDoDate || targetUserExercisePlan.toDoDate,
      userID: req.body.userID || targetUserExercisePlan.userID,
      exercises: req.body.exercises || targetUserExercisePlan.exercises
    };

    // Weight is a double
    userExercisePlan.exercises.forEach((exercise) => {
      exercise.weight = Double(exercise.weight);
    });

    const response = await mongodb
      .getDb()
      .db('Lift')
      .collection('userExercisePlan')
      .updateOne({ _id: targetUserExercisePlan._id }, { $set: userExercisePlan });
    if (!response.acknowledged) {
      res.status(500).json('Update request could not be completed at this time');
    }
    if (response.modifiedCount == 0) {
      res
        .status(400)
        .json(
          'No Modifications made. Key and/or value may be incorrect if modifications were expected'
        );
    }
    if (response.upsertedCount > 0) {
      /*
      #swagger.responses[500] = {
        schema: { $ref: '#/definitions/duplicateError' }
      } 
      */
      res.status(500).json('Data was unintentionally created');
    }
    if (response.modifiedCount > 0) {
      /*
      #swagger.responses[201] = {
        schema: { $ref: '#/definitions/createdResponse' }
      } 
      */
      res.status(201).json(`Update Success`);
    }
  } catch (err) {
    console.log(err.errInfo.details);
    res.status(500).json(err.errInfo.details || 'Something is not quite right');
  }
};

const deleteUserExercisePlan = async (req, res) => {
  const planID = parseInt(req.params.planID);
  if (isNaN(planID)) {
    // ID is not an int
    res.status(400).json({ message: `Invalid planID : provided id is not an integer` });
  }
  try {
    const response = await mongodb
      .getDb()
      .db('Lift')
      .collection('userExercisePlan')
      .deleteOne({ planID: planID });
    if (!response.acknowledged) {
      res.status(500).json('Update request could not be completed at this time');
    }
    if (response.deletedCount == 0) {
      res.status(400).json('No userExercisePlan matched for deletion.');
    }
    if (response.deletedCount > 0) {
      res.status(200).json(`userExercisePlan with id ${planID} deleted`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = {
  getAll,
  getSingle,
  createUserExercisePlan,
  updateUserExercisePlan,
  deleteUserExercisePlan
};
