require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const usersRouter = require('./routes/users');
const projectsRouter = require('./routes/projects');
const tasksRouter = require('./routes/tasks');
const authRouter = require('./routes/auth');

const app = express();

app.use(express.json());
app.use(logger);

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/projects', projectsRouter);
app.use('/tasks', tasksRouter);

app.get('/', (req, res) => res.json({ message: 'Team Task Management API - Final' }));

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
async function start(){
  try{
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync(); // don't force in normal run
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }catch(err){
    console.error('Failed to start', err);
    process.exit(1);
  }
}
if (process.env.NODE_ENV !== 'test') start();

module.exports = app;
