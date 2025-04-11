import {
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableSortLabel,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Badge,
  Collapse,
  IconButton,
  Divider,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { useEffect, useState } from 'react';

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
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  useDeleteCategoryMutation,
  // useDeleteEmployeeSubTypeMutation,
  useGetCategoryDetailsQuery,
} from '../../../../redux/RTK/incidentRiskLevelApi';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
// import AddEditEmployeeSubType from './AddEditEmployeeSubType';
import formatDate from '../../../../utils/FormatDate';
import { showSweetAlert } from '../../../../utils/SweetAlert';
import DeleteUserGif from '../../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import {
  setEmpSubTypePageIndex,
  setEmpSubTypePageSize,
} from '../../../../redux/features/mainMaster/staffSubMasterSlice';
import {
  setCategoryAffectedRecords,
  setPageIndex,
  setPageSize,
} from '../../../../redux/features/mainMaster/incidentRiskLevelSlice';
import { checkAccess } from '../../../../utils/Auth';
import AddEditCategoryAffected from './AddEditCategoryAffected';
import FilterIcon from '../../../../assets/Icons/FilterIcon.png';
import styled from 'styled-components';
import FilterCloseIcon from '../../../../assets/Icons/FilterCloseIcon.png';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import FilterFormField from '../../../MainMaster/UserAssignment/UserAssignmentList/FilterFormFIeld';
import { useNavigate } from 'react-router-dom';
import ReorderIcon from '../../../../assets/Icons/ReorderIcon.png';
import { useDownloadFacilityDataMutation } from '../../../../redux/RTK/contactInformationApi';
import { getlabel } from '../../../../utils/IncidentLabels';
import { Formik } from 'formik';
import * as Yup from 'yup';

const StyledCollapse = styled(Collapse)`
  padding: ${(props) => (props.openFilter ? '0 0 20px 0' : '0')};
`;

const BorderBox = styled.div`
  border: 1px solid #0083c0;
  padding: 6px 8px 8px 8px;
  border-radius: 4px;
`;



const EmployeeSubTypeList = ({expandAll, fieldAccess}) => {
  //*Hooks declaration
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const [expand, setExpand] = useState(expandAll);


  const { pageSize, pageIndex } = useSelector((state) => state.incidentRiskLevel);


const mySlice = useSelector((state) => state);
  //* State Variables
  const [setShowEmployeeSubTypeModel] = useState(false);
  const navigate = useNavigate();
  const [openFilter, setOpenFilter] = useState(false);
  // const [selectedEmployeeSubTypeId, setSelectedEmployeeSubTypeId] =
  //   useState(null);
  const [selectedCategoryAffectedId, setSelectedCategoryAffectedId] =
    useState(null);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [employeeSubTypeSearchKeyword, setEmployeeSubTypeSearchKeyword] =
    useState('');
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [isEditCategory, setIsEditCategory] = useState(false);

  const [triggerDeleteCategoryAffectedData] = useDeleteCategoryMutation();
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

  useEffect(() => {
    setExpand(expandAll);
  }, [expandAll]);
  
  const {
    data: getCategoryData = [],
    isFetching,
    refetch,
  } = useGetCategoryDetailsQuery(
    {
      payload: {
        pageIndex: pageIndex+1,
        pageSize: pageSize,
        headerFacility: selectedFacility?.id,
        loginUserId: 1,
        moduleId: 2,
        menuId: 22,

        // pageIndex: pageIndex,
        // pageSize: pageSize,
        // headerFacilityId: selectedFacility?.id,
        // loginUserId: userDetails?.UserId,
        // moduleId: selectedModuleId,
        // menuId: selectedMenu?.id,
      },
    },
    {
      skip: !selectedFacility?.id || !selectedModuleId || !selectedMenu?.id,
      refetchOnMountOrArgChange: true,
    }
  );

  const { TotalRecords, Records } = getCategoryData || {
    TotalRecords: 0,
    Records: [],
  };

  useEffect(() => {
    setFilteredRecords([...(Records || [])]);
  }, [Records]);

  //* Handle Pagination
  const handleOnPageChange = (event, newPage) => {
    dispatch(setPageIndex(newPage));
  };

  const handleToggleFilter = () => {
    setOpenFilter(!openFilter);
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(setPageSize(parseInt(event.target.value, 10)));
    dispatch(setPageIndex(0));
  };

  //* Get labels value
  const { data: labels = [] } = useGetLabelsQuery({
    menuId: 22,
    moduleId: 2,
  });

  // const searchLabels = (labels.Data || [])
  // .filter((item) => item.MenuId === 28) 
  // .flatMap((item) =>
  //   (item.Regions || [])
  //     .filter((region) => region.RegionCode === "ALL") 
  //     .flatMap((region) => region.Labels || [])
  // );
  const searchLabels = labels?.Data?.filter((menu) => menu.MenuId === selectedMenu?.id)[0].Regions?.[0]?.Labels

  const { data: fields = [], isFetching: isFieldsFetching } = useGetFieldsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );
  const employeeSubTypeColumnsList = [
    // { id: 'Facility', translationId: 'Facility', isSelected: true },
    {
      id: 'CategoryAffected',
      translationId: 'IM_IRLC_CA_CategoryAffected',
      isSelected: true,
    },
  ];

  //* Edit Employee Sub Type
  const editEmployeeSubType = (row) => {
    setSelectedCategoryAffectedId(row?.CategoryAffectedId);
    setShowCategoryModal(true);
    setIsEditCategory(true);
  };

  //* Delete Employee Sub Type
  const deleteEmployeeSubType = async (row) => {
    const callback = async () => {
      try {
        await triggerDeleteCategoryAffectedData({
          categoryAffectedId: row?.CategoryAffectedId,
          loginUserId: userDetails?.UserId,
          menuId: 22,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Category Affected has been deleted.',
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

  const [triggerDownloadData] = useDownloadFacilityDataMutation();

  const handleOnDownload = async (fileType) => {
    try {
      setIsLoading(true);
      const blob = await triggerDownloadData({
        downloadType: fileType,
        payload: {
          pageIndex: pageIndex + 1,
          pageSize: pageSize,
          headerFacility: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
        },
      }).unwrap();
      saveAs(blob, 'Facility.pdf');
      setMessage('Download completed');
      setIsLoading(false);
    } catch (error) {
      setMessage('Download failed');
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const aValue = a[orderBy]?.toString().toLowerCase();
    const bValue = b[orderBy]?.toString().toLowerCase();

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
  return (
    <Accordion
      sx={{ border: '5px', borderColor: '#0083c0', marginBlockEnd: '20px' }}
      expanded={expand}
    >
      <AccordionSummary
        expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
        onClick={() => {
          setExpand((prev) => !prev);
        }}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          backgroundColor: '#0083c0',
          borderRadius: '8px 8px 0px 0px',
          width: '100%',
          border: '1px solid #0083c0',
        }}
      >
        <StyledTypography
          fontSize="16px"
          fontWeight="700"
          lineHeight="20px"
          textAlign="center"
          color="#FFFFFF"
        >
          {getlabel('IM_IRLC_CA_CategoryAffected', searchLabels, i18n.language)}
        </StyledTypography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          width: '100%',
          height: '100%',
          padding: '20px',

          border: '1px solid #0083c0',
        }}
      >
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
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            flexWrap="wrap"
          >
            <StyledTypography
              fontSize="1.3rem"
              fontWeight="600"
              lineHeight="24px"
              textAlign="left"
              color="#333333"
            >
              {/* {getlabel('MM_SM_EmployeeSubtype', labels, i18n.language)} */}
              {getlabel(
                'IM_IRLC_CA_CategoryAffected',
                searchLabels,
                i18n.language
              )}
            </StyledTypography>

            {/* <StyledSearch
              variant="outlined"
              placeholder={t('SearchByKeywords')}
              value={employeeSubTypeSearchKeyword}
              autoComplete="off"
              onChange={(event) => {
                const searchTerm = event.target.value?.toLowerCase();
                setEmployeeSubTypeSearchKeyword(event.target.value);

                if (searchTerm?.length < 1) {
                  setFilteredRecords(Records);
                  return;
                }
                setFilteredRecords(
                  Records?.filter((item) =>
                    item.CategoryAffected?.toLowerCase().includes(searchTerm)
                  ) || []
                );
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
            /> */}
            <FlexContainer justifyContent="flex-end" gap="5px">
              {checkAccess(
                // isSuperAdmin,
                roleMenu?.IsAdd && roleMenu?.IsView,
                true
              ) && (
                <StyledButton
                  onClick={() => setShowCategoryModal(true)}
                  style={{ display: 'inline-flex', gap: '4px' }}
                  margin="0 40px 0 0"
                >
                  <StyledImage
                    src={PlusIcon}
                    height={'0.8rem'}
                    width={'0.8rem'}
                  />
                  {t('AddCategoryAffected')}
                </StyledButton>
              )}
              <StyledImage
                height="40px"
                width="40px"
                gap="10px"
                cursor="pointer"
                borderRadius="40px"
                src={ReorderIcon}
                alt="Print"
                animate={true}
                onClick={() => {
                  dispatch(setCategoryAffectedRecords(sortedRecords));
                  navigate('/incidentManagement/ReorderTable');
                }}
              />

              {/* <Tooltip title="Print" arrow>
                <StyledImage
                  height="40px"
                  width="40px"
                  cursor="pointer"
                  borderRadius="40px"
                  src={PrintFileIcon}
                  alt="Print"
                  onClick={() => handleOnDownload('pdf')}
                />
              </Tooltip> */}
            </FlexContainer>

            <AddEditCategoryAffected
              open={showCategoryModal}
              setShowCategoryModal={setShowCategoryModal}
              setSelectedCategoryAffectedId={setSelectedCategoryAffectedId}
              selectedCategoryAffectedId={selectedCategoryAffectedId}
              onClose={() => setShowCompanyModal(false)}
              labels={searchLabels}
              fieldAccess={fieldAccess}
              refetch={refetch}
              isEditCategory={isEditCategory}
            />
          </FlexContainer>
          <FlexContainer
            flexDirection="column"
            width="100%"
            justifyContent="center"
            margin="10px 0 0 0 "
            flexWrap="wrap"
            overFlow="hidden"
          >
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
                <TableContainer
                  component={Paper}
                  style={{ border: '1px solid #99cde6' }}
                >
                  <Table>
                    <StyledTableHead>
                      <TableRow>
                        <StyledTableHeaderCell>
                          {' '}
                          {t('SNo')}
                        </StyledTableHeaderCell>
                        {employeeSubTypeColumnsList
                          ?.filter((col) => col.isSelected)
                          ?.map((column) => (
                            <StyledTableHeaderCell key={column.id}>
                              <TableSortLabel
                                active={orderBy === column.id}
                                direction={
                                  orderBy === column.id ? order : 'asc'
                                }
                                onClick={() => handleSortRequest(column.id)}
                              >
                                {/* {getlabel(
                                  'IM_IRLC_CA_CategoryAffected',
                                  labels,
                                  i18n.language
                                )} */}
                                {getlabel(
                                  column.translationId,
                                  searchLabels,
                                  i18n.language
                                )}
                                {/* {column.translationId} */}
                              </TableSortLabel>
                            </StyledTableHeaderCell>
                          ))}
                        {/* {roleMenu?.IsEdit && roleMenu?.IsDelete && ( */}
                          <StyledTableHeaderCell>
                            {t('Actions')}
                          </StyledTableHeaderCell>
                        {/* )} */}
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {sortedRecords?.length > 0 ? (
                        sortedRecords?.map((row, rowIndex) => (
                          <StyledTableRow key={rowIndex}>
                            <StyledTableBodyCell>
                              {pageIndex * pageSize + rowIndex + 1}
                            </StyledTableBodyCell>
                            {employeeSubTypeColumnsList
                              ?.filter((col) => col.isSelected)
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
                                    {column.id === 'AddedEditedDate' &&
                                    row[column.id]
                                      ? formatDate(row[column.id])
                                      : (row[column.id] ?? null)}
                                  </StyledTableBodyCell>
                                );
                              })}
                            <ActionCell>
                              <FlexContainer className="action-icons">
                             {checkAccess(
                                                                  //  isSuperAdmin,
                                                                   roleMenu?.IsEdit,
                                                                 ) && (
                                <Tooltip title="Edit" arrow>
                                  <StyledImage
                                    cursor="pointer"
                                    height="12.5px"
                                    width="12.5px"
                                    src={EditIcon}
                                    alt="Edit"
                                    onClick={() => editEmployeeSubType(row)}
                                  />
                                </Tooltip>)}
                                {checkAccess(
                                                                      // isSuperAdmin,
                                                                      roleMenu?.IsDelete || false
                                                                    ) && (
                                <Tooltip title="Delete" arrow>
                                  <StyledImage
                                    cursor="pointer"
                                    height="12.5px"
                                    width="12.5px"
                                    src={DeleteIcon}
                                    alt="Delete"
                                    onClick={() => deleteEmployeeSubType(row)}
                                  />
                                </Tooltip>)}
                              </FlexContainer>
                            </ActionCell>
                          </StyledTableRow>
                        ))
                      ) : (
                        <StyledTableBodyCell
                          colSpan={employeeSubTypeColumnsList.length}
                          align="center"
                        >
                          {t('NoDataAvailable')}
                        </StyledTableBodyCell>
                      )}
                    </TableBody>
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
          {/* {showEmployeeSubTypeModel && (
          <AddEditEmployeeSubType
            showEmployeeSubTypeModel={showEmployeeSubTypeModel}
            setShowEmployeeSubTypeModel={setShowEmployeeSubTypeModel}
            selectedEmployeeSubTypeId={selectedEmployeeSubTypeId}
            setSelectedEmployeeSubTypeId={setSelectedEmployeeSubTypeId}
            facilityList={facilityList}
            labels={labels}
            refetch={refetch}
          />
        )} */}
        </FlexContainer>
      </AccordionDetails>
    </Accordion>
  );
};

export default EmployeeSubTypeList;
