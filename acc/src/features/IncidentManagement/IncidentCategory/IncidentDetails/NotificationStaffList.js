import {
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Tooltip,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
} from '../../../../utils/StyledComponents';
import {
  ActionCell,
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../../utils/DataTable.styled';
import { useEffect, useState } from 'react';
import Label from '../../../../components/Label/Label';
import { useTranslation } from 'react-i18next';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import PlusIcon from '../../../../assets/Icons/AddSubMaster.png';
import { getlabel } from '../../../../utils/language';
import StaffDetailListModel from './StaffListModal';
import { useSelector } from 'react-redux';
const NotificationStaffList = ({
  isMandatory,
  labels,
  notiStaffList,
  setNotiStaffList,
  setFieldValue,
  fieldAccess,
}) => {
  //* Hooks declaration
  const { t, i18n } = useTranslation();

  //* Selectors
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    isSuperAdmin,
    roleFacilities,
  } = useSelector((state) => state.auth);

  //* Field access checking
  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) => sectionName?.SectionName === 'Incident Details-Page'
    )
    ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields;

  //* State varibales
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffIdToEdit, setStaffIdToEdit] = useState(null);
  const [fieldLabels, setFieldLabels] = useState([]);

  useEffect(() => {
    if (labels?.Data) {
      const regionList = labels?.Data?.find(
        (x) => x.MenuId === selectedMenu?.id
      )?.Regions;
      const labelsList = regionList?.find(
        (x) => x.RegionCode === 'ALL'
      )?.Labels;
      setFieldLabels(labelsList);
    }
  }, [labels]);

  //* Delete staff list
  const deleteStaff = (index) => {
    setNotiStaffList((prev) => prev.filter((_, i) => i !== index));
    setFieldValue('notiStaffList', notiStaffList);
  };

  return (
    <FlexContainer display="flex" width="100%">
      <Grid
        container
        display={'flex'}
        width="100%"
        flexWrap={'wrap'}
        justifyContent={'space-between'}
        item
        xs={12}
        spacing={2}
        alignItems={'center'}
      >
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Label
            value={getlabel(
              'IM_IC_ID_NotificationStaff(s)',
              {
                Data: fieldLabels,
                Status: labels?.Status,
              },
              i18n.language
            )}
            isRequired={isMandatory}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12} style={{ paddingTop: 0 }}>
          <TableContainer
            component={FlexContainer}
            style={{ border: '1px solid #0083c0' }}
          >
            <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
              <StyledTableHead backgroundColor="#DEF5FF" borderLeft="none">
                <TableRow>
                  <StyledTableHeaderCell
                    color="#000000A6"
                    style={{ padding: '10px 15px' }}
                  >
                    {t('SNo')}
                  </StyledTableHeaderCell>
                  {pageFields?.find((x) => x.FieldId === 'IC_ID_P_Facility')
                    ?.IsShow && (
                    <StyledTableHeaderCell
                      color="#000000A6"
                      style={{ padding: '5px 15px' }}
                    >
                      {getlabel(
                        'IM_IC_ID_Facility',
                        {
                          Data: fieldLabels,
                          Status: labels?.Status,
                        },
                        i18n.language
                      )}
                    </StyledTableHeaderCell>
                  )}
                  {pageFields?.find((x) => x.FieldId === 'IC_ID_P_StaffName')
                    ?.IsShow && (
                    <StyledTableHeaderCell
                      color="#000000A6"
                      style={{ padding: '5px 15px' }}
                    >
                      {getlabel(
                        'IM_IC_ID_StaffName',
                        {
                          Data: fieldLabels,
                          Status: labels?.Status,
                        },
                        i18n.language
                      )}
                    </StyledTableHeaderCell>
                  )}
                  {pageFields?.find((x) => x.FieldId === 'IC_ID_P_Department')
                    ?.IsShow && (
                    <StyledTableHeaderCell
                      color="#000000A6"
                      style={{ padding: '5px 15px' }}
                    >
                      {getlabel(
                        'IM_IC_ID_Department',
                        {
                          Data: fieldLabels,
                          Status: labels?.Status,
                        },
                        i18n.language
                      )}
                    </StyledTableHeaderCell>
                  )}
                  {pageFields?.find((x) => x.FieldId === 'IC_ID_P_Designation')
                    ?.IsShow && (
                    <StyledTableHeaderCell
                      color="#000000A6"
                      style={{ padding: '5px 15px' }}
                    >
                      {getlabel(
                        'IM_IC_ID_Designation',
                        {
                          Data: fieldLabels,
                          Status: labels?.Status,
                        },
                        i18n.language
                      )}
                    </StyledTableHeaderCell>
                  )}
                  <StyledTableHeaderCell
                    color="#000000A6"
                    style={{ padding: '5px 15px' }}
                  >
                    {t('Actions')}
                  </StyledTableHeaderCell>
                </TableRow>
              </StyledTableHead>

              {notiStaffList?.length > 0 ? (
                <TableBody>
                  {notiStaffList.map((row, rowIndex) => (
                    <StyledTableRow key={rowIndex}>
                      <StyledTableBodyCell style={{ padding: '5px 15px' }}>
                        {rowIndex + 1}
                      </StyledTableBodyCell>
                      {pageFields?.find((x) => x.FieldId === 'IC_ID_P_Facility')
                        ?.IsShow && (
                        <StyledTableBodyCell style={{ padding: '5px 15px' }}>
                          {row?.facility}
                        </StyledTableBodyCell>
                      )}
                      {pageFields?.find(
                        (x) => x.FieldId === 'IC_ID_P_StaffName'
                      )?.IsShow && (
                        <StyledTableBodyCell
                          marginRight="4px"
                          style={{ padding: '5px 15px' }}
                        >
                          {row?.userName}
                        </StyledTableBodyCell>
                      )}
                      {pageFields?.find(
                        (x) => x.FieldId === 'IC_ID_P_Department'
                      )?.IsShow && (
                        <StyledTableBodyCell>
                          {row?.departmentName}
                        </StyledTableBodyCell>
                      )}
                      {pageFields?.find(
                        (x) => x.FieldId === 'IC_ID_P_Designation'
                      )?.IsShow && (
                        <StyledTableBodyCell>
                          {row?.designationName}
                        </StyledTableBodyCell>
                      )}
                      <StyledTableBodyCell>
                        <ActionCell
                          style={{ display: 'flex', gap: '10px', padding: 0 }}
                        >
                          <Tooltip title="Edit" arrow>
                            <StyledImage
                              cursor="pointer"
                              height="12.5px"
                              width="12.5px"
                              src={EditIcon}
                              alt="Edit"
                              onClick={() => {
                                setShowStaffModal(true);
                                setStaffIdToEdit(rowIndex);
                              }}
                            />
                          </Tooltip>
                          <Tooltip title="Delete" arrow>
                            <StyledImage
                              cursor="pointer"
                              height="12.5px"
                              width="12.5px"
                              src={DeleteIcon}
                              alt="Delete"
                              onClick={() => deleteStaff(rowIndex)}
                            />
                          </Tooltip>
                        </ActionCell>
                      </StyledTableBodyCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              ) : (
                <TableBody>
                  <StyledTableRow>
                    <StyledTableBodyCell
                      colSpan={6}
                      style={{ textAlign: 'center' }}
                    >
                      {t('NoDataAvailable')}
                    </StyledTableBodyCell>
                  </StyledTableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
          <Grid item xs={12} sm={12} md={12} lg={12} marginTop="10px">
            <StyledButton
              borderRadius="6px"
              gap="4px"
              padding="6px 10px"
              variant="contained"
              color="primary"
              type="button"
              style={{
                display: 'inline-flex',
                gap: '5px',
                float: 'inline-end',
              }}
              onClick={() => {
                setShowStaffModal(true);
              }}
              //disabled={isAdding || isUpdating}
              startIcon={
                <StyledImage
                  src={PlusIcon}
                  height={'0.8rem'}
                  width={'0.8rem'}
                />
              }
            >
              {t('AddStaff')}
            </StyledButton>
          </Grid>
        </Grid>
      </Grid>
      <StaffDetailListModel
        showStaffModal={showStaffModal}
        setShowStaffModal={setShowStaffModal}
        labels={labels}
        notiStaffList={notiStaffList}
        setNotiStaffList={setNotiStaffList}
        setStaffIdToEdit={setStaffIdToEdit}
        staffIdToEdit={staffIdToEdit}
        setFieldValue={setFieldValue}
        fieldAccess={fieldAccess}
      />
    </FlexContainer>
  );
};

export default NotificationStaffList;
