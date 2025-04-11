import {
  Table,
  TableBody,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import { FlexContainer, StyledImage } from '../../../utils/StyledComponents';
import {
  ActionCell,
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../utils/DataTable.styled';
import { useTranslation } from 'react-i18next';
import DownloadIcon from '../../../assets/Icons/download.png';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import formatDate from '../../../utils/FormatDate';
import format24HrTime from '../../../utils/Format24HrTime';
import { useDownloadIntegrationLogListDataMutation } from '../../../redux/RTK/integrationLogApi';
import { showToastAlert } from '../../../utils/SweetAlert';
import exportToExcel from '../../../utils/exportToExcel';
import CustomPagination from '../../../components/Pagination/CustomPagination';
import { useDispatch } from 'react-redux';
import { setFilters } from '../../../redux/features/mainMaster/integrationLogSlice';

const DataTable = ({ integrationLogData, totalRecords }) => {
  const { i18n, t } = useTranslation();
  const [orderBy, setOrderBy] = useState('');
  const [order, setOrder] = useState('asc');
  const dispatch = useDispatch();

  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };
  const columns = [
    { id: 'LogDate', name: 'Log Date' },
    { id: 'Master', name: 'Master' },
    { id: 'FileName', name: 'File Name' },
    { id: 'TotalRecord', name: 'Total Records' },
    { id: 'FailedRecord', name: 'Failed Records' },
  ];

  const sortedRecords = [...integrationLogData].sort((a, b) => {
    const aValue = a[orderBy]?.toString().toLowerCase();
    const bValue = b[orderBy]?.toString().toLowerCase();

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const [triggerIntegrationLogData] =
    useDownloadIntegrationLogListDataMutation();

  const { pageSize, pageIndex } = useSelector(
    (state) => state.integrationLog.filters
  );
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

  return (
    <FlexContainer flexDirection="column">
      <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
        <StyledTableHead>
          <TableRow>
            <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
            {columns?.map((column) => (
              <StyledTableHeaderCell key={column.id}>
                <TableSortLabel
                  active={orderBy === column.id}
                  direction={orderBy === column.id ? order : 'asc'}
                  onClick={() => handleSortRequest(column.id)}
                >
                  {/* {getlabel(column.translationId, labels, i18n.language)} */}
                  {column.name}
                </TableSortLabel>
              </StyledTableHeaderCell>
            ))}
            <StyledTableHeaderCell>{t('Actions')}</StyledTableHeaderCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {sortedRecords?.length > 0 ? (
            sortedRecords?.map((row, rowIndex) => {
              return (
                <StyledTableRow key={rowIndex}>
                  <StyledTableBodyCell> {rowIndex + 1}</StyledTableBodyCell>
                  {columns?.map((column) => {
                    return (
                      <StyledTableBodyCell>
                        {column.id === 'LogDate' && row[column.id]
                          ? formatDate(row[column.id]) +
                            ' ' +
                            format24HrTime(row[column.id])
                          : (row[column.id] ?? null)}
                      </StyledTableBodyCell>
                    );
                  })}
                  <ActionCell>
                    <FlexContainer className="action-icons">
                      <Tooltip title="Download" arrow>
                        <StyledImage
                          cursor="pointer"
                          height="25.5px"
                          src={DownloadIcon}
                          alt="DownloadIcon"
                          onClick={async () => {
                            try {
                              const response = await triggerIntegrationLogData({
                                payload: {
                                  pageIndex: 1,
                                  pageSize: 25,
                                  logDate: row?.LogDate,
                                  headerFacility: 2,
                                  loginUserId: 1,
                                  moduleId: 1,
                                  menuId: 37,
                                  integrationLogId: row?.IntegrationLogId,
                                },
                              }).unwrap();
                              saveAs(response, 'IntegrationLog.xlsx');
                            } catch (error) {
                              console.log('error.data', error.data);
                              showToastAlert({
                                type: 'custom_error',
                                text: error.data,
                                gif: 'InfoGif',
                              });
                            }
                          }}
                        />
                      </Tooltip>
                    </FlexContainer>
                  </ActionCell>
                </StyledTableRow>
              );
            })
          ) : (
            <TableRow>
              <StyledTableBodyCell colSpan={columns.length + 2} align="center">
                {t('NoDataAvailable')}
              </StyledTableBodyCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

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

export default DataTable;
