import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableSortLabel,
  TableRow,
  Paper,
  Tooltip,
} from '@mui/material';
import { FlexContainer, StyledImage } from '../../../../utils/StyledComponents';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
} from '../../../../utils/DataTable.styled';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import ViewOnlyIcon from '../../../../assets/Icons/ViewOnlyIcon.png';
import { useNavigate } from 'react-router-dom';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import { checkAccess } from '../../../../utils/Auth';
import { Link } from 'react-router-dom';
import formatDate from '../../../../utils/FormatDate';
import { useDispatch, useSelector } from 'react-redux';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import { setTableFilters } from '../../../../redux/features/mainMaster/IncidentDashboardSlice';

const DetailsDataTable = ({
  columns,
  records,
  totalRecords,
}) => {
  const { pageSize, pageIndex } = useSelector(
    (state) => state.incidentDashboard.tableFilters
  );
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();

  const { userDetails, selectedMenu, roleFacilities, isSuperAdmin } =
    useSelector((state) => state.auth);

  const {  tableFilters } = useSelector((state) => state.incidentDashboard);

  const handleOnPageChange = (event, newPage) => {
    // if (event && event.preventDefault) {
    //   event.preventDefault();
    // }  
    dispatch(
      setTableFilters({
        ...tableFilters,
        pageIndex: newPage,
      })
    );
  };
  

  const handleOnPageSizeChange = (event) => {
    dispatch(
      setTableFilters({
        ...tableFilters,
        pageIndex: 0,
        pageSize: parseInt(event.target.value, 10),
      })
    );
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

const isCorrectFormat = (dateStr) => {
  return /^\d{2}-\d{2}-\d{4}$/.test(dateStr);
};


  return (
    <FlexContainer flexDirection="column">
      <TableContainer component={Paper} >
        <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
          <StyledTableHead>
            <TableRow>
              <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
              {columns?.map(
                  (column) =>
                      <StyledTableHeaderCell key={column.id}>
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : 'asc'}
                          onClick={() => handleSortRequest(column.id)}
                        >
                          {column.name}
                        </TableSortLabel>
                      </StyledTableHeaderCell>
                    
                )}

            </TableRow>
          </StyledTableHead>
          <TableBody>
            {sortedRecords?.length > 0 ? 
            (
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
                    {columns?.map((column) => {
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
                            {[
                              'ReportedDate',
                              'IncidentDate',
                              'AssignedOn',
                              'CompletedDate',
                              'IncidentDateTime'
                            ].includes(column.id) && row[column.id] ? (
                              isCorrectFormat(row[column.id])
                                ? row[column.id]
                                : formatDate(row[column.id])
                            ) : column.id === 'SecondaryDesignation' ? (
                              <div style={styles.wrapText}>
                                {row[column.id] ?? null}
                              </div>
                            ) : (
                              row[column.id] ?? null
                            )}

                          </StyledTableBodyCell>
                        );
                      })}
                  </StyledTableRow>
                );
              })
            ) :
             (
              <TableRow>
                <StyledTableBodyCell colSpan={columns.length} align="center">
                  {t('NoDataAvailable')}
                </StyledTableBodyCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

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

export default DetailsDataTable;
