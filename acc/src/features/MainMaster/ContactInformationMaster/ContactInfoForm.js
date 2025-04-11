import React, { useEffect, useState } from 'react';
import { Checkbox, Grid, CircularProgress } from '@mui/material';
import { Formik } from 'formik';
import Label from '../../../components/Label/Label';
import {
  CommonStyledButton,
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import DoneIcon from '../../../assets/Icons/DoneIcon.png';
import DoNotDisturbIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import { TextField } from '../../../components/TextField/TextField';
import MultiSelectDropdown from '../../../components/Dropdown/MultiSelectDropdown';
import ImageUpload from '../../../components/ImageUpload/ImageUpload';
import { useGetFacilityPageLoadDataQuery } from '../../../redux/RTK/contactInformationApi';
import { useGetPageLoadDataQuery } from '../../../redux/RTK/staffMasterApi';
import { useSelector } from 'react-redux';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../utils/language';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import {
  useAddFacilityMutation,
  useGetCompanyDetailsQuery,
  useGetFacilityByIdQuery,
  useUpdateFacilityMutation,
} from '../../../redux/RTK/contactInformationApi';
import TextArea from '../../../components/TextArea/TextArea';
import { showToastAlert } from '../../../utils/SweetAlert';
import useWindowDimension from '../../../hooks/useWindowDimension';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';
import { useGetGroupConfigDataQuery } from '../../../redux/RTK/groupConfigApi';

export default function ContactInfoForm({ id }) {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { isMobile } = useWindowDimension();
  const [loading, setLoading] = useState(true);
  const [validationSchema, setValidationSchema] = useState();
  const [initialValues, setInitialValues] = useState({
    companyName: '',
    facilityCode: '',
    facilityName: '',
    email: '',
    telephoneNumber: '',
    websiteUrl: '',
    contactPersonName: '',
    mobileNumber: '',
    contactPersonEmailId: '',
    contactPersonMobileNumber: '',
    mailPortNumber: '',
    mailType: '',
    address: '',
    logo: null,
    status: '',
    enablesecuresocketlayer: false,
    enabletransportationsecurity: false,
    mailhostingserver: '',
    region: '',
  });

  const { selectedMenu, userDetails, selectedFacility, selectedModuleId } =
    useSelector((state) => state.auth);
  const [triggerAddFacility] = useAddFacilityMutation();
  const [triggerUpdateFacility] = useUpdateFacilityMutation();
  const { data: fields = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });
  const { data: labels = [] } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });
  const { data: pageLoadData2 } = useGetFacilityPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });
  const { data: pageLoadData } = useGetPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const { data: MailpageLoadData, isFetching: isPageDataFetching ,refetch} =
      useGetGroupConfigDataQuery({
        menuId: selectedMenu?.id||4,
        loginUserId: userDetails?.UserId,
        headerFacilityId: selectedFacility?.id,
      });

  const { data: facilityData, isFetching: isFacilityLoading } =
    useGetFacilityByIdQuery(
      {
        facilityId: id,
        loginUserId: userDetails?.UserId,
      },
      { skip: !id }
    );

  const { data: getCompanyData = [] } = useGetCompanyDetailsQuery(
    {
      payload: {
        pageIndex: 1,
        pageSize: 200,
        headerFacility: selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    },
    {
      skip: !selectedFacility?.id || !selectedModuleId || !selectedMenu?.id,
    }
  );

  const pagesConfigData = [
    {
      fieldId: 'CIM_P_CompanyName',
      translationId: 'MM_CIM_CompanyName',
      component: 'Dropdown',
      name: 'companyName',
      options: getCompanyData?.records
        ?.filter((activeCompany) => {
          return activeCompany?.IsActive === true;
        })
        .map((company) => ({
          text: company.CompanyName,
          value: company.CompanyId,
        })),
    },
    {
      fieldId: 'CIM_P_Region',
      translationId: 'MM_CIM_Region',
      component: 'Dropdown',
      name: 'region',
      options: pageLoadData2?.Data?.RegionList?.map((region) => ({
        text: region.RegionName,
        value: region.RegionId,
      })),
    },
    {
      fieldId: 'CIM_P_FacilityCode',
      translationId: 'MM_CIM_FacilityCode',
      component: 'TextField',
      name: 'facilityCode',
      maxLength: 20,
    },
    {
      fieldId: 'CIM_P_FacilityName',
      translationId: 'MM_CIM_FacilityName',
      component: 'TextField',
      name: 'facilityName',
      maxLength: 150,
    },
    {
      fieldId: 'CIM_P_EmailID',
      translationId: 'MM_CIM_EmailID',
      component: 'TextField',
      name: 'email',
      maxLength: 70,
    },
    {
      fieldId: 'CIM_P_TelephoneNumber',
      translationId: 'MM_CIM_TelephoneNumber',
      component: 'TextField',
      name: 'telephoneNumber',
      maxLength: 15,
    },
    {
      fieldId: 'CIM_P_WebsiteURL',
      translationId: 'MM_CIM_WebsiteURL',
      component: 'TextField',
      name: 'websiteUrl',
      maxLength: 100,
    },
    {
      fieldId: 'CIM_P_ContactPersonName',
      translationId: 'MM_CIM_ContactPersonName',
      component: 'TextField',
      name: 'contactPersonName',
      maxLength: 50,
    },
    {
      fieldId: 'CIM_P_MobileNumber',
      translationId: 'MM_CIM_MobileNumber',
      component: 'TextField',
      name: 'mobileNumber',
      maxLength: 20,
    },
    {
      fieldId: 'CIM_P_ContactPersonEmailID',
      translationId: 'MM_CIM_ContactPersonEmailID',
      component: 'TextField',
      name: 'contactPersonEmailId',
      maxLength: 50,
    },
    {
      fieldId: 'CIM_P_ContactPersonMobileNumber',
      translationId: 'MM_CIM_ContactPersonMobileNumber',
      component: 'TextField',
      name: 'contactPersonMobileNumber',
      maxLength: 20,
    },
    {
      fieldId: 'CIM_P_Status',
      translationId: 'MM_CIM_Status',
      component: 'Dropdown',
      name: 'status',
      options: pageLoadData?.Data.StatusList?.map((status) => ({
        text: status.Status,
        value: status.Status,
      })),
    },
    {
      fieldId: 'CIM_P_MailPortNumber',
      translationId: 'MM_CIM_MailPortNumber',
      component: 'TextField',
      name: 'mailPortNumber',
    },
    {
      fieldId: 'CIM_P_MailType',
      translationId: 'MM_CIM_MailType',
      component: 'Dropdown',
      name: 'mailType',
      options: MailpageLoadData?.Data?.MailTypeList?.map((mailType) => ({
        text: mailType.MailType,
        value: mailType.MailType,
      })),
    },
    {
      fieldId: 'CIM_P_Address',
      translationId: 'MM_CIM_Address',
      component: 'TextArea',
      name: 'address',
      maxLength: 700,
    },
    {
      fieldId: 'CIM_P_Logo',
      translationId: 'MM_CIM_Logo',
      component: 'ImageUpload',
      name: 'logo',
    },
    {
      fieldId: 'CIM_P_MailHostingAddress',
      translationId: 'MM_CIM_MailHostingAddress',
      component: 'TextField',
      name: 'mailhostingserver',
    },
    {
      fieldId: 'CIM_P_EnableSecureSocketLayer',
      translationId: 'MM_CIM_EnableSecureSocketLayer',
      component: 'CheckBox',
      name: 'enablesecuresocketlayer',
    },
    {
      fieldId: 'CIM_P_EnableTransportationSecurity',
      translationId: 'MM_CIM_EnableTransportationSecurity',
      component: 'CheckBox',
      name: 'enabletransportationsecurity',
    },
  ];
  const pageFields = fields?.Data?.Sections?.find(
    (section) => section.SectionName === 'Page'
  )?.Fields;
  useEffect(() => {
    if (facilityData) {
      const {
        FacilityCode,
        FacilityName,
        Email,
        TelephoneNumber,
        WebsiteURL,
        MailType,
        ContactPersonName,
        MobileNumber,
        ContactPersonEmail,
        ContactPersonMobile,
        MailPortNumber,
        Address,
        EnableSSL,
        EnableTLS,
        status,
        CompanyId,
        MailHost,
        LogoPath,
        IsActive,
        RegionId,
      } = facilityData?.Data || {};
     

      setInitialValues({
        companyName: CompanyId || '',
        facilityCode: FacilityCode,
        facilityName: FacilityName,
        email: Email,
        telephoneNumber: TelephoneNumber,
        websiteUrl: WebsiteURL,
        contactPersonName: ContactPersonName,
        mobileNumber: MobileNumber,
        contactPersonEmailId: ContactPersonEmail,
        contactPersonMobileNumber: ContactPersonMobile,
        mailPortNumber: MailPortNumber,
        mailType: MailType,
        enablesecuresocketlayer: EnableSSL,
        enabletransportationsecurity: EnableTLS,
        mailhostingserver: MailHost,
        address: Address,
        logo: LogoPath,
        status: IsActive ? 'Active' : 'Inactive',
        region: RegionId,
      });
    }
    setLoading(false);
  }, [facilityData]);
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
          case 'companyName':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'facilityName':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'facilityCode':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'email':
            schemaFields[fieldConfig?.name] = Yup.string()
              .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                `Invalid ${translatedLabel}`
              )
              .required(`${translatedLabel} is required`);
            break;
          case 'contactPersonName':
            schemaFields[fieldConfig?.name] = Yup.string()
              .required(`${translatedLabel} is required`)
              .matches(
                /^[A-Za-z\s]+$/,
                `${translatedLabel} can only contain letters and spaces`
              );
            break;
          case 'telephoneNumber':
            schemaFields[fieldConfig?.name] = Yup.string()
              .required(`${translatedLabel} is required`)
              .matches(
                /^(?:\+?\d{1,3}[-.\s]?)?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
                `Invalid ${translatedLabel}`
              )
              .test(
                'len',
                `${translatedLabel} must be exactly 10 digits`,
                (value) => {
                  const cleanedValue = value?.replace(/\D/g, '');
                  return cleanedValue && cleanedValue.length === 10;
                }
              );
            break;
          case 'mobileNumber':
            schemaFields[fieldConfig?.name] = Yup.string()
              .required(`${translatedLabel} is required`)
              .matches(
                /^(?:\+?\d{1,3}[-.\s]?)?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
                `Invalid ${translatedLabel}`
              );
            break;
          case 'contactPersonEmailId':
            schemaFields[fieldConfig?.name] = Yup.string()
              .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                `Invalid ${translatedLabel}`
              )
              .required(`${translatedLabel} is required`);
            break;
          case 'contactPersonMobileNumber':
            schemaFields[fieldConfig?.name] = Yup.string()
              .matches(
                /^(?:\+?\d{1,3}[-.\s]?)?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}$/,
                `Invalid ${translatedLabel}`
              )
              .test(
                'len',
                `${translatedLabel} must be exactly 10 digits`,
                (value) => {
                  const cleanedValue = value?.replace(/\D/g, '');
                  return cleanedValue && cleanedValue.length === 10;
                }
              );
            break;
          case 'logo':
            schemaFields[fieldConfig?.name] = Yup.mixed().required(
              `${translatedLabel} is required`
            );
            break;
          case 'mailPortNumber':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'status':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'region':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'mailhostingserver':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'address':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'websiteUrl':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;

          default:
            break;
        }
      }
    });

    setValidationSchema(Yup.object().shape(schemaFields));
  }, [pageFields]);
  if (loading || isFacilityLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </div>
    );
  }

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnChange={true}
      validateOnMount={true}
      validateOnBlur={true}
      enableReinitialize={true}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        try {
          const Companies =
            getCompanyData?.records?.filter(
              (company) =>
                company?.CompanyName === values?.companyName ||
                company?.CompanyId === values?.companyName
            ) || [];

          const {
            companyName,
            facilityCode,
            facilityName,
            email,
            telephoneNumber,
            websiteUrl,
            contactPersonName,
            mobileNumber,
            contactPersonEmailId,
            contactPersonMobileNumber,
            mailPortNumber,
            mailType,
            address,
            mailhostingserver,
            enablesecuresocketlayer,
            enabletransportationsecurity,
            status,
            region,
            logo,
          } = values;

          let response;
          if (id) {
            response = await triggerUpdateFacility({
              payload: {
                facilityId: id,
                facilityCode: facilityCode,
                facilityName: facilityName,
                logoPath: logo,
                email: email,
                telephoneNumber: telephoneNumber,
                address: address,
                websiteURL: websiteUrl,
                fax: '',
                mobileNumber: mobileNumber,
                contactPersonName: contactPersonName,
                contactPersonEmail: contactPersonEmailId,
                contactPersonMobile: contactPersonMobileNumber,
                mailHost: mailhostingserver,
                enableSSL: enablesecuresocketlayer,
                enableTLS: enabletransportationsecurity,
                mailPortNumber: mailPortNumber,
                mailType: mailType,
                isActive:
                  status === 'active' || status === 'Active' ? true : false,
                isDelete: false,
                moduleId: selectedModuleId,
                menuId: selectedMenu?.id,
                loginUserId: userDetails?.UserId,
                companyId: Companies[0]?.CompanyId,
                companyName: companyName,
                status: status,
                regionId: region,
              },
            }).unwrap();
          } else {
            response = await triggerAddFacility({
              payload: {
                facilityId: 0,
                facilityCode: facilityCode,
                facilityName: facilityName,
                logoPath: logo,
                email: email,
                isActive:
                  status === 'active' || status === 'Active' ? true : false,
                telephoneNumber: telephoneNumber,
                address: address,
                websiteURL: websiteUrl,
                mobileNumber: mobileNumber,
                contactPersonName: contactPersonName,
                contactPersonEmail: contactPersonEmailId,
                contactPersonMobile: contactPersonMobileNumber,
                mailHost: mailhostingserver,
                mailType: mailType,
                mailPortNumber: mailPortNumber,
                enableSSL: enablesecuresocketlayer,
                enableTLS: enabletransportationsecurity,
                moduleId: selectedModuleId,
                menuId: selectedMenu?.id,
                loginUserId: userDetails?.UserId,
                companyId: companyName,
                companyName: companyName,
                status: status,
                regionId: region,
              },
            }).unwrap();
          }

          if (response && response.Message !== 'Record Already Exist') {
            showToastAlert({
              type: 'custom_success',
              text: response.Message,
              gif: 'SuccessGif',
            });
          }
          if (response && response.Message === 'Record Already Exist') {
            showToastAlert({
              type: 'custom_info',
              text: response.Message,
              gif: 'InfoGif',
            });
          }
          resetForm();
          navigate('/MainMaster/ContactInformationMaster', {
            state: { activeTab: 'facility' },
          });
        } catch (error) {
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        resetForm,
        setFieldValue,
        setTouched,
        isSubmitting,
      }) => {
        return (
          <Grid container spacing={2} display={'flex'}>
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
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    padding={'10px'}
                    md={4}
                    key={field.fieldId}
                  >
                    <Label
                      value={translatedLabel}
                      isRequired={field.IsMandatory}
                    />
                    {fieldConfig.component === 'TextField' && (
                      <TextField
                        name={fieldConfig.name}
                        value={
                          fieldConfig.name === 'telephoneNumber'
                            ? values[fieldConfig.name] || ''
                            : values[fieldConfig.name] || ''
                        }
                        onChange={(e) => {
                          if (
                            fieldConfig.name === 'telephoneNumber' ||
                            fieldConfig.name === 'mobileNumber' ||
                            fieldConfig.name === 'contactPersonMobileNumber'
                          ) {
                            const numericValue = e.target.value.replace(
                              /\D/g,
                              ''
                            );
                            handleChange({
                              target: {
                                name: fieldConfig.name,
                                value: numericValue,
                              },
                            });
                          } else {
                            handleChange(e);
                          }
                        }}
                        slotProps={{
                          htmlInput: { maxLength: fieldConfig.maxLength },
                        }}
                      />
                    )}
                    {fieldConfig.component === 'TextArea' && (
                      <TextArea
                        name={fieldConfig.name}
                        value={values[fieldConfig.name] || ''}
                        slotProps={{
                          htmlInput: { maxLength: fieldConfig.maxLength },
                        }}
                        onChange={(e) => {
                          handleChange(e);
                          setFieldValue(fieldConfig.name, e.target.value);
                        }}
                      />
                    )}
                    {fieldConfig.component === 'Dropdown' && (
                      <SearchDropdown
                        name={fieldConfig.name}
                        options={[
                          { text: 'Select', value: '' },
                          ...(fieldConfig.options || []),
                        ]}
                        onChange={(event, value) => {
                          setFieldValue(fieldConfig.name, value?.value);
                        }}
                        value={
                          fieldConfig?.options?.find(
                            (option) =>
                              option.value === values[fieldConfig.name]
                          ) || null
                        }
                      />
                    )}
                    {fieldConfig.component === 'MultiSelectDropdown' && (
                      <MultiSelectDropdown
                        name={fieldConfig.name}
                        options={fieldConfig.options}
                      />
                    )}
                    {fieldConfig.component === 'CheckBox' && (
                      <Checkbox
                        name={fieldConfig.name}
                        checked={values[fieldConfig.name] || false}
                        onChange={(event) => {
                          const isChecked = event.target.checked;
                          setFieldValue(fieldConfig.name, isChecked);
                          setTouched({ [fieldConfig.name]: true });
                        }}
                      />
                    )}
                    {fieldConfig.component === 'ImageUpload' && (
                      <ImageUpload
                        name={fieldConfig.name}
                        imagetext="Image Area"
                        imagebutton={translatedLabel}
                        value={values[fieldConfig.name]}
                        onChange={(event) => {
                          const fileInput = event.currentTarget;
                          const file = fileInput?.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.readAsArrayBuffer(file);
                            reader.onload = () => {
                              const binaryData = reader.result;
                              const base64String = btoa(
                                new Uint8Array(binaryData).reduce(
                                  (data, byte) =>
                                    data + String.fromCharCode(byte),
                                  ''
                                )
                              );
                              setFieldValue(
                                fieldConfig.name,
                                `data:${file.type};base64,${base64String}`
                              );
                            };
                            fileInput.value = '';
                            reader.onerror = (error) => {};
                          }
                        }}
                        onDelete={(event) => {
                          setFieldValue(fieldConfig.name, '');
                        }}
                      />
                    )}
                    {errors[fieldConfig.name] && touched[fieldConfig.name] && (
                      <div style={{ color: 'red', fontSize: '11px' }}>
                        {errors[fieldConfig.name]}
                      </div>
                    )}
                  </Grid>
                );
              }
              return null;
            })}
            <FlexContainer
              gap="16px"
              justifyContent="flex-end"
              padding="25px 15px 40px 0px"
              flexDirection={isMobile ? 'column' : 'row'}
              width="100%"
            >
              <CommonStyledButton
                onClick={handleSubmit}
                variant="contained"
                text-color="#0083C0"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={16} style={{ color: '#FFFFFF' }} />
                  ) : (
                    <StyledImage
                      src={DoneIcon}
                      style={{ marginInlineEnd: 8 }}
                      sx={{
                        marginBottom: '1px',
                        color: '#FFFFFF',
                      }}
                    />
                  )
                }
              >
                <StyledTypography marginTop="1px" color="#FFFFFF">
                  {isSubmitting ? t('Submitting') : t('Submit')}
                </StyledTypography>
              </CommonStyledButton>
              <CommonStyledButton
                type="button"
                variant="outlined"
                onClick={() => {
                  if (id) {
                    navigate('/MainMaster/ContactInformationMaster', {
                      state: { activeTab: 'facility' },
                    });
                  } else {
                    resetForm();
                  }
                }}
                startIcon={
                  <StyledImage
                    src={DoNotDisturbIcon}
                    style={{ marginInlineEnd: 8 }}
                  />
                }
              >
                <StyledTypography marginTop="1px">
                  {t('Cancel')}
                </StyledTypography>
              </CommonStyledButton>
            </FlexContainer>
          </Grid>
        );
      }}
    </Formik>
  );
}
