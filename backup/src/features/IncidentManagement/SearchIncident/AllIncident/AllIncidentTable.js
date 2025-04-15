import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  Tooltip,
  Collapse,
  TableSortLabel,
  TextField,
} from '@mui/material';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
  ActionButton,
} from '../../../../utils/DataTable.styled';
import { FlexContainer, StyledImage } from '../../../../utils/StyledComponents';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../../../redux/features/mainMaster/searchIncidentSlice';
import { useDeleteStaffMutation } from '../../../../redux/RTK/staffMasterApi';
import formatDate from '../../../../utils/FormatDate';
import { Link } from 'react-router-dom';
import { checkAccess } from '../../../../utils/Auth';
import { showSweetAlert, showToastAlert } from '../../../../utils/SweetAlert';
import DeleteUserGif from '../../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import LikeIcon from '../../../../assets/Icons/LikeIcon.png';
import DislikeIcon from '../../../../assets/Icons/DislikeIcon.png';
import { useNavigate } from 'react-router-dom';
import ViewOnlyIcon from '../../../../assets/Icons/ViewOnlyIcon.png';
import EmailIcon from '../../../../assets/Icons/Email.png';
import { useSendReminderMailMutation } from '../../../../redux/RTK/IncidentManagement/searchIncidentApi';
import Error from '../../../../assets/Gifs/error.gif';
import CheckIcon from '@mui/icons-material/Check';

const styles = {
  wrapText: {
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
  },
};

const AllIncidentTable = ({
  columns = [],
  records,
  totalRecords,
  labels,
  isView = false,
  detailsView,
}) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [incidentId, setIncidentId] = useState(0);
  const { pageSize, pageIndex } = useSelector(
    (state) => state.searchIncident.filters
  );

  const {
    userDetails,
    selectedMenu,
    roleFacilities,
    isSuperAdmin,
    selectedFacility,
    selectedModuleId,
  } = useSelector((state) => state.auth);

  const filters = useSelector((state) => state.searchIncident.filters || []);

  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();

  const handleOnPageChange = (event, newPage) => {
    dispatch(
      setFilters({
        ...filters,
        pageIndex: newPage,
      })
    );
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
        // console.log({ error });
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

  const handleClick = (incidentId) => {
    window.open(
      `/IncidentManagement/SearchIncidentEntry_All/${incidentId}`,
      '_blank'
    );
  };

  const [triggerSendReminderMail] = useSendReminderMailMutation();

  const handleSubmit = async () => {
    if (!remarks) {
      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: 'Remarks is Mandatory',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      // setIsModalOpen(false)

      return;
    }

    const payload = {
      headerFacilityId: selectedFacility?.id,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
      remarks: remarks,
      incidentId: incidentId,
      incidentStatus: '',
      responsibleStaff: '',
    };

    try {
      const response = await triggerSendReminderMail(payload).unwrap();
      setIsModalOpen(false);

      showToastAlert({
        type: 'custom_success',
        text: response?.Message,
        gif: SuccessGif,
      });

      if (response && response.Data) {
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
    <FlexContainer flexDirection="column">
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
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
                      direction={orderBy === column.id ? order : 'asc'}
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
                            {column.id === 'IncidentDate' ||
                            column.id === 'RequestReceivedDate' ||
                            column.id === 'ClosedDate' ||
                            (column.id === 'ReportedDate' && row[column.id]) ? (
                              formatDate(row[column.id])
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
                      role?.IsEdit || role?.IsDelete
                    ) &&
                      detailsView.isView && (
                        <StyledTableBodyCell>
                          <FlexContainer
                            style={{ gap: '10px' }}
                            className="action-icons"
                          >
                            <StyledImage
                              cursor="pointer"
                              height="15px"
                              width="20px"
                              src={ViewOnlyIcon}
                              onClick={() => handleClick(row.IncidentId)}
                              alt="View"
                            />
                            <i
                              className="fa fa-envelope"
                              style={{
                                cursor: 'pointer',
                                fontSize: '15px',
                                color: '#0083c0',
                              }}
                              onClick={() => {
                                setIsModalOpen(true);
                                setIncidentId(row.IncidentId);
                              }}
                              title="Mail"
                            />
                          </FlexContainer>
                        </StyledTableBodyCell>
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
                  Send Reminder
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
                  <i className="fas fa-times" style={{ fontSize: '16px' }}></i>
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
                    Reminder Remarks:
                  </label>
                  <TextField
                    multiline
                    fullWidth
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
                      setRemarks(e.target.value);
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
                    {t('Submit')}
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
                    {t('Cancel')}
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Collapse>

      {totalRecords > 0 && (
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

export default AllIncidentTable;
