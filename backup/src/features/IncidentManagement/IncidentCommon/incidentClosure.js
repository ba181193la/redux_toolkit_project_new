import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableContainer,
  Table,
  Paper,
  TableBody,
  IconButton,
  Modal,
  Backdrop,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import styled from 'styled-components';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../utils/StyledComponents';
import ExpandIcon from '../../../assets/Icons/ExpandIcon.png';
import SubmitTik from '../../../assets/Icons/SubmitTik.png';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TextField } from '../../../components/TextField/TextField';
import ReoccurrenceTable from './DataTable/ReoccurrenceTable';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../redux/RTK/moduleDataApi';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
  FormLabel,
} from '../../../utils/DataTable.styled';
import { getlabel } from '../../../utils/language';
import { Formik, Form } from 'formik';
import {
  useGetClosureViewDataQuery,
  useGetPageLoadDataQuery,
} from '../../../redux/RTK/incidentClosureApi';
import {
  useSkipInvestigationMutation,
  useFillRCAMutation,
  useGetReportIncidentPageloadQuery,
  useGetApprovalEntryDataQuery,
  useAssignInvestigatorMutation,
  useOpinionMutation,
} from '../../../redux/RTK/IncidentManagement/incidentApprovalApi';
import 'jspdf-autotable';
import { useGetIncidentDetailsPendingByIdQuery } from '../../../redux/RTK/incidentInvestigationApi';
import IncidentLevel from './DataTable/IncidentLevel';
import SingleTable from './DataTable/SingleTable';

// Styled Components
const StyledGridContainer = styled(Grid)`
  display: grid;
  gap: 15px;
  padding: 20px;
`;

const StyledGridItem = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const FormContainer = styled(Box)`
  margin: 20px;
  background-color: #fff;
`;
const StyledFormLabel = styled(Typography)`
  font-weight: 700 !important;
  color: #000;
`;

const ActionButton = styled(Button)`
  color: #fff !important;
  border-radius: 6px !important;
  text-transform: none !important;
  box-shadow: 0px 4px 4px 0px #00000040 !important;

  &:hover {
    transform: scale(1.05) !important;
    transition: transform 0.3s ease !important;
  }
`;

const ReadOnlyText = styled(StyledTypography)`
  font-weight: 500 !important;
  font-size: 14px !important;
`;

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  text-align: left;
`;

const ClosureEntry = () => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { id, closureID } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');

  const [selectedAction, setSelectedAction] = useState('');
  const [triggerSkipInvestigation] = useSkipInvestigationMutation();
  const [triggerFillRCA] = useFillRCAMutation();
  const [triggerAssigninvestigator] = useAssignInvestigatorMutation();
  const [triggerOpinion] = useOpinionMutation();
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState({ title: '', data: [] });

  const [categorylist, setCategorylist] = useState([]);

  // Get Reoprt Incident
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
  } = useSelector((state) => state.auth);

  const [isIncidentCategoryModel, setIsIncidentCategoryModel] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [assigninvestigators, setAssigninvestigators] = useState([]);
  const [opinions, setOpinions] = useState([]);
  const sectionRef = useRef();

  // Accordians
  const [showMergeAccordion, setshowMergeAccordion] = useState(false);

  const [openSkillPopup, setOpenSkillPopup] = useState(false);
  const [openRCAPopup, setOpenRCAPopup] = useState(false);

  const { data: entrydetails = [], isFetching: isEntrydetails } =
    useGetClosureViewDataQuery({
      incidentId: id,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
    });

  const entryData = entrydetails?.Data || {};

  const MedicationIncident = entryData?.medicationHarmLevelDefinition;
  const LikelihoodPopup = entryData?.LikelihoodDefinition;
  const jawdaIncident = entryData?.jawdaIncidentLevelDefinition;

  const attachmentTable = [
    {
      fieldId: `IC_P_Attachment(s)`,
      translationId: 'IM_IC_Attachment(s)',
      label: 'Attachment',
      name: 'Attachment',
    },
  ];

  const incidentLevel = [
    {
      fieldId: `IC_IL_IncidentLevel`,
      translationId: 'IM_IC_IncidentLevel',
      label: 'Incident Level',
      name: 'IncidentLevel',
    },
    {
      fieldId: `IC_IL_ActionTobeTaken`,
      translationId: 'IM_IC_ActionTobeTaken',
      label: 'Action To beTaken',
      name: 'ActionTobeTaken',
    },
    {
      fieldId: `IC_IL_RCARequired`,
      translationId: 'IM_IC_RCARequired',
      label: 'RCA Required',
      name: 'RCARequired',
    },
    {
      fieldId: `IC_IL_RCAStatus`,
      translationId: 'IM_IC_RCAStatus',
      label: 'RCA Status',
      name: 'RCAStatus',
    },
  ];

  const otherslabels = [
    {
      translationId: 'IM_IC_ContributingFactors',
      label: 'Contributing Factors',
      name: 'ContributingFactors',
    },
    {
      translationId: 'IM_IC_ContributingDepartment',
      label: 'Contributing Department',
      name: 'ContributingDepartment',
    },
    {
      translationId: 'IM_IC_IncidentReoccurrence',
      label: 'Incident Reoccurrence',
      name: 'IncidentReoccurrence',
    },
    {
      translationId: 'IM_IC_Re-AssignedActionResponsibleStaff(s)History',
      label: 'Re-Assigned Action Responsible Staff(s) History',
      name: 'Re-AssignedActionResponsibleStaff(s)History',
    },
  ];

  const additionalstaffLabels = [
    // {
    //   fieldId: `IC_NFS_Facility`,
    //   translationId: 'IM_IC_Facility',
    //   label: 'StaffName',
    //   name: 'StaffName',
    // },
    // {
    //   fieldId: `IC_NFS_EmployeeId`,
    //   translationId: 'IM_IC_EmployeeId',
    //   label: 'Employee Id',
    //   name: 'EmployeeId',
    // },
    {
      fieldId: `IC_NFS_StaffName`,
      translationId: 'IM_IC_StaffName',
      label: 'StaffName',
      name: 'StaffName',
    },
    {
      fieldId: `IC_NFS_Department`,
      translationId: 'IM_IC_Department',
      label: 'Department',
      name: 'Department',
    },
    {
      fieldId: `IC_NFS_Designation`,
      translationId: 'IM_IC_Designation',
      label: 'Designation',
      name: 'Designation',
    },
    {
      fieldId: `IC_NFS_LevelofStaffNegligence`,
      translationId: 'IM_IC_LevelofStaffNegligence',
      label: 'Level of Staff Negligence',
      name: 'LevelofStaffNegligence',
    },
  ];

  const FurtherActionsLabels = [
    {
      fieldId: `IC_FATBA_TaskAssigned`,
      translationId: 'IM_IC_TaskAssigned',
      label: 'Task Assigned',
      name: 'TaskAssigned',
    },
    {
      fieldId: `IC_FATBA_ResponsibleStaff`,
      translationId: 'IM_IC_ResponsibleStaff',
      label: 'Responsible Staff',
      name: 'ResponsibleStaff',
    },
    {
      fieldId: `IC_FATBA_Department`,
      translationId: 'IM_IC_Department',
      label: 'Department',
      name: 'Department',
    },
    {
      fieldId: `IC_FATBA_TargetDate`,
      translationId: 'IM_IC_TargetDate',
      label: 'Target Date',
      name: 'TargetDate',
    },
  ];

  const IncidentReoccurrence = [
    {
      fieldId: `IC_IR_IncidentNumber`,
      translationId: 'IM_IC_IncidentNumber',
      label: 'Incident Number',
      name: 'IncidentNumber',
    },
    {
      fieldId: `IC_IR_IncidentDetails`,
      translationId: 'IM_IC_IncidentDetails',
      label: 'Incident Details',
      name: 'IncidentDetails',
    },
    {
      fieldId: `IC_IR_IncidentDate`,
      translationId: 'IM_IC_IncidentHistory',
      label: 'Incident History',
      name: 'IncidentHistory',
    },
    {
      fieldId: `IC_IR_LocationDetails(Roomnoetc)`,
      translationId: 'IM_IC_LocationDetails(Roomnoetc)',
      label: 'Location Details(Room no etc)',
      name: 'LocationDetails(Room no etc)',
    },
    {
      fieldId: `IC_IR_RootCauses`,
      translationId: 'IM_IC_RootCauses',
      label: 'Root Causes',
      name: 'RootCauses',
    },
    {
      fieldId: `IC_IR_Recommendation(s)ForPreventiveAction`,
      translationId: 'IM_IC_Recommendation(s)ForPreventiveAction',
      label: 'Recommendation(s) For Preventive Action',
      name: 'Recommendation(s)ForPreventiveAction',
    },
  ];

  const ReAssigned = [
    {
      fieldId: `IC_RARSH_Re-AssignedBy`,
      translationId: 'IM_IC_Re-AssignedBy',
      label: 'Re-Assigned By',
      name: 'Re-AssignedBy',
    },
    {
      fieldId: `IC_RARSH_Re-AssignedDate`,
      translationId: 'IM_IC_Re-AssignedDate',
      label: 'Re-Assigned Date',
      name: 'Re-AssignedDate',
    },
    {
      fieldId: `IC_RARSH_FromResponsibleStaff`,
      translationId: 'IM_IC_FromResponsibleStaff',
      label: 'From Responsible Staff',
      name: 'FromResponsibleStaff',
    },
    {
      fieldId: `IC_RARSH_ToResponsibleStaff`,
      translationId: 'IM_IC_ToResponsibleStaff',
      label: 'To Responsible Staff',
      name: 'ToResponsibleStaff',
    },
    {
      fieldId: `IC_RARSH_PreviousTargetDate`,
      translationId: 'IM_IC_PreviousTargetDate',
      label: 'Previous Target Date',
      name: 'PreviousTargetDate',
    },
    {
      fieldId: `IC_RARSH_TargetDate`,
      translationId: 'IM_IC_TargetDate',
      label: 'Target Date',
      name: 'TargetDate',
    },
    {
      fieldId: `IC_RARSH_Re-AssignRemarks`,
      translationId: 'IM_IC_Re-AssignRemarks',
      label: 'Re-Assign Remarks',
      name: 'Re-AssignRemarks',
    },
  ];

  const FactorsLable = [
    {
      fieldId: `IC_CF_MainFactor(s)`,
      translationId: 'IM_IC_MainFactor(s)',
      label: 'MainFactor(s)',
      name: 'MainFactor(s)',
    },
    {
      fieldId: `IC_CF_SubFactor(s)`,
      translationId: 'IM_IC_SubFactor(s)',
      label: 'SubFactor(s)',
      name: 'SubFactor(s)',
    },
  ];

  const IncidentApproval = [
    {
      fieldId: `IC_P_IncidentMainCategory`,
      translationId: 'IM_IC_IncidentMainCategory',
      label: 'Incident Main Category',
      name: 'MainCategory',
    },
    {
      fieldId: `IC_P_IncidentSubCategory`,
      translationId: 'IM_IC_IncidentSubCategory',
      label: 'Incident Sub Category',
      name: 'SubCategory',
    },
    {
      fieldId: `IC_P_IncidentDetails`,
      translationId: 'IM_IC_IncidentDetails',
      label: 'Incident Details',
      name: 'IncidentDetail',
    },
    {
      fieldId: `IC_P_IncidentType`,
      translationId: 'IM_IC_IncidentType',
      label: 'Incident Type',
      name: 'IncidentType',
    },
    {
      fieldId: `IC_P_Clinical/NonClinical`,
      translationId: 'IM_IC_Clinical/NonClinical',
      label: 'Clinical/Non-Clinical',
      name: 'ClinicalType',
    },
    {
      fieldId: `IC_P_IncidentDepartment`,
      translationId: 'IM_IC_IncidentDepartment',
      label: 'Incident Department',
      name: 'IncidentDepartment',
    },
    {
      fieldId: `IC_P_TobeDiscussedinCommittee`,
      translationId: 'IM_IC_TobeDiscussedinCommittee',
      label: 'To be Discussed in Committee',
      name: 'TobeDiscussedinCommittee',
    },
    {
      fieldId: `IC_P_HarmLevel`,
      translationId: 'IM_IC_HarmLevel',
      label: 'Harm Level',
      name: 'IncidentHarmLevel',
    },
    {
      fieldId: `IC_P_NegligenceFromStaff`,
      translationId: 'IM_IC_NegligenceFromStaff',
      label: 'Negligence From Staff',
      name: 'NegligenceFromStaff',
    },
    {
      fieldId: `IC_P_FurtherActionsTakenByApprover`,
      translationId: 'IM_IC_FurtherActionsTakenByApprover',
      label: 'Further Actions Taken By Approver',
      name: 'FurtherActionsTakenByApprover',
    },
    {
      fieldId: `IC_P_MedicationIncidentHarmLevel`,
      translationId: 'IM_IC_MedicationIncidentHarmLevel',
      label: 'Medication Incident Harm Level',
      name: 'MedicationIncidentHarmLevel',
    },
    {
      fieldId: `IC_P_ContributingFactors`,
      translationId: 'IM_IC_ContributingFactors',
      label: 'Contributing Factors',
      name: 'ContributingFactors',
    },
    {
      fieldId: `IC_P_ContributingDepartment`,
      translationId: 'IM_IC_ContributingDepartment',
      label: 'Contributing Department',
      name: 'ContributingDepartment',
    },
    {
      fieldId: `IC_P_IncidentReoccurrence`,
      translationId: 'IM_IC_IncidentReoccurrence',
      label: 'Incident Reoccurrence',
      name: 'IncidentReoccurrence',
    },
    {
      fieldId: `IC_P_ReporttoExternalBody`,
      translationId: 'IM_IC_ReporttoExternalBody',
      label: 'Report to External Body',
      name: 'ReportExternalBody',
    },
    {
      fieldId: `IC_P_Remarks`,
      translationId: 'IM_IC_Remarks',
      label: 'Remarks',
      name: 'Remarks',
    },
    {
      fieldId: `IC_P_Attachment(s)`,
      translationId: 'IM_IC_Attachment(s)',
      label: 'Attachment',
      name: 'Attachment',
    },
    {
      fieldId: `IC_P_ExistingAttachment(s)`,
      translationId: 'IM_IC_ExistingAttachment(s)',
      label: 'Existing Attachment',
      name: 'ExistingAttachment',
    },
    {
      fieldId: `IC_P_IncidentLevel(s)`,
      translationId: 'IM_IC_IncidentLevel',
      label: 'Incident Level',
      name: 'IncidentLevel',
    },
    {
      fieldId: `IC_P_CategoryAffected`,
      translationId: 'IM_IC_CategoryAffected',
      label: 'Category Affected',
      name: 'CategoryAffected',
    },
    {
      fieldId: `IC_P_Consequence`,
      translationId: 'IM_IC_Consequence',
      label: 'Consequence',
      name: 'Consequence',
    },
    {
      fieldId: `IC_P_Likelihood`,
      translationId: 'IM_IC_Likelihood',
      label: 'Likelihood',
      name: 'Likelihood',
    },
    {
      fieldId: `IC_P_SubmittedBy`,
      translationId: 'IM_IC_SubmittedBy',
      label: 'Submitted By',
      name: 'SubmittedBy',
    },
    {
      fieldId: `IC_P_DepartmentName`,
      translationId: 'IM_IC_DepartmentName',
      label: 'Department Name',
      name: 'DepartmentName',
    },
    {
      fieldId: `IC_IH_Designation`,
      translationId: 'IM_IC_Designation',
      label: 'Designation',
      name: 'Designation',
    },
    {
      fieldId: `IC_P_SubmittedDate`,
      translationId: 'IM_IC_SubmittedDate',
      label: 'Submitted Date',
      name: 'SubmittedDate',
    },
    {
      fieldId: `IC_P_IncidentHistory`,
      translationId: 'IM_IC_IncidentHistory',
      label: 'IncidentHistory',
      name: 'IncidentHistory',
    },
    {
      fieldId: `IC_P_NotificationHistory`,
      translationId: 'IM_IC_NotificationHistory',
      label: 'Notification History',
      name: 'NotificationHistory',
    },
    {
      fieldId: `IC_P_IncidentReason/RootCause`,
      translationId: 'IM_IC_IncidentReason/RootCause',
      label: 'IncidentReason/RootCause',
      name: 'IncidentReason/RootCause',
    },
    {
      fieldId: `IC_P_LessonsLearned`,
      translationId: 'IM_IC_LessonsLearned',
      label: 'Lessons Learned',
      name: 'LessonLearned',
    },
    {
      fieldId: `IC_P_JAWDAIncidentLevel`,
      translationId: 'IM_IC_JAWDAIncidentLevel',
      label: 'JAWDA Incident Level',
      name: 'JAWDALevel',
    },
  ];

  const IncidentHistorylabel = [
    {
      fieldId: `IC_IH_RequestReceivedDate`,
      translationId: 'IM_IC_RequestReceivedDate',
      label: 'RequestReceivedDate',
      name: 'RequestReceivedDate',
    },
    {
      fieldId: `IC_IH_CompletedDate`,
      translationId: 'IM_IC_CompletedDate',
      label: 'CompletedDate',
      name: 'CompletedDate',
    },
    {
      fieldId: `IC_IH_Department`,
      translationId: 'IM_IC_Department',
      label: 'Incident Main Category',
      name: 'IncidentMainCategory',
    },
    {
      fieldId: `IC_IH_Designation`,
      translationId: 'IM_IC_Designation',
      label: 'Designation',
      name: 'Designation',
    },
    {
      fieldId: `IC_IH_ResponsibleStaff`,
      translationId: 'IM_IC_ResponsibleStaff',
      label: 'ResponsibleStaff',
      name: 'ResponsibleStaff',
    },
    {
      fieldId: `IC_IH_Task`,
      translationId: 'IM_IC_Task',
      label: 'Task',
      name: 'Task',
    },
  ];

  const NotificationHistorylabel = [
    {
      fieldId: `IC_NH_StaffName`,
      translationId: 'IM_IC_StaffName',
      label: 'Staff Name',
      name: 'StaffName',
    },
    {
      fieldId: `IC_NH_SubmittedBy`,
      translationId: 'IM_IC_SubmittedBy',
      label: 'Submitted By',
      name: 'SubmittedBy',
    },
    {
      fieldId: `IC_NH_Task`,
      translationId: 'IM_IC_Task',
      label: 'Task',
      name: 'Task',
    },
    {
      fieldId: `IC_NH_MailSubject`,
      translationId: 'IM_IC_MailSubject',
      label: 'Mail Subject',
      name: 'MailSubject',
    },
    {
      fieldId: `IC_NH_MailId`,
      translationId: 'IM_IC_MailId',
      label: 'Mail Id',
      name: 'MailId',
    },
    {
      fieldId: `IC_NH_SentDate&Time`,
      translationId: 'IM_IC_SentDate&Time',
      label: 'Sent Date & Time',
      name: 'SentDate&Time',
    },
    {
      fieldId: `IC_NH_Data_SubmittedBy`,
      translationId: 'IM_IC_Data_SubmittedBy',
      label: 'Data Submitted By',
      name: 'Data_SubmittedBy',
    },
    {
      fieldId: `IC_NH_NotificationRemarks`,
      translationId: 'IM_IC_NotificationRemarks',
      label: 'Notification Remarks',
      name: 'NotificationRemarks',
    },
  ];
  const ContriDepartment = [
    {
      fieldId: `IC_P_ContributingDepartment`,
      translationId: 'IM_IC_ContributingDepartment',
      label: 'Contributing Department',
      name: 'ContributingDepartment',
    },
  ];
  const AffectedCategory = [
    {
      fieldId: `IC_P_CategoryAffected`,
      translationId: 'IM_IC_CategoryAffected',
      label: 'CategoryAffected',
      name: 'CategoryAffected',
    },
    {
      fieldId: `IC_P_Consequence`,
      translationId: 'IM_IC_Consequence',
      label: 'Consequence',
      name: 'Consequence',
    },
  ];

  const { data: labelsData = [], isFetching: isLabelsFetching } =
    useGetLabelsQuery({
      menuId: 30,
      moduleId: 2,
    });
  const { data: fieldsData = [], isFetching: isFieldsFetching } =
    useGetFieldsQuery({
      menuId: 30,
      moduleId: 2,
    });
  const menuData = fieldsData.Data?.Menus || [];

  const filteredFields = menuData?.find(
    (menu) => menu.MenuId === selectedMenu?.id
  );


  const incidentLabels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 30)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'ALL')
        .flatMap((region) => region.Labels || [])
    );
  const filteredIncidentLabel = { Data: incidentLabels };

  const incidentApprovalLabels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 30)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'ALL')
        .flatMap((region) => region.Labels || [])
    );

  const filterIncidentApprovalLabels = { Data: incidentApprovalLabels };


  const otherslabelsConfig = otherslabels.filter((field) =>
    incidentLabels.some((label) => label.TranslationId === field.translationId)
  );

  const filteredIncidentApprovalConfig = IncidentApproval.filter((field) =>
    incidentApprovalLabels.some(
      (label) => label.TranslationId === field.translationId
    )
  );


  const [configs, setConfigs] = useState({
    IncidentApproval,
    incidentLevel,
    additionalstaffLabels,
    FurtherActionsLabels,
    IncidentReoccurrence,
    ReAssigned,
    FactorsLable,
    IncidentHistorylabel,
    NotificationHistorylabel,
    ContriDepartment,
    AffectedCategory,
  });

  useEffect(() => {
    if (filteredFields) {

      const matchingSections = filteredFields?.Sections?.filter(
        (section) => section.SectionName === 'Page' ||
        section.SectionName === 'Accordion-Incident Level' ||
        section.SectionName === 'Accordion-Further Actions Taken By Approver' ||
        section.SectionName === 'Accordion-Re-Assigned Action Responsible Staff(s) History' ||
        section.SectionName === 'Accordion-Contributing Factors' ||
        section.SectionName === 'Accordion-Incident History' ||
        section.SectionName === 'Accordion-Notification History' ||
        section.SectionName === 'Accordion-Negligence From Staff' ||
        section.SectionName === 'Accordion-Incident Reoccurrence'
      );

      const pageFields = matchingSections
        ?.flatMap((section) => section.Regions)
        ?.filter((region) => region.RegionCode === 'ALL')
        ?.flatMap((region) => region.Fields);



      if (pageFields && pageFields.length > 0) {
        const updatedConfigs = Object.entries(configs).reduce(
          (acc, [key, config]) => ({
            ...acc,
            [key]: config.filter((column) => {
              const pageField = pageFields.find(
                (col) => col.FieldId === column.fieldId
              );

              return pageField && pageField.IsShow === true;
            }),
          }),
          {}
        );
        setConfigs(updatedConfigs);
      }
    }
  }, [filteredFields]);

  

  const handleClose = () => {
    setIsIncidentCategoryModel(false);
  };

  const { data: pageloadData = [], isFetching: ispageloadData } =
    useGetPageLoadDataQuery({
      headerFacilityId: selectedFacility?.id,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
    });

  let ReoccurrenceLog =
    entrydetails?.Data?.reoccurrenceDetails?.length > 0
      ? entrydetails.Data.reoccurrenceDetails.map((item) => ({
          reoccurrenceLogId: 0,
          incidentApprovalId: 0,
          incidentNo: item?.IncidentNo || '',
          incidentDetailId: item?.IncidentDetailId || 0,
          incidentDetail: item?.IncidentDetail || '',
          incidentDate: item?.IncidentDate || '',
          locationDetails: item?.LocationDetails || '',
          isDelete: false,
          incidentReason: item?.IncidentReason || '',
          recommendation: item?.Recommendation || '',
        }))
      : [];

  const pdfSectionRef = useRef(null); // For the PDF content

  const { data: incidentData, isFetching: isFetchingData } =
    useGetIncidentDetailsPendingByIdQuery(
      {
        menuId: 26,
        loginUserId: 1,
        incidentId: id,
        // moduleId: 2
      },
      { skip: !id }
    );

  const { reportIncident, incidentStaffInvolved, incidentPatientInvolved } =
    incidentData?.Data || {};

  const openModalForField = (fieldName) => {
    const modalConfig = {
      MedicationIncidentHarmLevel: {
        title: 'Medication Incident Harm Level',
        data: MedicationIncident,
      },
      HarmLevel: {
        title: 'HarmLevel',
        // data: MedicationIncident,
      },
      Likelihood: {
        title: 'Likelihood',
        data: LikelihoodPopup,
      },
      JAWDAIncidentLevel: {
        title: 'JAWDAIncidentLevel',
        data: jawdaIncident,
      },
    };

    const { title, data } = modalConfig[fieldName] || {}; // Get the title and data for the passed fieldName
    if (title && data) {
      handleModalOpen(title, data); // Open the modal with the correct title and data
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };
  const handleModalOpen = (title, data) => {
    setModalData({ title, data });
    setModalOpen(true);
  };
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
                    {item.Name || 'N/A'}
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
  const filteredField = [
    'IncidentType',
    'MainCategory',
    'SubCategory',
    'IncidentDetail',
    'ClinicalType',
    'JAWDALevel',
    'IncidentReason',
    'LessonLearned',
    'IncidentHarmLevel',
    'MedicationIncidentHarmLevel',
  ];
  return (
    <>
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      <FlexContainer style={{ flexDirection: 'column', width: '100%' }}>
        <FlexContainer style={{ backgroundColor: '#fff' }}>
          <Box paddingTop={0} style={{ width: '-webkit-fill-available' }}>

            <Accordion
              sx={{
                marginBottom: '10px',
                border: '1px solid #e6a81c',
                borderRadius: '8px 8px 0px 0px',
              }}
              // expanded={true}
            >
              <AccordionSummary
                expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  backgroundColor: '#e6a81c',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center', // Ensures the icon and text are centered
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
                    width: '100%', // Ensures the text spans the entire width
                    textAlign: 'center', // Centers text inside
                    display: 'flex',
                    justifyContent: 'center', // Centers flex content
                    alignItems: 'center',
                  }}
                >
                  {t('MM_IncidentClosure')}
                </StyledTypography>
              </AccordionSummary>

              <FormContainer style={{ marginBottom: '20px' }}>
                <FlexContainer flexDirection={'column'}>
                  <Grid container spacing={2} p={2} style={{ padding: '0px' }}>
                    {filteredField.map((name) => {
                      const fieldValue = entryData[name] ?? '';
                      const fields = configs.IncidentApproval?.find(
                        (f) => f.name === name
                      );
                      const showTooltip = [
                        'IncidentType',
                        'ClinicalType',
                        'JAWDALevel',
                        'IncidentHarmLevel',
                      ].includes(name);

                      if (fields) {
                        return (
                          <Grid item xs={4} key={name}>
                            <FormLabel>
                              {getlabel(
                                fields?.translationId,
                                filterIncidentApprovalLabels,
                                i18n.language
                              )}
                              {showTooltip && (
                                <Tooltip title="View Definition">
                                  <IconButton
                                    size="small"
                                    onClick={() => openModalForField(name)}
                                    style={{
                                      marginLeft: '8px',
                                      padding: '2px',
                                      color: '#3498DB',
                                    }}
                                  >
                                    <i className="fas fa-info-circle"></i>
                                  </IconButton>
                                </Tooltip>
                              )}
                            </FormLabel>

                            <StyledTypography>{fieldValue}</StyledTypography>
                          </Grid>
                        );
                      }
                    })}
                  </Grid>

                  <Box mt={2}>
                    <StyledFormLabel style={{ margin: '10px 0px 10px 0px' }}>
                      {getlabel(
                        filteredIncidentApprovalConfig.find(
                          (config) => config.name === 'ContributingFactors'
                        )?.translationId,
                        filterIncidentApprovalLabels,
                        i18n.language
                      )}
                    </StyledFormLabel>
                    <ReoccurrenceTable
                      columns={configs.FactorsLable}
                      labels={filterIncidentApprovalLabels}
                      backgroundColor={'#fd7272'}
                    />
                  </Box>

                  <Box>
                    <StyledGridContainer
                      style={{
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '16px',
                        padding: '0px',
                        
                      }}
                    >
                      <StyledGridItem>
                        <StyledFormLabel
                          style={{ margin: '10px 0px 10px 0px' }}
                        >
                          {getlabel(
                            filteredIncidentApprovalConfig.find(
                              (config) =>
                                config.name === 'ContributingDepartment'
                            )?.translationId,
                            filterIncidentApprovalLabels,
                            i18n.language
                          )}
                        </StyledFormLabel>

                        <SingleTable
                          columns={configs.ContriDepartment}
                          labels={filterIncidentApprovalLabels}
                          backgroundColor={'#bc3c3c'}
                        />
                      </StyledGridItem>

                      {configs.IncidentApproval.find(
                        (config) => config.name === 'IncidentReoccurrence'
                      ) && (
                        <StyledGridItem
                          mt={5}
                          style={{ display: 'flex', flexDirection: 'row' }}
                        >
                          <FormLabel style={{ width: '50%' }}>
                            {getlabel(
                              filteredIncidentApprovalConfig.find(
                                (config) =>
                                  config.name === 'IncidentReoccurrence'
                              )?.translationId,
                              filterIncidentApprovalLabels,
                              i18n.language
                            )}{' '}
                            :
                          </FormLabel>
                          <sapn style={{ color: 'black' }}>
                            {' '}
                            {entryData?.IncidentReoccurence}
                          </sapn>
                        </StyledGridItem>
                      )}
                    </StyledGridContainer>
                  </Box>

                  <Box mt={2}>
                    <StyledFormLabel style={{ margin: '10px 0px 10px 0px' }}>
                      {getlabel(
                        filteredIncidentApprovalConfig.find(
                          (config) => config.name === 'IncidentReoccurrence'
                        )?.translationId,
                        filterIncidentApprovalLabels,
                        i18n.language
                      )}{' '}
                      :
                    </StyledFormLabel>
                    <ReoccurrenceTable
                      columns={configs.IncidentReoccurrence}
                      labels={filterIncidentApprovalLabels}
                      backgroundColor={'#fd7272'}
                    />
                  </Box>

                  <Box mt={2}>
                    <StyledFormLabel style={{ margin: '10px 0px 10px 0px' }}>
                      {getlabel(
                        filteredIncidentApprovalConfig.find(
                          (config) => config.name === 'NegligenceFromStaff'
                        )?.translationId,
                        filterIncidentApprovalLabels,
                        i18n.language
                      )}
                    </StyledFormLabel>
                    <ReoccurrenceTable
                      columns={configs.additionalstaffLabels}
                      labels={filterIncidentApprovalLabels}
                      backgroundColor={'#0b53f7'}
                    />
                  </Box>
                  <StyledFormLabel style={{ margin: '10px 0px 10px 0px' }}>
                    {getlabel(
                      filteredIncidentApprovalConfig.find(
                        (config) =>
                          config.name === 'FurtherActionsTakenByApprover'
                      )?.translationId,
                      filterIncidentApprovalLabels,
                      i18n.language
                    )}
                  </StyledFormLabel>

                  <ReoccurrenceTable
                    columns={configs.FurtherActionsLabels}
                    labels={filterIncidentApprovalLabels}
                    backgroundColor={'#e6a81c'}
                  />

                  <StyledFormLabel style={{ margin: '10px 0px 10px 0px' }}>
                    {getlabel(
                      otherslabelsConfig.find(
                        (config) =>
                          config.name ===
                          'Re-AssignedActionResponsibleStaff(s)History'
                      )?.translationId,
                      filterIncidentApprovalLabels,
                      i18n.language
                    )}
                  </StyledFormLabel>

                  <ReoccurrenceTable
                    columns={configs.ReAssigned}
                    labels={filterIncidentApprovalLabels}
                    backgroundColor={'#3C8DBC'}
                  />

                  <StyledGridContainer
                    style={{
                      gridTemplateColumns: 'repeat(2, 1fr)', // Creates 2 equal columns
                      gap: '16px', // Adds spacing between items
                      padding: '0px',
                      marginTop: '5px',
                    }}
                  >
                    {configs.IncidentApproval.find(
                      (config) => config.name === 'TobeDiscussedinCommittee'
                    ) && (
                      <StyledGridItem>
                        <FormLabel>
                          {getlabel(
                            filteredIncidentApprovalConfig.find(
                              (config) =>
                                config.name === 'TobeDiscussedinCommittee'
                            )?.translationId,
                            filterIncidentApprovalLabels,
                            i18n.language
                          )}{' '}
                          :
                        </FormLabel>
                        <sapn style={{ color: 'black' }}>
                          {' '}
                          {entryData?.TBDCommittee}
                        </sapn>
                      </StyledGridItem>
                    )}
                    <StyledGridItem></StyledGridItem>
                    {configs.IncidentApproval.find(
                      (config) => config.name === 'ReportExternalBody'
                    ) && (
                      <StyledGridItem>
                        <FormLabel>
                          {getlabel(
                            filteredIncidentApprovalConfig.find(
                              (config) => config.name === 'ReportExternalBody'
                            )?.translationId,
                            filterIncidentApprovalLabels,
                            i18n.language
                          )}{' '}
                          :
                        </FormLabel>
                        <sapn style={{ color: 'black' }}>
                          {' '}
                          {entryData?.ReportExternalBody}
                        </sapn>
                      </StyledGridItem>
                    )}
                    <StyledGridItem></StyledGridItem>

                    <StyledGridItem>
                      <SingleTable
                        columns={configs.ContriDepartment}
                        labels={filterIncidentApprovalLabels}
                        backgroundColor={'#84248f'}
                      />
                    </StyledGridItem>
                    <StyledGridItem></StyledGridItem>

                    {configs.IncidentApproval.find(
                      (config) => config.name === 'Remarks'
                    ) && (
                      <StyledGridItem>
                        <FormLabel>
                          {getlabel(
                            filteredIncidentApprovalConfig.find(
                              (config) => config.name === 'Remarks'
                            )?.translationId,
                            filterIncidentApprovalLabels,
                            i18n.language
                          )}{' '}
                          :
                        </FormLabel>
                        <sapn style={{ color: 'Remarks' }}>
                          {' '}
                          {entryData?.TBDCommittee}
                        </sapn>
                      </StyledGridItem>
                    )}

                    <StyledGridItem></StyledGridItem>

                    <StyledGridItem>
                      <FormLabel>
                        {getlabel(
                          filteredIncidentApprovalConfig.find(
                            (config) => config.name === 'Attachment'
                          )?.translationId,
                          filterIncidentApprovalLabels,
                          i18n.language
                        )}{' '}
                        :
                      </FormLabel>
                      <SingleTable
                        columns={attachmentTable}
                        labels={filterIncidentApprovalLabels}
                        backgroundColor={'#bc3c3c'}
                      />
                    </StyledGridItem>
                  </StyledGridContainer>
                </FlexContainer>

                {/* <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start', border: '1px solid' }}>
                <Grid item xs={6} sx={{ border: '1px solid', width: '50%' }}>
                  dfsaff
                </Grid>
                <Grid item xs={6} sx={{ border: '1px solid', width: '50%' }}>
                  dfsafffsdfdsf
                </Grid>
              </Grid> */}

                {/* </Box> */}
                
              </FormContainer>
              <Box
              padding={2} 
              >
              <Accordion
              sx={{
                marginBottom: '10px',
                border: '1px solid  #3498db',
                borderRadius: '8px 8px 0px 0px',
                
              }}
              expanded={true}
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
                    width: '100%', // Ensures the text spans the entire width
                    textAlign: 'center', // Centers text inside
                    display: 'flex',
                    justifyContent: 'center', // Centers flex content
                    alignItems: 'center',
                  }}
                >
                  {t('IncidentRiskLevel')}
                </StyledTypography>
              </AccordionSummary>
              <FormContainer style={{ marginBottom: '20px' }}>
                <FlexContainer flexDirection={'column'}>
                  <StyledGridContainer
                    style={{
                      gridTemplateColumns: 'repeat(1, 1fr)',
                      gap: '16px', // Adds spacing between items
                      padding: '0px'
                    }}
                  >
                    <StyledGridItem
                    
                    >
                      <h6>
                        <strong>Affected Category and Factor(s)</strong>
                      </h6>
                      <ReoccurrenceTable
                        columns={configs.AffectedCategory}
                        labels={filterIncidentApprovalLabels}
                        backgroundColor={'#3498db'}
                      />
                    </StyledGridItem>
                    {configs.IncidentApproval.find(
                      (config) => config.name === 'Likelihood'
                    ) && (
                      <StyledGridItem>
                        <FormLabel>
                          {getlabel(
                            filteredIncidentApprovalConfig.find(
                              (config) => config.name === 'Likelihood'
                            )?.translationId,
                            filterIncidentApprovalLabels,
                            i18n.language
                          )}
                          <Tooltip title="View Definition">
                            <IconButton
                              size="small"
                              onClick={() => openModalForField('Likelihood')}
                              style={{
                                marginLeft: '8px',
                                padding: '2px',
                                color: '#3498DB',
                              }}
                            >
                              <i className="fas fa-info-circle"></i>
                            </IconButton>
                          </Tooltip>
                        </FormLabel>
                        <span style={{ color: 'Remarks' }}>
                          {' '}
                          {entryData?.Likelihood}
                        </span>
                      </StyledGridItem>
                    )}
                  </StyledGridContainer>

                  <FlexContainer
                    flexDirection={'column'}
                    style={{ marginBottom: '20px' }}
                  >
                    <IncidentLevel
                      columns={configs.incidentLevel}
                      labels={filterIncidentApprovalLabels}
                    />
                  </FlexContainer>
                </FlexContainer>
              </FormContainer>
            </Accordion>

            <StyledGridContainer
              style={{
                gridTemplateColumns: 'repeat(2, 1fr)', // Creates 2 equal columns
                gap: '16px', // Adds spacing between items
                padding: '0px'
              }}
            >
              {configs.IncidentApproval.find(
                (config) => config.name === 'SubmittedBy'
              ) && (
                <StyledGridItem>
                  <FormLabel>
                    {getlabel(
                      filteredIncidentApprovalConfig.find(
                        (config) => config.name === 'SubmittedBy'
                      )?.translationId,
                      filterIncidentApprovalLabels,
                      i18n.language
                    )}{' '}
                    :
                  </FormLabel>
                  {/* <TextField
                  name="branchName"
                  style={{ width: '100%' }} // Make input fill grid item
                /> */}
                </StyledGridItem>
              )}

              {configs.IncidentApproval.find(
                (config) => config.name === 'DepartmentName'
              ) && (
                <StyledGridItem>
                  <FormLabel>
                    {getlabel(
                      filteredIncidentApprovalConfig.find(
                        (config) => config.name === 'DepartmentName'
                      )?.translationId,
                      filterIncidentApprovalLabels,
                      i18n.language
                    )}{' '}
                    :
                  </FormLabel>
                </StyledGridItem>
              )}

              {configs.IncidentApproval.find(
                (config) => config.name === 'Designation'
              ) && (
                <StyledGridItem>
                  <FormLabel>
                    {getlabel(
                      filteredIncidentApprovalConfig.find(
                        (config) => config.name === 'Designation'
                      )?.translationId,
                      filterIncidentApprovalLabels,
                      i18n.language
                    )}{' '}
                    :
                  </FormLabel>
                </StyledGridItem>
              )}
              {configs.IncidentApproval.find(
                (config) => config.name === 'SubmittedDate'
              ) && (
                <StyledGridItem>
                  <FormLabel>
                    {getlabel(
                      filteredIncidentApprovalConfig.find(
                        (config) => config.name === 'SubmittedDate'
                      )?.translationId,
                      filterIncidentApprovalLabels,
                      i18n.language
                    )}{' '}
                    :
                  </FormLabel>
                </StyledGridItem>
              )}
            </StyledGridContainer>
                </Box>
             
            </Accordion>

            {/* INCIDNT lEVEL */}

           

          </Box>
        </FlexContainer>
      </FlexContainer>

      {/* Below Div for PDF Print Content */}
      {/* <div ref={pdfSectionRef} id='pdfSectionRef' className="no-print" style={{ display: 'none'}} >
<>
  <img id="logo" src={Logo}  />
      </>
<IncidentDetailPdf approvalviewstatus={false} />

</div> */}
    </>
  );
};

export default ClosureEntry;
