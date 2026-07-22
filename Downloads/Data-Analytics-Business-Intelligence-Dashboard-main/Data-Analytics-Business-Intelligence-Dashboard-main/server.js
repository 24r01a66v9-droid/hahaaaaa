const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./dataAccess");

const app = express();

console.log("__dirname:", __dirname);
console.log("Public folder path:", path.join(__dirname, "public"));

app.use(cors());
app.use(express.json());

// Serve index.html for root path
app.get("/", (req, res) => {
  console.log("Root path request received");
  const filePath = path.join(__dirname, "public", "index.html");
  console.log("Sending file from:", filePath);
  res.sendFile(filePath, (err) => {
    if (err) console.error("Error sending file:", err);
  });
});

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

// ==================== SALES ENDPOINTS ====================
app.get("/api/sales", async (req, res) => {
  try {
    res.json(await db.getSales());
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ error: "Failed to fetch sales data" });
  }
});

app.post("/api/sales", async (req, res) => {
  try {
    const { month, amount } = req.body;
    await db.addSale(month, amount);
    res.json({ message: "Sales data added successfully" });
  } catch (error) {
    console.error("Error adding sales:", error);
    res.status(500).json({ error: "Failed to add sales data" });
  }
});

app.post("/api/sales/import", async (req, res) => {
  try {
    const { sales } = req.body;
    if (!Array.isArray(sales) || sales.length === 0) {
      return res.status(400).json({ error: "No sales data provided" });
    }
    const imported = await db.importSales(sales);
    res.json({ message: `${imported.length} records imported`, imported });
  } catch (error) {
    console.error("Error importing sales:", error);
    res.status(500).json({ error: "Failed to import sales data" });
  }
});

// ==================== KPI MONITORING ENDPOINTS ====================
app.get("/api/kpi", async (req, res) => {
  try {
    res.json(await db.getKpis());
  } catch (error) {
    console.error("Error fetching KPI data:", error);
    res.status(500).json({ error: "Failed to fetch KPI data" });
  }
});

app.get("/api/kpi/:id", async (req, res) => {
  try {
    const kpi = await db.getKpiById(req.params.id);
    if (!kpi) return res.status(404).json({ error: "KPI not found" });
    res.json(kpi);
  } catch (error) {
    console.error("Error fetching KPI:", error);
    res.status(500).json({ error: "Failed to fetch KPI" });
  }
});

app.post("/api/kpi", async (req, res) => {
  try {
    const { kpi_name, kpi_type, target_value, actual_value } = req.body;
    const result = await db.addKpi(kpi_name, kpi_type, target_value, actual_value);
    res.json({ message: "KPI added successfully", percentage: result.percentage });
  } catch (error) {
    console.error("Error adding KPI:", error);
    res.status(500).json({ error: "Failed to add KPI" });
  }
});

app.put("/api/kpi/:id", async (req, res) => {
  try {
    const { actual_value } = req.body;
    const result = await db.updateKpi(req.params.id, actual_value);
    if (!result) return res.status(404).json({ error: "KPI not found" });
    res.json({ message: "KPI updated successfully", percentage: result.percentage });
  } catch (error) {
    console.error("Error updating KPI:", error);
    res.status(500).json({ error: "Failed to update KPI" });
  }
});

// ==================== REPORTS ENDPOINTS ====================
app.get("/api/reports", async (req, res) => {
  try {
    res.json(await db.getReports());
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

app.post("/api/reports", async (req, res) => {
  try {
    const { report_name, report_type, data, created_by } = req.body;
    await db.createReport(report_name, report_type, data, created_by);
    res.json({ message: "Report created successfully" });
  } catch (error) {
    console.error("Error creating report:", error);
    res.status(500).json({ error: "Failed to create report" });
  }
});

app.get("/api/reports/:id", async (req, res) => {
  try {
    const report = await db.getReportById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json(report);
  } catch (error) {
    console.error("Error fetching report:", error);
    res.status(500).json({ error: "Failed to fetch report" });
  }
});

app.post("/api/reports/:id/export", async (req, res) => {
  try {
    const report = await db.exportReport(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json({ message: "Report exported successfully", report });
  } catch (error) {
    console.error("Error exporting report:", error);
    res.status(500).json({ error: "Failed to export report" });
  }
});

// ==================== DATA SOURCES ENDPOINTS ====================
app.get("/api/data-sources", async (req, res) => {
  try {
    res.json(await db.getDataSources());
  } catch (error) {
    console.error("Error fetching data sources:", error);
    res.status(500).json({ error: "Failed to fetch data sources" });
  }
});

app.post("/api/data-sources", async (req, res) => {
  try {
    const { source_name, source_type, connection_url } = req.body;
    await db.addDataSource(source_name, source_type, connection_url);
    res.json({ message: "Data source added successfully" });
  } catch (error) {
    console.error("Error adding data source:", error);
    res.status(500).json({ error: "Failed to add data source" });
  }
});

app.post("/api/data-sources/:id/sync", async (req, res) => {
  try {
    const source = await db.syncDataSource(req.params.id);
    if (!source) return res.status(404).json({ error: "Data source not found" });
    res.json({ message: "Data source synced successfully", source });
  } catch (error) {
    console.error("Error syncing data source:", error);
    res.status(500).json({ error: "Failed to sync data source" });
  }
});

// ==================== DASHBOARD CONFIG ENDPOINTS ====================
app.get("/api/dashboard", async (req, res) => {
  try {
    res.json(await db.getDashboardConfig());
  } catch (error) {
    console.error("Error fetching dashboard config:", error);
    res.status(500).json({ error: "Failed to fetch dashboard config" });
  }
});

app.post("/api/dashboard", async (req, res) => {
  try {
    const { dashboard_name, layout, widgets } = req.body;
    await db.saveDashboardConfig(dashboard_name, layout, widgets);
    res.json({ message: "Dashboard config saved successfully" });
  } catch (error) {
    console.error("Error saving dashboard config:", error);
    res.status(500).json({ error: "Failed to save dashboard config" });
  }
});

// ==================== HEALTH CHECK ====================
app.get("/api/health", (req, res) => {
  res.json({
    status: "Server is running successfully",
    storage: db.isMemoryMode() ? "memory" : "postgresql",
    timestamp: new Date(),
  });
});

const PORT = process.env.PORT || 5000;

db.init().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
    console.log(`You can also access it at http://localhost:${PORT}`);
  });
});
