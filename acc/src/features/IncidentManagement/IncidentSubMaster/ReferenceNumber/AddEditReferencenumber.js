import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Grid,
  TextField,
  Autocomplete,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import Label from '../../../../components/Label/Label';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { getlabel } from '../../../../utils/language';
import { useSelector } from 'react-redux';
import {
  useAddReferenceNumberMutation,
  useGetReferenceNumberDataByIdQuery,
  useUpdateReferenceNumberMutation,
} from '../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';
import { showToastAlert } from '../../../../utils/SweetAlert';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';

const AddEditReferencenumber = ({
  showReferenceNumberModal,
  setShowReferenceNumberModal,
  selectedReferenceNumberId,
  setSelectedReferenceNumberId,
  labels,
  facilityList,
  dateFormatList,
  resetNumberingList,
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
  const [fieldLabels, setFieldLabels] = useState([]);
  const [newReferenceNumber, setNewReferenceNumber] = useState({
    refNumberId: selectedReferenceNumberId || 0,
    facility: '',
    incRefNumber: '',
    incDateFormat: '',
    resetNumbering: '',
  });

  //* RTK Queries
  const [triggerAddReferenceNumber, { isLoading: isAdding }] =
    useAddReferenceNumberMutation();
  const [triggerUpdateReferenceNumber, { isLoading: isUpdating }] =
    useUpdateReferenceNumberMutation();

  const {
    data: refNoRecords,
    isFetching,
    refetch: refetchRefNoData,
  } = useGetReferenceNumberDataByIdQuery(
    {
      incidentReferenceId: selectedReferenceNumberId,
      loginUserId: userDetails?.UserId,
    },
    { skip: !selectedReferenceNumberId }
  );

  //* Field access checking
  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) =>
        sectionName?.SectionName === 'Incident Reference Number-Page'
    )
    ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields;

  //* Use Effects to bind values
  useEffect(() => {
    if (labels?.Data) {
      const regionList = labels?.Data?.find(
        (x) => x.MenuId === selectedMenu?.id
      )?.Regions;
      const labelsList = regionList?.find(
        (x) => x.RegionCode === 'ALL'
      )?.Labels;
      setFieldLabels(labelsList);
    }
  }, [labels]);

  useEffect(() => {
    if (refNoRecords?.Data && selectedReferenceNumberId) {
      setNewReferenceNumber({
        refNumberId: refNoRecords?.Data?.IncidentReferenceId,
        facility: [refNoRecords?.Data?.FacilityId],
        incRefNumber: refNoRecords?.Data?.IncidentReferenceNo,
        incDateFormat: dateFormatList?.find(
          (x) => x.text === refNoRecords?.Data?.DateFormat
        )?.value,
        resetNumbering: resetNumberingList?.find(
          (x) => x.text === refNoRecords?.Data?.NumberReset
        )?.value,
      });
    }
  }, [refNoRecords]);

  //* Validation Schema
  const referenceNumberValidation = Yup.object().shape({
    facility: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_IRN_P_Facility')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel(
              'IM_IS_IRN_Facility',
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
              'IM_IS_IRN_Facility',
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
    incRefNumber: Yup.string().when([], {
      is: () =>
        pageFields?.find(
          (x) => x.FieldId === 'IS_IRN_P_IncidentReferenceNumber'
        )?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel(
              'IM_IS_IRN_IncidentReferenceNumber',
              {
                Data: fieldLabels,
                Status: labels?.Status,
              },
              i18n.language
            )} ${t('IsRequired')}`
          )
          .max(7, 'Maximum 7 characters allowed'),
      otherwise: (schema) =>
        schema.notRequired().max(7, 'Maximum 7 characters allowed'),
    }),
    incDateFormat: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_IRN_P_IncidentDateFormat')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel(
              'IM_IS_IRN_IncidentDateFormat',
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
              'IM_IS_IRN_IncidentDateFormat',
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
    resetNumbering: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_IRN_P_ResetNumbering')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel(
              'IM_IS_IRN_ResetNumbering',
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
              'IM_IS_IRN_ResetNumbering',
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
  });

  //* Close modal
  const handleOnCancel = () => {
    setNewReferenceNumber({
      refNumberId: 0,
      facility: '',
      incRefNumber: '',
      incDateFormat: '',
      resetNumbering: '',
    });
    setSelectedReferenceNumberId(null);
    setShowReferenceNumberModal(false);
  };

  //* Submit reference number
  const submitReferenceNumber = async (values) => {
    try {
      let response;
      if (newReferenceNumber?.refNumberId === 0) {
        response = await triggerAddReferenceNumber({
          payload: {
            incidentReferenceId: values?.refNumberId,
            incidentReferenceNo: values?.incRefNumber,
            dateFormat: dateFormatList?.find(
              (x) => x.value === values?.incDateFormat
            )?.text,
            numberReset: resetNumberingList?.find(
              (x) => x.value === values?.resetNumbering
            )?.text,
            facilityIds: values?.facility?.join(','),
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        }).unwrap();
      }
      if (newReferenceNumber?.refNumberId !== 0) {
        response = await triggerUpdateReferenceNumber({
          payload: {
            incidentReferenceId: values?.refNumberId,
            incidentReferenceNo: values?.incRefNumber,
            facilityId: parseInt(values?.facility?.join(',')),
            dateFormat: dateFormatList?.find(
              (x) => x.value === values?.incDateFormat
            )?.text,
            numberReset: resetNumberingList?.find(
              (x) => x.value === values?.resetNumbering
            )?.text,
            loginUserId: userDetails?.UserId,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
          },
        }).unwrap();
        refetchRefNoData();
      }

      if (response && response.Message !== 'Record Already Exist') {
        showToastAlert({
          type: 'custom_success',
          text: response.Message,
          git: 'SuccessGif',
        });
      }
      if (response && response.Message === 'Record Already Exist') {
        showToastAlert({
          type: 'custom_info',
          text: response.Message,
          gif: 'InfoGif',
        });
      }
      setNewReferenceNumber({
        refNumberId: 0,
        facility: '',
        incRefNumber: '',
        incDateFormat: '',
        resetNumbering: '',
      });
      refetch();
      setSelectedReferenceNumberId(null);
      setShowReferenceNumberModal(false);
    } catch (error) {
      console.error('Failed to add/update reference number', error);
    }
  };

  return (
    <Dialog
      open={showReferenceNumberModal}
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
            'IM_IS_IRN_IncidentReferenceNumber',
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
            initialValues={newReferenceNumber}
            validateOnBlur={false}
            validationSchema={referenceNumberValidation}
            onSubmit={(values) => submitReferenceNumber(values)}
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
                  {pageFields?.find((x) => x.FieldId === 'IS_IRN_P_Facility')
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
                            'IM_IS_IRN_Facility',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'IS_IRN_P_Facility'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <MultiSelectDropdown
                          name={'facility'}
                          options={facilityList
                            .filter((facility) => {
                              if (isSuperAdmin) return true;
                              const facilityItem = roleFacilities?.find(
                                (role) =>
                                  role.FacilityId === facility.FacilityId
                              )?.Menu?.[selectedMenu?.id];
                              return facilityItem?.IsAdd;
                            })
                            .map((facility) => ({
                              text: facility.FacilityName,
                              value: facility.FacilityId,
                            }))}
                          disabled={selectedReferenceNumberId}
                          value={values?.facility}
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
                  {pageFields?.find(
                    (x) => x.FieldId === 'IS_IRN_P_IncidentReferenceNumber'
                  )?.IsShow && (
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
                            'IM_IS_IRN_IncidentReferenceNumber',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) =>
                                x.FieldId === 'IS_IRN_P_IncidentReferenceNumber'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Field name="incRefNumber">
                          {({ field }) => (
                            <TextField
                              {...field}
                              id="incRefNumber"
                              autoComplete="off"
                              values={values.incRefNumber}
                              fullWidth={true}
                              slotProps={{ htmlInput: { maxLength: 100 } }}
                              disabled={isFetching}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="incRefNumber"
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
                  {pageFields?.find(
                    (x) => x.FieldId === 'IS_IRN_P_IncidentDateFormat'
                  )?.IsShow && (
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
                            'IM_IS_IRN_IncidentDateFormat',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'IS_IRN_P_IncidentDateFormat'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <SearchDropdown
                          disableClearable={true}
                          name={'incDateFormat'}
                          options={[
                            { text: 'Select', value: '' },
                            ...(dateFormatList || []),
                          ]}
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
                            dateFormatList?.find(
                              (option) =>
                                option.value === values['incDateFormat']
                            ) || null
                          }
                          onChange={(event, value) => {
                            setFieldValue('incDateFormat', value?.value);
                          }}
                        />
                        <ErrorMessage
                          name="incDateFormat"
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
                  {pageFields?.find(
                    (x) => x.FieldId === 'IS_IRN_P_ResetNumbering'
                  )?.IsShow && (
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
                            'IM_IS_IRN_ResetNumbering',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'IS_IRN_P_ResetNumbering'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <SearchDropdown
                          disableClearable={true}
                          name={'resetNumbering'}
                          options={[
                            { text: 'Select', value: '' },
                            ...(resetNumberingList || []),
                          ]}
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
                            resetNumberingList?.find(
                              (option) =>
                                option.value === values['resetNumbering']
                            ) || null
                          }
                          onChange={(event, value) => {
                            setFieldValue('resetNumbering', value?.value);
                          }}
                        />
                        <ErrorMessage
                          name="resetNumbering"
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
                      disabled={isAdding || isUpdating}
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
                      disabled={isAdding || isUpdating}
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

export default AddEditReferencenumber;
