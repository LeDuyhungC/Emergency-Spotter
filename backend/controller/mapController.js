async function handleAllAddresses(_req, connection) {

    if (!connection) {
        throw new Error("Database connection is not available.");
    }
    const sql = `
    SELECT
        r.Id As Report_ID,
        l.Address As Address
    FROM reports r
    JOIN location l ON r.Location_ID = l.Id
    JOIN Emergencies e ON r.Emergency_Type_Id = e.Id
    WHERE e.Id > 0
    ORDER BY r.Id DESC;
    `;

    const params = [];
    try {
        const [rows] = await connection.execute(sql, params);
        return rows
    } catch (err) {
        console.error(`Error executing query by date:`, err);
        throw new Error(`Failed to retrieve data: ${err.message}`); 
    }
};

export { handleAllAddresses };