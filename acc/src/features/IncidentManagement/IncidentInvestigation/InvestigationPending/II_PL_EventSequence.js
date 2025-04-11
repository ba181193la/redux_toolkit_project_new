import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { TextField } from '@mui/material';

import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
  ActionCell,
} from '../../../../utils/DataTable.styled';
import {
  FlexContainer,
  StyledImage,
  StyledButton,
} from '../../../../utils/StyledComponents';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import SaveIcon from '../../../../assets/Icons/SaveIcon.png';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import CalendarIcon from '../../../../assets/images/calendar.png';
import { Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import formatDate from '../../../../utils/FormatDate';
import formatTime from '../../../../utils/FormatTime';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../../../redux/features/mainMaster/incidentInvestigationSlice';
import EditIcon from '../../../../assets/Icons/EditIcon.png';

export default function EventSequence({ labels, columns, data, onDataChange }) {
  const CustomCalendarIcon = () => (
    <img
      src={CalendarIcon}
      alt="calendar-icon"
      style={{
        width: '14px',
        height: '14px',
        top: '3px',
        left: '3px',
      }}
    />
  );
  const dispatch = useDispatch();

  const parseInitialRows = (inputData) => {
    return inputData.map((item) => {
      const parsedDate = item.EventDate
        ? typeof item.EventDate === 'string'
          ? new Date(item.EventDate)
          : item.EventDate
        : null;

      const parsedTime = item.EventTime
        ? typeof item.EventTime === 'string'
          ? new Date(`1970-01-01T${item.EventTime}`)
          : item.EventTime
        : null;

      return {
        ...item,
        EventDate: parsedDate,
        EventTime: parsedTime,
        isEditable: false,
      };
    });
  };

  const [rows, setRows] = useState(parseInitialRows(data || []));
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { i18n, t } = useTranslation();

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  useEffect(() => {
    if (data && data.length > 0) {
      setRows(parseInitialRows(data));
    }
  }, [data]);

  const handleClose = () => {
    setOpen(false);
  };

  const showDataRow = () => {
    const hasEditableRow = rows.some((row) => row.isEditable);

    if (hasEditableRow) {
      setMessage('Save the previous form');
      setOpen(true);
      return;
    }

    setRows([
      ...rows,
      {
        EventDate: null,
        EventTime: null,
        Activity: '',
        isEditable: true,
      },
    ]);
  };

  const handleSave = (index) => {
    const updatedRows = [...rows];
    const row = updatedRows[index];

    if (!row.EventDate) {
      setMessage('Date is required');
      setOpen(true);
      return;
    } else if (!row.EventTime) {
      setMessage('Time is required');
      setOpen(true);
      return;
    } else if (!row.Activity) {
      setMessage('Input Value is required');
      setOpen(true);
      return;
    }

    const cleanedRows = updatedRows.map((rowItem) => {
      const cleanedEventTime =
        rowItem.EventTime instanceof Date
          ? `${rowItem.EventTime.getHours().toString().padStart(2, '0')}:${rowItem.EventTime.getMinutes().toString().padStart(2, '0')}`
          : rowItem.EventTime;

      return {
        ...rowItem,
        EventTime: cleanedEventTime,
        isEditable: false,
      };
    });

    // updatedRows[index].isEditable = true;
    setMessage('Saved Successfully!');
    setRows(updatedRows);
    setOpen(true);

    onDataChange?.(cleanedRows);
  };

  const handleEdit = (index) => {
    const editableRow = rows.find((row) => row.isEditable === true);

    if (editableRow) {
      setMessage('Please save current edits before editing another row.');
      setOpen(true);
      return;
    }

    const updatedRows = rows.map((row, i) => ({
      ...row,
      isEditable: i === index,
    }));

    setRows(updatedRows);
  };

  const handleInputChange = (value, field, index) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    setRows(updatedRows);
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteIndex(null);
  };

  const handleDelete = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
  };

  const handleDeleteConfirm = () => {
    handleDelete(deleteIndex);
    setOpenDialog(false);
    setDeleteIndex(null);
  };

  return (
    <FlexContainer flexDirection="column" width="100%">
      <TableContainer component={Paper}>
        <Snackbar
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
          message={message}
        />
        <Table>
          <StyledTableHead backgroundColor="#3C8DBC">
            <StyledTableRow>
              <StyledTableHeaderCell color="#fff">
                {t('SNo')}
              </StyledTableHeaderCell>
              {columns?.map((column) => (
                <StyledTableHeaderCell color="#fff" key={column.name}>
                  {getlabel(column.translationId, labels, i18n.language)}
                </StyledTableHeaderCell>
              ))}
              <StyledTableHeaderCell>Actions</StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>

          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <StyledTableBodyCell colSpan={5}>
                  No Data Found
                </StyledTableBodyCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={index} sx={{ borderBottom: '1px solid #ccc' }}>
                  <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
                  <StyledTableBodyCell>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <DatePicker
                        value={row.EventDate}
                        onChange={(newValue) =>
                          handleInputChange(newValue, 'EventDate', index)
                        }
                        disabled={!row.isEditable}
                        format="dd/MM/yyyy"
                        renderInput={() => null}
                      />
                    </LocalizationProvider>
                  </StyledTableBodyCell>

                  <StyledTableBodyCell>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        value={row.EventTime || null}
                        onChange={(newValue) =>
                          handleInputChange(newValue, 'EventTime', index)
                        }
                        renderInput={() => null}
                        disabled={!row.isEditable}
                        ampm={false}
                      />
                    </LocalizationProvider>
                  </StyledTableBodyCell>

                  <StyledTableBodyCell>
                    <TextField
                      id="outlined-basic"
                      value={row.Activity}
                      fullWidth={true}
                      disabled={!row.isEditable}
                      onChange={(e) =>
                        handleInputChange(e.target.value, 'Activity', index)
                      }
                      variant="outlined"
                    />
                  </StyledTableBodyCell>
                  <ActionCell>
                    <FlexContainer
                      className="action-icons"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                      }}
                    >
                      {row.isEditable ? (
                        <StyledImage
                          cursor="pointer"
                          height="14px"
                          width="14px"
                          src={SaveIcon}
                          alt="save"
                          onClick={() => handleSave(index)}
                        />
                      ) : (
                        <StyledImage
                          cursor="pointer"
                          height="14px"
                          width="14px"
                          src={EditIcon}
                          alt="EditIcon"
                          tooltip="Edit"
                          onClick={() => {
                            handleEdit(index);
                          }}
                        />
                      )}
                      <StyledImage
                        cursor="pointer"
                        height="14px"
                        width="14px"
                        src={DeleteIcon}
                        alt="Delete"
                        variant="outlined"
                        onClick={() => handleDeleteClick(index)}
                      />
                    </FlexContainer>
                  </ActionCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <FlexContainer
        style={{
          marginTop: '20px',
          justifyContent: 'flex-end',
          gap: '10px',
        }}
      >
        <StyledButton
          variant="contained"
          marginTop={'10px'}
          startIcon={
            <StyledImage
              height="14px"
              width="14px"
              src={AddSubMaster}
              alt="Add New Icon"
              style={{ marginInlineEnd: 8 }}
            />
          }
          onClick={showDataRow}
        >
          Add More
        </StyledButton>
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
            <Button
              onClick={handleCloseDialog}
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
              onClick={handleDeleteConfirm}
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
      </div>
    </FlexContainer>
  );
}
