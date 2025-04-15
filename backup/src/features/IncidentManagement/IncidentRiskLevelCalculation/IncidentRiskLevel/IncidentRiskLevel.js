import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Collapse,
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
import { useEffect, useState } from 'react';

import PlusIcon from '../../../../assets/Icons/AddSubMaster.png';
import SearchIcon from '../../../../assets/Icons/Search.png';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import RCArequired from '../../../../assets/Icons/RCARequired.png';
import RCANotRequired from '../../../../assets/Icons/RCANotRequired.png';
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
  useDeleteEmployeeSubTypeMutation,
  useGetEmployeeSubTypesDetailsQuery,
} from '../../../../redux/RTK/staffSubMasterApi';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
// import AddEditEmployeeSubType from './AddEditEmployeeSubType';
import { getlabel } from '../../../../utils/IncidentLabels';
import formatDate from '../../../../utils/FormatDate';
import { showSweetAlert } from '../../../../utils/SweetAlert';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import DeleteUserGif from '../../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import {
  setPageIndex,
  setPageSize,
  setIncidentRiskLevelRecords,
} from '../../../../redux/features/mainMaster/incidentRiskLevelSlice';
import { checkAccess } from '../../../../utils/Auth';
import AddIncidentRiskLevel from './AddIncidentRiskLevel';
import {
  useDeleteRiskLevelMutation,
  useGetIncidentRiskDetailsQuery,
} from '../../../../redux/RTK/incidentRiskLevelApi';
import styled from 'styled-components';
import FilterIcon from '../../../../assets/Icons/FilterIcon.png';
import { useNavigate } from 'react-router-dom';
import ReorderIcon from '../../../../assets/Icons/ReorderIcon.png';

const StyledCollapse = styled(Collapse)`
  padding: ${(props) => (props.openFilter ? '0 0 20px 0' : '0')};
`;

const BorderBox = styled.div`
  border: 1px solid #0083c0;
  padding: 6px 8px 8px 8px;
  border-radius: 4px;
`;

const LikelihoodList = ({expandAll, fieldAccess}) => {
  //*Hooks declaration
  const { i18n, t } = useTranslation();
  const [expand, setExpand] = useState(expandAll);
  const dispatch = useDispatch();

  //* Selectors
  const { pageIndex, pageSize, filters, isFilterApplied } = useSelector(
    (state) => state.incidentRiskLevel
  );

  //* State Variables

  const [showEmployeeSubTypeModel, setShowEmployeeSubTypeModel] =
    useState(false);
  const [color, setColor] = useState('#1677ff');
  const [selectedIncidentRiskLevelId, setSelectedIncidentRiskLevelId] =
    useState(null);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [employeeSubTypeSearchKeyword, setEmployeeSubTypeSearchKeyword] =
    useState('');
  const [showIncidentRiskLevel, setShowIncidentRiskLevel] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [openFilter, setOpenFilter] = useState(false);

  //* RTK Queries
  const [triggerDeleteRiskLevelMutation] = useDeleteRiskLevelMutation();

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
  const navigate = useNavigate();

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  useEffect(() => {
    setExpand(expandAll);
  }, [expandAll]);

  //* Fecth employee subtype details
  const {
    data: getIncidentData = [],
    isFetching,
    refetch,
  } = useGetIncidentRiskDetailsQuery(
    {
      payload: {
        pageIndex: pageIndex + 1,
        pageSize: pageSize,
        headerFacility: 2,
        loginUserId: 1,
        moduleId: 2,
        menuId: 22,
      },
    },
    {
      skip: !selectedFacility?.id,
      refetchOnMountOrArgChange: true,
    }
  );

  const { TotalRecords, Records } = getIncidentData || {
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
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  //* Employee Sub Type column list
  //   const employeeSubTypeColumnsList = [
  //     { id: 'FacilityName', translationId: 'MM_SM_Facility', isSelected: true },
  //     {
  //       id: 'EmployeeSubType',
  //       translationId: 'MM_SM_EmployeeSubtype',
  //       isSelected: true,
  //     },
  //     {
  //       id: 'AddedEditedBy',
  //       translationId: 'MM_SM_AddedEditedBy',
  //       isSelected: true,
  //     },
  //     {
  //       id: 'AddedEditedDate',
  //       translationId: 'MM_SM_AddedEditedDate',
  //       isSelected: true,
  //     },
  //   ];
  const searchLabels = labels?.Data?.filter(
    (menu) => menu.MenuId === selectedMenu?.id
  )[0].Regions?.[0]?.Labels;
  
  const employeeSubTypeColumnsList = [
    {
      id: 'IncidentRiskLevel',
      translationId: 'IM_IRLC_IRL_IncidentRiskLevel',
      isSelected: true,
    },
    {
      id: 'ActionToBeTaken',
      translationId: 'IM_IRLC_IRL_ActionTobeTaken',
      isSelected: true,
    },
    {
      id: 'ScoreRange',
      translationId: 'IM_IRLC_IRL_ScoreRange',
      isSelected: true,
    },
    {
      id: 'IsRCARequired',
      translationId: 'IM_IRLC_IRL_RCARequired',
      isSelected: true,
    },
  ];

  //* Edit Employee Sub Type
  const editEmployeeSubType = (row) => {
    setSelectedIncidentRiskLevelId(row?.IncidentRiskLevelId);
    setShowIncidentRiskLevel(true);
  };

  //* Delete Employee Sub Type
  const deleteEmployeeSubType = async (row) => {
    const callback = async () => {
      try {
        await triggerDeleteRiskLevelMutation({
          incidentRiskLevelId: row?.IncidentRiskLevelId,
          loginUserId: userDetails?.UserId,
          menuId: 22,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Incident Risk Level has been deleted.',
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
    <Accordion
      sx={{ border: '5px', borderColor: '#0083c0', marginBlockEnd: '20px' }}
      expanded={expand}
    >
      <AccordionSummary
        expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
        aria-controls="panel1-content"
        onClick={() => {
          setExpand((prev) => !prev);
        }}
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
          {getlabel('IM_IRLC_IRL_IncidentRiskLevel', searchLabels, i18n.language)}
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
              {getlabel(
                'IM_IRLC_IRL_IncidentRiskLevel',
                searchLabels,
                i18n.language
              )}
            </StyledTypography>

            <StyledSearch
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
                  Records?.filter((item) => {
                    const incidentRiskLevel =
                      item.IncidentRiskLevel?.toString().toLowerCase() || '';
                    const actionToBeTaken =
                      item.ActionToBeTaken?.toString().toLowerCase() || '';
                    const scoreRange =
                      item.ScoreRange?.toString().toLowerCase() || '';
                    const isRCARequired =
                      item.IsRCARequired?.toString().toLowerCase() || '';

                    return (
                      incidentRiskLevel.includes(searchTerm.toLowerCase()) ||
                      actionToBeTaken.includes(searchTerm.toLowerCase()) ||
                      scoreRange.includes(searchTerm.toLowerCase()) ||
                      isRCARequired.includes(searchTerm.toLowerCase())
                    );
                  }) || []
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
            />
            <FlexContainer justifyContent="flex-end" gap="5px">
              {checkAccess(
                isSuperAdmin,
                roleMenu?.IsAdd && roleMenu?.IsView,
                true
              ) && (
                <StyledButton
                  onClick={() => setShowIncidentRiskLevel(true)}
                  style={{ display: 'inline-flex', gap: '4px' }}
                  margin="0 40px 0 0"
                >
                  <StyledImage
                    src={PlusIcon}
                    height={'0.8rem'}
                    width={'0.8rem'}
                  />
                  {t('AddIncidentRiskLevel')}
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
                  dispatch(setIncidentRiskLevelRecords(sortedRecords));
                  navigate('/incidentManagement/IncidentRiskLevelReorder');
                }}
              />
            </FlexContainer>

            <AddIncidentRiskLevel
              open={showIncidentRiskLevel}
              setShowIncidentRiskLevel={setShowIncidentRiskLevel}
              setSelectedIncidentRiskLevelId={setSelectedIncidentRiskLevelId}
              selectedIncidentRiskLevelId={selectedIncidentRiskLevelId}
              onClose={() => setShowCompanyModal(false)}
              labels={searchLabels}
              fieldAccess={fieldAccess}
              refetch={refetch}
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
                                {getlabel(
                                  column.translationId,
                                  searchLabels,
                                  i18n.language
                                )}
                              </TableSortLabel>
                            </StyledTableHeaderCell>
                          ))}
                        {roleMenu?.IsEdit && roleMenu?.IsDelete && (
                          <StyledTableHeaderCell>
                            {t('Actions')}
                          </StyledTableHeaderCell>
                        )}
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {sortedRecords?.length > 0 ? (
                        sortedRecords?.map((row, rowIndex) => {
                          return (
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
                                      {column.id === 'IsRCARequired' ? (
                                        row.IsRCARequired ? (
                                          <StyledImage
                                            cursor="pointer"
                                            height="12.5px"
                                            width="12.5px"
                                            src={RCArequired}
                                            alt="Delete"
                                          />
                                        ) : (
                                          <StyledImage
                                            cursor="pointer"
                                            height="12.5px"
                                            width="12.5px"
                                            src={RCANotRequired}
                                            alt="Delete"
                                          />
                                        )
                                      ) : column.id === 'AddedEditedDate' &&
                                        row[column.id] ? (
                                        formatDate(row[column.id])
                                      ) : (
                                        (row[column.id] ?? null)
                                      )}
                                    </StyledTableBodyCell>
                                  );
                                })}
                              <ActionCell>
                                <FlexContainer className="action-icons">
                                {checkAccess(
                                                                      // isSuperAdmin,
                                                                      roleMenu?.IsEdit || false
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
                                    </Tooltip>
                                  )}
                                  {checkAccess(
                                                                      // isSuperAdmin,
                                                                      roleMenu?.IsEdit || false
                                                                    ) && (
                                    <Tooltip title="Delete" arrow>
                                      <StyledImage
                                        cursor="pointer"
                                        height="12.5px"
                                        width="12.5px"
                                        src={DeleteIcon}
                                        alt="Delete"
                                        onClick={() =>
                                          deleteEmployeeSubType(row)
                                        }
                                      />
                                    </Tooltip>
                                  )}
                                </FlexContainer>
                              </ActionCell>
                            </StyledTableRow>
                          );
                        })
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

export default LikelihoodList;
