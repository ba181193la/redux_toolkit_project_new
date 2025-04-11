import React, { useEffect, useState } from 'react';
import chroma from "chroma-js";
import {
  List,
  ListItem,
  ListItemText,
  Collapse,
  Menu,
  MenuItem,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import CustomScrollbars from '../CustomScrollbars/CustomScrollbars';
import { FlexContainer, StyledTypography } from '../../utils/StyledComponents';
import { changeThemeColor } from '../../utils/ChangeThemeColor'
import {
  CustomListItem,
  SelectedTabHighlight,
  SidebarIcon,
  DotTextWrapper,
  SidebarContainer,
  ArrowSymbol,
} from './Sidebar.styled';
import MainMasterIcon from '../../assets/Icons/blue/mainmaster.png';
import IncidentIcon from '../../assets/Icons/blue/incident.png';
import HomeIconWhite from '../../assets/Icons/white/home.png';
import HomeIconBlue from '../../assets/Icons/blue/home.png';
import MainMasterIconWhite from '../../assets/Icons/white/mainmaster.png';
import IncidentIconWhite from '../../assets/Icons/white/incident.png';
import ExpandLessIcon from '../../assets/Icons/blue/arrow.png';
import ExpandMoreIconWhite from '../../assets/Icons/white/arrow.png';
import SidebarBlueCollapseIcon from '../../assets/Icons/blue/collapse.png';
import SidebarWhiteCollapseIcon from '../../assets/Icons/white/collapse.png';
import { useDispatch, useSelector } from 'react-redux';
import {
  setOpenMenus,
  setSelectedMenu,
  setSelectedModuleId,
} from '../../redux/features/auth/authSlice';
import { useTranslation } from 'react-i18next';
import useWindowDimension from '../../hooks/useWindowDimension';

const iconMapping = {
  Home: HomeIconBlue,
  MainMaster: MainMasterIcon,
  IncidentManagement: IncidentIcon,
};

const iconMappingWhite = {
  Home: HomeIconWhite,
  MainMaster: MainMasterIconWhite,
  IncidentManagement: IncidentIconWhite,
};

const parseMenuData = (data, userDetails) => {
  const menuMap = {};
  const compareMenuOrder = (a, b) => {
    const splitAndMap = (str) => str.split('.').map(Number);

    const aParts = splitAndMap(a.MenuOrder);
    const bParts = splitAndMap(b.MenuOrder);
    return aParts.reduce((acc, part, idx) => {
      if (acc !== 0) return acc;
      const bPart = bParts[idx] || 0;
      return part - bPart;
    }, 0);
  };

  const sortedMenuItems = [...data].sort(compareMenuOrder);

  sortedMenuItems?.forEach((item) => {
    menuMap[item.MenuId] = { ...item, children: [] };
  });
  const menuTree = [];

  sortedMenuItems?.forEach((item, i) => {
    if (userDetails.StaffCategoryId !== 1 && item.MenuId === 35) {
      return;
    }

    if (item.ParentMenuId) {
      menuMap[item.ParentMenuId]?.children.push(menuMap[item.MenuId]);
    } else {
      menuTree.push(menuMap[item.MenuId]);
    }
  });

  return menuTree;
};

const Sidebar = ({ isSidebarCollapsed, setIsSidebarCollapsed }) => {
  const { isMobile } = useWindowDimension();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { userDetails } = useSelector((state) => state.auth);
  const { groupConfigData } = useSelector((state) => state.groupConfig);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVal, setSelectedVal] = useState(null);
  const [backgroundLightColor, setBackgroundLightColor] = useState([])
  const {
    loading,
    error,
    roleFacilities,
    selectedFacility,
    menuDetails,
    openMenus
  } = useSelector((state) => state.auth);

  const menuData = parseMenuData(menuDetails, userDetails);

  const handleToggle = (menuId) => {
    dispatch(
      setOpenMenus({
        [menuId]: !openMenus[menuId],
      })
    );
  };
  const generateLighterShades = (baseColor) => {
    return Array.from({ length: 5 }, (_, i) =>
      chroma(baseColor)
        .brighten(i + 2.2) // Increase the brightness significantly
        .desaturate(0.3)   // Slightly reduce saturation for pastel softness
        .alpha(1)          // Full opacity
        .css("rgba")       // Convert to RGBA format
    );
  };
  useEffect(() => {
    
    if(groupConfigData?.sidebarSkinColor){
      const lighterShades = generateLighterShades(groupConfigData?.sidebarSkinColor); // Generate lighter shades
      setBackgroundLightColor(lighterShades)
    }
    
  }, [groupConfigData])
  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prevState) => !prevState);
  };
  const handleOnContext = (e, val) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
    setSelectedVal(val);
  };
  const renderMenuItems = (items) => {
    return items?.map((item) => (
      <div key={item.MenuId}>
        <ListItem
          button
          onClick={() => handleToggle(item.MenuId)}
          style={{
            height: '48px',
            background: openMenus[item.MenuId] ? changeThemeColor(groupConfigData?.sidebarSkinColor,backgroundLightColor?.[1])?.backgroundLightColor : '',
            color: openMenus[item.MenuId] ? changeThemeColor(groupConfigData?.sidebarSkinColor,backgroundLightColor?.[1])?.textColor
              : `${groupConfigData?.sidebarSkinColor === "#ffffff" ? changeThemeColor(groupConfigData?.sidebarSkinColor,backgroundLightColor?.[1])?.textColor : "#fff"}`,
            padding: isMobile && isSidebarCollapsed ? 0 : '',
          }}
        >
          <>
            <SelectedTabHighlight
              ishighlighted={openMenus[item.MenuId]}
              sidebarSkinColor={changeThemeColor(groupConfigData?.sidebarSkinColor,backgroundLightColor?.[1])?.backgroundColor}
            />
            <SidebarIcon
             src={
              openMenus[item.MenuId]
                ?groupConfigData?.sidebarSkinColor === "#0083c0"?iconMapping[item.MenuLink]: iconMappingWhite[item.MenuLink]
                : `${groupConfigData?.sidebarSkinColor === "#ffffff" ?
                  iconMapping[item.MenuLink] :  iconMappingWhite[item.MenuLink]}`
            }
             
              alt={item.MenuName}
            />
            {!isSidebarCollapsed && (
              <>
                <ListItemText
                  style={{
                    textAlign: i18n?.language === 'en' ? 'left' : 'right',
                  }}
                  primary={
                    i18n?.language === 'en'
                      ? item.FieldEnglishLabel
                      : item.FieldArabicLabel
                  }
                />
                {item.children.length > 0 ? (
                  <SidebarIcon
                    src={
                      openMenus[item.MenuId]
                        ? ExpandLessIcon
                        : ExpandMoreIconWhite
                    }
                    alt={
                      openMenus[item.MenuId]
                        ? 'Sidebar Expand Less'
                        : 'Sidebar Expand more'
                    }
                    style={{ height: 24, width: 24 }}
                  />
                ) : null}
              </>
            )}
          </>
        </ListItem>
        {!isSidebarCollapsed && item.children.length > 0 && (
          <Collapse in={openMenus[item.MenuId]} timeout="auto" unmountOnExit>
            <List
              component="div"
              disablePadding
              style={{
                padding:
                  i18n?.language === 'en' ? '0 15px 0 15px' : '0 15px 0 15px',
              }}
            >
              {item.children.map((val, item) => (
                <CustomListItem
                  key={val.MenuId}
                  onClick={() => {
                    const value = roleFacilities
                      .find(
                        (facility) =>
                          facility.FacilityId === selectedFacility?.id
                      )
                      .Menu?.find(
                        (menudata) => menudata?.MenuId === val.MenuId
                      )?.IsView;
                    if (value) {
                      dispatch(
                        setSelectedMenu({ id: val.MenuId, name: val.MenuName })
                      );
                      dispatch(setSelectedModuleId(val.ModuleId));
                      navigate(val.MenuLink);
                    } else {
                      navigate('/');
                    }
                    if (isMobile) setIsSidebarCollapsed(true);
                  }}
                  style={{
                    textAlign: i18n?.language === 'en' ? 'left' : 'right',
                  }}
                  onContextMenu={(e) => handleOnContext(e, val)}
                >
                  {/* <VerticalLine
                    isLinkSelected={location.pathname.includes(val.MenuLink)}
                  /> */}
                  <DotTextWrapper
                    isLinkSelected={location.pathname.includes(val.MenuLink)}
                    sidebarSkinColor={changeThemeColor(groupConfigData?.sidebarSkinColor,backgroundLightColor?.[1])?.dotTextWrapperColor}
                  >
                    <ArrowSymbol
                      isLinkSelected={location.pathname.includes(val.MenuLink)}
                      sidebarSkinColor={changeThemeColor(groupConfigData?.sidebarSkinColor,backgroundLightColor?.[1])?.arrowColor}
                    />
                    <StyledTypography
                      fontSize="14px"
                      fontWeight="400"
                      lineHeight="18px"
                      color={
                        location.pathname.includes(val.MenuLink)
                          ? '#000'
                          : `${groupConfigData?.sidebarSkinColor === "#ffffff" ? "#0083c0" : "#fff"}`
                      }
                    >
                      {i18n?.language === 'en'
                        ? val.FieldEnglishLabel
                        : val.FieldArabicLabel}
                    </StyledTypography>
                  </DotTextWrapper>
                </CustomListItem>
              ))}
            </List>
          </Collapse>
        )}
      </div>
    ));
  };  
  return (
    <SidebarContainer
      isSidebarCollapsed={isSidebarCollapsed}
      isMobile={isMobile}
      sidebarSkinColor={groupConfigData?.sidebarSkinColor}
    >
      <FlexContainer
        justifyContent={isSidebarCollapsed ? 'center' : 'flex-end'}
        alignItems="center"
        padding="0 15px"
        borderBottom="1px solid rgba(153, 205, 230, 1)"
        height="45px"
      >
        <SidebarIcon
          src={`${groupConfigData?.sidebarSkinColor === "#ffffff" ? SidebarBlueCollapseIcon : SidebarWhiteCollapseIcon}`}

          alt="Sidebar collapse"
          style={{ height: 16, width: 20, margin: 0 }}
          onClick={toggleSidebarCollapse}
        />
      </FlexContainer>
      <CustomScrollbars
        style={{ height: 'calc(100% - 45px)' }}
        rtl={i18n.language === 'ar'}
      >
        <List style={{ padding: 0 }}>
          <ListItem
            button
            onClick={() => {
              handleToggle(0);
              navigate('/')
            }}
            style={{
              height: '48px',
              background: openMenus[0] ? changeThemeColor(groupConfigData?.sidebarSkinColor,backgroundLightColor?.[1])?.backgroundLightColor : '',
              color: openMenus[0] ? changeThemeColor(groupConfigData?.sidebarSkinColor,backgroundLightColor?.[1])?.textColor
                : `${groupConfigData?.sidebarSkinColor === "#ffffff" ? changeThemeColor(groupConfigData?.sidebarSkinColor,backgroundLightColor?.[1])?.textColor : "#fff"}`,
              padding: isMobile && isSidebarCollapsed ? 0 : '',
              // textAlign: i18n?.language === 'en' ? 'left' : 'right',
            }}
          >
            {isSidebarCollapsed ? (
              <>
                <SelectedTabHighlight
                  ishighlighted={openMenus[0]}
                  sidebarSkinColor={changeThemeColor(groupConfigData?.sidebarSkinColor,backgroundLightColor?.[1])?.backgroundColor}
                />
                <SidebarIcon
                  src={
                    openMenus[0]
                      ? iconMapping["Home"]
                      : `${groupConfigData?.sidebarSkinColor === "#ffffff" ?
                        iconMapping["Home"] : iconMappingWhite["Home"]}`
                  }
                  alt="Home" />
              </>
            ) : (
              <>
                <SelectedTabHighlight
                  ishighlighted={openMenus[0]}
                  sidebarSkinColor={changeThemeColor(groupConfigData?.sidebarSkinColor,backgroundLightColor?.[1])?.backgroundColor}
                />
                <SidebarIcon
                  src={
                    openMenus[0]
                      ?groupConfigData?.sidebarSkinColor === "#0083c0"?iconMapping["Home"]: iconMappingWhite["Home"]
                      : `${groupConfigData?.sidebarSkinColor === "#ffffff" ?
                        iconMapping["Home"] :  iconMappingWhite["Home"]}`
                  }
                  alt="Home" />
                <ListItemText primary={t('Home')} />
              </>
            )}
          </ListItem>
          {renderMenuItems(menuData)}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => {
              setAnchorEl(null);
            }}
            sx={{
              '& .MuiPaper-root': {
                width: 'auto',
              },
            }}
          >
            <MenuItem
              onClick={() => {
                dispatch(setSelectedModuleId(selectedVal.ModuleId));
                if (isMobile) setIsSidebarCollapsed(true);
                const menuLink = selectedVal?.MenuLink?.split('/')[1];
                window.open(
                  `/${selectedVal?.MenuLink}?menuId=${selectedVal.MenuId}`,
                  '_blank'
                );
                setAnchorEl(null);
                setSelectedVal(null);
              }}
            >
              Open in new tab
            </MenuItem>
          </Menu>
        </List>
      </CustomScrollbars>
    </SidebarContainer>
  );
};

export default Sidebar;
