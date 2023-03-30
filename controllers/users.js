const mongodb = require('../db/connect');
var Double = require('mongodb').Double;

const getAll = (req, res) => {
  /* #swagger.tags = ['Users'] 
     #swagger.summary = 'Get all users'  
     #swagger.description = 'Return all users from the database'
    */
  mongodb
    .getDb()
    .db('Lift')
    .collection('users')
    .find()
    .toArray((err, lists) => {
      if (err) {
        /* #swagger.responses[400] = {
        schema: { $ref: '#/definitions/mongoError' }
        } */
        res.status(400).json({ message: err });
      }
      /* #swagger.responses[200] = {
        schema: { $ref: '#/definitions/User' }
        } */
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
};

/** Retrieve a single user */
const getSingle = (req, res) => {
  /* #swagger.tags = ['Users'] 
     #swagger.summary = 'Get a single user'  
     #swagger.description = 'Return a single user from the database by its userID'
     #swagger.parameters['userID'] = {
      description: 'The id of the user',
     }
  */
  const userID = parseInt(req.params.userID);
  mongodb
    .getDb()
    .db('Lift')
    .collection('users')
    .find({ userID: userID })
    .toArray(function (err, docs) {
      if (err) {
        // Mongo Error
        /* #swagger.responses[400] = {
        schema: { $ref: '#/definitions/notFoundError' }
      } */
        res.status(400).json({ message: err });
      } else if (isNaN(userID)) {
        // ID is not an int
        res.status(400).json({ message: `Invalid user ID : provided userID is not an integer` });
      } else if (docs.length === 0) {
        // No results found
        res.status(404).json({ message: `user with id ${userID} not found` });
      } else if (docs.length > 1) {
        // More than one record has the same ID
        res.status(500).json({ message: `Multiple users found with id ${userID}` });
      } else {
        /* #swagger.responses[200] = {
      schema: { $ref: '#/definitions/user' }
      } */
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(docs[0]);
      }
    });
};

const createUser = async (req, res) => {
  /* #swagger.tags = ['Users'] 
     #swagger.summary = 'Create a single user'  
     #swagger.description = 'Creates a single user in the database. This includes the email, first name, last name,
     weight, height and goals of the user.'
     #swagger.parameters['User'] = {
      in: 'body',
      description: 'The user to create.',
      required: true,
      schema: { $ref: '#/definitions/User' }
  } */
  try {
    const user = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      goals: req.body.goals,
      // Optional weight and height, default 0
      height: req.body.height ? Double(req.body.height) : Double(0),
      weight: req.body.weight ? Double(req.body.weight) : Double(0)
    };
    if (isNaN(user.weight) || isNaN(user.height)) {
      res.status(500).json('Error in converting weight or height to double');
    }
    const response = await mongodb.getDb().db('Lift').collection('users').insertOne(user);
    if (response.acknowledged) {
      /* #swagger.responses[201] = {
          schema: { $ref: '#/definitions/createdResponse' }
        } */
      res.status(201).json(response);
    } else {
      /*
        #swagger.responses[500] = {
          schema: { $ref: '#/definitions/duplicateError' }
        } 
      */
      res.status(500).json(response.error || 'Some error occurred while creating the player.');
    }
  } catch (err) {
    let outputErr = {};
    console.log(err);
    if (err.errInfo.details.schemaRulesNotSatisfied.length > 0) {
      err.errInfo.details.schemaRulesNotSatisfied.forEach((rule) => {
        rule.propertiesNotSatisfied.forEach((property) => {
          console.log(property.details);
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

const updateUser = async (req, res) => {
  /* #swagger.tags = ['Users'] 
     #swagger.summary = 'Update a single user'  
     #swagger.description = 'Updates a single user from the database by its userID'
     #swagger.parameters['userID'] = {
      description: 'The id of the user',
     }
  */
  const userID = parseInt(req.params.userID);
  if (isNaN(userID)) {
    res.status(400).json('Provided ID is not in integer format');
  }
  let targetUser = {};
  const docs = await mongodb
    .getDb()
    .db('Lift')
    .collection('users')
    .find({ userID: userID })
    .toArray();

  if (docs.length === 0) {
    // No results found
    res.status(404).json({ message: `user with id ${userID} not found` });
  } else if (docs.length > 1) {
    // More than one record has the same ID
    res.status(500).json({ message: `Multiple users found with id ${userID}` });
  } else {
    console.log(docs);
    targetUser = docs[0];
  }

  try {
    const user = {
      firstName: req.body.firstName || targetUser.firstName,
      lastName: req.body.lastName || targetUser.lastName,
      email: req.body.email || targetUser.email,
      weight: req.body.weight || targetUser.weight,
      height: req.body.height || targetUser.height,
      goals: req.body.goals || targetUser.goals
    };
    const response = await mongodb
      .getDb()
      .db('Lift')
      .collection('users')
      .updateOne({ _id: targetUser._id }, { $set: user });
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

const deleteUser = async (req, res) => {
  const userID = parseInt(req.params.userID);
  if (isNaN(userID)) {
    // ID is not an int
    res.status(400).json({ message: `Invalid user ID : provided id is not an integer` });
  }
  try {
    const response = await mongodb
      .getDb()
      .db('Lift')
      .collection('users')
      .deleteOne({ userID: userID });
    if (!response.acknowledged) {
      res.status(500).json('Update request could not be completed at this time');
    }
    if (response.deletedCount == 0) {
      res.status(400).json('No user matched for deletion.');
    }
    if (response.deletedCount > 0) {
      res.status(200).json(`user with id ${userID} deleted`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser
};
