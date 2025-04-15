import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import SearchIcon from '@mui/icons-material/Search';
import LocalizationProvider from '@mui/icons-material/Search';
import AdapterDateFns from '@mui/icons-material/Search';
import Label from '../../../../components/Label/Label';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import AddStaffModel from './AddStaffModel';
import Date from '../../../../components/Date/Date';
import { showSweetAlert, showToastAlert } from '../../../../utils/SweetAlert';
import Error from '../../../../assets/Gifs/error.gif';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import PrintIcon from '@mui/icons-material/Print';

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
  useUpdateApproveRejectActionStatusMutation,
  useGetRejectionHistoryByIdQuery,
  useGetActionsAttachmentByIdQuery,
  useGetCompletedPrintActionMutation,
} from '../../../../redux/RTK/IncidentManagement/ActionsApi';
import { useGetAttachmentDownloadQuery } from '../../../../redux/RTK/incidentInvestigationApi';
import AttachmentDialog from './AttachmentDialog.js';

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
  const [attachmentLinks, setAttachmentLinks] = useState({});

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
  const [viewAttachment, setViewAttachment] = useState(false);
  const [responsibleStaff, setResponsibleStaff] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [targetDate, setTargetDate] = useState(null);

  const handleClosePopup = () => setOpenPopup(false);
  const handleCloseViewAttachment = () => setViewAttachment(false);

  const [isStaffModel, setIsStaffModel] = useState(false);
  const [staffFacilityId, setStaffFacilityId] = useState(null);

  const [selectedIncident, setSelectedIncident] = useState([]);

  const [actiontype, setActiontype] = useState(false);
  const [remarks, setRemark] = useState(false);

  const currentItems = [];
  const isIncidentFetching = false;

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
  const [triggerDownloadData] = useGetCompletedPrintActionMutation();

  const [useUpdateApproveRejectAction] =
    useUpdateApproveRejectActionStatusMutation();

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

  const handleViewAttachment = (row) => {
    setSelectedIncident(row);
    setViewAttachment(true);
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

  const sortedRecords = [...records].sort((a, b) => {
    const aValue = a[orderBy]?.toString().toLowerCase();
    const bValue = b[orderBy]?.toString().toLowerCase();
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const rejectionHistory = [
    {
      fieldId: `A_RH_ApproverRemarks`,
      translationId: 'IM_A_ApproverRemarks',
      label: 'StaffName',
      name: 'StaffName',
    },
    {
      fieldId: `A_RH_RejectedBy`,
      translationId: 'IM_A_RejectedBy',
      label: 'Department',
      name: 'Department',
    },
    {
      fieldId: `A_RH_RejectedDate`,
      translationId: 'IM_A_RejectedDate',
      label: 'Designation',
      name: 'Designation',
    },
  ];

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

  const handleCompleteReject = async (remarks, status) => {
    // if (!rejectionReason) {
    //   setError('Reason for rejection is required');
    //   return;
    // }

    // setError('');
    const Payload = {
      actionsId: selectedIncident?.ActionsId,
      incidentId: selectedIncident?.IncidentId,
      FacilityName: selectedIncident?.FacilityName,
      IncidentNo: selectedIncident?.IncidentNo,
      IncidentDateTime: selectedIncident?.IncidentDateTime,
      TaskAssigned: selectedIncident?.TaskAssigned,
      ResponsibleStaffId: selectedIncident?.ResponsibleStaffId,
      ResponsibleStaff: selectedIncident?.ResponsibleStaff,
      ResponsibleStaffDepartmentId:
        selectedIncident?.ResponsibleStaffDepartmentId,
      BriefDescriptionOfIncident: selectedIncident?.BriefDescriptionOfIncident,
      DepartmentName: selectedIncident?.DepartmentName,
      TargetDate: selectedIncident?.TargetDate,
      SubmittedDate: selectedIncident?.SubmittedDate,
      // "ApprovedDate": "2025-02-17T13:00:00Z",
      ActionStatus: 'In Progress',
      Comments: 'Action in progress. Awaiting approval.',
      SubmittedById: selectedIncident?.SubmittedById,
      SubmittedBy: selectedIncident?.SubmittedBy,
      ApprovedById: 1,
      ApprovedBy: 2,
      ApproverRemarks: remarks,
      IsRejected: selectedIncident?.IsRejected,
      IsDelete: selectedIncident?.IsDelete,
      ApprovalStatus: status,
      // "ClosedDate": "2025-02-18T15:00:00Z",
      ClosedById: 1,
      ClosedBy: '',
      ColorCode: selectedIncident?.ColorCode,
      HeaderFacilityId: selectedFacility?.id,
      LoginUserId: userDetails?.UserId,
      ModuleId: selectedModuleId,
      MenuId: selectedMenu?.id,
      IncidentClosureId: selectedIncident?.IncidentClosureId,
      ClosureActionId: selectedIncident?.ClosureActionId,
      RejectedActionsList: [],
      ActionAttachmentList: [],
    };

    try {
      const formData = new FormData();
      formData.append('incidentActionsSave', JSON.stringify(Payload));

      const response = await useUpdateApproveRejectAction({ formData });

      if (response && response?.data) {
        showToastAlert({
          type: 'custom_success',
          text: response.data?.Message,
          gif: SuccessGif,
        });
        setOpenPopup(false);
      }

      if (!response) {
        throw new Error('Empty response from server');
      }
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
        setMessage('Failed');
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    }
  };

  const handleActionchange = (event) => {
    setFieldValue('action', event.target.value);
  };
  const handleRemark = (event) => {
    setFieldValue('remarks', event.target.value);
  };

  const handlePrint = async (row) => {
    const send_data = {
      headerFacilityId: selectedFacility?.id,
      actionId: row?.ActionsId,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
    };

    try {
      setIsLoading(true);
      setColor('#4caf50');
      setMessage('Downloading ...');
      const blob = await triggerDownloadData({
        headerFacilityId: selectedFacility?.id,
        actionId: row?.ActionsId,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      }).unwrap();

      saveAs(blob, 'Action Completed file.pdf');
      setMessage('Download completed');
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setColor('#e63a2e');
      setMessage('Download Failed');
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const { data: attachments = [] } = useGetActionsAttachmentByIdQuery({
    loginUserId: userDetails?.UserId,
    moduleId: selectedModuleId,
    menuId: selectedMenu?.id,
    actionId: selectedIncident?.ActionsId,
  });

  const actionAttachments = Array.isArray(attachments?.Data)
    ? attachments.Data
    : [];

  const { data: rejection = [], isFetching: isrejection } =
    useGetRejectionHistoryByIdQuery({
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
      actionId: selectedIncident?.ActionsId,
    });

  const rej_history = rejection?.Data || [];

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
                            column.id === 'TargetDate' ||
                            (column.id === 'SubmittedDate' &&
                              row[column.id]) ? (
                              <div
                                style={{
                                  backgroundColor:
                                    (column.id === 'TargetDate' ||
                                      column.id === 'SubmittedDate') &&
                                    row.ColorCode
                                      ? row.ColorCode
                                      : 'transparent',
                                  color:
                                    column.id === 'TargetDate' ||
                                    column.id === 'SubmittedDate'
                                      ? '#ffffff'
                                      : 'inherit',
                                  fontWeight:
                                    column.id === 'TargetDate' ||
                                    column.id === 'SubmittedDate'
                                      ? 'bold'
                                      : 'normal',
                                  
                                  borderRadius: '4px',
                                  textAlign: 'center',
                                }}
                              >
                                {formatDate(row[column.id])}
                              </div>
                            ) : column.id === 'SecondaryDesignation' ? (
                              <div style={styles.wrapText}>
                                {row[column.id] ?? null}
                              </div>
                            ) : (
                              (row[column.id] ?? null)
                            )}

                            {column.id === 'Attachment' ? (
                              <Tooltip title="View Attachment" arrow>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => handleViewAttachment(row)}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '6px 12px',
                                    marginLeft: '10px',
                                  }}
                                >
                                  <i className="fas fa-eye"></i>
                                  <span>View</span>
                                </Button>
                              </Tooltip>
                            ) : null}
                          </StyledTableBodyCell>
                        );
                      })}
                    {checkAccess(
                      isSuperAdmin,
                      isView,
                      role?.isView || role?.IsPrint
                    ) && (
                      <ActionCell>
                        <FlexContainer className="action-icons">
                          <Tooltip title="Approve / Reject" arrow>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleOpenPopup(row)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '6px 12px',
                              }}
                            >
                              <i className="fas fa-thumbs-up"></i>
                              <span>Approve / Reject</span>
                            </Button>
                          </Tooltip>

                          <Tooltip title="Print" arrow>
                            <Button
                              style={{ marginRight: '5px' }}
                              variant="contained"
                              color="primary"
                              startIcon={<PrintIcon />}
                              onClick={() => handlePrint(row)}
                            >
                              Print
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
            Rejected Action
          </StyledTypography>
          <IconButton
            onClick={handleClosePopup}
            style={{ padding: '0.7rem' }}
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
                action: '',
                remarks: '',
              }}
            >
              {({ values, handleChange, setFieldValue }) => (
                <Form style={{ width: '100%' }}>
                  <FormLabel>
                    {getlabel('IM_A_RejectionHistory', labels, i18n.language)}
                  </FormLabel>
                  <TableContainer
                    component={Paper}
                    style={{
                      border: '1px solid #99cde6',
                      marginTop: `5px`,
                      marginBottom: `5px`,
                    }}
                  >
                    <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
                      <StyledTableHead backgroundColor="#3C8DBC">
                        <StyledTableRow>
                          <StyledTableHeaderCell color="#fff" width="40px">
                            {t('SNo')}
                          </StyledTableHeaderCell>
                          {rejectionHistory?.map((column) => (
                            <StyledTableHeaderCell
                              color="#fff"
                              key={column.name}
                            >
                              {getlabel(
                                column.translationId,
                                labels,
                                i18n.language
                              )}
                            </StyledTableHeaderCell>
                          ))}
                          <StyledTableHeaderCell>Actions</StyledTableHeaderCell>
                        </StyledTableRow>
                      </StyledTableHead>
                      <TableBody
                        style={{ marginTop: `5px`, marginBottom: `5px` }}
                      >
                        {rej_history.length > 0 ? (
                          rej_history.map((incident, index) => (
                            <StyledTableRow key={incident.IncidentId}>
                              <StyledTableBodyCell>
                                {index + 1}
                              </StyledTableBodyCell>
                              <StyledTableBodyCell>
                                {incident.RejectedReason}
                              </StyledTableBodyCell>
                              <StyledTableBodyCell>
                                {incident.RejectedName}
                              </StyledTableBodyCell>
                              <StyledTableBodyCell>
                                {incident.RejectedDate}
                              </StyledTableBodyCell>
                              <StyledTableBodyCell></StyledTableBodyCell>
                            </StyledTableRow>
                          ))
                        ) : (
                          <StyledTableRow>
                            <StyledTableBodyCell
                              colSpan={4}
                              style={{ textAlign: 'center' }}
                            >
                              {isIncidentFetching
                                ? 'Loading...'
                                : 'No data available'}
                            </StyledTableBodyCell>
                          </StyledTableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Grid container spacing={2} marginTop={'1rem'}>
                    <Grid item xs={12} sm={4}>
                      <FormLabel>Actions</FormLabel>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Dropdown
                        options={[
                          { value: 'Approved', text: 'Approved' },
                          { value: 'Rejected', text: 'Rejected' },
                        ]}
                        value={values.action || 'approve'}
                        onChange={(event) =>
                          setFieldValue('action', event.target.value)
                        }
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} marginTop={'1rem'}>
                    <Grid item xs={12} sm={4}>
                      <FormLabel>Remarks</FormLabel>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        name="remarks"
                        value={values.remarks}
                        onChange={(event) =>
                          setFieldValue('remarks', event.target.value)
                        }
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
                  </Grid>

                  <Grid
                    display={'flex'}
                    width="100%"
                    justifyContent={'center'}
                    gap={'10px'}
                    marginTop={'1rem'}
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
                      onClick={() =>
                        handleCompleteReject(values.remarks, values.action)
                      }
                    >
                      Submit
                    </ActionButton>
                    <ActionButton
                      style={{
                        backgroundColor: '#6c757d',
                        color: 'white',
                      }}
                      onClick={() => {
                        setOpenPopup(false);
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
                      Cancel
                    </ActionButton>
                  </Grid>
                </Form>
              )}
            </Formik>
          </FlexContainer>
        </DialogContent>
      </Dialog>
      <AttachmentDialog
        viewAttachment={viewAttachment}
        handleCloseViewAttachment={handleCloseViewAttachment}
        actionAttachments={actionAttachments}
        isIncidentFetching={isIncidentFetching}
        t={t}
        getlabel={getlabel}
        labels={labels}
        i18n={i18n}
      />
      ;
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
