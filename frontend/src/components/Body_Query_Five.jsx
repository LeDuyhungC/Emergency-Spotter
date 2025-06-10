import { useState } from 'react';

export default function Body_Query_UsersByRoleAndCity() {
  const [roleParam, setRoleParam] = useState('');
  const [cityIdParam, setCityIdParam] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResults([]);

    if (!roleParam.trim()) {
      setError('Please enter a role.');
      setIsLoading(false);
      return;
    }
    if (!cityIdParam.trim() || isNaN(cityIdParam) || Number(cityIdParam) <= 0) {
      setError('Please enter a valid City ID (positive number).');
      setIsLoading(false);
      return;
    }

    try {
      const url = `http://localhost:5002/api/usersByRoleAndCity?role=${encodeURIComponent(roleParam)}&cityId=${encodeURIComponent(cityIdParam)}`;
      const response = await fetch(url);
      // Log the raw response for debugging
      const text = await response.text();
      console.log('Raw response:', text);
      
      // Attempt to parse as JSON
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        throw new Error('Server did not return valid JSON: ' + text.substring(0, 50));
      }

      if (!response.ok) throw new Error(data.error || 'Failed to fetch data');

      setResults(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTable = () => {
    if (results.length === 0 && !isLoading && !error) return <p>No users found or search not yet performed.</p>;
    if (results.length === 0 && !isLoading && error) return null;
    if (results.length === 0) return null;

    const headers = ['ID', 'First_Name', 'Last_Name', 'Role', 'Address', 'City_ID'];

    return (
      <table className="table table-dark table-striped table-hover">
        <thead>
          <tr>
            {headers.map(header => <th key={header}>{header.replace(/_/g, ' ').toUpperCase()}</th>)}
          </tr>
        </thead>
        <tbody>
          {results.map((user, index) => (
            <tr key={index}>
              <td>{user.ID}</td>
              <td>{user.First_Name}</td>
              <td>{user.Last_Name}</td>
              <td>{user.Role}</td>
              <td>{user.Address}</td>
              <td>{user.City_ID}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="query-container">
      <h1>Search Users by Role and City</h1>
      <form onSubmit={handleSearch} className="query-form mb-4">
        <div className="form-group">
          <label htmlFor="roleParam">Enter Role:</label>
          <input
            type="text"
            id="roleParam"
            value={roleParam}
            onChange={(e) => setRoleParam(e.target.value)}
            placeholder="e.g., Volunteer"
          />
        </div>
        <div className="form-group">
          <label htmlFor="cityIdParam">Enter City ID:</label>
          <input
            type="text"
            id="cityIdParam"
            value={cityIdParam}
            onChange={(e) => setCityIdParam(e.target.value)}
            placeholder="e.g., 1"
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
        <a href="home">Back to Main Page</a>
      </form>
      <div className="results-container">
        {isLoading && <p>Loading results...</p>}
        {error && <p className="error">{error}</p>}
        {!isLoading && (
            <div className='table-responsive'>
                {renderTable()}
            </div>
        )}
      </div>
    </div>
  );
}