import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal'; // Assuming this is correct for your modal
import '../styles/Product.css';

function Product() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    quantity: 0,
    threshold: 0,
    price: 0.0,
    categoryId: ''
  });

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['quantity', 'threshold', 'price'].includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          sku: formData.sku,
          description: formData.description,
          quantity: formData.quantity,
          threshold: formData.threshold,
          price: formData.price,
          category: { id: formData.categoryId },
          createdBy: { id: 1 } // Replace with logged-in user if using auth
        }),
      });

      if (!response.ok) throw new Error('Failed to create product');
      setIsModalOpen(false);
      // You might want to re-fetch products or update state here after successful creation
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  return (
    <div className="product-container"> {/* This is equivalent to category-container */}
      <div className="product-header"> {/* This is equivalent to category-header */}
        <h2 className="product-title">Products</h2> {/* Added product-title for consistency */}
        <button onClick={() => setIsModalOpen(true)} className="add-button"> {/* Changed to add-button for consistent styling */}
          Add Product
        </button>
      </div>

      {/* Add a main-content div similar to Category.jsx for consistent layout */}
      <div className="main-content">
        {/* This is where you would render your product list/table */}
        Product List/Table will go here
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <form onSubmit={handleSubmit} className="product-form">
            <h3>Add New Product</h3>

            <div className="form-group">
              <label>Product Name:</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>SKU:</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description:</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label>Threshold:</label>
                <input
                  type="number"
                  name="threshold"
                  value={formData.threshold}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Price:</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Category:</label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="submit-btn">
              Create Product
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default Product;