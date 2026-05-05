import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { consumptionAPI } from '../services/apiService';
import { Card, Button, Loading, ErrorMessage } from '../components/UI';
import '../styles/Consumption.css';
import { formatters } from '../utils/helpers';

const ConsumptionPage = () => {
    const { user } = useAuth();
    const [consumption, setConsumption] = useState(null);
    const [trend, setTrend] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedPeriod, setSelectedPeriod] = useState('daily');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        loadConsumptionData();
    }, [selectedPeriod, selectedDate]);

    const navigate = useNavigate();

    const loadConsumptionData = async () => {
        if (!user?.userId) {
            setError('Please sign in to view consumption data.');
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');
        try {
            let response;
            if (selectedPeriod === 'daily') {
                response = await consumptionAPI.getDailyConsumption(user.userId, selectedDate);
            } else if (selectedPeriod === 'monthly') {
                const [year, month] = selectedDate.split('-');
                response = await consumptionAPI.getMonthlyConsumption(user.userId, year, month);
            }
            setConsumption(response);

            // Load trend
            const trendRes = await consumptionAPI.getTrend(user.userId, 30);
            setTrend(trendRes.trendData || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load consumption data');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadReport = () => {
        const data = consumption ? `Consumption Report\n${selectedDate}\nTotal: ${consumption.totalConsumption || 0} kWh` : 'No data';
        const blob = new Blob([data], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `consumption-report-${selectedDate}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleViewAnalytics = () => {
        navigate(`/reports?date=${selectedDate}&reportType=${selectedPeriod}`);
    };

    if (loading) return <Loading />;

    return (
        <div className="consumption-page">
            <h1>Energy Consumption</h1>

            {error && <ErrorMessage message={error} />}

            <div className="consumption-controls">
                <div className="period-selector">
                    <label>Period:</label>
                    <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)}>
                        <option value="daily">Daily</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>

                <div className="date-picker">
                    <label>Date:</label>
                    <input 
                        type={selectedPeriod === 'daily' ? 'date' : 'month'}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="consumption-summary">
                <Card>
                    <h2>Total Consumption</h2>
                    <p className="consumption-value">
                        {formatters.formatEnergy(consumption?.totalConsumption || 0)}
                    </p>
                    <p className="consumption-subtext">
                        {selectedPeriod === 'daily' ? 'Today' : 'This Month'}
                    </p>
                </Card>

                {selectedPeriod === 'daily' && (
                    <Card>
                        <h2>Average Per Hour</h2>
                        <p className="consumption-value">
                            {consumption?.count > 0 
                                ? formatters.formatEnergy((consumption.totalConsumption / consumption.count).toFixed(2))
                                : '0 kWh'
                            }
                        </p>
                        <p className="consumption-subtext">
                            {consumption?.count || 0} records
                        </p>
                    </Card>
                )}
            </div>

            <Card className="consumption-chart">
                <h2>Consumption Trend (Last 30 Days)</h2>
                <div className="chart-placeholder">
                    <table className="consumption-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Consumption (kWh)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {trend.slice(0, 10).map((item, idx) => (
                                <tr key={idx}>
                                    <td>{formatters.formatDate(item.date)}</td>
                                    <td>{formatters.formatEnergy(item.consumption)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="consumption-actions">
                <Button variant="primary" onClick={handleDownloadReport}>Download Report</Button>
                <Button variant="primary" onClick={handleViewAnalytics}>View Detailed Analytics</Button>
            </div>
        </div>
    );
};

export default ConsumptionPage;
