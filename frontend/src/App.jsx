import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Product from './pages/Product';
import StockEntry from './pages/StockEntry';
import Category from './pages/Category';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import authService from './services/authService';
import './index.css';
import './styles/App.css';

function App() {
  const isLoggedIn = authService.isLoggedIn();
  
  // If not logged in, show login page
  if (!isLoggedIn) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  // If logged in, show the main application
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="content-area">
          <Header />
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
    </Router>
  );
}

export default App;
