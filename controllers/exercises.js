const mongodb = require('../db/connect');

/** Retrieves all exercises */
const getAll = (req, res) => {
  /* #swagger.tags = ['Exercises'] 
     #swagger.summary = 'Get all exercises'  
     #swagger.description = 'Return all exercises from the database'
    */
  mongodb
    .getDb()
    .db('Lift')
    .collection('exercises')
    .find()
    .toArray((err, lists) => {
      if (err) {
        /* #swagger.responses[400] = {
        schema: { $ref: '#/definitions/notFoundError' }
      } */
        res.status(400).json({ message: err });
      }
      /* #swagger.responses[200] = {
        schema: { $ref: '#/definitions/Exercise' }
      } */
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists);
    });
};

/** Retrieve a single exercise */
const getSingle = (req, res) => {
  /* #swagger.tags = ['Exercises'] 
     #swagger.summary = 'Get a single exercise'  
     #swagger.description = 'Return a single exercise from the database by its id'
     #swagger.parameters['id'] = {
      description: 'The id of the exercise',
     }
  */
  const id = parseInt(req.params.id);
  mongodb
    .getDb()
    .db('Lift')
    .collection('exercises')
    .find({ id: id })
    .toArray(function (err, docs) {
      if (err) { // Mongo Error
        /* #swagger.responses[400] = {
        schema: { $ref: '#/definitions/notFoundError' }
      } */
        res.status(400).json({ message: err });
      } else if (isNaN(id)) { // ID is not an int
        res.status(400).json({ message: `Invalid Exercise ID : provided id is not an integer` });
      } else if (docs.length === 0) { // No results found
        res.status(404).json({ message: `Exercise with id ${id} not found` });
      } else if (docs.length > 1) { // More than one record has the same ID
        res.status(500).json({ message: `Multiple exercises found with id ${id}` });
      } else {
      /* #swagger.responses[200] = {
      schema: { $ref: '#/definitions/Exercise' }
      } */
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(docs[0]);
      }
    });
};

/** Creates a new exercise */
const createExercise = async (req, res) => {
  /* #swagger.tags = ['Exercises']  
     #swagger.summary = 'Create an exercise'   
     #swagger.description = 'Creates an exercise and adds it to the database, this will include the name, description,
     category and id of the exercise.' 
     #swagger.parameters['Exercise'] = {
        in: 'body',
        description: 'Required information to add an exercise',
        schema: { $ref: '#/definitions/Exercise' } 
     }
  */
 try {
  const exercise = {
    name: req.body.name,
    description: req.body.description,
    image: req.body.image, //BASE 64
    categories: req.body.categories
  };
  const response = await mongodb.getDb().db('Lift').collection('exercises').insertOne(exercise);
  if (response.acknowledged) {
    /*
      #swagger.responses[201] = {
        schema: { $ref: '#/definitions/createdResponse' }
      } 
    */
    res.status(201).json(response);
  } else {
    /*
      #swagger.responses[500] = {
        schema: { $ref: '#/definitions/duplicateError' }
      } 
    */
   console.log(response);
    res.status(500).json(response.error || 'Some error occurred while creating the exercise.');
  }
} catch (err) {
  let outputErr = {}
  // If there was a syntax error in the req body
  if (err.errInfo.details.schemaRulesNotSatisfied.length > 0) {
    err.errInfo.details.schemaRulesNotSatisfied.forEach((rule) => {
      rule.propertiesNotSatisfied.forEach((property) => {
        // console.log(property.details[0].specifiedAs);
        outputErr[
          property.propertyName
        ] = `${property.propertyName} ${property.details[0].reason} type ${property.details[0].specifiedAs.bsonType} or is missing`;
      });
    // Send 400 and the reason
    res.status(400).json(outputErr)
    });
  }
  else {
    console.log(err.errInfo.details);
    res.status(500).json(err.errInfo.details || "Something is not quite right")
}
}
};
/** Retrieve a single exercise */
const updateExercise = async (req, res) => {
  /* #swagger.tags = ['Exercises'] 
     #swagger.summary = 'Update a single exercise'  
     #swagger.description = 'Updates a single exercise from the database by its id'
     #swagger.parameters['id'] = {
      description: 'The id of the exercise',
     }
  */
  const id = parseInt(req.params.id);
  try {
    const result = await mongodb.getDb().db('Lift').collection('exercises').find({ id: id });
    console.log(result);
  } catch (err) {
    console.log(err);
  }
  // try {
  //   const collection = mongodb.getDb().db('Lift').collection('exercises');
  //   const filter = { id: id };
  //   const bodyKeys = Object.keys(req.body);
  //   const updateDoc = {}
  //   for (const key of bodyKeys) {
  //     updateDoc[key] = req.body[key];
  //   }
  //   const result = await collection.findOneAndUpdate(filter, { $set: updateDoc }, { returnOriginal: false, upsert: false });
  //   if (!result.value) {
  //     // if no document was found with the given filter, return a 404 Not Found error
  //     return res.status(404).send('Exercise not found');
  //   }
  //   // return the result
  //   return res.send(result);
  // } catch(err) {
  //   // handle any other errors with a 500 Internal Server Error
  //   console.error(err);
  //   return res.status(500).send('Internal Server Error');
  // }


  // mongodb
  //   .getDb()
  //   .db('Lift')
  //   .collection('exercises')
  //   .findOne({ id: id })
  //   .toArray(function (err, docs) {
  //     if (err) { // Mongo Error
  //       /* #swagger.responses[400] = {
  //       schema: { $ref: '#/definitions/notFoundError' }
  //     } */
  //       res.status(400).json({ message: err });
  //     } else if (isNaN(id)) { // ID is not an int
  //       res.status(400).json({ message: `Invalid Exercise ID : provided id is not an integer` });
  //     } else if (docs.length === 0) { // No results found
  //       res.status(404).json({ message: `Exercise with id ${id} not found` });
  //     } else if (docs.length > 1) { // More than one record has the same ID
  //       res.status(500).json({ message: `Multiple exercises found with id ${id}` });
  //     } else {
  //     /* #swagger.responses[200] = {
  //     schema: { $ref: '#/definitions/Exercise' }
  //     } */
  //       res.setHeader('Content-Type', 'application/json');
  //       res.status(200).json(docs[0]);
  //     }
  //   });
  // } finally {
  //   console.log();
  // }
};

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
  updateExercise,
  // deletePlayer
};