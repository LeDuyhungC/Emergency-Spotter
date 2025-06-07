const formatReport = (tuple) => {
  let formattedDate = 'NONE';
  let formattedTime = 'NONE';

  if (tuple.DATE_TIME) {
    const dt = new Date(tuple.DATE_TIME);
    if (!isNaN(dt.getTime())) {
      // Format Date to YYYY-MM-DD
      const year = dt.getFullYear();
      const month = String(dt.getMonth() + 1).padStart(2, '0');
      const day = String(dt.getDate()).padStart(2, '0');
      formattedDate = `${year}-${month}-${day}`;

      // Format Time to HH:MM:SS
      const hours = String(dt.getHours()).padStart(2, '0');
      const minutes = String(dt.getMinutes()).padStart(2, '0');
      const seconds = String(dt.getSeconds()).padStart(2, '0');
      formattedTime = `${hours}:${minutes}:${seconds}`;
    }
  }

  return {
    User_ID: tuple.UserId,
    Report_ID: tuple.ReportId,
    Report_Date: formattedDate,
    Report_Time: formattedTime,
    Emergency_Description: tuple.EmergencyDescription,
    Location_Address: tuple.LocationAddress,
    // Include raw values for editing
    Emergency_TYPE_ID: tuple.Emergency_TYPE_ID,
    Location_ID: tuple.Location_ID,
    DATE_TIME: tuple.DATE_TIME
  };
};

// Get all users
const getAllUsers = async (connection) => {
  if (!connection) {
    throw new Error("Database connection not available");
  }

  const sql = `
        SELECT 
            u.Id AS UserId, 
            u.First_Name, 
            u.Last_Name,
            u.Email
        FROM users u
    `;

  try {
    const [rows] = await connection.execute(sql);
    return rows;
  } catch (err) {
    console.error('Error fetching users:', err);
    throw new Error('Failed to retrieve users');
  }
};

// Get reports by user ID
const getReportsByUser = async (userId, connection) => {
  if (!connection) {
    throw new Error("Database connection not available");
  }

  if (!userId || isNaN(userId)) {
    throw new Error('Valid User ID is required');
  }

  const sql = `
        SELECT 
            u.Id AS UserId,
            r.Id AS ReportId,
            r.DATE_TIME,
            r.Emergency_TYPE_ID,
            r.Location_ID,
            e.Description AS EmergencyDescription,
            l.Address AS LocationAddress
        FROM reports r
        JOIN users u ON r.Users_ID = u.Id
        JOIN emergencies e ON r.Emergency_TYPE_ID = e.Id
        JOIN location l ON r.Location_ID = l.Id
        WHERE u.Id = ?
        ORDER BY r.DATE_TIME DESC
    `;

  try {
    const [rows] = await connection.execute(sql, [userId]);
    return rows.map(formatReport);
  } catch (err) {
    console.error('Error fetching reports:', err);
    throw new Error('Failed to retrieve reports');
  }
};

// Update report
const updateUserReport = async (req, connection) => {
  const { reportId, emergencyTypeId, locationId, dateTime } = req.body;

  if (!connection) {
    throw new Error("Database connection not available.");
  }

  // Validation
  if (!reportId || isNaN(reportId)) {
    throw new Error('Valid Report ID is required.');
  }
  if (!emergencyTypeId || isNaN(emergencyTypeId)) {
    throw new Error('Valid Emergency Type ID is required.');
  }
  if (!locationId || isNaN(locationId)) {
    throw new Error('Valid Location ID is required.');
  }
  if (!dateTime || isNaN(new Date(dateTime).getTime())) {
    throw new Error('Valid Date/Time is required.');
  }

  try {
    await connection.beginTransaction();

    // Verify report exists
    const [report] = await connection.execute(
        'SELECT Id FROM reports WHERE Id = ?',
        [reportId]
    );
    if (report.length === 0) {
      throw new Error('Report not found');
    }

    // Update report
    await connection.execute(
        'UPDATE reports SET Emergency_TYPE_ID = ?, Location_ID = ?, DATE_TIME = ? WHERE Id = ?',
        [emergencyTypeId, locationId, new Date(dateTime), reportId]
    );

    await connection.commit();

    return {
      success: true,
      message: 'Report updated successfully',
      reportId: reportId
    };
  } catch (err) {
    await connection.rollback();
    console.error('Update error:', err);
    throw new Error(`Failed to update report: ${err.message}`);
  }
};

export { getAllUsers, getReportsByUser, updateUserReport };