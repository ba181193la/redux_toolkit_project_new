import React, { useEffect, useState } from 'react';
import { Tabs, useMediaQuery } from '@mui/material';
import {
  FlexContainer,
  StyledTab,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import LocationTypesList from '../DepartmentMaster/LocationType/LocationTypesList';
import DepartmentList from './Department/DepartmentList';
import DesignationList from './Designation/DesignationList';
import { getlabel } from '../../../utils/language';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../redux/RTK/moduleDataApi';
import { useSelector } from 'react-redux';
import TabPanel from '../../../components/Tabpanel/Tabpanel';
import { useLocation } from 'react-router-dom';

const DepartmentMaster = () => {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const [tabValue, setTabValue] = useState(0);

  const { selectedMenu, selectedModuleId } = useSelector((state) => state.auth);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const { data: labels = [] } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  const { data: fields = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  useEffect(() => {
    if (location.state?.activeTab === 'Location Type') {
      setTabValue(0);
    } else if (location.state?.activeTab === 'Department') {
      setTabValue(1);
    } else if (location.state?.activeTab === 'Designation') {
      setTabValue(2);
    }
  }, [location.state]);

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
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
          sx={{
            fontSize: {
              xs: '1.5rem',
              sm: '1.75rem',
              md: '2rem',
              lg: '2.25rem',
            },
          }}
        >
          {t('MM_DepartmentMaster')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer
        width="100%"
        height="auto"
        flex="1"
        flexDirection="column"
        style={{ backgroundColor: '#ffffff', borderRadius: '10px' }}
      >
        <FlexContainer
          width="100%"
          height="auto"
          flex="1"
          flexDirection="column"
          padding="2rem"
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
            orientation={isSmallScreen ? 'vertical' : 'horizontal'}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <StyledTab
              label={getlabel('MM_DM_LocationType', labels, i18n.language)}
            ></StyledTab>
            <StyledTab
              label={getlabel('MM_DM_Department', labels, i18n.language)}
            ></StyledTab>
            <StyledTab label={t('Designation')}></StyledTab>
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <LocationTypesList fields={fields} tabs={1} />
          </TabPanel>
          <TabPanel value={tabValue} index={1} >
            <DepartmentList fields={fields}  tabs={2}/>
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <DesignationList fields={fields} tabs={3}/>
          </TabPanel>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default DepartmentMaster;
