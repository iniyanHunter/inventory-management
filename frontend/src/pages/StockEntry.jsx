import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import '../styles/StockEntry.css';

function StockEntry() {
  const [stockEntries, setStockEntries] = useState([]);

  // Column Definitions
  const [columnDefs] = useState([
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 90,
      filter: 'agNumberColumnFilter'
    },
    { 
      field: 'quantity', 
      headerName: 'Quantity', 
      width: 120,
      filter: 'agNumberColumnFilter'
    },
    { 
      field: 'type', 
      headerName: 'Entry Type', 
      width: 150,
      valueFormatter: params => params.value?.replace('_', ' ') // Format enum values
    },
    { 
      field: 'description', 
      headerName: 'Description', 
      flex: 2,
      filter: 'agTextColumnFilter'
    },
    { 
      field: 'product.name', 
      headerName: 'Product',
      valueGetter: params => params.data.product?.name || 'N/A',
      minWidth: 150,
      flex: 1,
      filter: 'agTextColumnFilter'
    },
    { 
      field: 'createdBy.name', 
      headerName: 'Created By',
      valueGetter: params => params.data.createdBy?.name || 'System',
      minWidth: 150,
      flex: 1,
      filter: 'agTextColumnFilter'
    },
    { 
      field: 'createdAt', 
      headerName: 'Created At',
      valueFormatter: params => params.value ? 
        new Date(params.value).toLocaleDateString() + ' ' + 
        new Date(params.value).toLocaleTimeString() : 'N/A',
      filter: 'agDateColumnFilter'
    },
    { 
      field: 'modifiedBy.name', 
      headerName: 'Modified By',
      valueGetter: params => params.data.modifiedBy?.name || 'Not Modified',
      minWidth:150,
      flex: 1,
      filter : 'agTextColumnFilter'
    },
    { 
      field: 'modifiedAt', 
      headerName: 'Modified At',
      valueFormatter: params => params.value ? 
        new Date(params.value).toLocaleDateString() + ' ' + 
        new Date(params.value).toLocaleTimeString() : 'N/A',
      filter: 'agDateColumnFilter'
    }
  ]);

  // Fetch stock entries
  useEffect(() => {
    const fetchStockEntries = async () => {
      try {
        const response = await fetch('/api/stock-entry');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setStockEntries(data);
      } catch (error) {
        console.error('Error fetching stock entries:', error);
        setStockEntries([]); // Set empty array to prevent errors
      }
    };
    fetchStockEntries();
  }, []);

  return (
    <div className="stockentry-container">
      <div className="stockentry-header">
        <h2 className="stockentry-title">Stock Entries</h2>
      </div>
      
      <div className="stockentry-content">
        <div 
          className="ag-theme-alpine"
          style={{ 
            height: 600, 
            width: '100%',
            minHeight: '300px' // Prevent collapse
          }}
        >
          <AgGridReact
            rowData={stockEntries}
            columnDefs={columnDefs}
            pagination={true}
            paginationPageSize={10}
            domLayout='autoHeight'
            defaultColDef={{
              sortable: true,
              resizable: true,
              filter: true,
              floatingFilter: true
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default StockEntry;