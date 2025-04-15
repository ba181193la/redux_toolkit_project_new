import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MoreVert } from '@mui/icons-material';
import {
  FlexContainer,
  StyledImage,
  StyledTypography,
  StyledScrollbar,
} from '../../utils/StyledComponents';
import YourImage from '../../assets/Icons/Dashboard.png';
import GoToIcon from '../../assets/Icons/doubleArrow.png';
import Logo from '../../assets/Icons/Logo.png';
import IncidentApproval from '../../assets/Icons/IncidentApproval.png';
import LoadingGif from '../../assets/Gifs/LoadingGif.gif';

import SideTabs from './SideTabs';
import ActionButtons from './ActionButtons';
import { useDispatch, useSelector } from 'react-redux';
import useWindowDimension from '../../hooks/useWindowDimension';
import {
  useGetAllFavouritePagesQuery,
  useGetShowPendingTaskQuery,
  useGetIncidentCountDeatilsQuery,
} from '../../redux/RTK/home/landingPageApi';
import {
  setMenuList,
  setMenuListFavourites,
} from '../../redux/features/home/landingPageSlice';
import {
  setSelectedMenu,
  setSelectedModuleId,
} from '../../redux/features/auth/authSlice';
import MenuHeader from './MenuHeader/menuHeader';
import IncidentMaster from './MenuHeader/IncidentMaster';
import { useNavigate } from 'react-router-dom';
import { Menu, MenuItem } from '@mui/material';

const LandingPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isMobile } = useWindowDimension();
  const [userProfileEl, setUserProfileEl] = useState(null);
  const dispatch = useDispatch();
  const [changeMenuHeader, setChangeMenuHeader] =
    useState('IncidentManagement');
  const [incidentMangement, setIncidentMangement] = useState([]);

  const { userDetails, menuDetails, selectedFacility } = useSelector(
    (state) => state.auth
  );
  const handleUserProfileClose = () => {
    setUserProfileEl(null);
  };

  const {
    data: { records } = {},
    refetch: fetchFavouritePagesQuery,
    isFetching: isFetchingFavourites,
  } = useGetAllFavouritePagesQuery(
    {
      loginUserId: userDetails?.UserId,
    },
    {
      skip: !userDetails?.UserId,
    }
  );
  const { MenuList } = records || {
    MenuList: [],
  };

  const {
    data: { showPendingTaskData } = {},
    isFetching: isFetchingPendingTask,
    refetch: fetchShowPendingTaskData,
  } = useGetShowPendingTaskQuery(
    {
      loginUserId: userDetails?.UserId,
    },
    {
      skip: !userDetails?.UserId,
    }
  );

  useEffect(() => {
    if (records?.MenuList?.length > 0) {
      fetchFavouritePagesQuery();
    }
    if (showPendingTaskData) {
      fetchShowPendingTaskData();
    }
  }, [records, showPendingTaskData]);

  useEffect(() => {
    if (menuDetails?.length > 0 && MenuList?.length > 0) {
      const mainMasterDetails = menuDetails?.filter(
        (details) => details.ParentMenuId === null
      )?.[0];
      const mainMasterMenuList = MenuList.filter(
        (MenuListItem) =>
          MenuListItem.ModuleName === mainMasterDetails?.MenuName
      ).map((MenuListData) => {
        const matchedItem = menuDetails.find(
          (menuDetailsData) =>
            menuDetailsData.ParentMenuId === MenuListData.ModuleId &&
            menuDetailsData.MenuId == MenuListData.MenuId
        );
        return {
          ...MenuListData,
          MenuLink: matchedItem?.MenuLink,
        };
      });
      dispatch(setMenuList(MenuList));
      dispatch(setMenuListFavourites(mainMasterMenuList));
    }
  }, [MenuList, menuDetails]);

  const handleChangeMenuList = (menuTab) => {
    if (MenuList?.length > 0) {
      const mainMasterMenuList = MenuList.filter(
        (MenuListItem) => MenuListItem.ModuleName === menuTab
      ).map((MenuListData) => {
        const matchedItem = menuDetails.find(
          (menuDetailsData) =>
            menuDetailsData.ModuleId === MenuListData.ModuleId &&
            menuDetailsData.MenuId == MenuListData.MenuId
        );
        return {
          ...MenuListData,
          MenuLink: matchedItem?.MenuLink,
        };
      });
      dispatch(setMenuListFavourites(mainMasterMenuList));
    }
  };

  const handleChangeMenuHeader = (menu) => {
    setChangeMenuHeader(menu);
  };
  //Incident Menu List
  let roleIds = userDetails?.ApplicableRoles?.map((item) => item.RoleId);
  roleIds = roleIds?.length > 0 ? roleIds.join(',') : '';
  const { data: { incidentMenuCountList } = {} } =
    useGetIncidentCountDeatilsQuery(
      {
        payload: {
          moduleId: 2,
          headerFacilityId: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
        },
      },
      {
        skip: !userDetails?.UserId || !selectedFacility?.id,
      }
    );

  useEffect(() => {
    if (incidentMenuCountList?.length > 0) {
      setIncidentMangement([...(incidentMenuCountList || [])]);
    }
  }, [incidentMenuCountList]);

  return (
    <>
      <FlexContainer
        // backgroundColor="aqua"
        width={isMobile ? '100%' : '95%'}
        margin="auto"
        display="flex"
        flexDirection="column"
      >
        {/* SESSION 1 */}
        <FlexContainer
          width="100%"
          display="flex"
          // height="50%"
          // maxHeight="50%"
          // minHeight="50%"
          flexDirection={isMobile ? 'column' : 'row'}
          // backgroundColor="#F0F0F0" //#eeeee4
          gap="20px"
        >
          {/* IMAGE DIV */}
          <FlexContainer
            width={isMobile ? '100%' : '25%'}
            display="flex"
            flexDirection="column"
            height="350px"
            gap="10px" // Adds gap between child containers
            padding="20px"
            style={{
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Soft shadow effect
              borderRadius: '8px', // Optional for rounded corners
            }}
          >
            <FlexContainer
              width={'100%'}
              backgroundColor="#FAFAFA"
              textAlign="center"
              padding="15px"
              height="80%"
              display="flex" // Ensures flexbox is applied
              justifyContent="center"
              borderRadius="10px 10px 10px 10px"
            >
              <StyledImage
                src={YourImage}
                alt="Decorative"
                width="100%"
                height={'100%'}
              />
            </FlexContainer>
            <FlexContainer
              width={'100%'}
              backgroundColor="#FAFAFA"
              height="20%"
              padding="15px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius="10px 10px 10px 10px"
              borderLeft="5px solid #0083c0"
              borderRight="5px solid #0083c0"
            >
              <StyledImage src={Logo} alt="New Decorative" width={'70%'} />
            </FlexContainer>
          </FlexContainer>
          {/* FavouritePages DIV */}
          <FlexContainer
            width={isMobile ? '100%' : '75%'}
            display="flex"
            flexDirection="column"
          >
            <FlexContainer
              display="flex"
              backgroundColor="#0083c0"
              alignItems="center"
              height="50px"
              padding="10px"
              justifyContent="space-between"
            >
              <StyledTypography
                fontSize={isMobile ? '16px' : '20px'}
                fontWeight={100}
                bold
                color="#FFFFFF"
                padding="15px 20px"
                textAlign="left"
                // width="100%"
              >
                {t('FavouritePages')}
              </StyledTypography>
              <StyledTypography
                color="#FFFFFF"
                padding="15px 20px"
                style={{
                  display: 'inline-flex', // Keeps text centered inside
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  transition: 'background-color 0.3s ease-in-out',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    'rgba(255,255,255,0.2)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                <MoreVert
                  style={{ cursor: 'pointer' }}
                  onClick={(event) => setUserProfileEl(event.currentTarget)}
                />{' '}
              </StyledTypography>
              <Menu
                anchorEl={userProfileEl}
                open={Boolean(userProfileEl)}
                onClose={handleUserProfileClose}
                sx={{
                  '& .MuiPaper-root': {
                    width: 'auto',
                    marginLeft: '8px', // Shifts the menu 8px to the left
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleUserProfileClose();
                    dispatch(
                      setSelectedMenu({ id: 16, name: 'Home Page Settings' })
                    );
                    dispatch(setSelectedModuleId(1));
                    navigate(`/MainMaster/HomePageSettings`);
                  }}
                >
                  Edit
                </MenuItem>
              </Menu>
            </FlexContainer>
            {isFetchingFavourites ? (
              <FlexContainer
                justifyContent="center"
                marginTop={isMobile ? '10px' : '70px'}
              >
                <StyledImage src={LoadingGif} alt="LoadingGif" />
              </FlexContainer>
            ) : (
              <FlexContainer
                // backgroundColor="#F0F0F0"
                height={'300px'}
                padding="10px"
                display="flex"
                flexDirection={isMobile ? 'column' : 'row'}
                gap="10px"
                style={{
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Soft shadow effect
                  borderRadius: '8px', // Optional for rounded corners
                }}
              >
                <SideTabs handleChangeMenuList={handleChangeMenuList} />
                <ActionButtons />
              </FlexContainer>
            )}
          </FlexContainer>
        </FlexContainer>

        {/* SESSION 2- COUNT NAV LINKS  DIV*/}
        {showPendingTaskData?.IsShowPendingHomeDashboard && (
          <FlexContainer
            width="100%"
            height="50%"
            marginTop="15px"
            display="flex"
            padding="25px"
            flexDirection="column"
            backgroundColor="#ffff"
            style={{
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Soft shadow effect
              borderRadius: '8px', // Optional for rounded corners
            }}
          >
            <MenuHeader
              changeMenuHeader={changeMenuHeader}
              setChangeMenuHeader={setChangeMenuHeader}
              handleChangeMenuHeader={handleChangeMenuHeader}
            />
            <IncidentMaster incidentMangement={incidentMangement} />
          </FlexContainer>
        )}
      </FlexContainer>
    </>
  );
};

export default LandingPage;
