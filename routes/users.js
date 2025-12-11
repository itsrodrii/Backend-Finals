const express = require('express');
const router = express.Router();
const { User } = require('../models');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// GET all users (admin only)
router.get('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const users = await User.findAll({ attributes: ['id','name','email','role','createdAt','updatedAt'] });
    res.json(users);
  } catch (err) { next(err); }
});

// GET user by id (admin or self)
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id,10);
    if (req.user.role !== 'admin' && req.user.id !== id) return res.status(403).json({ error: 'Forbidden' });
    const user = await User.findByPk(id, { attributes: ['id','name','email','role','createdAt','updatedAt'] });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { next(err); }
});

// POST create user (admin only)
router.post('/', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email required' });
    const user = await User.create({ name, email, role: role || 'user' });
    res.status(201).json(user);
  } catch (err) { next(err); }
});

// PUT update user (admin or self, can't change role unless admin)
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const id = parseInt(req.params.id,10);
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (req.user.role !== 'admin' && req.user.id !== id) return res.status(403).json({ error: 'Forbidden' });
    const { name, email, role } = req.body;
    if (role && req.user.role !== 'admin') return res.status(403).json({ error: 'Only admin can change roles' });
    await user.update({ name: name ?? user.name, email: email ?? user.email, role: role ?? user.role });
    res.json(user);
  } catch (err) { next(err); }
});

// DELETE user (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
