import React from 'react';
import {
  Box,
  Grid,
  Button,
  Accordion,
  AccordionSummary,
} from '@mui/material';
import styled from 'styled-components';
import {
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import ArrowBackIcon from '../../../../assets/Icons/ArrowBackIcon.png';
import DoNotDisturbAltIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import IncidentDetailTable from '../../IncidentApproval/CompletedList/IncidentDetailTable';
import Label from '../../../../components/Label/Label';
import AttachmentTable from './AttachmentTable';
import StaffTable from './StaffTable';
import { TextField } from '../../../../components/TextField/TextField';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import SubmitTik from '../../../../assets/Icons/SubmitTik.png';
import AssignedInvestorTable from './AssignedInvestorTable';
import RejectedByInvestorTable from './RejectedByInvestorTable';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';

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
const ReadOnlyText = styled(StyledTypography)`
  font-weight: 500 !important;
  font-size: 14px !important;
`;

const RejectDetail = () => {
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
          {t('MM_SM_SearchIncident')}
        </StyledTypography>
      </FlexContainer>

      <FlexContainer style={{ backgroundColor: '#fff' }}>
        <Box p={3} paddingTop={0} style={{ width: '100%' }}>
          {/* Incident Detail */}

          <FlexContainer
            style={{
              padding: '20px 15px',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <FlexContainer>
              <img
                src={ArrowBackIcon}
                alt="ArrowBackIcon"
                style={{
                  color: 'linear-gradient(180deg, #8C05ED 0%, #EF37D9 100%)',
                  marginInlineEnd: '8px',
                  fontSize: '24px',
                  cursor: 'pointer',
                  width: 24,
                }}
                onClick={() => navigate('/IncidentManagement/IncidentApproval')}
              />

              <StyledTypography
                fontSize="20px"
                fontWeight="600"
                lineHeight="24px"
                textAlign="left"
                color="#205475"
              >
                {t('MM_IncidentApproval')}
              </StyledTypography>
            </FlexContainer>

            <StyledImage
              height="40px"
              width="40px"
              gap="10px"
              cursor="pointer"
              borderRadius="40px"
              src={PrintFileIcon}
              alt="Print"
              animate={true}
            />
          </FlexContainer>
          <Accordion
            sx={{
              borderColor: '#3498db',
              marginBottom: '10px',
              border: '1px solid #3498db',
              borderRadius: '8px 8px 0px 0px',
            }}
            expanded={true}
          >
            <AccordionSummary
              // expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                backgroundColor: '#3498db',
                width: '100%',
              }}
            >
              <StyledTypography
                fontSize="16px"
                fontWeight="700"
                lineHeight="20px"
                textAlign="center"
                color="#FFFFFF"
                border={'1px solid #3498db'}
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
                    <Label bold value={'Facility Name'} />
                    <ReadOnlyText> Apollo - Chennai</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Branch Name'} />
                    <ReadOnlyText> Dubai</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Incident No'} />
                    <ReadOnlyText> NRC-IR-22062024-001</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Be Anonymous'} />
                    <ReadOnlyText> Yes</ReadOnlyText>
                  </StyledGridItem>

                  {/* Row 2 */}
                  <StyledGridItem>
                    <Label bold value={'Incident Date'} />
                    <ReadOnlyText> 01-03-2024</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Incident Day'} />
                    <ReadOnlyText> Friday</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Incident Time'} />
                    <ReadOnlyText> 23:30</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Reported Date'} />
                    <ReadOnlyText> 22-06-2024</ReadOnlyText>
                  </StyledGridItem>

                  {/* Row 3 */}
                  <StyledGridItem>
                    <Label bold value={'Reported Day'} />
                    <ReadOnlyText> Sunday</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Reported Time'} />
                    <ReadOnlyText> 00:58</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Incident Type'} />
                    <ReadOnlyText> Adverse Event</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Clinical/Non Clinical'} />
                    <ReadOnlyText> Clinical</ReadOnlyText>
                  </StyledGridItem>
                </StyledGridContainer>

                {/* Incident Title */}
                <Box
                  style={{
                    fontWeight: '600',
                    fontSize: '16px',
                    lineHeight: '19.2px',
                    padding: '0 20px'
                  }}
                >
                  Incident Title
                </Box>
                <StyledGridContainer>
                  <StyledGridItem>
                    <Label bold value={'Incident Main Category'} />
                    <ReadOnlyText> Infection Control</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Incident Details'} />
                    <ReadOnlyText> Needle Stick</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Remarks'} />
                    <ReadOnlyText> - </ReadOnlyText>
                  </StyledGridItem>

                  <StyledGridItem>
                    <Label bold value={'Brief Description of Incident'} />
                    <ReadOnlyText> Old needle stick</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Immediate Action Taken'} />
                    <ReadOnlyText>need a action quickly</ReadOnlyText>
                  </StyledGridItem>
                </StyledGridContainer>
                <FlexContainer flexDirection="column">
                  <Label bold value={'Immediate Action Taken'} />
                  <IncidentDetailTable />
                </FlexContainer>
                <StyledGridContainer>
                  <StyledGridItem>
                    <Label bold value={'Incident Department'} />
                    <ReadOnlyText> Admission</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Location Details (Room no etc)'} />
                    <ReadOnlyText>Not Applicable</ReadOnlyText>
                  </StyledGridItem>
                </StyledGridContainer>

                <Box
                  style={{
                    fontWeight: '600',
                    fontSize: '16px',
                    lineHeight: '19.2px',
                    margin: '10px 0px 10px 0px',
                    padding: '0 20px'
                  }}
                >
                  Person Involved in the Incident
                </Box>
                <FlexContainer flexDirection="column" margin="10px 0">
                  <Label bold value={'Staff(s):'} />
                  <IncidentDetailTable />
                </FlexContainer>
                <FlexContainer flexDirection="column" margin="10px 0">
                  <Label bold value={'Attachment(s):'} />
                  <AttachmentTable />
                </FlexContainer>
                <StyledGridContainer>
                  <StyledGridItem>
                    <Label bold value={'Harm Level '} />
                    <ReadOnlyText> Moderate</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label
                      bold
                      value={'Any additional staff you wish to be notified?'}
                    />
                    <ReadOnlyText>No</ReadOnlyText>
                  </StyledGridItem>
                </StyledGridContainer>
              </FlexContainer>
            </FormContainer>
          </Accordion>

          {/* Incident Approval Detail Section */}

          <Accordion
            sx={{
              marginBottom: '10px',
              border: '1px solid  #406883',
              borderRadius: '8px 8px 0px 0px',
            }}
            expanded={true}
          >
            <AccordionSummary
              // expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                backgroundColor: '#406883',
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
                Incident Approval Details
              </StyledTypography>
            </AccordionSummary>
            <FormContainer style={{ marginBottom: '20px' }}>
              <FlexContainer flexDirection={'column'}>
                {/* <SectionHeader>Incident Approval Entry</SectionHeader> */}
                <StyledGridContainer>
                  <StyledGridItem>
                    <Label bold value={'Incident Main Category'} />
                    <ReadOnlyText> Accommodation related issues</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Incident Details'} />
                    <ReadOnlyText> Delay of Housing Maintenance</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Incident Type'} />
                    <ReadOnlyText> Near Miss </ReadOnlyText>
                  </StyledGridItem>

                  <StyledGridItem>
                    <Label bold value={'Clinical/Non Clinical'} />
                    <ReadOnlyText> Clinical</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Incident Department'} />
                    <ReadOnlyText>Cath Lab</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Location Details (Room no etc)'} />
                    <ReadOnlyText>Not Applicable</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Harm Level'} />
                    <ReadOnlyText>No Harm</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label
                      bold
                      value={'Any additional staff you wish to be notified?'}
                    />
                    <ReadOnlyText>No</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Approval Status'} />
                    <ReadOnlyText>Assigned</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Approved By'} />
                    <ReadOnlyText>Dr. Sujitha</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Approval Remarks'} />
                    <ReadOnlyText>Not Applicable</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Approved Time'} />
                    <ReadOnlyText>12:32</ReadOnlyText>
                  </StyledGridItem>
                  <StyledGridItem>
                    <Label bold value={'Department/Speciality'} />
                    <ReadOnlyText>Cardiology</ReadOnlyText>
                  </StyledGridItem>
                </StyledGridContainer>
                <FlexContainer flexDirection="column" margin="10px 0">
                  <Label bold value={'Assigned Investigator(s)'} />
                  <AssignedInvestorTable />
                </FlexContainer>
              </FlexContainer>
            </FormContainer>
          </Accordion>

          {/* Approve Incident and Assign Values*/}

          <Accordion
            sx={{
              border: '1px solid  #e16d2a',
              borderRadius: '8px 8px 0px 0px',
              marginBottom: '10px',
            }}
            expanded={true}
          >
            <AccordionSummary
              // expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                backgroundColor: '#e16d2a',
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
                Rejected by Investigator(s)
              </StyledTypography>
            </AccordionSummary>
            <FormContainer style={{ marginBottom: '20px' }}>
              <FlexContainer flexDirection={'column'}>
                <RejectedByInvestorTable />
              </FlexContainer>
              {/* Action Buttons */}

              <FlexContainer padding="10px" justifyContent="center" gap="20px">
                <ActionButton
                  style={{ backgroundColor: 'rgba(0, 131, 192, 1)' }}
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
                      src={SubmitTik}
                      style={{
                        marginBottom: '1px',
                        marginInlineEnd: 8,
                        color: '#FFFFFF',
                      }}
                    />
                  }
                >
                  <StyledTypography
                    textTransform="none"
                    marginTop="1px"
                    color="#ffff"
                  >
                    Submit
                  </StyledTypography>
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
            </FormContainer>
          </Accordion>
        </Box>
      </FlexContainer>
    </FlexContainer>
  );
};

export default RejectDetail;
