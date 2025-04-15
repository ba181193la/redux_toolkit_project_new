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
import { FlexContainer, StyledImage } from '../../../../utils/StyledComponents';
import Scrollbars from 'react-custom-scrollbars-2';
import { getlabel } from '../../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import formatDate from '../../../../utils/FormatDate';
import { useTranslation } from 'react-i18next';
import { setStaffList ,setFilters} from '../../../../redux/features/mainMaster/notificationMasterSlice';
import { useGetStaffUserDetailsQuery } from '../../../../redux/RTK/notificationMasterApi';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import { useGetIncidentApprovalPendingQuery, useGetApprovalEntryDataQuery } from '../../../../redux/RTK/IncidentManagement/incidentApprovalApi'
import { useNavigate, useParams } from 'react-router-dom';


const IncidentList = ({
  columns = [],
  data = [],
  labels,
  totalRecords,
  setIsStaffModel,
  setSelectedFacilityId,
  selectedFacilityId,
  setStaffFacilityId,
  staffFacilityId,
  staffFetching,
  onSelectRow
}) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const staffList = useSelector((state) => state.notificationMaster).staffList;

  const { id } = useParams();

   const {
     selectedMenu,
     userDetails,
     selectedFacility,
     selectedModuleId,
     roleFacilities,
     isSuperAdmin,
   } = useSelector((state) => state.auth);


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


    const handleRowClick = (row) => {
      onSelectRow(row); 
    };

    const { data: incidentLits = [], isFetching: isIncidentFetching } = useGetApprovalEntryDataQuery({
      incidentId : id,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
  
    });


    


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
          <Scrollbars style={{ height:`${incidentLits?.Data?.mergeIncidentList?.length > 0 ?  '350px':  '150px'}` }}>
          <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
            <StyledTableHead>
              <TableRow>
                <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                <StyledTableHeaderCell>Incident Number</StyledTableHeaderCell>
                <StyledTableHeaderCell>Incident Date</StyledTableHeaderCell>
                <StyledTableHeaderCell>Main Category</StyledTableHeaderCell>
                <StyledTableHeaderCell>Category Detail</StyledTableHeaderCell>
              </TableRow>
            </StyledTableHead>

            <TableBody>
              {incidentLits?.Data?.mergeIncidentList?.length > 0 ? (
                incidentLits?.Data?.mergeIncidentList.map((incident, index) => (
                  <StyledTableRow key={incident.IncidentNo} onClick={() => handleRowClick(incident)} >
                    <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
                    <StyledTableBodyCell>{incident.IncidentNo}</StyledTableBodyCell>
                    <StyledTableBodyCell> {formatDate(incident.IncidentDateTime)}</StyledTableBodyCell>
                    <StyledTableBodyCell>{incident.MainCategory}</StyledTableBodyCell>
                    <StyledTableBodyCell>{incident.CategoryDetail}</StyledTableBodyCell>
                  </StyledTableRow>
                ))
              ) : ( 
                <StyledTableRow>
                  <StyledTableBodyCell colSpan={5} style={{ textAlign: 'center' }}>
                    {isIncidentFetching ? 'Loading...' : 'No data available'}
                  </StyledTableBodyCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>

          </Scrollbars>
        </TableContainer>
      )}
        {/* {totalRecords > 0 && (
        <CustomPagination
          totalRecords={totalRecords}
          page={pageIndex}
          pageSize={pageSize}
          handleOnPageChange={handleOnPageChange}
          handleOnPageSizeChange={handleOnPageSizeChange}
        />
      )} */}
    </FlexContainer>
  );
};

export default IncidentList;
