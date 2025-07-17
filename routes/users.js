const express = require('express');
const router = express.Router();

// Import middlewares
const verifyJWT = require('../middlewares/verifyJWT');
const verifyRole = require('../middlewares/verifyRole');

// Import controller
const { 
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    changeUserRole
} = require('../controllers/userController');

// Routes
router.use(verifyJWT); // Protect all routes

// Get all users (admin only)
router.get('/', verifyRole('admin'), getAllUsers);

// Get user by id
router.get('/:id', getUserById);

// Update user
router.patch('/:id', updateUser);

// Delete user (admin only)
router.delete('/:id', verifyRole('admin'), deleteUser);

// Change user role (admin only)
router.patch('/role/:id', verifyRole('admin'), changeUserRole);

module.exports = router; 