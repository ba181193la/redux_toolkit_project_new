import React, { useState } from 'react';
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
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  CommonStyledButton,
  StyledImage,
} from '../../../../utils/StyledComponents';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import MainMasterTable from './MainMasterTable';
import IncidentTable from './IncidentTable';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DoNotDisturbIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import {
  useAddApplicationRoleMutation,
  useGetApplicationRoleByIdQuery,
  useUpdateApplicationRoleMutation,
} from '../../../../redux/RTK/applicationRoleApi';
import { useNavigate, useParams } from 'react-router-dom';
import BackArrowGif from '../../../../assets/Gifs/BackArrowGif.gif';
import {
  setMainMasterRoles,
  setIncidentRoles,
} from '../../../../redux/features/mainMaster/applicationRoleSlice';
import { showToastAlert } from '../../../../utils/SweetAlert';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import useWindowDimension from '../../../../hooks/useWindowDimension';

const AddNewRole = () => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const {
    selectedMenu,
    userDetails,
    selectedModuleId,
    menuDetails,
    selectedFacility,
  } = useSelector((state) => state.auth);

  const [validationSchema, setValidationSchema] = useState();
  const [isRoleSelected, setIsRoleSelected] = useState(false);

  const { isMobile } = useWindowDimension();

  const { incidentRoles, mainMasterRoles } = useSelector(
    (state) => state.applicationRole
  );

  const { data: applicationRoleData, isFetching: isFetchingRoleById } =
    useGetApplicationRoleByIdQuery(
      {
        roleId: id,
        loginUserId: userDetails?.UserId,
        menuId: selectedMenu?.id,
      },
      { skip: !id }
    );

  const initialValues = {
    applicationRole: applicationRoleData?.Data?.ApplicationRole || '',
  };

  const pagesConfigData = [
    {
      fieldId: 'AR_P_ApplicationRole',
      translationId: 'MM_AR_ApplicationRole',
      label: 'Application Role',
      component: 'Textfield',
      name: 'applicationRole',
      maxLength: 150,
    },
  ];


  const [triggerAddApplicationRole] = useAddApplicationRoleMutation();
  const [triggerUpdateApplicationRole] = useUpdateApplicationRoleMutation();

  const { data: fields = [], isFetching: isFetchingFields } = useGetFieldsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );

  const { data: labels = [], isFetching: isFetchingLabels } = useGetLabelsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );

  useEffect(() => {
    if (applicationRoleData?.Data && menuDetails) {
      const roleMappings =
        applicationRoleData?.Data?.ApplicationRoleMenuMapping || [];

      const filteredMainMenuDetails = menuDetails.filter(
        (menu) => menu.ParentMenuId === 1
      );
      const filteredIncidentMenuDetails = menuDetails.filter(
        (menu) => menu.ParentMenuId === 19
      );

      const masterMenuIds = filteredMainMenuDetails.map((menu) => menu.MenuId);
      const incidentMenuIds = filteredIncidentMenuDetails.map(
        (menu) => menu.MenuId
      );

      const updatedMainMasterRoles = roleMappings
        .filter((role) => masterMenuIds.includes(role.MenuId))
        .map((role) => ({
          isAdd: role.IsAdd || false,
          isView: role.IsView || false,
          isEdit: role.IsEdit || false,
          isDelete: role.IsDelete || false,
          isPrint: role.IsPrint || false,
          menuId: role.MenuId || null,
          moduleName: role.ScreenName || '',
        }));

      const updatedIncidentRoles = roleMappings
        .filter((role) => incidentMenuIds.includes(role.MenuId))
        .map((role) => ({
          isAdd: role.IsAdd || false,
          isView: role.IsView || false,
          isEdit: role.IsEdit || false,
          isDelete: role.IsDelete || false,
          isPrint: role.IsPrint || false,
          menuId: role.MenuId || null,
          moduleName: role.ScreenName || '',
        }));

      if (
        Array.isArray(updatedMainMasterRoles) &&
        updatedMainMasterRoles.length > 0
      ) {
        dispatch(setMainMasterRoles(updatedMainMasterRoles));
      }
      if (
        Array.isArray(updatedIncidentRoles) &&
        updatedIncidentRoles.length > 0
      ) {
        dispatch(setIncidentRoles(updatedIncidentRoles));
      }
    } else {
      return;
    }
  }, [applicationRoleData, menuDetails]);

  useEffect(() => {
    const roles = [...(mainMasterRoles || []), ...(incidentRoles || [])];
    const isRole = roles?.some(
      (role) =>
        role.isView ||
        role.isAdd ||
        role.isDelete ||
        role.isPrint ||
        role.isEdit
    );
    setIsRoleSelected(isRole);
  }, [mainMasterRoles, incidentRoles]);

  const handleSubmit = async (values, { resetForm }) => {
    let response;
    try {
      if (id) {
        response = await triggerUpdateApplicationRole({
          payload: {
            defaultFacilityId: selectedFacility?.id,
            roleId: id,
            applicationRole: values.applicationRole,
            isRoleHide: false,
            isDefaultRole: false,
            isDelete: false,
            loginUserId: userDetails?.UserId,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            applicationRoleMenuMapping: (() => {
              const mappedRoles = [...mainMasterRoles, ...incidentRoles].map(
                ({
                  isView,
                  isAdd,
                  isEdit,
                  isDelete,
                  isPrint,
                  menuId,
                  screenName,
                }) => ({
                  roleMappingId: 0,
                  roleId: 0,
                  menuId,
                  isView: isView || isAdd || isEdit || isDelete || isPrint,
                  isAdd,
                  isEdit,
                  isDelete,
                  isPrint,
                  screenName,
                })
              );
              const hasMainMasterMenu = mappedRoles.some(
                (role) =>
                  role.menuId >= 2 &&
                  role.menuId <= 18 &&
                  (role.isView ||
                    role.isEdit ||
                    role.isDelete ||
                    role.isPrint ||
                    role.isAdd)
              );

              const hasIncidentMenu = mappedRoles.some(
                (role) =>
                  role.menuId >= 20 &&
                  role.menuId <= 35 &&
                  (role.isView ||
                    role.isEdit ||
                    role.isDelete ||
                    role.isPrint ||
                    role.isAdd)
              );

              const parentMenuObjects = [];
              if (hasMainMasterMenu) {
                parentMenuObjects.push({
                  roleMappingId: 0,
                  isView: true,
                  isAdd: false,
                  isEdit: false,
                  isDelete: false,
                  isPrint: false,
                  menuId: 1,
                  menuName: 'Parent Menu 1',
                  roleId: null,
                  createdBy: 1,
                  createdDate: '2024-09-03T10:25:12.51',
                  modifiedBy: 1,
                  modifiedDate: '2024-09-03T10:25:12.51',
                  screenName: '',
                });
              }

              if (hasIncidentMenu) {
                parentMenuObjects.push({
                  roleMappingId: 0,
                  isView: true,
                  isAdd: false,
                  isEdit: false,
                  isDelete: false,
                  isPrint: false,
                  menuId: 19,
                  menuName: 'Parent Menu 19',
                  roleId: null,
                  createdBy: 1,
                  createdDate: '2024-09-03T10:25:12.51',
                  modifiedBy: 1,
                  modifiedDate: '2024-09-03T10:25:12.51',
                  screenName: '',
                });
              }
              return [...mappedRoles, ...parentMenuObjects];
            })(),
          },
        }).unwrap();
      } else {
        try {
          response = await triggerAddApplicationRole({
            payload: {
              defaultFacilityId: selectedFacility?.id,
              applicationRole: values.applicationRole,
              isRoleHide: false,
              isDefaultRole: false,
              isDelete: false,
              loginUserId: userDetails?.UserId,
              moduleId: selectedModuleId,
              menuId: selectedMenu?.id,
              applicationRoleMenuMapping: (() => {
                // Map over the roles and generate the main objects
                if (!mainMasterRoles || !incidentRoles) {
                  console.error(
                    'Main master roles or incident roles data is missing.'
                  );
                  return;
                }
                const mappedRoles = [...mainMasterRoles, ...incidentRoles]
                  .filter(
                    ({ MenuId, ParentMenuId }) =>
                      (MenuId >= 2 && MenuId <= 18 && ParentMenuId === 1) || // Include if menuId is between 2-18 and parentMenuId is 1
                      (MenuId >= 20 && MenuId <= 35 && ParentMenuId === 19) // Include if menuId is between 20-35 and parentMenuId is 19
                  )
                  .map(
                    ({
                      isView,
                      isAdd,
                      isEdit,
                      isDelete,
                      isPrint,
                      MenuId,
                      MenuName,
                      RoleId,
                    }) => ({
                      roleMappingId: 0,
                      isView: isView || isAdd || isEdit || isDelete || isPrint,
                      isAdd,
                      isEdit,
                      isDelete,
                      isPrint,
                      menuId: MenuId,
                      menuName: MenuName,
                      roleId: RoleId,
                      createdBy: 1,
                      createdDate: '2024-09-03T10:25:12.51',
                      modifiedBy: 1,
                      modifiedDate: '2024-09-03T10:25:12.51',
                      screenName: MenuName,
                    })
                  );


                const hasMainMasterMenu = mappedRoles.some(
                  (role) =>
                    role.menuId >= 2 &&
                    role.menuId <= 18 &&
                    (role.isView ||
                      role.isEdit ||
                      role.isDelete ||
                      role.isPrint ||
                      role.isAdd)
                );

                const hasIncidentMenu = mappedRoles.some(
                  (role) =>
                    role.menuId >= 20 &&
                    role.menuId <= 35 &&
                    (role.isView ||
                      role.isEdit ||
                      role.isDelete ||
                      role.isPrint ||
                      role.isAdd)
                );

                // Add parent menu objects based on conditions
                const parentMenuObjects = [];
                if (hasMainMasterMenu) {
                  parentMenuObjects.push({
                    roleMappingId: 0,
                    isView: true,
                    isAdd: false,
                    isEdit: false,
                    isDelete: false,
                    isPrint: false,
                    menuId: 1, // Parent menuId 1
                    menuName: 'Parent Menu 1',
                    roleId: null,
                    createdBy: 1,
                    createdDate: '2024-09-03T10:25:12.51',
                    modifiedBy: 1,
                    modifiedDate: '2024-09-03T10:25:12.51',
                    screenName: '',
                  });
                }

                if (hasIncidentMenu) {
                  parentMenuObjects.push({
                    roleMappingId: 0,
                    isView: true,
                    isAdd: false,
                    isEdit: false,
                    isDelete: false,
                    isPrint: false,
                    menuId: 19, // Parent menuId 19
                    menuName: 'Parent Menu 19',
                    roleId: null,
                    createdBy: 1,
                    createdDate: '2024-09-03T10:25:12.51',
                    modifiedBy: 1,
                    modifiedDate: '2024-09-03T10:25:12.51',
                    screenName: '',
                  });
                }
                return [...mappedRoles, ...parentMenuObjects];
              })(),
            },
          }).unwrap();
        } catch (error) {
          console.log({ errormessage: error.message, errorStack: error.stack });
        } finally {
          console.log({ response });
        }
      }

      if (response && response.Message) {
        showToastAlert({
          type: 'custom_success',
          text: response.Message,
          gif: 'SuccessGif'
        });
      }
    } finally {
      resetForm();
      navigate(-1);
    }
  };

  const pageFields = fields?.Data?.Sections?.find(
    (section) => section.SectionName === 'Page'
  )?.Fields;

  useEffect(() => {
    const schemaFields = {};
    pageFields?.forEach((field) => {
      if (field.IsShow && field.IsMandatory) {
        const fieldConfig = pagesConfigData?.find(
          (config) => config.fieldId === field.FieldId
        );
        const translatedLabel = getlabel(
          fieldConfig?.translationId,
          labels,
          i18n.language
        );

        switch (fieldConfig?.name) {
          case 'applicationRole':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
        }
      }
    });
    setValidationSchema(Yup.object().shape(schemaFields));
  }, [pageFields]);

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
          {t('MM_ApplicationRoles')}
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
                      backgroundColor: '#3498db',
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
                    Previous
                  </button>
                  </Tooltip>
                </FlexContainer>

          <StyledTypography
            fontSize="20px"
            fontWeight="600"
            lineHeight="24px"
            textAlign="left"
            color="#205475"
          >
            {id ? t('EditApplicationRole') : t('AddNewApplicationRole')}
          </StyledTypography>
        </FlexContainer>
        <Divider sx={{ marginY: '20px' }} />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnChange={true}
          validateOnMount={true}
          validateOnBlur={true}
          enableReinitialize={true}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, handleChange, setFieldValue }) => {
            useEffect(() => {
              if (applicationRoleData?.Data?.ApplicationRole) {
                setFieldValue(
                  'applicationRole',
                  applicationRoleData?.Data?.ApplicationRole
                );
              }
            }, [applicationRoleData?.Data?.ApplicationRole]);
            return isFetchingFields ||
              isFetchingLabels ||
              isFetchingRoleById ? (
              <FlexContainer justifyContent="center">
                <StyledImage src={LoadingGif} alt="LoadingGif" />
              </FlexContainer>
            ) : (
              <Form>
                <Box
                  sx={{
                    marginBottom: 2,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <FlexContainer
                    padding="10px 0 0 0"
                    gap="20px"
                    alignItems="center"
                  >
                    {pageFields?.map((field) => {
                      const fieldConfig = pagesConfigData.find(
                        (config) => config.fieldId === field.FieldId
                      );
                      const translatedLabel = getlabel(
                        fieldConfig?.translationId,
                        labels,
                        i18n.language
                      );
                      if (field.IsShow && fieldConfig) {
                        return (
                          <>
                            <Label value={translatedLabel} isRequired={true} />
                            <TextField
                              name={fieldConfig.name}
                              slotProps={{
                                htmlInput: { maxLength: fieldConfig.maxLength },
                              }}
                              value={
                                values[fieldConfig.name] ||
                                applicationRoleData?.Data?.ApplicationRole
                              }
                              onChange={handleChange}
                              disabled={id ? true : false}
                            />
                            {errors[fieldConfig.name] &&
                              touched[fieldConfig.name] && (
                                <FlexContainer
                                  style={{ color: 'red', fontSize: '11px' }}
                                >
                                  {errors[fieldConfig.name]}
                                </FlexContainer>
                              )}
                          </>
                        );
                      }
                      return null;
                    })}
                  </FlexContainer>
                </Box>
                <FlexContainer
                  margin="0 0 20px 0"
                  flexDirection="column"
                  gap="20px"
                  height="auto"
                >
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
                        {selectedModuleId === 1
                          ? t('MainMaster')
                          : t('IncidentManagement')}
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
                      <FlexContainer padding="15px">
                        <MainMasterTable
                          applicationRoleData={applicationRoleData}
                        />
                      </FlexContainer>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion sx={{ border: '5px', borderColor: '#0083c0' }}>
                    <AccordionSummary
                      aria-controls="panel2-content"
                      id="panel2-header"
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
                        {t('IncidentManagement')}
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
                      <FlexContainer padding="15px">
                        <IncidentTable
                          applicationRoleData={applicationRoleData}
                        />
                      </FlexContainer>
                    </AccordionDetails>
                  </Accordion>

                  <FlexContainer
                    gap="16px"
                    justifyContent="flex-end"
                    padding="25px 0px 15px 0px"
                  >
                    <CommonStyledButton
                      type="submit"
                      variant="contained"
                      text-color="#0083C0"
                      oncClick={handleSubmit}
                      disabled={!values.applicationRole || !isRoleSelected}
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
                        {id ? t('Update') : t('Submit')}
                      </StyledTypography>
                    </CommonStyledButton>
                    <CommonStyledButton
                      gap="8px"
                      type="button"
                      variant="outlined"
                      onClick={() => navigate('/MainMaster/ApplicationRoles')}
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

export default AddNewRole;
