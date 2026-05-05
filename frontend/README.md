# Smart Energy Consumption Monitoring System - Frontend

A React frontend for the Smart Energy Consumption Monitoring System.

## Features

- User Authentication
- Device Management
- Energy Consumption Tracking
- Alert System
- Reports and Analytics

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The app will be available at `http://localhost:3000`
   ```

Frontend will be available at: http://localhost:3000

## 🔧 Configuration

### Environment Variables

```env
# API Configuration
VITE_API_URL=http://localhost:7000/api

# App Configuration
VITE_APP_NAME="Smart Energy Monitor"
VITE_APP_VERSION="1.0.0"
```

## 🎨 Design Philosophy

This frontend embraces **simplicity and creativity**:

- **Simple**: Clean layouts, minimal clutter, focused on core functionality
- **Creative**: Beautiful gradients, smooth animations, modern design patterns
- **Accessible**: High contrast, clear typography, intuitive navigation
- **Performant**: Optimized animations and responsive design

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable React components
│   ├── pages/         # Page components with creative layouts
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   ├── context/       # React Context for state management
│   ├── styles/        # Creative CSS with animations
│   ├── App.jsx       # Main App component
│   └── main.jsx      # Entry point
├── public/            # Static assets
├── index.html        # HTML template
├── vite.config.js    # Vite configuration
└── package.json      # Dependencies

```

## Key Technologies

- React 18.2
- React Router v6
- Axios for API calls
- Vite for fast development

## Available Routes

- `/` - Home/Landing page
- `/register` - User registration
- `/login` - User login
- `/dashboard` - Main dashboard
- `/devices` - Device management
- `/consumption` - Consumption tracking
- `/alerts` - Alert management
- `/reports` - Reports and analytics
- `/profile` - User profile

## API Integration

All API calls are made to `http://localhost:7000/api` through the `apiService`.

Base endpoints:
- `/users` - User management
- `/devices` - Device management
- `/consumption` - Energy consumption
- `/alerts` - Alerts and thresholds
- `/reports` - Reports and analytics
