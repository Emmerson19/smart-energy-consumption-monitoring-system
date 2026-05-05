import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input, Button, ErrorMessage, SuccessMessage } from '../components/UI';
import '../styles/Auth.css';
import { validators } from '../utils/helpers';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        location: '',
        occupants: 1,
        mainAppliances: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
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

        // Validation
        if (!formData.name || !formData.email || !formData.password) {
            setError('Name, email, and password are required');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!validators.isEmail(formData.email)) {
            setError('Invalid email format');
            return;
        }

        setIsLoading(true);
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone || undefined,
                location: formData.location || undefined,
                occupants: formData.occupants || undefined,
                mainAppliances: formData.mainAppliances || undefined
            });
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1>Register</h1>
                <p className="auth-subtitle">Create your account</p>

                {error && <ErrorMessage message={error} />}
                {success && <SuccessMessage message={success} />}

                <form onSubmit={handleSubmit}>
                    <Input 
                        label="Full Name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        disabled={isLoading}
                    />
                    
                    <Input 
                        label="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        disabled={isLoading}
                    />

                    <Input 
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="At least 6 characters"
                        disabled={isLoading}
                    />

                    <Input 
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm password"
                        disabled={isLoading}
                    />

                    <Input 
                        label="Phone (Optional)"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1234567890"
                        disabled={isLoading}
                    />

                    <Input 
                        label="Household Location"
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City or neighborhood"
                        disabled={isLoading}
                    />

                    <div className="form-row">
                        <Input 
                            label="Occupants"
                            type="number"
                            name="occupants"
                            min="1"
                            value={formData.occupants}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        <Input 
                            label="Main Appliances"
                            type="text"
                            name="mainAppliances"
                            value={formData.mainAppliances}
                            onChange={handleChange}
                            placeholder="e.g., Fridge, AC, Washer"
                            disabled={isLoading}
                        />
                    </div>

                    <Button variant="primary" disabled={isLoading}>
                        {isLoading ? 'Registering...' : 'Register'}
                    </Button>
                </form>

                <p className="auth-footer">
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
