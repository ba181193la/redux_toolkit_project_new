import React, { useState } from 'react';
import { Box, Accordion, AccordionSummary } from '@mui/material';
import {
  FlexContainer,
  StyledImage,
  StyledButton,
  StyledTypography,
} from '../../../../../utils/StyledComponents';
import {
  Grid,
  TextField,
  Typography,
  Button,
  TableContainer,
  Table,
  Paper,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
} from '../../../../../utils/DataTable.styled';
import {
  FormContainer,
  StyledGridContainer,
  StyledGridItem,
  FormLabel,
} from './ActionPlaned.styled';
import AddSubMaster from '../../../../../assets/Icons/AddSubMaster.png';
import DoNotDisturbAltIcon from '../../../../../assets/Icons/DoNotDisturbIcon.png';
import Label from '../../../../../components/Label/Label';
import Attach from '../../../../../assets/Icons/Attach.png';
import { ActionButton } from '../../../IncidentInvestigation/IncidentInvestigation.styled';
import SaveIcon from '../../../../../assets/Icons/SaveIcon.png';
import SubmitTik from '../../../../../assets/Icons/SubmitTik.png';
import EditIcon from '../../../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../../../assets/Icons/DeleteIcon.png';
import RootCauseTable from './RootCauseTable.js';
import MailTo from './MailToTable';
import {
  useSaveRCAMutation,
  usePreviewSaveRCAMutation,
} from '../../../../../redux/RTK/IncidentManagement/incidentRcaAPI';
import {
  showSweetAlert,
  showToastAlert,
} from '../../../../../utils/SweetAlert';
import Error from '../../../../../assets/Gifs/error.gif';
import SuccessGif from '../../../../../assets/Gifs/SuccessGif.gif';
import { useDispatch, useSelector } from 'react-redux';
import {
  setFishBoneAttachmentData,
  setAttachmentData,
} from '../../../../../redux/features/mainMaster/incidentRcaSlice.js';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate, useParams } from 'react-router-dom';
import CheckIcon from '@mui/icons-material/Check';

export default function ActionPlan({
  FullData,
  textData,
  rootCauseData,
  rootCauseColumns,
  mailToData,
  mailToColumns,
  labels,
}) {
  const [selectedDate, setSelectedDate] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [fishBone, setFishBone] = useState({});
  const [rootTableData, setRootTableData] = useState([]);
  const teamDataToUse = useSelector((state) => state.incidentRca.teamTableData);
  const rootDataToUse = useSelector((state) => state.incidentRca.rootTableData);
  const mailToDataToUse = useSelector(
    (state) => state.incidentRca.mailToTableData
  );
  const eventDataToUse = useSelector(
    (state) => state.incidentRca.eventTableData
  );
  const fishBoneAttachmentData = useSelector(
    (state) => state.incidentRca.fishBoneAttachmentData
  );

  const incidentRCA_Attachments = useSelector(
    (state) => state.incidentRca.attachmentData || []
  );
   const QuestionAnswersData = useSelector(
        (state) => state.incidentRca.QuestionAnswersData
      );

  const [files, setFiles] = useState(incidentRCA_Attachments);
  console.log('incidentRCA_Attachments', incidentRCA_Attachments);
  console.log('setFiles', files);
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [openSecondDialog, setOpenSecondDialog] = useState(false);
  const navigate = useNavigate();

  const {
    selectedMenu,
    userDetails,
    selectedFacility,
    selectedModuleId,
    roleFacilities,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

  console.log('selectedModuleId', selectedModuleId);
  console.log('selectedMenu', selectedMenu);

  console.log('tabdata:::', teamDataToUse);
  console.log('rootDataToUse:::', rootDataToUse);
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleUploadClick = () => {
    document.getElementById('fileInput').click();
  };

  const handleFileChange = (event) => {
    const newFiles = event.target.files;
    const newFileArray = Array.from(newFiles);

    const filteredFiles = newFileArray.filter((newFile) => {
      return !files.some(
        (file) =>
          file.OriginalFileName === newFile.name || file.name === newFile.name
      );
    });

    const newFileDataArray = filteredFiles.map((newFile) => {
      const autogenFileName = `auto_${newFile.name}_${Date.now()}`;
      const filePath = `/uploads/${autogenFileName}`;

      return {
        AutogenFileName: autogenFileName,
        OriginalFileName: newFile.name,
        AutogenFilePath: filePath,
        FilePath: newFile,
        IsDelete: false,
      };
    });

    setFiles((prevFiles) => [...prevFiles, ...newFileDataArray]);

    dispatch(
      setAttachmentData([...incidentRCA_Attachments, ...newFileDataArray])
    );
  };

  const handleFishBoneChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const autogenFileName = `auto_${file.name}_${Date.now()}`;
      const filePath = `/uploads/${autogenFileName}`;

      const fileData = {
        FishboneAutogenFileName: autogenFileName,
        FishboneOriginalFileName: file.name,
        FishboneAutogenFilePath: filePath,
        FishboneOriginalFilePath: filePath,
      };

      setFishBone(fileData);
      dispatch(setFishBoneAttachmentData(fileData));
    }
  };

  const handleDeleteClick = (e, file) => {
    console.log('filefile', file);

    const updatedFiles = incidentRCA_Attachments.filter(
      (item) => item.OriginalFileName !== file.OriginalFileName
    );
    setFiles(updatedFiles);
    console.log('updatedFiles', updatedFiles);
    dispatch(setAttachmentData(updatedFiles));
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [triggerSaveRCAMutation] = useSaveRCAMutation();
  const [triggerPreviewSaveRCAMutation] = usePreviewSaveRCAMutation();

  const [dialogMessage, setDialogMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState(null);

  const handleSaveClick = () => {
    setDialogMessage('Confirm to Save?');
    setConfirmAction(() => handleSave);
    setOpenDialog(true);
  };
  const handleSubmitClick = () => {
    setDialogMessage('Confirm to Submit?');
    setConfirmAction(() => handleSubmit);
    setOpenDialog(true);
  };

  const handlePreviewSaveClick = () => {
    setDialogMessage('RCA Will Be Drafted Before Opening Preview');
    setConfirmAction(() => handlePreviewSave);
    setOpenDialog(true);
  };

  const handleSecondDialogClose = () => {
    setOpenSecondDialog(false);
  };

  const handleConfirm = () => {
    if (confirmAction) {
      confirmAction();
    }
    setOpenDialog(false);
  };

  const attachmentData = files?.length ? files : [];
  console.log('attachmentData', attachmentData);

  const handleSubmit = async () => {
    const teamMembers = teamDataToUse
      ?.map((item) => item.UserId)
      .filter((id) => id !== undefined && id !== null)
      .join(',');

    const mailNotifyStaffId = mailToDataToUse
      ?.map((item) => item.UserId)
      .filter((id) => id !== undefined && id !== null)
      .join(',');

      const formattedAnswers = QuestionAnswersData.map(q => ({
        rcaQuestionsId: q.RCAQuestionstId,
        rootCause: q.RootCause || 'No',           
        rootCauseFinding: q.RootCauseFinding ?? "", 
        isNotApplicable: q.IsNotApplicable ?? false 
      }));

    const payload = {
      rcaId: FullData?.RCAId,
      incidentId: FullData?.IncidentId,
      incidentClosureId: FullData?.IncidentClosureId,
      facilityId: FullData?.FacilityId,
      teamMembers: teamMembers,
      mailNotifyStaffId: mailNotifyStaffId,
      fishboneAutogenFileName: fishBoneAttachmentData?.FishboneAutogenFileName,
      fishboneOriginalFileName:
        fishBoneAttachmentData?.FishboneOriginalFileName,
      fishboneAutogenFilePath: fishBoneAttachmentData?.FishboneAutogenFilePath,
      fishboneOriginalFilePath:
        fishBoneAttachmentData?.FishboneOriginalFilePath,
      rcaStatus: 'Completed',
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
      incidentNo: FullData?.IncidentNo,
      incidentClosureTATId: null,
      closureTATDays: null,
      eventSequenceSave: eventDataToUse?.map((item, index) => {
        let combinedDateTime = '';

        if (item.EventDate && item.EventTime) {
          const originalDate = new Date(item.EventDate);
          const year = originalDate.getUTCFullYear();
          const month = originalDate.getUTCMonth();
          const day = originalDate.getUTCDate();

          const timeParts = item.EventTime.split(':');
          const hours = parseInt(timeParts[0], 10);
          const minutes = parseInt(timeParts[1], 10);
          const seconds =
            timeParts.length === 3 ? parseInt(timeParts[2], 10) : 0;

          const utcDate = new Date(
            Date.UTC(year, month, day, hours, minutes, seconds)
          );

          combinedDateTime = utcDate.toISOString();
        } else {
          combinedDateTime = item.EventDate || '';
        }

        return {
          eventDate: combinedDateTime,
          eventActivity: item.EventActivity || '',
          orderNo: index + 1,
        };
      }),
      rcaQuestionAnswerSave: formattedAnswers,
      rcaActionsSave: rootDataToUse?.map((item, index) => ({
        rowNo: index + 1,
        assignedTask: item.AssignedTask || '',
        rootCauseFinding: item.RootCauseFinding || '',
        rootCauseReference: item.RootCauseReference || '',
        userId: item.UserId || null,
        targetDate: item.TargetDate || null,
        isManuallyAdded: false,
        rootCause: 'test',
        existingControl: 'tets',
        effectivenessMeasure: 'tets',
      })),
    };

    try {
      const formData = new FormData();

      formData.append('rcaSave', JSON.stringify(payload));

      if (attachmentData?.length > 0) {
        attachmentData.forEach((attachment, index) => {
          if (attachment.FilePath instanceof File) {
            formData.append(`attachments`, attachment.FilePath);
          }
        });
      }

      const response = await triggerSaveRCAMutation(formData);

      console.log('API response:', response);

      if (response && response?.data?.Data) {
        console.log('Parsed response data:', response?.data?.Data);
        showToastAlert({
          type: 'custom_success',
          text: response.Message || 'Saved successfully!',
          gif: SuccessGif,
        });
        navigate('/IncidentManagement/RootCauseAnalysis');
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error during submission:', {
        errormessage: error.message,
        errorStack: error.stack,
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

  const handleSave = async () => {
    const teamMembers = teamDataToUse
      ?.map((item) => item.UserId)
      .filter((id) => id !== undefined && id !== null)
      .join(',');

    const mailNotifyStaffId = mailToDataToUse
      ?.map((item) => item.UserId)
      .filter((id) => id !== undefined && id !== null)
      .join(',');

      const formattedAnswers = QuestionAnswersData.map(q => ({
        rcaQuestionsId: q.RCAQuestionstId,
        rootCause: q.RootCause || 'No',           
        rootCauseFinding: q.RootCauseFinding ?? "", 
        isNotApplicable: q.IsNotApplicable ?? false 
      }));

    const payload = {
      rcaId: FullData?.RCAId,
      incidentId: FullData?.IncidentId,
      incidentClosureId: FullData?.IncidentClosureId,
      facilityId: FullData?.FacilityId,
      teamMembers: teamMembers,
      mailNotifyStaffId: mailNotifyStaffId,
      fishboneAutogenFileName: fishBoneAttachmentData?.FishboneAutogenFileName,
      fishboneOriginalFileName:
        fishBoneAttachmentData?.FishboneOriginalFileName,
      fishboneAutogenFilePath: fishBoneAttachmentData?.FishboneAutogenFilePath,
      fishboneOriginalFilePath:
        fishBoneAttachmentData?.FishboneOriginalFilePath,
      rcaStatus: 'Draft',
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
      incidentNo: FullData?.IncidentNo,
      incidentClosureTATId: null,
      closureTATDays: null,
      eventSequenceSave: eventDataToUse?.map((item, index) => {
        let combinedDateTime = '';

        if (item.EventDate && item.EventTime) {
          const originalDate = new Date(item.EventDate);
          const year = originalDate.getUTCFullYear();
          const month = originalDate.getUTCMonth();
          const day = originalDate.getUTCDate();

          const timeParts = item.EventTime.split(':');
          const hours = parseInt(timeParts[0], 10);
          const minutes = parseInt(timeParts[1], 10);
          const seconds =
            timeParts.length === 3 ? parseInt(timeParts[2], 10) : 0;

          const utcDate = new Date(
            Date.UTC(year, month, day, hours, minutes, seconds)
          );

          combinedDateTime = utcDate.toISOString();
        } else {
          combinedDateTime = item.EventDate || '';
        }

        return {
          eventDate: combinedDateTime,
          eventActivity: item.EventActivity || '',
          orderNo: index + 1,
        };
      }),
      rcaQuestionAnswerSave: formattedAnswers,
      rcaActionsSave: rootDataToUse?.map((item, index) => ({
        rowNo: index + 1,
        assignedTask: item.AssignedTask || '',
        rootCauseFinding: item.RootCauseFinding || '',
        rootCauseReference: item.RootCauseReference || '',
        userId: item.UserId || null,
        targetDate: item.TargetDate || null,
        isManuallyAdded: false,
        rootCause: 'test',
        existingControl: 'tets',
        effectivenessMeasure: 'tets',
      })),
    };

    try {
      const formData = new FormData();

      formData.append('rcaSave', JSON.stringify(payload));

      if (attachmentData?.length > 0) {
        attachmentData.forEach((attachment, index) => {
          if (attachment.FilePath instanceof File) {
            formData.append(`attachments`, attachment.FilePath);
          }
        });
      }

      const response = await triggerSaveRCAMutation(formData);

      console.log('API response:', response);

      if (response && response?.data?.Data) {
        console.log('Parsed response data:', response?.data?.Data);
        showToastAlert({
          type: 'custom_success',
          text: response.Message || 'Saved successfully!',
          gif: SuccessGif,
        });
        navigate('/IncidentManagement/RootCauseAnalysis');
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error during submission:', {
        errormessage: error.message,
        errorStack: error.stack,
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
  const handlePreviewSave = async () => {
    const teamMembers = teamDataToUse
      ?.map((item) => item.UserId)
      .filter((id) => id !== undefined && id !== null)
      .join(',');

    const mailNotifyStaffId = mailToDataToUse
      ?.map((item) => item.UserId)
      .filter((id) => id !== undefined && id !== null)
      .join(',');
      const formattedAnswers = QuestionAnswersData.map(q => ({
        rcaQuestionsId: q.RCAQuestionstId,
        rootCause: q.RootCause || 'No',           
        rootCauseFinding: q.RootCauseFinding ?? "", 
        isNotApplicable: q.IsNotApplicable ?? false 
      }));

    const payload = {
      rcaId: FullData?.RCAId,
      incidentId: FullData?.IncidentId,
      incidentClosureId: FullData?.IncidentClosureId,
      facilityId: FullData?.FacilityId,
      teamMembers: teamMembers,
      mailNotifyStaffId: mailNotifyStaffId,
      fishboneAutogenFileName: fishBoneAttachmentData?.FishboneAutogenFileName,
      fishboneOriginalFileName:
        fishBoneAttachmentData?.FishboneOriginalFileName,
      fishboneAutogenFilePath: fishBoneAttachmentData?.FishboneAutogenFilePath,
      fishboneOriginalFilePath:
        fishBoneAttachmentData?.FishboneOriginalFilePath,
      rcaStatus: 'Draft',
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
      incidentNo: FullData?.IncidentNo,
      incidentClosureTATId: null,
      closureTATDays: null,
      eventSequenceSave: eventDataToUse?.map((item, index) => {
        let combinedDateTime = '';

        if (item.EventDate && item.EventTime) {
          const originalDate = new Date(item.EventDate);
          const year = originalDate.getUTCFullYear();
          const month = originalDate.getUTCMonth();
          const day = originalDate.getUTCDate();

          const timeParts = item.EventTime.split(':');
          const hours = parseInt(timeParts[0], 10);
          const minutes = parseInt(timeParts[1], 10);
          const seconds =
            timeParts.length === 3 ? parseInt(timeParts[2], 10) : 0;

          const utcDate = new Date(
            Date.UTC(year, month, day, hours, minutes, seconds)
          );

          combinedDateTime = utcDate.toISOString();
        } else {
          combinedDateTime = item.EventDate || '';
        }

        return {
          eventDate: combinedDateTime,
          eventActivity: item.EventActivity || '',
          orderNo: index + 1,
        };
      }),

      rcaQuestionAnswerSave: formattedAnswers,
      rcaActionsSave: rootDataToUse?.map((item, index) => ({
        rowNo: index + 1,
        assignedTask: item.AssignedTask || '',
        rootCauseFinding: item.RootCauseFinding || '',
        rootCauseReference: item.RootCauseReference || '',
        userId: item.UserId || null,
        targetDate: item.TargetDate || null,
        isManuallyAdded: false,
        rootCause: 'test',
        existingControl: 'tets',
        effectivenessMeasure: 'tets',
      })),
    };

    try {
      const formData = new FormData();

      formData.append('rcaSave', JSON.stringify(payload));

      if (attachmentData?.length > 0) {
        attachmentData.forEach((attachment, index) => {
          if (attachment.FilePath instanceof File) {
            formData.append(`attachments`, attachment.FilePath);
          }
        });
      }

      const response = await triggerPreviewSaveRCAMutation(formData).unwrap();

      console.log('API response:', response);

      if (response && response.Data) {
        console.log('Parsed response data:', response.Data);
        showToastAlert({
          type: 'custom_success',
          text: response.Message || 'Preview saved successfully!',
          gif: SuccessGif,
        });
        setOpenSecondDialog(true);
        const newUrl = `${window.location.origin}${window.location.pathname}/PreviewIncidentRCA`;

        window.open(newUrl, '_blank');
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error during submission:', {
        errormessage: error.message,
        errorStack: error.stack,
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

  const handleRootTableDataChange = (updatedData) => {
    setRootTableData(updatedData);
    console.log('Formatted Data:', updatedData);
  };

  return (
    <>
      <FlexContainer style={{ flexDirection: 'column', width: '100%' }}>
        <Accordion
          sx={{
            marginBottom: '10px',
            border: '5px solid  #0000',
            borderRadius: '8px 8px 0px 0px',
          }}
          expanded={true}
        >
          <AccordionSummary
            aria-controls="panel1-content"
            id="panel1-header"
            sx={{
              backgroundColor: 'rgb(0 131 192)',
              width: '100%',
            }}
          >
            <StyledTypography
              fontSize="16px"
              fontWeight="700"
              lineHeight="20px"
              textAlign="center"
              color="#FFFFFF"
            >
              Action Plan
            </StyledTypography>
          </AccordionSummary>
          {/* <IC_Pending_ICE_IncidentClosure /> */}
          <FormContainer style={{ marginBottom: '20px' }}>
            <div dangerouslySetInnerHTML={{ __html: textData }} />

            <RootCauseTable
              columns={rootCauseColumns}
              labels={labels}
              // data={rootTableData}
              // onDataChange={handleRootTableDataChange}
            />

            {/* Attachment */}

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
                <FormLabel>Attachment(s): </FormLabel>

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
                    Attachment(s)
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
                        file.OriginalFileName?.length > 18
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

              <Grid item xs={6}>
                <FormLabel>Fish Bone:</FormLabel>

                <Box
                  onClick={() =>
                    document.getElementById('fishbone-input').click()
                  }
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    height: '40px',
                    '&:hover': {
                      borderColor: '#999',
                    },
                  }}
                >
                  <input
                    id="fishbone-input"
                    type="file"
                    onChange={handleFishBoneChange}
                    style={{ display: 'none' }}
                  />

                  <Box
                    sx={{
                      backgroundColor: '#4679bd',
                      color: 'white',
                      minWidth: '30%',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      padding: '10px 16px',
                      fontSize: '14px',
                    }}
                  >
                    Add Fish Bone
                  </Box>

                  <TextField
                    variant="outlined"
                    fullWidth
                    value={
                      fishBoneAttachmentData?.FishboneOriginalFileName ||
                      'No File Chosen...'
                    }
                    placeholder="No file selected"
                    InputProps={{
                      readOnly: true,
                      style: { cursor: 'pointer' },
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { border: 'none' },
                      },
                      backgroundColor: '#f9f9f9',
                      height: '100%',
                      '& .MuiInputBase-root': {
                        height: '100%',
                      },
                    }}
                  />
                </Box>
                <Typography
                  variant="body2"
                  color="error"
                  style={{ marginTop: '10px', marginBottom: '10px' }}
                >
                  Note: Maximum File Upload Limit is 100MB (Images, PDF, Word
                  Files, Excel Files Only)
                </Typography>
              </Grid>
            </Grid>

            {/* Mail table */}
            <MailTo columns={mailToColumns} labels={labels} data={[]} />

            <FlexContainer padding="10px" justifyContent="center" gap="24px">
              {/* <ActionButton
  style={{ backgroundColor: '#5cb85c' }}
  variant="outlined"
  sx={{
    boxShadow: '0px 4px 4px 0px #00000040',
    '&:hover': {
      transform: 'scale(1.05) !important',
      transition: 'transform 0.3s ease !important',
    },
  }}
  startIcon={
    <i
      className="fa fa-paper-plane"
      style={{
        marginBottom: '1px',
        marginInlineEnd: 8,
        color: '#FFFFFF',
      }}
    />
  }
>
  <StyledTypography textTransform="none" marginTop="1px" color="#ffff">
    Submit
  </StyledTypography>
</ActionButton> */}

              <ActionButton
                style={{
                  backgroundColor: 'rgb(76, 174, 76)',
                  color: 'white',
                }}
                startIcon={<CheckIcon sx={{ fontSize: 18, mr: 0.5 }} />}
                onClick={handleSubmitClick}
              >
                <StyledTypography
                  textTransform="none"
                  marginTop="1px"
                  color="#ffff"
                >
                  Submit
                </StyledTypography>
              </ActionButton>
              <ActionButton
                style={{
                  backgroundColor: '#1976d2',
                  color: 'white',
                }}
                startIcon={<CheckIcon sx={{ fontSize: 18, mr: 0.5 }} />}
                onClick={handleSaveClick}
              >
                <StyledTypography
                  textTransform="none"
                  marginTop="1px"
                  color="#ffff"
                >
                  Save
                </StyledTypography>
              </ActionButton>
              <ActionButton
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
                onClick={() => {
                  navigate('/IncidentManagement/RootCauseAnalysis');
                }}
              >
                <StyledTypography textTransform="none" marginTop="1px">
                  Cancel
                </StyledTypography>
              </ActionButton>
              <ActionButton
                style={{ backgroundColor: '#449d44' }}
                variant="outlined"
                sx={{
                  boxShadow: '0px 4px 4px 0px #00000040',
                  '&:hover': {
                    transform: 'scale(1.05) !important',
                    transition: 'transform 0.3s ease !important',
                  },
                }}
                startIcon={
                  <i
                    className="fa fa-eye"
                    style={{
                      marginInlineEnd: 5,
                      color: '#FFFFFF',
                      fontSize: '16px',
                    }}
                  />
                }
                onClick={handlePreviewSaveClick}
              >
                <StyledTypography
                  textTransform="none"
                  marginTop="1px"
                  color="#ffff"
                >
                  Preview
                </StyledTypography>
              </ActionButton>
            </FlexContainer>
          </FormContainer>
        </Accordion>

        <div>
          <Dialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
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
              {dialogMessage}
            </DialogTitle>
            <DialogActions sx={{ justifyContent: 'center', gap: 3 }}>
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
              RCA Drafted
            </DialogTitle>
            <DialogActions sx={{ justifyContent: 'center' }}>
              <Button
                onClick={handleSecondDialogClose}
                sx={{
                  backgroundColor: '#3085d6',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '1rem',
                  padding: '8px 20px',
                  '&:hover': {
                    backgroundColor: '#2672b5',
                  },
                }}
              >
                OK
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </FlexContainer>
    </>
  );
}
