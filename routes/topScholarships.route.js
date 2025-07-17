const express = require('express');
const router = express.Router();
const { getDB } = require('../utils/dbConnect');

// Sample data for initial setup
const sampleScholarships = [
    {
        "university": "Harvard University",
        "universityImage": "https://i.ibb.co/YZQMgVz/harvard-logo.png",
        "scholarshipCategory": "Full fund",
        "location": { "country": "USA", "city": "Cambridge" },
        "applicationDeadline": "2025-02-15",
        "subjectCategory": "Engineering",
        "applicationFees": 50,
        "postDate": "2025-07-06",
        "rating": 4.9
    },
    {
        "university": "University of Oxford",
        "universityImage": "https://i.ibb.co/7CxQKWG/oxford-logo.png",
        "scholarshipCategory": "Partial",
        "location": { "country": "UK", "city": "Oxford" },
        "applicationDeadline": "2025-01-20",
        "subjectCategory": "Agriculture",
        "applicationFees": 30,
        "postDate": "2025-07-07",
        "rating": 4.7
    },
    {
        "university": "University of Tokyo",
        "universityImage": "https://i.ibb.co/hDKdGCb/tokyo-logo.png",
        "scholarshipCategory": "Self-fund",
        "location": { "country": "Japan", "city": "Tokyo" },
        "applicationDeadline": "2025-04-10",
        "subjectCategory": "Doctor",
        "applicationFees": 20,
        "postDate": "2025-07-08",
        "rating": 4.5
    },
    {
        "university": "Stanford University",
        "universityImage": "https://i.ibb.co/bL5M0C7/stanford-logo.png",
        "scholarshipCategory": "Full fund",
        "location": { "country": "USA", "city": "Stanford" },
        "applicationDeadline": "2025-03-01",
        "subjectCategory": "Engineering",
        "applicationFees": 60,
        "postDate": "2025-07-06",
        "rating": 4.8
    },
    {
        "university": "ETH Zurich",
        "universityImage": "https://i.ibb.co/fF5LrMM/eth-logo.png",
        "scholarshipCategory": "Partial",
        "location": { "country": "Switzerland", "city": "Zurich" },
        "applicationDeadline": "2025-03-15",
        "subjectCategory": "Doctor",
        "applicationFees": 25,
        "postDate": "2025-07-05",
        "rating": 4.6
    },
    {
        "university": "University of Melbourne",
        "universityImage": "https://i.ibb.co/q0CkRsc/melbourne-logo.png",
        "scholarshipCategory": "Full fund",
        "location": { "country": "Australia", "city": "Melbourne" },
        "applicationDeadline": "2025-02-10",
        "subjectCategory": "Agriculture",
        "applicationFees": 15,
        "postDate": "2025-07-04",
        "rating": 4.4
    }
];

// Route to insert sample data (supports both GET and POST)
router.get('/setup', insertSampleData);
router.post('/setup', insertSampleData);

async function insertSampleData(req, res) {
    try {
        console.log('Setting up sample data...');
        const db = await getDB();
        const scholarshipsCollection = db.collection('scholarships');

        // Clear existing data
        await scholarshipsCollection.deleteMany({});
        console.log('Cleared existing data');

        // Insert sample data
        const result = await scholarshipsCollection.insertMany(sampleScholarships);
        console.log(`Inserted ${result.insertedCount} scholarships`);

        res.json({
            success: true,
            message: `Inserted ${result.insertedCount} scholarships`,
            insertedIds: result.insertedIds
        });

    } catch (error) {
        console.error('Error setting up sample data:', error);
        res.status(500).json({
            success: false,
            message: 'Error setting up sample data',
            error: error.message
        });
    }
}

// Get top 6 scholarships sorted by application fee (asc) and postDate (desc)
router.get('/', async (req, res) => {
    try {
        console.log('Fetching top scholarships...');
        const db = await getDB();
        const scholarshipsCollection = db.collection('scholarships');
        
        const topScholarships = await scholarshipsCollection
            .find({})
            .sort({ 
                applicationFees: 1,
                postDate: -1
            })
            .limit(6)
            .toArray();

        console.log('Number of scholarships found:', topScholarships.length);

        res.json(topScholarships);

    } catch (error) {
        console.error('Error in /api/top-scholarships:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching top scholarships',
            error: error.message
        });
    }
});

module.exports = router; 