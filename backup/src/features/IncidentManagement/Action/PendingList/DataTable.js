import React, { useState } from 'react';
import {
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  Tooltip,
  TableSortLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  IconButton,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import SearchIcon from '@mui/icons-material/Search';
import LocalizationProvider from '@mui/icons-material/Search';
import AdapterDateFns from '@mui/icons-material/Search';
import Label from '../../../../components/Label/Label';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import AddStaffModel from './AddStaffModel';
import CustomDate from '../../../../components/Date/Date';
import { showSweetAlert, showToastAlert } from '../../../../utils/SweetAlert';
import Error from '../../../../assets/Gifs/error.gif';

import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
  FormLabel,
  ActionButton,
} from '../../../../utils/DataTable.styled';
import { FlexContainer, StyledImage } from '../../../../utils/StyledComponents';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../../../redux/features/mainMaster/staffMasterSlice';
import { useDeleteStaffMutation } from '../../../../redux/RTK/staffMasterApi';
import formatDate from '../../../../utils/FormatDate';
import { Link } from 'react-router-dom';
import { checkAccess } from '../../../../utils/Auth';
import DeleteUserGif from '../../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import LockIcon from '@mui/icons-material/Lock';
import { TextField } from '../../../../components/TextField/TextField';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import {
  StyledButton,
  StyledTypography,
} from '../../../../utils/StyledComponents';

import { Formik, Form, Field, ErrorMessage } from 'formik';

import {
  useReassignActionMutation,
  useUpdateCompleteActionStatusMutation,
} from '../../../../redux/RTK/IncidentManagement/ActionsApi';

const styles = {
  wrapText: {
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
  },
};

const DataTable = ({
  columns = [],
  records,
  totalRecords,
  labels,
  isView = false,
}) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [files, setFiles] = useState([]);

  const { pageSize, pageIndex } = useSelector(
    (state) => state.staffMaster.filters
  );
  const {
    userDetails,
    selectedMenu,
    roleFacilities,
    isSuperAdmin,
    selectedRoleFacility,
    selectedModuleId,
    selectedFacility,
  } = useSelector((state) => state.auth);
  const filters = useSelector((state) => state.staffMaster.filters);

  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();

  const [openPopup, setOpenPopup] = useState(false);
  const [completedPopup, setCompletedPopup] = useState(false);
  const [responsibleStaff, setResponsibleStaff] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [targetDate, setTargetDate] = useState(null);

  const handleClosePopup = () => setOpenPopup(false);
  const handleCompletedClosePopup = () => setCompletedPopup(false);
  const [isStaffModel, setIsStaffModel] = useState(false);
  const [staffFacilityId, setStaffFacilityId] = useState(null);

  const [selectedIncident, setSelectedIncident] = useState([]);
  const [remarks, setRemarks] = useState('');

  const [tableData, setTableData] = useState([
    {
      RowNo: 1,
      ResponsibleStaff: '',
      DepartmentName: '',
      DepartmentId: '',
      Designation: '',
      Comments: '',
      isEditable: true,
    },
  ]);
  const [editableRowId, setEditableRowId] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [triggerReassignAction] = useReassignActionMutation();

  const handleOnPageChange = (event, newPage) => {
    dispatch(
      setFilters({
        ...filters,
        pageIndex: newPage,
      })
    );
  };

  const handleOpenPopup = (row) => {
    setSelectedIncident(row);
    setOpenPopup(true);
  };
  const handleCompletedOpenPopup = (row) => {
    setSelectedIncident(row);
    setCompletedPopup(true);
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(
      setFilters({
        ...filters,
        pageIndex: 0,
        pageSize: parseInt(event.target.value, 10),
      })
    );
  };

  const handleOnDelete = async (row) => {
    const callback = async () => {
      try {
        await deleteStaff({
          userId: row.UserId,
          loginUserId: userDetails?.UserId,
          menuId: selectedMenu?.id,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Your staff has been deleted.',
          timer: 3000,
          gif: SuccessGif,
          height: 250,
          width: 250,
        });
      } catch (error) {
        console.log({ error });
      }
    };
    showSweetAlert({
      type: 'delete',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      gif: DeleteUserGif,
      callback,
      cancelButtonText: 'No, Keep it',
      confirmButtonText: 'Yes, delete it!',
    });
  };

  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
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
        // setMessage('File already exists');
        // setOpen(true);
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

  const sortedRecords = [...records].sort((a, b) => {
    const aValue = a[orderBy]?.toString().toLowerCase();
    const bValue = b[orderBy]?.toString().toLowerCase();
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const handleOnRowClick = (row) => {
    setIsStaffModel(true);
    setStaffFacilityId(row.StaffFacilityId);

    const formattedRow = {
      ResponsibleStaff: row.StaffName || '',
      DepartmentName: row.Department || '',
      DepartmentId: row.DepartmentId || '',
      Designation: row.PrimaryDesignation || '',
      UserId: row.UserId,
    };

    handleRowUpdate(formattedRow);
  };

  const handleRowUpdate = (updatedRow) => {
    const newRow = {
      ResponsibleStaff: updatedRow.ResponsibleStaff || '',
      DepartmentName: updatedRow.DepartmentName || '',
      DepartmentId: updatedRow.DepartmentId || '',
      ResponsibleStaffId: updatedRow.ResponsibleStaffId || '',
      Designation: updatedRow.Designation || '',
      isEditable: true,
      Comments: '',
      UserId: updatedRow.UserId,
    };

    const updatedRows = tableData.map((row, index) => {
      if (row.isEditable) {
        return {
          DepartmentId: newRow.DepartmentId || '',
          DepartmentName: newRow.DepartmentName || '',
          ResponsibleStaff: newRow.ResponsibleStaff || '',
          Designation: newRow.Designation || '',
          RowNo: row.RowNo,
          Comments: row.Comments || '',
          isEditable: true,
          UserId: newRow.UserId,
        };
      }
      return row;
    });

    setTableData(updatedRows);
    setIsStaffModel(false);
  };

  const handleChange = (selectedOption) => {
    const selectedKey = selectedOption?.target?.value || selectedOption?.key;
    setRemarks(selectedKey);
    tableData[0].Comments = selectedKey;
  };

  const handleReassign = async (e) => {
    e.preventDefault();

    if (!remarks || remarks == '') {
      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: 'Please Enter Remarks',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      setColor('#e63a2e');
      setMessage('Failed');
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }

    try {
      const response = await triggerReassignAction({
        payload: {
          reAssignedActionsLogId: 0,
          incidentId: selectedIncident?.IncidentId,
          actionsId: selectedIncident?.ActionsId,
          incidentClosureId: selectedIncident?.IncidentClosureId,
          closureActionId: selectedIncident?.ClosureActionId,
          responsibleUserId: selectedIncident?.ResponsibleStaffId,
          reAssignedResponsibleUserId: tableData[0]?.UserId,
          reAssignedRemarks: remarks,
          createdBy: 1,
          headerFacilityId: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
        },
      }).unwrap();
      setOpenPopup(false);

      showToastAlert({
        type: 'custom_success',
        text: response.Message,
        gif: SuccessGif,
      });
      setMessage(response.Message);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      navigate('/IncidentManagement/Actions');
    } catch (error) {
      if (error && error.data) {
        setOpenPopup(false);

        showSweetAlert({
          type: 'warning',
          title: 'Oops!',
          text: error.data,
          gif: Error,
          showConfirmButton: true,
          confirmButtonText: 'Close',
        });
        setColor('#e63a2e');
        setMessage('Failed');
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    }
  };

  const [triggerCompleteAction] = useUpdateCompleteActionStatusMutation();

  const handleCompleteAction = async (comments) => {
    try {
      const today = new Date().toISOString();

      const Payload = {
        ActionsId: selectedIncident?.ActionsId,
        IncidentId: selectedIncident?.IncidentId,
        FacilityName: selectedIncident?.FacilityName,
        IncidentNo: selectedIncident?.IncidentNo,
        IncidentDateTime: selectedIncident?.IncidentDateTime,
        TaskAssigned: selectedIncident?.TaskAssigned,
        ResponsibleStaffId: selectedIncident?.ResponsibleStaffId,
        ResponsibleStaff: selectedIncident?.ResponsibleStaff,
        ResponsibleStaffDepartmentId:
          selectedIncident?.ResponsibleStaffDepartmentId,
        BriefDescriptionOfIncident:
          selectedIncident?.BriefDescriptionOfIncident,
        DepartmentName: selectedIncident?.DepartmentName,
        TargetDate: selectedIncident?.TargetDate,
        SubmittedDate: today,
        ApprovedDate: '2025-02-17T13:00:00Z',
        ActionStatus: 'In Progress',
        Comments: comments,
        SubmittedById: 2,
        SubmittedBy: 'Jane Smith',
        ApprovedById: 1,
        ApprovedBy: 2,
        ApproverRemarks: 'Action approved, needs follow-up.',
        IsRejected: false,
        IsDelete: false,
        ApprovalStatus: 'Approved',
        ClosedDate: '2025-02-18T15:00:00Z',
        ClosedById: 1,
        ClosedBy: 'Alice Johnson',
        ColorCode: 'Green',
        headerFacilityId: selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
        IncidentClosureId: 14,
        ClosureActionId: 18,
        RejectedActionsList: [],
        ActionAttachmentList: [],
      };

      const formData = new FormData();
      formData.append('incidentActionsSave', JSON.stringify(Payload));

      const response = await triggerCompleteAction({ formData });

      if (response && response?.data) {
        showToastAlert({
          type: 'custom_success',
          text: response.data?.Message,
          gif: SuccessGif,
        });
        setCompletedPopup(false);
      }

      if (!response) {
        throw new Error('Empty response from server');
      }
    } catch (error) {
      console.error('Error occurred during submission:', {
        errorMessage: error?.message || 'Unknown error',
        errorDetails: error?.data || null,
        errorStack: error?.stack || null,
      });

      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: error.data || 'Something went wrong',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
    }
  };

  return (
    <FlexContainer flexDirection="column">
      <TableContainer component={Paper} >
        <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
          <StyledTableHead>
            <TableRow>
              <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
              {columns
                ?.filter((col) => col.isSelected)
                ?.map((column) => (
                  <StyledTableHeaderCell key={column.id}>
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'desc'}
                      onClick={() => handleSortRequest(column.id)}
                    >
                      {getlabel(column.translationId, labels, i18n.language)}
                    </TableSortLabel>
                  </StyledTableHeaderCell>
                ))}
              {checkAccess(isSuperAdmin, isView, true) && (
                <StyledTableHeaderCell>Actions</StyledTableHeaderCell>
              )}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {sortedRecords?.length > 0 ? (
              sortedRecords?.map((row, rowIndex) => {
                const menu = roleFacilities?.find(
                  (role) => role.FacilityName === row.Facility
                )?.Menu;
                const role = menu?.find(
                  (item) => item.MenuId === selectedMenu?.id
                );
                return (
                  <StyledTableRow key={rowIndex}>
                    <StyledTableBodyCell>
                      {pageIndex * pageSize + rowIndex + 1}
                    </StyledTableBodyCell>
                    {columns
                      ?.filter((col) => col.isSelected)
                      .map((column) => {
                        return (
                          <StyledTableBodyCell
                            key={column.id}
                            style={{
                              maxWidth:
                                column.id === 'SecondaryDesignation'
                                  ? '150px'
                                  : 'auto',
                              wordWrap: 'break-word',
                              overflowWrap: 'break-word',
                              whiteSpace: 'normal',
                            }}
                            status={
                              column.id === 'Status' ? row[column.id] : ''
                            }
                          >
                            {column.id === 'Added_EditedDate' ||
                            column.id === 'IncidentDateTime' ||
                            column.id === 'TargetDate' ? (
                              row[column.id] ? (
                                <div
                                  style={{
                                    backgroundColor:
                                      column.id === 'TargetDate' &&
                                      row.ColorCode
                                        ? row.ColorCode
                                        : 'transparent',
                                    color:
                                      column.id === 'TargetDate'
                                        ? '#ffffff'
                                        : 'inherit',
                                    fontWeight:
                                      column.id === 'TargetDate'
                                        ? 'bold'
                                        : 'normal',
                                    
                                    borderRadius: '4px',
                                    textAlign: 'center',
                                  }}
                                >
                                  {formatDate(row[column.id])}
                                </div>
                              ) : null
                            ) : column.id === 'SecondaryDesignation' ? (
                              <div style={styles.wrapText}>
                                {row[column.id] ?? null}
                              </div>
                            ) : (
                              (row[column.id] ?? null)
                            )}
                          </StyledTableBodyCell>
                        );
                      })}
                    {checkAccess(
                      isSuperAdmin,
                      isView,
                      role?.IsEdit 
                    ) &&  (
                      <ActionCell>
                        <FlexContainer className="action-icons">
                          <Tooltip title="Open" arrow>
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<LockIcon />}
                            >
                              {row.ActionStatus === 'Open' ? 'Open' : 'Closed'}
                            </Button>
                          </Tooltip>
                          {/* <Tooltip title="Completed" arrow>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleCompletedOpenPopup(row)}
                            >
                              <i
                                className="fa fa-check"
                                style={{ marginRight: '6px' }}
                              ></i>
                              Completed
                            </Button>
                          </Tooltip> */}

                          {/* Re-Assign Action Button */}
                          <Tooltip title="Re-Assign Action" arrow>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleOpenPopup(row)}
                            >
                              Re-Assign Action
                            </Button>
                          </Tooltip>
                        </FlexContainer>
                      </ActionCell>
                    )}
                    {userDetails?.StaffCategoryName === 'module admin incident' &&  (
                      <ActionCell>
                        <FlexContainer className="action-icons">
                          <Tooltip title="Open" arrow>
                            <Button
                              variant="contained"
                              color="primary"
                              startIcon={<LockIcon />}
                            >
                              {row.ActionStatus === 'Open' ? 'Open' : 'Closed'}
                            </Button>
                          </Tooltip>
                          {/* <Tooltip title="Completed" arrow>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleCompletedOpenPopup(row)}
                            >
                              <i
                                className="fa fa-check"
                                style={{ marginRight: '6px' }}
                              ></i>
                              Completed
                            </Button>
                          </Tooltip> */}

                          {/* Re-Assign Action Button */}
                          <Tooltip title="Re-Assign Action" arrow>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleOpenPopup(row)}
                            >
                              Re-Assign Action
                            </Button>
                          </Tooltip>
                        </FlexContainer>
                      </ActionCell>
                    )}
                  </StyledTableRow>
                );
              })
            ) : (
              <TableRow>
                <StyledTableBodyCell colSpan={columns.length} align="center">
                  {t('NoDataAvailable')}
                </StyledTableBodyCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openPopup}
        onClose={handleClosePopup}
        dir={'ltr'}
        maxWidth={'sm'}
        fullWidth={true}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#205475',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
          }}
        >
          <StyledTypography
            fontSize="20px"
            fontWeight="300"
            lineHeight="18px"
            color="#fff"
          >
            Re-Assign Action Responsible Staff
          </StyledTypography>
          <IconButton
            onClick={handleClosePopup}
            style={{
              padding: '0.7rem',
            }}
            sx={{
              color: '#fff',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor: 'color(srgb 0.75 0.74 0.74 / 0.15)',
              },
            }}
          >
            <img src={CloseIcon} alt="Close Icon" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <FlexContainer flexWrap="wrap">
            <Formik
              enableReinitialize={true}
              initialValues={{
                facility: '',
                employmentType: '',
              }}
              validateOnBlur={false}
              validationSchema={null}
            >
              {({ values, handleSubmit, setFieldValue }) => (
                <Form style={{ width: '100%' }}>
                  <Grid
                    container
                    display={'flex'}
                    width="100%"
                    flexWrap={'wrap'}
                    justifyContent={'space-between'}
                    item
                    xs={12}
                    spacing={2}
                    alignItems={'center'}
                    marginTop={'0.2rem'}
                  >
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <Label value="Responsible Staff" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                      <div
                        style={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: '#eee',
                        }}
                      >
                        <TextField
                          fullWidth
                          value={tableData[0]?.ResponsibleStaff}
                          disabled
                          sx={{
                            '& .MuiInputBase-input.Mui-disabled': {
                              opacity: 1,
                              fontWeight: 'bold',
                              color: 'black',
                              WebkitTextFillColor: 'black',
                              backgroundColor: '#eee',
                            },
                          }}
                          InputProps={{
                            style: {
                              paddingRight: '40px',
                              backgroundColor: '#eee',
                            },
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            right: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            height: '100%',
                            borderLeft: '1px solid #ccc',
                            paddingLeft: '10px',
                            backgroundColor: '#eee',
                          }}
                        >
                          <i
                            className="fa fa-search"
                            onClick={() => {
                              setIsStaffModel(true);
                            }}
                            style={{
                              cursor: 'pointer',
                              fontSize: '15px',
                              color: '#555',
                              backgroundColor: '#eee',
                            }}
                          ></i>
                        </div>
                      </div>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    display={'flex'}
                    width="100%"
                    flexWrap={'wrap'}
                    justifyContent={'space-between'}
                    item
                    xs={12}
                    spacing={2}
                    alignItems={'center'}
                    marginTop={'1rem'}
                  >
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <Label value="Department" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                      <Label value={tableData[0]?.DepartmentName || 'NA'} />
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    display={'flex'}
                    width="100%"
                    flexWrap={'wrap'}
                    justifyContent={'space-between'}
                    item
                    xs={12}
                    spacing={2}
                    alignItems={'center'}
                    marginTop={'1rem'}
                  >
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <Label value="Designation" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                      <Label value={tableData[0]?.Designation || 'NA'} />
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    display={'flex'}
                    width="100%"
                    flexWrap={'wrap'}
                    justifyContent={'space-between'}
                    item
                    xs={12}
                    spacing={2}
                    alignItems={'center'}
                    marginTop={'1rem'}
                  >
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <Label value="Target Date" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                      <CustomDate
                        name={null}
                        value={null}
                        onChange={(date) => {
                          console.log('date', date);
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    display={'flex'}
                    width="100%"
                    flexWrap={'wrap'}
                    justifyContent={'space-between'}
                    item
                    xs={12}
                    spacing={2}
                    alignItems={'center'}
                    marginTop={'1rem'}
                  >
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <Label value="Remarks" />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                      <TextField
                        fullWidth
                        multiline
                        value={null}
                        sx={{
                          '& .MuiInputBase-input.Mui-disabled': {
                            opacity: 1,
                            fontWeight: 'bold',
                            color: 'black',
                            WebkitTextFillColor: 'black',
                          },
                        }}
                        onChange={(event) => handleChange(event)}
                      />
                    </Grid>
                  </Grid>

                  <Grid
                    display={'flex'}
                    width="100%"
                    justifyContent={'center'}
                    gap={'10px'}
                    marginTop={'1rem'}
                  >
                    <StyledButton
                      borderRadius="6px"
                      gap="4px"
                      padding="6px 10px"
                      variant="contained"
                      color="primary"
                      onClick={handleReassign}
                      type="submit"
                      style={{ display: 'inline-flex', gap: '8px' }}
                      startIcon={
                        <StyledImage
                          height="16px"
                          width="16px"
                          src={DoneIcon}
                          alt="WhiteSearch"
                        />
                      }
                    >
                      Submit
                    </StyledButton>
                    <StyledButton
                      variant="outlined"
                      border="1px solid #0083c0"
                      backgroundColor="#ffffff"
                      type="button"
                      colour="#0083c0"
                      borderRadius="6px"
                      sx={{ marginLeft: '10px' }}
                      style={{ display: 'inline-flex', gap: '8px' }}
                      onClick={() => console.log('Cancelled')}
                      startIcon={
                        <StyledImage
                          height="16px"
                          width="16px"
                          src={DndIcon}
                          alt="WhiteSearch"
                        />
                      }
                    >
                      Cancel
                    </StyledButton>
                  </Grid>
                </Form>
              )}
            </Formik>
          </FlexContainer>
        </DialogContent>
      </Dialog>

      <Dialog
        open={completedPopup}
        onClose={handleCompletedClosePopup}
        dir={'ltr'}
        maxWidth={'sm'}
        fullWidth={true}
        PaperProps={{
          sx: {
            borderRadius: '8px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#205475',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
          }}
        >
          <StyledTypography
            fontSize="20px"
            fontWeight="300"
            lineHeight="18px"
            color="#fff"
          >
            Close Action
          </StyledTypography>
          <IconButton
            onClick={handleCompletedClosePopup}
            style={{
              padding: '0.7rem',
            }}
            sx={{
              color: '#fff',
              '&:hover': {
                transform: 'scale(1.05)',
                backgroundColor: 'rgba(0.75, 0.74, 0.74, 0.15)',
              },
            }}
          >
            <img src={CloseIcon} alt="Close Icon" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Formik
            enableReinitialize={true}
            initialValues={{
              comments: '',
              attachments: [],
            }}
            onSubmit={(values) => {
              console.log('Submitted Values:', values);
            }}
          >
            {({ values, setFieldValue, handleSubmit }) => (
              <Form style={{ width: '100%' }}>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  marginTop={'1rem'}
                >
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Label value="Comments" />
                    <TextField
                      multiline
                      fullWidth
                      variant="outlined"
                      rows={6}
                      sx={{
                        '& .MuiInputBase-input.Mui-disabled': {
                          opacity: 1,
                          fontWeight: 'bold',
                          color: 'black',
                          WebkitTextFillColor: 'black',
                        },
                        '& .MuiInputBase-root': {
                          minHeight: '150px',
                        },
                        '& .MuiOutlinedInput-root': {
                          paddingTop: '8px',
                          alignItems: 'flex-start',
                        },
                        '& .MuiOutlinedInput-input': {
                          lineHeight: '1.5',
                          paddingTop: '8px',
                        },
                      }}
                      value={values.comments}
                      onChange={(event) =>
                        setFieldValue('comments', event.target.value)
                      }
                    />
                  </Grid>
                </Grid>

                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  marginTop={'1rem'}
                >
                  <Grid
                    item
                    xs={12}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <FormLabel>Attachment(s)</FormLabel>

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
                        Attachment(s){' '}
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
                      Note: Maximum File Upload Limit is 100MB (Images, PDF,
                      Word Files, Excel Files Only)
                    </Typography>
                  </Grid>
                </Grid>

                {/* Submit and Cancel Buttons */}
                <Grid
                  display="flex"
                  justifyContent="center"
                  gap="10px"
                  marginTop="1rem"
                >
                  <ActionButton
                    style={{
                      backgroundColor: '#5cb85c',
                      color: 'white',
                    }}
                    startIcon={
                      <i
                        className="fas fa-paper-plane"
                        style={{ marginInlineEnd: 8 }}
                      />
                    }
                    onClick={() => handleCompleteAction(values.comments)}
                  >
                    {t('Submit')}
                  </ActionButton>
                  <ActionButton
                    style={{
                      backgroundColor: '#6c757d',
                      color: 'white',
                    }}
                    onClick={() => {
                      setCompletedPopup(false);
                    }}
                    startIcon={
                      <i
                        className="fas fa-ban"
                        style={{
                          color: 'white',
                          marginInlineEnd: 8,
                          fontSize: '16px',
                        }}
                      />
                    }
                  >
                    {t('Cancel')}
                  </ActionButton>
                </Grid>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {isStaffModel && (
        <AddStaffModel
          open={isStaffModel}
          onClose={() => setIsStaffModel(false)}
          setIsStaffModel={setIsStaffModel}
          setStaffFacilityId={setStaffFacilityId}
          onSelectRow={handleOnRowClick}
        />
      )}

      {totalRecords?.length > 0 && (
        <CustomPagination
          totalRecords={totalRecords}
          page={pageIndex}
          pageSize={pageSize}
          handleOnPageChange={handleOnPageChange}
          handleOnPageSizeChange={handleOnPageSizeChange}
        />
      )}
    </FlexContainer>
  );
};

export default DataTable;
