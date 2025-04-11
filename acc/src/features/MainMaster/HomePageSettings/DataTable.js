import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  Divider,
  Tooltip,
  TableSortLabel,
} from '@mui/material';
import EditIcon from '../../../assets/Icons/EditIcon.png';
import EyeIcon from '../../../assets/Icons/EyeIcon.png';
import Editgif from '../../../assets/Gifs/Edit.gif';


import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
} from '../../../utils/DataTable.styled';
import { FlexContainer, StyledImage } from '../../../utils/StyledComponents';
import CustomScrollbars from '../../../components/CustomScrollbars/CustomScrollbars';
import { getlabel } from '../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import formatDate from '../../../utils/FormatDate';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { showSweetAlert } from '../../../utils/SweetAlert';
import { checkAccess } from '../../../utils/Auth';

export const StyledDivider = styled(Divider)`
  width: 0px !important;
  height: 30px !important;
  border-left: 1px solid #fff !important;
`;

const DataTable = ({
  columns = [],
  data = [],
  labels,
  isView = false,
}) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pageSize, pageIndex } = useSelector((state) => state.applicationRole);
  const { selectedMenu, roleFacilities, isSuperAdmin } =
    useSelector((state) => state.auth);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');

  const handleFavouritesDetails = async (row) => {
    try {
      if (row.Level === "Organization Level") {
        navigate(`/MainMaster/HomePageSettings/OrganizationLevelFavDetails`);
      } else {
        navigate(`/MainMaster/HomePageSettings/UserLevelFavDetails`);
      }
    } catch (error) {
      console.error({ error });
    }

  };

  const handleOnEdit = async (row) => {

    const callback = async () => {
      try {
        if (row.Level === "Organization Level") {
          navigate(`/MainMaster/HomePageSettings/OrganizationLevel`);
        } else {
          navigate(`/MainMaster/HomePageSettings/UserLevel`);
        }
      } catch (error) {
        console.error({ error });
      }
    };
    showSweetAlert({
      type: 'edit',
      title: 'Are you sure?',
      text: "",
      gif: Editgif,
      callback,
      cancelButtonText: 'No, Keep it',
      confirmButtonText: 'Yes, edit it!',
    });
  };

  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const sortedRecords = [...data].sort((a, b) => {
    const aValue = a[orderBy]?.toString().toLowerCase();
    const bValue = b[orderBy]?.toString().toLowerCase();

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <FlexContainer>
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>

        <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
          <StyledTableHead>
            <TableRow>
              <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
              {columns.map((column) => {
                return (
                  <StyledTableHeaderCell key={column.id}>
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSortRequest(column.id)}
                    >
                      {getlabel(column.translationId, labels, i18n.language)}
                    </TableSortLabel>
                  </StyledTableHeaderCell>
                );
              })}
              {checkAccess(isSuperAdmin, isView, true) && (
                <StyledTableHeaderCell>{t('Actions')}</StyledTableHeaderCell>
              )}
            </TableRow>
          </StyledTableHead>
          <TableBody>

            {sortedRecords?.length > 0 ? (
              sortedRecords?.map((row, rowIndex) => {
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
                    {columns.map((column) => (
                      <StyledTableBodyCell
                        key={column.id}
                        status={
                          column.id === 'ActiveStatus' ? row[column.id] : ''
                        }
                      >
                        {column.id === 'ModifiedDate' && row[column.id]
                          ? formatDate(row[column.id])
                          : (row[column.id] ?? null)}
                      </StyledTableBodyCell>
                    ))}
                    <ActionCell>
                      <FlexContainer className="action-icons">
                        {
                          checkAccess(
                            isSuperAdmin,
                            isView,
                            role?.IsEdit
                          ) && (
                            <Tooltip title="Edit" arrow>
                              <StyledImage
                                cursor="pointer"
                                height="12.5px"
                                width="12.5px"
                                src={EditIcon}
                                tooltip="Edit"
                                alt="Edit"
                                onClick={() => handleOnEdit(row)}
                              />
                            </Tooltip>
                          )
                        }
                        {
                          checkAccess(
                            isSuperAdmin,
                            isView,
                            role?.IsView
                          ) && (
                            <Tooltip title="View" arrow>
                              <StyledImage
                                cursor="pointer"
                                height="12.5px"
                                width="12.5px"
                                src={EyeIcon}
                                alt="Delete"
                                onClick={() => handleFavouritesDetails(row)}
                              />
                            </Tooltip>
                          )
                        }
                      </FlexContainer>
                    </ActionCell>
                  </StyledTableRow>
                );
              })
            ) : (
              <StyledTableBodyCell colSpan={columns.length + 2} align='center'>
                {t('NoDataAvailable')}
              </StyledTableBodyCell>
            )}
          </TableBody>
        </Table>
      </TableContainer>

    </FlexContainer>
  );
};

export default DataTable;
