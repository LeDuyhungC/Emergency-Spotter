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
import { handleAddressesByCityOrState } from './controller/queryFiveController.js';
import {updateLocationPopulation } from './controller/querySixController.js';


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


//============================================================[Query 3]=======================================================================
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

//============================================================[Query 4]======================================================================
app.get('/api/reportsByEmergencyCount', async (req, res) => {
    try {
        const result = await handleReportsByEmergencyCount(req, connection);
        res.status(200).json(result);
    } catch (err) {
        console.error('Route error:', err);
        res.status(500).json({ error: err.message });
    }
});
//============================================================[Query 5]======================================================================

app.get('/api/addressesByCityOrState', async (req, res) => {
    if (!connection) {
        console.error('API call to /api/usersByRoleAndCity but database connection is not available.'); //==========> database connection test
        return res.status(503).json({ error: 'Service temporarily unavailable. Database not connected.' });
    }
    try {
        const results = await handleAddressesByCityOrState(req, connection);
        res.status(200).json(results);
    } catch (err) {
        console.error('Route error', err);
        res.status(500).json({ error: err.message });
    }
});

//============================================================[Query 6]======================================================================

app.get('/api/users', async (req, res) => {
    if (!connection) {
        console.error('API call to /api/users but database connection is not available.');
        return res.status(503).json({ error: 'Service temporarily unavailable. Database not connected.' });
    }
    try {
        const [rows] = await connection.execute('SELECT Id, First_Name, Last_Name, Email FROM users ORDER BY Id');
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ error: 'Failed to fetch users: ' + err.message });
    }
});

app.get('/api/locations', async (req, res) => {
    if (!connection) {
        console.error('API call to /api/locations but database connection is not available.');
        return res.status(503).json({ error: 'Service temporarily unavailable. Database not connected.' });
    }
    try {
        const [rows] = await connection.execute('SELECT Id, Address FROM location ORDER BY Id');
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching locations:', err);
        res.status(500).json({ error: 'Failed to fetch locations: ' + err.message });
    }
});

app.get('/api/emergencies', async (req, res) => {
    if (!connection) {
        console.error('API call to /api/emergencies but database connection is not available.');
        return res.status(503).json({ error: 'Service temporarily unavailable. Database not connected.' });
    }
    try {
        const [rows] = await connection.execute('SELECT Id, Description FROM emergencies ORDER BY Id');
        res.status(200).json(rows);
    } catch (err) {
        console.error('Error fetching emergencies:', err);
        res.status(500).json({ error: 'Failed to fetch emergencies: ' + err.message });
    }
});


app.post('/api/submitEmergencyReport', async (req, res) => {
    if (!connection) {
        console.error('API call to /api/submitEmergencyReport but database connection is not available.');
        return res.status(503).json({ error: 'Service temporarily unavailable. Database not connected.' });
    }
    try {
        // Validate query parameters for userId, emergencyId, and locationId
        const { userId, emergencyId, locationId } = req.query;
        if (!userId || !emergencyId || !locationId) {
            return res.status(400).json({ error: 'Missing required query parameters: userId, emergencyId, and locationId are all required.' });
        }
        if (isNaN(userId) || Number(userId) <= 0 || isNaN(emergencyId) || Number(emergencyId) <= 0 || isNaN(locationId) || Number(locationId) <= 0) {
            return res.status(400).json({ error: 'Invalid query parameters: userId, emergencyId, and locationId must be positive numbers.' });
        }

        const result = await updateLocationPopulation(req, connection);
        res.status(200).json(result);
    } catch (err) {
        console.error('Route error:', err);
        // Customize response based on error type
        if (err.message.includes('does not exist') || err.message.includes('would exceed')) {
            res.status(400).json({ error: err.message });
        } else {
            res.status(500).json({ error: 'Transaction failed: ' + err.message });
        }
    }
});

// Step 9: Start the Server
const PORT = process.env.PORT || 5002;
(async () => {
    await initializeDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})();