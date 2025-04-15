import React, { useEffect, useState } from 'react';
import { Tabs, Grid, useMediaQuery } from '@mui/material';
import {
  FlexContainer,
  StyledImage,
  StyledTab,
  StyledTypography,
} from '../../../utils/StyledComponents';
import PendingIcon from '../../../assets/Icons/2XPendingIcon.png';
import CompletedIcon from '../../../assets/Icons/2XCompletedIcon.png';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import { useTranslation } from 'react-i18next';
import InvestigationPendingList from '../IncidentInvestigationApproval/PendingList/InvestigationPendingList';
import InvestigationCompletedList from '../IncidentInvestigationApproval/CompletedList/InvestigationCompletedList';
import TabPanel from '../../../components/Tabpanel/Tabpanel';
import { useSelector } from 'react-redux';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../redux/RTK/moduleDataApi';
import { useGetPageLoadDataQuery } from '../../../redux/RTK/IncidentManagement/incidentInvestigationApprovalApi';
import { saveAs } from 'file-saver';
import styled from 'styled-components';

const StyledFlexContainer = styled(FlexContainer)`
  flex-direction: row;
  border-radius: 15px;
  width: 100%;
  height: 90px;
  justify-content: space-evenly;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  box-shadow: 0px 4px 4px 0px #00000040 !important;

  &:hover {
    transform: scale(1.05) !important;
    transition: transform 0.3s ease !important;
  }
`;

const IncidentInvestigationApproval = () => {
  //* Hooks declatrion
  const { t } = useTranslation();
  const isSmallScreen = useMediaQuery('(max-width:600px)');

  //* Selectors
  const {
    selectedMenu,
    userDetails,
    regionCode,
    selectedModuleId,
    selectedFacility,
  } = useSelector((state) => state.auth);

  //* State varibales
  const [labelStatus, setLabelStatus] = useState('');

  //* RTK Queries
  const { data: labels = [], isFetching: labelsFetching } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: 2,
    // moduleId: selectedModuleId,
  });

  const { data: fieldAccess = [], isFetching: accessFetching } =
    useGetFieldsQuery({
      menuId: selectedMenu?.id,
      moduleId: 2,
      // moduleId: selectedModuleId,
    });

  const { data: investigationApprovalData, isFetching: fetchingData } =
    useGetPageLoadDataQuery({
      // moduleId: selectedModuleId ,
      moduleId: 2,
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
      facilityId: selectedFacility?.id,
    });

  //* State variables
  const [tabValue, setTabValue] = useState(0);
  const [fieldLabels, setFieldLabels] = useState([]);
  const [pageFields, setPageFields] = useState([]);
  const [searchFields, setSearchFields] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  //* Field access checking
  useEffect(() => {
    if (fieldAccess?.Data) {
      const allFieldsData = fieldAccess?.Data?.Menus?.find(
        (section) => section?.MenuId === selectedMenu?.id
      );

      const pageFields = allFieldsData?.Sections?.find(
        (section) => section.SectionName === 'Page'
      );

      const searchFields = allFieldsData?.Sections?.find(
        (section) => section.SectionName === 'Search'
      );

      if (pageFields) {
        const allFields =
          pageFields?.Regions.find((region) => region?.RegionCode === 'ALL')
            ?.Fields || [];
        const regionBasedFields =
          regionCode === 'ABD'
            ? pageFields?.Regions.find((region) => region?.RegionCode === 'ABD')
                ?.Fields || []
            : [];
        const combinedFields =
          regionBasedFields.length > 0
            ? [...allFields, ...regionBasedFields]
            : allFields;

        setPageFields(combinedFields);
      }
      if (searchFields) {
        const allFields =
          searchFields?.Regions.find((region) => region?.RegionCode === 'ALL')
            ?.Fields || [];
        const regionBasedFields = regionCode === 'ABD';
        searchFields?.Regions.find((region) => region?.RegionCode === 'ABD')
          ?.Fields || [];
        const combinedFields =
          regionBasedFields.length > 0
            ? [...allFields, ...regionBasedFields]
            : allFields;
        setSearchFields(combinedFields);
      }
    }
  }, [fieldAccess, regionCode]);

  //* Use Effects to bind values
  useEffect(() => {
    if (labels?.Data) {
      setLabelStatus(labels?.Status);
      const filteredLabels = labels?.Data?.find(
        (x) => x.MenuId === selectedMenu?.id
      )?.Regions;

      const allLabels =
        filteredLabels?.find((x) => x.RegionCode === 'ALL')?.Labels || [];

      const regionBasedLabels =
        regionCode === 'ABD'
          ? filteredLabels?.find((x) => x.RegionCode === 'ABD')?.Labels || []
          : [];
      const combinedLabels =
        regionBasedLabels.length > 0
          ? [...allLabels, ...regionBasedLabels]
          : allLabels;
      setFieldLabels(combinedLabels);
    }
  }, [labels, regionCode]);

  return (
    <FlexContainer width="100%" flexDirection="column" height="auto">
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
          {t('IM_IncidentInvestigationApproval')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer
        width="100%"
        height="100%"
        flex="1"
        flexDirection="column"
        style={{ backgroundColor: '#ffffff' }}
      >
        <FlexContainer
          style={{
            backgroundColor: '#ffffff',
            flexDirection: 'column',
            padding: '15px',
            height: '100%',
            borderRadius: '8px',
          }}
        >
          {fetchingData ? (
            <FlexContainer
              justifyContent="center"
              alignItems="center"
              height="70vh"
              width="100%"
              position="relative"
              style={{ top: '0', left: '0' }}
            >
              <StyledImage src={LoadingGif} alt="LoadingGif" />
            </FlexContainer>
          ) : (
            <>
              <FlexContainer justifyContent="center" alignItems="center">
                <Grid
                  container
                  display={'flex'}
                  flexWrap={'wrap'}
                  justifyContent={'center'}
                  item
                  xs={12}
                  spacing={2}
                  alignItems={'center'}
                  marginTop={'5px'}
                >
                  <Grid item xs={12} sm={12} md={4} lg={2}>
                    <StyledFlexContainer
                      style={{
                        display: 'flex',
                        backgroundColor: '#d81010',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      <FlexContainer
                        style={{
                          backgroundColor: '#b50e0e',
                          flex: '1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                        }}
                      >
                        <i
                          className="fa fa-chart-line dashicon"
                          style={{
                            fontSize: '24px',
                            color: '#ffffff',
                          }}
                        ></i>
                      </FlexContainer>
                      <FlexContainer
                        style={{
                          flex: '2',
                          padding: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          color: '#ffffff',
                        }}
                      >
                        <FlexContainer style={{ fontSize: '18px' }}>
                          {investigationApprovalData?.Records?.Pending}
                        </FlexContainer>
                        <FlexContainer
                          style={{ fontWeight: 'bold', fontSize: '16px' }}
                        >
                          {t('Pending')}
                        </FlexContainer>
                      </FlexContainer>
                    </StyledFlexContainer>
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} lg={2}>
                    <StyledFlexContainer
                      style={{
                        display: 'flex',
                        backgroundColor: '#7ed320',
                        borderRadius: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      <FlexContainer
                        style={{
                          backgroundColor: '#72bf1d',
                          flex: '1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                        }}
                      >
                        <i
                          className="fa fa-chart-pie dashicon"
                          style={{
                            fontSize: '24px',
                            color: '#ffffff',
                          }}
                        ></i>
                      </FlexContainer>
                      <FlexContainer
                        style={{
                          flex: '2',
                          padding: '10px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          color: '#ffffff',
                        }}
                      >
                        <FlexContainer style={{ fontSize: '18px' }}>
                          {investigationApprovalData?.Records?.Completed}
                        </FlexContainer>
                        <FlexContainer
                          style={{ fontWeight: 'bold', fontSize: '16px' }}
                        >
                          {t('Completed')}
                        </FlexContainer>
                      </FlexContainer>
                    </StyledFlexContainer>
                  </Grid>
                </Grid>
              </FlexContainer>

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
                  marginTop: '30px',
                }}
              >
                <StyledTab label={t('Pending')}></StyledTab>
                <StyledTab label={t('Completed')}></StyledTab>
              </Tabs>
              <TabPanel value={tabValue} index={0}>
                <InvestigationPendingList
                  labelStatus={labelStatus}
                  fieldLabels={fieldLabels}
                  pageFields={pageFields}
                  searchFields={searchFields}
                  pageLoadData={investigationApprovalData}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <InvestigationCompletedList
                  labelStatus={labelStatus}
                  fieldLabels={fieldLabels}
                  pageFields={pageFields}
                  searchFields={searchFields}
                  pageLoadData={investigationApprovalData}
                />
              </TabPanel>
            </>
          )}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default IncidentInvestigationApproval;
