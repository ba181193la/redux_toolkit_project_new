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
import NotificationStaffList from './NotificationStaffList';
import {
  useAddSubCategoryMutation,
  useGetAffectedCategoryQuery,
  useGetSubCategoryByIdQuery,
  useLazyGetMainCategoryQuery,
  useUpdateSubCategoryMutation,
  useLazyGetAffectedCategoryQuery,
} from '../../../../redux/RTK/IncidentManagement/incidentCategoryApi';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';

const AddEditSubCategory = ({
  showSubCategoryModal,
  setShowSubCategoryModal,
  selectedSubCategoryId,
  setSelectedSubCategoryId,
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
    selectedFacility,
  } = useSelector((state) => state.auth);

  //* State variables
  const [fieldLabels, setFieldLabels] = useState([]);
  const [notiStaffList, setNotiStaffList] = useState([]);
  const [pageFields, setPageFields] = useState([]);
  const [affectedCategoryList, setAffectedCategoryList] = useState();
  const [mainCategoryList, setMainCategoryList] = useState([]);
  const [hideABDFields, setHideABDFields] = useState(false);
  const [newSubCategory, setNewSubCategory] = useState({
    subCateId: 0,
    facility: '',
    affectedCategory: '',
    mainCategory: '',
    subCategoryCode: '',
    subCategory: '',
    notiStaffList: notiStaffList,
  });

  //* RTK Queries

  const [triggerAddSubCategory, { isLoading: isAdding }] =
    useAddSubCategoryMutation();

  const [triggerUpdateSubCategory, { isLoading: isUpdating }] =
    useUpdateSubCategoryMutation();

  const [triggerGetAffectedCategory, { isLoading: isFetchingAC }] =
    useLazyGetAffectedCategoryQuery();

  const [triggerGetMainCategory, { isFetching: fetchingMainCategory }] =
    useLazyGetMainCategoryQuery();

  const {
    data: subCategoryRecords,
    isFetching,
    refetch: refetchSubCategory,
  } = useGetSubCategoryByIdQuery(
    {
      subCategoryId: selectedSubCategoryId,
      loginUserId: userDetails?.UserId,
      menuId: selectedMenu?.id,
    },
    { skip: !selectedSubCategoryId }
  );

  //* Get Affected Category list
  const getAffectedCategoryList = async (id) => {
    if (id) {
      userDetails?.ApplicableFacilities?.find((x) => x.FacilityId === id)
        ?.RegionCode === 'ABD'
        ? setHideABDFields(false)
        : setHideABDFields(true);

      if (
        userDetails?.ApplicableFacilities?.find((x) => x.FacilityId === id)
          ?.RegionCode === 'ABD'
      ) {
        let response = await triggerGetAffectedCategory({
          moduleId: selectedModuleId,
          loginUserId: userDetails?.UserId,
          menuId: selectedMenu?.id,
          headerFacilityId: id,
        });

        if (response?.data?.Data) {
          const isCategoryFieldShow = pageFields?.find(
            (x) => x.FieldId === 'IC_SC_P_AffectedCategory'
          )?.IsShow;
          const isCategoryCodeFieldShow =
            pageFields?.find(
              (x) => x.FieldId === 'IC_SC_P_AffectedCategoryCode'
            )?.IsShow && !hideABDFields;

          if (isCategoryFieldShow && !isCategoryCodeFieldShow) {
            setAffectedCategoryList(
              response?.data?.Data?.map((item) => ({
                text: item.AffectedCategory,
                value: item.AffectedCategoryId,
              }))
            );
          } else if (isCategoryCodeFieldShow && !isCategoryFieldShow) {
            setAffectedCategoryList(
              response?.data?.Data?.map((item) => ({
                text: item.AffectedCategoryCode,
                value: item.AffectedCategoryId,
              }))
            );
          } else if (isCategoryFieldShow && isCategoryCodeFieldShow) {
            setAffectedCategoryList(
              response?.data?.Data?.map((item) => ({
                text: `${item.AffectedCategory} - ${item.AffectedCategoryCode}`,
                value: item.AffectedCategoryId,
              }))
            );
          }
        }
      } else {
        getMainCategoryList(0, id);
      }
    } else {
      regionCode === 'ABD' ? setHideABDFields(false) : setHideABDFields(true);
      setAffectedCategoryList([]);
      setMainCategoryList([]);
    }
  };

  //* Field access checking
  useEffect(() => {
    if (fieldAccess?.Data) {
      const pageFields = fieldAccess?.Data?.Menus?.find(
        (section) => section?.MenuId === selectedMenu?.id
      )?.Sections?.find(
        (sectionName) => sectionName?.SectionName === 'Sub Category-Page'
      )?.Regions;
      if (pageFields) {
        const allFields =
          pageFields?.find((region) => region?.RegionCode === 'ALL')?.Fields ||
          [];
        const regionBasedFields =
          pageFields?.find((region) => region?.RegionCode === 'ABD')?.Fields ||
          [];

        const combinedFields = [...allFields, ...regionBasedFields];

        setPageFields(combinedFields);
        regionCode === 'ABD' ? setHideABDFields(false) : setHideABDFields(true);
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
        filteredLabels?.find((x) => x.RegionCode === 'ABD')?.Labels || [];

      const combinedLabels = [...allLabels, ...regionBasedLabels];

      setFieldLabels(combinedLabels);
    }
  }, [labels, regionCode]);

  useEffect(() => {
    if (subCategoryRecords?.Data && selectedSubCategoryId) {
      setNewSubCategory({
        subCateId: subCategoryRecords?.Data?.SubCategory?.SubCategoryId,
        facility: subCategoryRecords?.Data?.SubCategory?.FacilityId,
        notiStaffList: subCategoryRecords?.Data?.NotifyStaffList?.map((x) => ({
          facility: x?.Facility,
          userId: x?.UserId,
          userName: x?.UserName,
          departmentName: x?.Department,
          designationName: x?.Designation,
        })),
        affectedCategory:
          subCategoryRecords?.Data?.SubCategory?.AffectedCategoryId,
        mainCategory: subCategoryRecords?.Data?.SubCategory?.MainCategoryId,
        subCategory: subCategoryRecords?.Data?.SubCategory?.SubCategory,
        subCategoryCode: subCategoryRecords?.Data?.SubCategory?.SubCategoryCode,
      });
      setNotiStaffList(
        subCategoryRecords?.Data?.NotifyStaffList?.map((x) => ({
          facility: x?.Facility,
          userId: x?.UserId,
          userName: x?.UserName,
          departmentName: x?.Department,
          designationName: x?.Designation,
        }))
      );
      if (regionCode === 'ABD' && !hideABDFields) {
        getAffectedCategoryList(
          subCategoryRecords?.Data?.SubCategory?.FacilityId
        );
      } else if (regionCode === 'All') {
        setAffectedCategoryList([]);
        getMainCategoryList(
          0,
          subCategoryRecords?.Data?.SubCategory?.FacilityId
        );
      }
    }
  }, [subCategoryRecords]);

  //* Validation Schema
  const subCategoryValidation = Yup.object().shape({
    facility: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IC_SC_P_Facility')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel(
              'IM_IC_SC_Facility',
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
              'IM_IC_SC_Facility',
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
        pageFields?.find((x) => x.FieldId === 'IC_SC_P_AffectedCategoryCode')
          ?.IsMandatory === true && !hideABDFields,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IC_SC_AffectedCategory',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    mainCategory: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IC_SC_P_MainCategory')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IC_SC_MainCategory',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    subCategoryCode: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IC_SC_P_SubCategoryCode')
          ?.IsMandatory === true && !hideABDFields,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IC_SC_SubCategoryCode',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    subCategory: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IC_SC_P_SubCategory')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IC_SC_SubCategory',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    notiStaffList: Yup.array().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IC_SC_P_NotificationStaff(s)')
          ?.IsMandatory,
      then: (schema) =>
        schema
          .min(
            1,
            `${`${getlabel(
              'IM_IC_SC_NotificationStaff(s)',
              {
                Data: fieldLabels,
                Status: labels?.Status,
              },
              i18n.language
            )} ${t('IsRequired')}`}`
          )
          .test(
            'not-empty',
            `${`${getlabel(
              'IM_IC_SC_NotificationStaff(s)',
              {
                Data: fieldLabels,
                Status: labels?.Status,
              },
              i18n.language
            )} ${t('IsRequired')}`}`,
            (value) => value && value.length > 0
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  //* Get Main Category list
  const getMainCategoryList = async (id = 0, fid = selectedFacility?.id) => {
    let response = await triggerGetMainCategory({
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
      affectedCategoryId: id,
      headerFacilityId: fid,
    });

    if (response?.data?.Data) {
      const isCategoryFieldShow = pageFields?.find(
        (x) => x.FieldId === 'IC_SC_P_MainCategory'
      )?.IsShow;
      const isCategoryCodeFieldShow =
        pageFields?.find((x) => x.FieldId === 'IC_SC_P_MainCategoryCode')
          ?.IsShow && hideABDFields;

      if (isCategoryFieldShow && !isCategoryCodeFieldShow) {
        setMainCategoryList(
          response?.data?.Data?.map((item) => ({
            text: item.MainCategory,
            value: item.MainCategoryId,
          }))
        );
      } else if (isCategoryCodeFieldShow && !isCategoryFieldShow) {
        setMainCategoryList(
          response?.data?.Data?.map((item) => ({
            text: item.MainCategoryCode,
            value: item.MainCategoryId,
          }))
        );
      } else if (isCategoryFieldShow && isCategoryCodeFieldShow) {
        setMainCategoryList(
          response?.data?.Data?.map((item) => ({
            text: `${item.MainCategoryCode} - ${item.MainCategory} `,
            value: item.MainCategoryId,
          }))
        );
      }
    } else {
      setMainCategoryList([]);
    }
  };

  //* Close modal
  const handleOnCancel = () => {
    setNewSubCategory({
      subCateId: 0,
      facility: '',
      affectedCategory: '',
      mainCategory: '',
      subCategoryCode: '',
      subCategory: '',
      notiStaffList: [],
    });
    setSelectedSubCategoryId(null);
    setShowSubCategoryModal(false);
  };

  //* Submit sub category
  const submitSubCategory = async (values) => {
    try {
      let response;
      console.log(values);
      if (newSubCategory?.subCateId === 0) {
        response = await triggerAddSubCategory({
          payload: {
            mainCategoryId: values?.mainCategory,
            affectedCategoryId: values?.affectedCategory,
            subCategory: values?.subCategory,
            subCategoryCode: values?.subCategoryCode,
            notifyStaffs: notiStaffList?.map((x) => x.userId)?.join(','),
            facilityIds: values?.facility,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        });
      }
      if (newSubCategory?.subCateId !== 0) {
        response = await triggerUpdateSubCategory({
          payload: {
            subCategoryId: values?.subCateId,
            mainCategoryId: values?.mainCategory,
            affectedCategoryId: values?.affectedCategory,
            subCategory: values?.subCategory,
            subCategoryCode: values?.subCategoryCode,
            facilityId: values?.facility,
            notifyStaffs: notiStaffList?.map((x) => x.userId)?.join(','),
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        });
        refetchSubCategory();
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
        response?.data?.Message === 'Sub Category already exists'
      ) {
        showToastAlert({
          type: 'custom_info',
          text: response?.data?.Message,
          gif: 'InfoGif',
        });
      }
      setNewSubCategory({
        mainCateId: 0,
        facility: '',
        harmLevel: '',
        definition: '',
        notiStaffList: [],
        affectedCategory: '',
        mainCategoryCode: '',
      });
      refetch();
      setSelectedSubCategoryId(null);
      setShowSubCategoryModal(false);
    } catch (error) {
      console.error('Failed to add/update Main Category', error);
    }
  };

  return (
    <Dialog
      open={showSubCategoryModal}
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
            'IM_IC_SC_SubCategory',
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
              initialValues={newSubCategory}
              validateOnBlur={false}
              validateOnMount={false}
              validationSchema={subCategoryValidation}
              onSubmit={(values) => {
                submitSubCategory(values);
              }}
              initialTouched={{
                notiStaffList: false,
              }}
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
                    {pageFields?.find((x) => x.FieldId === 'IC_SC_P_Facility')
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
                              'IM_IC_SC_Facility',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IC_SC_P_Facility'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                          <SearchDropdown
                            disableClearable={true}
                            disabled={selectedSubCategoryId}
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
                              ).map((facility) => ({
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
                              getAffectedCategoryList(value?.value);
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
                      (x) => x.FieldId === 'IC_SC_P_AffectedCategoryCode'
                    )?.IsShow &&
                      !hideABDFields && (
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
                                'IM_IC_SC_AffectedCategory',
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
                                    'IM_IC_SC_AffectedCategoryCode'
                                )?.IsMandatory
                              }
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={8} lg={8}>
                            <SearchDropdown
                              disableClearable={true}
                              name={'affectedCategory'}
                              options={[
                                { text: 'Select', value: '' },
                                ...(affectedCategoryList || []),
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
                                affectedCategoryList?.find(
                                  (option) =>
                                    option.value === values['affectedCategory']
                                ) || null
                              }
                              onChange={(e, value) => {
                                if (value?.value) {
                                  getMainCategoryList(value?.value);
                                } else {
                                  setMainCategoryList([]);
                                }
                                setFieldValue('affectedCategory', value?.value);
                              }}
                            />
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
                    {(pageFields?.find(
                      (x) => x.FieldId === 'IC_SC_P_MainCategory'
                    )?.IsShow ||
                      pageFields?.find(
                        (x) => x.FieldId === 'IC_SC_P_MainCategoryCode'
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
                              'IM_IC_SC_MainCategory',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IC_SC_P_MainCategory'
                              )?.IsShow ||
                              pageFields?.find(
                                (x) => x.FieldId === 'IC_SC_P_MainCategoryCode'
                              )?.IsShow
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                          <SearchDropdown
                            disableClearable={true}
                            name="mainCategory"
                            disabled={fetchingMainCategory}
                            options={[
                              { text: 'Select', value: '' },
                              ...(mainCategoryList || []),
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
                            value={
                              mainCategoryList?.find(
                                (option) =>
                                  option.value === values['mainCategory']
                              ) || null
                            }
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
                            onChange={(e, value) => {
                              setFieldValue('mainCategory', value?.value);
                            }}
                          />
                          <ErrorMessage
                            name="mainCategory"
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
                      (x) => x.FieldId === 'IC_SC_P_SubCategoryCode'
                    )?.IsShow &&
                      !hideABDFields && (
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
                                'IM_IC_SC_SubCategoryCode',
                                {
                                  Data: fieldLabels,
                                  Status: labels?.Status,
                                },
                                i18n.language
                              )}
                              isRequired={
                                pageFields?.find(
                                  (x) => x.FieldId === 'IC_SC_P_SubCategoryCode'
                                )?.IsMandatory
                              }
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={8} lg={8}>
                            <Field name="subCategoryCode">
                              {({ field }) => (
                                <TextField
                                  {...field}
                                  id="subCategoryCode"
                                  autoComplete="off"
                                  values={values.subCategory}
                                  fullWidth={true}
                                  slotProps={{ htmlInput: { maxLength: 100 } }}
                                  // disabled={isFetching}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="subCategoryCode"
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
                      (x) => x.FieldId === 'IC_SC_P_SubCategory'
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
                              'IM_IC_SC_SubCategory',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IC_SC_P_SubCategory'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                          <Field name="subCategory">
                            {({ field }) => (
                              <TextField
                                {...field}
                                id="subCategory"
                                autoComplete="off"
                                values={values.subCategory}
                                fullWidth={true}
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                                // disabled={isFetching}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="subCategory"
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
                      (x) => x.FieldId === 'IC_SC_P_NotificationStaff(s)'
                    )?.IsShow && (
                      <Grid
                        container
                        display={'flex'}
                        width="100%"
                        flexWrap={'wrap'}
                        justifyContent={'space-between'}
                        item
                        xs={12}
                        alignItems={'center'}
                      >
                        <NotificationStaffList
                          isMandatory={
                            pageFields?.find(
                              (x) =>
                                x.FieldId === 'IC_SC_P_NotificationStaff(s)'
                            )?.IsMandatory
                          }
                          labels={labels}
                          notiStaffList={notiStaffList}
                          setNotiStaffList={setNotiStaffList}
                          setFieldValue={setFieldValue}
                          fieldAccess={fieldAccess}
                        />
                        {errors.notiStaffList && touched.notiStaffList && (
                          <div
                            style={{
                              color: 'red',
                              fontSize: '12px',
                              marginTop: '4px',
                            }}
                          >
                            {errors.notiStaffList}
                          </div>
                        )}
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

export default AddEditSubCategory;
