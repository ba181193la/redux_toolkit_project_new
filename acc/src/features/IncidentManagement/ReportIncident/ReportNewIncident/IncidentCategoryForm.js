import React from 'react';
import Label from '../../../../components/Label/Label';
import styled from 'styled-components';
import {
  Box,
  Grid,
  Button,
  Select,
  MenuItem,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Divider,
  FormLabel,
} from '@mui/material';
import { Formik, Field, Form, useFormikContext } from 'formik';
import ImmediateActionTable from './WitnessTable';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
} from '../../../../utils/StyledComponents';
import SearchIcon from '../../../../assets/Icons/SearchWhite.png';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';

const FormContainer = styled(Box)`
  margin: 20px;
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

const IncidentCategoryForm = () => {
  const { values, handleChange, handleBlur } = useFormikContext();
  return (
    <FormContainer>
      <FlexContainer margin="20px 0" gap="10px" alignItems="center">
        <Label bold value="Incident Title" isRequired />
        <StyledButton
          variant="contained"
          color="success"
          padding="6px 16px"
          height="32px"
          startIcon={
            <StyledImage
              height="16px"
              width="16px"
              src={SearchIcon}
              alt="Add New Icon"
              style={{ marginInlineEnd: 8 }}
            />
          }
        >
          Select from list
        </StyledButton>
      </FlexContainer>
      <StyledGridContainer style={{ margin: '0px 0px 20px 0px' }}>
        <StyledGridItem item xs={4} sm={4}>
          <Label bold value="Incident Main Category" isRequired />
          <Field
            name="incidentmaincategory"
            as={Select}
            fullWidth
            value={values.incidentmaincategory}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={true}
            sx={{
              height: '30px',
              padding: '6px 10px',
              fontSize: '12px',
            }}
          >
            <MenuItem value="">Select </MenuItem>
            <MenuItem value="Monday">abc</MenuItem>
            <MenuItem value="Tuesday">xyz</MenuItem>
          </Field>
        </StyledGridItem>

        <StyledGridItem item xs={4} sm={4}>
          <Label bold value="Incident Sub Category" isRequired />
          <Field
            name="incidentsubcategory"
            as={Select}
            fullWidth
            value={values.incidentsubcategory}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={true}
            sx={{
              height: '30px',
              padding: '6px 10px',
              fontSize: '12px',
            }}
          >
            <MenuItem value="">Select </MenuItem>
            <MenuItem value="Monday">abc</MenuItem>
            <MenuItem value="Tuesday">xyz</MenuItem>
          </Field>
        </StyledGridItem>
        <StyledGridItem item xs={4} sm={4}>
          <Label bold value="Incident Details" isRequired />
          <Field
            name="incidentdetails"
            as={Select}
            fullWidth
            value={values.incidentdetails}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={true}
            sx={{
              height: '30px',
              padding: '6px 10px',
              fontSize: '12px',
            }}
          >
            <MenuItem value="">Select </MenuItem>
            <MenuItem value="Monday">abc</MenuItem>
            <MenuItem value="Tuesday">xyz</MenuItem>
          </Field>
        </StyledGridItem>

        <StyledGridItem item xs={12} sm={4}>
          <Label bold value="Remarks" isRequired />
          <Field
            name="remarks"
            as={TextField}
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={values.remarks}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </StyledGridItem>
        <StyledGridItem item xs={12} sm={4}>
          <Label bold value="Brief Description of Incident" isRequired />
          <Field
            name="briefDesc"
            as={TextField}
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={values.immediateActionTaken}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </StyledGridItem>
        <StyledGridItem item xs={12} sm={4}>
          <Label bold value="Immediate Action Taken" isRequired />
          <Field
            name="immediateActionTaken"
            as={TextField}
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={values.immediateActionTaken}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </StyledGridItem>
      </StyledGridContainer>

      <Label bold value="Immediate Action Taken" >
        Immediate Action Taken
      </Label>
      <ImmediateActionTable />
      <FlexContainer
          style={{
            marginTop: '20px',
            justifyContent: 'flex-end',
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
            Add More
          </StyledButton>
        </FlexContainer>
      <Divider sx={{ marginY: '20px' }} />

      <FlexContainer gap="10px">
        <FlexContainer flexDirection="column" width="100%">
          <Label bold value="Incident Department" isRequired />
          <Field
            name="incidentdepartment"
            as={Select}
            fullWidth
            value={values.incidentmaincategory}
            onChange={handleChange}
            onBlur={handleBlur}
            sx={{
              height: '30px',
              padding: '6px 10px',
              fontSize: '12px',
            }}
          >
            <MenuItem value="" disabled >Select </MenuItem>
            <MenuItem value="abc">abc</MenuItem>
            <MenuItem value="xyz">xyz</MenuItem>
          </Field>
        </FlexContainer>
        <FlexContainer flexDirection="column" width="100%">
          <Label bold value="Location Details (Room no etc)" isRequired />
          <TextField
            name="locationdetails"
            value={values.locationdetails || ''}
            onChange={handleChange}
          />
        </FlexContainer>
      </FlexContainer>
    </FormContainer>
  );
};

export default IncidentCategoryForm;
