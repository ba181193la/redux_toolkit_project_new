import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';
import {
  FlexContainer,
  StyledImage,
} from '../../../../../utils/StyledComponents';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
} from '../../../../../utils/DataTable.styled';
import CustomPagination from '../../../../../components/Pagination/CustomPagination';
import EditIcon from '../../../../../assets/Icons/EditIcon.png';
import { useNavigate } from 'react-router-dom';

const DataTablePending = ({ columns = [], rows }) => {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    setTotalRecords(rows.length);
    setPageIndex(0);
  }, [rows]);

  const handleOnPageChange = (newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handleOnPageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPageIndex(0);
  };

  const paginatedData = rows.slice(
    pageIndex * pageSize,
    pageIndex * pageSize + pageSize
  );

  const handleOnEdit = () => {
    navigate('/IncidentManagement/IncidentInvestigationEntry');
  };

  return (
    <FlexContainer flexDirection="column">
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
        <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
          <StyledTableHead>
            <TableRow>
              {columns?.map((column) => (
                <StyledTableHeaderCell key={column.id}>
                  {column.label}
                </StyledTableHeaderCell>
              ))}
              <StyledTableHeaderCell>New Actions</StyledTableHeaderCell>
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <StyledTableRow key={index}>
                  {columns.map((column) => (
                    <StyledTableBodyCell key={column.id}>
                      {row[column.id]}
                    </StyledTableBodyCell>
                  ))}
                  <StyledTableBodyCell>
                    <StyledImage
                      cursor="pointer"
                      height="12.5px"
                      width="12.5px"
                      src={EditIcon}
                      alt="Edit"
                      onClick={handleOnEdit}
                    />
                  </StyledTableBodyCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableBodyCell colSpan={columns.length + 1}>
                  No data available
                </StyledTableBodyCell>
              </StyledTableRow>
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

export default DataTablePending;
