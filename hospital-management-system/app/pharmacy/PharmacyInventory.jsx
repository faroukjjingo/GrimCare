
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { TextField, Box, Typography, IconButton, Alert } from '@mui/material';
import { Search, Delete, Edit, QrCodeScanner } from '@mui/icons-material';
import { getInventory, updateStock, deleteMedication, getStockAlerts, scanBarcode } from './pharmacyService';
import styles from './PharmacyInventory.module.css';

const PharmacyInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [stockAlerts, setStockAlerts] = useState([]);
  const [barcode, setBarcode] = useState('');

  useEffect(() => {
    fetchInventory();
    fetchStockAlerts();
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await getInventory();
      setInventory(data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    }
  };

  const fetchStockAlerts = async () => {
    try {
      const alerts = await getStockAlerts();
      setStockAlerts(alerts);
    } catch (error) {
      console.error('Failed to fetch stock alerts:', error);
    }
  };

  const handleStockUpdate = async (id, newStock) => {
    try {
      await updateStock(id, parseInt(newStock));
      await fetchInventory();
      await fetchStockAlerts();
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMedication(id);
      await fetchInventory();
      await fetchStockAlerts();
    } catch (error) {
      console.error('Failed to delete medication:', error);
    }
  };

  const handleBarcodeScan = async () => {
    try {
      const medication = await scanBarcode(barcode);
      if (medication) {
        setInventory([medication, ...inventory.filter(item => item.id !== medication.id)]);
        setBarcode('');
      }
    } catch (error) {
      console.error('Failed to scan barcode:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Medication', width: 200 },
    { field: 'category', headerName: 'Category', width: 150 },
    { 
      field: 'stockQuantity', 
      headerName: 'Stock', 
      width: 120, 
      editable: true,
      type: 'number',
    },
    { field: 'price', headerName: 'Price', width: 120 },
    { 
      field: 'expiryDate', 
      headerName: 'Expiry Date', 
      width: 150, 
      valueFormatter: ({ value }) => new Date(value).toLocaleDateString() 
    },
    { field: 'barcode', headerName: 'Barcode', width: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleStockUpdate(params.row.id, params.row.stockQuantity)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <Delete />
          </IconButton>
        </>
      ),
    },
  ];

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box className={styles.container}>
      <Typography variant="h6" gutterBottom>Inventory Management</Typography>
      {stockAlerts.length > 0 && (
        <Alert severity="warning">
          Low stock alert for {stockAlerts.length} medications
        </Alert>
      )}
      <Box className={styles.searchBar}>
        <TextField
          label="Search Medications"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ startAdornment: <Search /> }}
          fullWidth
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
          <TextField
            label="Scan Barcode"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
          />
          <IconButton onClick={handleBarcodeScan}>
            <QrCodeScanner />
          </IconButton>
        </Box>
      </Box>
      <DataGrid
        rows={filteredInventory}
        columns={columns}
        pageSizeOptions={[10, 25, 50]}
        className={styles.grid}
        autoHeight
        onCellEditStop={(params, event) => {
          if (params.reason === 'enterKeyDown' || params.reason === 'cellFocusOut') {
            handleStockUpdate(params.row.id, params.value);
          }
        }}
      />
    </Box>
  );
};

export default PharmacyInventory;