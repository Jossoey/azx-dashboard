import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getCarSales, getRevenueData } from "../api";
import { useNavigate } from "react-router-dom";
import "./sales.css";

const Sales = () => {
  const navigate = useNavigate();
  const [monthlyData, setMonthlyData] = useState({});
  const [yearlyData, setYearlyData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    async function fetchSales() {
      try {
        const sales = await getCarSales();
        processSalesData(sales);

        const revenue = await getRevenueData();
        setRevenueData(revenue);
      } catch (err) {
        console.error("Failed to fetch sales data:", err);
      }
    }
    fetchSales();
  }, []);

  const processSalesData = (data) => {
    const monthly = {};
    const yearly = {};

    data.forEach((sale) => {
      const date = new Date(sale.sale_date);
      const year = date.getFullYear();
      const month = date.toLocaleString("default", { month: "short" });
      const modelKey = sale.model.replace(" ", "");

      // Monthly aggregation
      if (!monthly[year]) monthly[year] = {};
      if (!monthly[year][month])
        monthly[year][month] = { month, ModelSiji: 0, ModelLoro: 0, ModelTelu: 0 };

      monthly[year][month][modelKey] += sale.quantity;

      // Yearly aggregation
      if (!yearly[year]) yearly[year] = { year, ModelSiji: 0, ModelLoro: 0, ModelTelu: 0 };
      yearly[year][modelKey] += sale.quantity;
    });

    const orderedYears = [2026, 2025, 2024];

    // Prepare monthly data per year
    const monthlyArr = {};
    orderedYears.forEach((yr) => {
      if (monthly[yr]) monthlyArr[yr] = Object.values(monthly[yr]);
    });
    setMonthlyData(monthlyArr);

    // Prepare yearly totals array
    const yearlyArr = orderedYears.map((yr) => yearly[yr] || { year: yr, ModelSiji: 0, ModelLoro: 0, ModelTelu: 0 });
    setYearlyData(yearlyArr);
  };

  return (
    <div className="sales-container">
      <button className="back-button" onClick={() => navigate("/menu")}>
        &larr; Back to Main Menu
      </button>

      <h1 className="sales-title">PT. AZX Car Sales Dashboard</h1>

      {/* Top Dashboard Section */}
      <div className="sales-dashboard-top">
        {/* YoY Growth */}
        <div className="yoy-box">
          <h3>YoY Growth</h3>
          <div style={{ marginTop: "auto", marginBottom: "auto", textAlign: "center" }}>
            {revenueData.map((r) => (
              <div
                key={r.year}
                className={`yoy-value ${r.yoy >= 0 ? "yoy-positive" : "yoy-negative"}`}
              >
                {r.year}: {r.yoy !== null ? `${r.yoy >= 0 ? "+" : ""}${r.yoy}%` : "-"}
              </div>
            ))}
          </div>
        </div>

        {/* Total Revenue */}
        <div className="revenue-box">
          <h3>Total Revenue 2026</h3>
          <div style={{ marginTop: "auto", marginBottom: "auto", textAlign: "center" }}>
            {revenueData
              .filter((r) => r.year === 2026)
              .map((r) => (
                <div key={r.year} className="revenue-value">
                  Rp {r.total_revenue.toLocaleString()}
                </div>
              ))}
          </div>
        </div>

        {/* Yearly Sales Chart */}
        <div className="yearly-sales-graph">
          <h3 style={{ marginTop: 0 }}>Yearly Sales</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={yearlyData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
                <Bar dataKey="ModelSiji" fill="#2C5F34" />
                <Bar dataKey="ModelLoro" fill="#23627C" />
                <Bar dataKey="ModelTelu" fill="#23BBB7" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Sales Charts per Year */}
      <div className="sales-monthly-charts">
        {[2026, 2025, 2024].map(
          (year) =>
            monthlyData[year] && (
              <div key={year} className="sales-monthly-chart">
                <h3>{year} Monthly Sales</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart
                    data={monthlyData[year]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                      <Bar dataKey="ModelSiji" fill="#2C5F34" />
                      <Bar dataKey="ModelLoro" fill="#23627C" />
                      <Bar dataKey="ModelTelu" fill="#23BBB7" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default Sales;