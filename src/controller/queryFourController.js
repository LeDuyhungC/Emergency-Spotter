const formatEmergencyCount = (tuple) => {
    return {
        Emergency_Description: tuple.EmergencyDescription || 'Unknown',
        Report_Count: tuple.ReportCount || 0
    };
};

async function handleReportsByEmergencyCount(req, connection) {
    if (!connection) {
        console.error("Database connection not provided to handleReportsByEmergencyCount");
        throw new Error("Database connection is not available.");
    }

    const emergencyParam = req.query.param || '';
    const showAll = req.query.showAll === 'true'; // Default to false

    let sql = `
        SELECT 
            e.Description AS EmergencyDescription,
            COUNT(r.Id) AS ReportCount
        FROM reports r
        JOIN emergencies e ON r.Emergency_TYPE_ID = e.Id
    `;

    const params = [];
    if (!showAll && emergencyParam.trim()) {
        sql += ` WHERE e.Description LIKE ?`;
        params.push(`%${emergencyParam}%`);
    }
    sql += ` GROUP BY e.Description ORDER BY ReportCount DESC LIMIT 100`;

    try {
        const [rows] = await connection.execute(sql, params);
        return rows.map(formatEmergencyCount);
    } catch (err) {
        console.error(`Error executing query by emergency count:`, err);
        throw new Error(`Failed to retrieve data: ${err.message}`);
    }
}

export { handleReportsByEmergencyCount };