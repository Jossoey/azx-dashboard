import React from "react";
import { useNavigate } from "react-router-dom";
import "./mainmenu.css";

const MainMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="menu-container">
      <h1 className="menu-title">Welcome to PT. AZX Dashboard</h1>

      <div className="menu-options">
        <button
          className="menu-button"
          onClick={() => navigate("/inventory")}
        >
          Car Inventory
        </button>

        <button
          className="menu-button"
          onClick={() => navigate("/sales")}
        >
          Car Sales
        </button>
      </div>
    </div>
  );
};

export default MainMenu;