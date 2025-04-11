import { Formik } from 'formik';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import Label from '../../../../components/Label/Label';
import { StyledButton, StyledImage } from '../../../../utils/StyledComponents';
import WhiteSearch from '../../../../assets/Icons/WhiteSearch.png';
import Eraser from '../../../../assets/Icons/Eraser.png';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useGetPageLoadDataQuery } from '../../../../redux/RTK/IncidentManagement/IncidentDashboardApi';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import {
  resetFilters,
  setFilters,
  setIsFilterApplied,
} from '../../../../redux/features/mainMaster/IncidentDashboardSlice';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import { Grid } from '@mui/material';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import DatePicker from '../../../../components/Date/Date';
import { useState } from 'react';

const FilterFormField = ({ fields, handleToggleFilter, labels }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const { isMobile } = useWindowDimension();
  

  const { selectedMenu, selectedModuleId, userDetails, selectedFacility } =
    useSelector((state) => state.auth);


  const {
    pageSize,
    pageIndex,
    listingTabNo,
    facilityId,
    incidentTypeId,
    incidentDetail,
    harmLevel,
    incidentRiskLevel,
    incidentDepartment,
    personInvoled,
    year,
    incidentDateFrom,
    incidentDateTo,
  } = useSelector((state) => state.incidentDashboard.filters);

  const cleanSplit = (value) => {
    if (!value || typeof value !== 'string') {
      return [];
    }
    return value.replace(/^,/, '').split(',');
  };
  
  
const initialValues = {
    facility: cleanSplit(facilityId),
    incidentFromDate: incidentDateFrom,  
    incidentToDate: incidentDateTo,    
    incidentYear: cleanSplit(year),
    incidentDepartment: cleanSplit(incidentDepartment),
    incidentType: cleanSplit(incidentTypeId),
    incidentDetails: cleanSplit(incidentDetail),
    personInvolved: cleanSplit(personInvoled),
    harmLevel: cleanSplit(harmLevel),
    incidentRiskLevel: cleanSplit(incidentRiskLevel),
};

  const { data: pageLoadData } = useGetPageLoadDataQuery({
      moduleId: selectedModuleId,
      menuId: 34,
      loginUserId: userDetails?.UserId,
      headerFacilityId: selectedFacility?.id,
    });

  const currentYear = new Date().getFullYear();

  const fieldsConfig = [
    {
      fieldId: 'II_S_Facility',
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
      fieldId: 'II_S_IncidentFromDate',
      translationId: 'IM_II_IncidentFromDate',
      label: 'Incident From Date',
      component: 'Date',
      name: 'incidentFromDate',
    },
    {
      fieldId: 'II_S_IncidentToDate',
      translationId: 'IM_II_IncidentToDate',
      label: 'Incident To Date',
      component: 'Date',
      name: 'incidentToDate',
    },

    {
      fieldId: 'II_S_IncidentYear',
      translationId: 'IM_II_IncidentYear',
      label: 'Incident Year',
      component: 'MultiSelectDropdown',
      name: 'incidentYear',
      options: pageLoadData?.Data?.Result.YearList?.map((data) => ({
        text: data.Year,
        value: data.Year,
      })),
    },
    
      {
        fieldId: 'II_S_IncidentDepartment',
        translationId: 'IM_II_IncidentDepartment',
        label: 'Incident Department',
        component: 'MultiSelectDropdown',
        name: 'incidentDepartment',
        options: pageLoadData?.Data?.Result.DepartmentList?.map((data) => ({
          text: data.DepartmentName,
          value: data.DepartmentId,
        })),
       
      },
      {
        fieldId: 'II_S_IncidentType',
        translationId: 'IM_II_IncidentType',
        label: 'Incident Type',
        component: 'MultiSelectDropdown',
        name: 'incidentType',
        options: pageLoadData?.Data?.Result.IncidentTypeList?.map((data) => ({
          text: data.IncidentTypeName,
          value: data.IncidentTypeId,
        })),
      },
      {
        fieldId: 'II_S_IncidentDetails',
        translationId: 'IM_II_IncidentDetails',
        label: 'Incident Details',
        component: 'MultiSelectDropdown',
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
        fieldId: 'II_S_PersonInvolved',
        translationId: 'IM_II_PersonInvolved',
        label: 'Person Involved',
        component: 'MultiSelectDropdown',
        name: 'personInvolved',
        options: pageLoadData?.Data?.Result.PersonInvolvedList?.map((data) => ({
          text: data.Item1,
          value: data.Item2,
        })),
      },
      {
        fieldId: 'II_S_HarmLevel',
        translationId: 'IM_II_HarmLevel',
        label: 'Harm Level',
        component: 'MultiSelectDropdown',
        name: 'harmLevel',
        options: pageLoadData?.Data?.Result.HarmLevelList?.map((data) => ({
          text: data.IncidentHarmLevel,
          value: data.IncidentHarmLevelId,
        })),
      },
      {
        fieldId: 'II_S_IncidentRiskLevel',
        translationId: 'IM_II_IncidentRiskLevel',
        label: 'Incident Risk Level',
        component: 'MultiSelectDropdown',
        name: 'incidentRiskLevel',
        options: pageLoadData?.Data?.Result.IncidentRiskLevelList?.map(
          (data) => ({
            text: data.IncidentRiskLevel,
            value: data.IncidentRiskLevelId,
          })
        ),
      },
    
    
  ];

  const searchFields =
    fields?.Sections?.find(
        (section) => section.SectionName === 'Search'
    )?.Regions?.find(
        (region) => region.RegionCode.toUpperCase() === 'ALL'
    )?.Fields?.filter(
        (field) => field.IsShow === true
    ) || [];

    


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
console.log("valuesvalues",values)
            dispatch(
                setFilters({
                    pageIndex: pageIndex,
                    pageSize,
                    headerFacilityId: selectedFacility?.id,
                    loginUserId: userDetails.UserId,
                    moduleId: selectedModuleId,
                    menuId: selectedMenu?.id,
                    facilityId:  values.facility.join(','),
                    year: values.incidentYear.join(',') ,
                    incidentDepartment: values.incidentDepartment.join(','),
                    incidentTypeId: values.incidentType.join(','),
                    incidentDetail: values.incidentDetails.join(','),
                    personInvoled: values.personInvolved.join(','),
                    harmLevel: values.harmLevel.join(','),
                    incidentRiskLevel: values.incidentRiskLevel.join(','),
                    incidentFromDate: values.incidentFromDate || '',
                    incidentToDate: values.incidentToDate || '',
                })
            );
            
          dispatch(setIsFilterApplied(true));

          handleToggleFilter();
        }}
      >
        {({ values, handleSubmit, setFieldValue, resetForm }) => (
          <Grid container spacing={2} display={'flex'}>
             {fieldsConfig.map((fieldConfig, index) => {

                return (
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    padding={'10px'}
                    md={3}
                    key={fieldConfig.fieldId}
                  >
                    <Label value={fieldConfig.label} />
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
                <>
                    <MultiSelectDropdown
                name={fieldConfig.name}
                options={fieldConfig.options || []}
                required={false}
                setSelectedIds={(selectedValues) => setFieldValue(fieldConfig.name, selectedValues)}
                // valueType="string"  

              />


                </>
                )}

                    {fieldConfig.component === 'Date' && (
                    <DatePicker
                        name={fieldConfig?.name}
                        onChange={(date) => {
                        setFieldValue(fieldConfig.name, date || '');
                        }}
                        value={values[fieldConfig.name] || ''}
                    />
                    )}

                  </Grid>
                );
              
            })}
            <Grid
            padding="10px"
            item
            xs={12}
            display="flex"
            justifyContent="center"
            gap="10px"
            flexWrap="wrap"
            >
            <StyledButton
            borderRadius="6px"
            padding="6px 10px"
            variant="contained"
            sx={{ backgroundColor: '#5cb85c !important', color: 'white !important' }}
            width={isMobile ? '100%' : ''}
            startIcon={
                <i className="fa fa-eye" style={{ color: 'white', marginInlineEnd: 5 }}></i>
            }
            onClick={handleSubmit}
            >
            View Charts
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

export default FilterFormField;
