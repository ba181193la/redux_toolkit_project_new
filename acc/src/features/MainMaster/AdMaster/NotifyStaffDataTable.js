import {
  Grid,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TextField,
  Tooltip,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import {
  ActionCell,
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../utils/DataTable.styled';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../utils/language';
import PlusIcon from '../../../assets/Icons/AddSubMaster.png';
import DeleteIcon from '../../../assets/Icons/DeleteIcon.png';
import SearchIcon from '../../../assets/Icons/Search.png';
import { useState } from 'react';
import { showToastAlert } from '../../../utils/SweetAlert';
import StaffListModal from './StaffListModal';

const NotifyStaffDataTable = ({
  labels,
  notifyStaffList,
  setNotifyStaffList,
  disabled,
  facilityList,
}) => {
  //* Notift staff table column list
  const notifyStaffTableColumnsList = [
    {
      id: 'UserName',
      translationId: 'MM_AM_StaffName',
    },
    {
      id: 'Department',
      translationId: 'MM_AM_Department',
    },
    { id: 'Designation', translationId: 'MM_AM_Designation' },
  ];

  //* Hooks declaration
  const { t, i18n } = useTranslation();

  //* State variables
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);

  const addNewStaff = () => {
    const lastStaff = notifyStaffList[notifyStaffList.length - 1];
    if (
      lastStaff &&
      !lastStaff.UserName &&
      !lastStaff.Department &&
      !lastStaff.Designation
    ) {
      showToastAlert({
        type: 'custom_info',
        text: `Select staff at line number ${notifyStaffList.length}`,
      });
    } else {
      setNotifyStaffList((prev) => [
        ...prev,
        { UserName: '', Department: '', Designation: '' },
      ]);
    }
  };

  //* Delete Staff
  const deleteStaff = (index) => {
    setNotifyStaffList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <FlexContainer
      flexDirection="column"
      width="100%"
      style={{
        opacity: disabled ? 0.7 : 1,
        pointerEvents: disabled ? 'none' : 'auto',
      }}
    >
      <Grid item xs={12} sm={12} md={10}>
        <StyledTypography
          fontSize="14px"
          fontWeight="700"
          lineHeight="20px"
          color="#333333"
          whiteSpace={'wrap'}
        >
          {t('StafftoBeNotifiedForDataSyncErrors')}
        </StyledTypography>
        <TableContainer component={Paper}>
          <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
            <StyledTableHead>
              <TableRow>
                <StyledTableHeaderCell style={{ padding: '0px 15px' }}>
                  {t('SNo')}
                </StyledTableHeaderCell>
                {notifyStaffTableColumnsList?.map((column) => (
                  <StyledTableHeaderCell key={column.id}>
                    {getlabel(column?.translationId, labels, i18n.language)}
                  </StyledTableHeaderCell>
                ))}
                <StyledTableHeaderCell style={{ padding: '0px 15px' }}>
                  {t('Actions')}
                </StyledTableHeaderCell>
              </TableRow>
            </StyledTableHead>

            {notifyStaffList?.length > 0 ? (
              <TableBody>
                {notifyStaffList?.map((row, rowIndex) => (
                  <StyledTableRow key={rowIndex}>
                    <StyledTableBodyCell>{rowIndex + 1}</StyledTableBodyCell>
                    {notifyStaffTableColumnsList?.map((column) => {
                      return (
                        <>
                          <StyledTableBodyCell key={column.id}>
                            {column.id === 'UserName' ? (
                              <TextField
                                variant="outlined"
                                value={row.StaffName}
                                disabled={true}
                                autoComplete="off"
                                fullWidth={false}
                                InputProps={{
                                  sx: {
                                    color: '#333333',
                                    '&.Mui-disabled': {
                                      color: '#000000',
                                      opacity: 1,
                                    },
                                  },
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <img
                                        src={SearchIcon}
                                        alt="Search Icon"
                                        height={'20px'}
                                        width={'20px'}
                                        style={{
                                          cursor: 'pointer',
                                        }}
                                        onClick={() => {
                                          setShowStaffModal(true);
                                          setSelectedRowIndex(rowIndex);
                                        }}
                                      />
                                    </InputAdornment>
                                  ),
                                }}
                              />
                            ) : (
                              (row[column.id] ?? null)
                            )}
                          </StyledTableBodyCell>
                        </>
                      );
                    })}
                    <ActionCell>
                      <FlexContainer className="action-icons">
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
                      </FlexContainer>
                    </ActionCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <StyledTableRow>
                  <StyledTableBodyCell
                    colSpan={5}
                    style={{ textAlign: 'center' }}
                  >
                    {t('NoDataAvailable')}
                  </StyledTableBodyCell>
                </StyledTableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Grid>

      <Grid
        item
        xs={12}
        sm={12}
        md={10}
        padding={'10px'}
        justifyContent={'flex-end'}
      >
        <StyledButton
          borderRadius="6px"
          gap="4px"
          padding="6px 10px"
          variant="contained"
          color="primary"
          style={{ display: 'inline-flex', gap: '5px', float: 'inline-end' }}
          onClick={addNewStaff}
          startIcon={
            <StyledImage
              height="16px"
              width="16px"
              src={PlusIcon}
              alt="WhiteSearch"
            />
          }
        >
          {t('Add')}
        </StyledButton>
      </Grid>

      <StaffListModal
        showStaffModal={showStaffModal}
        setShowStaffModal={setShowStaffModal}
        selectedRowIndex={selectedRowIndex}
        notifyStaffList={notifyStaffList}
        setNotifyStaffList={setNotifyStaffList}
        facilityList={facilityList}
        labels={labels}
      />
    </FlexContainer>
  );
};

export default NotifyStaffDataTable;
