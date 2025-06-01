import React from 'react';
import '../styles/Header.css';
import '../styles/SidebarToggle.css'; // Add this line

function Header({ onToggleSidebar }) {
  return (
    <header className="header">
      <button className="sidebar-toggle" onClick={onToggleSidebar}>
        ☰
      </button>
      <h1>Inventory - Management</h1>
    </header>
  );
}

export default Header;