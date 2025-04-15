import {
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../utils/StyledComponents';
import { headerThemeColorChange } from '../../utils/ChangeThemeColor';
import AccrehealthIcon from '../../assets/images/accrehealthIcon.png';
import LanguageIcon from '../../assets/Icons/languageIcon.png';
import LocationIcon from '../../assets/Icons/locationIcon.png';
import ArrowDownIcon from '../../assets/Icons/downArrow.png';
import { useTranslation } from 'react-i18next';
import { IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMenuDetails,
  logout,
  setSelectedFacility,
  setSelectedlanguage,
  setSelectedRoleFacility,
  setIsSwitchUser,
  setIsPreviousUser,
  fetchUserDetails,
  fetchLicenseDetails,
  setIsWarning,
} from '../../redux/features/auth/authSlice';
import { staffMasterApi } from '../../redux/RTK/staffMasterApi';
import { resetFilters } from '../../redux/features/mainMaster/staffMasterSlice';
import { showToastAlert } from '../../utils/SweetAlert';
import useWindowDimension from '../../hooks/useWindowDimension';
import { useNavigate } from 'react-router-dom';
import SwitchUserModal from './SwithUserModal';
import {
  useGetAllFacilitiesQuery,
  useGetUserPageLoadDataQuery,
} from '../../redux/RTK/userAssignmentApi';
import { HeaderContainer } from './Header.styled';
import { userAssignmentApi } from '../../redux/RTK/userAssignmentApi';
import Swal from 'sweetalert2/dist/sweetalert2.js';

const Header = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [locationAnchorEl, setLocationAnchorEl] = useState(null);
  const [userProfileEl, setUserProfileEl] = useState(null);
  const [showSwitchUserModal, setShowSwitchUserModal] = useState(false);
  const [selectedFacilityId, setSelectedFacilityId] = useState('');
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const {
    userDetails,
    selectedFacility,
    regionCode,
    selectedLanguage,
    token,
    isPreviousUser,
    isSwitchUser,
    selectedMenu,
  } = useSelector((state) => state.auth);
  const { groupConfigData } = useSelector((state) => state.groupConfig);
  const { isTablet, isMobile, windowDimensions } = useWindowDimension();

  const handleSwitchUserModalClose = () => {
    setShowSwitchUserModal(false);
    setSelectedFacilityId('');
  };
  useEffect(() => {
    const defaultFacility = userDetails?.ApplicableFacilities?.find(
      (i) => i.FacilityId === userDetails?.DefaultFacilityId
    );

    if (!selectedFacility) {
      if (defaultFacility)
        dispatch(
          setSelectedFacility({
            name: defaultFacility.FacilityName,
            id: defaultFacility.FacilityId,
            regionCode: defaultFacility.RegionCode,
          })
        );
      else
        setSelectedFacility({
          name: userDetails?.ApplicableFacilities?.[0]?.FacilityName,
          id: userDetails?.ApplicableFacilities?.[0]?.FacilityId,
          regionCode: userDetails?.ApplicableFacilities?.[0]?.RegionCode,
        });
    }
  }, [userDetails]);

  const { data: allFacilities = [] } = useGetAllFacilitiesQuery({
    payload: {
      // pageIndex: 1,
      // pageSize: 50,
      // headerFacility: selectedFacility?.id,
      // loginUserId: userDetails?.UserId,
      // moduleId: selectedModuleId,
      // menuId: selectedMenu?.id,
      pageIndex: 1,
      pageSize: 50,
      headerFacility: 2,
      loginUserId: 1,
      moduleId: 1,
      menuId: 3,
    },
  });

  const { data: pageLoadData } = useGetUserPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  useEffect(() => {
    dispatch(setSelectedRoleFacility());
  }, [selectedFacility]);

  const handleLocationClose = () => {
    setLocationAnchorEl(null);
  };

  const handleUserProfileClose = () => {
    setUserProfileEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    dispatch(setSelectedlanguage(lng === 'en' ? 'English' : 'Arabic'));
    handleClose();
    showToastAlert({
      type: 'custom_success',
      text: `${lng === 'en' ? 'English' : 'Arabic'} language selected!`,
    });
  };

  const handleOnChangeFacility = (name, id, regionCode, CompanyCode) => {
    dispatch(setSelectedFacility({ name, id, regionCode }));
    dispatch(
      fetchMenuDetails({
        facilityId: id,
        employeeID: userDetails?.EmployeeID,
        token,
      })
    );
    dispatch(setIsWarning(true));
    dispatch(
      fetchLicenseDetails({
        companyCode: CompanyCode,
        token,
      })
    );
    dispatch(staffMasterApi.util.invalidateTags([{ type: 'getAllStaff' }]));
    dispatch(resetFilters());
    handleLocationClose();
  };

  const updatedFacilities =
    allFacilities?.Records?.filter((facility) => {
      return facility.FacilityName !== 'All';
    }) || [];

  return (
    <HeaderContainer
      backgroundColor={
        headerThemeColorChange(groupConfigData?.headerSkinColor)
          ?.headerBackgroundColor
      }
    >
      <StyledImage
        height={isMobile ? '35px' : '50px'}
        width={isMobile ? '100px' : '150px'}
        src={AccrehealthIcon}
        alt="Accrehealth Icon"
      />
      <FlexContainer
        gap={isMobile || isTablet ? '2px' : '22px'}
        flexWrap="wrap"
      >
        <FlexContainer alignItems="center">
          <IconButton
            sx={{ outline: 'none', borderRadius: 0 }}
            onClick={(event) => setLocationAnchorEl(event.currentTarget)}
          >
            <StyledImage
              height="40px"
              width="40px"
              cursor="pointer"
              src={LocationIcon}
              alt="Location Icon"
            />
            {!isMobile && !isTablet && (
              <>
                <StyledTypography
                  fontSize="14px"
                  fontWeight="500"
                  lineHeight="18px"
                  padding="0 5px"
                  color={
                    headerThemeColorChange(groupConfigData?.headerSkinColor)
                      ?.headerStyledTypographyColor
                  }
                >
                  {selectedFacility?.name || ''}
                </StyledTypography>
                <StyledImage src={ArrowDownIcon} alt="Arrow Icon" />
              </>
            )}
          </IconButton>
          <Menu
            anchorEl={locationAnchorEl}
            open={Boolean(locationAnchorEl)}
            onClose={handleLocationClose}
            sx={{
              '& .MuiPaper-root': {
                width: 'auto',
              },
            }}
          >
            {userDetails?.ApplicableFacilities?.map((item) => (
              <MenuItem
                key={item.FacilityId}
                onClick={() =>
                  handleOnChangeFacility(
                    item.FacilityName,
                    item.FacilityId,
                    item.RegionCode,
                    item.CompanyCode
                  )
                }
              >
                {item.FacilityName}
              </MenuItem>
            ))}
          </Menu>
        </FlexContainer>

        {/* Language Selection */}
        <FlexContainer alignItems="center">
          <IconButton
            sx={{ outline: 'none', borderRadius: 0 }}
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            <StyledImage
              height="40px"
              width="40px"
              cursor="pointer"
              src={LanguageIcon}
              alt="Language Icon"
            />
            {!isMobile && !isTablet && (
              <>
                <StyledTypography
                  fontSize="14px"
                  fontWeight="500"
                  lineHeight="18px"
                  padding="0 5px"
                  color={
                    headerThemeColorChange(groupConfigData?.headerSkinColor)
                      ?.headerStyledTypographyColor
                  }
                >
                  {selectedLanguage}
                </StyledTypography>
                <StyledImage src={ArrowDownIcon} alt="Arrow Icon" />
              </>
            )}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              '& .MuiPaper-root': {
                width: 'auto',
              },
            }}
          >
            <MenuItem onClick={() => changeLanguage('en')}>English</MenuItem>
            <MenuItem onClick={() => changeLanguage('ar')}>Arabic</MenuItem>
          </Menu>
        </FlexContainer>

        {/* User Profile */}
        <FlexContainer alignItems="center">
          <IconButton
            sx={{ outline: 'none', borderRadius: 0 }}
            onClick={(event) => setUserProfileEl(event.currentTarget)}
          >
            <Avatar src={userDetails?.UserImage || ''} alt="Avatar Icon" />
            {windowDimensions > 576 && (
              <>
                <FlexContainer flexDirection="column" alignItems="flex-start">
                  <StyledTypography
                    fontSize="14px"
                    fontWeight="700"
                    lineHeight="18px"
                    padding="0 10px"
                    color={
                      headerThemeColorChange(groupConfigData?.headerSkinColor)
                        ?.headerUserNameColor
                    }
                  >
                    {userDetails?.UserName || 'User'}
                  </StyledTypography>
                  <StyledTypography
                    fontSize="14px"
                    fontWeight="500"
                    lineHeight="18px"
                    padding="0 10px"
                    color={
                      headerThemeColorChange(groupConfigData?.headerSkinColor)
                        ?.headerStaffCategoryNameColor
                    }
                  >
                    {userDetails?.StaffCategoryName}
                  </StyledTypography>
                </FlexContainer>
                <StyledImage src={ArrowDownIcon} alt="Arrow Icon" />
              </>
            )}
          </IconButton>
        </FlexContainer>
        <Menu
          anchorEl={userProfileEl}
          open={Boolean(userProfileEl)}
          onClose={handleUserProfileClose}
          sx={{
            '& .MuiPaper-root': {
              width: 'auto',
            },
          }}
        >
          <MenuItem
            onClick={() => {
              handleUserProfileClose();
              navigate('/ChangePassword');
            }}
          >
            Change Password
          </MenuItem>
          {userDetails?.StaffCategoryId === 1 && (
            <MenuItem
              onClick={(e) => {
                setShowSwitchUserModal(true);
                dispatch(setIsPreviousUser(userDetails));
              }}
            >
              Switch User
            </MenuItem>
          )}
          {isSwitchUser && (
            <MenuItem
              onClick={async (e) => {
                dispatch(setIsPreviousUser(userDetails));
                dispatch(setIsSwitchUser(false));
                await dispatch(
                  fetchUserDetails({
                    employeeID: isPreviousUser?.EmployeeID,
                    token: token,
                  })
                );
                handleUserProfileClose();
                navigate('/');
              }}
            >
              Back to Super Admin
            </MenuItem>
          )}
          <SwitchUserModal
            open={showSwitchUserModal}
            setIsSwitching={setIsSwitching}
            onClose={handleSwitchUserModalClose}
            handleUserProfileClose={handleUserProfileClose}
            setShowSwitchUserModal={setShowSwitchUserModal}
            setSelectedRowData={setSelectedRowData}
            showSwitchUserModal={showSwitchUserModal}
            allFacilities={updatedFacilities}
            selectedFacilityId={selectedFacilityId}
            setSelectedFacilityId={setSelectedFacilityId}
            pageLoadData={pageLoadData}
          />
          <MenuItem
            onClick={() => {
              dispatch(logout());
              Swal.close();
            }}
          >
            Logout
          </MenuItem>
        </Menu>
      </FlexContainer>
    </HeaderContainer>
  );
};

export default Header;
