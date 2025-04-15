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
import { showSweetAlert, showToastAlert } from '../../../../utils/SweetAlert';
import Error from '../../../../assets/Gifs/error.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import { useTranslation } from 'react-i18next';
import IncidentDetailTable from '../../IncidentApproval/CompletedList/IncidentDetailTable';
import Dropdown from '../../../../components/Dropdown/Dropdown';
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
import { Formik, Form } from 'formik';

import IncidentDetails from '../../IncidentCommon/IncidentDetails';
import SearchIcon from '@mui/icons-material/Search';
import {
  useSkipInvestigationMutation,
  useFillRCAMutation,
  useGetReportIncidentPageloadQuery,
  useGetApprovalEntryDataQuery,
  useAssignInvestigatorMutation,
  useOpinionMutation,
  useGetPageLoadDataQuery,
} from '../../../../redux/RTK/IncidentManagement/incidentApprovalApi';
import MergeIncident from './MergeIncident';
import RequestInformation from './RequestInformation';
import RejectIncident from './RejectIncident';
import { ConnectingAirportsOutlined } from '@mui/icons-material';
import ApproveIncidentAndAssign from './ApproveIncidentAndAssign';
import OpinionExchanged from './OpinionExchanged';
import AdditionalStafftable from './AdditionalStafftable';
import { fontSize } from '@mui/system';
import Incidentcategorylist from './Incidentcategorylist';
import AffectedCategory from './affectedCategoryList';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import IncidentDetailPdf from '../../IncidentCommon/Pdf Section/IncidentDetailPdf';
import { useGetIncidentDetailsPendingByIdQuery } from '../../../../redux/RTK/incidentInvestigationApi';
import Logo from '../../../../assets/Icons/Logo.png';

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

const PendingApproval = () => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');

  const [selectedAction, setSelectedAction] = useState('');
  const [triggerSkipInvestigation] = useSkipInvestigationMutation();
  const [triggerFillRCA] = useFillRCAMutation();
  const [triggerAssigninvestigator] = useAssignInvestigatorMutation();
  const [triggerOpinion] = useOpinionMutation();

  const [categorylist, setCategorylist] = useState([]);
  const [selectedAffectedCategory, setSelectedAffectedCategory] = useState('');

  // Get Reoprt Incident
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
  } = useSelector((state) => state.auth);

  const regionCode = useSelector((state) =>
    state.auth.regionCode?.toUpperCase()
  );
  const [isIncidentCategoryModel, setIsIncidentCategoryModel] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [assigninvestigators, setAssigninvestigators] = useState([]);
  const [opinions, setOpinions] = useState([]);
  const sectionRef = useRef();
  const [searchQuery, setSearchQuery] = useState('');

  // Accordians
  const [showMergeAccordion, setshowMergeAccordion] = useState(false);

  const [openSkillPopup, setOpenSkillPopup] = useState(false);
  const [openRCAPopup, setOpenRCAPopup] = useState(false);

  const { data: entrydetails = [], isFetching: isEntrydetails } =
    useGetApprovalEntryDataQuery({
      incidentId: id,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
    });

  const entryData = entrydetails?.Data;

  const [additionalselectedValue, setAdditionalSelectedValue] = useState(
    entrydetails?.Data?.AdditionalStaffNotify || 'No'
  );
  const [selectedClinicalValue, setSelectedClinicalValue] = useState(
    entrydetails?.Data?.ClinicalType || 'Clinical'
  );
  const [incidentMainCategory, setIncidentMainCategory] = useState({
    id: '',
    name: '',
  });
  const [incidentSubCategory, setIncidentSubCategory] = useState({
    id: '',
    name: '',
  });
  const [incidentDetails, setIncidentDetails] = useState({ id: '', name: '' });
  const [MainCategoryCode, setMainCategoryCode] = useState({
    id: '',
    name: '',
  });
  const [SubCategoryCode, setSubCategoryCode] = useState({ id: '', name: '' });
  const [CategoryDetailsCode, setCategoryDetailsCode] = useState({
    id: '',
    name: '',
  });
  const [AffectedCategoryCode, setAffectedCategoryCode] = useState({
    id: '',
    name: '',
  });
  const [AffectedCategoryName, setAffectedCategoryName] = useState({
    id: '',
    name: '',
  });
  const [CategoryDetails, setCategoryDetails] = useState({ id: '', name: '' });
  const [incidentType, setIncidentType] = useState({ id: '', name: '' });
  const [incidentDepartment, setIncidentDepartment] = useState({
    id: '',
    name: '',
  });
  const [harmLevel, setHarmLevel] = useState({ id: '', name: '' });
  const [SLAPriority, setSLAPriority] = useState({ id: '', name: '' });

  const [locationDetails, setLocationDetails] = useState('');

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
      fieldId: `IA_P_AffectedCategory`,
      translationId: 'IM_IA_AffectedCategory',
      label: 'AffectedCategory',
      name: 'AffectedCategory',
      IsMandatory: true,
    },
    {
      fieldId: `IA_P_AffectedCategoryCode`,
      translationId: 'IM_IA_AffectedCategoryCode',
      label: 'AffectedCategoryCode',
      name: 'AffectedCategoryCode',
      IsMandatory: true, 
    },
    {
      fieldId: `IA_P_IncidentMainCategory`,
      translationId: 'IM_IA_IncidentMainCategory',
      label: 'Incident Main Category',
      name: 'IncidentMainCategory',
      IsMandatory: true, 
    },
    {
      fieldId: `IA_P_MainCategoryCode`,
      translationId: 'IM_IA_MainCategoryCode',
      label: 'Main Category Code',
      name: 'MainCategoryCode',
      IsMandatory: true, 
    },
    {
      fieldId: `IA_P_IncidentSubCategory`,
      translationId: 'IM_IA_IncidentSubCategory',
      label: 'Incident Sub Category',
      name: 'IncidentSubCategory',
      IsMandatory: true, 
    },
    {
      fieldId: `IA_P_SubCategoryCode`,
      translationId: 'IM_IA_SubCategoryCode',
      label: 'SubCategoryCode',
      name: 'SubCategoryCode',
      IsMandatory: true, 
    },
    {
      fields: `IA_P_IncidentDetails`,
      translationId: 'IM_IA_IncidentDetails',
      label: 'Incident Details',
      name: 'IncidentDetails',
      IsMandatory: true, 
    },
    {
      fieldId: `IA_P_IncidentType`,
      translationId: 'IM_IA_IncidentType',
      label: 'Incident Type',
      name: 'IncidentType',
      IsMandatory: true, 
    },
    {
      fieldId: `IA_P_IncidentDetailsCode`,
      translationId: 'IM_IA_IncidentDetailsCode',
      label: 'IncidentDetailsCode',
      name: 'IncidentDetailsCode',
      IsMandatory: true, 
    },
    {
      fieldId: `IA_P_Clinical/NonClinical`,
      translationId: 'IM_IA_Clinical/NonClinical',
      label: 'Clinical/Non-Clinical',
      name: 'Clinical/NonClinical',
      IsMandatory: true, 
    },
    {
      fieldId: `IA_P_IncidentDepartment`,
      translationId: 'IM_IA_IncidentDepartment',
      label: 'Incident Department',
      name: 'IncidentDepartment',
      IsMandatory: true, 
    },
    {
      fieldId: `IA_P_LocationDetails(Roomnoetc)`,
      translationId: 'IM_IA_LocationDetails(Roomnoetc)',
      label: 'Location Details/Room No etc',
      name: 'LocationDetails(Roomnoetc)',
      IsMandatory: true, 
    },
    {
      fieldId: `IA_P_HarmLevel`,
      translationId: 'IM_IA_HarmLevel',
      label: 'Harm Level',
      name: 'HarmLevel',
      IsMandatory: true, 
    },
    {
      fieldId: `IA_P_SLAPriority`,
      translationId: 'IM_IA_SLAPriority',
      label: 'SLA Priority',
      name: 'SLAPriority',
      IsMandatory: true, 

    },
    {
      fieldId: `IA_P_Anyadditionalstaffyouwishtobenotified`,
      translationId: 'IM_IA_Anyadditionalstaffyouwishtobenotified',
      label: 'Any Additional Staff You Wish To Be Notified',
      name: 'AnyAdditionalStaffYouWishToBeNotified',
      IsMandatory: true, 
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

  const assignInvestigatorsLabels = [
    {
      fieldId: `IA_AIaaI_StaffName`,
      translationId: 'IM_IA_StaffName',
      label: 'StaffName',
      name: 'StaffName',
    },
    {
      fieldId: `IA_AIaaI_Department`,
      translationId: 'IM_IA_Department',
      label: 'Department',
      name: 'Department',
    },
    {
      fieldId: `IA_AIaaI_Designation`,
      translationId: 'IM_IA_Designation',
      label: 'Designation',
      name: 'Designation',
    },

    {
      fieldId: `IA_AIaaI_InvestigationComments`,
      translationId: 'IM_IA_InvestigationComments',
      label: 'InvestigationComments',
      name: 'InvestigationComments',
    },
  ];

  const additionalstaffLabels = [
    {
      fieldId: `IA_AIaaI_StaffName`,
      translationId: 'IM_IA_StaffName',
      label: 'StaffName',
      name: 'StaffName',
    },
    {
      fieldId: `IA_AIaaI_Department`,
      translationId: 'IM_IA_Department',
      label: 'Department',
      name: 'Department',
    },
    {
      fieldId: `IA_AIaaI_Designation`,
      translationId: 'IM_IA_Designation',
      label: 'Designation',
      name: 'Designation',
    },
  ];

  const requiredFields = [
    "mainCategoryId",
    "mainCategory",
    "subCategoryId",
    "subCategory",
    "incidentDetailId",
    "incidentDetail",
    "departmentId",
    "departmentName",
    "incidentHarmLevelId",
    "incidentHarmLevel",
    "incidentId",
    "approverUserId",
    "incidentTypeId",
    "incidentType",
    "clinicalType",
    "slaPriority",
    "locationDetials",
  ];
    

  const { data: labelsData = [], isFetching: isLabelsFetching } =
    useGetLabelsQuery({
      menuId: 26,
      moduleId: 2,
    });
  const { data: fieldsData = [], isFetching: isFieldsFetching } =
    useGetFieldsQuery({
      menuId: 26,
      moduleId: 2,
    });

  const incidentLabels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 24)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'ALL')
        .flatMap((region) => region.Labels || [])
    );
  const filteredIncidentLabel = { Data: incidentLabels };

  const incidentApprovalLabels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 26)
    .flatMap((item) =>
      (item.Regions || [])
        .filter(
          (region) =>
            region.RegionCode === 'ALL' || region.RegionCode === regionCode
        )
        .flatMap((region) => region.Labels || [])
    );

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

  const handleSearch = () => {
    setIsIncidentCategoryModel(true);
  };

  const handleClose = () => {
    setIsIncidentCategoryModel(false);
  };

  const handleSelectRow = (incident) => {
    setIncidentMainCategory({
      id: incident.MainCategoryId,
      name: incident.MainCategory,
    });
    setIncidentSubCategory({
      id: incident.SubCategoryId,
      name: incident.SubCategory,
    });
    setIncidentDetails({
      id: incident.IncidentDetailId,
      name: incident.IncidentDetail,
    });

    handleClose();
  };
  const handleABDSelectRow = (incident) => {
    setIncidentMainCategory({
      id: incident.MainCategoryId,
      name: incident.MainCategory,
    });
    setMainCategoryCode({
      id: incident.MainCategoryId,
      name: incident.MainCategoryCode,
    });
    setIncidentSubCategory({
      id: incident.SubCategoryId,
      name: incident.SubCategory,
    });
    setSubCategoryCode({
      id: incident.SubCategoryId,
      name: incident.SubCategoryCode,
    });
    setCategoryDetails({
      id: incident.IncidentDetailId,
      name: incident.IncidentDetail,
    });
    setCategoryDetailsCode({
      id: incident.IncidentDetailId,
      name: incident.IncidentDetailCode,
    });

    handleClose();
    setSelectedAffectedCategory('');
  };

  const handleChange = (selectedOption) => {
    if (!selectedOption) {
      console.error('Dropdown change event is undefined!');
      return;
    }

    const selectedKey = selectedOption?.target?.value || selectedOption?.key;
    setSelectedAction(selectedKey);

    if (selectedKey === 'skip') {
      setOpenSkillPopup(true);
    } else if (selectedKey === 'fill') {
      setOpenRCAPopup(true);
    }
  };

  const typeChange = (event) => {
    const selectedId = event?.target?.value || event?.key;
    const selectedItem = pageloadData?.Data?.IncidentTypeList?.find(
      (item) => Number(item.IncidentTypeId) === Number(selectedId)
    );
    if (selectedItem) {
      setIncidentType({
        id: selectedItem.IncidentTypeId,
        name: selectedItem.IncidentTypeName,
      });
    }
  };

  const departmentChange = (event) => {
    const selectedId = event?.target?.value || event?.key;
    const selectedItem = pageloadData?.Data?.DepartmentList?.find(
      (item) => Number(item.DepartmentId) === Number(selectedId)
    );
    if (selectedItem) {
      setIncidentDepartment({
        id: selectedItem.DepartmentId,
        name: selectedItem.DepartmentName,
      });
    }
  };

  const handleLocationChange = (event) => {
    setLocationDetails(event.target.value);
  };

  const harmLevelChange = (event) => {
    const selectedId = event?.target?.value || event?.key;
    const selectedItem = pageloadData?.Data?.HarmLevelList?.find(
      (item) => Number(item.IncidentHarmLevelId) === Number(selectedId)
    );
    if (selectedItem) {
      setHarmLevel({
        id: selectedItem.IncidentHarmLevelId,
        name: selectedItem.IncidentHarmLevel,
      });
    }
  };

  const SLAPriorityChange = (event) => {
    const selectedId = event?.target?.value || event?.key;
    const selectedItem = ApprovalpageloadData?.Data?.SLAPriority?.find(
      (item) => item.ListOfValue === selectedId
    );
    if (selectedItem) {
      setSLAPriority({
        id: selectedItem.ListOfValue,
        name: selectedItem.ListOfValue,
      });
    }
  };

  const updateTableData = (updatedData) => {
    const investigatorList = updatedData.map((item) => ({
      userId: item.UserId,
      comments: item.Comments,
    }));
    setAssigninvestigators(investigatorList);
    setTableData(updatedData);
  };

  const updateOpinionData = (updatedData) => {
    const investigatorList = updatedData.map((item) => ({
      userId: item.UserId,
      comments: item.Comments,
    }));
    setOpinions(investigatorList);
  };

  const handleSkilCancel = () => {
    setOpenSkillPopup(false);
  };

  const handleSkipSubmit = async (values) => {
    setOpenSkillPopup(false);

    const missingFields = requiredFields.filter(field => !common_data[field]);

    if (missingFields.length > 0) {
      showSweetAlert({
        type: 'warning',
        title: 'Missing Data',
        text: `Mandatory fields cannot be empty`,
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      return; 
    }
  
    try {
      const response = await triggerSkipInvestigation({
        payload: {
          ...common_data,
          approverStatus: 'Skipped Investigation',
        },
      }).unwrap();

      showToastAlert({
        type: 'custom_success',
        text: response.Message,
        gif: SuccessGif,
      });
      setMessage(response.Message);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      navigate('/IncidentManagement/IncidentApproval');
    } catch (error) {
      if (error && error.data) {
        showSweetAlert({
          type: 'warning',
          title: 'Oops!',
          text: error.data,
          gif: Error,
          showConfirmButton: true,
          confirmButtonText: 'Close',
        });
        setColor('#e63a2e');
        setMessage('Upload Failed');
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    }
  };

  const handleRCACancel = () => {
    setOpenRCAPopup(false);
  };

  const handleRCASubmit = async (values) => {
    setOpenRCAPopup(false);

    const missingFields = requiredFields.filter(field => !common_data[field]);
    if (missingFields.length > 0) {
      showSweetAlert({
        type: 'warning',
        title: 'Missing Data',
        text: `Mandatory fields cannot be empty`,
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      return; 
    }
    try {
      const response = await triggerFillRCA({
        payload: {
          ...common_data,
          approverStatus: 'Fill RCA',
        },
      }).unwrap();

      showToastAlert({
        type: 'custom_success',
        text: response.Message,
        gif: SuccessGif,
      });
      setMessage(response.Message);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      navigate('/IncidentManagement/RootCauseAnalysis');
    } catch (error) {
      if (error && error.data) {
        showSweetAlert({
          type: 'warning',
          title: 'Oops!',
          text: error.data,
          gif: Error,
          showConfirmButton: true,
          confirmButtonText: 'Close',
        });
        setColor('#e63a2e');
        setMessage('Upload Failed');
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    }
  };

  const AdditionalhandleRadioChange = (event) => {
    setAdditionalSelectedValue(event.target.value);
  };

  const handleClinicalChange = (event) => {
    const newValue = event.target.value;
    setSelectedClinicalValue(newValue);
  };

  const handleAssign = async (values) => {

    const missingFields = requiredFields.filter(field => !common_data[field]);

    if (missingFields.length > 0 ) {
      showSweetAlert({
        type: 'warning',
        title: 'Missing Data',
        text: `Mandatory fields cannot be empty`,
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      return; 
    }
    if (!assigninvestigators || assigninvestigators.length === 0) {
      showSweetAlert({
        type: 'warning',
        title: 'Select a Staff',
        text: 'Please select at least one investigator.',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      return;
    }
    
    try {
      const response = await triggerAssigninvestigator({
        payload: {
          ...common_data,
          investigatorList: assigninvestigators,
          incidentApprovalId: entryData?.IncidentApprovalId,
          approverStatus: 'Approved',
        },
      }).unwrap();

      showToastAlert({
        type: 'custom_success',
        text: response.Message,
        gif: SuccessGif,
      });
      setMessage('Opinion Submitted');
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      navigate('/IncidentManagement/IncidentApproval');

    } catch (error) {
      if (error && error.data) {
        showSweetAlert({
          type: 'warning',
          title: 'Oops!',
          text: error.data,
          gif: Error,
          showConfirmButton: true,
          confirmButtonText: 'Close',
        });
        setColor('#e63a2e');
        setMessage('Upload Failed');
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    }

  };

  const handleOpinion = async (values) => {

    const missingFields = requiredFields.filter(field => !common_data[field]);

    if (missingFields.length > 0 ) {
      showSweetAlert({
        type: 'warning',
        title: 'Missing Data',
        text: `Mandatory fields cannot be empty`,
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      return; 
    }
    if (!opinions || opinions.length === 0) {
      showSweetAlert({
        type: 'warning',
        title: 'Select a Staff',
        text: 'Please select at least one Staff',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      return;
    }
    try {
      const response = await triggerOpinion({
        payload: {
          ...common_data,
          opinionLists: opinions || [],
          incidentApprovalId: entryData?.IncidentApprovalId,
          approverStatus: 'Opinion',
        },
      }).unwrap();

      showToastAlert({
        type: 'custom_success',
        text: response.Message,
        gif: SuccessGif,
      });
      setMessage('Opinion Submitted');
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      navigate('/IncidentManagement/IncidentApproval');
    } catch (error) {
      if (error && error.data) {
        showSweetAlert({
          type: 'warning',
          title: 'Oops!',
          text: error.data,
          gif: Error,
          showConfirmButton: true,
          confirmButtonText: 'Close',
        });
        setColor('#e63a2e');
        setMessage('Upload Failed');
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    }
  };

  // Page load Data

  const { data: pageloadData = [], isFetching: ispageloadData } =
    useGetReportIncidentPageloadQuery({
      headerFacilityId: selectedFacility?.id,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
    });

  const {
    data: ApprovalpageloadData = [],
    isFetching: ispapprovalageloadData,
  } = useGetPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    moduleId: selectedModuleId,
    headerFacilityId: selectedFacility?.id,
  });

  useEffect(() => {
    if (entrydetails?.Data) {
      setIncidentMainCategory({
        id: entrydetails.Data.MainCategoryId,
        name: entrydetails.Data.MainCategory,
      });
      setIncidentSubCategory({
        id: entrydetails.Data.SubCategoryId,
        name: entrydetails.Data.SubCategory,
      });
      setIncidentDetails({
        id: entrydetails.Data.IncidentDetailId,
        name: entrydetails.Data.IncidentDetail,
      });

      setIncidentType({
        id: entrydetails.Data.IncidentTypeId,
        name: entrydetails.Data.IncidentType,
      });
      setIncidentDepartment({
        id: entrydetails.Data.DepartmentId,
        name: entrydetails.Data.DepartmentName,
      });
      setHarmLevel({
        id: entrydetails.Data.IncidentHarmLevelId,
        name: entrydetails.Data.IncidentHarmLevel,
      });

      setSLAPriority({
        id: entrydetails.Data.ListOfValue,
        name: entrydetails.Data.ListOfValue,
      });

      setMainCategoryCode({
        id: entrydetails.MainCategoryId,
        name: entrydetails.MainCategoryCode,
      });

      setSubCategoryCode({
        id: entrydetails.SubCategoryId,
        name: entrydetails.SubCategoryCode,
      });
      setCategoryDetails({
        id: entrydetails.IncidentDetailId,
        name: entrydetails.IncidentDetail,
      });
      setCategoryDetailsCode({
        id: entrydetails.IncidentDetailId,
        name: entrydetails.IncidentDetailCode,
      });
      setAffectedCategoryName({
        id: entrydetails.AffectedCategoryId,
        name: entrydetails.AffectedCategoryName,
      });
      setAffectedCategoryCode({
        id: entrydetails.AffectedCategoryId,
        name: entrydetails.AffectedCategoryCode,
      });

      setLocationDetails(entrydetails.Data.LocationDetials);
    }
  }, [entrydetails]);

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

  const common_data = {
    incidentId: id,
    facilityId: selectedFacility?.id,
    approverUserId: userDetails?.UserId,
    incidentTypeId: incidentType.id,
    incidentType: incidentType.name,
    clinicalType: selectedClinicalValue,
    affectedCategoryId: AffectedCategoryName?.id,
    affectedCategory: AffectedCategoryName?.name,
    mainCategoryId: incidentMainCategory?.id,
    mainCategory: incidentMainCategory?.name,
    subCategoryId: incidentSubCategory?.id,
    subCategory: incidentSubCategory?.name,
    incidentDetailId: incidentDetails?.id || CategoryDetails?.id,
    incidentDetail: incidentDetails?.name || CategoryDetails?.name,
    departmentId: incidentDepartment?.id,
    departmentName: incidentDepartment?.name,
    incidentHarmLevelId: harmLevel?.id,
    incidentHarmLevel: harmLevel?.name,
    incidentReoccurence: 'no',
    incidentClosureTATId: 1,
    closureTATDays: 1,
    locationDetials: locationDetails,
    additionalStaffNotify: entryData?.AdditionalStaffNotify,
    isSentinel: true,
    slaPriority: SLAPriority?.name,
    moduleId: selectedModuleId,
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    othersName: '',
    incidentApproval_ReoccurrenceLog: ReoccurrenceLog,
    incidentApproval_AdditionalNotifyStaff: [],
  };

  const pdfSectionRef = useRef(null); // For the PDF content

 const { data: incidentData, isFetching: isFetchingData } =
     useGetIncidentDetailsPendingByIdQuery(
       {
         menuId: 26,
         loginUserId: 1,
         incidentId: id,
         moduleId: 2
       },
       { skip: !id }
     );
 
   const { reportIncident, incidentStaffInvolved, incidentPatientInvolved } =
     incidentData?.Data || {};
     var reportIncidentSafe = reportIncident || {};
 
   const handlePrint = () => {
       try {
         const doc = new jsPDF('p', 'pt', 'a4');
         const pdfFileName = 'Incident_Approval_Pending.pdf';
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
                     
              //        const currentPatientID = table.body[row.index]?.raw?.dataset?.patientId;
              //        const nextPatientID = table.body[row.index + 1]?.raw?.dataset?.patientId;
               
              //        if (currentPatientID && (!nextPatientID || currentPatientID !== nextPatientID)) {
              //          const startX = table.settings.margin.left;
              //          const endX = doc.internal.pageSize.width - table.settings.margin.right;
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
        <FlexContainer
          className="no-print"
          justifyContent={'space-between'}
          style={{ paddingBottom: '15px' }}
        >
          <StyledTypography
            className="no-print"
            fontSize="30px"
            fontWeight="900"
            lineHeight="44px"
            color="#0083C0"
            whiteSpace={'nowrap'}
          >
            {t('MM_SM_IncidentApproval')}
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
                    backgroundColor: 'rgb(52 152 219)',
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
                  onClick={() =>
                    navigate('/IncidentManagement/IncidentApproval')
                  }
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
                className="no-print"
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

            <Accordion
              sx={{
                marginBottom: '10px',
                border: '1px solid #406883',
                borderRadius: '8px 8px 0px 0px',
              }}
              expanded={true}
              flexDirection="column"
              alignItems="center"
              width="100%"
              flexWrap="wrap"
            >
              <AccordionSummary
                expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  backgroundColor: '#0d22bb',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <StyledTypography
                  fontSize="18px"
                  fontWeight="700"
                  lineHeight="20px"
                  color="#FFFFFF"
                  sx={{ width: '100%', textAlign: 'center' }}
                >
                  {t('MM_SM_SearchIncident')}
                </StyledTypography>
              </AccordionSummary>

              <FormContainer style={{ marginBottom: '20px' }}>
                <FlexContainer flexDirection={'column'}>
                  {/* <SectionHeader>Incident Approval Entry</SectionHeader> */}
                  <Grid container spacing={2} p={2} style={{ padding: '0px' }}>
                    <StyledGrid item xs={4}>
                      <FormLabel
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        {getlabel(
                          filteredTitleConfig.find(
                            (config) => config.name === 'IncidentTitle'
                          )?.translationId,
                          filteredIncidentLabel,
                          i18n.language
                        )}
                        <Tooltip title="View Category">
                          <IconButton
                            size="small"
                            sx={{
                              padding: '5px',
                              color: '#fff',
                              borderRadius: '5px',
                              background: 'green',
                              '&:hover': {
                                background: 'darkgreen',
                                color: '#fff',
                              },
                            }}
                            onClick={handleSearch}
                          >
                            <SearchIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Tooltip>
                      </FormLabel>
                    </StyledGrid>

                    {[
                      'AffectedCategory',
                      'AffectedCategoryCode',
                      'IncidentMainCategory',
                      'MainCategoryCode',
                      'IncidentSubCategory',
                      'SubCategoryCode',
                      'IncidentDetails',
                      'IncidentDetailsCode',
                    ].map((name) => {
                      const field = filteredIncidentApprovalConfig.find(
                        (f) => f.name === name
                      );
                      if (field) {
                        return (
                          <Grid item xs={4} key={name}>
                                                        <FormLabel>
                              {getlabel(
                                  field?.translationId,
                                  filterIncidentApprovalLabels,
                                  i18n.language
                              )}
                              {field.IsMandatory && <span style={{ color: 'red' }}> *</span>}
                            </FormLabel>

                            <TextField
                              fullWidth
                              value={
                                name === 'IncidentMainCategory'
                                  ? incidentMainCategory?.name || ''
                                  : name === 'IncidentSubCategory'
                                    ? incidentSubCategory?.name || ''
                                    : name === 'IncidentDetails'
                                      ? incidentDetails?.name ||
                                        CategoryDetails?.name ||
                                        ''
                                      : name === 'AffectedCategory'
                                        ? AffectedCategoryName?.name ||
                                          AffectedCategoryName?.value ||
                                          ''
                                        : name === 'AffectedCategoryCode'
                                          ? AffectedCategoryCode?.name ||
                                            AffectedCategoryCode?.value ||
                                            ''
                                          : name === 'MainCategoryCode'
                                            ? MainCategoryCode?.name ||
                                              MainCategoryCode?.value ||
                                              ''
                                            : name === 'SubCategoryCode'
                                              ? SubCategoryCode?.name ||
                                                SubCategoryCode?.value ||
                                                ''
                                              : name === 'IncidentDetailsCode'
                                                ? CategoryDetailsCode?.name ||
                                                  CategoryDetailsCode?.value ||
                                                  ''
                                                : ''
                              }
                              slotProps={{
                                htmlInput: {
                                  maxLength: 200,
                                  style: {
                                    color: 'black',
                                    fontWeight: 'bold',
                                    fontSize: '15px',
                                  },
                                },
                              }}
                              disabled
                            />
                          </Grid>
                        );
                      }
                    })}

                    <Grid item xs={4}>
                      <FormLabel>
                        {getlabel(
                          filteredIncidentApprovalConfig.find(
                            (config) => config.name === 'IncidentType'
                          )?.translationId,
                          filterIncidentApprovalLabels,
                          i18n.language
                        )}
{filteredIncidentApprovalConfig.find(
                          (config) => config.name === 'IncidentType'
                        )?.IsMandatory && <span style={{ color: 'red' }}> *</span>}
                      </FormLabel>

                      <Dropdown
                        options={
                          pageloadData?.Data?.IncidentTypeList?.map((item) => ({
                            value: item.IncidentTypeId,
                            text: item.IncidentTypeName,
                          })) || []
                        }
                        value={incidentType.id}
                        onChange={(event) => typeChange(event)}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <FormLabel>
                        {getlabel(
                          filteredIncidentApprovalConfig.find(
                            (config) => config.name === 'Clinical/NonClinical'
                          )?.translationId,
                          filterIncidentApprovalLabels,
                          i18n.language
                        )}
                        {filteredIncidentApprovalConfig.find(
                          (config) => config.name === 'Clinical/NonClinical'
                        )?.IsMandatory && <span style={{ color: 'red' }}> *</span>}
                      </FormLabel>

                      <Dropdown
                        options={[
                          { value: 'Clinical', text: 'Clinical' },
                          { value: 'NonClinical', text: 'NonClinical' },
                        ]}
                        value={selectedClinicalValue}
                        onChange={handleClinicalChange}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <FormLabel>
                        {getlabel(
                          filteredIncidentApprovalConfig.find(
                            (config) => config.name === 'IncidentDepartment'
                          )?.translationId,
                          filterIncidentApprovalLabels,
                          i18n.language
                        )}
                        {filteredIncidentApprovalConfig.find(
                          (config) => config.name === 'IncidentDepartment'
                        )?.IsMandatory && <span style={{ color: 'red' }}> *</span>}
                      </FormLabel>

                      <Dropdown
                        options={
                          pageloadData?.Data?.DepartmentList?.map((item) => ({
                            value: item.DepartmentId,
                            text: item.DepartmentName,
                          })) || []
                        }
                        value={incidentDepartment.id}
                        onChange={(event) => departmentChange(event)}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <FormLabel>
                        {getlabel(
                          filteredIncidentApprovalConfig.find(
                            (config) =>
                              config.name === 'LocationDetails(Roomnoetc)'
                          )?.translationId,
                          filterIncidentApprovalLabels,
                          i18n.language
                        )}
                                                {filteredIncidentApprovalConfig.find(
                          (config) => config.name === 'LocationDetails(Roomnoetc)'
                        )?.IsMandatory && <span style={{ color: 'red' }}> *</span>}

                        
                      </FormLabel>

                      <TextField
                        fullWidth
                        placeholder="Enter location"
                        value={locationDetails}
                        onChange={handleLocationChange}
                        slotProps={{ htmlInput: { maxLength: 100 } }}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <FormLabel>
                        {getlabel(
                          filteredIncidentApprovalConfig.find(
                            (config) => config.name === 'HarmLevel'
                          )?.translationId,
                          filterIncidentApprovalLabels,
                          i18n.language
                        )}
                                {filteredIncidentApprovalConfig.find(
     (config) => config.name === 'HarmLevel'
            )?.IsMandatory && <span style={{ color: 'red' }}> *</span>}

                      </FormLabel>

                      <Dropdown
                        options={
                          pageloadData?.Data?.HarmLevelList?.map((item) => ({
                            value: item.IncidentHarmLevelId,
                            text: item.IncidentHarmLevel,
                          })) || []
                        }
                        value={harmLevel.id}
                        onChange={(event) => harmLevelChange(event)}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <FormLabel>
                        {getlabel(
                          filteredIncidentApprovalConfig.find(
                            (config) => config.name === 'SLAPriority'
                          )?.translationId,
                          filterIncidentApprovalLabels,
                          i18n.language
                        )}
                                {filteredIncidentApprovalConfig.find(
     (config) => config.name === 'SLAPriority'
            )?.IsMandatory && <span style={{ color: 'red' }}> *</span>}

                      </FormLabel>

                      <Dropdown
                        options={
                          ApprovalpageloadData?.Data?.SLAPriority?.map(
                            (item) => ({
                              value: item.ListOfValue,
                              text: item.ListOfValue,
                            })
                          ) || []
                        }
                        value={SLAPriority.id}
                        onChange={(event) => SLAPriorityChange(event)}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <FormLabel>
                        {getlabel(
                          filteredIncidentApprovalConfig.find(
                            (config) =>
                              config.name ===
                              'AnyAdditionalStaffYouWishToBeNotified'
                          )?.translationId,
                          filterIncidentApprovalLabels,
                          i18n.language
                        )}
                                {filteredIncidentApprovalConfig.find(
     (config) => config.name === 'AnyAdditionalStaffYouWishToBeNotified'
            )?.IsMandatory && <span style={{ color: 'red' }}> *</span>}

                      </FormLabel>

                      <RadioGroup
                        row
                        value={additionalselectedValue}
                        onChange={AdditionalhandleRadioChange}
                      >
                        <FormControlLabel
                          value="Yes"
                          control={<Radio />}
                          label={t('Yes')}
                        />
                        <FormControlLabel
                          value="No"
                          control={<Radio />}
                          label={t('No')}
                        />
                      </RadioGroup>
                    </Grid>
                    <Grid item xs={4}>
                      <FormLabel>Action</FormLabel>
                      <Dropdown
                        options={[
                          { value: 'merge', text: 'Merge Incident' },
                          { value: 'skip', text: 'Skip Investigation' },
                          { value: 'fill', text: 'Fill RCA' },
                          {
                            value: 'approve',
                            text: 'Approve Incident and assign Investigators',
                          },
                          { value: 'reject', text: 'Reject Incident' },
                          { value: 'request', text: 'Request Information' },
                          { value: 'opinion', text: 'Opinion Exchange' },
                        ]}
                        value={selectedAction}
                        onChange={(event) => handleChange(event)}
                      />
                    </Grid>
                  </Grid>

                  {additionalselectedValue === 'Yes' && (
                    <AdditionalStafftable
                      columns={additionalstaffLabels}
                      labels={filterIncidentApprovalLabels}
                    />
                  )}
                </FlexContainer>

                {/* {selectedAction === 'approve' && (
              

              )} */}
                {/* </Box> */}
              </FormContainer>
            </Accordion>

            {/* Multiple Actions Acordion   */}

            <Grid item xs={12}>
              {selectedAction === 'merge' && (
                <MergeIncident
                  entryData={entrydetails?.Data}
                  common_data={common_data}
                />
              )}
              {selectedAction === 'request' && (
                <RequestInformation entryData={incidentDepartment} />
              )}
              {selectedAction === 'reject' && (
                <RejectIncident entryData={entrydetails?.Data} />
              )}

              {selectedAction === 'approve' && (
                <>
                  <Accordion
                    sx={{
                      borderColor: '#3498db',
                      marginBottom: '10px',
                      border: '1px solid #3498db',
                      borderRadius: '8px 8px 0 0',
                    }}
                    expanded={true}
                  >
                    <AccordionSummary
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
                        fontSize="16px"
                        fontWeight="700"
                        lineHeight="20px"
                        textAlign="center"
                        color="#FFFFFF"
                        sx={{
                          flexGrow: 1,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #3498db',
                        }}
                      >
                        {getlabel(
                          'IM_IA_ApproveIncidentandassignInvestigators',
                          filterIncidentApprovalLabels,
                          i18n.language
                        )}
                      </StyledTypography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ padding: '16px' }}>
                      <ApproveIncidentAndAssign
                        columns={assignInvestigatorsLabels}
                        labels={filterIncidentApprovalLabels}
                        onUpdateTableData={updateTableData}
                      />
                    </AccordionDetails>
                  </Accordion>

                  <FlexContainer
                    padding="10px"
                    justifyContent="center"
                    gap="20px"
                  >
                    <ActionButton
                      style={{ backgroundColor: 'rgba(0, 131, 192, 1)' }}
                      variant="outlined"
                      sx={{
                        boxShadow: '0px 4px 4px 0px #00000040',
                        '&:hover': {
                          transform: 'scale(1.05) !important',
                          transition: 'transform 0.3s ease !important',
                        },
                      }}
                      startIcon={
                        <StyledImage
                          src={SubmitTik}
                          style={{
                            marginBottom: '1px',
                            marginInlineEnd: 8,
                            color: '#FFFFFF',
                          }}
                        />
                      }
                      onClick={handleAssign}
                    >
                      <StyledTypography
                        textTransform="none"
                        marginTop="1px"
                        color="#ffff"
                      >
                        {/* Submit */}
                        {t('Submit')}
                      </StyledTypography>
                    </ActionButton>
                    <ActionButton
                      variant="outlined"
                      sx={{
                        boxShadow: '0px 4px 4px 0px #00000040',
                        '&:hover': {
                          transform: 'scale(1.05) !important',
                          transition: 'transform 0.3s ease !important',
                        },
                      }}
                      startIcon={
                        <StyledImage
                          src={DoNotDisturbAltIcon}
                          style={{
                            marginBottom: '1px',
                            marginInlineEnd: 8,
                          }}
                        />
                      }
                    >
                      <StyledTypography textTransform="none" marginTop="1px">
                        {t('Cancel')}
                      </StyledTypography>
                    </ActionButton>
                  </FlexContainer>
                </>
              )}

              {selectedAction === 'opinion' && (
                <>
                  <Accordion
                    sx={{
                      borderColor: '#3498db',
                      marginBottom: '10px',
                      border: '1px solid #3498db',
                      borderRadius: '8px 8px 0 0',
                    }}
                    expanded={true}
                  >
                    <AccordionSummary
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
                        fontSize="16px"
                        fontWeight="700"
                        lineHeight="20px"
                        textAlign="center"
                        color="#FFFFFF"
                        sx={{
                          flexGrow: 1,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          border: '1px solid #3498db',
                        }}
                      >
                        {getlabel(
                          'IM_IA_Opinion(s)Exchanged',
                          filterIncidentApprovalLabels,
                          i18n.language
                        )}
                      </StyledTypography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ padding: '16px' }}>
                      <OpinionExchanged
                        columns={assignInvestigatorsLabels}
                        labels={filterIncidentApprovalLabels}
                        onOpinionData={updateOpinionData}
                      />
                    </AccordionDetails>

                    <FlexContainer
                      padding="10px"
                      justifyContent="center"
                      gap="20px"
                    >
                      <ActionButton
                        style={{ backgroundColor: 'rgba(0, 131, 192, 1)' }}
                        variant="outlined"
                        sx={{
                          boxShadow: '0px 4px 4px 0px #00000040',
                          '&:hover': {
                            transform: 'scale(1.05) !important',
                            transition: 'transform 0.3s ease !important',
                          },
                        }}
                        startIcon={
                          <StyledImage
                            src={SubmitTik}
                            style={{
                              marginBottom: '1px',
                              marginInlineEnd: 8,
                              color: '#FFFFFF',
                            }}
                          />
                        }
                        onClick={handleOpinion}
                      >
                        <StyledTypography
                          textTransform="none"
                          marginTop="1px"
                          color="#ffff"
                        >
                          {/* Submit */}
                          {t('Submit')}
                        </StyledTypography>
                      </ActionButton>
                      <ActionButton
                        variant="outlined"
                        sx={{
                          boxShadow: '0px 4px 4px 0px #00000040',
                          '&:hover': {
                            transform: 'scale(1.05) !important',
                            transition: 'transform 0.3s ease !important',
                          },
                        }}
                        startIcon={
                          <StyledImage
                            src={DoNotDisturbAltIcon}
                            style={{
                              marginBottom: '1px',
                              marginInlineEnd: 8,
                            }}
                          />
                        }
                      >
                        <StyledTypography textTransform="none" marginTop="1px">
                          {t('Cancel')}
                        </StyledTypography>
                      </ActionButton>
                    </FlexContainer>
                  </Accordion>
                </>
              )}

              {/* Add other conditions for other actions */}

              {/* Skip Investigation */}

              <Dialog
                open={openSkillPopup}
                onClose={handleSkilCancel}
                PaperProps={{
                  style: {
                    width: '360px',
                  },
                }}
              >
                <DialogTitle></DialogTitle>
                <DialogContent sx={{ textAlign: 'center', padding: 0 }}>
                  <h3 style={{ color: '#575757' }}>
                    <strong>Confirm to Submit?</strong>
                  </h3>
                  Incident will be Approved and Redirected to the Incident
                  Closure Page
                </DialogContent>
                <DialogActions
                  sx={{
                    justifyContent: 'center',
                    gap: 2,
                    marginBottom: '12px',
                  }}
                >
                  <ActionButton
                    variant="outlined"
                    sx={{
                      boxShadow: '0px 4px 4px 0px #00000040',
                      '&:hover': {
                        transform: 'scale(1.05) !important',
                        transition: 'transform 0.3s ease !important',
                      },
                    }}
                    startIcon={
                      <StyledImage
                        src={DoNotDisturbAltIcon}
                        style={{
                          marginBottom: '1px',
                          marginInlineEnd: 8,
                        }}
                      />
                    }
                    onClick={handleSkilCancel}
                  >
                    <StyledTypography
                      textTransform="none"
                      marginTop="1px"
                      color="rgba(0, 131, 192, 1)"
                    >
                      Cancel
                    </StyledTypography>
                  </ActionButton>
                  <ActionButton
                    style={{ backgroundColor: 'rgba(0, 131, 192, 1)' }}
                    variant="outlined"
                    sx={{
                      boxShadow: '0px 4px 4px 0px #00000040',
                      '&:hover': {
                        transform: 'scale(1.05) !important',
                        transition: 'transform 0.3s ease !important',
                      },
                    }}
                    startIcon={
                      <StyledImage
                        src={SubmitTik}
                        style={{
                          marginBottom: '1px',
                          marginInlineEnd: 8,
                          color: '#FFFFFF',
                        }}
                      />
                    }
                    onClick={handleSkipSubmit}
                  >
                    <StyledTypography
                      textTransform="none"
                      marginTop="1px"
                      color="#ffff"
                    >
                      Yes
                    </StyledTypography>
                  </ActionButton>
                </DialogActions>
              </Dialog>

              {/* Fill RCA */}

              <Dialog
                open={openRCAPopup}
                onClose={handleRCACancel}
                PaperProps={{
                  style: {
                    width: '360px',
                  },
                }}
              >
                <DialogTitle></DialogTitle>
                <DialogContent sx={{ textAlign: 'center', padding: 0 }}>
                  <h3 style={{ color: '#575757' }}>
                    <strong>Confirm to Submit?</strong>
                  </h3>
                  Incident will be Approved and Redirected to the Root Cause
                  Analysis Page
                </DialogContent>
                <DialogActions
                  sx={{
                    justifyContent: 'center',
                    gap: 2,
                    marginBottom: '12px',
                  }}
                >
                  <ActionButton
                    variant="outlined"
                    sx={{
                      boxShadow: '0px 4px 4px 0px #00000040',
                      '&:hover': {
                        transform: 'scale(1.05) !important',
                        transition: 'transform 0.3s ease !important',
                      },
                    }}
                    startIcon={
                      <StyledImage
                        src={DoNotDisturbAltIcon}
                        style={{
                          marginBottom: '1px',
                          marginInlineEnd: 8,
                        }}
                      />
                    }
                    onClick={handleRCACancel}
                  >
                    <StyledTypography
                      textTransform="none"
                      marginTop="1px"
                      color="rgba(0, 131, 192, 1)"
                    >
                      Cancel
                    </StyledTypography>
                  </ActionButton>
                  <ActionButton
                    style={{ backgroundColor: 'rgba(0, 131, 192, 1)' }}
                    variant="outlined"
                    sx={{
                      boxShadow: '0px 4px 4px 0px #00000040',
                      '&:hover': {
                        transform: 'scale(1.05) !important',
                        transition: 'transform 0.3s ease !important',
                      },
                    }}
                    startIcon={
                      <StyledImage
                        src={SubmitTik}
                        style={{
                          marginBottom: '1px',
                          marginInlineEnd: 8,
                          color: '#FFFFFF',
                        }}
                      />
                    }
                    onClick={handleRCASubmit}
                  >
                    <StyledTypography
                      textTransform="none"
                      marginTop="1px"
                      color="#ffff"
                    >
                      Yes
                    </StyledTypography>
                  </ActionButton>
                </DialogActions>
              </Dialog>

              {/* Category Dialog    */}

              {regionCode === 'ABD' ? (
                <Dialog
                  open={isIncidentCategoryModel}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      width: '900px',
                      maxWidth: 'none',
                      borderRadius: '8px',
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
                    },
                  }}
                >
                  <Box>
                    <DialogTitle
                      sx={{
                        backgroundColor: '#205475',
                        color: '#fff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        height: 40,
                        alignItems: 'center',
                        padding: '0 8px',
                      }}
                    >
                      <StyledTypography
                        fontSize="18px"
                        fontWeight="300"
                        lineHeight="18px"
                        padding="0 12px"
                        color="#fff"
                      >
                        Category Detail List
                      </StyledTypography>
                      <IconButton
                        onClick={handleClose}
                        sx={{
                          color: '#fff',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            transition: 'transform 0.3s ease',
                            backgroundColor: 'rgba(15, 108, 189, 0.2)',
                          },
                        }}
                      >
                        <Tooltip title="Close" arrow>
                          <StyledImage
                            src={CloseIcon}
                            alt="Close Icon"
                            tooltip="Close"
                          />
                        </Tooltip>
                      </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ border: '4px solid #205475' }}>
                      <Formik
                        initialValues={{ selectedAffectedCategory: '' }} // Ensure default exists
                        onSubmit={(values) =>
                          console.log('Form Values:', values)
                        }
                      >
                        {({ values, setFieldValue }) => (
                          <Form>
                            <Box>
                              <FlexContainer
                                padding="20px 20px 20px 0"
                                alignItems="center"
                              >
                                <FlexContainer
                                  width="50%"
                                  gap="0px"
                                  alignItems="center"
                                >
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 2,
                                      width: '100%',
                                    }}
                                  >
                                    <Box sx={{ width: '40%' }}>
                                      <FormLabel>Affected Category</FormLabel>
                                      <Dropdown
                                        options={[
                                          { value: '', text: 'Select' }, // Default option
                                          ...(pageloadData?.Data?.AffectedcategoryList?.map(
                                            (item) => ({
                                              value: item.AffectedCategoryId,
                                              text: item.AffectedCategory,
                                            })
                                          ) || []),
                                        ]}
                                        value={values.selectedAffectedCategory}
                                        onChange={(event) => {
                                          const selectedValue =
                                            event?.target?.value ||
                                            event?.value;
                                          const selectedCategory =
                                            pageloadData?.Data?.AffectedcategoryList?.find(
                                              (item) =>
                                                item.AffectedCategoryId ===
                                                selectedValue
                                            );

                                          setFieldValue(
                                            'selectedAffectedCategory',
                                            selectedValue || ''
                                          );
                                          setSelectedAffectedCategory(
                                            selectedValue || ''
                                          );
                                          setAffectedCategoryName({
                                            id: selectedValue || '',
                                            name:
                                              selectedCategory?.AffectedCategory ||
                                              '',
                                          });
                                          setAffectedCategoryCode({
                                            id: selectedValue || '',
                                            name:
                                              selectedCategory?.AffectedCategoryCode ||
                                              '',
                                          });
                                        }}
                                      />
                                    </Box>

                                    <Box sx={{ width: '60%' }}>
                                      <FormLabel>Search Category</FormLabel>
                                      <TextField
                                        fullWidth
                                        placeholder="Search Category..."
                                        value={searchQuery}
                                        onChange={(event) =>
                                          setSearchQuery(event.target.value)
                                        }
                                      />
                                    </Box>
                                  </Box>
                                </FlexContainer>
                              </FlexContainer>

                              <AffectedCategory
                                staffFetching={false}
                                selectedCategory={selectedAffectedCategory}
                                searchQuery={searchQuery}
                                onSelectRow={handleABDSelectRow}
                              />
                            </Box>
                          </Form>
                        )}
                      </Formik>
                    </DialogContent>
                  </Box>
                </Dialog>
              ) : (
                <Dialog
                  open={isIncidentCategoryModel}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      width: '900px',
                      maxWidth: 'none',
                      borderRadius: '8px',
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
                    },
                  }}
                >
                  <Box>
                    <DialogTitle
                      sx={{
                        backgroundColor: '#205475',
                        color: '#fff',
                        display: 'flex',
                        justifyContent: 'space-between',
                        height: 40,
                        alignItems: 'center',
                        padding: '0 8px',
                      }}
                    >
                      <StyledTypography
                        fontSize="18px"
                        fontWeight="300"
                        lineHeight="18px"
                        padding="0 12px"
                        color="#fff"
                      >
                        Category Detail List
                      </StyledTypography>
                      <IconButton
                        onClick={handleClose}
                        sx={{
                          color: '#fff',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            transition: 'transform 0.3s ease',
                            backgroundColor: 'rgba(15, 108, 189, 0.2)',
                          },
                        }}
                      >
                        <Tooltip title="Close" arrow>
                          <StyledImage
                            src={CloseIcon}
                            alt="Close Icon"
                            tooltip="Close"
                          />
                        </Tooltip>
                      </IconButton>
                    </DialogTitle>
                    <DialogContent sx={{ border: '4px solid #205475' }}>
                      <Formik>
                        <Form>
                          <Box
                            sx={{
                              marginBottom: 2,
                              display: 'block',
                              alignItems: 'center',
                            }}
                          >
                            <FlexContainer
                              padding="20px 20px 20px 0"
                              alignItems="center"
                            >
                              <FlexContainer
                                width="50%"
                                gap="0px"
                                alignItems="center"
                              >
                                <Box
                                  sx={{ padding: '0 0 0 20px', width: '60%' }}
                                ></Box>
                              </FlexContainer>
                            </FlexContainer>
                            <Incidentcategorylist
                              data={[]}
                              columns={[]}
                              staffFetching={false}
                              isEdit={false}
                              labels={{}}
                              totalRecords={0}
                              setIsStaffModel={() => {}}
                              setSelectedFacilityId={null}
                              selectedFacilityId={null}
                              setStaffFacilityId={null}
                              onSelectRow={handleSelectRow}
                            />
                          </Box>
                        </Form>
                      </Formik>
                    </DialogContent>
                  </Box>
                </Dialog>
              )}
            </Grid>
          </Box>
        </FlexContainer>
      </FlexContainer>

      {/* Below Div for PDF Print Content */}
      <div
        ref={pdfSectionRef}
        id="pdfSectionRef"
        className="no-print"
        style={{ display: 'none' }}
      >
        <>
          <img id="logo" src={Logo} />
        </>
        <IncidentDetailPdf approvalviewstatus={false} />
      </div>
    </>
  );
};

export default PendingApproval;
