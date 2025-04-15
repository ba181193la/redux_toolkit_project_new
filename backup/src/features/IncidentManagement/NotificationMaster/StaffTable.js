import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableRow,
  Paper,
  TableContainer,
  RadioGroup,
  Radio,
  Typography,
  Tooltip,
} from '@mui/material';
import EditIcon from '../../../assets/Icons/EditIcon.png';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
} from '../../../utils/DataTable.styled';
import { FlexContainer, StyledImage } from '../../../utils/StyledComponents';
import CustomScrollbars from '../../../components/CustomScrollbars/CustomScrollbars';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../utils/IncidentLabels';
import { useDispatch, useSelector } from 'react-redux';
import { checkAccess } from '../../../utils/Auth';
import { showSweetAlert } from '../../../utils/SweetAlert';
import DeleteUserGif from '../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../assets/Gifs/SuccessGif.gif';
import styled from 'styled-components';
import DeleteIcon from '../../../assets/Icons/DeleteIcon.png';
import SaveIcon from '../../../assets/Icons/SaveIcon.png';
import { setStaffList } from '../../../redux/features/mainMaster/notificationMasterSlice';
import { useGetStaffUserDetailsQuery } from '../../../redux/RTK/notificationMasterApi';

const SmallTableContainer = styled(TableContainer)`
  margin: auto; /* Center the table */
`;

const SmallRadio = styled(Radio)`
  &.MuiRadio-root {
    transform: scale(0.8); /* Scale down the size */
  }
`;

const StaffTable = ({ columns = [], labels, isView = false }) => {
  const staffList = useSelector((state) => state.notificationMaster).staffList;

  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const { pageSize, pageIndex } = useSelector(
    (state) => state.staffMaster.filters
  );

  const [isEditStaff, setIsEditStaff] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const {
    userDetails,
    selectedMenu,
    roleFacilities,
    isSuperAdmin,
    selectedFacility,
    selectedModuleId,
  } = useSelector((state) => state.auth);

  const handleEditStaff = async (row) => {
    setSelectedRow(row);
    setIsEditStaff(true);
  };

  const handleOnDelete = async (row) => {
    const callback = async () => {
      try {
        setStaffList((prev) => {
          return prev.filter((item) => item?.UserId !== row?.UserId);
        });
        dispatch(
          setStaffList(
            staffList?.filter((item) => item?.UserId !== row?.UserId)
          )
        );

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Staff has been deleted.',
          timer: 3000,
          gif: SuccessGif,
          height: 250,
          width: 250,
        });
      } catch (error) {
        console.log({ error });
      }
    };

    showSweetAlert({
      type: 'delete',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      gif: DeleteUserGif,
      callback,
      cancelButtonText: 'No, Keep it',
      confirmButtonText: 'Yes, delete it!',
    });
  };

  return (
    <SmallTableContainer
      component={Paper}
      style={{ border: '1px solid #99cde6', marginTop: '20px' }}
    >
      <CustomScrollbars
        style={{ height: '350px' }}
        rtl={i18n.language === 'ar'}
      >
        <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
          <StyledTableHead>
            <TableRow>
              <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
              {columns
                ?.filter((col) => col.isSelected)
                ?.map((column) => (
                  <StyledTableHeaderCell key={column.id}>
                    {getlabel(column.translationId, labels, i18n.language)}
                  </StyledTableHeaderCell>
                ))}
              {checkAccess(isSuperAdmin, isView, true) && (
                <StyledTableHeaderCell>{t('Actions')}</StyledTableHeaderCell>
              )}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {staffList?.length > 0 ? (
              staffList?.map((row, rowIndex) => {
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
                    {columns
                      ?.filter((col) => col.isSelected)
                      .map((column) => (
                        <StyledTableBodyCell key={column.id}>
                          {column.id === 'SenderType' &&
                          selectedRow?.StaffName === row?.StaffName &&
                          isEditStaff ? (
                            <RadioGroup
                              row
                              value={row?.SenderType || ''}
                              onChange={(e) => {
                                dispatch(
                                  setStaffList(
                                    staffList?.map((item) => {
                                      return {
                                        ...item,
                                        SenderType:
                                          item.UserId === row?.UserId
                                            ? e.target.value
                                            : item.SenderType,
                                      };
                                    })
                                  )
                                );
                              }}
                              style={{ marginLeft: '-8px' }}
                            >
                              <FlexContainer alignItems="center">
                                <SmallRadio
                                  size="small"
                                  color="primary"
                                  value="To"
                                />
                                <Typography fontSize="12px">To</Typography>
                              </FlexContainer>
                              <FlexContainer alignItems="center">
                                <SmallRadio
                                  size="small"
                                  color="primary"
                                  value="CC"
                                />
                                <Typography fontSize="12px">CC</Typography>
                              </FlexContainer>
                            </RadioGroup>
                          ) : (
                            row[column.id]
                          )}
                        </StyledTableBodyCell>
                      ))}
                    <ActionCell>
                      <FlexContainer className="action-icons">
                        {isEditStaff &&
                        selectedRow?.StaffName === row?.StaffName ? (
                          <Tooltip title="save" arrow>
                            <StyledImage
                              cursor="pointer"
                              height="12.5px"
                              width="12.5px"
                              src={SaveIcon}
                              alt="SaveIcon"
                              onClick={() => setIsEditStaff(false)}
                            />
                          </Tooltip>
                        ) : (
                          <>
                            {checkAccess(
                              isSuperAdmin,
                              isView,
                              role?.IsEdit || false
                            ) && (
                              <Tooltip title="Edit" arrow>
                                <StyledImage
                                  cursor="pointer"
                                  height="12.5px"
                                  width="12.5px"
                                  src={EditIcon}
                                  tooltip="Edit"
                                  alt="Edit"
                                  onClick={() => handleEditStaff(row)}
                                />
                              </Tooltip>
                            )}
                            {checkAccess(
                              isSuperAdmin,
                              isView,
                              role?.IsDelete || false
                            ) && (
                              <Tooltip title="Delete" arrow>
                                <StyledImage
                                  cursor="pointer"
                                  height="12.5px"
                                  width="12.5px"
                                  src={DeleteIcon}
                                  alt="Delete"
                                  tooltip="Delete"
                                  onClick={() => handleOnDelete(row)}
                                />
                              </Tooltip>
                            )}
                          </>
                        )}
                      </FlexContainer>
                    </ActionCell>
                  </StyledTableRow>
                );
              })
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
      </CustomScrollbars>
    </SmallTableContainer>
  );
};

export default StaffTable;
