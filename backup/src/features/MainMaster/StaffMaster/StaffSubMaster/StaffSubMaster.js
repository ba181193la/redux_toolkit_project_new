import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlexContainer,
  StyledTab,
  StyledTypography,
} from '../../../../utils/StyledComponents';

import BackArrowGif from '../../../../assets/Gifs/BackArrowGif.gif';

import { Divider, Grid, Tabs, Tooltip, useMediaQuery } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import EmploymentTypeList from './EmploymentTypeList';
import StaffCategoryList from './StaffCategoryList';
import PhysicianLevelList from './PhysicianLevelList';
import EmployeeSubTypeList from './EmployeeSubTypeList';
import { useGetPageLoadDataQuery } from '../../../../redux/RTK/staffMasterApi';
import { useSelector } from 'react-redux';
import { getlabel } from '../../../../utils/language';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import TabPanel from '../../../../components/Tabpanel/Tabpanel';

const StaffSubMaster = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  const [tabValue, setTabValue] = useState(0);
  const [facilityList, setFacilityList] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const isSmallScreen = useMediaQuery('(max-width:600px)');

  const {
    selectedMenu,
    userDetails,
    selectedFacility,
    selectedModuleId,
    isSuperAdmin,
    roleFacilities,
  } = useSelector((state) => state.auth);

  const { data: pageLoadData } = useGetPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const { data: labels = [] } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  const { data: fields = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  useEffect(() => {
    setFacilityList(
      pageLoadData?.Data?.FacilityList?.filter((facility) => {
        if (isSuperAdmin) return true;
        const facilityItem = roleFacilities?.find(
          (role) => role.FacilityId === facility.FacilityId
        )?.Menu?.[selectedMenu?.id];
        return facilityItem?.IsAdd;
      }).map((facility) => ({
        text: facility.FacilityName,
        value: facility.FacilityId,
      }))
    );
  }, [pageLoadData]);

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
          sx={{
            fontSize: {
              xs: '1.5rem',
              sm: '1.75rem',
              md: '2rem',
              lg: '2.25rem',
            },
          }}
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('MM_SM_SubMaster')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer
        width="100%"
        height="auto"
        flex="1"
        flexDirection="column"
        style={{
          backgroundColor: '#ffffff',
          padding: '20px',
          borderRadius: '10px',
        }}
      >
        <FlexContainer alignItems="center" width="100%">
          <FlexContainer>
            <Tooltip title="Go back" arrow>
              <button
                style={{
                  backgroundColor: 'rgb(52 152 219)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '8px 16px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px',
                  display: 'block',
                  fontSize: '13px',
                }}
                onClick={() => navigate('/MainMaster/StaffMaster')}
              >
                <span
                  style={{ marginRight: '4px', fontSize: '12px' }}
                >{`<<`}</span>{' '}
                Previous
              </button>
            </Tooltip>
          </FlexContainer>

          <StyledTypography
            fontSize="20px"
            fontWeight="600"
            lineHeight="24px"
            textAlign="left"
            color="#205475"
          >
            {t('MM_SM_SubMaster')}
          </StyledTypography>
        </FlexContainer>
        <Divider
          sx={{
            marginY: '20px',
            height: '2px',
            width: '100%',
            backgroundColor: '#205475',
            border: 'none',
          }}
        />
        <FlexContainer
          display="flex"
          flexDirection={isSmallScreen ? 'column' : 'row'}
          justifyContent="space-between"
          width="100%"
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={2}
            display="flex"
            flexDirection="column"
            backgroundColor="#eef1f6"
            padding={isSmallScreen ? '10px' : '0'}
            marginBottom={isSmallScreen ? '20px' : '0'}
            flexGrow={0.5}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="secondary"
              textColor="inherit"
              variant="fullWidth"
              orientation={isSmallScreen ? 'horizontal' : 'vertical'}
              aria-label="full width tabs example"
              sx={{
                '& .MuiTabs-flexContainer': {
                  flexWrap: 'wrap',
                  backgroundColor: 'transparent',
                },
                '& .MuiTabs-indicator': {
                  display: 'none',
                },
                flexDirection: isSmallScreen ? 'row' : 'column',
              }}
            >
              <StyledTab
                label={getlabel('MM_SM_EmploymentType', labels, i18n.language)}
                fontSize="1rem"
                sx={{
                  whiteSpace: isSmallScreen ? 'normal' : 'nowrap',
                  textAlign: 'center',
                }}
              />
              <StyledTab
                label={getlabel('MM_SM_StaffCategory', labels, i18n.language)}
                fontSize="1rem"
                sx={{
                  whiteSpace: isSmallScreen ? 'normal' : 'nowrap',
                  textAlign: 'center',
                }}
              />
              <StyledTab
                label={getlabel('MM_SM_Physicianlevel', labels, i18n.language)}
                fontSize="1rem"
                sx={{
                  whiteSpace: isSmallScreen ? 'normal' : 'nowrap',
                  textAlign: 'center',
                }}
              />
              <StyledTab
                label={getlabel('MM_SM_EmployeeSubtype', labels, i18n.language)}
                fontSize="1rem"
                sx={{
                  whiteSpace: isSmallScreen ? 'normal' : 'nowrap',
                  textAlign: 'center',
                }}
              />
            </Tabs>
          </Grid>
          <Grid
            item
            xs={12}
            md={8}
            sm={12}
            sx={{
              margin: { xs: '0', sm: '10px 20px', md: '10px 50px' },
              overflow: 'auto',
            }}
          >
            <TabPanel value={tabValue} index={0}>
              <EmploymentTypeList fields={fields} facilityList={facilityList} tabs={1} />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <StaffCategoryList fields={fields} facilityList={facilityList} tabs={2}/>
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <PhysicianLevelList fields={fields} facilityList={facilityList} tabs={3}/>
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <EmployeeSubTypeList
                fields={fields}
                facilityList={facilityList}
                tabs={4}
              />
            </TabPanel>
          </Grid>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default StaffSubMaster;
