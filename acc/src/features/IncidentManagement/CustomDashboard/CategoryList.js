import React, { useState, useEffect } from 'react';
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
import { useTranslation } from 'react-i18next';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import { useGetIncidentCategoryListMutation } from '../../../redux/RTK/IncidentManagement/incidentApprovalApi';
import { useSelector, useDispatch } from 'react-redux';
import { setFilters } from '../../../redux/features/mainMaster/incidentApprovalSlice';
import CustomPagination from '../../../components/Pagination/CustomPagination';

const ITEMS_PER_PAGE = 10;

const CategoryList = ({
  onSelectRow,
  staffFetching,
  searchQuery,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

   
  const { selectedFacility, userDetails, selectedModuleId, selectedMenu } =
    useSelector((state) => state.auth);

  const { filters, isFilterApplied } = useSelector(
    (state) => state.incidentApproval || []
  );
  const { pageSize, pageIndex } = useSelector(
    (state) => state.incidentApproval.filters
  );

  const [getIncidentCategoryList] = useGetIncidentCategoryListMutation();
  const [incidentList, setIncidentList] = useState([]);

  useEffect(() => {
    const fetchIncidentList = async () => {
        try {
          const response = await getIncidentCategoryList({
            keyword: searchQuery || '',
            headerFacilityId: selectedFacility?.id,
            moduleId: selectedModuleId,
            menuId: 33,
            loginUserId: userDetails?.UserId,
            pageIndex: pageIndex + 1,
            pageSize: filters?.pageSize,
          }).unwrap();

          setIncidentList(response);
        } catch (error) {
          console.error('Error fetching incident list:', error);
        }
      
    };

    fetchIncidentList();
  }, [ searchQuery, getIncidentCategoryList, pageIndex]);


  const totalItems = incidentList?.Data?.Records?.length || 0;

  const incidentListitems = incidentList?.Data?.Records || 0;

  const handleRowClick = (row) => {


    // console.log(row);
    // console.log("Row..");

    onSelectRow(row);
    setIncidentList([]);
    


  };

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
      {staffFetching ? (
        <FlexContainer justifyContent="center">
          <StyledImage src={LoadingGif} alt="LoadingGif" />
        </FlexContainer>
      ) : (
        <TableContainer
          component={Paper}
          style={{ border: '1px solid #99cde6' }}
        >
          <Scrollbars
            style={{ height: `${totalItems > 0 ? '350px' : '150px'}` }}
          >
            <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
              <StyledTableHead>
                <TableRow>
                  <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Main Category</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Sub Category</StyledTableHeaderCell>
                  <StyledTableHeaderCell>Category Detail</StyledTableHeaderCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {incidentListitems?.length > 0 ? (
                  incidentListitems.map((incident, index) => (
                    <StyledTableRow
                      key={incident.IncidentNo}
                      onClick={() => handleRowClick(incident)}
                    >
                      <StyledTableBodyCell>
                        {pageIndex * pageSize + index + 1}
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                        {incident.MainCategoryCode && incident.MainCategory ? `${incident.MainCategoryCode}-${incident.MainCategory}` : incident.MainCategory}
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                        {incident.SubCategoryCode && incident.SubCategory ? `${incident.SubCategoryCode}-${incident.SubCategory}` : incident.SubCategory}
                      </StyledTableBodyCell>
                      <StyledTableBodyCell>
                        {incident.IncidentDetailId && incident.IncidentDetail ? `${incident.IncidentDetailId}-${incident.IncidentDetail}` : incident.IncidentDetail}
                      </StyledTableBodyCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableBodyCell
                      colSpan={3}
                      style={{ textAlign: 'center' }}
                    >
                      No data available
                    </StyledTableBodyCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </Scrollbars>
        </TableContainer>
      )}
      <FlexContainer
        justifyContent="space-between"
        style={{ marginTop: '10px' }}
      >
        {incidentList?.Data?.TotalRecords > 0 && (
          <CustomPagination
            totalRecords={incidentList?.Data?.TotalRecords}
            page={pageIndex}
            pageSize={pageSize}
            handleOnPageChange={handleOnPageChange}
            handleOnPageSizeChange={handleOnPageSizeChange}
          />
        )}
      </FlexContainer>
    </FlexContainer>
  );
};

export default CategoryList;
