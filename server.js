// backend/server.js
// Step 1: Import Required Libraries
import express from 'express';
import cors from 'cors';
import { submitReport } from './src/controller/reportController.js';
import { handleDateReports } from './src/controller/queryOneController.js'
import { handleAllUsers } from './src/controller/queryTwoController.js';
import { handleReportsByLocation } from './src/controller/queryThreeController.js';
import { handleReportsByEmergencyCount } from './src/controller/queryFourController.js';


// Step 4: Import Database Configuration
import { connectToDatabase, getConnection } from './dbconfig.js';
import * as https from "node:https";

// Step 5: Initialize Express App
const app = express();

// Step 6: Middleware Setup
app.use(express.json()); // Parse incoming JSON requests
app.use(express.static('public')); // Serve static files from 'public' directory
app.use(cors({
    origin: 'http://localhost:5173'
})); // Allow frontend to access backend

// Step 7: Database Connection
let connection;

const initializeDatabase = async () => {
    connection = await connectToDatabase();
};

// Step 8: Define Routes
// Route for submitting a report
app.post('/api/report', async (req, res) => {
    try {
        const result = await submitReport(req, connection || getConnection());
        res.status(200).json(result);
    } catch (err) {
        console.error('Route error:', err);
        res.status(500).json({ error: err.message });
    }
});


// Route for returning all reports within a specific day
app.get('/api/reportsByDate', async (req, res) => {
    if (!connection) {
        console.error('API call to /api/reportsByDate but database connection is not available.'); //==========> database connection test
        return res.status(503).json({ error: 'Service temporarily unavailable. Database not connected.' });
    }
    try {
        const results = await handleDateReports(req, connection);
        res.status(200).json(results);
    } catch (err) {
        console.error('Route error', err);
        res.status(500).json({ error: err.message });
    }
});
//==================================================================QUERY2=====================================================
// handleAllUsers
app.get('/api/reportsByLocation', async (req, res) => {
    if (!connection) {
        console.error('API call to /api/reportsByLocation but database connection is not available.'); //==========> database connection test
        return res.status(503).json({ error: 'Service temporarily unavailable. Database not connected.' });
    }
    try {
        const results = await handleReportsByLocation(req, connection);
        res.status(200).json(results);
    } catch (err) {
        console.error('Route error', err);
        res.status(500).json({ error: err.message });
    }
});

// In server.js, within the route definitions
app.get('/api/reportsByEmergencyCount', async (req, res) => {
    try {
        const result = await handleReportsByEmergencyCount(req, connection);
        res.status(200).json(result);
    } catch (err) {
        console.error('Route error:', err);
        res.status(500).json({ error: err.message });
    }
});

// handleReportsMadeByUser


// Step 9: Start the Server
const PORT = process.env.PORT || 5004;
(async () => {
    await initializeDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})();