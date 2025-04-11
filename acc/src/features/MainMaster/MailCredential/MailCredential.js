import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import Dropdown from '../../../components/Dropdown/Dropdown';
import {
  CommonStyledButton,
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import Label from '../../../components/Label/Label';
import {
  useAddMailCredentialMutation,
  useGetPageLoadDataQuery,
} from '../../../redux/RTK/mailCredentialApi';
import { useSelector } from 'react-redux';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../utils/language';
import i18n from '../../../i18n/i18n';
import { TextField } from '../../../components/TextField/TextField';
import DoneIcon from '../../../assets/Icons/DoneIcon.png';
import DoNotDisturbIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import EditIcon from '../../../assets/Icons/EditIcon.png';
import SubmitIcon from '../../../assets/Icons/SubmitIcon.png';
import CancelIcon from '../../../assets/Icons/CancelIcon.png';
import { showToastAlert } from '../../../utils/SweetAlert';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import { useTranslation } from 'react-i18next';
import useWindowDimension from '../../../hooks/useWindowDimension';
import { Autocomplete } from '@mui/material';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';
import { useGetGroupConfigDataQuery } from '../../../redux/RTK/groupConfigApi';

// const validationSchema = Yup.object().shape({
//   facility: Yup.string().required('Facility is required'),
//   moduleList: Yup.string().required('Module List is required'),
//   mailSenderName: Yup.string().required('Mail Sender Name is required'),
//   mailId: Yup.string()
//     .email('Invalid email format')
//     .required('Email ID is required'),
//   password: Yup.string().required('Password is required'),
// });

const MailCredential = () => {
  const { t } = useTranslation();
  const { isMobile } = useWindowDimension();
  const {
    selectedMenu,
    selectedFacility,
    selectedModuleId,
    userDetails,
    selectedRoleFacility,
    isSuperAdmin,
    roleFacilities,
  } = useSelector((state) => state.auth);
  const { mailType } = useSelector((state) => state.groupConfig);
  const [triggerAddMailCredentials] = useAddMailCredentialMutation();
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [pagesConfigData, setPagesConfigData] = useState([]);
  const [roleMenu, setRoleMenu] = useState();
  const handlePasswordEdit = (setFieldValue) => {
    setIsPasswordUpdated(false);
    setIsPasswordEditable(true);
    setFieldValue('password', '');
  };

  const { data: fields = [], isFetching: isFieldsFetching } = useGetFieldsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );

  const { data: labels = [], isFetching: isLabelsFetching } = useGetLabelsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );

  const pageFields = Array.isArray(fields?.Data?.Sections)
    ? fields?.Data?.Sections?.find((section) => section.SectionName === 'Page')
        ?.Fields || []
    : [];

  const {
    data: pageLoadData,
    refetch,
    isFetching: isPageDataFetching,
  } = useGetPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  useEffect(() => {
    if (pageLoadData) {
      const newPagesConfigData = [
        {
          fieldId: 'MC_P_Facility',
          translationId: 'MM_MC_Facility',
          component: 'Dropdown',
          name: 'facility',
          options:
            userDetails?.ApplicableFacilities?.filter((facility) => {
              if (!facility.IsActive) return false;
              if (isSuperAdmin) return true;
              const facilityItem = roleFacilities
                ?.find((role) => role.FacilityId === facility.FacilityId)
                ?.Menu?.find(
                  (MenuItem) => MenuItem.MenuId === selectedMenu?.id
                );
              return facilityItem?.IsAdd;
            }).map((facility) => ({
              text: facility.FacilityName,
              value: facility.FacilityId,
            })) || [],
        },
        {
          fieldId: 'MC_P_ModuleList',
          translationId: 'MM_MC_ModuleList',
          component: 'Dropdown',
          name: 'moduleList',
          options:
            pageLoadData?.Data?.ModuleList?.map((module) => ({
              text: module.ModuleName,
              value: module.ModuleId,
            })) || [],
        },
        {
          fieldId: 'MC_P_MailSenderName',
          translationId: 'MM_MC_MailSenderName',
          component: 'TextField',
          name: 'mailSenderName',
          maxLength: 100,
        },
        {
          fieldId: 'MC_P_EmailID',
          translationId: 'MM_MC_EmailID',
          component: 'TextField',
          name: 'mailId',
          maxLength: 100,
        },
        {
          fieldId: 'MC_P_Password',
          translationId: 'MM_MC_Password',
          component: 'TextField',
          name: 'password',
          maxLength: 100,
        },
      ];

      setPagesConfigData(newPagesConfigData);
    }
  }, [pageLoadData]);

  const validationSchema = Yup.object().shape({
    facility: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'MC_P_Facility')?.IsMandatory ===
        true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_MC_Facility', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    moduleList: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'MC_P_ModuleList')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_MC_ModuleList', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),

    mailSenderName: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'MC_P_MailSenderName')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_MC_MailSenderName', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    mailId: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'MC_P_EmailID')?.IsMandatory ===
        true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_MC_EmailID', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    password: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'MC_P_Password')?.IsMandatory ===
        true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_MC_Password', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
  const handleDropdownChange = (name, value, setFieldValue) => {
    setFieldValue(name, value);
    setIsPasswordEditable(false);
  };
  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  return (
    <FlexContainer width="100%" height="100%" flexDirection="column">
      <FlexContainer
        marginBottom={isMobile ? '20px' : '0'}
        marginTop={isMobile ? '20px' : '0'}
      >
        <StyledTypography
          fontSize={isMobile ? '24px' : '36px'}
          fontWeight="900"
          lineHeight={isMobile ? '32px' : '44px'}
          textAlign={isMobile ? 'center' : 'left'}
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('MM_MailCredential')}
        </StyledTypography>
      </FlexContainer>

      <FlexContainer
        width="calc(100% - 30px)"
        height="auto"
        flex="1"
        flexDirection="column"
      >
        <FlexContainer
          height="auto"
          width="100%"
          padding="15px"
          borderRadius="8px"
          flexDirection="column"
          backgroundColor="#fff"
        >
          <Formik
            initialValues={{
              facility: '',
              moduleList: '',
              mailSenderName: '',
              mailId: '',
              password: '',
              mailCredentialId: '',
            }}
            validationSchema={validationSchema}
            validateOnChange={true}
            validateOnBlur={true}
            onSubmit={async (values, { resetForm }) => {
              let response;
              response = await triggerAddMailCredentials({
                payload: {
                  defaultFacilityId: selectedFacility?.id,
                  mailCredentialId: values?.mailCredentialId || 0,
                  facilityId: values?.facility,
                  moduleId: values?.moduleList,
                  mailId: values?.mailId,
                  password: values?.password,
                  mailHeader: values?.mailSenderName,
                  menuId: selectedMenu?.id,
                  loginUserId: userDetails?.UserId,
                },
              }).unwrap();
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
              setIsPasswordEditable(false);
              await refetch();
              resetForm();
            }}
            enableReinitialize={true}
          >
            {({
              values,
              handleSubmit,
              errors,
              touched,
              setFieldValue,
              resetForm,
              validateForm,
              setErrors,
              isSubmitting,
            }) => {
              useEffect(() => {
                if (
                  values.facility &&
                  values.moduleList &&
                  !isPasswordEditable &&
                  !isPasswordUpdated
                ) {
                  const matchedCredential =
                    pageLoadData?.Data?.MailCredentials.find(
                      (credential) =>
                        credential.FacilityId === values.facility &&
                        credential.ModuleId === values.moduleList
                    );
                  if (matchedCredential) {
                    setFieldValue(
                      'mailCredentialId',
                      matchedCredential?.MailCredentialId
                    );
                    setFieldValue('mailId', matchedCredential?.MailId, false);
                    setFieldValue(
                      'mailSenderName',
                      matchedCredential?.MailHeader,
                      false
                    );
                    setFieldValue(
                      'password',
                      matchedCredential?.Password,
                      false
                    );
                  } else {
                    setFieldValue('mailCredentialId', '');
                    setFieldValue('mailId', '', false);
                    setFieldValue('mailSenderName', '', false);
                    setFieldValue('password', '', false);
                  }
                  setTimeout(() => {
                    setErrors({});
                    validateForm();
                  }, 1000);
                }
              }, [values.facility, values.moduleList, isPasswordEditable]);
              return (
                <Form>
                  {isFieldsFetching ||
                  isLabelsFetching ||
                  isPageDataFetching ? (
                    <FlexContainer justifyContent="center">
                      <StyledImage src={LoadingGif} alt="LoadingGif" />
                    </FlexContainer>
                  ) : (
                    <FlexContainer
                      flexDirection="column"
                      gap={isMobile ? '10px' : '30px'}
                      alignItems="left"
                      justifyContent="center"
                      padding={isMobile ? '10px 10px' : '20px 20px'}
                    >
                      {Array.isArray(pageFields) &&
                        pageFields.map((field) => {
                          const fieldConfig = pagesConfigData.find(
                            (config) => config.fieldId === field.FieldId
                          );
                          const translatedLabel = getlabel(
                            fieldConfig?.translationId,
                            labels,
                            i18n.language
                          );
                          if (field?.IsShow && fieldConfig) {
                            return (
                              <FlexContainer
                                alignItems="flex-start"
                                gap="35px"
                                flexDirection="column"
                              >
                                <FlexContainer
                                  alignItems={
                                    isMobile ? 'flex-start' : 'center'
                                  }
                                  gap={isMobile ? '10px' : '20px'}
                                  flexDirection={isMobile ? 'column' : 'row'}
                                  width={isMobile ? '250px' : '100%'}
                                  style={{
                                    whiteSpace: 'normal',
                                  }}
                                >
                                  {(fieldConfig.name !== 'password' ||
                                    mailType === 'SMTP Mail Configuration') && (
                                    <FlexContainer
                                      width={isMobile ? '100%' : '150px'}
                                      flexDirection={
                                        isMobile ? 'column' : 'row'
                                      }
                                    >
                                      <Label
                                        value={translatedLabel}
                                        isRequired={field.IsMandatory}
                                        style={{
                                          whiteSpace: isMobile
                                            ? 'normal'
                                            : 'nowrap',
                                          overflowWrap: 'break-word',
                                          display: 'block',
                                        }}
                                      />
                                    </FlexContainer>
                                  )}
                                  <FlexContainer
                                    flexDirection="column"
                                    width={isMobile ? '170px' : '400px'}
                                  >
                                    {fieldConfig.component === 'TextField' &&
                                      (fieldConfig.name !== 'password' ||
                                        mailType ===
                                          'SMTP Mail Configuration') && (
                                        <div
                                          style={{
                                            width: '100%',
                                            position: 'relative',
                                            cursor: !isPasswordEditable
                                              ? 'not-allowed'
                                              : 'text', // 🚫 Block cursor before edit, text after edit
                                            pointerEvents: !isPasswordEditable
                                              ? 'none'
                                              : 'auto', // Prevent user interaction until edit is clicked
                                          }}
                                        >
                                          <TextField
                                            name={fieldConfig.name}
                                            slotProps={{
                                              htmlInput: {
                                                maxLength:
                                                  fieldConfig.maxLength,
                                              },
                                            }}
                                            type={
                                              fieldConfig.name === 'password' &&
                                              !isPasswordEditable
                                                ? 'password'
                                                : 'text'
                                            }
                                            value={
                                              fieldConfig.name === 'password'
                                                ? isPasswordEditable
                                                  ? values.password
                                                  : '*'.repeat(
                                                      values.password?.length
                                                    )
                                                : values[fieldConfig.name] || ''
                                            }
                                            onChange={(event) => {
                                              if (
                                                fieldConfig.name !==
                                                  'password' ||
                                                isPasswordEditable
                                              ) {
                                                setFieldValue(
                                                  fieldConfig.name,
                                                  event.target.value
                                                );
                                              }
                                            }}
                                            readOnly={
                                              fieldConfig.name === 'password' &&
                                              !isPasswordEditable
                                            }
                                            disabled={
                                              fieldConfig.name === 'password' &&
                                              (!values?.facility ||
                                                !values?.moduleList)
                                            }
                                            InputProps={{
                                              endAdornment: fieldConfig.name ===
                                                'password' && (
                                                <FlexContainer gap={'10px'}>
                                                  {isPasswordEditable ? (
                                                    <FlexContainer gap={'10px'}>
                                                      <StyledImage
                                                        src={CancelIcon}
                                                        alt="Cancel Edit"
                                                        style={{
                                                          cursor: 'pointer',
                                                        }}
                                                        onClick={() => {
                                                          setIsPasswordEditable(
                                                            false
                                                          );
                                                          setIsPasswordUpdated(
                                                            false
                                                          );
                                                        }}
                                                      />
                                                      <StyledImage
                                                        src={SubmitIcon}
                                                        alt="Confirm Edit"
                                                        style={{
                                                          cursor: 'pointer',
                                                        }}
                                                        onClick={() => {
                                                          setFieldValue(
                                                            'password',
                                                            values?.password
                                                          );
                                                          setIsPasswordUpdated(
                                                            true
                                                          );
                                                          setIsPasswordEditable(
                                                            false
                                                          );
                                                        }}
                                                      />
                                                    </FlexContainer>
                                                  ) : (
                                                    <StyledImage
                                                      src={EditIcon}
                                                      alt="Edit Password"
                                                      style={{
                                                        cursor:
                                                          !values?.facility ||
                                                          !values?.moduleList
                                                            ? 'not-allowed'
                                                            : 'pointer',
                                                        opacity:
                                                          !values?.facility ||
                                                          !values?.moduleList
                                                            ? 0.5
                                                            : 1,
                                                      }}
                                                      // onClick={() =>
                                                      //   !(!values?.facility || !values?.moduleList) &&
                                                      //   setIsPasswordEditable(true)
                                                      // }
                                                      onClick={() =>
                                                        !(
                                                          !values?.facility ||
                                                          !values?.moduleList
                                                        ) &&
                                                        handlePasswordEdit(
                                                          setFieldValue
                                                        )
                                                      }
                                                    />
                                                  )}
                                                </FlexContainer>
                                              ),
                                            }}
                                            // sx={{
                                            //   width: '100%',
                                            // }}
                                            sx={{
                                              width: '100%',
                                              '&:hover': {
                                                cursor:
                                                  fieldConfig.name ===
                                                    'password' &&
                                                  !isPasswordEditable
                                                    ? 'not-allowed' // 🚫 Block cursor before clicking edit
                                                    : 'text', // Text cursor after clicking edit
                                              },
                                            }}
                                          />
                                        </div>
                                        // <TextField
                                        //   name={fieldConfig.name}
                                        //   slotProps={{
                                        //     htmlInput: {
                                        //       maxLength: fieldConfig.maxLength,
                                        //     },
                                        //   }}
                                        //   type={
                                        //     fieldConfig.name === 'password' &&
                                        //     !isPasswordEditable
                                        //       ? 'password'
                                        //       : 'text'
                                        //   }
                                        //   value={
                                        //     fieldConfig.name === 'password'
                                        //       ? isPasswordEditable
                                        //         ? values.password
                                        //         : '*'.repeat(
                                        //             values.password?.length
                                        //           )
                                        //       : values[fieldConfig.name] || ''
                                        //   }
                                        //   onChange={(event) => {
                                        //     if (
                                        //       fieldConfig.name !== 'password' ||
                                        //       isPasswordEditable
                                        //     ) {
                                        //       const { value } = event.target;
                                        //       setFieldValue(
                                        //         fieldConfig.name,
                                        //         value
                                        //       );
                                        //     }
                                        //   }}
                                        //   readOnly={
                                        //     fieldConfig.name === 'password' &&
                                        //     !isPasswordEditable
                                        //   }
                                        //   InputProps={{
                                        //     endAdornment: fieldConfig.name ===
                                        //       'password' && (
                                        //       <>
                                        //         {isPasswordEditable ? (
                                        //           <FlexContainer gap={'20px'}>
                                        //             <StyledImage
                                        //               src={CancelIcon}
                                        //               alt="Close password input"
                                        //               style={{
                                        //                 cursor: 'pointer',
                                        //               }}
                                        //               onClick={() => {
                                        //                 setIsPasswordEditable(
                                        //                   false
                                        //                 );
                                        //                 setIsPasswordUpdated(
                                        //                   false
                                        //                 );
                                        //               }}
                                        //             />
                                        //             <StyledImage
                                        //               src={SubmitIcon}
                                        //               alt="Confirm password input"
                                        //               style={{
                                        //                 cursor: 'pointer',
                                        //               }}
                                        //               onClick={() => {
                                        //                 setFieldValue(
                                        //                   'password',
                                        //                   values?.password
                                        //                 );
                                        //                 setIsPasswordUpdated(
                                        //                   true
                                        //                 );
                                        //                 setIsPasswordEditable(
                                        //                   false
                                        //                 );
                                        //               }}
                                        //             />
                                        //           </FlexContainer>
                                        //         ) : (
                                        //           <StyledImage
                                        //             src={EditIcon}
                                        //             alt="Edit password input"
                                        //             style={{
                                        //               cursor:
                                        //                 !values?.facility ||
                                        //                 !values?.moduleList
                                        //                   ? 'not-allowed'
                                        //                   : 'pointer',
                                        //               opacity:
                                        //                 !values?.facility ||
                                        //                 !values?.moduleList
                                        //                   ? 0.5
                                        //                   : 1,
                                        //             }}
                                        //             onClick={() =>
                                        //               handlePasswordEdit(
                                        //                 setFieldValue
                                        //               )
                                        //             }
                                        //           />
                                        //         )}
                                        //       </>
                                        //     ),
                                        //   }}
                                        //   style={{
                                        //     width: '100%',
                                        //     cursor:
                                        //       isPasswordEditable &&
                                        //       fieldConfig.name === 'password'
                                        //         ? 'text'
                                        //         : 'default',
                                        //   }}
                                        //   style={{
                                        //     width: '100%',
                                        //     cursor:
                                        //       (!values?.facility || !values?.moduleList) && fieldConfig.name === 'password'
                                        //         ? 'not-allowed'
                                        //         : isPasswordEditable
                                        //         ? 'text'
                                        //         : 'default',
                                        //   }}
                                        // />
                                      )}

                                    {fieldConfig.component === 'Dropdown' && (
                                      // <Dropdown
                                      //   name={fieldConfig.name}
                                      //   options={fieldConfig.options}
                                      //   onChange={(e) => {
                                      //     const selectedValue = e.target.value;
                                      //     handleDropdownChange(
                                      //       fieldConfig.name,
                                      //       selectedValue,
                                      //       setFieldValue
                                      //     );
                                      //   }}
                                      // />
                                      <SearchDropdown
                                        name={fieldConfig.name}
                                        options={[
                                          { text: 'Select', value: '' },
                                          ...(fieldConfig.options || []),
                                        ]}
                                        getOptionLabel={(option) => option.text}
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
                                              fontSize: '14px',
                                              minHeight: '30px',
                                              display: 'flex',
                                              alignItems: 'center',
                                            },
                                          },
                                        }}
                                        value={
                                          fieldConfig.options?.find(
                                            (option) =>
                                              option.value ===
                                              values[fieldConfig.name]
                                          ) || null
                                        }
                                        onChange={(event, value) => {
                                          handleDropdownChange(
                                            fieldConfig.name,
                                            value?.value,
                                            setFieldValue
                                          );
                                        }}
                                      />
                                    )}
                                    {errors[fieldConfig.name] &&
                                      touched[fieldConfig.name] && (
                                        <FlexContainer
                                          style={{
                                            color: 'red',
                                            fontSize: '11px',
                                          }}
                                        >
                                          {errors[fieldConfig.name]}
                                        </FlexContainer>
                                      )}
                                  </FlexContainer>
                                </FlexContainer>
                              </FlexContainer>
                            );
                          }
                          return null;
                        })}
                      <FlexContainer
                        gap={isMobile ? '8px' : '16px'}
                        justifyContent={
                          i18n.language === 'ar' ? 'right' : 'left'
                        }
                        padding={
                          isMobile ? '15px 10px 20px 0px' : '25px 15px 40px 0px'
                        }
                        flexDirection={isMobile ? 'column' : 'row'}
                        width="100%"
                      >
                        <CommonStyledButton
                          onClick={handleSubmit}
                          variant="contained"
                          gap="8px"
                          text-color="#0083C0"
                          disabled={!roleMenu?.IsAdd}
                          sx={{
                            width: isMobile ? '100%' : 'auto',
                          }}
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
                            {isSubmitting ? t('Submitting') : t('Submit')}
                          </StyledTypography>
                        </CommonStyledButton>
                        <CommonStyledButton
                          gap="8px"
                          type="button"
                          variant="outlined"
                          sx={{
                            width: isMobile ? '100%' : 'auto',
                          }}
                          startIcon={<StyledImage src={DoNotDisturbIcon} />}
                          onClick={() => {
                            resetForm();
                            setIsPasswordEditable(false);
                          }}
                        >
                          <StyledTypography marginTop="1px">
                            {t('Cancel')}
                          </StyledTypography>
                        </CommonStyledButton>
                      </FlexContainer>
                    </FlexContainer>
                  )}
                </Form>
              );
            }}
          </Formik>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default MailCredential;
