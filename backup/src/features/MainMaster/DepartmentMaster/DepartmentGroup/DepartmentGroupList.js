import { useTranslation } from 'react-i18next';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import BackArrow from '../../../../assets/Icons/white/left-arrow.png';
import PlusIcon from '../../../../assets/Icons/AddSubMaster.png';
import SearchIcon from '../../../../assets/Icons/Search.png';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import debounce from 'lodash/debounce';
import {
  Divider,
  InputAdornment,
  Table,
  TableBody,
  TableRow,
  TableContainer,
  Paper,
  Tooltip,
  TableSortLabel,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useMemo, useCallback } from 'react';
import {
  ActionCell,
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../../utils/DataTable.styled';
import { useDispatch, useSelector } from 'react-redux';
import {
  useDeleteDepartmentGroupMutation,
  useGetDepartmentGroupDetailsQuery,
  useLazyGetAllDepartmentGroupSearchQuery,
} from '../../../../redux/RTK/departmentMasterApi';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import '../../../../redux/features/mainMaster/departmentMasterSlice';
import { getlabel } from '../../../../utils/language';
import {
  setDepartmentGroupPageIndex,
  setDepartmentGroupPageSize,
} from '../../../../redux/features/mainMaster/departmentMasterSlice';
import AddEditDepartmentGroup from './AddEditDepartmentGroup';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import formatDate from '../../../../utils/FormatDate';
import { showSweetAlert } from '../../../../utils/SweetAlert';
import DeleteUserGif from '../../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import { checkAccess } from '../../../../utils/Auth';

const DepartmentGroup = ({ selectedFacilityId }) => {
  //* Hooks declaration
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [triggereGetAllDepartmentGroup] =
    useLazyGetAllDepartmentGroupSearchQuery();

  //* Selectors
  const { pageIndex, pageSize } = useSelector(
    (state) => state.departmentMaster.departmentGroup
  );
  //* State variables
  const [showDepartmentGroupModal, setShowDepartmentGroupModal] =
    useState(false);
  const [selectedDepartmentGroupId, setSelectedDepartmentGroupId] =
    useState(null);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [roleMenu, setRoleMenu] = useState();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const [totalRecords, setTotalRecords] = useState(0);
  const [isSearchApplied, setIsSearchApplied] = useState(false);

  //* Get page load data
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

  const { data: fields = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  const pageFields = fields?.Data?.Sections?.find(
    (section) => section?.SectionName === 'Page'
  )?.Fields;

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);
  const { filters, isFilterApplied } = useSelector((state) => state.userStaff);
  //* RTK Queries
  const [triggerDeleteDepartmentGroup, { isLoading: isDeleting }] =
    useDeleteDepartmentGroupMutation();

  //* Get labels value
  const { data: labels = [] } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  //* Fecth designation details
  const {
    data: getDepartmentData = [],
    isFetching,
    refetch,
  } = useGetDepartmentGroupDetailsQuery(
    {
      payload: {
        pageIndex: pageIndex,
        pageSize: pageSize,
        headerFacilityId: selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    },
    {
      skip:
        !selectedFacility?.id ||
        !selectedModuleId ||
        !selectedMenu?.id ||
        searchWord != '',
    }
  );

  useEffect(() => {
    const { TotalRecords, Records } = getDepartmentData || {
      TotalRecords: 0,
      Records: [],
    };
    if (!isSearchApplied) {
      setTotalRecords(TotalRecords);
      setFilteredRecords([...(Records || [])]);
    }
  }, [getDepartmentData, isSearchApplied]);

  const searchByKeyWords = useCallback(
    async (keyword) => {
      setIsSearch(true);
      try {
        if (keyword === '' && isSearchApplied) {
          setIsSearchApplied(false);
          refetch();
          return;
        }
        const response = await triggereGetAllDepartmentGroup({
          pageIndex: pageIndex + 1,
          pageSize: pageSize,
          headerFacilityId: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
          keyword: keyword,
        }).unwrap();
        if (response?.records.length > 0) {
          setIsSearch(false);
          setTotalRecords(response?.totalRecords);
          setFilteredRecords([...(response?.records || [])]);
        } else {
          setIsSearch(false);
          setTotalRecords(0);
          setFilteredRecords([]);
        }
      } catch (err) {
        if (err.data) {
          setIsSearch(false);
          setTotalRecords(0);
          setFilteredRecords([]);
        }
      } finally {
        setIsSearch(false);
      }
    },
    [
      pageIndex,
      pageSize,
      selectedFacility,
      userDetails,
      selectedModuleId,
      selectedMenu,
      isSearchApplied,
    ]
  );

  // Memoize the debounced version of searchByKeyWords
  const debouncedSearch = useMemo(
    () =>
      debounce((keyword) => {
        searchByKeyWords(keyword); // Call the search function
      }, 800), // Debounce delay in ms
    [searchByKeyWords]
  );

  // Cleanup debouncedSearch on unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel(); // Cancel pending debounced calls
    };
  }, [debouncedSearch]);

  useEffect(() => {
    //when filters change with searchKeyword
    if (searchWord) {
      debouncedSearch(searchWord);
    }
  }, [pageSize, pageIndex]);

  useEffect(() => {
    if (!searchWord && isSearchApplied) {
      debouncedSearch(searchWord);
    }
  }, [searchWord, isSearchApplied]);

  //* Department table column list
  const departmentGroupColumnsList = [
    {
      id: 'FacilityName',
      translationId: 'MM_DM_Facility',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'DM_P_Facility')?.IsShow,
    },
    {
      id: 'DepartmentGroupName',
      translationId: 'MM_DM_DepartmentGroup',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'DM_P_DepartmentUnitGroup')
        ?.IsShow,
    },
    {
      id: 'DepartmentNames',
      translationId: 'MM_DM_Department',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'DM_P_DepartmentUnit')
        ?.IsShow,
    },
    {
      id: 'AddedEditedBy',
      translationId: 'MM_DM_AddedEditedBy',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'DM_P_AddedEditedBy')
        ?.IsShow,
    },
    {
      id: 'AddedEditedDate',
      translationId: 'MM_DM_AddedEditedDate',
      isSelected: true,
      isShow: pageFields?.find((x) => x.FieldId === 'DM_P_AddedEditedDate')
        ?.IsShow,
    },
  ];

  //* Handlers for pagination
  const handleOnPageChange = (event, newPage) => {
    dispatch(setDepartmentGroupPageIndex(newPage));
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(setDepartmentGroupPageSize(parseInt(event.target.value, 10)));
    dispatch(setDepartmentGroupPageIndex(0));
  };

  //* Edit department group
  const editDepartmentGroup = (departmentGroupId) => {
    setSelectedDepartmentGroupId(departmentGroupId);
    setShowDepartmentGroupModal(true);
  };

  //* Delete designation
  const deleteDepartmentGroup = async (departmentGroupId) => {
    const callback = async () => {
      try {
        await triggerDeleteDepartmentGroup({
          departmentGroupId: departmentGroupId,
          loginUserId: userDetails?.UserId,
          menuId: selectedMenu?.id,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: `${getlabel('MM_DM_DepartmentGroup', labels, i18n.language)} has been deleted.`,
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

  //* Sort records based on order and orderBy state

  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const aValue = a[orderBy]?.toString().toLowerCase();
    const bValue = b[orderBy]?.toString().toLowerCase();

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="space-between"
      display="flex"
    >
      <FlexContainer
        justifyContent={'space-between'}
        style={{ paddingBottom: '15px' }}
        display="flex"
      >
        <StyledTypography
          fontSize="30px"
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('MM_DepartmentGroup')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer
        width="100%"
        height="auto"
        flex="1"
        flexDirection="column"
        style={{
          backgroundColor: '#ffffff',
          padding: '30px',
          borderRadius: '10px',
        }}
      >
        {isFetching || isSearch ? (
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
            <FlexContainer alignItems="center" width="100%">
              <Tooltip title="Go back" arrow>
                <FlexContainer>
                  <StyledButton
                    borderRadius="6px"
                    gap="4px"
                    padding="6px 10px"
                    variant="contained"
                    backgroundColor="#3498db"
                    type="button"
                    style={{
                      display: 'inline-flex',
                      gap: '5px',
                    }}
                    onClick={() =>
                      navigate('/MainMaster/DepartmentMaster', {
                        state: { activeTab: 'Department' },
                      })
                    }
                    startIcon={
                      <StyledImage
                        height="20px"
                        width="20px"
                        src={BackArrow}
                        alt="WhiteSearch"
                      />
                    }
                  >
                    {t('Previous')}
                  </StyledButton>
                </FlexContainer>
              </Tooltip>
            </FlexContainer>
            <Divider
              sx={{
                marginY: '10px',
                height: '2px',
                width: '100%',
                backgroundColor: '#205475',
                border: 'none',
              }}
            />
            <FlexContainer
              justifyContent="space-between"
              width="100%"
              flexWrap="wrap"
              alignItems="center"
            >
              <StyledSearch
                variant="outlined"
                placeholder={t('SearchByKeywords')}
                value={searchWord}
                onChange={(event) => {
                  const searchTerm = event.target.value?.toLowerCase();
                  dispatch(setDepartmentGroupPageIndex(0));
                  dispatch(setDepartmentGroupPageSize(25));
                  setIsSearchApplied(true);
                  setSearchWord(searchTerm);
                  debouncedSearch(searchTerm);
                }}
                fullWidth={false}
                margin="normal"
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

              {roleMenu?.IsAdd && roleMenu?.IsView && (
                <StyledButton
                  height="40px"
                  onClick={() => {
                    setShowDepartmentGroupModal(true);
                  }}
                  style={{ display: 'inline-flex', gap: '10px' }}
                >
                  <StyledImage src={PlusIcon} />
                  {t('AddDepartmentGrouping')}
                </StyledButton>
              )}
            </FlexContainer>
            <FlexContainer display="flex" width="100%" flexDirection="column">
              <TableContainer
                component={Paper}
                style={{ border: '1px solid #99cde6' }}
              >
                <Table
                  stickyHeader
                  style={{ width: '100%', borderCollapse: 'collapse' }}
                >
                  <StyledTableHead>
                    <TableRow>
                      <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                      {departmentGroupColumnsList
                        ?.filter((col) => col.isSelected && col.isShow)
                        ?.map((column) => (
                          <StyledTableHeaderCell key={column.id}>
                            <TableSortLabel
                              active={orderBy === column.id}
                              direction={orderBy === column.id ? order : 'asc'}
                              onClick={() => handleSortRequest(column.id)}
                            >
                              {getlabel(
                                column.translationId,
                                labels,
                                i18n.language
                              )}
                            </TableSortLabel>
                          </StyledTableHeaderCell>
                        ))}
                      {checkAccess(
                        isSuperAdmin,
                        roleMenu?.IsView,
                        roleMenu?.IsEdit || roleMenu?.IsDelete
                      ) && (
                        <StyledTableHeaderCell>
                          {t('Actions')}
                        </StyledTableHeaderCell>
                      )}
                    </TableRow>
                  </StyledTableHead>

                  {sortedRecords?.length > 0 ? (
                    <TableBody>
                      {sortedRecords?.map((row, rowIndex) => (
                        <StyledTableRow key={rowIndex}>
                          <StyledTableBodyCell>
                            {pageIndex * pageSize + rowIndex + 1}
                          </StyledTableBodyCell>
                          {departmentGroupColumnsList
                            ?.filter((col) => col.isSelected && col.isShow)
                            .map((column) => {
                              return (
                                <StyledTableBodyCell
                                  key={column.id}
                                  status={
                                    column.id === 'Status' ? row[column.id] : ''
                                  }
                                >
                                  {(column.id === 'Added_EditedDate' ||
                                    column.id === 'AddedEditedDate') &&
                                  row[column.id]
                                    ? formatDate(row[column.id])
                                    : (row[column.id] ?? null)}
                                </StyledTableBodyCell>
                              );
                            })}
                          {checkAccess(
                            isSuperAdmin,
                            roleMenu?.IsView,
                            roleMenu?.IsEdit || roleMenu?.IsDelete
                          ) && (
                            <ActionCell>
                              <FlexContainer className="action-icons">
                                {checkAccess(
                                  isSuperAdmin,
                                  roleMenu?.IsView,
                                  roleMenu?.IsEdit
                                ) && (
                                  <Tooltip title="Edit" arrow>
                                    <StyledImage
                                      cursor="pointer"
                                      height="12.5px"
                                      width="12.5px"
                                      src={EditIcon}
                                      alt="Edit"
                                      onClick={() =>
                                        editDepartmentGroup(
                                          row.DepartmentGroupId
                                        )
                                      }
                                    />
                                  </Tooltip>
                                )}
                                {checkAccess(
                                  isSuperAdmin,
                                  roleMenu?.IsView,
                                  roleMenu?.IsDelete
                                ) && (
                                  <Tooltip title="Delete" arrow>
                                    <StyledImage
                                      cursor="pointer"
                                      height="12.5px"
                                      width="12.5px"
                                      src={DeleteIcon}
                                      alt="Delete"
                                      onClick={() =>
                                        deleteDepartmentGroup(
                                          row.DepartmentGroupId
                                        )
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
                            departmentGroupColumnsList?.filter(
                              (col) => col.isSelected && col.isShow
                            ).length + 2
                          }
                          style={{ textAlign: 'center' }}
                        >
                          {t('NoDataAvailable')}
                        </StyledTableBodyCell>
                      </StyledTableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
              <CustomPagination
                totalRecords={totalRecords}
                page={pageIndex}
                pageSize={pageSize}
                handleOnPageChange={handleOnPageChange}
                handleOnPageSizeChange={handleOnPageSizeChange}
              />
            </FlexContainer>

            {showDepartmentGroupModal && (
              <AddEditDepartmentGroup
                showDepartmentGroupModal={showDepartmentGroupModal}
                selectedDepartmentGroupId={selectedDepartmentGroupId}
                setSelectedDepartmentGroupId={setSelectedDepartmentGroupId}
                setShowDepartmentGroupModal={setShowDepartmentGroupModal}
                labels={labels}
                refetch={refetch}
              />
            )}
          </>
        )}{' '}
      </FlexContainer>
    </FlexContainer>
  );
};

export default DepartmentGroup;
