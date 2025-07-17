const Application = require('../models/Application');
const mongoose = require('mongoose'); // Added missing import

// Get all applications
const getApplications = async (req, res) => {
    try {
        const applications = await Application.find();
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get applications by user ID
const getApplicationsByUserId = async (req, res) => {
    try {
        const userId = req.params.userId;
        const applications = await Application.find({ userId });
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new application
const createApplication = async (req, res) => {
    try {
        console.log('Received application data:', req.body);
        const { scholarshipId, userId } = req.body;
        
        // Check if user has already applied
        const existingApplication = await Application.findOne({ scholarshipId, userId });
        if (existingApplication) {
            console.log('User has already applied:', { scholarshipId, userId });
            return res.status(400).json({ message: 'You have already applied for this scholarship' });
        }

        // Convert scholarshipId to ObjectId if it's not already
        if (typeof scholarshipId === 'string') {
            req.body.scholarshipId = new mongoose.Types.ObjectId(scholarshipId);
        }

        // Create new application with all the form data
        const applicationData = {
            ...req.body,
            status: 'pending',
            paymentStatus: 'completed', // Since we only create after payment
            appliedDate: new Date(),
            expiresAt: new Date(new Date().setMonth(new Date().getMonth() + 1)) // Set expiry to 1 month from now
        };

        console.log('Creating application with data:', applicationData);

        const application = new Application(applicationData);

        // Log validation errors if any
        const validationError = application.validateSync();
        if (validationError) {
            console.error('Validation error:', validationError);
            return res.status(400).json({
                message: 'Validation error',
                errors: Object.keys(validationError.errors).reduce((acc, key) => {
                    acc[key] = validationError.errors[key].message;
                    return acc;
                }, {})
            });
        }

        const savedApplication = await application.save();
        console.log('Application saved successfully:', savedApplication);
        res.status(201).json(savedApplication);
    } catch (error) {
        console.error('Error creating application:', {
            error: error.message,
            stack: error.stack,
            name: error.name,
            code: error.code
        });
        
        // Check if it's a MongoDB validation error
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: Object.keys(error.errors).reduce((acc, key) => {
                    acc[key] = error.errors[key].message;
                    return acc;
                }, {})
            });
        }

        // Check if it's a MongoDB duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                message: 'Duplicate application',
                field: Object.keys(error.keyPattern)[0]
            });
        }

        res.status(500).json({ 
            message: error.message,
            details: error.errors ? Object.keys(error.errors).map(key => ({
                field: key,
                message: error.errors[key].message
            })) : null
        });
    }
};

// Update an application
const updateApplication = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;

        // Ensure valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid application ID format' });
        }

        // Find the application first
        const application = await Application.findById(new mongoose.Types.ObjectId(id));
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Allow updates if:
        // 1. The application is in pending status OR
        // 2. We're only updating the isReviewed field
        if (application.status !== 'pending' && 
            !(Object.keys(updates).length === 1 && updates.hasOwnProperty('isReviewed'))) {
            return res.status(400).json({ 
                message: 'Cannot update application. Only pending applications can be updated, except for review status.' 
            });
        }

        // Fields that are allowed to be updated
        const allowedUpdates = [
            'phoneNumber',
            'address',
            'gender',
            'applyingDegree',
            'sscResult',
            'hscResult',
            'studyGap',
            'universityName',
            'scholarshipCategory',
            'subjectCategory',
            'payment',
            'expiresAt',
            'isReviewed'  // Added this field to allow review status updates
        ];

        // Filter out any fields that aren't in allowedUpdates
        const filteredUpdates = Object.keys(updates)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
                obj[key] = updates[key];
                return obj;
            }, {});

        // Update the application
        const updatedApplication = await Application.findByIdAndUpdate(
            id,
            { $set: filteredUpdates },
            { new: true, runValidators: true }
        );

        res.json({
            message: 'Application updated successfully',
            application: updatedApplication
        });
    } catch (error) {
        console.error('Error updating application:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: 'Validation error',
                errors: Object.keys(error.errors).reduce((acc, key) => {
                    acc[key] = error.errors[key].message;
                    return acc;
                }, {})
            });
        }
        res.status(500).json({ message: error.message });
    }
};

// Delete an application
const deleteApplication = async (req, res) => {
    try {
        const { id } = req.params;
        
        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Only allow deletion if status is pending
        if (application.status !== 'pending') {
            return res.status(400).json({ message: 'Cannot delete processed application' });
        }

        await application.deleteOne();
        res.json({ message: 'Application deleted successfully' });
    } catch (error) {
        console.error('Error deleting application:', error);
        res.status(500).json({ message: error.message });
    }
};

// Update application feedback
const updateApplicationFeedback = async (req, res) => {
    try {
        const { id } = req.params;
        const { feedback, status } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid application ID' });
        }

        const application = await Application.findById(id);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Update feedback and status
        application.feedback = feedback;
        if (status) {
            application.status = status;
        }
        application.updatedAt = new Date();
        application.isReviewed = true;

        const updatedApplication = await application.save();
        res.json({ 
            success: true, 
            message: 'Feedback updated successfully',
            application: updatedApplication 
        });
    } catch (error) {
        console.error('Error updating feedback:', error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};

module.exports = {
    getApplications,
    getApplicationsByUserId,
    createApplication,
    updateApplication,
    deleteApplication,
    updateApplicationFeedback
};