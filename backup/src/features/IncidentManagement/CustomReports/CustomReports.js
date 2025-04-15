import React, { useEffect, useState } from 'react';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTab,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { Tabs } from '@mui/material';
import CustomReportDesigner from './Tabs/CustomReportDesigner';
import CustomReportViewer from './Tabs/CustomReportViewer';
import { useTranslation } from 'react-i18next';
import TabPanel from '../../../components/Tabpanel/Tabpanel';
import useWindowDimension from '../../../hooks/useWindowDimension';
import AddIcon from '../../../assets/Icons/AddSubMaster.png';
import { useSelector } from 'react-redux';
import { useGetLabelsQuery } from '../../../redux/RTK/moduleDataApi';
import { useNavigate } from 'react-router-dom';
import {
  useGetAllFacilitiesQuery,
} from '../../../redux/RTK/userAssignmentApi';

export const CustomReports = () => {
  const { t } = useTranslation();
  const { isMobile } = useWindowDimension();
  const navigate = useNavigate()

  const [tabValue, setTabValue] = useState(0);
  const [labels, setLabels] = useState([]);

  const { selectedModuleId, userDetails, selectedFacility, selectedMenu } = useSelector(
    (state) => state.auth
  );

  const { data: allFacilities = [] } = useGetAllFacilitiesQuery({
         payload: {
           pageIndex: 1,
           pageSize: 100,
           headerFacility: selectedFacility?.id,
           loginUserId: userDetails?.UserId,
           moduleId: selectedModuleId,
           menuId: selectedMenu?.id,
         },
       });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent=""
    >
      <FlexContainer
        justifyContent={'space-between'}
        style={{ paddingBottom: '' }}
      >
        <StyledTypography
          fontSize={isMobile ? '24px' : '30px'}
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          Custom Reports
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
          gap="15px"
        >
         
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
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
            <StyledTab label="Custom Report Designer"></StyledTab>
            <StyledTab label="Custom Report Viewer"></StyledTab>
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <CustomReportDesigner />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <CustomReportViewer allFacilities={allFacilities}/>
          </TabPanel>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
}
