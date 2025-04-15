import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
  Box,
  Select,
  Grid,
  Collapse,
  TextField,
} from '@mui/material';
import {
  FlexContainer,
  StyledImage,
  StyledButton,
} from '../../../../utils/StyledComponents';
import {
  ActionCell,
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
  FormLabel,
  ActionButton,
} from '../../../../utils/DataTable.styled';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import AddIcon from '../../../../assets/Icons/AddSubMaster.png';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import {
  useGetPageLoadDataQuery,
  useCreateReportNameMutation,
  useGetReportDetailsMutation,
  useSubmitReportFieldsMutation,
} from '../../../../redux/RTK/IncidentManagement/CustomReportsApi';
import { useDispatch, useSelector } from 'react-redux';
import CustomReportTransferList from './CustomReportTransferList';
import CheckIcon from '@mui/icons-material/Check';
import { showSweetAlert, showToastAlert } from '../../../../utils/SweetAlert';
import DeleteUserGif from '../../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import Error from '../../../../assets/Gifs/error.gif';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

const CustomReportDesigner = () => {
  const { isMobile } = useWindowDimension();
  const { selectedModuleId, userDetails, selectedFacility } = useSelector(
    (state) => state.auth
  );

  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);
  const [selectedFields, setSelectedFields] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entryReport, setEntryReport] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const { data: pageLoadData, refetch } = useGetPageLoadDataQuery({
    menuId: 36,
    moduleId: selectedModuleId,
    loginUserId: userDetails?.UserId,
    facilityId: selectedFacility?.id,
  });

  const [triggerReportDetails] = useGetReportDetailsMutation();
  const [triggerCreateReportName] = useCreateReportNameMutation();
  const [triggerSubmitReportFields] = useSubmitReportFieldsMutation();

  const ListData = pageLoadData?.Data || {};
  const { CustomReportList = [], ReportMenuList = [] } = ListData;

  const reportOptions = CustomReportList.map(({ BuilderId, ReportName }) => ({
    value: BuilderId,
    text: ReportName,
  }));

  const menuOptions = ReportMenuList.map(({ MenuId, MenuName }) => ({
    value: MenuId,
    text: MenuName,
  }));

  useEffect(() => {
    const fetchReportDetails = async () => {
      if (selectedReport) {
        try {
          const response = await triggerReportDetails({
            builderId: selectedReport,
            headerFacility: selectedFacility?.id,
            loginUserId: userDetails?.UserId,
            moduleId: selectedModuleId,
            menuId: 36,
          });

          setReportDetails(response?.data);
          setSelectedFields(
            response?.data?.Data?.SelectedReportFieldList || []
          );
        } catch (error) {
          console.error('Error fetching report details:', error);
        }
      }
    };

    fetchReportDetails();
  }, [selectedReport]);

  const filteredScreenwiseFields =
    reportDetails?.Data?.ScreenwiseFieldList?.filter(
      (field) => !selectedScreen || field.MenuId === selectedScreen
    ) || [];

  console.log('filteredScreenwiseFields', filteredScreenwiseFields);

  const handleSelectedFieldsChange = (newSelectedFields) => {
    setSelectedFields(newSelectedFields);
    console.log('Selected Fields:', newSelectedFields);
  };

  const handleSubmit = async () => {
    if (!entryReport) {
      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: 'Type the report name',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      setIsModalOpen(false);

      return;
    }
    const payload = {
      facilityId: selectedFacility?.id,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: 36,
      reportUserId: userDetails?.UserId,
      reportName: entryReport,
    };

    try {
      const response = await triggerCreateReportName(payload).unwrap();
      setIsModalOpen(false);
      setEntryReport(null);
      showToastAlert({
        type: 'custom_success',
        text: response?.Message,
        gif: SuccessGif,
      });
      await refetch();

      if (response && response.Data) {
        console.log('Parsed response data:', response.Data);
        setIsModalOpen(false);
        showToastAlert({
          type: 'custom_success',
          text: response?.Message || 'Submitted successfully!',
          gif: SuccessGif,
        });
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error during submission:', {
        errormessage: error.message,
        errorStack: error.stack,
      });
      setIsModalOpen(false);
      setEntryReport(null);

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
  const handleConfirm = async () => {
    if (!selectedReport) {
      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: 'Please select a report before submitting.',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      return;
    }

    if (!selectedFields || selectedFields.length === 0) {
      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: 'Please select at least one field to proceed.',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      return;
    }

    const invalidFields = selectedFields.some(
      (field) =>
        !field.FieldEnglishLabel || !field.MenuId || !field.FieldLabelId
    );

    if (invalidFields) {
      showSweetAlert({
        type: 'warning',
        title: 'Invalid Fields',
        text: 'One or more fields are missing required information.',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      return;
    }

    const uniqueFields = new Map();
    const payload = {
      loginUserId: userDetails?.UserId,
      facilityId: selectedFacility?.id,
      moduleId: selectedModuleId,
      builderId: selectedReport,
      pageMenuId: 36,
      customReportBuilderDetail: selectedFields
        .filter((field) => {
          const key = field.FieldEnglishLabel.toLowerCase();
          if (uniqueFields.has(key)) return false;
          uniqueFields.set(key, true);
          return true;
        })
        .map((field) => ({
          menuId: field.MenuId,
          fieldEnglishLabel: field.FieldEnglishLabel,
          fieldLabelId: field.FieldLabelId,
        })),
    };

    try {
      const response = await triggerSubmitReportFields(payload).unwrap();
      setEntryReport(null);
      showToastAlert({
        type: 'custom_success',
        text: response?.Message,
        gif: SuccessGif,
      });

      setOpenDialog(false);
      if (response && response.Data) {
        console.log('Parsed response data:', response.Data);
        setIsModalOpen(false);
        showToastAlert({
          type: 'custom_success',
          text: response?.Message || 'Submitted successfully!',
          gif: SuccessGif,
        });
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error during submission:', {
        errormessage: error.message,
        errorStack: error.stack,
      });
      setOpenDialog(false);
      setEntryReport(null);

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

  const handleSaveClick = () => {
    setOpenDialog(true);
  };
  const handleCancel = () => {
    setSelectedReport(null);
    setSelectedScreen(null);
    setSelectedFields([]);
    setReportDetails(null);
    setIsModalOpen(false);
  };

  return (
    <FlexContainer justifyContent="center" style={{ marginTop: '20px' }}>
      <Grid container gap={1.5} justifyContent="center" sx={{ maxWidth: 800 }}>
        <Grid
          item
          container
          alignItems="center"
          spacing={2}
          justifyContent="center"
          xs={12}
        >
          <Grid item xs="auto">
            <FormLabel sx={{ whiteSpace: 'nowrap' }}>Choose Report:</FormLabel>
          </Grid>
          <Grid item xs sx={{ maxWidth: 300 }}>
            <SearchDropdown
              name="ChooseReport"
              sx={{ width: '100%' }}
              options={reportOptions}
              value={
                selectedReport
                  ? reportOptions.find((opt) => opt.value === selectedReport)
                  : null
              }
              onChange={(event, value) => setSelectedReport(value?.value)}
            />
          </Grid>

          <Grid item xs="auto">
            <FormLabel sx={{ whiteSpace: 'nowrap' }}>Choose Screen:</FormLabel>
          </Grid>
          <Grid item xs sx={{ maxWidth: 300 }}>
            <SearchDropdown
              name="screens"
              sx={{ width: '100%' }}
              options={[...menuOptions]}
              value={
                selectedScreen
                  ? menuOptions.find((opt) => opt.value === selectedScreen)
                  : null
              }
              onChange={(event, value) => setSelectedScreen(value?.value)}
            />
          </Grid>
          <Grid item xs="auto" sx={{ maxWidth: 200 }}>
            <StyledButton
              variant="contained"
              color="success"
              startIcon={
                <StyledImage
                  height="14px"
                  width="14px"
                  src={AddIcon}
                  alt="Add New Icon"
                  style={{ marginInlineEnd: 8 }}
                />
              }
              onClick={() => setIsModalOpen(true)}
            >
              Add New Report
            </StyledButton>
          </Grid>
        </Grid>

        {filteredScreenwiseFields.length > 0 && selectedScreen && (
          <>
            <Grid item xs={12} sx={{ textAlign: 'left', mb: 1 }}>
              <FormLabel sx={{ whiteSpace: 'nowrap' }}>
                Choose Fields:
              </FormLabel>
            </Grid>
            <CustomReportTransferList
              screenwiseFieldList={filteredScreenwiseFields}
              selectedReportFieldList={selectedFields}
              onSelectedFieldsChange={handleSelectedFieldsChange}
            />
            <Grid
              item
              xs={12}
              display="flex"
              justifyContent="center"
              gap={2}
              mt={2}
            >
              <ActionButton
                style={{ backgroundColor: '#1976d2', color: 'white' }}
                startIcon={<CheckIcon sx={{ fontSize: 18, mr: 0.5 }} />}
                onClick={handleSaveClick}
                sx={{ maxWidth: 200 }}
              >
                Submit
              </ActionButton>

              <ActionButton
                sx={{
                  backgroundColor: 'white',
                  color: 'black !important',
                  border: '1px solid #1976d2',
                  '&:hover': { backgroundColor: 'white' },
                  maxWidth: 200,
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
                onClick={handleCancel}
              >
                Cancel
              </ActionButton>
            </Grid>
          </>
        )}
      </Grid>

      <>
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
            Confirm Submit
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
        <Collapse in={isModalOpen}>
          <div
            style={{
              position: 'fixed',
              top: '0',
              left: '0',
              bottom: '0',
              right: '0',
              zIndex: 1300,
            }}
          >
            <div
              id="overlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(5px)',
              }}
            ></div>
            <div
              className="modal-dialog"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '50%',
                maxWidth: '700px',
                zIndex: 1400,
                borderRadius: '8px',
                overflow: 'hidden',
                border: '1px solid #0264AB',
              }}
            >
              <div className="modal-content">
                <div
                  className="modal-header"
                  style={{
                    backgroundColor: '#0264AB',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid #0264AB',
                  }}
                >
                  <h5 className="modal-title" style={{ margin: 0 }}>
                    Add Report Name
                  </h5>
                  <button
                    onClick={() => setIsModalOpen(false)}
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
                    <i
                      className="fas fa-times"
                      style={{ fontSize: '16px' }}
                    ></i>
                  </button>
                </div>

                <div
                  className="modal-body"
                  style={{
                    padding: '20px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '20px',
                    }}
                  >
                    <label
                      htmlFor="reminderRemarks"
                      style={{
                        marginRight: '10px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Report Name:
                    </label>
                    <TextField
                      variant="outlined"
                      rows={2}
                      sx={{
                        '& .MuiInputBase-input.Mui-disabled': {
                          opacity: 1,
                          fontWeight: 'bold',
                          color: 'black',
                          WebkitTextFillColor: 'black',
                        },
                      }}
                      onChange={(e) => {
                        setEntryReport(e.target.value);
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '10px',
                    }}
                  >
                    <ActionButton
                      style={{
                        backgroundColor: '#1976d2',
                        color: 'white',
                      }}
                      startIcon={<CheckIcon sx={{ fontSize: 18, mr: 0.5 }} />}
                      onClick={handleSubmit}
                      // disabled={isActionDisabled}
                    >
                      Submit
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
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </ActionButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Collapse>
      </>
    </FlexContainer>
  );
};

export default CustomReportDesigner;
