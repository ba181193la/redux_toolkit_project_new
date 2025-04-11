import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  Checkbox
} from '@mui/material';
import {
  StyledTableRow,
  StyledTableHeaderCell,
  CustomStyledTableHead,
  StyledTableBodyCell
} from '../../../../utils/DataTable.styled';
import { useTranslation } from 'react-i18next';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import { useDispatch } from 'react-redux';
import { setOrganizationLevelMenu } from '../../../../redux/features/mainMaster/homePageSettingSlice';
import { useParams } from 'react-router-dom';

const OrganizationalLevelTable = ({ menuList, setMenuList, parentMenuItem }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isMobile } = useWindowDimension();
  const { id } = useParams();
  const [organizationalMenuList, setorganizationalMenuList] = useState([])

  useEffect(() => {
    if (menuList?.length > 0) {
      const menuListData = menuList?.filter((menuItem) => {
        return menuItem.ModuleId === parentMenuItem?.ModuleId && menuItem.MenuId !== parentMenuItem?.MenuId
      }).map((item) => ({ ...item }))
      setorganizationalMenuList(menuListData)
    }
  }, [menuList]);

  const handleModuleCheckboxChange = (e, MenuId, ModuleId, checked) => {
    const checkedMenuList = organizationalMenuList.map((menuItem) => {
      const roleMenuId = menuItem.MenuId;
      return roleMenuId === MenuId
        ? {
          ...menuItem,
          IsChecked: checked
        }
        : menuItem;
    }
    )
    const updateMenuList = menuList?.map((menuItem) => {
      const roleMenuId = menuItem.MenuId;
      return roleMenuId === MenuId
        ? {
          ...menuItem,
          IsChecked: checked
        }
        : menuItem;
    })
    setorganizationalMenuList(checkedMenuList)
    setMenuList(updateMenuList)
    dispatch(setOrganizationLevelMenu(updateMenuList))
  };

  const handleOnChange = (e, checked, ModuleId) => {
    const isAllCheckedList = organizationalMenuList.map((menuItem) => {
      return {
        ...menuItem,
        IsChecked: checked,

      }
    })
    const updateMenuList = menuList?.map((menuItem) => {
      return ModuleId === menuItem.ModuleId
        ? {
          ...menuItem,
          IsChecked: checked
        }
        : menuItem;
    })
    setorganizationalMenuList(isAllCheckedList)
    setMenuList(updateMenuList)
    dispatch(setOrganizationLevelMenu(updateMenuList))
  };

  const isAllChecked = organizationalMenuList?.every(
    (menuItem) =>
      menuItem?.IsChecked
  );
  return (
    <TableContainer component={Paper} sx={{ width: isMobile ? "100%" : '70%', border: '1px solid #0083c0' }}>
      <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
        <CustomStyledTableHead  >
          <TableRow >
            <StyledTableHeaderCell width="100px" >
              <Checkbox
                sx={{
                  color: '#fff',
                  '&.Mui-checked': {
                    color: "#fff" // Checked color
                  }
                }}
                checked={isAllChecked}
                onChange={(e, checked) => handleOnChange(e, checked, parentMenuItem?.ModuleId)}
              />
            </StyledTableHeaderCell>
            <StyledTableHeaderCell bold fontSize={isMobile ? "14px" : "16px"}>
              {t('MODULE_NAME')}
            </StyledTableHeaderCell>
          </TableRow>
        </CustomStyledTableHead>

        <TableBody>

          {organizationalMenuList && organizationalMenuList.map((menuItem, rowIndex) => {
            return (
              <StyledTableRow key={rowIndex}>
                <StyledTableBodyCell paddingBottom='2px' paddingTop='2px' >
                  <Checkbox
                    checked={
                      (menuItem?.IsChecked) ||
                      isAllChecked
                    }
                    onChange={(e, checked) => {
                      handleModuleCheckboxChange(
                        e,
                        menuItem.MenuId,
                        menuItem.ModuleId,
                        checked
                      );
                    }}
                  />
                </StyledTableBodyCell>
                <StyledTableBodyCell paddingBottom='2px' paddingTop='2px' >{menuItem?.MenuName}</StyledTableBodyCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrganizationalLevelTable;
