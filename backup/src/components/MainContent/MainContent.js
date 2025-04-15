import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import CustomBreadcrumbs from '../../components/BreadCrumbs/BreadCrumbs';
import styled from 'styled-components';
import { FlexContainer } from '../../utils/StyledComponents';
import CustomScrollbars from '../CustomScrollbars/CustomScrollbars';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import LicenseWarning from '../LicenseWarning/LicenseWarning';
import useWindowDimension from '../../hooks/useWindowDimension';
import { useTranslation } from 'react-i18next';
import { setSelectedMenu } from '../../redux/features/auth/authSlice';

const RootContainer = styled.div`
  padding: 10px 25px;
  background-color: #eef1f6;
  height: 100%;
`;

const MainContent = () => {
  const { isMobile } = useWindowDimension();
  const { i18n } = useTranslation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPadding, setIsPadding] = useState(false);

  const { licenseDetails, menuDetails, isWarning } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(window.location.search);
  const menuId = queryParams.get('menuId');

  useEffect(() => {
    if (menuId) {
      const selectedVal = menuDetails?.find(
        (item) => item.MenuId.toString() === menuId
      );

      dispatch(
        setSelectedMenu({
          id: selectedVal.MenuId,
          name: selectedVal.MenuName,
        })
      );
    }
  }, [menuId]);

  const showContent = () => {
    if (isMobile) {
      return isSidebarCollapsed ? true : false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    setIsSidebarCollapsed(isMobile ? true : false);
  }, [isMobile]);
  const expiryDate = new Date(licenseDetails?.ExpiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    <FlexContainer
      className={i18n.language === 'ar' ? 'rtl' : ''}
      flexDirection={'column'}
      height={'100vh'}
    >
      <Header />
      <LicenseWarning
        licenseData={licenseDetails}
        expiryDate={expiryDate}
        today={today}
        setIsPadding={setIsPadding}
      />
      <FlexContainer flex={1} height={'calc(100% - 110px)'}>
        <Sidebar
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
        {showContent() && (
          <FlexContainer
            flexDirection="column"
            width={`calc(100% - ${isSidebarCollapsed ? (isMobile ? '50px' : '80px') : '280px'})`}
            style={{ backgroundColor: '#EEF1F6' }}
            padding={
              licenseDetails &&
              isPadding &&
              (!licenseDetails?.IsActive ||
                licenseDetails?.DaysToExpire <= 0) &&
              '90px 0 0 0'
            }
          >
            <CustomBreadcrumbs />
            <CustomScrollbars
              style={{ height: '100%' }}
              rtl={i18n.language === 'ar'}
            >
              <RootContainer>
                <Outlet />
              </RootContainer>
            </CustomScrollbars>
          </FlexContainer>
        )}
      </FlexContainer>
      <Footer />
    </FlexContainer>
  );
};

export default MainContent;
