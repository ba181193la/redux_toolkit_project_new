import {
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { FlexContainer, StyledTypography } from '../../../../utils/StyledComponents';
import { FormContainer, FormLabel } from '../searchIncident.styled';
import SubmittedByMeTable from './Datatable/SubmittedByMeTable';
import { useTranslation } from 'react-i18next';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../../utils/language'; 

const IncidentApprovalDetails = () => {

  const { i18n, t } = useTranslation();

  const fieldsConfig = [
    {
      fieldId: `IA_P_IncidentMainCategory`,
      translationId: 'IM_IA_IncidentMainCategory',
      label: 'Incident Main Category',
      name: 'incidentMainCategory',
    },
    {
      fieldId: `IA_P_IncidentSubCategory`,
      translationId: 'IM_IA_IncidentSubCategory',
      label: 'Incident Sub Category',
      name: 'incidentSubCategory',
  
    },
    {
      fields: `IA_P_IncidentDetails`,
      translationId: 'IM_IA_IncidentDetails',
      label: 'Incident Details',
      name: 'incidentDetails',
   
    },
    {
      fieldId: `IA_P_IncidentType`,
      translationId: 'IM_IA_IncidentType',
      label: 'Incident Type',
      name: 'incidentType',
 
    },
    {
      fieldId: `IA_P_Clinical/NonClinical`,
      translationId: 'IM_IA_Clinical/NonClinical',
      label: 'Clinical/Non-Clinical',
      name: 'clinical/NonClinical',
 
    },
    {
      fieldId: `IA_P_IncidentDepartment`,
      translationId: 'IM_IA_IncidentDepartment',
      label: 'Incident Department',
      name: 'incidentDepartment',
  
    },
    {
      fieldId: `IA_P_LocationDetails(Roomnoetc)`,
      translationId: 'IM_IA_LocationDetails(Roomnoetc)',
      label: 'Location Details/Room No etc',
      name: 'locationDetails(Roomnoetc)',
  
    },
    {
      fieldId: `IA_P_HarmLevel`,
      translationId: 'IM_IA_HarmLevel',
      label: 'Harm Level',
      name: 'harmLevel',
  
    },
    {
      fieldId: `IA_P_Anyadditionalstaffyouwishtobenotified`,
      translationId: 'IM_IA_Anyadditionalstaffyouwishtobenotified',
      label: 'Any Additional Staff You Wish To Be Notified',
      name: 'anyAdditionalStaffYouWishToBeNotified',
  
    },
    {
      fieldId: `IA_P_ApprovedBy`,
      translationId: 'IM_IA_ApprovedBy',
      label: 'Approved By',
      name: 'approvedBy',
  
    },
    {
      fieldId: `IA_P_ApprovedDate`,
      translationId: 'IM_IA_ApprovedDate',
      label: 'Approved Date',
      name: 'approvedDate',
  
    },
    {
      fieldId: `IA_P_ApprovedTime`,
      translationId: 'IM_IA_ApprovedTime',
      label: 'Approved Time',
      name: 'approvedTime',
  
    },
    {
      fieldId: `IA_P_IncidentDepartment`,
      translationId: 'IM_IA_Department',
      label: 'Department',
      name: 'department',
  
    },
   

   
  ];

  const AssignedInvestigator = [
    {
      fieldId: `IA_AI_StaffName`,
      translationId: 'IM_IA_StaffName',
      label: 'Staff Name',
      name: 'staffName',
  
    },
    {
      fieldId: `IA_AI_Department`,
      translationId: 'IM_IA_Department',
      label: 'Department',
      name: 'department',
  
    },
    {
      fieldId: `IA_AI_Designation`,
      translationId: 'IM_IA_Designation',
      label: 'Designation',
      name: 'Designation',
  
    },
    {
      fieldId: `IA_AI_InvestigationComments`,
      translationId: 'IM_IA_InvestigationComments',
      label: 'Investigation Comments',
      name: 'Investigation Comments',
  
    },
    {
      fieldId: `IA_AI_AssignedBy`,
      translationId: 'IM_IA_AssignedBy',
      label: 'Assigned By',
      name: 'assignedBy',
  
    },
    {
      fieldId: `IA_AI_AssignedOn`,
      translationId: 'IM_IA_AssignedOn',
      label: 'Assigned On',
      name: 'assignedOn',
  
    },

  ]
  const OpinionExchanges = [
    {
      fieldId: `IA_OE_Facility`,
      translationId: 'IM_IA_Facility',
      label: 'Facility',
      name: 'Facility',
  
    },
    {
      fieldId: `IA_OE_StaffName`,
      translationId: 'IM_IA_StaffName',
      label: 'Staff Name',
      name: 'StaffName',
  
    },
    {
      fieldId: `IA_OE_Department`,
      translationId: 'IM_IA_Department',
      label: 'Department',
      name: 'Department',
  
    },
    {
      fieldId: `IA_OE_Designation`,
      translationId: 'IM_IA_Designation',
      label: 'Designation',
      name: 'Designation',
  
    },
    {
      fieldId: `IA_OE_OpinionComments`,
      translationId: 'IM_IA_OpinionComments',
      label: 'Opinion Comments',
      name: 'OpinionComments',
  
    },
  

  ]

    const { data: labelsData = [], isFetching: isLabelsFetching } = useGetLabelsQuery(
      {
        menuId: 26,
        moduleId: 2,
      }
    );
    const { data: fieldsData = [], isFetching: isFieldsFetching } = useGetFieldsQuery(
      {
        menuId: 26,
        moduleId: 2,
      }
    );

    const fields = fieldsData?.Data?.Menus?.find((item) => item.MenuId === 26) || [];
   
    const labels = (labelsData.Data || [])
    .find((item) => item.MenuId === 26) 
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === "ALL") 
        .flatMap((region) => region.Labels || [])
    );

    const filterLabels = { Data: labels};


    const filteredFieldsConfig = fieldsConfig.find((field) =>
      labels.some((label) => label.TranslationId === field.translationId)
    );
      const [configs, setConfigs] = useState({
        fieldsConfig,
        AssignedInvestigator,
        OpinionExchanges
      });
      
      useEffect(() => {
        if (fields?.length > 0) {
          const matchingSections = fields[0]?.Sections?.filter(
            (section) =>
              section.SectionName === "Accordion-Assigned Investigator(s)" ||
            section.SectionName === "Accordion-Page" ||
            section.SectionName === "Accordion-Opinion(s) Exchanged"
          );
      
          const pageFields = matchingSections?.flatMap(
            (section) => section?.Regions?.find((region) => region.RegionCode === "ALL")?.Fields || []
          );
     
      
          if (pageFields && pageFields.length > 0) {
            const updatedConfigs = Object.entries(configs).reduce(
              (acc, [key, config]) => ({
                ...acc,
                [key]: config.filter((column) => {
                  const pageField = pageFields.find((col) => col.FieldId === column.fieldId);
                  
                  return pageField && pageField.IsShow === true;
                }),
              }),
              {}
            );
            
      
            setConfigs(updatedConfigs);
          }
        }
      }, [fields[0]]);
      

    
  return (
    <FormContainer style={{ marginBottom: '20px' }}>
      <FlexContainer flexDirection={'column'}>
        {/* <SectionHeader>Incident Approval Entry</SectionHeader> */}
        <Grid container spacing={2} p={2}>
        {configs.fieldsConfig?.map((fieldConfig) => {
  return (
    <Grid item xs={4} key={fieldConfig.fieldId}>
      <FormLabel>
        {getlabel(fieldConfig?.translationId, filterLabels, i18n.language)}*
      </FormLabel>
      <StyledTypography>N/A</StyledTypography>
    </Grid>
  );
})}

</Grid>
      </FlexContainer>
    
      <FormLabel style={{ marginBottom: '10px' }}>
      {getlabel( 'IM_IA_AssignedInvestigator(s)', filterLabels, i18n.language)}*
      </FormLabel>
      <SubmittedByMeTable 
      columns = {configs.AssignedInvestigator}
      labels = {filterLabels}
      />
      <FormLabel style={{ marginBottom: '10px' }}>
      {getlabel( 'IM_IA_Opinion(s)Exchanged', filterLabels, i18n.language)}*
      </FormLabel>
      <SubmittedByMeTable 
      columns = {configs.OpinionExchanges}
      labels = {filterLabels}
      colour = "#e6a81c"
      />


    </FormContainer>
  );
};

export default IncidentApprovalDetails;
