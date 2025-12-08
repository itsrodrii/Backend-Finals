require('./setupTestDb');
const request = require('supertest');
const app = require('../index');
const { sequelize, User, Project, Task } = require('../models');

beforeAll(async () => { await sequelize.sync({ force: true }); });
afterAll(async () => { await sequelize.close(); });

describe('Tasks API', () => {
  test('create task and update status', async () => {
    const user = await User.create({ name: 'Assign', email: 'assign@example.com' });
    const project = await Project.create({ projectName: 'P', createdByUserId: user.id });
    const res = await request(app).post('/tasks').send({ taskName: 'Do thing', projectId: project.id, assignedUserId: user.id });
    expect(res.statusCode).toBe(201);
    const update = await request(app).put(`/tasks/${res.body.id}`).send({ status: 'in-progress' });
    expect(update.statusCode).toBe(200);
    expect(update.body.status).toBe('in-progress');
  });
});
