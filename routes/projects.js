const express = require('express');
const router = express.Router();
const { Project, Task, User } = require('../models');

// GET all projects (optionally filter by userId via query ?userId=)
router.get('/', async (req, res, next) => {
  try {
    const where = {};
    if (req.query.userId) where.createdByUserId = req.query.userId;
    const projects = await Project.findAll({ where, include: [{ model: Task, as: 'tasks' }, { model: User, as: 'creator' }]});
    res.json(projects);
  } catch (err) { next(err); }
});

// GET project by id
router.get('/:id', async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id, { include: [{ model: Task, as: 'tasks' }]});
    if (!project) return res.status(404).json({ error: 'Project not found' });
    res.json(project);
  } catch (err) { next(err); }
});

// POST create project
router.post('/', async (req, res, next) => {
  try {
    const { projectName, description, createdByUserId } = req.body;
    if (!projectName || !createdByUserId) return res.status(400).json({ error: 'projectName and createdByUserId required' });
    const project = await Project.create({ projectName, description, createdByUserId });
    res.status(201).json(project);
  } catch (err) { next(err); }
});

// PUT update project
router.put('/:id', async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    const { projectName, description } = req.body;
    await project.update({ projectName: projectName ?? project.projectName, description: description ?? project.description });
    res.json(project);
  } catch (err) { next(err); }
});

// DELETE project
router.delete('/:id', async (req, res, next) => {
  try {
    const project = await Project.findByPk(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    await project.destroy();
    res.json({ message: 'Project deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
