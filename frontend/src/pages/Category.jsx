import React from 'react';
import '../styles/Category.css';

function Category() {
  return (
    <div className="category-container">
      <div className="category-header">
        <h2 className="category-title">Categories</h2>
        <button className="add-button">Add</button>
      </div>
      <div className="main-content">
        Main Content Area
      </div>
    </div>
  );
}

export default Category;