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
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import Label from '../../../../components/Label/Label';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { getlabel } from '../../../../utils/language';
import { useSelector } from 'react-redux';
import { showToastAlert } from '../../../../utils/SweetAlert';
import TextArea from '../../../../components/TextArea/TextArea';
import {
  useAddAffectedCategoryMutation,
  useGetAffectedCategoryByIdQuery,
  useUpdateAffectedCategoryMutation,
} from '../../../../redux/RTK/IncidentManagement/incidentCategoryApi';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';

const AddEditAffectedCategory = ({
  showAffectedCategoryModal,
  setShowAffectedCategoryModal,
  selectedAffectedCategoryId,
  setSelectedAffectedCategoryId,
  facilityList,
  labels,
  refetch,
  fieldAccess,
}) => {
  //* Hooks declaration
  const { t, i18n } = useTranslation();

  //* Selectors
  const {
    selectedMenu,
    userDetails,
    isSuperAdmin,
    roleFacilities,
    regionCode,
    selectedModuleId,
  } = useSelector((state) => state.auth);

  //* State variables
  const [fieldLabels, setFieldLabels] = useState([]);
  const [pageFields, setPageFields] = useState([]);
  const [affectedCategoryList, setAffectedCategoryList] = useState();
  const [newAffectedCategory, setNewAffectedCategory] = useState({
    affectedCateId: 0,
    affectedCategory: '',
    affectedCategoryCode: '',
    facility: '',
  });

  //* RTK Queries

  const [triggerAddAffectedCategory, { isLoading: isAdding }] =
    useAddAffectedCategoryMutation();

  const [triggerUpdateAffectedCategory, { isLoading: isUpdating }] =
    useUpdateAffectedCategoryMutation();

  const {
    data: affectedCategoryRecords,
    isFetching,
    refetch: refetchAffectedCategory,
  } = useGetAffectedCategoryByIdQuery(
    {
      affectedCategoryId: selectedAffectedCategoryId,
      loginUserId: userDetails?.UserId,
      menuId: selectedMenu?.id,
    },
    { skip: !selectedAffectedCategoryId }
  );

  //* Field access checking
  useEffect(() => {
    if (fieldAccess?.Data) {
      const pageFields = fieldAccess?.Data?.Menus?.find(
        (section) => section?.MenuId === selectedMenu?.id
      )?.Sections?.find(
        (sectionName) => sectionName?.SectionName === 'Affected Category-Page'
      )?.Regions;
      if (pageFields) {
        const allFields =
          pageFields?.find((region) => region?.RegionCode === 'ALL')?.Fields ||
          [];
        const regionBasedFields =
          regionCode === 'ABD'
            ? pageFields?.find((region) => region?.RegionCode === 'ABD')
                ?.Fields || []
            : [];
        const combinedFields =
          regionBasedFields.length > 0
            ? [...allFields, ...regionBasedFields]
            : allFields;

        setPageFields(combinedFields);
      }
    }
  }, [fieldAccess, regionCode]);

  //* Use Effects to bind values
  useEffect(() => {
    if (labels?.Data) {
      const filteredLabels = labels?.Data?.find(
        (x) => x.MenuId === selectedMenu?.id
      )?.Regions;

      const allLabels =
        filteredLabels?.find((x) => x.RegionCode === 'ALL')?.Labels || [];

      const regionBasedLabels =
        regionCode === 'ABD'
          ? filteredLabels?.find((x) => x.RegionCode === 'ABD')?.Labels || []
          : [];
      const combinedLabels =
        regionBasedLabels.length > 0
          ? [...allLabels, ...regionBasedLabels]
          : allLabels;
      setFieldLabels(combinedLabels);
    }
  }, [labels, regionCode]);

  useEffect(() => {
    if (affectedCategoryRecords?.Data && selectedAffectedCategoryId) {
      setNewAffectedCategory({
        affectedCateId: affectedCategoryRecords?.Data?.AffectedCategoryId,
        facility: affectedCategoryRecords?.Data?.FacilityId,
        affectedCategoryCode:
          affectedCategoryRecords?.Data?.AffectedCategoryCode,
        affectedCategory: affectedCategoryRecords?.Data?.AffectedCategory,
      });
    }
  }, [affectedCategoryRecords]);

  //* Validation Schema
  const affectedCategoryValidation = Yup.object().shape({
    facility: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IC_AC_P_Facility')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel(
              'IM_IC_AC_Facility',
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
              'IM_IC_AC_Facility',
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
    affectedCategory: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IC_AC_P_AffectedCategory')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IC_AC_AffectedCategory',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    affectedCategoryCode: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IC_AC_P_AffectedCategoryCode')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IC_AC_AffectedCategoryCode',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  //* Close modal
  const handleOnCancel = () => {
    setNewAffectedCategory({
      affectedCateId: 0,
      affectedCategory: '',
      affectedCategoryCode: '',
      facility: '',
    });
    setSelectedAffectedCategoryId(null);
    setShowAffectedCategoryModal(false);
  };

  //* Submit Affected Category
  const submitAffectedCategory = async (values) => {
    try {
      let response;
      if (newAffectedCategory?.affectedCateId === 0) {
        response = await triggerAddAffectedCategory({
          payload: {
            affectedCategoryCode: values?.affectedCategoryCode,
            affectedCategory: values?.affectedCategory,
            facilityIds: values?.facility,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        });
      }
      if (newAffectedCategory?.affectedCateId !== 0) {
        response = await triggerUpdateAffectedCategory({
          payload: {
            affectedCategoryId: values?.affectedCateId,
            affectedCategoryCode: values?.affectedCategoryCode,
            affectedCategory: values?.affectedCategory,
            facilityId: values?.facility,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        });
        refetchAffectedCategory();
      }

      if (response && response?.data?.Message !== 'Record Already Exist') {
        showToastAlert({
          type: 'custom_success',
          text: response?.data?.Message,
          gif: 'SuccessGif',
        });
      }
      if (
        response &&
        response?.data?.Message === 'Record Created Successfully'
      ) {
        showToastAlert({
          type: 'custom_success',
          text: response?.data?.Message,
          gif: 'SuccessGif',
        });
      }
      if (
        response &&
        response?.data?.Message === 'Category Affected already exists'
      ) {
        showToastAlert({
          type: 'custom_info',
          text: response?.data?.Message,
          gif: 'InfoGif',
        });
      }
      setNewAffectedCategory({
        affectedCateId: 0,
        affectedCategory: '',
        affectedCategoryCode: '',
        facility: '',
      });
      refetch();
      setSelectedAffectedCategoryId(null);
      setShowAffectedCategoryModal(false);
    } catch (error) {
      console.error('Failed to add/update Main Category', error);
    }
  };

  return (
    <Dialog
      open={showAffectedCategoryModal}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      maxWidth={'md'}
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
            'IM_IC_AC_AffectedCategory',
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
      <DialogContent style={{ height: isFetching ? '50vh' : 'auto' }}>
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
          <FlexContainer flexWrap="wrap">
            <Formik
              enableReinitialize={true}
              initialValues={newAffectedCategory}
              validateOnBlur={false}
              validateOnMount={false}
              validationSchema={affectedCategoryValidation}
              onSubmit={(values) => submitAffectedCategory(values)}
            >
              {({ values, errors, setFieldValue, touched }) => (
                <Form
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
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
                    {pageFields?.find((x) => x.FieldId === 'IC_AC_P_Facility')
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
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                          <Label
                            value={getlabel(
                              'IM_IC_AC_Facility',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IC_AC_P_Facility'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                          <SearchDropdown
                            disableClearable={true}
                            disabled={selectedAffectedCategoryId}
                            name="facility"
                            options={[
                              { text: 'Select', value: '' },
                              ...(userDetails?.ApplicableFacilities?.filter(
                                (facility) => {
                                  if (!facility.IsActive) return false;
                                  if (isSuperAdmin) return true;
                                  const facilityItem = roleFacilities
                                    ?.find(
                                      (role) =>
                                        role.FacilityId === facility.FacilityId
                                    )
                                    ?.Menu?.find(
                                      (MenuItem) =>
                                        MenuItem.MenuId === selectedMenu?.id
                                    );
                                  return facilityItem?.IsAdd;
                                }
                              )
                                ?.filter(
                                  (facility) => facility?.RegionCode === 'ABD'
                                )
                                .map((facility) => ({
                                  text: facility.FacilityName,
                                  value: facility.FacilityId,
                                })) || []),
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
                            value={
                              userDetails?.ApplicableFacilities?.filter(
                                (facility) => {
                                  if (!facility.IsActive) return false;
                                  if (isSuperAdmin) return true;
                                  const facilityItem = roleFacilities
                                    ?.find(
                                      (role) =>
                                        role.FacilityId === facility.FacilityId
                                    )
                                    ?.Menu?.find(
                                      (MenuItem) =>
                                        MenuItem.MenuId === selectedMenu?.id
                                    );
                                  return facilityItem?.IsAdd;
                                }
                              )
                                ?.filter(
                                  (facility) => facility?.RegionCode === 'ABD'
                                )
                                .map((facility) => ({
                                  text: facility.FacilityName,
                                  value: facility.FacilityId,
                                }))
                                ?.find(
                                  (option) =>
                                    option.value === values['facility']
                                ) || null
                            }
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
                    {pageFields?.find(
                      (x) => x.FieldId === 'IC_AC_P_AffectedCategoryCode'
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
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                          <Label
                            value={getlabel(
                              'IM_IC_AC_AffectedCategoryCode',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) =>
                                  x.FieldId === 'IC_AC_P_AffectedCategoryCode'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                          <Field name="affectedCategoryCode">
                            {({ field }) => (
                              <TextField
                                {...field}
                                id="affectedCategoryCode"
                                autoComplete="off"
                                values={values.affectedCategoryCode}
                                fullWidth={true}
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                                // disabled={isFetching}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="affectedCategoryCode"
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
                      (x) => x.FieldId === 'IC_AC_P_AffectedCategory'
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
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                          <Label
                            value={getlabel(
                              'IM_IC_AC_AffectedCategory',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IC_AC_P_AffectedCategory'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                          <Field name="affectedCategory">
                            {({ field }) => (
                              <TextField
                                {...field}
                                id="affectedCategory"
                                autoComplete="off"
                                values={values.affectedCategory}
                                fullWidth={true}
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                                // disabled={isFetching}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="affectedCategory"
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
                      marginTop={'2rem'}
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddEditAffectedCategory;
