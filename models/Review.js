const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: 'anonymous'
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    reviewDate: {
        type: Date,
        default: Date.now
    },
    scholarshipId: {
        type: String,
        default: 'default'
    },
    scholarshipName: {
        type: String,
        default: 'Untitled Scholarship'
    },
    universityName: {
        type: String,
        default: 'Untitled University'
    },
    universityId: {
        type: String,
        default: 'default'
    },
    userName: {
        type: String,
        default: 'Anonymous'
    },
    userImage: {
        type: String
    },
    userEmail: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review; 