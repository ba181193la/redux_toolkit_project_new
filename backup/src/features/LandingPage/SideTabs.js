import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { FlexContainer, StyledTypography } from '../../utils/StyledComponents';
import useWindowDimension from '../../hooks/useWindowDimension';

const SideTabs = ({ handleChangeMenuList }) => {
  const { i18n, t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);
  const { isMobile } = useWindowDimension();
  const [menuTab, setMenuTab] = useState([])
  const {
    menuDetails
  } = useSelector((state) => state.auth);
  useEffect(() => {
    if (menuDetails?.length > 0) {
      const filteredMenus = menuDetails?.filter(menu => menu.ParentMenuId === null);
      setMenuTab(filteredMenus)
    }
  }, [menuDetails])
  return (

    <FlexContainer
      backgroundColor="#FAFAFA"
      width={isMobile?"100%":"30%"}
      // height={isMobile?"30%":"100%"}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="10px"
      padding="15px 10px"
      // maxHeight="100%"
    >
      {menuTab?.map((tab, index) => (
        <StyledTypography
          key={index}
          // border={selectedTab===index? "1px solid rgb(223, 230, 237)":"none"}
          backgroundColor={selectedTab===index? "#0083c0":""}  
          border={`1px solid ${selectedTab === index ? '#fff' : '#0083c0'}`}
          width={"100%"}
          padding={"7px 5px"}
          // height={isMobile?"65px": "40px"}
          textAlign={"center"}
          borderRadius={"10px 10px 10px 10px"}
          onClick={() => {
            setSelectedTab(index)
            handleChangeMenuList(tab.MenuName)
          }}
          color={selectedTab === index ? '#fff' : '#0083c0'}
          sx={{  cursor:"pointer"        }}
        >
          {i18n?.language === 'en'
            ? tab.FieldEnglishLabel
            : tab.FieldArabicLabel}
        </StyledTypography>
      ))}

    </FlexContainer>
  );
};

export default SideTabs;
