# Configuration Guide

## Environment Variables (.env)

Create a `.env` file in the project root with the following variables:

```env
# Database Configuration
DB_HOST=localhost           # MySQL server hostname
DB_USER=root               # MySQL username
DB_PASSWORD=root           # MySQL password
DB_NAME=dashboard_db       # Database name
DB_PORT=3306               # MySQL port (default: 3306)

# Server Configuration
PORT=5000                  # Backend server port
NODE_ENV=development       # Environment (development/production)

# Frontend Configuration
REACT_APP_API_BASE_URL=http://localhost:5000  # Backend API URL
```

## Database Configuration Details

### Connection Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| Host | localhost | MySQL server address |
| Port | 3306 | MySQL default port |
| User | root | MySQL username |
| Password | root | MySQL password |
| Database | dashboard_db | Database name |

### Database Tables

#### 1. sales
```sql
- id: INT (Primary Key)
- month: VARCHAR(20)
- amount: INT
- created_at: TIMESTAMP
```

#### 2. kpi_metrics
```sql
- id: INT (Primary Key)
- kpi_name: VARCHAR(100)
- kpi_value: DECIMAL(10, 2)
- kpi_type: VARCHAR(50)
- target_value: DECIMAL(10, 2)
- actual_value: DECIMAL(10, 2)
- percentage: INT
- updated_at: TIMESTAMP
```

#### 3. reports
```sql
- id: INT (Primary Key)
- report_name: VARCHAR(100)
- report_type: VARCHAR(50)
- data: JSON
- created_at: TIMESTAMP
- created_by: VARCHAR(100)
- is_exported: BOOLEAN
```

#### 4. data_sources
```sql
- id: INT (Primary Key)
- source_name: VARCHAR(100)
- source_type: VARCHAR(50)
- connection_url: VARCHAR(255)
- last_synced: TIMESTAMP
- is_active: BOOLEAN
```

#### 5. dashboard_config
```sql
- id: INT (Primary Key)
- dashboard_name: VARCHAR(100)
- layout: JSON
- widgets: JSON
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

## Backend Configuration

### Express.js Server

- **Port**: 5000 (configurable via PORT environment variable)
- **CORS**: Enabled for all origins
- **Middleware**:
  - cors()
  - express.json()

### API Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "status": 200,
  "data": { /* response data */ },
  "message": "Success message"
}
```

**Error Response:**
```json
{
  "status": 500,
  "error": "Error message",
  "message": "What went wrong"
}
```

## Frontend Configuration

### React.js Setup

- **Port**: 3000 (default)
- **Build Tool**: react-scripts
- **Node Version**: 14+ required

### Chart.js Configuration

Charts are configured with the following defaults:

```javascript
const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};
```

## Performance Optimization

### Database Optimization

- Indexes on frequently queried columns
- Connection pooling (10 concurrent connections)
- Query optimization for large datasets

### Frontend Optimization

- Lazy loading of components
- Image optimization
- CSS minification
- Code splitting

## Security Considerations

### Environment Variables

**Never commit sensitive data:**
- Database passwords
- API keys
- Database credentials

**Keep in .env file (not in version control)**

### Database Security

- Use strong passwords
- Limit database user permissions
- Use parameterized queries (already implemented)
- Regular backups

### API Security

- CORS configured
- Input validation on all endpoints
- Error handling to prevent information leakage

## Deployment Checklist

- [ ] Update .env for production database
- [ ] Set NODE_ENV=production
- [ ] Run npm install --production
- [ ] Set strong database password
- [ ] Configure CORS for specific domains
- [ ] Set up SSL/HTTPS
- [ ] Enable database backups
- [ ] Configure logging
- [ ] Set up error monitoring
- [ ] Test all API endpoints

## Scaling Considerations

### Horizontal Scaling

- Use load balancer
- Multiple backend instances
- Shared database (MySQL replication)
- Redis for caching

### Vertical Scaling

- Increase server RAM
- Use faster CPU
- Optimize database queries
- Add indexes to tables

## Monitoring & Logging

### Backend Logging

Current setup logs to console. For production:

```javascript
// Add logging middleware
app.use(logger());
```

### Database Monitoring

- Query execution time
- Connection pool status
- Slow query logs

### Frontend Monitoring

- Error tracking
- Performance monitoring
- User analytics

## Support & Troubleshooting

### Common Configuration Issues

1. **Database Connection Error**
   - Verify MySQL is running
   - Check credentials in .env
   - Ensure port 3306 is open

2. **CORS Issues**
   - Check CORS configuration in server.js
   - Verify frontend URL is whitelisted

3. **Port Conflicts**
   - Change PORT in .env
   - Check process using port: lsof -i :5000

4. **Missing Dependencies**
   - Run npm install
   - Check package.json for all dependencies