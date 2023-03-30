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
    .find({ exerciseID: id })
    .toArray(function (err, docs) {
      if (err) {
        // Mongo Error
        /* #swagger.responses[400] = {
        schema: { $ref: '#/definitions/notFoundError' }
      } */
        res.status(400).json({ message: err });
      } else if (isNaN(id)) {
        // ID is not an int
        res.status(400).json({ message: `Invalid Exercise ID : provided id is not an integer` });
      } else if (docs.length === 0) {
        // No results found
        res.status(404).json({ message: `Exercise with id ${id} not found` });
      } else if (docs.length > 1) {
        // More than one record has the same ID
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

/** Retrieves exercises by category */
const getByCategory = (req, res) => {
  /* #swagger.tags = ['Exercises'] 
     #swagger.summary = 'Get exercises by category'  
     #swagger.description = 'Return all exercise from the database that have a provided category'
     #swagger.parameters['category'] = {
      description: 'The category of the exercise',
     }
  */
  const category = String(req.params.category);
  console.log(category);
  mongodb
    .getDb()
    .db('Lift')
    .collection('exercises')
    .find({ categories: { $elemMatch: { $eq: category } } })
    .toArray(function (err, docs) {
      if (err) {
        /* #swagger.responses[400] = {
        schema: { $ref: '#/definitions/notFoundError' }
      } */
        res.status(400).json({ message: err });
      } else if (docs.length === 0) {
        // No results found
        res
          .status(404)
          .json({ message: `Exercise with category ${category} not found (CaSe SensITiVe)` });
      } else {
        /* #swagger.responses[200] = {
      schema: { $ref: '#/definitions/Exercise' }
      } */
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(docs);
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
    let outputErr = {};
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
        res.status(400).json(outputErr);
      });
    } else {
      console.log(err.errInfo.details);
      res.status(500).json(err.errInfo.details || 'Something is not quite right');
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
  if (isNaN(id)) {
    res.status(400).json('Provided ID is not in integer format');
  }
  let targetExercise = {};
  const docs = await mongodb
    .getDb()
    .db('Lift')
    .collection('exercises')
    .find({ exerciseID: id })
    .toArray();

  if (docs.length === 0) {
    // No results found
    res.status(404).json({ message: `Exercise with id ${id} not found` });
  } else if (docs.length > 1) {
    // More than one record has the same ID
    res.status(500).json({ message: `Multiple exercises found with id ${id}` });
  } else {
    targetExercise = docs[0];
  }

  try {
    const exercise = {
      name: req.body.name || targetExercise.name,
      description: req.body.description || targetExercise.description,
      image: req.body.image || targetExercise.image,
      categories: req.body.categories || targetExercise.categories
    };
    const response = await mongodb
      .getDb()
      .db('Lift')
      .collection('exercises')
      .updateOne({ _id: targetExercise._id }, { $set: exercise });
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

const deleteExercise = async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    // ID is not an int
    res.status(400).json({ message: `Invalid Exercise ID : provided id is not an integer` });
  }
  try {
    const response = await mongodb
      .getDb()
      .db('Lift')
      .collection('exercises')
      .deleteOne({ exerciseID: id });
    if (!response.acknowledged) {
      res.status(500).json('Update request could not be completed at this time');
    }
    if (response.deletedCount == 0) {
      res.status(400).json('No exercise matched for deletion.');
    }
    if (response.deletedCount > 0) {
      res.status(200).json(`Exercise with id ${id} deleted`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

module.exports = {
  getAll,
  getSingle,
  getByCategory,
  createExercise,
  updateExercise,
  deleteExercise
};
