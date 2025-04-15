import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Tooltip,
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
import Label from '../../../../components/Label/Label';
import {
  useAddLocationTypeMutation,
  useGetLocationTypeDataByIdQuery,
  useUpdateLocationTypeMutation,
} from '../../../../redux/RTK/departmentMasterApi';
import { getlabel } from '../../../../utils/language';
import { showToastAlert } from '../../../../utils/SweetAlert';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';

const AddEditLocationType = ({
  open,
  selectedLocationId,
  setShowLocationTypeModal,
  setSelectedLocationId,
  labels,
  refetch,
  fieldAccess,
  facilityList,
}) => {
  const { i18n, t } = useTranslation();

  const { selectedMenu, selectedModuleId, userDetails } = useSelector(
    (state) => state.auth
  );

  const pageFields = fieldAccess?.Data?.Sections?.find(
    (section) => section?.SectionName === 'Page'
  )?.Fields;

  const [newLocationType, setNewLocationType] = useState({
    locationId: 0,
    locationName: '',
    facility: '',
  });

  const [triggerAddLocationType, { isLoading: isAdding }] =
    useAddLocationTypeMutation();
  const [triggerUpdateLocationType, { isLoading: isUpdating }] =
    useUpdateLocationTypeMutation();

  const locationTypeValidation = Yup.object().shape({
    facility: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'DM_P_Facility')?.IsMandatory ===
        true,
      then: (schema) =>
        schema
          .required(
            `${getlabel('MM_DM_Facility', labels, i18n.language)} ${t('IsRequired')}`
          )
          .test(
            'is-zero',
            `${getlabel('MM_DM_Facility', labels, i18n.language)} ${t('IsRequired')}`,
            (value) => {
              return value !== 0;
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    locationName: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'DM_P_LocationType')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_DM_LocationType', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const {
    data: locationRecords,
    isFetching,
    refetch: refetchLocationData,
  } = useGetLocationTypeDataByIdQuery(
    {
      locationId: selectedLocationId,
      loginUserId: userDetails?.UserId,
      menuId: selectedMenu?.id,
    },
    { skip: !selectedLocationId }
  );

  useEffect(() => {
    if (locationRecords?.Data && selectedLocationId) {
      setNewLocationType({
        locationId: locationRecords?.Data?.LocationId,
        locationName: locationRecords?.Data?.LocationName,
        facility: locationRecords?.Data?.FacilityId,
      });
    }
  }, [locationRecords]);

  const submitLocationType = async (values) => {
    const facilityIds =
      Array.isArray(values?.facility) && values?.facility.join(',');
    try {
      let response;
      if (newLocationType?.locationId === 0) {
        response = await triggerAddLocationType({
          payload: {
            locationId: newLocationType?.locationId,
            locationName: values?.locationName,
            facilityId: 0,
            createdBy: userDetails?.UserId,
            createdDate: new Date().toISOString(),
            modifiedBy: null,
            modifiedDate: null,
            isDelete: false,
            screenName: ' ',
            facilityIds: facilityIds,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        }).unwrap();
      } else if (newLocationType?.locationId) {
        response = await triggerUpdateLocationType({
          payload: {
            locationName: values?.locationName,
            locationId: values?.locationId,
            facilityId: values?.facility,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        }).unwrap();
        refetchLocationData();
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
      setNewLocationType({
        locationId: 0,
        locationName: '',
      });
      refetch();
      setSelectedLocationId(null);
      setShowLocationTypeModal(false);
    } catch (error) {
      console.error('Failed to add/update location type', error);
    }
  };

  const handleOnCancel = () => {
    setNewLocationType({
      locationId: 0,
      locationName: '',
    });
    setSelectedLocationId(null);
    setShowLocationTypeModal(false);
  };

  return (
    <Dialog
      open={open}
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
          backgroundColor: '#205475',
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
          {getlabel('MM_DM_LocationType', labels, i18n.language)}
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
            initialValues={newLocationType}
            validateOnBlur={false}
            validationSchema={locationTypeValidation}
            onSubmit={(values) => submitLocationType(values)}
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
                >
                  {pageFields?.find((x) => x.FieldId === 'DM_P_Facility')
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
                      marginTop={'1rem'}
                    >
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Label
                          value={getlabel(
                            'MM_DM_Facility',
                            labels,
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'DM_P_Facility'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <MultiSelectDropdown
                          disableClearable={true}
                          name={'facility'}
                          options={[...(facilityList || [])]}
                          disabled={selectedLocationId}
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
                  {pageFields?.find((x) => x.FieldId === 'DM_P_LocationType')
                    ?.IsShow && (
                    <>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Label
                          value={getlabel(
                            'MM_DM_LocationType',
                            labels,
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'DM_P_LocationType'
                            )?.IsMandatory
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={8}>
                        <Field name="locationName">
                          {({ field }) => (
                            <TextField
                              {...field}
                              id="locationName"
                              autoComplete="off"
                              values={values.locationName}
                              fullWidth={true}
                              slotProps={{ htmlInput: { maxLength: 100 } }}
                              disabled={isFetching}
                            />
                          )}
                        </Field>
                        <ErrorMessage
                          name="locationName"
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
                </Grid>
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
                    color="primary"
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
              </Form>
            )}
          </Formik>
        </FlexContainer>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditLocationType;
