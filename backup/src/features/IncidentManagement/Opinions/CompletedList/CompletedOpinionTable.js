import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TableSortLabel,
  Tooltip,
} from '@mui/material';

import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
} from '../../../../utils/DataTable.styled';
import { FlexContainer, StyledImage } from '../../../../utils/StyledComponents';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import LikeIcon from '../../../../assets/Icons/LikeIcon.png';
import DislikeIcon from '../../../../assets/Icons/DislikeIcon.png';
import { useNavigate } from 'react-router-dom';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import ViewOnlyIcon from '../../../../assets/Icons/ViewOnlyIcon.png';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/IncidentLabels';
import { setCompletedFilters } from '../../../../redux/features/mainMaster/opinionSlice';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import EyeIcon from '../../../../assets/Icons/EyeIcon.png';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import format24HrTime from '../../../../utils/Format24HrTime';
import formatDate from '../../../../utils/FormatDate';

const CompletedOpinionTable = ({
  totalRecords,
  records,
  columns,
  searchLabels,
}) => {
  const navigate = useNavigate();
  const [order, setOrder] = useState('asc');
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const [orderBy, setOrderBy] = useState('');
  const dispatch = useDispatch();
  const { pageSize, pageIndex, completedFilters } = useSelector(
    (state) => state.opinion.completedFilters
  );

  // const [pageIndex, setPageIndex] = useState(1);
  // const [pageSize, setPageSize] = useState(25);

  const handleOnPageChange = (event, newPage) => {
    dispatch(
      setCompletedFilters({
        ...completedFilters,
        pageIndex: newPage,
      })
    );
  };

  // const handleOnPageSizeChange = (newPageSize) => {
  //   setPageSize(newPageSize);
  //   setPageIndex(1);
  // };
  // const handleOnPageSizeChange = (event, newPage) => {
  //   dispatch(
  //     setCompletedFilters({
  //       ...completedFilters,
  //       pageIndex: 0,
  //       pageSize: parseInt(event.target.value, 10),
  //     })
  //   );
  // };

  const handleOnPageSizeChange = (event) => {
    const newPageSize = parseInt(event?.target?.value, 10);

    if (isNaN(newPageSize)) {
      console.warn('Invalid pageSize value:', event?.target?.value);
      return; // Prevents dispatching invalid values
    }

    dispatch(
      setCompletedFilters({
        ...completedFilters,
        pageSize: newPageSize,
        pageIndex: 0,
      })
    );
  };

  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const sortedRecords = [...(records || [])].sort((a, b) => {
    const aValue = a[orderBy]?.toString().toLowerCase();
    const bValue = b[orderBy]?.toString().toLowerCase();
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const handleOnEdit = (row) => {
    navigate(
      `/IncidentManagement/Opinions/CompletedList/CompletedOpinionEntry/${row.IncidentId}/${row.OpinionId}`
    );
  };

  return (
    <FlexContainer flexDirection="column" width="100%">
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
        {pageSize > 25 ? (
          <CustomScrollbars
            style={{ height: '1250px' }}
            rtl={i18n.language === 'ar'}
          >
            <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
              <StyledTableHead>
                <StyledTableRow>
                  <StyledTableHeaderCell>{t('S.No')}</StyledTableHeaderCell>
                  {columns
                    ?.filter((col) => col.isSelected)
                    ?.map((column) => (
                      <StyledTableHeaderCell key={column.id}>
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : 'asc'}
                          onClick={() => handleSortRequest(column.id)}
                        >
                          {getlabel(
                            column.translationId,
                            searchLabels,
                            i18n.language
                          )}
                        </TableSortLabel>
                      </StyledTableHeaderCell>
                    ))}
                  <StyledTableHeaderCell>{t('Action')}</StyledTableHeaderCell>
                </StyledTableRow>
              </StyledTableHead>
              <TableBody>
                {sortedRecords?.length > 0 ? (
                  sortedRecords.map((row, rowIndex) => {
                    return (
                      <StyledTableRow key={rowIndex}>
                        <StyledTableBodyCell>
                          {pageIndex * pageSize + rowIndex + 1}
                        </StyledTableBodyCell>
                        {columns.map((column) => (
                          <StyledTableBodyCell key={column.id}>
                          {' '}
                          {column.id === 'IncidentDate' ||
                          column.id === 'RequestedDate'
                            ? row[column.id]
                              ? formatDate(row[column.id]) +
                                ' ' +
                                format24HrTime(row[column.id])
                              : null
                            : (row[column.id] ?? null)}{' '}
                        </StyledTableBodyCell>
                        ))}

                        <ActionCell>
                          <FlexContainer className="action-icons">
                            {/* <Tooltip title="Edit" arrow>
                            <StyledImage
                              cursor="pointer"
                              height="12.5px"
                              width="12.5px"
                              tooltip="Edit"
                              src={EditIcon}
                              alt="Edit"
                              onClick={() => handleOnEdit(row)}
                            />
                          </Tooltip> */}
                            <Tooltip title="View" arrow>
                              <StyledImage
                                cursor="pointer"
                                height="12.5px"
                                src={EyeIcon}
                                alt="EyeIcon"
                                onClick={() => handleOnEdit(row)}
                              />
                            </Tooltip>
                          </FlexContainer>
                        </ActionCell>
                      </StyledTableRow>
                    );
                  })
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
          </CustomScrollbars>
        ) : (
          <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
            <StyledTableHead>
              <StyledTableRow>
                <StyledTableHeaderCell>{t('S.No')}</StyledTableHeaderCell>
                {columns
                  ?.filter((col) => col.isSelected)
                  ?.map((column) => (
                    <StyledTableHeaderCell key={column.id}>
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : 'asc'}
                        onClick={() => handleSortRequest(column.id)}
                      >
                        {getlabel(
                          column.translationId,
                          searchLabels,
                          i18n.language
                        )}
                      </TableSortLabel>
                    </StyledTableHeaderCell>
                  ))}
                <StyledTableHeaderCell>{t('Action')}</StyledTableHeaderCell>
              </StyledTableRow>
            </StyledTableHead>
            <TableBody>
              {sortedRecords?.length > 0 ? (
                sortedRecords.map((row, rowIndex) => {
                  return (
                    <StyledTableRow key={rowIndex}>
                      <StyledTableBodyCell>
                        {pageIndex * pageSize + rowIndex + 1}
                      </StyledTableBodyCell>
                      {columns.map((column) => (
                        <StyledTableBodyCell key={column.id}>
                        {' '}
                        {column.id === 'IncidentDate' ||
                        column.id === 'RequestedDate'
                          ? row[column.id]
                            ? formatDate(row[column.id]) +
                              ' ' +
                              format24HrTime(row[column.id])
                            : null
                          : (row[column.id] ?? null)}{' '}
                      </StyledTableBodyCell>
                      ))}

                      <ActionCell>
                        <FlexContainer className="action-icons">
                          {/* <Tooltip title="Edit" arrow>
                          <StyledImage
                            cursor="pointer"
                            height="12.5px"
                            width="12.5px"
                            tooltip="Edit"
                            src={EditIcon}
                            alt="Edit"
                            onClick={() => handleOnEdit(row)}
                          />
                        </Tooltip> */}
                          <Tooltip title="View" arrow>
                            <StyledImage
                              cursor="pointer"
                              height="12.5px"
                              src={EyeIcon}
                              alt="EyeIcon"
                              onClick={() => handleOnEdit(row)}
                            />
                          </Tooltip>
                        </FlexContainer>
                      </ActionCell>
                    </StyledTableRow>
                  );
                })
              ) : (
                <StyledTableBodyCell
                                    colSpan={columns.length + 2}
                                    align="center"
                                  >
                                    {t('NoDataAvailable')}
                                  </StyledTableBodyCell>
              )}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* <CustomPagination
        totalRecords={dummyData.totalRecords}
        page={pageIndex}
        pageSize={pageSize}
        handleOnPageChange={handleOnPageChange}
        handleOnPageSizeChange={handleOnPageSizeChange}
      /> */}
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

export default CompletedOpinionTable;
