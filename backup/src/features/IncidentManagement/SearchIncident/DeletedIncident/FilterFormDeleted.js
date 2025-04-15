import { Formik } from 'formik';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import Label from '../../../../components/Label/Label';
import { StyledButton, StyledImage } from '../../../../utils/StyledComponents';
import WhiteSearch from '../../../../assets/Icons/WhiteSearch.png';
import Eraser from '../../../../assets/Icons/Eraser.png';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import {
  resetFilters,
  setFilters,
  setIsFilterApplied,
} from '../../../../redux/features/mainMaster/searchIncidentSlice';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import { Grid } from '@mui/material';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import Date from '../../../../components/Date/Date';
import { useGetPageLoadDataQuery } from '../../../../redux/RTK/IncidentManagement/searchIncidentApi';

const FilterFormDeleted = ({ fields, handleToggleFilter, labels }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const { isMobile } = useWindowDimension();
  const regionCode = useSelector((state) =>
    state.auth.regionCode?.toUpperCase()
  );

  const { selectedMenu, selectedModuleId, userDetails, selectedFacility } =
    useSelector((state) => {
      return state.auth;
    });

  const {
    pageSize,
    pageIndex,
    facilityId,
    incidentFromDate,
    incidentToDate,
    departmentId,
    incidentDetailId,
    incidentTypeId,
    personInvolved,
    incidentHarmLevelId,
    incidentRiskLevelId,
    dayofWeek,
    incidentStatusId,
    reportingYear,
  } = useSelector((state) => state.searchIncident.filters);

  const initialValues = {
    facility: facilityId?.split(',') || [],
    incidentFromDate: incidentFromDate || '',
    incidentToDate: incidentToDate || '',
    incidentDepartment: departmentId,
    incidentDetails: incidentDetailId,
    incidentType: incidentTypeId,
    personInvolvedintheIncident: personInvolved,
    harmLevel: incidentHarmLevelId,
    incidentRiskLevel: incidentRiskLevelId,
    dayoftheWeek: dayofWeek,
    incidentStatus: incidentStatusId,
    year: reportingYear,
  };

  const { data: pageLoadData } = useGetPageLoadDataQuery({
    moduleId: selectedModuleId,
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const sections = fields?.Sections || [];

  const search_Fields = sections.find(
    (section) => section.SectionName === 'Search'
  )?.Regions;

  const fieldsConfig = [
    {
      fieldId: 'SI_S_Facility',
      translationId: 'IM_SI_Facility',
      label: 'Facility',
      component: 'MultiSelectDropdown',
      name: 'facility',
      options: pageLoadData?.Data?.Result.FacilityList?.map((data) => ({
        text: data.FacilityName,
        value: data.FacilityId,
      })),
    },
    {
      fieldId: 'SI_S_IncidentDepartment',
      translationId: 'IM_SI_IncidentDepartment',
      label: 'Incident Department',
      component: 'Dropdown',
      name: 'incidentDepartment',
      options: pageLoadData?.Data?.Result.DepartmentList?.map((data) => ({
        text: data.DepartmentName,
        value: data.DepartmentId,
      })),
    },
    {
      fieldId: 'SI_S_IncidentDetailsCode',
      translationId: 'IM_SI_IncidentDetailsCode',
      label: 'Incident Details Code',
      component: 'Dropdown',
      name: 'incidentDetailsNumbers',
      options: pageLoadData?.Data?.Result.IncidentDetailsCode?.map((data) => ({
        text: data.IncidentNo,
        value: data.IncidentId,
      })),
    },

    {
      fieldId: 'SI_S_IncidentDetails',
      translationId: 'IM_SI_IncidentDetails',
      label: 'Incident Detail',
      component: 'Dropdown',
      name: 'incidentDetails',
      options: (() => {
        const uniqueDetails = new Set();
        return pageLoadData?.Data?.Result.IncidentDetailList?.filter((data) => {
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
      fieldId: 'SI_S_IncidentType',
      translationId: 'IM_SI_IncidentType',
      label: 'Incident Type',
      component: 'Dropdown',
      name: 'incidentType',
      options: pageLoadData?.Data?.Result.IncidentTypeList?.map((data) => ({
        text: data.IncidentTypeName,
        value: data.IncidentTypeId,
      })),
    },
    {
      fieldId: 'SI_S_PersonInvolvedintheIncident',
      translationId: 'IM_SI_PersonInvolvedintheIncident',
      label: 'Person Involved in the Incident',
      component: 'Dropdown',
      name: 'personInvolvedintheIncident',
      options: pageLoadData?.Data?.Result.PatientInvolvedList?.map((data) => ({
        text: data.Item1,
        value: data.Item2,
      })),
    },
    {
      fieldId: 'SI_S_HarmLevel',
      translationId: 'IM_SI_HarmLevel',
      label: 'Harm Level',
      component: 'Dropdown',
      name: 'harmLevel',
      options: pageLoadData?.Data?.Result.HarmLevelList?.map((data) => ({
        text: data.IncidentHarmLevel,
        value: data.IncidentHarmLevelId,
      })),
    },
    {
      fieldId: 'SI_S_IncidentRiskLevel',
      translationId: 'IM_SI_IncidentRiskLevel',
      label: 'Incident Risk Level',
      component: 'Dropdown',
      name: 'incidentRiskLevel',
      options: pageLoadData?.Data?.Result.IncidentRiskLevelList?.map(
        (data) => ({
          text: data.IncidentRiskLevel,
          value: data.IncidentRiskLevelId,
        })
      ),
    },
    {
      fieldId: 'SI_S_IncidentFromDate',
      translationId: 'IM_SI_IncidentFromDate',
      label: 'Incident From Date',
      component: 'Date',
      name: 'incidentFromDate',
    },
    {
      fieldId: 'SI_S_IncidentToDate',
      translationId: 'IM_SI_IncidentToDate',
      label: 'Incident To Date',
      component: 'Date',
      name: 'incidentToDate',
    },
    {
      fieldId: 'SI_S_DayoftheWeek',
      translationId: 'IM_SI_DayoftheWeek',
      label: 'Day of the Week',
      component: 'Dropdown',
      name: 'dayoftheWeek',
      options: pageLoadData?.Data?.Result.DayOfWeekList?.map((data) => ({
        text: data.DayOfWeek,
        value: data.DayOfWeek,
      })),
    },
    {
      fieldId: 'SI_S_IncidentStatus',
      translationId: 'IM_SI_IncidentStatus',
      label: 'Incident Status',
      component: 'Dropdown',
      name: 'incidentStatus',
      options: pageLoadData?.Data?.Result.IncidentDetailedStatusList?.map(
        (data) => ({
          text: data.DisplayName,
          value: data.IncidentStatusId,
        })
      ),
    },

    {
      fieldId: 'SI_S_Year',
      translationId: 'IM_SI_Year',
      label: 'Year',
      component: 'Dropdown',
      name: 'year',
      options: pageLoadData?.Data?.Result.YearList?.map((data) => ({
        text: data.Year,
        value: data.Year,
      })),
    },

    {
      fieldId: 'SI_S_AffectedCategory',
      translationId: 'IM_SI_AffectedCategory',
      label: 'Affected Category',
      component: 'Dropdown',
      name: 'affectedCategory',
      options: pageLoadData?.Data?.Result.AffectedcategoryList?.map((data) => ({
        text: data.AffectedCategory,
        value: data.AffectedCategoryId,
      })),
    },
    {
      fieldId: 'SI_S_AffectedCategoryCode',
      translationId: 'IM_SI_AffectedCategoryCode',
      label: 'Affected Category Code',
      component: 'Dropdown',
      name: 'affectedCategoryCode',
      options: pageLoadData?.Data?.AffectedcategoryList?.map((data) => ({
        text: data.AffectedCategoryCode,
        value: data.AffectedCategoryId,
      })),
    },
    {
      fieldId: 'SI_S_MainCategoryCode',
      translationId: 'IM_SI_MainCategoryCode',
      label: 'Main Category Code',
      component: 'Dropdown',
      name: 'mainCategoryCode',
      options: pageLoadData?.Data?.IncidentCategoryList?.map((data) => ({
        text: data.MainCategoryCode,
        value: data.MainCategoryId,
      })),
    },
    {
      fieldId: 'SI_S_SubCategoryCode',
      translationId: 'IM_SI_SubCategoryCode',
      label: 'sub Category Code',
      component: 'Dropdown',
      name: 'subCategoryCode',
      options: pageLoadData?.Data?.IncidentCategoryList?.map((data) => ({
        text: data.SubCategoryCode,
        value: data.SubCategoryId,
      })),
    },
    {
      fieldId: 'SI_S_IncidentDetailsCode',
      translationId: 'IM_SI_IncidentDetailsCode',
      label: 'Incident Details Code',
      component: 'Dropdown',
      name: 'incidentDetailsCode',
      options: pageLoadData?.Data?.IncidentDetailsCode?.map((data) => ({
        text: data.IncidentNo,
        value: data.IncidentId,
      })),
    },

    {
      fieldId: 'SI_S_ContributingMainFactorCode',
      translationId: 'IM_SI_ContributingMainFactorCode',
      label: 'Contributing Main FactorCode',
      component: 'Dropdown',
      name: 'contributingMainFactorCode',
    },

    {
      fieldId: 'SI_S_ContributingSubFactorCode',
      translationId: 'IM_SI_ContributingSubFactorCode',
      label: 'Contributing Sub FactorCode',
      component: 'Dropdown',
      name: 'ContributingSubFactorCode',
    },
  ];

  let Allabels;

  if (labels && Array.isArray(labels.Regions)) {
    const regionsToShow = labels.Regions.filter((region) =>
      regionCode === 'ABD'
        ? region.RegionCode === 'All' || region.RegionCode === 'ABD'
        : region.RegionCode === 'All'
    );

    const hasAll = regionsToShow.some((region) => region.RegionCode === 'ALL');
    const hasABD = regionsToShow.some((region) => region.RegionCode === 'ABD');

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
        regionCode === 'ALL'
          ? sitem.RegionCode === 'ALL'
          : sitem.RegionCode === 'ABD' || sitem.RegionCode === 'ALL'
      )
    : [];

  allRegion.sort((a, b) => {
    if (a.RegionCode === 'ALL') return -1;
    if (b.RegionCode === 'ALL') return 1;
    return 0;
  });

  const Searchfields = allRegion.reduce((acc, curr) => {
    if (Array.isArray(curr.Fields)) {
      acc.push(...curr.Fields.filter((field) => field.IsShow === true));
    }
    return acc;
  }, []);

  if (!Searchfields || !Array.isArray(Searchfields)) {
    console.error('Merged fields are not defined or not an array.');
  }

  return (
    <>
      <Label>Select Filter</Label>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          dispatch(
            setFilters({
              pageIndex: pageIndex,
              pageSize,
              headerFacility: selectedFacility?.id,
              loginUserId: userDetails.UserId,
              moduleId: selectedModuleId,
              menuId: selectedMenu?.id,
              facilityId: values.facility?.join(','),
              incidentFromDate: values.incidentFromDate || '',
              incidentToDate: values.incidentToDate || '',
              departmentId: values.incidentDepartment,
              incidentDetailId: values.incidentDetails,
              incidentTypeId: values.incidentType,
              personInvolved: values.personInvolvedintheIncident,
              incidentHarmLevelId: values.harmLevel,
              dayofWeek: values.dayoftheWeek,
              incidentStatusId: values.incidentStatus,
              reportingYear: values.year,
            })
          );
          dispatch(setIsFilterApplied(true));

          handleToggleFilter();
        }}
      >
        {({ values, handleSubmit, setFieldValue, resetForm }) => (
          <Grid container spacing={2} display={'flex'}>
            {Searchfields?.map((field, index) => {
              const fieldConfig = fieldsConfig.find(
                (config) => config.fieldId === field.FieldId
              );
              const translatedLabel = getlabel(
                fieldConfig?.translationId,
                Allabels,
                i18n.language
              );
              if (field.IsShow && fieldConfig) {
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
                        value={values[fieldConfig.name]}
                        onChange={(date) => {
                          setFieldValue(fieldConfig.name, date);
                        }}
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

export default FilterFormDeleted;
