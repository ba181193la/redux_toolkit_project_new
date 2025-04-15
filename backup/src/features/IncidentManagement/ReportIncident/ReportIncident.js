import React, { useEffect, useState } from 'react';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTab,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { Tabs } from '@mui/material';
import IncidentToBeReSubmit from './Tabs/IncidentToBeReSubmit';
import SavedIncident from './Tabs/SavedIncident';
import { useTranslation } from 'react-i18next';
import TabPanel from '../../../components/Tabpanel/Tabpanel';
import useWindowDimension from '../../../hooks/useWindowDimension';
import AddIcon from '../../../assets/Icons/AddSubMaster.png';
import { useSelector } from 'react-redux';
import { useGetLabelsQuery } from '../../../redux/RTK/moduleDataApi';
import { useNavigate } from 'react-router-dom';

export default function ReportIncident() {
  const { t } = useTranslation();
  const { isMobile } = useWindowDimension();
  const navigate = useNavigate()

  const [tabValue, setTabValue] = useState(0);
  const [labels, setLabels] = useState([]);

  const { selectedMenu, selectedModuleId, regionCode } = useSelector(
    (state) => state.auth
  );

  const { data: labelsData = [] } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  useEffect(() => {
    const abdLabels =
      labelsData?.Data?.[0]?.Regions?.find((i) => i.RegionCode === 'ABD')
        ?.Labels || [];
    const allRegion =
      labelsData?.Data?.[0]?.Regions?.find(
        (region) => region.RegionCode === 'ALL'
      )?.Labels || [];
    if (regionCode === 'ABD') {
      setLabels([...abdLabels, ...allRegion]);
    } else if (regionCode === 'ALL') {
      setLabels(allRegion);
    }
  }, [labelsData, regionCode]);

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
          fontSize={isMobile ? '24px' : '30px'}
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('IM_ReportIncident')}
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
          <FlexContainer
            justifyContent={isMobile ? 'space-between' : 'end'}
            padding={isMobile ? '0 0px 10px 0' : '0 0px 20px 0'}
            gap="10px"
          >
            <StyledButton
              variant="contained"
              color="success"
              padding={isMobile ? '6px 10px' : '6px 16px'}
              startIcon={
                <StyledImage
                  height="14px"
                  width="14px"
                  src={AddIcon}
                  alt="Add New Icon"
                  style={{ marginInlineEnd: 8 }}
                />
              }
              onClick={() => {
                // window.location.href(
                //   `/IncidentManagement/ReportIncident/ReportNewIncident?menuId=${selectedMenu?.id}`
                // );
                navigate(`/IncidentManagement/ReportIncident/ReportNewIncident?menuId=${selectedMenu?.id}`)
              }}
            >
              Report New Incident
            </StyledButton>
          </FlexContainer>
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
            <StyledTab label="Saved Incident"></StyledTab>
            <StyledTab label="Incident to be Re-Submit"></StyledTab>
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <SavedIncident labels={labels} />
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <IncidentToBeReSubmit labels={labels} />
          </TabPanel>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
}
