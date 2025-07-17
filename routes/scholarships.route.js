const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const {
    getAllScholarships,
    getScholarshipById,
    createScholarship,
    updateScholarship,
    deleteScholarship
} = require('../controllers/scholarshipController');

// Public routes
router.get('/', getAllScholarships);
router.get('/:id', getScholarshipById);

// Protected routes - require authentication
router.post('/', verifyToken, createScholarship);
router.patch('/:id', verifyToken, updateScholarship);
router.delete('/:id', verifyToken, deleteScholarship);

module.exports = router; 