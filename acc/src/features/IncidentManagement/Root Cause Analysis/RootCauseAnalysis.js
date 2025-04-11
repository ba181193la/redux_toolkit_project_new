import React, { useState } from 'react';
import {
  Tabs,
  Box,
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
} from '@mui/material';
import {
  FlexContainer,
  StyledImage,
  StyledTab,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import PendingList from './PendingList/PendingList';
import CompletedList from './Completed/CompletedList';
import RejectedList from './Drafted/DraftedList';
import IncidentMetrics from './IncidentMetrics/IncidentMetrics';
import TabPanel from '../../../components/Tabpanel/Tabpanel';
import { useDispatch } from 'react-redux';
import { resetFilters } from '../../../redux/features/mainMaster/incidentRcaSlice';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);
const RootCauseAnalyses = () => {
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
        // marginTop={'65px'}
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
          {t('IM_RootCauseAnalysis')}
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
          style={{
            backgroundColor: '#ffffff',
            flexDirection: 'column',
            padding: '15px 15px 0px',
            height: '100%',
            borderRadius: '8px',
          }}
        >
          <IncidentMetrics />

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
            <StyledTab label="Pending List"></StyledTab>
            <StyledTab label="Completed List"></StyledTab>
            <StyledTab label="Drafted"></StyledTab>
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <PendingList />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <CompletedList />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <RejectedList />
          </TabPanel>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default RootCauseAnalyses;
