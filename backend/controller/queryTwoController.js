
const formatReport = (tuple) => {
    let formattedDate = 'NONE'; //Both Default return
    let formattedTime = 'NONE'; 

    // The IF STATEMENT BELLOW CONVERTS MY timestamp type from MYSQL to a date and time String for JS so that it is easier to read and present in front-end
    // tuple.DATE_TIME will is the full timestamp string from the database
    // EX: "2023-10-27 15:30:00" (MySQL's string for TIMESTAMP)
    if (tuple.DATE_TIME) {
        const dt = new Date(tuple.DATE_TIME); // JavaScript's Date object parses timestamp strings well

        if (!isNaN(dt.getTime())) { // Check if the date is valid
        // Format Date to YYYY-MM-DD
        const year = dt.getFullYear();
        const month = String(dt.getMonth() + 1).padStart(2, '0');
        const day = String(dt.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;

        // Format Time to HH:MM:SS (24-hour format)
        const hours = String(dt.getHours()).padStart(2, '0');
        const minutes = String(dt.getMinutes()).padStart(2, '0');
        const seconds = String(dt.getSeconds()).padStart(2, '0');
        formattedTime = `${hours}:${minutes}:${seconds}`;
        } else {
            console.warn(`Invalid date format received for DATE_TIME: ${tuple.DATE_TIME}`);
        }
    }

    return {
        User_ID: tuple.UserId,
        Report_ID: tuple.ReportId,
        Report_Date: formattedDate,
        Report_Time: formattedTime,
        Emergency_Description: tuple.EmergencyDescription,
        Location_Address: tuple.LocationAddress
    };
};

async function handleAllUsers(_req, connection) {

    if (!connection) {
        throw new Error("Database connection is not available.");
    }
    const sql = `
    SELECT 
        u.id AS UserId, 
        u.First_Name AS First_Name, 
        u.Last_Name AS Last_Name
    FROM users u
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

async function handleReportsMadeByUser(req, connection) {
    const userParam = req.query.param; //retrieves the parameter value from the query string

    if (!connection) {
    console.error("Database connection not provided to handleReportsMadeByUser");
        throw new Error("Database connection is not available.");
    }

    if (!userParam) {
        // This error will be caught by the route handler in server.js and sent as a 400 response
        throw new Error('Date parameter is required.'); 
    }

    // Base query joining all necessary tables
    const baseQuery = `
    SELECT 
        u.Id As UserId,
        r.Id AS ReportId, 
        r.DATE_TIME, 
        e.Description AS EmergencyDescription, 
        l.Address AS LocationAddress 
    FROM users u
    JOIN reports r ON r.Users_ID = u.Id
    JOIN emergencies e ON r.Emergency_TYPE_ID = e.Id
    JOIN location l ON r.Location_ID = l.Id
    `;

    const sql = `${baseQuery} WHERE u.Id = ? ORDER BY ReportId ASC`;
    const params = [userParam];

    try {
        const [rows] = await connection.execute(sql, params);
        return rows.map(formatReport); // Format results before sending
    } catch (err) {
        console.error(`Error executing query by date:`, err);
        throw new Error(`Failed to retrieve data: ${err.message}`); 
    }
};

export { handleReportsMadeByUser, handleAllUsers };