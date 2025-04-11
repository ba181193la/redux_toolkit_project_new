import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@mui/material';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import { FlexContainer, StyledImage } from '../../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import {
  ActionCell,
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../../utils/DataTable.styled';
import { getlabel } from '../../../../utils/language';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSentinelEventPageIndex,
  setSentinelEventPageSize,
} from '../../../../redux/features/IncidentManagement/incidentSubMasterSlice';
import { checkAccess } from '../../../../utils/Auth';
import CustomPagination from '../../../../components/Pagination/CustomPagination';

import { useGetAllSentinelEventQuery } from '../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';
import { useNavigate } from 'react-router-dom';
import Label from '../../../../components/Label/Label';
import { fontSize } from '@mui/system';

const SentinelEventDataTable = ({ labels, fieldAccess, filteredFacility }) => {
  //* Hooks declaration
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //* Selectors
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    isSuperAdmin,
  } = useSelector((state) => state.auth);
  const { sentinelEventPageIndex: pageIndex, sentinelEventPageSize: pageSize } =
    useSelector((state) => state.incidentSubMaster.incidentType);

  //* State variables
  const [roleMenu, setRoleMenu] = useState();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [incidentTypeList, setIncidentTypeList] = useState([]);
  const [fieldLabels, setFieldLabels] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);

  //* Handlers for pagination
  const handleOnPageChange = (event, newPage) => {
    dispatch(setSentinelEventPageIndex(newPage));
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(setSentinelEventPageSize(parseInt(event.target.value, 10)));
    dispatch(setSentinelEventPageIndex(0));
  };

  //* Sorting table columns
  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const orderedIncidentTypeList = [...incidentTypeList].sort((a, b) => {
    const aValue = a[orderBy]?.toString().toLowerCase();
    const bValue = b[orderBy]?.toString().toLowerCase();

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  //* Filtering fields access data
  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) => sectionName?.SectionName === 'Incident Type-Page'
    )
    ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields;

  //* Variables declaration
  const tableColumnList = [
    {
      id: 'SentinelDefinition',
      translationId: 'IM_IS_IT_Definition',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_IT_P_IsSentinel')
        ?.IsShow,
    },
    {
      id: 'Inclusion',
      translationId: 'IM_IS_IT_Inclusion',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_IT_P_Inclusion')
        ?.IsShow,
    },
    {
      id: 'Exclusion',
      translationId: 'IM_IS_IT_Exclusion',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_IT_P_Exclusion')
        ?.IsShow,
    },
  ];

  //* RTK Queries

  const {
    data: sentinelEventDetails,
    isFetching,
    refetch,
  } = useGetAllSentinelEventQuery(
    {
      payload: {
        pageIndex: pageIndex + 1,
        pageSize: pageSize,
        headerFacility: filteredFacility || selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: 2,
        // moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    },
    {
      skip: !selectedFacility?.id || !selectedModuleId || !selectedMenu?.id,
      refetchOnMountOrArgChange: true,
    }
  );

  //* Use Effects to bind data
  useEffect(() => {
    if (sentinelEventDetails?.Records) {
      setIncidentTypeList(sentinelEventDetails?.Records);
      setTotalRecords(sentinelEventDetails?.TotalRecords);
    }
  }, [sentinelEventDetails]);

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

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  useEffect(() => {
    refetch();
  }, [filteredFacility]);

  return (
    <FlexContainer flexDirection="column" width="100%" padding="10px">
      <Typography
        fontWeight="700"
        lineHeight="20px"
        textAlign="left"
        color="#333333"
        marginBottom={'15px'}
        sx={{
          fontSize: {
            xs: '0.875rem',
            sm: '0.875rem',
            md: '1.3rem',
            lg: '1.3rem',
          },
        }}
      >
        {t('SentinelEvent')}
      </Typography>
      <TableContainer component={Paper} style={{ border: '1px solid #0083c0' }}>
        <CustomScrollbars
          style={{ height: '350px' }}
          rtl={i18n.language === 'ar'}
        >
          {isFetching ? (
            <FlexContainer
              justifyContent="center"
              alignItems="center"
              height="100%"
              width="100%"
              position="absolute"
              style={{ top: '0', left: '0', marginTop: '50px' }}
            >
              <StyledImage src={LoadingGif} alt="LoadingGif" />
            </FlexContainer>
          ) : (
            <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
              <StyledTableHead backgroundColor="#0083c0" borderLeft="#0083c0">
                <TableRow>
                  <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
                  {tableColumnList
                    ?.filter((x) => x.isShow)
                    ?.map((column) => (
                      <StyledTableHeaderCell key={column.id}>
                        <TableSortLabel
                          active={orderBy === column.id}
                          direction={orderBy === column.id ? order : 'asc'}
                          onClick={() => handleSortRequest(column.id)}
                          style={{ 'text-wrap-mode': 'nowrap' }}
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
                    roleMenu?.IsEdit || roleMenu?.IsDelete
                  ) && (
                    <StyledTableHeaderCell>
                      {t('Actions')}
                    </StyledTableHeaderCell>
                  )}
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {orderedIncidentTypeList?.length > 0 ? (
                  orderedIncidentTypeList?.map((row, rowIndex) => (
                    <StyledTableRow key={rowIndex} borderColor="#0083c0">
                      <StyledTableBodyCell>
                        {pageIndex * pageSize + rowIndex + 1}
                      </StyledTableBodyCell>
                      {tableColumnList
                        ?.filter((x) => x.isShow)
                        ?.map((column) => {
                          return column.id !== 'IsSentinel' ? (
                            <StyledTableBodyCell key={column.id}>
                              {row[column.id] ?? null}
                            </StyledTableBodyCell>
                          ) : (
                            <StyledTableBodyCell key={column.id}>
                              {row[column.id] ? 'Yes' : 'No'}
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
                                  onClick={() =>
                                    editIncidentType(row?.IncidentTypeId)
                                  }
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
                                    deleteIncidentType(row?.IncidentTypeId)
                                  }
                                />
                              </Tooltip>
                            )}
                          </FlexContainer>
                        </ActionCell>
                      )}
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
  );
};

export default SentinelEventDataTable;
