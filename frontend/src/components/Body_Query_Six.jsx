import { useState } from 'react';

export default function Body_Query_Six() {
  const [userId, setUserId] = useState('');
  const [emergencyId, setEmergencyId] = useState('');
  const [locationId, setLocationId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    if (!userId.trim() || isNaN(userId) || Number(userId) <= 0) {
      setError('Please enter a valid User ID (positive number).');
      setIsLoading(false);
      return;
    }
    if (!emergencyId.trim() || isNaN(emergencyId) || Number(emergencyId) <= 0) {
      setError('Please enter a valid Emergency ID (positive number).');
      setIsLoading(false);
      return;
    }
    if (!locationId.trim() || isNaN(locationId) || Number(locationId) <= 0) {
      setError('Please enter a valid Location ID (positive number).');
      setIsLoading(false);
      return;
    }

    try {
      const url = `http://localhost:5004/api/submitEmergencyReport?userId=${encodeURIComponent(userId)}&emergencyId=${encodeURIComponent(emergencyId)}&locationId=${encodeURIComponent(locationId)}`;
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
    if (!result && !isLoading && !error) return <p>Enter details to submit a report.</p>;
    if (!result) return null;

    return (
      <div className="mt-4">
        {result.success ? (
          <p className="success">
            Transaction Successful: {result.message}<br />
            Report ID: {result.reportId}<br />
            Updated User Reports: {result.updatedUserReports}
          </p>
        ) : (
          <p className="error">
            Transaction Failed: {result.message}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="query-container">
      <h1>Submit Emergency Report (Transaction)</h1>
      <form onSubmit={handleSubmit} className="query-form">
        <div className="form-group">
          <label htmlFor="userId">Enter User ID:</label>
          <input
            type="text"
            id="userId"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="e.g., 1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="emergencyId">Enter Emergency ID:</label>
          <input
            type="text"
            id="emergencyId"
            value={emergencyId}
            onChange={(e) => setEmergencyId(e.target.value)}
            placeholder="e.g., 1"
          />
        </div>
        <div className="form-group">
          <label htmlFor="locationId">Enter Location ID:</label>
          <input
            type="text"
            id="locationId"
            value={locationId}
            onChange={(e) => setLocationId(e.target.value)}
            placeholder="e.g., 1"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit Report'}
        </button>
        <a href="home">Back to Main Page</a>
      </form>
      <div className="results-container">
        {isLoading && <p>Processing transaction...</p>}
        {error && <p className="error">{error}</p>}
        {!isLoading && renderResult()}
      </div>
    </div>
  );
}

