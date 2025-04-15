import React, { useState } from 'react';
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
  Typography,
  Tabs,
} from '@mui/material';
import { Formik, Field, Form } from 'formik';
import ImmediateActionTable from './WitnessTable';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTab,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';
import Attach from '../../../../assets/Icons/Attach.png';
import AdditionalStaff from './AdditionalStaff';
import { column } from 'stylis';
import TabPanel from '../../../../components/Tabpanel/Tabpanel';
import Staff from '../TabsPersonInvoled/Staff';
import Patient from '../TabsPersonInvoled/Patient';
import Companion from '../TabsPersonInvoled/Companion ';
import Visitor from '../TabsPersonInvoled/Visitor';
import OutsourcedStaff from '../TabsPersonInvoled/OutsourcedStaff';
import Others from '../TabsPersonInvoled/Others';

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

const PersonInvolvedForm = ({ values, handleChange, handleBlur }) => {
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <FormContainer>
      <StyledTypography
        fontSize="14px"
        fontWeight="700"
        lineHeight="16px"
        whiteSpace={'nowrap'}
        padding="0 0 10px 0"
      >
        Person Involved in the Incident:
      </StyledTypography>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="secondary"
        textColor="inherit"
        variant="fullWidth"
        aria-label="full width tabs example"
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: 'transparent',
          },
        }}
      >
        <StyledTab label="Staff" customBackgroundcolor="#3F5197"></StyledTab>
        <StyledTab label="Patient" customBackgroundcolor="#3F5197"></StyledTab>
        <StyledTab
          label="Companion"
          customBackgroundcolor="#3F5197"
        ></StyledTab>
        <StyledTab label="Visitor" customBackgroundcolor="#3F5197"></StyledTab>
        <StyledTab
          label="Outsourced Staff"
          customBackgroundcolor="#3F5197"
        ></StyledTab>
        <StyledTab label="Others" customBackgroundcolor="#3F5197"></StyledTab>
      </Tabs>
      <TabPanel value={tabValue} index={0}>
        <Staff />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Patient />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <Companion />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <Visitor />
      </TabPanel>
      <TabPanel value={tabValue} index={4}>
        <OutsourcedStaff />
      </TabPanel>
      <TabPanel value={tabValue} index={5}>
        <Others />
      </TabPanel>

      <FlexContainer flexDirection="column" width="100%">
        <Label bold value="Witnessed By:" />
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
            Add More Staff
          </StyledButton>
        </FlexContainer>
      </FlexContainer>
      <Divider sx={{ marginY: '20px' }} />

      <Grid container spacing={2} p={2}>
        <Grid item xs={6} md={6}>
          <FlexContainer flexDirection="column">
            <Label bold value="Attachments:" isRequired />
            <div
              style={{
                border: '1px rgba(197, 197, 197, 1)',
                padding: '20px',
                borderRadius: 'Top-left 4px Top-right 4px',
                background: 'rgba(230, 243, 249, 1)',
                height: '140px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 1)',
                  height: '140px',
                }}
              >
                <StyledTypography
                  fontSize={'14px'}
                  fontWeight="400"
                  lineHeight="20px"
                >
                  <StyledImage src={Attach} alt="file attachment" />
                  Attachment(s)
                </StyledTypography>
              </div>
            </div>
            <Button variant="contained">Upload Attachment(s)</Button>
            <Typography
              variant="body2"
              color="error"
              style={{ marginTop: '8px' }}
              fontSize="10px"
              lineHeight="16px"
              fontWeight="400"
            >
              Note: Maximum File Upload Limit is 100MB (Images, PDF, Word Files,
              Excel Files Only)
            </Typography>
          </FlexContainer>
        </Grid>
        <Grid item xs={6} md={6}>
          <Label bold value="Harm Lavel" isRequired />
          <Field
            name="harmlevel"
            as={Select}
            fullWidth
            value={values.harmlevel}
            onChange={handleChange}
            onBlur={handleBlur}
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
        </Grid>
      </Grid>

      <StyledGridItem item xs={12} sm={4}>
        <Label bold
          value="Any additional staff you wish to be notified?*"
          isRequired
        />
        <Field
          name="additionalform"
          as={RadioGroup}
          value={values.additionalform}
          onChange={handleChange}
          row
        >
          <FormControlLabel
            value="yes"
            control={<Radio />}
            label="Yes"
            sx={{
              '& .MuiFormControlLabel-label': { fontSize: '12px' },
            }}
          />
          <FormControlLabel
            value="no"
            control={<Radio />}
            label="No"
            sx={{
              '& .MuiFormControlLabel-label': { fontSize: '12px' },
            }}
          />
        </Field>
      </StyledGridItem>
      
    </FormContainer>
  );
};

export default PersonInvolvedForm;
