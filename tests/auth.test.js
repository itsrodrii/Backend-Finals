require('./setupTestDb');
const request = require('supertest');
const app = require('../index');
const { sequelize } = require('../models');

beforeAll(async () => { await sequelize.sync({ force: true }); });
afterAll(async () => { await sequelize.close(); });

describe('Auth', () => {
  test('register and login', async () => {
    const reg = await request(app).post('/auth/register').send({ name: 'T', email: 't@example.com', password: 'pass123' });
    expect(reg.statusCode).toBe(201);
    expect(reg.body.token).toBeDefined();

    const login = await request(app).post('/auth/login').send({ email: 't@example.com', password: 'pass123' });
    expect(login.statusCode).toBe(200);
    expect(login.body.token).toBeDefined();
  });

  test('invalid login', async () => {
    const res = await request(app).post('/auth/login').send({ email: 'nope@example.com', password: 'wrong' });
    expect(res.statusCode).toBe(401);
  });
});
