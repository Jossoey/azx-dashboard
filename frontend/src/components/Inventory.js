import React, { useEffect, useState } from "react";
import { getInventory } from "../api";
import { useNavigate } from "react-router-dom";
import CarRecommendation from "./CarRecommendation";
import "./inventory.css";

const Inventory = () => {
  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);
  const [filter, setFilter] = useState({ model: "", location: "" });

  useEffect(() => {
    async function fetchData() {
      const data = await getInventory();
      setInventory(data);
    }
    fetchData();
  }, []);

  // Determine stock is high med or low
  const getStockClass = (stock) => {
    if (stock > 20) return "stock-badge stock-high";
    if (stock > 5) return "stock-badge stock-medium";
    return "stock-badge stock-low";
  };

  // Preparing data to be displayed
  const filteredInventory = inventory.filter(
    (item) =>
      item.model.toLowerCase().includes(filter.model.toLowerCase()) &&
      item.location.toLowerCase().includes(filter.location.toLowerCase())
  );

  return (
    <div className="inventory-container">
      {/* Back Button */}
      <button className="back-button" onClick={() => navigate("/menu")}>
        &larr; Back to Main Menu
      </button>

      <h1 className="inventory-title">PT. AZX Car Inventory</h1>

      {/* Filter Inputs */}
      <div className="inventory-filter">
        <input
          type="text"
          placeholder="Filter by model"
          value={filter.model}
          onChange={(e) => setFilter({ ...filter, model: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by location"
          value={filter.location}
          onChange={(e) => setFilter({ ...filter, location: e.target.value })}
        />
      </div>

      <div className="inventory-card">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>Location</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {/* Map every item in Inventory list and generate per line */}
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <tr key={item.id}>
                  <td>{item.model}</td>
                  <td>{item.location}</td>
                  <td>
                    <span className={getStockClass(item.stock)}>
                      {item.stock} units
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">
                  No matching items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CarRecommendation />
    </div>
  );
};

export default Inventory;