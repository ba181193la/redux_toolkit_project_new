import React, { useEffect, useState } from 'react';
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
} from '../../../../../utils/DataTable.styled';
import { FlexContainer, StyledImage } from '../../../../../utils/StyledComponents';
import Scrollbars from 'react-custom-scrollbars-2';
import { useTranslation } from 'react-i18next';
import LoadingGif from '../../../../../assets/Gifs/LoadingGif.gif';
import { useGetReportPageLoadDataQuery } from '../../../../../redux/RTK/IncidentManagement/reportincidentApi';
import { useSelector } from 'react-redux';
import OwnPagination from './OwnPagination';

// import OwnPagination from './OwnPagination';


const ITEMS_PER_PAGE = 10; 

const IncidentcategorylistTable = ({
  onSelectRow,
  staffFetching,
}) => {
  const { t } = useTranslation();
  const { selectedFacility, userDetails, selectedModuleId, selectedMenu } = useSelector((state) => state.auth);
  
  
  const { data: incidentLits = [], isFetching: isIncidentFetching } = useGetReportPageLoadDataQuery({
    facilityId: selectedFacility?.id,
    loginUserId: userDetails?.UserId,
    moduleId: selectedModuleId,
    menuId: selectedMenu?.id,
  });


  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = incidentLits?.Data?.IncidentCategoryList?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = incidentLits?.Data?.IncidentCategoryList?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];

  const handleRowClick = (row) => {    
    onSelectRow(row);
  };

  return (
    <FlexContainer flexDirection="column">
      {staffFetching ? (
        <FlexContainer justifyContent="center">
          <StyledImage src={LoadingGif} alt="LoadingGif" />
        </FlexContainer>
      ) : (
        <TableContainer
          component={Paper}
          style={{ border: '1px solid #99cde6' }}
        >
          <Scrollbars style={{ height: `${totalItems > 0 ? '350px' : '150px'}` }}>
            <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
              <StyledTableHead>
                <TableRow>
                  <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Main Category</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Category Detail</StyledTableHeaderCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {currentItems.length > 0 ? (
                  currentItems.map((incident, index) => (
                    <StyledTableRow key={incident.IncidentNo} onClick={() => handleRowClick(incident)}>
                      <StyledTableBodyCell>{startIndex + index + 1}</StyledTableBodyCell>
                      <StyledTableBodyCell>{incident.MainCategory}</StyledTableBodyCell>
                      <StyledTableBodyCell>{incident.IncidentDetail}</StyledTableBodyCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableBodyCell colSpan={3} style={{ textAlign: 'center' }}>
                      {isIncidentFetching ? 'Loading...' : 'No data available'}
                    </StyledTableBodyCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </Scrollbars>
        </TableContainer>
      )}
      {/* Pagination Control */}
      <FlexContainer justifyContent="space-between" style={{ marginTop: '10px' }}>
        <OwnPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </FlexContainer>
    </FlexContainer>
  );
};

export default IncidentcategorylistTable;