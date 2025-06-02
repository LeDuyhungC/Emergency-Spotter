// backend/server.js
// Step 1: Import Required Libraries
import express from 'express';
import cors from 'cors';
import { submitReport } from './src/controller/reportController.js';

// Step 4: Import Database Configuration
import { connectToDatabase, getConnection } from './dbconfig.js';
import * as https from "node:https";

// Step 5: Initialize Express App
const app = express();

// Step 6: Middleware Setup
app.use(express.json()); // Parse incoming JSON requests
app.use(express.static('public')); // Serve static files from 'public' directory
app.use(cors({
    origin:'http://localhost:5173/'
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

// Step 9: Start the Server
const PORT = process.env.PORT || 5002;
(async () => {
    await initializeDatabase();
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
})();