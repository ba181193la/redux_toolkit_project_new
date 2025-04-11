import {
    Modal,
    Backdrop,
    Box,
    Typography,
    IconButton,
    Tooltip,
    Grid,
    Accordion,
    AccordionSummary,
    AccordionDetails
  } from '@mui/material';
  import React, { useState, useEffect } from 'react';
  import {
    FlexContainer,
    StyledImage,
    StyledTypography,
  } from '../../../../utils/StyledComponents';
  
  
  import {
    FormContainer,
    FormLabel,
    StyledGridContainer,
    StyledGridItem,
  } from '../../IncidentCommon/IncidentInvestigation.styled';
  import ApproveIncidentTable from '../../IncidentCommon/Datatable/ApproveIncidentTable';
  import VisitorTable from '../../IncidentCommon/Datatable/II_PL_VisitorTable';
  import WitnessTable from '../../IncidentCommon/Datatable/II_PL_WitnessTable';
  import AttachmentTable from '../../IncidentCommon/Datatable/II_PL_AttachmentTable';
  import { useTranslation } from 'react-i18next';
  import {
    useGetFieldsQuery,
    useGetLabelsQuery,
  } from '../../../../redux/RTK/moduleDataApi';
  
  import { getlabel } from '../../../../utils/language';
  import { useGetIncidentDetailsPendingByIdQuery, useGetDefinitionQuery } from '../../../../redux/RTK/incidentInvestigationApi';
  import { useNavigate, useParams } from 'react-router-dom';
  import { useSelector } from 'react-redux';
  import InfoIcon from '@mui/icons-material/Info';
  import CloseIcon from '@mui/icons-material/Close';
  import formatDate from '../../../../utils/FormatDate';
  import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import CustomFormDisplay from '../../IncidentCommon/CustomFormDisplay';
  
  
  // const IncidentDetails = () => {
  //   const { i18n, t } = useTranslation();
  //   const navigate = useNavigate();
  //   const { id } = useParams();
  
  //   const {
  //     selectedMenu,
  //     userDetails,
  //     selectedFacility,
  //     selectedModuleId,
  //     roleFacilities,
  //     isSuperAdmin,
  //   } = useSelector((state) => state.auth);
  
  //   const [isClinicalModalOpen, setClinicalModalOpen] = useState(false);
  //   const [isIncidentModalOpen, setIncidentModalOpen] = useState(false);
  
  //   const openClinicalModal = () => setClinicalModalOpen(true);
  //   const closeClinicalModal = () => setClinicalModalOpen(false);
  
  //   const [isModalOpen, setIsModalOpen] = useState(false);
  //   const openIncidentModal = () => setIncidentModalOpen(true);
  //   const closeIncidentModal = () => setIncidentModalOpen(false);
  //   const handleModalOpen = () => {
  //     setIsModalOpen(true);
  //   };
  
  //   const handleModalClose = () => {
  //     setIsModalOpen(false);
  //   };
  
  //   const { data: definitionData } =
  //   useGetDefinitionQuery(
  //       {
  //         menuId: selectedMenu?.id,
  //         loginUserId: userDetails?.UserId,
  //         incidentId: id,
  //          moduleId: selectedModuleId,
  
  //       },
  //       { skip: !id }
  //     );
  
  //     const { incidentTypeDefinition, clinicalDefinition } =
  //     definitionData?.Data || {};
  
  
  //   const { data: incidentData, isFetching: isFetchingData } =
  //     useGetIncidentDetailsPendingByIdQuery(
  //       {
  //         menuId: selectedMenu?.id,
  //         loginUserId: userDetails?.UserId,
  //         incidentId: id,
  //          moduleId: 2
  //       },
  //       { skip: !id }
  //     );      
  //   const { reportIncident, incidentStaffInvolved, incidentPatientInvolved } =
  //     incidentData?.Data || {};
  
  //   const reportIncidentSafe = reportIncident || {};
  //   const incidentStaffInvolvedsafe = incidentStaffInvolved || [];
  //   const incidentPatientInvolvedSafe = incidentPatientInvolved || [];
  
  //   const fieldsConfig = [
  //     {
  //       fieldId: `RI_P_FacilityName`,
  //       translationId: 'IM_RI_FacilityName',
  //       label: 'Facility Name',
  //       name: 'FacilityName',
  //     },
  //     {
  //       fieldId: `RI_P_IncidentNumber`,
  //       translationId: 'IM_RI_IncidentNumber',
  //       label: 'Incident Number',
  //       name: 'IncidentNo',
  //     },
  //     {
  //       fieldId: `RI_P_BeAnonymous`,
  //       translationId: 'IM_RI_BeAnonymous',
  //       label: 'Be Anonymous',
  //       name: 'Anonymous',
  //     },
  //     {
  //       fieldId: `RI_P_IncidentDate`,
  //       translationId: 'IM_RI_IncidentDate',
  //       label: 'Incident Date',
  //       name: 'IncidentDate',
  //     },
  //     {
  //       fieldId: `RI_P_Day`,
  //       translationId: 'IM_RI_Day',
  //       label: 'Incident Day',
  //       name: 'IncidentDay',
  //     },
  //     {
  //       fieldId: `RI_P_Time`,
  //       translationId: 'IM_RI_Time',
  //       label: 'Incident Type',
  //       name: 'IncidentTime',
  //     },
  //     {
  //       fieldId: `RI_P_ReportedDate`,
  //       translationId: 'IM_RI_ReportedDate',
  //       label: 'Reported Date',
  //       name: 'ReportDate',
  //     },
  //     {
  //       fieldId: `RI_P_ReportedDay`,
  //       translationId: 'IM_RI_ReportedDay',
  //       label: 'Reported Date',
  //       name: 'ReportDay',
  //     },
  //     {
  //       fieldId: `RI_P_ReportedTime`,
  //       translationId: 'IM_RI_ReportedTime',
  //       label: 'Reported Time',
  //       name: 'ReportTime',
  //     },
  //     {
  //       fieldId: `RI_P_IncidentType`,
  //       translationId: 'IM_RI_IncidentType',
  //       label: 'Incident Type',
  //       name: 'IncidentTypeName',
  //     },
  
  //     {
  //       fieldId: `RI_P_Clinical/NonClinical`,
  //       translationId: 'IM_RI_Clinical/NonClinical',
  //       label: 'Clinical/Non Clinical',
  //       name: 'ClinicalType',
  //     },
  //   ];
  
  //   const incidentConfig = [
  //     {
  //       fieldId: `RI_P_IncidentMainCategory`,
  //       translationId: 'IM_RI_IncidentMainCategory',
  //       label: 'Incident Main Category',
  //       name: 'MainCategory',
  //     },
  //     {
  //       fieldId: `RI_P_IncidentSubCategory`,
  //       translationId: 'IM_RI_IncidentSubCategory',
  //       label: 'Incident Sub Category',
  //       name: 'SubCategory',
  //     },
  //     {
  //       fieldId: `RI_P_IncidentDetail`,
  //       translationId: 'IM_RI_IncidentDetail',
  //       label: 'Incident Detail',
  //       name: 'IncidentDetail',
  //     },
  //     {
  //       fieldId: `RI_P_Remarks`,
  //       translationId: 'IM_RI_Remarks',
  //       label: 'Remarks',
  //       name: 'Remarks',
  //     },
  //     {
  //       fieldId: `RI_P_BriefDescriptionofIncident`,
  //       translationId: 'IM_RI_BriefDescriptionofIncident',
  //       label: 'Brief Description of Incident',
  //       name: 'BriefDescriptionOfIncident',
  //     },
  //     {
  //       fieldId: `RI_P_IncidentDepartment`,
  //       translationId: 'IM_RI_IncidentDepartment',
  //       label: 'Incident Department',
  //       name: 'DepartmentName',
  //     },
  //     {
  //       fieldId: `RI_P_LocationDetails(Roomnoetc)`,
  //       translationId: 'IM_RI_LocationDetails(Roomnoetc)',
  //       label: 'Location Details(Room no etc)',
  //       name: 'LocationDetails',
  //     },
  //   ];
  
  //   const immediateActionTakenConfig = [
  //     {
  //       fieldId: `RI_IAT_ImmediateActionTaken`,
  //       translationId: 'IM_RI_ImmediateActionTaken',
  //       label: 'Immediate Action Taken',
  //       name: 'immediateActionTaken',
  //     },
  //     {
  //       fieldId: `RI_IAT_ResponsibleStaff`,
  //       translationId: 'IM_RI_ResponsibleStaff',
  //       label: 'Responsible Staff',
  //       name: 'responsibleStaff',
  //     },
  //     {
  //       fieldId: `RI_IAT_Department`,
  //       translationId: 'IM_RI_Department',
  //       label: 'Department',
  //       name: 'department',
  //     },
  //     {
  //       fieldId: `RI_IAT_Designation`,
  //       translationId: 'IM_RI_Designation',
  //       label: 'Designation',
  //       name: 'designation',
  //     },
  //   ];
  //   const visitorConfig = [
  //     {
  //       fieldId: `RI_V_VisitorName`,
  //       translationId: 'IM_RI_VisitorName',
  //       label: 'Immediate Action Taken',
  //       name: 'immediateActionTaken',
  //     },
  //     {
  //       fieldId: `RI_V_VisitorAge`,
  //       translationId: 'IM_RI_VisitorAge',
  //       label: 'Responsible Staff',
  //       name: 'responsibleStaff',
  //     },
  //     {
  //       fieldId: `RI_V_VisitorGender`,
  //       translationId: 'IM_RI_VisitorGender',
  //       label: 'Designation',
  //       name: 'designation',
  //     },
  //     {
  //       fieldId: `RI_V_Department`,
  //       translationId: 'IM_RI_Department',
  //       label: 'Department',
  //       name: 'department',
  //     },
  //     {
  //       fieldId: `RI_V_ReasonForVisit`,
  //       translationId: 'IM_RI_ReasonForVisit',
  //       label: 'Reason For Visit',
  //       name: 'reasonForVisit',
  //     },
  //   ];
  //   const witnessConfig = [
  //     {
  //       fieldId: `RI_WB_StaffName`,
  //       translationId: 'IM_RI_StaffName',
  //       label: 'Staff Name',
  //       name: 'staffName',
  //     },
  //     {
  //       fieldId: `RI_WB_Department`,
  //       translationId: 'IM_RI_Department',
  //       label: 'Department',
  //       name: 'department',
  //     },
  //     {
  //       fieldId: `RI_WB_Designation`,
  //       translationId: 'IM_RI_Designation',
  //       label: 'Designation',
  //       name: 'designation',
  //     },
  //   ];
  //   const attachmentConfig = [
  //     {
  //       fieldId: `RI_P_Attachment`,
  //       translationId: 'IM_RI_Attachment(s)',
  //       label: 'Attachment(s)',
  //       name: 'attachment(s)',
  //     },
  //   ];
  //   const additionalConfig = [
  //     {
  //       fieldId: `RI_P_HarmLevel`,
  //       translationId: 'IM_RI_HarmLevel',
  //       label: 'Harm Level',
  //       name: 'harmLevel',
  //     },
  //     {
  //       fieldId: `RI_P_Anyadditionalstaffyouwishtobenotified`,
  //       translationId: 'IM_RI_Anyadditionalstaffyouwishtobenotified',
  //       label: 'anyadditionalstaffyouwishtobenotified',
  //       name: 'anyAdditionalstaffyouwishtobenotified',
  //     },
  //   ];
  //   const titleConfig = [
  //     {
  //       fieldId: `RI_P_IncidentTitle`,
  //       translationId: 'IM_RI_IncidentTitle',
  //       label: 'Incident Title',
  //       name: 'incidentTitle',
  //     },
  //     {
  //       fieldId: `RI_P_PersonInvolvedintheIncident`,
  //       translationId: 'IM_RI_PersonInvolvedintheIncident',
  //       label: 'Person Involved in the Incident',
  //       name: 'personInvolvedintheIncident',
  //     },
  //     {
  //       fieldId: `RI_PIitI_Visitor`,
  //       translationId: 'IM_RI_Visitor',
  //       label: 'Visitor',
  //       name: 'visitor',
  //     },
  //     {
  //       fieldId: `RI_P_WitnessedBy`,
  //       translationId: 'IM_RI_WitnessedBy',
  //       label: 'Witnessed By',
  //       name: 'witnessedBy',
  //     },
  //     {
  //       translationId: 'IM_RI_Staff',
  //       label: 'Staff',
  //       name: 'Staff',
  //     },
  //     {
  //       translationId: 'IM_RI_Patient',
  //       label: 'Patient',
  //       name: 'Patient',
  //     },
  //     {
  //       translationId: 'IM_RI_Attachment(s)',
  //       label: 'Attachment(s)',
  //       name: 'Attachment(s)',
  //     },
  //     {
  //       translationId: 'IM_RI_Companion',
  //       label: 'Companion',
  //       name: 'Companion',
  //     },
  //     {
  //       translationId: 'IM_RI_OutsourcedStaff',
  //       label: 'Outsourced Staff',
  //       name: 'OutsourcedStaff',
  //     },
  
  //     {
  //       fieldId: `RI_P_ImmediateActionTaken`,
  //       translationId: 'IM_RI_ImmediateActionTaken',
  //       label: 'Immediate Action Taken',
  //       name: 'immediateActionTaken',
  //     },
  //   ];
  //   const patientConfig = [
  //     {
  //       fieldId: `RI_P_PatientId`,
  //       translationId: 'IM_RI_PatientId',
  //       label: 'Patient Id',
  //       name: 'PatientId',
  //     },
  //     {
  //       fieldId: `RI_P_PatientName`,
  //       translationId: 'IM_RI_PatientName',
  //       label: 'Patient Name',
  //       name: 'PatientName',
  //     },
  //     {
  //       fieldId: `RI_P_PatientAge`,
  //       translationId: 'IM_RI_PatientAge',
  //       label: 'Patient Age',
  //       name: 'PatientAge',
  //     },
  //     {
  //       fieldId: `RI_P_PatientGender`,
  //       translationId: 'IM_RI_Designation',
  //       label: 'Patient Gender',
  //       name: 'PatientGender',
  //     },
  //     {
  //       fieldId: `RI_P_Department`,
  //       translationId: 'IM_RI_Department',
  //       label: 'Department',
  //       name: 'Department',
  //     },
  //     {
  //       fieldId: `RI_P_PatientRoomNo/Details`,
  //       translationId: 'IM_RI_PatientRoomNo/Details',
  //       label: 'Patient Room No / Details',
  //       name: 'PatientRoomNo/Details',
  //     },
  //     {
  //       fieldId: `RI_P_PhysicianName`,
  //       translationId: 'IM_RI_PhysicianName',
  //       label: 'Physician Name',
  //       name: 'PhysicianName',
  //     },
  //     {
  //       fieldId: `RI_P_PhysicianDepartment`,
  //       translationId: 'IM_RI_PhysicianDepartment',
  //       label: 'PhysicianDepartment',
  //       name: 'PhysicianDepartment',
  //     },
  //     {
  //       fieldId: `RI_P_Diagnosis`,
  //       translationId: 'IM_RI_Diagnosis',
  //       label: 'Diagnosis',
  //       name: 'Diagnosis',
  //     },
  //     {
  //       fieldId: `RI_P_VisitId`,
  //       translationId: 'IM_RI_StaffCategory',
  //       label: 'Staff Category',
  //       name: 'StaffCategory',
  //     },
  //     {
  //       fieldId: `RI_P_PhysicianNotified`,
  //       translationId: 'IM_RI_PhysicianNotified',
  //       label: 'Physician Notified',
  //       name: 'PhysicianNotified',
  //     },
  //     {
  //       fieldId: `RI_P_NotifiedPhysician`,
  //       translationId: 'IM_RI_NotifiedPhysician',
  //       label: 'Notified Physician',
  //       name: 'NotifiedPhysician',
  //     },
  //     {
  //       fieldId: `RI_P_NotifiedPhysicianDepartment`,
  //       translationId: 'IM_RI_NotifiedPhysicianDepartment',
  //       label: 'Notified Physician Department',
  //       name: 'NotifiedPhysicianDepartment',
  //     },
  //   ];
  //   const companionConfig = [
  //     {
  //       fieldId: `RI_C_PatientId`,
  //       translationId: 'IM_RI_PatientId',
  //       label: 'Patient Id',
  //       name: 'PatientId',
  //     },
  //     {
  //       fieldId: `RI_C_PatientName`,
  //       translationId: 'IM_RI_PatientName',
  //       label: 'Patient Name',
  //       name: 'PatientName',
  //     },
  //     {
  //       fieldId: `RI_P_Department`,
  //       translationId: 'IM_RI_Department',
  //       label: 'Department',
  //       name: 'Department',
  //     },
  //     {
  //       fieldId: `RI_C_PatientRoomNo/Details`,
  //       translationId: 'IM_RI_PatientRoomNo/Details',
  //       label: 'Patient RoomNo / Details',
  //       name: 'PatientRoomNo/Details',
  //     },
  //     {
  //       fieldId: `RI_C_CompanionName`,
  //       translationId: 'IM_RI_CompanionName',
  //       label: 'Companion Name',
  //       name: 'CompanionName',
  //     },
  //     {
  //       fieldId: `RI_C_CompanionAge`,
  //       translationId: 'IM_RI_CompanionAge',
  //       label: 'Companion Age',
  //       name: 'CompanionAge',
  //     },
  //     {
  //       fieldId: `RI_C_CompanionGender`,
  //       translationId: 'IM_RI_CompanionGender',
  //       label: 'Companion Gender',
  //       name: 'CompanionGender',
  //     },
  //     {
  //       fieldId: `RI_C_Relationship`,
  //       translationId: 'IM_RI_Relationship',
  //       label: 'Relationship',
  //       name: 'Relationship',
  //     },
  //   ];
  
  //   const outSourcedConfig = [
  //     {
  //       fieldId: `RI_OS_OutsourcedStaffId`,
  //       translationId: 'IM_RI_OutsourcedStaffId',
  //       label: 'Outsourced Staff Id',
  //       name: 'OutsourcedStaffId',
  //     },
  //     {
  //       fieldId: `RI_OS_OutsourcedStaffName`,
  //       translationId: 'IM_RI_OutsourcedStaffName',
  //       label: 'Outsourced Staff Name',
  //       name: 'OutsourcedStaffName',
  //     },
  //     {
  //       fieldId: `RI_OS_OutsourcedStaffAge`,
  //       translationId: 'IM_RI_OutsourcedStaffAge',
  //       label: 'Outsourced Staff Age',
  //       name: 'OutsourcedStaffAge',
  //     },
  //     {
  //       fieldId: `RI_OS_OutsourcedStaffGender`,
  //       translationId: 'IM_RI_OutsourcedStaffGender',
  //       label: 'Outsourced Staff Gender',
  //       name: 'OutsourcedStaffGender',
  //     },
  //     {
  //       fieldId: `RI_OS_Department`,
  //       translationId: 'IM_RI_Department',
  //       label: 'Department',
  //       name: 'Department',
  //     },
  //     {
  //       fieldId: `RI_OS_CompanyName`,
  //       translationId: 'IM_RI_CompanyName',
  //       label: 'Company Name',
  //       name: 'CompanyName',
  //     },
  //   ];
  //   const staffConfig = [
  //     {
  //       fieldId: `RI_S_EmployeeId`,
  //       translationId: 'IM_RI_EmployeeId',
  //       label: 'StaffInvolvedId',
  //       name: 'StaffInvolvedId',
  //     },
  //     {
  //       fieldId: `RI_S_StaffName`,
  //       translationId: 'IM_RI_StaffName',
  //       label: 'StaffName',
  //       name: 'StaffName',
  //     },
  //     {
  //       fieldId: `RI_S_Department`,
  //       translationId: 'IM_RI_Department',
  //       label: 'Department',
  //       name: 'DepartmentName',
  //     },
  //     {
  //       fieldId: `RI_S_Designation`,
  //       translationId: 'IM_RI_Designation',
  //       label: 'Designation',
  //       name: 'DesignationName',
  //     },
  //     {
  //       fieldId: `RI_S_StaffCategory`,
  //       translationId: 'IM_RI_StaffCategory',
  //       label: 'Staff Category',
  //       name: 'StaffCategoryName',
  //     },
  //   ];
  
  //   const { data: labelsData = [], isFetching: isLabelsFetching } =
  //     useGetLabelsQuery({
  //       menuId: 28,
  //       moduleId: 2,
  //     });
  //   const { data: fieldsData = [], isFetching: isFieldsFetching } =
  //     useGetFieldsQuery({
  //       menuId: 28,
  //       moduleId: 2,
  //     });
      
  //   const fields =
  //     fieldsData?.Data?.Menus?.filter((item) => item.MenuId === 24) || [];
  
  //   const labels = (labelsData.Data || [])
  //     .filter((item) => item.MenuId === 24)
  //     .flatMap((item) =>
  //       (item.Regions || [])
  //         .filter((region) => region.RegionCode === 'ALL')
  //         .flatMap((region) => region.Labels || [])
  //     );
  //   const filterLabels = { Data: labels };
  
  //   const [configs, setConfigs] = useState({
  //     staffConfig,
  //     outSourcedConfig,
  //     companionConfig,
  //     patientConfig,
  //     titleConfig,
  //     additionalConfig,
  //     attachmentConfig,
  //     witnessConfig,
  //     visitorConfig,
  //     immediateActionTakenConfig,
  //     incidentConfig,
  //     fieldsConfig,
  //     attachmentConfig,
  //   });
  
  //   useEffect(() => {
  //     if (fields?.length > 0) {
  //       const matchingSections = fields[0]?.Sections?.filter(
  //         (section) =>
  //           section.SectionName === 'Accordion-Immediate Action Taken' ||
  //           section.SectionName === 'Accordion-Page' ||
  //           section.SectionName === 'Accordion-Witnessed By' ||
  //           section.SectionName === 'Accordion-Visitor' ||
  //           section.SectionName === 'Accordion-Staff' ||
  //           section.SectionName === 'Accordion-Outsourced Staff' ||
  //           section.SectionName === 'Accordion-Companion' ||
  //           section.SectionName === 'Accordion-Patient'
  //       );
  
  //       const pageFields = matchingSections?.flatMap(
  //         (section) =>
  //           section?.Regions?.find((region) => region.RegionCode === 'ALL')
  //             ?.Fields || []
  //       );
  
  //       if (pageFields && pageFields.length > 0) {
  //         const updatedConfigs = Object.entries(configs).reduce(
  //           (acc, [key, config]) => ({
  //             ...acc,
  //             [key]: config.filter((column) => {
  //               const pageField = pageFields.find(
  //                 (col) => col.FieldId === column.fieldId
  //               );
  
  //               return pageField && pageField.IsShow === true;
  //             }),
  //           }),
  //           {}
  //         );
  
  //         setConfigs(updatedConfigs);
  //       }
  //     }
  //   }, [fields[0]]);
  
  //   return (
  //     <FormContainer>
  //       <FlexContainer flexDirection={'column'}>
  //         <Grid container spacing={2} p={0}>
  //           {fieldsConfig.map((fieldConfig) => {
  //             const fieldValue = reportIncidentSafe[fieldConfig.name] ?? '';
  
  //             const getFormattedValue = (value, name) => {
  //               if (name === 'IncidentDate' || name === 'ReportDate') {
  //                 return formatDate(value);
  //               }
  //               if (name === 'IncidentTime' || name === 'ReportTime') {
  //                 const [hours, minutes] = value.split(':');
  //                 return `${hours}:${minutes}`;
  //               }
  //               return value;
  //             };
  
  //             const handleModalOpenForField = () => {
  //               if (fieldConfig.name === 'ClinicalType') {
  //                 setClinicalModalOpen(true);
  //               } else if (fieldConfig.name === 'IncidentTypeName') {
  //                 setIncidentModalOpen(true);
  //               }
  //             };
  
  //             return (
  //               <Grid item xs={4} key={fieldConfig.fieldId}>
  //                 <FormLabel>
  //                   {getlabel(
  //                     fieldConfig.translationId,
  //                     filterLabels,
  //                     i18n.language
  //                   )}
  //                   {(fieldConfig.name === 'ClinicalType' ||
  //                     fieldConfig.name === 'IncidentTypeName') && (
  //                     <Tooltip title="View Definition">
  //                       <IconButton
  //                         size="small"
  //                         onClick={handleModalOpenForField}
  //                         style={{
  //                           marginLeft: '8px',
  //                           padding: '2px',
  //                           color: '#007bff',
  //                         }}
  //                       >
  //                         <InfoIcon />
  //                       </IconButton>
  //                     </Tooltip>
  //                   )}
  //                 </FormLabel>
  //                 <StyledTypography>
  //                   {getFormattedValue(fieldValue, fieldConfig.name) || ''}
  //                 </StyledTypography>
  //               </Grid>
  //             );
  //           })}
  //         </Grid>
  
  //         <Modal
  //   open={isClinicalModalOpen}
  //   onClose={closeClinicalModal}
  //   closeAfterTransition
  //   BackdropComponent={Backdrop}
  //   BackdropProps={{
  //     timeout: 500,
  //     style: { backdropFilter: 'blur(8px)' },
  //   }}
  // >
  //   <Box
  //     sx={{
  //       position: 'absolute',
  //       top: '50%',
  //       left: '50%',
  //       transform: 'translate(-50%, -50%)',
  //       width: '50%',
  //       bgcolor: 'white',
  //       boxShadow: 24,
  //       borderRadius: '8px',
  //       outline: 'none',
  //       borderColor: 'black'
  //     }}
  //   >
  //    <button
  //   onClick={closeClinicalModal}
  //   style={{
  //     position: 'absolute',
  //     top: '10px',
  //     right: '10px',
  //     backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent white
  //     color: 'white', // White icon color
  //     fontWeight: 'bold',
  //     borderRadius: '50%',
  //     border: 'none', // No border
  //     width: '32px',
  //     height: '32px',
  //     display: 'flex',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  //     cursor: 'pointer',
  //   }}
  // >
  //   <i className="fas fa-times" style={{ fontSize: '16px' }}></i>
  // </button>
  
  //     <Typography
  //       variant="h6"
  //       gutterBottom
  //       sx={{
  //         background: '#0264AB',
  //         color: 'white',
  //         padding: '8px',
  //         borderRadius: '8px 8px 0 0',
  //       }}
  //     >
  //       Clinical/Non Clinical Definition
  //     </Typography>
  //     <div style={{ padding: '16px' }}>
  //       <table style={{ width: '100%', borderCollapse: 'collapse' }}>
  //         <tbody>
  //           {clinicalDefinition?.map((item, index) => (
  //             <tr key={index}>
  //               <td
  //                 style={{
  //                   border: '1px solid #ccc',
  //                   padding: '8px',
  //                   backgroundColor: '#d8280b',
  //                   color: 'white',
  //                 }}
  //               >
  //                 {item.Type || 'N/A'}
  //               </td>
  //               <td
  //                 style={{
  //                   border: '1px solid #ccc',
  //                   padding: '8px',
  //                   backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
  //                 }}
  //               >
  //                 {item.Definition || 'N/A'}
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   </Box>
  // </Modal>
  // <Modal
  //   open={isIncidentModalOpen}
  //   onClose={closeIncidentModal}
  //   closeAfterTransition
  //   BackdropComponent={Backdrop}
  //   BackdropProps={{
  //     timeout: 500,
  //     style: { backdropFilter: 'blur(8px)' },
  //   }}
  // >
  //   <Box
  //     sx={{
  //       position: 'absolute',
  //       top: '50%',
  //       left: '50%',
  //       transform: 'translate(-50%, -50%)',
  //       width: '60%',
  //       bgcolor: 'white',
  //       boxShadow: 24,
  //       borderRadius: '8px',
  //       outline: 'none',
  //       borderColor: 'black',
  //     }}
  //   >
  //     <button
  //       onClick={closeIncidentModal}
  //       style={{
  //         position: 'absolute',
  //         top: '10px',
  //         right: '10px',
  //         backgroundColor: 'rgba(0, 0, 0, 0.3)',
  //         color: 'white',
  //         fontWeight: 'bold',
  //         borderRadius: '50%',
  //         border: 'none',
  //         width: '32px',
  //         height: '32px',
  //         display: 'flex',
  //         alignItems: 'center',
  //         justifyContent: 'center',
  //         cursor: 'pointer',
  //       }}
  //     >
  //       <i className="fas fa-times" style={{ fontSize: '16px' }}></i>
  //     </button>
  
  //     <Typography
  //       variant="h6"
  //       gutterBottom
  //       sx={{
  //         background: '#0264AB',
  //         color: 'white',
  //         padding: '8px',
  //         borderRadius: '8px 8px 0 0',
  //       }}
  //     >
  //       Incident Type
  //     </Typography>
      
      
  //       <div style={{ padding: '16px' }}>
  //         <table style={{ width: '100%', borderCollapse: 'collapse' }}>
  //           <thead>
  //             <tr>
  //               <th
  //                 style={{
  //                   border: '1px solid #ccc',
  //                   padding: '8px',
  //                   backgroundColor: '#0264AB',
  //                   color: 'white',
  //                 }}
  //               >
  //                 Type
  //               </th>
  //               <th
  //                 style={{
  //                   border: '1px solid #ccc',
  //                   padding: '8px',
  //                   backgroundColor: '#0264AB',
  //                   color: 'white',
  //                 }}
  //               >
  //                 Definition
  //               </th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {incidentTypeDefinition?.map((item, index) => (
  //               <tr key={index}>
  //                 <td
  //                   style={{
  //                     border: '1px solid #ccc',
  //                     padding: '8px',
  //                     backgroundColor: '#d8280b',
  //                     color: 'white',
  //                   }}
  //                 >
  //                   {item.Type || 'N/A'}
  //                 </td>
  //                 <td
  //                   style={{
  //                     border: '1px solid #ccc',
  //                     padding: '8px',
  //                     backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
  //                   }}
  //                 >
  //                   {item.Definition || 'N/A'}
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //   </Box>
  // </Modal>
  
  
  
  
  
     
  
  //         {/* Incident Title */}
  //         <Box
  //           style={{
  //             fontWeight: '600',
  //             fontSize: '16px',
  //             lineHeight: '19.2px',
  //             color: '#F47721',
  //             marginTop: '10px',
  //             marginBottom: '10px',
  //           }}
  //         >
  //           {getlabel(
  //             titleConfig.find((config) => config.name === 'incidentTitle')
  //               ?.translationId,
  //             filterLabels,
  //             i18n.language
  //           )}
  //         </Box>
  //         <Grid container spacing={2} p={0}>
  //           {configs?.incidentConfig?.map((fieldConfig) => {
  //             const fieldValue = reportIncidentSafe[fieldConfig.name] ?? '';
  //             return (
  //               <Grid item xs={4} key={fieldConfig.fieldId}>
  //                 <FormLabel>
  //                   {getlabel(
  //                     fieldConfig?.translationId,
  //                     filterLabels,
  //                     i18n.language
  //                   )}
  //                 </FormLabel>
  //                 <StyledTypography>{fieldValue || ''}</StyledTypography>
  //               </Grid>
  //             );
  //           })}
  //         </Grid>
  
  //         <FormLabel style={{ marginBottom: '10px', marginTop: "10px" }}>
  //           {getlabel(
  //             titleConfig.find((config) => config.name === 'immediateActionTaken')
  //               ?.translationId,
  //             filterLabels,
  //             i18n.language
  //           )}
  //         </FormLabel>
  //         <ApproveIncidentTable
  //           columns={configs.immediateActionTakenConfig}
  //           labels={filterLabels}
  //         />
  //         <Box
  //           style={{
  //             fontWeight: '600',
  //             fontSize: '16px',
  //             lineHeight: '19.2px',
  //             color: '#F47721',
  //             margin: '10px 0px 10px 0px',
  //           }}
  //         >
  //           {getlabel(
  //             titleConfig.find(
  //               (config) => config.name === 'personInvolvedintheIncident'
  //             )?.translationId,
  //             filterLabels,
  //             i18n.language
  //           )}
  //         </Box>
  //         <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
  //           {getlabel(
  //             titleConfig.find((config) => config.name === 'Staff')
  //               ?.translationId,
  //             filterLabels,
  //             i18n.language
  //           )}
  //           :
  //         </FormLabel>
  //         {incidentStaffInvolvedsafe?.length > 0 ? (
  //           <ApproveIncidentTable
  //             columns={configs.staffConfig}
  //             labels={filterLabels}
  //             data={incidentStaffInvolvedsafe}
  //           />
  //         ) : null}
  
  //         <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
  //           {getlabel(
  //             titleConfig.find((config) => config.name === 'Patient')
  //               ?.translationId,
  //             filterLabels,
  //             i18n.language
  //           )}
  //           :
  //         </FormLabel>
  //         <ApproveIncidentTable
  //           columns={configs.patientConfig}
  //           labels={filterLabels}
  //           data={incidentPatientInvolvedSafe}
  //         />
  //         <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
  //           {getlabel(
  //             titleConfig.find((config) => config.name === 'Companion')
  //               ?.translationId,
  //             filterLabels,
  //             i18n.language
  //           )}
  //           :
  //         </FormLabel>
  //         <ApproveIncidentTable
  //           columns={configs.companionConfig}
  //           labels={filterLabels}
  //         />
  //         <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
  //           {getlabel(
  //             titleConfig.find((config) => config.name === 'visitor')
  //               ?.translationId,
  //             filterLabels,
  //             i18n.language
  //           )}
  //           :
  //         </FormLabel>
  //         <VisitorTable columns={configs.visitorConfig} labels={filterLabels} />
  //         <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
  //           {getlabel(
  //             titleConfig.find((config) => config.name === 'OutsourcedStaff')
  //               ?.translationId,
  //             filterLabels,
  //             i18n.language
  //           )}
  //           :
  //         </FormLabel>
  //         <ApproveIncidentTable
  //           columns={configs.outSourcedConfig}
  //           labels={filterLabels}
  //         />
  
  //         <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
  //           {getlabel(
  //             titleConfig.find((config) => config.name === 'witnessedBy')
  //               ?.translationId,
  //             filterLabels,
  //             i18n.language
  //           )}
  //           :
  //         </FormLabel>
  //         <WitnessTable columns={configs.witnessConfig} labels={filterLabels} />
  
  //         <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
  //           {getlabel(
  //             titleConfig.find((config) => config.name === 'Attachment(s)')
  //               ?.translationId,
  //             filterLabels,
  //             i18n.language
  //           )}
  //           :
  //         </FormLabel>
  //         <AttachmentTable columns={attachmentConfig} labels={filterLabels} />
  
  //         <Grid container spacing={2} p={0}>
  //           {configs.additionalConfig?.map((fieldConfig) => {
  //             return (
  //               <Grid item xs={4} key={fieldConfig.fieldId}>
  //                 <FormLabel>
  //                   {getlabel(
  //                     fieldConfig?.translationId,
  //                     filterLabels,
  //                     i18n.language
  //                   )}
  //                   :
  //                 </FormLabel>
  //                 <StyledTypography></StyledTypography>
  //               </Grid>
  //             );
  //           })}
  //         </Grid>
  //       </FlexContainer>
  //     </FormContainer>
  //   );
  // };
  const IncidentDetails = () => {
    const { i18n, t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams();
  
    const {
      selectedMenu,
      userDetails,
      selectedFacility,
      selectedModuleId,
      roleFacilities,
      isSuperAdmin,
    } = useSelector((state) => state.auth);
  
    const regionCode = useSelector((state) =>
      state.auth.regionCode?.toUpperCase()
    );
    const authState = useSelector((state) => state);
  
    const [isClinicalModalOpen, setClinicalModalOpen] = useState(false);
    const [isIncidentModalOpen, setIncidentModalOpen] = useState(false);
  
    const openClinicalModal = () => setClinicalModalOpen(true);
    const closeClinicalModal = () => setClinicalModalOpen(false);
  
    const [isModalOpen, setModalOpen] = React.useState(false);
    const [modalData, setModalData] = React.useState({ title: '', data: [] });
  
    const openIncidentModal = () => setIncidentModalOpen(true);
    const closeIncidentModal = () => setIncidentModalOpen(false);
    const handleModalOpen = (title, data) => {
      setModalData({ title, data });
      setModalOpen(true);
    };
  
    const handleModalClose = () => {
      setModalOpen(false);
    };
    const { data: definitionData } = useGetDefinitionQuery(
      {
        menuId: 24,
        loginUserId: userDetails?.UserId,
        incidentId: id,
        moduleId: selectedModuleId,
      },
      { skip: !id }
    );
  
    const { incidentTypeDefinition, clinicalDefinition, harmLevelDefinition } =
      definitionData?.Data || {};
  
    const { data: incidentData, isFetching: isFetchingData } =
      useGetIncidentDetailsPendingByIdQuery(
        {
          menuId: 24,
          loginUserId: userDetails?.UserId,
          incidentId: id,
          moduleId: 2,
        },
        { skip: !id }
      );
  
    const { reportIncident, incidentStaffInvolved, incidentPatientInvolved,incidentActionTaken, incidentOutStaffInvolved,incidentVisitorInvolved,incidentWitnessedBy } =
      incidentData?.Data || {};
  
    const reportIncidentSafe = reportIncident || {};
    const incidentStaffInvolvedsafe = incidentStaffInvolved || [];
    const incidentPatientInvolvedSafe = incidentPatientInvolved || [];
    const incidentActionTakenSafe = incidentActionTaken || [];
    const incidentVisitorTakenSafe = incidentVisitorInvolved || [];
    const incidenWitnessTakenSafe = incidentWitnessedBy || [];
  
    const incidentOutsourceInvolvedSafe = incidentOutStaffInvolved || [];
  
    const [incidentDateTime, setIncidentDateTime] = useState(null);
    const [incidentReportDateTime, setIncidentReportDateTime] = useState(null);
  
  
  
    const staffData = [];
  
    // const { data: getReportIncident } =
    // useGetHistoryIncidentQuery(
    //   {
    //     menuId: selectedMenu?.id,
    //     loginUserId: userDetails?.UserId,
    //     incidentId: id,
    //     moduleId: 2
    //   },
    //   { skip: !id }
    // );
  
    // const { IncidentHistoryList, NotificationList } =
    // getReportIncident?.Data || {};
  
    // const IncidntHistoryArray = IncidentHistoryList || {};
    // const NotificationListArray = NotificationList || {};
  
    // const dynamicFormData = incidentData?.Data?.incidentFormBuilderData?.mainCategoryMetaData;
  
    const dynamicFormData = incidentData?.Data?.incidentFormBuilderData || {};
    const {
      mainCategoryMetaData,
      mainCategoryFormValue, // Add this
    } = dynamicFormData;
  
    const filteredMainCategoryMetaData = mainCategoryMetaData?.filter(
      (item) => item.element !== null && item.element !== undefined
    );
    // const filtereSubcategorydMetaData = subCategoryMetaData?.filter(
    //   (item) => item.element !== null && item.element !== undefined
    // );
    // const filtereDetaildMetaData = incidentDetailMetaData?.filter(
    //   (item) => item.element !== null && item.element !== undefined
    // );
  
    // const dynamicFormData = {
    //   "id": "3BC67D45-E81C-4F43-9FD5-C5404E83CA6F",
    //   "element": "Dropdown",
    //   "text": "Dropdown",
    //   "static": null,
    //   "required": false,
    //   "readOnly": null,
    //   "defaultToday": null,
    //   "bold": null,
    //   "italic": null,
    //   "content": null,
    //   "canHaveAnswer": true,
    //   "canHavePageBreakBefore": true,
    //   "canHaveAlternateForm": true,
    //   "canHaveDisplayHorizontal": true,
    //   "canHaveOptionCorrect": true,
    //   "canHaveOptionValue": true,
    //   "canPopulateFromApi": true,
    //   "dateFormat": null,
    //   "timeFormat": null,
    //   "showTimeSelect": null,
    //   "showTimeSelectOnly": null,
    //   "showTimeInput": null,
    //   "field_name": "dropdown_CE0E9C1C-09A5-44BF-BC69-7AEF1203F69F",
    //   "label": "customDropdown ",
    //   "options": [
    //     {
    //       "value": "1",
    //       "text": "Place holder option 1",
    //       "key": "dropdown_option_CD0B6A07-9039-417E-BD69-42376DB2BE3A"
    //     },
    //     {
    //       "value": "2",
    //       "text": "Place holder option 2",
    //       "key": "dropdown_option_24DC2888-1B34-42B7-AF90-42E4759E2E4F"
    //     },
    //     {
    //       "value": "3",
    //       "text": "Place holder option 3",
    //       "key": "dropdown_option_C376E325-97F5-433F-AFC5-176D112890C6"
    //     }
    //   ]
    // };
  
    const fieldsConfig = [
      {
        fieldId: `RI_P_FacilityName`,
        translationId: 'IM_RI_FacilityName',
        label: 'Facility Name',
        name: 'FacilityName',
      },
      {
        fieldId: `RI_P_IncidentNumber`,
        translationId: 'IM_RI_IncidentNumber',
        label: 'Incident Number',
        name: 'IncidentNo',
      },
      {
        fieldId: `RI_P_BeAnonymous`,
        translationId: 'IM_RI_BeAnonymous',
        label: 'Be Anonymous',
        name: 'Anonymous',
      },
      {
        fieldId: `RI_P_IncidentDate`,
        translationId: 'IM_RI_IncidentDate',
        label: 'Incident Date',
        name: 'IncidentDateTime',
      },
      {
        fieldId: `RI_P_Day`,
        translationId: 'IM_RI_Day',
        label: 'Incident Day',
        name: 'IncidentDay',
      },
      {
        fieldId: `RI_P_Time`,
        translationId: 'IM_RI_Time',
        label: 'Incident Type',
        name: 'IncidentTime',
      },
      {
        fieldId: `RI_P_ReportedDate`,
        translationId: 'IM_RI_ReportedDate',
        label: 'Reported Date',
        name: 'ReportingDateTime',
      },
      {
        fieldId: `RI_P_ReportedDay`,
        translationId: 'IM_RI_ReportedDay',
        label: 'Reported Date',
        name: 'ReportDay',
      },
      {
        fieldId: `RI_P_ReportedTime`,
        translationId: 'IM_RI_ReportedTime',
        label: 'Reported Time',
        name: 'ReportTime',
      },
      {
        fieldId: `RI_P_IncidentType`,
        translationId: 'IM_RI_IncidentType',
        label: 'Incident Type',
        name: 'IncidentTypeName',
      },
  
      {
        fieldId: `RI_P_Clinical/NonClinical`,
        translationId: 'IM_RI_Clinical/NonClinical',
        label: 'Clinical/Non Clinical',
        name: 'ClinicalType',
      },
      {
        fieldId: `RI_P_AffectedCategory`,
        translationId: 'IM_RI_AffectedCategory',
        label: 'AffectedCategory',
        name: 'AffectedCategory',
      },
      // {
      //   fieldId: `RI_P_AffectedCategoryCode`,
      //   translationId: 'IM_RI_AffectedCategoryCode',
      //   label: 'AffectedCategoryCode',
      //   name: 'AffectedCategoryCode',
      // },
      // {
      //   fieldId: `RI_P_MainCategoryCode`,
      //   translationId: 'IM_RI_MainCategoryCode',
      //   label: 'MainCategoryCode',
      //   name: 'MainCategoryCode',
      // },
      // {
      //   fieldId: `RI_P_SubCategoryCode`,
      //   translationId: 'IM_RI_SubCategoryCode',
      //   label: 'SubCategoryCode',
      //   name: 'SubCategoryCode',
      // },
      // {
      //   fieldId: `RI_P_IncidentDetailsCode`,
      //   translationId: 'IM_RI_IncidentDetailsCode',
      //   label: 'IncidentDetailsCode',
      //   name: 'IncidentDetailsCode',
      // },
      // {
      //   fieldId: `RI_P_MedicationBrandNameInvolvedIfApplicable`,
      //   translationId: 'IM_RI_MedicationBrandNameInvolvedIfApplicable',
      //   label: 'MedicationBrandNameInvolvedIfApplicable',
      //   name: 'MedicationBrandNameInvolvedIfApplicable',
      // },
      // {
      //   fieldId: `RI_P_MedicationGenricNameInvolvedIfApplicable`,
      //   translationId: 'IM_RI_MedicationGenricNameInvolvedIfApplicable',
      //   label: 'MedicationGenricNameInvolvedIfApplicable',
      //   name: 'MedicationGenricNameInvolvedIfApplicable',
      // },
      // {
      //   fieldId: `RI_P_MedicationRoute`,
      //   translationId: 'IM_RI_MedicationRoute',
      //   label: 'MedicationRoute',
      //   name: 'MedicationRoute',
      // },
      // {
      //   fieldId: `RI_P_MedicationDose`,
      //   translationId: 'IM_RI_MedicationDose',
      //   label: 'MedicationDose',
      //   name: 'MedicationDose',
      // },
      // {
      //   fieldId: `RI_P_MedicationForm`,
      //   translationId: 'IM_RI_MedicationForm',
      //   label: 'MedicationForm',
      //   name: 'MedicationForm',
      // },
      // {
      //   fieldId: `RI_P_ReactionCode`,
      //   translationId: 'IM_RI_ReactionCode',
      //   label: 'ReactionCode',
      //   name: 'ReactionCode',
      // },
      // {
      //   fieldId: `RI_P_ReactionName`,
      //   translationId: 'IM_RI_ReactionName',
      //   label: 'ReactionName',
      //   name: 'ReactionName',
      // },
      // {
      //   fieldId: `RI_P_Medication(s)InvolvedGeneric`,
      //   translationId: 'IM_RI_Medication(s)InvolvedGeneric',
      //   label: 'Medication(s)InvolvedGeneric',
      //   name: 'Medication(s)InvolvedGeneric',
      // },
      // {
      //   fieldId: `RI_P_Medication(s)InvolvedBrand`,
      //   translationId: 'IM_RI_Medication(s)InvolvedBrand',
      //   label: 'Medication(s)InvolvedBrand',
      //   name: 'Medication(s)InvolvedBrand',
      // },
      // {
      //   fieldId: `RI_P_ConsentSinged?`,
      //   translationId: 'IM_RI_ConsentSinged?',
      //   label: 'ConsentSinged',
      //   name: 'ConsentSinged',
      // },
     
    ];
  
    const incidentConfig = [
      {
        fieldId: `RI_P_IncidentMainCategory`,
        translationId: 'IM_RI_IncidentMainCategory',
        label: 'Incident Main Category',
        name: 'MainCategory',
      },
      {
        fieldId: `RI_P_IncidentSubCategory`,
        translationId: 'IM_RI_IncidentSubCategory',
        label: 'Incident Sub Category',
        name: 'SubCategory',
      },
      {
        fieldId: `RI_P_IncidentDetail`,
        translationId: 'IM_RI_IncidentDetail',
        label: 'Incident Detail',
        name: 'IncidentDetail',
      },
      {
        fieldId: `RI_P_Remarks`,
        translationId: 'IM_RI_Remarks',
        label: 'Remarks',
        name: 'Remarks',
      },
      {
        fieldId: `RI_P_BriefDescriptionofIncident`,
        translationId: 'IM_RI_BriefDescriptionofIncident',
        label: 'Brief Description of Incident',
        name: 'BriefDescriptionOfIncident',
      },
      {
        fieldId: `RI_P_IncidentDepartment`,
        translationId: 'IM_RI_IncidentDepartment',
        label: 'Incident Department',
        name: 'DepartmentName',
      },
      {
        fieldId: `RI_P_LocationDetails(Roomnoetc)`,
        translationId: 'IM_RI_LocationDetails(Roomnoetc)',
        label: 'Location Details(Room no etc)',
        name: 'LocationDetails',
      },
    ];
  
    const immediateActionTakenConfig = [
      {
        fieldId: `RI_IAT_ImmediateActionTaken`,
        translationId: 'IM_RI_ImmediateActionTaken',
        label: 'Immediate Action Taken',
        name: 'ImmediateActionTaken',
      },
      {
        fieldId: `RI_IAT_ResponsibleStaff`,
        translationId: 'IM_RI_ResponsibleStaff',
        label: 'Responsible Staff',
        name: 'ResponsibleStaffName',
      },
      {
        fieldId: `RI_IAT_Department`,
        translationId: 'IM_RI_Department',
        label: 'Department',
        name: 'DepartmentName',
      },
      {
        fieldId: `RI_IAT_Designation`,
        translationId: 'IM_RI_Designation',
        label: 'Designation',
        name: 'DesignationName',
      },
    ];
    const visitorConfig = [
      {
        fieldId: `RI_V_VisitorName`,
        translationId: 'IM_RI_VisitorName',
        label: 'Immediate Action Taken',
        name: 'VisitorName',
      },
      {
        fieldId: `RI_V_VisitorAge`,
        translationId: 'IM_RI_VisitorAge',
        label: 'Responsible Staff',
        name: 'VisitorAge',
      },
      {
        fieldId: `RI_V_VisitorGender`,
        translationId: 'IM_RI_VisitorGender',
        label: 'Designation',
        name: 'VisitorGender',
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
        name: 'ReasonforVisit',
      },
    ];
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
        name: 'DepartmentName',
      },
      {
        fieldId: `RI_WB_Designation`,
        translationId: 'IM_RI_Designation',
        label: 'Designation',
        name: 'DesignationName',
      },
    ];
    const attachmentConfig = [
      {
        fieldId: `RI_P_Attachment`,
        translationId: 'IM_RI_Attachment(s)',
        label: 'Attachment(s)',
        name: 'attachment(s)',
      },
    ];
  
    const historyConfig = [
      {
        fieldId: `RI_P_RequestInformationHistory`,
        translationId: 'IM_RI_RequestInformationHistory(s)',
        label: 'IncidentHistory',
        name: 'IncidentHistory',
      },
    ];
  
    const additionalConfig = [
      {
        fieldId: `RI_P_HarmLevel`,
        translationId: 'IM_RI_HarmLevel',
        label: 'Harm Level',
        name: 'IncidentHarmLevel',
      },
      {
        fieldId: `RI_P_Anyadditionalstaffyouwishtobenotified`,
        translationId: 'IM_RI_Anyadditionalstaffyouwishtobenotified',
        label: 'anyadditionalstaffyouwishtobenotified',
        name: 'AdditionalStaffNotify',
      },
    ];
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
      {
        translationId: 'IM_SI_IncidentHistory',
        label: 'Incident History',
        name: 'IncidentHistory',
      },
      {
        translationId: 'IM_SI_NotificationHistory',
        label: 'Notification History',
        name: 'NotificationHistory',
      },
      {
        translationId: 'IM_RI_Others',
        label: 'Others',
        name: 'Others',
      },
    ];
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
        label: 'Staff Category',
        name: 'StaffCategory',
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
    ];
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
    ];
  
    const outSourcedConfig = [
      {
        fieldId: `RI_OS_OutsourcedStaffId`,
        translationId: 'IM_RI_OutsourcedStaffId',
        label: 'Outsourced Staff Id',
        name: 'OutStaffId',
      },
      {
        fieldId: `RI_OS_OutsourcedStaffName`,
        translationId: 'IM_RI_OutsourcedStaffName',
        label: 'Outsourced Staff Name',
        name: 'OutStaffName',
      },
      {
        fieldId: `RI_OS_OutsourcedStaffAge`,
        translationId: 'IM_RI_OutsourcedStaffAge',
        label: 'Outsourced Staff Age',
        name: 'OutStaffAge',
      },
      {
        fieldId: `RI_OS_OutsourcedStaffGender`,
        translationId: 'IM_RI_OutsourcedStaffGender',
        label: 'Outsourced Staff Gender',
        name: 'OutStaffGender',
      },
      {
        fieldId: `RI_OS_Department`,
        translationId: 'IM_RI_Department',
        label: 'Department',
        name: 'DepartmentName',
      },
      {
        fieldId: `RI_OS_CompanyName`,
        translationId: 'IM_RI_CompanyName',
        label: 'Company Name',
        name: 'CompanyName',
      },
    ];
    const staffConfig = [
      {
        fieldId: `RI_S_EmployeeId`,
        translationId: 'IM_RI_EmployeeId',
        label: 'StaffInvolvedId',
        name: 'StaffInvolvedId',
      },
      {
        fieldId: `RI_S_StaffName`,
        translationId: 'IM_RI_StaffName',
        label: 'StaffName',
        name: 'StaffName',
      },
      {
        fieldId: `RI_S_Department`,
        translationId: 'IM_RI_Department',
        label: 'Department',
        name: 'DepartmentName',
      },
      {
        fieldId: `RI_S_Designation`,
        translationId: 'IM_RI_Designation',
        label: 'Designation',
        name: 'DesignationName',
      },
      {
        fieldId: `RI_S_StaffCategory`,
        translationId: 'IM_RI_StaffCategory',
        label: 'Staff Category',
        name: 'StaffCategoryName',
      },
    ];
  
    const incidentHistoryConfig = [
      {
        fieldId: `SI_IH_Task`,
        translationId: 'IM_SI_Task',
        label: 'Task',
        name: 'Task',
      },
      {
        fieldId: `SI_IH_ResponsibleStaff`,
        translationId: 'IM_SI_ResponsibleStaff',
        label: 'Responsible Staff',
        name: 'IM_SI_ResponsibleStaff',
      },
      {
        fieldId: `SI_IH_Department`,
        translationId: 'IM_SI_Department',
        label: 'Department',
        name: 'Department',
      },
      {
        fieldId: `SI_IH_RequestReceivedDate`,
        translationId: 'IM_SI_RequestReceivedDate',
        label: 'Request Received Date',
        name: 'RequestReceivedDate',
      },
      {
        fieldId: `SI_IH_CompletedDate`,
        translationId: 'IM_SI_CompletedDate',
        label: 'Completed Date',
        name: 'CompletedDate',
      },
    ];
  
    const OthersConfig = [
      {
        fieldId: `RI_O_OtherName`,
        translationId: 'IM_RI_Others',
        label: 'Others',
        name: 'Others',
      },
      {
        fieldId: `RI_O_OtherAge`,
        translationId: 'IM_RI_OtherAge',
        label: 'Other Age',
        name: 'OtherAge',
      },
      {
        fieldId: `RI_O_OtherGender`,
        translationId: 'IM_RI_OtherGender',
        label: 'Other Gender',
        name: 'OtherGender',
      },
      {
        fieldId: `RI_O_Details`,
        translationId: 'IM_RI_Details',
        label: 'Details',
        name: 'Details',
      },
    ];
  
    const { data: labelsData = [], isFetching: isLabelsFetching } =
      useGetLabelsQuery({
        menuId: 25,
        moduleId: 2,
      });
    const { data: fieldsData = [], isFetching: isFieldsFetching } =
      useGetFieldsQuery({
        menuId: 25,
        moduleId: 2,
      });
  
    const fields =
      fieldsData?.Data?.Menus?.filter((item) => item.MenuId === 24) || [];
  
    const historyfields =
      fieldsData?.Data?.Menus?.filter((item) => item.MenuId === 25) || [];
  
    const labels = (labelsData.Data || [])
      .filter((item) => item.MenuId === 24)
      .flatMap((item) =>
        (item.Regions || [])
          .filter((region) => {
            if (regionCode === 'ALL') {
              return region.RegionCode === 'ALL';
            } else if (regionCode === 'ABD') {
              return region.RegionCode === 'ABD' || region.RegionCode === 'ALL';
            }
          })
          .flatMap((region) => region.Labels || [])
      );
    const filterLabels = { Data: labels };
  
    const Historylabels = (labelsData.Data || [])
      .filter((item) => item.MenuId === 25)
      .flatMap((item) =>
        (item.Regions || [])
          .filter((region) => region.RegionCode === 'ALL')
          .flatMap((region) => region.Labels || [])
      );
    const HistoryfilterLabels = { Data: Historylabels };
  
    const initialConfigs = {
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
      incidentHistoryConfig,
      historyConfig,
      OthersConfig,
    };
  
    const [configs, setConfigs] = useState(initialConfigs);
    useEffect(() => {
      setConfigs(initialConfigs);
    }, [regionCode]);
  
    useEffect(
      () => {
        if (fields?.length > 0) {
          const matchingSections = fields[0]?.Sections?.filter(
            (section) =>
              section.SectionName === 'Accordion-Immediate Action Taken' ||
              section.SectionName === 'Accordion-Page' ||
              section.SectionName === 'Accordion-Witnessed By' ||
              section.SectionName === 'Accordion-Visitor' ||
              section.SectionName === 'Accordion-Staff' ||
              section.SectionName === 'Accordion-Outsourced Staff' ||
              section.SectionName === 'Accordion-Companion' ||
              section.SectionName === 'Accordion-Patient' ||
              section.SectionName === 'Accordion-Others'
          );
  
          const pageFields = matchingSections?.flatMap(
            (section) =>
              section?.Regions?.filter((region) => {
                const isIncluded =
                  regionCode === 'ABD'
                    ? region.RegionCode === 'ABD' || region.RegionCode === 'ALL'
                    : region.RegionCode === 'ALL';
                return isIncluded;
              }).flatMap((region) => region.Fields || []) || []
          );
  
          if (pageFields && pageFields.length > 0) {
            setConfigs((prevConfigs) => {
              return Object.entries(prevConfigs).reduce((acc, [key, config]) => {
                const filteredColumns = config.filter((column) => {
                  const pageField = pageFields.find(
                    (col) => col.FieldId === column.fieldId
                  );
  
                  return pageField && pageField.IsShow === true;
                });
  
                return { ...acc, [key]: filteredColumns };
              }, {});
            });
          }
        }
      },
      [fields[0]],
      regionCode
    );
  
  
    useEffect(() => {
      const incidentDateTimeValue = reportIncidentSafe['IncidentDateTime'];
      const reportingDateTimeValue = reportIncidentSafe['ReportingDateTime'];
      if (incidentDateTimeValue && incidentDateTimeValue !== incidentDateTime) {
        setIncidentDateTime(incidentDateTimeValue);
      }
      if (reportingDateTimeValue && reportingDateTimeValue !== incidentReportDateTime) {
        setIncidentReportDateTime(reportingDateTimeValue);
      }
    }, [reportIncidentSafe]); 
  
  
    const DynamicModal = ({ open, onClose, title, data }) => (
      <Modal
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 50,
          style: { backdropFilter: 'blur(8px)' },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            maxHeight: '90vh',
            bgcolor: 'white',
            boxShadow: 24,
            borderRadius: '8px',
            outline: 'none',
            borderColor: 'black',
            overflow: 'auto',
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '50%',
              border: 'none',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <i className="fas fa-times" style={{ fontSize: '16px' }}></i>
          </button>
  
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              background: '#0264AB',
              color: 'white',
              padding: '8px',
              borderRadius: '8px 8px 0 0',
            }}
          >
            {title}
          </Typography>
  
          <div
            style={{
              maxHeight: 'calc(90vh - 96px)',
              overflowY: 'auto',
              padding: '16px',
            }}
          >
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                margin: '0 auto',
              }}
            >
              <tbody>
                {data?.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        border: '1px solid #ccc',
                        padding: '8px',
                        backgroundColor: '#d8280b',
                        fontWeight: '600',
                        color: 'white',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        textTransform: 'capitalize',
                      }}
                    >
                      {item.Type || 'N/A'}
                    </td>
                    <td
                      style={{
                        border: '1px solid #ccc',
                        padding: '8px',
                        backgroundColor: index % 2 === 0 ? '#e3e1e1' : 'white',
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        textTransform: 'capitalize',
                      }}
                    >
                      {item.Definition || 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Box>
      </Modal>
    );
  
    return (
      <FlexContainer
        flexDirection={'column'}
        alignItems="center"
        width="100%"
        flexWrap="wrap"
      >
        <Accordion
          sx={{
            border: '1px solid  #3498db',
            borderRadius: '8px 8px 0px 0px',
            width: '100%',
          }}
        >
          <AccordionSummary
              expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
          
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{
              backgroundColor: '#3498db',
              width: '100%',
              display: 'flex',
              justifyContent: 'center', 
              alignItems: 'center',
            }}
          >
            <StyledTypography
              fontSize="18px"
              fontWeight="700"
              lineHeight="20px"
              textAlign="center"
              color="#FFFFFF"
              sx={{
                flexGrow: 1, 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {t('IM_IncidentDetail')}
            </StyledTypography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2} p={0}>
              {fieldsConfig.map((fieldConfig) => {
                const fieldValue = reportIncidentSafe[fieldConfig.name] ?? '';
                  
                const getFormattedValue = (value, name) => {
                  if (name === 'IncidentDateTime' || name === 'ReportingDateTime') {
                    if (value) {
                      return formatDate(value); // Assuming formatDate handles the formatting
                    }
                  }
              
                //   if (name === 'IncidentTime' && incidentDateTime) {
                //       const [hours, minutes] = incidentDateTime.split(':');
                //       return `${hours}:${minutes}`;
                //   }
  
                //   if (name === 'ReportTime' && incidentReportDateTime) {
                //     const [hours, minutes] = incidentReportDateTime.split(':');
                //     return `${hours}:${minutes}`;
                // }
              
                  if (name === 'IncidentDay' && incidentDateTime) {
                    const date = new Date(incidentDateTime); 
                    return date.toLocaleDateString(i18n.language, { weekday: 'long' }); 
                  }
                  if (name === 'ReportDay' && incidentReportDateTime) {
                    const date = new Date(incidentReportDateTime); 
                    return date.toLocaleDateString(i18n.language, { weekday: 'long' });
                  }
              
                  return value;
                };
              
                
                
  
                const openModalForField = () => {
                  const modalConfig = {
                    ClinicalType: {
                      title: 'Clinical/Non Clinical Definition',
                      data: clinicalDefinition,
                    },
                    IncidentTypeName: {
                      title: 'Incident Type',
                      data: incidentTypeDefinition,
                    },
                  };
  
                  const { title, data } = modalConfig[fieldConfig.name] || {};
                  if (title && data) {
                    handleModalOpen(title, data);
                  }
                };
  
                return (
                  <Grid item xs={4} key={fieldConfig.fieldId}>
                    <FormLabel>
                      {getlabel(
                        fieldConfig.translationId,
                        filterLabels,
                        i18n.language
                      )}
                      {(fieldConfig.name === 'ClinicalType' ||
                        fieldConfig.name === 'IncidentTypeName') && (
                        <Tooltip title="View Definition">
                          <IconButton
                            size="small"
                            onClick={openModalForField}
                            style={{
                              marginLeft: '8x',
                              padding: '2px',
                              color: '#3498DB',
                            }}
                          >
                            <i className="fas fa-info-circle"></i>{' '}
                          </IconButton>
                        </Tooltip>
                      )}
                    </FormLabel>
                    <StyledTypography>
                      {getFormattedValue(fieldValue, fieldConfig.name) || ''}
                    </StyledTypography>
                  </Grid>
                );
              })}
            </Grid>
  
            <DynamicModal
              open={isModalOpen}
              onClose={handleModalClose}
              title={modalData.title}
              data={modalData.data}
            />
            {/* Incident Title */}
            <Box
              style={{
                fontWeight: '600',
                fontSize: '16px',
                lineHeight: '19.2px',
                color: '#F47721',
                marginTop: '10px',
                marginBottom: '10px',
              }}
            >
              {getlabel(
                titleConfig.find((config) => config.name === 'incidentTitle')
                  ?.translationId,
                filterLabels,
                i18n.language
              )}
            </Box>
            <Grid container spacing={2} p={0}>
              {configs?.incidentConfig?.map((fieldConfig) => {
                const fieldValue = reportIncidentSafe[fieldConfig.name] ?? '';
                return (
                  <Grid item xs={4} key={fieldConfig.fieldId}>
                    <FormLabel>
                      {getlabel(
                        fieldConfig?.translationId,
                        filterLabels,
                        i18n.language
                      )}
                    </FormLabel>
                    <StyledTypography>{fieldValue || ''}</StyledTypography>
                  </Grid>
                );
              })}
            </Grid>
  
            {incidentActionTakenSafe?.length > 0 && (
  
              <>
                <FormLabel style={{ marginBottom: '10px', marginTop: '10px' }}>
                  {getlabel(
                    titleConfig.find(
                      (config) => config.name === 'immediateActionTaken'
                    )?.translationId,
                    filterLabels,
                    i18n.language
                  )}
                </FormLabel>
                
                <ApproveIncidentTable
                  columns={configs.immediateActionTakenConfig}
                  labels={filterLabels}
                  data={incidentActionTakenSafe}
                />
                </>
            )}
            <Box
              style={{
                fontWeight: '600',
                fontSize: '16px',
                lineHeight: '19.2px',
                color: '#F47721',
                margin: '10px 0px 10px 0px',
              }}
            >
              {getlabel(
                titleConfig.find(
                  (config) => config.name === 'personInvolvedintheIncident'
                )?.translationId,
                filterLabels,
                i18n.language
              )}
            </Box>
            {incidentStaffInvolvedsafe?.length > 0 && (
  
              <>
                <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
                  {getlabel(
                    titleConfig.find((config) => config.name === 'Staff')
                      ?.translationId,
                    filterLabels,
                    i18n.language 
                  )}
                  :
                </FormLabel>
                
                <ApproveIncidentTable
                  columns={configs.staffConfig}
                  labels={filterLabels}
                  data={incidentStaffInvolvedsafe}
                />
                </>
            )}
  
            {incidentPatientInvolvedSafe?.length > 0 && (
  
              <>
                <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
                  {getlabel(
                    titleConfig.find((config) => config.name === 'Patient')
                      ?.translationId,
                    filterLabels,
                    i18n.language
                  )}
                  :
                </FormLabel>
                
                <ApproveIncidentTable
                  columns={configs.patientConfig}
                  labels={filterLabels}
                  data={incidentPatientInvolvedSafe}
                />
              </>
            )}
            <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
              {getlabel(
                titleConfig.find((config) => config.name === 'Companion')
                  ?.translationId,
                filterLabels,
                i18n.language
              )}
              :
            </FormLabel>
  
           
            
              <ApproveIncidentTable
              columns={configs.companionConfig}
              labels={filterLabels}
            /> 
  
  
        {incidentVisitorTakenSafe?.length > 0 && (    
            <>
            <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
              {getlabel(
                titleConfig.find((config) => config.name === 'visitor')
                  ?.translationId,
                filterLabels,
                i18n.language
              )}
              :
            </FormLabel>
  
            
            
            <ApproveIncidentTable
              columns={configs.visitorConfig}
              labels={filterLabels}
              data={incidentVisitorTakenSafe}
            />
  
            </>
            
            )}
  
  
            {incidentOutsourceInvolvedSafe?.length > 0 && (  
  
              <>
            {/* <VisitorTable columns={configs.visitorConfig} labels={filterLabels} /> */}
            <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
              {getlabel(
                titleConfig.find((config) => config.name === 'OutsourcedStaff')
                  ?.translationId,
                filterLabels,
                i18n.language
              )}
              :
            </FormLabel>
           
            <ApproveIncidentTable
              columns={configs.outSourcedConfig}
              labels={filterLabels}
              data={incidentOutsourceInvolvedSafe}
            />
  
            </>
            )}
  
  
          {incidenWitnessTakenSafe?.length > 0 && (   
  
            <>
            <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
              {getlabel(
                titleConfig.find((config) => config.name === 'witnessedBy')
                  ?.translationId,
                filterLabels,
                i18n.language
              )}
              :
            </FormLabel>
  
           
            <ApproveIncidentTable
              columns={configs.witnessConfig}
              labels={filterLabels}
              data={incidenWitnessTakenSafe}
            />
  
              </>
            )}
  
            {/* <WitnessTable columns={configs.witnessConfig} labels={filterLabels} /> */}
            <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
              {getlabel(
                titleConfig.find((config) => config.name === 'Attachment(s)')
                  ?.translationId,
                filterLabels,
                i18n.language
              )}
              :
            </FormLabel>
            <AttachmentTable columns={attachmentConfig} labels={filterLabels} />
            <Grid container spacing={2} p={0} sx={{ mt: 1 }}>
              {configs.additionalConfig?.map((fieldConfig) => {
                const fieldValue = reportIncidentSafe[fieldConfig.name] ?? '';
                const openModalForField = () => {
                  const modalConfig = {
                    IncidentHarmLevel: {
                      title: 'Harm Level',
                      data: harmLevelDefinition,
                    },
                  };
  
                  const { title, data } = modalConfig[fieldConfig.name] || {};
                  if (title && data) {
                    handleModalOpen(title, data);
                  }
                };
  
                return (
                  <Grid item xs={4} key={fieldConfig.fieldId}>
                    <FormLabel>
                      {getlabel(
                        fieldConfig?.translationId,
                        filterLabels,
                        i18n.language
                      )}
                      {fieldConfig.name === 'IncidentHarmLevel' && (
                        <Tooltip title="View Definition">
                          <IconButton
                            size="small"
                            onClick={openModalForField}
                            style={{
                              marginLeft: '8x',
                              padding: '2px',
                              color: '#3498DB',
                            }}
                          >
                            <i className="fas fa-info-circle"></i>{' '}
                          </IconButton>
                        </Tooltip>
                      )}
                    </FormLabel>
                    <StyledTypography>{fieldValue}</StyledTypography>
                  </Grid>
                );
              })}
            </Grid>
            <DynamicModal
              open={isModalOpen}
              onClose={handleModalClose}
              title={modalData.title}
              data={modalData.data}
            />
          </AccordionDetails>
  
          <>
          {filteredMainCategoryMetaData?.length > 0 && (
        <Grid item xs={1} sm={1} padding="10px" md={1}>
          <FlexContainer
            className="staffmaster-wrapper"
            flexDirection="column"
          >
            <CustomFormDisplay
              data={filteredMainCategoryMetaData}
              formValues={mainCategoryFormValue}
            />
          </FlexContainer>
        </Grid>
      )}
  
            {/* {filtereSubcategorydMetaData?.length > 0 && (
              <Grid item xs={12} sm={12} padding={'10px'} md={12}>
                <FlexContainer
                  className="staffmaster-wrapper"
                  flexDirection="column"
                >
                  <Label bold value={'Custom fields for Sub Category:'} />
                  <ReactFormGenerator
                    key={JSON.stringify(staffData?.Data?.FormBuilderData || [])}
                    width="100%"
                    className="custom-width"
                    data={filtereSubcategorydMetaData}
                    answer_data={staffData?.Data?.FormBuilderData || null}
                  />
                </FlexContainer>
              </Grid>
            )}
  
            {filtereDetaildMetaData?.length > 0 && (
              <Grid item xs={12} sm={12} padding={'10px'} md={12}>
                <FlexContainer
                  className="staffmaster-wrapper"
                  flexDirection="column"
                >
                  <Label bold value={'Custom fields for Detail:'} />
                  <ReactFormGenerator
                    key={JSON.stringify(staffData?.Data?.FormBuilderData || [])}
                    width="100%"
                    className="custom-width"
                    data={filtereDetaildMetaData}
                    answer_data={staffData?.Data?.FormBuilderData || null}
                  />
                </FlexContainer>
              </Grid>
            )} */}
          </>
        </Accordion>
      </FlexContainer>
    );
  };
  
  export default IncidentDetails;
  