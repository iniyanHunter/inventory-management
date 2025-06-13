import { Navigate } from 'react-router-dom';
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Product from './pages/Product';
import StockEntry from './pages/StockEntry';
import Category from './pages/Category';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import authService from './services/authService';
import './index.css';
import './styles/App.css';

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true); // ✅ move hook to top
  const isLoggedIn = authService.isLoggedIn();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <Router>
      {!isLoggedIn ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <div className="app-container">
          <Sidebar visible={sidebarVisible} />
          <div className={`content-area ${!sidebarVisible ? 'expanded' : ''}`}>
            <Header onToggleSidebar={toggleSidebar} />
            <main className="main-content">
              <ProtectedRoute>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/product" element={<Product />} />
                  <Route path="/stockentry" element={<StockEntry />} />
                  <Route path="/category" element={<Category />} />
                  <Route path="/login" element={<Navigate to="/" replace />} />
                </Routes>
              </ProtectedRoute>
            </main>
          </div>
        </div>
      )}
    </Router>
  );
}

export default App;
