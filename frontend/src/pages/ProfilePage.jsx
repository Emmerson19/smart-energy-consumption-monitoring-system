import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/apiService';
import { Card, Button, Input, Loading, ErrorMessage, SuccessMessage } from '../components/UI';
import '../styles/Profile.css';

const ProfilePage = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        location: '',
        occupants: 1,
        mainAppliances: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (user?.userId) {
            loadUserProfile();
        }
    }, [user?.userId]);

    const loadUserProfile = async () => {
        setLoading(true);
        try {
            const response = await userAPI.getProfile(user.userId);
            setUserData(response.data);
            setFormData(prev => ({
                ...prev,
                phone: response.data?.phone || '',
                address: response.data?.address || '',
                city: response.data?.city || '',
                state: response.data?.state || '',
                zipCode: response.data?.zipCode || '',
                country: response.data?.country || '',
                location: response.data?.household?.location || '',
                occupants: response.data?.household?.occupants || 1,
                mainAppliances: response.data?.household?.mainAppliances?.join(', ') || ''
            }));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load profile');
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
        setLoading(true);

        try {
            await updateProfile(user.userId, formData);
            setSuccess('Profile updated successfully!');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !userData) return <div className="loading">Loading...</div>;

    return (
        <div className="profile-page">
            <h1>My Profile</h1>

            {error && <ErrorMessage message={error} />}
            {success && <SuccessMessage message={success} />}

            <div className="profile-container">
                <Card className="profile-form">
                    <h2>Personal Information</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <Input 
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                            <Input 
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled
                            />
                        </div>

                        <div className="form-row">
                            <Input 
                                label="Phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>

                        <h3>Household Profile</h3>
                        <div className="form-row">
                            <Input
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                            <Input
                                label="Occupants"
                                name="occupants"
                                type="number"
                                value={formData.occupants}
                                onChange={handleInputChange}
                                min={1}
                                disabled={loading}
                            />
                        </div>
                        <div className="form-row">
                            <Input
                                label="Main Appliances"
                                name="mainAppliances"
                                value={formData.mainAppliances}
                                onChange={handleInputChange}
                                placeholder="e.g., Refrigerator, AC, Washer"
                                disabled={loading}
                            />
                        </div>

                        <h3>Address</h3>
                        <div className="form-row">
                            <Input 
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-row">
                            <Input 
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                            <Input 
                                label="Province"
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="form-row">
                            <Input 
                                label="Zip Code"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                            <Input 
                                label="Country"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                disabled={loading}
                            />
                        </div>

                        <Button variant="primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </form>
                </Card>

                <Card className="profile-stats">
                    <h2>Account Statistics</h2>
                    <div className="stat-item">
                        <span className="stat-label">Member Since:</span>
                        <span className="stat-value">
                            {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Total Devices:</span>
                        <span className="stat-value">{userData?.deviceCount || 0}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Total Energy Used:</span>
                        <span className="stat-value">{userData?.totalEnergyUsed || 0} kWh</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Account Status:</span>
                        <span className="stat-value">
                            {userData?.isActive ? '✓ Active' : '✗ Inactive'}
                        </span>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ProfilePage;
