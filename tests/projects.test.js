require('./setupTestDb');
const request = require('supertest');
const app = require('../index');
const { sequelize, User, Project } = require('../models');

beforeAll(async () => { await sequelize.sync({ force: true }); });
afterAll(async () => { await sequelize.close(); });

describe('Projects API', () => {
  test('create and fetch project', async () => {
    const user = await User.create({ name: 'Owner', email: 'owner@example.com' });
    const res = await request(app).post('/projects').send({ projectName: 'Proj A', description: 'desc', createdByUserId: user.id });
    expect(res.statusCode).toBe(201);
    const projRes = await request(app).get(`/projects/${res.body.id}`);
    expect(projRes.statusCode).toBe(200);
    expect(projRes.body.projectName).toBe('Proj A');
  });
});
