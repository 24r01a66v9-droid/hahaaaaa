-- Create Database (if not exists)
CREATE DATABASE dashboard_db;

-- Connect to the database
\c dashboard_db;

-- Sales Data Table
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    month VARCHAR(20),
    amount INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- KPI Metrics Table
CREATE TABLE IF NOT EXISTS kpi_metrics (
    id SERIAL PRIMARY KEY,
    kpi_name VARCHAR(100) NOT NULL,
    kpi_value NUMERIC(10, 2),
    kpi_type VARCHAR(50),
    target_value NUMERIC(10, 2),
    actual_value NUMERIC(10, 2),
    percentage INTEGER,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id SERIAL PRIMARY KEY,
    report_name VARCHAR(100) NOT NULL,
    report_type VARCHAR(50),
    data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    is_exported BOOLEAN DEFAULT FALSE
);

-- Data Sources Table
CREATE TABLE IF NOT EXISTS data_sources (
    id SERIAL PRIMARY KEY,
    source_name VARCHAR(100),
    source_type VARCHAR(50),
    connection_url VARCHAR(255),
    last_synced TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Dashboard Configurations Table
CREATE TABLE IF NOT EXISTS dashboard_config (
    id SERIAL PRIMARY KEY,
    dashboard_name VARCHAR(100),
    layout JSONB,
    widgets JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Sample Data
INSERT INTO sales(month, amount) VALUES
('Jan', 1200),
('Feb', 1800),
('Mar', 2500),
('Apr', 3000),
('May', 3500),
('Jun', 4200);

INSERT INTO kpi_metrics(kpi_name, kpi_value, kpi_type, target_value, actual_value, percentage) VALUES
('Revenue Growth', 45.5, 'percentage', 50, 45.5, 91),
('Customer Acquisition', 250, 'count', 300, 250, 83),
('Market Share', 32.5, 'percentage', 35, 32.5, 93),
('Customer Satisfaction', 4.7, 'rating', 5, 4.7, 94);

INSERT INTO data_sources(source_name, source_type, connection_url, is_active) VALUES
('Sales Database', 'PostgreSQL', 'localhost:5432', TRUE),
('Analytics API', 'REST', 'https://api.analytics.com', TRUE),
('CRM System', 'REST', 'https://crm.example.com', TRUE);

INSERT INTO dashboard_config(dashboard_name, layout, widgets) VALUES
('Main Dashboard', '{"type": "grid", "columns": 4}', '["sales_chart", "kpi_monitor", "revenue_chart", "customer_chart"]');