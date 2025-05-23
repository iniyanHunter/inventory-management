import React from "react";
import { Link } from "react-router-dom";
import '../styles/Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Menu</h3>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/product">Product</Link></li>
        <li><Link to="/stockentry">StockEntry</Link></li>
        <li><Link to="/category">Category</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
