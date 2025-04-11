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
import { getlabel } from '../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import { checkAccess } from '../../../utils/Auth';
import { showSweetAlert } from '../../../utils/SweetAlert';
import DeleteUserGif from '../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../assets/Gifs/SuccessGif.gif';
import styled from 'styled-components';
import DeleteIcon from '../../../assets/Icons/DeleteIcon.png';
import SaveIcon from '../../../assets/Icons/SaveIcon.png';
import { setDesignationList } from '../../../redux/features/mainMaster/notificationMasterSlice';

const SmallTableContainer = styled(TableContainer)`
  margin: auto; /* Center the table */
`;

const SmallRadio = styled(Radio)`
  &.MuiRadio-root {
    transform: scale(0.8); /* Scale down the size */
  }
`;

const DesignationTable = ({ columns = [], labels,isView = false
}) => {
  const designationList = useSelector(
    (state) => state.notificationMaster.designationList
  );
  const dispatch = useDispatch();

  const { i18n, t } = useTranslation();
  const [isEditDesignation, setIsEditDesignation] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const { pageSize, pageIndex } = useSelector(
    (state) => state.staffMaster.filters
  );
  const { selectedMenu, roleFacilities, isSuperAdmin } =
    useSelector((state) => state.auth);

  const handleEditDesignation = async (row) => {
    setSelectedRow(row);
    setIsEditDesignation(true);
  };

  const handleOnDelete = async (row) => {
    const callback = async () => {
      try {
        dispatch(
          setDesignationList(
            designationList?.filter(
              (item) => item?.DesignationName !== row?.DesignationName
            )
          )
        );
        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Designation has been deleted.',
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
      style={{ border: '1px solid #99cde6', marginTop: '10px' }}
    >
      <CustomScrollbars
        style={{ height: `${Array.isArray(designationList) && designationList.length > 0 ? '350px' : '350px'}` }}
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
            {Array.isArray(designationList) && designationList.length > 0 ? (
              designationList.map((row, rowIndex) => {
                if (!row) {
                  return null;
                }
                  
                const menu = roleFacilities?.find(
                  (role) => role.FacilityName === row?.Facility
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
                      .map((column) => {
                        return(
                        <StyledTableBodyCell key={column.id}>
                          {column.id === 'SenderType' &&
                            selectedRow?.DesignationName ===
                            row?.DesignationName &&
                            isEditDesignation ? (
                            <RadioGroup
                              row
                              value={row?.SenderType || ''}
                              onChange={(e) => {
                                dispatch(
                                  setDesignationList(
                                    designationList?.map((item) => {
                                      return {
                                        ...item,
                                        SenderType:
                                          item.DesignationName ===
                                            row?.DesignationName
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
                        )
              })}
                    <ActionCell>
                      <FlexContainer className="action-icons">
                        {isEditDesignation &&
                          selectedRow?.DesignationName ===
                          row?.DesignationName ? (
                          <StyledImage
                            cursor="pointer"
                            height="12.5px"
                            width="12.5px"
                            src={SaveIcon}
                            alt="SaveIcon"
                            tooltip="Save"
                            onClick={() => setIsEditDesignation(false)}
                          />
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
                                alt="Edit"
                                onClick={() => handleEditDesignation(row)}
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
                <StyledTableBodyCell colSpan={columns.length + 2} align='center'>
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

export default DesignationTable;
