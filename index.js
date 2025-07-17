require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const { connectDB } = require('./utils/dbConnect');
require('./config/firebase-admin'); // Initialize Firebase Admin

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'https://scholarship-managements.netlify.app'],
    credentials: true
}));
app.use(express.json());

// API routes
app.use('/api/v1', routes);

// Initialize MongoDB and start server
async function startServer() {
    try {
        // Connect to MongoDB
        await connectDB();

        // Routes
        app.use('/api', routes);

        // Health check route
        app.get('/', (req, res) => {
            res.send('Scholarship Management Server is running!');
        });

        // Global error handler
        app.use((err, req, res, next) => {
            console.error(err.stack);
            res.status(500).json({
                success: false,
                message: 'Something went wrong!',
                error: err.message
            });
        });

        // Start server
        const server = app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`Port ${port} is already in use`);
                process.exit(1);
            } else {
                console.error('Server error:', error);
            }
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    process.exit(1);
});

startServer();
