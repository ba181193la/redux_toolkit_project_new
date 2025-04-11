import { Formik } from 'formik';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import Label from '../../../../components/Label/Label';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
} from '../../../../utils/StyledComponents';
import WhiteSearch from '../../../../assets/Icons/WhiteSearch.png';
import Eraser from '../../../../assets/Icons/Eraser.png';
import Date from '../../../../components/Date/Date';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import Search from '../../../../assets/Icons/Search.png';
import { useEffect } from 'react';
import {
  resetFilters,
  setFilters,
  setIsFilterApplied,
} from '../../../../redux/features/mainMaster/incidentApprovalSlice';
import { Grid, InputAdornment } from '@mui/material';
import TextArea from '../../../../components/TextArea/TextArea';
import { TextField } from '../../../../components/TextField/TextField';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import { useGetPageLoadDataQuery } from '../../../../redux/RTK/IncidentManagement/incidentApprovalApi';

const FilterCompletedFields = ({ fields, handleToggleFilter, labels }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();

  const { selectedMenu, selectedModuleId, userDetails, selectedFacility } =
    useSelector((state) => state.auth);

  const { isMobile } = useWindowDimension();

  const {
    pageSize,
    pageIndex,
    facilityId,
    incidentId,
    incidentDetailId,
    incidentFromDate,
    incidentToDate,
    IncidentTypeId,
    MainCategoryId,
    SubCategoryId,
    AffectedCategoryId,
  } = useSelector((state) => state.incidentApproval.filters);

 


  const sections = fields?.Sections || [];

  const search_Fields = sections.find(
    (section) => section.SectionName === 'Search'
  )?.Regions;

  const initialValues = {
    incidentFromDate: incidentFromDate || '',
    incidentToDate: incidentToDate || '',
    incidentNumber: incidentId || 0,
    incidentDetails: incidentDetailId || 0,
    incidentType: IncidentTypeId || 0,
    reportedBy: 0,
    facility: facilityId?.split(',') || [],
    maincategory: MainCategoryId || 0,
    subcategory: SubCategoryId || 0,
    rejectedBy: '',
    approvalType: '',
    statusfromdate: '',
    approvedFromDate: '',
    approvedToDate: '',
    affectedCategory: AffectedCategoryId || 0,
    affectedCategoryCode: AffectedCategoryId || 0,
    mainCategoryCode: '',
    subCategoryCode: '',
    incidentDetailsCode: '',
  };

  const { data: pageLoadData } = useGetPageLoadDataQuery({
    menuId: 26,
    moduleId: 2,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const fieldsConfig = [
    {
      fieldId: 'IA_S_Facility',
      translationId: 'IM_IA_Facility',
      label: 'Facility',
      component: 'MultiSelectDropdown',
      name: 'facility',
      options: pageLoadData?.Data?.FacilityList?.map((data) => ({
        text: data.FacilityName,
        value: data.FacilityId,
      })),
    },

    {
      fieldId: 'IA_S_IncidentFromDate',
      translationId: 'IM_IA_IncidentFromDate',
      label: 'Incident From Date',
      component: 'Date',
      name: 'incidentFromDate',
    },
    {
      fieldId: 'IA_S_IncidentToDate',
      translationId: 'IM_IA_IncidentToDate',
      label: 'incident ToDate',
      component: 'Date',
      name: 'incidentToDate',
    },


    {
      fieldId: 'IA_S_IncidentNumber',
      translationId: 'IM_IA_IncidentNumber',
      label: 'Incident Number',
      component: 'Dropdown',
      name: 'incidentNumber',
      options: pageLoadData?.Data?.IncidentNumberList?.map((data) => ({
        text: data.IncidentNo,
        value: data.IncidentId,
      })),
    },
    {
      fieldId: 'IA_S_IncidentDetails',
      translationId: 'IM_IA_IncidentDetails',
      label: 'Incident Detail',
      component: 'Dropdown',
      name: 'incidentDetails',
      options: (() => {
        const uniqueDetails = new Set();
        return pageLoadData?.Data?.IncidentCategoryList?.filter((data) => {
          if (uniqueDetails.has(data.IncidentDetail)) {
            return false;
          }
          uniqueDetails.add(data.IncidentDetail);
          return true;
        }).map((data) => ({
          text: data.IncidentDetail,
          value: data.IncidentDetailId,
        }));
      })(),
    },

    {
      fieldId: 'IA_S_IncidentType',
      translationId: 'IM_IA_IncidentType',
      label: 'Incident Type',
      component: 'Dropdown',
      name: 'incidentType',
      options: pageLoadData?.Data?.IncidentTypeList?.map((data) => ({
        text: data.IncidentTypeName,
        value: data.IncidentTypeId,
      })),
    },

    {
      fieldId: 'IA_S_ReportedBy',
      translationId: 'IM_IA_ReportedBy',
      label: 'ReportedBy',
      component: 'Dropdown',
      name: 'reportedBy',
    },


    {
      fieldId: 'IA_S_IncidentMainCategory',
      translationId: 'IM_IA_IncidentMainCategory',
      label: 'Incident Main Category',
      component: 'Dropdown',
      name: 'maincategory',
      options: (() => {
        const uniqueCategories = new Set();
        return pageLoadData?.Data?.IncidentCategoryList?.filter((data) => {
          if (uniqueCategories.has(data.MainCategory)) {
            return false;
          }
          uniqueCategories.add(data.MainCategory);
          return true;
        }).map((data) => ({
          text: data.MainCategory,
          value: data.MainCategoryId,
        }));
      })(),
    },
    {
      fieldId: 'IA_S_IncidentSubCategory',
      translationId: 'IM_IA_IncidentSubCategory',
      label: 'Incident Sub Category',
      component: 'Dropdown',
      name: 'subcategory',
      options: (() => {
        const uniqueSubCategories = new Set();
        return pageLoadData?.Data?.IncidentCategoryList?.filter((data) => {
          if (uniqueSubCategories.has(data.SubCategory)) {
            return false;
          }
          uniqueSubCategories.add(data.SubCategory);
          return true;
        }).map((data) => ({
          text: data.SubCategory,
          value: data.SubCategoryId,
        }));
      })(),
    },
    {
      fieldId: 'IA_S_Approved/RejectedBy',
      translationId: 'IM_IA_Approved/RejectedBy',
      label: 'RejectedBy',
      component: 'Dropdown',
      name: 'rejectedBy',
    },
    {
      fieldId: 'IA_S_ApprovalType',
      translationId: 'IM_IA_ApprovalType',
      label: 'Approval Type',
      component: 'Dropdown',
      name: 'approvalType',
    },
    {
      fieldId: 'IA_S_ApprovedBy',
      translationId: 'IM_IA_ApprovedBy',
      label: 'ApprovedBy',
      component: 'Dropdown',
      name: 'approvedBy',
    },
    {
      fieldId: 'IA_S_Approved/RejectedFromDate',
      translationId: 'IM_IA_Approved/RejectedToDate',
      label: 'Approved / Rejected FromDate',
      component: 'Date',
      name: 'statusfromdate',
    },

    {
      fieldId: 'IA_S_ApprovedFromDate',
      translationId: 'IM_IA_ApprovedFromDate',
      label: 'Approved From Date',
      component: 'Date',
      name: 'approvedFromDate',
    },
    {
      fieldId: 'IA_S_ApprovedToDate',
      translationId: 'IM_IA_ApprovedDate',
      label: 'Approved To Date',
      component: 'Date',
      name: 'approvedToDate',
    },

    // ABD
    {
      fieldId: 'IA_S_AffectedCategory',
      translationId: 'IM_IA_AffectedCategory',
      label: 'Affected Category',
      component: 'Dropdown',
      name: 'affectedCategory',
      options: pageLoadData?.Data?.AffectedcategoryList?.map((data) => ({
        text: data.AffectedCategory,
        value: data.AffectedCategoryId,
      })),
    },
    {
      fieldId: 'IA_S_AffectedCategoryCode',
      translationId: 'IM_IA_AffectedCategoryCode',
      label: 'Affected Category Code',
      component: 'Dropdown',
      name: 'affectedCategoryCode',
      options: pageLoadData?.Data?.AffectedcategoryList?.map((data) => ({
        text: data.AffectedCategoryCode,
        value: data.AffectedCategoryId,
      })),
    },
    {
      fieldId: 'IA_S_MainCategoryCode',
      translationId: 'IM_IA_MainCategoryCode',
      label: 'Main Category Code',
      component: 'Dropdown',
      name: 'mainCategoryCode',
      options: pageLoadData?.Data?.IncidentCategoryList?.map((data) => ({
        text: data.MainCategoryCode,
        value: data.MainCategoryId,
      })),
    },
    {
      fieldId: 'IA_S_SubCategoryCode',
      translationId: 'IM_IA_SubCategoryCode',
      label: 'sub Category Code',
      component: 'Dropdown',
      name: 'subCategoryCode',
      options: pageLoadData?.Data?.IncidentCategoryList?.map((data) => ({
        text: data.SubCategoryCode,
        value: data.SubCategoryId,
      })),
    },
    {
      fieldId: 'IA_S_IncidentDetailsCode',
      translationId: 'IM_IA_IncidentDetailsCode',
      label: 'Incident Details Code',
      component: 'Dropdown',
      name: 'incidentDetailsCode',
      options: pageLoadData?.Data?.IncidentCategoryList?.map((data) => ({
        text: data.IncidentDetailCode,
        value: data.IncidentDetailId,
      })),
    },
  ];

  const regionCode = useSelector((state) =>
    state.auth.regionCode?.toUpperCase()
  );

  let Allabels;

  if (labels && Array.isArray(labels.Regions)) {
    const regionsToShow = labels.Regions.filter((region) =>
      regionCode.toUpperCase() === 'ABD'
        ? region.RegionCode.toUpperCase() === 'ALL' || region.RegionCode.toUpperCase() === 'ABD'
        : region.RegionCode.toUpperCase() === 'ALL'
    );

    const hasAll = regionsToShow.some((region) => region.RegionCode.toUpperCase() === 'ALL');
    const hasABD = regionsToShow.some((region) => region.RegionCode.toUpperCase() === 'ABD');

    if (regionCode === 'ABD' && (!hasAll || !hasABD)) {
      // console.error('Both "ALL" and "ABD" regions must be present.');
    }

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

  const Searchfields = allRegion.reduce((acc, curr) => {
    if (Array.isArray(curr.Fields)) {
      acc.push(...curr.Fields);
    }
    return acc;
  }, []);

  const validationSchema = Yup.object().shape(
    Searchfields?.reduce((schema, field) => {
      if (field.IsMandatory) {
        schema[field.FieldId] = Yup.string().required(
          `${field.FieldId} is required`
        );
      }
      return schema;
    }, {})
  );


  if (!Searchfields || !Array.isArray(Searchfields)) {
    console.error('Merged fields are not defined or not an array.');
  }

   
  return (
    <>
      <Label>{t('SelectFilter')}</Label>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}

        enableReinitialize={true}

        onSubmit={async (values) => {
          const filtersPayload = {
            pageIndex: pageIndex,
            pageSize,
            headerFacilityId: values.facility?.join(','),
            loginUserId: userDetails.UserId,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            facilityId: values.facility?.join(','), 
            incidentId: values.incidentNumber,
            incidentDetailId: values.incidentDetails,
            incidentFromDate: values.incidentFromDate,
            incidentToDate: values.incidentToDate,
            IncidentTypeId: values.incidentType,
            MainCategoryId: values.maincategory,
            SubCategoryId: values.subcategory,
            AffectedCategoryId: values.affectedCategory,
          };
          
          dispatch(setFilters(filtersPayload));

          dispatch(setIsFilterApplied(true));

          handleToggleFilter();
        }}
      >
        {({ values, handleSubmit, setFieldValue, resetForm }) => (
          <Grid container spacing={2} display={'flex'}>
             {fieldsConfig.map((fieldConfig, index) => {
                const field = Searchfields.find(f => f.FieldId === fieldConfig.fieldId);
                const translatedLabel = getlabel(
                  fieldConfig.translationId,
                  Allabels,
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
                    key={field.fieldId || index}
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
                        renderOption={(props, option) => (
                          <li key={option.value} {...props}>
                            {option.text}
                          </li>
                        )}
                      />
                    )}

                    {fieldConfig.component === 'Date' && (
                      <Date
                        name={fieldConfig.name}
                        onChange={(event, value) => {
                          setFieldValue(fieldConfig.name, event);
                        }}
                        value = {values[fieldConfig.name]}

                      />
                    )}
                    {fieldConfig.component === 'MultiSelectDropdown' && (
                      <MultiSelectDropdown
                        name={fieldConfig?.name}
                        options={fieldConfig?.options}
                        required={field.IsMandatory}
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

export default FilterCompletedFields;
