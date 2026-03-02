import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { getCarSales } from "../api";
import { useNavigate } from "react-router-dom";
import "./sales.css";

const Sales = () => {
  const navigate = useNavigate();
  const [monthlyData, setMonthlyData] = useState({});
  const [yearlyData, setYearlyData] = useState([]);

  useEffect(() => {
    async function fetchSales() {
      try {
        const data = await getCarSales();
        processSalesData(data);
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
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate("/menu")}>
        &larr; Back to Main Menu
      </button>

      <h1 className="sales-title">PT. AZX Car Sales Dashboard</h1>

      {/* Yearly Sales Chart */}
      <div className="sales-yearly-chart">
        <h2>Yearly Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yearlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ModelSiji" fill="#8fbffa" />
            <Bar dataKey="ModelLoro" fill="#8cf3cd" />
            <Bar dataKey="ModelTelu" fill="#ffdb98" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Sales Charts per Year */}
      <div className="sales-monthly-charts">
        {[2026, 2025, 2024].map((year) => (
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
                  <Bar dataKey="ModelSiji" fill="#8fbffa" />
                  <Bar dataKey="ModelLoro" fill="#8cf3cd" />
                  <Bar dataKey="ModelTelu" fill="#ffdb98" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Sales;