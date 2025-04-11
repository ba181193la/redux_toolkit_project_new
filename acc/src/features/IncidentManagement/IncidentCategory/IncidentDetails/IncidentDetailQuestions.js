import { Autocomplete, Grid, TextField, Divider } from '@mui/material';
import {
  StyledImage,
  FlexContainer,
  StyledButton,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import BackArrow from '../../../../assets/Icons/white/left-arrow.png';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import SearchIcon from '../../../../assets/Icons/WhiteSearch.png';
import Label from '../../../../components/Label/Label';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { t } from 'i18next';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getlabel } from '../../../../utils/language';
import { useEffect, useState } from 'react';
import {
  useGetAffectedCategoryQuery,
  useGetPageLoadNameQuery,
  useLazyGetIDFormBuilderByIdQuery,
  useLazyGetIncidentDetailQuery,
  useLazyGetMainCategoryQuery,
  useLazyGetMCFormBuilderByIdQuery,
  useLazyGetSubCategoryQuery,
  useLazyGetAffectedCategoryQuery,
  useSaveIDFormBuilderMutation,
  useSaveMCFormBuilderMutation,
} from '../../../../redux/RTK/IncidentManagement/incidentCategoryApi';
import QuestionsFormBuilder from '../QuestionsFormBuilder';
import { showToastAlert } from '../../../../utils/SweetAlert';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';

const IncidentDetailQuestions = () => {
  //* Hooks declaration
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  //* Selectors
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    isSuperAdmin,
    regionCode,
    roleFacilities,
  } = useSelector((state) => state.auth);

  //* State variables
  const [fieldLabels, setFieldLabels] = useState([]);
  const [pageFields, setPageFields] = useState([]);
  const [affectedCategoryList, setAffectedCategoryList] = useState([]);
  const [mainCategoryList, setMainCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [incidentDetailList, setIncidentDetailList] = useState([]);
  const [pageNameList, setPageNameList] = useState([]);
  const [questionsData, setQuestionsData] = useState([]);
  const [hideABDFields, setHideABDFields] = useState(false);
  const [ddFacility, setDDFacility] = useState('');
  const [initalValues, setInitalValues] = useState({
    facility: '',
    affectedCategory: '',
    mainCategory: '',
    subCategory: '',
    incidentDetail: '',
    pageName: '',
  });

  //* RTK Queries

  const {
    data: affectedCategory,
    isFetching: fetchAffectedCategory,
    refetch,
  } = useGetAffectedCategoryQuery(
    {
      moduleId: selectedModuleId,
      loginUserId: userDetails?.UserId,
      menuId: selectedMenu?.id,
    },
    { refetchOnMountOrArgChange: true }
  );

  const { data: labels = [], isFetching: labelsFetching } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  const { data: fieldAccess = [], isFetching: accessFetching } =
    useGetFieldsQuery({
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    });

  const [triggerGetAffectedCategory, { isLoading: isFetchingAC }] =
    useLazyGetAffectedCategoryQuery();

  const [triggerGetMainCategory, { isFetching: fetchingMainCategory }] =
    useLazyGetMainCategoryQuery();

  const [triggerGetSubCategory, { isFetching: fetchingSubCategory }] =
    useLazyGetSubCategoryQuery();

  const [triggerGetIncidentDetails, { isFetching: fetchingIncidentDetails }] =
    useLazyGetIncidentDetailQuery();

  const [triggerGetFormBuilderData] = useLazyGetIDFormBuilderByIdQuery();

  const [triggerSaveIDFormBilder, { isLoading: isAdding }] =
    useSaveIDFormBuilderMutation();

  const { data: pageName } = useGetPageLoadNameQuery({
    moduleId: selectedModuleId,
    loginUserId: userDetails?.UserId,
    menuId: selectedMenu?.id,
  });

  //* Validation Schema
  const mainCategoryValidation = Yup.object().shape({
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
        (pageFields?.find((x) => x.FieldId === 'IC_ID_P_AffectedCategory')
          ?.IsShow ||
          pageFields?.find((x) => x.FieldId === 'IC_ID_P_AffectedCategoryCode')
            ?.IsShow) &&
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
        pageFields?.find((x) => x.FieldId === 'IC_ID_P_MainCategory')?.IsShow ||
        pageFields?.find((x) => x.FieldId === 'IC_ID_P_MainCategoryCode')
          ?.IsShow,
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
        pageFields?.find((x) => x.FieldId === 'IC_ID_P_SubCategory')?.IsShow ||
        pageFields?.find((x) => x.FieldId === 'IC_ID_P_SubCategoryCode')
          ?.IsShow,
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
    incidentDetail: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IC_ID_P_IncidentDetailsCode')
          ?.IsShow ||
        pageFields?.find((x) => x.FieldId === 'IC_ID_P_IncidentDetails')
          ?.IsShow,
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
    pageName: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'IC_ID_P_PageName')?.IsShow,
      then: (schema) =>
        schema.required(
          `${getlabel(
            'IM_IC_ID_PageName',
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
            )?.IsShow && hideABDFields;

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
        setMainCategoryList([]);
        setSubCategoryList([]);
      } else {
        getMainCategoryList(0, id);
      }
    }
    if (!id) {
      setAffectedCategoryList([]);
      setMainCategoryList([]);
      setSubCategoryList([]);
      setIncidentDetailList([]);
    }
  };

  //* Get Main Category list
  const getMainCategoryList = async (aid = 0, fid = selectedFacility?.id) => {
    let response = await triggerGetMainCategory({
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
      affectedCategoryId: aid,
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
      setSubCategoryList([]);
      setIncidentDetailList([]);
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

  //* Get Incident Details list
  const getIncidentDetailList = async (id) => {
    let response = await triggerGetIncidentDetails({
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
      subCategoryId: id,
    });

    if (response?.data?.Data) {
      const isCategoryFieldShow = pageFields?.find(
        (x) => x.FieldId === 'IC_ID_P_IncidentDetails'
      )?.IsShow;
      const isCategoryCodeFieldShow =
        pageFields?.find((x) => x.FieldId === 'IC_ID_P_IncidentDetailsCode')
          ?.IsShow && !hideABDFields;

      if (isCategoryFieldShow && !isCategoryCodeFieldShow) {
        setIncidentDetailList(
          response?.data?.Data?.map((item) => ({
            text: item.IncidentDetail,
            value: item.IncidentDetailId,
          }))
        );
      } else if (isCategoryCodeFieldShow && !isCategoryFieldShow) {
        setIncidentDetailList(
          response?.data?.Data?.map((item) => ({
            text: item.IncidentDetailCode,
            value: item.IncidentDetailId,
          }))
        );
      } else if (isCategoryFieldShow && isCategoryCodeFieldShow) {
        setIncidentDetailList(
          response?.data?.Data?.map((item) => ({
            text: `${item.IncidentDetailCode} - ${item.IncidentDetail} `,
            value: item.IncidentDetailId,
          }))
        );
      }
    } else {
      setIncidentDetailList([]);
    }
  };

  //* Use Effects to bind data
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
  }, [labels]);

  //* Filtering fields access data
  useEffect(() => {
    if (fieldAccess?.Data) {
      const pageFields = fieldAccess.Data.Menus?.find(
        (section) => section?.MenuId === selectedMenu?.id
      )?.Sections?.find(
        (sectionName) => sectionName?.SectionName === 'Incident Details-Page'
      )?.Regions;

      if (pageFields) {
        const allFields =
          pageFields.find((region) => region?.RegionCode === 'ALL')?.Fields ||
          [];

        const regionBasedFields = ddFacility
          ? userDetails?.ApplicableFacilities?.find(
              (x) => x.FacilityId === ddFacility
            )?.RegionCode === 'ABD'
            ? pageFields.find((region) => region?.RegionCode === 'ABD')
                ?.Fields || []
            : []
          : regionCode === 'ABD'
            ? pageFields.find((region) => region?.RegionCode === 'ABD')
                ?.Fields || []
            : [];

        setHideABDFields(
          ddFacility &&
            userDetails?.ApplicableFacilities?.find(
              (x) => x.FacilityId === ddFacility
            )?.RegionCode !== 'ABD'
        );

        setPageFields(
          regionBasedFields.length > 0
            ? [...allFields, ...regionBasedFields]
            : allFields
        );
      }
    }
  }, [fieldAccess, regionCode, ddFacility]);

  useEffect(() => {
    if (pageName) {
      setPageNameList(
        pageName?.Records?.map((page) => ({
          text: page.MenuName,
          value: page.MenuId,
        }))
      );
    }
  }, [pageName]);

  useEffect(() => {
    if (regionCode === 'ABD') {
      setMainCategoryList([]);
      setSubCategoryList([]);
      setIncidentDetailList([]);
    }
  }, [regionCode, pageFields, fieldLabels]);

  //* Get form builder data
  const getFormBuilderData = async (values) => {
    let response;
    try {
      response = await triggerGetFormBuilderData({
        payload: {
          headerFacilityId: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          pageModuleId: selectedModuleId,
          pageMenuId: selectedMenu?.id,
          facilityId: values?.facility,
          menuId: values?.pageName,
          incidentDetailId: values?.incidentDetail,
        },
      });
      if (response?.data) {
        setQuestionsData(response?.data?.Data);
      }
    } catch (e) {
      console.error('Failed to get Main Category question', e);
    }
  };

  const handleSubmit = async (data) => {
    let response;

    try {
      response = await triggerSaveIDFormBilder({
        payload: {
          pageMenuId: selectedMenu?.id,
          pageModuleId: selectedModuleId,
          loginUserId: userDetails?.UserId,
          headerFacilityId: selectedFacility?.id,
          facilityId: initalValues?.facility,
          menuId: initalValues?.pageName,
          incidentDetailId: initalValues?.incidentDetail,
          formData: data,
        },
      });
      if (
        response &&
        response?.data?.Message === 'Record Submitted Successfully'
      ) {
        showToastAlert({
          type: 'custom_success',
          text: response?.data?.Message,
          gif: 'SuccessGif',
        });
        navigate('/IncidentManagement/IncidentCategory');
      }
    } catch (error) {
      console.log('Failed to save Main Category Form builder', error);
    }
  };

  return (
    <FlexContainer
      width="100%"
      height="auto"
      flexDirection="column"
      justifyContent="center"
    >
      <FlexContainer justifyContent={'space-between'} padding="0 0 15px 0">
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
              lg: '2rem',
            },
          }}
        >
          {t('IM_IncidentDetailQuestions')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer width="100%" height="auto" flex="1" flexDirection="column">
        <FlexContainer
          height="100%"
          width="100%"
          padding="20px"
          borderRadius="8px"
          flexDirection="column"
          backgroundColor="#fff"
          boxShadow="0px 4px 4px 0px #00000029"
        >
          <FlexContainer
            width="100%"
            height="auto"
            flex="1"
            flexDirection="column"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
            }}
          >
            <FlexContainer
              alignItems="center"
              width="100%"
              justifyContent="space-between"
              style={{ paddingInline: '20px', marginBottom: '20px' }}
            >
              <StyledButton
                borderRadius="6px"
                gap="4px"
                padding="6px 10px"
                variant="contained"
                backgroundColor="#3498db"
                type="button"
                style={{
                  display: 'inline-flex',
                  gap: '5px',
                }}
                onClick={() => navigate('/IncidentManagement/IncidentCategory')}
                startIcon={
                  <StyledImage
                    height="20px"
                    width="20px"
                    src={BackArrow}
                    alt="WhiteSearch"
                  />
                }
              >
                {t('Previous')}
              </StyledButton>
            </FlexContainer>
            <Divider
              sx={{
                marginY: '10px',
                marginX: '20px',
                height: '2px',
                width: '97%',
                backgroundColor: '#3498db',
                border: 'none',
              }}
            />
          </FlexContainer>

          <FlexContainer padding="20px" width="100%">
            <Formik
              initialValues={initalValues}
              enableReinitialize={true}
              validateOnChange={true}
              validationSchema={mainCategoryValidation}
              onSubmit={(values) => {
                setQuestionsData([]);
                setInitalValues({
                  facility: values?.facility,
                  affectedCategory: values?.affectedCategory,
                  mainCategory: values?.mainCategory,
                  pageName: values?.pageName,
                  subCategory: values?.subCategory,
                  incidentDetail: values?.incidentDetail,
                }),
                  getFormBuilderData(values);
              }}
            >
              {({ values, errors, setFieldValue, touched }) => (
                <Form style={{ width: '100%' }}>
                  <Grid spacing={2} container alignItems={'flex-start'}>
                    {pageFields?.find((x) => x.FieldId === 'IC_ID_P_Facility')
                      ?.IsShow && (
                      <Grid item xs={12} sm={12} md={6} lg={3}>
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
                        <SearchDropdown
                          disableClearable={true}
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
                            if (value?.value) {
                              userDetails?.ApplicableFacilities?.find(
                                (x) => x.FacilityId === value?.value
                              )?.RegionCode === 'ABD'
                                ? setHideABDFields(false)
                                : setHideABDFields(true);
                              if (
                                userDetails?.ApplicableFacilities?.find(
                                  (x) => x.FacilityId === value?.value
                                )?.RegionCode === 'ABD'
                              ) {
                                getAffectedCategoryList(value?.value);
                              } else {
                                getMainCategoryList(0, value?.value);
                              }
                            } else {
                              setAffectedCategoryList([]);
                              setFieldValue('affectedCategory', '');
                            }
                            setDDFacility(value?.value);
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
                    )}

                    {(pageFields?.find(
                      (x) => x.FieldId === 'IC_ID_P_AffectedCategory'
                    )?.IsShow ||
                      pageFields?.find(
                        (x) => x.FieldId === 'IC_ID_P_AffectedCategoryCode'
                      )?.IsShow) &&
                      !hideABDFields && (
                        <Grid item xs={12} sm={12} md={6} lg={3}>
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
                                (x) => x.FieldId === 'IC_ID_P_AffectedCategory'
                              )?.IsShow
                            }
                          />
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
                              setFieldValue('affectedCategory', value?.value);
                              if (value?.value) {
                                getMainCategoryList(value?.value);
                              } else {
                                setMainCategoryList([]);
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
                      )}
                    {(pageFields?.find(
                      (x) => x.FieldId === 'IC_ID_P_MainCategoryCode'
                    )?.IsShow ||
                      pageFields?.find(
                        (x) => x.FieldId === 'IC_ID_P_MainCategory'
                      )?.IsShow) && (
                      <Grid item xs={12} sm={12} md={6} lg={3}>
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
                              (x) => x.FieldId === 'IC_ID_P_MainCategoryCode'
                            )?.IsShow ||
                            pageFields?.find(
                              (x) => x.FieldId === 'IC_ID_P_MainCategory'
                            )?.IsShow
                          }
                        />
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
                            setFieldValue('subCategory', '');
                            if (value?.value) {
                              getSubCategoryList(value?.value);
                            } else {
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
                    )}
                    {(pageFields?.find(
                      (x) => x.FieldId === 'IC_ID_P_SubCategoryCode'
                    )?.IsShow ||
                      pageFields?.find(
                        (x) => x.FieldId === 'IC_ID_P_SubCategory'
                      )?.IsShow) && (
                      <Grid item xs={12} sm={12} md={6} lg={3}>
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
                        <SearchDropdown
                          disableClearable={true}
                          name="subCategory"
                          disabled={fetchingSubCategory}
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
                            subCategoryList?.find(
                              (option) => option.value === values['subCategory']
                            ) || null
                          }
                          onChange={(event, value) => {
                            setFieldValue('mainCategory', values?.mainCategory);
                            setFieldValue('subCategory', value?.value);
                            setFieldValue('incidentDetail', '');
                            if (value?.value) {
                              getIncidentDetailList(value?.value);
                            } else {
                              setIncidentDetailList([]);
                            }
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
                    )}
                    {(pageFields?.find(
                      (x) => x.FieldId === 'IC_ID_P_IncidentDetailsCode'
                    )?.IsShow ||
                      pageFields?.find(
                        (x) => x.FieldId === 'IC_ID_P_IncidentDetails'
                      )?.IsShow) && (
                      <Grid item xs={12} sm={12} md={6} lg={3}>
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
                              (x) => x.FieldId === 'IC_ID_P_IncidentDetailsCode'
                            )?.IsShow ||
                            pageFields?.find(
                              (x) => x.FieldId === 'IC_ID_P_IncidentDetails'
                            )?.IsShow
                          }
                        />
                        <SearchDropdown
                          disableClearable={true}
                          name="incidentDetail"
                          disabled={fetchingIncidentDetails}
                          options={[
                            { text: 'Select', value: '' },
                            ...(incidentDetailList || []),
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
                            incidentDetailList?.find(
                              (option) =>
                                option.value === values['incidentDetail']
                            ) || null
                          }
                          onChange={(event, value) => {
                            setFieldValue('incidentDetail', value?.value);
                          }}
                        />
                        <ErrorMessage
                          name="incidentDetail"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                            marginTop: '4px',
                          }}
                        />
                      </Grid>
                    )}

                    {pageFields?.find((x) => x.FieldId === 'IC_ID_P_PageName')
                      ?.IsShow && (
                      <Grid item xs={12} sm={12} md={6} lg={3}>
                        <Label
                          value={getlabel(
                            'IM_IC_ID_PageName',
                            {
                              Data: fieldLabels,
                              Status: labels?.Status,
                            },
                            i18n.language
                          )}
                          isRequired={
                            pageFields?.find(
                              (x) => x.FieldId === 'IC_ID_P_PageName'
                            )?.IsShow
                          }
                        />
                        <SearchDropdown
                          disableClearable={true}
                          name="pageName"
                          disabled={pageNameList?.length === 0}
                          options={[
                            { text: 'Select', value: '' },
                            ...(pageNameList || []),
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
                            pageNameList?.find(
                              (option) => option.value === values['pageName']
                            ) || null
                          }
                          onChange={(event, value) => {
                            setFieldValue('pageName', value?.value);
                          }}
                        />
                        <ErrorMessage
                          name="pageName"
                          component="div"
                          style={{
                            color: 'red',
                            fontSize: '12px',
                            marginTop: '4px',
                          }}
                        />
                      </Grid>
                    )}
                  </Grid>
                  <Grid spacing={2} container>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      lg={12}
                      alignItems={'flex-end'}
                      marginTop="15px"
                    >
                      <StyledButton
                        borderRadius="6px"
                        gap="4px"
                        padding="6px 10px"
                        variant="contained"
                        backgroundColor="#0083c0"
                        type="submit"
                        style={{
                          display: 'inline-flex',
                          gap: '5px',
                          float: 'right',
                        }}
                        startIcon={
                          <StyledImage
                            height="16px"
                            width="16px"
                            src={SearchIcon}
                            alt="WhiteSearch"
                          />
                        }
                      >
                        {t('Fetch')}
                      </StyledButton>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </FlexContainer>
          {questionsData.length > 0 && (
            <Grid
              spacing={2}
              container
              alignItems={'center'}
              marginTop={'10px'}
            >
              <Grid item xs={12} sm={12} md={6} lg={12}>
                <QuestionsFormBuilder
                  questionsData={questionsData}
                  handleSubmit={handleSubmit}
                />
              </Grid>
            </Grid>
          )}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default IncidentDetailQuestions;
