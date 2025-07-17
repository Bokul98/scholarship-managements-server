// GET /analytics/scholarships/applications
// Returns total applications per scholarship
const getApplicationsPerScholarship = async (req, res) => {
  try {
    const aggregation = await Application.aggregate([
      {
        $group: {
          _id: '$scholarshipId',
          applications: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'scholarships',
          localField: '_id',
          foreignField: '_id',
          as: 'scholarship',
        },
      },
      { $unwind: '$scholarship' },
      {
        $project: {
          _id: 0,
          scholarship: '$scholarship.title',
          applications: 1,
        },
      },
      { $sort: { applications: -1 } },
    ]);
    res.json(aggregation);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications per scholarship', error: error.message });
  }
};
const Scholarship = require('../models/Scholarship');
const Application = require('../models/Application');
const User = require('../models/User');

const getScholarshipsByCategory = async (req, res) => {
    try {
        // For testing, return dummy data first
        const dummyData = [
            { category: "Merit-based", count: 15 },
            { category: "Need-based", count: 10 },
            { category: "Research", count: 8 },
            { category: "Sports", count: 5 },
            { category: "Arts", count: 7 }
        ];
        res.json(dummyData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getApplicationStatusDistribution = async (req, res) => {
    try {
        // For testing, return dummy data
        const dummyData = [
            { name: "Pending", value: 25 },
            { name: "Approved", value: 45 },
            { name: "Rejected", value: 15 },
            { name: "Under Review", value: 20 }
        ];
        res.json(dummyData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getMonthlyApplicationTrends = async (req, res) => {
    try {
        // For testing, return dummy data
        const dummyData = [
            { month: "Jan 2025", applications: 45 },
            { month: "Feb 2025", applications: 52 },
            { month: "Mar 2025", applications: 38 },
            { month: "Apr 2025", applications: 65 },
            { month: "May 2025", applications: 48 },
            { month: "Jun 2025", applications: 55 },
            { month: "Jul 2025", applications: 42 }
        ];
        res.json(dummyData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getUserRoleDistribution = async (req, res) => {
    try {
        // For testing, return dummy data
        const dummyData = [
            { name: "Admin", value: 2 },
            { name: "Moderator", value: 5 },
            { name: "User", value: 150 }
        ];
        res.json(dummyData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// GET /analytics/summary
// Returns application status distribution and monthly trends
const getAnalyticsSummary = async (req, res) => {
  try {
    // Status distribution
    const statusAggregation = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const statusData = statusAggregation.map(item => ({
      name: item._id,
      value: item.count,
    }));

    // Monthly trends (last 12 months)
    const monthlyAggregation = await Application.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          applications: { $sum: 1 },
        },
      },
      { $sort: { '_id': 1 } },
    ]);
    const monthlyData = monthlyAggregation.map(item => ({
      month: item._id,
      applications: item.applications,
    }));

    res.json({ statusData, monthlyData });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics summary', error: error.message });
  }
};

module.exports = {
    getScholarshipsByCategory,
    getApplicationStatusDistribution,
    getMonthlyApplicationTrends,
    getUserRoleDistribution,
    getAnalyticsSummary,
    getApplicationsPerScholarship
};
