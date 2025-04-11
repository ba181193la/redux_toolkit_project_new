import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import PlusIcon from '../../../../assets/Icons/AddSubMaster.png';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import ReorderIcon from '../../../../assets/Icons/reorder.png';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import DeleteUserGif from '../../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
} from '../../../../utils/StyledComponents';
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
import { useSelector } from 'react-redux';
import {
  setContributingMainFactorPageIndex,
  setContributingMainFactorPageSize,
} from '../../../../redux/features/IncidentManagement/incidentSubMasterSlice';

import {
  useDeleteContributingMainFactorMutation,
  useDownloadContributingMainFactorMutation,
  useGetContributingMainFactorQuery,
  useGetPageLoadDataQuery,
} from '../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';
import { checkAccess } from '../../../../utils/Auth';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import { useDispatch } from 'react-redux';
import { showSweetAlert } from '../../../../utils/SweetAlert';
import Label from '../../../../components/Label/Label';
import AddEditMainFactor from './AddEditMainFactor';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import { useNavigate } from 'react-router-dom';

const ContributingMainFactor = ({ labels, fieldAccess, expandAll }) => {
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
    regionCode,
  } = useSelector((state) => state.auth);
  const { mainFactorPageIndex: pageIndex, mainFactorPageSize: pageSize } =
    useSelector((state) => state.incidentSubMaster.contributingMainFactor);

  //* State variables
  const [showMainFactorModal, setShowMainFactorModal] = useState(false);
  const [roleMenu, setRoleMenu] = useState();
  const [selectedMainFactorId, setSelectedMainFactorId] = useState(null);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [mainFactorList, setMainFactorList] = useState([]);
  const [facilityList, setFacilityList] = useState([]);
  const [fieldLabels, setFieldLabels] = useState([]);
  const [filteredFacility, setFilteredFacility] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [pageFields, setPageFields] = useState([]);
  const [expand, setExpand] = useState(expandAll);

  //* Handlers for pagination
  const handleOnPageChange = (event, newPage) => {
    dispatch(setContributingMainFactorPageIndex(newPage));
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(
      setContributingMainFactorPageSize(parseInt(event.target.value, 10))
    );
    dispatch(setContributingMainFactorPageIndex(0));
  };

  //* Sorting table columns
  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const orderedMainFactorList = [...mainFactorList].sort((a, b) => {
    const aValue = a[orderBy]?.toString().toLowerCase();
    const bValue = b[orderBy]?.toString().toLowerCase();

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  //* RTK Queries

  const [triggerDeleteMainFactor] = useDeleteContributingMainFactorMutation();
  const [triggerDownloadData] = useDownloadContributingMainFactorMutation();

  const { data: pageLoadData } = useGetPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const {
    data: mainFactorDetails,
    isFetching,
    refetch,
  } = useGetContributingMainFactorQuery(
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

  //* Use Effect to bind data
  useEffect(() => {
    if (pageLoadData?.Data) {
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
    if (mainFactorDetails?.Records) {
      setMainFactorList(mainFactorDetails?.Records);
      setTotalRecords(mainFactorDetails?.TotalRecords);
    }
  }, [pageLoadData, mainFactorDetails]);

  useEffect(() => {
    if (labels?.Data) {
      const filteredLabels = labels?.Data?.find(
        (x) => x.MenuId === selectedMenu?.id
      )?.Regions;

      const allLabels =
        filteredLabels?.find((x) => x.RegionCode === 'ALL')?.Labels || [];

      const regionBasedLabels =
        regionCode === 'ABD'
          ? filteredLabels?.find((x) => x.RegionCode === 'ABD')?.Labels || []
          : [];
      const combinedLabels =
        regionBasedLabels.length > 0
          ? [...allLabels, ...regionBasedLabels]
          : allLabels;
      setFieldLabels(combinedLabels);
    }
  }, [labels, regionCode]);

  useEffect(() => {
    if (fieldAccess?.Data) {
      const pageFields = fieldAccess?.Data?.Menus?.find(
        (section) => section?.MenuId === selectedMenu?.id
      )?.Sections?.find(
        (sectionName) =>
          sectionName?.SectionName === 'Contributing Main Factor-Page'
      )?.Regions;
      if (pageFields) {
        const allFields =
          pageFields?.find((region) => region?.RegionCode === 'ALL')?.Fields ||
          [];
        const regionBasedFields =
          regionCode === 'ABD'
            ? pageFields?.find((region) => region?.RegionCode === 'ABD')
                ?.Fields || []
            : [];
        const combinedFields =
          regionBasedFields.length > 0
            ? [...allFields, ...regionBasedFields]
            : allFields;

        setPageFields(combinedFields);
      }
    }
  }, [fieldAccess, regionCode]);

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  useEffect(() => {
    setExpand(expandAll);
  }, [expandAll]);

  //* Edit main factor details
  const editMainFactor = (id) => {
    setSelectedMainFactorId(id);
    setShowMainFactorModal(true);
  };

  //* Delete main factor
  const deleteMainFactor = (mainFactorId) => {
    const callback = async () => {
      try {
        await triggerDeleteMainFactor({
          mainFactorId: mainFactorId,
          loginUserId: userDetails?.UserId,
          menuId: selectedMenu?.id,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Contributing Main Factor has been deleted.',
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

  //* Download data
  const handleOnDownload = async (fileType) => {
    try {
      const blob = await triggerDownloadData({
        downloadType: fileType,
        payload: {
          pageIndex,
          pageSize,
          headerFacility: filteredFacility || selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          moduleId: 2,
          // moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
          facilityIds:
            filteredFacility?.toString() || selectedFacility?.id?.toString(),
        },
      }).unwrap();
      if (fileType === 'pdf') {
        saveAs(blob, 'Contributing Main Factor.pdf');
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  //* Variables declaration
  const tableColumnList = [
    {
      id: 'Facility',
      translationId: 'IM_IS_CMF_Facility',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_CMF_P_Facility')
        ?.IsShow,
    },
    {
      id: 'ContributingFactorCode',
      translationId: 'IM_IS_CMF_ContributingMainFactorCode',
      isShow: pageFields?.find(
        (x) => x.FieldId === 'IS_CMF_P_ContributingMainFactorCode'
      )?.IsShow,
    },
    {
      id: 'ContributingFactor',
      translationId: 'IM_IS_CMF_ContributingMainFactor',
      isShow: pageFields?.find(
        (x) => x.FieldId === 'IS_CMF_P_ContributingMainFactor'
      )?.IsShow,
    },
  ];

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
              'IM_IS_CMF_ContributingMainFactor',
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
            style={{
              margin: '10px',
              justifyContent: 'end',
              gap: '10px',
            }}
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
              {pageFields?.find((x) => x.FieldId === 'IS_CMF_P_Facility')
                ?.IsShow && (
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
                        (x) => x.TranslationId === 'IM_IS_CMF_Facility'
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
                      ...(facilityList || []),
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
              )}
              <Grid
                item
                xs={12}
                sm={12}
                md={6}
                lg={3}
                xl={3}
                padding={'10px'}
                gap="10px"
                display="flex"
                flexWrap="wrap"
              >
                {checkAccess(
                  isSuperAdmin,
                  roleMenu?.IsView,
                  roleMenu?.IsAdd || false
                ) && (
                  <StyledButton
                    onClick={() => {
                      setShowMainFactorModal(true);
                    }}
                    disabled={isFetching}
                    fontSize="13px"
                    backgroundColor="#0083c0"
                    style={{ display: 'inline-flex', gap: '8px' }}
                  >
                    <StyledImage
                      src={PlusIcon}
                      height={'0.8rem'}
                      width={'0.8rem'}
                    />
                    {t('AddContributingMainFactor')}
                  </StyledButton>
                )}
                {checkAccess(
                  isSuperAdmin,
                  roleMenu?.IsView,
                  roleMenu?.IsAdd || false
                ) && (
                  <Tooltip title="Reorder" arrow>
                    <StyledImage
                      height="40px"
                      width="40px"
                      gap="10px"
                      cursor="pointer"
                      borderRadius="40px"
                      src={ReorderIcon}
                      alt="Reorder"
                      animate={true}
                      onClick={() =>
                        navigate('/IncidentManagement/ReorderMainFactor')
                      }
                    />
                  </Tooltip>
                )}

                {totalRecords !== 0 &&
                  checkAccess(
                    isSuperAdmin,
                    roleMenu?.IsView,
                    roleMenu?.IsPrint || false
                  ) && (
                    <Tooltip title="Print" arrow>
                      <StyledImage
                        height="40px"
                        width="40px"
                        gap="10px"
                        cursor="pointer"
                        borderRadius="40px"
                        src={PrintFileIcon}
                        alt="Print"
                        animate={true}
                        onClick={() => handleOnDownload('pdf')}
                      />
                    </Tooltip>
                  )}
              </Grid>
            </FlexContainer>
          </FlexContainer>
          <FlexContainer flexDirection="column" width="100%" padding="10px">
            <TableContainer
              component={Paper}
              style={{ border: '1px solid #0083c0' }}
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
                    style={{ top: '0', left: '0', marginTop: '50px' }}
                  >
                    <StyledImage src={LoadingGif} alt="LoadingGif" />
                  </FlexContainer>
                ) : (
                  <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
                    <StyledTableHead
                      backgroundColor="#0083c0"
                      borderLeft="#0083c0"
                    >
                      <TableRow>
                        <StyledTableHeaderCell>
                          {t('SNo')}
                        </StyledTableHeaderCell>
                        {tableColumnList
                          ?.filter((x) => x.isShow)
                          ?.map((column) => (
                            <StyledTableHeaderCell key={column.id}>
                              <TableSortLabel
                                active={orderBy === column.id}
                                direction={
                                  orderBy === column.id ? order : 'asc'
                                }
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
                          roleMenu?.IsEdit || roleMenu?.IsDelete || false
                        ) && (
                          <StyledTableHeaderCell>
                            {t('Actions')}
                          </StyledTableHeaderCell>
                        )}
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {orderedMainFactorList?.length > 0 ? (
                        orderedMainFactorList?.map((row, rowIndex) => (
                          <StyledTableRow key={rowIndex} borderColor="#0083c0">
                            <StyledTableBodyCell>
                              {pageIndex * pageSize + rowIndex + 1}
                            </StyledTableBodyCell>
                            {tableColumnList
                              ?.filter((x) => x.isShow)
                              ?.map((column) => {
                                return (
                                  <StyledTableBodyCell key={column.id}>
                                    {row[column.id] ?? null}
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
                                          editMainFactor(row?.MainFactorId)
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
                                          deleteMainFactor(row?.MainFactorId)
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
        </AccordionDetails>
      </Accordion>
      {showMainFactorModal && (
        <AddEditMainFactor
          showMainFactorModal={showMainFactorModal}
          setShowMainFactorModal={setShowMainFactorModal}
          selectedMainFactorId={selectedMainFactorId}
          setSelectedMainFactorId={setSelectedMainFactorId}
          facilityList={pageLoadData?.Data?.Facilitylist}
          labels={labels}
          refetch={refetch}
          fieldAccess={fieldAccess}
        />
      )}
    </>
  );
};

export default ContributingMainFactor;
