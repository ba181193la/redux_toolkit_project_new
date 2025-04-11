import React from 'react';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { Box, Divider, MenuItem, Select, Grid } from '@mui/material';
import Label from '../../../../components/Label/Label';
import { Field } from 'formik';
import styled from 'styled-components';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';

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
const Staff = () => {
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
        Staff
      </StyledTypography>
      <Divider
        sx={{ marginY: '20px' }}
        border="1px solid rgba(63, 81, 151, 1)"
      />
      <StyledGridContainer>
        <StyledGridItem item xs={12} sm={4} md={4}>
          <Label bold value="Staff Id" isRequired />
          <Field
            name="staffid"
            as={Select}
            fullWidth
            //value={values.staffid}
            //onChange={handleChange}
            sx={{
              height: '30px',
              padding: '6px 10px',
              fontSize: '12px',
            }}
          >
            <MenuItem value="">Select </MenuItem>
            <MenuItem value="abc">abc</MenuItem>
            <MenuItem value="xyz">xyz</MenuItem>
          </Field>
        </StyledGridItem>
        <StyledGridItem item xs={12} sm={4} md={4}>
          <Label bold value="Staff Name" isRequired />
          <Field
            name="staffname"
            as={Select}
            fullWidth
            //value={values.staffid}
            //onChange={handleChange}
            sx={{
              height: '30px',
              padding: '6px 10px',
              fontSize: '12px',
            }}
          >
            <MenuItem value="">Select </MenuItem>
            <MenuItem value="abc">abc</MenuItem>
            <MenuItem value="xyz">xyz</MenuItem>
          </Field>
        </StyledGridItem>
        <StyledGridItem item xs={12} sm={4} md={4}>
          <Label bold value="Department / Speciality" isRequired />
          <Field
            name="staffid"
            as={Select}
            fullWidth
            //value={values.staffid}
            //onChange={handleChange}
            sx={{
              height: '30px',
              padding: '6px 10px',
              fontSize: '12px',
            }}
          >
            <MenuItem value="">Select </MenuItem>
            <MenuItem value="abc">abc</MenuItem>
            <MenuItem value="xyz">xyz</MenuItem>
          </Field>
        </StyledGridItem>
        <StyledGridItem item xs={12} sm={4} md={4}>
          <Label bold value="Designation" isRequired />
          <Field
            name="staffid"
            as={Select}
            fullWidth
            //value={values.staffid}
            //onChange={handleChange}
            sx={{
              height: '30px',
              padding: '6px 10px',
              fontSize: '12px',
            }}
          >
            <MenuItem value="">Select </MenuItem>
            <MenuItem value="abc">abc</MenuItem>
            <MenuItem value="xyz">xyz</MenuItem>
          </Field>
        </StyledGridItem>
        <StyledGridItem item xs={12} sm={4} md={4}>
          <Label bold value="Staff Category" isRequired />
          <Field
            name="staffid"
            as={Select}
            fullWidth
            //value={values.staffid}
            //onChange={handleChange}
            sx={{
              height: '30px',
              padding: '6px 10px',
              fontSize: '12px',
            }}
          >
            <MenuItem value="">Select </MenuItem>
            <MenuItem value="abc">abc</MenuItem>
            <MenuItem value="xyz">xyz</MenuItem>
          </Field>
        </StyledGridItem>
      </StyledGridContainer>
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
          Save Staff Details
        </StyledButton>
      </FlexContainer>
      <Divider sx={{ marginY: '20px' }} />
    </FlexContainer>
  );
};

export default Staff;
