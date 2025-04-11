import React from 'react';
import {
  Box,
  Grid,
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
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import IncidentDetailTable from './IncidentDetailTable';
import PatientTable from './PatientTable';
import AssignedInvestorTable from './AssignedInvestorTable';
import AttachmentTable from './AttachmentTable';
import Label from '../../../../components/Label/Label';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';

// Styled Components
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

const ReadOnlyText = styled(StyledTypography)`
  font-weight: 300 !important;
  font-size: 12px !important;
`;

const CompletedActionPending = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <FlexContainer flexDirection="column" width="100%">
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

      <Box p={3} paddingTop={0} width={'100%'} backgroundColor="#fff">
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
              border={'1px solid #DA83C3'}
            >
              Incident Details
            </StyledTypography>
          </AccordionSummary>
          <FormContainer>
            <FlexContainer flexDirection={'column'}>
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
                  <ReadOnlyText> Security Related</ReadOnlyText>
                </StyledGridItem>
                <StyledGridItem>
                  <Label bold value={'Incident Sub Category'} />
                  <ReadOnlyText> General /Assault & Harassment</ReadOnlyText>
                </StyledGridItem>
                <StyledGridItem>
                  <Label bold value={'Incident Details'} />
                  <ReadOnlyText>
                    {' '}
                    Staff not wearing badges/Identification while in hospital
                    premises
                  </ReadOnlyText>
                </StyledGridItem>
                <StyledGridItem>
                  <Label bold value={'Remarks'} />
                  <ReadOnlyText> - </ReadOnlyText>
                </StyledGridItem>

                <StyledGridItem>
                  <Label bold value={'Brief Description of Incident'} />
                  <ReadOnlyText> As per hospital policy.</ReadOnlyText>
                </StyledGridItem>
                <StyledGridItem>
                  <Label bold value={'Immediate Action Taken'} />
                  <ReadOnlyText>Informed the INcharge.</ReadOnlyText>
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
              <FlexContainer flexDirection="column" margin="10px 0">
                <Label bold value={'Person Involved in the Incident'} />
                <IncidentDetailTable />
              </FlexContainer>
              <FlexContainer flexDirection="column" margin="10px 0">
                <Label bold value={'Staff(s):'} />
                <PatientTable />
              </FlexContainer>
              <FlexContainer flexDirection="column" margin="10px 0">
                <Label bold value={'Attachment(s) :'} />
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
            expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
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
      </Box>
    </FlexContainer>
  );
};

export default CompletedActionPending;
