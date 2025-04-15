import React from 'react';
import { useEffect, useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import { useLocation } from 'react-router-dom';
import {
  FlexContainer,
  StyledTab,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { Box } from '@mui/system';
import { useTranslation } from 'react-i18next';
import Company from './Company/Company';
import Facility from './Facility/Facility';
import useWindowDimension from '../../../hooks/useWindowDimension';
import { useGetFieldsQuery } from '../../../redux/RTK/moduleDataApi';

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
      {value === index && <Box sx={{ paddingTop: '25px' }}>{children}</Box>}
    </div>
  );
};

const ContactInformationMaster = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [value, setValue] = useState(0);
  const { isMobile } = useWindowDimension();

  useEffect(() => {
    if (location.state?.activeTab === 'facility') {
      setValue(1);
    } else {
      setValue(0);
    }
  }, [location.state]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  };

  

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="space-between"
      padding={isMobile ? '15px' : '0'}
    >
      <FlexContainer
        marginBottom={isMobile ? '20px' : '0'}
        marginTop={isMobile ? '20px' : '0'}
        justifyContent={isMobile ? 'center' : 'space-between'}
        padding="0 0 15px 0"
      >
        <StyledTypography
          fontSize={isMobile ? '24px' : '36px'}
          fontWeight="900"
          lineHeight={isMobile ? '32px' : '44px'}
          color="#0083C0"
          textAlign={isMobile ? 'center' : 'left'}
          whiteSpace={isMobile ? 'wrap' : 'nowrap'}
        >
          {t('MM_ContactInformationMaster')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer width="100%" height="auto" flex="1" flexDirection="column">
        <FlexContainer
          height="100%"
          width="100%"
          padding="15px 15px 15px"
          borderRadius="8px"
          flexDirection="column"
          backgroundColor="#fff"
          boxShadow="0px 4px 4px 0px #00000029"
        >
          <Tabs
            value={value}
            onChange={handleChange}
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
            <StyledTab label={t('Company')} {...a11yProps(0)} />
            <StyledTab label={t('Facility')} {...a11yProps(1)} />
          </Tabs>
          <TabPanel value={value} index={0}>
            <Company/>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Facility />
          </TabPanel>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default ContactInformationMaster;
