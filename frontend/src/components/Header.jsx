import React from 'react';
import authService from '../services/authService';
import '../App.css';
import '../styles/Header.css';
import '../styles/SidebarToggle.css';

function Header({ onToggleSidebar }) {
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.reload(); // Refresh to trigger login flow
  };
  return (
    <header className="header">
      <button className="sidebar-toggle" onClick={onToggleSidebar}>
        ☰
      </button>
      <h1>Inventory - Management</h1>
      <div className="header-user-info">
        <span>Welcome, {user?.name || user?.username}!</span>
        <span className="user-role">({user?.role})</span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;