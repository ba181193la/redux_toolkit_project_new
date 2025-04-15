import React, { useState,useEffect, useRef } from 'react';
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
import CompletedList from './ActionCompleted/CompletedList';
import PendingApprovalList from './PendingApprovalList/PendingApprovalList';

import IncidentMetrics from './IncidentMetrics/IncidentMetrics';
import TabPanel from '../../../components/Tabpanel/Tabpanel';
import { useDispatch, useSelector } from 'react-redux';


const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);
const ActionList = () => {
  const { t } = useTranslation();

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const {
    userDetails,
  
  } = useSelector((state) => state.auth);
  console.log("userDetails")


  let IsListView = false;

  console.log('userDetails', userDetails);
  if (userDetails?.StaffCategoryName === 'module admin incident') {
    IsListView = true;
  }
  

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
          {t('IM_Actions')}
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
              <StyledTab label={t('PendingList')} />
              {userDetails?.StaffCategoryName === 'module admin incident' && (
                <StyledTab label="Approval Pending List" />
              )}
              <StyledTab label={t('CompletedList')} />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <PendingList />
            </TabPanel>

            {userDetails?.StaffCategoryName === 'module admin incident' && (
              <TabPanel value={tabValue} index={1}>
                <PendingApprovalList />
              </TabPanel>
            )}

            <TabPanel value={tabValue} index={IsListView ? 2 : 1}>
              <CompletedList />
            </TabPanel>
          </FlexContainer>


      </FlexContainer>
    </FlexContainer>
  );
};

export default ActionList;
