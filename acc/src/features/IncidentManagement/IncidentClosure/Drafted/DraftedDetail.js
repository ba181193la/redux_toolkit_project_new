import React from 'react';
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Accordion,
  AccordionSummary,
  TableContainer,
  Table,
  Paper,
  TableBody,
} from '@mui/material';
import styled from 'styled-components';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import ArrowBackIcon from '../../../../assets/Icons/ArrowBackIcon.png';
import SearchIcon from '../../../../assets/Icons/Search.png';
import DoNotDisturbAltIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import SkipIcon from '../../../../assets/Icons/SkipIcon.png';
import FillIcon from '../../../../assets/Icons/FillIcon.png';
import ApproveIncidentIcon from '../../../../assets/Icons/ApproveIncidentIcon.png';
import RejectIcon from '../../../../assets/Icons/RejectIcon.png';
import MergeIcon from '../../../../assets/Icons/RejectIcon.png';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ApproveIncidentTable from '../../IncidentApproval/CompletedList/ApproveIncident';
import IncidentDetailTable from '../../IncidentApproval/CompletedList/IncidentDetailTable';

// Styled Components
const SectionHeader = styled(Box)`
  background-color: #da83c3;
  padding: 10px 20px;
  font-weight: bold;
  color: #fff;
`;

const StyledGridContainer = styled(Grid)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  padding: 20px;
`;

const StyledGridItem = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const FormContainer = styled(Box)`
  margin: 20px;
  background-color: #fff;
`;

const FormLabel = styled(Typography)`
  font-weight: 400 !important;
  color: #0083c0;
`;

const ActionButton = styled(Button)`
  color: #fff !important;
  border-radius: 6px !important;
  text-transform: none !important;
  box-shadow: 0px 4px 4px 0px #00000040 !important;

  &:hover {
    transform: scale(1.05) !important;
    transition: transform 0.3s ease !important;
  }
`;

const CancelButton = styled(Button)`
  margin-left: 10px;
  border-color: #007bba;
`;

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  text-align: left;
`;

const DraftedDetail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <FlexContainer style={{ flexDirection: 'column', width: '100%' }}>
      <FlexContainer
        marginBottom={'30px'}
        marginTop={'65px'}
        justifyContent={'space-between'}
        style={{ paddingBottom: '15px' }}
      >
        <StyledTypography
          fontSize="30px"
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('MM_SM_IncidentClosure')}
        </StyledTypography>
      </FlexContainer>

      <FlexContainer style={{ backgroundColor: '#fff' }}>
        <Box p={3} paddingTop={0}>
          {/* Incident Detail */}

          <FlexContainer
            style={{
              padding: '20px 15px',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'flex-start',
            }}
          >
            <img
              src={ArrowBackIcon}
              alt="ArrowBackIcon"
              style={{
                color: 'linear-gradient(180deg, #8C05ED 0%, #EF37D9 100%)',
                marginInlineEnd: '8px',
                fontSize: '24px',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/IncidentManagement/IncidentClosure')}
            />

            <StyledTypography
              fontSize="20px"
              fontWeight="600"
              lineHeight="24px"
              textAlign="left"
              color="#205475"
            >
              {t('MM_IncidentClosure')}
            </StyledTypography>
          </FlexContainer>

          <Accordion
            sx={{
              borderColor: '#DA83C3',
              marginBottom: '10px',
              border: '1px solid #DA83C3',
              borderRadius: '8px 8px 0px 0px',
            }}
          >
            <AccordionSummary
              expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                backgroundColor: '#DA83C3',
                width: '100%',
              }}
            >
              <StyledTypography
                fontSize="16px"
                fontWeight="700"
                lineHeight="20px"
                textAlign="center"
                color="#FFFFFF"
                border={'1px solid #DA83C3'}
              >
                Incident Details
              </StyledTypography>
            </AccordionSummary>
            <FormContainer>
              <FlexContainer flexDirection={'column'}>
                {/* <SectionHeader>Incident Details</SectionHeader> */}

                <StyledGridContainer>
                  {/* Row 1 */}
                  <StyledGridItem>
                    <FormLabel>Facility</FormLabel>
                    <StyledTypography> Apollo - Chennai</StyledTypography>
                  </StyledGridItem>
                  <StyledGridItem>
                    <FormLabel>Incident No</FormLabel>
                    <StyledTypography> NRC-IR-22062024-001</StyledTypography>
                  </StyledGridItem>
                  <StyledGridItem>
                    <FormLabel>Be Anonymous</FormLabel>
                    <StyledTypography> Yes</StyledTypography>
                  </StyledGridItem>

                  {/* Row 2 */}
                  <StyledGridItem>
                    <FormLabel>Incident Day</FormLabel>
                    <StyledTypography> Friday</StyledTypography>
                  </StyledGridItem>
                  <StyledGridItem>
                    <FormLabel>Incident Time</FormLabel>
                    <StyledTypography> 23:30</StyledTypography>
                  </StyledGridItem>
                  <StyledGridItem>
                    <FormLabel>Reported Date</FormLabel>
                    <StyledTypography> 22-06-2024</StyledTypography>
                  </StyledGridItem>

                  {/* Row 3 */}
                  <StyledGridItem>
                    <FormLabel>Reported Time</FormLabel>
                    <StyledTypography> 00:58</StyledTypography>
                  </StyledGridItem>
                  <StyledGridItem>
                    <FormLabel>Incident Type</FormLabel>
                    <StyledTypography> Incident</StyledTypography>
                  </StyledGridItem>
                  <StyledGridItem>
                    <FormLabel>Clinical/Non Clinical</FormLabel>
                    <StyledTypography> Clinical</StyledTypography>
                  </StyledGridItem>
                </StyledGridContainer>

                {/* Incident Title */}
                <Box
                  style={{
                    fontWeight: '600',
                    fontSize: '16px',
                    lineHeight: '19.2px',
                    color: '#F47721',
                  }}
                >
                  Incident Title
                </Box>
                <StyledGridContainer>
                  <StyledGridItem>
                    <FormLabel>Incident Main Category</FormLabel>
                    <StyledTypography> Infection Control</StyledTypography>
                  </StyledGridItem>
                  <StyledGridItem>
                    <FormLabel>Incident Details</FormLabel>
                    <StyledTypography> Needle Stick</StyledTypography>
                  </StyledGridItem>
                  <StyledGridItem>
                    <FormLabel>Remarks</FormLabel>
                    <StyledTypography> - </StyledTypography>
                  </StyledGridItem>

                  <StyledGridItem>
                    <FormLabel>Brief Description of Incident</FormLabel>
                    <StyledTypography> Old needle stick</StyledTypography>
                  </StyledGridItem>
                  <StyledGridItem>
                    <FormLabel>Immediate Action Taken</FormLabel>
                    <StyledTypography>need a action quickly</StyledTypography>
                  </StyledGridItem>
                  <StyledGridItem>
                    <FormLabel>Incident Department</FormLabel>
                    <StyledTypography>Infection Control</StyledTypography>
                  </StyledGridItem>
                  <StyledGridItem>
                    <FormLabel>Location Details (Room no etc.)</FormLabel>
                    <StyledTypography>Not Applicable</StyledTypography>
                  </StyledGridItem>
                </StyledGridContainer>
                <FormLabel style={{ marginBottom: '10px' }}>
                  Immediate Action
                </FormLabel>
                <IncidentDetailTable />
                <Box
                  style={{
                    fontWeight: '600',
                    fontSize: '16px',
                    lineHeight: '19.2px',
                    color: '#F47721',
                    margin: '10px 0px 10px 0px',
                  }}
                >
                  Person Involved in the Incident
                </Box>
                <FormLabel style={{ marginBottom: '10px' }}>
                  Staff(s):
                </FormLabel>
                <IncidentDetailTable />
                <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
                  Witnessed By:
                </FormLabel>
                <IncidentDetailTable />
              </FlexContainer>
            </FormContainer>
          </Accordion>

          {/* Incident Approval Detail Section */}

          <Accordion
            sx={{
              marginBottom: '10px',
              border: '1px solid  #BE86FF',
              borderRadius: '8px 8px 0px 0px',
            }}
          >
            <AccordionSummary
              expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                backgroundColor: '#BE86FF',
                width: '100%',
              }}
            >
              <StyledTypography
                fontSize="16px"
                fontWeight="700"
                lineHeight="20px"
                textAlign="center"
                color="#FFFFFF"
              >
                Incident Approval Entry
              </StyledTypography>
            </AccordionSummary>
            <FormContainer style={{ marginBottom: '20px' }}>
              <FlexContainer flexDirection={'column'}>
                {/* <SectionHeader>Incident Approval Entry</SectionHeader> */}
                <Grid container spacing={2} p={2}>
                  <StyledGrid item xs={6}>
                    <FormLabel>Incident Title</FormLabel>
                    <InputAdornment position="absolute">
                      <img
                        src={SearchIcon}
                        alt="Search Icon"
                        style={{ width: '20px', height: '20px' }}
                      />
                    </InputAdornment>
                  </StyledGrid>
                  <Grid item xs={4}>
                    <FormLabel>Incident Main Category*</FormLabel>
                    <TextField
                      fullWidth
                      defaultValue="Accommodation Related Issues"
                      slotProps={{ htmlInput: { maxLength: 200 } }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormLabel>Incident Sub Category*</FormLabel>
                    <TextField
                      fullWidth
                      defaultValue="Arrival Of Candidates to Accommodate"
                      slotProps={{ htmlInput: { maxLength: 350 } }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormLabel>Incident Details*</FormLabel>
                    <TextField
                      fullWidth
                      placeholder=" "
                      slotProps={{ htmlInput: { maxLength: 300 } }}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <FormLabel>Incident Type*</FormLabel>
                    <Select fullWidth defaultValue="Near Miss">
                      <MenuItem value="Near Miss">Near Miss</MenuItem>
                    </Select>
                  </Grid>

                  <Grid item xs={4}>
                    <FormLabel>Clinical/Non-Clinical*</FormLabel>
                    <RadioGroup row defaultValue="Clinical">
                      <FormControlLabel
                        value="Clinical"
                        control={<Radio />}
                        label="Clinical"
                      />
                      <FormControlLabel
                        value="Non-Clinical"
                        control={<Radio />}
                        label="Non-Clinical"
                      />
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={4}>
                    <FormLabel>Incident Department*</FormLabel>
                    <Select fullWidth defaultValue="Accounts">
                      <MenuItem value="Accounts">Accounts</MenuItem>
                    </Select>
                  </Grid>

                  <Grid item xs={4}>
                    <FormLabel>Location Details/Room No etc:</FormLabel>
                    <TextField
                      fullWidth
                      placeholder=" "
                      slotProps={{ htmlInput: { maxLength: 100 } }}
                    />
                  </Grid>

                  <Grid item xs={4}>
                    <FormLabel>Harm Level*</FormLabel>
                    <Select fullWidth defaultValue="Moderate">
                      <MenuItem value="Moderate">Moderate</MenuItem>
                    </Select>
                  </Grid>

                  <Grid item xs={4}>
                    <FormLabel>
                      Any Additional Staff You Wish To Be Notified?
                    </FormLabel>
                    <RadioGroup row defaultValue="Yes">
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </Grid>
                </Grid>
              </FlexContainer>

              {/* Action Buttons */}

              {/* <Box display="flex" justifyContent="center" mt={3}> */}
              <FlexContainer padding="10px" justifyContent="space-evenly">
                <ActionButton
                  style={{
                    backgroundColor: '#E8BD11',
                  }}
                  startIcon={
                    <StyledImage
                      src={MergeIcon}
                      style={{
                        marginBottom: '1px',
                        marginInlineEnd: 8,
                      }}
                    />
                  }
                >
                  Merge Incident
                </ActionButton>
                <ActionButton
                  style={{ backgroundColor: '#E8BD11' }}
                  startIcon={
                    <StyledImage
                      src={SkipIcon}
                      style={{
                        marginBottom: '1px',
                        marginInlineEnd: 8,
                      }}
                    />
                  }
                >
                  Skip Investigation
                </ActionButton>
                <ActionButton
                  style={{ backgroundColor: '#0083C0' }}
                  startIcon={
                    <StyledImage
                      src={FillIcon}
                      style={{
                        marginBottom: '1px',
                        marginInlineEnd: 8,
                      }}
                    />
                  }
                >
                  Fill RCA
                </ActionButton>
                <ActionButton
                  style={{ backgroundColor: '#1FB50E' }}
                  startIcon={
                    <StyledImage
                      src={ApproveIncidentIcon}
                      style={{
                        marginBottom: '1px',
                        marginInlineEnd: 8,
                      }}
                    />
                  }
                >
                  Approve Incident and assign Investigators
                </ActionButton>

                <ActionButton
                  style={{ backgroundColor: '#C11919' }}
                  startIcon={
                    <StyledImage
                      src={RejectIcon}
                      style={{
                        marginBottom: '1px',
                        marginInlineEnd: 8,
                      }}
                    />
                  }
                >
                  Reject Incident
                </ActionButton>
                <ActionButton
                  variant="outlined"
                  sx={{
                    boxShadow: '0px 4px 4px 0px #00000040',
                    '&:hover': {
                      transform: 'scale(1.05) !important',
                      transition: 'transform 0.3s ease !important',
                    },
                  }}
                  startIcon={
                    <StyledImage
                      src={DoNotDisturbAltIcon}
                      style={{
                        marginBottom: '1px',
                        marginInlineEnd: 8,
                      }}
                    />
                  }
                >
                  <StyledTypography textTransform="none" marginTop="1px">
                    Cancel
                  </StyledTypography>
                </ActionButton>
              </FlexContainer>
              {/* </Box> */}
            </FormContainer>
          </Accordion>

          {/* Merge Incident*/}

          <Accordion
            sx={{
              marginBottom: '10px',
              border: '1px solid  #BE86FF73',
              borderRadius: '8px 8px 0px 0px',
            }}
          >
            <AccordionSummary
              expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                backgroundColor: '#BE86FF73',
                width: '100%',
              }}
            >
              <StyledTypography
                fontSize="16px"
                fontWeight="700"
                lineHeight="20px"
                textAlign="center"
                color="#000000A6"
              >
                Merge Incident
              </StyledTypography>
            </AccordionSummary>
            <FormContainer style={{ marginBottom: '20px' }}>
              <FlexContainer flexDirection={'column'}>
                {/* <SectionHeader>Incident Approval Entry</SectionHeader> */}
                <Grid container spacing={2} p={2}>
                  <Grid item xs={3}>
                    <FormLabel>Incident Number</FormLabel>
                    <TextField
                      fullWidth
                      defaultValue="Incident Number"
                      slotProps={{ htmlInput: { maxLength: 30 } }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <img src={SearchIcon} alt="Search Icon" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <FormLabel>Incident Main Category</FormLabel>
                    <TextField
                      fullWidth
                      defaultValue="Incident Main Category"
                      slotProps={{ htmlInput: { maxLength: 200 } }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormLabel>Incident Sub Category</FormLabel>
                    <TextField
                      fullWidth
                      defaultValue="Incident Sub Category"
                      slotProps={{ htmlInput: { maxLength: 350 } }}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <FormLabel>Incident Details</FormLabel>
                    <TextField
                      fullWidth
                      defaultValue="Incident Details"
                      slotProps={{ htmlInput: { maxLength: 300 } }}
                    />
                  </Grid>
                </Grid>
              </FlexContainer>

              {/* </Box> */}
            </FormContainer>
          </Accordion>

          {/* Approve Incident and Assign Values*/}

          <Accordion
            sx={{
              border: '1px solid  #BE86FF73',
              borderRadius: '8px 8px 0px 0px',
              marginBottom: '10px',
            }}
          >
            <AccordionSummary
              expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                backgroundColor: '#BE86FF73',
                width: '100%',
              }}
            >
              <StyledTypography
                fontSize="16px"
                fontWeight="700"
                lineHeight="20px"
                textAlign="center"
                color="#000000A6"
              >
                Approve Incident and Assign Values
              </StyledTypography>
            </AccordionSummary>
            <FormContainer style={{ marginBottom: '20px' }}>
              <FlexContainer flexDirection={'column'}>
                <ApproveIncidentTable />
                <FlexContainer
                  // justifyContent={isMobile ? 'space-between' : 'end'}
                  // padding={isMobile ? '0 0px 10px 0' : '0 0px 20px 0'}
                  style={{
                    marginTop: '20px',
                    justifyContent: 'flex-end',
                    gap: '10px',
                  }}
                >
                  <StyledButton
                    variant="contained"
                    // padding={isMobile ? '6px 10px' : '6px 16px'}
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
                    // onClick={() => {
                    //   navigate('/MainMaster/StaffSubMaster');
                    // }}
                  >
                    Add Investigation
                  </StyledButton>
                </FlexContainer>
              </FlexContainer>

              {/* </Box> */}
            </FormContainer>
          </Accordion>

          {/* Opinion Exchanged*/}

          <Accordion
            sx={{
              border: '1px solid  #BE86FF73',
              borderRadius: '8px 8px 0px 0px',
              marginBottom: '10px',
            }}
          >
            <AccordionSummary
              expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                backgroundColor: '#BE86FF73',
                width: '100%',
              }}
            >
              <StyledTypography
                fontSize="16px"
                fontWeight="700"
                lineHeight="20px"
                textAlign="center"
                color="#000000A6"
              >
                Approve Incident and Assign Values
              </StyledTypography>
            </AccordionSummary>
            <FormContainer style={{ marginBottom: '20px' }}>
              <FlexContainer flexDirection={'column'}>
                <ApproveIncidentTable />
                <FlexContainer
                  // justifyContent={isMobile ? 'space-between' : 'end'}
                  // padding={isMobile ? '0 0px 10px 0' : '0 0px 20px 0'}
                  style={{
                    marginTop: '20px',
                    justifyContent: 'flex-end',
                    gap: '10px',
                  }}
                >
                  <StyledButton
                    variant="contained"
                    // padding={isMobile ? '6px 10px' : '6px 16px'}
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
                    // onClick={() => {
                    //   navigate('/MainMaster/StaffSubMaster');
                    // }}
                  >
                    Add Opinion
                  </StyledButton>
                </FlexContainer>
              </FlexContainer>

              {/* </Box> */}
            </FormContainer>
          </Accordion>

          {/* Reject Incident*/}

          <Accordion
            sx={{
              border: '1px solid  #BE86FF73',
              borderRadius: '8px 8px 0px 0px',
              marginBottom: '10px',
            }}
          >
            <AccordionSummary
              expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                backgroundColor: '#BE86FF73',
                width: '100%',
              }}
            >
              <StyledTypography
                fontSize="16px"
                fontWeight="700"
                lineHeight="20px"
                textAlign="center"
                color="#000000A6"
              >
                Reject Incident
              </StyledTypography>
            </AccordionSummary>
            <FormContainer style={{ marginBottom: '20px' }}>
              <FlexContainer flexDirection={'column'}>
                <FormLabel marginBottom={'10px'}>
                  Reason For Rejection*
                </FormLabel>
                <TextField
                  multiline
                  variant="outlined"
                  fullWidth
                  // defaultValue="Reason For Rejection*"
                  rows={4}
                />
                <FlexContainer
                  // justifyContent={isMobile ? 'space-between' : 'end'}
                  // padding={isMobile ? '0 0px 10px 0' : '0 0px 20px 0'}
                  style={{
                    marginTop: '20px',
                    justifyContent: 'flex-end',
                    gap: '10px',
                  }}
                >
                  <StyledButton
                    variant="contained"
                    // padding={isMobile ? '6px 10px' : '6px 16px'}
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
                    // onClick={() => {
                    //   navigate('/MainMaster/StaffSubMaster');
                    // }}
                  >
                    Add Opinion
                  </StyledButton>
                </FlexContainer>
              </FlexContainer>

              {/* </Box> */}
            </FormContainer>
          </Accordion>
        </Box>
      </FlexContainer>
    </FlexContainer>
  );
};

export default DraftedDetail;
