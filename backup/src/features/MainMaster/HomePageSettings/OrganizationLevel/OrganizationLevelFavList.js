import React, { useState, useEffect } from 'react';
import {
  FlexContainer,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { Form, Formik } from 'formik';
import { Box, Divider, Tooltip } from '@mui/material';
import { TextField } from '../../../../components/TextField/TextField';
import Label from '../../../../components/Label/Label';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { useDispatch, useSelector } from 'react-redux';
import { getlabel } from '../../../../utils/language';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import {
  CommonStyledButton,
  StyledImage,
} from '../../../../utils/StyledComponents';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import OrganizationalLevelTable from './OrganizationalLevelTable';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DoNotDisturbIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';

import {
  useGetOrganizationLevelMenuListQuery,
  useCreateOrganizationLevelMenuListMutation,
} from '../../../../redux/RTK/homePageSettingsApi';
import { setOrganizationLevelMenu } from '../../../../redux/features/mainMaster/homePageSettingSlice';

import { useNavigate } from 'react-router-dom';
import BackArrowGif from '../../../../assets/Gifs/BackArrowGif.gif';

import { showToastAlert } from '../../../../utils/SweetAlert';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import useWindowDimension from '../../../../hooks/useWindowDimension';

const OrganizationalLevel = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();
  const [menuList, setMenuList] = useState([]);
  const [parentMenu, setParentMenu] = useState([]);

  const { selectedMenu, userDetails, selectedModuleId, menuDetails } =
    useSelector((state) => state.auth);
  const { isMobile } = useWindowDimension();
  const { organizationLevelMenu } = useSelector(
    (state) => state.homePageSetting
  );
  const {
    data: { organizationLevelMenuList } = {},
    isFetching: isFetchingMenuList,
  } = useGetOrganizationLevelMenuListQuery(
    {
      loginUserId: userDetails?.UserId,
    },
    {
      skip: !userDetails?.UserId,
      refetchOnMountOrArgChange: true,
    }
  );

  const [triggerCreatedMenuList,{ isLoading }] = useCreateOrganizationLevelMenuListMutation();

  useEffect(() => {
    if (menuDetails?.length > 0) {
      setParentMenu(() =>
        menuDetails?.filter((details) => details.ParentMenuId === null)
      );
      const menuListData = organizationLevelMenuList
        ?.map((menuItem) => {
          const parentMenu = menuDetails?.find(
            (details) =>
              details.ParentMenuId === null &&
              details.ModuleId === menuItem.ModuleId
          );
          if (
            menuItem.ModuleId === parentMenu?.ModuleId &&
            menuItem.MenuId !== parentMenu?.MenuId
          ) {
            return {
              ...menuItem,
              FieldArabicLabel: parentMenu.FieldArabicLabel,
              FieldEnglishLabel: parentMenu.FieldEnglishLabel,
            };
          }
          return null;
        })
        .filter((item) => item !== null);
      setMenuList(menuListData);
      dispatch(setOrganizationLevelMenu(menuListData));
    }
  }, [menuDetails, organizationLevelMenuList, dispatch]);

  const handleSubmit = async () => {
    try {
      const payload = organizationLevelMenu
        ?.filter((item) => item.IsChecked)
        .map((data) => ({
          menuId: data.MenuId,
          moduleId: data.ModuleId,
          loginUserId: userDetails?.UserId,
        }));

      if (payload.length === 0) {
        showToastAlert({
          type: 'custom_error',
          text: t('ChooseAnyOneMenuInList'),
          gif: 'InfoGif',
        });
        return false;
      }
      const response = await triggerCreatedMenuList({
        payload: payload,
      }).unwrap();
      if (response && response.Message) {
        showToastAlert({
          type: 'custom_success',
          text: response.Message,
          gif: 'SuccessGif',
        });
      }
      navigate(-1);
    } catch (error) {
      showToastAlert({
        type: 'custom_error',
        text: error.Data || error.Message,
        gif: 'InfoGif',
      });
    }
  };
  return (
    <FlexContainer width="100%" height="100%" flexDirection="column">
      <FlexContainer padding="0 0 15px 0">
        <StyledTypography
          fontSize={isMobile ? '24px' : '36px'}
          fontWeight="900"
          lineHeight={isMobile ? '32px' : '44px'}
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('MM_OrganizationLevel')}
        </StyledTypography>
      </FlexContainer>

      <FlexContainer
        height="100%"
        width="100%"
        padding="15px 25px 25px 25px"
        borderRadius="8px"
        flexDirection="column"
        backgroundColor="#fff"
        overFlow="auto"
      >
        <FlexContainer alignItems="center">
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
                onClick={() => navigate(-1)}
              >
                <span
                  style={{ marginRight: '4px', fontSize: '12px' }}
                >{`<<`}</span>{' '}
                {t('Previous')}
              </button>
            </Tooltip>
          </FlexContainer>
        </FlexContainer>
        <Divider sx={{ marginY: '20px' }} />
        <Formik initialValues={{}} onSubmit={handleSubmit}>
          {({}) => {
            return isFetchingMenuList ? (
              <FlexContainer justifyContent="center">
                <StyledImage src={LoadingGif} alt="LoadingGif" />
              </FlexContainer>
            ) : (
              <Form>
                <FlexContainer
                  margin="0 0 20px 0"
                  flexDirection="column"
                  gap="20px"
                  height="auto"
                >
                  {parentMenu?.map((parentMenuItem) => (
                    <Accordion sx={{ border: '5px', borderColor: '#0083c0' }}>
                      <AccordionSummary
                        aria-controls="panel1-content"
                        id="panel1-header"
                        sx={{
                          backgroundColor: '#0083c0',
                          borderRadius: '8px 8px 0px 0px',
                          width: '100%',
                          border: '1px solid #0083c0',
                        }}
                      >
                        <StyledTypography
                          fontSize="16px"
                          fontWeight="700"
                          lineHeight="20px"
                          textAlign="center"
                          color="#FFFFFF"
                        >
                          {i18n?.language === 'en'
                            ? parentMenuItem.FieldEnglishLabel
                            : parentMenuItem.FieldArabicLabel}
                        </StyledTypography>
                      </AccordionSummary>
                      <AccordionDetails
                        sx={{
                          width: '100%',
                          height: '100%',
                          padding: '0px 0px 20px 0px',
                          border: '1px solid #0083c0',
                        }}
                      >
                        <FlexContainer  display="flex" justifyContent="center" padding="15px">
                          <OrganizationalLevelTable
                            menuList={menuList}
                            setMenuList={setMenuList}
                            parentMenuItem={parentMenuItem}
                          />
                        </FlexContainer>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                  <FlexContainer
                    gap="16px"
                    justifyContent="flex-end"
                    padding="25px 0px 15px 0px"
                  >
                    <CommonStyledButton
                      type="submit"
                      variant="contained"
                      text-color="#0083C0"
                      gap="8px"
                      startIcon={
                        <StyledImage
                          src={DoneIcon}
                          sx={{
                            marginBottom: '1px',
                            color: '#FFFFFF',
                          }}
                        />
                      }
                    >
                      <StyledTypography marginTop="1px" color="#FFFFFF">
                        {isLoading?'Submitting....': t('Submit')}
                      </StyledTypography>
                    </CommonStyledButton>
                    <CommonStyledButton
                      gap="8px"
                      type="button"
                      variant="outlined"
                      onClick={() => navigate('/MainMaster/HomePageSettings')}
                      startIcon={<StyledImage src={DoNotDisturbIcon} />}
                    >
                      <StyledTypography marginTop="1px">
                        {t('Cancel')}
                      </StyledTypography>
                    </CommonStyledButton>
                  </FlexContainer>
                </FlexContainer>
              </Form>
            );
          }}
        </Formik>
      </FlexContainer>
    </FlexContainer>
  );
};

export default OrganizationalLevel;
