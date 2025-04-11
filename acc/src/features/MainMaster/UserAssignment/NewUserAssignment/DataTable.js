import React from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  Tooltip,
} from '@mui/material';
import Scrollbars from 'react-custom-scrollbars-2';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
} from '../../../../utils/DataTable.styled';
import { FlexContainer, StyledImage } from '../../../../utils/StyledComponents';
import { getlabel } from '../../../../utils/language';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setUserAssignmentList } from '../../../../redux/features/mainMaster/userAssignmentSlice';
import { showSweetAlert } from '../../../../utils/SweetAlert';
import DeleteUserGif from '../../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';

const styles = {
  wrapText: {
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
    maxWidth: '100%',
  },
};

const DataTable = ({
  columns = [],
  isView,
  labels,
  pageLoadData,
  setIsEditModal,
  setSelectedEditRow,
}) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();

  const userAssignmentList = useSelector(
    (state) => state.userAssignment.userAssignmentList
  );

  const handleOnDelete = async (row) => {
    const callback = async () => {
      try {
        dispatch(
          setUserAssignmentList(
            userAssignmentList.map((role) => {
              return {
                ...role,
                isDelete: role.roleId === row.roleId ? 1 : role.isDelete,
              };
            })
          )
        );

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Your role has been deleted.',
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

  const handleOnEdit = (row) => {
    setIsEditModal(true);
    setSelectedEditRow(row);
  };

  return (
    <FlexContainer flexDirection="column" alignItems="center">
      <TableContainer
        component={Paper}
        style={{ border: '1px solid #99cde6', width: '100%' }}
      >
        <Scrollbars style={{ height:`${userAssignmentList?.length > 0?'200px':'150px'}`  }}>
        <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
            <StyledTableHead>
              <TableRow>
                <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                {columns?.map((column) => (
                  <StyledTableHeaderCell key={column.id}>
                    {getlabel(column.translationId, labels, i18n.language)}
                  </StyledTableHeaderCell>
                ))}
                {!isView && (
                  <StyledTableHeaderCell>{t('Actions')}</StyledTableHeaderCell>
                )}
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {userAssignmentList?.length > 0 ? (
                userAssignmentList
                  ?.filter((item) => item.isDelete !== 1)
                  ?.map((row, rowIndex) => {
                    const facilityNames =
                      row?.additionalFacilityId &&
                      row.additionalFacilityId.length > 0
                        ? row.additionalFacilityId.split(',').map((id) => {                          
                          const facilityId = parseInt(id, 10);

                          const facility = pageLoadData?.FacilityList.find(
                            (facility) => facility.FacilityId === facilityId
                          );

                          return facility ? facility.FacilityName : null;
                        })
                        : [];
                    const facilityNamesString = facilityNames
                      .filter(Boolean)
                      .join(', ');
                    const applicationRoleName =
                      pageLoadData?.ApplicationRoleList?.find((item) => {
                        return item.RoleId === row?.roleId;
                      })?.ApplicationRole;

                    return (
                      <StyledTableRow key={rowIndex}>
                        <StyledTableBodyCell>
                          {rowIndex + 1}
                        </StyledTableBodyCell>

                        <StyledTableBodyCell>
                          {applicationRoleName}
                        </StyledTableBodyCell>
                        <StyledTableBodyCell>
                          {
                            <FlexContainer style={styles.wrapText}>
                              {facilityNamesString}
                            </FlexContainer>
                          }
                        </StyledTableBodyCell>
                        <ActionCell>
                          <FlexContainer className="action-icons">
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
                            <Tooltip title="Edit" arrow>
                              <StyledImage
                                cursor="pointer"
                                height="12.5px"
                                width="12.5px"
                                src={EditIcon}
                                alt="Edit"
                                onClick={() => handleOnEdit(row)}
                              />
                            </Tooltip>
                          </FlexContainer>
                        </ActionCell>
                      </StyledTableRow>
                    );
                  })
              ) : (
                <TableRow>
                <StyledTableBodyCell colSpan={columns.length+2} align="center">
                  {t('NoDataAvailable')}
                </StyledTableBodyCell>
              </TableRow>
              )}
            </TableBody>
          </Table>
        </Scrollbars>
      </TableContainer>
    </FlexContainer>
  );
};

export default DataTable;
