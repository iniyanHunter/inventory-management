import React from "react";

function Product() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#a5f7d3' }}>
      {/* Top bar with title and add button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Products</h2>
        <button style={{
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Add
        </button>
      </div>

      {/* Main content area */}
      <div style={{
        padding: '40px',
        backgroundColor: '#e0ffe8',
        textAlign: 'center',
        borderRadius: '8px'
      }}>
        Main Content Area
      </div>
    </div>
  );
}

export default Product;
