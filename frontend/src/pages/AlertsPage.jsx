import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { alertAPI } from '../services/apiService';
import { Card, Button, Loading, ErrorMessage, SuccessMessage } from '../components/UI';
import '../styles/Alerts.css';
import { formatters } from '../utils/helpers';

const AlertsPage = () => {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filterResolved, setFilterResolved] = useState('all');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        loadAlerts();
    }, [filterResolved, page]);

    const loadAlerts = async () => {
        setLoading(true);
        setError('');
        try {
            const isResolved = filterResolved === 'all' ? null : filterResolved === 'resolved';
            const response = await alertAPI.getAlerts(user.userId, 20, page, isResolved);
            setAlerts(response.data || []);
            setTotal(response.pagination?.total || 0);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load alerts');
        } finally {
            setLoading(false);
        }
    };

    const handleResolveAlert = async (alertId) => {
        try {
            await alertAPI.resolveAlert(alertId, user.userId, 'Resolved');
            setSuccess('Alert marked as resolved!');
            loadAlerts();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to resolve alert');
        }
    };

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'Critical': return 'critical';
            case 'High': return 'high';
            case 'Medium': return 'medium';
            case 'Low': return 'low';
            default: return 'info';
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="alerts-page">
            <h1>Alerts & Notifications</h1>

            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}

            <div className="alerts-filter">
                <select 
                    value={filterResolved} 
                    onChange={(e) => {
                        setFilterResolved(e.target.value);
                        setPage(1);
                    }}
                >
                    <option value="all">All Alerts</option>
                    <option value="unresolved">Unresolved Only</option>
                    <option value="resolved">Resolved Only</option>
                </select>
            </div>

            <div className="alerts-list">
                {alerts.length > 0 ? (
                    alerts.map(alert => (
                        <Card key={alert._id} className={`alert-card severity-${getSeverityColor(alert.severity)}`}>
                            <div className="alert-header">
                                <div>
                                    <h3>{alert.title}</h3>
                                    <p className="alert-type">{alert.alertType}</p>
                                </div>
                                <div className="alert-status">
                                    <span className={`severity-badge ${getSeverityColor(alert.severity)}`}>
                                        {alert.severity}
                                    </span>
                                    <span className={`status-badge ${alert.isResolved ? 'resolved' : 'unresolved'}`}>
                                        {alert.isResolved ? '✓ Resolved' : '⚠ Unresolved'}
                                    </span>
                                </div>
                            </div>

                            <div className="alert-body">
                                <p>{alert.description}</p>
                                <p className="alert-time">
                                    {formatters.formatDateTime(alert.createdAt)}
                                </p>
                            </div>

                            {!alert.isResolved && (
                                <div className="alert-actions">
                                    <Button 
                                        variant="success"
                                        onClick={() => handleResolveAlert(alert._id)}
                                    >
                                        Mark as Resolved
                                    </Button>
                                </div>
                            )}
                        </Card>
                    ))
                ) : (
                    <p className="no-alerts">No alerts found. Your system is running smoothly! 🎉</p>
                )}
            </div>

            {total > 20 && (
                <div className="pagination">
                    <Button 
                        variant="secondary" 
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span>Page {page} of {Math.ceil(total / 20)}</span>
                    <Button 
                        variant="secondary"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= Math.ceil(total / 20)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AlertsPage;
