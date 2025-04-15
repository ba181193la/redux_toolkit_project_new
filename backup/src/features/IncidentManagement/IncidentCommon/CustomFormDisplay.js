import React from 'react';
import { Grid } from '@mui/material';
import {
  FlexContainer,
  StyledTypography,
} from '../../../utils/StyledComponents';
import Label from '../../../components/Label/Label';

const CustomFormDisplay = ({ data, formValues }) => {
  const getFormValue = (id) => {
    const formValue = formValues?.find((v) => v.id === id);
    return formValue ? formValue.value : '';
  };

  const renderElement = (item) => {
    if (item.element === 'Header') {
      return (
        <Grid item xs={12} key={item.id}>
          <div
            style={{
              backgroundColor: '#337ab7',
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

    const value = getFormValue(item.id);
    if (!value) return null;

    const label = item.label || item.element;

    return (
      <Grid item xs={12} key={item.id}>
        <FlexContainer>
          <Grid container spacing={2} alignItems="center">
            <Grid
              item
              xs={4}
              style={{
                display: 'flex',
                alignItems: 'center',
                paddingRight: '10px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  maxWidth: '150px',
                  padding: '10px',

                }}
              >
                <span>{label}</span>
                <span>:</span>
              </div>
            </Grid>
            <Grid item xs={8}>
              <StyledTypography>{value}</StyledTypography>
            </Grid>
          </Grid>
        </FlexContainer>
      </Grid>
    );
  };

  return (
    <Grid container spacing={2} >
      <Grid item xs={12}>
        <Label bold value="" />
      </Grid>
      {data?.map((item) => renderElement(item))}
    </Grid>
  );
};

export default CustomFormDisplay;
