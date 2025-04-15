import React from 'react';
import { Box, Accordion, AccordionSummary } from '@mui/material';
import {
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import ArrowBackIcon from '../../../../assets/Icons/ArrowBackIcon.png';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import IC_Completed_ICE_IncidentDetails from './Accordion/IC_Completed_ICE_IncidentDetails';
import IC_Completed_ICE_IncidentApprovalDetails from './Accordion/IC_Completed_ICE_IncidentApprovalDetails';
import IC_Completed_ICE_IncidentClosure from './Accordion/IC_Completed_ICE_IncidentClosure';
import IC_Completed_ICE_IncidentInvestigation from './Accordion/IC_Completed_ICE_IncidentInvestigation';
import IC_Completed_ICE_IncidentRiskLevel from './Accordion/IC_Completed_ICE_IncidentRiskLevel';

const IC_Completed_ViewAction = () => {
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
        <Box p={3} paddingTop={0} width="100%">
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
                {t('IM_IncidentClosure')}
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
            <IC_Completed_ICE_IncidentDetails />
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
                Incident Approval Details
              </StyledTypography>
            </AccordionSummary>
            <IC_Completed_ICE_IncidentApprovalDetails />
          </Accordion>

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
                Incident Investigation
              </StyledTypography>
            </AccordionSummary>
            <IC_Completed_ICE_IncidentInvestigation />
          </Accordion>

          {/* Incident Investigation*/}
          <Accordion
            sx={{
              marginBottom: '10px',
              border: '1px solid  #BE86FF73',
              borderRadius: '8px 8px 0px 0px',
            }}
            expanded={true}
          >
            <AccordionSummary
              // expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
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
                Incident Closure
              </StyledTypography>
            </AccordionSummary>
            <IC_Completed_ICE_IncidentClosure />
          </Accordion>
          <Accordion
            sx={{
              marginBottom: '10px',
              border: '1px solid  #BE86FF73',
              borderRadius: '8px 8px 0px 0px',
            }}
            expanded={true}
          >
            <AccordionSummary
              // expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
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
                Incident Risk Level
              </StyledTypography>
            </AccordionSummary>
            <IC_Completed_ICE_IncidentRiskLevel />
          </Accordion>
        </Box>
      </FlexContainer>
    </FlexContainer>
  );
};

export default IC_Completed_ViewAction;
