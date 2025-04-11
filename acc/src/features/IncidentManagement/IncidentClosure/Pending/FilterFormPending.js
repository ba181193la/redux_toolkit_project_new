import { Formik } from 'formik';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import Label from '../../../../components/Label/Label';
import { StyledButton, StyledImage } from '../../../../utils/StyledComponents';
import WhiteSearch from '../../../../assets/Icons/WhiteSearch.png';
import Eraser from '../../../../assets/Icons/Eraser.png';
import Date from '../../../../components/Date/Date';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import { useGetPageLoadDataQuery } from '../../../../redux/RTK/incidentClosureApi';
import { useTranslation } from 'react-i18next';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import { getlabel } from '../../../../utils/language';
import {
  resetFilters,
  setFilters,
  setIsFilterApplied,
} from '../../../../redux/features/mainMaster/incidentClosureSlice';
import { Grid } from '@mui/material';

const FilterFormPending = ({ fields, handleToggleFilter, labels }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const { isMobile } = useWindowDimension();

  const { selectedMenu, selectedModuleId, userDetails, selectedFacility } =
    useSelector((state) => state.auth);

  const {
    pageSize,
    pageIndex,
    facilityIds,
    incidentId,
    incidentDetailId,
    incidentTypeId,
    MainCategoryId,
    departmentId,
    incidentLevelId,
    subCategoryId,
    affectedCategoryId,
    reportFromDate,
    reportToDate,
    incidentFromDate,
    incidentToDate,
  } = useSelector((state) => state.incidentClosure.filters);

  const initialValues = {
    incidentFromDate: incidentFromDate || '',
    incidentToDate: incidentToDate || '',
    reportFromDate: reportFromDate || '',
    reportToDate: reportToDate || '',
    incidentNumber: incidentId || '',
    incidentDetails: incidentDetailId || '',
    facility: facilityIds?.split(',') || [],
    mainCategory: MainCategoryId || '',
    incidentType: incidentTypeId || '',
    department: departmentId || '',
    subCategory: subCategoryId || '',
    AffectedCategory: affectedCategoryId || ''
  };

  const { data: pageLoadData } = useGetPageLoadDataQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });
  const fieldsConfig = [
    {
      fieldId: 'IC_S_Facility',
      translationId: 'IM_IC_Facility',
      label: 'Facility',
      component: 'MultiSelectDropdown',
      name: 'facility',
      options: pageLoadData?.Data.FacilityList?.map((data) => ({
        text: data.FacilityName,
        value: data.FacilityId,
      })),
    },

    {
      fieldId: 'IC_S_IncidentFromDate',
      translationId: 'IM_IC_IncidentFromDate',
      label: 'Incident From Date',
      component: 'Date',
      name: 'incidentFromDate',
    },
    {
      fieldId: 'IC_S_IncidentToDate',
      translationId: 'IM_IC_IncidentToDate',
      label: 'Incident To Date',
      component: 'Date',
      name: 'incidentToDate',
    },

    {
      fieldId: 'IC_S_ReportFromDate',
      translationId: 'IM_IC_ReportFromDate',
      label: 'Report From Date',
      component: 'Date',
      name: 'reportFromDate',
    },

    {
      fieldId: 'IC_S_IncidentNumber',
      translationId: 'IM_IC_IncidentNumber',
      label: 'Incident Number',
      component: 'Dropdown',
      name: 'incidentNumber',
      options: pageLoadData?.Data.IncidentNumberList?.map((data) => ({
        text: data.IncidentNo,
        value: data.IncidentId,
      })),
    },
    {
      fieldId: 'IC_S_IncidentDetails',
      translationId: 'IM_IC_IncidentDetails',
      label: 'Incident Details',
      component: 'Dropdown',
      name: 'incidentDetails',
      options: pageLoadData?.Data.IncidentCategoryList?.filter(
        (data) => data?.IncidentDetail && data?.IncidentDetailId
      ).map((data) => ({
        text: data.IncidentDetail,
        value: data.IncidentDetailId,
      })),
    },
    {
      fieldId: 'IC_S_IncidentType',
      translationId: 'IM_IC_IncidentType',
      label: 'Incident Type',
      component: 'Dropdown',
      name: 'incidentType',
      options: pageLoadData?.Data.IncidentTypeList?.map((data) => ({
        text: data.IncidentTypeName,
        value: data.IncidentTypeId,
      })),
    },
    {
      fieldId: 'IC_S_IncidentDepartment',
      translationId: 'IM_IC_IncidentDepartment',
      label: 'Incident Department',
      component: 'Dropdown',
      name: 'department',
      options: pageLoadData?.Data.DepartmentList?.filter(
        (data) => data?.DepartmentName && data?.DepartmentId
      ).map((data) => ({
        text: data.DepartmentName,
        value: data.DepartmentId,
      })),
    },
    // {
    //   fieldId: 'IC_S_ContributingDepartment',
    //   translationId: 'IM_IC_ContributingDepartment',           //
    //   label: 'Contributing Department',
    //   component: 'Dropdown',
    //   name: 'ContributingDepartment',
    //   options: pageLoadData?.Data.DepartmentList?.map(
    //     (data) => ({
    //       text: data.DepartmentName,
    //       value: data.DepartmentId,
    //     })
    //   ),
    // },
    // {
    //   fieldId: 'IC_S_HarmLevel',
    //   TranslationId: "IM_IC_HarmLevel",                    //
    //   label: 'Harm Level',
    //   component: 'Dropdown',
    //   name: 'HarmLevel',
    //   options: pageLoadData?.Data.DepartmentList?.map(
    //     (data) => ({
    //       text: data.DepartmentName,
    //       value: data.DepartmentId,
    //     })
    //   ),
    // },
    {
      fieldId: 'IC_S_IncidentMainCategory',
      translationId: 'IM_IC_IncidentMainCategory', //
      label: 'Incident Main Category',
      component: 'Dropdown',
      name: 'mainCategory',
      options: pageLoadData?.Data.IncidentCategoryList?.map((data) => ({
        text: data.MainCategory,
        value: data.MainCategoryId,
      })),
    },
    {
      fieldId: 'IC_S_IncidentSubCategory',
      translationId: 'IM_IC_IncidentSubCategory',
      label: 'Incident Sub Category',
      component: 'Dropdown',
      name: 'subCategory',
      options: pageLoadData?.Data.IncidentCategoryList?.map((data) => ({
        text: data.SubCategory,
        value: data.SubCategoryId,
      })),
    },
    // {
    //   fieldId: 'IC_S_IncidentLevel',
    //   translationId: 'IM_IC_IncidentLevel',           //
    //   label: 'Incident Level',
    //   component: 'Dropdown',
    //   name: 'IncidentLevel',

    // },
   
    {
      fieldId: 'IC_S_ReportToDate',
      translationId: 'IM_IC_ReportToDate',
      label: 'Report To Date',
      component: 'Date',
      name: 'reportToDate',
    },
    
    {
      fieldId: 'IC_S_AffectedCategory',
      translationId: 'IM_IC_AffectedCategory',
      label: 'Affected Category',
      component: 'Dropdown',
      name: 'AffectedCategory',
      options: pageLoadData?.Data.AffectedcategoryList?.map((data) => ({
        text: data.AffectedCategory,
        value: data.AffectedCategoryId,
      })),
    },
    {
      fieldId: 'IC_S_AffectedCategoryCode',
      translationId: 'IM_IC_AffectedCategoryCode',
      label: 'Affected Category Code',
      component: 'Dropdown',
      name: 'AffectedCategoryCode',
      options: pageLoadData?.Data.AffectedcategoryList?.map((data) => ({
        text: data.AffectedCategoryCode,
        value: data.AffectedCategoryId,
      })),
    },
    {
      fieldId: 'IC_S_MainCategoryCode',
      translationId: 'IM_IC_MainCategoryCode',
      label: 'Main Category Code',
      component: 'Dropdown',
      name: 'MainCategoryCode',
      options: pageLoadData?.Data.IncidentCategoryList?.filter(
        (data) => data?.MainCategoryId && data?.MainCategoryCode
      ).map((data) => ({
        text: data.MainCategoryCode,
        value: data.MainCategoryId,
      })),
    },
    {
      fieldId: 'IC_S_SubCategoryCode',
      translationId: 'IM_IC_SubCategoryCode',
      label: 'Sub Category Code',
      component: 'Dropdown',
      name: 'SubCategoryCode',
      options: pageLoadData?.Data.IncidentCategoryList?.filter(
        (data) => data?.SubCategoryId && data?.SubCategoryCode
      ).map((data) => ({
        text: data.SubCategoryCode,
        value: data.SubCategoryId,
      })),
    },
    {
      fieldId: 'IC_S_IncidentDetailsCode',
      translationId: 'IM_IC_IncidentDetailsCode',
      label: 'Incident Details Code',
      component: 'Dropdown',
      name: 'IncidentDetailsCode',
      options: pageLoadData?.Data.IncidentCategoryList?.filter(
        (data) => data?.IncidentDetailCode && data?.IncidentDetailId
      ).map((data) => ({
        text: data.IncidentDetailCode,
        value: data.IncidentDetailId,
      })),
    },
    {
      fieldId: 'IC_S_ContributingMainFactor',
      translationId: 'IM_IC_ContributingMainFactor',
      label: 'Contributing Main Factor',
      component: 'Dropdown',
      name: 'ContributingMainFactor',
      // options: pageLoadData?.Data.IncidentCategoryList?.map((data) => ({
      //   text: data.MainCategoryId,
      //   value: data.MainCategoryCode,
      // })),
    },
    {
      fieldId: 'IC_S_ContributingSubFactor',
      translationId: 'IM_IC_ContributingSubFactor',
      label: 'Contributing Sub Factor',
      component: 'Dropdown',
      name: 'ContributingSubFactor',
      // options: pageLoadData?.Data.IncidentCategoryList?.map((data) => ({
      //   text: data.MainCategoryId,
      //   value: data.MainCategoryCode,
      // })),
    },
    {
      fieldId: 'IC_S_ContributingMainFactorCode',
      translationId: 'IM_IC_ContributingMainFactorCode',
      label: 'Contributing Main Factor Code',
      component: 'Dropdown',
      name: 'ContributingMainFactorCode',
      // options: pageLoadData?.Data.IncidentCategoryList?.map((data) => ({
      //   text: data.MainCategoryId,
      //   value: data.MainCategoryCode,
      // })),
    },
    {
      fieldId: 'IC_S_ContributingSubFactorCode',
      translationId: 'IM_IC_ContributingSubFactorCode',
      label: 'Contributing Sub Factor Code',
      component: 'Dropdown',
      name: 'ContributingSubFactorCode',
      // options: pageLoadData?.Data.IncidentCategoryList?.map((data) => ({
      //   text: data.MainCategoryId,
      //   value: data.MainCategoryCode,
      // })),
    },
  ];

  const regionCode = useSelector((state) =>
    state.auth.regionCode?.toUpperCase()
  );

  const sections = fields?.Sections || [];

  const search_Fields = sections.find(
    (section) => section.SectionName === 'Search'
  )?.Regions;

  let Allabels;

  console.log('labels', labels);

  if (labels && Array.isArray(labels.Regions)) {
    const regionsToShow = labels.Regions.filter((region) =>
      regionCode.toUpperCase() === 'ABD'
        ? region.RegionCode.toUpperCase() === 'ALL' || region.RegionCode.toUpperCase() === 'ABD'
        : region.RegionCode.toUpperCase() === 'ALL'
    );

    const hasAll = regionsToShow.some((region) => region.RegionCode.toUpperCase() === 'ALL');
    const hasABD = regionsToShow.some((region) => region.RegionCode.toUpperCase() === 'ABD');

    if (regionsToShow.length > 0) {
      Allabels = { ...regionsToShow[0] };
      regionsToShow.forEach((region) => {
        if (Array.isArray(region.Labels)) {
          Allabels.Data = Allabels.Data || [];
          Allabels.Data.push(...region.Labels);
        }
      });

      delete Allabels.Labels;
      delete Allabels.RegionCode;
    }
  }

  const allRegion = Array.isArray(search_Fields)
    ? search_Fields.filter((sitem) =>
        regionCode.toUpperCase() === 'ALL'
          ? sitem.RegionCode.toUpperCase() === 'ALL'
          : sitem.RegionCode.toUpperCase() === 'ABD' || sitem.RegionCode.toUpperCase() === 'ALL'
      )
    : [];

  allRegion.sort((a, b) => {
    if (a.RegionCode.toUpperCase() === 'ALL') return -1;
    if (b.RegionCode.toUpperCase() === 'ALL') return 1;
    return 0;
  });

  const searchFields = allRegion.reduce((acc, curr) => {
    if (Array.isArray(curr.Fields)) {
      acc.push(...curr.Fields);
    }
    return acc;
  }, []);


  const validationSchema = Yup.object().shape(
    searchFields?.reduce((schema, field) => {
      if (field.IsMandatory) {
        schema[field.FieldId] = Yup.string().required(
          `${field.FieldId} is required`
        );
      }
      return schema;
    }, {})
  );

  return (
    <>
      <Label>{t('SelectFilter')}</Label>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={async (values) => {
          console.log('Form submitted with values:', values);
          const formattedFacilityIds = Array.isArray(values.facility)
            ? values.facility.join(',')
            : '';

          const filters = {
            pageIndex: pageIndex,
            pageSize,
            headerFacility: selectedFacility?.id,
            loginUserId: userDetails.UserId,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            facilityIds: values.facility?.join(','),
            incidentId: values.incidentNumber || 0,
            incidentDetailId: values.incidentDetails || 0,
            incidentFromDate: values.incidentFromDate || '',
            incidentToDate: values.incidentToDate || '',
            reportFromDate: values.reportFromDate || '',
            reportToDate: values.reportToDate || '',
            incidentTypeId: values.incidentType || 0,
            MainCategoryId: values.mainCategory || 0,
            departmentId: values.department || 0,
            subCategoryId: values.subCategory || 0,
            affectedCategoryId: values.AffectedCategory || 0,
          };


          dispatch(setFilters(filters));
          dispatch(setIsFilterApplied(true));
          handleToggleFilter();
        }}
      >
        {({ values, handleSubmit, setFieldValue, resetForm }) => (
          <Grid container spacing={2} display={'flex'}>
            {fieldsConfig.map((fieldConfig, index) => {
                const field = searchFields.find(f => f.FieldId === fieldConfig.fieldId);
                const translatedLabel = getlabel(
                  fieldConfig.translationId,
                  labels,
                  i18n.language
                );
                if (field && field.IsShow && fieldConfig) {
                return (
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    padding={'10px'}
                    md={3}
                    key={field.fieldId}
                  >
                    <Label value={translatedLabel} />
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
                        name={fieldConfig?.name}
                        options={fieldConfig?.options}
                        required={field.IsMandatory}
                      />
                    )}
                    {fieldConfig.component === 'Date' && (
                      <Date
                        name={fieldConfig?.name}
                        onChange={(event, value) => {
                          setFieldValue(fieldConfig.name, event);
                        }}
                        value={values[fieldConfig.name]}
                      />
                    )}
                  </Grid>
                );
              }
              return null;
            })}
            <Grid
              padding="10px"
              item
              xs={12}
              display="flex"
              justifyContent="flex-end"
              gap={'10px'}
              flexWrap={'wrap'}
            >
              <StyledButton
                borderRadius="6px"
                padding="6px 10px"
                variant="contained"
                color="primary"
                width={isMobile ? '100%' : ''}
                startIcon={
                  <StyledImage
                    height="16px"
                    width="16px"
                    src={WhiteSearch}
                    alt="WhiteSearch"
                    style={{ marginInlineEnd: 5 }}
                  />
                }
                onClick={handleSubmit}
              >
                {t('Search')}
              </StyledButton>
              <StyledButton
                variant="outlined"
                border="1px solid #0083c0"
                backgroundColor="#ffffff"
                colour="#0083c0"
                borderRadius="6px"
                width={isMobile ? '100%' : ''}
                startIcon={
                  <StyledImage
                    height="16px"
                    width="16px"
                    src={Eraser}
                    alt="Eraser"
                    style={{ marginInlineEnd: 5 }}
                  />
                }
                onClick={() => {
                  resetForm();
                  dispatch(resetFilters());
                }}
              >
                {t('ClearAll')}
              </StyledButton>
            </Grid>
          </Grid>
        )}
      </Formik>
    </>
  );
};

export default FilterFormPending;
