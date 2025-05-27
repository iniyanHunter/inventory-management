import React from 'react';
import authService from '../services/authService';
import '../App.css';

function Header() {
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    window.location.reload(); // Refresh to trigger login flow
  };

  return (
    <header className="header">
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
