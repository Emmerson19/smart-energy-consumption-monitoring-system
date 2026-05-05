# Smart Energy Consumption Monitoring System - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Local MongoDB Community Server
- npm or yarn

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment Variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and point it to local MongoDB:
   ```bash
   MONGO_URL=mongodb://localhost:27017/energy-monitoring
   PORT=7000
   ```

3. **Start MongoDB**
   ```bash
   mongod
   ```

4. **Run the Application**
   ```bash
   npm start
   ```

   Server will start at: `http://localhost:7000`

5. **Test API**
   ```bash
   curl http://localhost:7000/api/health
   ```

## 📁 Project Structure

```
smart-energy-monitoring-system/
├── models/                    # Database schemas
│   ├── User.js               # User schema
│   ├── Device.js             # Device schema
│   ├── EnergyConsumption.js  # Consumption schema
│   ├── Alert.js              # Alert schema
│   └── Threshold.js          # Threshold schema
│
├── controllers/              # Business logic & request handlers
│   ├── userController.js
│   ├── deviceController.js
│   ├── consumptionController.js
│   ├── alertController.js
│   └── reportController.js
│
├── services/                # Business logic & data operations
│   ├── deviceService.js
│   ├── consumptionService.js
│   ├── alertService.js
│   └── reportService.js
│
├── routes/                  # API route definitions
│   ├── userRoutes.js
│   ├── deviceRoutes.js
│   ├── consumptionRoutes.js
│   ├── alertRoutes.js
│   └── reportRoutes.js
│
├── middleware/              # Custom middleware
│   ├── auth.js             # Authentication & authorization
│   └── errorHandler.js     # Error handling
│
├── utils/                  # Utility functions
│   ├── calculations.js     # Energy calculations
│   ├── validators.js       # Input validation
│   └── responseFormatter.js # Response formatting
│
├── config/                 # Configuration files
│   ├── config.js          # Main configuration
│   └── constants.js       # Constants & defaults
│
├── index.js               # Main application file
├── package.json           # Dependencies
├── .env.example           # Environment template
├── .gitignore            # Git ignore rules
├── README.md             # Full documentation
├── API_DOCUMENTATION.md  # API endpoints documentation
└── QUICKSTART.md         # This file
```

## 🔌 API Endpoints

### Users
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile/:userId` - Get profile
- `PUT /api/users/profile/:userId` - Update profile

### Devices
- `POST /api/devices/:userId/devices` - Add device
- `GET /api/devices/:userId/devices` - List devices
- `PUT /api/devices/devices/:deviceId` - Update device
- `DELETE /api/devices/devices/:deviceId` - Delete device

### Consumption
- `POST /api/consumption/:userId/devices/:deviceId/consumption` - Record consumption
- `GET /api/consumption/:userId/consumption` - Get consumption history
- `GET /api/consumption/:userId/consumption/daily?date=2024-01-01` - Daily consumption
- `GET /api/consumption/:userId/consumption/monthly?year=2024&month=1` - Monthly consumption
- `GET /api/consumption/:userId/consumption/trend?days=30` - Consumption trend

### Alerts
- `POST /api/alerts/:userId/alerts` - Create alert
- `GET /api/alerts/:userId/alerts` - Get alerts
- `PUT /api/alerts/alerts/:alertId/resolve` - Resolve alert
- `POST /api/alerts/:userId/thresholds` - Set threshold
- `GET /api/alerts/:userId/thresholds` - Get thresholds

### Reports
- `GET /api/reports/:userId/daily?date=2024-01-01` - Daily report
- `GET /api/reports/:userId/monthly?year=2024&month=1` - Monthly report
- `GET /api/reports/:userId/yearly?year=2024` - Yearly report
- `GET /api/reports/:userId/insights` - Consumption insights

## 💡 Usage Examples

### Register a User
```bash
curl -X POST http://localhost:7000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123",
    "phone": "+1234567890"
  }'
```

### Create a Device
```bash
curl -X POST http://localhost:7000/api/devices/USER_ID/devices \
  -H "Content-Type: application/json" \
  -d '{
    "deviceName": "Home Meter",
    "deviceId": "METER001",
    "deviceType": "Meter",
    "location": "Living Room",
    "installationDate": "2024-01-01",
    "dailyBudget": 50,
    "monthlyBudget": 1500
  }'
```

### Record Energy Consumption
```bash
curl -X POST http://localhost:7000/api/consumption/USER_ID/devices/DEVICE_ID/consumption \
  -H "Content-Type: application/json" \
  -d '{
    "consumption": 12.5,
    "voltage": 230,
    "current": 15.2,
    "powerFactor": 0.95,
    "cost": 1.50
  }'
```

### Get Daily Consumption Report
```bash
curl http://localhost:7000/api/consumption/USER_ID/consumption/daily?date=2024-01-01
```

## 🔑 Key Features

### ✅ User Management
- User registration & login
- Profile management
- User statistics

### ✅ Device Management
- Add multiple devices
- Track device status
- Monitor online/offline status
- Device statistics

### ✅ Energy Tracking
- Real-time consumption recording
- Hourly/daily/monthly analysis
- Voltage, current, power factor measurements
- Cost calculations

### ✅ Analytics & Reporting
- Daily reports
- Monthly summaries
- Yearly analysis
- Period comparison
- Device comparison
- Trend analysis

### ✅ Alerts System
- Set consumption thresholds
- Automatic alert generation
- High consumption detection
- Device offline alerts
- Budget exceeded notifications
- Alert resolution tracking

### ✅ Dashboard & Insights
- Consumption trends
- Average daily consumption
- Cost projections
- Energy-saving recommendations
- Peak hour identification

## 🔒 Security Features

- Input validation & sanitization
- Database parameterized queries
- Error handling
- Request logging (ready for middleware)
- CORS configuration
- JWT ready (not implemented yet)
- Password hashing ready (not implemented yet)

## 📊 Database Schema Overview

### Users Collection
- User profile information
- Contact details
- Account creation date

### Devices Collection
- Device specifications
- Installation date
- Online/offline status
- Budget limits
- Device readings

### EnergyConsumption Collection
- Consumption values
- Voltage/current measurements
- Power factor
- Cost information
- Timestamp

### Alerts Collection
- Alert type & severity
- Status (resolved/unresolved)
- Threshold information
- Notification status

### Thresholds Collection
- Threshold limits
- Threshold type (daily/monthly/etc)
- Alert conditions
- Active/inactive status

## 🛠️ Development Tips

### Enable Debug Logging
```bash
export LOG_LEVEL=debug
npm start
```

### Testing with Postman
1. Import the API endpoints listed in QUICKSTART.md
2. Set the `userId` variable in collection
3. Test each endpoint

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify database name matches

**Port Already in Use**
- Change PORT in `.env`
- Or kill existing process: `lsof -ti:7000 | xargs kill -9`

**CORS Errors**
- Check CORS_ORIGIN in `.env`
- Update to match your frontend URL

## 📚 Documentation

- **README.md** - Full documentation & features
- **API_DOCUMENTATION.md** - Detailed API endpoints
- **QUICKSTART.md** - This quick start guide
- **.env.example** - Environment variables template

## 🚀 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Setup environment: Create `.env` file
3. ✅ Start MongoDB
4. ✅ Run application: `npm start`
5. ✅ Test API endpoints
6. 💡 Connect a frontend application
7. 💡 Implement JWT authentication
8. 💡 Setup email/SMS notifications

## 📬 Features to Implement

- [ ] JWT Token Authentication
- [ ] Email Notifications
- [ ] SMS Alerts (Twilio)
- [ ] Data Visualization
- [ ] Machine Learning Predictions
- [ ] Mobile App Integration
- [ ] Real-time Data via WebSocket
- [ ] Advanced Analytics
- [ ] Blockchain Logging
- [ ] Rate Limiting

## 🤝 Contributing

See README.md for contribution guidelines.

## 📞 Support

For issues:
1. Check README.md and API_DOCUMENTATION.md
2. Verify environment configuration
3. Check error logs in console
4. Enable debug logging

## 📄 License

ISC License - See README.md

---

**Ready to start?**
```bash
npm install && npm start
```

Go to `http://localhost:7000/api` to see the API overview!
