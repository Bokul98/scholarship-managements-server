const express = require('express');
const router = express.Router();
const { getCurrentUser, createUser, updateUser } = require('../controllers/users.controller');
const verifyToken = require('../middlewares/verifyToken');

// Public routes for user management
router.post('/', createUser);
router.put('/:email', updateUser);

// Protected routes
router.get('/me', verifyToken, getCurrentUser);

module.exports = router; 