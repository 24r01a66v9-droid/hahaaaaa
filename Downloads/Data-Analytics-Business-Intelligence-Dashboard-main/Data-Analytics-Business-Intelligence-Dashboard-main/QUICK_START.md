# Quick Start Guide - Analytics Dashboard

## ⚡ 5-Minute Setup

### Step 1: Database Setup (2 minutes)

1. **Open MySQL Command Line or MySQL Workbench**
2. **Run the SQL file:**
   ```sql
   SOURCE dashboard.sql;
   ```
   OR copy-paste all SQL commands from `dashboard.sql` file

3. **Verify:**
   ```sql
   USE dashboard_db;
   SHOW TABLES;
   ```
   You should see: `dashboard_config`, `data_sources`, `kpi_metrics`, `reports`, `sales`

### Step 2: Backend Setup (1.5 minutes)

```bash
# Open Command Prompt/Terminal in project root
cd path/to/Analyistics

# Install dependencies
npm install

# Create .env file
# On Windows:
copy .env.example .env

# Update .env with your MySQL credentials (if different from defaults)
# Default: root/root@localhost:3306/dashboard_db
```

### Step 3: Start Backend Server

```bash
# Terminal 1
npm start
```

**Expected output:**
```
Server running on port 5000
```

### Step 4: Start Frontend (New Terminal)

```bash
# Terminal 2 (in same directory)
npm start
```

**Expected output:**
```
Compiled successfully!
On Your Network: http://192.x.x.x:3000
```

### Step 5: Open Dashboard

Open your browser and go to: **http://localhost:3000**

---

## 📊 What You'll See

✅ **KPI Monitoring** - 4 KPIs with progress bars
✅ **Sales Chart** - Bar/Line chart with 6 months of data  
✅ **Revenue Trends** - Line chart showing growth
✅ **Customer Analytics** - Doughnut chart with segmentation
✅ **Reports Section** - Create and export reports

---

## 🔧 Common Issues & Fixes

### ❌ "Cannot find module 'react'"
```bash
npm install
```

### ❌ "Connection refused: 127.0.0.1:3306"
- Ensure MySQL is running
- Check DB credentials in .env

### ❌ "Port 3000 already in use"
```bash
# Change port (Windows)
set PORT=3001
npm start

# OR (Mac/Linux)
PORT=3001 npm start
```

### ❌ "Cannot GET /api/sales"
- Ensure backend server is running (npm start in Terminal 1)
- Check backend console for errors

---

## 🎯 Testing the Dashboard

1. **View Sales Data**: Chart loads with Jan-Jun data
2. **Monitor KPIs**: See 4 KPIs with percentages
3. **Create Report**: Fill form and click "Create Report"
4. **Export Report**: Click "Export" on created report
5. **Refresh Data**: Click "Refresh Data" button

---

## 📞 API Testing

Test API endpoints with cURL or Postman:

```bash
# Get all sales
curl http://localhost:5000/api/sales

# Get all KPIs
curl http://localhost:5000/api/kpi

# Health check
curl http://localhost:5000/api/health
```

---

## 📦 What's Included

✅ Complete database schema with 5 tables
✅ Express.js backend with 12+ API endpoints
✅ React.js frontend with 5 components
✅ Chart.js integration for data visualization
✅ Sample data pre-populated
✅ Professional styling and UI
✅ Responsive design
✅ Error handling
✅ CORS enabled

---

## 🚀 Ready to Use!

Your Analytics Dashboard is now ready to:
- Monitor KPIs in real-time
- Visualize sales and revenue data
- Create custom reports
- Export data in multiple formats
- Track customer analytics

**Happy Analyzing! 📊**