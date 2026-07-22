# PostgreSQL Setup Guide

## 🐘 PostgreSQL Installation & Setup

This dashboard uses **Node.js + Express** backend with **PostgreSQL** database.

---

## Step 1: Install PostgreSQL

### Windows
1. Download from: https://www.postgresql.org/download/windows/
2. Run the installer
3. Note the **password** you set for `postgres` user
4. Default port is **5432**

### Mac
```bash
brew install postgresql@15
brew services start postgresql@15
```

### Linux
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

---

## Step 2: Create Database & Tables

### Option A: Using psql Command Line

```powershell
# Windows PowerShell
psql -U postgres

# Then run in psql:
\i "C:\path\to\dashboard.sql"
```

### Option B: Using pgAdmin GUI

1. Open **pgAdmin**
2. Right-click on "Databases" → Create → Database
3. Name: `dashboard_db`
4. Click Create
5. Then run the SQL from `dashboard.sql`

### Option C: Using SQL Editor

1. Open **pgAdmin** or **DBeaver**
2. Copy all SQL from `dashboard.sql`
3. Paste into query editor
4. Execute

---

## Step 3: Verify Database Connection

```powershell
psql -U postgres -d dashboard_db -c "SELECT * FROM sales LIMIT 5;"
```

Expected output:
```
 id | month | amount |         created_at
----+-------+--------+----------------------------
  1 | Jan   |   1200 | 2026-06-04 12:00:00.000000
  2 | Feb   |   1800 | 2026-06-04 12:00:00.000000
...
```

---

## Step 4: Update Connection Credentials

If PostgreSQL uses different credentials, update `.env`:

```env
DB_HOST=localhost           # PostgreSQL host
DB_USER=postgres            # PostgreSQL username
DB_PASSWORD=your_password   # Your PostgreSQL password
DB_NAME=dashboard_db        # Database name
DB_PORT=5432                # PostgreSQL port (default)
```

---

## Step 5: Start Backend Server

```powershell
# In project directory
node server.js
```

Expected output:
```
Server running on port 5000
```

---

## Step 6: Start Frontend

```powershell
# In new terminal
npm start
```

Visit: http://localhost:5001

---

## PostgreSQL Useful Commands

```sql
-- List all databases
\l

-- Connect to database
\c dashboard_db

-- List all tables
\dt

-- View sales data
SELECT * FROM sales;

-- View KPI metrics
SELECT * FROM kpi_metrics;

-- Insert new sales data
INSERT INTO sales(month, amount) VALUES ('Jul', 4500);

-- Update KPI
UPDATE kpi_metrics SET actual_value = 60 WHERE kpi_name = 'Revenue Growth';

-- View reports
SELECT * FROM reports;

-- Backup database
pg_dump -U postgres dashboard_db > backup.sql

-- Restore database
psql -U postgres dashboard_db < backup.sql
```

---

## Troubleshooting

### ❌ "Could not connect to server"
- Ensure PostgreSQL is running
- Check DB_HOST and DB_PORT in .env
- Verify username/password

### ❌ "Database does not exist"
- Run dashboard.sql to create database
- Check database name in .env

### ❌ "Connection refused on port 5432"
- PostgreSQL might not be running
- Start PostgreSQL service
- Check firewall settings

### ❌ "Permission denied for user 'postgres'"
- Check password in .env
- Verify username is correct
- Reset PostgreSQL password if needed

---

## PostgreSQL Tools

### pgAdmin (Web UI)
- Download: https://www.pgadmin.org/
- Great for visual management
- Query editor included

### DBeaver (Desktop)
- Download: https://dbeaver.io/
- Free and powerful
- Supports multiple databases

### psql (Command Line)
- Built into PostgreSQL
- Lightweight
- Good for scripting

---

## API Connection Test

```bash
# Test if backend is connected to database
curl http://localhost:5000/api/sales
```

Expected response:
```json
[
  {"id": 1, "month": "Jan", "amount": 1200},
  {"id": 2, "month": "Feb", "amount": 1800},
  ...
]
```

---

## Production Deployment

For production PostgreSQL:

```env
DB_HOST=production.db.example.com
DB_USER=prod_user
DB_PASSWORD=strong_password_here
DB_NAME=dashboard_prod
DB_PORT=5432
NODE_ENV=production
```

Enable SSL connection:
```javascript
// In config.js
const pool = new Pool({
  // ... other config
  ssl: {
    rejectUnauthorized: false
  }
});
```

---

**Dashboard is ready with PostgreSQL! 🚀**