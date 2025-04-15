import { useTranslation } from 'react-i18next';
import {
  FlexContainer,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { useGetStaffDetailsQuery } from '../../../redux/RTK/adMasterApi';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
} from '@mui/material';
import CustomScrollbars from '../../../components/CustomScrollbars/CustomScrollbars';
import {
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../utils/DataTable.styled';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import CloseIcon from '../../../assets/Icons/CloseIcon.png';
import SearchIcon from '../../../assets/Icons/Search.png';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import { getlabel } from '../../../utils/language';
import { showToastAlert } from '../../../utils/SweetAlert';
import CustomPagination from '../../../components/Pagination/CustomPagination';
import {
  setPageIndex,
  setPageSize,
} from '../../../redux/features/mainMaster/adMasterSlice';
import Label from '../../../components/Label/Label';
import Dropdown from '../../../components/Dropdown/Dropdown';

const StaffListModal = ({
  showStaffModal,
  setShowStaffModal,
  selectedRowIndex,
  notifyStaffList,
  setNotifyStaffList,
  labels,
  facilityList,
}) => {
  //* Variables declaration
  const staffListColumnsList = [
    {
      id: 'EmployeeId',
      translationId: 'MM_AM_EmployeeID',
    },
    {
      id: 'StaffName',
      translationId: 'MM_AM_StaffName',
    },
    {
      id: 'Department',
      translationId: 'MM_AM_Department',
    },
    {
      id: 'PrimaryDesignation',
      translationId: 'MM_AM_Designation',
    },
  ];

  //* Hooks Declaration
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();

  //* Selectors
  const { selectedMenu, selectedModuleId, userDetails } = useSelector(
    (state) => state.auth
  );
  const { pageIndex, pageSize } = useSelector((state) => state.adMaster);

  //* State Variables
  const [staffList, setStaffList] = useState([]);
  const [staffSearchKeyword, setStaffSearchKeyword] = useState(null);
  const [facilityId, setFacilityId] = useState('');

  //* Handlers for pagination
  const handleOnPageChange = (event, newPage) => {
    dispatch(setPageIndex(newPage));
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(setPageSize(parseInt(event.target.value, 10)));
    dispatch(setPageIndex(0));
  };

  //* Fetch staffs details
  const { data: getStaffData = [], isFetching } = useGetStaffDetailsQuery(
    {
      payload: {
        pageIndex: pageIndex + 1,
        pageSize: pageSize,
        headerFacility: facilityId,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    },
    {
      skip: !facilityId || !selectedModuleId || !selectedMenu?.id,
      refetchOnMountOrArgChange: true,
    }
  );

  const { totalRecords, records } = getStaffData || {
    totalRecords: 0,
    records: [],
  };

  useEffect(() => {
    setStaffList(records);
  }, [records]);

  //* Select staff from modal
  const selectStaff = (row) => {
    const existRowIndex = notifyStaffList.findIndex(
      (x) => x.UserId === row.UserId
    );

    if (existRowIndex !== -1) {
      setShowStaffModal(false);
      setFacilityId(null);
      showToastAlert({
        type: 'custom_info',
        text: `Staff already exists at row ${existRowIndex + 1}`,
      });
    } else {
      setNotifyStaffList((prev) =>
        prev.map((staff, index) =>
          index === selectedRowIndex
            ? {
                ...staff,
                StaffName: row?.StaffName,
                Department: row?.Department,
                Designation:
                  row?.PrimaryDesignation || row?.SecondaryDesignation,
                EmployeeId: row?.EmployeeId,
                UserId: row?.UserId,
                Facility: row?.Facility,
              }
            : staff
        )
      );
      setShowStaffModal(false);
      setFacilityId(null);
    }
  };

  return (
    <Dialog
      open={showStaffModal}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      fullWidth={true}
      maxWidth={'lg'}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
          height: isFetching ? '50vh' : 'auto',
          overflow: isFetching ? 'hidden' : 'auto',
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#205475',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          height: 50,
          alignItems: 'center',
          padding: '30px',
        }}
      >
        <StyledTypography
          fontSize="20px"
          fontWeight="300"
          lineHeight="18px"
          color="#fff"
        >
          {t('StaffDetailList')}
        </StyledTypography>
        <IconButton
          onClick={() => {
            setStaffSearchKeyword('');
            setFacilityId(null);
            setStaffList([]);
            dispatch(setPageIndex(0));
            dispatch(setPageSize(25));
            setShowStaffModal(false);
          }}
          style={{
            padding: '0.7rem',
          }}
          sx={{
            color: '#fff',
            '&:hover': {
              transform: 'scale(1.05)',
              backgroundColor: 'color(srgb 0.75 0.74 0.74 / 0.15)',
            },
          }}
        >
          <img src={CloseIcon} alt="Close Icon" />
        </IconButton>
      </DialogTitle>
      <DialogContent padding="0px">
        {isFetching ? (
          <FlexContainer
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
            position="absolute"
            style={{ top: '10%', left: '0' }}
          >
            <StyledImage src={LoadingGif} alt="LoadingGif" />
          </FlexContainer>
        ) : (
          <>
            <Grid
              container
              spacing={2}
              display={'flex'}
              justifyContent={'space-between'}
              width="100%"
              marginTop={'1rem'}
            >
              <Grid item xs={12} sm={12} md={4} padding={'10px'}>
                <StyledSearch
                  variant="outlined"
                  value={staffSearchKeyword}
                  placeholder={t('SearchByKeywords')}
                  fullWidth
                  margin="normal"
                  onChange={(event) => {
                    const searchTerm = event.target.value?.toLowerCase();
                    setStaffSearchKeyword(event.target.value);
                    if (searchTerm?.length < 1) {
                      setStaffList(records);
                      return;
                    }

                    setStaffList(
                      records?.filter(
                        (item) =>
                          item.EmployeeId?.toLowerCase().includes(searchTerm) ||
                          item.StaffName?.toLowerCase().includes(searchTerm) ||
                          item.Department?.toLowerCase().includes(searchTerm) ||
                          item.PrimaryDesignation?.toLowerCase().includes(
                            searchTerm
                          )
                      ) || []
                    );
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        style={{ paddingInlineStart: '10px' }}
                      >
                        <img src={SearchIcon} alt="Search Icon" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} padding={'10px'}>
                <Label
                  value={getlabel('MM_AM_Facility', labels, i18n.language)}
                  isRequired={true}
                />
                <Dropdown
                  name="facility"
                  value={facilityId}
                  options={facilityList}
                  required={false}
                  onChange={(event) => {
                    setFacilityId(event.target.value);
                    dispatch(setPageIndex(0));
                    dispatch(setPageSize(25));
                  }}
                />
              </Grid>
            </Grid>

            <FlexContainer flexDirection="column" width="100%">
              <TableContainer component={Paper} className="table-container">
                <CustomScrollbars
                  style={{ height: '350px' }}
                  rtl={i18n.language === 'ar'}
                >
                  <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
                    <StyledTableHead>
                      <TableRow>
                        <StyledTableHeaderCell>
                          {t('SNo')}
                        </StyledTableHeaderCell>
                        {staffListColumnsList?.map((column) => (
                          <StyledTableHeaderCell key={column.id}>
                            {getlabel(
                              column?.translationId,
                              labels,
                              i18n.language
                            )}
                          </StyledTableHeaderCell>
                        ))}
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {staffList?.length > 0 ? (
                        staffList?.map((row, rowIndex) => (
                          <StyledTableRow
                            key={row.EmployeeId}
                            onClick={() => selectStaff(row)}
                          >
                            <StyledTableBodyCell>
                              {pageIndex * pageSize + rowIndex + 1}
                            </StyledTableBodyCell>
                            {staffListColumnsList?.map((column) => {
                              return (
                                <StyledTableBodyCell
                                  key={column.id}
                                  status={
                                    column.id === 'Status' ? row[column.id] : ''
                                  }
                                >
                                  {column.id === 'Added_EditedDate' &&
                                  row[column.id]
                                    ? formatDate(row[column.id])
                                    : (row[column.id] ?? null)}
                                </StyledTableBodyCell>
                              );
                            })}
                          </StyledTableRow>
                        ))
                      ) : (
                        <FlexContainer
                          position="absolute"
                          style={{ top: '50%', left: '50%' }}
                        >
                          {t('NoDataAvailable')}
                        </FlexContainer>
                      )}
                    </TableBody>
                  </Table>
                </CustomScrollbars>
              </TableContainer>

              {staffList?.length > 0 ? (
                <CustomPagination
                  totalRecords={totalRecords}
                  page={pageIndex}
                  pageSize={pageSize}
                  handleOnPageChange={handleOnPageChange}
                  handleOnPageSizeChange={handleOnPageSizeChange}
                />
              ) : (
                <div>No Records</div>
              )}
            </FlexContainer>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StaffListModal;
