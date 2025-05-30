import React, { useState, useEffect, useMemo, useRef } from 'react';
import AddProductModel from '../components/AddProductModel';
import EditStockEntryModal from '../components/EditStockEntryModal';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../styles/Product.css';

function Product() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
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

  const [editFormData, setEditFormData] = useState({
    productId: '',
    productName: '',
    quantity: '',
    description: ''
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
        ? value === '' ? '' : value.replace(/^0+(?!\.)/, '')
        : value
    }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? value.replace(/^0+(?!\.)/, '') : value
    }));
  };

  const handleEditProduct = (product) => {
    setEditFormData({
      productId: product.id,
      productName: product.name,
      quantity: product.quantity,
      description: ''
    });
    setEditModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        quantity: Number(formData.quantity || 0),
        threshold: Number(formData.threshold || 0),
        price: Number(formData.price || 0),
        category: { id: formData.categoryId },
        createdBy: { id: 1 }
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

  const submitStockEntry = async () => {
    try {
      const payload = {
        product: { id: editFormData.productId },
        quantity: Number(editFormData.quantity),
        description: editFormData.description,
        type: 'OUT',
        createdBy: { id: 1 }
      };
  
      const res = await fetch('/api/stock-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      if (!res.ok) throw new Error('Failed to submit stock entry');
      
      setEditModalOpen(false);
      
      // ✅ Refresh the product list after stock change
      fetchProducts();
  
    } catch (err) {
      console.error('Stock Entry Error:', err);
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
        <button className="add-button" onClick={() => setIsModalOpen(true)}>Add</button>
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
            floatingFilter: true
          }}
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

      {editModalOpen && (
        <EditStockEntryModal
          onClose={() => setEditModalOpen(false)}
          onSubmit={submitStockEntry}
          formData={editFormData}
          onChange={handleEditInputChange}
        />
      )}
    </div>
  );
}

export default Product;
