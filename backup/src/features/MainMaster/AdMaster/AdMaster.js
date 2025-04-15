import { useTranslation } from 'react-i18next';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { Formik, Form, ErrorMessage, Field } from 'formik';
import * as Yup from 'yup';
import {
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Grid,
  InputAdornment,
  TextField,
} from '@mui/material';
import { getlabel } from '../../../utils/language';
import Label from '../../../components/Label/Label';
import MultiSelectDropdown from '../../../components/Dropdown/MultiSelectDropdown';
import { useEffect, useState } from 'react';
import DoneIcon from '../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import EyeIcon from '../../../assets/Icons/EyeIcon.png';
import EyeSlashIcon from '../../../assets/Icons/VisibilityOff.png';
import EditIcon from '../../../assets/Icons/EditIconWhite.png';
import { useSelector } from 'react-redux';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../redux/RTK/moduleDataApi';
import NotifyStaffDataTable from './NotifyStaffDataTable';
import AzureCredentialsDataTable from './AzureCredentialsDataTable';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import {
  useAddADConfigurationMutation,
  useGetADConfigurationDetailsQuery,
  useUpdateADConfigurationMutation,
} from '../../../redux/RTK/adMasterApi';
import { showToastAlert } from '../../../utils/SweetAlert';
import { checkAccess } from '../../../utils/Auth';
import { Box } from '@mui/system';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';

const AdMaster = () => {
  //* Selectors
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    selectedRoleFacility,
    isSuperAdmin,
    roleFacilities,
  } = useSelector((state) => state.auth);

  //* State variables
  const [isEdit, setIsEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showWindowsPassword, setShowWindowsPassword] = useState(false);
  const [showNotifyStaffTable, setShowNotifyStaffTable] = useState(false);
  const [showClientSecretField, setShowClientSecretField] = useState(false);
  const [adMasterFields, setAdMasterFields] = useState([]);
  const [notifyStaffList, setNotifyStaffList] = useState([]);
  const [azureCredentialsList, setAzureCredentialsList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [facilityList, setFacilityList] = useState([]);
  const [roleMenu, setRoleMenu] = useState();
  const [showAzureCredentialsTable, setShowAzureCredentialsTable] =
    useState(false);
  const [adMasterInitialValues, setAdMasterInitialValues] = useState({
    adRequired: '',
    adIdentityProvider: '',
    dataSyncRequired: '',
    postLogoutURL: '',
    enableADSyncErrorEmailNotification: false,
    windowsUserName: '',
    windowsUserPassword: '',
    windowsAttributes: '',
    azureAttributes: '',
    mailID: '',
    password: '',
  });

  //* Hooks declaration
  const { t, i18n } = useTranslation();

  //* RTK Queries
  const { data: labels = [] } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });
  const [triggerAddAdMasterDetails] = useAddADConfigurationMutation();
  const [triggerUpdateAdMasterDetails] = useUpdateADConfigurationMutation();

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
    setIsEdit(false);
  }, [selectedRoleFacility, selectedMenu]);

  const { data: fields = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  const pageFields = fields?.Data?.Sections?.find(
    (section) => section?.SectionName === 'Page'
  )?.Fields;

  //* Ad Master fields validation
  const adMasterValidation = Yup.object().shape({
    adRequired: Yup.string().required(
      `${getlabel('MM_AM_ADRequired', labels, i18n.language)} ${t('IsRequired')}`
    ),
    enableADSyncErrorEmailNotification: Yup.boolean(),
    adIdentityProvider: Yup.string().when('adRequired', {
      is: (adRequired) =>
        adRequired === 'yes' &&
        pageFields?.find((x) => x.FieldId === 'AM_P_ADIdentityProvider')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_AM_ADIdentityProvider', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    dataSyncRequired: Yup.string().when('adIdentityProvider', {
      is: (value) =>
        (value === 'windows' || value === 'azure') &&
        pageFields?.find((x) => x.FieldId === 'AM_P_DataSyncRequired')
          ?.IsMandatory,
      then: (schema) => {
        return schema.required(
          `${getlabel('MM_AM_DataSyncRequired', labels, i18n.language)} ${t('IsRequired')}`
        );
      },
      otherwise: (schema) => {
        return schema.notRequired();
      },
    }),
    windowsUserName: Yup.string().when(
      ['adIdentityProvider', 'dataSyncRequired'],
      {
        is: (adIdentityProvider, dataSyncRequired) =>
          adIdentityProvider === 'windows' &&
          dataSyncRequired === 'yes' &&
          pageFields?.find((x) => x.FieldId === 'AM_P_WindowsUserName')
            ?.IsMandatory,
        then: (schema) =>
          schema.required(
            `${getlabel('MM_AM_WindowsUserName', labels, i18n.language)} ${t('IsRequired')}`
          ),
        otherwise: (schema) => schema.notRequired(),
      }
    ),
    windowsUserPassword: Yup.string().when(
      ['adIdentityProvider', 'dataSyncRequired'],
      {
        is: (adIdentityProvider, dataSyncRequired) =>
          adIdentityProvider === 'windows' &&
          dataSyncRequired === 'yes' &&
          pageFields?.find((x) => x.FieldId === 'AM_P_WindowsUserPassword')
            ?.IsMandatory,
        then: (schema) =>
          schema.required(
            `${getlabel('MM_AM_WindowsUserPassword', labels, i18n.language)} ${t('IsRequired')}`
          ),
        otherwise: (schema) => schema.notRequired(),
      }
    ),
    mailID: Yup.string().when('enableADSyncErrorEmailNotification', {
      is:
        true &&
        pageFields?.find((x) => x.FieldId === 'AM_P_MailId')?.IsMandatory,
      then: (schema) =>
        schema
          .email(t('InvalidEmailFormat'))
          .required(
            `${getlabel('MM_AM_MailId', labels, i18n.language)} ${t('IsRequired')}`
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    password: Yup.string().when('enableADSyncErrorEmailNotification', {
      is:
        true &&
        pageFields?.find((x) => x.FieldId === 'AM_P_Password')?.IsMandatory,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_AM_Password', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    windowsAttributes: Yup.array().when(
      ['adIdentityProvider', 'dataSyncRequired'],
      {
        is: (adIdentityProvider, dataSyncRequired) =>
          adIdentityProvider === 'windows' &&
          dataSyncRequired === 'yes' &&
          pageFields?.find((x) => x.FieldId === 'AM_P_WindowsAttributes')
            ?.IsMandatory,
        then: (schema) =>
          schema
            .required(
              `${getlabel('MM_AM_WindowsAttributes', labels, i18n.language)} ${t('IsRequired')}`
            )
            .min(1, t('AtLeastOneValueShouldBeSelected')),
        otherwise: (schema) => schema.notRequired(),
      }
    ),
    azureAttributes: Yup.array().when(
      ['adIdentityProvider', 'dataSyncRequired'],
      {
        is: (adIdentityProvider, dataSyncRequired) =>
          adIdentityProvider === 'azure' &&
          dataSyncRequired === 'yes' &&
          pageFields?.find((x) => x.FieldId === 'AM_P_AzureAttributes')
            ?.IsMandatory,
        then: (schema) =>
          schema
            .required(
              `${getlabel('MM_AM_AzureAttributes', labels, i18n.language)} ${t('IsRequired')}`
            )
            .min(1, t('AtLeastOneValueShouldBeSelected')),
        otherwise: (schema) => schema.notRequired(),
      }
    ),
  });

  //* Get Ad Master page details
  const {
    data: adMasterData,
    isFetching,
    refetch,
  } = useGetADConfigurationDetailsQuery({
    payload: {
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
      headerFacilityId: selectedFacility?.id,
      moduleId: selectedModuleId,
    },
  });

  useEffect(() => {
    if (adMasterData?.Records) {
      setAdMasterInitialValues({
        adRequired: adMasterData?.Records?.ADRequired ? 'yes' : 'no',
        adIdentityProvider:
          adMasterData?.Records?.ADIdentityProvider?.toLowerCase(),
        dataSyncRequired: adMasterData?.Records?.DataSyncRequired
          ? 'yes'
          : 'no',
        postLogoutURL: adMasterData?.Records?.PostLogoutURL,
        enableADSyncErrorEmailNotification:
          adMasterData?.Records?.IsADSyncErrorMailSend,
        windowsUserName: adMasterData?.Records?.WindowsUserName,
        windowsUserPassword: adMasterData?.Records?.WindowsUserPassword,
        windowsAttributes: adMasterData?.Records?.ClientAttributes?.filter(
          (attribute) =>
            attribute?.ADIdentityProvider === 'Windows' &&
            attribute?.IsRequiredByClient
        ).map((attribute) => attribute.ClientAttributesId),
        azureAttributes: adMasterData?.Records?.ClientAttributes?.filter(
          (attribute) =>
            attribute?.ADIdentityProvider === 'Azure' &&
            attribute?.IsRequiredByClient
        ).map((attribute) => attribute.ClientAttributesId),
        mailID: adMasterData?.Records?.MailId,
        password: adMasterData?.Records?.MailPassword,
      });
      setNotifyStaffList(adMasterData?.Records?.DataSyncNotifiedStaffs);
      setAzureCredentialsList(
        adMasterData?.Records?.AzureADConfiguration?.map((credential) => ({
          companyName: adMasterData?.Records?.CompanyList?.filter(
            (x) => x.CompanyId === credential.CompanyId
          )[0]?.CompanyName,
          tenantId: credential.TenantId,
          clientId: credential.ClientId,
          clientSecret: credential.ClientSecret,
          companyId: credential.CompanyId,
        }))
      );
      setCompanyList(
        adMasterData?.Records?.CompanyList?.map((company) => ({
          text: company.CompanyName,
          value: company.CompanyId,
        }))
      );
      setFacilityList(
        adMasterData?.Records?.FacilityList?.filter((facility) => {
          if (isSuperAdmin) return true;
          const facilityItem = roleFacilities?.find(
            (role) => role.FacilityId === facility.FacilityId
          )?.Menu?.[selectedMenu?.id];
          return facilityItem?.IsAdd;
        }).map((facility) => ({
          text: facility.FacilityName,
          value: facility.FacilityId,
        }))
      );
      setAdMasterFields([
        {
          fieldId: 'adRequired',
          translationId: 'MM_AM_ADRequired',
          label: 'AD Required',
          component: 'Dropdown',
          name: 'adRequired',
          isShow: pageFields?.find((x) => x.FieldId === 'AM_P_ADRequired')
            ?.IsShow,
          isRequired: pageFields?.find((x) => x.FieldId === 'AM_P_ADRequired')
            ?.IsMandatory,
          isDisabled: false,
          options: [
            {
              text: 'Yes',
              value: 'yes',
            },
            {
              text: 'No',
              value: 'no',
            },
          ],
        },
        {
          fieldId: 'adIdentityProvider',
          translationId: 'MM_AM_ADIdentityProvider',
          label: 'AD Identity Provider',
          component: 'Dropdown',
          name: 'adIdentityProvider',
          isShow: pageFields?.find(
            (x) => x.FieldId === 'AM_P_ADIdentityProvider'
          )?.IsShow,
          isRequired: pageFields?.find(
            (x) => x.FieldId === 'AM_P_ADIdentityProvider'
          )?.IsMandatory,
          isDisabled: true,
          options: [
            {
              text: 'Windows',
              value: 'windows',
            },
            {
              text: 'Azure',
              value: 'azure',
            },
          ],
        },
        {
          fieldId: 'dataSyncRequired',
          translationId: 'MM_AM_DataSyncRequired',
          label: 'Data Sync Required',
          component: 'Dropdown',
          name: 'dataSyncRequired',
          isShow: pageFields?.find((x) => x.FieldId === 'AM_P_DataSyncRequired')
            ?.IsShow,
          isRequired: pageFields?.find(
            (x) => x.FieldId === 'AM_P_DataSyncRequired'
          )?.IsMandatory,
          isDisabled: true,
          options: [
            {
              text: 'Yes',
              value: 'yes',
            },
            {
              text: 'No',
              value: 'no',
            },
          ],
        },
        {
          fieldId: 'postLogoutURL',
          translationId: 'MM_AM_PostLogoutURL',
          label: 'Post Logout URL',
          component: 'TextField',
          name: 'postLogoutURL',
          maxLength: 200,
          isShow: pageFields?.find((x) => x.FieldId === 'AM_P_PostLogoutURL')
            ?.IsShow,
          isRequired: pageFields?.find(
            (x) => x.FieldId === 'AM_P_PostLogoutURL'
          )?.IsMandatory,
          isDisabled: true,
        },
        {
          fieldId: 'windowsUserName',
          translationId: 'MM_AM_WindowsUserName',
          label: 'Windows User Name',
          component: 'TextField',
          name: 'windowsUserName',
          maxLength: 100,
          isShow: pageFields?.find((x) => x.FieldId === 'AM_P_WindowsUserName')
            ?.IsShow,
          isRequired: pageFields?.find(
            (x) => x.FieldId === 'AM_P_WindowsUserName'
          )?.IsMandatory,
          isDisabled: false,
        },
        {
          fieldId: 'windowsUserPassword',
          translationId: 'MM_AM_WindowsUserPassword',
          label: 'Windows User Password',
          component: 'Password',
          name: 'windowsUserPassword',
          maxLength: 20,
          isShow: pageFields?.find(
            (x) => x.FieldId === 'AM_P_WindowsUserPassword'
          )?.IsShow,
          isRequired: pageFields?.find(
            (x) => x.FieldId === 'AM_P_WindowsUserPassword'
          )?.IsMandatory,
          isDisabled: false,
        },
        {
          fieldId: 'windowsAttributes',
          translationId: 'MM_AM_WindowsAttributes',
          label: 'Windows Attributes',
          component: 'MultiSelect',
          name: 'windowsAttributes',
          isShow: pageFields?.find(
            (x) => x.FieldId === 'AM_P_WindowsAttributes'
          )?.IsShow,
          isRequired: pageFields?.find(
            (x) => x.FieldId === 'AM_P_WindowsAttributes'
          )?.IsMandatory,
          isDisabled: false,
          options: adMasterData?.Records?.ClientAttributes?.filter(
            (attribute) => attribute?.ADIdentityProvider === 'Windows'
          ).map((attribute) => ({
            text: attribute.DisplayName,
            value: attribute.ClientAttributesId,
          })),
        },
        {
          fieldId: 'azureAttributes',
          translationId: 'MM_AM_AzureAttributes',
          label: 'Azure Attributes',
          component: 'MultiSelect',
          name: 'azureAttributes',
          isShow: pageFields?.find((x) => x.FieldId === 'AM_P_AzureAttributes')
            ?.IsShow,
          isRequired: pageFields?.find(
            (x) => x.FieldId === 'AM_P_AzureAttributes'
          )?.IsMandatory,
          isDisabled: false,
          options: adMasterData?.Records?.ClientAttributes?.filter(
            (attribute) => attribute?.ADIdentityProvider === 'Azure'
          ).map((attribute) => ({
            text: attribute.DisplayName,
            value: attribute.ClientAttributesId,
          })),
        },
        {
          fieldId: 'enableADSyncErrorEmailNotification',
          translationId: 'MM_AM_EnableEmailNotificationforDataSyncError',
          component: 'Checkbox',
          name: 'enableADSyncErrorEmailNotification',
          isShow: pageFields?.find(
            (x) => x.FieldId === 'AM_P_EnableEmailNotificationforDataSyncError'
          )?.IsShow,
          isRequired: pageFields?.find(
            (x) => x.FieldId === 'AM_P_EnableEmailNotificationforDataSyncError'
          )?.IsMandatory,
          isDisabled: false,
        },
        {
          fieldId: 'mailID',
          translationId: 'MM_AM_MailId',
          label: 'Mail ID',
          component: 'TextField',
          name: 'mailID',
          maxLength: 50,
          isShow: pageFields?.find((x) => x.FieldId === 'AM_P_MailId')?.IsShow,
          isRequired: pageFields?.find((x) => x.FieldId === 'AM_P_MailId')
            ?.IsMandatory,
          isDisabled: false,
        },
        {
          fieldId: 'password',
          translationId: 'MM_AM_Password',
          label: 'Password',
          component: 'Password',
          name: 'password',
          maxLength: 50,
          isShow: pageFields?.find((x) => x.FieldId === 'AM_P_Password')
            ?.IsShow,
          isRequired: pageFields?.find((x) => x.FieldId === 'AM_P_Password')
            ?.IsMandatory,
          isDisabled: false,
        },
      ]);
    }
  }, [adMasterData]);

  //* Submit ad master details
  const handleSubmit = async (values) => {
    try {
      let response;
      if (
        values?.adRequired === 'yes' &&
        values.adIdentityProvider === 'azure' &&
        (values?.dataSyncRequired === 'yes' ||
          values?.dataSyncRequired === 'no') &&
        azureCredentialsList.length === 0
      ) {
        showToastAlert({
          type: 'custom_info',
          text: 'Enter Azure Credentials',
        });
      } else if (
        values?.adRequired === 'yes' &&
        (values.adIdentityProvider === 'windows' ||
          values.adIdentityProvider === 'azure') &&
        values?.dataSyncRequired === 'yes' &&
        values.enableADSyncErrorEmailNotification &&
        notifyStaffList.length === 0
      ) {
        showToastAlert({
          type: 'custom_info',
          text: 'Select staff ',
          gif: 'InfoGif'
        });
      } else if (
        notifyStaffList.length !== 0 &&
        !notifyStaffList[notifyStaffList.length - 1].UserName &&
        !notifyStaffList[notifyStaffList.length - 1].Department &&
        !notifyStaffList[notifyStaffList.length - 1].Designation
      ) {
        showToastAlert({
          type: 'custom_info',
          text: `Select staff at line number ${notifyStaffList.length}`,
        });
      } else {
        if (adMasterData?.Records?.ADConfigurationId) {
          let clientAttributesReset =
            adMasterData?.Records?.ClientAttributes?.map((attribute) => {
              return { ...attribute, IsRequiredByClient: false };
            });
          clientAttributesReset = clientAttributesReset?.map((attribute) => {
            if (
              values?.windowsAttributes.includes(attribute.ClientAttributesId)
            ) {
              return { ...attribute, IsRequiredByClient: true };
            } else {
              return { ...attribute };
            }
          });
          clientAttributesReset = clientAttributesReset?.map((attribute) => {
            if (
              values?.azureAttributes.includes(attribute.ClientAttributesId)
            ) {
              return { ...attribute, IsRequiredByClient: true };
            } else {
              return { ...attribute };
            }
          });

          response = await triggerUpdateAdMasterDetails({
            payload: {
              adConfigurationId: adMasterData?.Records?.ADConfigurationId,
              adRequired: values?.adRequired === 'yes',
              adIdentityProvider:
                values?.adIdentityProvider === 'windows'
                  ? 'Windows'
                  : values?.adIdentityProvider === 'azure'
                    ? 'Azure'
                    : null,
              postLogoutURL: values?.postLogoutURL,
              windowsUserName: values?.windowsUserName,
              windowsUserPassword: values?.windowsUserPassword,
              dataSyncRequired: values?.dataSyncRequired === 'yes',
              mailId: values?.enableADSyncErrorEmailNotification
                ? values?.mailID
                : '',
              mailPassword: values?.enableADSyncErrorEmailNotification
                ? values?.password
                : '',
              isADSyncErrorMailSend: values?.enableADSyncErrorEmailNotification,
              dataSyncNotifiedStaffs: notifyStaffList,
              moduleId: selectedModuleId,
              menuId: selectedMenu?.id,
              loginUserId: userDetails?.UserId,
              clientAttributes: clientAttributesReset,
              azureADConfiguration: azureCredentialsList,
              facilityId: selectedFacility?.id,
            },
          });
        } else {
          response = await triggerAddAdMasterDetails({
            payload: {
              adRequired: values?.adRequired === 'yes',
              adIdentityProvider:
                values?.adIdentityProvider === 'windows'
                  ? 'Windows'
                  : values?.adIdentityProvider === 'azure'
                    ? 'Azure'
                    : null,
              postLogoutURL: values?.postLogoutURL,
              windowsUserName: values?.windowsUserName,
              windowsUserPassword: values?.windowsUserPassword,
              dataSyncRequired: values?.dataSyncRequired === 'yes',
              mailId: values?.enableADSyncErrorEmailNotification
                ? values?.mailID
                : '',
              mailPassword: values?.enableADSyncErrorEmailNotification
                ? values?.password
                : '',
              isADSyncErrorMailSend: values?.enableADSyncErrorEmailNotification,
              dataSyncNotifiedStaffs: notifyStaffList,
              moduleId: selectedModuleId,
              menuId: selectedMenu?.id,
              loginUserId: userDetails?.UserId,
              clientAttributes: clientAttributesReset,
              azureADConfiguration: azureCredentialsList,
              facilityId: selectedFacility?.id,
            },
          });
        }

        if (response && response?.data?.Message !== 'Record Already Exist') {
          showToastAlert({
            type: 'custom_success',
            text: response?.data?.Message,
            gif: 'SuccessGif'
          });
          
        }
        if (response && response?.data?.Message === 'Record Already Exist') {
          showToastAlert({
            type: 'custom_info',
            text: response?.data?.Message,
            gif: 'InfoGif'
          });
        }
        refetch();
        setIsEdit(false);
      }
    } catch (error) {
      console.error('Failed to add/update admaster details', error);
    }
  };

  return (
    <FlexContainer width="100%" height="100%" flexDirection="column">
      <FlexContainer
        style={{ paddingBottom: '15px' }}
      >
        <StyledTypography
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
          sx={{
            fontSize: {
              xs: '1.5rem',
              sm: '1.75rem',
              md: '2rem',
              lg: '2.25rem',
            },
          }}
        >
          {t('MM_ADMaster')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer
        width="100%"
        height="100%"
        flexDirection="column"
        style={{ backgroundColor: '#ffffff', borderRadius: '10px' }}
      >
        <Box
          sx={{
            width: '100%',
            height: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2rem' },
          }}
        >
          {isFetching ? (
            <FlexContainer
              justifyContent="center"
              alignItems="center"
              height="100%"
              width="100%"
              position="absolute"
              style={{ top: '0', left: '0' }}
            >
              <StyledImage src={LoadingGif} alt="LoadingGif" />
            </FlexContainer>
          ) : (
            <Formik
              enableReinitialize={true}
              initialValues={adMasterInitialValues}
              validationSchema={adMasterValidation}
              onSubmit={(values) => {
                handleSubmit(values);
              }}
            >
              {({ values, resetForm, setFieldValue }) => {
                useEffect(() => {
                  const {
                    adRequired,
                    adIdentityProvider,
                    dataSyncRequired,
                    enableADSyncErrorEmailNotification,
                  } = values;
                  if (adRequired === 'yes') {
                    setAdMasterFields((prevFields) =>
                      prevFields.map((field) =>
                        field.name === 'adIdentityProvider'
                          ? { ...field, isDisabled: false }
                          : field
                      )
                    );

                    if (adIdentityProvider) {
                      setAdMasterFields((prevFields) =>
                        prevFields.map((field) =>
                          field.name === 'dataSyncRequired'
                            ? { ...field, isDisabled: false }
                            : field
                        )
                      );
                    }
                  }
                  if (adRequired === 'no') {
                    values.adIdentityProvider = '';
                    values.dataSyncRequired = '';
                    values.enableADSyncErrorEmailNotification = false;
                    setAdMasterFields((prevFields) =>
                      prevFields.map((field) =>
                        field.name === 'adIdentityProvider' ||
                        field.name === 'dataSyncRequired'
                          ? { ...field, isDisabled: true }
                          : field
                      )
                    );
                    setAdMasterFields((prevFields) =>
                      prevFields.map((field) =>
                        field.name === 'windowsUserName' ||
                        field.name === 'windowsUserPassword' ||
                        field.name === 'windowsAttributes' ||
                        field.name === 'azureAttributes' ||
                        field.name === 'mailId' ||
                        field.name === 'password' ||
                        field.name === 'enableADSyncErrorEmailNotification'
                          ? { ...field, isShow: false }
                          : field
                      )
                    );
                    setShowAzureCredentialsTable(false);
                    setShowNotifyStaffTable(false);
                    setAzureCredentialsList([]);
                    setNotifyStaffList([]);
                  }

                  if (adIdentityProvider === 'windows' && adRequired !== 'no') {
                    setAdMasterFields((prevFields) =>
                      prevFields.map((field) =>
                        field.name === 'azureAttributes'
                          ? { ...field, isShow: false }
                          : field
                      )
                    );
                    setShowAzureCredentialsTable(false);
                  }
                  if (
                    adIdentityProvider === 'azure' &&
                    dataSyncRequired &&
                    adRequired !== 'no'
                  ) {
                    setAdMasterFields((prevFields) =>
                      prevFields.map((field) =>
                        field.name === 'windowsUserName' ||
                        field.name === 'windowsUserPassword' ||
                        field.name === 'windowsAttributes' ||
                        field.name === 'enableADSyncErrorEmailNotification'
                          ? { ...field, isShow: false }
                          : field
                      )
                    );
                    setShowAzureCredentialsTable(true);
                  }
                  if (
                    adIdentityProvider === 'azure' &&
                    !dataSyncRequired &&
                    adRequired !== 'no'
                  ) {
                    setAdMasterFields((prevFields) =>
                      prevFields.map((field) =>
                        field.name === 'windowsUserName' ||
                        field.name === 'windowsUserPassword' ||
                        field.name === 'windowsAttributes' ||
                        field.name === 'enableADSyncErrorEmailNotification'
                          ? { ...field, isShow: false }
                          : field
                      )
                    );
                    setShowAzureCredentialsTable(false);
                    setAzureCredentialsList([]);
                  }
                  if (
                    adIdentityProvider === 'windows' &&
                    dataSyncRequired === 'yes' &&
                    adRequired !== 'no'
                  ) {
                    setAdMasterFields((prevFields) =>
                      prevFields.map((field) =>
                        field.name === 'windowsUserName' ||
                        field.name === 'windowsUserPassword' ||
                        field.name === 'windowsAttributes' ||
                        field.name === 'enableADSyncErrorEmailNotification'
                          ? { ...field, isShow: true }
                          : field
                      )
                    );
                    setAdMasterFields((prevFields) =>
                      prevFields.map((field) =>
                        field.name === 'azureAttributes'
                          ? { ...field, isShow: false }
                          : field
                      )
                    );
                    setAzureCredentialsList([]);
                    setShowAzureCredentialsTable(false);
                  }
                  if (
                    adIdentityProvider === 'azure' &&
                    dataSyncRequired === 'yes' &&
                    adRequired !== 'no'
                  ) {
                    setAdMasterFields((prevFields) =>
                      prevFields.map((field) =>
                        field.name === 'windowsUserName' ||
                        field.name === 'windowsUserPassword' ||
                        field.name === 'windowsAttributes'
                          ? { ...field, isShow: false }
                          : field
                      )
                    );
                    setAdMasterFields((prevFields) =>
                      prevFields.map((field) =>
                        field.name === 'enableADSyncErrorEmailNotification' ||
                        field.name === 'azureAttributes'
                          ? { ...field, isShow: true }
                          : field
                      )
                    );
                    setShowAzureCredentialsTable(true);
                    setShowClientSecretField(true);
                  }
                  if (
                    adIdentityProvider === 'azure' &&
                    dataSyncRequired === 'no' &&
                    adRequired !== 'no'
                  ) {
                    values.enableADSyncErrorEmailNotification = false;
                    setAdMasterFields((prevFields) =>
                      prevFields.map((field) =>
                        field.name === 'windowsUserName' ||
                        field.name === 'windowsUserPassword' ||
                        field.name === 'windowsAttributes' ||
                        field.name === 'clientSecret' ||
                        field.name === 'enableADSyncErrorEmailNotification' ||
                        field.name === 'mailID' ||
                        field.name === 'password' ||
                        field.name === 'azureAttributes'
                          ? { ...field, isShow: false }
                          : field
                      )
                    );
                    setShowNotifyStaffTable(true);
                    setShowClientSecretField(false);
                    setNotifyStaffList([]);
                  }
                  if (
                    dataSyncRequired === 'no' &&
                    adIdentityProvider === 'windows' &&
                    adRequired !== 'no'
                  ) {
                    values.enableADSyncErrorEmailNotification = false;
                    setAdMasterFields((prevFields) =>
                      prevFields.map((field) =>
                        field.name === 'windowsUserName' ||
                        field.name === 'windowsUserPassword' ||
                        field.name === 'windowsAttributes' ||
                        field.name === 'enableADSyncErrorEmailNotification' ||
                        field.name === 'mailID' ||
                        field.name === 'password'
                          ? { ...field, isShow: false }
                          : field
                      )
                    );
                    setShowNotifyStaffTable(false);
                    setNotifyStaffList([]);
                    setAzureCredentialsList([]);
                    setShowAzureCredentialsTable(false);
                    setShowClientSecretField(false);
                  }

                  if (enableADSyncErrorEmailNotification) {
                    setAdMasterFields((prevFields) =>
                      prevFields.map((field) =>
                        field.name === 'mailID' || field.name === 'password'
                          ? { ...field, isShow: true }
                          : field
                      )
                    );
                    setShowNotifyStaffTable(true);
                  }

                  if (
                    !enableADSyncErrorEmailNotification ||
                    adRequired === 'no'
                  ) {
                    setAdMasterFields((prevFields) =>
                      prevFields.map((field) =>
                        field.name === 'mailID' || field.name === 'password'
                          ? { ...field, isShow: false }
                          : field
                      )
                    );
                    setShowNotifyStaffTable(false);
                    setNotifyStaffList([]);
                  }
                }, [values]);
                return (
                  <Form>
                    <Grid
                      container
                      spacing={2}
                      display={'flex'}
                      alignItems={'flex-start'}
                    >
                      {adMasterFields.map((element) => {
                        const translatedLabel = getlabel(
                          element?.translationId,
                          labels,
                          i18n.language
                        );
                        return (
                          <>
                            {element.component === 'Dropdown' &&
                              element.isShow && (
                                <>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    padding={'10px'}
                                    md={4}
                                    lg={3}
                                    key={element.fieldId}
                                  >
                                    <Label
                                      value={translatedLabel}
                                      isRequired={element.isRequired}
                                    />

                                    <SearchDropdown
                                      disableClearable={true}
                                      name={element.name}
                                      options={[
                                        { text: 'Select', value: '' },
                                        ...(element.options || []),
                                      ]}
                                      getOptionLabel={(option) => option.text}
                                      disabled={!isEdit || element.isDisabled}
                                      dir={
                                        i18n.language === 'ar' ? 'rtl' : 'ltr'
                                      }
                                      sx={{
                                        '& .MuiAutocomplete-inputRoot': {
                                          fontSize: '13px',
                                          height: '100%',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                          height: '34px',
                                          '& .MuiAutocomplete-input': {
                                            height: '34px',
                                            fontSize: '13px',
                                          },
                                        },
                                      }}
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          variant="outlined"
                                          placeholder="Select"
                                        />
                                      )}
                                      ListboxProps={{
                                        sx: {
                                          '& .MuiAutocomplete-option': {
                                            fontSize: '13px',
                                            minHeight: '30px',
                                            display: 'flex',
                                            alignItems: 'center',
                                          },
                                        },
                                      }}
                                      value={
                                        element?.options?.find(
                                          (option) =>
                                            option.value ===
                                            values[element.name]
                                        ) || null
                                      }
                                      onChange={(event, value) => {
                                        setFieldValue(
                                          element.name,
                                          value?.value
                                        );
                                      }}
                                    />
                                    <ErrorMessage
                                      name={element.name}
                                      component="div"
                                      style={{
                                        color: 'red',
                                        fontSize: '12px',
                                        marginTop: '4px',
                                      }}
                                    />
                                  </Grid>
                                </>
                              )}
                            {element.component === 'MultiSelect' &&
                              element.isShow && (
                                <>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    padding={'10px'}
                                    md={4}
                                    lg={3}
                                    key={element.fieldId}
                                  >
                                    <Label
                                      value={translatedLabel}
                                      isRequired={element.isRequired}
                                    />
                                    <MultiSelectDropdown
                                      name={element.name}
                                      options={element.options}
                                      required={element.IsMandatory}
                                      disabled={!isEdit}
                                    />
                                    <ErrorMessage
                                      name={element.name}
                                      component="div"
                                      style={{
                                        color: 'red',
                                        fontSize: '12px',
                                        marginTop: '4px',
                                      }}
                                    />
                                  </Grid>
                                </>
                              )}
                            {element.component === 'TextField' &&
                              element.isShow && (
                                <>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    padding={'10px'}
                                    md={4}
                                    lg={3}
                                    key={element.fieldId}
                                  >
                                    <Label
                                      value={translatedLabel}
                                      isRequired={element.isRequired}
                                    />
                                    <Field name={element.name}>
                                      {({ field }) => (
                                        <>
                                          {element.name === 'postLogoutURL' && (
                                            <TextField
                                              {...field}
                                              name={element.name}
                                              id={element.fieldId}
                                              autoComplete="off"
                                              value={values[element.name]}
                                              fullWidth={true}
                                              disabled={
                                                field.name === 'postLogoutURL'
                                              }
                                              slotProps={{
                                                htmlInput: {
                                                  maxLength: element.maxLength,
                                                },
                                              }}
                                            />
                                          )}
                                          {element.name !== 'postLogoutURL' && (
                                            <TextField
                                              {...field}
                                              name={element.name}
                                              id={element.fieldId}
                                              autoComplete="off"
                                              value={values[element.name]}
                                              fullWidth={true}
                                              disabled={!isEdit}
                                              slotProps={{
                                                htmlInput: {
                                                  maxLength: element.maxLength,
                                                },
                                              }}
                                            />
                                          )}
                                        </>
                                      )}
                                    </Field>
                                    <ErrorMessage
                                      name={element.name}
                                      component="div"
                                      style={{
                                        color: 'red',
                                        fontSize: '12px',
                                        marginTop: '4px',
                                      }}
                                    />
                                  </Grid>
                                </>
                              )}
                            {element.component === 'Checkbox' &&
                              element.isShow && (
                                <>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    padding={'10px'}
                                    md={4}
                                    lg={3}
                                    key={element.fieldId}
                                    alignSelf={'center'}
                                  >
                                    <FormControlLabel
                                      slotProps={{
                                        typography: {
                                          style: {
                                            fontSize: '12px',
                                          },
                                        },
                                      }}
                                      disabled={!isEdit}
                                      control={
                                        <Checkbox
                                          name={element.name}
                                          size="small"
                                          checked={
                                            values?.enableADSyncErrorEmailNotification
                                          }
                                        />
                                      }
                                      label={translatedLabel}
                                      onChange={(e) => {
                                        setFieldValue(
                                          element.name,
                                          e.target.checked
                                        );
                                      }}
                                    />
                                    <ErrorMessage
                                      name={element.name}
                                      component="div"
                                      style={{
                                        color: 'red',
                                        fontSize: '12px',
                                        marginTop: '4px',
                                      }}
                                    />
                                  </Grid>
                                </>
                              )}
                            {element.component === 'Password' &&
                              element.isShow && (
                                <>
                                  <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    padding={'10px'}
                                    md={4}
                                    lg={3}
                                    key={element.fieldId}
                                  >
                                    <Label
                                      value={translatedLabel}
                                      isRequired={element.isRequired}
                                    />
                                    <Field name={element.name}>
                                      {({ field }) => (
                                        <TextField
                                          {...field}
                                          name={element.name}
                                          variant="outlined"
                                          value={values[element.name]}
                                          autoComplete="off"
                                          disabled={!isEdit}
                                          slotProps={{
                                            htmlInput: {
                                              maxLength: element.maxLength,
                                            },
                                          }}
                                          type={
                                            field.name === 'windowsUserPassword'
                                              ? showWindowsPassword
                                                ? 'text'
                                                : 'password'
                                              : showPassword
                                                ? 'text'
                                                : 'password'
                                          }
                                          fullWidth={true}
                                          InputProps={{
                                            endAdornment: (
                                              <InputAdornment position="end">
                                                <img
                                                  src={
                                                    field.name ===
                                                    'windowsUserPassword'
                                                      ? showWindowsPassword
                                                        ? EyeSlashIcon
                                                        : EyeIcon
                                                      : showPassword
                                                        ? EyeSlashIcon
                                                        : EyeIcon
                                                  }
                                                  alt="Eye Icon"
                                                  height={
                                                    field.name ===
                                                    'windowsUserPassword'
                                                      ? showWindowsPassword
                                                        ? '18px'
                                                        : '15px'
                                                      : showPassword
                                                        ? '18px'
                                                        : '15px'
                                                  }
                                                  width={
                                                    field.name ===
                                                    'windowsUserPassword'
                                                      ? showWindowsPassword
                                                        ? '20px'
                                                        : '20px'
                                                      : showPassword
                                                        ? '20px'
                                                        : '20px'
                                                  }
                                                  style={{ cursor: 'pointer' }}
                                                  onClick={() =>
                                                    field.name ===
                                                    'windowsUserPassword'
                                                      ? setShowWindowsPassword(
                                                          (prev) => !prev
                                                        )
                                                      : setShowPassword(
                                                          (prev) => !prev
                                                        )
                                                  }
                                                />
                                              </InputAdornment>
                                            ),
                                          }}
                                        />
                                      )}
                                    </Field>
                                    <ErrorMessage
                                      name={element.name}
                                      component="div"
                                      style={{
                                        color: 'red',
                                        fontSize: '12px',
                                        marginTop: '4px',
                                      }}
                                    />
                                  </Grid>
                                </>
                              )}
                          </>
                        );
                      })}
                    </Grid>
                    {showAzureCredentialsTable && (
                      <AzureCredentialsDataTable
                        labels={labels}
                        azureCredentialsList={azureCredentialsList}
                        setAzureCredentialsList={setAzureCredentialsList}
                        showClientSecretField={showClientSecretField}
                        companyList={companyList}
                        disabled={!isEdit}
                      />
                    )}

                    {showNotifyStaffTable && (
                      <NotifyStaffDataTable
                        labels={labels}
                        notifyStaffList={notifyStaffList}
                        setNotifyStaffList={setNotifyStaffList}
                        disabled={!isEdit}
                        facilityList={facilityList}
                      />
                    )}
                    <Grid
                      display={'flex'}
                      width="100%"
                      justifyContent={'flex-end'}
                      flexWrap={'wrap'}
                      gap={'10px'}
                      marginTop={'1rem'}
                      paddingInline={'10px'}
                    >
                      {!isEdit &&
                        checkAccess(
                          isSuperAdmin,
                          roleMenu?.IsEdit && roleMenu?.IsView,
                          true
                        ) && (
                          <StyledButton
                            borderRadius="6px"
                            gap="4px"
                            padding="6px 10px"
                            variant="contained"
                            color="primary"
                            style={{ display: 'inline-flex', gap: '5px' }}
                            onClick={() => setIsEdit(true)}
                            startIcon={
                              <StyledImage
                                height="12px"
                                width="12px"
                                src={EditIcon}
                                alt="WhiteSearch"
                              />
                            }
                          >
                            {t('Edit')}
                          </StyledButton>
                        )}
                      {isEdit && (
                        <>
                          <StyledButton
                            borderRadius="6px"
                            gap="4px"
                            padding="6px 10px"
                            variant="contained"
                            color="primary"
                            type="submit"
                            style={{ display: 'inline-flex', gap: '5px' }}
                            startIcon={
                              <StyledImage
                                height="16px"
                                width="16px"
                                src={DoneIcon}
                                alt="WhiteSearch"
                              />
                            }
                          >
                            {t('Submit')}
                          </StyledButton>
                          <StyledButton
                            variant="outlined"
                            border="1px solid #0083c0"
                            backgroundColor="#ffffff"
                            type="button"
                            colour="#0083c0"
                            borderRadius="6px"
                            sx={{ marginLeft: '10px' }}
                            style={{ display: 'inline-flex', gap: '5px' }}
                            onClick={() => {
                              if (adMasterData?.Records) {
                                setAdMasterInitialValues({
                                  adRequired: adMasterData?.Records?.ADRequired
                                    ? 'yes'
                                    : 'no',
                                  adIdentityProvider:
                                    adMasterData?.Records?.ADIdentityProvider?.toLowerCase(),
                                  dataSyncRequired: adMasterData?.Records
                                    ?.DataSyncRequired
                                    ? 'yes'
                                    : 'no',
                                  postLogoutURL:
                                    adMasterData?.Records?.PostLogoutURL,
                                  enableADSyncErrorEmailNotification:
                                    adMasterData?.Records
                                      ?.IsADSyncErrorMailSend,
                                  windowsUserName:
                                    adMasterData?.Records?.WindowsUserName,
                                  windowsUserPassword:
                                    adMasterData?.Records?.WindowsUserPassword,
                                  windowsAttributes:
                                    adMasterData?.Records?.ClientAttributes?.filter(
                                      (attribute) =>
                                        attribute?.ADIdentityProvider ===
                                          'Windows' &&
                                        attribute?.IsRequiredByClient
                                    ).map(
                                      (attribute) =>
                                        attribute.ClientAttributesId
                                    ),
                                  azureAttributes:
                                    adMasterData?.Records?.ClientAttributes?.filter(
                                      (attribute) =>
                                        attribute?.ADIdentityProvider ===
                                          'Azure' &&
                                        attribute?.IsRequiredByClient
                                    ).map(
                                      (attribute) =>
                                        attribute.ClientAttributesId
                                    ),
                                  mailID: adMasterData?.Records?.MailId,
                                  password: adMasterData?.Records?.MailPassword,
                                });
                                setNotifyStaffList(
                                  adMasterData?.Records?.DataSyncNotifiedStaffs
                                );
                                setAzureCredentialsList(
                                  adMasterData?.Records?.AzureADConfiguration.map(
                                    (credential) => ({
                                      companyName:
                                        adMasterData?.Records?.CompanyList.find(
                                          (x) =>
                                            x.CompanyId === credential.CompanyId
                                        )?.CompanyName,
                                      tenantId: credential.TenantId,
                                      clientId: credential.ClientId,
                                      clientSecret: credential.ClientSecret,
                                      companyId: credential.CompanyId,
                                    })
                                  )
                                );
                              }
                              setIsEdit(false);
                              resetForm({ values: adMasterInitialValues });
                            }}
                            startIcon={
                              <StyledImage
                                height="16px"
                                width="16px"
                                src={DndIcon}
                                alt="WhiteSearch"
                              />
                            }
                          >
                            {t('Cancel')}
                          </StyledButton>
                        </>
                      )}
                    </Grid>
                  </Form>
                );
              }}
            </Formik>
          )}
        </Box>
      </FlexContainer>
    </FlexContainer>
  );
};

export default AdMaster;
