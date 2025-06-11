import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import AddCategoryModel from '../components/AddCategoryModel';
import '../styles/Category.css';
import authService from '../services/authService';

function Category() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const gridRef = useRef();

  const fetchCategories = async () => {
    try {
      const response = await authService.apiCall('/api/category');
      const data = await response.json();
      const sorted = Array.isArray(data)
        ? [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];
      setCategories(sorted);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.paginationGoToFirstPage();
    }
  }, [categories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.apiCall(`/api/category?createdByUserId=1`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create category');

      setIsModalOpen(false);
      setFormData({ name: '', description: '' });
      fetchCategories();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const columnDefs = [
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
  ];

  return (
    <div className="category-container">
      <div className="category-header">
        <h2 className="category-title">Categories</h2>
        <button className="add-button" onClick={() => setIsModalOpen(true)}>Add</button>
      </div>

      <div className="main-content ag-theme-alpine" style={{ height: 500 }}>
        <AgGridReact
          ref={gridRef}
          rowData={categories}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            floatingFilter: false
          }}
          suppressMenu={false}
        />
      </div>

      {isModalOpen && (
        <AddCategoryModel
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
        />
      )}
    </div>
  );
}

export default Category;
