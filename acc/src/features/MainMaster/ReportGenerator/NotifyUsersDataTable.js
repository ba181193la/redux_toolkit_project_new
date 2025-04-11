// import React, { useEffect, useState } from 'react';
// import {
//   Table,
//   TableBody,
//   TableContainer,
//   TableRow,
//   Paper,
//   Checkbox,
// } from '@mui/material';
// import {
//   StyledTableBodyCell,
//   StyledTableHeaderCell,
//   StyledTableRow,
//   StyledTableHead,
// } from '../../../utils/DataTable.styled';
// import { FlexContainer } from '../../../utils/StyledComponents';
// import CustomPagination from '../../../components/Pagination/CustomPagination';
// import Scrollbars from 'react-custom-scrollbars-2';
// import { useTranslation } from 'react-i18next';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   setPageSize,
//   setPageIndex,
// } from '../../../redux/features/mainMaster/ReportGeneratorSlice';
// import { getlabel } from '../../../utils/language';

// const NotifyUsersDataTable = ({
//   columns = [],
//   records,
//   totalRecords,
//   SelectedReportId,
//   totalPages,
//   labels,
//   isEditModal,
//   setSelectedUsers,
//   selectedUsers,
//   ReportData,
//   selectedUserIds,
//   setSelectedUserIds,
// }) => {
//   const { i18n } = useTranslation();
//   const dispatch = useDispatch();

//   const { pageSize, pageIndex } = useSelector((state) => state.reportGenerator);

//   const [selectedRows, setSelectedRows] = useState([]);

//   const handleCheckboxChange = (row) => {

//     const isAlreadySelected = selectedUserIds.includes(row.UserId);

//     if (isAlreadySelected) {
//       alert("if")
//       setSelectedUserIds((prevSelectedUserIds) =>
//         prevSelectedUserIds.filter((userId) => userId !== row.UserId)
//       );
//       setSelectedUsers((prevSelectedUsers) =>
//         prevSelectedUsers.filter((user) => user.UserId !== row.UserId)
//       );
//     } else {
//       alert("else")
//       setSelectedUserIds((prevSelectedUserIds) => [
//         ...prevSelectedUserIds,
//         row.UserId,
//       ]);
//       setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, row]);
//     }
//   };

//   // useEffect(() => {
//   //   if (SelectedReportId) {
//   //     const selectedRows = records
//   //       .map((row, index) =>
//   //         selectedUsers.some((user) => user.EmployeeId === row.EmployeeId)
//   //           ? index
//   //           : null
//   //       )
//   //       .filter((index) => index !== null);
  
//   //     const selectedUserIds = selectedUsers.map((user) => user.EmployeeId);
  
//   //     setSelectedRows(selectedRows);
//   //     setSelectedUserIds(selectedUserIds);
//   //   } else {
//   //     setSelectedRows([]);
//   //   }
//   // }, [selectedUsers, records, SelectedReportId]);

//   // useEffect(() => {
//   //   if (isEditModal && ReportData?.Data?.length > 0) {
//   //     const notifyUserNames = ReportData.Data[0].NotifyUsersNames?.split(',') || [];
      
//   //     // Find matching user IDs from records
//   //     const selectedUsersData = records.filter((row) => notifyUserNames.includes(row.StaffName));
  
//   //     const selectedIds = selectedUsersData.map((user) => user.UserId);
      
//   //     setSelectedUserIds(selectedIds);
//   //     setSelectedUsers(selectedUsersData);
      
//   //   }
//   // }, [isEditModal, ReportData, records]);
//   useEffect(() => {
//     if (isEditModal && ReportData?.Data?.length > 0 && records.length > 0) {
//       const notifyUserNames = ReportData.Data[0].NotifyUsersNames?.split(',') || [];
  
//       // Find matching users in `records` by StaffName
//       const selectedUsersData = records.filter((row) => 
//         notifyUserNames.includes(row.StaffName)
//       );
  
//       // Extract their UserIds
//       const selectedIds = selectedUsersData.map((user) => user.UserId);
  
//       setSelectedUserIds(selectedIds);
//       setSelectedUsers(selectedUsersData);
//     }
//   }, [isEditModal, ReportData, records]);
  
  
  
//   // useEffect(() => {

//   //   if (selectedReportId) { // Only execute when in edit mode
//   //     setSelectedRows([]); // Clear selection when not in edit mode
//   //   }
//   // }, [selectedReportId]);

//   const handleSelectAll = (event) => {
//     if (event.target.checked) {
//       // Select all rows
//       const allUserIds = records.map((row) => row.UserId);
//       setSelectedUserIds(allUserIds);
//       setSelectedUsers(records);
//       setSelectedRows(records.map((_, index) => index));
//     } else {
//       // Deselect all rows
//       setSelectedUserIds([]);
//       setSelectedUsers([]);
//       setSelectedRows([]);
//     }
//   };

//   const handleOnPageChange = (event, newPage) => {
//     dispatch(setPageIndex(newPage));
//   };

//   const handleOnPageSizeChange = (event) => {
//     dispatch(setPageSize(parseInt(event.target.value, 10)));
//     dispatch(setPageIndex(0));
//   };

//   return (
//     <FlexContainer flexDirection="column">
//       <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
//         <Scrollbars style={{ height: '350px' }}>
//           <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
//             <StyledTableHead>
//               <TableRow>
//                 <StyledTableHeaderCell>
//                   <Checkbox
//                     checked={
//                       selectedRows.length === records.length &&
//                       records.length > 0
//                     }
//                     onChange={handleSelectAll}
//                     sx={{
//                       color: 'white',
//                       '&.Mui-checked': {
//                         color: 'white',
//                       },
//                     }}
//                   />
//                 </StyledTableHeaderCell>
//                 {columns.map((column) => (
//                   <StyledTableHeaderCell key={column.id}>
//                     {getlabel(column.translationId, labels, i18n.language)}
//                   </StyledTableHeaderCell>
//                 ))}
//               </TableRow>
//             </StyledTableHead>
//             <TableBody>
//               {records.length > 0 ? (
//                 records.map((row, rowIndex) => (
//                   <StyledTableRow key={rowIndex}>
//                     <StyledTableBodyCell>
//                       <Checkbox
//                         checked={selectedUserIds.includes(row.UserId)}
//                         onChange={() => handleCheckboxChange(row)}
//                       />
//                     </StyledTableBodyCell>
//                     <StyledTableBodyCell>{row.EmployeeId}</StyledTableBodyCell>
//                     <StyledTableBodyCell>{row.StaffName}</StyledTableBodyCell>
//                     <StyledTableBodyCell>{row.Department}</StyledTableBodyCell>
//                     <StyledTableBodyCell>
//                       {row.PrimaryDesignation}
//                     </StyledTableBodyCell>
//                   </StyledTableRow>
//                 ))
//               ) : (
//                 <FlexContainer
//                   position="absolute"
//                   style={{ top: '50%', left: '50%' }}
//                 >
//                   No data available
//                 </FlexContainer>
//               )}
//             </TableBody>
//           </Table>
//         </Scrollbars>
//       </TableContainer>
//       {totalRecords && (
//         <CustomPagination
//           totalRecords={totalRecords}
//           totalPages={totalPages}
//           page={pageIndex}
//           pageSize={pageSize}
//           handleOnPageChange={handleOnPageChange}
//           handleOnPageSizeChange={handleOnPageSizeChange}
//         />
//       )}
//     </FlexContainer>
//   );
// };

// export default NotifyUsersDataTable;
