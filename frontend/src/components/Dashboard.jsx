import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { deviceAPI } from '../services/apiService';
import StatCard from './StatCard';
import { Card, Button, Loading, ErrorMessage } from './UI';
import '../styles/Dashboard.css';
import { formatters, calculations } from '../utils/helpers';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user?.userId) {
            loadDashboardData();
        }
    }, [user?.userId]);

    const loadDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const devicesRes = await deviceAPI.getDevices(user.userId, 5, 1);
            setDevices(devicesRes.data || []);
            
            // Calculate stats
            const totalDevices = devicesRes.pagination?.total || 0;
            const activeDevices = devicesRes.data?.filter(d => d.status === 'Active').length || 0;
            
            setStats({
                totalDevices,
                activeDevices,
                totalConsumption: '0 kWh',
                averageConsumption: '0 kWh'
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'}, {user?.name}!</h1>
                    <p>Here's your energy overview</p>
                </div>
                <div className="dashboard-date">
                    {new Date().toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </div>
            </div>
            
            <div className="stats-grid">
                <StatCard 
                    title="Total Devices" 
                    value={stats?.totalDevices || 0}
                    icon="🖥️"
                    color="blue"
                    trend="+2 this week"
                />
                <StatCard 
                    title="Active Devices" 
                    value={stats?.activeDevices || 0}
                    icon="✓"
                    color="green"
                    trend="All systems operational"
                />
                <StatCard 
                    title="Today's Usage" 
                    value={stats?.totalConsumption || '0 kWh'}
                    icon="⚡"
                    color="yellow"
                    trend="12% less than yesterday"
                />
                <StatCard 
                    title="Monthly Savings" 
                    value="₱47.23"
                    icon="💰"
                    color="purple"
                    trend="Great job!"
                />
            </div>

            <div className="dashboard-main">
                <div className="recent-activity">
                    <h2>Recent Activity</h2>
                    {devices.length > 0 ? (
                        <div className="activity-list">
                            {devices.slice(0, 3).map(device => (
                                <Link key={device._id} to="/devices" className="activity-item-link">
                                    <div className="activity-item">
                                        <div className="activity-icon">
                                            {device.deviceType === 'Meter' ? '📊' : '💡'}
                                        </div>
                                        <div className="activity-content">
                                            <h4>{device.deviceName}</h4>
                                            <p>{device.location} • {device.isOnline ? 'Online' : 'Offline'}</p>
                                            <span className="activity-time">2 hours ago</span>
                                        </div>
                                        <div className="activity-value">
                                            {formatters.formatEnergy(device.currentReading)}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📈</div>
                            <h3>No devices yet</h3>
                            <p>Add your first device to start monitoring</p>
                            <Button variant="primary" onClick={() => window.location.href = '/devices'}>
                                Add Device
                            </Button>
                        </div>
                    )}
                </div>

                <div className="quick-actions">
                    <h2>Quick Actions</h2>
                    <div className="action-buttons">
                        <Button variant="primary" className="action-btn" onClick={() => window.location.href = '/devices'}>
                            📱 Manage Devices
                        </Button>
                        <Button variant="secondary" className="action-btn" onClick={() => window.location.href = '/consumption'}>
                            📊 View Usage
                        </Button>
                        <Button variant="secondary" className="action-btn" onClick={() => window.location.href = '/alerts'}>
                            🔔 Check Alerts
                        </Button>
                        <Button variant="secondary" className="action-btn" onClick={() => window.location.href = '/reports'}>
                            📋 Generate Report
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
