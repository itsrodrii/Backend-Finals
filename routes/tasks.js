const express = require('express');
const router = express.Router();
const { Task, Project, User } = require('../models');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// GET tasks (optional query: userId, projectId, status, pagination)
router.get('/', authenticate, async (req, res, next) => {
  try {
    const where = {};
    if (req.query.userId) where.assignedUserId = req.query.userId;
    if (req.query.projectId) where.projectId = req.query.projectId;
    if (req.query.status) where.status = req.query.status;

    const page = Math.max(1, parseInt(req.query.page || '1'));
    const limit = Math.min(100, parseInt(req.query.limit || '10'));
    const offset = (page - 1) * limit;

    const { rows, count } = await Task.findAndCountAll({ where, limit, offset, include: [{ model: Project, as: 'project' }, { model: User, as: 'assignee' }]});
    res.json({ data: rows, meta: { total: count, page, limit } });
  } catch (err) { next(err); }
});

// GET by id
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id, { include: [{ model: Project, as: 'project' }, { model: User, as: 'assignee' }]});
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (req.user.role !== 'admin' && task.assignedUserId !== req.user.id && task.projectId) {
      // allow project owner to view tasks too
      const project = await Project.findByPk(task.projectId);
      if (project.createdByUserId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    }
    res.json(task);
  } catch (err) { next(err); }
});

// POST create task (admin or project owner)
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { taskName, description, status, assignedUserId, projectId } = req.body;
    if (!taskName || !projectId) return res.status(400).json({ error: 'taskName and projectId required' });
    const project = await Project.findByPk(projectId);
    if (!project) return res.status(400).json({ error: 'projectId invalid' });
    if (req.user.role !== 'admin' && project.createdByUserId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden - cannot add task to project you do not own' });
    }
    const task = await Task.create({ taskName, description, status: status || 'todo', assignedUserId: assignedUserId || null, projectId });
    res.status(201).json(task);
  } catch (err) { next(err); }
});

// PUT update task (admin or assigned user)
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (req.user.role !== 'admin' && task.assignedUserId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
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

// DELETE task (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
