const Scholarship = require('../models/Scholarship');

// Get all scholarships
const getScholarships = async (req, res) => {
    try {
        const scholarships = await Scholarship.find()
            .sort({ createdAt: -1 });
        res.json(scholarships);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create new scholarship
const createScholarship = async (req, res) => {
    try {
        const scholarship = new Scholarship(req.body);
        await scholarship.save();
        res.status(201).json(scholarship);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update scholarship
const updateScholarship = async (req, res) => {
    try {
        const { id } = req.params;
        
        const scholarship = await Scholarship.findById(id);
        if (!scholarship) {
            return res.status(404).json({ message: 'Scholarship not found' });
        }

        // Update only allowed fields
        const allowedUpdates = [
            'scholarshipName',
            'universityName',
            'country',
            'city',
            'rank',
            'subjectCategory',
            'degree',
            'applicationFee',
            'serviceCharge',
            'deadline',
            'description',
            'image'
        ];

        allowedUpdates.forEach(update => {
            if (req.body[update] !== undefined) {
                scholarship[update] = req.body[update];
            }
        });

        await scholarship.save();
        res.json(scholarship);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete scholarship
const deleteScholarship = async (req, res) => {
    try {
        const { id } = req.params;
        
        const scholarship = await Scholarship.findById(id);
        if (!scholarship) {
            return res.status(404).json({ message: 'Scholarship not found' });
        }

        // Check if there are any active applications
        const Application = require('../models/Application');
        const activeApplications = await Application.exists({
            scholarshipId: id,
            status: { $in: ['pending', 'approved'] }
        });

        if (activeApplications) {
            return res.status(400).json({ 
                message: 'Cannot delete scholarship with active applications' 
            });
        }

        await scholarship.deleteOne();
        res.json({ message: 'Scholarship deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getScholarships,
    createScholarship,
    updateScholarship,
    deleteScholarship
}; 