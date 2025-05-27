import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import Modal from '../components/Modal';
import AddProductModel from '../components/AddProductModel';
import '../styles/Product.css'; // Your existing CSS
// Import AG Grid components and styles
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS
import 'ag-grid-community/styles/ag-theme-alpine.css'; // Optional theme CSS

function Product() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]); // State to store fetched products
  const gridRef = useRef(null); // Ref for AG Grid API

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    quantity: 0,
    threshold: 0,
    price: 0.0,
    categoryId: ''
  });

  // Function to fetch products
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/product'); // Use the new GET endpoint
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();
      setProducts(data); // Set the fetched products to state
    } catch (error) {
      console.error('Error fetching products:', error);
      alert(`Failed to load products. Please try again. Error: ${error.message}`);
    }
  };


  // Fetch categories and products when component mounts
  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchCategories();
      await fetchProducts(); // Fetch products on mount
    };
    fetchInitialData();
  }, []); // Empty dependency array means this runs once on mount

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/category'); // Ensure this matches your CategoryController
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert(`Failed to load categories. Please try again. Error: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      let newValue = value;
      if (['quantity', 'threshold', 'price'].includes(name)) {
        newValue = value === '' ? '' : Number(value);
      }
      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        quantity: formData.quantity === '' ? 0 : Number(formData.quantity),
        threshold: formData.threshold === '' ? 0 : Number(formData.threshold),
        price: formData.price === '' ? 0.0 : Number(formData.price),
        category: { id: formData.categoryId },
        createdBy: { id: 1 } // IMPORTANT: Replace with actual logged-in user ID in a real app
      };

      delete dataToSend.categoryId;

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to create product. Unknown error.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || `Server responded with status: ${response.status}`;
        } catch (parseError) {
          errorMessage = `Server responded with status: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      setIsModalOpen(false);
      setFormData({
        name: '',
        sku: '',
        description: '',
        quantity: 0,
        threshold: 0,
        price: 0.0,
        categoryId: ''
      });
      alert('Product created successfully!');
      fetchProducts(); // Re-fetch products to update the grid after successful creation
    } catch (error) {
      console.error('Error creating product:', error);
      alert(`Error creating product: ${error.message}`);
    }
  };

  // AG Grid Column Definitions
  const [columnDefs] = useState([
    { field: 'id', headerName: 'ID', width: 90, sortable: true, filter: true },
    { field: 'name', headerName: 'Product Name', width: 200, sortable: true, filter: true },
    { field: 'sku', headerName: 'SKU', width: 150, sortable: true, filter: true },
    { field: 'description', headerName: 'Description', width: 250, sortable: true, filter: true },
    { field: 'quantity', headerName: 'Quantity', width: 120, sortable: true, filter: 'agNumberColumnFilter' },
    { field: 'threshold', headerName: 'Threshold', width: 120, sortable: true, filter: 'agNumberColumnFilter' },
    { field: 'price', headerName: 'Price', width: 120, sortable: true, filter: 'agNumberColumnFilter', valueFormatter: p => '₹' + p.value.toFixed(2) },
    // Nested object access for category name
    { field: 'category.name', headerName: 'Category', width: 150, sortable: true, filter: true },
    // Nested object access for createdBy user name
    { field: 'createdBy.name', headerName: 'Created By', width: 150, sortable: true, filter: true },
    { field: 'createdAt', headerName: 'Created At', width: 180, sortable: true, filter: 'agDateColumnFilter',
      valueFormatter: p => p.value ? new Date(p.value).toLocaleString() : ''
    },
    // Add columns for actions like Edit/Delete later
    // {
    //   headerName: 'Actions',
    //   width: 150,
    //   cellRenderer: (params) => (
    //     <div>
    //       <button onClick={() => console.log('Edit', params.data)}>Edit</button>
    //       <button onClick={() => console.log('Delete', params.data)}>Delete</button>
    //     </div>
    //   )
    // }
  ]);

  // Default grid options
  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 100,
      resizable: true,
      filter: true, // Enable filtering on all columns by default
    };
  }, []);

  const onGridReady = useCallback((params) => {
    gridRef.current = params.api;
  }, []);


  return (
    <div className="product-container">
      <div className="product-header">
        <h2 className="product-title">Products</h2>
        <button onClick={() => setIsModalOpen(true)} className="add-button">
          Add
        </button>
      </div>

      <div className="main-content ag-theme-alpine" style={{ height: 600, width: '100%' }}>
        {/* AG Grid component */}
        <AgGridReact
          ref={gridRef}
          rowData={products} // Data for the grid
          columnDefs={columnDefs} // Column definitions
          defaultColDef={defaultColDef} // Default column options
          animateRows={true} // Optional: animate row changes
          rowSelection={'multiple'} // Optional: enable row selection
          onGridReady={onGridReady}
          pagination={true} // Enable pagination
          paginationPageSize={10} // Set default page size
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