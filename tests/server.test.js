const request = require('supertest');
const server = require('../server');

describe('Test the root path', () => {
  test('It should respond to the GET method with a JSON object', async () => {
    const response = await request(server).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe('application/json');
    expect(response.body).toEqual({ message: 'Hello, World!' });
  });
});
