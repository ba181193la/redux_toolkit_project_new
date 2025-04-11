import React from 'react';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { Box, Divider, Grid, MenuItem, Select, TextField } from '@mui/material';
import Label from '../../../../components/Label/Label';
import { Field } from 'formik';
import styled from 'styled-components';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';

const FormContainer = styled(Box)`
  background-color: #fff;
`;
const StyledGridContainer = styled(Grid)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 5px;
`;

const StyledGridItem = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const Companion = () => {
  return (
    <FlexContainer flexDirection="column" width="100%" margin="10px 0 0 0">
      <StyledTypography
        fontSize="18px"
        fontWeight="700"
        lineHeight="22px"
        color="rgba(0, 131, 192, 1)"
        whiteSpace={'nowrap'}
        // padding='20px'
      >
        Companion
      </StyledTypography>
      <Divider
        sx={{ marginY: '20px' }}
        border="1px solid rgba(63, 81, 151, 1)"
      />

      <FormContainer>
        <StyledGridContainer>
          <Grid item xs={12} sm={4}>
            <Label bold value="Patient Id:" isRequired />
            <Field
              name="patientid"
              as={TextField}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <StyledGridItem item xs={12} sm={4}>
            <Label bold value="Patient Name:" isRequired />
            <Field
              name="patientname"
              as={TextField}
              fullWidth
              variant="outlined"
            />
          </StyledGridItem>

          <StyledGridItem item xs={12} sm={4}>
            <Label bold value="Department / Unit:" />
            <Field
              name="department"
              as={Select}
              fullWidth
              sx={{
                height: '30px',
                padding: '6px 10px',
                fontSize: '12px',
              }}
            >
              <MenuItem value="nearmiss">Select</MenuItem>
              <MenuItem value="incident">abc</MenuItem>
            </Field>
          </StyledGridItem>
          <StyledGridItem item xs={12} sm={4}>
            <Label bold value="Room No / Details:" isRequired />
            <Field name="roomno" as={TextField} fullWidth variant="outlined" />
          </StyledGridItem>
          <StyledGridItem item xs={12} sm={4}>
            <Label bold value="Companion Name:" isRequired />
            <Field name="age" as={TextField} fullWidth variant="outlined" />
          </StyledGridItem>
          <StyledGridItem item xs={12} sm={4}>
            <Label bold value="Companion Age:" isRequired />
            <Field name="age" as={TextField} fullWidth variant="outlined" />
          </StyledGridItem>

          <StyledGridItem item xs={12} sm={4}>
            <Label bold value="Companion Gender" isRequired />
            <Field
              name="gender"
              as={Select}
              fullWidth
              sx={{
                height: '30px',
                padding: '6px 10px',
                fontSize: '12px',
              }}
            >
              <MenuItem value="nearmiss">Male</MenuItem>
              <MenuItem value="incident">Female</MenuItem>
            </Field>
          </StyledGridItem>
          <StyledGridItem item xs={12} sm={4}>
            <Label bold value="Relationship:" isRequired />
            <Field name="name" as={TextField} fullWidth variant="outlined" />
          </StyledGridItem>
        </StyledGridContainer>
      </FormContainer>
      <FlexContainer
        style={{
          marginTop: '20px',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <StyledButton
          variant="contained"
          marginTop={'10px'}
          startIcon={
            <StyledImage
              height="14px"
              width="14px"
              src={AddSubMaster}
              alt="Add New Icon"
              style={{ marginInlineEnd: 8 }}
            />
          }
        >
          Save Companion Details
        </StyledButton>
      </FlexContainer>
      <Divider sx={{ marginY: '20px' }} />
    </FlexContainer>
  );
};

export default Companion;
