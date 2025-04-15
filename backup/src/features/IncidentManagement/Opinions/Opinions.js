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
// import PendingList from './PendingList/PendingList';
// import CompletedList from './CompletedList/CompletedList';
// import RejectedList from './RejectedList/RejectedList';

import OpinionMetrics from './OpinionMetrics/OpinionMetrics';
import TabPanel from '../../../components/Tabpanel/Tabpanel';
import PendingList from './PendingList/PendingList';
import CompletedList from './CompletedList/CompletedList';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);
const ApprovalList = () => {
  const { t } = useTranslation();
 
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
          fontSize="30px"
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t("IM_Opinions")}
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
          <OpinionMetrics />

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
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <PendingList />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <CompletedList />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            {/* <RejectedList /> */}
          </TabPanel>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default ApprovalList;
