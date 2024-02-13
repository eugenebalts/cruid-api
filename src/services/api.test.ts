import supertest from 'supertest';
import Api from './api';

const api = new Api();
const request = supertest(api.server);

describe('Api endpoints', () => {
  test('GET /users - should return all users', async () => {
    const response = await request.get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test('POST /users/:userId - should create a new users', async () => {
    const newUser = { username: 'Eugene', age: 22, hobbies: ['Music'] };

    const response = await request.post('/users').send(newUser);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe(newUser.username);
    expect(response.body.hobbies.length).toBe(newUser.hobbies.length);
  });
  test('GET /users/:userId - should return 400 error - invalid id format', async () => {
    const response = await request.get('/users/hahahahahhahah');

    expect(response.status).toBe(400);
  });
});
