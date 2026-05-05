import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navigation.css';

const Navigation = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-container">
                <Link to="/" className="nav-logo">
                    ⚡ Smart Energy Consumption Monitoring System
                </Link>

                {isAuthenticated ? (
                    <ul className="nav-menu">
                        <li className="nav-item">
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/devices" className="nav-link">Devices</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/consumption" className="nav-link">Consumption</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/alerts" className="nav-link">Alerts</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/reports" className="nav-link">Reports</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/profile" className="nav-link">Profile</Link>
                        </li>
                        <li className="nav-item">
                            <button onClick={handleLogout} className="nav-link logout-btn">
                                Logout
                            </button>
                        </li>
                    </ul>
                ) : (
                    <ul className="nav-menu">
                        <li className="nav-item">
                            <Link to="/login" className="nav-link">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/register" className="nav-link btn-primary">Register</Link>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
