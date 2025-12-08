const express = require('express');
const router = express.Router();
const { Task, Project, User } = require('../models');

// GET tasks (optional query: userId, projectId)
router.get('/', async (req, res, next) => {
  try {
    const where = {};
    if (req.query.userId) where.assignedUserId = req.query.userId;
    if (req.query.projectId) where.projectId = req.query.projectId;
    const tasks = await Task.findAll({ where, include: [{ model: Project, as: 'project' }, { model: User, as: 'assignee' }]});
    res.json(tasks);
  } catch (err) { next(err); }
});

// GET by id
router.get('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id, { include: [{ model: Project, as: 'project' }, { model: User, as: 'assignee' }]});
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) { next(err); }
});

// POST create task
router.post('/', async (req, res, next) => {
  try {
    const { taskName, description, status, assignedUserId, projectId } = req.body;
    if (!taskName || !projectId) return res.status(400).json({ error: 'taskName and projectId required' });
    // basic check: project exists
    const project = await Project.findByPk(projectId);
    if (!project) return res.status(400).json({ error: 'projectId invalid' });
    const task = await Task.create({ taskName, description, status: status || 'todo', assignedUserId: assignedUserId || null, projectId });
    res.status(201).json(task);
  } catch (err) { next(err); }
});

// PUT update task
router.put('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    const { taskName, description, status, assignedUserId } = req.body;
    await task.update({
      taskName: taskName ?? task.taskName,
      description: description ?? task.description,
      status: status ?? task.status,
      assignedUserId: assignedUserId ?? task.assignedUserId
    });
    res.json(task);
  } catch (err) { next(err); }
});

// DELETE task
router.delete('/:id', async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
