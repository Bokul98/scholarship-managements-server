const express = require('express');
const router = express.Router();

// Import controllers
const { 
    getScholarshipsByCategory,
    getApplicationStatusDistribution,
    getMonthlyApplicationTrends,
    getUserRoleDistribution,
    getAnalyticsSummary
} = require('../controllers/analyticsController');

// Import middlewares
const verifyToken = require('../middlewares/verifyToken');
const { verifyAdmin } = require('../middlewares/verifyRole');

// Middleware to log requests
const logRequest = (req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
};


// Old routes (can be removed if not needed)
router.get('/scholarships/analytics/categories', logRequest, getScholarshipsByCategory);
router.get('/applications/analytics/status', logRequest, getApplicationStatusDistribution);
router.get('/applications/analytics/monthly', logRequest, getMonthlyApplicationTrends);
router.get('/users/analytics/roles', logRequest, getUserRoleDistribution);


// New summary route
router.get('/summary', logRequest, getAnalyticsSummary);

// Applications per scholarship
const { getApplicationsPerScholarship } = require('../controllers/analyticsController');
router.get('/scholarships/applications', logRequest, getApplicationsPerScholarship);

module.exports = router;

module.exports = router;
