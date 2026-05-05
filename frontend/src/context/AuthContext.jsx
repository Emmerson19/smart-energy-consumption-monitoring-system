import React, { createContext, useState, useContext } from 'react';
import { userAPI } from '../services/apiService';
import { storage } from '../utils/helpers';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => storage.getUser());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const register = async (userData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await userAPI.register(userData);
            return response;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Registration failed';
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await userAPI.login({ email, password });
            if (response.data && response.data.token) {
                storage.setToken(response.data.token);
                const userData = {
                    userId: response.data.userId,
                    email: response.data.email,
                    name: response.data.name,
                    role: response.data.role || 'user'
                };
                storage.setUser(userData);
                setUser(userData);
            }
            return response;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Login failed';
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        storage.removeToken();
        storage.removeUser();
        setUser(null);
    };

    const updateProfile = async (userId, profileData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await userAPI.updateProfile(userId, profileData);
            const updatedUser = { ...user, ...profileData };
            storage.setUser(updatedUser);
            setUser(updatedUser);
            return response;
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Update failed';
            setError(errorMsg);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const value = {
        user,
        isLoading,
        error,
        isAuthenticated: !!user && storage.isLoggedIn(),
        register,
        login,
        logout,
        updateProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
