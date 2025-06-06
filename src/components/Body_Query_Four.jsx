import { useState } from 'react';

export default function Body_Query_Four() {
    const [emergencyParam, setEmergencyParam] = useState('');
    const [showAll, setShowAll] = useState(false);
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setResults([]);

        const param = showAll ? '' : emergencyParam.trim();
        if (!showAll && !param) {
            setError('Please enter an emergency description or select "Show All".');
            setIsLoading(false);
            return;
        }

        try {
            const url = `http://localhost:5002/api/reportsByEmergencyCount?param=${encodeURIComponent(param)}${showAll ? '&showAll=true' : ''}`;
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
        if (results.length === 0 && !isLoading && error) return <p>Error: {error}</p>;
        if (results.length === 0) return null;

        const headers = Object.keys(results[0]);

        return (
            <table>
                <thead>
                <tr>
                    {headers.map(header => <th key={header}>{header.replace(/_/g, ' ').toUpperCase()}</th>)}
                </tr>
                </thead>
                <tbody>
                {results.map((tuple, tupleIndex) => (
                    <tr key={tupleIndex}>
                        {headers.map(header => <td key={`${tupleIndex}-${header}`}>{tuple[header]}</td>)}
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="query-container">
            <h1>Reports by Emergency Description Count</h1>
            <form onSubmit={handleSearch} className="query-form">
                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={showAll}
                            onChange={(e) => setShowAll(e.target.checked)}
                        /> Show All Emergencies
                    </label>
                </div>
                {!showAll && (
                    <div className="form-group">
                        <label htmlFor="emergencyParam">Enter Emergency Description:</label>
                        <input
                            type="text"
                            id="emergencyParam"
                            value={emergencyParam}
                            onChange={(e) => setEmergencyParam(e.target.value)}
                            placeholder="e.g., fire, water leak"
                            disabled={showAll}
                        />
                    </div>
                )}
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Searching...' : 'Search'}
                </button>
            </form>
            <div className="results-container">
                {isLoading && <p>Loading results...</p>}
                {!isLoading && renderTable()}
            </div>
        </div>
    );
}