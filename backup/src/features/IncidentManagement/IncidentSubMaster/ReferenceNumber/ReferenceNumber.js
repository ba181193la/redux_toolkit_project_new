import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
} from '../../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import PlusIcon from '../../../../assets/Icons/AddSubMaster.png';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import DeleteUserGif from '../../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import {
  ActionCell,
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../../utils/DataTable.styled';
import { checkAccess } from '../../../../utils/Auth';
import { useEffect, useState } from 'react';
import { getlabel } from '../../../../utils/language';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import {
  setReferenecNumberPageIndex,
  setReferenecNumberPageSize,
} from '../../../../redux/features/IncidentManagement/incidentSubMasterSlice';
import AddEditReferencenumber from './AddEditReferencenumber';
import {
  useDeleteReferenceNumberMutation,
  useGetPageLoadDataQuery,
  useGetReferenceNumberDetailsQuery,
} from '../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';
import { Grid } from '@mui/system';
import Label from '../../../../components/Label/Label';
import { showSweetAlert } from '../../../../utils/SweetAlert';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';

const ReferenceNumber = ({ labels, fieldAccess, expandAll }) => {
  //* Hooks declaration
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

  //* Selectors
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    isSuperAdmin,
    selectedRoleFacility,
    roleFacilities,
  } = useSelector((state) => state.auth);

  const {
    referenceNumberPageIndex: pageIndex,
    referenceNumberPageSize: pageSize,
  } = useSelector((state) => state.incidentSubMaster.referenceNumber);

  //* State variables
  const [showReferenceNumberModal, setShowReferenceNumberModal] =
    useState(false);
  const [selectedReferenceNumberId, setSelectedReferenceNumberId] =
    useState(null);
  const [resetNumberingList, setRestNumberingList] = useState([]);
  const [roleMenu, setRoleMenu] = useState();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [dateFormatList, setDateFormatList] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [fieldLabels, setFieldLabels] = useState([]);
  const [facilityList, setFacilityList] = useState([]);
  const [referenceNumberList, setReferenceNumberList] = useState([]);
  const [filteredFacility, setFilteredFacility] = useState(null);
  const [expand, setExpand] = useState(expandAll);

  //* Handlers for pagination
  const handleOnPageChange = (event, newPage) => {
    dispatch(setReferenecNumberPageIndex(newPage));
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(setReferenecNumberPageSize(parseInt(event.target.value, 10)));
    dispatch(setReferenecNumberPageIndex(0));
  };

  //* Sorting table columns
  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const orderedReferenceNumberList = [...referenceNumberList].sort((a, b) => {
    const aValue = a[orderBy]?.toString().toLowerCase();
    const bValue = b[orderBy]?.toString().toLowerCase();

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  //* Filtering fields access  data

  const pageFields = fieldAccess?.Data?.Menus?.find(
    (section) => section?.MenuId === selectedMenu?.id
  )
    ?.Sections?.find(
      (sectionName) =>
        sectionName?.SectionName === 'Incident Reference Number-Page'
    )
    ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields;

  //* Variables declaration
  const tableColumnList = [
    {
      id: 'Facility',
      translationId: 'IM_IS_IRN_Facility',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_IRN_P_Facility')
        ?.IsShow,
    },
    {
      id: 'IncidentReferenceNo',
      translationId: 'IM_IS_IRN_IncidentReferenceNumber',
      isShow: pageFields?.find(
        (x) => x.FieldId === 'IS_IRN_P_IncidentReferenceNumber'
      )?.IsShow,
    },
    {
      id: 'DateFormat',
      translationId: 'IM_IS_IRN_IncidentDateFormat',
      isShow: pageFields?.find(
        (x) => x.FieldId === 'IS_IRN_P_IncidentDateFormat'
      )?.IsShow,
    },
    {
      id: 'NumberReset',
      translationId: 'IM_IS_IRN_ResetNumbering',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_IRN_P_ResetNumbering')
        ?.IsShow,
    },
  ];

  //* RTK Queries

  const [triggerDeleteReferenceNumber] = useDeleteReferenceNumberMutation();

  const { data: pageLoadData } = useGetPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const {
    data: referenceNumberDetails,
    isFetching,
    refetch,
  } = useGetReferenceNumberDetailsQuery(
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
    if (pageLoadData?.Data) {
      setDateFormatList(
        pageLoadData?.Data?.DateFormat?.map((x) => ({
          value: x.ListOfValueId,
          text: x.ListOfValue,
        }))
      );
      setRestNumberingList(
        pageLoadData?.Data?.ResetNumbering?.map((x) => ({
          value: x.ListOfValueId,
          text: x.ListOfValue,
        }))
      );
      setFacilityList(
        pageLoadData?.Data?.Facilitylist?.map((facility) => {
          const facilityItem = userDetails?.ApplicableFacilities?.find(
            (x) => x.FacilityId === facility.FacilityId
          );
          if (facilityItem) {
            return {
              text: facility.FacilityName,
              value: facility.FacilityId,
            };
          }
          return null;
        }).filter((item) => item !== null)
      );
    }
    if (referenceNumberDetails?.Records) {
      setReferenceNumberList(referenceNumberDetails?.Records);
      setTotalRecords(referenceNumberDetails?.TotalRecords);
    }
  }, [pageLoadData, referenceNumberDetails]);

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
    setExpand(expandAll);
  }, [expandAll]);

  //* Edit reference number details
  const editReferenceNumber = (refNoId) => {
    setSelectedReferenceNumberId(refNoId);
    setShowReferenceNumberModal(true);
  };

  //* Delete reference number
  const deleteReferenceNumber = (refNoId) => {
    const callback = async () => {
      try {
        await triggerDeleteReferenceNumber({
          incidentReferenceId: refNoId,
          loginUserId: userDetails?.UserId,
          menuId: selectedMenu?.id,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Reference Number has been deleted.',
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
    <>
      <Accordion
        sx={{ border: '5px', borderColor: '#0083c0' }}
        expanded={expand}
      >
        <AccordionSummary
          style={{ padding: '0 10px' }}
          onClick={() => {
            setExpand((prev) => !prev);
          }}
          expandIcon={
            <StyledImage
              src={ExpandIcon}
              alt="Expand Icon"
              height={'8px'}
              width={'15px'}
            />
          }
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
              'IM_IS_IRN_IncidentReferenceNumber',
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
                      (x) => x.TranslationId === 'IM_IS_IRN_Facility'
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
                    ...(userDetails?.ApplicableFacilities?.filter(
                      (facility) => {
                        if (!facility.IsActive) return false;
                        if (isSuperAdmin) return true;
                        const facilityItem = roleFacilities
                          ?.find(
                            (role) => role.FacilityId === facility.FacilityId
                          )
                          ?.Menu?.find(
                            (MenuItem) => MenuItem.MenuId === selectedMenu?.id
                          );
                        return facilityItem?.IsView;
                      }
                    ).map((facility) => ({
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
                      setShowReferenceNumberModal(true);
                    }}
                    fontSize="12px"
                    style={{ display: 'inline-flex', gap: '8px' }}
                    disabled={isFetching}
                  >
                    <StyledImage
                      src={PlusIcon}
                      height={'0.8rem'}
                      width={'0.8rem'}
                    />
                    {t('AddIncidentReferenceNumber')}
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
                      <TableBody>
                        {orderedReferenceNumberList?.length > 0 ? (
                          orderedReferenceNumberList?.map((row, rowIndex) => (
                            <StyledTableRow
                              key={rowIndex}
                              borderColor="#0083c0"
                            >
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
                                          onClick={() =>
                                            editReferenceNumber(
                                              row.IncidentReferenceId
                                            )
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
                                            deleteReferenceNumber(
                                              row?.IncidentReferenceId
                                            )
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
          </FlexContainer>
        </AccordionDetails>
      </Accordion>
      {showReferenceNumberModal && (
        <AddEditReferencenumber
          showReferenceNumberModal={showReferenceNumberModal}
          setShowReferenceNumberModal={setShowReferenceNumberModal}
          selectedReferenceNumberId={selectedReferenceNumberId}
          setSelectedReferenceNumberId={setSelectedReferenceNumberId}
          facilityList={pageLoadData?.Data?.Facilitylist}
          dateFormatList={dateFormatList}
          resetNumberingList={resetNumberingList}
          labels={labels}
          refetch={refetch}
          fieldAccess={fieldAccess}
        />
      )}
    </>
  );
};

export default ReferenceNumber;
