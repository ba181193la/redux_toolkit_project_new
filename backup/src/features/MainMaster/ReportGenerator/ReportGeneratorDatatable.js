import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  Tooltip,
  TableSortLabel,
} from '@mui/material';
import EditIcon from '../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../assets/Icons/DeleteIcon.png';
import ViewIcon from '../../../assets/Icons/EyeIcon.png';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
} from '../../../utils/DataTable.styled';
import { FlexContainer, StyledImage } from '../../../utils/StyledComponents';
import CustomPagination from '../../../components/Pagination/CustomPagination';
import Scrollbars from 'react-custom-scrollbars-2';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import {
  setPageSize,
  setPageIndex,
} from '../../../redux/features/mainMaster/ReportGeneratorSlice';
import { useDeleteReportMutation } from '../../../redux/RTK/reportGeneratorApi';
import formatDate from '../../../utils/FormatDate';
import DeleteUserGif from '../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../assets/Gifs/SuccessGif.gif';
import { showSweetAlert } from '../../../utils/SweetAlert';
const ReportGeneratorDataTable = ({
  columns = [],
  records,
  totalRecords,
  totalPages,
  isEdit,
  isDelete,
  isView,
  labels,
  setIsEditModal,
  setIsViewModal,
  setIsViewOnly,
  setIsEditOnly,
  setSelectedReportId,
}) => {
  const { i18n } = useTranslation();
  const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('');
  const dispatch = useDispatch();

  const [deleteReport] = useDeleteReportMutation();

  // const { pageSize, pageIndex } = useSelector((state) => state.reportGenerator);

  const { pageSize, pageIndex } = useSelector((state) => {
    return state.reportGenerator;
});


  const { userDetails } = useSelector((state) => state.auth);
  const handleOnPageChange = (event, newPage) => {
    dispatch(setPageIndex(newPage));
  };

  const handleOnPageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    dispatch(setPageSize(newSize));
    dispatch(setPageIndex(0));
};

  const handleOnDelete = async (row) => {
    const callback = async () => {
      try {
        await deleteReport({
          reportGeneratorId: row.ReportGeneratorId,
          loginUserId: userDetails?.UserId,
          pageModuleId: 1,
          pageMenuId: 17,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Your Report has been deleted.',
          timer: 3000,
          gif: SuccessGif,
          height: 250,
          width: 250,
        });
      } catch (error) {}
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

  const editReport = (row) => {
    setSelectedReportId(row?.ReportGeneratorId);
    setIsEditModal(true);
    setIsEditOnly(true);

    setIsViewOnly(false);
  };

  const viewReport = (row) => {
    setSelectedReportId(row?.ReportGeneratorId);
    setIsViewModal(true);
    setIsViewOnly(true);
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

  return (
    <FlexContainer flexDirection="column">
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
        <Scrollbars style={{ height: '350px' }}>
          <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
            <StyledTableHead>
              <TableRow>
                <StyledTableHeaderCell>S.No</StyledTableHeaderCell>
                {columns.map((column) => (
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
                <StyledTableHeaderCell>Actions</StyledTableHeaderCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {sortedRecords?.length > 0 ? (
                sortedRecords.map((row, rowIndex) => (
                  <StyledTableRow key={rowIndex}>
                    <StyledTableBodyCell>
                      {pageIndex * pageSize + rowIndex + 1}
                    </StyledTableBodyCell>
                    {columns.map((column) => (
                      <StyledTableBodyCell key={column.id}>
                        {column.id === 'AddedEditedDate' && row[column.id]
                          ? formatDate(row[column.id])
                          : (row[column.id] ?? null)}
                      </StyledTableBodyCell>
                    ))}
                    <ActionCell>
                      <FlexContainer className="action-icons">
                        {isEdit && (
                          <Tooltip title="Edit" arrow>
                            <StyledImage
                              cursor="pointer"
                              height="12.5px"
                              width="12.5px"
                              src={EditIcon}
                              alt="Edit"
                              onClick={() => editReport(row)}
                            />
                          </Tooltip>
                        )}
                        {isDelete && (
                          <Tooltip title="Delete" arrow>
                            <StyledImage
                              cursor="pointer"
                              height="12.5px"
                              width="12.5px"
                              src={DeleteIcon}
                              alt="Delete"
                              onClick={() => handleOnDelete(row)}
                            />
                          </Tooltip>
                        )}
                        {isView && (
                          <Tooltip title="View" arrow>
                            <StyledImage
                              cursor="pointer"
                              height="12.5px"
                              width="12.5px"
                              src={ViewIcon}
                              alt="View"
                              onClick={() => viewReport(row)}
                            />
                          </Tooltip>
                        )}
                      </FlexContainer>
                    </ActionCell>
                  </StyledTableRow>
                ))
              ) : (
                <FlexContainer
                  position="absolute"
                  style={{ top: '50%', left: '50%' }}
                >
                  No data available
                </FlexContainer>
              )}
            </TableBody>
          </Table>
        </Scrollbars>
      </TableContainer>

      {totalRecords && (
        <CustomPagination
          totalRecords={totalRecords}
          totalPages={totalPages}
          page={pageIndex}
          pageSize={pageSize}
          handleOnPageChange={handleOnPageChange}
          handleOnPageSizeChange={handleOnPageSizeChange}
        />
      )}
    </FlexContainer>
  );
};

export default ReportGeneratorDataTable;
