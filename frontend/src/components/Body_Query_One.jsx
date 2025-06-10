//Le
import { useState } from 'react';

export default function Body_Query_One() {
    const [dateParam, setDateParam] = useState(''); // This will be the date
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setResults([]);

        if (!dateParam.trim()) { // Simplified validation
            setError('Please select a date.');
            setIsLoading(false);
            return;
        }

        try {
        const url = `http://localhost:5002/api/reportsByDate?param=${encodeURIComponent(dateParam)}`; // --> encodeURIComponent(dateParam)

        const response = await fetch(url); // fetching information from data base
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to fetch data');

        setResults(data); // useState function to change the value of the result
        setError('');
        } catch (err) {
        setError(err.message);
        } finally { // exectutes no matter what even when funneled into try or catch
        setIsLoading(false);
        }
    };

    const renderTable = () => {
        //returns faulty returns, checks if the state of the query is still loading, and error with retrieving.
        if (results.length === 0 && !isLoading && !error) return <p>No results found or search not yet performed.</p>;
        if (results.length === 0 && !isLoading && error) return null; // Don't show "No results" if there's an error
        if (results.length === 0) return null;


        const headers = Object.keys(results[0]); //Retrieves all the Column headers identifying the Object's keys that is retrieved from DB

        /* 
        headers.map
        Lays out the table headers (th) for the table, key={header} react prop that lists elements as long as they are unique
        Each iteration it takes the header key replaces the _ in the DB column headers and replace them with spaces instead.

        results.map
        Is a inner map that uses the header is the current columns name in the iteration
        */
        return (
            <table className="table table-dark table-striped table-hover">
                    <thead>
                        <tr>
                            {
                                headers.map(
                                    header => <th key={header}>{header.replace(/_/g, ' ').toUpperCase()}</th>
                                )
                            } 
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
            <h3>Info of Reports in a Day</h3>
            <form onSubmit={handleSearch} className="query-form mb-4">
                
                <div className="form-group">
                <label htmlFor="dateParam">Select Date: </label>
                <input
                    type="date" // Type is always 'date'
                    id="dateParam"
                    value={dateParam}
                    onChange={(e) => setDateParam(e.target.value)}
                />
                </div>
                
                <button type="submit" className="btn btn-primary mt-3" disabled={isLoading}>
                {isLoading ? 'Searching...' : 'Search'}
                </button>
            </form>
            <div className="results-container">
                {isLoading && <p>Loading results...</p>}
                {!isLoading && results.length > 0 && (
                    <div className="table-responsive"> 
                        {renderTable()}
                    </div>
                )}
            </div>

            {!isLoading && results.length === 0 && <p>No results found for the selected date.</p>}
        </div>
    );
}