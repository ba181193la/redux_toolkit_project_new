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
} from '../../../utils/DataTable.styled';
import { FlexContainer, StyledImage } from '../../../utils/StyledComponents';
import Scrollbars from 'react-custom-scrollbars-2';
import { getlabel } from '../../../utils/IncidentLabels';
import formatDate from '../../../utils/FormatDate';
import { useTranslation } from 'react-i18next';
import { setDesignationList, setFilters } from '../../../redux/features/mainMaster/notificationMasterSlice';
import { useDispatch, useSelector } from 'react-redux';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import CustomPagination from '../../../components/Pagination/CustomPagination';

const DesignationPopupTable = ({
  TotalRecords,
  columns = [],
  rowsData = [],
  labels,
  setIsDesignationModel,
  setSelectedFacilityId,
  selectedFacilityId,
  designationFacilityId,
  setDesignationFacilityId,
  designationFetching,
  setDesignationDataTotalRecords
}) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();

  const designationList = useSelector(
    (state) => state.notificationMaster.designationList
  );
  const { pageSize, pageIndex } = useSelector(
    (state) => state?.notificationMaster?.filters
  );
  const filters = useSelector(
      (state) => state?.notificationMaster?.filters || {}
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

  const handleOnRowClick = (row) => {
    setDesignationFacilityId(selectedFacilityId);

    setIsDesignationModel(false);

    const exists = designationList.some(
      (item) => item?.DesignationName === row?.DesignationName
    );

    const formattedRow = {
      DesignationName: row?.DesignationName,
      DesignationId: row?.DesignationId,
      SenderType: 'To' || '',
      UserType: 'Designation',
      DesignationFacility: row?.Facility,
      DesignationFacilityId: designationFacilityId,
    };

    if (!exists) {
      dispatch(setDesignationList([...designationList, formattedRow]));
    }

    setSelectedFacilityId('');
    setDesignationDataTotalRecords({ TotalRecords: [] })
  };

  return (
    <FlexContainer flexDirection="column">
      {designationFetching ? (
        <FlexContainer justifyContent="center">
          <StyledImage src={LoadingGif} alt="LoadingGif" />
        </FlexContainer>
      ) : (
        <TableContainer
          component={Paper}
          style={{ border: '1px solid #99cde6' }}
        >
          <Scrollbars
            style={{ height: `${rowsData?.length > 0 ? '350px' : '150px'}` }}
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
                {rowsData?.length > 0 && selectedFacilityId ? (
                  rowsData?.map((row, rowIndex) => (
                    <StyledTableRow
                      key={rowIndex}
                      onClick={() => handleOnRowClick(row)}
                      style={{ cursor: 'pointer' }}
                    >
                      <StyledTableBodyCell>{rowIndex + 1}</StyledTableBodyCell>
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
      )}
      {TotalRecords > 0 && (
        <CustomPagination
          totalRecords={TotalRecords}
          page={pageIndex}
          pageSize={pageSize}
          handleOnPageChange={handleOnPageChange}
          handleOnPageSizeChange={handleOnPageSizeChange}
        />
      )}
    </FlexContainer>
  );
};

export default DesignationPopupTable;
