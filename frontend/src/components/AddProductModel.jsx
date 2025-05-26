import React from 'react';
import Modal from './Modal'; // Assuming Modal.jsx is in the same directory

const AddProductModel = ({ onClose, onSubmit, formData, handleInputChange, categories }) => {
  return (
    <Modal onClose={onClose}>
      <form onSubmit={onSubmit} className="modal-form">
        <h3>Add New Product</h3>

        <div className="form-group">
          <label>Product Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>SKU:</label>
          <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} required />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Quantity:</label>
            <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} min="0" required />
          </div>

          <div className="form-group">
            <label>Threshold:</label>
            <input type="number" name="threshold" value={formData.threshold} onChange={handleInputChange} min="0" required />
          </div>
        </div>

        <div className="form-group">
          <label>Price:</label>
          <input type="number" name="price" value={formData.price} onChange={handleInputChange} step="0.01" min="0" required />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select name="categoryId" value={formData.categoryId} onChange={handleInputChange} required>
            <option value="">Select Category</option>
            {/* Check if categories is an array before mapping to prevent errors */}
            {Array.isArray(categories) && categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-btn">Create Product</button>
      </form>
    </Modal>
  );
};

export default AddProductModel;