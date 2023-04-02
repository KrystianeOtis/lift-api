# Lift - Fitness App
## About
Lift is a web-based fitness app that provides users with workout routines, exercise details, and allows them to set goals. This repository contains the backend code for Lift, including the API and routes that handle data retrieval and manipulation.

## Dependencies
The backend for Lift is built using Node.js and the following dependencies:
*MongoDB: NoSQL database
*Swagger: API documentation tool
*Render: Hosting and deployment platform
*Visual Studio Code: Integrated development environment

## API Endpoints
Lift has the following API endpoints:

* `GET /users`: Get all users.
* `POST /users`: Create a single user.
* `GET /users/{id}`: Get a single user.
* `PUT /users/{id}`: Update a user.
* `DELETE /users/{id}`: Removes a user.
* `GET /userExercisePlan`: Get all users excercise plan.
* `POST /userExercisePlan`: Creates a users excercise plan.
* `GET /userExercisePlan/{id}`: Get a users excercise plan by id.
* `GET /exercises`: Get all exercises.
* `POST /exercises`: Create a exercise.
* `GET /exercises/{id}`: Get a single exercise.

## API Documentation
You can find the Swagger API documentation for Lift's backend at the following URL:

* https://lift-api.onrender.com/api-docs/

The Swagger documentation provides detailed information on each API endpoint, including input and output parameters, example requests and responses, and error codes.

## Security
Security is a top priority for Lift's backend. 
User authentication and authorization are handled by Auth0, which provides a secure, scalable, and customizable solution for identity management.

For more information on how we use Auth0 with our backend technology stack, see the [Auth0 documentation](https://auth0.com/docs/get-started).

## Contributors
* Krystiane Otis
* Thomas Vargas
* Dallin Gilbert
* Eli Aiono

## License
This project is licensed under the MIT License. Visit the [MIT license page](https://choosealicense.com/licenses/mit/).
