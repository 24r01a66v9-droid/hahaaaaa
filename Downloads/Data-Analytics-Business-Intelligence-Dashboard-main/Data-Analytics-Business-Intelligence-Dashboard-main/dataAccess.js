const pool = require("./config");

let useMemory = false;
let nextId = { sales: 7, kpi: 5, reports: 1, dataSources: 4, dashboard: 2 };

const memory = {
  sales: [
    { id: 1, month: "Jan", amount: 1200, created_at: new Date(2026, 0, 15).toISOString() },
    { id: 2, month: "Feb", amount: 1800, created_at: new Date(2026, 1, 15).toISOString() },
    { id: 3, month: "Mar", amount: 2500, created_at: new Date(2026, 2, 15).toISOString() },
    { id: 4, month: "Apr", amount: 3000, created_at: new Date(2026, 3, 15).toISOString() },
    { id: 5, month: "May", amount: 3500, created_at: new Date(2026, 4, 15).toISOString() },
    { id: 6, month: "Jun", amount: 4200, created_at: new Date(2026, 5, 15).toISOString() },
  ],
  kpi: [
    { id: 1, kpi_name: "Revenue Growth", kpi_value: 45.5, kpi_type: "percentage", target_value: 50, actual_value: 45.5, percentage: 91 },
    { id: 2, kpi_name: "Customer Acquisition", kpi_value: 250, kpi_type: "count", target_value: 300, actual_value: 250, percentage: 83 },
    { id: 3, kpi_name: "Market Share", kpi_value: 32.5, kpi_type: "percentage", target_value: 35, actual_value: 32.5, percentage: 93 },
    { id: 4, kpi_name: "Customer Satisfaction", kpi_value: 4.7, kpi_type: "rating", target_value: 5, actual_value: 4.7, percentage: 94 },
  ],
  reports: [],
  dataSources: [
    { id: 1, source_name: "Sales Database", source_type: "PostgreSQL", connection_url: "localhost:5432", is_active: true },
    { id: 2, source_name: "Analytics API", source_type: "REST", connection_url: "https://api.analytics.com", is_active: true },
    { id: 3, source_name: "CRM System", source_type: "REST", connection_url: "https://crm.example.com", is_active: true },
  ],
  dashboard: {
    id: 1,
    dashboard_name: "Main Dashboard",
    layout: { type: "grid", columns: 4 },
    widgets: ["sales_chart", "kpi_monitor", "revenue_chart", "customer_chart"],
  },
};

async function init() {
  try {
    await pool.query("SELECT 1");
    console.log("Connected to PostgreSQL");
  } catch (error) {
    useMemory = true;
    console.warn("PostgreSQL unavailable — using in-memory data store");
    console.warn("Start PostgreSQL and run dashboard.sql for persistent storage");
  }
}

function isMemoryMode() {
  return useMemory;
}

async function getSales() {
  if (!useMemory) {
    const result = await pool.query("SELECT * FROM sales ORDER BY id");
    return result.rows;
  }
  return memory.sales;
}

async function addSale(month, amount) {
  if (!useMemory) {
    await pool.query("INSERT INTO sales(month, amount) VALUES ($1, $2)", [month, amount]);
    return;
  }
  memory.sales.push({ id: nextId.sales++, month, amount, created_at: new Date().toISOString() });
}

async function importSales(salesRows) {
  const imported = [];
  for (const row of salesRows) {
    const month = row.month?.trim();
    const amount = Number(row.amount);
    if (!month || Number.isNaN(amount)) continue;
    await addSale(month, amount);
    imported.push({ month, amount });
  }
  return imported;
}

async function getKpis() {
  if (!useMemory) {
    const result = await pool.query("SELECT * FROM kpi_metrics");
    return result.rows;
  }
  return memory.kpi;
}

async function getKpiById(id) {
  if (!useMemory) {
    const result = await pool.query("SELECT * FROM kpi_metrics WHERE id = $1", [id]);
    return result.rows[0];
  }
  return memory.kpi.find((k) => k.id === Number(id));
}

async function addKpi(kpi_name, kpi_type, target_value, actual_value) {
  const percentage = Math.round((actual_value / target_value) * 100);
  if (!useMemory) {
    await pool.query(
      "INSERT INTO kpi_metrics(kpi_name, kpi_type, target_value, actual_value, percentage) VALUES ($1, $2, $3, $4, $5)",
      [kpi_name, kpi_type, target_value, actual_value, percentage]
    );
    return { percentage };
  }
  memory.kpi.push({ id: nextId.kpi++, kpi_name, kpi_type, target_value, actual_value, percentage });
  return { percentage };
}

async function updateKpi(id, actual_value) {
  if (!useMemory) {
    const kpiResult = await pool.query("SELECT target_value FROM kpi_metrics WHERE id = $1", [id]);
    if (kpiResult.rows.length === 0) return null;
    const percentage = Math.round((actual_value / kpiResult.rows[0].target_value) * 100);
    await pool.query("UPDATE kpi_metrics SET actual_value = $1, percentage = $2 WHERE id = $3", [
      actual_value,
      percentage,
      id,
    ]);
    return { percentage };
  }
  const kpi = memory.kpi.find((k) => k.id === Number(id));
  if (!kpi) return null;
  kpi.actual_value = actual_value;
  kpi.percentage = Math.round((actual_value / kpi.target_value) * 100);
  return { percentage: kpi.percentage };
}

async function getReports() {
  if (!useMemory) {
    const result = await pool.query("SELECT * FROM reports ORDER BY created_at DESC");
    return result.rows;
  }
  return [...memory.reports].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

async function createReport(report_name, report_type, data, created_by) {
  if (!useMemory) {
    await pool.query(
      "INSERT INTO reports(report_name, report_type, data, created_by) VALUES ($1, $2, $3, $4)",
      [report_name, report_type, JSON.stringify(data), created_by]
    );
    return;
  }
  memory.reports.push({
    id: nextId.reports++,
    report_name,
    report_type,
    data,
    created_at: new Date().toISOString(),
    created_by,
    is_exported: false,
  });
}

async function getReportById(id) {
  if (!useMemory) {
    const result = await pool.query("SELECT * FROM reports WHERE id = $1", [id]);
    return result.rows[0];
  }
  return memory.reports.find((r) => r.id === Number(id));
}

async function exportReport(id) {
  if (!useMemory) {
    await pool.query("UPDATE reports SET is_exported = TRUE WHERE id = $1", [id]);
    return getReportById(id);
  }
  const report = memory.reports.find((r) => r.id === Number(id));
  if (report) report.is_exported = true;
  return report;
}

async function getDataSources() {
  if (!useMemory) {
    const result = await pool.query("SELECT * FROM data_sources WHERE is_active = TRUE");
    return result.rows;
  }
  return memory.dataSources.filter((s) => s.is_active);
}

async function addDataSource(source_name, source_type, connection_url) {
  if (!useMemory) {
    await pool.query(
      "INSERT INTO data_sources(source_name, source_type, connection_url) VALUES ($1, $2, $3)",
      [source_name, source_type, connection_url]
    );
    return;
  }
  memory.dataSources.push({
    id: nextId.dataSources++,
    source_name,
    source_type,
    connection_url,
    is_active: true,
    last_synced: null,
  });
}

async function syncDataSource(id) {
  const now = new Date().toISOString();
  if (!useMemory) {
    const result = await pool.query(
      "UPDATE data_sources SET last_synced = $1 WHERE id = $2 RETURNING *",
      [now, id]
    );
    return result.rows[0];
  }
  const source = memory.dataSources.find((s) => s.id === Number(id));
  if (!source) return null;
  source.last_synced = now;
  if (source.source_type === "CSV" || source.source_type === "Excel") {
    await addSale("Jul", 4800 + Math.floor(Math.random() * 500));
  }
  return source;
}

async function getDashboardConfig() {
  if (!useMemory) {
    const result = await pool.query("SELECT * FROM dashboard_config ORDER BY id DESC LIMIT 1");
    return result.rows[0] || {};
  }
  return memory.dashboard;
}

async function saveDashboardConfig(dashboard_name, layout, widgets) {
  if (!useMemory) {
    await pool.query(
      "INSERT INTO dashboard_config(dashboard_name, layout, widgets) VALUES ($1, $2, $3)",
      [dashboard_name, JSON.stringify(layout), JSON.stringify(widgets)]
    );
    return;
  }
  memory.dashboard = { id: nextId.dashboard++, dashboard_name, layout, widgets };
}

module.exports = {
  init,
  isMemoryMode,
  getSales,
  addSale,
  importSales,
  getKpis,
  getKpiById,
  addKpi,
  updateKpi,
  getReports,
  getReportById,
  createReport,
  exportReport,
  getDataSources,
  addDataSource,
  syncDataSource,
  getDashboardConfig,
  saveDashboardConfig,
};
