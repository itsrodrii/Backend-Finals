const express = require('express');
const router = express.Router();
const { Project, Task, User } = require('../models');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const where = {};
    if (req.query.userId) where.createdByUserId = req.query.userId;
    else if (req.user.role !== 'admin') where.createdByUserId = req.user.id;
    const projects = await Project.findAll({ where, include: [{ model: Task, as: 'tasks' }, { model: User, as: 'creator' }]});
    res.json(projects);
  } catch (err) { next(err); }
});


router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id, { include: [{ model: Task, as: 'tasks' }]});
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (req.user.role !== 'admin' && project.createdByUserId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    res.json(project);
  } catch (err) { next(err); }
});

// POST create project (authenticated users)
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { projectName, description } = req.body;
    if (!projectName) return res.status(400).json({ error: 'projectName required' });
    const project = await Project.create({ projectName, description, createdByUserId: req.user.id });
    res.status(201).json(project);
  } catch (err) { next(err); }
});


router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (req.user.role !== 'admin' && project.createdByUserId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
    const { projectName, description } = req.body;
    await project.update({ projectName: projectName ?? project.projectName, description: description ?? project.description });
    res.json(project);
  } catch (err) { next(err); }
});


router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    await project.destroy();
    res.json({ message: 'Project deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
