import React, { useEffect, useState } from "react";
import { getInventory } from "../api";
import "./inventory.css";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getInventory();
      setInventory(data);
    }
    fetchData();
  }, []);

  const getStockClass = (stock) => {
    if (stock > 20) return "stock-badge stock-high";
    if (stock > 5) return "stock-badge stock-medium";
    return "stock-badge stock-low";
  };

  return (
    <div className="inventory-container">
      <h1 className="inventory-title">PT. AZX Car Inventory</h1>

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
            {inventory.map((item) => (
              <tr key={item.id}>
                <td>{item.model}</td>
                <td>{item.location}</td>
                <td>
                  <span className={getStockClass(item.stock)}>
                    {item.stock} units
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;