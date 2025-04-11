import React from 'react';
import { Grid, Typography, TextField, MenuItem, FormControl, RadioGroup, FormControlLabel, Radio, Select } from '@mui/material';
import { FlexContainer, StyledTypography } from '../../../../utils/StyledComponents';
import Label from '../../../../components/Label/Label';

const CustomFormDisplay = ({ data, formValues, setFormValues }) => {
  const getFormValue = (id) => {
    return formValues?.find((v) => v.id === id)?.value || '';
  };

  const handleChange = (id, newValue) => {
    setFormValues((prevValues) =>
      prevValues.map((item) => (item.id === id ? { ...item, value: newValue } : item))
    );
  };

  const renderElement = (item) => {
    if (item.element === 'Header') {
      return (
        <Grid item xs={12} key={item.id}>
          <div
            style={{
              backgroundColor: '#337ab7',
              fontSize: "20px",
              color: 'white',
              padding: '10px',
              width: '100%',
              borderRadius: '4px',
            }}
          >
            {item.content || item.text}
          </div>
        </Grid>
      );
    }

    if (!formValues?.some((v) => v.id === item.id)) return null;

    const value = getFormValue(item.id);
    const label = item.label || item.element;

    return (
      <Grid item xs={6} key={item.id}>
        <FlexContainer>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4}>
              <Typography variant="body1" fontWeight="bold">
                {label}:
              </Typography>
            </Grid>
            <Grid item xs={8}>
              {item.element === 'TextInput' && (
                <TextField fullWidth variant="outlined" value={value} onChange={(e) => handleChange(item.id, e.target.value)} />
              )}
              {item.element === 'Paragraph' && (
                <Typography variant="body2">{value}</Typography>
              )}
              {item.element === 'Label' && <Label>{value}</Label>}
              {item.element === 'Dropdown' && (
                <FormControl fullWidth>
                  <Select value={value} onChange={(e) => handleChange(item.id, e.target.value)}>
                    {item.options?.map((option) => (
                      <MenuItem key={option.value || option} value={option.value || option}>
                        {option.text || option}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {item.element === 'DatePicker' && (
                <TextField
                  type="date"
                  fullWidth
                  variant="outlined"
                  value={value}
                  onChange={(e) => handleChange(item.id, e.target.value)}
                />
              )}
              {item.element === 'RadioButtons' && (
                <FormControl>
                  <RadioGroup value={value} onChange={(e) => handleChange(item.id, e.target.value)}>
                    {item.options?.map((option) => (
                      <FormControlLabel
                        key={option.value || option}
                        value={option.value || option}
                        control={<Radio />}
                        label={option.text || option}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            </Grid>
          </Grid>
        </FlexContainer>
      </Grid>
    );
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Questions</Typography>
      </Grid>
      {data?.map((item) => renderElement(item))}
    </Grid>
  );
};

export default CustomFormDisplay;
