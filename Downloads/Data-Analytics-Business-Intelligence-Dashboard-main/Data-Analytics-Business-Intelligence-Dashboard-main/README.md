# Data Analytics & Business Intelligence Dashboard

A comprehensive platform to visualize and analyze business data with custom dashboards, KPI monitoring, data imports, and exportable reports.

## 📋 Features

- **Custom Dashboards** - Create and customize business intelligence dashboards
- **KPI Monitoring** - Track key performance indicators with real-time metrics
- **Data Import** - Import data from multiple sources
- **Data Visualization** - Multiple chart types (Bar, Line, Doughnut)
- **Exportable Reports** - Generate and export reports in various formats (PDF, Excel, CSV, JSON)
- **Revenue Analytics** - Track revenue trends over time
- **Customer Analytics** - Segment customers by revenue value
- **Responsive Design** - Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React.js, Chart.js, D3.js
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Styling**: CSS3

## 📦 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL Server (v12 or higher)

## 🚀 Installation & Setup

### 1. Database Setup

First, ensure PostgreSQL is running and create the database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Run the SQL schema
\i path/to/dashboard.sql
```

Or use pgAdmin GUI to create the database and run the SQL commands.

**For detailed PostgreSQL setup, see [POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md)**

### 2. Backend Setup

```bash
# Navigate to project root
cd path/to/Analyistics

# Install backend dependencies
npm install

# Create .env file (copy from .env.example)
cp .env.example .env

# Update .env with your database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=dashboard_db
# DB_PORT=3306

# Start the backend server
npm start

# Server will run on http://localhost:5000
```

### 3. Frontend Setup

```bash
# In the same directory, install frontend dependencies
npm install

# Start the React development server
npm start

# Frontend will run on http://localhost:3000
```

## 📁 Project Structure

```
Analyistics/
├── components/
│   ├── Dashboard.js          # Main dashboard component
│   ├── SalesChart.js         # Sales visualization
│   ├── KPIMonitor.js         # KPI tracking component
│   ├── RevenueChart.js       # Revenue trends
│   ├── CustomerChart.js      # Customer analytics
│   └── ReportExport.js       # Report generation
├── styles/
│   ├── App.css               # App styling
│   ├── Dashboard.css         # Dashboard styling
│   ├── SalesChart.css        # Chart styling
│   ├── KPIMonitor.css        # KPI styling
│   └── ReportExport.css      # Report styling
├── public/
│   └── index.html            # HTML template
├── app.js                     # Main App component
├── index.js                   # React entry point
├── server.js                  # Express server
├── config.js                  # Database configuration
├── dashboard.sql             # Database schema
└── package.json              # Frontend dependencies
```

## 📊 API Endpoints

### Sales Endpoints
- `GET /api/sales` - Get all sales data
- `POST /api/sales` - Add new sales record

### KPI Endpoints
- `GET /api/kpi` - Get all KPI metrics
- `GET /api/kpi/:id` - Get specific KPI
- `POST /api/kpi` - Create new KPI
- `PUT /api/kpi/:id` - Update KPI

### Reports Endpoints
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Create new report
- `POST /api/reports/:id/export` - Export report

### Data Sources Endpoints
- `GET /api/data-sources` - Get all data sources
- `POST /api/data-sources` - Add new data source

### Dashboard Endpoints
- `GET /api/dashboard` - Get dashboard configuration
- `POST /api/dashboard` - Save dashboard configuration

### Health Check
- `GET /api/health` - Server health status

## 🎨 Dashboard Features

### 1. KPI Monitoring
- Real-time KPI tracking
- Performance percentage indicators
- Target vs Actual comparison
- Color-coded status (Green: 90%+, Yellow: 75%+, Red: <75%)

### 2. Sales Overview
- Bar and line chart visualization
- Monthly sales data
- Toggle between chart types

### 3. Revenue Trends
- Line chart with smooth curves
- Revenue history visualization
- Currency formatting

### 4. Customer Analytics
- Doughnut chart segmentation
- Customer revenue categorization
- Total revenue statistics

### 5. Reports & Exports
- Create custom reports
- Export in multiple formats
- Report history tracking
- Export status indicators

## 🔧 Configuration

Update the following in `.env` file:

```
DB_HOST=localhost           # PostgreSQL host
DB_USER=postgres           # PostgreSQL username
DB_PASSWORD=postgres       # PostgreSQL password
DB_NAME=dashboard_db       # Database name
DB_PORT=5432               # PostgreSQL port (default)
PORT=5000                  # Server port
NODE_ENV=development       # Environment
```

**Note**: Default PostgreSQL credentials are `postgres:postgres`. Update if you set different credentials during installation.

## 📈 Sample Data

The database comes with pre-populated sample data:
- 6 months of sales data (Jan-Jun)
- 4 KPI metrics with targets and actuals
- 3 configured data sources
- 1 main dashboard configuration

## 🚀 Running the Application

### Terminal 1 - Start Backend Server
```bash
npm start
# Server running on http://localhost:5000
```

### Terminal 2 - Start Frontend Development Server
```bash
npm start
# Frontend running on http://localhost:3000
```

Open http://localhost:3000 in your browser to access the dashboard.

## 🔄 Data Flow

1. **Frontend (React)** makes API calls to the backend
2. **Backend (Express)** processes requests and queries the database
3. **Database (MySQL)** stores and retrieves data
4. **Response** is sent back to frontend and displayed in charts/tables

## 📝 Adding New Features

### Adding a New Chart Type
1. Create new component in `components/` folder
2. Import Chart.js necessary components
3. Add to Dashboard.js in the dashboard-grid

### Adding a New API Endpoint
1. Create route in `server.js`
2. Add database query in route handler
3. Test with API client (Postman)
4. Update frontend to call new endpoint

### Adding a New KPI
1. Insert record in `kpi_metrics` table
2. API will automatically include in `/api/kpi` response
3. KPIMonitor component will display it

## 🐛 Troubleshooting

### Database Connection Error
- Ensure MySQL is running
- Check credentials in `.env`
- Verify database exists: `SHOW DATABASES;`

### Port Already in Use
- Backend: Change PORT in `.env` (default 5000)
- Frontend: Set PORT=3001 before npm start

### Missing Dependencies
```bash
# Reinstall all dependencies
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
- CORS is enabled on backend for all origins
- If issues persist, check server.js CORS configuration

## 📄 License

This project is open source and available under the MIT License.

## 👥 Support

For issues or questions, please create an issue in the project repository.

## 🎯 Future Enhancements

- User authentication and authorization
- Real-time data sync with WebSockets
- Advanced filtering and search
- Custom report builder
- Email notifications
- Data import from external APIs
- Dark mode theme
- Mobile app version
- Predictive analytics