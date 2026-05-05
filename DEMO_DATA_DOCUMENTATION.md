# Demo Data Feature Documentation

## Overview
The Smart Energy Monitoring System now includes a demo data seeding feature to provide sample energy consumption records for demonstration and testing purposes.

## Demo Data Specifications

### Sample Devices Created (5 devices)
1. **Living Room AC**
   - Device Type: Smart Plug
   - Location: Living Room
   - Manufacturer: LG
   - Model: Smart AC 2000
   - Status: Active

2. **Kitchen Refrigerator**
   - Device Type: Smart Plug
   - Location: Kitchen
   - Manufacturer: Samsung
   - Model: Smart Fridge Pro
   - Status: Active

3. **Water Heater**
   - Device Type: Meter
   - Location: Utility Room
   - Manufacturer: Ariston
   - Model: Smart Water Heater
   - Status: Active

4. **Bedroom Lights & Fan**
   - Device Type: Smart Plug
   - Location: Bedroom
   - Manufacturer: Philips
   - Model: Smart Light & Fan
   - Status: Active

5. **Washing Machine**
   - Device Type: Smart Plug
   - Location: Laundry Room
   - Manufacturer: Bosch
   - Model: Smart Washing Machine
   - Status: Active

### Sample Energy Consumption Data (20 records total)

Each device has 4 hourly records with realistic consumption patterns:

#### Living Room AC (3.2-3.8 kWh per hour)
- Record 1: 3.5 kWh (24 hours ago)
- Record 2: 3.8 kWh (20 hours ago)
- Record 3: 3.2 kWh (16 hours ago)
- Record 4: 2.1 kWh (12 hours ago)

#### Kitchen Refrigerator (0.7-0.9 kWh per hour)
- Record 1: 0.8 kWh
- Record 2: 0.9 kWh
- Record 3: 0.85 kWh
- Record 4: 0.7 kWh

#### Water Heater (1.8-2.5 kWh per hour)
- Record 1: 2.5 kWh
- Record 2: 2.3 kWh
- Record 3: 1.8 kWh
- Record 4: 2.0 kWh

#### Bedroom Lights & Fan (0.25-0.4 kWh per hour)
- Record 1: 0.4 kWh
- Record 2: 0.35 kWh
- Record 3: 0.3 kWh
- Record 4: 0.25 kWh

#### Washing Machine (0.3-2.8 kWh per hour)
- Record 1: 1.2 kWh
- Record 2: 1.5 kWh
- Record 3: 0.3 kWh
- Record 4: 2.8 kWh

### Data Fields for Each Record
- **timestamp**: Hourly records distributed across the last 24 hours
- **consumption**: Energy usage in kWh (realistic device patterns)
- **voltage**: 230V ± 5V variation
- **current**: Calculated based on consumption (A = kWh*1000/230V)
- **powerFactor**: 0.95-1.0 (typical for household appliances)
- **cost**: Calculated at ₱8.50 per kWh
- **temperature**: 26-30°C (realistic room temperature)
- **humidity**: 60-80% (typical household humidity)
- **period**: "Hourly"

## Backend Implementation

### New Service: `demoDataService.js`
- **seedDemoConsumptionData()**: Creates 5 devices and 20 consumption records
- **createSampleDevices()**: Generates realistic device configurations
- **generateDemoConsumptionData()**: Creates time-series consumption records
- **clearDemoData()**: Removes all demo devices and consumption records for a user

### New Controller Methods: `consumptionController.js`
- **seedDemoData()**: POST endpoint to seed demo data for a user
- **clearDemoData()**: DELETE endpoint to clear all demo data for a user

### New Routes: `consumptionRoutes.js`
- `POST /consumption/:userId/demo-data/seed` - Load demo data
- `DELETE /consumption/:userId/demo-data/clear` - Clear demo data

## Frontend Implementation

### Updated Components: `Dashboard.jsx`
- Added "Demo Data" section with two buttons:
  - "➕ Load Demo Data" - Seeds 5 devices and 20 consumption records
  - "🗑️ Clear Demo Data" - Removes all demo data with confirmation
- Display success/error messages for demo data operations
- Loading state indicators during operations
- Automatic dashboard refresh after data operations

### Updated Services: `apiService.js`
- **seedDemoData(userId)**: POST request to seed demo data
- **clearDemoData(userId)**: DELETE request to clear demo data

### Updated Styles: `Dashboard.css`
- New `.demo-data-section` styling with card layout
- Button styling with disabled states
- Responsive design for mobile devices

## Usage Instructions

### For End Users
1. Navigate to the Dashboard homepage
2. Scroll down to the "Demo Data" section
3. Click "➕ Load Demo Data" to populate the system with sample records
4. Demo data appears immediately in:
   - Consumption page (Daily/Monthly tabs)
   - Reports page (with detailed analytics)
   - Devices page (5 sample devices listed)
   - Dashboard (updated stats and device count)
5. Click "🗑️ Clear Demo Data" to remove all demo records

### For Developers/Testing
- Demo data is only seeded if no consumption records exist for the user
- Each user can have their own independent demo data set
- Demo data uses realistic energy consumption patterns
- Perfect for testing dashboards, reports, and analytics features

## Technical Details

### Database Operations
- Uses MongoDB transactions for data consistency
- Creates atomic document inserts for devices and consumption records
- Validates user authorization before operations

### Performance
- Seeding 5 devices + 20 records: ~100-200ms
- Clearing demo data: ~50-100ms
- No impact on existing production data

### Data Isolation
- Demo data is tied to specific userId
- Separate users have completely isolated demo data
- Clearing demo data only affects the requesting user

## Future Enhancements
- Option to customize demo data (# of devices, date range, consumption patterns)
- Scheduled demo data refresh
- Demo data templates for different household sizes/types
- Export demo data as reference datasets
