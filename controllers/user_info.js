const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

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

const getSingle = (req, res) => {
  /* #swagger.tags = ['Users'] 
     #swagger.summary = 'Get a single user'  
     #swagger.description = 'Return a single user from the database by id'
     #swagger.parameters['id'] = {
      description: 'The id of the user to update.',
      } */
  if (!ObjectId.isValid(req.params.id)) {
    /* #swagger.responses[400] = {
        schema: { $ref: '#/definitions/invalidIdError' }
      } */
    res.status(400).json('Must use a valid user id.');
  }
  const userID = new ObjectId(req.params.id);
  mongodb
    .getDb()
    .db('Lift')
    .collection('users')
    .find({ userID: userID })
    .toArray((err, result) => {
      if (err) {
        /* #swagger.responses[400] = {
        schema: { $ref: '#/definitions/mongoError' }
        } */
        res.status(400).json({ message: err });
      }
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(result[0]);
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
  const user = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    weight: req.body.weight,
    height: req.body.height,
    goals: req.body.goals
  };
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
};

const updateUser = async (req, res) => {
  /* #swagger.tags = ['Users'] 
     #swagger.summary = 'Update a user'  
     #swagger.description = 'Update a user in the database.'
     #swagger.parameters['id'] = {
      in: 'body',
      description: 'The id of the user to update.',
      required: true,
      schema: { $ref: '#/definitions/User' }
     }
    */
  const userId = new ObjectId(req.params.id);
  // be aware of updateOne if you only want to update specific fields
  const user = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    weight: req.body.weight,
    height: req.body.height,
    goals: req.body.goals
  };
  const response = await mongodb
    .getDb()
    .db('Lift')
    .collection('users')
    .replaceOne({ _id: userId }, user);
  console.log(response);
  if (response.modifiedCount > 0) {
    /* #swagger.responses[204] = {
        schema: { $ref: '#/definitions/createdResponse' }
      } */
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while updating the user.');
  }
};

const deleteUser = async (req, res) => {
  /* #swagger.tags = ['Users'] 
     #swagger.summary = 'Removes a user'  
     #swagger.description = 'Remove a user from the database.'
     #swagger.parameters['id'] = {
      description: 'The id of the user to remove.'
     }
    */
  if (!ObjectId.isValid(req.params.id)) {
    res.status(400).json('Must use a valid contact id to delete a user.');
  }
  const userId = new ObjectId(req.params.id);
  const response = await mongodb
    .getDb()
    .db('Lift')
    .collection('users')
    .remove({ _id: userId }, true);
  console.log(response);
  if (response.deletedCount > 0) {
    /* #swagger.responses[204] = {
        schema: { $ref: '#/definitions/deletedResponse' }
      } */
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occurred while deleting the user.');
  }
};

module.exports = {
  getAll,
  getSingle,
  createUser,
  updateUser,
  deleteUser
};
