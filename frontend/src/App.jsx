import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Product from './pages/Product';
import StockEntry from './pages/StockEntry';
import Category from './pages/Category';
import './index.css';
import './styles/App.css';

function App() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <Router>
      <div className="app-container">
        <Sidebar visible={sidebarVisible} />
        <div className={`content-area ${!sidebarVisible ? 'expanded' : ''}`}>
          <Header onToggleSidebar={toggleSidebar} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/product" element={<Product />} />
              <Route path="/stockentry" element={<StockEntry />} />
              <Route path="/category" element={<Category />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;