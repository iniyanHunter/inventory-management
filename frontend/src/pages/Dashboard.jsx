import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import authService from '../services/authService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalProductValue: 0,
    lowStockCount: 0,
    recentActivityCount: 0
  });
  const [lowStock, setLowStock] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch summary
        const summaryResponse = await authService.apiCall('/api/dashboard/summary');
        if (!summaryResponse.ok) throw new Error('Failed to fetch summary');
        const summaryData = await summaryResponse.json();
        setStats(summaryData);

        // Fetch low stock
        const lowStockResponse = await authService.apiCall('/api/dashboard/low-stock');
        if (!lowStockResponse.ok) throw new Error('Failed to fetch low stock data');
        const lowStockData = await lowStockResponse.json();
        setLowStock(Array.isArray(lowStockData) ? lowStockData : []);

        // Fetch recent activity
        const activityResponse = await authService.apiCall('/api/dashboard/recent-activity');
        if (!activityResponse.ok) throw new Error('Failed to fetch recent activity');
        const activityData = await activityResponse.json();
        setRecentActivity(Array.isArray(activityData) ? activityData : []);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError(err.message);
      }
    };

    fetchDashboardData();
  }, []);

  const productColumns = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Name', field: 'name' },
    { headerName: 'SKU', field: 'sku' },
    { headerName: 'Quantity', field: 'quantity' },
    { headerName: 'Threshold', field: 'threshold' }
  ];

  const activityColumns = [
    { headerName: 'ID', field: 'id' },
    { headerName: 'Product Name', field: 'product.name' },
    { headerName: 'Type', field: 'type' },
    { headerName: 'Quantity', field: 'quantity' },
    { headerName: 'Created At', field: 'createdAt' }
  ];

  if (error) {
    return (
      <div className="dashboard-container">
        <div className="error-message">
          Error loading dashboard: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-summary">
        <div className="summary-card">
          <div className="summary-title">Total Products</div>
          <div className="summary-value">{stats.totalProducts}</div>
        </div>
        <div className="summary-card">
          <div className="summary-title">Total Product Value</div>
          <div className="summary-value">{stats.totalProductValue}</div>
        </div>
        <div className="summary-card">
          <div className="summary-title">Low Stock Count</div>
          <div className="summary-value">{stats.lowStockCount}</div>
        </div>
        <div className="summary-card">
          <div className="summary-title">Recent Activity Count</div>
          <div className="summary-value">{stats.recentActivityCount}</div>
        </div>
      </div>

      <h3>Low Stock List</h3>
      <div className="ag-theme-alpine grid-section">
        <AgGridReact
          rowData={lowStock}
          columnDefs={productColumns}
          pagination={true}
          paginationPageSize={5}
          domLayout="autoHeight"
        />
      </div>

      <h3>Recent Activity List</h3>
      <div className="ag-theme-alpine grid-section">
        <AgGridReact
          rowData={recentActivity}
          columnDefs={activityColumns}
          pagination={true}
          paginationPageSize={5}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
};

export default Dashboard;
