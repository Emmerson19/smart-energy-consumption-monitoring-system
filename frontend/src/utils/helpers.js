// Storage utilities
export const storage = {
    setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
    getUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    removeUser: () => localStorage.removeItem('user'),
    
    setToken: (token) => localStorage.setItem('token', token),
    getToken: () => localStorage.getItem('token'),
    removeToken: () => localStorage.removeItem('token'),
    
    isLoggedIn: () => !!localStorage.getItem('token')
};

// Format utilities
export const formatters = {
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    formatDateTime: (date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    formatCurrency: (amount, symbol = '$') => {
        return `${symbol}${parseFloat(amount).toFixed(2)}`;
    },
    
    formatEnergy: (kwh) => {
        return `${parseFloat(kwh).toFixed(2)} kWh`;
    },
    
    formatVoltage: (voltage) => {
        return `${parseFloat(voltage).toFixed(1)} V`;
    },
    
    formatCurrent: (current) => {
        return `${parseFloat(current).toFixed(2)} A`;
    }
};

// Validation utilities
export const validators = {
    isEmail: (email) => {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return emailRegex.test(email);
    },
    
    isPassword: (password) => {
        return password && password.length >= 6;
    },
    
    isPhoneNumber: (phone) => {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.length >= 10;
    }
};

// Calculation utilities
export const calculations = {
    calculateBudgetPercentage: (used, budget) => {
        if (budget === 0) return 0;
        return ((used / budget) * 100).toFixed(1);
    },
    
    calculateAverage: (values) => {
        if (!values || values.length === 0) return 0;
        const sum = values.reduce((a, b) => a + b, 0);
        return (sum / values.length).toFixed(2);
    },
    
    calculateTotal: (values) => {
        if (!values || values.length === 0) return 0;
        return values.reduce((a, b) => a + b, 0).toFixed(2);
    },
    
    calculateTrendPercentage: (current, previous) => {
        if (previous === 0) return 0;
        return (((current - previous) / previous) * 100).toFixed(2);
    }
};

export default {
    storage,
    formatters,
    validators,
    calculations
};
