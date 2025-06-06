import { useState } from 'react';

export default function Body_Query_Three() {
    const [locationParam, setLocationParam] = useState(''); // Changed to location
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setResults([]);

        if (!locationParam.trim()) {
            setError('Please enter a location.');
            setIsLoading(false);
            return;
        }

        try {
            const url = `http://localhost:5002/api/reportsByLocation?param=${encodeURIComponent(locationParam)}`;
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
            <h1>Info of Reports by Location</h1>
            <form onSubmit={handleSearch} className="query-form">
                <div className="form-group">
                    <label htmlFor="locationParam">Enter Location:</label>
                    <input
                        type="text"
                        id="locationParam"
                        value={locationParam}
                        onChange={(e) => setLocationParam(e.target.value)}
                        placeholder="e.g., 123 Main St"
                    />
                </div>
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