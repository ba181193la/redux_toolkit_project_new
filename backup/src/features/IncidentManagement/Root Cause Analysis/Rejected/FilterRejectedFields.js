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
import { useGetPageLoadDataQuery } from '../../../../redux/RTK/staffMasterApi';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import Search from '../../../../assets/Icons/Search.png';
import {
  resetFilters,
  setFilters,
  setIsFilterApplied,
} from '../../../../redux/features/mainMaster/staffMasterSlice';
import { Grid, InputAdornment } from '@mui/material';
import TextArea from '../../../../components/TextArea/TextArea';
import { TextField } from '../../../../components/TextField/TextField';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import useWindowDimension from '../../../../hooks/useWindowDimension';

const FilterRejectedFields = ({ fields, handleToggleFilter, labels }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const { selectedMenu, selectedModuleId, userDetails, selectedFacility } =
    useSelector((state) => state.auth);
      const { isMobile } = useWindowDimension();
    
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
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const sections = fields?.Sections || [];

  const search_Fields = sections.find(
    (section) => section.SectionName === 'Search'
  )?.Regions;


  const initialValues = {
    incidentFromDate: null,
    incidentToDate: null,
    incidentNumber: '',
    incidentDetails: '',
    incidentType: '',
    approvalFromDate: null,
    approvalToDate: null,
    approvedBy: ''
  };

  const fieldsConfig = [
    {
      fieldId: 'IA_S_Facility',
      translationId: 'IM_IA_Facility',
      label: 'Facility',
      component: 'Dropdown',
      name: 'facility',
    
    },
    {
      fieldId: 'IA_S_IncidentNumber',
      translationId: 'IM_IA_IncidentNumber',
      label: 'Incident Number',
      component: 'Dropdown',
      name: 'incidentNumber',
   
    },
    {
      fieldId: 'IA_S_IncidentDetails',
      translationId: 'IM_IA_IncidentDetails',
      label: 'Incident Detail',
      component: 'Dropdown',
      name: 'incidentDetails',
   
    },

    {
      fieldId: 'IA_S_IncidentType',
      translationId: 'IM_IA_IncidentType',
      label: 'Incident Type',
      component: 'Dropdown',
      name: 'incidentType',
   
    },

    {
      fieldId: 'IA_S_ReportedBy',
      translationId: 'IM_IA_ReportedBy',
      label: 'ReportedBy',
      component: 'Dropdown',
      name: 'reportedBy',
   
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
      fieldId: 'IA_S_IncidentMainCategory',
      translationId: 'IM_IA_IncidentMainCategory',
      label: 'Incident Main Category',
      component: 'Dropdown',
      name: 'maincategory',
      
    },
    {
      fieldId: 'IA_S_IncidentSubCategory',
      translationId: 'IM_IA_IncidentSubCategory',
      label: 'Incident Sub Category',
      component: 'Dropdown',
      name: 'subcategory',
      
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
    },
    {
      fieldId: 'IA_S_AffectedCategoryCode',
      translationId: 'IM_IA_AffectedCategoryCode',
      label: 'Affected Category Code',
      component: 'Dropdown',
      name: 'affectedCategoryCode',
    },
    {
      fieldId: 'IA_S_MainCategoryCode',
      translationId: 'IM_IA_MainCategoryCode',
      label: 'Main Category Code',
      component: 'Dropdown',
      name: 'mainCategoryCode',
    },
    {
      fieldId: 'IA_S_SubCategoryCode',
      translationId: 'IM_IA_SubCategoryCode',
      label: 'sub Category Code',
      component: 'Dropdown',
      name: 'subCategoryCode',
    },
    {
      fieldId: 'IA_S_IncidentDetailsCode',
      translationId: 'IM_IA_IncidentDetailsCode',
      label: 'Incident Details Code',
      component: 'Dropdown',
      name: 'incidentDetailsCode',
    },


  ];


  const regionCodes = localStorage.getItem('regionCode')?.toUpperCase() || 'ALL'; 
  
  let Allabels;

if (labels && Array.isArray(labels.Regions)) {
  const regionsToShow = labels.Regions.filter(region =>
    regionCodes === 'ABD' ?
      (region.RegionCode === 'ALL' || region.RegionCode === 'ABD') :
      region.RegionCode === 'ALL'
  );

  const hasAll = regionsToShow.some(region => region.RegionCode === 'ALL');
  const hasABD = regionsToShow.some(region => region.RegionCode === 'ABD');

  if (regionCodes === 'ABD' && (!hasAll || !hasABD)) {
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
      regionCodes === 'ABD' 
        ? (sitem.RegionCode === 'ALL' || sitem.RegionCode === 'ABD') 
        : sitem.RegionCode === 'ALL'
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
        //validationSchema={validationSchema}
        onSubmit={async (values) => {
          console.log({ values }, 'value');
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

export default FilterRejectedFields;
