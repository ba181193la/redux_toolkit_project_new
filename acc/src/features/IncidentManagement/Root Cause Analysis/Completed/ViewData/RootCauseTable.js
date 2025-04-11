import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableSortLabel,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tooltip,
  TextField,
} from '@mui/material';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
  ActionCell,
} from '../../../../../utils/DataTable.styled';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../../utils/StyledComponents';
import { getlabel } from '../../../../../utils/language';
import { useTranslation } from 'react-i18next';
import CustomScrollbars from '../../../../../components/CustomScrollbars/CustomScrollbars';
import AddSubMaster from '../../../../../assets/Icons/AddSubMaster.png';
import Date from '../../../../../components/Date/Date';
import AddStaffModel from '../AddStaffModel';
import { useDispatch, useSelector } from 'react-redux';
import SaveIcon from '../../../../../assets/Icons/SaveIcon.png';
import DeleteIcon from '../../../../../assets/Icons/DeleteIcon.png';
import EditIcon from '../../../../../assets/Icons/EditIcon.png';
import formatDate from '../../../../../utils/FormatDate';
import { Snackbar } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { setRootTableData } from '../../../../../redux/features/mainMaster/incidentRcaSlice.js';

const RootCauseTable = ({ columns, labels, data, onDataChange }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const { i18n, t } = useTranslation();
  const [isStaffModel, setIsStaffModel] = useState(false);
  const [staffFacilityId, setStaffFacilityId] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [editableRowId, setEditableRowId] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const [openDialog, setOpenDialog] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const dispatch = useDispatch();


  const rootTableData = useSelector((state) => state.incidentRca.rootTableData);

  useEffect(() => {
    if (rootTableData && rootTableData.length > 0) {
      setTableData(rootTableData);
    }
  }, [rootTableData]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddRow = () => {
    const hasEditableRow = tableData.some((row) => row.isEditable);

    if (hasEditableRow) {
      setMessage('Save the previous form');
      setOpen(true);
      return;
    }
    const newRow = {
      type: 'new',
      RowNo: tableData.length + 1,
      RootCauseFinding: '',
      RootCauseReference: '',
      assigned: '',
      department: '',
      TargetDate: '',
      action: '',
      isEditable: true,
    };

    setTableData((prevData) =>
      prevData.map((row) => ({ ...row, isEditable: false })).concat(newRow)
    );
    setMessage('New Row is Added');
    setOpen(true);
  };

  const handleOnRowClick = (row) => {
    setIsStaffModel(true);
    setStaffFacilityId(row.StaffFacilityId);
    const formattedRow = {
      UserName: row.StaffName || '',
      Department: row.Department || '',
      UserId: row.UserId || '',
    };

    handleRowUpdate(formattedRow);
  };

  const handleRowUpdate = (updatedRow) => {
    const newRow = {
      UserName: updatedRow.UserName || '',
      Department: updatedRow.Department || '',
      UserId: updatedRow.UserId || '',
      isEditable: true,
    };

    const updatedRows = tableData.map((row, index) => {
      if (row.isEditable) {
        return {
          AssignedTask: row.AssignedTask || null,
          RootCauseFinding: row.RootCauseFinding || '',
          RootCauseReference: row.RootCauseReference || '',
          Department: newRow.Department || '',
          IsDelete: 0,
          UserName: newRow.UserName || '',
          UserId: newRow.UserId,
          RowNo: row.RowNo,
          TargetDate: row.TargetDate || '',
          isEditable: true,
        };
      }
      return row;
    });

    setTableData(updatedRows);
    setIsStaffModel(false);
  };
  const handleSave = (r) => {
    if (r.AssignedTask && r.TargetDate && r.UserName) {
      const RowNo = r.RowNo;

      const updatedRows = tableData.map((row, rowIndex) => {
        if (rowIndex + 1 === RowNo) {
          return {
            ...row,
            AssignedTask: row.AssignedTask || null,
            RootCauseFinding: row.RootCauseFinding || '',
            RootCauseReference: row.RootCauseReference || '',
            Department: row.Department || '',
            IsDelete: 0,
            UserName: row.UserName || '',
            UserId: row.UserId,
            RowNo: row.RowNo,
            TargetDate: row.TargetDate || '',
            isEditable:   false,
            IncidentInvestigationId: row.IncidentInvestigationId
          };
        }

        return row;
      });

      setTableData(updatedRows);

    dispatch(setRootTableData(updatedRows));

    } else {
      setMessage('Fill all the fields');
      setOpen(true);
      return;
    }

    setEditableRowId(null);
  };

  const handleDelete = (row) => {
    const updatedRows = tableData
      .filter((r) => r.RowNo !== row.RowNo)
      .map((r, index) => ({
        ...r,
        RowNo: index + 1,
      }));

    dispatch(setRootTableData(updatedRows)); 
      

    setTableData(updatedRows);
    setMessage('Deleted Successfully');
    setOpen(true);
  };

  const handleDeleteConfirm = () => {
    handleDelete(deleteIndex);
    setOpenDialog(false);
    setDeleteIndex(null);
  };
  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteIndex(null);
  };

  const handleDateChange = (newDate, index) => {
    const updatedRows = [...tableData];
    updatedRows[index].TargetDate = newDate;
    setTableData(updatedRows);
  };

  const handleInputChange = (e, rowId, field) => {
    const { value } = e.target;
    setTableData((prevData) =>
      prevData.map((row) =>
        row.RowNo === rowId ? { ...row, [field]: value } : row
      )
    );
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
            {tableData?.length && tableData.length > 0 ? (
              tableData.map((row, index) => (
                <StyledTableRow key={index}>
                  {
                    <>
                      <StyledTableBodyCell>{row.RowNo}</StyledTableBodyCell>
                      <StyledTableBodyCell>
                        {row.isEditable ? (
                          <TextField
                            fullWidth
                            value={row.RootCauseFinding ?? ''}
                            onChange={(e) =>
                              handleInputChange(e, row.RowNo, 'RootCauseFinding')
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
                        ) : (
                          row.RootCauseFinding
                        )}
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                        {row.isEditable ? (
                          <TextField
                            fullWidth
                            value={row.RootCauseReference ?? ''}
                            onChange={(e) =>
                              handleInputChange(e, row.RowNo, 'RootCauseReference')
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
                        ) : (
                          row.RootCauseReference
                        )}
                      </StyledTableBodyCell>
                     
                      <StyledTableBodyCell>
                        {row.isEditable ? (
                          <TextField
                            fullWidth
                            value={row.AssignedTask ?? ''}
                            onChange={(e) =>
                              handleInputChange(e, row.RowNo, 'AssignedTask')
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
                        ) : (
                          row.AssignedTask || row.AssignedTask
                        )}
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                        {row.isEditable ? (
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
                              value={row.UserName}
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
                                onClick={() => setIsStaffModel(true)}
                                style={{
                                  cursor: 'pointer',
                                  fontSize: '15px',
                                  color: '#555',
                                  backgroundColor: '#eee',
                                }}
                              ></i>
                            </div>
                          </div>
                        ) : (
                          row.UserName
                        )}
                      </StyledTableBodyCell>

                      <StyledTableBodyCell>
                        {row.isEditable ? (
                          <TextField
                            fullWidth
                            value={row.Department}
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
                        ) : (
                          row.Department
                        )}
                      </StyledTableBodyCell>
                     

                      <StyledTableBodyCell>
                        {row.isEditable ? (
                          <Date
                            value={row.TargetDate}
                            onChange={(newDate) =>
                              handleDateChange(newDate, index)
                            }
                          />
                        ) : (
                          formatDate(row.TargetDate)
                        )}
                      </StyledTableBodyCell>
                    </>
                  }
                  <ActionCell>
                    <FlexContainer className="action-icons">
                      {row.isEditable ? (
                        <StyledImage
                          cursor="pointer"
                          height="12.5px"
                          width="12.5px"
                          src={SaveIcon}
                          alt="SaveIcon"
                          tooltip="Save"
                          onClick={() => handleSave(row)}
                        />
                      ) : (
                        <StyledImage
                          cursor="pointer"
                          height="12.5px"
                          width="12.5px"
                          src={EditIcon}
                          alt="EditIcon"
                          tooltip="Edit"
                          onClick={() => {
                            const editableRow = tableData.find(
                              (r) => r.isEditable === true
                            );

                            if (editableRow) {
                              setMessage(
                                `Please save values in RowNo ${editableRow.RowNo} before editing another row.`
                              );
                              setOpen(true);
                            } else {
                              const updatedTableData = tableData.map((r) =>
                                r.RowNo === row.RowNo
                                  ? { ...r, isEditable: true }
                                  : { ...r, isEditable: false }
                              );

                              setTableData(updatedTableData);
                              onDataChange?.(updatedTableData);
                            }
                          }}
                        />
                      )}
                      <Tooltip title="Delete" arrow>
                        <StyledImage
                          cursor="pointer"
                          height="12.5px"
                          width="12.5px"
                          src={DeleteIcon}
                          alt="Delete"
                          onClick={() => handleDeleteClick(row)}
                        />
                      </Tooltip>
                    </FlexContainer>
                  </ActionCell> 
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableBodyCell colSpan={columns?.length + 1}>
                  {t('NoDataAvailable')}
                </StyledTableBodyCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <FlexContainer
        style={{ marginTop: '20px', justifyContent: 'flex-end', gap: '10px' }}
      >
        <StyledButton
          variant="contained"
          onClick={handleAddRow}
          startIcon={
            <StyledImage
              height="14px"
              width="14px"
              src={AddSubMaster}
              alt="Add New Icon"
              style={{ marginInlineEnd: 8 }}
            />
          }
        >
          {t('Add More')}
        </StyledButton>
      </FlexContainer>

      {isStaffModel && (
        <AddStaffModel
          open={isStaffModel}
          onClose={() => setIsStaffModel(false)}
          setIsStaffModel={setIsStaffModel}
          setStaffFacilityId={setStaffFacilityId}
          onSelectRow={handleOnRowClick}
        />
      )}

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
};

export default RootCauseTable;
