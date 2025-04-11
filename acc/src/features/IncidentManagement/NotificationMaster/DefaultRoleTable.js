import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableRow,
  Paper,
  TableContainer,
  FormControl,
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
import SuccessGif from '../../../assets/Gifs/SuccessGif.gif';
import styled from 'styled-components';
import Dropdown from '../../../components/Dropdown/Dropdown';
import { useGetAllRolesQuery } from '../../../redux/RTK/notificationMasterApi';
import { Formik, Form } from 'formik';
import SaveIcon from '../../../assets/Icons/SaveIcon.png';
import CancelIcon from '../../../assets/Icons/CancelIcon.png';
import DeleteIcon from '../../../assets/Icons/DeleteIcon.png';
import DeleteUserGif from '../../../assets/Gifs/DeleteuserGif.gif';
import * as Yup from 'yup';
import { setDefaultRoleList } from '../../../redux/features/mainMaster/notificationMasterSlice';

const SmallTableContainer = styled(TableContainer)`
  margin: auto; /* Center the table */
`;

const SmallRadio = styled(Radio)`
  &.MuiRadio-root {
    transform: scale(0.8); /* Scale down the size */
  }
`;

const DefaultRoleTable = ({ columns = [], labels, isView = false }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const [isEditRole, setIsEditRole] = useState(false);
  const [selectedRow, setSelectedRow] = useState({});

  const roleList = useSelector(
    (state) => state.notificationMaster.defaultRoleList
  );

  const validationSchema = Yup.object({
    role: Yup.string().required('Role is required'),
    yesNo: Yup.string().required('Please select Yes or No'),
  });

  const { pageSize, pageIndex } = useSelector(
    (state) => state.staffMaster.filters
  );

  const {
    userDetails,
    selectedMenu,
    roleFacilities,
    isSuperAdmin,
    selectedModuleId,
  } = useSelector((state) => state.auth);

  const { data: RoleData = [] } = useGetAllRolesQuery(
    {
      payload: {
        pageIndex: 1,
        pageSize: 500,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    },
    {
      skip: !selectedModuleId || !selectedMenu?.id,
    }
  );

  const handleEditRole = async (row) => {
    setSelectedRow(row);
    setIsEditRole(true);
  };

  const handleOnDelete = async (row) => {
    const callback = async () => {
      try {
        dispatch(
          setDefaultRoleList(
            roleList?.filter((item) => item?.RoleId !== row?.RoleId)
          )
        );
        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Your Role has been deleted.',
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
        <Formik
          initialValues={{ role: '', yesNo: '' }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            const matchedRoleData = RoleData?.records?.filter((role) => {
              return values?.role === role?.RoleId;
            });

            const updatedRole = {
              RoleName: matchedRoleData[0]?.ApplicationRole,
              UserType: 'Role',
              SenderType: values?.yesNo,
              RoleId: values?.role,
            };

            const isRoleExisting = roleList.some(
              (role) => role.RoleId === values?.role
            );
            if (!isRoleExisting) {
              dispatch(setDefaultRoleList([...roleList, updatedRole]));
            } else {
              console.log(
                'RoleId already exists in the roleList. No update made.'
              );
            }
            resetForm();
          }}
        >
          {({ values, handleSubmit, setFieldValue, resetForm }) => (
            <Form>
              <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
                <StyledTableHead>
                  <TableRow>
                    <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                    {columns
                      ?.filter((col) => col.isSelected)
                      ?.map((column) => (
                        <StyledTableHeaderCell key={column.id}>
                          {getlabel(
                            column.translationId,
                            labels,
                            i18n.language
                          )}
                        </StyledTableHeaderCell>
                      ))}
                    {checkAccess(isSuperAdmin, isView, true) && (
                      <StyledTableHeaderCell>
                        {t('Actions')}
                      </StyledTableHeaderCell>
                    )}
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  <StyledTableRow>
                    <StyledTableBodyCell></StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <Dropdown
                        name="role"
                        options={RoleData?.records?.map((role) => ({
                          text: role.ApplicationRole,
                          value: role.RoleId,
                        }))}
                        width="155px"
                        required={true}
                        onChange={(e) => setFieldValue('role', e.target.value)}
                        value={values?.role}
                      />{' '}
                    </StyledTableBodyCell>
                    <StyledTableBodyCell>
                      <FormControl component="fieldset">
                        <RadioGroup
                          row
                          value={values.yesNo}
                          onChange={(e) => {
                            setFieldValue('yesNo', e.target.value);
                          }}
                          style={{ marginLeft: '-8px' }}
                        >
                          <FlexContainer
                            alignItems="center"
                            style={{ display: 'flex', flexDirection: 'row' }} // Ensure it's in a row and no wrapping
                          >
                            <SmallRadio
                              size="small"
                              color="primary"
                              value="Yes"
                            />
                            <Typography fontSize="12px">Yes</Typography>
                          </FlexContainer>

                          <FlexContainer
                            alignItems="center"
                            style={{ display: 'flex', flexDirection: 'row' }} // Same for the second radio button
                          >
                            <SmallRadio
                              size="small"
                              color="primary"
                              value="No"
                            />
                            <Typography fontSize="12px">No</Typography>
                          </FlexContainer>
                        </RadioGroup>
                      </FormControl>
                    </StyledTableBodyCell>
                    <ActionCell>
                      <FlexContainer className="action-icons">
                        <Tooltip title="Save" arrow>
                          <StyledImage
                            src={SaveIcon}
                            alt="Save Icon"
                            onClick={handleSubmit}
                            tooltip="save"
                            cursor="pointer"
                          />
                        </Tooltip>
                        <Tooltip title="Cancel" arrow>
                          <StyledImage
                            src={CancelIcon}
                            tooltip="Cancel"
                            alt="Save Icon"
                            cursor="pointer"
                            onClick={() => resetForm()}
                          />
                        </Tooltip>
                      </FlexContainer>
                    </ActionCell>
                  </StyledTableRow>

                  {roleList?.length > 0 ? (
                    roleList?.map((row, rowIndex) => {
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
                                selectedRow?.RoleId === row?.RoleId &&
                                isEditRole ? (
                                  <RadioGroup
                                    row
                                    value={row?.SenderType || ''}
                                    onChange={(e) => {
                                      dispatch(
                                        setDefaultRoleList(
                                          roleList?.map((item) => {
                                            return {
                                              ...item,
                                              SenderType:
                                                item.RoleId === row?.RoleId
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
                                        value="Yes"
                                      />
                                      <Typography fontSize="12px">
                                        Yes
                                      </Typography>
                                    </FlexContainer>
                                    <FlexContainer alignItems="center">
                                      <SmallRadio
                                        size="small"
                                        color="primary"
                                        value="No"
                                      />
                                      <Typography fontSize="12px">
                                        No
                                      </Typography>
                                    </FlexContainer>
                                  </RadioGroup>
                                ) : (
                                  row[column.id]
                                )}
                              </StyledTableBodyCell>
                            ))}
                          <ActionCell>
                            <FlexContainer className="action-icons">
                              {isEditRole &&
                              selectedRow?.RoleId === row?.RoleId ? (
                                <StyledImage
                                  cursor="pointer"
                                  height="12.5px"
                                  width="12.5px"
                                  src={SaveIcon}
                                  tooltip="Save"
                                  alt="SaveIcon"
                                  onClick={() => setIsEditRole(false)}
                                />
                              ) : (
                                <>
                                  {checkAccess(
                                    isSuperAdmin,
                                    isView,
                                    role?.IsEdit || false
                                  ) && (
                                    <Tooltip tile="Edit" arrow>
                                      <StyledImage
                                        cursor="pointer"
                                        height="12.5px"
                                        width="12.5px"
                                        src={EditIcon}
                                        alt="Edit"
                                        onClick={() => handleEditRole(row)}
                                      />
                                    </Tooltip>
                                  )}
                                  {checkAccess(
                                    isSuperAdmin,
                                    isView,
                                    role?.IsDelete || false
                                  ) && (
                                    <StyledImage
                                      cursor="pointer"
                                      height="12.5px"
                                      width="12.5px"
                                      src={DeleteIcon}
                                      alt="Delete"
                                      onClick={() => handleOnDelete(row)}
                                    />
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
            </Form>
          )}
        </Formik>
      </CustomScrollbars>
    </SmallTableContainer>
  );
};

export default DefaultRoleTable;
