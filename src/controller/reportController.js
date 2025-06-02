// backend/controllers/reportController.js

async function submitReport(req, connection) {
    const { firstName, lastName, personnelType, emergency, location, date, time } = req.body;

    try {
        // Step 1: Find or Insert User
        let userId;
        const [userRows] = await connection.execute(
            'SELECT Id FROM users WHERE First_name = ? AND Last_name = ?',
            [firstName, lastName]
        );
        if (userRows.length > 0) {
            userId = userRows[0].Id;
        } else {
            const [userResult] = await connection.execute(
                'INSERT INTO users (First_name, Last_name, Role) VALUES (?, ?, ?)',
                [firstName, lastName, personnelType || 'Reporter']
            );
            userId = userResult.insertId;
        }

        // Step 2: Find or Insert Emergency
        let emergencyId;
        const [emergencyRows] = await connection.execute(
            'SELECT Id FROM emergencies WHERE Description = ?',
            [emergency]
        );
        if (emergencyRows.length > 0) {
            emergencyId = emergencyRows[0].Id;
        } else {
            const [emergencyResult] = await connection.execute(
                'INSERT INTO emergencies (Description) VALUES (?)',
                [emergency]
            );
            emergencyId = emergencyResult.insertId;
        }

        // Step 3: Find or Insert Location
        let locationId;
        const [locationRows] = await connection.execute(
            'SELECT Id FROM location WHERE Address = ?',
            [location]
        );
        if (locationRows.length > 0) {
            locationId = locationRows[0].Id;
        } else {
            const [locationResult] = await connection.execute(
                'INSERT INTO location (Address, City_Id, Population) VALUES (?, ?, ?)',
                [location, 1, 0] // Adjust City_Id as needed
            );
            locationId = locationResult.insertId;
        }

        // Step 4: Insert Report
        const dateTime = `${date} ${time}`; // Combine date and time for MySQL timestamp
        await connection.execute(
            'INSERT INTO reports (Emergency_TYPE_ID, Location_ID, Users_ID, Date_TIME) VALUES (?, ?, ?, ?)',
            [emergencyId, locationId, userId, dateTime]
        );

        return { message: 'Report submitted successfully' };
    } catch (err) {
        console.error('Error in submitReport:', err);
        throw new Error('Failed to submit report');
    }
}

export { submitReport };