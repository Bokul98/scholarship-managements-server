const Application = require('../models/Application');

const updateApplicationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedApplication = await Application.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedApplication) {
            return res.status(404).json({ 
                success: false, 
                message: 'Application not found' 
            });
        }

        res.json({ 
            success: true, 
            message: 'Status updated successfully',
            status: updatedApplication.status
        });

    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Error updating status' 
        });
    }
};

module.exports = {
    updateApplicationStatus
};
