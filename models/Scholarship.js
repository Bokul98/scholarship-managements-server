const mongoose = require('mongoose');

const scholarshipSchema = new mongoose.Schema({
    scholarshipName: {
        type: String,
        required: true
    },
    universityName: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    rank: {
        type: Number,
        required: true
    },
    subjectCategory: {
        type: String,
        required: true
    },
    scholarshipCategory: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    tuitionFee: {
        type: Number
    },
    applicationFee: {
        type: Number,
        required: true
    },
    serviceCharge: {
        type: Number,
        required: true
    },
    deadline: {
        type: Date,
        required: true
    },
    postDate: {
        type: Date,
        required: true
    },
    postedUserEmail: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);

module.exports = Scholarship; 