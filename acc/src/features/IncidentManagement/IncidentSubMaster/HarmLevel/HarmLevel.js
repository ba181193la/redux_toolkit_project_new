import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Grid,
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
import PlusIcon from '../../../../assets/Icons/AddSubMaster.png';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import ReorderIcon from '../../../../assets/Icons/reorder.png';
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
import { useDispatch, useSelector } from 'react-redux';
import {
  setHarmLevelPageIndex,
  setHarmLevelPageSize,
} from '../../../../redux/features/IncidentManagement/incidentSubMasterSlice';
import { checkAccess } from '../../../../utils/Auth';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import AddEditHarmLevel from './AddEditHarmLevel';
import {
  useDeleteHarmLevelMutation,
  useDownloadHarmLevelMutation,
  useGetHarmLevelDetailsQuery,
  useGetPageLoadDataQuery,
} from '../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';
import Label from '../../../../components/Label/Label';
import { showSweetAlert } from '../../../../utils/SweetAlert';
import { useNavigate } from 'react-router-dom';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';

const HarmLevel = ({ labels, fieldAccess, expandAll }) => {
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
  const { harmLevelPageIndex: pageIndex, harmLevelPageSize: pageSize } =
    useSelector((state) => state.incidentSubMaster.harmLevel);

  //* State variables
  const [showHarmLevelModal, setShowHarmLevelModal] = useState(false);
  const [roleMenu, setRoleMenu] = useState();
  const [selectedHarmLevelId, setSelectedHarmLevelId] = useState(null);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [harmLevelList, setHarmLevelList] = useState([]);
  const [facilityList, setFacilityList] = useState([]);
  const [fieldLabels, setFieldLabels] = useState([]);
  const [filteredFacility, setFilteredFacility] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [expand, setExpand] = useState(expandAll);

  //* Handlers for pagination
  const handleOnPageChange = (event, newPage) => {
    dispatch(setHarmLevelPageIndex(newPage));
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(setHarmLevelPageSize(parseInt(event.target.value, 10)));
    dispatch(setHarmLevelPageIndex(0));
  };

  //* Sorting table columns
  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const orderedHarmLevelList = [...harmLevelList].sort((a, b) => {
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
      (sectionName) => sectionName?.SectionName === 'Harm Level-Page'
    )
    ?.Regions?.find((region) => region?.RegionCode === 'ALL')?.Fields;

  //* Variables declaration
  const tableColumnList = [
    {
      id: 'Facility',
      translationId: 'IM_IS_HL_Facility',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_HL_P_Facility')?.IsShow,
    },
    {
      id: 'IncidentHarmLevel',
      translationId: 'IM_IS_HL_HarmLevel',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_HL_P_HarmLevel')
        ?.IsShow,
    },
    {
      id: 'HarmLevelDefinition',
      translationId: 'IM_IS_HL_Definition',
      isShow: pageFields?.find((x) => x.FieldId === 'IS_HL_P_Definition')
        ?.IsShow,
    },
    {
      id: 'NotifyStaffs',
      translationId: 'IM_IS_HL_NotificationStaff(s)',
      isShow: pageFields?.find(
        (x) => x.FieldId === 'IS_HL_P_NotificationStaff(s)'
      )?.IsShow,
    },
  ];

  //* RTK Queries

  const [triggerDeleteHarmLevel] = useDeleteHarmLevelMutation();
  const [triggerDownloadData] = useDownloadHarmLevelMutation();

  const { data: pageLoadData } = useGetPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const {
    data: harmLevelDetails,
    isFetching,
    refetch,
  } = useGetHarmLevelDetailsQuery(
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
    if (harmLevelDetails?.Records) {
      setHarmLevelList(harmLevelDetails?.Records);
      setTotalRecords(harmLevelDetails?.TotalRecords);
    }
  }, [pageLoadData, harmLevelDetails]);

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

  //* Edit harm level details
  const editHarmLevel = (harmId) => {
    setSelectedHarmLevelId(harmId);
    setShowHarmLevelModal(true);
  };

  //* Delete harm level
  const deleteHarmLevel = (harmLevelId) => {
    const callback = async () => {
      try {
        await triggerDeleteHarmLevel({
          incidentHarmLevelId: harmLevelId,
          loginUserId: userDetails?.UserId,
          menuId: selectedMenu?.id,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Harm Level has been deleted.',
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
        saveAs(blob, 'Harm Level.pdf');
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
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
              'IM_IS_HL_HarmLevel',
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
                      (x) => x.TranslationId === 'IM_IS_HL_Facility'
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
                      setShowHarmLevelModal(true);
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
                    {t('AddHarmLevel')}
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
                        navigate('/IncidentManagement/ReorderHarmLevel')
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
                      {orderedHarmLevelList?.length > 0 ? (
                        orderedHarmLevelList?.map((row, rowIndex) => (
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
                                          editHarmLevel(
                                            row?.IncidentHarmLevelId
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
                                          deleteHarmLevel(
                                            row?.IncidentHarmLevelId
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
        </AccordionDetails>
      </Accordion>
      {showHarmLevelModal && (
        <AddEditHarmLevel
          showHarmLevelModal={showHarmLevelModal}
          setShowHarmLevelModal={setShowHarmLevelModal}
          selectedHarmLevelId={selectedHarmLevelId}
          setSelectedHarmLevelId={setSelectedHarmLevelId}
          facilityList={pageLoadData?.Data?.Facilitylist}
          labels={labels}
          refetch={refetch}
          fieldAccess={fieldAccess}
        />
      )}
    </>
  );
};

export default HarmLevel;
