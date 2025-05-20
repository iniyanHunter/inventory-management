import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h3>Menu</h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/product">Product</Link></li>
        <li><Link to="/stockentry">Stock Entry</Link></li>
        <li><Link to="/category">Category</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
