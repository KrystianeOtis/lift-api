const mongodb = require('../db/connect');

// /** Retrieves all userExercisePlans */
// const getAll = (req, res) => {
//   /* #swagger.tags = ['userExercisePlans']
//      #swagger.summary = 'Get all userExercisePlans'
//      #swagger.description = 'Return all userExercisePlans for a user from the database'
//     */
//   const userID = parseInt(req.params.userID);
//   mongodb
//     .getDb()
//     .db('Lift')
//     .collection('userExercisePlans')
//     .find()
//     .toArray((userID, userID) => {
//       if (err) {
//         /* #swagger.responses[400] = {
//         schema: { $ref: '#/definitions/notFoundError' }
//       } */
//         res.status(400).json({ message: err });
//       }
//       /* #swagger.responses[200] = {
//         schema: { $ref: '#/definitions/userExercisePlan' }
//       } */
//       res.setHeader('Content-Type', 'application/json');
//       res.status(200).json(lists);
//     });
// };

// /** Retrieve a single userExercisePlan */
// const getSingle = (req, res) => {
//   /* #swagger.tags = ['userExercisePlans']
//      #swagger.summary = 'Get a single userExercisePlan'
//      #swagger.description = 'Return a single userExercisePlan from the database by its id'
//      #swagger.parameters['id'] = {
//       description: 'The id of the userExercisePlan',
//      }
//   */
//   const id = parseInt(req.params.id);
//   mongodb
//     .getDb()
//     .db('Lift')
//     .collection('userExercisePlans')
//     .find({ userExercisePlanID: id })
//     .toArray(function (err, docs) {
//       if (err) {
//         // Mongo Error
//         /* #swagger.responses[400] = {
//         schema: { $ref: '#/definitions/notFoundError' }
//       } */
//         res.status(400).json({ message: err });
//       } else if (isNaN(id)) {
//         // ID is not an int
//         res
//           .status(400)
//           .json({ message: `Invalid userExercisePlan ID : provided id is not an integer` });
//       } else if (docs.length === 0) {
//         // No results found
//         res.status(404).json({ message: `userExercisePlan with id ${id} not found` });
//       } else if (docs.length > 1) {
//         // More than one record has the same ID
//         res.status(500).json({ message: `Multiple userExercisePlans found with id ${id}` });
//       } else {
//         /* #swagger.responses[200] = {
//       schema: { $ref: '#/definitions/userExercisePlan' }
//       } */
//         res.setHeader('Content-Type', 'application/json');
//         res.status(200).json(docs[0]);
//       }
//     });
// };

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
  try {
    let exercises = [];
    req.body.exercises.foreach((exercise) => {
      console.log(exercise);
      // exercises.push({exerciseID : exercise[])
    });
    // const userExercisePlan = {
    //   user: userID,
    //   toDoDate: req.body.toDoDate,
    //   exercises: {}
    // };
    // const response = await mongodb
    //   .getDb()
    //   .db('Lift')
    //   .collection('userExercisePlans')
    //   .insertOne(userExercisePlan);
    // if (response.acknowledged) {
    //   /*
    //   #swagger.responses[201] = {
    //     schema: { $ref: '#/definitions/createdResponse' }
    //   }
    // */
    //   res.status(201).json(response);
    // } else {
    //   /*
    //   #swagger.responses[500] = {
    //     schema: { $ref: '#/definitions/duplicateError' }
    //   }
    // */
    //   console.log(response);
    //   res
    //     .status(500)
    //     .json(response.error || 'Some error occurred while creating the userExercisePlan.');
    // };
  } catch (err) {
    // let outputErr = {};
    // // If there was a syntax error in the req body
    // if (err.errInfo.details.schemaRulesNotSatisfied.length > 0) {
    //   err.errInfo.details.schemaRulesNotSatisfied.forEach((rule) => {
    //     rule.propertiesNotSatisfied.forEach((property) => {
    //       // console.log(property.details[0].specifiedAs);
    //       outputErr[
    //         property.propertyName
    //       ] = `${property.propertyName} ${property.details[0].reason} type ${property.details[0].specifiedAs.bsonType} or is missing`;
    //     });
    //     // Send 400 and the reason
    //     res.status(400).json(outputErr);
    //   });
    // } else {
    //   console.log(err.errInfo.details);
    //   res.status(500).json(err.errInfo.details || 'Something is not quite right');
    // }
  }
  console.log('lol');
};

// /** Retrieve a single userExercisePlan */
// const updateuserExercisePlan = async (req, res) => {
//   /* #swagger.tags = ['userExercisePlans']
//      #swagger.summary = 'Update a single userExercisePlan'
//      #swagger.description = 'Updates a single userExercisePlan from the database by its id'
//      #swagger.parameters['id'] = {
//       description: 'The id of the userExercisePlan',
//      }
//   */
//   const id = parseInt(req.params.id);
//   if (isNaN(id)) {
//     res.status(400).json('Provided ID is not in integer format');
//   }
//   let targetuserExercisePlan = {};
//   const docs = await mongodb
//     .getDb()
//     .db('Lift')
//     .collection('userExercisePlans')
//     .find({ userExercisePlanID: id })
//     .toArray();

//   if (docs.length === 0) {
//     // No results found
//     res.status(404).json({ message: `userExercisePlan with id ${id} not found` });
//   } else if (docs.length > 1) {
//     // More than one record has the same ID
//     res.status(500).json({ message: `Multiple userExercisePlans found with id ${id}` });
//   } else {
//     targetuserExercisePlan = docs[0];
//   }

//   try {
//     const userExercisePlan = {
//       name: req.body.name || targetuserExercisePlan.name,
//       description: req.body.description || targetuserExercisePlan.description,
//       image: req.body.image || targetuserExercisePlan.image,
//       categories: req.body.categories || targetuserExercisePlan.categories
//     };
//     const response = await mongodb
//       .getDb()
//       .db('Lift')
//       .collection('userExercisePlans')
//       .updateOne({ _id: targetuserExercisePlan._id }, { $set: userExercisePlan });
//     if (!response.acknowledged) {
//       res.status(500).json('Update request could not be completed at this time');
//     }
//     if (response.modifiedCount == 0) {
//       res
//         .status(400)
//         .json(
//           'No Modifications made. Key and/or value may be incorrect if modifications were expected'
//         );
//     }
//     if (response.upsertedCount > 0) {
//       /*
//       #swagger.responses[500] = {
//         schema: { $ref: '#/definitions/duplicateError' }
//       }
//       */
//       res.status(500).json('Data was unintentionally created');
//     }
//     if (response.modifiedCount > 0) {
//       /*
//       #swagger.responses[201] = {
//         schema: { $ref: '#/definitions/createdResponse' }
//       }
//       */
//       res.status(201).json(`Update Success`);
//     }
//   } catch (err) {
//     let outputErr = {};
//     console.log(err.errInfo.details);
//     res.status(500).json(err.errInfo.details || 'Something is not quite right');
//   }
// };

// const deleteuserExercisePlan = async (req, res) => {
//   const id = parseInt(req.params.id);
//   if (isNaN(id)) {
//     // ID is not an int
//     res
//       .status(400)
//       .json({ message: `Invalid userExercisePlan ID : provided id is not an integer` });
//   }
//   try {
//     const response = await mongodb
//       .getDb()
//       .db('Lift')
//       .collection('userExercisePlans')
//       .deleteOne({ userExercisePlanID: id });
//     if (!response.acknowledged) {
//       res.status(500).json('Update request could not be completed at this time');
//     }
//     if (response.deletedCount == 0) {
//       res.status(400).json('No userExercisePlan matched for deletion.');
//     }
//     if (response.deletedCount > 0) {
//       res.status(200).json(`userExercisePlan with id ${id} deleted`);
//     }
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// };

module.exports = {
  // getAll,
  // getSingle,
  createUserExercisePlan
  // updateUserExercisePlan,
  // deleteUserExercisePlan
};
