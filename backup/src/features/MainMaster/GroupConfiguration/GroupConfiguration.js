import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import {
  CommonStyledButton,
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import CommonConfiguration from './Common configuration';
import SMTPMailConfiguration from './SMTPMailConfiguration';
import AzureGraphAPIConfiguration from './AzureGraphAPIConfig';
import ModuleWiseMasterSetup from './ModuleWiseSetup';
import Themes from './Themes';
import {
  useGetGroupConfigDataQuery,
  useUpdateGroupConfigDataMutation,
} from '../../../redux/RTK/groupConfigApi';
import {setGroupConfigData} from '../../../redux/features/mainMaster/groupConfigSlice'
import { useSelector,useDispatch } from 'react-redux';
import DoneIcon from '../../../assets/Icons/DoneIcon.png';
import DoNotDisturbIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../redux/RTK/moduleDataApi';
import * as Yup from 'yup';
import { getlabel } from '../../../utils/language';
import { showToastAlert } from '../../../utils/SweetAlert';
import EditIconWhite from '../../../assets/Icons/EditIconWhite.png';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import useWindowDimension from '../../../hooks/useWindowDimension';

const GroupConfiguration = () => {
  const { t, i18n } = useTranslation();
  const { isMobile } = useWindowDimension();
  const dispatch=useDispatch()

  const [isEditable, setIsEditable] = useState(false);
  const [initialValues, setInitialValues] = useState({
    isGroupwiseMailConfig: '',
    mailType: '',
    mailHostingServer: '',
    mailPortNumber: '',
    enableSSSL: false,
    enableTLS: false,
    applicationID: '',
    clientID: '',
    clientSecret: '',
    headerSkinColor: '',
    sidebarSkinColor: '',
    sessionIdleTime: '',
    staffDemographic: false,
    emailInStaffMasterEntry: false,
    mainMaster: false,
    incidentManagement: false,
  });

  const [isReset, setIsReset] = useState(false);
  const [validationSchema, setValidationSchema] = useState();
  const [roleMenu, setRoleMenu] = useState();
  const { selectedMenu, userDetails, selectedModuleId, selectedFacility, selectedRoleFacility } =
    useSelector((state) => state.auth);    
  const [triggerUpdateGroupConfigData] = useUpdateGroupConfigDataMutation();
  const { data: pageLoadData, isFetching: isPageDataFetching ,refetch} =
    useGetGroupConfigDataQuery({
      menuId: selectedMenu?.id||4,
      loginUserId: userDetails?.UserId,
      headerFacilityId: selectedFacility?.id,
    });
  const groupConfigValue = pageLoadData?.Data?.GroupConfig[0] || {};
  useEffect(() => {
    const configVal = pageLoadData?.Data?.GroupConfig?.[0] || {};
    const mainMasterObj = configVal?.GroupwiseMaster?.find((item) => {
      return item.GroupMasterId === 1;
    });
    const incidentManagementObj = configVal?.GroupwiseMaster?.find((item) => {
      return item.GroupMasterId === 2;
    });

    setInitialValues({
      isGroupwiseMailConfig: configVal?.IsGroupwiseMailConfig || false,
      mailType: configVal?.MailType || '',
      mailHostingServer: configVal?.MailHost || '',
      mailPortNumber: configVal?.MailPortNumber || '',
      enableSSSL: configVal?.EnableSSL || false,
      enableTLS: configVal?.EnableTLS || false,
      applicationID: configVal?.TenantID || '',
      clientID: configVal?.ClientID || '',
      clientSecret: configVal?.ClientSecret || '',
      headerSkinColor: configVal?.HeaderSkinColor || '',
      sidebarSkinColor: configVal?.SidebarSkinColor || '',
      sessionIdleTime: configVal?.SessionIdleTimeInMinutes || 20,
      staffDemographic: configVal?.IsEnableStaffDemographic || false,
      emailInStaffMasterEntry: configVal?.IsSameEmail || false,
      mainMaster: mainMasterObj ? mainMasterObj.DisableGroupwiseMaster : false,
      incidentManagement: incidentManagementObj
        ? incidentManagementObj.DisableGroupwiseMaster
        : false,
    });    
    dispatch(setGroupConfigData(configVal))
  }, [pageLoadData]);

  const handleCancel = () => {
    setIsEditable(false);
  };

  const handleEdit = () => {
    if (!isEditable) {
      setTimeout(() => {
        setIsEditable(true);
      }, 50);
    }
  };

  const pagesConfigData = [
    {
      fieldId: 'GC_P_SessionIdleTime',
      translationId: 'MM_GC_SessionIdleTime',
      component: 'TextField',
      name: 'sessionIdleTime',
    },
    {
      fieldId: 'GC_P_MailType',
      translationId: 'MM_GC_MailType',
      component: 'Dropdown',
      name: 'mailType',
      options: pageLoadData?.Data?.MailTypeList?.map((mailType) => ({
        text: mailType.MailType,
        value: mailType.MailType,
      })),
    },
    {
      fieldId: 'GC_P_EnableSameEmailinStaffMasterEntry',
      translationId: 'MM_GC_EnableSameEmailinStaffMasterEntry',
      component: 'Checkbox',
      name: 'emailInStaffMasterEntry',
    },
    {
      fieldId: 'GC_P_EnableStaffDemographicToAllStaff',
      translationId: 'MM_GC_EnableStaffDemographicToAllStaff',
      component: 'Checkbox',
      name: 'staffDemographic',
    },
    {
      fieldId: 'GC_P_EnableGroupSpecificSMTPMailConfiguration',
      translationId: 'MM_GC_EnableGroupSpecificSMTPMailConfiguration',
      component: 'Checkbox',
      name: 'isGroupwiseMailConfig',
    },
    {
      fieldId: 'GC_P_MailHostingAddress',
      translationId: 'MM_GC_MailHostingAddress',
      component: 'TextField',
      name: 'mailHostingServer',
    },
    {
      fieldId: 'GC_P_MailType',
      translationId: 'MM_GC_MailPortNumber',
      component: 'TextField',
      name: 'mailPortNumber',
    },
    {
      fieldId: 'GC_P_EnableSecureSocketLayer',
      translationId: 'MM_GC_EnableSecureSocketLayer',
      component: 'Checkbox',
      name: 'enableSSSL',
    },
    {
      fieldId: 'GC_P_EnableTransportationSecurity',
      translationId: 'MM_GC_EnableTransportationSecurity',
      component: 'Checkbox',
      name: 'enableTLS',
    },
    {
      fieldId: 'GC_P_ClientID',
      translationId: 'MM_GC_ClientID',
      component: 'TextField',
      name: 'clientID',
    },
    {
      fieldId: 'GC_P_TenantID',
      translationId: 'MM_GC_TenantID',
      component: 'TextField',
      name: 'applicationID',
    },
    {
      fieldId: 'GC_P_ClientSecret',
      translationId: 'MM_GC_ClientSecret',
      component: 'TextField',
      name: 'clientSecret',
    },
  ];

  const { data: fields = [], isFetching: isFieldsFetching } = useGetFieldsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );

  const pageFields = Array.isArray(fields?.Data?.Sections)
    ? fields?.Data?.Sections?.find((section) => section.SectionName === 'Page')
        ?.Fields || []
    : [];

  const { data: labels = [], isFetching: isLabelsFetching } = useGetLabelsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );

  useEffect(() => {
    const schemaFields = {};
    pageFields?.forEach((field) => {
      if (field.IsShow && field?.IsMandatory) {
        const fieldConfig = pagesConfigData?.find(
          (config) => config.fieldId === field.FieldId
        );
        const translatedLabel = getlabel(
          fieldConfig?.translationId,
          labels,
          i18n.language
        );

        switch (fieldConfig?.name) {
          case 'sessionIdleTime':
            schemaFields[fieldConfig?.name] = Yup.number().required(
              `${translatedLabel} is required`
            );
            break;
          case 'mailType':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'emailInStaffMasterEntry':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'staffDemographic':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'isGroupwiseMailConfig':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'mailHostingServer':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'mailPortNumber':
            schemaFields[fieldConfig?.name] = Yup.number()
              .typeError(`${translatedLabel} must be a number`)
              .required(`${translatedLabel} is required`);
            break;
          case 'enableSSSL':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'enableTLS':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'clientID':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'applicationID':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'clientSecret':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
        }
      }
    });
    setValidationSchema(Yup.object().shape(schemaFields));
  }, [pageFields]);

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
    setIsEditable(false);
  }, [selectedRoleFacility, selectedMenu]);

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      validateOnSubmit={true}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        if (!isEditable) {
          setIsEditable(true);
        } else {
          if (groupConfigValue?.GroupId > 0) {
            let response;
            try {
              response = await triggerUpdateGroupConfigData({
                payload: {
                  defaultFacilityId: selectedFacility?.id,
                  groupId: groupConfigValue?.GroupId,
                  groupLogo: '',
                  isGroupwiseMailConfig: values?.isGroupwiseMailConfig,
                  mailType: values?.mailType,
                  mailHost: values?.mailHostingServer,
                  mailPortNumber: values?.mailPortNumber,
                  enableSSL: values?.enableSSSL,
                  enableTLS: values?.enableTLS,
                  tenantID: values?.applicationID,
                  clientID: values?.clientID,
                  clientSecret: values?.clientSecret,
                  headerSkinColor: values?.headerSkinColor,
                  sidebarSkinColor: values?.sidebarSkinColor,
                  hostedURL: '',
                  hostedserverPath: '',
                  sessionIdleTimeInMinutes: values?.sessionIdleTime,
                  isEnableStaffDemographic: values?.staffDemographic,
                  isSameEmail: values?.emailInStaffMasterEntry,
                  createdBy: 0,
                  createdDate: '2024-11-03T13:10:14.861Z',
                  modifiedBy: 0,
                  modifiedDate: '2024-11-03T13:10:14.861Z',
                  screenName: '',
                  homePagePendingTile: true,
                  moduleId: selectedModuleId,
                  menuId: selectedMenu?.id,
                  loginUserId: userDetails?.UserId,
                  groupwiseMaster: groupConfigValue?.GroupwiseMaster?.map(
                    (item) => ({
                      groupMasterId: item.GroupMasterId,
                      groupId: groupConfigValue?.GroupId,
                      moduleId: item.ModuleId,
                      disableGroupwiseMaster:
                        item.ModuleId === 1
                          ? values?.mainMaster
                          : values?.incidentManagement,
                      createdBy: 0,
                      createdDate: '2024-11-03T13:10:14.861Z',
                      modifiedBy: 0,
                      modifiedDate: '2024-11-03T13:10:14.861Z',
                    })
                  ),
                },
              });

              if (response && response.data.Message) {
                showToastAlert({
                  type: 'custom_success',
                  text: response.data.Message,
                  gif: 'SuccessGif'
                });
                setIsEditable(false);
                refetch()
              }
            } catch (error) {
              showToastAlert({
                type: 'custom_error',
                text: 'Error with updating the group config',
                gif: 'InfoGif'
              });
            }
          }
        }
      }}
    >
      {({ handleSubmit: formikHandleSubmit, values, errors, isSubmitting }) => {
        return (
          <form onSubmit={formikHandleSubmit}>
            <FlexContainer width="100%" height="100%" flexDirection="column">
              <FlexContainer
                padding={isMobile ? '10px 0' : '0 0 15px 0'}
                alignItems={isMobile ? 'center' : 'flex-start'}
              >
                <StyledTypography
                  fontSize={isMobile ? '24px' : '36px'}
                  fontWeight="900"
                  lineHeight={isMobile ? '32px' : '44px'}
                  color="#0083C0"
                  textAlign={isMobile ? 'center' : 'left'}
                  whiteSpace={isMobile ? 'normal' : 'nowrap'}
                >
                  {t('MM_GroupConfiguration')}
                </StyledTypography>
              </FlexContainer>

              <FlexContainer
                height="auto"
                width="100%"
                padding="15px 25px 25px 25px"
                borderRadius="8px"
                flexDirection="column"
                backgroundColor="#fff"
                sx={{
                  flexGrow: 1,
                  minHeight: '100px',
                  overflow: 'auto',
                }}
              >
                <FlexContainer
                  margin="0 0 20px 0"
                  flexDirection="column"
                  gap="20px"
                  height="auto"
                >
                  {isPageDataFetching ||
                  isLabelsFetching ||
                  isFieldsFetching ? (
                    <FlexContainer justifyContent="center">
                      <StyledImage src={LoadingGif} alt="LoadingGif" />
                    </FlexContainer>
                  ) : (
                    <>
                      <CommonConfiguration
                        pageLoadData={pageLoadData}
                        isEditable={isEditable}
                      />

                      {values?.mailType === 'SMTP Mail Configuration' &&
                        values?.isGroupwiseMailConfig && (
                          <SMTPMailConfiguration
                            pageLoadData={pageLoadData}
                            isEditable={isEditable}
                            isReset={isReset}
                          />
                        )}

                      {values?.mailType === 'Azure Graph API' && (
                        <AzureGraphAPIConfiguration
                          pageLoadData={pageLoadData}
                          isEditable={isEditable}
                          isReset={isReset}
                        />
                      )}

                      {/* <ModuleWiseMasterSetup
                        isEditable={isEditable}
                        groupConfig={groupConfigValue}
                      /> */}

                      <Themes isEditable={isEditable} />

                      <FlexContainer
                        gap="16px"
                        justifyContent="flex-end"
                        padding="25px 15px 40px 0px"
                        width="100%"
                        flexDirection={isMobile ? 'column' : 'row'}
                      >
                        {isEditable ? (
                          <CommonStyledButton
                            type="submit"
                            variant="contained"
                            sx={{ textColor: '#0083C0' }}
                            startIcon={
                              <StyledImage
                                src={DoneIcon}
                                style={{ marginInlineEnd: 8 }}
                                sx={{
                                  marginBottom: '1px',
                                  color: '#FFFFFF',
                                }}
                              />
                            }
                          >
                            <StyledTypography marginTop="1px" color="#FFFFFF">
                              {isSubmitting ? t('Submitting...') : t('Submit')}
                            </StyledTypography>
                          </CommonStyledButton>
                        ) : (
                          <>
                            {!isEditable && roleMenu?.IsEdit && (
                              <CommonStyledButton
                                type="button"
                                onClick={handleEdit}
                                variant="contained"
                                sx={{ textColor: '#0083C0' }}
                                startIcon={
                                  <StyledImage
                                    src={EditIconWhite}
                                    height="12px"
                                    width="12px"
                                    style={{ marginInlineEnd: 8 }}
                                    sx={{
                                      marginBottom: '1px',
                                      color: '#FFFFFF',
                                    }}
                                  />
                                }
                              >
                                <StyledTypography
                                  marginTop="1px"
                                  color="#FFFFFF"
                                >
                                  {t('Edit')}
                                </StyledTypography>
                              </CommonStyledButton>
                            )}

                            {isEditable && (
                              <CommonStyledButton
                                type="button"
                                variant="outlined"
                                onClick={handleCancel}
                                sx={{ textColor: '#0083C0' }}
                                startIcon={
                                  <StyledImage
                                    src={DoNotDisturbIcon}
                                    style={{ marginInlineEnd: 8 }}
                                    sx={{
                                      marginBottom: '1px',
                                      color: '#0083C0',
                                    }}
                                  />
                                }
                              >
                                <StyledTypography
                                  marginTop="1px"
                                  color="#0083C0"
                                >
                                  {t('Cancel')}
                                </StyledTypography>
                              </CommonStyledButton>
                            )}
                          </>
                        )}
                      </FlexContainer>
                    </>
                  )}
                </FlexContainer>
              </FlexContainer>
            </FlexContainer>
          </form>
        );
      }}
    </Formik>
  );
};

export default GroupConfiguration;
