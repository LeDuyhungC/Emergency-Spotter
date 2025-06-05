// backend/controllers/reportController.js
async function submitReport(req, connection) {
    const { firstName, lastName, personnelType, emergency, location, date, time, services, population, hours } = req.body;

    try {
        // Validate required fields
        if (!firstName || !lastName || !emergency || !location || !date || !time || !services || !population || !hours) {
            throw new Error('Missing required fields');
        }

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
                'INSERT INTO users (First_name, Last_name, Role, Address, Email) VALUES (?, ?, ?, ?, ?)',
                [firstName, lastName, personnelType || 'Reporter', location, `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`]
            );
            console.log("Location received from form:", location);
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

        // Step 3: Find or Insert Structure Type
        let structureTypeId;
        const [structureRows] = await connection.execute(
            'SELECT Id FROM structure_type WHERE Services = ? AND Hours = ?',
            [services, hours]
        );
        if (structureRows.length > 0) {
            structureTypeId = structureRows[0].Id;
        } else {
            const [structureResult] = await connection.execute(
                'INSERT INTO structure_type (Max_population, Services, Hours) VALUES (?, ?, ?)',
                [population, services, hours] // Use form population as Max_population
            );
            structureTypeId = structureResult.insertId;
        }

        // Step 4: Find or Insert Location
        let locationId;
        const [locationRows] = await connection.execute(
            'SELECT Id FROM location WHERE Address = ?',
            [location]
        );
        if (locationRows.length > 0) {
            locationId = locationRows[0].Id;
            // Update Population if it exists
            await connection.execute(
                'UPDATE location SET Population = ? WHERE Id = ?',
                [population, locationId]
            );
        } else {
            const [locationResult] = await connection.execute(
                'INSERT INTO location (Address, City_Id, Population) VALUES (?, ?, ?)',
                [location, structureTypeId, population]
            );
            locationId = locationResult.insertId;
        }

        // Step 5: Insert Report
        const dateTime = `${date} ${time}:00`; // Ensure proper MySQL timestamp format
        const [reportResult] = await connection.execute(
            'INSERT INTO reports (Emergency_TYPE_ID, Location_ID, Users_ID, Date_TIME) VALUES (?, ?, ?, ?)',
            [emergencyId, locationId, userId, dateTime]
        );

        return { message: 'Report submitted successfully', reportId: reportResult.insertId };
    } catch (err) {
        console.error('Error in submitReport:', err);
        throw new Error('Failed to submit report: ' + err.message);
    }
}

export { submitReport };