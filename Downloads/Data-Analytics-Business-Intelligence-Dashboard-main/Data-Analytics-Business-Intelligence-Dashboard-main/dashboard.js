import React, { useState, useEffect } from "react";
import SalesChart from "./SalesChart";
import KPIMonitor from "./KPIMonitor";
import RevenueChart from "./RevenueChart";
import CustomerChart from "./CustomerChart";
import ReportExport from "./ReportExport";
import "./Dashboard.css";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    sales: [],
    kpis: [],
    reports: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [salesRes, kpiRes, reportsRes] = await Promise.all([
        fetch("http://localhost:5000/api/sales"),
        fetch("http://localhost:5000/api/kpi"),
        fetch("http://localhost:5000/api/reports"),
      ]);

      const sales = await salesRes.json();
      const kpis = await kpiRes.json();
      const reports = await reportsRes.json();

      setDashboardData({ sales, kpis, reports });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDataRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
    return <div className="dashboard-container"><p>Loading dashboard...</p></div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>📊 Business Intelligence Dashboard</h1>
        <button onClick={handleDataRefresh} className="refresh-btn">🔄 Refresh Data</button>
      </header>

      <div className="dashboard-grid">
        {/* KPI Monitoring Section */}
        <section className="dashboard-section kpi-section">
          <h2>📈 Key Performance Indicators</h2>
          <KPIMonitor kpis={dashboardData.kpis} />
        </section>

        {/* Sales Chart */}
        <section className="dashboard-section chart-section">
          <h2>💰 Sales Overview</h2>
          <SalesChart sales={dashboardData.sales} />
        </section>

        {/* Revenue Chart */}
        <section className="dashboard-section chart-section">
          <h2>📊 Revenue Trends</h2>
          <RevenueChart sales={dashboardData.sales} />
        </section>

        {/* Customer Chart */}
        <section className="dashboard-section chart-section">
          <h2>👥 Customer Analytics</h2>
          <CustomerChart sales={dashboardData.sales} />
        </section>

        {/* Reports Section */}
        <section className="dashboard-section reports-section">
          <h2>📄 Reports & Exports</h2>
          <ReportExport reports={dashboardData.reports} onExport={handleDataRefresh} />
        </section>
      </div>

      <footer className="dashboard-footer">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </footer>
    </div>
  );
}

export default Dashboard;