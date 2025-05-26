import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../styles/Category.css';

function Category() {
  const [categories, setCategories] = useState([]);

  // Column Definitions
  const [columnDefs] = useState([
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { 
      field: 'createdBy.name', 
      headerName: 'Created By',
      valueGetter: params => params.data.createdBy?.name || 'N/A'
    },
    { 
      field: 'createdAt', 
      headerName: 'Created At',
      valueFormatter: params => new Date(params.value).toLocaleDateString()
    }
  ]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/category');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="category-container">
      <div className="category-header">
        <h2 className="category-title">Categories</h2>
        <button className="add-button">Add</button>
      </div>
      
      <div className="main-content ag-theme-alpine" style={{ height: 500 }}>
        <AgGridReact
          rowData={categories}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
        />
      </div>
    </div>
  );
}

export default Category;