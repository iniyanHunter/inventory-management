import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import AddProductModel from '../components/AddProductModel';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../styles/Product.css';

function Product() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const gridRef = useRef();

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    quantity: '',
    threshold: '',
    price: '',
    categoryId: ''
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/product');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Fetch products error:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/category');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Fetch categories error:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: ['quantity', 'threshold', 'price'].includes(name)
        ? value === '' ? '' : value.replace(/^0+(?!\.)/, '') // allow empty, remove leading zeroes
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit Clicked");

    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity || 0),
        threshold: Number(formData.threshold || 0),
        price: Number(formData.price || 0),
        category: { id: formData.categoryId },
        createdBy: { id: 1 } // Replace with real user ID in production
      };
      delete payload.categoryId;

      const res = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Product creation failed');

      setIsModalOpen(false);
      setFormData({
        name: '',
        sku: '',
        description: '',
        quantity: '',
        threshold: '',
        price: '',
        categoryId: ''
      });
      fetchProducts();
    } catch (err) {
      console.error('Product save error:', err);
    }
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
    }
  ], []);

  return (
    <div className="product-container">
      <div className="product-header">
        <h2 className="product-title">Products</h2>
        <button className="add-button" onClick={() => setIsModalOpen(true)}>Add Product</button>
      </div>

      <div className="main-content ag-theme-alpine" style={{ height: 600 }}>
        <AgGridReact
          ref={gridRef}
          rowData={products}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
        />
      </div>

      {isModalOpen && (
        <AddProductModel
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          formData={formData}
          handleInputChange={handleInputChange}
          categories={categories}
        />
      )}
    </div>
  );
}

export default Product;
