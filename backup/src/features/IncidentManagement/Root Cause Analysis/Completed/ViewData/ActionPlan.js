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
import { setFishBoneAttachmentData } from '../../../../../redux/features/mainMaster/incidentRcaSlice.js';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

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
  const [files, setFiles] = useState([]);
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
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [openSecondDialog, setOpenSecondDialog] = useState(false);

  const {
    selectedMenu,
    userDetails,
    selectedFacility,
    selectedModuleId,
    roleFacilities,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

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

    newFileArray.forEach((newFile) => {
      const fileExists = files.some(
        (file) =>
          file.OriginalFileName === newFile.name || file.name === newFile.name
      );

      if (fileExists) {
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
    setFiles(
      files?.filter((item) => item.OriginalFileName !== file.OriginalFileName)
    );
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

  const handleSave = async () => {
    const teamMembers = teamDataToUse
      ?.map((item) => item.UserId)
      .filter((id) => id !== undefined && id !== null)
      .join(',');

    const mailNotifyStaffId = mailToDataToUse
      ?.map((item) => item.UserId)
      .filter((id) => id !== undefined && id !== null)
      .join(',');

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
      rcaStatus: FullData?.RCAStatus,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
      incidentNo: FullData?.IncidentNo,
      incidentClosureTATId: null,
      closureTATDays: null,
      eventSequenceSave: eventDataToUse?.map((item, index) => ({
        eventDate: item.EventDate || '',
        eventActivity: item.EventActivity || '',
        orderNo: index + 1 || '',
      })),
      rcaQuestionAnswerSave: [],
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
      const response = await triggerSaveRCAMutation(payload).unwrap();

      if (response && response.Data) {
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
      rcaStatus: FullData?.RCAStatus,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
      incidentNo: FullData?.IncidentNo,
      incidentClosureTATId: null,
      closureTATDays: null,
      eventSequenceSave: eventDataToUse?.map((item, index) => ({
        eventDate: item.EventDate || '',
        eventActivity: item.EventActivity || '',
        orderNo: index + 1 || '',
      })),
      rcaQuestionAnswerSave: [],
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
      const response = await triggerPreviewSaveRCAMutation(payload).unwrap();

      if (response && response.Data) {
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
                      padding: '0 16px',
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
              <ActionButton
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
                <StyledTypography
                  textTransform="none"
                  marginTop="1px"
                  color="#ffff"
                >
                  Submit
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
                  <i
                    className="fa fa-save"
                    style={{
                      marginBottom: '1px',
                      marginInlineEnd: 8,
                      color: '#FFFFFF',
                    }}
                  />
                }
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
                style={{ backgroundColor: '#6c757d', color: '#fff' }}
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
                    className="fa fa-ban"
                    style={{
                      marginBottom: '1px',
                      marginInlineEnd: 8,
                      color: '#FFFFFF',
                    }}
                  />
                }
              >
                <StyledTypography
                  textTransform="none"
                  marginTop="1px"
                  color="rgb(255, 255, 255)"
                >
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
                      marginBottom: '1px',
                      marginInlineEnd: 5,
                      color: '#FFFFFF',
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
              <Button
                onClick={() => setOpenDialog(false)}
                sx={{
                  backgroundColor: '#6c757d ',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '1rem',
                  padding: '8px 20px',
                  '&:hover': {
                    backgroundColor: '#7f878f ',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
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
                Yes
              </Button>
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
