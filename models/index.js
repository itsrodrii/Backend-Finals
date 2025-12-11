const { Sequelize } = require('sequelize');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const defaultUrl = 'sqlite:' + path.join(__dirname, '..', 'database', 'database.sqlite');
const databaseUrl = process.env.DATABASE_URL || defaultUrl;

const sequelize = new Sequelize(databaseUrl, {
  logging: false,
});

const User = require('./user')(sequelize);
const Project = require('./project')(sequelize);
const Task = require('./task')(sequelize);

// Relationships
User.hasMany(Project, { foreignKey: 'createdByUserId', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'createdByUserId', as: 'creator' });

Project.hasMany(Task, { foreignKey: 'projectId', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

User.hasMany(Task, { foreignKey: 'assignedUserId', as: 'tasksAssigned' });
Task.belongsTo(User, { foreignKey: 'assignedUserId', as: 'assignee' });

module.exports = {
  sequelize,
  User,
  Project,
  Task
};
