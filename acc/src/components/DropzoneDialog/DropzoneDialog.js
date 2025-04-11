import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';

const DropzoneDialog = ({ open, onClose }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/jpeg, image/png, image/gif',
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles);
    },
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        Add Signature
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          {/* <Close /> */}
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #cccccc',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: '#f9f9f9',
          }}
        >
          <input {...getInputProps()} />
          {/* <CloudUpload fontSize="large" color="primary" /> */}
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            Drag & drop files or{' '}
            <span style={{ color: '#6C63FF', cursor: 'pointer' }}>Browse</span>
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Supported formats: JPEG, PNG, GIF
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 3,
          }}
        >
          <IconButton>{/* <RotateLeft /> */}</IconButton>
          <IconButton>{/* <Vectorminus /> */}</IconButton>
          <Box sx={{ width: '100px' }}>
            <input type="range" min="1" max="100" style={{ width: '100%' }} />
          </Box>
          <IconButton>{/* <Vectorplus /> */}</IconButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Cancel
        </Button>
        <Button onClick={onClose} variant="contained" color="primary">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DropzoneDialog;
