import React from 'react';
import Modal from './Modal';

const AddCategoryModel = ({ onClose, onSubmit, formData, handleInputChange }) => {
  return (
    <Modal onClose={onClose}>
      <form onSubmit={onSubmit} className="modal-form">
        <h3>Add New Category</h3>

        <div className="form-group">
          <label>Category Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
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

        <button type="submit" className="submit-btn">Create Category</button>
      </form>
    </Modal>
  );
};

export default AddCategoryModel;
