import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Grid,
  TextField,
  Autocomplete,
  Checkbox,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../../utils/StyledComponents';
import CloseIcon from '../../../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../../../assets/Icons/DoNotDisturbIcon.png';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import MultiSelectDropdown from '../../../../../components/Dropdown/MultiSelectDropdown';
import Label from '../../../../../components/Label/Label';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { getlabel } from '../../../../../utils/language';
import { useSelector } from 'react-redux';
import { showToastAlert } from '../../../../../utils/SweetAlert';
import SearchDropdown from '../../../../../components/SearchDropdown/SearchDropdown';
import { useGetReferenceNumberDataByIdQuery } from '../../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';
import {
  useAddTabsMutation,
  useGetTabDataByIdQuery,
  useUpdateTabMutation,
} from '../../../../../redux/RTK/staffDemographyApi';
import { ChromePicker, SketchPicker } from 'react-color';

const AddEditTabs = ({
  showTabsModal,
  setShowTabsModal,
  selectedTabsId,
  setSelectedTabsId,
  labels,
  refetch,
  fieldAccess,
}) => {
  //* Hooks declaration
  const { t, i18n } = useTranslation();

  //* Selectors
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    isSuperAdmin,
    roleFacilities,
  } = useSelector((state) => state.auth);

  //* State variables

  const [facilityList, setFacilityList] = useState([
    { text: 'Select', value: '' },
    ...(userDetails?.ApplicableFacilities?.filter((facility) => {
      if (!facility.IsActive) return false;
      if (isSuperAdmin) return true;
      const facilityItem = roleFacilities
        ?.find((role) => role.FacilityId === facility.FacilityId)
        ?.Menu?.find((MenuItem) => MenuItem.MenuId === selectedMenu?.id);
      return facilityItem?.IsAdd;
    }).map((facility) => ({
      text: facility.FacilityName,
      value: facility.FacilityId,
    })) ||
      [] ||
      []),
  ]);
  const [fieldLabels, setFieldLabels] = useState([]);
  const [newTabs, setNewTabs] = useState({
    tabsId: selectedTabsId || 0,
    facility: '',
    tabName: '',
    institution: '',
    staffCategory: '',
    country: '',
    fromDate: '',
    toDate: '',
    attchment: '',
    tabColor: '',
  });

  //* RTK Queries
  const [triggerAddTab] = useAddTabsMutation();
  const [triggerUpdateTab] = useUpdateTabMutation();

  const {
    data: tabsRecords,
    isFetching,
    refetch: refetchTabsData,
  } = useGetTabDataByIdQuery(
    {
      tabId: selectedTabsId,
      loginUserId: userDetails?.UserId,
    },
    { skip: !selectedTabsId }
  );

  //* Field access checking
  const pageFields = fieldAccess?.Data?.Sections?.find(
    (sectionName) => sectionName?.SectionName === 'Tabs'
  )?.Fields;

  //* Use Effects to bind values

  useEffect(() => {
    if (labels?.Data) {
      setFieldLabels(labels?.Data);
    }
  }, [labels]);

  useEffect(() => {
    if (tabsRecords?.Data && selectedTabsId) {
      setNewTabs({
        tabsId: selectedTabsId || 0,
        facility: tabsRecords?.Data?.FacilityId,
        tabName: tabsRecords?.Data?.TabName,
        institution: tabsRecords?.Data?.IsInstitutionMandatory,
        staffCategory: tabsRecords?.Data?.StaffCategoryId,
        country: tabsRecords?.Data?.IsCountryMandatory,
        fromDate: tabsRecords?.Data?.IsIssuedateMandatory,
        toDate: tabsRecords?.Data?.IsExpirydateMandatory,
        attchment: tabsRecords?.Data?.IsAttachmentMandatory,
        tabColor: tabsRecords?.Data?.Color,
      });
    }
  }, [tabsRecords]);

  //* Validation Schema
  const tabsValidation = Yup.object().shape({
    tabName: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'SF_T_TabName')?.IsMandatory ===
        true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_SF_T_TabName', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),

    facility: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'SF_T_Facility')?.IsMandatory ===
        true,
      then: (schema) =>
        schema
          .required(
            `${getlabel('MM_SF_T_Facility', labels, i18n.language)} ${t('IsRequired')}`
          )
          .test(
            'is-zero',
            `${getlabel('MM_SF_T_Facility', labels, i18n.language)} ${t('IsRequired')}`,
            (value) => {
              return value !== '';
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),

    institution: Yup.bool().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'SF_T_Institution')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_SF_T_Institution', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),

    staffCategory: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'SF_T_StaffCategory')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel(
              'MM_SF_T_StaffCategory',
              {
                Data: fieldLabels,
                Status: labels?.Status,
              },
              i18n.language
            )} ${t('IsRequired')}`
          )
          .test(
            'is-zero',
            `${getlabel(
              'MM_SF_T_StaffCategory',
              {
                Data: fieldLabels,
                Status: labels?.Status,
              },
              i18n.language
            )} ${t('IsRequired')}`,
            (value) => {
              return value !== 0;
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    country: Yup.bool().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'SF_T_Country')?.IsMandatory ===
        true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_SF_T_Country', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    fromDate: Yup.bool().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'SF_T_FromDate')?.IsMandatory ===
        true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_SF_T_FromDate', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    toDate: Yup.bool().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'SF_T_ToDate')?.IsMandatory ===
        true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_SF_T_ToDate', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    attchment: Yup.bool().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'SF_T_Attachment(s)')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_SF_T_Attachment(s)', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),

    tabColor: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'SF_T_Institution')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_SF_T_Institution', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  //* Close modal
  const handleOnCancel = () => {
    setNewTabs({
      tabsId: 0,
      facility: '',
      tabName: '',
      institution: '',
      staffCategory: '',
      country: '',
      fromDate: '',
      toDate: '',
      attchment: '',
      tabColor: '',
    });
    setSelectedTabsId(null);
    setShowTabsModal(false);
  };

  //* Submit tabs
  const submitTabs = async (values) => {
    try {
      let response;
      if (newTabs?.tabsId === 0) {
        response = await triggerAddTab({
          payload: {
            tabName: values?.tabName,
            facilityId: values?.facility,
            isInstitutionMandatory: values?.institution,
            isCountryMandatory: values?.country,
            isIssuedateMandatory: values?.fromDate,
            isExpirydateMandatory: values?.toDate,
            isAttachmentMandatory: values?.attchment,
            staffCategoryId: Array.isArray(values?.staffCategory)
              ? values.staffCategory.join(',')
              : values?.staffCategory,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
            color: values?.tabColor,
          },
        }).unwrap();
      }
      if (newTabs?.tabsId !== 0) {
        response = await triggerUpdateTab({
          payload: {
            tabId: values?.tabsId,
            tabName: values?.tabName,
            facilityId: values?.facility,
            isInstitutionMandatory: values?.institution,
            isCountryMandatory: values?.country,
            isIssuedateMandatory: values?.fromDate,
            isExpirydateMandatory: values?.toDate,
            isAttachmentMandatory: values?.attchment,
            staffCategoryId: Array.isArray(values?.staffCategory)
              ? values.staffCategory.join(',')
              : values?.staffCategory,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
            color: values?.tabColor,
          },
        }).unwrap();
        refetchTabsData();
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
      setNewTabs({
        tabsId: selectedTabsId || 0,
        facility: '',
        tabName: '',
        institution: '',
        staffCategory: '',
        country: '',
        fromDate: '',
        toDate: '',
        attchment: '',
        tabColor: '',
      });
      refetch();
      setSelectedTabsId(null);
      setShowTabsModal(false);
    } catch (error) {
      console.error('Failed to add/update tabs', error);
    }
  };

  return (
    <Dialog
      open={showTabsModal}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      maxWidth={'sm'}
      fullWidth={true}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#0083c0',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
        }}
      >
        <StyledTypography
          fontSize="20px"
          fontWeight="300"
          lineHeight="18px"
          color="#fff"
        >
          {getlabel(
            'MM_SF_T_Tabs',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )}
        </StyledTypography>
        <IconButton
          onClick={handleOnCancel}
          style={{
            padding: '0.7rem',
          }}
          sx={{
            color: '#fff',
            '&:hover': {
              transform: 'scale(1.05)',
              backgroundColor: 'color(srgb 0.75 0.74 0.74 / 0.15)',
            },
          }}
        >
          <Tooltip title="Close" arrow>
            <StyledImage src={CloseIcon} alt="Close Icon" />
          </Tooltip>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FlexContainer flexWrap="wrap">
          <Formik
            enableReinitialize={true}
            initialValues={newTabs}
            validateOnBlur={false}
            validationSchema={tabsValidation}
            onSubmit={(values) => {
              submitTabs(values);
            }}
          >
            {({ values, setFieldValue }) => (
              <Form style={{ width: '100%' }}>
                <Grid
                  container
                  display={'flex'}
                  width="100%"
                  flexWrap={'wrap'}
                  justifyContent={'space-between'}
                  item
                  xs={12}
                  spacing={2}
                  alignItems={'center'}
                  marginTop={'1rem'}
                >
                  {pageFields?.find((x) => x.FieldId === 'SF_T_Facility')
                    ?.IsShow && (
                    <Grid
                      container
                      display={'flex'}
                      width="100%"
                      flexWrap={'wrap'}
                      justifyContent={'space-between'}
                      item
                      xs={12}
                      spacing={2}
                      alignItems={'center'}
                    >
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Label
                          value={getlabel(
                            'MM_SF_T_Facility',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'SF_T_Facility'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <SearchDropdown
                          disableClearable={true}
                          name={'facility'}
                          options={facilityList || []}
                          disabled={selectedTabsId}
                          getOptionLabel={(option) => option.text}
                          dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
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
                            facilityList?.find(
                              (option) => option.value === values['facility']
                            ) || null
                          }
                          onChange={(event, value) => {
                            setFieldValue('facility', value?.value);
                          }}
                        />
                        <ErrorMessage
                          name="facility"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                            marginTop: '4px',
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                  {pageFields?.find((x) => x.FieldId === 'SF_T_TabName')
                    ?.IsShow && (
                    <Grid
                      container
                      display={'flex'}
                      width="100%"
                      flexWrap={'wrap'}
                      justifyContent={'space-between'}
                      item
                      xs={12}
                      spacing={2}
                      alignItems={'center'}
                    >
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Label
                          value={getlabel(
                            'MM_SF_T_TabName',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'SF_T_TabName'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Field name="tabName">
                          {({ field }) => (
                            <TextField
                              {...field}
                              id="tabName"
                              autoComplete="off"
                              values={values.tabName}
                              fullWidth={true}
                              slotProps={{ htmlInput: { maxLength: 100 } }}
                              disabled={isFetching}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="tabName"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                            marginTop: '4px',
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}

                  {pageFields?.find((x) => x.FieldId === 'SF_T_StaffCategory')
                    ?.IsShow && (
                    <Grid
                      container
                      display={'flex'}
                      width="100%"
                      flexWrap={'wrap'}
                      justifyContent={'space-between'}
                      item
                      xs={12}
                      spacing={2}
                      alignItems={'center'}
                    >
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Label
                          value={getlabel(
                            'MM_SF_T_StaffCategory',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'SF_T_StaffCategory'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <MultiSelectDropdown
                          name={'staffCategory'}
                          options={facilityList || []}
                          disabled={selectedTabsId}
                          value={values?.staffCategory}
                        />
                        <ErrorMessage
                          name="staffCategory"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                            marginTop: '4px',
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                  {pageFields?.find((x) => x.FieldId === 'SF_T_Institution')
                    ?.IsShow && (
                    <Grid
                      container
                      display={'flex'}
                      width="100%"
                      flexWrap={'wrap'}
                      justifyContent={'space-between'}
                      item
                      xs={12}
                      spacing={2}
                      alignItems={'center'}
                    >
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Label
                          value={getlabel(
                            'MM_SF_T_Institution',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'SF_T_Institution'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Checkbox
                          style={{ padding: '0px' }}
                          checked={values?.institution}
                          onChange={(e) => {
                            setFieldValue('institution', e?.target?.checked);
                          }}
                        />
                        <ErrorMessage
                          name="institution"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                            marginTop: '4px',
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                  {pageFields?.find((x) => x.FieldId === 'SF_T_Country')
                    ?.IsShow && (
                    <Grid
                      container
                      display={'flex'}
                      width="100%"
                      flexWrap={'wrap'}
                      justifyContent={'space-between'}
                      item
                      xs={12}
                      spacing={2}
                      alignItems={'center'}
                    >
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Label
                          value={getlabel(
                            'MM_SF_T_Country',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'SF_T_Country'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Checkbox
                          style={{ padding: '0px' }}
                          checked={values?.country}
                          onChange={(e) => {
                            setFieldValue('country', e?.target?.checked);
                          }}
                        />
                        <ErrorMessage
                          name="country"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                  {pageFields?.find((x) => x.FieldId === 'SF_T_FromDate')
                    ?.IsShow && (
                    <Grid
                      container
                      display={'flex'}
                      width="100%"
                      flexWrap={'wrap'}
                      justifyContent={'space-between'}
                      item
                      xs={12}
                      spacing={2}
                      alignItems={'center'}
                    >
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Label
                          value={getlabel(
                            'MM_SF_T_FromDate',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'SF_T_FromDate'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Checkbox
                          style={{ padding: '0px' }}
                          checked={values?.fromDate}
                          onChange={(e) => {
                            setFieldValue('fromDate', e?.target?.checked);
                          }}
                        />
                        <ErrorMessage
                          name="fromDate"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                  {pageFields?.find((x) => x.FieldId === 'SF_T_ToDate')
                    ?.IsShow && (
                    <Grid
                      container
                      display={'flex'}
                      width="100%"
                      flexWrap={'wrap'}
                      justifyContent={'space-between'}
                      item
                      xs={12}
                      spacing={2}
                      alignItems={'center'}
                    >
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Label
                          value={getlabel(
                            'MM_SF_T_ToDate',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find((x) => x.FieldId === 'SF_T_ToDate')
                              ?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Checkbox
                          style={{ padding: '0px' }}
                          checked={values?.toDate}
                          onChange={(e) => {
                            setFieldValue('toDate', e?.target?.checked);
                          }}
                        />
                        <ErrorMessage
                          name="toDate"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                  {pageFields?.find((x) => x.FieldId === 'SF_T_Attachment(s)')
                    ?.IsShow && (
                    <Grid
                      container
                      display={'flex'}
                      width="100%"
                      flexWrap={'wrap'}
                      justifyContent={'space-between'}
                      item
                      xs={12}
                      spacing={2}
                      alignItems={'center'}
                    >
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Label
                          value={getlabel(
                            'MM_SF_T_Attachment(s)',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'SF_T_Attachment(s)'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Checkbox
                          style={{ padding: '0px' }}
                          checked={values?.attchment}
                          onChange={(e) => {
                            setFieldValue('attchment', e?.target?.checked);
                          }}
                        />
                        <ErrorMessage
                          name="attchment"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                  {pageFields?.find((x) => x.FieldId === 'SF_T_TabName')
                    ?.IsShow && (
                    <Grid
                      container
                      display={'flex'}
                      width="100%"
                      flexWrap={'wrap'}
                      justifyContent={'space-between'}
                      item
                      xs={12}
                      spacing={2}
                      alignItems={'center'}
                    >
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Label
                          value={getlabel(
                            'MM_SF_T_TabName',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'SF_T_TabName'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Field name="tabColor">
                          {({ field }) => (
                            <ChromePicker
                              color={values?.tabColor}
                              onChangeComplete={(color) => {
                                setFieldValue('tabColor', color?.hex);
                              }}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="tabColor"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                            marginTop: '4px',
                          }}
                        />
                      </Grid>
                    </Grid>
                  )}
                  <Grid
                    display={'flex'}
                    width="100%"
                    justifyContent={'center'}
                    gap={'10px'}
                    marginTop={'1rem'}
                  >
                    <StyledButton
                      borderRadius="6px"
                      gap="4px"
                      padding="6px 10px"
                      variant="contained"
                      backgroundColor="#0083c0"
                      type="submit"
                      style={{ display: 'inline-flex', gap: '5px' }}
                      //disabled={isAdding || isUpdating}
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
                      //disabled={isAdding || isUpdating}
                      style={{ display: 'inline-flex', gap: '5px' }}
                      onClick={handleOnCancel}
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
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </FlexContainer>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditTabs;
