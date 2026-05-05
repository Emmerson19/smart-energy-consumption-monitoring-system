import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const HomePage = () => {
    const { isAuthenticated } = useAuth();

    return (
        <div className="home-page">
            <div className="hero">
                <div className="hero-content">
                    <div className="hero-icon">⚡</div>
                    <h1>Smart Energy<br/>Monitoring</h1>
                    <p>Monitor, analyze, and optimize your energy consumption with real-time insights</p>
                    
                    {isAuthenticated ? (
                        <Link to="/dashboard" className="btn btn-primary btn-lg pulse">
                            Go to Dashboard
                        </Link>
                    ) : (
                        <div className="cta-buttons">
                            <Link to="/register" className="btn btn-primary btn-lg glow">
                                Start Monitoring
                            </Link>
                            <Link to="/login" className="btn btn-ghost btn-lg">
                                Sign In
                            </Link>
                        </div>
                    )}
                </div>
                <div className="hero-visual">
                    <div className="floating-elements">
                        <div className="floating-circle circle-1"></div>
                        <div className="floating-circle circle-2"></div>
                        <div className="floating-circle circle-3"></div>
                    </div>
                </div>
            </div>

            <div className="features">
                <h2>Why Choose Smart Energy?</h2>
                <div className="features-grid">
                    <div className="feature feature-primary">
                        <div className="feature-icon">📊</div>
                        <h3>Real-time Analytics</h3>
                        <p>Monitor your energy usage with live data and beautiful visualizations</p>
                    </div>
                    <div className="feature feature-secondary">
                        <div className="feature-icon">🔔</div>
                        <h3>Smart Alerts</h3>
                        <p>Get notified instantly when consumption exceeds your limits</p>
                    </div>
                    <div className="feature feature-accent">
                        <div className="feature-icon">💡</div>
                        <h3>Save Energy</h3>
                        <p>Receive personalized tips to reduce your energy costs</p>
                    </div>
                </div>
            </div>

            <div className="stats-preview">
                <div className="stat-item">
                    <div className="stat-number">10,000+</div>
                    <div className="stat-label">Active Users</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number">500k+</div>
                    <div className="stat-label">kWh Saved</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number">24/7</div>
                    <div className="stat-label">Monitoring</div>
                </div>
            </div>

            <div className="cta-section">
                <h2>Ready to Take Control?</h2>
                <p>Join the energy revolution today</p>
                {!isAuthenticated && (
                    <Link to="/register" className="btn btn-primary btn-lg glow">
                        Get Started Free
                    </Link>
                )}
            </div>
        </div>
    );
};

export default HomePage;
