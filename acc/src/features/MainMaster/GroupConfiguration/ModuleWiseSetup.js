import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';
import {
  FlexContainer,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import ModuleWiseSetupDataTable from './ModuleWiseSetupDataTable';
import useWindowDimension from '../../../hooks/useWindowDimension';

export default function ModuleWiseMasterSetup({ groupConfig, isEditable }) {
  const { t } = useTranslation();
  const { isMobile } = useWindowDimension();
  const GroupwiseMaster = groupConfig?.GroupwiseMaster;

  return (
    <Accordion
      sx={{ border: '5px', borderColor: '#0083C0', marginBottom: '16px' }}
    >
      <AccordionSummary
        aria-controls="panel4-content"
        id="panel4-header"
        sx={{
          backgroundColor: '#0083C0',
          borderRadius: '8px 8px 0px 0px',
          width: '100%',
          border: '1px solid #0083C0',
          gap: '24px',
        }}
      >
        <StyledTypography
          fontSize="16px"
          fontWeight="700"
          lineHeight="20px"
          textAlign="center"
          color="#FFFFFF"
        >
          {t('ModuleWiseMasterSetup')}
        </StyledTypography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          width: '100%',
          height: '100%',
          padding: '0px 0px 20px 0px',
          border: '1px solid #0083C0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <FlexContainer
          padding="15px"
          sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}
          overflow={isMobile ? 'auto' : 'visible'}
        >
          <ModuleWiseSetupDataTable
            records={GroupwiseMaster}
            isEditable={isEditable}
          />
        </FlexContainer>
      </AccordionDetails>
    </Accordion>
  );
}
