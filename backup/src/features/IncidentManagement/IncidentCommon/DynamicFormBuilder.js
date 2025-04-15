import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  TextField,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormGroup,
  Checkbox,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormLabel,
} from '@mui/material';

const DynamicFormBuilder = ({ formData, formValues = {}, onChange }) => {
  const handleChange = (id, value) => {
    const updatedValues = { ...formValues, [id]: value };
    
    if (onChange) onChange({ id, value, allValues: updatedValues });
  };

  const handleTableCellChange = (fieldKey, rowIndex, columnKey, value) => {
    const tableData = [...(formValues[fieldKey] || [])];
    if (!tableData[rowIndex]) tableData[rowIndex] = {};
    tableData[rowIndex][columnKey] = value;
    handleChange(fieldKey, tableData);
  };

  const renderFormElement = (item) => {
    const fieldKey = item.id;
    if (!fieldKey) return null;

    switch (item.element) {
      case 'Header':
        return (
          <Box
            sx={{
              bgcolor: '#337ab7',
              color: 'white',
              p: 2,
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Typography
              variant="h5"
              fontWeight={item.bold ? 'bold' : 'normal'}
              fontStyle={item.italic ? 'italic' : 'normal'}
            >
              {item.content || item.label || item.text || 'Header'}
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
            {item.content || item.label || item.text || 'Label'}
          </Typography>
        );

      case 'Paragraph':
        return (
          <Box sx={{ mb: 2 }}>
            {item.label && (
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {item.label}
              </Typography>
            )}
            <TextField
              fullWidth
              multiline
              rows={4}
              required={item.required}
              disabled={item.readOnly}
              value={formValues[fieldKey] || ''}
              onChange={(e) => handleChange(fieldKey, e.target.value)}
              variant="outlined"
              placeholder={item.content || ''}
            />
          </Box>
        );

      case 'TextInput':
        return (
          <Box sx={{ mb: 2 }}>
            {item.label && (
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {item.label}
              </Typography>
            )}
            <TextField
              fullWidth
              required={item.required}
              disabled={item.readOnly}
              value={formValues[fieldKey] || ''}
              onChange={(e) => handleChange(fieldKey, e.target.value)}
              variant="outlined"
            />
          </Box>
        );

      case 'RadioButtons':
        return (
          <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {item.label}
            </Typography>
            <RadioGroup
              value={formValues[fieldKey] || ''}
              onChange={(e) => handleChange(fieldKey, e.target.value)}
            >
              {item.options?.map((option) => (
                <FormControlLabel
                  key={option.key}
                  value={option.value}
                  control={<Radio disabled={item.readOnly} />}
                  label={option.text}
                />
              ))}
            </RadioGroup>
          </FormControl>
        );

      case 'Checkboxes':
        return (
          <FormControl component="fieldset" sx={{ mb: 2, width: '100%' }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {item.label}
            </Typography>
            <FormGroup>
              {item.options?.map((option) => (
                <FormControlLabel
                  key={option.key}
                  control={
                    <Checkbox
                      checked={(formValues[fieldKey] || []).includes(option.value)}
                      onChange={(e) => {
                        const values = formValues[fieldKey] || [];
                        handleChange(
                          fieldKey,
                          e.target.checked
                            ? [...values, option.value]
                            : values.filter((v) => v !== option.value)
                        );
                      }}
                      disabled={item.readOnly}
                    />
                  }
                  label={option.text}
                />
              ))}
            </FormGroup>
          </FormControl>
        );

      case 'Dropdown':
        return (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {item.label}
            </Typography>
            <Select
              value={formValues[fieldKey] || ''}
              onChange={(e) => handleChange(fieldKey, e.target.value)}
              disabled={item.readOnly}
              displayEmpty
            >
              <MenuItem value="">Select an option</MenuItem>
              {item.options?.map((option) => (
                <MenuItem key={option.key} value={option.value}>
                  {option.text}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );

      case 'DatePicker':
        return (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              {item.label}
            </Typography>
            <TextField
              type={item.showTimeSelect ? 'datetime-local' : 'date'}
              fullWidth
              required={item.required}
              disabled={item.readOnly}
              value={formValues[fieldKey] || ''}
              onChange={(e) => handleChange(fieldKey, e.target.value)}
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
        );

      case 'Table':
        const columns =
          item.columns ||
          (item.tableData && item.tableData.length > 0
            ? Object.keys(item.tableData[0]).map((key) => ({
                key,
                label:
                  key.charAt(0).toUpperCase() +
                  key.slice(1).replace(/([A-Z])/g, ' $1'),
              }))
            : []);

        const tableData = formValues[fieldKey] || [];
        const isEditable = item.editable !== false;

        return (
          <Box sx={{ mb: 2 }}>
            {item.label && (
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {item.label}
              </Typography>
            )}
            <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell key={column.key} sx={{ fontWeight: 'bold' }}>
                        {column.label || column.key}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {columns.map((column) => (
                        <TableCell key={`${rowIndex}-${column.key}`}>
                          {isEditable ? (
                            <TextField
                              fullWidth
                              size="small"
                              variant="standard"
                              value={row[column.key] || ''}
                              onChange={(e) =>
                                handleTableCellChange(
                                  fieldKey,
                                  rowIndex,
                                  column.key,
                                  e.target.value
                                )
                              }
                            />
                          ) : (
                            row[column.key] || ''
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {formData?.map((item, index) => (
          <Grid item xs={12} key={item.id || index}>
            {renderFormElement(item)}
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default DynamicFormBuilder;
