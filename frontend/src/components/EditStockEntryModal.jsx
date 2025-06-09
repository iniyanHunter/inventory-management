import React from 'react';
import Modal from './Modal';

const EditStockEntryModal = ({ onClose, onSubmit, formData, onChange }) => {
  return (
    <Modal onClose={onClose}>
      <form onSubmit={onSubmit} className="modal-form">
        <h3>Edit Stock Entry</h3>

        <div className="form-group">
          <label>Product:</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            disabled
          />
        </div>

        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={onChange}
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
          />
        </div>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </Modal>
  );
};

export default EditStockEntryModal;
