import {
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  InputAdornment,
  Tooltip,
  Checkbox,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material';

import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
} from '../../../utils/DataTable.styled';

import { useDispatch } from 'react-redux';
// import {
//   setPageSize,
//   setPageIndex,
// } from '../../../redux/features/mainMaster/ReportGeneratorSlice';

import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../utils/StyledComponents';
import CloseIcon from '../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import Label from '../../../components/Label/Label';
import Dropdown from '../../../components/Dropdown/Dropdown';
import { useEffect, useState } from 'react';
import Search from '../../../assets/Icons/Search.png';
import { useGetAllFacilityQuery } from '../../../redux/RTK/reportGeneratorApi';
import NotifyUsersDataTable from './NotifyUsersDataTable';
import { useGetStaffDetailsQuery } from '../../../redux/RTK/reportGeneratorApi';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import { Formik, useFormikContext, Form } from 'formik';
import CustomScrollbars from '../../../components/CustomScrollbars/CustomScrollbars';
import { getlabel } from '../../../utils/language';
import CustomPagination from '../../../components/Pagination/CustomPagination';
import { setFilters } from '../../../redux/features/mainMaster/userStaffSlice';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';

const NotifyuserModal = ({
  open,
  onClose,
  labels,
  selectedRows,
  setSelectedRows,
  modalFacilityValue,
  setModalfacilityValue,
  SelectedReportId,
  ReportData,
  setNotifiedUserId,
  setNotifiedUsers,
  modalFacilityId,
  setModalFacilityId,
  isAddModal,
  selectedUsers,
  setSelectedUsers,
  selectedUserIds,
  setSelectedUserIds,
  setMatchingStaffNames,
  isEditModal,
  reportFacilityId,
}) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  // const { values, handleChange, setFieldValue, errors, touched } =
  //     useFormikContext();

  

  const { selectedRoleFacility, selectedModuleId, userDetails } = useSelector(
    (state) => state.auth
  );

  const { pageSize, pageIndex } = useSelector(
    (state) => state?.userStaff?.filters
  );

  const filters = useSelector((state) => state.userStaff.filters);

  const [initialValues, setInitialValues] = useState({
    ModalFacility: '',
  });

  // const { pageSize, pageIndex } = useSelector((state) => state.reportGenerator);

  const { data: getFacility = [] } = useGetAllFacilityQuery({
    payload: {
      pageIndex: 1,
      pageSize: 100,
      headerFacility: selectedRoleFacility?.id,
      loginUserId: userDetails?.UserId,
      moduleId: 1,
      menuId: 17,
    },
  });

  const handleFacilityChange = (selectedFacilityId) => {
    setModalFacilityId(selectedFacilityId);
  };

  const shouldSkip = !modalFacilityId

  const {
    data: getStaffData = [],
    isFetching,
    refetch,
    isLoading,
  } = useGetStaffDetailsQuery(
    {
      payload: {
        pageIndex: pageIndex + 1,
        pageSize: pageSize,
        headerFacility: modalFacilityId || reportFacilityId,
        loginUserId: userDetails?.UserId,
        moduleId: 1,
        menuId: 10,
      },
    },
    {
      skip: shouldSkip,
      // refetchOnMountOrArgChange: true,
    }
  );

  const { totalRecords, records } = getStaffData || {
    totalRecords: 0,
    records: [],
  };

  // useEffect(() => {
  //   if (
  //     ReportData?.Data[0]?.UserFacilityId &&
  //     modalFacilityId !== ReportData?.Data[0].UserFacilityId
  //   ) {
  //     setModalFacilityId(ReportData?.Data[0].UserFacilityId); // Update only if different
  //   }
  // }, [ReportData, modalFacilityId]); // Ensure modalFacilityId is included

  useEffect(() => {
    if (isEditModal && ReportData?.Data?.length > 0) {
      const reportFacilityId = ReportData?.Data[0]?.UserFacilityId;
  
      if (!modalFacilityId) {
        setModalFacilityId(reportFacilityId);
        setModalfacilityValue(
          getFacility?.records?.find(
            (facility) => facility.FacilityId === reportFacilityId
          )?.FacilityDetail || ''
        );
      }
    }
  }, [isEditModal, ReportData, getFacility]); 
  

  


  useEffect(() => {
    if (
      (ReportData && ReportData?.Data && ReportData?.Data?.length > 0) ||
      modalFacilityId
    ) {
      setInitialValues({
        Modalfacility: ReportData?.Data[0].UserFacilityId||'',
      });
      setModalfacilityValue(modalFacilityValue);
      // if (modalFacilityId && getStaffData) {
      //   refetch();
      // }
    }
  }, [ReportData, isEditModal]);

  useEffect(() => {
    const matchedNames = records
      ?.filter((record) =>
        selectedUserIds?.some((userId) => userId === record.UserId)
      )
      ?.map((record) => record.StaffName);

    setMatchingStaffNames(matchedNames);
  }, [records, selectedUserIds]);

  const notifyUsersColumns = [
    {
      id: 'EmployeeId',
      translationId: 'MM_RG_EmployeeID',
      isSelected: true,
    },
    { id: 'StaffName', translationId: 'MM_RG_StaffName', isSelected: true },
    {
      id: 'Department',
      translationId: 'MM_RG_Department',
      isSelected: true,
    },
    {
      id: 'PrimaryDesignation',
      translationId: 'MM_RG_Designation',
      isSelected: true,
    },
  ];

  const resetFields = () => {
    setModalFacilityId('');
    // setSearchQuery('');
    // setSelectedUsers([]);
    // setSelectedUserIds([]);
  };

  const handleSubmit = () => {
    event.preventDefault();
    const userNames = selectedUsers
      .map((user) => {
        return user.StaffName;
      })
      .join(', ');

    setNotifiedUsers(userNames);

    const userIds = selectedUsers.map((user) => user.UserId).join(',');

    setNotifiedUserId(userIds);
    setMatchingStaffNames(userNames);
    // resetFields();
    onClose(false);
  };

  const filteredRecords = (records || []).filter(
    (record) =>
      record.StaffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.Department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.PrimaryDesignation.toLowerCase().includes(
        searchQuery.toLowerCase()
      ) ||
      record.EmployeeId.toString().includes(searchQuery)
  );

  // const handleOnPageChange = (event, newPage) => {
  //   dispatch(setPageIndex(newPage));
  // };
  const handleOnPageChange = (event, newPage) => {
    dispatch(
      setFilters({
        ...filters,
        pageIndex: newPage,
      })
    );
  };

  // const handleOnPageSizeChange = (event) => {
  //   dispatch(setPageSize(parseInt(event.target.value, 10)));
  //   dispatch(setPageIndex(0));
  // };
  const handleOnPageSizeChange = (event) => {
    dispatch(
      setFilters({
        ...filters,
        pageIndex: 0,
        pageSize: parseInt(event.target.value, 10),
      })
    );
  };

  const handleCheckboxChange = (row) => {

    const isAlreadySelected = selectedUserIds.includes(row.UserId);

    if (isAlreadySelected) {
      setSelectedUserIds((prevSelectedUserIds) =>
        prevSelectedUserIds.filter((userId) => userId !== row.UserId)
      );
      setSelectedUsers((prevSelectedUsers) =>
        prevSelectedUsers.filter((user) => user.UserId !== row.UserId)
      );
    } else {
      setSelectedUserIds((prevSelectedUserIds) => [
        ...prevSelectedUserIds,
        row.UserId,
      ]);
      setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, row]);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      // Select all rows
      const allUserIds = records.map((row) => row.UserId);
      setSelectedUserIds(allUserIds);
      setSelectedUsers(records);
      setSelectedRows(records.map((_, index) => index));
    } else {
      // Deselect all rows
      setSelectedUserIds([]);
      setSelectedUsers([]);
      setSelectedRows([]);
    }
  };

  useEffect(() => {
    if (isEditModal && ReportData?.Data?.length > 0 && records?.length > 0) {
      const notifyUserNames =
        ReportData.Data[0].NotifyUsersNames?.split(',') || [];

      // Find matching users in `records` by StaffName
      const selectedUsersData = records.filter((row) =>
        notifyUserNames.includes(row.StaffName)
      );

      // Extract their UserIds
      const selectedIds = selectedUsersData.map((user) => user.UserId);

      setSelectedUserIds(selectedIds);
      setSelectedUsers(selectedUsersData);
    }
  }, [isEditModal, ReportData, records]);

  useEffect(() => {
    if (!modalFacilityId) {
      setSelectedUsers([]);
      setSelectedUserIds([]);
    }
  }, [modalFacilityId]);
  

  return (
    <Dialog
      open={open}
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

        <Tooltip title="close" arrow>
          <IconButton
            onClick={() => {
              onClose(false);
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
            <StyledImage src={CloseIcon} alt="Close Icon" />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent padding="0px">
        {isFetching ? (
          <FlexContainer
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
            position="absolute"
            style={{ top: '0', left: '0' }}
          >
            <StyledImage src={LoadingGif} alt="LoadingGif" />
          </FlexContainer>
        ) : (
          <Formik
            enableReinitialize={true}
            initialValues={initialValues}
            validateOnBlur={false}
            onSubmit={(values, { resetForm }) =>
              handleSubmit({ values }, resetForm)
            }
          >
            {({ values, resetForm, submitForm, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                <Grid
                  container
                  spacing={2}
                  display={'flex'}
                  justifyContent={'space-between'}
                  width="100%"
                  marginTop={'1rem'}
                >
                  <Grid item xs={12} sm={12} md={6} padding={'10px'}>
                    <StyledSearch
                      variant="outlined"
                      placeholder="Search by keywords"
                      value={searchQuery}
                      onChange={(event) => {
                        setSearchQuery(event.target.value);
                      }}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <StyledImage src={Search} alt="Search Icon" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={4} padding={'10px'}>
                    <Label value="Facility" isRequired={true} />
                    {/* <Dropdown
              name="Modalfacility"
              fullWidth
              value={modalFacilityId || ''}
              // value={SelectedReportId ? modalFacilityValue  : modalFacilityId || ''}
              onChange={(e) => handleFacilityChange(e.target.value)}
              options={getFacility?.records?.map((facility) => ({
                text: facility.FacilityDetail,
                value: facility.FacilityId,
              }))}
              sx={{ width: '100px', marginBottom: '30px' }}
            /> */}
                    <SearchDropdown
                      disableClearable={true}
                      name="Modalfacility"
                      options={[
                        { text: 'Select', value: '' },
                        ...(getFacility?.records?.map((facility) => ({
                          text: facility.FacilityDetail,
                          value: facility.FacilityId,
                        })) || []),
                      ]}
                      // disabled={isEditModal}
                      getOptionLabel={(option) => option.text}
                      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                      sx={{
                        width: '100px',
                        marginBottom: '30px',
                        '& .MuiAutocomplete-inputRoot': {
                          fontSize: '13px',
                          height: '100%',
                        },
                        '& .MuiOutlinedInput-root': {
                          height: '34px',
                          '& .MuiAutocomplete-input': {
                            height: '34px',
                            fontSize: '13px',
                          },
                        },
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          placeholder="Select"
                        />
                      )}
                      ListboxProps={{
                        sx: {
                          '& .MuiAutocomplete-option': {
                            fontSize: '13px',
                            minHeight: '30px',
                            display: 'flex',
                            alignItems: 'center',
                          },
                        },
                      }}
                      onChange={(event, value) => {
                        setFieldValue('Modalfacility', value?.value);
                        if (value?.value) {
                          handleFacilityChange(value?.value);
                        } else {
                          handleFacilityChange(null); // Optional if you want to reset on clear
                        }
                      }}
                      value={
                        getFacility?.records
                          ?.map((facility) => ({
                            text: facility.FacilityDetail,
                            value: facility.FacilityId,
                          }))
                          .find((option) => option.value === modalFacilityId) ||
                        null
                      }
                    />
                  </Grid>
                </Grid>
                <FlexContainer flexDirection="column" width="100%">
                  <TableContainer component={Paper} className="table-container">
                    <CustomScrollbars
                      // style={{ height: 'auto' }}
                      style={{ height: '1250px' }}
                      rtl={i18n.language === 'ar'}
                    >
                      <Table
                        stickyHeader
                        style={{ borderCollapse: 'collapse' }}
                      >
                        <StyledTableHead>
                          <TableRow>
                            <StyledTableHeaderCell>
                              <Checkbox
                                checked={
                                  selectedRows?.length === records?.length &&
                                  records?.length > 0
                                }
                                onChange={handleSelectAll}
                                sx={{
                                  color: 'white',
                                  '&.Mui-checked': {
                                    color: 'white',
                                  },
                                }}
                              />
                            </StyledTableHeaderCell>
                            {notifyUsersColumns.map((column) => (
                              <StyledTableHeaderCell key={column.id}>
                                {getlabel(
                                  column.translationId,
                                  labels,
                                  i18n.language
                                )}
                              </StyledTableHeaderCell>
                            ))}
                          </TableRow>
                        </StyledTableHead>
                        <TableBody>
                          {filteredRecords.length > 0 ? (
                            filteredRecords.map((row, rowIndex) => (
                              <StyledTableRow key={rowIndex}>
                                <StyledTableBodyCell>
                                  <Checkbox
                                    checked={selectedUserIds.includes(
                                      row.UserId
                                    )}
                                    onChange={() => handleCheckboxChange(row)}
                                  />
                                </StyledTableBodyCell>
                                <StyledTableBodyCell>
                                  {row.EmployeeId}
                                </StyledTableBodyCell>
                                <StyledTableBodyCell>
                                  {row.StaffName}
                                </StyledTableBodyCell>
                                <StyledTableBodyCell>
                                  {row.Department}
                                </StyledTableBodyCell>
                                <StyledTableBodyCell>
                                  {row.PrimaryDesignation}
                                </StyledTableBodyCell>
                              </StyledTableRow>
                            ))
                          ) : (
                            <FlexContainer
                              position="absolute"
                              style={{ top: '50%', left: '50%' }}
                            >
                              No data available
                            </FlexContainer>
                          )}
                        </TableBody>
                      </Table>
                    </CustomScrollbars>
                  </TableContainer>
                  <CustomPagination
                    totalRecords={totalRecords}
                    page={pageIndex}
                    pageSize={pageSize}
                    handleOnPageChange={handleOnPageChange}
                    handleOnPageSizeChange={handleOnPageSizeChange}
                  />

                  <Grid
                    display={'flex'}
                    width="100%"
                    justifyContent={'center'}
                    gap={'10px'}
                    marginBlock={'20px'}
                  >
                    <StyledButton
                      borderRadius="6px"
                      padding="6px 10px"
                      variant="contained"
                      // disabled={!filteredRecords?.length}
                      color="primary"
                      type="submit"
                      sx={{ marginLeft: '10px' }}
                      style={{ display: 'inline-flex', gap: '5px' }}
                      onClick={handleSubmit}
                      startIcon={
                        <StyledImage
                          height="16px"
                          width="16px"
                          src={DoneIcon}
                          alt="WhiteSearch"
                        />
                      }
                    >
                      {t('Submit')}
                    </StyledButton>

                    <StyledButton
                      variant="outlined"
                      border="1px solid #0083c0"
                      backgroundColor="#ffffff"
                      type="button"
                      colour="#0083c0"
                      borderRadius="6px"
                      sx={{ marginLeft: '10px' }}
                      style={{ display: 'inline-flex', gap: '5px' }}
                      onClick={() => {
                        // resetFields();
                        onClose(false);
                      }}
                      startIcon={
                        <StyledImage
                          height="16px"
                          width="16px"
                          src={DndIcon}
                          alt="WhiteSearch"
                        />
                      }
                    >
                      {t('Cancel')}
                    </StyledButton>
                  </Grid>
                </FlexContainer>
              </form>
            )}
          </Formik>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default NotifyuserModal;
