require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const usersRouter = require('./routes/users');
const projectsRouter = require('./routes/projects');
const tasksRouter = require('./routes/tasks');

const app = express();

app.use(express.json());
app.use(logger);

app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/tasks', tasksRouter);

app.get('/', (req, res) => res.json({ message: 'Team Task Management API - MVP' }));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
async function start(){
  await sequelize.authenticate();
  console.log('Database connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
if (process.env.NODE_ENV !== 'test') start();

module.exports = app;
