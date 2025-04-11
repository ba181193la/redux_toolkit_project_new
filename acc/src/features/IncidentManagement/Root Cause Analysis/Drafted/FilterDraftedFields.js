import { Formik } from 'formik';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import Label from '../../../../components/Label/Label';
import { FlexContainer, StyledButton, StyledImage, StyledSearch } from '../../../../utils/StyledComponents';
import WhiteSearch from '../../../../assets/Icons/WhiteSearch.png';
import Eraser from '../../../../assets/Icons/Eraser.png';
import Date from '../../../../components/Date/Date';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useGetPageLoadDataQuery } from '../../../../redux/RTK/IncidentManagement/incidentRcaAPI';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import {
  resetFilters,
  setFilters,
  setIsFilterApplied,
} from '../../../../redux/features/mainMaster/incidentRcaSlice';
import { Grid, InputAdornment } from '@mui/material';
import TextArea from '../../../../components/TextArea/TextArea';
import { TextField } from '../../../../components/TextField/TextField';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';



const FilterFormField = ({ fields, handleToggleFilter, labels }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const { isMobile } = useWindowDimension();
  

  const { selectedMenu, selectedModuleId, userDetails, selectedFacility } =
    useSelector((state) => state.auth);


  const {
    pageSize,
    pageIndex,
    facilityId,
    incidentId,
    incidentTypeId,
    incidentDetailId,
    incidentRiskLevelId
  } = useSelector((state) => state.incidentRca.filters);

  const { data: pageLoadData } = useGetPageLoadDataQuery({
    moduleId: selectedModuleId,
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const initialValues = {
    facility: facilityId?.split(',') || [],
    incidentNumber: incidentId || 0,
    incidentType: incidentTypeId || 0,
    incidentDetails: incidentDetailId || 0,  
    IncidentRiskLevel: incidentRiskLevelId || 0,  

  };

  const fieldsConfig = [
    {
      fieldId: 'RCA_S_Facility',
      translationId: 'IM_RCA_Facility',
      label: 'Facility',
      component: 'MultiSelectDropdown',
      name: 'facility',
      options: pageLoadData?.Data.FacilityList?.map((data) => ({
        text: data.FacilityName,
        value: data.FacilityId,
      })),
    },
    {
      fieldId: 'RCA_S_IncidentNumber',
      translationId: 'IM_RCA_IncidentNumber',
      label: 'Incident Number',
      component: 'Dropdown',
      name: 'incidentNumber',
      options: pageLoadData?.Data.IncidentNumberList?.map((data) => ({
        text: data.IncidentNo,
        value: data.IncidentId,
      })),
    },
    {
      fieldId: 'RCA_S_IncidentDetails',
      translationId: 'IM_RCA_IncidentDetails',
      label: 'Incident Details',
      component: 'Dropdown',
      name: 'incidentDetails',
      options: pageLoadData?.Data.IncidentCategoryList?.map((data) => {
        if (data?.IncidentDetail && data?.IncidentDetailId) { 
          return {
            text: data?.IncidentDetail,
            value: data?.IncidentDetailId,
          };
        }
        return null;
      }).filter(option => option !== null)
     
    },
    {
      fieldId: 'RCA_S_IncidentType',
      translationId: 'IM_RCA_IncidentType',
      label: 'IncidentType',
      component: 'Dropdown',
      name: 'incidentType',
      options: pageLoadData?.Data.IncidentTypeList?.map((data) => ({
        text: data.IncidentTypeName,
        value: data.IncidentTypeId,
      })),
     
    },
    {
      fieldId: 'RCA_S_IncidentRiskLevel',
      translationId: 'IM_RCA_IncidentRiskLevel',
      label: 'IncidentRiskLevel',
      component: 'Dropdown',
      name: 'IncidentRiskLevel',
      options: pageLoadData?.Data.IncidentRiskLevel?.map((data) => ({
        text: data.IncidentRiskLevel,
        value: data.IncidentRiskLevelId,
      })),
     
    },

  ];

  const searchFields =
    fields?.Sections?.find(
        (section) => section.SectionName === 'Search'
    )?.Regions?.find(
        (region) => region.RegionCode === 'ALL'
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
              pageSize: pageSize,
              facilityId: values.facility?.join(','),
              headerFacilityId: selectedFacility?.id,
              loginUserId: userDetails.UserId,
              moduleId: selectedModuleId,
              menuId: selectedMenu?.id,
              incidentId: values.incidentNumber,
              incidentDetailId: values.incidentDetails,
              incidentTypeId: values.incidentType,
              incidentRiskLevelId: values.IncidentRiskLevel,

            })
          );
          dispatch(setIsFilterApplied(true));

          handleToggleFilter();
        }}
      >
        {({ values, handleSubmit, setFieldValue, resetForm }) => (
          <Grid container spacing={2} display={'flex'}>
            {searchFields?.map((field) => {
              const fieldConfig = fieldsConfig.find(
                (config) => config.fieldId === field.FieldId
              );


              const translatedLabel = getlabel(
                fieldConfig?.translationId,
                labels,
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
