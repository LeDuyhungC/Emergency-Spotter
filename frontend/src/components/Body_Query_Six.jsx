import { useState, useEffect } from 'react';

export default function UserReportsManager() {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [reports, setReports] = useState([]);
  const [editingReport, setEditingReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch all users
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('http://localhost:5002/api/users');
        if (!response.ok) throw new Error('Failed to fetch users');
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Fetch reports when user is selected
  useEffect(() => {
    if (!selectedUserId) return;

    const loadReports = async () => {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch(
            `http://localhost:5002/api/user-reports/${selectedUserId}`
        );
        if (!response.ok) throw new Error('Failed to fetch reports');
        const data = await response.json();
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadReports();
  }, [selectedUserId]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData(e.target);
      const updates = {
        reportId: editingReport.Report_ID,
        emergencyTypeId: formData.get('emergencyTypeId'),
        locationId: formData.get('locationId'),
        dateTime: formData.get('dateTime')
      };

      const response = await fetch('http://localhost:5002/api/update-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Update failed');
      }

      // Refresh reports
      const updatedReports = reports.map(r =>
          r.Report_ID === editingReport.Report_ID ? {
            ...r,
            Emergency_TYPE_ID: updates.emergencyTypeId,
            Location_ID: updates.locationId,
            DATE_TIME: updates.dateTime
          } : r
      );

      setReports(updatedReports);
      setEditingReport(null);
      setSuccess('Report updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <div className="user-reports-manager">
        <h1>User Reports Management</h1>

        {/* User selection */}
        <div className="form-group">
          <label>Select User:</label>
          <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={isLoading}
          >
            <option value="">-- Select a user --</option>
            {users.map(user => (
                <option key={user.UserId} value={user.UserId}>
                  {user.First_Name} {user.Last_Name}
                </option>
            ))}
          </select>
        </div>

        {/* Status messages */}
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        {isLoading && <div className="loading">Loading...</div>}

        {/* Reports table */}
        {reports.length > 0 && (
            <div className="reports-container">
              <h2>User Reports</h2>
              <table className="reports-table">
                <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Emergency</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {reports.map(report => (
                    <tr key={report.Report_ID}>
                      <td>{report.Report_ID}</td>
                      <td>{report.Report_Date}</td>
                      <td>{report.Report_Time}</td>
                      <td>{report.Emergency_Description}</td>
                      <td>{report.Location_Address}</td>
                      <td>
                        <button
                            onClick={() => setEditingReport(report)}
                            disabled={isLoading}
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}

        {/* Edit Form */}
        {editingReport && (
            <div className="edit-form">
              <h2>Edit Report #{editingReport.Report_ID}</h2>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label>Emergency Type ID:</label>
                  <input
                      type="number"
                      name="emergencyTypeId"
                      defaultValue={editingReport.Emergency_TYPE_ID}
                      required
                      min="1"
                  />
                </div>

                <div className="form-group">
                  <label>Location ID:</label>
                  <input
                      type="number"
                      name="locationId"
                      defaultValue={editingReport.Location_ID}
                      required
                      min="1"
                  />
                </div>

                <div className="form-group">
                  <label>Date & Time:</label>
                  <input
                      type="datetime-local"
                      name="dateTime"
                      defaultValue={editingReport.DATE_TIME ?
                          editingReport.DATE_TIME.replace(' ', 'T').substring(0, 16) : ''}
                      required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                      type="button"
                      onClick={() => setEditingReport(null)}
                      disabled={isLoading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
        )}
      </div>
  );
}