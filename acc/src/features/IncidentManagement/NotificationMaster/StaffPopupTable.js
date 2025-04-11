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
import { useDispatch, useSelector } from 'react-redux';
import formatDate from '../../../utils/FormatDate';
import { useTranslation } from 'react-i18next';
import { setStaffList } from '../../../redux/features/mainMaster/notificationMasterSlice';
import { useGetStaffUserDetailsQuery } from '../../../redux/RTK/notificationMasterApi';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import CustomPagination from '../../../components/Pagination/CustomPagination';

const StaffPopupTable = ({
  totalRecords,
  columns = [],
  data = [],
  labels,
  setIsStaffModel,
  setSelectedFacilityId,
  selectedFacilityId,
  setStaffFacilityId,
  staffFacilityId,
  staffFetching,
  handleOnClose
}) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const staffList = useSelector((state) => state.notificationMaster).staffList;
  const { userDetails, selectedMenu, selectedFacility, selectedModuleId } =
    useSelector((state) => state.auth);
  const { pageSize, pageIndex } = useSelector(
    (state) => state?.notificationMaster?.filters
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
  const {
    data: StaffData = [],
    error,
    isFetching: isStaffFetching,
  } = useGetStaffUserDetailsQuery(
    {
      payload: {
        pageIndex: 1,
        pageSize: 100,
        headerFacility: selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    },
    {
      skip: !selectedFacility || !selectedModuleId || !selectedMenu?.id,
    }
  );

  const handleOnRowClick = (row) => {
    setIsStaffModel(false);
    setStaffFacilityId(selectedFacilityId);
    const exists = staffList.some((item) => item?.UserId === row?.UserId);
    // const matchedRoleData = StaffData?.records?.filter((staff) => {
    //   return row?.UserId === staff?.UserId;
    // });
    const formattedRow = {
      // StaffName: matchedRoleData ? matchedRoleData[0]?.StaffName : '',
      StaffName: row?.StaffName,
      Facility: row?.Facility,
      UserId: row?.UserId,
      SenderType: 'To' || '',
      UserType: 'Staff',
      Department: row?.Department,
      StaffFacilityId: staffFacilityId,
    };

    if (!exists) {
      dispatch(setStaffList([...staffList, formattedRow]));
    }

    setSelectedFacilityId('');
    handleOnClose()
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
                {data?.length > 0 && selectedFacilityId ? (
                  data?.map((row, rowIndex) => (
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

export default StaffPopupTable;
