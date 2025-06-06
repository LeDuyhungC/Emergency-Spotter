const formatUser = (tuple) => {
  return {
    ID: tuple.Id,
    First_Name: tuple.First_Name,
    Last_Name: tuple.Last_Name,
    Role: tuple.Role,
    Address: tuple.Address,
    City_ID: tuple.City_Id
  };
};

async function handleUsersByRoleAndCity(req, connection) {
  const roleParam = req.query.role;
  const cityIdParam = req.query.cityId;

  if (!connection) {
    console.error("Database connection not provided to handleUsersByRoleAndCity");
    throw new Error("Database connection is not available.");
  }

  if (!roleParam) {
    throw new Error('Role parameter is required.');
  }
  if (!cityIdParam || isNaN(cityIdParam) || Number(cityIdParam) <= 0) {
    throw new Error('Valid City ID is required.');
  }

  const baseQuery = `
    SELECT 
      u.Id, 
      u.First_Name, 
      u.Last_Name, 
      u.Role, 
      u.Address, 
      l.City_Id
    FROM users u
    JOIN location l ON u.Address = l.Address
  `;

  const sql = `${baseQuery} WHERE u.Role LIKE ? AND l.City_Id = ? ORDER BY u.Id`;
  const params = [`%${roleParam}%`, cityIdParam];

  try {
    const [rows] = await connection.execute(sql, params);
    if (rows.length === 0) {
      throw new Error('No users found for the specified role and city.');
    }
    return rows.map(formatUser);
  } catch (err) {
    console.error(`Error executing query by role and city:`, err);
    throw new Error(`Failed to retrieve data: ${err.message}`);
  }
}

export { handleUsersByRoleAndCity };