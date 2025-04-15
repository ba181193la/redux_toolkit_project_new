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
import { useSelector } from 'react-redux';
import TabPanel from '../../../components/Tabpanel/Tabpanel';
import SubmittedByMe from './SubmittedByMe/SubmittedByMe';
import IncidentMetrics from '../IncidentApproval/IncidentMetrics/IncidentMetrics';
import AllIncident from './AllIncident/AllIncident';
import DeletedIncident from './DeletedIncident/DeletedIncident';
import { useDispatch } from 'react-redux';
import {
  resetFilters
} from '../../../redux/features/mainMaster/searchIncidentSlice';
import { useGetTabAccessRightsQuery } from '../../../redux/RTK/IncidentManagement/searchIncidentApi'

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);
const SearchIncident = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
         dispatch(resetFilters());
    
  };

  const {
    selectedMenu,
    userDetails,
    selectedFacility,
    selectedModuleId,
    roleFacilities,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

  const { data: TabAccessData } = useGetTabAccessRightsQuery(
    {
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
      facilityId: selectedFacility?.id,
      moduleId: selectedModuleId,
    },
  );


  console.log("access",TabAccessData)
  
  const Table = TabAccessData?.Data?.Result?.RightsDetail?.Table || [];
  console.log("TabAccess",Table[0])

  // const IsDetailView = Table[0]?.IsDetailView;
  // const IsListView = Table[0]?.IsListView;

  const IsDetailView = true;
  const IsListView = true
  
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
          {t('MM_SearchIncident')}
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
          {/* <IncidentMetrics /> */}

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
            <StyledTab label="Submitted By Me"></StyledTab>
            {IsListView && <StyledTab  label="All Incident (s)"></StyledTab>}
            <StyledTab label="Deleted Incident (s)"></StyledTab>
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <SubmittedByMe isView = {IsDetailView}/>
          </TabPanel>
          {
            IsListView &&
          <TabPanel value={tabValue} index={1}>
            <AllIncident isView = {IsDetailView}/>
          </TabPanel>

          }
         <TabPanel value={tabValue} index={Table[0]?.IsListView ? 2 : 1}>
      <DeletedIncident isView = {IsDetailView}/>
    </TabPanel>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default SearchIncident;
