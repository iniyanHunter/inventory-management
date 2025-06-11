import React, { useState, useEffect, useMemo, useRef } from 'react';
import AddProductModel from '../components/AddProductModel';
import EditStockEntryModal from '../components/EditStockEntryModal';
import authService from '../services/authService';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../styles/Product.css';

function Product() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const gridRef = useRef();

  const [formData, setFormData] = useState({
    name: '', sku: '', description: '', quantity: '', threshold: '', price: '', categoryId: ''
  });

  const [editFormData, setEditFormData] = useState({
    productId: '', productName: '', quantity: '', description: ''
  });

  const fetchProducts = async () => {
    try {
      const response = await authService.apiCall('/api/product');
      const data = await response.json();
      const sorted = Array.isArray(data)
        ? [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        : [];
      setProducts(sorted);
    } catch (err) {
      console.error('Fetch products error:', err);
    }
  };
  
  const fetchCategories = async () => {
    const response = await authService.apiCall('/api/category');
    const data = await response.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (gridRef.current?.api) {
      gridRef.current.api.paginationGoToFirstPage();
    }
  }, [products]);

  const handleEditProduct = (product) => {
    setEditFormData({
      productId: product.id,
      productName: product.name,
      quantity: product.quantity,
      description: ''
    });
    setEditModalOpen(true);
  };

  const columnDefs = useMemo(() => [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Name' },
    { field: 'sku', headerName: 'SKU' },
    { field: 'description', headerName: 'Description' },
    { field: 'quantity', headerName: 'Quantity' },
    { field: 'threshold', headerName: 'Threshold' },
    { field: 'price', headerName: 'Price', valueFormatter: p => `₹${p.value.toFixed(2)}` },
    { field: 'category.name', headerName: 'Category' },
    { field: 'createdBy.name', headerName: 'Created By' },
    {
      field: 'createdAt',
      headerName: 'Created At',
      valueFormatter: p => new Date(p.value).toLocaleString()
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params) => (
        <button className="edit-btn" onClick={() => handleEditProduct(params.data)}>Edit</button>
      ),
      width: 120
    }
  ], []);

  return (
    <div className="product-container">
      <div className="product-header">
        <h2 className="product-title">Products</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="add-button" onClick={() => setIsModalOpen(true)}>Add</button>
        </div>
      </div>

      <div className="main-content ag-theme-alpine" style={{ height: 600 }}>
        <AgGridReact
          ref={gridRef}
          rowData={products}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            floatingFilter: false,
          }}
          suppressMenu={false}
        />
      </div>

      {isModalOpen && (
        <AddProductModel
          onClose={() => setIsModalOpen(false)}
          onSubmit={() => {
            // After add, refresh product list
            fetchProducts();
          }}
          formData={formData}
          handleInputChange={() => {}}
          categories={categories}
        />
      )}

      {editModalOpen && (
        <EditStockEntryModal
          onClose={() => setEditModalOpen(false)}
          onSubmit={() => {
            fetchProducts();
          }}
          formData={editFormData}
          onChange={() => {}}
        />
      )}
    </div>
  );
}

export default Product;
