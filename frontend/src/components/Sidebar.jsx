import React from "react";
import { Link, useLocation } from "react-router-dom";
import '../styles/Sidebar.css';

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <h3>Menu</h3>
      <ul>
        <li>
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Dashboard</Link>
        </li>
        <li>
          <Link to="/product" className={location.pathname === '/product' ? 'active' : ''}>Product</Link>
        </li>
        <li>
          <Link to="/stockentry" className={location.pathname === '/stockentry' ? 'active' : ''}>StockEntry</Link>
        </li>
        <li>
          <Link to="/category" className={location.pathname === '/category' ? 'active' : ''}>Category</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;