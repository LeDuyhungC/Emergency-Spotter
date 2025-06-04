import { useState, useEffect } from 'react';


export default function Body_Query_Two() {
    const [userParam, setUserParam] = useState(''); // This will be the date
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const [employees, setEmployees] = useState([]);
    const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);
    const [employeeError, setEmployeeError] = useState(null);


    useEffect(() => {
        const fetchEmployees = async () => {
            setIsLoadingEmployees(true);
            setEmployeeError(null);
            try {
                const url = 'http://localhost:5002/api/allUsers'
                const response = await fetch(url);
                const errorData = await response.json();
                if (!response.ok) throw new Error(errorData.error || 'Failed to fetch employees list');
                const data = await response.json();
                setEmployees(data);
            } catch (err){
                setEmployeeError(err.message);
                console.error("Error fetching emplolyee:" + err);
            } finally {
                setIsLoadingEmployees(false);
            }
        };
        fetchEmployees();
    }, []);


    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setResults([]);

        if (!userParam.trim()) { // Simplified validation
            setError('Please select a date.');
            setIsLoading(false);
            return;
        }

        try {
            const url = `http://localhost:5002/api/reportsByUserId?param=${encodeURIComponent(userParam)}`; // --> encodeURIComponent(userParam)
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
            <table>
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
        <h1>All reports on User</h1>
        <form onSubmit={handleSearch} className="query-form">
            
            <div className="form-group">
                <label htmlFor="user-select">Select User:</label>
                {isLoadingEmployees && <p>Loading...</p>}
                {employeeError && <p>Error Loading: {employeeError}</p>}
                {!isLoadingEmployees && !employeeError && (
                    <select id='user-select' value={userParam} onChange={(e) => setUserParam(e.target.value)} disabled={isLoadingEmployees || employees.length}>
                        <option value=""> Select User</option>
                        {employees.map((employee) => (
                            <option key={employee.UserId} value={employee.UserId}>
                                {employee.First_Name} {employee.Last_Name}
                            </option>
                        ))}
                    </select>
                )}
            </div>
            
            <button type="submit" disabled={isLoading || !userParam || isLoadingEmployees}>
                {isLoading ? 'Searching...' : 'Search'}
            </button>
        </form>
            <div className="results-container">
                {isLoading && <p>Loading results...</p>}
                {(isLoading || error || results) && renderTable()}
            </div>
        </div>
    );
}