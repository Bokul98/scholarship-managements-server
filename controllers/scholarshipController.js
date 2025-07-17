const Scholarship = require('../models/Scholarship');

// Get all scholarships
const getAllScholarships = async (req, res) => {
    try {
        const scholarships = await Scholarship.find();
        res.status(200).json(scholarships);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get scholarship by id
const getScholarshipById = async (req, res) => {
    try {
        const { id } = req.params;
        const scholarship = await Scholarship.findById(id);
        if (!scholarship) {
            return res.status(404).json({ message: "Scholarship not found" });
        }
        res.status(200).json(scholarship);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create scholarship
const createScholarship = async (req, res) => {
    try {
        const scholarshipData = req.body;
        
        // Create new scholarship
        const newScholarship = new Scholarship(scholarshipData);
        const savedScholarship = await newScholarship.save();
        
        res.status(201).json({
            message: "Scholarship created successfully",
            insertedId: savedScholarship._id
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update scholarship
const updateScholarship = async (req, res) => {
    try {
        const { id } = req.params;
        const scholarship = await Scholarship.findByIdAndUpdate(id, req.body, { new: true });
        if (!scholarship) {
            return res.status(404).json({ message: "Scholarship not found" });
        }
        res.status(200).json(scholarship);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete scholarship
const deleteScholarship = async (req, res) => {
    try {
        const { id } = req.params;
        const scholarship = await Scholarship.findByIdAndDelete(id);
        if (!scholarship) {
            return res.status(404).json({ message: "Scholarship not found" });
        }
        res.status(200).json({ message: "Scholarship deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllScholarships,
    getScholarshipById,
    createScholarship,
    updateScholarship,
    deleteScholarship
}; 