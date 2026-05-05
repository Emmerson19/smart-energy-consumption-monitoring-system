import React from 'react';
import '../styles/Dashboard.css';

const StatCard = ({ title, value, icon, color, trend }) => (
    <div className={`stat-card stat-${color}`}>
        <div className="stat-icon">{icon}</div>
        <div className="stat-content">
            <h3>{title}</h3>
            <p className="stat-value">{value}</p>
            {trend && <p className="stat-trend">{trend}</p>}
        </div>
    </div>
);

export default StatCard;
