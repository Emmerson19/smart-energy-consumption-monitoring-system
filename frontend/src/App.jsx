import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './components/Dashboard';
import DevicesPage from './pages/DevicesPage';
import ConsumptionPage from './pages/ConsumptionPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import ProfilePage from './pages/ProfilePage';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppContent() {
    return (
        <Router>
            <Navigation />
            <main className="main-content">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* Protected Routes */}
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/devices" 
                        element={
                            <ProtectedRoute>
                                <DevicesPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/consumption" 
                        element={
                            <ProtectedRoute>
                                <ConsumptionPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/alerts" 
                        element={
                            <ProtectedRoute>
                                <AlertsPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/reports" 
                        element={
                            <ProtectedRoute>
                                <ReportsPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/profile" 
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        } 
                    />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </main>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
