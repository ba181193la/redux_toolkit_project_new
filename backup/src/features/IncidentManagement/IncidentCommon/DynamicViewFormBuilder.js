import React from 'react';
import { Grid, Paper, Divider, Typography, Box } from '@mui/material';

const DynamicFormViewer = ({ formData, formValues = [] }) => {
  const getValueById = (itemId) => {
    const found = formValues.find((val) => val.id === itemId);
    return found?.value || '';
  };

  const getLabelText = (item) => {
    return item.label || item.content || item.text || '';
  };

  const renderFormElement = (item) => {
    if (!item || !item.element) return null;

    const value = getValueById(item.id);

    switch (item.element) {
      case 'Header':
        return (
          <Box
            sx={{
              bgcolor: '#337ab7',
              color: 'white',
              p: 1,
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={item.bold ? 'bold' : 'normal'}
              fontStyle={item.italic ? 'italic' : 'normal'}
            >
              {item.content || item.text || item.label || ''}
            </Typography>
          </Box>
        );

      case 'Label':
        return (
          <Typography
            variant="body1"
            fontWeight={item.bold ? 'bold' : 'normal'}
            fontStyle={item.italic ? 'italic' : 'normal'}
            sx={{ mb: 2 }}
          >
              {item.content || item.text || item.label || ''}
              </Typography>
        );

      default:
        return (
          <Box sx={{ mb: 1 }}>
            <Grid container spacing={1} alignItems="center">
              <Grid
                item
                xs={4}
                sx={{
                  textAlign: 'left',
                  pr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{getLabelText(item)}</span>
                <span>:</span>
              </Grid>
              <Grid
                item
                xs={8}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {value || ''}
              </Grid>
            </Grid>
          </Box>
        );
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Grid container spacing={2}>
        {Array.isArray(formData) &&
          formData.map((item, index) => (
            <Grid item xs={12} key={item.id || index}>
              {renderFormElement(item)}
              {/* {index < formData.length - 1 && item.canHavePageBreakBefore && (
                // <Divider sx={{ my: 2 }} />
              )} */}
            </Grid>
          ))}
      </Grid>
    </Paper>
  );
};

export default DynamicFormViewer;
