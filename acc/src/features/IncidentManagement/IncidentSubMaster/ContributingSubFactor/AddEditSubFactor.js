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
import {
  useAddContributingSubFactorMutation,
  useGetContributingMainFactorQuery,
  useGetContributingSubFactorByIdQuery,
  useUpdateContributingSubFactorMutation,
} from '../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';
import { showToastAlert } from '../../../../utils/SweetAlert';
import TextArea from '../../../../components/TextArea/TextArea';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';

const AddEditSubFactor = ({
  showSubFactorModal,
  setShowSubFactorModal,
  selectedSubFactorId,
  setSelectedSubFactorId,
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
    selectedFacility,
    selectedModuleId,
  } = useSelector((state) => state.auth);

  //* State variables
  const [fieldLabels, setFieldLabels] = useState([]);
  const [pageFields, setPageFields] = useState([]);
  const [newSubFactor, setNewSubFactor] = useState({
    subFactorId: 0,
    mainFactorId: '',
    facility: '',
    subFactor: '',
    subFactorCode: '',
  });
  const [mainFactorList, setMainFactorList] = useState([]);

  //* RTK Queries

  const [triggerAddSubFactor, { isLoading: isAdding }] =
    useAddContributingSubFactorMutation();

  const [triggerUpdateSubFactor, { isLoading: isUpdating }] =
    useUpdateContributingSubFactorMutation();

  const {
    data: mainFactorDetails,
    isFetching: mainFactorFetching,
    refetch: refetchMainFactor,
  } = useGetContributingMainFactorQuery(
    {
      payload: {
        pageIndex: 1,
        pageSize: 25,
        headerFacility: selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: 2,
        // moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
        facilityIds: userDetails?.ApplicableFacilities?.filter((facility) => {
          if (!facility.IsActive) return false;
          if (isSuperAdmin) return true;
          const facilityItem = roleFacilities
            ?.find((role) => role.FacilityId === facility.FacilityId)
            ?.Menu?.find((MenuItem) => MenuItem.MenuId === selectedMenu?.id);
          return facilityItem?.IsAdd;
        })
          ?.map((facility) => facility.FacilityId)
          ?.join(','),
      },
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const {
    data: subFactorRecords,
    isFetching,
    refetch: refetchSubFactorData,
  } = useGetContributingSubFactorByIdQuery(
    {
      subFactorId: selectedSubFactorId,
      loginUserId: userDetails?.UserId,
      menuId: selectedMenu?.id,
    },
    { skip: !selectedSubFactorId }
  );

  //* Use Effect to bin data

  useEffect(() => {
    if (subFactorRecords?.Data && selectedSubFactorId) {
      setNewSubFactor({
        subFactorId: subFactorRecords?.Data?.SubFactorId,
        mainFactorId: subFactorRecords?.Data?.MainFactorId,
        facility: [subFactorRecords?.Data?.FacilityId],
        subFactor: subFactorRecords?.Data?.ContributingSubFactor,
        subFactorCode: subFactorRecords?.Data?.ContributingSubFactorCode,
      });
    }
  }, [subFactorRecords]);

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
    if (fieldAccess?.Data) {
      const pageFields = fieldAccess?.Data?.Menus?.find(
        (section) => section?.MenuId === selectedMenu?.id
      )?.Sections?.find(
        (sectionName) =>
          sectionName?.SectionName === 'Contributing Sub Factor-Page'
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

  useEffect(() => {
    if (mainFactorDetails) {
      const isCategoryFieldShow = pageFields?.find(
        (x) => x.FieldId === 'IS_CSF_P_ContributingMainFactorCode'
      )?.IsShow;
      const isCategoryCodeFieldShow = pageFields?.find(
        (x) => x.FieldId === 'IS_CSF_P_ContributingMainFactor'
      )?.IsShow;

      if (isCategoryFieldShow && !isCategoryCodeFieldShow) {
        setMainFactorList(
          mainFactorDetails?.Records?.map((item) => ({
            text: item.ContributingFactor,
            value: item.MainFactorId,
          }))
        );
      } else if (isCategoryCodeFieldShow && !isCategoryFieldShow) {
        setAffectedCategoryList(
          mainFactorDetails?.Records?.map((item) => ({
            text: item.ContributingFactorCode,
            value: item.MainFactorId,
          }))
        );
      } else if (isCategoryFieldShow && isCategoryCodeFieldShow) {
        setMainFactorList(
          mainFactorDetails?.Records?.map((item) => ({
            text: `${item.ContributingFactorCode} - ${item.ContributingFactor}`,
            value: item.MainFactorId,
          }))
        );
      }
    }
  }, [mainFactorDetails, pageFields]);

  //* Validation Schema
  const subFactorValidation = Yup.object().shape({
    facility: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_CSF_P_Facility')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel(
              'IM_IS_CSF_Facility',
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
              'IM_IS_CSF_Facility',
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
    mainFactorId: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_CSF_P_ContributingMainFactor')
          ?.IsMandatory === true ||
        pageFields?.find(
          (x) => x.FieldId === 'IS_CSF_P_ContributingMainFactorCode'
        )?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IS_CSF_ContributingMainFactor',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    subFactor: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IS_CSF_P_ContributingSubFactor')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IS_CSF_ContributingSubFactor',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    subFactorCode: Yup.string().when([], {
      is: () =>
        pageFields?.find(
          (x) => x.FieldId === 'IS_CSF_P_ContributingSubFactorCode'
        )?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IS_CSF_ContributingSubFactorCode',
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
    setNewSubFactor({
      subFactorId: 0,
      mainFactorId: '',
      facility: '',
      subFactor: '',
      subFactorCode: '',
    });
    setSelectedSubFactorId(null);
    setShowSubFactorModal(false);
  };

  //* Submit sub factor
  const submitSubFactor = async (values) => {
    try {
      let response;
      if (newSubFactor?.subFactorId === 0) {
        response = await triggerAddSubFactor({
          payload: {
            subFactorId: values?.subFactorId,
            mainFactorId: values?.mainFactorId,
            mainFactorCode: mainFactorDetails?.Records?.find(
              (x) => x.MainFactorId === values?.mainFactorId
            )?.ContributingFactorCode,
            mainFactor: mainFactorDetails?.Records?.find(
              (x) => x.MainFactorId === values?.mainFactorId
            )?.ContributingFactor,
            contributingSubFactor: values?.subFactor,
            contributingSubFactorCode: values?.subFactorCode,
            facilityIds: values?.facility?.join(','),
            moduleId: 2,
            // moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        });
      }
      if (newSubFactor?.subFactorId !== 0) {
        response = await triggerUpdateSubFactor({
          payload: {
            subFactorId: values?.subFactorId,
            mainFactorId: values?.mainFactorId,
            mainFactorCode: mainFactorDetails?.Records?.find(
              (x) => x.MainFactorId === values?.mainFactorId
            )?.ContributingFactorCode,
            mainFactor: mainFactorDetails?.Records?.find(
              (x) => x.MainFactorId === values?.mainFactorId
            )?.ContributingFactor,
            contributingSubFactor: values?.subFactor,
            contributingSubFactorCode: values?.subFactorCode,
            facilityId: parseInt(values?.facility?.join(',')),
            moduleId: 2,
            // moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        });
        refetchSubFactorData();
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
        response?.data?.Message ===
          'Contributing Sub Factor already exists for Facility'
      ) {
        showToastAlert({
          type: 'custom_info',
          text: response?.data?.Message,
          gif: 'InfoGif',
        });
      }
      setNewSubFactor({
        subFactorId: 0,
        mainFactorId: '',
        facility: '',
        subFactor: '',
        subFactorCode: '',
      });
      refetch();
      setSelectedSubFactorId(null);
      setShowSubFactorModal(false);
    } catch (error) {
      console.error('Failed to add/update Incient Type', error);
    }
  };

  return (
    <Dialog
      open={showSubFactorModal}
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
            'IM_IS_CSF_ContributingSubFactor',
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
              initialValues={newSubFactor}
              validateOnBlur={false}
              validateOnMount={false}
              validationSchema={subFactorValidation}
              onSubmit={(values) => submitSubFactor(values)}
            >
              {({ values, setFieldValue }) => (
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
                    {pageFields?.find((x) => x.FieldId === 'IS_CSF_P_Facility')
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
                              'IM_IS_CSF_Facility',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IS_CSF_P_Facility'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                          <MultiSelectDropdown
                            name="facility"
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
                            disabled={selectedSubFactorId}
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
                    {(pageFields?.find(
                      (x) => x.FieldId === 'IS_CSF_P_ContributingMainFactor'
                    )?.IsShow ||
                      pageFields?.find(
                        (x) =>
                          x.FieldId === 'IS_CSF_P_ContributingMainFactorCode'
                      )?.IsShow) && (
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
                              'IM_IS_CSF_ContributingMainFactor',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) =>
                                  x.FieldId ===
                                  'IS_CSF_P_ContributingMainFactor'
                              )?.IsMandatory ||
                              pageFields?.find(
                                (x) =>
                                  x.FieldId ===
                                  'IS_CSF_P_ContributingMainFactorCode'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                          <SearchDropdown
                            disableClearable={true}
                            name={'mainFactorId'}
                            options={[
                              { text: 'Select', value: '' },
                              ...(mainFactorList || []),
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
                              mainFactorList?.find(
                                (option) =>
                                  option.value === values['mainFactorId']
                              ) || null
                            }
                            onChange={(event, value) => {
                              setFieldValue('mainFactorId', value?.value);
                            }}
                          />
                          <ErrorMessage
                            name="mainFactorId"
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
                      (x) => x.FieldId === 'IS_CSF_P_ContributingSubFactorCode'
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
                              'IM_IS_CSF_ContributingSubFactorCode',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) =>
                                  x.FieldId ===
                                  'IS_CSF_P_ContributingSubFactorCode'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                          <Field name="subFactorCode">
                            {({ field, form }) => (
                              <TextField
                                {...field}
                                id="subFactorCode"
                                autoComplete="off"
                                values={values?.subFactorCode}
                                fullWidth={true}
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="subFactorCode"
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
                      (x) => x.FieldId === 'IS_CSF_P_ContributingSubFactor'
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
                      >
                        <Grid item xs={12} sm={12} md={4} lg={4}>
                          <Label
                            value={getlabel(
                              'IM_IS_CSF_ContributingSubFactor',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) =>
                                  x.FieldId === 'IS_CSF_P_ContributingSubFactor'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                          <Field name="subFactor">
                            {({ field }) => (
                              <TextArea name="subFactor" {...field} />
                            )}
                          </Field>
                          <ErrorMessage
                            name="subFactor"
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

export default AddEditSubFactor;
