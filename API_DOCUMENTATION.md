# API Documentation

## Base URL
```
http://localhost:7000/api
```

## Authentication
Currently uses basic token-based authentication. Future versions will use JWT.

## Response Format
All responses follow this format:

### Success Response (2xx)
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response (4xx, 5xx)
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error information"],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Data retrieved",
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10,
    "hasMore": true
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## User Endpoints

### Register User
- **URL**: `/users/register`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phone": "+1234567890"
}
```
- **Success Response**: 201 Created

### Login
- **URL**: `/users/login`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```
- **Success Response**: 200 OK with token

### Get User Profile
- **URL**: `/users/profile/:userId`
- **Method**: `GET`
- **Success Response**: 200 OK

### Update Profile
- **URL**: `/users/profile/:userId`
- **Method**: `PUT`
- **Body**:
```json
{
  "name": "Jane Doe",
  "phone": "+9876543210",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "country": "USA"
}
```
- **Success Response**: 200 OK

### Get User Statistics
- **URL**: `/users/stats/:userId`
- **Method**: `GET`
- **Success Response**: 200 OK

## Device Endpoints

### Create Device
- **URL**: `/devices/:userId/devices`
- **Method**: `POST`
- **Body**:
```json
{
  "deviceName": "Main Meter",
  "deviceId": "METER001",
  "deviceType": "Meter",
  "location": "Living Room",
  "manufacturer": "Siemens",
  "model": "7KM2200",
  "serialNumber": "SN12345",
  "installationDate": "2024-01-01T00:00:00Z",
  "dailyBudget": 50,
  "monthlyBudget": 1500,
  "alertEnabled": true
}
```
- **Success Response**: 201 Created

### Get User Devices
- **URL**: `/devices/:userId/devices?limit=10&page=1`
- **Method**: `GET`
- **Query Parameters**:
  - `limit` (optional): Items per page (max 100)
  - `page` (optional): Page number
- **Success Response**: 200 OK

### Get Single Device
- **URL**: `/devices/devices/:deviceId`
- **Method**: `GET`
- **Success Response**: 200 OK

### Update Device
- **URL**: `/devices/devices/:deviceId`
- **Method**: `PUT`
- **Body**: Any device fields to update
- **Success Response**: 200 OK

### Delete Device
- **URL**: `/devices/devices/:deviceId`
- **Method**: `DELETE`
- **Success Response**: 200 OK

### Update Device Status
- **URL**: `/devices/devices/:deviceId/status`
- **Method**: `PATCH`
- **Body**:
```json
{
  "status": "Active"
}
```
- **Valid Statuses**: `Active`, `Inactive`, `Maintenance`, `Error`

### Get Device Statistics
- **URL**: `/devices/devices/:deviceId/stats`
- **Method**: `GET`
- **Success Response**: 200 OK

## Consumption Endpoints

### Record Consumption
- **URL**: `/consumption/:userId/devices/:deviceId/consumption`
- **Method**: `POST`
- **Body**:
```json
{
  "consumption": 12.5,
  "voltage": 230,
  "current": 15.2,
  "powerFactor": 0.95,
  "cost": 1.50,
  "period": "Daily",
  "temperature": 22,
  "humidity": 45
}
```
- **Success Response**: 201 Created

### Get User Consumption
- **URL**: `/consumption/:userId/consumption?startDate=...&endDate=...&limit=100&page=1`
- **Method**: `GET`
- **Query Parameters**:
  - `startDate` (optional): Start date (ISO 8601)
  - `endDate` (optional): End date (ISO 8601)
  - `limit` (optional): Items per page
  - `page` (optional): Page number

### Get Device Consumption
- **URL**: `/consumption/:userId/devices/:deviceId/consumption?startDate=...&endDate=...`
- **Method**: `GET`

### Get Daily Consumption
- **URL**: `/consumption/:userId/consumption/daily?date=2024-01-01`
- **Method**: `GET`
- **Query Parameters**:
  - `date` (required): Date (ISO 8601 format)

### Get Monthly Consumption
- **URL**: `/consumption/:userId/consumption/monthly?year=2024&month=1`
- **Method**: `GET`
- **Query Parameters**:
  - `year` (required): Year
  - `month` (required): Month (1-12)

### Get Hourly Consumption
- **URL**: `/consumption/:userId/consumption/hourly?date=2024-01-01`
- **Method**: `GET`
- **Query Parameters**:
  - `date` (required): Date (ISO 8601)

### Get Consumption Trend
- **URL**: `/consumption/:userId/consumption/trend?days=30`
- **Method**: `GET`
- **Query Parameters**:
  - `days` (optional): Number of days to analyze (default: 30)

### Get Device Comparison
- **URL**: `/consumption/:userId/devices/comparison`
- **Method**: `GET`
- **Success Response**: 200 OK with comparison data

## Alert & Threshold Endpoints

### Create Threshold
- **URL**: `/alerts/:userId/thresholds`
- **Method**: `POST`
- **Body**:
```json
{
  "deviceId": "device_id",
  "thresholdName": "Daily Limit",
  "thresholdType": "Daily",
  "maxValue": 50,
  "minValue": 0,
  "alertWhen": "Exceeds",
  "severity": "High",
  "notificationEnabled": true
}
```
- **Success Response**: 201 Created

### Get Thresholds
- **URL**: `/alerts/:userId/thresholds`
- **Method**: `GET`
- **Success Response**: 200 OK

### Create Alert
- **URL**: `/alerts/:userId/alerts`
- **Method**: `POST`
- **Body**:
```json
{
  "deviceId": "device_id",
  "alertType": "HighConsumption",
  "title": "High Usage Detected",
  "description": "Energy consumption exceeds threshold",
  "severity": "High",
  "threshold": 50,
  "currentValue": 65
}
```
- **Valid Alert Types**: `HighConsumption`, `LowBattery`, `DeviceOffline`, `BudgetExceeded`, `AbnormalUsage`, `VoltageVariation`, `Maintenance`, `Custom`

### Get Alerts
- **URL**: `/alerts/:userId/alerts?limit=50&page=1&isResolved=false`
- **Method**: `GET`
- **Query Parameters**:
  - `limit` (optional): Items per page
  - `page` (optional): Page number
  - `isResolved` (optional): Filter by resolution status (true/false)

### Get Unresolved Alerts
- **URL**: `/alerts/:userId/alerts/unresolved`
- **Method**: `GET`
- **Success Response**: 200 OK

### Resolve Alert
- **URL**: `/alerts/alerts/:alertId/resolve`
- **Method**: `PUT`
- **Body**:
```json
{
  "resolutionNotes": "Issue resolved"
}
```
- **Success Response**: 200 OK

### Get Alert Statistics
- **URL**: `/alerts/:userId/alerts/stats`
- **Method**: `GET`
- **Success Response**: 200 OK

## Report Endpoints

### Generate Daily Report
- **URL**: `/reports/:userId/daily?date=2024-01-01`
- **Method**: `GET`
- **Query Parameters**:
  - `date` (required): Report date

### Generate Monthly Report
- **URL**: `/reports/:userId/monthly?year=2024&month=1`
- **Method**: `GET`
- **Query Parameters**:
  - `year` (required): Report year
  - `month` (required): Report month (1-12)

### Generate Yearly Report
- **URL**: `/reports/:userId/yearly?year=2024`
- **Method**: `GET`
- **Query Parameters**:
  - `year` (required): Report year

### Generate Comparison Report
- **URL**: `/reports/:userId/comparison?startDate=2024-01-01&endDate=2024-02-01`
- **Method**: `GET`
- **Query Parameters**:
  - `startDate` (required): Start date
  - `endDate` (required): End date

### Get Consumption Insights
- **URL**: `/reports/:userId/insights`
- **Method**: `GET`
- **Success Response**: 200 OK with insights and recommendations

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | No permission for this action |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Resource already exists |
| 500 | Server Error | Internal server error |

## Rate Limiting

Currently not implemented. Recommended for production:
- Implement rate limiting (e.g., 100 requests per minute per user)
- Use Redis for session management
- Add request queuing for high load

## Pagination

All list endpoints support pagination:
- `limit`: Number of items per page (default: 10, max: 100)
- `page`: Page number (default: 1)

Response includes:
```json
"pagination": {
  "page": 1,
  "limit": 10,
  "total": 245,
  "pages": 25,
  "hasMore": true
}
```

## Date Format

All dates should be in ISO 8601 format:
- `2024-01-01`
- `2024-01-01T12:30:00Z`
- `2024-01-01T12:30:00.000Z`

## Filtering & Sorting

Currently supported via date range queries:
- Most endpoints support `startDate` and `endDate` parameters
- Default sorting: By creation date (descending)

## Versioning

Current API Version: **v1**
Future versions will use `/api/v2/` prefix

## CORS

CORS is enabled. Configure allowed origins in `.env` file.

## Webhooks

Not currently implemented. Planned for future versions.

## Support

For API issues and questions:
- Check the README.md for setup instructions
- Review error messages for specific issues
- Enable debug logging in `.env`

---

**Last Updated**: 2024
**Document Version**: 1.0
