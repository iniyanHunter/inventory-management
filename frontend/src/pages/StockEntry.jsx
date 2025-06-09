import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../styles/StockEntry.css';
import Modal from '../components/Modal';
import authService from '../services/authService';

function StockEntry() {
  const [stockEntries, setStockEntries] = useState([]);
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    type: 'IN',
    description: ''
  });

  const fetchStockEntries = async () => {
    try {
      const response = await authService.apiCall('/api/stock-entry');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch stock entries: ${errorText}`);
      }
      const data = await response.json();
      setStockEntries(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching stock entries:', error);
      setError(error.message);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await authService.apiCall('/api/product');
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch products: ${errorText}`);
      }
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchStockEntries();
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProductSelect = (e) => {
    const selectedId = e.target.value;
    const product = products.find(p => p.id.toString() === selectedId);
    setFormData({
      ...formData,
      productId: selectedId,
      quantity: product ? product.quantity : '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = authService.getCurrentUser();
      const payload = {
        quantity: parseInt(formData.quantity),
        type: formData.type,
        description: formData.description,
        product: { id: formData.productId },
        createdBy: { id: currentUser?.id || 1 }
      };
      
      const response = await authService.apiCall('/api/stock-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save stock entry: ${errorText}`);
      }
      
      setIsModalOpen(false);
      setFormData({ productId: '', quantity: '', type: 'IN', description: '' });
      fetchStockEntries();
    } catch (error) {
      console.error('Error saving stock entry:', error);
      setError(error.message);
    }
  };

  const columnDefs = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'quantity', headerName: 'Quantity', width: 120 },
    { field: 'type', headerName: 'Entry Type', width: 150 },
    { field: 'description', headerName: 'Description', flex: 100, minWidth: 300, filter: 'agTextColumnFilter', wrapText: true, autoHeight: true },
    {
      headerName: 'Product',
      valueGetter: p => p.data.product?.name || 'N/A'
    },
    {
      headerName: 'Created By',
      valueGetter: p => p.data.createdBy?.name || 'System'
    },
    {
      field: 'createdAt',
      headerName: 'Created At',
      valueFormatter: p => new Date(p.value).toLocaleString()
    },
    {
      headerName: 'Modified By',
      valueGetter: p => p.data.modifiedBy?.name || 'Not Modified'
    },
    {
      field: 'modifiedAt',
      headerName: 'Modified At',
      valueFormatter: p => p.value ? new Date(p.value).toLocaleString() : 'N/A'
    }
  ];

  return (
    <div className="stockentry-container">
      <div className="stockentry-header">
        <h2 className="stockentry-title">Stock Entries</h2>
        <button className="add-button" onClick={() => setIsModalOpen(true)}>Add</button>
      </div>

      <div className="stockentry-content ag-theme-alpine" style={{ height: 600 }}>
        <AgGridReact
          rowData={stockEntries}
          columnDefs={columnDefs}
          pagination={true}
          paginationPageSize={10}
          defaultColDef={{
            sortable: true,
            resizable: true,
            filter: true,
            floatingFilter: true,
            wrapText: true,
            autoHeight: true
          }}
        />
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="modal-form">
            <h3>Add Stock Entry</h3>

            <div className="form-group">
              <label>Product:</label>
              <select name="productId" value={formData.productId} onChange={handleProductSelect} required>
                <option value="">Select Product</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Quantity:</label>
              <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} min="1" required />
            </div>

            <div className="form-group">
              <label>Type:</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="IN">IN</option>
                <option value="OUT">OUT</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
            </div>

            <button type="submit" className="submit-btn">Save Entry</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default StockEntry;
