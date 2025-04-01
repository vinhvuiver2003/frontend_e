import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Snackbar
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import brandService from '../../services/brandService';

const BrandsManagement = () => {
  const [brands, setBrands] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logoUrl: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const response = await brandService.getAllBrands();
      if (response && response.data) {
        setBrands(response.data.content || []);
      }
    } catch (error) {
      console.error('Lỗi khi tải thương hiệu:', error);
      showSnackbar('Lỗi khi tải thương hiệu', 'error');
      setBrands([]);
    }
  };

  const handleOpenDialog = (brand = null) => {
    if (brand) {
      setSelectedBrand(brand);
      setFormData({
        name: brand.name,
        description: brand.description || '',
        logoUrl: brand.logoUrl || ''
      });
    } else {
      setSelectedBrand(null);
      setFormData({
        name: '',
        description: '',
        logoUrl: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBrand(null);
    setFormData({
      name: '',
      description: '',
      logoUrl: ''
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedBrand) {
        await brandService.updateBrand(selectedBrand.id, formData);
        showSnackbar('Cập nhật thương hiệu thành công');
      } else {
        await brandService.createBrand(formData);
        showSnackbar('Thêm thương hiệu thành công');
      }
      handleCloseDialog();
      loadBrands();
    } catch (error) {
      console.error('Lỗi khi lưu thương hiệu:', error);
      showSnackbar('Lỗi khi lưu thương hiệu', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) {
      try {
        await brandService.deleteBrand(id);
        showSnackbar('Xóa thương hiệu thành công');
        loadBrands();
      } catch (error) {
        console.error('Lỗi khi xóa thương hiệu:', error);
        showSnackbar('Lỗi khi xóa thương hiệu', 'error');
      }
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Quản lý Thương hiệu</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Thêm Thương hiệu
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Logo</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Mô tả</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brands && brands.length > 0 ? (
              brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>{brand.id}</TableCell>
                  <TableCell>
                    {brand.logoUrl && (
                      <img 
                        src={brand.logoUrl} 
                        alt={brand.name} 
                        style={{ width: 50, height: 50, objectFit: 'contain' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{brand.name}</TableCell>
                  <TableCell>{brand.description}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(brand)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(brand.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không có thương hiệu nào
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {selectedBrand ? 'Chỉnh sửa Thương hiệu' : 'Thêm Thương hiệu mới'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên thương hiệu"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="URL Logo"
            fullWidth
            value={formData.logoUrl}
            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
            helperText="Nhập URL của logo thương hiệu"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedBrand ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BrandsManagement; 