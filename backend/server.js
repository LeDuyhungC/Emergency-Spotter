// backend/server.js
// Step 1: Import Required Libraries
import express from 'express';
import cors from 'cors';
import { submitReport } from './controller/reportController.js';
import { handleAllAddresses } from './controller/mapController.js';

import { handleDateReports } from './controller/queryOneController.js';
import { handleAllUsers } from './controller/queryTwoController.js';
import { handleReportsMadeByUser } from './controller/queryTwoController.js';

import { handleReportsByLocation } from './controller/queryThreeController.js';
import { handleReportsByEmergencyCount } from './controller/queryFourController.js';
import { handleUsersByRoleAndCity } from './controller/queryFiveController.js';
import {getReportsByUser, getAllUsers, updateUserReport} from './controller/querySixController.js';
import mysql from 'mysql2/promise';


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
//============================================================[Map Addresses]======================================================================
// handleAllAddresses
app.get('/api/allAddresses', async (req, res) => {
    if (!connection) {
        console.error('API call to /api/allAddresses but database connection is not available.'); //==========> database connection test
        return res.status(503).json({ error: 'Service temporarily unavailable. Database not connected.' });
    }
    try {
        const results = await handleAllAddresses(req, connection);
        res.status(200).json(results);
    } catch (err) {
        console.error('Route error', err);
        res.status(500).json({ error: err.message });
    }
});


//===========================================================[REPORT]=======================================================================

app.post('/api/report', async (req, res) => {
    try {
        const result = await submitReport(req, connection || getConnection());
        res.status(200).json(result);
    } catch (err) {
        console.error('Route error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ==========================================================[Query 1]=======================================================================
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
//============================================================[Query 2]======================================================================
// handleAllUsers
app.get('/api/allUsers', async (req, res) => {
    if (!connection) {
        console.error('API call to /api/allUsers but database connection is not available.'); //==========> database connection test
        return res.status(503).json({ error: 'Service temporarily unavailable. Database not connected.' });
    }
    try {
        const results = await handleAllUsers(req, connection);
        res.status(200).json(results);
    } catch (err) {
        console.error('Route error', err);
        res.status(500).json({ error: err.message });
    }
});

// handleReportsMadeByUser
app.get('/api/reportsByUserId', async (req, res) => {
    if (!connection) {
        console.error('API call to /api/reportsByUserId but database connection is not available.'); //==========> database connection test
        return res.status(503).json({ error: 'Service temporarily unavailable. Database not connected.' });
    }
    try {
        const results = await handleReportsMadeByUser(req, connection);
        res.status(200).json(results);
    } catch (err) {
        console.error('Route error', err);
        es.status(500).json({ error: err.message });
    }
});

//============================================================[Query 3]======================================================================
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

//============================================================[Query 4]=======================================================================
app.get('/api/reportsByLocation', async (req, res) => {
    if (!connection) {
        console.error('API call to /api/reportsByLocation but database connection is not available.'); //==========> database connection test
        return res.status(503).json({ error: 'Service temporarily unavailable. Database not connected.' });
    }
    try {
        const result = await handleReportsByLocation(req, connection);
        res.status(200).json(result);
    }
    catch (err) {
        console.error('Route error:', err);
        res.status(500).json({ error: err.message });
    }
});
// query 5
app.get('/api/usersByRoleAndCity', async (req, res) => {
    if (!connection) {
        console.error('API call to /api/usersByRoleAndCity but database connection is not available.'); //==========> database connection test
        return res.status(503).json({ error: 'Service temporarily unavailable. Database not connected.' });
    }
    try {
        const results = await handleUsersByRoleAndCity(req, connection);
        res.status(200).json(results);
    } catch (err) {
        console.error('Route error', err);
        res.status(500).json({ error: err.message });
    }
});

// Query 6
//
// app.post('/api/', async (req, res) => {
//     if (!connection) {
//         console.error('API call to /api/submitEmergencyReport but database connection is not available.'); //==========> database connection test
//         return res.status(503).json({ error: 'Service temporarily unavailable. Database not connected.' });
//     }
//     try {
//         const result = await submitEmergencyReport(req, connection);
//         res.status(200).json(result);
//     } catch (err) {
//         console.error('Route error:', err);
//         res.status(500).json({ error: err.message });
//     }
// });

// Get all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await getAllUsers(connection);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get reports by user ID
app.get('/api/user-reports/:userId', async (req, res) => {
    try {
        const reports = await getReportsByUser(req.params.userId, connection);
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update report
app.post('/api/update-report', async (req, res) => {
    if (!connection) {
        return res.status(503).json({ error: 'Database connection not available' });
    }
    try {
        const result = await updateUserReport(req, connection);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// handleReportsMadeByUser


// Step 9: Start the Server
const PORT = process.env.PORT || 5002;
(async () => {
    await initializeDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})();