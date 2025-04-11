import { Formik } from 'formik';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import Label from '../../../../components/Label/Label';
import { StyledButton, StyledImage } from '../../../../utils/StyledComponents';
import WhiteSearch from '../../../../assets/Icons/WhiteSearch.png';
import Eraser from '../../../../assets/Icons/Eraser.png';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useGetPageLoadDataQuery } from '../../../../redux/RTK/staffMasterApi';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import {
  resetFilters,
  setFilters,
  setIsFilterApplied,
} from '../../../../redux/features/mainMaster/staffMasterSlice';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import { Grid } from '@mui/material';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import Date from '../../../../components/Date/Date';

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
    searchStaffId,
    employmentTypeId,
    departmentId,
    employeeId,
    designationId,
    staffCategoryId,
    activeStatus,
    adUserLogonName,
  } = useSelector((state) => state.staffMaster.filters);

  const { data: pageLoadData } = useGetPageLoadDataQuery({
    menuId: 27,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const initialValues = {
    facility: facilityId?.split(',') || [],
    searchStaffId: searchStaffId || 0,
    employeeType: employmentTypeId || 0,
    department: departmentId || 0,
    employeeId: employeeId || '',
    designation: designationId || 0,
    staffCategory: staffCategoryId || 0,
    adUserLogonName: adUserLogonName || '',
    status: activeStatus || '',
    incidentFromDate: null,
    incidentToDate: null,


  };
  const fieldsConfig = [
    {
      fieldId: 'II_S_Facility',
      translationId: 'IM_II_Facility',
      label: 'Facility',
      component: 'Dropdown',
      name: 'facility',
    },
    {
      fieldId: 'II_S_IncidentNumber',
      translationId: 'IM_II_IncidentNumber',
      label: 'Incident Number',
      component: 'Dropdown',
      name: 'incidentNumber',
  
    },
    {
      fieldId: 'II_S_IncidentDetails',
      translationId: 'IM_II_IncidentDetails',
      label: 'Incident Details',
      component: 'Dropdown',
      name: 'incidentDetails',
   
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
      fieldId: 'II_S_InvestigatorName',
      translationId: 'IM_II_InvestigatorName',
      label: 'Investigator Name',
      component: 'Dropdown',
      name: 'investigatorName',
  
    },
   
  ];

  const searchFields = fields?.Sections
  ?.find((section) => section.SectionName === 'Search')  
  ?.Regions?.find((region) => region.RegionCode === 'ALL')  
  ?.Fields || []; 

  return (
    <>
      <Label>{t('SelectFilter')}</Label>
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={async (values) => {
            console.log({ values }, 'value');
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
                      
                        onChange={(event, value) => {
                          setFieldValue(fieldConfig.name, value?.value);
                        }}
                       
                      />
                    )}
                    {fieldConfig.component === 'MultiSelectDropdown' && (
                      <MultiSelectDropdown
                        name={fieldConfig?.name}
                        required={field.IsMandatory}
                      />
                    )}
                    {fieldConfig.component === 'Date' && (
                       <Date/>
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
