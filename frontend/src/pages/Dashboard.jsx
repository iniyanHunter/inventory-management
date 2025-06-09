import React, { useEffect, useState } from 'react';
import '../styles/Dashboard.css';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [lowStock, setLowStock] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetch('/api/dashboard/summary')
      .then(res => res.json())
      .then(data => setStats(data));

    fetch('/api/dashboard/low-stock')
      .then(res => res.json())
      .then(data => setLowStock(data));

    fetch('/api/dashboard/recent-activity')
      .then(res => res.json())
      .then(data => setRecentActivity(data));
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
