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
import NotificationStaffList from './NotificationStaffList';
import {
  useAddIncidentDetailMutation,
  useGetAffectedCategoryQuery,
  useGetIncidentDetailByIdQuery,
  useLazyGetMainCategoryQuery,
  useLazyGetSubCategoryQuery,
  useUpdateIncidentDetailsMutation,
  useLazyGetAffectedCategoryQuery,
} from '../../../../redux/RTK/IncidentManagement/incidentCategoryApi';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';

const AddEditIncidentDetails = ({
  showIncidentDetailModal,
  setShowIncidentDetailModal,
  selectedIncidentDetailId,
  setSelectedIncidentDetailId,
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
  const [affectedCategoryList, setAffectedCategoryList] = useState([]);
  const [mainCategoryList, setMainCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [hideABDFields, setHideABDFields] = useState(false);
  const [newIncidentDetail, setNewIncidentDetail] = useState({
    incDetailId: 0,
    facility: '',
    incDetail: null,
    incDetailCode: null,
    affectedCategory: null,
    mainCategory: null,
    subCategory: null,
    notiStaffList: notiStaffList,
  });

  //* RTK Queries

  const [triggerAddIncidentDetail, { isLoading: isAdding }] =
    useAddIncidentDetailMutation();

  const [triggerUpdateIncidentDetail, { isLoading: isUpdating }] =
    useUpdateIncidentDetailsMutation();

  const [triggerGetAffectedCategory, { isLoading: isFetchingAC }] =
    useLazyGetAffectedCategoryQuery();

  const [triggerGetMainCategory, { isFetching: fetchingMainCategory }] =
    useLazyGetMainCategoryQuery();

  const [triggerGetSubCategory, { isFetching: fetchingSubCategory }] =
    useLazyGetSubCategoryQuery();

  const { data: affectedCategory, isFetching: fetchAffectedCategory } =
    useGetAffectedCategoryQuery({
      moduleId: selectedModuleId,
      loginUserId: userDetails?.UserId,
      menuId: selectedMenu?.id,
      headerFacilityId: selectedFacility?.id,
    });

  const {
    data: incidentDetailRecords,
    isFetching,
    refetch: refetchIncidentDetail,
  } = useGetIncidentDetailByIdQuery(
    {
      incidentDetailId: selectedIncidentDetailId,
      loginUserId: userDetails?.UserId,
      menuId: selectedMenu?.id,
    },
    { skip: !selectedIncidentDetailId }
  );

  //* Validation Schema
  const incidentDetailValidation = Yup.object().shape({
    facility: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IC_ID_P_Facility')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel(
              'IM_IC_ID_Facility',
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
              'IM_IC_ID_Facility',
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
        (pageFields?.find((x) => x.FieldId === 'IC_ID_P_AffectedCategoryCode')
          ?.IsMandatory === true ||
          pageFields?.find((x) => x.FieldId === 'IC_ID_P_AffectedCategory')
            ?.IsMandatory === true) &&
        !hideABDFields,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IC_ID_AffectedCategory',
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
        pageFields?.find((x) => x.FieldId === 'IC_ID_P_MainCategory')
          ?.IsMandatory === true ||
        pageFields?.find((x) => x.FieldId === 'IC_ID_P_MainCategoryCode')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IC_ID_MainCategory',
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
        pageFields?.find((x) => x.FieldId === 'IC_ID_P_SubCategory')
          ?.IsMandatory === true ||
        pageFields?.find((x) => x.FieldId === 'IC_ID_P_SubCategoryCode')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IC_ID_SubCategory',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    incDetail: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IC_ID_P_IncidentDetails')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IC_ID_IncidentDetails',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    incDetailCode: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IC_ID_P_IncidentDetailsCode')
          ?.IsMandatory === true && !hideABDFields,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IC_ID_IncidentDetailsCode',
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
        pageFields?.find((x) => x.FieldId === 'IC_ID_P_NotificationStaff(s)')
          ?.IsMandatory,
      then: (schema) =>
        schema
          .min(
            1,
            `${`${getlabel(
              'IM_IC_ID_NotificationStaff(s)',
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
              'IM_IC_ID_NotificationStaff(s)',
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
            (x) => x.FieldId === 'IC_ID_P_AffectedCategory'
          )?.IsShow;
          const isCategoryCodeFieldShow =
            pageFields?.find(
              (x) => x.FieldId === 'IC_ID_P_AffectedCategoryCode'
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
      setAffectedCategoryList([]);
      setMainCategoryList([]);
      setSubCategoryList([]);
    }
  };

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
        (x) => x.FieldId === 'IC_ID_P_MainCategory'
      )?.IsShow;
      const isCategoryCodeFieldShow =
        pageFields?.find((x) => x.FieldId === 'IC_ID_P_MainCategoryCode')
          ?.IsShow && !hideABDFields;

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

  //* Get Sub Category list
  const getSubCategoryList = async (id) => {
    let response = await triggerGetSubCategory({
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
      mainCategoryId: id,
    });

    if (response?.data?.Data) {
      const isCategoryFieldShow = pageFields?.find(
        (x) => x.FieldId === 'IC_ID_P_SubCategory'
      )?.IsShow;
      const isCategoryCodeFieldShow =
        pageFields?.find((x) => x.FieldId === 'IC_ID_P_SubCategoryCode')
          ?.IsShow && !hideABDFields;

      if (isCategoryFieldShow && !isCategoryCodeFieldShow) {
        setSubCategoryList(
          response?.data?.Data?.map((item) => ({
            text: item.SubCategory,
            value: item.SubCategoryId,
          }))
        );
      } else if (isCategoryCodeFieldShow && !isCategoryFieldShow) {
        setSubCategoryList(
          response?.data?.Data?.map((item) => ({
            text: item.SubCategoryCode,
            value: item.SubCategoryId,
          }))
        );
      } else if (isCategoryFieldShow && isCategoryCodeFieldShow) {
        setSubCategoryList(
          response?.data?.Data?.map((item) => ({
            text: `${item.SubCategoryCode} - ${item.SubCategory} `,
            value: item.SubCategoryId,
          }))
        );
      }
    } else {
      setSubCategoryList([]);
    }
  };

  //* Field access checking
  useEffect(() => {
    if (fieldAccess?.Data) {
      const pageFields = fieldAccess?.Data?.Menus?.find(
        (section) => section?.MenuId === selectedMenu?.id
      )?.Sections?.find(
        (sectionName) => sectionName?.SectionName === 'Incident Details-Page'
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
        filteredLabels?.find((x) => x.RegionCode === 'ABD')?.Labels || [];

      const combinedLabels = [...allLabels, ...regionBasedLabels];

      setFieldLabels(combinedLabels);
    }
  }, [labels, regionCode]);

  useEffect(() => {
    if (incidentDetailRecords?.Data && selectedIncidentDetailId) {
      setNewIncidentDetail({
        incDetailId:
          incidentDetailRecords?.Data?.IncidentDetail?.IncidentDetailId,
        incDetail: incidentDetailRecords?.Data?.IncidentDetail?.IncidentDetail,
        incDetailCode:
          incidentDetailRecords?.Data?.IncidentDetail?.IncidentDetailCode,
        affectedCategory:
          incidentDetailRecords?.Data?.IncidentDetail?.AffectedCategoryId,
        mainCategory:
          incidentDetailRecords?.Data?.IncidentDetail?.MainCategoryId,
        subCategory: incidentDetailRecords?.Data?.IncidentDetail?.SubCategoryId,
        facility: [incidentDetailRecords?.Data?.IncidentDetail?.FacilityId],
        notiStaffList: incidentDetailRecords?.Data?.NotifyStaffList?.map(
          (x) => ({
            facility: x?.Facility,
            userId: x?.UserId,
            userName: x?.UserName,
            departmentName: x?.Department,
            designationName: x?.Designation,
          })
        ),
      });
      setNotiStaffList(
        incidentDetailRecords?.Data?.NotifyStaffList?.map((x) => ({
          facility: x?.Facility,
          userId: x?.UserId,
          userName: x?.UserName,
          departmentName: x?.Department,
          designationName: x?.Designation,
        }))
      );
      getMainCategoryList(
        incidentDetailRecords?.Data?.IncidentDetail?.AffectedCategoryId
      );
      getSubCategoryList(
        incidentDetailRecords?.Data?.IncidentDetail?.MainCategoryId
      );
    }
  }, [incidentDetailRecords]);

  //* Close modal
  const handleOnCancel = () => {
    setNewIncidentDetail({
      incDetailId: 0,
      facility: '',
      incDetail: '',
      incDetailCode: '',
      affectedCategory: '',
      mainCategory: '',
      subCategory: '',
      notiStaffList: [],
    });
    setSelectedIncidentDetailId(null);
    setShowIncidentDetailModal(false);
  };

  //* Submit harm level
  const submitIncidentDetail = async (values) => {
    try {
      let response;
      if (newIncidentDetail?.incDetailId === 0) {
        response = await triggerAddIncidentDetail({
          payload: {
            incidentDetail: values?.incDetail,
            incidentDetailCode: values?.incDetailCode,
            subCategoryId: values?.subCategory,
            mainCategoryId: values.mainCategory,
            notifyStaffs: notiStaffList?.map((x) => x.userId)?.join(','),
            facilityIds: values?.facility,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        });
      }
      if (newIncidentDetail?.incDetailId !== 0) {
        response = await triggerUpdateIncidentDetail({
          payload: {
            incidentDetailId: values?.incDetailId,
            incidentDetail: values?.incDetail,
            incidentDetailCode: values?.incDetailCode,
            subCategoryId: values?.subCategory,
            mainCategoryId: values.mainCategory,
            facilityId: values?.facility,
            notifyStaffs: notiStaffList?.map((x) => x.userId)?.join(','),
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
          },
        });
        refetchIncidentDetail();
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
        response?.data?.Message === 'Incident Harm Level already exists'
      ) {
        showToastAlert({
          type: 'custom_info',
          text: response?.data?.Message,
          gif: 'InfoGif',
        });
      }
      setNewIncidentDetail({
        incDetailId: 0,
        facility: '',
        incDetail: '',
        incDetailCode: '',
        affectedCategory: '',
        mainCategory: '',
        subCategory: '',
        notiStaffList: [],
      });
      refetch();
      setSelectedIncidentDetailId(null);
      setShowIncidentDetailModal(false);
    } catch (error) {
      console.error('Failed to add/update Main Category', error);
    }
  };

  return (
    <Dialog
      open={showIncidentDetailModal}
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
            'IM_IC_ID_IncidentDetails',
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
              initialValues={newIncidentDetail}
              validateOnBlur={false}
              validateOnMount={false}
              validationSchema={incidentDetailValidation}
              onSubmit={(values) => submitIncidentDetail(values)}
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
                    {pageFields?.find((x) => x.FieldId === 'IC_ID_P_Facility')
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
                              'IM_IC_ID_Facility',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IC_ID_P_Facility'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                          <SearchDropdown
                            disableClearable={true}
                            disabled={selectedIncidentDetailId}
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
                    {(pageFields?.find(
                      (x) => x.FieldId === 'IC_ID_P_AffectedCategory'
                    )?.IsShow ||
                      pageFields?.find(
                        (x) => x.FieldId === 'IC_ID_P_AffectedCategoryCode'
                      )?.IsShow) &&
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
                                'IM_IC_ID_AffectedCategory',
                                {
                                  Data: fieldLabels,
                                  Status: labels?.Status,
                                },
                                i18n.language
                              )}
                              isRequired={
                                pageFields?.find(
                                  (x) =>
                                    x.FieldId === 'IC_ID_P_AffectedCategoryCode'
                                )?.IsShow ||
                                pageFields?.find(
                                  (x) =>
                                    x.FieldId === 'IC_ID_P_AffectedCategory'
                                )?.IsShow
                              }
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={8} lg={8}>
                            <SearchDropdown
                              disableClearable={true}
                              name="affectedCategory"
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
                              onChange={(event, value) => {
                                setFieldValue('mainCategory', null);
                                setFieldValue('subCategory', null);
                                setFieldValue('affectedCategory', value?.value);
                                if (value?.value) {
                                  getMainCategoryList(value?.value);
                                } else {
                                  setMainCategoryList([]);
                                  setSubCategoryList([]);
                                }
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
                      (x) => x.FieldId === 'IC_ID_P_MainCategory'
                    )?.IsShow ||
                      pageFields?.find(
                        (x) => x.FieldId === 'IC_ID_P_MainCategoryCode'
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
                              'IM_IC_ID_MainCategory',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IC_ID_P_MainCategory'
                              )?.IsShow ||
                              pageFields?.find(
                                (x) => x.FieldId === 'IC_ID_P_MainCategoryCode'
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
                              mainCategoryList?.find(
                                (option) =>
                                  option.value === values['mainCategory']
                              ) || null
                            }
                            onChange={(event, value) => {
                              setFieldValue('mainCategory', value?.value);
                              if (value?.value) {
                                getSubCategoryList(value?.value);
                              } else {
                                setFieldValue('subCategory', null);
                                setSubCategoryList([]);
                              }
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
                    {(pageFields?.find(
                      (x) => x.FieldId === 'IC_ID_P_SubCategory'
                    )?.IsShow ||
                      pageFields?.find(
                        (x) => x.FieldId === 'IC_ID_P_SubCategoryCode'
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
                              'IM_IC_ID_SubCategory',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IC_ID_P_SubCategoryCode'
                              )?.IsShow ||
                              pageFields?.find(
                                (x) => x.FieldId === 'IC_ID_P_SubCategory'
                              )?.IsShow
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                          <SearchDropdown
                            disableClearable={true}
                            disabled={fetchingSubCategory}
                            name="subCategory"
                            options={[
                              { text: 'Select', value: '' },
                              ...(subCategoryList || []),
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
                              subCategoryList?.find(
                                (option) =>
                                  option.value === values['subCategory']
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
                              setFieldValue('subCategory', value?.value);
                            }}
                          />
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
                      (x) => x.FieldId === 'IC_ID_P_IncidentDetails'
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
                              'IM_IC_ID_IncidentDetails',
                              {
                                Data: fieldLabels,
                                Status: labels?.Status,
                              },
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'IC_ID_P_IncidentDetails'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={8} lg={8}>
                          <Field name="incDetail">
                            {({ field }) => (
                              <TextField
                                {...field}
                                id="incDetail"
                                autoComplete="off"
                                values={values?.incDetail}
                                fullWidth={true}
                                slotProps={{ htmlInput: { maxLength: 100 } }}
                                // disabled={isFetching}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="incDetail"
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
                      (x) => x.FieldId === 'IC_ID_P_IncidentDetailsCode'
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
                                'IM_IC_ID_IncidentDetailsCode',
                                {
                                  Data: fieldLabels,
                                  Status: labels?.Status,
                                },
                                i18n.language
                              )}
                              isRequired={
                                pageFields?.find(
                                  (x) =>
                                    x.FieldId === 'IC_ID_P_IncidentDetailsCode'
                                )?.IsMandatory
                              }
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={8} lg={8}>
                            <Field name="incDetailCode">
                              {({ field }) => (
                                <TextField
                                  {...field}
                                  id="incDetail"
                                  autoComplete="off"
                                  values={values?.incDetailCode}
                                  fullWidth={true}
                                  slotProps={{ htmlInput: { maxLength: 100 } }}
                                  // disabled={isFetching}
                                />
                              )}
                            </Field>
                            <ErrorMessage
                              name="incDetailCode"
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
                      (x) => x.FieldId === 'IC_ID_P_NotificationStaff(s)'
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
                                x.FieldId === 'IC_ID_P_NotificationStaff(s)'
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

export default AddEditIncidentDetails;
