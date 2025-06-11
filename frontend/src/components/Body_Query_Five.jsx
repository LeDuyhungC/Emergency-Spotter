import { useState } from 'react';


export default function Body_Query_AddressesByCityOrState() {
  const [cityOrState, setCityOrState] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResults([]);

    if (!cityOrState.trim()) {
      setError('Please enter a city or state.');
      setIsLoading(false);
      return;
    }

    try {
      const url = `http://localhost:5004/api/addressesByCityOrState?cityOrState=${encodeURIComponent(cityOrState)}`;
      const response = await fetch(url);
      const text = await response.text();
      console.log('Raw response:', text);

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
    if (results.length === 0 && !isLoading && !error) return <p>No addresses found or search not yet performed.</p>;
    if (results.length === 0 && !isLoading && error) return null;
    if (results.length === 0) return null;

    const headers = ['Address', 'Population', 'Max Population', 'Difference'];

    return (
      <table className="results-table">
        <thead>
          <tr>
            {headers.map(header => <th key={header}>{header.replace(/_/g, ' ')}</th>)}
          </tr>
        </thead>
        <tbody>
          {results.map((row, index) => (
            <tr key={index}>
              <td>{row.Address}</td>
              <td>{row.Population}</td>
              <td>{row.Max_Population}</td>
              <td>{row.Difference}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="query-container">
      <h1>Search Addresses by City or State</h1>
      <form onSubmit={handleSearch} className="query-form">
        <div className="form-group">
          <label htmlFor="cityOrState">Enter City or State:</label>
          <input
            type="text"
            id="cityOrState"
            value={cityOrState}
            onChange={(e) => setCityOrState(e.target.value)}
            placeholder="e.g., Seattle or WA"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
        <a href="index.html">Back to Main Page</a>
      </form>
      <div className="results-container">
        {isLoading && <p>Loading results...</p>}
        {error && <p className="error">{error}</p>}
        {!isLoading && renderTable()}
      </div>
    </div>
  );
}



