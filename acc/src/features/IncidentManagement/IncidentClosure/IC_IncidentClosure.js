import React, { useState } from 'react';
import {
  Tabs,
  Box,
} from '@mui/material';
import {
  FlexContainer,
  StyledTab,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import Completed from './Completed/Completed';
import Drafted from './Drafted/Drafted';
import IC_IncidentMetrics from './IncidentMetrics/IC_IncidentMetrics';
import IC_PendingPage from './Pending/IC_PendingPage';
import IC_CompletedPage from './Completed/IC_CompletedPage';
import IC_DraftedPage from './Drafted/IC_DraftedPage';
import ClosurePending from './Pending/FilterPending'
import FilterFormCompletedClosure from './Completed/FilterFormCompletedClosure';
import  ClosureCompleted  from './Completed/FilterCompleted'
import  ClosureDrafted  from './Drafted/FilterDrafted'
import { useDispatch } from 'react-redux';
import {resetFilters} from '../../../redux/features/mainMaster/incidentClosureSlice';


const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);
const IC_IncidentClosure = () => {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
        marginBottom={'30px'}
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
          {t('MM_IncidentClosure')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer
        width="100%"
        height="auto"
        flex="1"
        flexDirection="column"
        style={{ backgroundColor: '#ffffff' }}
      >
        <FlexContainer
          width="100%"
          height="auto"
          flex="1"
          flexDirection="column"
          padding="2rem"
        >
          <IC_IncidentMetrics />

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
            <StyledTab label={t('Pending')}></StyledTab>
            <StyledTab label={t('Completed')}></StyledTab>
            <StyledTab label={t('Rejected')}></StyledTab>
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            {/* <IC_PendingPage /> */}
            <ClosurePending />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <ClosureCompleted />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <ClosureDrafted />
          </TabPanel>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default IC_IncidentClosure;
