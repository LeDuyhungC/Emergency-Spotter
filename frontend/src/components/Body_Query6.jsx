import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Query 6: Transfer Funds for Emergency Response (Transaction)

const Query6 = () => {
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    // Client-side validation
    if (!fromAccount || !toAccount || !amount || amount <= 0) {
      setError('Please provide valid account IDs and a positive amount.');
      setIsLoading(false);
      return;
    }
    if (fromAccount === toAccount) {
      setError('Source and destination accounts must be different.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5002/api/transferFunds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fromAccount, toAccount, amount: parseFloat(amount) })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Transaction failed');
      
      if (data.success) {
        setResult(data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTable = () => {
    if (!result || !result.success) return null;

    return (
      <table className="table table-dark table-striped table-hover">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-black p-2">Account ID</th>
            <th className="border border-black p-2">Name</th>
            <th className="border border-black p-2">Balance</th>
          </tr>
        </thead>
        <tbody>
          {result.accounts.map(account => (
            <tr key={account.account_id}>
              <td className="border border-black p-2">{account.account_id}</td>
              <td className="border border-black p-2">{account.name}</td>
              <td className="border border-black p-2">${account.balance.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100">
      <h3>
        Query 6: Transfer Funds for Emergency Response
      </h3>
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col w-64">
          <label className="text-lg">From Account ID:</label>
          <input
            type="number"
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="flex flex-col w-64">
          <label className="text-lg">To Account ID:</label>
          <input
            type="number"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="flex flex-col w-64">
          <label className="text-lg">Amount to Transfer:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0.01"
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="btn btn-primary mt-3"
        >
          {isLoading ? 'Processing...' : 'Transfer Funds'}
        </button>
      </div>
      
      {isLoading && <p className="text-center mt-4">Processing transaction...</p>}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {result && result.success && (
        <div className="mt-6">
          <p className="text-green-500 text-center">{result.message}</p>
          {(
              <div className='table-responsive'>
                  {renderTable()}
              </div>
          )}
        </div>
      )}
      
      <div className="text-center mt-6">
        <Link to="/" className="text-blue-500 hover:underline">Back to Main Page</Link> |{' '}
        <Link to="/query6" className="text-blue-500 hover:underline">New Transfer</Link>
      </div>
    </div>
  );
};

export default Query6;