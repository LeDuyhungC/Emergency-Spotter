
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



async function handleDateReports(req, connection) {
  const dateParam = req.query.param; //retrieves the parameter value from the query string

  if (!connection) {
    console.error("Database connection not provided to handleDateReports");
    throw new Error("Database connection is not available.");
  }

  if (!dateParam) {
    // This error will be caught by the route handler in server.js and sent as a 400 response
    throw new Error('Date parameter is required.'); 
  }

  // Base query joining all necessary tables
  const baseQuery = `
    SELECT 
      r.Id AS ReportId, 
      r.DATE_TIME, 
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

  const sql = `${baseQuery} WHERE DATE(r.DATE_TIME) = ? ORDER BY r.Id DESC`;
  const params = [dateParam];

  try {
    const [rows] = await connection.execute(sql, params);
    return rows.map(formatReport); // Format results before sending
  } catch (err) {
    console.error(`Error executing query by date:`, err);
    throw new Error(`Failed to retrieve data: ${err.message}`); 
  }
};

export { handleDateReports }; // Export the renamed function