require('./setupTestDb');
const request = require('supertest');
const app = require('../index');
const { sequelize, User } = require('../models');

beforeAll(async () => { await sequelize.sync({ force: true }); });
afterAll(async () => { await sequelize.close(); });

describe('Users API', () => {
  test('creates a user', async () => {
    const res = await request(app).post('/users').send({ name: 'Test', email: 'test@example.com' });
    expect(res.statusCode).toBe(201);
    expect(res.body.email).toBe('test@example.com');
  });

  test('gets a user', async () => {
    const user = await User.create({ name: 'Sam', email: 'sam@example.com' });
    const res = await request(app).get(`/users/${user.id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe('Sam');
  });

  test('returns 404 for missing user', async () => {
    const res = await request(app).get('/users/9999');
    expect(res.statusCode).toBe(404);
  });
});
