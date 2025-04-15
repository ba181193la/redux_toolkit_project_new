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
import formatDate from '../../../../../utils/FormatDate';

const ActionTable = ({ columns, labels, data, onDataChange }) => {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [isStaffModel, setIsStaffModel] = useState(false);
  const [staffFacilityId, setStaffFacilityId] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data]);

  const handleAddRow = () => {
    const newRow = {
      type: 'new',
      SNo: tableData.length + 1,
      AddStaffButton: 'Add Staff',
      department: '',
      assigned: '',
      TargetDate: '',
      action: '',
      isEditable: true,
    };
    setTableData([...tableData, newRow]);
  };

  const handleOnRowClick = (row) => {
    setIsStaffModel(true);
    setStaffFacilityId(row.StaffFacilityId);

    const formattedRow = {
      StaffName: row.StaffName || '',
      Department: row.Department || '',
    };

    handleRowUpdate(formattedRow);
  };

  const handleRowUpdate = (updatedRow) => {

    const newRow = {
      SNo: tableData.length,
      StaffName: updatedRow.StaffName || '',
      Department: updatedRow.Department || '',
      AddStaffButton: undefined,
      assigned: '',
      date: '',
      action: '',
      type: 'update',
      isEditable: true,
    };

    const updatedRows = tableData.map((row, index) => {
      if (row.type === 'new' && index === tableData.length - 1) {
        return newRow;
      }
      return row;
    });


    setTableData(updatedRows);
    setIsStaffModel(false);
    onDataChange?.(updatedRows);
  };

  const handleDelete = (row) => {
    const updatedRows = tableData.filter((r) => r.SNo !== row.SNo);
    setTableData(updatedRows);
  };

  const handleDateChange = (newDate, index) => {
    const updatedRows = [...tableData];
    updatedRows[index].TargetDate = newDate;
    setTableData(updatedRows);
  };
  const handleSave = (r) => {
    const SNo = r.SNo;
    const updatedRows = tableData.map((row, rowIndex) => {
      if (rowIndex + 1 === SNo) {
        return { ...row, isEditable: false };
      }
      return row;
    });
    setTableData(updatedRows);
  };

  const handleInputChange = (e, rowId, field) => {
    const { value } = e.target;
    setTableData((prevData) =>
      prevData.map((row) =>
        row.SNo === rowId ? { ...row, [field]: value } : row
      )
    );
  };

  return (
    <FlexContainer flexDirection="column" width="100%">
      <TableContainer component={Paper}>
        <CustomScrollbars style={{ height: '350px' }}>
          <Table>
            <StyledTableHead backgroundColor="#3C8DBC">
              <StyledTableRow>
                <StyledTableHeaderCell color="#fff">
                  {t('SNo')}
                </StyledTableHeaderCell>
                {columns?.map((column) => (
                  <StyledTableHeaderCell color="#fff" key={column.name}>
                    <TableSortLabel
                      active={orderBy === column.name}
                      direction={orderBy === column.name ? order : 'asc'}
                      onClick={() => handleSort(column.name)}
                    >
                      {getlabel(column.translationId, labels, i18n.language)}
                    </TableSortLabel>
                  </StyledTableHeaderCell>
                ))}
                <StyledTableHeaderCell>Actions</StyledTableHeaderCell>
              </StyledTableRow>
            </StyledTableHead>
            <TableBody>
              {tableData?.length && tableData.length > 0 ? (
                tableData.map((row, index) => (
                  <StyledTableRow key={index}>
                    {row.type === 'new' ? (
                      <>
                        <StyledTableBodyCell>{row.SNo}</StyledTableBodyCell>
                        <StyledTableBodyCell>
                          <StyledButton
                            variant="contained"
                            onClick={() => setIsStaffModel(true)}
                          >
                            {row.AddStaffButton}
                          </StyledButton>
                        </StyledTableBodyCell>
                        <StyledTableBodyCell>
                          <TextField
                            fullWidth
                            value={row.department}
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
                            value={row.task_assigned}
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
                          <Date
                            value={row.TargetDate}
                            onChange={(newDate) =>
                              handleDateChange(newDate, index)
                            }
                          />
                        </StyledTableBodyCell>
                      </>
                    ) : row.type === 'update' ? (
                      <>
                        <StyledTableBodyCell>{row.SNo}</StyledTableBodyCell>
                        <StyledTableBodyCell>
                          {row.isEditable ? (
                            <TextField
                              fullWidth
                              value={row.StaffName}
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
                            row.StaffName
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
                            <TextField
                              fullWidth
                              value={row.task_assigned ?? ''}
                              onChange={(e) =>
                                handleInputChange(e, row.SNo, 'task_assigned')
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
                            row.task_assigned || row.task_assigned
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
                    ) : (
                      <>
                        <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
                        {columns.map((column) => (
                          <StyledTableBodyCell key={column.name}>
                            {['TargetDate'].includes(column.name) &&
                            row[column.name]
                              ? formatDate(row[column.name])
                              : (row[column.name] ?? '')}{' '}
                          </StyledTableBodyCell>
                        ))}
                      </>
                    )}
                    <ActionCell>
                      <FlexContainer className="action-icons">
                        <StyledImage
                          cursor="pointer"
                          height="12.5px"
                          width="12.5px"
                          src={SaveIcon}
                          alt="SaveIcon"
                          tooltip="Save"
                          onClick={() => handleSave(row)}
                        />
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
        </CustomScrollbars>
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

      {isStaffModel && (
        <FlexContainer style={{ marginTop: '20px' }}>
          <StyledButton variant="contained" onClick={handleRowUpdate}>
            Update Row
          </StyledButton>
        </FlexContainer>
      )}
    </FlexContainer>
  );
};

export default ActionTable;
