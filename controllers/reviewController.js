const Review = require('../models/Review');
const Application = require('../models/Application');

// Get all reviews
const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ reviewDate: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews'
        });
    }
};

// Get review by id
const getReviewById = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id);
        
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.status(200).json(review);
    } catch (error) {
        console.error('Error fetching review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch review'
        });
    }
};

// Create a new review
const createReview = async (req, res) => {
    try {
        let {
            userId,
            scholarshipId,
            scholarshipName,
            universityId,
            universityName,
            rating,
            comment,
            reviewDate,
            userName,
            userEmail,
            userImage
        } = req.body;

        // Set default values for required fields if not provided
        userId = userId || 'anonymous';
        scholarshipId = scholarshipId || 'default';
        universityId = universityId || 'default';

        // Validate essential fields
        if (!rating || !comment || !userEmail) {
            console.error('Missing required fields:', { rating, comment, userEmail });
            return res.status(400).json({
                success: false,
                message: 'Rating, comment, and user email are required'
            });
        }

        // Create new review with defaults for missing fields
        const review = new Review({
            userId,
            scholarshipId,
            scholarshipName: scholarshipName || 'Untitled Scholarship',
            universityId,
            universityName: universityName || 'Untitled University',
            rating: Number(rating),
            comment,
            reviewDate: reviewDate ? new Date(reviewDate) : new Date(),
            userName: userName || 'Anonymous',
            userEmail,
            userImage
        });

        // Save review
        await review.save();

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            review
        });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create review'
        });
    }
};

// Update review (only owner can update)
const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;
        const userEmail = req.user?.email;

        // Validate required fields
        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Rating and comment are required'
            });
        }

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Only allow owner to update
        if (review.userEmail !== userEmail) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this review.'
            });
        }

        review.rating = rating;
        review.comment = comment;
        review.updatedAt = new Date();
        await review.save();

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            data: review
        });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update review'
        });
    }
};

// Delete review (only owner can delete)
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const userEmail = req.user?.email;
        const review = await Review.findById(id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Only allow owner to delete
        if (review.userEmail !== userEmail) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to delete this review.'
            });
        }

        // Get the application ID before deleting the review
        const applicationId = review.applicationId;

        // Delete the review
        await Review.findByIdAndDelete(id);

        // Update application to mark it as not reviewed
        await Application.findByIdAndUpdate(applicationId, {
            isReviewed: false
        });

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete review'
        });
    }
};

// Get reviews by user email
const getReviewsByUser = async (req, res) => {
    try {
        const userEmail = req.query.userEmail;
        
        if (!userEmail) {
            return res.status(400).json({
                success: false,
                message: 'User email is required'
            });
        }

        const reviews = await Review.find({ userEmail }).sort({ reviewDate: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching user reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user reviews'
        });
    }
};

// Get reviews by scholarshipId
const getReviewsByScholarshipId = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await Review.find({ scholarshipId: id }).sort({ reviewDate: -1 });
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews by scholarshipId:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews by scholarshipId'
        });
    }
};

module.exports = {
    getAllReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    getReviewsByUser,
    getReviewsByScholarshipId
};