import React, { useState } from 'react';
import {
  FlexContainer,
  StyledTab,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import { Tabs, Box } from '@mui/material';
import InvestigationPending from './InvestigationPending/InvestigationPending';
import InvestigationCompleted from './InvestigationCompleted/InvestigationCompleted';
import InvestigationRejected from './InvestigationRejected/InvestigationRejected';
import IncidentMetrics from './IncidentMetrics/IncidentMetrics';
import TabPanel from '../../../components/Tabpanel/Tabpanel';
import useWindowDimension from '../../../hooks/useWindowDimension';
import {
  resetFilters
} from '../../../redux/features/mainMaster/incidentInvestigationSlice';
import { useDispatch } from 'react-redux';

const IncidentInvestigation = () => {
  const { t } = useTranslation();
  const { isMobile } = useWindowDimension();
  const dispatch = useDispatch();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
     dispatch(resetFilters());
  };

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="space-between"
    >
      <FlexContainer
        justifyContent={'space-between'}
        style={{ paddingBottom: '15px' }}
      >
        <StyledTypography
          fontSize={isMobile ? '24px' : '36px'}
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('IM_IncidentInvestigation')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer width="100%" height="auto" flex="1" flexDirection="column">
        <FlexContainer
          width="100%"
          height="auto"
          flex="1"
          flexDirection="column"
        >
          <FlexContainer
            height="100%"
            width="100%"
            padding="15px 15px 0"
            backgroundColor="#fff"
            boxShadow="0px 4px 4px 0px #00000029"
            justifyContent="space-between"
          >
            <IncidentMetrics />
          </FlexContainer>
        </FlexContainer>

        <FlexContainer
          height="100%"
          width="100%"
          padding="35px 15px 0"
          flexDirection="column"
          backgroundColor="#fff"
          boxShadow="0px 4px 4px 0px #00000029"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            orientation={isMobile ? 'vertical' : 'horizontal'}
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
            <StyledTab label={t('PendingList')} />
            <StyledTab label={t('CompletedList')} />
            <StyledTab label={t('RejectedList')} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <InvestigationPending />
          </TabPanel>
          <TabPanel value={value} index={1} style={{ height: '100%' }}>
            <InvestigationCompleted />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <InvestigationRejected />
          </TabPanel>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};
export default IncidentInvestigation;
