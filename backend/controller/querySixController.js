
const submitEmergencyReport = async (req, connection) => {
  const userId = req.query.userId;
  const emergencyId = req.query.emergencyId;
  const locationId = req.query.locationId;

  if (!connection) {
    console.error("Database connection not provided to submitEmergencyReport");
    throw new Error("Database connection is not available.");
  }

  if (!userId || isNaN(userId) || Number(userId) <= 0) {
    throw new Error('Valid User ID is required.');
  }
  if (!emergencyId || isNaN(emergencyId) || Number(emergencyId) <= 0) {
    throw new Error('Valid Emergency ID is required.');
  }
  if (!locationId || isNaN(locationId) || Number(locationId) <= 0) {
    throw new Error('Valid Location ID is required.');
  }

  try {
    // Begin transaction
    await connection.beginTransaction();

    // Check if user, emergency, and location exist
    const [userRows] = await connection.execute('SELECT Id FROM users WHERE Id = ?', [userId]);
    if (userRows.length === 0) {
      throw new Error('User ID does not exist.');
    }
    const [emergencyRows] = await connection.execute('SELECT Id FROM emergencies WHERE Id = ?', [emergencyId]);
    if (emergencyRows.length === 0) {
      throw new Error('Emergency ID does not exist.');
    }
    const [locationRows] = await connection.execute('SELECT Id, Population FROM location WHERE Id = ?', [locationId]);
    if (locationRows.length === 0) {
      throw new Error('Location ID does not exist.');
    }

    // Insert new report
    const [reportResult] = await connection.execute(
      'INSERT INTO reports (Emergency_Type_ID, Location_ID, Users_ID, Date_Time) VALUES (?, ?, ?, NOW())',
      [emergencyId, locationId, userId]
    );
    const reportId = reportResult.insertId;

    // Update location population (e.g., increment by 1 to track activity)
    const newPopulation = (locationRows[0].Population || 0) + 1;
    await connection.execute(
      'UPDATE location SET Population = ? WHERE Id = ?',
      [newPopulation, locationId]
    );

    // Commit transaction
    await connection.commit();

    return {
      success: true,
      message: 'Emergency report submitted successfully.',
      reportId: reportId,
      updatedUserReports: newPopulation
    };
  } catch (err) {
    // Rollback on error
    await connection.rollback();
    console.error('Transaction error:', err);
    throw new Error(`Transaction failed: ${err.message}`);
  }
};

export { submitEmergencyReport };

