import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Query 5: Reports by Emergency Type
const Query5 = () => {
  const [emergencyType, setEmergencyType] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResults([]);

    if (!emergencyType.trim()) {
      setError('Please enter an emergency type.');
      setIsLoading(false);
      return;
    }

    try {
      const url = `http://localhost:5002/api/reportsByType?param=${encodeURIComponent(emergencyType)}`;
      const response = await fetch(url);
      const data = await response.json();

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
    if (results.length === 0 && !isLoading && !error) return <p>No results found or search not yet performed.</p>;
    if (results.length === 0 && !isLoading && error) return null;
    if (results.length === 0) return null;

    const headers = Object.keys(results[0]);

    return (
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            {headers.map(header => (
              <th key={header} className="border border-black p-2">
                {header.replace(/_/g, ' ').toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {results.map((tuple, tupleIndex) => (
            <tr key={tupleIndex}>
              {headers.map(header => (
                <td key={`${tupleIndex}-${header}`} className="border border-black p-2">
                  {tuple[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-center mb-4">Reports by Emergency Type</h1>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col w-64">
          <label htmlFor="emergencyType" className="text-lg">Enter Emergency Type:</label>
          <input
            type="text"
            id="emergencyType"
            value={emergencyType}
            onChange={(e) => setEmergencyType(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            placeholder="e.g., Fire, Flood, Tornado"
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      <div className="mt-6">
        {isLoading && <p className="text-center">Loading results...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!isLoading && renderTable()}
      </div>
      <div className="text-center mt-6">
        <Link to="/" className="text-blue-500 hover:underline">Back to Main Page</Link> |{' '}
        <Link to="/query5" className="text-blue-500 hover:underline">New Search</Link>
      </div>
    </div>
  );
};

export default Query5;