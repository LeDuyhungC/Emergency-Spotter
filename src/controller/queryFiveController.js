const formatAddressRow = (row) => {
  return {
    Address: row.Address,
    Population: row.Population,
    Max_Population: row.Max_population,
    Difference: row.Difference
  };
};

async function handleAddressesByCityOrState(req, connection) {
  const cityOrState = req.query.cityOrState;

  if (!connection) {
    console.error("Database connection not provided to handleAddressesByCityOrState");
    throw new Error("Database connection is not available.");
  }

  if (!cityOrState) {
    throw new Error('City or state parameter is required.');
  }

  const query = `
    SELECT 
      l.Address,
      l.Population,
      s.Max_population,
      (s.Max_population - l.Population) AS Difference
    FROM location l
    JOIN structure_type s ON l.City_Id = s.Id
    WHERE l.Address LIKE ?
  `;
  const params = [`%${cityOrState}%`];

  try {
    const [rows] = await connection.execute(query, params);
    if (rows.length === 0) {
      throw new Error('No addresses found for the specified city or state.');
    }
    return rows.map(formatAddressRow);
  } catch (err) {
    console.error(`Error executing query by city or state:`, err);
    throw new Error(`Failed to retrieve data: ${err.message}`);
  }
}

export { handleAddressesByCityOrState };