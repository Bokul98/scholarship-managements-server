const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    scholarshipId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Scholarship',
        required: true
    },
    userId: {
        type: String,  // Firebase UID
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    address: {
        village: {
            type: String,
            required: true
        },
        district: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    applyingDegree: {
        type: String,
        enum: ['Diploma', 'Bachelor', 'Masters'],
        required: true
    },
    sscResult: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    hscResult: {
        type: Number,
        required: true,
        min: 0,
        max: 5
    },
    studyGap: {
        type: String,
        default: null
    },
    universityName: {
        type: String,
        required: true
    },
    scholarshipCategory: {
        type: String,
        required: true
    },
    subjectCategory: {
        type: String,
        required: true
    },
    payment: {
        applicationFee: {
            type: Number,
            required: true
        },
        serviceCharge: {
            type: Number,
            required: true,
        },
        totalPaid: {
            type: Number
        },
        paidAt: {
            type: Date
        },
        paymentIntentId: {
            type: String
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending'
        }
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'approved', 'rejected', 'cancelled'],
        default: 'pending'
    },
    expiresAt: {
        type: String,
        required: true
    },
    appliedDate: {
        type: Date,
        default: Date.now
    },
    isReviewed: {
        type: Boolean,
        default: false
    },
    feedback: String
}, { timestamps: true });

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;