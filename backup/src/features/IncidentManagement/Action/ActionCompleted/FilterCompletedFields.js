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
import { useGetPageLoadDataQuery } from '../../../../redux/RTK/IncidentManagement/ActionsApi';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import Search from '../../../../assets/Icons/Search.png';



import {
  resetFilters,
  setFilters,
  setIsFilterApplied,
} from '../../../../redux/features/mainMaster/ActionIncidentSlice';
import { Grid, InputAdornment } from '@mui/material';
import TextArea from '../../../../components/TextArea/TextArea';
import { TextField } from '../../../../components/TextField/TextField';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';


const FilterCompletedFields = ({ fields, handleToggleFilter, labels }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const { selectedMenu, selectedModuleId, userDetails, selectedFacility } =
    useSelector((state) => state.auth);
    const {
      pageSize,
      pageIndex,
      facilityIds,
      incidentId,
      responsibleStaff,
      responsibleDepartment,
      incidentFromDate,
      incidentToDate,
      deadlineFromDate,
      deadlineToDate
    } = useSelector((state) => state.ActionIncidentSlice.filters);


  const { isMobile } = useWindowDimension();



  const { data: pageLoadData } = useGetPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
    moduleId: selectedModuleId,
  });

  const sections = fields?.Sections || [];

  const search_Fields = sections.find(
    (section) => section.SectionName === 'Search'
  )?.Regions;


  

 
  const initialValues = {

    facility: facilityIds?.split(',') || [],
    incidentFromDate: incidentFromDate,
    incidentToDate: incidentToDate,
    incidentNumber: incidentId,
    responsibleStaff: responsibleStaff,
    department: responsibleDepartment,
    deadlineFromDate: deadlineFromDate,
    deadlineToDate: deadlineToDate,
  };

  const fieldsConfig = [
    {
      fieldId: 'A_S_Facility',
      translationId: 'IM_A_Facility',
      label: 'Facility',
      component: 'MultiSelectDropdown',
      name: 'facility',
      options: pageLoadData?.Data?.FacilityList?.map((data) => ({
        text: data.FacilityName,
        value: data.FacilityId,
      })),
    
    },
    {
      fieldId: 'A_S_IncidentNumber',
      translationId: 'IM_A_IncidentNumber',
      label: 'Incident Number',
      component: 'Dropdown',
      name: 'incidentNumber',
      options: pageLoadData?.Data?.Result?.IncidentNumberList?.map((data) => ({
        text: data.IncidentNo,
        value: data.IncidentId,
      })),
   
    },


    {
      fieldId: 'A_S_IncidentFromDate',
      translationId: 'IM_A_IncidentFromDate',
      label: 'Incident From Date',
      component: 'Date',
      name: 'incidentFromDate',
    
    },
    {
      fieldId: 'A_S_IncidentToDate',
      translationId: 'IM_A_IncidentToDate',
      label: 'incident ToDate',
      component: 'Date',
      name: 'incidentToDate',
      
    },

    {
      fieldId: 'A_S_DeadlineFromDate',
      translationId: 'IM_A_DeadlineFromDate',
      label: 'Deadline From Date',
      component: 'Date',
      name: 'deadlineFromDate',
      
    },
    {
      fieldId: 'A_S_DeadlineToDate',
      translationId: 'IM_A_DeadlineToDate',
      label: 'Deadline To Date',
      component: 'Date',
      name: 'deadlineToDate',
      
    },


    {
      fieldId: 'A_S_ResponsibleStaff',
      translationId: 'IM_A_ResponsibleStaff',
      label: 'Responsible Staff',
      component: 'Dropdown',
      name: 'responsibleStaff',
      options: pageLoadData?.Data?.Result?.ResponsibleStaffList?.map((data) => ({
        text: data.UserName,
        value: data.UserId,
      })),
   
    },

    {
      fieldId: 'A_S_Department',
      translationId: 'IM_A_Department',
      label: 'Department',
      component: 'Dropdown',
      name: 'department',
      options: pageLoadData?.Data?.Result?.DepartmentList?.map((data) => ({
        text: data.DepartmentName,
        value: data.DepartmentId,
      })),
   
    },

    


  ];

  const regionCodes = localStorage.getItem('regionCode')?.toUpperCase() || 'ALL'; 
  
  let Allabels;

if (labels && Array.isArray(labels.Regions)) {
  const regionsToShow = labels.Regions.filter(region =>
    regionCodes.toUpperCase() === 'ABD' ?
      (region.RegionCode.toUpperCase() === 'ALL' || region.RegionCode.toUpperCase() === 'ABD') :
      region.RegionCode.toUpperCase() === 'ALL'
  );

  const hasAll = regionsToShow.some(region => region.RegionCode.toUpperCase() === 'ALL');
  const hasABD = regionsToShow.some(region => region.RegionCode.toUpperCase() === 'ABD');

  if (regionCodes.toUpperCase() === 'ABD' && (!hasAll || !hasABD)) {
    // console.error('Both "ALL" and "ABD" regions must be present.');
  }

  if (regionsToShow.length > 0) {
    Allabels = { ...regionsToShow[0] }; 
    regionsToShow.forEach(region => {
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
  ? search_Fields.filter(sitem => 
      regionCodes.toUpperCase() === 'ABD' 
        ? (sitem.RegionCode.toUpperCase() === 'ALL' || sitem.RegionCode.toUpperCase() === 'ABD') 
        : sitem.RegionCode.toUpperCase() === 'ALL'
    ) 
  : [];

const Searchfields = allRegion.reduce((acc, curr) => {
  if (Array.isArray(curr.Fields)) {
    acc.push(...curr.Fields); 
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
        
        const filtersPayload = {
          pageIndex: pageIndex,
          pageSize,
          headerFacilityId: values.facility?.join(','),
          loginUserId: userDetails.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
          facilityIds: values.facility?.join(','), 
          incidentFromDate: values.incidentFromDate,
          incidentToDate: values.incidentToDate,
          deadlineFromDate: values.deadlineFromDate,
          deadlineToDate: values.deadlineToDate,
          responsibleDepartment: values.department,
          responsibleStaff: values.responsibleStaff,
          incidentId: values.incidentNumber,
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
                  key={field.fieldId || index}  // Use a unique key
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

export default FilterCompletedFields;
