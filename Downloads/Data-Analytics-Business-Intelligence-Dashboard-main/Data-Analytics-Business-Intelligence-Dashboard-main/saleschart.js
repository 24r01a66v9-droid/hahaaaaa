import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

function SalesChart({ sales = [] }) {
  const [chartType, setChartType] = useState("bar");

  const chartData = {
    labels: sales.length > 0 ? sales.map((s) => s.month) : ["Jan", "Feb", "Mar", "Apr"],
    datasets: [
      {
        label: "Sales Amount ($)",
        data: sales.length > 0 ? sales.map((s) => s.amount) : [1200, 1800, 2500, 3000],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Sales Data",
        font: { size: 16, weight: "bold" },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Sales ($)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month",
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <div className="chart-controls">
        <button
          className={`chart-btn ${chartType === "bar" ? "active" : ""}`}
          onClick={() => setChartType("bar")}
        >
          📊 Bar Chart
        </button>
        <button
          className={`chart-btn ${chartType === "line" ? "active" : ""}`}
          onClick={() => setChartType("line")}
        >
          📈 Line Chart
        </button>
      </div>
      <div className="chart-wrapper">
        {chartType === "bar" ? <Bar data={chartData} options={options} /> : <Line data={chartData} options={options} />}
      </div>
    </div>
  );
}

export default SalesChart;