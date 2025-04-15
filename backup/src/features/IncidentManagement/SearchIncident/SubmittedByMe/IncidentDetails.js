import { Box, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import {
  FlexContainer,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import {
  FormContainer,
  FormLabel,
  StyledGridContainer,
  StyledGridItem,
} from '../searchIncident.styled';
import SubmittedByMeTable from './Datatable/SubmittedByMeTable';
import VisitorTable from './Datatable/VisitorTable';
import WitnessTable from './Datatable/WitnessTable';
import AttachmentTable from './Datatable/AttachmentTable';
import { useTranslation } from 'react-i18next';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../../utils/language'; 

const IncidentDetails = () => {

  const { i18n, t } = useTranslation();

  const fieldsConfig = [
    {
      fieldId: `RI_P_FacilityName`,
      translationId: 'IM_RI_FacilityName',
      label: 'Facility Name',
      name: 'facilityName',
    },
    {
      fieldId: `RI_P_IncidentNumber`,
      translationId: 'IM_RI_IncidentNumber',
      label: 'Incident Number',
      name: 'incidentNumber',
    },
    {
      fieldId: `RI_P_BeAnonymous`,
      translationId: 'IM_RI_BeAnonymous',
      label: 'Be Anonymous',
      name: 'beAnonymous',
    },
    {
      fieldId: `RI_P_IncidentDate`,
      translationId: 'IM_RI_IncidentDate',
      label: 'Incident Date',
      name: 'incidentDate',
  
    },
    {
      fieldId: `RI_P_Day`,
      translationId: 'IM_RI_Day',
      label: 'Incident Day',
      name: 'incidentDay',
   
    },
    {
      fieldId: `RI_P_Time`,
      translationId: 'IM_RI_Time',
      label: 'Incident Type',
      name: 'incidentType',
 
    },
    {
      fieldId: `RI_P_ReportedDate`,
      translationId: 'IM_RI_ReportedDate',
      label: 'Reported Date',
      name: 'reportedDate',
 
    },
    {
      fieldId: `RI_P_ReportedDay`,
      translationId: 'IM_RI_ReportedDay',
      label: 'Reported Date',
      name: 'reportedDay',
  
    },
    {
      fieldId: `RI_P_ReportedTime`,
      translationId: 'IM_RI_ReportedTime',
      label: 'Reported Time',
      name: 'reportedTime',
  
    },
    {
      fieldId: `RI_P_IncidentType`,
      translationId: 'IM_RI_IncidentType',
      label: 'Incident Type',
      name: 'incidentType',
  
    },
  
    {
      fieldId: `RI_P_Clinical/NonClinical`,
      translationId: 'IM_RI_Clinical/NonClinical',
      label: 'Clinical/Non Clinical',
      name: 'clinical/NonClinical',
  
    },

   
  ];

  const incidentConfig = [
    {
      fieldId: `RI_P_IncidentMainCategory`,
      translationId: 'IM_RI_IncidentMainCategory',
      label: 'Incident Main Category',
      name: 'incidentMainCategory',
    },
    {
      fieldId: `RI_P_IncidentSubCategory`,
      translationId: 'IM_RI_IncidentSubCategory',
      label: 'Incident Sub Category',
      name: 'incidentSubCategory',
    },
    {
      fieldId: `RI_P_IncidentDetail`,
      translationId: 'IM_RI_IncidentDetail',
      label: 'Incident Detail',
      name: 'incidentDetail',
    },
    {
      fieldId: `RI_P_Remarks`,
      translationId: 'IM_RI_Remarks',
      label: 'Remarks',
      name: 'remarks',
    },
    {
      fieldId: `RI_P_BriefDescriptionofIncident`,
      translationId: 'IM_RI_BriefDescriptionofIncident',
      label: 'Brief Description of Incident',
      name: 'briefDescriptionofIncident',
    },
    {
      fieldId: `RI_P_IncidentDepartment`,
      translationId: 'IM_RI_IncidentDepartment',
      label: 'Incident Department',
      name: 'incidentDepartment',
    },
    {
      fieldId: `RI_P_LocationDetails(Roomnoetc)`,
      translationId: 'IM_RI_LocationDetails(Roomnoetc)',
      label: 'Location Details(Room no etc)',
      name: 'locationDetails(Room no etc)',
    },
  ]

  const immediateActionTakenConfig = [
    {
      fieldId: `RI_IAT_ImmediateActionTaken`,
      translationId: 'IM_RI_ImmediateActionTaken',
      label: 'Immediate Action Taken',
      name: 'immediateActionTaken',
  
    },
    {
      fieldId: `RI_IAT_ResponsibleStaff`,
      translationId: 'IM_RI_ResponsibleStaff',
      label: 'Responsible Staff',
      name: 'responsibleStaff',
  
    },
    {
      fieldId: `RI_IAT_Department`,
      translationId: 'IM_RI_Department',
      label: 'Department',
      name: 'department',
  
    },
    {
      fieldId: `RI_IAT_Designation`,
      translationId: 'IM_RI_Designation',
      label: 'Designation',
      name: 'designation',
  
    },
  

  ]
  const visitorConfig = [
    {
      fieldId: `RI_V_VisitorName`,
      translationId: 'IM_RI_VisitorName',
      label: 'Immediate Action Taken',
      name: 'immediateActionTaken',
  
    },
    {
      fieldId: `RI_V_VisitorAge`,
      translationId: 'IM_RI_VisitorAge',
      label: 'Responsible Staff',
      name: 'responsibleStaff',
  
    },
    {
      fieldId: `RI_V_VisitorGender`,
      translationId: 'IM_RI_VisitorGender',
      label: 'Designation',
      name: 'designation',
  
    },
    {
      fieldId: `RI_V_Department`,
      translationId: 'IM_RI_Department',
      label: 'Department',
      name: 'department',
  
    },
    {
      fieldId: `RI_V_ReasonForVisit`,
      translationId: 'IM_RI_ReasonForVisit',
      label: 'Reason For Visit',
      name: 'reasonForVisit',
  
    },

  ]
  const witnessConfig = [
    {
      fieldId: `RI_WB_StaffName`,
      translationId: 'IM_RI_StaffName',
      label: 'Staff Name',
      name: 'staffName',
  
    },
    {
      fieldId: `RI_WB_Department`,
      translationId: 'IM_RI_Department',
      label: 'Department',
      name: 'department',
  
    },
    {
      fieldId: `RI_WB_Designation`,
      translationId: 'IM_RI_Designation',
      label: 'Designation',
      name: 'designation',
  
    },
   
    

  ]
  const attachmentConfig = [
    {
      fieldId: `RI_P_Attachment`,
      translationId: 'IM_RI_Attachment(s)',
      label: 'Attachment(s)',
      name: 'attachment(s)',
  
    },  

  ]
  const additionalConfig = [
    {
      fieldId: `RI_P_HarmLevel`,
      translationId: 'IM_RI_HarmLevel',
      label: 'Harm Level',
      name: 'harmLevel',
  
    },  
    {
      fieldId: `RI_P_Anyadditionalstaffyouwishtobenotified`,
      translationId: 'IM_RI_Anyadditionalstaffyouwishtobenotified',
      label: 'anyadditionalstaffyouwishtobenotified',
      name: 'anyAdditionalstaffyouwishtobenotified',
  
    },  

  ]
  const titleConfig = [
    {
      fieldId: `RI_P_IncidentTitle`,
      translationId: 'IM_RI_IncidentTitle',
      label: 'Incident Title',
      name: 'incidentTitle',
  
    },  
    {
      fieldId: `RI_P_PersonInvolvedintheIncident`,
      translationId: 'IM_RI_PersonInvolvedintheIncident',
      label: 'Person Involved in the Incident',
      name: 'personInvolvedintheIncident',
  
    },  
    {
      fieldId: `RI_PIitI_Visitor`,
      translationId: 'IM_RI_Visitor',
      label: 'Visitor',
      name: 'visitor',
  
    },  
    {
      fieldId: `RI_P_WitnessedBy`,
      translationId: 'IM_RI_WitnessedBy',
      label: 'Witnessed By',
      name: 'witnessedBy',
  
    },  
    {
      translationId: 'IM_RI_Staff',
      label: 'Staff',
      name: 'Staff',
  
    },  
    {
      translationId: 'IM_RI_Patient',
      label: 'Patient',
      name: 'Patient',
  
    },  
    {
      translationId: 'IM_RI_Attachment(s)',
      label: 'Attachment(s)',
      name: 'Attachment(s)',
  
    },  
    {
      translationId: 'IM_RI_Companion',
      label: 'Companion',
      name: 'Companion',
  
    },  
    {
      translationId: 'IM_RI_OutsourcedStaff',
      label: 'Outsourced Staff',
      name: 'OutsourcedStaff',
  
    },   

    {
      fieldId: `RI_P_ImmediateActionTaken`,
      translationId: 'IM_RI_ImmediateActionTaken',
      label: 'Immediate Action Taken',
      name: 'immediateActionTaken',
  
    },  

  ]
  const patientConfig = [
    {
      fieldId: `RI_P_PatientId`,
      translationId: 'IM_RI_PatientId',
      label: 'Patient Id',
      name: 'PatientId',
  
    },
    {
      fieldId: `RI_P_PatientName`,
      translationId: 'IM_RI_PatientName',
      label: 'Patient Name',
      name: 'PatientName',
  
    },
    {
      fieldId: `RI_P_PatientAge`,
      translationId: 'IM_RI_PatientAge',
      label: 'Patient Age',
      name: 'PatientAge',
  
    },
    {
      fieldId: `RI_P_PatientGender`,
      translationId: 'IM_RI_Designation',
      label: 'Patient Gender',
      name: 'PatientGender',
  
    },
    {
      fieldId: `RI_P_Department`,
      translationId: 'IM_RI_Department',
      label: 'Department',
      name: 'Department',
  
    },
    {
      fieldId: `RI_P_PatientRoomNo/Details`,
      translationId: 'IM_RI_PatientRoomNo/Details',
      label: 'Patient Room No / Details',
      name: 'PatientRoomNo/Details',
  
    },
    {
      fieldId: `RI_P_PhysicianName`,
      translationId: 'IM_RI_PhysicianName',
      label: 'Physician Name',
      name: 'PhysicianName',
  
    },
    {
      fieldId: `RI_P_PhysicianDepartment`,
      translationId: 'IM_RI_PhysicianDepartment',
      label: 'PhysicianDepartment',
      name: 'PhysicianDepartment',
  
    },
    {
      fieldId: `RI_P_Diagnosis`,
      translationId: 'IM_RI_Diagnosis',
      label: 'Diagnosis',
      name: 'Diagnosis',
  
    },
    {
      fieldId: `RI_P_VisitId`,
      translationId: 'IM_RI_StaffCategory',
      label: 'Diagnosis',
      name: 'Diagnosis',
  
    },
    {
      fieldId: `RI_P_PhysicianNotified`,
      translationId: 'IM_RI_PhysicianNotified',
      label: 'Physician Notified',
      name: 'PhysicianNotified',
  
    },
    {
      fieldId: `RI_P_NotifiedPhysician`,
      translationId: 'IM_RI_NotifiedPhysician',
      label: 'Notified Physician',
      name: 'NotifiedPhysician',
  
    },
    {
      fieldId: `RI_P_NotifiedPhysicianDepartment`,
      translationId: 'IM_RI_NotifiedPhysicianDepartment',
      label: 'Notified Physician Department',
      name: 'NotifiedPhysicianDepartment',
  
    },

  ]
  const companionConfig = [
    {
      fieldId: `RI_C_PatientId`,
      translationId: 'IM_RI_PatientId',
      label: 'Patient Id',
      name: 'PatientId',
  
    },
    {
      fieldId: `RI_C_PatientName`,
      translationId: 'IM_RI_PatientName',
      label: 'Patient Name',
      name: 'PatientName',
  
    },
    {
      fieldId: `RI_P_Department`,
      translationId: 'IM_RI_Department',
      label: 'Department',
      name: 'Department',
  
    },
    {
      fieldId: `RI_C_PatientRoomNo/Details`,
      translationId: 'IM_RI_PatientRoomNo/Details',
      label: 'Patient RoomNo / Details',
      name: 'PatientRoomNo/Details',
  
    },
    {
      fieldId: `RI_C_CompanionName`,
      translationId: 'IM_RI_CompanionName',
      label: 'Companion Name',
      name: 'CompanionName',
  
    },
    {
      fieldId: `RI_C_CompanionAge`,
      translationId: 'IM_RI_CompanionAge',
      label: 'Companion Age',
      name: 'CompanionAge',
  
    },
    {
      fieldId: `RI_C_CompanionGender`,
      translationId: 'IM_RI_CompanionGender',
      label: 'Companion Gender',
      name: 'CompanionGender',
  
    },
    {
      fieldId: `RI_C_Relationship`,
      translationId: 'IM_RI_Relationship',
      label: 'Relationship',
      name: 'Relationship',
  
    },

  ]

  const outSourcedConfig = [
    {
      fieldId: `RI_OS_OutsourcedStaffId`,
      translationId: 'IM_RI_OutsourcedStaffId',
      label: 'Outsourced Staff Id',
      name: 'OutsourcedStaffId',
  
    },
    {
      fieldId: `RI_OS_OutsourcedStaffName`,
      translationId: 'IM_RI_OutsourcedStaffName',
      label: 'Outsourced Staff Name',
      name: 'OutsourcedStaffName',
  
    },
    {
      fieldId: `RI_OS_OutsourcedStaffAge`,
      translationId: 'IM_RI_OutsourcedStaffAge',
      label: 'Outsourced Staff Age',
      name: 'OutsourcedStaffAge',
  
    },
    {
      fieldId: `RI_OS_OutsourcedStaffGender`,
      translationId: 'IM_RI_OutsourcedStaffGender',
      label: 'Outsourced Staff Gender',
      name: 'OutsourcedStaffGender',
  
    },
    {
      fieldId: `RI_OS_Department`,
      translationId: 'IM_RI_Department',
      label: 'Department',
      name: 'Department',
  
    },
    {
      fieldId: `RI_OS_CompanyName`,
      translationId: 'IM_RI_CompanyName',
      label: 'Company Name',
      name: 'CompanyName',
  
    },
  ]
  const staffConfig = [
    {
      fieldId: `RI_S_EmployeeId`,
      translationId: 'IM_RI_EmployeeId',
      label: 'Immediate Action Taken',
      name: 'immediateActionTaken',
  
    },
    {
      fieldId: `RI_S_StaffName`,
      translationId: 'IM_RI_StaffName',
      label: 'Responsible Staff',
      name: 'responsibleStaff',
  
    },
    {
      fieldId: `RI_S_Department`,
      translationId: 'IM_RI_Department',
      label: 'Department',
      name: 'department',
  
    },
    {
      fieldId: `RI_S_Designation`,
      translationId: 'IM_RI_Designation',
      label: 'Designation',
      name: 'designation',
  
    },
    {
      fieldId: `RI_S_StaffCategory`,
      translationId: 'IM_RI_StaffCategory',
      label: 'Staff Category',
      name: 'StaffCategory',
  
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

  const fields = fieldsData?.Data?.Menus?.find((item) => item.MenuId === 24) || [];

  
  const labels = (labelsData.Data || [])
  .find((item) => item.MenuId === 24) 
  .flatMap((item) =>
    (item.Regions || [])
      .find((region) => region.RegionCode === "ALL") 
      .flatMap((region) => region.Labels || [])
  );
  const filterLabels = { Data: labels};

  const filteredFieldsConfig = fieldsConfig.find((field) =>
    labels.some((label) => label.TranslationId === field.translationId)
  );
  const filteredIncidentConfig = incidentConfig.find((field) =>
    labels.some((label) => label.TranslationId === field.translationId)
  );
  const filteredAdditionalConfig = additionalConfig.find((field) =>
    labels.some((label) => label.TranslationId === field.translationId)
  );

  const [configs, setConfigs] = useState({
    staffConfig,
    outSourcedConfig,
    companionConfig,
    patientConfig,
    titleConfig,
    additionalConfig,
    attachmentConfig,
    witnessConfig,
    visitorConfig,
    immediateActionTakenConfig,
    incidentConfig,
    fieldsConfig,
    attachmentConfig,
  });
  
  useEffect(() => {
    if (fields?.length > 0) {
      const matchingSections = fields[0]?.Sections?.filter(
        (section) =>
          section.SectionName === "Accordion-Immediate Action Taken" ||
        section.SectionName === "Accordion-Page" ||
          section.SectionName === "Accordion-Witnessed By" ||
          section.SectionName === "Accordion-Visitor" ||
          section.SectionName === "Accordion-Staff" ||
          section.SectionName === "Accordion-Outsourced Staff" ||
          section.SectionName === "Accordion-Companion" ||
          section.SectionName === "Accordion-Patient"
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
    <FormContainer>
      <FlexContainer flexDirection={'column'}>

      <StyledGridContainer>
  {configs?.fieldsConfig?.map((fieldConfig) => {
            return(
      <StyledGridItem item xs={4} key={fieldConfig.fieldId}>
        <FormLabel>
          {getlabel(fieldConfig?.translationId, filterLabels, i18n.language)}*
        </FormLabel>
        <StyledTypography>N/A</StyledTypography>
      </StyledGridItem>
            );
  })}
</StyledGridContainer>



        {/* Incident Title */}
        <Box
          style={{
            fontWeight: '600',
            fontSize: '16px',
            lineHeight: '19.2px',
            color: '#F47721',
            margin:'0 0 0 25px'
          }}
        >
         {getlabel(titleConfig.find((config) => config.name === 'incidentTitle')?.translationId, filterLabels, i18n.language)}*

        </Box>
              <StyledGridContainer>
        {configs?.incidentConfig?.map((fieldConfig) => {
          return( 
          <StyledGridItem item xs={4} key={fieldConfig.fieldId}>
              <FormLabel>
                {getlabel(fieldConfig?.translationId, filterLabels, i18n.language)}*
              </FormLabel>
              <StyledTypography>N/A</StyledTypography>
            </StyledGridItem>
            );
        })}
      </StyledGridContainer>

        <FormLabel style={{ marginBottom: '10px' }}>
        
        {getlabel(titleConfig.find((config) => config.name === 'immediateActionTaken')?.translationId, filterLabels, i18n.language)}*
        </FormLabel>
        <SubmittedByMeTable 
         columns = {configs.immediateActionTakenConfig}
         labels = {filterLabels}
        />
        <Box
          style={{
            fontWeight: '600',
            fontSize: '16px',
            lineHeight: '19.2px',
            color: '#F47721',
            margin: '10px 0px 10px 0px',
          }}
        >
         {getlabel(titleConfig.find((config) => config.name === 'personInvolvedintheIncident')?.translationId, filterLabels, i18n.language)}
          
        </Box>
        <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
        {getlabel(titleConfig.find((config) => config.name === 'Staff')?.translationId, filterLabels, i18n.language)}:
        </FormLabel>
        <SubmittedByMeTable 
         columns = {configs.staffConfig}
         labels = {filterLabels}

        />
        <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
        {getlabel(titleConfig.find((config) => config.name === 'Patient')?.translationId, filterLabels, i18n.language)}:
        </FormLabel>
        <SubmittedByMeTable 
         columns = {configs.patientConfig}
         labels = {filterLabels}

        />
        <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
        {getlabel(titleConfig.find((config) => config.name === 'Companion')?.translationId, filterLabels, i18n.language)}:
        </FormLabel>
        <SubmittedByMeTable 
         columns = {configs.companionConfig}
         labels = {filterLabels}

        />
        <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
        {getlabel(titleConfig.find((config) => config.name === 'visitor')?.translationId, filterLabels, i18n.language)}:
        </FormLabel>
        <VisitorTable 
         columns = {configs.visitorConfig}
         labels = {filterLabels}
        />
        <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
        {getlabel(titleConfig.find((config) => config.name === 'OutsourcedStaff')?.translationId, filterLabels, i18n.language)}:
        </FormLabel>
        <SubmittedByMeTable 
         columns = {configs.outSourcedConfig}
         labels = {filterLabels}

        />

        <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
        {getlabel(titleConfig.find((config) => config.name === 'witnessedBy')?.translationId, filterLabels, i18n.language)}:
        </FormLabel>
        <WitnessTable
          columns = {configs.witnessConfig}
          labels = {filterLabels}
        />

        <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
          {getlabel(titleConfig.find((config) => config.name === 'Attachment(s)')?.translationId, filterLabels, i18n.language)}:

        </FormLabel>
        <AttachmentTable 
        columns = {attachmentConfig}
        labels = {filterLabels}
        />
       <StyledGridContainer>

              {configs.additionalConfig?.map((fieldConfig) => {
              return (
          <StyledGridItem item xs={4} key={fieldConfig.fieldId}>
              <FormLabel>
                {getlabel(fieldConfig?.translationId, filterLabels, i18n.language)}*
              </FormLabel>
       <StyledTypography>N/A</StyledTypography>
              </StyledGridItem>
              );
              })}
   </StyledGridContainer>
      </FlexContainer>
    </FormContainer>
  );
};

export default IncidentDetails;
