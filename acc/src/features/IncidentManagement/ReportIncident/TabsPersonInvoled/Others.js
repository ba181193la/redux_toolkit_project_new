import React from 'react';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { Box, Divider, MenuItem, Select, TextField, Grid } from '@mui/material';
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
const Others = () => {
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
        Others
      </StyledTypography>
      <Divider
        sx={{ marginY: '20px' }}
        border="1px solid rgba(63, 81, 151, 1)"
      />

      <FormContainer>
        <StyledGridContainer>
          <Grid item xs={12} sm={4}>
            <Label bold value="Name:" isRequired />
            <Field
              name="patientid"
              as={TextField}
              fullWidth
              variant="outlined"
            />
          </Grid>
          <StyledGridItem item xs={12} sm={4}>
            <Label bold value="Age" isRequired />
            <Field
              name="patientname"
              as={TextField}
              fullWidth
              variant="outlined"
            />
          </StyledGridItem>
          <StyledGridItem item xs={12} sm={4}>
            <Label bold value="Gender" isRequired />
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
            <Label bold value="Details:" isRequired />
            <Field
              name="briefDesc"
              as={TextField}
              fullWidth
              variant="outlined"
              multiline
              rows={4}
            />
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
          Save Person Detail
        </StyledButton>
      </FlexContainer>
      <Divider sx={{ marginY: '20px' }} />
    </FlexContainer>
  );
};

export default Others;
