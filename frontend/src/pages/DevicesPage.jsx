import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { deviceAPI } from '../services/apiService';
import { Card, Button, Input, Select, Loading, ErrorMessage, SuccessMessage } from '../components/UI';
import '../styles/Devices.css';
import { formatters } from '../utils/helpers';

const DevicesPage = () => {
    const { user } = useAuth();
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingDevice, setEditingDevice] = useState(null);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [formData, setFormData] = useState({
        deviceName: '',
        deviceId: '',
        deviceType: 'Meter',
        location: '',
        installationDate: '',
        dailyBudget: '',
        monthlyBudget: ''
    });
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        loadDevices();
    }, [page]);

    const loadDevices = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await deviceAPI.getDevices(user.userId, 10, page);
            setDevices(response.data || []);
            setTotal(response.pagination?.total || 0);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load devices');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editingDevice) {
                await deviceAPI.updateDevice(editingDevice._id, formData);
                setSuccess('Device updated successfully!');
            } else {
                await deviceAPI.createDevice(user.userId, formData);
                setSuccess('Device added successfully!');
            }

            setFormData({
                deviceName: '',
                deviceId: '',
                deviceType: 'Meter',
                location: '',
                installationDate: '',
                dailyBudget: '',
                monthlyBudget: ''
            });
            setEditingDevice(null);
            setShowForm(false);
            loadDevices();
        } catch (err) {
            setError(err.response?.data?.message || (editingDevice ? 'Failed to update device' : 'Failed to add device'));
        }
    };

    const handleEdit = (device) => {
        setEditingDevice(device);
        setFormData({
            deviceName: device.deviceName || '',
            deviceId: device.deviceId || '',
            deviceType: device.deviceType || 'Meter',
            location: device.location || '',
            installationDate: device.installationDate ? device.installationDate.split('T')[0] : '',
            dailyBudget: device.dailyBudget || '',
            monthlyBudget: device.monthlyBudget || ''
        });
        setShowForm(true);
    };

    const handleCancelEdit = () => {
        setEditingDevice(null);
        setFormData({
            deviceName: '',
            deviceId: '',
            deviceType: 'Meter',
            location: '',
            installationDate: '',
            dailyBudget: '',
            monthlyBudget: ''
        });
        setShowForm(false);
        setError('');
        setSuccess('');
    };

    const handleViewDetails = async (deviceId) => {
        setError('');
        setSuccess('');
        setSelectedDevice(null);
        setDetailsLoading(true);

        try {
            const response = await deviceAPI.getDevice(deviceId);
            setSelectedDevice(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load device details');
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleDelete = async (deviceId) => {
        if (window.confirm('Are you sure you want to delete this device?')) {
            try {
                await deviceAPI.deleteDevice(deviceId);
                setSuccess('Device deleted successfully!');
                if (selectedDevice?._id === deviceId) {
                    setSelectedDevice(null);
                }
                loadDevices();
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to delete device');
            }
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="devices-page">
            <h1>Device Management</h1>

            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}

            <div className="page-header">
                <Button variant="primary" onClick={() => {
                    if (showForm && editingDevice) {
                        handleCancelEdit();
                    } else {
                        setShowForm(!showForm);
                    }
                }}>
                    {showForm ? (editingDevice ? 'Cancel Edit' : 'Cancel') : '+ Add Device'}
                </Button>
            </div>

            {showForm && (
                <Card className="add-device-form">
                    <h2>{editingDevice ? 'Edit Device' : 'Add New Device'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <Input 
                                label="Device Name"
                                name="deviceName"
                                value={formData.deviceName}
                                onChange={handleInputChange}
                                placeholder="e.g., Home Main Meter"
                                required
                            />
                            <Input 
                                label="Device ID"
                                name="deviceId"
                                value={formData.deviceId}
                                onChange={handleInputChange}
                                placeholder="e.g., METER001"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <Select 
                                label="Device Type"
                                name="deviceType"
                                value={formData.deviceType}
                                onChange={handleInputChange}
                                options={[
                                    { value: 'Meter', label: 'Meter' },
                                    { value: 'Smart Plug', label: 'Smart Plug' },
                                    { value: 'Circuit Breaker', label: 'Circuit Breaker' },
                                    { value: 'Solar Panel', label: 'Solar Panel' },
                                    { value: 'Battery', label: 'Battery' }
                                ]}
                            />
                            <Input 
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="e.g., Living Room"
                                required
                            />
                        </div>

                        <div className="form-row">
                            <Input 
                                label="Installation Date"
                                name="installationDate"
                                type="date"
                                value={formData.installationDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <Input 
                                label="Daily Budget (kWh)"
                                name="dailyBudget"
                                type="number"
                                value={formData.dailyBudget}
                                onChange={handleInputChange}
                                placeholder="e.g., 50"
                            />
                            <Input 
                                label="Monthly Budget (kWh)"
                                name="monthlyBudget"
                                type="number"
                                value={formData.monthlyBudget}
                                onChange={handleInputChange}
                                placeholder="e.g., 1500"
                            />
                        </div>

                        <Button variant="primary">
                            {editingDevice ? 'Save Changes' : 'Add Device'}
                        </Button>
                        {editingDevice && (
                            <Button variant="secondary" type="button" onClick={handleCancelEdit}>
                                Cancel Edit
                            </Button>
                        )}
                    </form>
                </Card>
            )}

            <div className="devices-list">
                {devices.length > 0 ? (
                    devices.map(device => (
                        <Card key={device._id} className="device-item">
                            <div className="device-header">
                                <div>
                                    <h3>{device.deviceName}</h3>
                                    <p className="device-id">ID: {device.deviceId}</p>
                                </div>
                                <span className={`status-badge ${device.status.toLowerCase()}`}>
                                    {device.status}
                                </span>
                            </div>

                            <div className="device-details">
                                <p><strong>Type:</strong> {device.deviceType}</p>
                                <p><strong>Location:</strong> {device.location}</p>
                                <p><strong>Current Reading:</strong> {formatters.formatEnergy(device.currentReading)}</p>
                                {device.isOnline ? (
                                    <p className="online">🟢 Online</p>
                                ) : (
                                    <p className="offline">🔴 Offline</p>
                                )}
                            </div>

                            <div className="device-actions">
                                <Button variant="secondary" onClick={() => handleViewDetails(device._id)}>
                                View Details
                            </Button>
                                <Button variant="secondary" onClick={() => handleEdit(device)}>Edit</Button>
                                <Button 
                                    variant="danger"
                                    onClick={() => handleDelete(device._id)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </Card>
                    ))
                ) : (
                    <p>No devices found. Add one to get started!</p>
                )}
            </div>

            {selectedDevice && (
                <Card className="device-detail-card">
                    <div className="detail-card-header">
                        <h2>Device Details</h2>
                        <Button variant="secondary" onClick={() => setSelectedDevice(null)}>
                            Close
                        </Button>
                    </div>

                    {detailsLoading ? (
                        <Loading />
                    ) : (
                        <div className="device-detail-grid">
                            <div><strong>Name:</strong> {selectedDevice.deviceName}</div>
                            <div><strong>ID:</strong> {selectedDevice.deviceId}</div>
                            <div><strong>Type:</strong> {selectedDevice.deviceType}</div>
                            <div><strong>Location:</strong> {selectedDevice.location}</div>
                            <div><strong>Status:</strong> {selectedDevice.status}</div>
                            <div><strong>Online:</strong> {selectedDevice.isOnline ? 'Yes' : 'No'}</div>
                            <div><strong>Current Reading:</strong> {formatters.formatEnergy(selectedDevice.currentReading)}</div>
                            <div><strong>Last Online:</strong> {selectedDevice.lastOnlineTime ? new Date(selectedDevice.lastOnlineTime).toLocaleString() : 'N/A'}</div>
                            <div><strong>Installation Date:</strong> {selectedDevice.installationDate ? new Date(selectedDevice.installationDate).toLocaleDateString() : 'N/A'}</div>
                            <div><strong>Daily Budget:</strong> {selectedDevice.dailyBudget ? `${selectedDevice.dailyBudget} kWh` : 'N/A'}</div>
                            <div><strong>Monthly Budget:</strong> {selectedDevice.monthlyBudget ? `${selectedDevice.monthlyBudget} kWh` : 'N/A'}</div>
                            <div><strong>Manufacturer:</strong> {selectedDevice.manufacturer || 'N/A'}</div>
                            <div><strong>Model:</strong> {selectedDevice.model || 'N/A'}</div>
                            <div><strong>Serial Number:</strong> {selectedDevice.serialNumber || 'N/A'}</div>
                            <div><strong>Max Capacity:</strong> {selectedDevice.maxCapacity ? `${selectedDevice.maxCapacity} kWh` : 'N/A'}</div>
                            <div><strong>Alerts Enabled:</strong> {selectedDevice.alertEnabled ? 'Yes' : 'No'}</div>
                            <div><strong>Notes:</strong> {selectedDevice.notes || 'None'}</div>
                        </div>
                    )}
                </Card>
            )}

            {total > 10 && (
                <div className="pagination">
                    <Button 
                        variant="secondary" 
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span>Page {page} of {Math.ceil(total / 10)}</span>
                    <Button 
                        variant="secondary"
                        onClick={() => setPage(page + 1)}
                        disabled={page >= Math.ceil(total / 10)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default DevicesPage;
