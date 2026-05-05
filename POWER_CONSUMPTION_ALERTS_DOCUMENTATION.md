# Power Consumption & Alert System Enhancement

## Overview
Your energy monitoring system now includes comprehensive power consumption tracking (in watts) and an intelligent alert system that automatically detects and flags high energy consumption situations.

## New Features

### 1. Power Consumption Tracking
Each energy consumption record now includes:
- **powerWatts**: Actual power consumption in watts (100W–2000W range)
- **status**: Consumption status based on power threshold
  - `normal` - Consumption within safe limits (≤1000W)
  - `high` - High power consumption detected (>1000W)
  - `warning` - Approaching dangerous levels

### 2. Automatic Alert Generation
The system automatically creates alerts when consumption exceeds 1000W with:
- **Alert Type**: HighConsumption
- **Title**: "High Energy Consumption Detected"
- **Description**: Details including watts, threshold, and kWh usage
- **Severity Levels**:
  - 🔴 Critical (>1500W)
  - 🟠 High (1000W–1500W)
  - 🟡 Medium (<1000W)
- **Metadata**: Device name, location, current watts, threshold, timestamp

### 3. Dashboard Alerts Display
New alerts section on the dashboard showing:
- Live alert cards with color-coded severity indicators
- Device information for each alert
- Current power consumption vs. threshold
- Quick overview of active high-consumption situations

## Sample Demo Data with Power Consumption

### Device-wise Power Consumption Patterns

| Device | Min-Max Watts | Status | Frequency |
|--------|--------------|--------|-----------|
| **Living Room AC** | 1200–1950W | High ⚠️ | 4/4 records |
| **Water Heater** | 950–1300W | High ⚠️ | 3/4 records |
| **Washing Machine** | 250–1900W | High ⚠️ | 2/4 records |
| **Kitchen Refrigerator** | 380–500W | Normal ✓ | 0/4 records |
| **Bedroom Lights & Fan** | 75–120W | Normal ✓ | 0/4 records |

**Total Demo Records**: 20 consumption entries
**High Consumption Alerts**: 9 alerts generated automatically

### Sample Alert Examples

**Alert 1: Living Room AC**
```
Title: High Energy Consumption Detected
Power: 1850W (threshold: 1000W)
Severity: High
Energy Usage: 3.5 kWh
Status: Normal operating at high capacity
```

**Alert 2: Water Heater**
```
Title: High Energy Consumption Detected
Power: 1300W (threshold: 1000W)
Severity: High
Energy Usage: 2.5 kWh
Status: Normal but exceeds safe limit
```

## Backend Implementation

### Updated Models
- **EnergyConsumption.js**: Added `powerWatts` and `status` fields

### New Services
- **demoDataService.js** enhancements:
  - `generateDemoConsumptionData()`: Creates records with power data
  - `createHighConsumptionAlerts()`: Auto-generates alerts for high consumption
  - `getHighConsumptionAlerts()`: Retrieves active alerts
  - `clearDemoData()`: Removes alerts with consumption data

### New API Endpoints
- `GET /consumption/:userId/consumption-with-alerts` - Fetch consumption data and associated alerts
- Alert data automatically included in seed demo data response

### Alert Schema
```javascript
{
    alertType: 'HighConsumption',
    title: 'High Energy Consumption Detected',
    description: 'Device consuming XW exceeds threshold...',
    severity: 'High/Medium/Critical',
    threshold: 1000,          // Watts
    currentValue: 1850,       // Actual watts
    deviceId: ObjectId,
    userId: ObjectId,
    isResolved: false,
    isNotified: true,
    notificationChannels: ['InApp', 'Email']
}
```

## Frontend Implementation

### Dashboard Enhancements
**New "Energy Alerts" Section**
- Displays unresolved high-consumption alerts
- Color-coded severity indicators
- Device name and location
- Current watts vs. threshold
- Shows alert description and timestamp
- Responsive design for mobile

### Consumption Page Enhancements
**Updated Consumption Table**
- Added "Power (Watts)" column
- Added "Status" column with color-coded badges
  - 🔴 High (red background)
  - 🟡 Warning (yellow background)
  - ✓ Normal (green background)
- Sortable by power consumption
- Hover effects for better UX

### API Service Methods
```javascript
consumptionAPI.getConsumptionWithAlerts(userId, limit, page)
```
Returns:
```json
{
    consumption: [{...}],
    pagination: {...},
    alerts: [{...}],
    alertCount: 9
}
```

## Usage Flow

### 1. Load Demo Data
1. Go to Dashboard
2. Click "➕ Load Demo Data" button
3. System creates:
   - 5 sample devices
   - 20 consumption records with power data
   - 9 automatic alerts for high consumption

### 2. View Alerts
- Alerts appear immediately in Dashboard "Energy Alerts" section
- Each alert shows severity, device, and power details
- Click on device name to navigate to device details

### 3. Monitor Consumption
- Navigate to Consumption page
- View table with power consumption (watts) and status
- Green status = Normal consumption
- Red/Yellow status = High consumption alert

### 4. Take Action
- Identify high-consumption devices
- Check Alerts page for detailed information
- Plan energy-saving measures

## Data Specifications

### Consumption Record with Power Data
```javascript
{
    timestamp: "2026-05-06T10:30:00Z",
    deviceName: "Living Room AC",
    powerWatts: 1850,           // NEW: Actual power in watts
    consumption: 3.5,            // kWh
    status: "high",              // NEW: Status based on threshold
    voltage: 230,
    current: 8.04,
    powerFactor: 0.98,
    cost: 29.75,                // ₱8.50/kWh
    temperature: 28,
    humidity: 65
}
```

### Alert Record
```javascript
{
    alertType: "HighConsumption",
    title: "High Energy Consumption Detected",
    description: "Device consuming 1850W exceeds threshold of 1000W...",
    severity: "High",
    threshold: 1000,
    currentValue: 1850,
    deviceId: ObjectId,
    userId: ObjectId,
    isResolved: false,
    createdAt: "2026-05-06T10:30:00Z"
}
```

## Power Threshold Logic
- **High Consumption Threshold**: 1000W
- **Critical Threshold**: 1500W+
- **Severity Mapping**:
  - 1000–1500W → Medium severity
  - >1500W → High severity

## Files Modified

### Backend
- `models/EnergyConsumption.js` - Added powerWatts, status fields
- `services/demoDataService.js` - Enhanced with power data and alert generation
- `controllers/consumptionController.js` - Added consumption-with-alerts endpoint
- `routes/consumptionRoutes.js` - Added new endpoint route

### Frontend
- `src/services/apiService.js` - Added getConsumptionWithAlerts method
- `src/components/Dashboard.jsx` - Added alerts display and section
- `src/pages/ConsumptionPage.jsx` - Enhanced table with power/status columns
- `src/styles/Dashboard.css` - Added alert styling
- `src/styles/Consumption.css` - Added power consumption styling

## Key Benefits

✅ **Real-time Awareness**: Know when devices consume excessive power
✅ **Automatic Detection**: Alerts generated without manual intervention
✅ **Device Prioritization**: Identify high-consumption devices quickly
✅ **Cost Savings**: Take action to reduce energy waste
✅ **Mobile-Friendly**: Alerts visible on all devices
✅ **Actionable Data**: Detailed information for decision-making

## Future Enhancements

- Customizable power thresholds per device
- Alert history and trend analysis
- Recommendations for reducing consumption
- SMS/Email notifications
- Scheduled alerts (e.g., peak hours)
- AI-powered anomaly detection
- Predictive consumption forecasting
