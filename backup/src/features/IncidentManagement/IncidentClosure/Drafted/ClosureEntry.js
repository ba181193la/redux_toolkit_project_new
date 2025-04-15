import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  Modal,
  Backdrop,
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
import FurtherActionTable from './FurtherActionTable';
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
import { Formik, Form } from 'formik';
import IncidentDetails from '../../IncidentCommon/IncidentDetails';
import SearchIcon from '@mui/icons-material/Search';
import {
  useGetClosureEntryDraftDataQuery,
  useGetPageLoadDataQuery,
  useSaveRCAMutation,
} from '../../../../redux/RTK/incidentClosureApi';
import {
  useSkipInvestigationMutation,
  useFillRCAMutation,
  useGetReportIncidentPageloadQuery,
  useGetApprovalEntryDataQuery,
  useAssignInvestigatorMutation,
  useOpinionMutation,
} from '../../../../redux/RTK/IncidentManagement/incidentApprovalApi';
import { ConnectingAirportsOutlined } from '@mui/icons-material';
import AdditionalStafftable from './AdditionalStafftable';
import { fontSize } from '@mui/system';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import IncidentDetailPdf from '../../IncidentCommon/Pdf Section/IncidentDetailPdf';
import { useGetIncidentDetailsPendingByIdQuery } from '../../../../redux/RTK/incidentInvestigationApi';
import {
  useLazyGetMCFormBuilderByIdQuery,
  useLazyGetSCFormBuilderByIdQuery,
  useLazyGetIDFormBuilderByIdQuery,
} from '../../../../redux/RTK/IncidentManagement/incidentCategoryApi';
import Logo from '../../../../assets/Icons/Logo.png';
import IncidentLevel from './Tables/IncidentLevel';
import EntryInvestigationAccordion from './EntryInvetigationAccordion';
import Incidentcategorylist from './Incidentcategorylist';
import AffectedCategory from './affectedCategoryList';
import DynamicFormBuilder from '../../IncidentCommon/DynamicFormBuilder';

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
  const [showIncidentLevel, setsShowIncidentLevel] = useState(false);
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [modalData, setModalData] = React.useState({ title: '', data: [] });
  const [files, setFiles] = useState([]);
  const [showContainer, setShowContainer] = useState(false);
  const [shouldFetchData, setShouldFetchData] = useState(false);
  const [incidentLevelData, setIncidentLevelData] = useState([]);
  const [ReporttoExternalBody, setReporttoExternalBody] = useState('');
  const [openSecondDialog, setOpenSecondDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [questionsData, setQuestionsData] = useState([]);
  const [subCategoryQuestionsData, setSubCategoryQuestionsData] = useState([]);
  const [incidentQuestionsData, setIncidentQuestionsData] = useState([]);

  const [selectedAction, setSelectedAction] = useState('');
  const [triggerSaveRCA] = useSaveRCAMutation();
  const [triggerGetFormBuilderData] = useLazyGetMCFormBuilderByIdQuery();
  const [triggerGetSubCategoryFormBuilderData] =
    useLazyGetSCFormBuilderByIdQuery();
  const [triggerGetIncidentFormBuilderData] =
    useLazyGetIDFormBuilderByIdQuery();

  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
  } = useSelector((state) => state.auth);

  //  const [triggerFillRCA] = useFillRCAMutation();
  // const [triggerAssigninvestigator] = useAssignInvestigatorMutation();
  // const [triggerOpinion] = useOpinionMutation();

  const [categorylist, setCategorylist] = useState([]);
  const [MainCategoryCode, setMainCategoryCode] = useState({
    id: '',
    name: '',
  });
  const [SubCategoryCode, setSubCategoryCode] = useState({ id: '', name: '' });
  const [categoryDetails, setCategoryDetails] = useState({
    id: '',
    name: '',
  });
  const [categoryDetailsCode, setCategoryDetailsCode] = useState({
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
  const [textData, setTextData] = useState({});

  // Get Reoprt Incident

  const { filters, isFilterApplied } = useSelector(
    (state) => state.incidentClosure
  );

  const state = useSelector((state) => state);

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
    useGetClosureEntryDraftDataQuery({
      incidentClosureId: closureID,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
    });

  const entryData = entrydetails?.Data;
  const MedicationIncident = entryData?.medicationHarmLevelDefinition;
  const LikelihoodPopup = entryData?.LikelihoodDefinition;
  const jawdaIncident = entryData?.jawdaIncidentLevelDefinition;
  
  const [mainCategoryFormValueData, setMainCategoryFormValueData] = useState([]);
const [subCategoryFormValueData, setSubCategoryFormValueData] = useState([]);
const [incidentDetailFormValueData, setIncidentDetailFormValueData] = useState([]);

  useEffect(() => {
    if (entryData?.allQuestionMetaData) {
      setMainCategoryFormValueData(
        entryData.allQuestionMetaData.mainCategoryFormValueData || []
      );
      setSubCategoryFormValueData(
        entryData.allQuestionMetaData.subCategoryFormValueData || []
      );
      setIncidentDetailFormValueData(
        entryData.allQuestionMetaData.incidentDetailFormValueData || []
      );
    }
  }, [entryData]);

  const mainCategoryFormValueDataObject = Object.fromEntries(
    mainCategoryFormValueData.map(({ id, value }) => [id, value])
  );
  const subCategoryFormValueDataObject = Object.fromEntries(
    subCategoryFormValueData.map(({ id, value }) => [id, value])
  );
  const incidentDetailFormValueDataObject = Object.fromEntries(
    incidentDetailFormValueData.map(({ id, value }) => [id, value])
  );

  const handleMainCategoryChange = ({ id, value, allValues }) => {
    const formatted = Object.entries(allValues).map(([id, value]) => ({
      id,
      value,
    }));

    setMainCategoryFormValueData(formatted);
  };

  const handleSubCategoryChange = ({ id, value, allValues }) => {
    const formatted = Object.entries(allValues).map(([id, value]) => ({
      id,
      value,
    }));
    setSubCategoryFormValueData(formatted);
  };

  const handleIncidentDetailChange = ({ id, value, allValues }) => {
    const formatted = Object.entries(allValues).map(([id, value]) => ({
      id,
      value,
    }));
    setIncidentDetailFormValueData(formatted);
  };

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
  const regionCode = useSelector((state) =>
    state.auth.regionCode?.toUpperCase()
  );
  const [searchQuery, setSearchQuery] = useState('');

  const [incidentDetails, setIncidentDetails] = useState({ id: '', name: '' });
  const [incidentType, setIncidentType] = useState({ id: '', name: '' });
  const [incidentDepartment, setIncidentDepartment] = useState({
    id: '',
    name: '',
  });
  const [affectedCategory, setAffectedCategory] = useState({
    id: '',
    name: '',
  });
  const [confirmAction, setConfirmAction] = useState(null);
  const [consequence, setConsequence] = useState({ id: '', name: '' });
  const [Likelihood, setLikelihood] = useState({ id: '', name: '' });
  const [harmLevel, setHarmLevel] = useState({ id: '', name: '' });
  const [medicationHarmLevel, setMedicationHarmLevel] = useState({
    id: '',
    name: '',
  });
  const [selectedAffectedCategory, setSelectedAffectedCategory] = useState('');

  const [contributingFactors, setContributingFactors] = useState({
    id: '',
    name: '',
  });
  const [contributingDepartment, setContributingDepartment] = useState({
    id: '',
    name: '',
  });
  const [locationDetails, setLocationDetails] = useState('');
  const [additionalStaffChangeData, setAdditionalStaffChangeData] = useState(
    []
  );
  const [furtherActionChangeData, setFurtherActionChangeData] = useState([]);
  // const [harmLevel, setHarmLevel] = useState({
  //   id: entrydetails?.Data?.IncidentHarmLevelId || '',
  //   name: entrydetails?.Data?.IncidentHarmLevel || '',
  // });

  const getFormBuilderData = async (id) => {
    let response;
    try {
      response = await triggerGetFormBuilderData({
        payload: {
          headerFacilityId: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          pageModuleId: selectedModuleId,
          pageMenuId: selectedMenu?.id,
          facilityId: 2,
          menuId: 30,
          mainCategoryId: id,
        },
      });
      if (response?.data) {
        setQuestionsData(response?.data?.Data);
      }
    } catch (e) {
      console.error('Failed to get Main Category question', e);
    }
  };

  const getFormSubCatBuilderData = async (id) => {
    let response;
    try {
      response = await triggerGetSubCategoryFormBuilderData({
        payload: {
          headerFacilityId: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          pageModuleId: selectedModuleId,
          pageMenuId: selectedMenu?.id,
          facilityId: 2,
          menuId: 30,
          subCategoryId: id,
        },
      });
      if (response?.data) {
        setSubCategoryQuestionsData(response?.data?.Data);
      }
    } catch (e) {
      console.error('Failed to get Main Category question', e);
    }
  };

  const getIncidentFormBuilderData = async (id) => {
    let response;
    try {
      response = await triggerGetIncidentFormBuilderData({
        payload: {
          headerFacilityId: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          pageModuleId: selectedModuleId,
          pageMenuId: selectedMenu?.id,
          facilityId: 2,
          menuId: 30,
          incidentDetailId: id,
        },
      });
      if (response?.data) {
        setIncidentQuestionsData(response?.data?.Data);
      }
    } catch (e) {
      console.error('Failed to get Main Category question', e);
    }
  };

  const handleButtonClick = () => {
    // Toggle the visibility of the container
    setShowContainer(true);
  };

  const handleUploadClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleFileChange = (event) => {
    const newFiles = event.target.files;
    const newFileArray = Array.from(newFiles);

    newFileArray.forEach((newFile) => {
      const fileExists = files.some(
        (file) =>
          file.OriginalFileName === newFile.name || file.name === newFile.name
      );

      if (fileExists) {
        setMessage('File already exists');
        setOpen(true);
        return;
      } else {
        const autogenFileName = `auto_${newFile.name}_${Date.now()}`;
        const filePath = `/uploads/${autogenFileName}`;

        const fileData = {
          AutogenFileName: autogenFileName,
          OriginalFileName: newFile.name,
          AutogenFilePath: filePath,
          FilePath: filePath,
          IsDelete: false,
          // RawFile: newFile,
        };

        setFiles((prevFiles) => [...prevFiles, fileData]);
      }
    });
  };

  const handleDeleteClick = (e, file) => {
    setFiles(
      files?.filter((item) => item.OriginalFileName !== file.OriginalFileName)
    );
  };

  const Attachments = [];
  const AttachmentSafe = Attachments || [];

  useEffect(() => {
    if (AttachmentSafe) {
      const filteredAttachments = AttachmentSafe.map((row) => ({
        AutogenFileName: row.AutogenFileName,
        OriginalFileName: row.OriginalFileName,
        AutogenFilePath: row.AutogenFilePath,
        FilePath: row.FilePath,
        IsDelete: row.IsDelete,
      }));

      setFiles((prevFiles) => {
        if (JSON.stringify(prevFiles) !== JSON.stringify(filteredAttachments)) {
          return filteredAttachments;
        }
        return prevFiles;
      });
    }
  }, []);

  const attachmentTable = [
    {
      fieldId: `IC_P_Attachment(s)`,
      translationId: 'IM_IC_Attachment(s)',
      label: 'Attachment',
      name: 'Attachment',
    },
  ];
  const titleConfig = [
    {
      translationId: 'IM_IC_IncidentTitle',
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
    {
      translationId: 'IM_IC_LessonsLearned',
      label: 'Lessons Learned',
      name: 'LessonLearned',
    },
    {
      translationId: 'IM_IC_IncidentReason/RootCause',
      label: 'Incident Reason / Root Cause',
      name: 'IncidentReason',
    },
  ];
  const additionalstaffLabels = [
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
  const incidentLevel = [
    {
      fieldId: `IC_IL_IncidentLevel`,
      translationId: 'IM_IC_IncidentLevel',
      label: 'Incident Level',
      name: 'IncidentRiskLevel',
    },
    {
      fieldId: `IC_IL_ActionTobeTaken`,
      translationId: 'IM_IC_ActionTobeTaken',
      label: 'Action To beTaken',
      name: 'ActionToBeTaken',
    },
    {
      fieldId: `IC_IL_RCARequired`,
      translationId: 'IM_IC_RCARequired',
      label: 'RCA Required',
      name: 'IsRCARequired',
    },
    {
      fieldId: `IC_IL_RCAStatus`,
      translationId: 'IM_IC_RCAStatus',
      label: 'RCA Status',
      name: 'RCAStatus',
    },
  ];
  const IncidentApproval = [
    {
      fieldId: `IC_P_AffectedCategory`,
      translationId: 'IM_IC_AffectedCategory',
      label: 'AffectedCategory',
      name: 'AffectedCategory',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_AffectedCategoryCode`,
      translationId: 'IM_IC_AffectedCategoryCode',
      label: 'AffectedCategoryCode',
      name: 'AffectedCategoryCode',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_IncidentMainCategory`,
      translationId: 'IM_IC_IncidentMainCategory',
      label: 'Incident Main Category',
      name: 'IncidentMainCategory',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_MainCategoryCode`,
      translationId: 'IM_IC_MainCategoryCode',
      label: 'Main Category Code',
      name: 'MainCategoryCode',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_IncidentSubCategory`,
      translationId: 'IM_IC_IncidentSubCategory',
      label: 'Incident Sub Category',
      name: 'IncidentSubCategory',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_SubCategoryCode`,
      translationId: 'IM_IC_SubCategoryCode',
      label: 'SubCategoryCode',
      name: 'SubCategoryCode',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_IncidentDetails`,
      translationId: 'IM_IC_IncidentDetails',
      label: 'Incident Details',
      name: 'IncidentDetail',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_IncidentType`,
      translationId: 'IM_IC_IncidentType',
      label: 'Incident Type',
      name: 'IncidentType',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_IncidentDetailsCode`,
      translationId: 'IM_IC_IncidentDetailsCode',
      label: 'IncidentDetailsCode',
      name: 'IncidentDetailCode',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_Clinical/NonClinical`,
      translationId: 'IM_IC_Clinical/NonClinical',
      label: 'Clinical/Non-Clinical',
      name: 'Clinical/NonClinical',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_IncidentDepartment`,
      translationId: 'IM_IC_IncidentDepartment',
      label: 'Incident Department',
      name: 'IncidentDepartment',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_TobeDiscussedinCommittee`,
      translationId: 'IM_IC_TobeDiscussedinCommittee',
      label: 'To be Discussed in Committee',
      name: 'TobeDiscussedinCommittee',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_HarmLevel`,
      translationId: 'IM_IC_HarmLevel',
      label: 'Harm Level',
      name: 'HarmLevel',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_NegligenceFromStaff`,
      translationId: 'IM_IC_NegligenceFromStaff',
      label: 'Negligence From Staff',
      name: 'NegligenceFromStaff',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_FurtherActionsTakenByApprover`,
      translationId: 'IM_IC_FurtherActionsTakenByApprover',
      label: 'Further Actions Taken By Approver',
      name: 'FurtherActionsTakenByApprover',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_MedicationIncidentHarmLevel`,
      translationId: 'IM_IC_MedicationIncidentHarmLevel',
      label: 'Medication Incident Harm Level',
      name: 'MedicationIncidentHarmLevel',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_ContributingFactors`,
      translationId: 'IM_IC_ContributingFactors',
      label: 'Contributing Factors',
      name: 'ContributingFactors',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_ContributingDepartment`,
      translationId: 'IM_IC_ContributingDepartment',
      label: 'Contributing Department',
      name: 'ContributingDepartment',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_IncidentReoccurrence`,
      translationId: 'IM_IC_IncidentReoccurrence',
      label: 'Incident Reoccurrence',
      name: 'IncidentReoccurrence',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_ReporttoExternalBody`,
      translationId: 'IM_IC_ReporttoExternalBody',
      label: 'Report to External Body',
      name: 'ReporttoExternalBody',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_Remarks`,
      translationId: 'IM_IC_Remarks',
      label: 'Remarks',
      name: 'Remarks',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_Attachment(s)`,
      translationId: 'IM_IC_Attachment(s)',
      label: 'Attachment',
      name: 'Attachment',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_ExistingAttachment(s)`,
      translationId: 'IM_IC_ExistingAttachment(s)',
      label: 'Existing Attachment',
      name: 'ExistingAttachment',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_CategoryAffected`,
      translationId: 'IM_IC_CategoryAffected',
      label: 'Category Affected',
      name: 'CategoryAffected',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_Consequence`,
      translationId: 'IM_IC_Consequence',
      label: 'Consequence',
      name: 'Consequence',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_Likelihood`,
      translationId: 'IM_IC_Likelihood',
      label: 'Likelihood',
      name: 'Likelihood',
      IsMandatory: false,
    },
    {
      fieldId: `IC_P_IncidentLevel(s)`,
      translationId: 'IM_IC_IncidentLevel',
      label: 'Incident Level',
      name: 'IncidentLevel',
      IsMandatory: false,
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
        .filter((region) => {
          if (regionCode === 'ALL') {
            return region.RegionCode === 'ALL';
          } else if (regionCode === 'ABD') {
            return region.RegionCode === 'ABD' || region.RegionCode === 'ALL';
          }
        })
        .flatMap((region) => region.Labels || [])
    );
  const filteredIncidentLabel = { Data: incidentLabels };

  const incidentApprovalLabels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 30)
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

  const filterIncidentApprovalLabels = { Data: incidentApprovalLabels };

  const filteredTitleConfig = titleConfig.filter((field) =>
    incidentLabels.some((label) => label.TranslationId === field.translationId)
  );

  const [configs, setConfigs] = useState({
    IncidentApproval,
    incidentLevel,
    additionalstaffLabels,
    FurtherActionsLabels,
    attachmentTable,
  });

  const stableFields = useMemo(() => filteredFields, [filteredFields]);
  const stableRegionCode = useMemo(() => regionCode, [regionCode]);

  // useEffect(() => {
  //   if (filteredFields) {
  //     const matchingSections = filteredFields?.Sections?.filter(
  //       (section) =>
  //         section.SectionName === 'Page' ||
  //         section.SectionName ===
  //           'Accordion-Further Actions Taken By Approver' ||
  //         section.SectionName === 'Accordion-Incident Level' ||
  //         section.SectionName === 'Accordion-Negligence From Staff'
  //     );

  //     const pageFields = matchingSections?.flatMap(
  //       (section) =>
  //         section?.Regions?.filter((region) => {
  //           const isIncluded =
  //             regionCode === 'ABD'
  //               ? region.RegionCode === 'ABD' || region.RegionCode === 'ALL'
  //               : region.RegionCode === 'ALL';
  //           return isIncluded;
  //         }).flatMap((region) => region.Fields || []) || []
  //     );

  //     console.log('pageFields', pageFields);

  //     if (pageFields && pageFields.length > 0) {
  //       const updatedConfigs = Object.entries(configs).reduce(
  //         (acc, [key, config]) => ({
  //           ...acc,
  //           [key]: config.filter((column) => {
  //             const pageField = pageFields.find(
  //               (col) => col.FieldId === column.fieldId
  //             );
  //             return pageField && pageField.IsShow === true;
  //           }),
  //         }),
  //         {}
  //       );
  //       console.log("updatedConfigs",updatedConfigs)
  //       setConfigs(updatedConfigs);
  //     }
  //   }
  // }, [stableFields, stableRegionCode]);

  const filteredIncidentApprovalConfig = IncidentApproval.filter((field) =>
    incidentApprovalLabels.some(
      (label) => label.TranslationId === field.translationId
    )
  );
  const handleSearch = () => {
    setIsIncidentCategoryModel(true);
  };

  const handleClose = () => {
    setIsIncidentCategoryModel(false);
  };

  const handleSelectRow = (incident) => {
    getFormBuilderData(incident.MainCategoryId);
    getFormSubCatBuilderData(incident.SubCategoryId);
    getIncidentFormBuilderData(incident.IncidentDetailId);

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
    getFormBuilderData(incident.MainCategoryId);
    getFormSubCatBuilderData(incident.SubCategoryId);
    getIncidentFormBuilderData(incident.IncidentDetailId);

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
  const affectedCategoryChange = (event) => {
    const selectedId = event?.target?.value || event?.key;
    const selectedItem = pageloadData?.Data?.AffectedcategoryList?.find(
      (item) => Number(item.AffectedCategoryId) === Number(selectedId)
    );

    if (selectedItem) {
      setAffectedCategory({
        id: selectedItem.AffectedCategoryId,
        name: selectedItem.AffectedCategory,
      });
    }
  };
  const consequenceChange = (event) => {
    const selectedId = event?.target?.value || event?.key;
    const selectedItem = pageloadData?.Data?.Consequence?.find(
      (item) => Number(item.ConsequenceId) === Number(selectedId)
    );

    if (selectedItem) {
      setConsequence({
        id: selectedItem.ConsequenceId,
        name: selectedItem.Consequence,
      });
    }
  };
  const likelihoodChange = (event) => {
    const selectedId = event?.target?.value || event?.key;
    const selectedItem = pageloadData?.Data?.Likelihood?.find(
      (item) => Number(item.LikelihoodId) === Number(selectedId)
    );

    if (selectedItem) {
      setLikelihood({
        id: selectedItem.LikelihoodId,
        name: selectedItem.Likelihood,
      });
    }
  };

  const handleLocationChange = (event) => {
    setLocationDetails(event.target.value);
  };
  const handleAdditionalStaffChange = (data) => {
    setAdditionalStaffChangeData(data);
    console.log('additionalstaff', data);
  };
  const handleFurtherActionChange = (data) => {
    setFurtherActionChangeData(data);
    console.log('furthertaff', data);
  };

  const harmLevelChange = (event) => {
    const selectedId = event?.target?.value || event?.key;
    const selectedItem = pageloadData?.Data?.HarmLevel?.find(
      (item) => Number(item.IncidentHarmLevelId) === Number(selectedId)
    );
    if (selectedItem) {
      setHarmLevel({
        id: selectedItem.IncidentHarmLevelId,
        name: selectedItem.IncidentHarmLevel,
      });
    }
  };
  const medicationHarmLevelChange = (event) => {
    const selectedId = event?.target?.value || event?.key;
    const selectedItem = pageloadData?.Data?.HarmLevel?.find(
      (item) => Number(item.IncidentHarmLevelId) === Number(selectedId)
    );
    if (selectedItem) {
      setMedicationHarmLevel({
        id: selectedItem.IncidentHarmLevelId,
        name: selectedItem.IncidentHarmLevel,
      });
    }
  };
  const ContributingFactorschange = (event) => {
    const selectedId = event?.target?.value || event?.key;
    const selectedItem = pageloadData?.Data?.ContributingMainFactor?.find(
      (item) => Number(item.MainFactorId) === Number(selectedId)
    );
    if (selectedItem) {
      setContributingFactors({
        id: selectedItem.MainFactorId,
        name: selectedItem.ContributingFactor,
      });
    }
  };
  const ContributingDepartmentChange = (event) => {
    const selectedId = event?.target?.value || event?.key;
    const selectedItem = pageloadData?.Data?.ContributingDepartment?.find(
      (item) => Number(item.DepartmentId) === Number(selectedId)
    );
    if (selectedItem) {
      setContributingDepartment({
        id: selectedItem.DepartmentId,
        name: selectedItem.ContributingFactor,
      });
    }
  };

  const handleSkilCancel = () => {
    setOpenSkillPopup(false);
  };
  const requiredFields = [
    'mainCategoryId',
    'mainCategory',
    'subCategoryId',
    'subCategory',
    'incidentHarmLevelId',
    'incidentHarmLevel',
    'incidentId',
    'approverUserId',
    'incidentTypeId',
    'incidentType',
    'clinicalType',
  ];

  const handleSaveRCASubmit = async (values) => {
    setOpenSkillPopup(false);
    console.log('SaveRCA:::', SaveRCA);

    const missingFields = requiredFields.filter((field) => !SaveRCA[field]);
    console.log('missingFields', missingFields);
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
      // const response = await triggerSaveRCA({
      //   payload: {
      //     ...common_data,
      //   },
      // }).unwrap();
      const formData = new FormData();
      formData.append('closureSave', JSON.stringify(SaveRCA));

      const response = await triggerSaveRCA({ formData });
      if (response?.error) {
        showSweetAlert({
          type: 'error',
          title: 'Operation Failed',
          text: response?.error?.data || 'Something went wrong!',
          gif: Error,
          showConfirmButton: true,
          confirmButtonText: 'Close',
        });

        setMessage(response?.error?.data || 'Upload Failed');
        return;
      }
      showToastAlert({
        type: 'custom_success',
        text: response.Message || 'Success',
        gif: SuccessGif,
      });
      setMessage(response.Message || 'Success');
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      navigate('/IncidentManagement/IncidentClosure');
    } catch (error) {
      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: error?.data || 'Something went wrong!',
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
  };

  const handleSecondDialogClose = () => {
    setOpenSecondDialog(false);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const handleSaveClick = () => {
    setConfirmAction(() => handleSaveRCASubmit);
    setOpenSecondDialog(true);
  };
  const handleClosureSaveClick = () => {
    setConfirmAction(() => handleSaveRCASubmit);

    setOpenDialog(true);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setOpenDialog(false);
  };
  const handleSecondConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setOpenSecondDialog(false);
  };

  const handleRCACancel = () => {
    setOpenRCAPopup(false);
  };

  const handleClick = () => {
    setsShowIncidentLevel(!showIncidentLevel);
  };

  const handleClinicalChange = (event) => {
    const newValue = event.target.value;
    setSelectedClinicalValue(newValue);
  };

  // Page load Data

  const { data: pageloadData = [], isFetching: ispageloadData } =
    useGetPageLoadDataQuery({
      headerFacilityId: selectedFacility?.id,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
    });

  // console.log("Pageload");
  // console.log(pageloadData?.Data?.HarmLevel);

  useEffect(() => {
    if (entrydetails?.Data) {
      getFormBuilderData(entrydetails.Data.MainCategoryId);
      getFormSubCatBuilderData(entrydetails.Data.SubCategoryId);
      getIncidentFormBuilderData(entrydetails.Data.IncidentDetailId);

      setIncidentMainCategory({
        id: entrydetails.Data.MainCategoryId,
        name: entrydetails.Data.MainCategory,
      });
      setMainCategoryCode({
        id: entrydetails.Data.MainCategoryId,
        name: entrydetails.Data.MainCategoryCode,
      });
      setIncidentSubCategory({
        id: entrydetails.Data.SubCategoryId,
        name: entrydetails.Data.SubCategory,
      });
      setSubCategoryCode({
        id: entrydetails.Data.SubCategoryId,
        name: entrydetails.Data.SubCategoryCode,
      });
      setIncidentSubCategory({
        id: entrydetails.Data.SubCategoryId,
        name: entrydetails.Data.SubCategory,
      });
      setIncidentDetails({
        id: entrydetails.Data.IncidentDetailId,
        name: entrydetails.Data.IncidentDetail,
      });
      setCategoryDetails({
        id: entrydetails.Data.IncidentDetailId,
        name: entrydetails.Data.IncidentDetailCode,
      });
      setAffectedCategoryName({
        id: entrydetails.Data.AffectedCategoryId,
        name: entrydetails.Data.AffectedCategory,
      });
      setAffectedCategoryCode({
        id: entrydetails.Data.AffectedCategoryId,
        name: entrydetails.Data.AffectedCategoryCode,
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
      setLocationDetails(entrydetails.Data.LocationDetials);
      setSelectedClinicalValue(entrydetails.Data.ClinicalType);
      setTextData({
        IncidentReason: entryData?.IncidentReason || '',
        LessonLearned: entryData?.LessonLearned || '',
      });
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
    IncidentClosureId: closureID,
    incidentNo: entryData?.IncidentNo,
    facilityId: selectedFacility?.id,
    approverUserId: userDetails?.UserId,
    incidentTypeId: incidentType.id,
    incidentType: incidentType.name,
    clinicalType: selectedClinicalValue,
    affectedCategoryId: entryData?.AffectedCategoryId,
    affectedCategory: entryData?.AffectedCategory,
    mainCategoryId: incidentMainCategory?.id,
    mainCategory: incidentMainCategory?.name,
    subCategoryId: incidentSubCategory?.id,
    subCategory: incidentSubCategory?.name,
    incidentDetailId: incidentDetails?.id,
    incidentDetail: incidentDetails?.name,
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
    slaPriority: '',
    moduleId: selectedModuleId,
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    othersName: '',
    incidentClosure_ReoccurrenceLog: ReoccurrenceLog,
    incidentClosure_AdditionalNotifyStaff: [],
    incidentClosure_NegligenceStaff: [],
    incidentClosure_Actions: [],
    incidentClosure_ContributingFactor: [],
    incidentClosure_Attachment: [],
    incidentClosure_IncidentRiskLevel: [],
    allQuestionMetaData: {
      mainCategoryFormData: questionsData,
    mainCategoryFormValueData: mainCategoryFormValueData,
    subCategoryFormData: subCategoryQuestionsData,
    subCategoryFormValueData: subCategoryFormValueData,
    incidentDetailFormData: incidentQuestionsData,
    incidentDetailFormValueData: incidentDetailFormValueData,
  },
    incidentClosure_IncidentRiskLevel: [
      {
        categoryAffectedId: 1,
        consequenceLevelId: 1,
        consequenceId: 1,
      },
    ],
  };
  const FillRCA = {
    jawdaLevelId: null,
    jawdaLevel: '',
    incidentReason: '',
    lessonLearned: '',
    contributingDepartmentId: null,
    tbdCommittee: '',
    reportExternalBody: '',
    externalBody: '',
    remarks: '',
    likelihoodId: 1,
    likelihood: '',
    incidentRiskLevelId: 1,
    incidentRiskLevel: '',
    consequenceLevelId: 1,
    consequenceLevel: '',
    fishboneAutogenFileName: '',
    fishboneOriginalFileName: '',
    fishboneAutogenFilePath: '',
    fishboneOriginalFilePath: '',
    categoryAffectedId: 1,
    categoryAffected: '',
  };

  const SaveRCA = {
    incidentId: id,
    IncidentClosureId: closureID,
    // incidentNo: entryData?.IncidentNo,
    incidentNo: 'MDS-19122024-016',
    facilityId: selectedFacility?.id,
    approverUserId: userDetails?.UserId,
    incidentTypeId: incidentType.id,
    incidentType: incidentType.name,
    clinicalType: selectedClinicalValue,
    affectedCategoryId: entryData?.AffectedCategoryId,
    affectedCategory: entryData?.AffectedCategory,
    mainCategoryId: incidentMainCategory?.id,
    mainCategory: incidentMainCategory?.name,
    subCategoryId: incidentSubCategory?.id,
    subCategory: incidentSubCategory?.name,
    incidentDetailId: incidentDetails?.id,
    incidentDetail: incidentDetails?.name,
    departmentId: incidentDepartment?.id,
    departmentName: incidentDepartment?.name,
    incidentHarmLevelId: harmLevel?.id,
    incidentHarmLevel: harmLevel?.name,
    jawdaLevelId: null,
    jawdaLevel: '',
    affectedCategoryId: 1,
    affectedCategory: 'PATIENT',
    mainCategoryId: incidentMainCategory?.id,
    mainCategory: incidentMainCategory?.name,
    subCategoryId: incidentSubCategory?.id,
    subCategory: incidentSubCategory?.name,
    incidentDetailId: incidentDetails?.id,
    incidentDetail: incidentDetails?.name,
    incidentReason: 'test catda',
    lessonLearned: 'sdxs',
    incidentHarmLevelId: harmLevel?.id,
    incidentHarmLevel: harmLevel?.name,
    contributingDepartmentId: null,
    incidentReoccurence: 'no',
    tbdCommittee: 'adjlasd asdioads',
    reportExternalBody: 'Yes',
    externalBody: '2,3,4',
    remarks: 'test rearks',
    likelihoodId: 1,
    likelihood: '',
    incidentRiskLevelId: 1,
    incidentRiskLevel: '',
    consequenceLevelId: 1,
    consequenceLevel: '',
    isRCARequired: false,
    isRCACompleted: false,
    skipRCA: false,
    closureStatus: 'Completed',
    isSentinel: true,
    slaPriority: '',
    incidentClosureTATId: 10,
    closureTATDays: 23,
    othersName: null,
    categoryAffectedId: 1,
    categoryAffected: '',
    fishboneAutogenFileName: '',
    fishboneOriginalFileName: '',
    fishboneAutogenFilePath: '',
    fishboneOriginalFilePath: '',
    moduleId: 2,
    menuId: 30,
    loginUserId: 1,
    incidentClosure_ReoccurrenceLog: [],
    incidentClosure_NegligenceStaff: [],
    incidentClosure_Actions: furtherActionChangeData?.map((item) => ({
      rowNo: item.RowNo,
      taskAssigned: item.ResponsibleStaff,
      targetDate: item.TargetDate,
      userId: item.ResponsibleStaffId,
    })),
    incidentClosure_ContributingFactor: [],
    incidentClosure_Attachment: [],
    incidentClosure_IncidentRiskLevel: [
      {
        categoryAffectedId: 1,
        consequenceLevelId: 1,
        consequenceId: 1,
      },
    ],
    allQuestionMetaData: {
      mainCategoryFormData: questionsData,
    mainCategoryFormValueData: mainCategoryFormValueData,
    subCategoryFormData: subCategoryQuestionsData,
    subCategoryFormValueData: subCategoryFormValueData,
    incidentDetailFormData: incidentQuestionsData,
    incidentDetailFormValueData: incidentDetailFormValueData,
  },
  };

  const pdfSectionRef = useRef(null);

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
        title: 'JAWDALevel',
        data: jawdaIncident,
      },
    };

    const { title, data } = modalConfig[fieldName] || {};
    if (title && data) {
      handleModalOpen(title, data);
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

  const handleFieldChange = (fieldName, value) => {
    setTextData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  return (
    <>
      <EntryInvestigationAccordion />

      <FlexContainer
        style={{ flexDirection: 'column', width: '100%', marginTop: '10px' }}
      >
        <FlexContainer style={{ backgroundColor: '#fff' }}>
          <Box paddingTop={0} style={{ width: '-webkit-fill-available' }}>
            <Accordion
              sx={{
                // marginBottom: '10px',
                border: '1px solid  #e6a81c',
                borderRadius: '8px 8px 0px 0px',
              }}
              expanded={true}
            >
              <AccordionSummary
                expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  backgroundColor: '#e6a81c',
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
                    width: '100%',
                    textAlign: 'center',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {t('MM_IncidentClosure')}
                </StyledTypography>
              </AccordionSummary>
              <FormContainer style={{ marginBottom: '20px' }}>
                <FlexContainer flexDirection={'column'}>
                  <Grid container spacing={2} p={2} style={{ padding: '0px' }}>
                    <Grid item xs={12}>
                      {filteredIncidentApprovalConfig.some(
                        (config) => config.name === 'IncidentType'
                      ) && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                          }}
                        >
                          <FormLabel
                            style={{ whiteSpace: 'nowrap', minWidth: '150px' }}
                          >
                            {getlabel(
                              filteredIncidentApprovalConfig.find(
                                (config) => config.name === 'IncidentType'
                              )?.translationId,
                              filterIncidentApprovalLabels,
                              i18n.language
                            )}
                            {filteredIncidentApprovalConfig.find(
                              (config) => config.name === 'IncidentType'
                            )?.IsMandatory && (
                              <span style={{ color: 'red' }}> *</span>
                            )}
                          </FormLabel>

                          <div style={{ width: '200px' }}>
                            <Dropdown
                              options={
                                pageloadData?.Data?.IncidentTypeList?.map(
                                  (item) => ({
                                    value: item.IncidentTypeId,
                                    text: item.IncidentTypeName,
                                  })
                                ) || []
                              }
                              value={incidentType.id}
                              onChange={(event) => typeChange(event)}
                            />
                          </div>
                        </div>
                      )}
                    </Grid>

                    {/* Row 2: Incident Title (single item) */}
                    <Grid item xs={12}>
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
                    </Grid>

                    {[
                      [
                        'AffectedCategory',
                        'AffectedCategoryCode',
                        'IncidentMainCategory',
                      ],
                      [
                        'MainCategoryCode',
                        'IncidentSubCategory',
                        'SubCategoryCode',
                      ],
                      ['IncidentDetail', 'IncidentDetailCode'],
                    ].map((rowFields, rowIndex) => (
                      <React.Fragment key={`row-${rowIndex}`}>
                        {rowFields.map((name) => {
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
                                  {field.IsMandatory && (
                                    <span style={{ color: 'red' }}> *</span>
                                  )}
                                </FormLabel>
                                <TextField
                                  fullWidth
                                  value={
                                    name === 'IncidentMainCategory'
                                      ? incidentMainCategory?.name || ''
                                      : name === 'IncidentSubCategory'
                                        ? incidentSubCategory?.name || ''
                                        : name === 'IncidentDetail'
                                          ? incidentDetails?.name ||
                                            categoryDetails?.name ||
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
                                                  : name ===
                                                      'IncidentDetailCode'
                                                    ? categoryDetailsCode?.name ||
                                                      categoryDetailsCode?.value
                                                    : ''
                                  }
                                  disabled
                                  InputProps={{
                                    disableUnderline: true,
                                    style: {
                                      fontWeight: 400,
                                      color: 'black',
                                    },
                                  }}
                                  sx={{
                                    '& .MuiInputBase-input.Mui-disabled': {
                                      opacity: 1,
                                      fontWeight: 400,
                                      color: 'black !important',
                                      WebkitTextFillColor: 'black !important',
                                      backgroundColor: '#f2f2f2',
                                      borderRadius: '4px',
                                      paddingLeft: '8px',
                                      paddingRight: '8px',
                                    },
                                  }}
                                />
                              </Grid>
                            );
                          }
                          return null;
                        })}
                      </React.Fragment>
                    ))}

                    <Grid item xs={12} mt={2}>
                      {filteredIncidentApprovalConfig.some(
                        (config) => config.name === 'Clinical/NonClinical'
                      ) && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                          }}
                        >
                          <FormLabel
                            style={{ whiteSpace: 'nowrap', minWidth: '150px' }}
                          >
                            {getlabel(
                              filteredIncidentApprovalConfig.find(
                                (config) =>
                                  config.name === 'Clinical/NonClinical'
                              )?.translationId,
                              filterIncidentApprovalLabels,
                              i18n.language
                            )}
                            {filteredIncidentApprovalConfig.find(
                              (config) => config.name === 'Clinical/NonClinical'
                            )?.IsMandatory && (
                              <span style={{ color: 'red' }}> *</span>
                            )}
                          </FormLabel>

                          <div style={{ width: '200px' }}>
                            <Dropdown
                              options={[
                                { value: 'Clinical', text: 'Clinical' },
                                { value: 'NonClinical', text: 'NonClinical' },
                              ]}
                              value={selectedClinicalValue}
                              onChange={handleClinicalChange}
                            />
                          </div>
                        </div>
                      )}
                    </Grid>

                    {questionsData?.length > 0 && (
                      <Grid item xs={12} mt={2}>
                        <FormLabel
                          style={{
                            whiteSpace: 'nowrap',
                            minWidth: '150px',
                            marginBottom: '8px',
                          }}
                        >
                          Questions:
                        </FormLabel>
                        <Box mb={2}>
                          <DynamicFormBuilder
                            formData={questionsData}
                            formValues={mainCategoryFormValueDataObject}
                            onChange={handleMainCategoryChange}
                          />
                        </Box>
                        <Box mb={2}>
                          <DynamicFormBuilder
                            formData={subCategoryQuestionsData}
                            formValues={subCategoryFormValueDataObject}
                            onChange={handleSubCategoryChange}
                          />
                        </Box>
                        <Box mb={2}>
                          <DynamicFormBuilder
                            formData={incidentQuestionsData}
                            formValues={incidentDetailFormValueDataObject}
                            onChange={handleIncidentDetailChange}
                          />
                        </Box>
                      </Grid>
                    )}

                    <Grid container spacing={1}>
                      {filteredTitleConfig?.length > 0 &&
                        ['LessonLearned', 'IncidentReason'].map((name) => {
                          const field = filteredTitleConfig.find(
                            (f) => f.name === name
                          );
                          console.log('Debug - Field check for:', name, field);

                          const translatedLabel = getlabel(
                            field?.translationId,
                            filteredIncidentLabel,
                            i18n.language
                          );

                          if (field) {
                            return (
                              <Grid item xs={12} key={field.name} m={2}>
                                <FormLabel
                                  style={{
                                    whiteSpace: 'nowrap',
                                    minWidth: '150px',
                                  }}
                                >
                                  {translatedLabel}
                                </FormLabel>

                                <TextField
                                  multiline
                                  variant="outlined"
                                  fullWidth
                                  rows={4}
                                  sx={{
                                    width: '100%',
                                    '& .MuiOutlinedInput-root': {
                                      minHeight: '120px',
                                      display: 'flex',
                                      alignItems: 'start',
                                    },
                                    '& .MuiInputBase-input': {
                                      minHeight: '120px',
                                      padding: '10px',
                                      boxSizing: 'border-box',
                                    },
                                  }}
                                  value={textData?.[name] || ''}
                                  onChange={(e) =>
                                    handleFieldChange(name, e.target.value)
                                  }
                                />
                              </Grid>
                            );
                          }
                          return null;
                        })}
                    </Grid>

                    {filteredIncidentApprovalConfig.some(
                      (config) => config.name === 'HarmLevel'
                    ) && (
                      <Grid item xs={6}>
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
                          )?.IsMandatory && (
                            <span style={{ color: 'red' }}> *</span>
                          )}
                          <Tooltip title="View Definition">
                            <IconButton
                              size="small"
                              onClick={() => openModalForField('HarmLevel')}
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

                        <Dropdown
                          options={
                            pageloadData?.Data?.HarmLevel?.map((item) => ({
                              value: item.IncidentHarmLevelId,
                              text: item.IncidentHarmLevel,
                            })) || []
                          }
                          value={harmLevel.id}
                          onChange={(e) => harmLevelChange(e)}
                          id={entrydetails?.Data?.IncidentHarmLevelId}
                        />
                      </Grid>
                    )}

                    {filteredIncidentApprovalConfig.some(
                      (config) => config.name === 'MedicationIncidentHarmLevel'
                    ) && (
                      <Grid item xs={6}>
                        <FormLabel>
                          {getlabel(
                            filteredIncidentApprovalConfig.find(
                              (config) =>
                                config.name === 'MedicationIncidentHarmLevel'
                            )?.translationId,
                            filterIncidentApprovalLabels,
                            i18n.language
                          )}
                          {filteredIncidentApprovalConfig.find(
                            (config) =>
                              config.name === 'MedicationIncidentHarmLevel'
                          )?.IsMandatory && (
                            <span style={{ color: 'red' }}> *</span>
                          )}
                          <Tooltip title="View Definition">
                            <IconButton
                              size="small"
                              onClick={() =>
                                openModalForField('MedicationIncidentHarmLevel')
                              }
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

                        <Dropdown
                          options={
                            pageloadData?.Data?.HarmLevel?.map((item) => ({
                              value: item.IncidentHarmLevelId,
                              text: item.IncidentHarmLevel,
                            })) || []
                          }
                          value={medicationHarmLevel.id}
                          onChange={(event) => medicationHarmLevelChange(event)}
                        />
                      </Grid>
                    )}

                    <DynamicModal
                      open={isModalOpen}
                      onClose={handleModalClose}
                      title={modalData.title}
                      data={modalData.data}
                    />

                    {filteredIncidentApprovalConfig.some(
                      (config) => config.name === 'ContributingFactors'
                    ) && (
                      <Grid item xs={4}>
                        <FormLabel>
                          {getlabel(
                            filteredIncidentApprovalConfig.find(
                              (config) => config.name === 'ContributingFactors'
                            )?.translationId,
                            filterIncidentApprovalLabels,
                            i18n.language
                          )}
                          {filteredIncidentApprovalConfig.find(
                            (config) => config.name === 'ContributingFactors'
                          )?.IsMandatory && (
                            <span style={{ color: 'red' }}> *</span>
                          )}
                        </FormLabel>

                        <Dropdown
                          options={
                            pageloadData?.Data?.ContributingMainFactor?.map(
                              (item) => ({
                                value: item.MainFactorId,
                                text: item.ContributingFactor,
                              })
                            ) || []
                          }
                          value={contributingFactors.id}
                          onChange={(event) => ContributingFactorschange(event)}
                        />
                      </Grid>
                    )}

                    {filteredIncidentApprovalConfig.some(
                      (config) => config.name === 'ContributingDepartment'
                    ) && (
                      <Grid item xs={4}>
                        <FormLabel>
                          {getlabel(
                            filteredIncidentApprovalConfig.find(
                              (config) =>
                                config.name === 'ContributingDepartment'
                            )?.translationId,
                            filterIncidentApprovalLabels,
                            i18n.language
                          )}
                          {filteredIncidentApprovalConfig.find(
                            (config) => config.name === 'ContributingDepartment'
                          )?.IsMandatory && (
                            <span style={{ color: 'red' }}> *</span>
                          )}
                        </FormLabel>

                        <Dropdown
                          options={
                            pageloadData?.Data?.ContributingDepartment?.map(
                              (item) => ({
                                value: item.DepartmentId,
                                text: item.DepartmentName,
                              })
                            ) || []
                          }
                          value={contributingDepartment.id}
                          onChange={(event) =>
                            ContributingDepartmentChange(event)
                          }
                        />
                      </Grid>
                    )}

                    {filteredIncidentApprovalConfig.some(
                      (config) => config.name === 'IncidentReoccurrence'
                    ) && (
                      <Grid item xs={4}>
                        <FormLabel>
                          {getlabel(
                            filteredIncidentApprovalConfig.find(
                              (config) => config.name === 'IncidentReoccurrence'
                            )?.translationId,
                            filterIncidentApprovalLabels,
                            i18n.language
                          )}
                          {filteredIncidentApprovalConfig.find(
                            (config) => config.name === 'IncidentReoccurrence'
                          )?.IsMandatory && (
                            <span style={{ color: 'red' }}> *</span>
                          )}
                        </FormLabel>
                        <TextField
                          name="IncidentReoccurence"
                          value={entrydetails?.Data?.IncidentReoccurence || ''}
                          style={{ width: '100%' }}
                          disabled
                          sx={{
                            '& .MuiInputBase-input.Mui-disabled': {
                              opacity: 1,
                              fontWeight: 400,
                              color: 'black !important',
                              WebkitTextFillColor: 'black !important',
                              backgroundColor: '#f2f2f2',
                              borderRadius: '4px',
                              paddingLeft: '8px',
                              paddingRight: '8px',
                            },
                          }}
                        />
                      </Grid>
                    )}
                  </Grid>

                  {filteredIncidentApprovalConfig.some(
                    (config) => config.name === 'NegligenceFromStaff'
                  ) && (
                    <Grid item xs={4}>
                      <Typography variant="body1" component="div">
                        <FormLabel style={{ marginTop: '30px' }}>
                          {getlabel(
                            filteredIncidentApprovalConfig.find(
                              (config) => config.name === 'NegligenceFromStaff'
                            )?.translationId,
                            filterIncidentApprovalLabels,
                            i18n.language
                          )}
                        </FormLabel>
                      </Typography>
                    </Grid>
                  )}

                  {configs.additionalstaffLabels?.length > 0 && (
                    <AdditionalStafftable
                      columns={configs.additionalstaffLabels}
                      labels={filterIncidentApprovalLabels}
                      onDataChange={handleAdditionalStaffChange}
                    />
                  )}

                  <FormLabel>
                    {getlabel(
                      filteredIncidentApprovalConfig.find(
                        (config) =>
                          config.name === 'FurtherActionsTakenByApprover'
                      )?.translationId,
                      filterIncidentApprovalLabels,
                      i18n.language
                    )}
                  </FormLabel>

                  {configs.FurtherActionsLabels?.length > 0 && (
                    <FurtherActionTable
                      columns={configs.FurtherActionsLabels}
                      labels={filterIncidentApprovalLabels}
                      onDataChange={handleFurtherActionChange}
                    />
                  )}

                  <StyledGridContainer
                    style={{
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '16px',
                      padding: '0px',
                    }}
                  >
                    <StyledGridItem>
                      <FormLabel>
                        {getlabel(
                          filteredIncidentApprovalConfig.find(
                            (config) =>
                              config.name === 'TobeDiscussedinCommittee'
                          )?.translationId,
                          filterIncidentApprovalLabels,
                          i18n.language
                        )}
                        {filteredIncidentApprovalConfig.find(
                          (config) => config.name === 'TobeDiscussedinCommittee'
                        )?.IsMandatory && (
                          <span style={{ color: 'red' }}> *</span>
                        )}
                      </FormLabel>
                      <TextField name="branchName" style={{ width: '100%' }} />
                    </StyledGridItem>

                    <StyledGridItem>
                      <FormLabel>
                        {getlabel(
                          filteredIncidentApprovalConfig.find(
                            (config) => config.name === 'ReporttoExternalBody'
                          )?.translationId,
                          filterIncidentApprovalLabels,
                          i18n.language
                        )}
                        {filteredIncidentApprovalConfig.find(
                          (config) => config.name === 'ReporttoExternalBody'
                        )?.IsMandatory && (
                          <span style={{ color: 'red' }}> *</span>
                        )}
                      </FormLabel>
                      <Dropdown
                        name="ReporttoExternalBody"
                        options={[
                          { text: 'No', value: 'No' },
                          { text: 'Yes', value: 'Yes' },
                        ]}
                        style={{ width: '100%' }}
                        value={ReporttoExternalBody}
                        onChange={(event) => {
                          setReporttoExternalBody(event.target.value);
                        }}
                      />
                    </StyledGridItem>

                    {/* <StyledGridItem>
                      <FormLabel>Select External Body</FormLabel>
                      <Dropdown name="ExternalBody" />
                    </StyledGridItem> */}

                    {filteredIncidentApprovalConfig.some(
                      (config) => config.name === 'Remarks'
                    ) && (
                      <StyledGridItem
                        style={{
                          gridColumn: '1 / -1',
                          width: '100%',
                        }}
                      >
                        <FormLabel>
                          {getlabel(
                            filteredIncidentApprovalConfig.find(
                              (config) => config.name === 'Remarks'
                            )?.translationId,
                            filterIncidentApprovalLabels,
                            i18n.language
                          )}
                        </FormLabel>
                        <TextField
                          sx={{
                            '.MuiOutlinedInput-root': {
                              height: '150px',
                            },
                          }}
                          multiline
                          variant="outlined"
                          fullWidth
                          rows={4}
                          // onChange={(e) => handleFieldChange(e, field.name)}
                        />
                      </StyledGridItem>
                    )}
                  </StyledGridContainer>

                  <FlexContainer
                    flexDirection={'column'}
                    style={{ marginBottom: '20px' }}
                  >
                    <Grid
                      container
                      spacing={2}
                      p={0}
                      mt={2}
                      alignItems="stretch"
                    >
                      {/* Attachment Section */}
                      <Grid
                        item
                        xs={6}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <FormLabel>
                          {getlabel(
                            filteredIncidentApprovalConfig.find(
                              (config) => config.name === 'Attachment'
                            )?.translationId,
                            filterIncidentApprovalLabels,
                            i18n.language
                          )}
                        </FormLabel>

                        <div
                          style={{
                            border: '3px dashed rgba(0, 0, 0, .3)',
                            padding: '10px',
                            borderRadius: '4px',
                            background: 'rgba(255, 255, 255, 1)',
                            height: '170px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            overflowY: 'auto',
                          }}
                        >
                          <Button
                            variant="contained"
                            onClick={handleUploadClick}
                            style={{
                              backgroundColor: '#4679bd',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              color: '#fff',
                              fontSize: '13px',
                              alignSelf: 'center',
                              paddingRight: 10,
                              paddingLeft: 10,
                            }}
                          >
                            <i
                              className="fas fa-paperclip"
                              style={{
                                fontSize: '14px',
                                color: 'white',
                              }}
                            ></i>
                            {getlabel(
                              filteredIncidentApprovalConfig.find(
                                (config) => config.name === 'Attachment'
                              )?.translationId,
                              filterIncidentApprovalLabels,
                              i18n.language
                            )}
                          </Button>
                          <input
                            id="fileInput"
                            type="file"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                          />

                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                              maxHeight: '120px',
                              overflowY: 'auto',
                            }}
                          >
                            {files?.map((file, index) => {
                              const fileDisplayName =
                                file.OriginalFileName.length > 18
                                  ? `${file.OriginalFileName.substring(0, 15)}...`
                                  : file.OriginalFileName;

                              return (
                                <div
                                  key={index}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    background: '#f9f9f9',
                                    padding: '12px',
                                    borderRadius: '4px',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <div
                                    style={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      gap: '5px',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      flexGrow: 1,
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: '12px',
                                        fontWeight: '700',
                                        color: '#1155cc',
                                      }}
                                    >
                                      {fileDisplayName}
                                    </span>
                                  </div>

                                  <div>
                                    <i
                                      className="fas fa-trash-alt"
                                      style={{
                                        cursor: 'pointer',
                                        width: '16px',
                                        height: '16px',
                                        marginLeft: '10px',
                                        color: '#4679bd',
                                        fontSize: '16px',
                                        display: 'inline-block',
                                      }}
                                      onClick={(e) =>
                                        handleDeleteClick(e, file)
                                      }
                                    ></i>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <Typography
                          variant="body2"
                          color="error"
                          style={{ marginTop: '10px', marginBottom: '10px' }}
                        >
                          Note: Maximum File Upload Limit is 100MB (Images, PDF,
                          Word Files, Excel Files Only)
                        </Typography>
                      </Grid>

                      {/* Comments Section */}
                      <Grid
                        item
                        xs={6}
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                        }}
                      >
                        <FormLabel>
                          {getlabel(
                            filteredIncidentApprovalConfig.find(
                              (config) => config.name === 'ExistingAttachment'
                            )?.translationId,
                            filterIncidentApprovalLabels,
                            i18n.language
                          )}
                        </FormLabel>
                        <AttachmentTable
                          columns={configs.attachmentTable}
                          labels={filterIncidentApprovalLabels}
                        />
                      </Grid>
                    </Grid>

                    {/* BUTTONS */}
                    <FlexContainer
                      padding="0px"
                      justifyContent="center"
                      alignItems="center"
                      gap="20px"
                    >
                      {/* Submit Button */}
                      <ActionButton
                        style={{
                          backgroundColor: '#5cb85c',
                          color: 'white',
                        }}
                        startIcon={
                          <i
                            className="fas fa-save"
                            style={{ marginInlineEnd: 8, fontSize: 14 }}
                          />
                        }
                        onClick={handleClick}
                        // onClick={handleSubmit}
                        // disabled={isActionDisabled || showAccordion} // Disable based on state
                      >
                        Fill Incident Level
                      </ActionButton>

                      {/* Request Opinion Button */}
                      <ActionButton
                        style={{
                          backgroundColor: '#337ab7',
                          color: 'white',
                        }}
                        startIcon={
                          <i
                            className="fas fa-save"
                            style={{ marginInlineEnd: 8, fontSize: 14 }}
                          />
                        }
                        // onClick={() => {
                        //   setShowAccordion(true);
                        //   setShowRejectInvestigation(false);
                        //   setIsActionDisabled(false);
                        // }}
                        // disabled={isActionDisabled}

                        onClick={handleClosureSaveClick}
                      >
                        Save
                      </ActionButton>

                      {/* Cancel Button */}
                      <ActionButton
                        sx={{
                          backgroundColor: 'white',
                          color: 'black !important',
                          border: '1px solid #1976d2',
                          '&:hover': {
                            backgroundColor: 'white',
                          },
                        }}
                        onClick={() => {
                          navigate('/IncidentManagement/IncidentClosure');
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
                    </FlexContainer>
                  </FlexContainer>
                </FlexContainer>

                {/* {selectedAction === 'approve' && (
              

              )} */}
                {/* </Box> */}
              </FormContainer>
            </Accordion>

            {/* INCIDENT lEVEL */}
            {showIncidentLevel && (
              <Accordion
                sx={{
                  marginBottom: '10px',
                  border: '1px solid  #3498db',
                  borderRadius: '8px 8px 0px 0px',
                }}
                expanded={true}
              >
                <AccordionSummary
                  expandIcon={
                    <StyledImage src={ExpandIcon} alt="Expand Icon" />
                  }
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{
                    backgroundColor: '#3498db',
                    width: '100%',
                  }}
                >
                  <StyledTypography
                    fontSize="18px"
                    fontWeight="700"
                    lineHeight="20px"
                    textAlign="center"
                    color="#FFFFFF"
                  >
                    {t('IncidentRiskLevel')}
                  </StyledTypography>
                </AccordionSummary>
                <FormContainer style={{ marginBottom: '20px' }}>
                  <FlexContainer flexDirection={'column'}>
                    <Grid
                      container
                      spacing={2}
                      p={2}
                      style={{ padding: '0px' }}
                    ></Grid>

                    <StyledGridContainer
                      style={{
                        gridTemplateColumns: 'repeat(1, 1fr)',
                        gap: '16px',
                        padding: '0px',
                      }}
                    >
                      {filteredIncidentApprovalConfig.some(
                        (config) => config.name === 'CategoryAffected'
                      ) && (
                        <StyledGridItem mt={2}>
                          <h6>
                            <strong>Affected Category and Factor(s)</strong>
                          </h6>
                          <FormLabel>
                            {getlabel(
                              filteredIncidentApprovalConfig.find(
                                (config) => config.name === 'CategoryAffected'
                              )?.translationId,
                              filterIncidentApprovalLabels,
                              i18n.language
                            )}
                            {filteredIncidentApprovalConfig.find(
                              (config) => config.name === 'CategoryAffected'
                            )?.IsMandatory && (
                              <span style={{ color: 'red' }}> *</span>
                            )}
                          </FormLabel>
                          <Dropdown
                            options={
                              pageloadData?.Data?.AffectedcategoryList?.map(
                                (item) => ({
                                  value: item.AffectedCategoryId,
                                  text: item.AffectedCategory,
                                })
                              ) || []
                            }
                            value={affectedCategory.id}
                            onChange={(event) => affectedCategoryChange(event)}
                          />
                        </StyledGridItem>
                      )}

                      {filteredIncidentApprovalConfig.some(
                        (config) => config.name === 'Consequence'
                      ) && (
                        <StyledGridItem>
                          <FormLabel>
                            {getlabel(
                              filteredIncidentApprovalConfig.find(
                                (config) => config.name === 'Consequence'
                              )?.translationId,
                              filterIncidentApprovalLabels,
                              i18n.language
                            )}
                            {filteredIncidentApprovalConfig.find(
                              (config) => config.name === 'Consequence'
                            )?.IsMandatory && (
                              <span style={{ color: 'red' }}> *</span>
                            )}
                          </FormLabel>
                          <Dropdown
                            options={
                              pageloadData?.Data?.Consequence?.map((item) => ({
                                value: item.ConsequenceId,
                                text: item.Consequence,
                              })) || []
                            }
                            value={consequence.id}
                            onChange={(event) => consequenceChange(event)}
                          />
                        </StyledGridItem>
                      )}

                      {filteredIncidentApprovalConfig.some(
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
                            {filteredIncidentApprovalConfig.find(
                              (config) => config.name === 'Likelihood'
                            )?.IsMandatory && (
                              <span style={{ color: 'red' }}> *</span>
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
                          <Dropdown
                            options={
                              pageloadData?.Data?.Likelihood?.map((item) => ({
                                value: item.LikelihoodId,
                                text: item.Likelihood,
                              })) || []
                            }
                            value={Likelihood.id}
                            onChange={(event) => likelihoodChange(event)}
                          />
                        </StyledGridItem>
                      )}

                      <DynamicModal
                        open={isModalOpen}
                        onClose={handleModalClose}
                        title={modalData.title}
                        data={modalData.data}
                      />
                      {/* BUTTONS */}
                      <FlexContainer
                        padding="0px"
                        justifyContent="center"
                        alignItems="center"
                        gap="20px"
                      >
                        {/* Submit Button */}
                        <ActionButton
                          style={{
                            backgroundColor: '#5cb85c',
                            color: 'white',
                          }}
                          startIcon={
                            <i
                              className="fas fa-save"
                              style={{ marginInlineEnd: 8, fontSize: 14 }}
                            />
                          }
                          onClick={handleButtonClick}
                          // disabled={isActionDisabled || showAccordion} // Disable based on state
                        >
                          Calculate Risk Level
                        </ActionButton>

                        <ActionButton
                          style={{
                            backgroundColor: '#337ab7',
                            color: 'white',
                            marginBottom: '10px',
                          }}
                          startIcon={
                            <i
                              className="fas fa-save"
                              style={{ marginInlineEnd: 8, fontSize: 14 }}
                            />
                          }
                          // onClick={() => {
                          //   setShowAccordion(true);
                          //   setShowRejectInvestigation(false);
                          //   setIsActionDisabled(false);
                          // }}
                          // disabled={isActionDisabled}
                          onClick={() => {
                            setLikelihood('');
                            setConsequence('');
                            setAffectedCategory('');
                            setShowContainer(false);
                            setShouldFetchData(false);
                          }}
                        >
                          Clear
                        </ActionButton>
                      </FlexContainer>
                    </StyledGridContainer>
                    {showContainer && (
                      <FlexContainer
                        flexDirection={'column'}
                        style={{ marginBottom: '20px' }}
                        marginTop="10px"
                      >
                        <IncidentLevel
                          columns={configs.incidentLevel}
                          labels={filterIncidentApprovalLabels}
                          likelihoodId={Likelihood.id}
                          consequenceLevelId={consequence.id}
                          incidentNo={entrydetails?.Data?.IncidentNo}
                          commondata={common_data}
                          FillRCA={FillRCA}
                          SaveRCA={SaveRCA}
                          data={incidentLevelData?.incidentRiskLevelClosure}
                        />
                      </FlexContainer>
                    )}
                  </FlexContainer>

                  {/* </Box> */}
                </FormContainer>

                {/* BUTTONS */}
                <FlexContainer
                  padding="0px"
                  justifyContent="center"
                  alignItems="center"
                  gap="20px"
                  style={{
                    marginBottom: '25px',
                  }}
                >
                  {/* Submit Button */}
                  <ActionButton
                    style={{
                      backgroundColor: '#5cb85c',
                      color: 'white',
                    }}
                    startIcon={
                      <i
                        className="fas fa-save"
                        style={{ marginInlineEnd: 8, fontSize: 14 }}
                      />
                    }
                    // onClick={handleSubmit}
                    // disabled={isActionDisabled || showAccordion} // Disable based on state
                  >
                    Approve Incident Closure
                  </ActionButton>

                  {/* Request Opinion Button */}
                  <ActionButton
                    style={{
                      backgroundColor: '#337ab7',
                      color: 'white',
                    }}
                    startIcon={
                      <i
                        className="fas fa-save"
                        style={{ marginInlineEnd: 8, fontSize: 14 }}
                      />
                    }
                    // onClick={() => {
                    //   setShowAccordion(true);
                    //   setShowRejectInvestigation(false);
                    //   setIsActionDisabled(false);
                    // }}
                    // disabled={isActionDisabled}
                    onClick={handleSaveClick}
                  >
                    Save
                  </ActionButton>

                  {/* Cancel Button */}
                  <ActionButton
                    sx={{
                      backgroundColor: 'white',
                      color: 'black !important',
                      border: '1px solid #1976d2',
                      '&:hover': {
                        backgroundColor: 'white',
                      },
                    }}
                    onClick={() => {
                      navigate('/IncidentManagement/IncidentClosure');
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
                </FlexContainer>
              </Accordion>
            )}

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
                      onSubmit={(values) => console.log('Form Values:', values)}
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
                                          event?.target?.value || event?.value;
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
          </Box>
        </FlexContainer>
        <div>
          <Dialog
            open={openDialog}
            onClose={handleDialogClose}
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
              Confirm to Draft
            </DialogTitle>
            <DialogActions
              sx={{
                display: 'flex',
                justifyContent: 'center',
                padding: '16px',
                gap: 3,
              }}
            >
              <ActionButton
                onClick={() => setOpenDialog(false)}
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
                onClick={handleConfirm}
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
          <Dialog
            open={openSecondDialog}
            onClose={handleSecondDialogClose}
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
              Confirm to Draft
            </DialogTitle>
            <DialogActions
              sx={{
                display: 'flex',
                justifyContent: 'center',
                padding: '16px',
                gap: 3,
              }}
            >
              <ActionButton
                onClick={() => setOpenSecondDialog(false)}
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
                onClick={handleSecondConfirm}
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
      </FlexContainer>
    </>
  );
};

export default ClosureEntry;
