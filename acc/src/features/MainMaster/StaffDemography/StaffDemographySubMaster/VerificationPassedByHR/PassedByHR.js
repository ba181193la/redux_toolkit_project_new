import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
} from '../../../../../utils/StyledComponents';
import Label from '../../../../../components/Label/Label';
import SearchDropdown from '../../../../../components/SearchDropdown/SearchDropdown';
import { checkAccess } from '../../../../../utils/Auth';
import LoadingGif from '../../../../../assets/Gifs/LoadingGif.gif';
import PlusIcon from '../../../../../assets/Icons/AddSubMaster.png';
import EditIcon from '../../../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../../../assets/Icons/DeleteIcon.png';
import ExpandIcon from '../../../../../assets/Icons/ExpandIcon.png';
import DeleteUserGif from '../../../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../../../assets/Gifs/SuccessGif.gif';
import SearchIcon from '../../../../../assets/Icons/Search.png';
import CustomScrollbars from '../../../../../components/CustomScrollbars/CustomScrollbars';
import {
  setVerificationStatusPassedByHRPageIndex,
  setVerificationStatusPassedByHRPageSize,
} from '../../../../../redux/features/mainMaster/staffDemographySlice';
import {
  ActionCell,
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../../../utils/DataTable.styled';
import CustomPagination from '../../../../../components/Pagination/CustomPagination';
import { getlabel } from '../../../../../utils/language';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import AddEditPassedByHR from './AddEditPassedByHR';

const PassedByHR = ({ labels, fieldAccess }) => {
  //* Hooks declaration
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const refetch = [];

  //* Selectors
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    isSuperAdmin,
    selectedRoleFacility,
  } = useSelector((state) => state.auth);

  const { pageIndex, pageSize } = useSelector(
    (state) => state?.staffDemography?.verificationStatusPassedByHR
  );

  //* State variables
  const [showPassedByModal, setShowPassedByModal] = useState(false);
  const [selectedPassedById, setSelectedPassedById] = useState(null);
  const [roleMenu, setRoleMenu] = useState();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [fieldLabels, setFieldLabels] = useState([]);
  const [facilityList, setFacilityList] = useState([]);
  const [passedByList, setPassedByList] = useState([]);
  const [filteredFacility, setFilteredFacility] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState(null);

  // //* Handlers for pagination
  const handleOnPageChange = (event, newPage) => {
    dispatch(setVerificationStatusPassedByHRPageIndex(newPage));
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(
      setVerificationStatusPassedByHRPageSize(
        parseInt(event?.target?.value, 10)
      )
    );
    dispatch(setVerificationStatusPassedByHRPageIndex(0));
  };

  //* Sorting table columns
  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const orderedPassedByList = [...passedByList].sort((a, b) => {
    const aValue = a[orderBy]?.toString().toLowerCase();
    const bValue = b[orderBy]?.toString().toLowerCase();

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  //* Filtering fields access  data

  const pageFields = fieldAccess?.Data?.Sections?.find(
    (sectionName) =>
      sectionName?.SectionName === 'Staff Demography Verification Passed by HR'
  )?.Fields;

  //* Variables declaration
  const tableColumnList = [
    {
      id: 'Facility',
      translationId: 'MM_SF_VPHR_Facility',
      isShow: pageFields?.find((x) => x.FieldId === 'SF_VPHR_Facility')?.IsShow,
    },
    {
      id: 'VerificationStatus',
      translationId: 'MM_SF_VPHR_StaffDemographyVerificationPassedbyHR',
      isShow: pageFields?.find(
        (x) => x.FieldId === 'SF_VPHR_StaffDemographyVerificationPassedbyHR'
      )?.IsShow,
    },
    {
      id: 'AddedEditedBy',
      translationId: 'MM_SF_VPHR_AddedEditedBy',
      isShow: pageFields?.find((x) => x.FieldId === 'SF_VPHR_AddedEditedBy')
        ?.IsShow,
    },
    {
      id: 'AddedEditedDate',
      translationId: 'MM_SF_VPHR_AddedEditedDate',
      isShow: pageFields?.find((x) => x.FieldId === 'SF_VPHR_AddedEditedDate')
        ?.IsShow,
    },
  ];

  //* Use Effects to bind data

  useEffect(() => {
    if (labels?.Data) {
      setFieldLabels(labels?.Data);
    }
  }, [labels]);

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  //* Edit passed by details
  const editPassedBy = (statusId) => {
    setSelectedPassedById(statusId);
    setShowPassedByModal(true);
  };

  //* Delete Verification Status
  const deletePassedBy = (statusId) => {
    const callback = async () => {
      try {
        await triggerDeleteReferenceNumber({
          incidentReferenceId: statusId,
          loginUserId: userDetails?.UserId,
          menuId: selectedMenu?.id,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Staff Demography Verification Status Passed By has been deleted.',
          timer: 3000,
          gif: SuccessGif,
          height: 250,
          width: 250,
        });
        refetch();
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
    <Accordion sx={{ border: '5px', borderColor: '#0083c0' }} expanded={true}>
      <AccordionSummary
        style={{ padding: '0 10px' }}
        sx={{
          backgroundColor: '#0083c0',
          borderRadius: '8px 8px 0px 0px',
          width: '100%',
          border: '1px solid #0083c0',
        }}
      >
        <Typography
          fontWeight="700"
          lineHeight="20px"
          textAlign="center"
          color="#FFFFFF"
          sx={{
            fontSize: {
              xs: '0.875rem',
              sm: '0.875rem',
              md: '1rem',
              lg: '1rem',
            },
          }}
        >
          {getlabel(
            'MM_SF_VPHR_StaffDemographyVerificationPassedbyHR',
            {
              Data: fieldLabels,
              Status: labels?.Status,
            },
            i18n.language
          )}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          width: '100%',
          height: '100%',
          padding: '0px',
          border: '1px solid #0083c0',
        }}
      >
        <FlexContainer
          flexDirection="column"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <FlexContainer
            style={{
              margin: '10px',
              justifyContent: 'space-between',
              width: '100%',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
            }}
          >
            <Grid
              item
              padding={'10px'}
              width="50%"
              sx={{
                width: {
                  xs: '100%',
                  sm: '100%',
                  md: '50%',
                  lg: '25%',
                  xl: '25%',
                },
              }}
            >
              <Label
                value={getlabel(
                  fieldLabels?.find(
                    (x) => x.TranslationId === 'MM_SF_VPHR_Facility'
                  )?.TranslationId,
                  {
                    Data: fieldLabels,
                    Status: labels?.Status,
                  },
                  i18n.language
                )}
              />
              <SearchDropdown
                disableClearable={true}
                name="facility"
                options={[
                  { text: 'Select', value: '' },
                  ...(userDetails?.ApplicableFacilities?.filter((facility) => {
                    if (!facility.IsActive) return false;
                    if (isSuperAdmin) return true;
                    const facilityItem = roleFacilities
                      ?.find((role) => role.FacilityId === facility.FacilityId)
                      ?.Menu?.find(
                        (MenuItem) => MenuItem.MenuId === selectedMenu?.id
                      );
                    return facilityItem?.IsView;
                  }).map((facility) => ({
                    text: facility.FacilityName,
                    value: facility.FacilityId,
                  })) ||
                    [] ||
                    []),
                ]}
                getOptionLabel={(option) => option.text}
                dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                sx={{
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
                  setFilteredFacility(value?.value);
                  refetch();
                }}
              />
            </Grid>
            <StyledSearch
              width="50%"
              variant="outlined"
              placeholder={t('SearchByKeywords')}
              value={searchKeyword}
              onChange={(event) => {
                setSearchKeyword(event.target.value);
              }}
              style={{
                margin: '0 !important',
                marginBottom: '0 !important',
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
            {checkAccess(
              isSuperAdmin,
              roleMenu?.IsView,
              roleMenu?.IsAdd || false
            ) && (
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                padding={'10px'}
                flexWrap="wrap"
              >
                <StyledButton
                  onClick={() => {
                    setShowPassedByModal(true);
                  }}
                  fontSize="12px"
                  style={{ display: 'inline-flex', gap: '8px' }}
                  //disabled={isFetching}
                >
                  <StyledImage
                    src={PlusIcon}
                    height={'0.8rem'}
                    width={'0.8rem'}
                  />
                  {t('Add')}
                </StyledButton>
              </Grid>
            )}
          </FlexContainer>
          <FlexContainer flexDirection="column" width="100%" padding="10px">
            <TableContainer
              component={Paper}
              style={{ border: '1px solid #99cde6' }}
            >
              <CustomScrollbars
                style={{
                  height: orderedPassedByList?.length > 0 ? '350px' : '85px',
                }}
                rtl={i18n.language === 'ar'}
              >
                {false ? (
                  // {isFetching ? (
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
                  <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
                    <StyledTableHead>
                      <TableRow>
                        <StyledTableHeaderCell>
                          {t('SNo')}
                        </StyledTableHeaderCell>
                        {tableColumnList
                          ?.filter((x) => x.isShow)
                          ?.map((column) => (
                            <StyledTableHeaderCell key={column.id}>
                              <TableSortLabel
                                style={{ 'text-wrap-mode': 'nowrap' }}
                                active={orderBy === column.id}
                                direction={
                                  orderBy === column.id ? order : 'asc'
                                }
                                onClick={() => handleSortRequest(column.id)}
                              >
                                {getlabel(
                                  column.translationId,
                                  {
                                    Data: fieldLabels,
                                    Status: labels?.Status,
                                  },
                                  i18n.language
                                )}
                              </TableSortLabel>
                            </StyledTableHeaderCell>
                          ))}
                        {checkAccess(
                          isSuperAdmin,
                          roleMenu?.IsView,
                          roleMenu?.IsEdit || roleMenu?.IsDelete || false
                        ) && (
                          <StyledTableHeaderCell>
                            {t('Actions')}
                          </StyledTableHeaderCell>
                        )}
                      </TableRow>
                    </StyledTableHead>
                    {orderedPassedByList?.length > 0 ? (
                      <TableBody>
                        {orderedPassedByList?.map((row, rowIndex) => (
                          <StyledTableRow key={rowIndex} borderColor="#0083c0">
                            <StyledTableBodyCell>
                              {pageIndex * pageSize + rowIndex + 1}
                            </StyledTableBodyCell>
                            {tableColumnList
                              ?.filter((x) => x.isShow)
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
                            {checkAccess(
                              isSuperAdmin,
                              roleMenu?.IsView,
                              roleMenu?.IsEdit || roleMenu?.IsDelete || false
                            ) && (
                              <ActionCell>
                                <FlexContainer className="action-icons">
                                  {checkAccess(
                                    isSuperAdmin,
                                    roleMenu?.IsView,
                                    roleMenu?.IsEdit || false
                                  ) && (
                                    <Tooltip title="Edit" arrow>
                                      <StyledImage
                                        cursor="pointer"
                                        height="12.5px"
                                        width="12.5px"
                                        src={EditIcon}
                                        alt="Edit"
                                        onClick={() => editPassedBy(row.TabId)}
                                      />
                                    </Tooltip>
                                  )}
                                  {checkAccess(
                                    isSuperAdmin,
                                    roleMenu?.IsView,
                                    roleMenu?.IsDelete || false
                                  ) && (
                                    <Tooltip title="Delete" arrow>
                                      <StyledImage
                                        cursor="pointer"
                                        height="12.5px"
                                        width="12.5px"
                                        src={DeleteIcon}
                                        alt="Delete"
                                        onClick={() =>
                                          deletePassedBy(row?.TabId)
                                        }
                                      />
                                    </Tooltip>
                                  )}
                                </FlexContainer>
                              </ActionCell>
                            )}
                          </StyledTableRow>
                        ))}
                      </TableBody>
                    ) : (
                      <TableBody>
                        <StyledTableRow>
                          <StyledTableBodyCell
                            colSpan={
                              tableColumnList?.filter((col) => col.isShow)
                                .length + 2
                            }
                            style={{ textAlign: 'center' }}
                          >
                            {t('NoDataAvailable')}
                          </StyledTableBodyCell>
                        </StyledTableRow>
                      </TableBody>
                    )}
                  </Table>
                )}
              </CustomScrollbars>
            </TableContainer>
            <CustomPagination
              totalRecords={totalRecords}
              page={pageIndex}
              pageSize={pageSize}
              handleOnPageChange={handleOnPageChange}
              handleOnPageSizeChange={handleOnPageSizeChange}
            />
          </FlexContainer>
        </FlexContainer>
        {showPassedByModal && (
          <AddEditPassedByHR
            showPassedByModal={showPassedByModal}
            setShowPassedByModal={setShowPassedByModal}
            selectedPassedById={selectedPassedById}
            setSelectedPassedById={setSelectedPassedById}
            labels={labels}
            refetch={refetch}
            fieldAccess={fieldAccess}
          />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default PassedByHR;
