const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Lift API',
    description: 'An API designed to help manage exercises and build workouts.'
  },
  definitions: {
    Exercise: {
      _id: '641a4266a3524c7fb2f0ba35',
      name: 'Decline Barbell Bench Press',
      description: 'A decline barbell bench press.',
      image: 'test',
      categories: 'Chest',
      id: 1
    },
    User: {
      email: 'kenaa@example.com',
      firstName: 'John',
      lastName: 'Doe',
      weight: 100,
      height: 150,
      goals: 'any'
    },
    createdResponse: {
      acknowledged: true,
      insertedId: '63d06d25ac5027cccc3c5eb6'
    },
    deletedResponse: {
      acknowledged: true,
      deletedCount: 1
    },
    mongoError: {
      message: 'Mongo error'
    },
    invalidIdError: {
      message: 'Invalid Exercise ID: provided ID is not an integer'
    },
    notFoundError: {
      message: 'Exercise with id ${id} not found'
    },
    duplicateError: {
      message: 'Exercise with id already exists'
    }
  },
  host: 'lift-api.onrender.com',
  schemes: ['https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);

// Run server after it gets generated
// swaggerAutogen(outputFile, endpointsFiles, doc).then(async () => {
//   await import('./index.js');
// });
