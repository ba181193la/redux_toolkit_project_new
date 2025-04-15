import {
  Grid,
  TextField,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
 Tooltip,
  IconButton,
  Modal,
  Backdrop,
  Box,
} from '@mui/material';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import {
  ActionButton,
  FormContainer,
  FormLabel,
  StyledGridContainer,
  StyledGridItem,
} from '../IncidentInvestigation.styled';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import II_PL_ActionTable from './Datatable/II_PL_ActionTable';
import ApproveIncidentTable from './Datatable/ApproveIncidentTable';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';
import RejectIcon from '../../../../assets/Icons/RejectIcon.png';
import DoNotDisturbAltIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../../utils/language';
import Label from '../../../../components/Label/Label';
import { useTranslation } from 'react-i18next';
import {
  useGetIncidentInvestigationPendingByIdQuery,
  useUpdateIncidentInvestigationMutation,
  useGetIncidentDetailsPendingByIdQuery,
  useGetIncidentApprovalPendingByIdQuery,
} from '../../../../redux/RTK/incidentInvestigationApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import II_PL_RequestOpinion from './II_PL_RequestOpinion';
import II_PL_EventSequence from './II_PL_EventSequence';
import DeleteIcon from '../../../../assets/Icons/ImageUploadDelete.png';
import { Snackbar } from '@mui/material';
import II_PL_Reject_Investigation from './II_PL_Reject_Investigation';
import { showSweetAlert, showToastAlert } from '../../../../utils/SweetAlert';
import Error from '../../../../assets/Gifs/error.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import CustomFormDisplay from './CustomFormDisplay.js';
import CheckIcon from '@mui/icons-material/Check';
import AttachmentTable from './Datatable/II_PL_AttachmentTable';
import {
  useLazyGetMCFormBuilderByIdQuery,
  useLazyGetSCFormBuilderByIdQuery,
  useLazyGetIDFormBuilderByIdQuery,
} from '../../../../redux/RTK/IncidentManagement/incidentCategoryApi';
import DynamicFormBuilder from '../../IncidentCommon/DynamicFormBuilder';

const IncidentInvestigationDetails = () => {
  const { i18n, t } = useTranslation();
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const [showAccordion, setShowAccordion] = useState(false);
  const [showRejectInvestigation, setShowRejectInvestigation] = useState(false);
  const [actionTableData, setActionTableData] = useState([]);
  const [eventTableData, setEventTableData] = useState([]);
  const [files, setFiles] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isActionDisabled, setIsActionDisabled] = useState(false);
  const navigate = useNavigate();
  const [InvestigationComments, setInvestigationComments] = useState({});
  const [questionsData, setQuestionsData] = useState([]);
  const [subCategoryQuestionsData, setSubCategoryQuestionsData] = useState([]);
  const [incidentQuestionsData, setIncidentQuestionsData] = useState([]);
  const [triggerGetFormBuilderData] = useLazyGetMCFormBuilderByIdQuery();
  const [triggerGetSubCategoryFormBuilderData] =
    useLazyGetSCFormBuilderByIdQuery();
  const [triggerGetIncidentFormBuilderData] =
    useLazyGetIDFormBuilderByIdQuery();

    const {
      selectedMenu,
      userDetails,
      selectedFacility,
      selectedModuleId,
      roleFacilities,
      isSuperAdmin,
    } = useSelector((state) => state.auth);

  const { data: approvalData } = useGetIncidentApprovalPendingByIdQuery(
    {
      menuId: 26,
      loginUserId: userDetails?.UserId,
      incidentId: id,
      moduleId: 2,
    },
    { skip: !id }
  );

  const incidentApprovalSafe = approvalData?.Data || {};

  const [mainCategoryFormValueData, setMainCategoryFormValueData] = useState(
    []
  );
  const [subCategoryFormValueData, setSubCategoryFormValueData] = useState([]);
  const [incidentDetailFormValueData, setIncidentDetailFormValueData] =
    useState([]);

  useEffect(() => {
    if (incidentApprovalSafe?.incidentFormBuilderData) {
      setMainCategoryFormValueData(
        incidentApprovalSafe?.incidentFormBuilderData?.mainCategoryFormValue ||
          []
      );
      setSubCategoryFormValueData(
        incidentApprovalSafe?.incidentFormBuilderData?.subCategoryFormValue ||
          []
      );
      setIncidentDetailFormValueData(
        incidentApprovalSafe?.incidentFormBuilderData
          ?.incidentDetailFormValue || []
      );
    }
  }, [approvalData]);

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
    console.log('allValues:', formatted);

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

  const getFormBuilderData = async (id) => {
    let response;
    try {
      response = await triggerGetFormBuilderData({
        payload: {
          headerFacilityId: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          pageModuleId: selectedModuleId,
          pageMenuId: 27,
          facilityId: 2,
          menuId: 27,
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
          pageMenuId: 27,
          facilityId: 2,
          menuId: 27,
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
          pageMenuId: 27,
          facilityId: 2,
          menuId: 27,
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

  useEffect(() => {
    if (incidentApprovalSafe) {
      const { MainCategoryId, SubCategoryId, IncidentDetailId } =
        incidentApprovalSafe || {};

      if (MainCategoryId) {
        getFormBuilderData(MainCategoryId);
      }

      if (SubCategoryId) {
        getFormSubCatBuilderData(SubCategoryId);
      }

      if (IncidentDetailId) {
        getIncidentFormBuilderData(IncidentDetailId);
      }
    }
  }, [incidentApprovalSafe]);

  const handleFieldChange = (e, fieldName) => {
    const { value } = e.target;
    setInvestigationComments((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleActionTableDataChange = (updatedData) => {
    // const formattedData = updatedData.map((item, index) => ({
    //   IncidentInvestigationId: InvestigationSafe.IncidentInvestigationId || 0,
    //   RowNo: index + 1,
    //   AssignedTask: item.AssignedTask || "",
    //   ResponsibleStaffId: item.ResponsibleStaffId || 0,
    //   TargetDate: item.TargetDate || new Date().toISOString(), // Default to current date if not provided
    //   IsDelete: item.IsDelete || 0,
    // }));

    setActionTableData(updatedData);
    console.log('Formatted Data:', updatedData);
  };

  const handleEventSequenceChange = (updatedData) => {
    setEventTableData(updatedData);
    console.log('evebt Data:', updatedData);
  };

  const handleCancel = (cancel) => {
    setShowAccordion(cancel);
  };
  const handleShowRejectInvestigationCancel = (cancel) => {
    setShowRejectInvestigation(cancel);
    setIsActionDisabled(false);
  };

  const handleClose = () => {
    setOpen(false);
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
          FilePath: newFile,
          IsDelete: false,
          // RawFile: newFile,
        };
        console.log('fileData1', fileData);

        setFiles((prevFiles) => [...prevFiles, fileData]);
      }
    });
  };

  const handleDeleteClick = (e, file) => {
    setFiles(
      files?.filter((item) => item.OriginalFileName !== file.OriginalFileName)
    );
  };

 

  const { data: investigationData, isFetching: isFetchingData } =
    useGetIncidentInvestigationPendingByIdQuery(
      {
        menuId: 27,
        loginUserId: userDetails?.UserId,
        incidentId: id,
        moduleId: 2,
      },
      { skip: !id }
    );

  const { Investigation, ActionTaken, Opinions, EventSequence, Attachments } =
    investigationData?.Data || {};

  const InvestigationSafe = Investigation || {};
  const ActionTakensafe = ActionTaken || [];
  // const ActionTakensafe = ActionTaken?.slice(0, 5) || [];
  const EventSequenceSafe = EventSequence || [];
  // const EventSequenceSafe = EventSequence?.slice(0, 5) || [];
  const OpinionsSafe = Opinions || [];
  const AttachmentSafe = Attachments || [];

  const { data: incidentData } = useGetIncidentDetailsPendingByIdQuery(
    {
      menuId: 24,
      loginUserId: userDetails?.UserId,
      incidentId: id,
      moduleId: 2,
    },
    { skip: !id }
  );
  const [mainCategoryFormValue, setMainCategoryFormValue] = useState([]);

  const dynamicFormData = incidentData?.Data?.incidentFormBuilderData || {};
  const {
    mainCategoryMetaData,
    mainCategoryFormValue: fetchedMainCategoryFormValue,
  } = dynamicFormData;

  useEffect(() => {
    if (fetchedMainCategoryFormValue) {
      setMainCategoryFormValue(fetchedMainCategoryFormValue);
    }
  }, [fetchedMainCategoryFormValue]);

  const filteredMainCategoryMetaData = mainCategoryMetaData?.filter(
    (item) => item.element !== null && item.element !== undefined
  );

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
  }, [AttachmentSafe]);

  const filteredActionTakenData = ActionTakensafe?.map((row, index) => ({
    AssignedTask: row.TaskAssigned || null,
    DepartmentName: row.DepartmentName || '',
    IsDelete: 0,
    ResponsibleStaff: row.Responsiblestaff || '',
    ResponsibleStaffId: row.ResponsibleStaffId,
    RowNo: index + 1,
    TargetDate: row.TargetDate || '',
    isEditable: false,
    IncidentInvestigationId: InvestigationSafe.IncidentInvestigationId || 0,
  }));

  const filterEventSequenceData = EventSequenceSafe?.map((row, index) => ({
    EventDate: row.EventDate,
    EventTime: row.EventTime,
    Activity: row.Activity,
    SequenceNo: row.SequenceNo,
    IsDelete: row.IsDelete,
    isEditable: false,
  }));

  const fieldsConfig = [
    {
      fieldId: `II_P_InvestigatorName`,
      translationId: 'IM_II_InvestigatorName',
      label: 'Investigator Name',
      name: 'InvestigatorName',
    },
    {
      fieldId: `II_OE_Designation`,
      translationId: 'IM_II_Designation',
      label: 'Designation',
      name: 'DesignationName',
    },
    {
      fieldId: `II_OE_Department`,
      translationId: 'IM_II_Department',
      label: 'Department',
      name: 'DepartmentName',
    },
  ];

  const titleConfig = [
    {
      fieldId: `II_P_ApproverComment`,
      translationId: 'IM_II_ApproverComment',
      label: 'Approver Comment',
      name: 'ApproverComment',
    },
    {
      fieldId: `II_P_IncidentReason/RootCause`,
      translationId: 'IM_II_IncidentReason/RootCause',
      label: 'Incident Reason / Root Cause',
      name: 'incidentReasonRootCause',
    },
    {
      fieldId: `II_P_RecommendationtoPreventSimilarIncident`,
      translationId: 'IM_II_RecommendationtoPreventSimilarIncident',
      label: 'Recommendation to Prevent Similar Incident',
      name: 'recommendationToPreventSimilarIncident',
    },
    {
      fieldId: `II_P_ActionsTakenforPreventionOfIncidentAgain`,
      translationId: 'IM_II_ActionsTakenforPreventionOfIncidentAgain',
      label: 'Actions Taken for Prevention Of Incident Again',
      name: 'actionsTakenforPreventionOfIncidentAgain',
    },
    {
      fieldId: `II_P_Attachment(s)`,
      translationId: 'IM_II_Attachment(s)',
      label: 'Attachment(s)',
      name: 'Attachment(s)',
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
  const tableLabels = [
    {
      fieldId: `II_ATfPOIA_ResponsibleStaff`,
      translationId: 'IM_II_ResponsibleStaff',
      label: 'Responsible Staff',
      name: 'Responsiblestaff',
    },
    {
      fieldId: `II_ATfPOIA_Department`,
      translationId: 'IM_II_Department',
      label: 'Department',
      name: 'DepartmentName',
    },
    {
      fieldId: `II_ATfPOIA_TaskAssigned`,
      translationId: 'IM_II_TaskAssigned',
      label: 'Task Assigned',
      name: 'TaskAssigned',
    },

    {
      fieldId: `II_ATfPOIA_TargetDate`,
      translationId: 'IM_II_TargetDate',
      label: 'TargetDate',
      name: 'TargetDate',
    },
  ];
  const eventsLabels = [
    {
      fieldId: `II_ES_Date`,
      translationId: 'IM_II_Date',
      label: 'Date',
      name: 'EventDate',
    },
    {
      fieldId: `II_ES_Time`,
      translationId: 'IM_II_Time',
      label: 'Time',
      name: 'EventTime',
    },
    {
      fieldId: `II_ES_Activity`,
      translationId: 'IM_II_Activity',
      label: 'Activity',
      name: 'Activity',
    },
  ];

  const opinionsExchanged = [
    {
      fieldId: `II_OE_OpinionId`,
      translationId: 'IM_II_OpinionId',
      label: 'OpinionId',
      name: 'OpinionId',
    },
    {
      fieldId: `II_OE_RespondentName`,
      translationId: 'IM_II_RespondentName',
      label: 'RespondentName',
      name: 'RespondentName',
    },
    {
      fieldId: `II_OE_Department`,
      translationId: 'IM_II_Department',
      label: 'Department',
      name: 'DepartmentName',
    },
    {
      fieldId: `II_OE_Designation`,
      translationId: 'IM_II_Designation',
      label: 'Designation',
      name: 'DesignationName',
    },
    {
      fieldId: `II_OE_Request`,
      translationId: 'IM_II_Request',
      label: 'Request',
      name: 'RequestorName',
    },
    {
      fieldId: `II_OE_Response`,
      translationId: 'IM_II_Response',
      label: 'Response',
      name: 'Response',
    },
    {
      fieldId: `II_OE_Requested_OpinionDate`,
      translationId: 'IM_II_Requested_OpinionDate',
      label: 'Requested_OpinionDate',
      name: 'RequestedDate',
    },
    {
      fieldId: `II_OE_ResponseDate`,
      translationId: 'IM_II_ResponseDate',
      label: 'ResponseDate',
      name: 'ResponseDate',
    },
  ];

  const { data: labelsData = [], isFetching: isLabelsFetching } =
    useGetLabelsQuery({
      menuId: 27,
      moduleId: 2,
    });
  const { data: fieldsData = [], isFetching: isFieldsFetching } =
    useGetFieldsQuery({
      menuId: 27,
      moduleId: 2,
    });

  const fields =
    fieldsData?.Data?.Menus?.filter((item) => item.MenuId === 27) || [];

  const labels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 27)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'ALL')
        .flatMap((region) => region.Labels || [])
    );

  const filterLabels = { Data: labels };
  const [configs, setConfigs] = useState({
    fieldsConfig,
    tableLabels,
    titleConfig,
    eventsLabels,
    opinionsExchanged,
    attachmentConfig,
  });

  const stableFields = useMemo(() => fields, [fields]);

  useEffect(() => {
    if (stableFields?.length > 0) {
      const matchingSections = stableFields[0]?.Sections?.filter(
        (section) =>
          section.SectionName ===
            'Actions Taken for Prevention Of Incident Again' ||
          section.SectionName === 'Accordion-Page' ||
          section.SectionName === 'Opinion(s) Exchanged' ||
          section.SectionName === 'Accordion-Events Sequence'
      );

      const pageFields = matchingSections?.flatMap(
        (section) =>
          section?.Regions?.find((region) => region.RegionCode === 'ALL')
            ?.Fields || []
      );

      if (pageFields && pageFields.length > 0) {
        setConfigs((prevConfigs) => {
          const updatedConfigs = Object.entries(prevConfigs).reduce(
            (acc, [key, config]) => ({
              ...acc,
              [key]: config
                .filter((column) => {
                  const pageField = pageFields.find(
                    (col) => col.FieldId === column.fieldId
                  );
                  return pageField && pageField.IsShow === true;
                })
                .map((column) => {
                  const pageField = pageFields.find(
                    (col) => col.FieldId === column.fieldId
                  );
                  return {
                    ...column,
                    IsMandatory: pageField?.IsMandatory || false,
                  };
                }),
            }),
            {}
          );

          if (JSON.stringify(prevConfigs) !== JSON.stringify(updatedConfigs)) {
            return updatedConfigs;
          }

          return prevConfigs;
        });
      }
    }
  }, [stableFields]);

  // console.log('confuggg:', configs);

  const [triggerUpdateInvestigationDetail] =
    useUpdateIncidentInvestigationMutation();

  const actionTakenData = actionTableData.length
    ? actionTableData.map((item, index) => ({
        IncidentInvestigationId: InvestigationSafe.IncidentInvestigationId || 0,
        RowNo: index + 1,
        AssignedTask: item.AssignedTask || '',
        ResponsibleStaffId: item.ResponsibleStaffId || 0,
        TargetDate: item.TargetDate || new Date().toISOString(),
        IsDelete: item.IsDelete || 0,
      }))
    : filteredActionTakenData;

  const attachmentData = files.length ? files : [];

  const eventSequenceData = eventTableData.length
    ? eventTableData.map((item, index) => ({
        IncidentInvestigationId: InvestigationSafe.IncidentInvestigationId || 0,
        EventDate: item.EventDate || '',
        Activity: item.Activity || '',
        SequenceNo: index + 1,
        IsDelete: false,
      }))
    : filterEventSequenceData;

  const opinionData = [
    {
      OpinionId: 1,
      OpinionNo: 1,
      IncidentId: 14,
      FacilityId: 2,
      RequestedUserId: 2,
      RequestorType: 'Investigators',
      RequestedDate: '2024-01-12T10:05:25.194Z',
      RequestorComments: 'check',
      OpinionUserId: 3,
      ResponseDate: '2024-01-12T10:05:25.194Z',
      OpinionComments: 'ok',
      IsDelete: 0,
      OpinionStatus: 'Draft',
    },
  ];

  const handleSubmit = async () => {
    if (!InvestigationSafe) {
      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: 'No data',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      return;
    }

    if (
      !InvestigationComments?.incidentReasonRootCause?.trim() ||
      !InvestigationComments?.ApproverComment?.trim() ||
      !InvestigationComments?.recommendationToPreventSimilarIncident?.trim()
    ) {
      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: 'Text fields cannot be empty',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      return;
    }

    try {
      const investigationPayload = {
        incidentInvestigationMaster: {
          IncidentInvestigationId: InvestigationSafe.IncidentInvestigationId,
          IncidentId: id,
          FacilityId: InvestigationSafe.FacilityId,
          IncidentApprovalId: InvestigationSafe.IncidentApprovalId,
          InvestigatorId: InvestigationSafe.InvestigatorId,
          AssignedDate: '',
          AssignedBy: InvestigationSafe.InvestigatorId ?? 0,
          IncidentReason: InvestigationComments?.incidentReasonRootCause,
          Recommendation:
            InvestigationComments?.recommendationToPreventSimilarIncident,
          Comments: InvestigationComments?.ApproverComment,
          CreatedBy: InvestigationSafe.CreatedBy,
          CreatedDate: InvestigationSafe.CreatedDate,
          ModifiedBy: InvestigationSafe.ModifiedBy,
          ModifiedDate: InvestigationSafe.ModifiedDate,
          IsDelete: InvestigationSafe.IsDelete,
          InvestigationStatus: 'Completed',
          IsRejected: 0,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
        },
        investigationActionTakens:
          actionTakenData?.map((row, index) => ({
            IncidentInvestigationId: InvestigationSafe.IncidentInvestigationId,
            RowNo: index + 1,
            AssignedTask: row.AssignedTask || null,
            ResponsibleStaffId: row.ResponsibleStaffId,
            TargetDate: row.TargetDate || '',
            IsDelete: row.IsDelete,
          })) || [],
        investigationEventSequences:
          eventSequenceData?.map((row, index) => ({
            IncidentInvestigationId: InvestigationSafe.IncidentInvestigationId,
            EventDate: row.EventDate || null,
            Activity: row.Activity,
            SequenceNo: row.SequenceNo || '',
            IsDelete: row.IsDelete,
          })) || [],
        incidentOpinions: [],
        investigationAttachments: [],
        MaincategoryFormBuilderData: questionsData || [],
        MaincategoryFormBuilderValue: mainCategoryFormValueData || [],
        SubcategoryFormBuilderData: subCategoryQuestionsData || [],
        SubcategoryFormBuilderValue: subCategoryFormValueData || [],
        IncidentDetailFormBuilderData: incidentQuestionsData || [],
        IncidentDetailFormBuilderValue: incidentDetailFormValueData || [],
      };

      const formData = new FormData();
      formData.append(
        'investigationUpdate',
        JSON.stringify(investigationPayload)
      );

      if (attachmentData?.length > 0) {
        attachmentData.forEach((attachment, index) => {
          if (attachment.FilePath instanceof File) {
            formData.append(`attachments`, attachment.FilePath);
          }
        });
      }

      console.log('FormData payload:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await triggerUpdateInvestigationDetail(formData, {
        headers: {},
      });

      console.log('Parsed response data:', response);

      if (response && response?.data) {
        showToastAlert({
          type: 'custom_success',
          text: response.data?.Message,
          gif: SuccessGif,
        });
        navigate('/IncidentManagement/IncidentInvestigation');
      }

      if (!response) {
        throw new Error('Empty response from server');
      }

      console.log('Final response:', response.data?.Message);
    } catch (error) {
      console.error('Error occurred during submission:', {
        errorMessage: error?.message || 'Unknown error',
        errorDetails: error?.data || null,
        errorStack: error?.stack || null,
      });
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

  return (
    <FormContainer style={{ marginBottom: '20px' }} onSubmit={handleSubmit}>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        message={message}
      />
      <FlexContainer flexDirection={'column'}>
        <Grid container spacing={2} p={0} mb={3}>
          {configs.fieldsConfig?.map((field) => {
            const fieldValue = InvestigationSafe[field.name] ?? '';
            const translatedLabel = getlabel(
              field?.translationId,
              filterLabels,
              i18n.language
            );
            return (
              <Grid item xs={4} key={field.fieldId}>
                <Label value={translatedLabel} isRequired={field.IsMandatory} />
                <TextField
                  fullWidth
                  value={fieldValue || ''}
                  disabled
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      opacity: 1,
                      fontWeight: 'bold',
                      color: 'black',
                      WebkitTextFillColor: 'black',
                    },
                  }}
                />
              </Grid>
            );
          })}
        </Grid>

        <>
          {/* {filteredMainCategoryMetaData?.length > 0 && (
            <Grid item xs={1} sm={1} padding="5px" md={1}>
              <FlexContainer
                className="staffmaster-wrapper"
                flexDirection="column"
              >
                <CustomFormDisplay
                  data={filteredMainCategoryMetaData}
                  formValues={mainCategoryFormValue}
                  setFormValues={setMainCategoryFormValue}
                />
              </FlexContainer>
            </Grid>
          )} */}
        </>

        {[
          'ApproverComment',
          'incidentReasonRootCause',
          'recommendationToPreventSimilarIncident',
        ].map((name) => {
          const field = configs?.titleConfig.find((f) => f.name === name);

          const translatedLabel = getlabel(
            field?.translationId,
            filterLabels,
            i18n.language
          );

          if (field) {
            return (
              <FlexContainer
                flexDirection={'column'}
                style={{ paddingLeft: 0, marginTop: '10px' }}
                key={field.name}
              >
                <Label value={translatedLabel} isRequired={field.IsMandatory} />
                <TextField
                  multiline
                  variant="outlined"
                  fullWidth
                  rows={4}
                  onChange={(e) => handleFieldChange(e, field.name)}
                />
              </FlexContainer>
            );
          }
          return null;
        })}

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

        <FormLabel style={{ marginBottom: '10px', marginTop: '10px' }}>
          {getlabel(
            'IM_II_ActionsTakenforPreventionOfIncidentAgain',
            filterLabels,
            i18n.language
          )}
          :
        </FormLabel>
        <II_PL_ActionTable
          columns={configs.tableLabels}
          labels={filterLabels}
          data={
            actionTableData.length ? actionTableData : filteredActionTakenData
          }
          onDataChange={handleActionTableDataChange}
        />
        <FormLabel style={{ marginBottom: '10px' }}>
          {getlabel('IM_II_EventsSequence', filterLabels, i18n.language)}:
        </FormLabel>

        <II_PL_EventSequence
          columns={configs.eventsLabels}
          labels={filterLabels}
          data={
            eventTableData.length ? eventTableData : filterEventSequenceData
          }
          onDataChange={handleEventSequenceChange}
        />

        <FormLabel style={{ marginBottom: '10px', marginTop: '10px' }}>
          {getlabel('IM_II_Opinion(s)Exchanged', filterLabels, i18n.language)}
        </FormLabel>
        <ApproveIncidentTable
          columns={configs.opinionsExchanged}
          labels={filterLabels}
          data={OpinionsSafe}
        />

        {/* <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
          {getlabel(
            titleConfig.find((config) => config.name === 'Attachment(s)')
              ?.translationId,
            filterLabels,
            i18n.language
          )}
          :
        </FormLabel> */}
        {/* <AttachmentTable
          columns={attachmentConfig}
          labels={filterLabels}
          data={AttachmentSafe}
        /> */}

        <FlexContainer
          flexDirection={'column'}
          style={{ marginBottom: '20px' }}
        >
          <Grid container spacing={2} p={0} mt={2} alignItems="stretch">
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
                {getlabel('IM_II_Attachment(s)', filterLabels, i18n.language)}:
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
                  {getlabel('IM_II_Attachment(s)', filterLabels, i18n.language)}
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
                            onClick={(e) => handleDeleteClick(e, file)}
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
                Note: Maximum File Upload Limit is 100MB (Images, PDF, Word
                Files, Excel Files Only)
              </Typography>
            </Grid>

            {/* Comments Section */}
            <Grid
              item
              xs={6}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <FormLabel>Comments:</FormLabel>
              <TextField
                multiline
                rows={6}
                variant="outlined"
                fullWidth
                style={{
                  flexGrow: 1,
                  height: '140px',
                }}
              />
            </Grid>
          </Grid>

          <FlexContainer
            padding="0px"
            justifyContent="center"
            alignItems="center"
            gap="20px"
          >
            {/* Submit Button */}
            <ActionButton
              style={{
                backgroundColor: '#1976d2',
                color: 'white',
              }}
              startIcon={<CheckIcon sx={{ fontSize: 18, mr: 0.5 }} />}
              onClick={handleSubmit}
              disabled={isActionDisabled || showAccordion}
            >
              {t('Submit')}
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
                  style={{ marginInlineEnd: 8, fontSize: '14px' }}
                />
              }
              onClick={() => {
                setShowAccordion(true);
                setShowRejectInvestigation(false);
                setIsActionDisabled(false);
              }}
              disabled={isActionDisabled}
            >
              Request Opinion
            </ActionButton>
            <ActionButton
              style={{
                backgroundColor: '#ef8b35',
                color: 'white',
              }}
              onClick={() => {
                setShowRejectInvestigation(true);
                setShowAccordion(false);
                setIsActionDisabled(true);
              }}
              disabled={showAccordion}
            >
              Reject Investigation
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
                navigate('/IncidentManagement/IncidentInvestigation');
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
        {showAccordion && (
          <Accordion
            sx={{
              borderColor: '#3498db',
              marginBottom: '10px',
              border: '1px solid #3498db',
              borderRadius: '8px 8px 0px 0px',
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
                border={'1px solid #3498db'}
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                Request Opinion
              </StyledTypography>
            </AccordionSummary>
            <II_PL_RequestOpinion
              onCancelClick={handleCancel}
              data={InvestigationSafe}
            />
          </Accordion>
        )}
        {showRejectInvestigation && (
          <Accordion
            sx={{
              borderColor: '#3498db',
              marginBottom: '10px',
              border: '1px solid #3498db',
              borderRadius: '8px 8px 0px 0px',
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
                border={'1px solid #3498db'}
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                Reject Investigation
              </StyledTypography>
            </AccordionSummary>
            <II_PL_Reject_Investigation
              onCancelClick={handleShowRejectInvestigationCancel}
              data={InvestigationSafe}
              comments={InvestigationComments}
            />
          </Accordion>
        )}

        {/* </Box> */}
      </FlexContainer>
    </FormContainer>
  );
};

export default IncidentInvestigationDetails;
