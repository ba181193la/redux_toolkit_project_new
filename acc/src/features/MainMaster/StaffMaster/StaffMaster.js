import React, { useState } from 'react';
import {
  FlexContainer,
  StyledTab,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import { Tabs } from '@mui/material';
import StaffList from './StaffList/StaffList';
import StaffUnlock from './StaffUnlock/StaffUnlock';
import { useSelector } from 'react-redux';
import TabPanel from '../../../components/Tabpanel/Tabpanel';

const StaffMaster = () => {
  const { i18n, t } = useTranslation();
  const [value, setValue] = useState(0);

  const { isSuperAdmin } = useSelector((state) => state.auth);

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
    >
      <FlexContainer
        justifyContent={'space-between'}
        style={{ paddingBottom: '15px' }}
      >
        <StyledTypography
          fontSize="36px"
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('MM_StaffMaster')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer width="100%" height="auto" flex="1" flexDirection="column">
        <FlexContainer
          height="100%"
          width="100%"
          padding="15px 15px 0"
          borderRadius="8px"
          flexDirection="column"
          backgroundColor="#fff"
          boxShadow="0px 4px 4px 0px #00000029"
          gap="15px"
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
            <StyledTab
              label={i18n.language === 'ar' ? t('StaffList') : 'Staff List'}
              {...a11yProps(0)}
            />
            <StyledTab
              disabled={!isSuperAdmin}
              label={i18n.language === 'ar' ? t('StaffUnlock') : 'Staff Unlock'}
              {...a11yProps(1)}
            />
          </Tabs>
          <TabPanel value={value} index={0}>
            <StaffList />
          </TabPanel>
          <TabPanel value={value} index={1} style={{ height: '100%' }}>
            <StaffUnlock />
          </TabPanel>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default StaffMaster;
