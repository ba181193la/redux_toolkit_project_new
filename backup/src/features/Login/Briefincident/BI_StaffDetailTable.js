import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import { FlexContainer, StyledImage } from '../../../utils/StyledComponents';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
} from '../../../utils/DataTable.styled';
import { useGetStaffDetailListQuery } from '../../../redux/RTK/loginApi';
import { useFormikContext } from 'formik';
import { useSelector } from 'react-redux';
import CustomPagination from '../../../components/Pagination/CustomPagination';
import { useDispatch } from 'react-redux';
import { setFilters } from '../../../redux/features/mainMaster/userStaffSlice';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';

const columns = [
  { id: 'S.No', label: 'Sr. No.' },
  { id: 'Facility', label: 'Facility' },
  { id: 'Employee ID', label: 'Employee ID' },
  { id: 'Staff Name', label: 'Staff Name' },
  { id: 'Department', label: 'Department' },
  { id: 'Designation', label: 'Designation' },
];

const BriefIncident_StaffDetailTable = ({
  facilityColumn,
  selectedFacility,
  selectedIndex,
  handleOnCancel,
}) => {
  const { values, setFieldValue } = useFormikContext();
  const dispatch = useDispatch();
  const { pageSize, pageIndex } = useSelector(
    (state) => state?.userStaff?.filters
  );

  const filters = useSelector((state) => state.userStaff.filters);
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

  const { data, isLoading } = useGetStaffDetailListQuery(
    { facilityId: selectedFacility },
    { skip: !selectedFacility }
  );

  const handleonClick = (row) => {
    const updatedArray = values?.incidentActionTaken?.map((item, i) =>
      i === selectedIndex
        ? {
            ...item,
            facility: facilityColumn,
            responsibleStaffName: row.UserName,
            responsibleStaffId: row.UserId,
            department: row.DepartmentName,
            designation: row.DesignationName,
          }
        : item
    );
    setFieldValue('incidentActionTaken', updatedArray);
    handleOnCancel();
  };

  return (
//     <FlexContainer flexDirection="column">
//       <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
//         <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
//           <StyledTableHead>
//             <TableRow>
//               {columns?.map((column) => (
//                 <StyledTableHeaderCell key={column.id}>
//                   {column.label}
//                 </StyledTableHeaderCell>
//               ))}
//             </TableRow>
//           </StyledTableHead>
//           <TableBody>
//             {data?.Data?.StaffList?.length > 0 ? (
//               data?.Data?.StaffList?.map((row, index) => (
//                 <StyledTableRow key={index} onClick={() => handleonClick(row)}>
//                   <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
//                   <StyledTableBodyCell>{row.EmployeeID}</StyledTableBodyCell>
//                   <StyledTableBodyCell>{row.UserName}</StyledTableBodyCell>
//                   <StyledTableBodyCell>
//                     {row.DepartmentName}
//                   </StyledTableBodyCell>
//                   <StyledTableBodyCell>
//                     {row.DesignationName}
//                   </StyledTableBodyCell>
//                 </StyledTableRow>
//               ))
//             ) : (
//               <StyledTableRow>
//                 <StyledTableBodyCell
//                   colSpan={columns.length + 1}
//                   align="center"
//                 >
//                   No data available
//                 </StyledTableBodyCell>
//               </StyledTableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       {/* {data>0 && (
//         <CustomPagination
//           totalRecords={data}
//           page={pageIndex}
//           pageSize={pageSize}
//           handleOnPageChange={handleOnPageChange}
//           handleOnPageSizeChange={handleOnPageSizeChange}
//         />
//       )} */}
//       {data?.Data?.StaffList?.length > 0 && (
//   <CustomPagination
//     // totalRecords={data?.Data?.TotalRecords} // Ensure you have the correct total count field
//     page={pageIndex}
//     pageSize={pageSize}
//     handleOnPageChange={handleOnPageChange}
//     handleOnPageSizeChange={handleOnPageSizeChange}
//   />
// )}
//     </FlexContainer>
<FlexContainer flexDirection="column">
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
        <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
          <StyledTableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableHeaderCell key={column.id}>
                  {column.label}
                </StyledTableHeaderCell>
              ))}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {/* Show loading spinner if data is still loading */}
            {isLoading ? (
              <StyledTableRow>
                <StyledTableBodyCell colSpan={columns.length + 1} align="center">
                  <FlexContainer justifyContent="center">
                        <StyledImage src={LoadingGif} alt="LoadingGif" />
                      </FlexContainer>
                </StyledTableBodyCell>
              </StyledTableRow>
            ) : data?.Data?.StaffList?.length > 0 ? (
              data?.Data?.StaffList?.map((row, index) => (
                <StyledTableRow key={index} onClick={() => handleonClick(row)}>
                  <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
                  <StyledTableBodyCell>{facilityColumn}</StyledTableBodyCell>
                  <StyledTableBodyCell>{row.EmployeeID}</StyledTableBodyCell>
                  <StyledTableBodyCell>{row.UserName}</StyledTableBodyCell>
                  <StyledTableBodyCell>{row.DepartmentName}</StyledTableBodyCell>
                  <StyledTableBodyCell>{row.DesignationName}</StyledTableBodyCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableBodyCell colSpan={columns.length + 1} align="center">
                  No data available
                </StyledTableBodyCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination - Only show if data exists */}
      {data?.Data?.StaffList?.length > 0 && (
        <CustomPagination
          totalRecords={data?.Data?.StaffList?.length}
          page={pageIndex}
          pageSize={pageSize}
          handleOnPageChange={handleOnPageChange}
          handleOnPageSizeChange={handleOnPageSizeChange}
        />
      )}
    </FlexContainer>
  );
};

export default BriefIncident_StaffDetailTable;
