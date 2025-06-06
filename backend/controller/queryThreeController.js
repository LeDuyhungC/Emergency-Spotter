const formatReport = (tuple) => {
    let formattedDate = 'NONE';
    let formattedTime = 'NONE';

    if (tuple.DATE_TIME) {
        const dt = new Date(tuple.DATE_TIME);

        if (!isNaN(dt.getTime())) {
            const year = dt.getFullYear();
            const month = String(dt.getMonth() + 1).padStart(2, '0');
            const day = String(dt.getDate()).padStart(2, '0');
            formattedDate = `${year}-${month}-${day}`;

            const hours = String(dt.getHours()).padStart(2, '0');
            const minutes = String(dt.getMinutes()).padStart(2, '0');
            const seconds = String(dt.getSeconds()).padStart(2, '0');
            formattedTime = `${hours}:${minutes}:${seconds}`;
        } else {
            console.warn(`Invalid date format received for DATE_TIME: ${tuple.DATE_TIME}`);
        }
    }

    return {
        Report_ID: tuple.ReportId,
        Report_Date: formattedDate,
        Report_Time: formattedTime,
        Emergency_Description: tuple.EmergencyDescription,
        Location_Address: tuple.LocationAddress,
        Reporter_First_Name: tuple.FirstName,
        Reporter_Last_Name: tuple.LastName,
        Reporter_Role: tuple.Role,
    };
};

async function handleReportsByLocation(req, connection) {
    const locationParam = req.query.param;

    if (!connection) {
        console.error("Database connection not provided to handleReportsByLocation");
        throw new Error("Database connection is not available.");
    }

    if (!locationParam) {
        throw new Error('Location parameter is required.');
    }

    const baseQuery = `
        SELECT 
            r.Id AS ReportId, 
            r.DATE_TIME AS Date, 
            e.Description AS EmergencyDescription, 
            l.Address AS LocationAddress, 
            u.First_Name AS FirstName, 
            u.Last_Name AS LastName, 
            u.Role
        FROM reports r
        JOIN users u ON r.Users_ID = u.Id
        JOIN emergencies e ON r.Emergency_TYPE_ID = e.Id
        JOIN location l ON r.Location_ID = l.Id
    `;

    const sql = `${baseQuery} WHERE l.Address LIKE ? ORDER BY r.Id DESC`;
    const params = [`%${locationParam}%`];

    try {
        const [rows] = await connection.execute(sql, params);
        return rows.map(formatReport);
    } catch (err) {
        console.error(`Error executing query by location:`, err);
        throw new Error(`Failed to retrieve data: ${err.message}`);
    }
}

export { handleReportsByLocation };