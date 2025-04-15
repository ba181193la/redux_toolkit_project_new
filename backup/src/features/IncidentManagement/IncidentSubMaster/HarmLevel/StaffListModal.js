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
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import { useGetPopupStaffDetailsQuery } from '../../../../redux/RTK/passwordManagementApi';
import { useDispatch, useSelector } from 'react-redux';
import { getlabel } from '../../../../utils/language';
import { useTranslation } from 'react-i18next';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import {
  setStaffPopupPageIndex,
  setStaffPopupPageSize,
} from '../../../../redux/features/IncidentManagement/incidentSubMasterSlice';
import { showToastAlert } from '../../../../utils/SweetAlert';
const StaffListModal = ({
  showStaffModal,
  setShowStaffModal,
  labels,
  facilityList,
  notiStaffList,
  setNotiStaffList,
  setStaffIdToEdit,
  staffIdToEdit,
  setFieldValue,
  fieldAccess,
}) => {
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

  //* Field access checking
  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) => sectionName?.SectionName === 'Harm Level-Page'
    )
    ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields;

  //* State Variables
  const [staffList, setStaffList] = useState([]);
  const [roleMenu, setRoleMenu] = useState();
  const [facilityId, setFacilityId] = useState('');
  const [staffSearchKeyword, setStaffSearchKeyword] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [fieldLabels, setFieldLabels] = useState([]);

  const staffListColumnsList = [
    {
      id: 'Facility',
      translationId: 'IM_IS_IT_Facility',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_HL_P_Facility')?.IsShow,
    },
    {
      id: 'EmployeeId',
      translationId: 'IM_IS_IT_EmployeeId',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_HL_P_EmployeeId')
        ?.IsShow,
    },
    {
      id: 'StaffName',
      translationId: 'IM_IS_IT_StaffName',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_HL_P_StaffName')
        ?.IsShow,
    },
    {
      id: 'Department',
      translationId: 'IM_IS_IT_Department',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_HL_P_Department')
        ?.IsShow,
    },
    {
      id: 'PrimaryDesignation',
      translationId: 'IM_IS_IT_Designation',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_HL_P_Designation')
        ?.IsShow,
    },
  ];

  //* RTK Queries

  const {
    data: getStaffData = [],
    isFetching,
    refetch,
  } = useGetPopupStaffDetailsQuery(
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
      refetchOnMountOrArgChange: true,
    }
  );

  const { totalRecords, records } = getStaffData || {
    totalRecords: 0,
    records: [],
  };

  //* Use Effect to bind values
  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  useEffect(() => {
    if (records?.length > 0) {
      setStaffList(records);
      setFilteredRecords(records);
    } else {
      setStaffList([]);
      setFilteredRecords([]);
    }
  }, [records]);

  useEffect(() => {
    setFieldValue('notiStaffList', notiStaffList);
  }, [notiStaffList]);

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

  //* Add notification staff list
  const addNotificationStaff = (staff) => {
    const existRowIndex = notiStaffList?.findIndex(
      (x) => x.userId === staff?.UserId
    );

    if (existRowIndex !== -1) {
      setShowStaffModal(false);
      setFacilityId(null);
      showToastAlert({
        type: 'custom_info',
        text: `Staff already exists at row ${existRowIndex + 1}`,
      });
    } else {
      if (staffIdToEdit !== null && staffIdToEdit !== undefined) {
        const tempStaffList = [...notiStaffList];
        tempStaffList[staffIdToEdit] = {
          facility: staff?.Facility,
          userId: staff?.UserId,
          userName: staff?.StaffName,
          departmentName: staff?.Department,
          designationName: staff?.PrimaryDesignation,
        };
        setNotiStaffList(tempStaffList);
      } else {
        setNotiStaffList((prev) => [
          ...prev,
          {
            facility: staff?.Facility,
            userId: staff?.UserId,
            userName: staff?.StaffName,
            departmentName: staff?.Department,
            designationName: staff?.PrimaryDesignation,
          },
        ]);
      }
      setFacilityId(null);
      setStaffIdToEdit(null);
      setShowStaffModal(false);
    }
  };

  //* Close staff list modal
  const closeStaffList = () => {
    dispatch(setStaffPopupPageIndex(0));
    dispatch(setStaffPopupPageSize(25));
    setStaffSearchKeyword('');
    setStaffList(staffList);
    setFilteredRecords([]);
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
              <Grid item xs={12} sm={12} md={4} padding={'10px'}>
                <StyledSearch
                  variant="outlined"
                  placeholder={t('SearchByKeywords')}
                  fullWidth
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
                          item.Facility?.toLowerCase().includes(searchTerm) ||
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
                        <img src={Search} alt="Search Icon" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} padding={'10px'}>
                <Label
                  value={getlabel(
                    'IM_IS_IT_Facility',
                    {
                      Data: fieldLabels,
                      Status: labels?.Status,
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
                  style={{ height: '350px', border: '1px solid #00000033' }}
                  rtl={i18n.language === 'ar'}
                >
                  <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
                    <StyledTableHead>
                      <TableRow>
                        <StyledTableHeaderCell>
                          {t('SNo')}
                        </StyledTableHeaderCell>
                        {staffListColumnsList
                          ?.filter((x) => x?.isShow)
                          ?.map((column) => (
                            <StyledTableHeaderCell key={column.id}>
                              {getlabel(
                                column?.translationId,
                                {
                                  Data: fieldLabels,
                                  Status: labels?.Status,
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
                          <StyledTableRow
                            key={row.EmployeeId}
                            onClick={() => addNotificationStaff(row)}
                          >
                            <StyledTableBodyCell>
                              {staffPopupPageIndex * staffPopupPageSize +
                                rowIndex +
                                1}
                            </StyledTableBodyCell>
                            {staffListColumnsList
                              ?.filter((x) => x?.isShow)
                              ?.map((column) => {
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

              <CustomPagination
                totalRecords={totalRecords || 0}
                page={staffPopupPageIndex}
                pageSize={staffPopupPageSize}
                handleOnPageChange={handleOnPageChange}
                handleOnPageSizeChange={handleOnPageSizeChange}
              />
            </FlexContainer>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StaffListModal;
