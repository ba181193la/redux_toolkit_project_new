import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import { FlexContainer } from '../../../../../utils/StyledComponents';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
} from '../../../../../utils/DataTable.styled';
import { useGetStaffDetailListQuery } from '../../../../../redux/RTK/loginApi';
import { useFormikContext } from 'formik';
import { useSelector } from 'react-redux';

// const columns = [
//   { id: 'S.No', label: 'Sr. No.' },
//   { id: 'Employee ID', label: 'Employee ID' },
//   { id: 'Staff Name', label: 'Staff Name' },
//   { id: 'Department/Unit', label: 'Department/Unit' },
//   { id: 'Designation', label: 'Designation' },
// ];

const BriefIncident_StaffDetailTable = ({
  selectedFacility,
  selectedIndex,
  handleOnCancel,
  handleSelectRow,
  setSelectedIndex,
  data = [],
  columns,
}) => {
  const { values, setFieldValue } = useFormikContext();

  // const { data } = useGetStaffDetailListQuery(
  //   { facilityId: selectedFacility },
  //   { skip: !selectedFacility }
  // );

  // const handleonClick = (row) => {

  //   const updatedArray = values?.incidentActionTaken?.map((item, i) => {

  //     return i === selectedIndex
  //       ? {
  //           ...item,
  //           responsibleStaffName: row.UserName,
  //           responsibleStaffId: row.UserId,
  //           department: row.department,
  //           designation: row.designation,
  //         }
  //       : item;
  //   });

  //   setFieldValue('incidentActionTaken', updatedArray);

  //   handleOnCancel();
  // };

  const handleonClick = (row) => {
    handleSelectRow(row)
    handleOnCancel();
  };




  const { pageSize, pageIndex } = useSelector(
    (state) => state?.userStaff?.filters
  );

  return (
    <FlexContainer flexDirection="column">
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
        <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
          {/* <StyledTableHead>
            <TableRow>
              {column?.map((column) => (
                <StyledTableHeaderCell key={column.id}>
                  {column.label}
                </StyledTableHeaderCell>
              ))}
            </TableRow>
          </StyledTableHead> */}
          <StyledTableHead>
            <TableRow>
              <StyledTableHeaderCell>SNo'</StyledTableHeaderCell>
              {columns.map((column) => {
                return (
                  <StyledTableHeaderCell key={column.id}>
                    {column.id}
                  </StyledTableHeaderCell>
                );
              })}
            </TableRow>
          </StyledTableHead>
          {/* <TableBody>
            {data?.Data?.StaffList?.length > 0 ? (
              data?.Data?.StaffList?.map((row, index) => (
                <StyledTableRow key={index} onClick={() => handleonClick(row)}>
                  <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
                  <StyledTableBodyCell>{row.EmployeeID}</StyledTableBodyCell>
                  <StyledTableBodyCell>{row.UserName}</StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {row.DepartmentName}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {row.DesignationName}
                  </StyledTableBodyCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableBodyCell
                  colSpan={columns.length + 1}
                  align="center"
                >
                  No data available
                </StyledTableBodyCell>
              </StyledTableRow>
            )}
          </TableBody> */}
          <TableBody>
            {data?.length > 0 ? (
              data?.map((row, rowIndex) => (
                <StyledTableRow
                  key={rowIndex}
                  onClick={() => handleonClick(row)}
                  style={{ cursor: 'pointer' }}
                >
                  <StyledTableBodyCell>
                    {pageIndex * pageSize + rowIndex + 1}
                  </StyledTableBodyCell>
                  {columns?.map((column) => (
                    <StyledTableBodyCell key={column.id}>
                      {column.id === 'ModifiedDate' && row[column.id]
                        ? formatDate(row[column.id])
                        : (row[column.id] ?? null)}
                    </StyledTableBodyCell>
                  ))}
                </StyledTableRow>
              ))
            ) : (
              <TableRow>
                <StyledTableBodyCell
                  colSpan={columns?.length + 2}
                  align="center"
                >
                  NoDataAvailable
                </StyledTableBodyCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </FlexContainer>
  );
};

export default BriefIncident_StaffDetailTable;
