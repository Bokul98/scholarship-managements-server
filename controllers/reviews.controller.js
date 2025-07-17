const Review = require('../models/Review');

// Get reviews (with optional userEmail filter)
const getReviews = async (req, res) => {
    try {
        const { userEmail } = req.query;
        const query = userEmail ? { userEmail: userEmail } : {};
        
        const reviews = await Review.find(query)
            .sort({ createdAt: -1 });
        
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new review
const createReview = async (req, res) => {
    try {
        const { scholarshipId, userEmail } = req.body;
        
        // Check if user has already reviewed
        const existingReview = await Review.findOne({ scholarshipId, userEmail });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this scholarship' });
        }

        // Validate required fields
        const requiredFields = ['rating', 'comment', 'reviewDate', 'scholarshipId', 'scholarshipName', 
            'universityName', 'universityId', 'userName', 'userEmail', 'userId'];
        
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `${field} is required` });
            }
        }

        const review = new Review(req.body);
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update review
const updateReview = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Only allow updating rating and comment
        if (rating) review.rating = rating;
        if (comment) review.comment = comment;

        await review.save();
        res.json(review);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete review
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        
        const review = await Review.findById(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        await review.deleteOne();
        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getReviews,
    createReview,
    updateReview,
    deleteReview
}; 