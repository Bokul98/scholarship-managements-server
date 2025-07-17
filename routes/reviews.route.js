const express = require('express');
const { 
    getAllReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    getReviewsByUser,
    getReviewsByScholarshipId
} = require('../controllers/reviewController');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

// Get all reviews
router.get('/', verifyToken, getAllReviews);

// Get reviews by user email
router.get('/user', verifyToken, getReviewsByUser);

// Get reviews by scholarshipId (public)
router.get('/scholarship/:id', getReviewsByScholarshipId);

// Get review by id
router.get('/:id', verifyToken, getReviewById);

// Create a new review
router.post('/', verifyToken, createReview);

// Update review
router.patch('/:id', verifyToken, updateReview);

// Delete review
router.delete('/:id', verifyToken, deleteReview);

module.exports = router;