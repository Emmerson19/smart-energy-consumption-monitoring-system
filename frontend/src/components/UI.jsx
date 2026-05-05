import React from 'react';
import '../styles/Card.css';

export const Card = ({ children, className = '' }) => (
    <div className={`card ${className}`}>
        {children}
    </div>
);

export const Button = ({ children, onClick, variant = 'primary', disabled = false, ...props }) => (
    <button 
        className={`btn btn-${variant}`}
        onClick={onClick}
        disabled={disabled}
        {...props}
    >
        {children}
    </button>
);

export const Input = ({ label, ...props }) => (
    <div className="form-group">
        {label && <label className="form-label">{label}</label>}
        <input className="form-input" {...props} />
    </div>
);

export const Select = ({ label, options, ...props }) => (
    <div className="form-group">
        {label && <label className="form-label">{label}</label>}
        <select className="form-input" {...props}>
            <option value="">Select {label}</option>
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

export const Alert = ({ type = 'info', children }) => (
    <div className={`alert alert-${type}`}>
        {children}
    </div>
);

export const Loading = () => (
    <div className="loading">
        <div className="spinner"></div>
        <p>Loading...</p>
    </div>
);

export const ErrorMessage = ({ message }) => (
    <Alert type="error">{message}</Alert>
);

export const SuccessMessage = ({ message }) => (
    <Alert type="success">{message}</Alert>
);
