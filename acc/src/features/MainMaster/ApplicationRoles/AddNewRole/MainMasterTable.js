import React, { useEffect } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  Checkbox,
  TableHead,
  TableCell,
} from '@mui/material';
import {
  StyledTableRow,
  StyledTableHeaderCell,
} from '../../../../utils/DataTable.styled';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setMainMasterRoles } from '../../../../redux/features/mainMaster/applicationRoleSlice';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

export const StyledTableBodyCell = styled(TableCell)`
  font-family: Lato !important;
  font-size: 12px !important;
  font-weight: 400 !important;
  line-height: 14.5px !important;
  text-align: ${(props) => props.textAlign || 'left'};
  border-bottom: 0 !important;
  color: ${({ status }) =>
    status
      ? status === 'Active'
        ? '#099815'
        : '#D00000'
      : '#000000'} !important;

  padding-top: 0px !important;
  padding-bottom: 0px !important;
  padding-right: 10px !important;
  padding-left: 10px !important;
`;

export const CustomStyledTableHead = styled(TableHead)`
  border-left: ${(props) => props.borderLeft || '4px solid #0083c0'};

  th {
    background-color: ${(props) =>
      props.backgroundColor || '#0083c0'} !important;
  }

  tr {
    height: 30px; /* Reduce row height */
    padding: 0; /* Ensure no extra padding is added */
  }

  th,
  td {
    padding-top: 0px; /* Fine-tune vertical padding */
    padding-bottom: 0px;
  }
`;

const MainMasterTable = ({ applicationRoleData }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { id } = useParams();
  const applicationRole = useSelector((state) => state.applicationRole);
  const { mainMasterRoles = [] } = applicationRole;
  const { menuDetails, userDetails } = useSelector((state) => state.auth);

  useEffect(() => {
    const mainMasterMenu = menuDetails
      .filter((menuItem) => menuItem.ParentMenuId === 1)
      .map((item) => ({ ...item }));
    if (!applicationRoleData?.Data) {
      dispatch(setMainMasterRoles(mainMasterMenu));
    }
  }, [menuDetails, dispatch]);

  const permissionTypes = {
    VIEW: 'isView',
    CREATE: 'isAdd',
    EDIT: 'isEdit',
    DELETE: 'isDelete',
    PRINT: 'isPrint',
  };

  const handleCheckboxChange = (e, menuId, property, checked) => {
    dispatch(
      setMainMasterRoles(
        mainMasterRoles.map((role) => {
          const roleMenuId = id ? role?.menuId : role?.MenuId;

          if (roleMenuId === menuId) {
            return {
              ...role,
              [property]: checked,
            };
          }
          return role;
        })
      )
    );
  };

  const handleModuleCheckboxChange = (e, menuId, checked) => {
    dispatch(
      setMainMasterRoles(
        mainMasterRoles.map((role) => {
          const roleMenuId = id ? role.menuId : role.MenuId;
          return roleMenuId === menuId
            ? {
                ...role,
                isAdd: checked,
                isView: checked,
                isEdit: checked,
                isDelete: checked,
                isPrint: checked,
              }
            : role;
        })
      )
    );
  };

  const handleOnChange = (e, checked) => {
    dispatch(
      setMainMasterRoles(
        mainMasterRoles.map((role) => ({
          ...role,
          isAdd: checked,
          isView: checked,
          isEdit: checked,
          isDelete: checked,
          isPrint: checked,
        }))
      )
    );
  };

  const handleColumnChange = (permission, checked) => {
    dispatch(
      setMainMasterRoles(
        mainMasterRoles.map((role) => ({
          ...role,
          [permission]: checked,
        }))
      )
    );
  };

  const isAllChecked = mainMasterRoles.every(
    (role) =>
      role?.isView &&
      role?.isAdd &&
      role?.isDelete &&
      role?.isEdit &&
      role?.isPrint
  );

  return (
    <TableContainer component={Paper} width="100%">
      <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
        <CustomStyledTableHead backgroundColor="#DEF5FF">
          <TableRow>
            <StyledTableHeaderCell color="#000000A6">
              <Checkbox
                checked={isAllChecked}
                onChange={(e, checked) => handleOnChange(e, checked)}
              />
            </StyledTableHeaderCell>
            <StyledTableHeaderCell color="#000000A6">
              {t('MODULE_NAME')}
            </StyledTableHeaderCell>
            {Object.entries(permissionTypes).map(
              ([permissionKey, permissionValue]) => (
                <StyledTableHeaderCell key={permissionKey}>
                  {/* Header Title */}
                  <StyledTableHeaderCell color="#000000A6">
                    {t(`${permissionKey}`)}
                  </StyledTableHeaderCell>

                  {/* Checkbox */}
                  <Checkbox
                    checked={
                      mainMasterRoles.every((role) => role[permissionValue]) ||
                      isAllChecked
                    }
                    onChange={(e, checked) =>
                      handleColumnChange(permissionValue, checked)
                    }
                  />
                </StyledTableHeaderCell>
              )
            )}
          </TableRow>
        </CustomStyledTableHead>

        <TableBody>
          {mainMasterRoles
            .filter((role) => {
              const roleMenuId = id ? role.menuId : role.MenuId;
              return roleMenuId !== 3 && roleMenuId !== 35;
            })
            .map((role, rowIndex) => {
              const menu = menuDetails.find((menuItem) => {
                const roleMenuId = id ? role.menuId : role.MenuId;
                return menuItem.MenuId === roleMenuId;
              });

              return (
                <StyledTableRow key={rowIndex}>
                  <StyledTableBodyCell>
                    <Checkbox
                      checked={
                        (role?.isView &&
                          role?.isAdd &&
                          role?.isDelete &&
                          role?.isEdit &&
                          role?.isPrint) ||
                        isAllChecked
                      }
                      onChange={(e, checked) => {
                        handleModuleCheckboxChange(
                          e,
                          id ? role.menuId : role.MenuId,
                          checked
                        );
                      }}
                    />
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>{menu?.MenuName}</StyledTableBodyCell>
                  {Object.entries(permissionTypes).map(
                    ([permission, permissionIndex]) => {
                      return (
                        <StyledTableBodyCell key={permissionIndex}>
                          <Checkbox
                            checked={
                              (role && role[permissionIndex]) || isAllChecked
                            }
                            name={permissionIndex}
                            onChange={(e, checked) =>
                              role &&
                              handleCheckboxChange(
                                e,
                                id ? role.menuId : role.MenuId,
                                permissionIndex,
                                checked
                              )
                            }
                          />
                        </StyledTableBodyCell>
                      );
                    }
                  )}
                </StyledTableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MainMasterTable;
