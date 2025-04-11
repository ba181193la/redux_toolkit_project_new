import React, { useState } from 'react';
import {
  FlexContainer,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { Form, Formik } from 'formik';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ListDot from '@mui/icons-material/Circle';
import { Box, Divider, Tooltip, List, ListItem, ListItemIcon } from '@mui/material';
import { TextField } from '../../../../components/TextField/TextField';
import Label from '../../../../components/Label/Label';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { useDispatch, useSelector } from 'react-redux';
import { getlabel } from '../../../../utils/language';
import * as Yup from 'yup';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CommonStyledButton,
  StyledImage,
} from '../../../../utils/StyledComponents';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import ListDot from '../../../../assets/Icons/ListDot.png';

import {
  useGetUserLevelMenuListQuery
} from '../../../../redux/RTK/homePageSettingsApi';
import { useNavigate, useParams } from 'react-router-dom';
import BackArrowGif from '../../../../assets/Gifs/BackArrowGif.gif';

import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import useWindowDimension from '../../../../hooks/useWindowDimension';

const AddNewRole = () => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    userDetails,menuDetails
  } = useSelector((state) => state.auth);

  const { isMobile } = useWindowDimension();
  const [menuList, setMenuList] = useState([])
  const [parentMenu, setParentMenu] = useState([])

  const { data: { userLevelMenuList } = {}, isFetching: isFetchingMenuList } = useGetUserLevelMenuListQuery(
    {
      loginUserId: userDetails?.UserId,
    },
    {
      skip: !userDetails?.UserId,
      refetchOnMountOrArgChange: true,
    }
  )

  useEffect(() => {
    if (menuDetails?.length > 0) {
      setParentMenu(() => menuDetails?.filter(details => details.ParentMenuId === null))
      const menuListData = userLevelMenuList?.map((menuItem) => {
        const parentMenu = menuDetails?.find(details => details.ParentMenuId === null && details.ModuleId === menuItem.ModuleId)
        if (menuItem.ModuleId === parentMenu?.ModuleId && menuItem.MenuId !== parentMenu?.MenuId && menuItem.IsChecked) {
          return {
            ...menuItem,
            FieldArabicLabel: parentMenu.FieldArabicLabel,
            FieldEnglishLabel: parentMenu.FieldEnglishLabel
          }
        }
        return null;
      }).filter((item) => item !== null)
      setMenuList(menuListData)
    }

  }, [menuDetails,userLevelMenuList]);


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
          {t('MM_UserLevel')}
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
      <FlexContainer
        margin="0 0 20px 0"
        flexDirection="column"
        gap="20px"
        height="auto"
      >
        { isFetchingMenuList? (
              <FlexContainer justifyContent="center">
                <StyledImage src={LoadingGif} alt="LoadingGif" />
              </FlexContainer>
            ) : (<>
              {
                parentMenu?.map((parentMenuItem, parentMenuIndex) => {
                  const filterMenuList = menuList?.filter((menuItem) => menuItem.ModuleId === parentMenuItem.ModuleId)
                  return (
                    <Accordion key={parentMenuIndex} sx={{ border: '5px', borderColor: '#0083c0' }}>
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
                        <List disablePadding>
                          {
                            filterMenuList?.length > 0 && filterMenuList.map((menu, index) => (
                              <ListItem key={index}>
                                <ListItemIcon>
                                  <StyledImage src={ListDot} alt="LoadingGif" height={"10px"} width={"10px"} />
                                </ListItemIcon>
                                <StyledTypography>{menu.MenuName}</StyledTypography>
                              </ListItem>
                            ))}
                        </List>
                      </AccordionDetails>
                    </Accordion>
                  )
                })
              }
            </>
            )}

      </FlexContainer>

    </FlexContainer>
  </FlexContainer>
  );
};

export default AddNewRole;
