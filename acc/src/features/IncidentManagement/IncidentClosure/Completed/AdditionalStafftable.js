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
} from '../../../../utils/DataTable.styled';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { getlabel } from '../../../../utils/language';
import { useTranslation } from 'react-i18next';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';
import Date from '../../../../components/Date/Date';
import AddStaffModel from './AddStaffModel';
import { useDispatch, useSelector } from 'react-redux';
import SaveIcon from '../../../../assets/Icons/SaveIcon.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import formatDate from '../../../../utils/FormatDate';
import { Snackbar } from '@mui/material';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import { height } from '@mui/system';

const AdditionalStafftable = ({ columns, labels, onDataChange }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const [isStaffModel, setIsStaffModel] = useState(false);
  const [staffFacilityId, setStaffFacilityId] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [tableData, setTableData] = useState([
    {
      RowNo: 1,
      ResponsibleStaff: '',
      DepartmentName: '',
      Designation: '',
      isEditable: true,
    },
  ]);
  const [editableRowId, setEditableRowId] = useState(null);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddRow = () => {
    const hasEditableRow = tableData.some((row) => row.isEditable);

    if (hasEditableRow) {
      setMessage('Save the previous form');
      return;
    }
    const newRow = {
      RowNo: tableData.length + 1,
      ResponsibleStaff: '',
      DepartmentName: '',
      Designation: '',
      isEditable: true,
    };

    setTableData((prevData) =>
      prevData.map((row) => ({ ...row, isEditable: false })).concat(newRow)
    );
  };

  const handleOnRowClick = (row) => {
    console.log('Full row data:', row);
    setIsStaffModel(true);
    setStaffFacilityId(row.StaffFacilityId);
    const formattedRow = {
      ResponsibleStaff: row.StaffName || '',
      DepartmentName: row.Department || '',
      Designation: row.PrimaryDesignation || '',
    };

    handleRowUpdate(formattedRow);
  };

  const handleRowUpdate = (updatedRow) => {
    console.log('formattedRow', updatedRow);

    const newRow = {
      ResponsibleStaff: updatedRow.ResponsibleStaff || '',
      DepartmentName: updatedRow.DepartmentName || '',
      ResponsibleStaffId: updatedRow.ResponsibleStaffId || '',
      Designation: updatedRow.Designation || '',
      isEditable: true,
    };

    const updatedRows = tableData.map((row, index) => {
      if (row.isEditable) {
        return {
          DepartmentName: newRow.DepartmentName || '',
          ResponsibleStaff: newRow.ResponsibleStaff || '',
          Designation: newRow.Designation || '',
          RowNo: row.RowNo,
          isEditable: true,
        };
      }
      return row;
    });


    setTableData(updatedRows);
    setIsStaffModel(false);
  };
  const handleSave = (r) => {
    if (r.Designation && r.DepartmentName) {
      const RowNo = r.RowNo;

      const updatedRows = tableData.map((row, rowIndex) => {
        if (rowIndex + 1 === RowNo) {
          return {
            ...row,
            DepartmentName: row.DepartmentName || '',
            Designation: row.Designation || '',
            ResponsibleStaff: row.ResponsibleStaff || '',
            RowNo: row.RowNo,
            isEditable: false,
          };
        }

        return row;
      });

      setTableData(updatedRows);
      console.log('upted rows:', updatedRows);
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
              <StyledTableHeaderCell color="#fff" width="40px">
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
                            value={row.ResponsibleStaff}
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
                                if (row.isEditable) {
                                  setIsStaffModel(true);
                                }
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
                      </StyledTableBodyCell>

                      <StyledTableBodyCell>
                        <TextField
                          fullWidth
                          value={row.DepartmentName}
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
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                        <TextField
                          fullWidth
                          value={row.Designation ?? ''}
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
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                      <Dropdown
                        options={[{ value: 1, text: 'High' }]} // Static data 
                      />
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
                            const updatedTableData = tableData.map((r) =>
                              r.RowNo === row.RowNo
                                ? { ...r, isEditable: true }
                                : { ...r, isEditable: false }
                            );

                            setTableData(updatedTableData);
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
                          onClick={() => handleDelete(row)}
                        />
                      </Tooltip>
                    </FlexContainer>
                  </ActionCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableBodyCell colSpan={columns.length + 1}>
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

  
    </FlexContainer>
  );
};

export default AdditionalStafftable;
