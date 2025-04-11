import {
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableSortLabel,
  Tooltip,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { useEffect, useState, useCallback, useMemo } from 'react';
import PlusIcon from '../../../../assets/Icons/AddSubMaster.png';
import SearchIcon from '../../../../assets/Icons/Search.png';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import {
  ActionCell,
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../../utils/DataTable.styled';
import { getlabel } from '../../../../utils/language';
import { useGetLabelsQuery } from '../../../../redux/RTK/moduleDataApi';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  useDeleteEmploymentTypeMutation,
  useGetEmploymentTypesDetailsQuery,
  useLazyGetAllEmploymentTypesSearchQuery,
} from '../../../../redux/RTK/staffSubMasterApi';
import formatDate from '../../../../utils/FormatDate';
import AddEditEmploymentType from './AddEditEmploymentType';
import { showSweetAlert } from '../../../../utils/SweetAlert';
import DeleteUserGif from '../../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import {
  setEmpTypePageIndex,
  setEmpTypePageSize,
} from '../../../../redux/features/mainMaster/staffSubMasterSlice';

import debounce from 'lodash/debounce';
import { checkAccess } from '../../../../utils/Auth';

const EmploymentTypeList = ({ facilityList, fields ,tabs}) => {
  //*Hooks declaration
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const [isSearch, setIsSearch] = useState(false);
  const [isSearchApplied, setIsSearchApplied] = useState(false)
 
  const [TotalRecords, setTotalRecords] = useState(0);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showEmploymentModel, setShowEmploymentModel] = useState(false);
  const [selectedEmploymentTypeId, setSelectedEmploymentTypeId] =
    useState(null);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [triggerDeleteEmploymentType] = useDeleteEmploymentTypeMutation();

   //* State Variables
   const { pageIndex, pageSize } = useSelector(
    (state) => state.staffSubMaster.employmentType
  );
  //* Page load data
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

  const [roleMenu, setRoleMenu] = useState();
  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);
  
  const [triggerGetAllEmploymentTypesSearchQuery] =
    useLazyGetAllEmploymentTypesSearchQuery();

  //* Fecth employment type details
  const {
    data: getEmploymentTypeData = [],
    isFetching,
    refetch,
  } = useGetEmploymentTypesDetailsQuery(
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
      skip: !selectedFacility?.id || !selectedModuleId || !selectedMenu?.id||searchKeyword!=="",
      // refetchOnMountOrArgChange: true,
    }
  );

 
  useEffect(() => {
    if(!isSearchApplied){
      const { TotalRecords, Records } = getEmploymentTypeData || {
        TotalRecords: 0,
        Records: [],
      };
      setTotalRecords(TotalRecords) 
      setFilteredRecords([...(Records || [])]);
    }
  }, [getEmploymentTypeData,isSearchApplied]);

  //* Handle Pagination
  const handleOnPageChange = (event, newPage) => {
    dispatch(setEmpTypePageIndex(newPage));
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(setEmpTypePageSize(parseInt(event.target.value, 10)));
    dispatch(setEmpTypePageIndex(0));
  };

  //* Get labels value
  const { data: labels = [] } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  //* Employment Type column list
  const employmentTypeColumnsList = [
    { id: 'FacilityName', translationId: 'MM_SM_Facility', isSelected: true },
    {
      id: 'EmploymentType',
      translationId: 'MM_SM_EmploymentType',
      isSelected: true,
    },
    {
      id: 'AddedEditedBy',
      translationId: 'MM_SM_AddedEditedBy',
      isSelected: true,
    },
    {
      id: 'AddedEditedDate',
      translationId: 'MM_SM_AddedEditedDate',
      isSelected: true,
    },
  ];

  //* Edit Employment Type
  const editEmploymentType = (employmentTypeId) => {
    setSelectedEmploymentTypeId(employmentTypeId);
    setShowEmploymentModel(true);
  };

  //* Delete Employment Type
  const deleteEmploymentType = async (employmentTypeId) => {
    const callback = async () => {
      try {
        await triggerDeleteEmploymentType({
          employmentTypeId: employmentTypeId,
          loginUserId: userDetails?.UserId,
          menuId: selectedMenu?.id,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Employment Type has been deleted.',
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

  const searchByKeyWords = useCallback(
    async (keyword) => {
      setIsSearch(true);
      try {
        if (keyword === '' && isSearchApplied) {
          refetch();
          setIsSearchApplied(false);
          return;
        }
        const response = await triggerGetAllEmploymentTypesSearchQuery({
          pageIndex: pageIndex+1,
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
    if (searchKeyword) {
      debouncedSearch(searchKeyword);
    }
  }, [pageSize, pageIndex]);

  useEffect(() => {
    //when filters change with searchKeyword
    if (!searchKeyword && isSearchApplied) {
      debouncedSearch(searchKeyword);
    }
  }, [searchKeyword, isSearchApplied]);

  return (
    <FlexContainer
      flexWrap="wrap"
      style={{
        width: isFetching ? '100vw' : 'auto',
        height: isFetching ? '50vh' : 'auto',
        overflow: isFetching ? 'hidden' : 'auto',
      }}
    >
      <FlexContainer
        display="flex"
        flexWrap="wrap"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
      >
        <StyledTypography
          fontSize="20px"
          fontWeight="600"
          lineHeight="24px"
          textAlign="left"
          color="#333333"
        >
          {getlabel('MM_SM_EmploymentType', labels, i18n.language)}
        </StyledTypography>

        <StyledSearch
          style={{ flexGrow: 0.5 }}
          variant="outlined"
          placeholder={t('SearchByKeywords')}
          value={searchKeyword}
          autoComplete="off"
          onChange={(event) => {
            const searchTerm = event.target.value?.toLowerCase();
            dispatch(setEmpTypePageIndex(0));
            dispatch(setEmpTypePageSize(25));
            setSearchKeyword(searchTerm);
            setIsSearchApplied(true);
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
        {checkAccess(isSuperAdmin, roleMenu?.IsView, roleMenu?.IsAdd) && (
          <>
          <StyledButton
            onClick={() => setShowEmploymentModel(true)}
            style={{ display: 'inline-flex', gap: '4px' }}
          >
            <StyledImage src={PlusIcon} height={'0.8rem'} width={'0.8rem'} />
            {t('Add')}
          </StyledButton>
           <StyledButton
           onClick={() => {
             window.open(
               `/form-builder/${selectedMenu?.id}?menuId=${selectedMenu?.id}&&tabs=${tabs}`,
               '_blank'
             );
           }}
           style={{ display: 'inline-flex', gap: '10px' }}
         >
           <StyledImage src={PlusIcon} height={'0.8rem'} width={'0.8rem'} />
           {t('AddCustomForm')}
         </StyledButton>
         </>
        )}
      </FlexContainer>

      <FlexContainer
        flexDirection="column"
        width="100%"
        justifyContent="center"
        margin="10px 0 0 0 "
        flexWrap="wrap"
        overFlow="hidden"
      >
        {isFetching ||isSearch ? (
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
            <TableContainer
              component={Paper}
              style={{ border: '1px solid #99cde6' }}
            >
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <StyledTableHeaderCell> {t('SNo')}</StyledTableHeaderCell>
                    {employmentTypeColumnsList
                      ?.filter((col) => col.isSelected)
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
                      roleMenu?.IsEdit || roleMenu?.IsDelete || false
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
                        {employmentTypeColumnsList
                          ?.filter((col) => col.isSelected)
                          .map((column) => {
                            return (
                              <StyledTableBodyCell
                                key={column.id}
                                status={
                                  column.id === 'Status' ? row[column.id] : ''
                                }
                              >
                                {column.id === 'AddedEditedDate' &&
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
                                      editEmploymentType(row.EmploymentTypeId)
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
                                      deleteEmploymentType(row.EmploymentTypeId)
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
            {TotalRecords != 0 && (
              <CustomPagination
                totalRecords={TotalRecords}
                page={pageIndex}
                pageSize={pageSize}
                handleOnPageChange={handleOnPageChange}
                handleOnPageSizeChange={handleOnPageSizeChange}
              />
            )}
          </>
        )}
      </FlexContainer>
      {showEmploymentModel && (
        <AddEditEmploymentType
        tabs={tabs}
          showEmploymentModel={showEmploymentModel}
          setShowEmploymentModel={setShowEmploymentModel}
          selectedEmploymentTypeId={selectedEmploymentTypeId}
          setSelectedEmploymentTypeId={setSelectedEmploymentTypeId}
          facilityList={facilityList}
          labels={labels}
          refetch={refetch}
          fields={fields}
        />
      )}
    </FlexContainer>
  );
};

export default EmploymentTypeList;
