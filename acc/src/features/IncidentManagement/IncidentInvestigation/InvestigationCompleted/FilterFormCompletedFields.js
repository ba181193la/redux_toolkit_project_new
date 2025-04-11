import { Formik } from 'formik';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import Label from '../../../../components/Label/Label';
import { StyledButton, StyledImage } from '../../../../utils/StyledComponents';
import WhiteSearch from '../../../../assets/Icons/WhiteSearch.png';
import Eraser from '../../../../assets/Icons/Eraser.png';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useGetPageLoadDataQuery } from '../../../../redux/RTK/incidentInvestigationApi';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import {
  resetFilters,
  setFilters,
  setIsFilterApplied,
} from '../../../../redux/features/mainMaster/incidentInvestigationSlice';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import { Grid } from '@mui/material';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import Date from '../../../../components/Date/Date';
import { useState } from 'react';

const FilterFormField = ({ fields, handleToggleFilter, labels }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const { isMobile } = useWindowDimension();
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setTODate] = useState(null);

  const { selectedMenu, selectedModuleId, userDetails, selectedFacility } =
    useSelector((state) => state.auth);


  const {
    pageSize,
    pageIndex,
    facilityId,
    incidentId,
    incidentDetailId,
    incidentFromDate,
    incidentToDate,
    investigatorId
  } = useSelector((state) => state.incidentInvestigation.filters);

  const { data: pageLoadData } = useGetPageLoadDataQuery({
    moduleId: selectedModuleId,
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const initialValues = {
    facility: facilityId?.split(',') || [],
    incidentNumber: incidentId,
    incidentDetails: incidentDetailId,
    incidentFromDate: incidentFromDate,
    incidentToDate: incidentToDate,
    investigatorName: investigatorId,
  };

  const fieldsConfig = [
    {
      fieldId: 'II_S_Facility',
      translationId: 'IM_II_Facility',
      label: 'Facility',
      component: 'MultiSelectDropdown',
      name: 'facility',
      options: pageLoadData?.Data.Result.FacilityList?.map((data) => ({
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
      fieldId: 'II_S_IncidentNumber',
      translationId: 'IM_II_IncidentNumber',
      label: 'Incident Number',
      component: 'Dropdown',
      name: 'incidentNumber',
      options: pageLoadData?.Data.Result.IncidentListCompleted?.map((data) => ({
        text: data.IncidentNo,
        value: data.IncidentId,
      })),
  
    },
    {
      fieldId: 'II_S_IncidentDetails',
      translationId: 'IM_II_IncidentDetails',
      label: 'Incident Details',
      component: 'Dropdown',
      name: 'incidentDetails',
      options: pageLoadData?.Data.Result.IncidentDetailsPending?.map((data) => ({
        text: data.IncidentDetail,
        value: data.IncidentDetailId,
      })),
   
    },
    {
      fieldId: 'II_S_InvestigatorName',
      translationId: 'IM_II_InvestigatorName',
      label: 'Investigator Name',
      component: 'Dropdown',
      name: 'investigatorName',
      options: pageLoadData?.Data.Result.InvestigatorListCompleted?.map((data) => ({
        text: data.UserName,
        value: data.InvestigatorId,
      })),
  
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
          dispatch(
            setFilters({
              pageIndex: pageIndex,
              pageSize,
              headerFacility: selectedFacility?.id,
              loginUserId: userDetails.UserId,
              moduleId: selectedModuleId,
              menuId: selectedMenu?.id,
              facilityId: values.facility?.join(','),
              incidentId: values.incidentNumber,
              incidentDetailId: values.incidentDetails,
              incidentFromDate: values.incidentFromDate || '',
              incidentToDate: values.incidentToDate || '',
              investigatorId: values.investigatorName || 0  ,
            })
          );
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
                        value = {values[fieldConfig.name]}

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

export default FilterFormField;
