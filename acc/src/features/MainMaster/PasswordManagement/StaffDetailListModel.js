import {
  Checkbox,
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
  Tooltip,
} from '@mui/material';

import Search from '../../../assets/Icons/Search.png';
import {
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../utils/DataTable.styled';
import debounce from 'lodash/debounce';
import { useEffect, useState, useCallback, useMemo } from 'react';
import Label from '../../../components/Label/Label';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../utils/StyledComponents';
import {
  useGetPopupStaffDetailsQuery,
  useLazySendStaffCredentialsMailQuery,
  useLazyGetPasswordMgmtStaffSearchQuery,
} from '../../../redux/RTK/passwordManagementApi';
import { useGetLabelsQuery } from '../../../redux/RTK/moduleDataApi';
import { useDispatch, useSelector } from 'react-redux';
import { getlabel } from '../../../utils/language';
import { useTranslation } from 'react-i18next';
import CloseIcon from '../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import CustomScrollbars from '../../../components/CustomScrollbars/CustomScrollbars';
import CustomPagination from '../../../components/Pagination/CustomPagination';
import {
  setStaffPopupPageIndex,
  setStaffPopupPageSize,
} from '../..//../redux/features/mainMaster/passwordManagementSlice';
import { showToastAlert } from '../../../utils/SweetAlert';
const StaffDetailListModel = ({
  showStaffModal,
  setShowStaffModal,
  facilityId,
  setFacilityId,
  pageFields,
  selectedFacilityId
}) => {
  const staffListColumnsList = [
    {
      id: 'EmployeeId',
      translationId: 'MM_PM_EmployeeID',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'PM_P_EmployeeID')?.IsShow,
    },
    {
      id: 'StaffName',
      translationId: 'MM_PM_StaffName',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'PM_P_StaffName')?.IsShow,
    },
    {
      id: 'Department',
      translationId: 'MM_PM_Department',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'PM_P_DepartmentUnit')
        ?.IsShow,
    },
    {
      id: 'Designation',
      translationId: 'MM_PM_Designation',
      isSelected: true,
      isShow: true,
    },
    {
      id: 'Status',
      translationId: 'MM_PM_Status',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'PM_P_Status')?.IsShow,
    },
  ];

  //* Hooks Declaration
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const { filters, isFilterApplied } = useSelector((state) => state.userStaff);
  const [triggerGetUserStaffSearch] = useLazyGetPasswordMgmtStaffSearchQuery();

  //* Selectors
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    selectedRoleFacility,
  } = useSelector((state) => state.auth);
  const { staffPopupPageIndex, staffPopupPageSize } = useSelector(
    (state) => state.passwordManagement
  );

  //* State Variables
  const [staffList, setStaffList] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [roleMenu, setRoleMenu] = useState();
  const [staffSearchKeyword, setStaffSearchKeyword] = useState('');
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, settotalPages] = useState(0)
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isSearch, setIsSearch] = useState(false)
  const [isSearchApplied, setIsSearchApplied] = useState(false)

  //* RTK Queries

  const [triggerSendMail, { isLoading: mailSending }] =
    useLazySendStaffCredentialsMailQuery();

  const { data: labels = [] } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  //* Fetch staffs details
  const { data: getStaffData = [], isFetching } = useGetPopupStaffDetailsQuery(
    {
      payload: {
        pageIndex: staffPopupPageIndex + 1,
        pageSize: staffPopupPageSize,
        headerFacility: facilityId,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    },
    {
      skip: !facilityId || !selectedModuleId || !selectedMenu?.id,
      refetchOnMountOrArgChange: true || staffSearchKeyword !== ""
    }
  );
  useEffect(() => {
    if (!isSearchApplied) {
      const { totalRecords, records,totalPages } = getStaffData || {
        totalRecords: 0,
        records: [],
        totalPages:0
      };
      if (records?.length > 0) {
        const updatedRecords = records.map((staff) => ({
          ...staff,
          isSelected: false,
        }));
        setStaffList(updatedRecords);
        setTotalRecords(totalRecords)
        settotalPages(totalPages)
        setFilteredRecords(updatedRecords);
      } else {
        setStaffList([]);
        setTotalRecords(0)
        settotalPages(0)
        setFilteredRecords([]);
      }
    }
  }, [getStaffData, isSearchApplied]);

  const searchByKeyWords = useCallback(
    async (keyword) => {
      setIsSearch(true)
      try {        
        if (keyword === "" && isSearchApplied) {
          setIsSearchApplied(false)
          refetch()
          return
        }
        const response = await triggerGetUserStaffSearch({
          pageIndex: staffPopupPageIndex + 1,
          pageSize: staffPopupPageSize,
          headerFacility: facilityId,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
          keyword: keyword,
        }).unwrap();        
        if (response?.records.length> 0) {
          const updatedRecords = response?.records.map((staff) => ({
            ...staff,
            isSelected: false,
          }));
          setIsSearch(false)
          settotalPages(totalPages)
          setTotalRecords(response?.totalRecords)
          setStaffList(updatedRecords);    
          setFilteredRecords([...(updatedRecords || [])]);
        } else {
          setTotalRecords(0)
          settotalPages(0)
          setStaffList([]);
          setFilteredRecords([]);
        }
      } catch (err) {
        if (err.data) {
          setIsSearch(false)
          setTotalRecords(0)
          settotalPages(0)
          setStaffList([]);
          setFilteredRecords([]);
        }
      } finally {
        setIsSearch(false)
      }
    },
    [staffPopupPageIndex,staffPopupPageSize, selectedFacility, userDetails, selectedModuleId, selectedMenu, isSearchApplied]
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((keyword) => {
        searchByKeyWords(keyword); // Call the search function
      }, 800), // Debounce delay in ms
    [searchByKeyWords]
  );
  useEffect(() => {
    return () => {
      debouncedSearch.cancel(); // Cancel pending debounced calls
    };
  }, [debouncedSearch]);
  useEffect(() => {
    //when filters change with userSearchKeyword
    if (staffSearchKeyword) {
      debouncedSearch(staffSearchKeyword)
    }
  }, [staffPopupPageIndex,staffPopupPageSize])

  useEffect(() => {
    //when clear userSearchKeyword then  call refetch
    if (!staffSearchKeyword && isSearchApplied) {
      debouncedSearch(staffSearchKeyword)
    }
  }, [staffSearchKeyword,isSearchApplied])

 
  //* Effect to set role menu
  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  //* Select all checkboxes
  const selectAllCheckboxes = () => {
    setSelectAll((prevSelectAll) => {
      const newSelectAll = !prevSelectAll;
      setStaffList(
        staffList.map((staff) => ({
          ...staff,
          isSelected: newSelectAll,
        }))
      );
      setFilteredRecords(
        staffList.map((staff) => ({
          ...staff,
          isSelected: newSelectAll,
        }))
      );
      return newSelectAll;
    });
  };

  //* Select single select box
  const selectSingleSelectBox = (userId) => {
    setStaffList((prevStaffList) => {
      const updatedList = prevStaffList.map((staff) =>
        staff.UserId === userId
          ? { ...staff, isSelected: !staff.isSelected }
          : staff
      );
      const allSelected = updatedList.every((staff) => staff.isSelected);
      setSelectAll(allSelected);
      return updatedList;
    });
    setFilteredRecords((prevStaffList) => {
      const updatedList = prevStaffList.map((staff) =>
        staff.UserId === userId
          ? { ...staff, isSelected: !staff.isSelected }
          : staff
      );
      const allSelected = updatedList.every((staff) => staff.isSelected);
      setSelectAll(allSelected);
      return updatedList;
    });
  };

  //* Submit to send selected staff mail
  const submitToNotify = async () => {
    const selectedStaffs = staffList
      .filter((x) => x.isSelected)
      .map((x) => x.UserId)
      .join(',');

    if (selectedStaffs) {
      let response = await triggerSendMail({
        userIds: selectedStaffs,
        menuId: selectedMenu?.id,
        moduleId: selectedModuleId,
        loginUserId: userDetails?.UserId,
        headerFacilityId: selectedFacility?.id,
        facilityId: facilityId,
      }).unwrap();
      if (response && response?.Message === 'Mail Sent Sucessfully') {
        showToastAlert({
          type: 'custom_success',
          text: 'Mail Sent Sucessfully',
        });
        setFacilityId(null);
        setShowStaffModal(false);
      }
    }
  };

  //* Close staff list modal
  const closeStaffList = () => {
    const updatedRecords = staffList.map((staff) => ({
      ...staff,
      isSelected: false,
    }));
    dispatch(setStaffPopupPageIndex(0));
    dispatch(setStaffPopupPageSize(25));
    setStaffSearchKeyword('');
    setStaffList(updatedRecords);
    setFilteredRecords([]);
    setSelectAll(false);
    setShowStaffModal(false);
    setFacilityId(null);
  };

  //* Handlers for pagination
  const handleOnPageChange = (event, newPage) => {
    dispatch(setStaffPopupPageIndex(newPage));
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(setStaffPopupPageSize(parseInt(event.target.value, 10)));
    dispatch(setStaffPopupPageIndex(0));
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
          height: isFetching || mailSending ? '50vh' : 'auto',
          overflow: isFetching || mailSending ? 'hidden' : 'auto',
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
            onClick={closeStaffList}
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
                  placeholder={t('SearchByKeywords')}
                  fullWidth={true}
                  margin="normal"
                  value={staffSearchKeyword}
                  onChange={(event) => {
                    const searchTerm = event.target.value?.toLowerCase();
                    dispatch(setStaffPopupPageIndex(0));
                    dispatch(setStaffPopupPageSize(25));
                    setStaffSearchKeyword(searchTerm);
                    setIsSearchApplied(true)                          
                    debouncedSearch(searchTerm)
                   
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment
                        position="start"
                        style={{ paddingInlineStart: '10px' }}
                      >
                        <img src={Search} alt="Search Icon" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
        {isFetching || mailSending|| isSearch  ? (
          <FlexContainer
            justifyContent="center" 
          >
            <StyledImage src={LoadingGif} alt="LoadingGif" />
          </FlexContainer>
        ):(
          <FlexContainer flexDirection="column" width="100%">
          <TableContainer component={Paper} className="table-container">
            <CustomScrollbars
              style={{ height: '350px' }}
              rtl={i18n.language === 'ar'}
            >
              <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
                <StyledTableHead>
                  <TableRow>
                    <StyledTableHeaderCell style={{ padding: '0px 15px' }}>
                      <Checkbox
                        iconStyle={{ fill: 'white' }}
                        inputStyle={{ color: 'white' }}
                        style={{ color: 'white' }}
                        checked={selectAll}
                        onChange={() => {
                          selectAllCheckboxes();
                        }}
                      />
                    </StyledTableHeaderCell>
                    {staffListColumnsList
                      ?.filter((col) => col.isSelected && col.isShow)
                      ?.map((column) => (
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
                  {filteredRecords?.length > 0 ? (
                    filteredRecords?.map((row, rowIndex) => (
                      <StyledTableRow key={row.EmployeeId}>
                        <StyledTableBodyCell
                          style={{ padding: '0px 15px' }}
                        >
                          <Checkbox
                            iconStyle={{ fill: 'white' }}
                            inputStyle={{ color: '#0083c0' }}
                            style={{ color: '#0083c0' }}
                            checked={row.isSelected}
                            onClick={() =>
                              selectSingleSelectBox(row.UserId)
                            }
                          />
                        </StyledTableBodyCell>
                        {staffListColumnsList
                          ?.filter((col) => col.isSelected && col.isShow)
                          .map((column) => {
                            return (
                              <StyledTableBodyCell
                                key={column.id}
                                status={
                                  column.id === 'Status'
                                    ? row[column.id]
                                    : ''
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
                    <TableRow>
                      <StyledTableBodyCell colSpan={staffListColumnsList.length + 2} align="center">
                        {t('NoDataAvailable')}
                      </StyledTableBodyCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CustomScrollbars>
          </TableContainer>
          {
            totalRecords>0&&
            <CustomPagination
            totalRecords={totalRecords || 0}
            page={staffPopupPageIndex}
            pageSize={staffPopupPageSize}
            handleOnPageChange={handleOnPageChange}
            handleOnPageSizeChange={handleOnPageSizeChange}
          />
          }
         

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
              disabled={!filteredRecords?.length}
              color="primary"
              type="submit"
              sx={{ marginLeft: '10px' }}
              style={{ display: 'inline-flex', gap: '5px' }}
              onClick={submitToNotify}
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
              onClick={closeStaffList}
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
        )}
           
          
        
      </DialogContent>
    </Dialog>
  );
};

export default StaffDetailListModel;
