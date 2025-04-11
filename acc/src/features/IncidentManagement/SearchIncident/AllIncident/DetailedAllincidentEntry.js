import { useState, useEffect, useRef } from 'react';
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
  TableContainer,
  Table,
  Paper,
  TableBody,
  IconButton,
  Tooltip,
  FormControl,
  Collapse,
} from '@mui/material';
import styled from 'styled-components';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import ArrowBackIcon from '../../../../assets/Icons/ArrowBackIcon.png';
import DoNotDisturbAltIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import SkipIcon from '../../../../assets/Icons/SkipIcon.png';
import FillIcon from '../../../../assets/Icons/FillIcon.png';
import ApproveIncidentIcon from '../../../../assets/Icons/ApproveIncidentIcon.png';
import RejectIcon from '../../../../assets/Icons/RejectIcon.png';
import MergeIcon from '../../../../assets/Icons/RejectIcon.png';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import SubmitTik from '../../../../assets/Icons/SubmitTik.png';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';
import IncidentDetailTable from '../../IncidentApproval/CompletedList/IncidentDetailTable';
import Label from '../../../../components/Label/Label';
import { TextField } from '../../../../components/TextField/TextField';
import AttachmentTable from '../../IncidentApproval/PendingList/AttachmentTable';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
  FormLabel,
} from '../../../../utils/DataTable.styled';
import { getlabel } from '../../../../utils/language';

// import IncidentDetails from '../../IncidentInvestigation/InvestigationPending/II_PL_IncidentDetails';

import IncidentDetails from '../../IncidentCommon/IncidentDetails';
import IncidentApprovalDetails from '../../IncidentCommon/IncidentApprovalDetails';
import { useGetReportIncidentQuery } from '../../../../redux/RTK/IncidentManagement/incidentApprovalApi';
import {
  useGetHistoryIncidentQuery,
  useDeleteIncidentMutation,
} from '../../../../redux/RTK/IncidentManagement/searchIncidentApi';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import CheckIcon from '@mui/icons-material/Check';
// import InfoIcon from '@mui/icons-material/Info';
// import SearchIcon from '@mui/icons-material/Search';
// import { useGetIncidentApprovalPendingQuery, useGetDownloadDataApprovalPendingQuery,useGetReportIncidentQuery } from '../../../../redux/RTK/IncidentManagement/incidentApprovalApi'
import IncidentHistory from '../../IncidentCommon/Datatable/II_PL_IncidentHistory';
import NotificationHistory from '../../IncidentCommon/Datatable/II_PL_NotificationHistory';
import zIndex from '@mui/material/styles/zIndex';
import Error from '../../../../assets/Gifs/error.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import { showSweetAlert, showToastAlert } from '../../../../utils/SweetAlert';
import Logo from '../../../../assets/Icons/Logo.png';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import IncidentDetailPdf from '../../IncidentCommon/Pdf Section/IncidentDetailPdf';
import { useGetIncidentDetailsPendingByIdQuery } from '../../../../redux/RTK/incidentInvestigationApi';

// Styled Components
const StyledGridContainer = styled(Grid)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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

export const StyledFormLabel = styled(Typography)`
  font-weight: 700 !important;
  color: #000;
`;

const DetailAllincidentTableEntry = () => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { id } = useParams();
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedDeleteType, setSelectedDeleteType] = useState(false);
  const [remarks, setRemarks] = useState('');
  const pdfSectionRef = useRef(null);

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
      fields: `RI_P_Day`,
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
      fieldId: `IA_P_Anyadditionalstaffyouwishtobenotified`,
      translationId: 'IM_IA_Anyadditionalstaffyouwishtobenotified',
      label: 'Any Additional Staff You Wish To Be Notified',
      name: 'anyAdditionalStaffYouWishToBeNotified',
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
    {
      fieldId: `RI_P_ImmediateActionTaken`,
      translationId: 'IM_RI_ImmediateActionTaken',
      label: 'Immediate Action Taken',
      name: 'immediateActionTaken',
    },
  ];

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
  ];

  const attachmentConfig = [
    {
      fieldId: `RI_P_Attachment`,
      translationId: 'IM_RI_Attachment(s)',
      label: 'Attachment(s)',
      name: 'attachment(s)',
    },
  ];

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
  ];
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
      translationId: 'IM_RI_StaffCategory',
      label: 'Staff Category',
      name: 'StaffCategory',
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
  ];

  const othersConfig = [
    {
      fieldId: `RI_O_OtherName`,
      translationId: 'IM_RI_OtherName',
      label: 'Other Name',
      name: 'OtherName',
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
  ];

  const IncidentApproval = [
    {
      fieldId: `IA_P_IncidentMainCategory`,
      translationId: 'IM_IA_IncidentMainCategory',
      label: 'Incident Main Category',
      name: 'IncidentMainCategory',
    },
    {
      fieldId: `IA_P_IncidentSubCategory`,
      translationId: 'IM_IA_IncidentSubCategory',
      label: 'Incident Sub Category',
      name: 'IncidentSubCategory',
    },
    {
      fields: `IA_P_IncidentDetails`,
      translationId: 'IM_IA_IncidentDetails',
      label: 'Incident Details',
      name: 'IncidentDetails',
    },
    {
      fieldId: `IA_P_IncidentType`,
      translationId: 'IM_IA_IncidentType',
      label: 'Incident Type',
      name: 'IncidentType',
    },
    {
      fieldId: `IA_P_Clinical/NonClinical`,
      translationId: 'IM_IA_Clinical/NonClinical',
      label: 'Clinical/Non-Clinical',
      name: 'Clinical/NonClinical',
    },
    {
      fieldId: `IA_P_IncidentDepartment`,
      translationId: 'IM_IA_IncidentDepartment',
      label: 'Incident Department',
      name: 'IncidentDepartment',
    },
    {
      fieldId: `IA_P_LocationDetails(Roomnoetc)`,
      translationId: 'IM_IA_LocationDetails(Roomnoetc)',
      label: 'Location Details/Room No etc',
      name: 'LocationDetails(Roomnoetc)',
    },
    {
      fieldId: `IA_P_HarmLevel`,
      translationId: 'IM_IA_HarmLevel',
      label: 'Harm Level',
      name: 'HarmLevel',
    },
    {
      fieldId: `IA_P_Anyadditionalstaffyouwishtobenotified`,
      translationId: 'IM_IA_Anyadditionalstaffyouwishtobenotified',
      label: 'Any Additional Staff You Wish To Be Notified',
      name: 'AnyAdditionalStaffYouWishToBeNotified',
    },
  ];
  const titleConfig = [
    {
      translationId: 'IM_RI_IncidentTitle',
      label: 'Incident Title',
      name: 'IncidentTitle',
    },
    {
      translationId: 'IM_RI_ImmediateActionTaken',
      label: 'Immediate Action Taken',
      name: 'ImmediateActionTaken',
    },
    {
      translationId: 'IM_RI_PersonInvolvedintheIncident',
      label: 'Person Involved in the Incident',
      name: 'PersonInvolvedintheIncident',
    },
    {
      translationId: 'IM_RI_Visitor',
      label: 'Visitor',
      name: 'Visitor',
    },
    {
      translationId: 'IM_RI_WitnessedBy',
      label: 'Witnessed By',
      name: 'WitnessedBy',
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
      translationId: 'IM_RI_Others',
      label: 'Others',
      name: 'Others',
    },
  ];

  const NotificationConfig = [
    {
      fieldId: `SI_NH_Task`,
      translationId: 'IM_SI_Task',
      label: 'Task',
      name: 'Task',
    },
    {
      fieldId: `SI_NH_MailSubject`,
      translationId: 'IM_SI_MailSubject',
      label: 'Mail Subject',
      name: 'MailSubject',
    },
    {
      fieldId: `SI_NH_MailId`,
      translationId: 'IM_SI_MailId',
      label: 'Mail Id',
      name: 'MailId',
    },
    {
      fieldId: `SI_NH_StaffName`,
      translationId: 'IM_SI_StaffName',
      label: 'User Name',
      name: 'UserName',
    },
    {
      fieldId: `SI_NH_Data_SubmittedBy`,
      translationId: 'IM_SI_Data_SubmittedBy',
      label: 'Data_Submitted By',
      name: 'SubmittedBy',
    },
    {
      fieldId: `SI_NH_SentDate&Time`,
      translationId: 'IM_SI_SentDate&Time',
      label: 'Sent Date & Time',
      name: 'SentDateTime',
    },
    {
      fieldId: `SI_NH_NotificationRemarks`,
      translationId: 'IM_SI_NotificationRemarks',
      label: 'Notification Remarks',
      name: 'Remarks',
    },
  ];

  const IncidentHistoryConfig = [
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
      name: 'ResponsibleStaff',
    },
    {
      fieldId: `SI_IH_Department`,
      translationId: 'IM_SI_IncidentDepartment',
      label: 'Incident Department',
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

  const HistoryTitle = [
    {
      translationId: 'IM_SI_NotificationHistory',
      label: 'Notification History',
      name: 'NotificationHistory',
    },
    {
      translationId: 'IM_SI_IncidentHistory',
      label: 'Incident History',
      name: 'IncidentHistory',
    },
  ];

  const { data: getReportIncident } = useGetHistoryIncidentQuery(
    {
      menuId: 25,
      loginUserId: 1,
      incidentId: id,
      moduleId: 2,
    },
    { skip: !id }
  );

  const { IncidentHistoryList, NotificationList, DeleteTypeList } =
    getReportIncident?.Data?.Result || {};

  const IncidntHistoryArray = IncidentHistoryList || {};
  const NotificationListArray = NotificationList || {};

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
    fieldsData?.Data?.Menus?.filter((item) => item.MenuId === 25) || [];

  const incidentLabels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 25)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'All')
        .flatMap((region) => region.Labels || [])
    );
  const filteredIncidentLabel = { Data: incidentLabels };

  const incidentApprovalLabels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 26)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'All')
        .flatMap((region) => region.Labels || [])
    );

  const Historylabels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 25)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'All')
        .flatMap((region) => region.Labels || [])
    );
  const HistoryfilterLabels = { Data: Historylabels };

  const filterIncidentApprovalLabels = { Data: incidentApprovalLabels };

  const filteredFieldsConfig = fieldsConfig.filter((field) =>
    incidentLabels.some((label) => label.TranslationId === field.translationId)
  );
  const filteredIncidentConfig = incidentConfig.filter((field) =>
    incidentLabels.some((label) => label.TranslationId === field.translationId)
  );

  const filteredAdditionalConfig = additionalConfig.filter((field) =>
    incidentLabels.some((label) => label.TranslationId === field.translationId)
  );
  const filteredIncidentApprovalConfig = IncidentApproval.filter((field) =>
    incidentApprovalLabels.some(
      (label) => label.TranslationId === field.translationId
    )
  );
  const filteredTitleConfig = titleConfig.filter((field) =>
    incidentLabels.some((label) => label.TranslationId === field.translationId)
  );

  // Get Reoprt Incident
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    regionCode,
  } = useSelector((state) => state.auth);

  const { data: recordss = [], isFetching: isRecordFetching } =
    useGetReportIncidentQuery({
      moduleId: 2,
      menuId: 26,
      incidentId: id,
      loginUserId: userDetails?.UserId,
    });

  const [configs, setConfigs] = useState({
    IncidentHistoryConfig,
    NotificationConfig,
  });

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleDeleteCloseDialog = () => {
    setOpenDeleteDialog(false);
  };

  useEffect(() => {
    if (fields?.length > 0) {
      const matchingSections = fields[0]?.Sections?.filter(
        (section) =>
          section.SectionName === 'Notification History' ||
          section.SectionName === 'Incident History'
      );

      const pageFields = matchingSections?.flatMap(
        (section) =>
          section?.Regions?.find((region) => region.RegionCode === 'All')
            ?.Fields || []
      );

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
  }, [fields[0]]);

  const [triggerDeleteIncident] = useDeleteIncidentMutation();

  const handleSubmit = async () => {
    if (!selectedDeleteType || !remarks) {
      setOpenDeleteDialog(false);
      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: 'Fill all fields to submit',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
        zIndex: '3000',
      });
      return;
    }

    const selectedDeleteTypeData = DeleteTypeList.find(
      (item) => item.SpecificTableRecordId === selectedDeleteType
    );

    const payload = {
      headerFacilityId: selectedFacility?.id,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
      remarks: remarks,
      deleteTypeList: {
        task: selectedDeleteTypeData.task,
        IncidentStatus: selectedDeleteTypeData.IncidentStatus,
        SpecificTableRecordId: selectedDeleteTypeData.SpecificTableRecordId,
        IncidentId: selectedDeleteTypeData.IncidentId,
      },
    };

    try {
      const response = await triggerDeleteIncident(payload).unwrap();
      setOpenDeleteDialog(false);
      if (response && response.Data) {
        showToastAlert({
          type: 'custom_success',
          text: response.Message || 'Deleted successfully!',
          gif: SuccessGif,
        });
        navigate('/IncidentManagement/SearchIncident');
      }
    } catch (error) {
      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: error.data,
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
    }
  };

  const { data: incidentData, isFetching: isFetchingData } =
    useGetIncidentDetailsPendingByIdQuery(
      {
        menuId: 24,
        loginUserId: 1,
        incidentId: id,
        moduleId: 2,
      },
      { skip: !id }
    );
  const { reportIncident, incidentStaffInvolved, incidentPatientInvolved } =
    incidentData?.Data || {};

  var reportIncidentSafe = reportIncident || {};

  const htmlToText = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const extractText = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim();
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const nodeName = node.nodeName.toLowerCase();
        const childTexts = Array.from(node.childNodes)
          .map((child) => extractText(child))
          .filter((text) => text.length > 0)
          .join(' ');

        switch (nodeName) {
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
            return `\n\n${childTexts.toUpperCase()}\n\n`;
          case 'p':
            return `\n${childTexts}\n`;
          case 'ul':
            return `\n${childTexts}\n`;
          case 'li':
            return `\n• ${childTexts}`;
          case 'br':
            return '\n';
          case 'strong':
          case 'b':
            return `**${childTexts}**`;
          case 'em':
          case 'i':
            return `_${childTexts}_`;
          case 'a':
            return `[${childTexts}](${node.href})`;
          default:
            return childTexts;
        }
      }
      return '';
    };

    return extractText(tempDiv)
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const handlePrint = () => {
    try {
      const doc = new jsPDF('p', 'pt', 'a4');
      const pdfFileName = 'AllIncident.pdf';
      const margin = 40;
      let isFirstPage = true;
      let currentPage = 1;
      let totalPages = 0;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      const logoWidth = 40;
      const logoHeight = 40;
      const headerY = margin + 10;
      const footerY = pageHeight - margin - 15;

      const addHeaderFooter = (data) => {
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const headerY = margin + 10;
        const footerY = pageHeight - margin - 15;

        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(
          margin,
          margin,
          pageWidth - 2 * margin,
          pageHeight - 2 * margin
        );

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);

        const logoX = margin + 10;
        const logoY = headerY + 5;

        const incidentIdX = pageWidth - margin - 200;
        const incidentIdY = logoY + logoHeight / 2;

        const tableStartY = headerY + logoHeight + 30;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        doc.text(``, margin + 5, footerY);

        doc.setLineWidth(0.5);
        doc.line(margin, footerY - 20, pageWidth - margin, footerY - 20);
      };

      const tables = pdfSectionRef.current?.querySelectorAll('table') || [];
      let startY = headerY + logoHeight + 30;

      // Define inner margins to keep tables from touching the border
      const innerMargin = 10;
      const effectiveMargin = margin + innerMargin;
      const effectiveWidth = pageWidth - 2 * effectiveMargin;

      tables.forEach((table) => {
        const tableText = htmlToText(table.innerHTML);
        const tableConfig = {
          html: table,
          startY,
          theme: 'grid',
          margin: {
            left: effectiveMargin,
            right: effectiveMargin,
            top: 150,
            bottom: 100,
          },
          tableWidth: effectiveWidth,
          pageBreak: 'auto',
          didDrawPage: addHeaderFooter,
          styles: {
            fontSize: 10,
            cellPadding: 4,
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
            overflow: 'linebreak',
          },
        };

        switch (table.id) {
          case 'textTable':
            Object.assign(tableConfig, {
              headStyles: {
                fillColor: [192, 192, 192],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'center',
                cellPadding: 8,
                fontSize: 12,
              },
              columnStyles: {
                cellPadding: 1,
              },
              bodyStyles: {
                textColor: [0, 0, 0],
              },
              didParseCell: (data) => {
                if (data.cell.raw.classList.contains('bold-cell')) {
                  data.cell.styles.textColor = [0, 0, 0];
                  data.cell.styles.fontStyle = 'bold';
                }
              },
            });
            break;

          case 'Approval':
            Object.assign(tableConfig, {
              headStyles: {
                fillColor: [192, 192, 192],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'center',
              },
              styles: {
                fontSize: 10,
                cellPadding: 10,
                lineColor: [0, 0, 0],
                overflow: 'linebreak',
                textColor: [0, 0, 0],
                lineWidth: 0,
                align: 'left',
              },
              didParseCell: (data) => {
                if (data.cell.raw.classList.contains('bold-cell')) {
                  data.cell.styles.textColor = [0, 0, 0];
                  data.cell.styles.fontStyle = 'bold';
                }
              },
            });
            break;

          case 'IntroContainer':
            Object.assign(tableConfig, {
              headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'left',
                lineWidth: 0,
              },
              styles: {
                fontSize: 10,
                cellPadding: 10,
                overflow: 'linebreak',
                textColor: [0, 0, 0],
                lineWidth: 0,
                halign: 'left',
              },
              tableLineWidth: 0,
              didParseCell: (data) => {
                if (data.row.index === 0) {
                  data.cell.styles.fontStyle = 'bold';
                }
              },
            });
            break;

          case 'table':
            const space = doc.lastAutoTable.finalY + 5;
            Object.assign(tableConfig, {
              padding: 100,
              headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'center',
                lineWidth: 0.5,
                lineColor: [0, 0, 0],
              },
              style: {
                padding: 40,
              },
              bodyStyles: {
                halign: 'center',
                lineWidth: 0.5,
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              alternateRowStyles: {
                fillColor: [255, 255, 255],
              },
              columnStyles: {
                0: { cellWidth: 'auto' },
              },
              startY: space,
            });
            break;

          case 'Container':
            Object.assign(tableConfig, {
              headStyles: {
                fillColor: [192, 192, 192],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'center',
                lineColor: [255, 255, 255],
                lineWidth: 0,
              },
              styles: {
                fontSize: 10,
                cellPadding: 10,
                lineColor: [255, 255, 255],
                overflow: 'linebreak',
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                lineWidth: 0,
                halign: 'left',
              },
              tableLineWidth: 0.5,
              tableLineColor: [0, 0, 0],
              didParseCell: (data) => {
                if (data.cell.raw.classList.contains('bold-cell')) {
                  data.cell.styles.textColor = [0, 0, 0];
                  data.cell.styles.fontStyle = 'bold';
                }
              },
              didDrawPage: (data) => {
                const doc = data.doc;
                const pageWidth = doc.internal.pageSize.width;
                const pageHeight = doc.internal.pageSize.height;
                const margin = 10;

                doc.setLineWidth(0.5);
                doc.setDrawColor(0, 0, 0);
                doc.rect(
                  margin,
                  margin,
                  pageWidth - 2 * margin,
                  pageHeight - 2 * margin
                );
              },
            });

          //  case 'Patient':
          //    Object.assign(tableConfig, {
          //      headStyles: {
          //        fillColor: [192, 192, 192],
          //        textColor: [0, 0, 0],
          //        fontStyle: 'bold',
          //        halign: 'center',
          //      },
          //      styles: {
          //        fontSize: 10,
          //        cellPadding: 10,
          //        textColor: [0, 0, 0],
          //        lineWidth: 0,
          //        align: 'left',
          //      },
          //      didParseCell: (data) => {
          //        if (data.cell.raw.classList.contains('bold-cell')) {
          //          data.cell.styles.textColor = [0, 0, 0];
          //          data.cell.styles.fontStyle = 'bold';
          //        }
          //      },
          //      didDrawPage: addHeaderFooter,
          //      didDrawCell: (data) => {
          //        const { doc, table, row } = data;

          //        const currentPatientID =
          //          table.body[row.index]?.raw?.dataset?.patientId;
          //        const nextPatientID =
          //          table.body[row.index + 1]?.raw?.dataset?.patientId;

          //        if (
          //          currentPatientID &&
          //          (!nextPatientID || currentPatientID !== nextPatientID)
          //        ) {
          //          const startX = table.settings.margin.left;
          //          const endX =
          //            doc.internal.pageSize.width - table.settings.margin.right;
          //          const lineY = data.cursor.y + 5;

          //          doc.setLineWidth(0.5);
          //          doc.line(startX, lineY, endX, lineY);
          //        }
          //      },
          //    });

          //    doc.autoTable(tableConfig);
          //    break;

          case 'MainTitle':
            const startY = doc.lastAutoTable.finalY + 5;
            Object.assign(tableConfig, {
              headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'left',
                cellPadding: 8,
                lineWidth: 0,
              },
              styles: {
                fontSize: 12,
                cellPadding: 2,
                lineWidth: 0,
              },
              bodyStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'left',
              },
              startY: startY,
            });
            break;

          default:
            Object.assign(tableConfig, {
              headStyles: { fillColor: [255, 255, 255] },
            });
        }

        doc.autoTable(tableConfig);
        startY = doc.lastAutoTable.finalY + 20;
      });

      totalPages = doc.internal.pages.length;

      for (let i = 1; i <= totalPages - 1; i++) {
        const page = doc.internal.pages[i];
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const footerY = pageHeight - margin - 15;

        const logoWidth = 150;
        const logoHeight = 40;
        const logoX = margin + 10;
        const logoY = headerY + 5;

        const imgElement = document.getElementById('logo');
        const logoSrc = imgElement.src;

        doc.addImage(logoSrc, 'PNG', logoX, logoY, logoWidth, logoHeight);

        const facilityNameX = pageWidth - margin - 20;
        const facilityNameY = logoY + 15;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(
          `${reportIncidentSafe.FacilityName}`,
          facilityNameX,
          facilityNameY,
          { align: 'right' }
        );

        const incidentIdY = facilityNameY + 25;
        doc.text(
          `Incident No: ${reportIncidentSafe.IncidentNo}`,
          facilityNameX,
          incidentIdY,
          { align: 'right' }
        );

        const linePadding = 20;

        const headerBottomY = incidentIdY + 10;
        doc.setLineWidth(0.5);
        doc.line(
          margin + linePadding,
          headerBottomY,
          pageWidth - margin - linePadding,
          headerBottomY
        );

        doc.setPage(i);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Page ${i} of ${totalPages - 1}`,
          pageWidth - margin - 25,
          footerY,
          { align: 'right' }
        );
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text(`Confidential Information`, pageWidth / 2, footerY, {
          align: 'center',
        });
      }

      doc.save(pdfFileName);
    } catch (error) {
      console.error('PDF generation error:', error);
    }
  };

  return (
    <FlexContainer style={{ flexDirection: 'column', width: '100%' }}>
      <FlexContainer
        marginBottom={'30px'}
        marginTop={'65px'}
        justifyContent={'space-between'}
        style={{ paddingBottom: '15px' }}
      >
        <StyledTypography
          fontSize="30px"
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('MM_SM_IncidentSearch')}
        </StyledTypography>
      </FlexContainer>

      <FlexContainer style={{ backgroundColor: '#fff' }}>
        <Box p={3} paddingTop={0} style={{ width: '-webkit-fill-available' }}>
          {/* Incident Detail */}

          <FlexContainer
            style={{
              padding: '20px 15px',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <FlexContainer>
              <button
                style={{
                  backgroundColor: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '8px 16px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px',
                  display: 'block',
                  fontSize: '13px',
                }}
                onClick={() => navigate('/IncidentManagement/SearchIncident')}
              >
                « Previous
              </button>

              {/* <StyledTypography
                fontSize="20px"
                fontWeight="600"
                lineHeight="24px"
                textAlign="left"
                color="#205475"
              >
                {t('MM_IncidentApproval')}
              </StyledTypography> */}
            </FlexContainer>

            <StyledImage
              height="40px"
              width="40px"
              gap="10px"
              cursor="pointer"
              borderRadius="40px"
              src={PrintFileIcon}
              alt="Print"
              animate={true}
              onClick={handlePrint}
            />
          </FlexContainer>

          <IncidentDetails />

          {/* Incident Approval Detail Section */}

          <IncidentApprovalDetails />

          <StyledFormLabel style={{ margin: '10px 0px 10px 0px' }}>
            {getlabel(
              HistoryTitle.find((config) => config.name === 'IncidentHistory')
                ?.translationId,
              HistoryfilterLabels,
              i18n.language
            )}
            :
          </StyledFormLabel>
          <IncidentHistory
            columns={configs.IncidentHistoryConfig}
            labels={HistoryfilterLabels}
            data={getReportIncident?.Data.Result.IncidentHistoryList}
          />

          <>
            <StyledFormLabel style={{ margin: '10px 0px 10px 0px' }}>
              {getlabel(
                HistoryTitle.find(
                  (config) => config.name === 'NotificationHistory'
                )?.translationId,
                HistoryfilterLabels,
                i18n.language
              )}
              :
            </StyledFormLabel>
            <NotificationHistory
              columns={configs.NotificationConfig}
              labels={HistoryfilterLabels}
              data={getReportIncident?.Data.Result.NotificationList}
            />
          </>

          {regionCode !== 'ABD' && (
            <FlexContainer
              padding="0px"
              justifyContent="center"
              alignItems="center"
              gap="20px"
              marginTop="20px"
            >
              {/* Submit Button */}
              <ActionButton
                style={{
                  backgroundColor: '#337ab7',
                  color: 'white',
                  padding: '10px',
                }}
                startIcon={
                  <i
                    className="fas fa-trash"
                    style={{ marginInlineEnd: 8, fontSize: 14 }}
                  />
                }
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                {t('DELETE')}
              </ActionButton>
            </FlexContainer>
          )}
        </Box>
      </FlexContainer>

      <div>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          sx={{
            '& .MuiDialog-paper': {
              width: '400px',
              padding: '20px',
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '2rem',
              color: '#575757',
            }}
          >
            Confirm to Delete?
          </DialogTitle>
          <DialogActions sx={{ justifyContent: 'center', gap: 3 }}>
            <ActionButton
              onClick={handleCloseDialog}
              sx={{
                backgroundColor: 'white',
                color: 'black !important',
                border: '1px solid #1976d2',
                '&:hover': {
                  backgroundColor: 'white',
                },
              }}
              startIcon={
                <i
                  className="fas fa-ban"
                  style={{
                    color: '#1976d2',
                    marginInlineEnd: 8,
                    fontSize: '16px',
                  }}
                />
              }
            >
              Cancel
            </ActionButton>
            <ActionButton
              onClick={() => {
                setOpenDeleteDialog(true);
                setOpenDialog(false);
              }}
              sx={{
                backgroundColor: '#3085d6',
                color: '#fff',
                fontWeight: '600',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: '#2672b5',
                },
              }}
            >
              Yes
            </ActionButton>
          </DialogActions>
        </Dialog>
      </div>

      <div>
        <Dialog
          open={openDeleteDialog}
          onClose={handleDeleteCloseDialog}
          sx={{
            '& .MuiDialog-paper': {
              width: '100%',
              position: 'relative',
            },
          }}
          style={{
            border: 'solid',
            borderColor: 'black',
            borderRadius: '20px',
          }}
        >
          <button
            onClick={handleDeleteCloseDialog}
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

          <DialogTitle
            sx={{
              // textAlign: 'center',
              fontWeight: '600',
              fontSize: '1.5rem',
              color: '#fff',
              backgroundColor: '#0264AB',
              padding: '10px',
            }}
          >
            Delete Confirmation
          </DialogTitle>

          <DialogContent sx={{ marginTop: 2 }}>
            {/* Delete Type Dropdown */}
            <FormLabel
              sx={{
                fontSize: '1rem',
                fontWeight: '600',
                color: 'black',
                marginBottom: '8px',
              }}
            >
              Delete Type
              {<span style={{ color: 'red' }}> *</span>}
            </FormLabel>
            <Dropdown
              name="deleteType"
              options={
                DeleteTypeList?.map((data) => ({
                  value: data.SpecificTableRecordId,
                  text: data.Task,
                })) || []
              }
              onChange={(event) => {
                setSelectedDeleteType(event.target.value);
              }}
              value={selectedDeleteType || null}
              renderOption={(props, option) => (
                <li key={option.value} {...props}>
                  {option.text}
                </li>
              )}
            />

            <FormLabel
              sx={{
                fontSize: '1rem',
                fontWeight: '600',
                color: 'black',
                marginBottom: '8px',
                marginTop: '20px',
              }}
            >
              Remarks
              {<span style={{ color: 'red' }}> *</span>}
            </FormLabel>
            <TextField
              fullWidth
              multiline
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: '150px',
                  alignItems: 'flex-start',
                },
                '& .MuiInputBase-input': {
                  height: '100%',
                  overflow: 'auto',
                },
              }}
            />
          </DialogContent>

          <DialogActions
            sx={{
              justifyContent: 'center',
              gap: 3,
              marginTop: 3,
              marginBottom: 3,
            }}
          >
            <ActionButton
              style={{
                backgroundColor: '#1976d2',
                color: 'white',
              }}
              startIcon={<CheckIcon sx={{ fontSize: 18, mr: 0.5 }} />}
              onClick={handleSubmit}
            >
              {t('Submit')}
            </ActionButton>

            <ActionButton
              onClick={handleDeleteCloseDialog}
              sx={{
                backgroundColor: 'white',
                color: 'black !important',
                border: '1px solid #1976d2',
                '&:hover': {
                  backgroundColor: 'white',
                },
              }}
              startIcon={
                <i
                  className="fas fa-ban"
                  style={{
                    color: '#1976d2',
                    marginInlineEnd: 8,
                    fontSize: '16px',
                  }}
                />
              }
            >
              {t('Cancel')}
            </ActionButton>
          </DialogActions>
        </Dialog>
      </div>
      <div
        ref={pdfSectionRef}
        id="pdfSectionRef"
        className="no-print"
        style={{ display: 'none' }}
      >
        <>
          <img id="logo" src={Logo} />
        </>
        <IncidentDetailPdf
          approvalviewstatus={true}
          investigationView={true}
          RCAView={true}
          closureView={true}
          searchView={true}
        />
      </div>
    </FlexContainer>
  );
};

export default DetailAllincidentTableEntry;
