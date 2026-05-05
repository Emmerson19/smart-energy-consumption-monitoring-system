# Smart Energy Consumption Monitoring System

A comprehensive Node.js and MongoDB-based application for monitoring, managing, and analyzing energy consumption across multiple devices.

## Prerequisites

- Node.js (v16+)
- MongoDB (local or cloud)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start MongoDB

5. Start the application:
   ```bash
   # Backend
   npm start

   # Frontend (in another terminal)
   cd frontend && npm run dev
   ```

## Features

- User authentication and authorization
- Device management
- Real-time energy consumption tracking
- Alert system for threshold breaches
- Comprehensive reporting and analytics
- RESTful API

## API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed API endpoints.

   # Terminal 2: Start Frontend
   npm run dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:7000

## Features

### 1. **User Management**
- User registration and authentication
- Profile management
- User statistics and activity tracking

### 2. **Device Management**
- Add and manage multiple energy monitoring devices
- Track device status (active, inactive, maintenance, error)
- Online/offline status monitoring
- Device specifications and metadata

### 3. **Energy Consumption Tracking**
- Real-time consumption recording
- Hourly, daily, monthly consumption reports
- Voltage, current, and power factor measurements
- Cost calculation for consumption

### 4. **Analytics & Reporting**
- Daily consumption reports
- Monthly consumption analysis
- Yearly consumption summaries
- Period comparison reports
- Device comparison analytics
- Peak/off-peak hour analysis

### 5. **Alerts & Thresholds**
- Set consumption thresholds
- Automatic alert generation for anomalies
- High consumption alerts
- Device offline alerts
- Budget exceeded notifications
- Alert resolution tracking

### 6. **Dashboard & Insights**
- Consumption trend analysis
- Average daily consumption
- Cost projections
- Energy-saving recommendations
- Peak hour identification

## Technology Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT (ready for implementation)
- **Email/SMS**: Twilio integration ready
- **API Documentation**: RESTful API design

## Project Structure

```
smart-energy-monitoring-system/
├── models/                 # MongoDB schemas
│   ├── User.js
│   ├── Device.js
│   ├── EnergyConsumption.js
│   ├── Alert.js
│   └── Threshold.js
├── controllers/            # Business logic
│   ├── userController.js
│   ├── deviceController.js
│   ├── consumptionController.js
│   ├── alertController.js
│   └── reportController.js
├── services/              # Reusable service functions
│   ├── deviceService.js
│   ├── consumptionService.js
│   ├── alertService.js
│   └── reportService.js
├── routes/               # API route definitions
│   ├── userRoutes.js
│   ├── deviceRoutes.js
│   ├── consumptionRoutes.js
│   ├── alertRoutes.js
│   └── reportRoutes.js
├── middleware/           # Custom middleware
│   ├── auth.js
│   └── errorHandler.js
├── utils/               # Utility functions
│   ├── calculations.js
│   ├── validators.js
│   └── responseFormatter.js
├── config/              # Configuration files
├── index.js            # Main application file
├── package.json        # Dependencies
├── .env.example        # Environment variables template
└── README.md           # Documentation
```

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-energy-monitoring-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   # On Windows PowerShell:
   # copy .env.example .env
   ```
   Edit `.env` and replace `MONGO_URL` with your MongoDB Atlas connection string:
   ```bash
   MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/energy-monitoring?retryWrites=true&w=majority
   ```
   If you still want to run locally instead of Atlas, use:
   ```bash
   MONGO_URL=mongodb://localhost:27017/energy-monitoring
   ```

4. **Start MongoDB**
   ```bash
   mongod
   ```

5. **Run the application**
   ```bash
   npm start
   ```

The server will start on `http://localhost:7000`

> If your system cannot run MongoDB 8.x, install MongoDB Community Server 7.x and use the same local URL above.


## API Endpoints

### Authentication & Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile/:userId` - Get user profile
- `PUT /api/users/profile/:userId` - Update profile
- `GET /api/users/stats/:userId` - Get user statistics
- `GET /api/users` - Get all users (admin)

### Device Management
- `POST /api/devices/:userId/devices` - Create device
- `GET /api/devices/:userId/devices` - Get user devices
- `GET /api/devices/devices/:deviceId` - Get single device
- `PUT /api/devices/devices/:deviceId` - Update device
- `DELETE /api/devices/devices/:deviceId` - Delete device
- `PATCH /api/devices/devices/:deviceId/status` - Update device status
- `GET /api/devices/devices/:deviceId/stats` - Get device statistics

### Consumption Tracking
- `POST /api/consumption/:userId/devices/:deviceId/consumption` - Record consumption
- `GET /api/consumption/:userId/consumption` - Get user consumption
- `GET /api/consumption/:userId/devices/:deviceId/consumption` - Get device consumption
- `GET /api/consumption/:userId/consumption/daily?date=2024-01-01` - Daily consumption
- `GET /api/consumption/:userId/consumption/monthly?year=2024&month=1` - Monthly consumption
- `GET /api/consumption/:userId/consumption/hourly?date=2024-01-01` - Hourly consumption
- `GET /api/consumption/:userId/consumption/trend?days=30` - Consumption trend
- `GET /api/consumption/:userId/devices/comparison` - Device comparison

### Alerts & Thresholds
- `POST /api/alerts/:userId/thresholds` - Create threshold
- `GET /api/alerts/:userId/thresholds` - Get thresholds
- `PUT /api/alerts/thresholds/:thresholdId` - Update threshold
- `DELETE /api/alerts/thresholds/:thresholdId` - Delete threshold
- `POST /api/alerts/:userId/alerts` - Create alert
- `GET /api/alerts/:userId/alerts` - Get alerts
- `GET /api/alerts/:userId/alerts/unresolved` - Get unresolved alerts
- `PUT /api/alerts/alerts/:alertId/resolve` - Resolve alert
- `GET /api/alerts/:userId/alerts/stats` - Get alert statistics

### Reports & Analytics
- `GET /api/reports/:userId/daily?date=2024-01-01` - Daily report
- `GET /api/reports/:userId/monthly?year=2024&month=1` - Monthly report
- `GET /api/reports/:userId/yearly?year=2024` - Yearly report
- `GET /api/reports/:userId/comparison?startDate=...&endDate=...` - Comparison report
- `GET /api/reports/:userId/insights` - Consumption insights

## Request/Response Examples

### Register User
```bash
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "+1234567890"
}
```

### Create Device
```bash
POST /api/devices/:userId/devices
Content-Type: application/json

{
  "deviceName": "Home Main Meter",
  "deviceId": "METER001",
  "deviceType": "Meter",
  "location": "Living Room",
  "manufacturer": "Siemens",
  "model": "7KM2200",
  "installationDate": "2024-01-01",
  "dailyBudget": 50,
  "monthlyBudget": 1500
}
```

### Record Consumption
```bash
POST /api/consumption/:userId/devices/:deviceId/consumption
Content-Type: application/json

{
  "consumption": 12.5,
  "voltage": 230,
  "current": 15.2,
  "powerFactor": 0.95,
  "cost": 1.50,
  "period": "Daily"
}
```

### Create Threshold
```bash
POST /api/alerts/:userId/thresholds
Content-Type: application/json

{
  "thresholdName": "Daily Limit",
  "thresholdType": "Daily",
  "maxValue": 50,
  "alertWhen": "Exceeds",
  "severity": "High"
}
```

## Key Functions & Services

### Device Service
- `createDevice()` - Add new monitoring device
- `getDevicesByUser()` - List user devices with pagination
- `updateDeviceStatus()` - Change device status
- `getDeviceStats()` - Get consumption statistics for device

### Consumption Service
- `recordConsumption()` - Log energy consumption data
- `getDailyConsumption()` - Aggregate daily consumption
- `getMonthlyConsumption()` - Aggregate monthly consumption
- `getConsumptionTrend()` - Analyze consumption trends
- `getDeviceComparison()` - Compare consumption across devices

### Alert Service
- `createAlert()` - Generate alert for anomalies
- `createThreshold()` - Set consumption limits
- `getUnresolvedAlerts()` - Fetch active alerts
- `resolveAlert()` - Mark alert as resolved
- `checkAndCreateAlerts()` - Auto-generate alerts based on thresholds

### Report Service
- `generateDailyReport()` - Create daily consumption report
- `generateMonthlyReport()` - Create monthly report
- `generateYearlyReport()` - Create yearly report
- `getConsumptionInsights()` - AI-powered insights and recommendations

## Utility Functions

### Calculations
- `calculateConsumption()` - Power consumption calculation
- `calculateCost()` - Cost estimation
- `calculateAverageDailyConsumption()` - Daily average
- `calculateBudgetPercentage()` - Budget utilization
- `calculatePeakHours()` - Peak usage detection

### Validators
- `validateEmail()` - Email validation
- `validatePassword()` - Password strength check
- `validateDeviceId()` - Device ID validation
- `validateConsumptionValue()` - Consumption data validation
- `validateDateRange()` - Date range validation

## Configuration

Edit `.env` file with:
- MongoDB connection string
- Server port
- JWT secret
- Email/SMS settings
- Cost per kWh
- CORS settings

## Future Enhancements

1. **JWT Authentication** - Implement token-based authentication
2. **Email Notifications** - Send alerts via email
3. **SMS Alerts** - Send SMS notifications
4. **Data Visualization** - Charts and graphs
5. **Machine Learning** - Usage prediction and anomaly detection
6. **Mobile App** - Native mobile application
7. **IoT Integration** - Real device integration
8. **WebSocket** - Real-time data updates
9. **Advanced Analytics** - Predictive analytics
10. **Blockchain** - Immutable consumption logs

## Error Handling

The application includes comprehensive error handling:
- Request validation
- Database error handling
- Authentication errors
- Resource not found (404)
- Server errors (500)
- Duplicate entry handling

## Security Considerations

1. Implement JWT for authentication
2. Use bcryptjs for password hashing
3. Add rate limiting
4. Validate all inputs
5. Use HTTPS in production
6. Implement CORS properly
7. Secure environment variables
8. Add request logging
9. Implement data encryption
10. Regular security audits

## Testing

For future implementation:
```bash
npm install --save-dev jest supertest
npm test
```

## Performance Optimization

- Indexed database queries for fast retrieval
- Pagination for large datasets
- Connection pooling
- Response compression (gzip)
- Database query optimization
- Caching strategies

## Logging

Logging is implemented with console output. Consider adding Winston or Morgan for production:

```bash
npm install winston morgan
```

## API Rate Limiting

Recommended for production:
```bash
npm install express-rate-limit
```

## CORS Configuration

CORS is enabled for cross-origin requests. Configure allowed origins in `.env`

## Deployment

### Heroku
```bash
heroku create your-app-name
heroku config:set MONGO_URL=your_mongo_url
# If deploying the frontend as a separate static app, build it in frontend first
# cd frontend && npm install && npm run build
git push heroku main
```

### Local production build
```bash
npm install
npm run build
npm start
```

### Docker
Create `Dockerfile`:
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 7000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is licensed under the ISC License.

## Support

For issues and questions, please create a GitHub issue or contact the development team.

## Version History

### v1.0.0 (Current)
- Initial release with core features
- User management
- Device management
- Consumption tracking
- Alert system
- Reporting and analytics

---

**Last Updated**: 2024
**Maintainers**: Development Team
#   s m a r t - e n e r g y - c o n s u m p t i o n - m o n i t o r i n g - s y s t e m  
 