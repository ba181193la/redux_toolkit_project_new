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

import Search from '../../../../assets/Icons/Search.png';
import {
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../../utils/DataTable.styled';
import { useEffect, useState } from 'react';
import Label from '../../../../components/Label/Label';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { useGetLabelsQuery } from '../../../../redux/RTK/moduleDataApi';
import { useDispatch, useSelector } from 'react-redux';
import { getlabel } from '../../../../utils/language';
import { useTranslation } from 'react-i18next';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import {
  setStaffPopupPageIndex,
  setStaffPopupPageSize,
} from '../../../../redux/features/IncidentManagement/incidentSubMasterSlice';
import { showToastAlert } from '../../../../utils/SweetAlert';
import { useGetPopupStaffDetailsQuery } from '../../../../redux/RTK/passwordManagementApi';
import Dropdown from '../../../../components/Dropdown/Dropdown';
const StaffDetailListModel = ({
  showStaffModal,
  setShowStaffModal,
  selectedStaffList,
  setSelectedStaffList,
  pageFields,
  fieldLabels,
  labelStatus,
  facilityList,
  staffFacilityId,
}) => {
  const staffListColumnsList = [
    {
      id: 'Facility',
      translationId: 'IM_IS_ISDA_Facility',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_ISDA_P_Facility')
        ?.IsShow,
    },
    {
      id: 'EmployeeId',
      translationId: 'IM_IS_ISDA_EmployeeId',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_ISDA_P_EmployeeId')
        ?.IsShow,
    },
    {
      id: 'StaffName',
      translationId: 'IM_IS_ISDA_StaffName',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_ISDA_P_StaffName')
        ?.IsShow,
    },
    {
      id: 'Department',
      translationId: 'IM_IS_ISDA_Department',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_ISDA_P_Department')
        ?.IsShow,
    },
    {
      id: 'Designation',
      translationId: 'IM_IS_ISDA_Designation',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_ISDA_P_Designation')
        ?.IsShow,
    },
  ];

  //* Hooks Declaration
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();

  //* Selectors
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    selectedRoleFacility,
  } = useSelector((state) => state.auth);
  const { staffPopupPageIndex, staffPopupPageSize } = useSelector(
    (state) => state.incidentSubMaster
  );

  //* State Variables
  const [staffList, setStaffList] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [facilityId, setFacilityId] = useState(staffFacilityId || '');
  const [roleMenu, setRoleMenu] = useState();
  const [staffSearchKeyword, setStaffSearchKeyword] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);

  //* Fetch staffs details
  const { data: getStaffData = [], isFetching } = useGetPopupStaffDetailsQuery(
    {
      payload: {
        pageIndex: staffPopupPageIndex + 1,
        pageSize: staffPopupPageSize,
        headerFacility: facilityId || staffFacilityId,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    },
    {
      skip:
        (!facilityId && !staffFacilityId) ||
        !selectedModuleId ||
        !selectedMenu?.id,

      refetchOnMountOrArgChange: true,
    }
  );

  const { totalRecords, records } = getStaffData || {
    totalRecords: 0,
    records: [],
  };

  useEffect(() => {
    if (records?.length > 0) {
      const selectedStaffs = selectedStaffList?.split(',');
      const updatedRecords = records.map((staff) => ({
        ...staff,
        isSelected: selectedStaffs?.includes(staff?.UserId.toString()),
      }));
      if (selectedStaffs?.length === staffPopupPageSize) {
        setSelectAll(true);
      }
      setStaffList(updatedRecords);
      setFilteredRecords(updatedRecords);
    } else {
      setStaffList([]);
      setFilteredRecords([]);
    }
  }, [records]);

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
  const submitToNotify = () => {
    const selectedStaffs = staffList
      .filter((x) => x.isSelected)
      .map((x) => x.UserId)
      .join(',');

    setSelectedStaffList(selectedStaffs);
    setShowStaffModal(false);
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
          <>
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
                    setStaffSearchKeyword(event.target.value);

                    if (searchTerm?.length < 1) {
                      setFilteredRecords(staffList);
                      return;
                    }
                    setFilteredRecords(
                      staffList?.filter(
                        (item) =>
                          item.EmployeeId?.toLowerCase().includes(searchTerm) ||
                          item.StaffName?.toLowerCase().includes(searchTerm) ||
                          item.Department?.toLowerCase().includes(searchTerm) ||
                          item.Designation?.toLowerCase().includes(
                            searchTerm
                          ) ||
                          item.Status?.toLowerCase().includes(searchTerm)
                      ) || []
                    );
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
              <Grid item xs={12} sm={12} md={4} padding={'10px'}>
                <Label
                  value={getlabel(
                    'IM_IS_ISDA_Facility',
                    {
                      Data: fieldLabels,
                      Status: labelStatus,
                    },
                    i18n.language
                  )}
                  isRequired={true}
                />
                <Dropdown
                  name="facilityId"
                  value={facilityId}
                  options={[
                    { text: 'Select', value: '' },
                    ...(facilityList
                      ?.map((facility) => {
                        const facilityItem =
                          userDetails?.ApplicableFacilities?.find(
                            (x) => x.FacilityId === facility.FacilityId
                          );
                        if (facilityItem) {
                          return {
                            text: facility.FacilityName,
                            value: facility.FacilityId,
                          };
                        }
                        return null;
                      })
                      .filter((item) => item !== null) || []),
                  ]}
                  required={false}
                  onChange={(event) => {
                    {
                      if (event.target.value) {
                        setFacilityId(event.target.value);
                        dispatch(setStaffPopupPageIndex(0));
                        dispatch(setStaffPopupPageSize(25));
                      } else {
                        setFilteredRecords([]);
                      }
                    }
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
                          ?.filter((col) => col.isShow)
                          ?.map((column) => (
                            <StyledTableHeaderCell key={column.id}>
                              {getlabel(
                                column?.translationId,
                                {
                                  Data: fieldLabels,
                                  Status: labelStatus,
                                },
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
                              ?.filter((col) => col.isShow)
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
                          <StyledTableBodyCell
                            colSpan={staffListColumnsList.length + 2}
                            align="center"
                          >
                            {t('NoDataAvailable')}
                          </StyledTableBodyCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CustomScrollbars>
              </TableContainer>
              <CustomPagination
                totalRecords={totalRecords || 0}
                page={staffPopupPageIndex}
                pageSize={staffPopupPageSize}
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StaffDetailListModel;
