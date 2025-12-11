require('./setupTestDb');
const request = require('supertest');
const app = require('../index');
const { sequelize } = require('../models');

beforeAll(async () => { await sequelize.sync({ force: true }); });
afterAll(async () => { await sequelize.close(); });

describe('Users API', () => {
  test('creates a user via register', async () => {
    const res = await request(app).post('/auth/register').send({ name: 'Test', email: 'test@example.com', password: 'pass' });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe('test@example.com');
  });
});
