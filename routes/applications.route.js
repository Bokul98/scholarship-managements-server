const express = require('express');
const router = express.Router();
const {
    getApplications,
    getApplicationsByUserId,
    createApplication,
    updateApplication,
    deleteApplication,
    updateApplicationFeedback
} = require('../controllers/applications.controller');
const { updateApplicationStatus } = require('../controllers/statusController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/', verifyToken, getApplications);
router.get('/user/:userId', verifyToken, getApplicationsByUserId);
router.post('/', verifyToken, createApplication);
router.patch('/:id', verifyToken, updateApplication);
router.patch('/:id/cancel', verifyToken, deleteApplication);
// Route for updating only the status
router.patch('/:id/status', verifyToken, updateApplicationStatus);
// Route for updating feedback
router.patch('/feedback/:id', verifyToken, updateApplicationFeedback);

module.exports = router;