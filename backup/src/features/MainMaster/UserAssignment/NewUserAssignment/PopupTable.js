import React from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
} from '../../../../utils/DataTable.styled';
import { FlexContainer } from '../../../../utils/StyledComponents';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import Scrollbars from 'react-custom-scrollbars-2';
import { getlabel } from '../../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import formatDate from '../../../../utils/FormatDate';
import { useTranslation } from 'react-i18next';
import { setFilters } from '../../../../redux/features/mainMaster/userStaffSlice';

const DataTable = ({
  columns = [],
  data = [],
  labels,
  setSelectedRowData,
  setIsEmployeeModel,
  totalRecords,
  setSelectedFacilityId,
}) => {
  const { i18n, t } = useTranslation();
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

  const handleOnRowClick = (row) => {
    setIsEmployeeModel(false);
    setSelectedRowData(row);
    setSelectedFacilityId('');
  };

  return (
    <FlexContainer flexDirection="column">
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
        <Scrollbars
          style={{ height: `${data?.length > 0 ? '350px' : '150px'}` }}
        >
          <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
            <StyledTableHead>
              <TableRow>
                <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                {columns.map((column) => (
                  <StyledTableHeaderCell key={column.id}>
                    {getlabel(column.translationId, labels, i18n.language)}
                  </StyledTableHeaderCell>
                ))}
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {data?.length > 0 ? (
                data?.map((row, rowIndex) => (
                  <StyledTableRow
                    key={rowIndex}
                    onClick={() => handleOnRowClick(row)}
                    style={{ cursor: 'pointer' }}
                  >
                    <StyledTableBodyCell>
                      {pageIndex * pageSize + rowIndex + 1}
                    </StyledTableBodyCell>
                    {columns.map((column) => (
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
                    colSpan={columns.length + 2}
                    align="center"
                  >
                    {t('NoDataAvailable')}
                  </StyledTableBodyCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Scrollbars>
      </TableContainer>

      {totalRecords > 0 ? (
        <CustomPagination
          totalRecords={totalRecords}
          page={pageIndex}
          pageSize={pageSize}
          handleOnPageChange={handleOnPageChange}
          handleOnPageSizeChange={handleOnPageSizeChange}
        />
      ) : (
        <CustomPagination
          totalRecords={0}
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
