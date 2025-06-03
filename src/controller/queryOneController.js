
const formatReport = (tuple) => {
    let formattedDate = 'N/A'; //Both Default return
    let formattedTime = 'N/A'; 

    // tuple.DATE_TIME will be the full timestamp string from the database
    // e.g., "2023-10-27 15:30:00" (MySQL's default string representation for TIMESTAMP)
    // or it could be a JavaScript Date object if the driver does that conversion (less common for mysql2 promise)
    if (tuple.DATE_TIME) {
        const dt = new Date(tuple.DATE_TIME); // JavaScript's Date object parses timestamp strings well

        if (!isNaN(dt.getTime())) { // Check if the date is valid
        // Format Date to YYYY-MM-DD
        const year = dt.getFullYear();
        const month = String(dt.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
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
        // These keys should match what your frontend table expects in `Object.keys(results[0])`
        // and in the `<td>{row[header]}</td>` part.
        Report_ID: tuple.ReportId, // Assuming ReportId is the alias from your SQL
        Report_Date: formattedDate,
        Report_Time: formattedTime,
        Emergency_Description: tuple.EmergencyDescription,
        Location_Address: tuple.LocationAddress,
        Reporter_First_Name: tuple.FirstName,
        Reporter_Last_Name: tuple.LastName,
        Reporter_Role: tuple.Role,
        // You can add or remove fields as needed based on what you want to display
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

  // SQL query is now fixed to search by date
  const sql = `${baseQuery} WHERE DATE(r.DATE_TIME) = ? ORDER BY r.DATE_TIME DESC`;
  const params = [dateParam];

  try {
    const [rows] = await connection.execute(sql, params);
    return rows.map(formatReport); // Format results before sending
  } catch (err) {
    console.error(`Error executing query by date:`, err);
    // This error will be caught by the route handler and sent as a 500 response
    throw new Error(`Failed to retrieve data: ${err.message}`); 
  }
};

export { handleDateReports }; // Export the renamed function