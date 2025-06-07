import { useState, useEffect } from 'react';

export default function Body_Query_Six() {
  const [userId, setUserId] = useState('');
  const [emergencyId, setEmergencyId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [users, setUsers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Fetch dropdown data on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [usersRes, locationsRes, emergenciesRes] = await Promise.all([
          fetch('http://localhost:5002/api/users'),
          fetch('http://localhost:5002/api/locations'),
          fetch('http://localhost:5002/api/emergencies')
        ]);
        const usersData = await usersRes.json();
        const locationsData = await locationsRes.json();
        const emergenciesData = await emergenciesRes.json();
        setUsers(usersData);
        setLocations(locationsData);
        setEmergencies(emergenciesData);
      } catch (err) {
        setError('Failed to load dropdown data: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    if (!userId.trim() || isNaN(userId) || Number(userId) <= 0) {
      setError('Please enter or select a valid User ID (positive number).');
      setIsLoading(false);
      return;
    }
    if (!emergencyId.trim() || isNaN(emergencyId) || Number(emergencyId) <= 0) {
      setError('Please enter or select a valid Emergency ID (positive number).');
      setIsLoading(false);
      return;
    }
    if (!locationId.trim() || isNaN(locationId) || Number(locationId) <= 0) {
      setError('Please enter or select a valid Location ID (positive number).');
      setIsLoading(false);
      return;
    }

    try {
      const url = `http://localhost:5002/api/submitEmergencyReport?userId=${encodeURIComponent(userId)}&emergencyId=${encodeURIComponent(emergencyId)}&locationId=${encodeURIComponent(locationId)}`;
      const response = await fetch(url, { method: 'POST' });
      const text = await response.text();
      console.log('Raw response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        throw new Error('Server did not return valid JSON: ' + text.substring(0, 50));
      }

      if (!response.ok) throw new Error(data.error || 'Transaction failed');

      setResult(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setResult({ success: false, message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const renderResult = () => {
    if (!result && !isLoading && !error) return <p className="text-gray-600">Enter or select details to submit a report.</p>;
    if (!result) return null;

    return (
        <div className="mt-4">
          {result.success ? (
              <p className="text-green-600">
                Transaction Successful: {result.message}<br />
                Report ID: {result.reportId}<br />
                Updated User Reports: {result.updatedUserReports}
              </p>
          ) : (
              <p className="text-red-600">
                {/* Transaction Failed: {result.message}*/}
              </p>
          )}
        </div>
    );
  };

  return (
      <div className="query-container">
        <h1 className="text-2xl font-bold mb-4 text-center">Submit Emergency Report</h1>
        <div className="query-form space-y-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">Select or Enter User ID:</label>
            <select
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a User</option>
              {users.map(user => (
                  <option key={user.Id} value={user.Id}>
                    {user.Id} - {user.First_Name} {user.Last_Name} ({user.Email})
                  </option>
              ))}
            </select>
            <input
                type="text"
                id="userIdInput"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Or type User ID (e.g., 1)"
                className="mt-2 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="emergencyId" className="block text-sm font-medium text-gray-700">Select or Enter Emergency ID:</label>
            <select
                id="emergencyId"
                value={emergencyId}
                onChange={(e) => setEmergencyId(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an Emergency</option>
              {emergencies.map(emergency => (
                  <option key={emergency.Id} value={emergency.Id}>
                    {emergency.Id} - {emergency.Description}
                  </option>
              ))}
            </select>
            <input
                type="text"
                id="emergencyIdInput"
                value={emergencyId}
                onChange={(e) => setEmergencyId(e.target.value)}
                placeholder="Or type Emergency ID (e.g., 1)"
                className="mt-2 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="locationId" className="block text-sm font-medium text-gray-700">Select or Enter Location ID:</label>
            <select
                id="locationId"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a Location</option>
              {locations.map(location => (
                  <option key={location.Id} value={location.Id}>
                    {location.Id} - {location.Address}
                  </option>
              ))}
            </select>
            <input
                type="text"
                id="locationIdInput"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                placeholder="Or type Location ID (e.g., 1)"
                className="mt-2 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? 'Submitting...' : 'Submit Report'}
          </button>
          <a href="home" className="block text-center text-blue-500 hover:underline">Back to Main Page</a>
        </div>
        <div className="results-container mt-4">
          {isLoading && <p className="text-gray-600">Processing transaction...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!isLoading && renderResult()}
        </div>
      </div>
  );
}