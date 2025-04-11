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
} from '../../utils/DataTable.styled';
import { FlexContainer } from '../../utils/StyledComponents';
import SwitchGif from '../../assets/Gifs/switch.gif';

import CustomPagination from '../../components/Pagination/CustomPagination';
import Scrollbars from 'react-custom-scrollbars-2';
import { getlabel } from '../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import formatDate from '../../utils/FormatDate';
import { useTranslation } from 'react-i18next';
import {
  setPageIndex,
  setPageSize,
} from '../../redux/features/mainMaster/userAssignmentSlice';
import { showSweetAlert, showToastAlert } from '../../utils/SweetAlert';

import {
  useFetchSwitchUserDetailsQuery,
  fetchUserDetails,
  setIsSwitchUser,
} from '../../redux/features/auth/authSlice';
import {
  useGetSwitchUserIdQuery,
  useLazyGetFacilityRBACQuery,
  useLazyGetSwitchUserIdQuery,
} from '../../redux/RTK/loginApi';
import { setFilters } from '../../redux/features/mainMaster/userStaffSlice';
import { useNavigate } from 'react-router-dom';

const DataTable = ({
  onClose,
  columns = [],
  data = [],
  labels,
  setIsSwitching,
  handleUserProfileClose,
  setSelectedRowData,
  setShowSwitchUserModal,
  setIsEmployeeModel,
  totalRecords,
  setSelectedFacilityId,
}) => {
  const { i18n, t } = useTranslation();
  const [selectedSwitchUser, setSelectedSwitchUser] = useState(null);
  const dispatch = useDispatch();

  const { pageSize, pageIndex } = useSelector(
    (state) => state?.userStaff?.filters
  );
  const filters = useSelector((state) => state.userStaff.filters);
  const { token, isPreviousUser } = useSelector((state) => state.auth);

  const [triggerGetSwitchUserId, { isFetching, data: switchedUserDetails }] =
    useLazyGetSwitchUserIdQuery();
  const [triggerGetFacilityRBAC, { data: switchedUserFacilityDetails }] =
    useLazyGetFacilityRBACQuery();

  const navigate = useNavigate();

  const handleOnPageChange = (event, newPage) => {
    alert;
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
    setSelectedSwitchUser(row.EmployeeId);
    const callback = async () => {
      setIsSwitching(true);
      try {
        const switchedUserDetails = await triggerGetSwitchUserId({
          EmployeeId: row.EmployeeId,
        });
        // const switchedUserFacilityDetails = await triggerGetFacilityRBAC({
        //   EmployeeId: row.EmployeeId,
        // });
        // console.log("switchedUserFacilityDetails", switchedUserFacilityDetails);
        dispatch(setIsSwitchUser(true));
        await dispatch(
          fetchUserDetails({
            employeeID: switchedUserDetails?.data?.Data?.EmployeeID,
            token: token,
          })
        );
        if (switchedUserDetails?.data?.Status === 'Failure') {
          showSweetAlert({
            type: 'Failure',
            // title: 'Sorry!',
            // text: switchedUserDetails?.data?.Message,
            text: `Unable to Switch: ${row.EmployeeId}`,
            timer: 3000,
            height: 500,
            width: 500,
          });
          dispatch(setIsSwitchUser(false));
          await dispatch(
            fetchUserDetails({
              employeeID: isPreviousUser?.EmployeeID,
              token: token,
            })
          );
        } else {
          navigate('/');
        }
      } catch (error) {
        console.log({ error });
      } finally {
        setIsSwitching(false);
      }
    };

    showSweetAlert({
      type: 'edit',
      title: 'Are you sure?',
      text: '',
      gif: SwitchGif,
      callback,
      cancelButtonText: 'No, Keep it',
      confirmButtonText: 'Yes, switch it!',
    });

    setShowSwitchUserModal(false);
    handleUserProfileClose();
  };

  return (
    <FlexContainer flexDirection="column">
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
        <Scrollbars style={{ height: '350px' }}>
          <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
            <StyledTableHead>
              <TableRow>
                <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                {columns.map((column) => {
                  return (
                    <StyledTableHeaderCell key={column.id}>
                      {getlabel(column.translationId, labels, i18n.language)}
                    </StyledTableHeaderCell>
                  );
                })}
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
