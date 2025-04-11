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
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import PlusIcon from '../../../../assets/Icons/AddSubMaster.png';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import DeleteUserGif from '../../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import { getlabel } from '../../../../utils/language';

import {
  StyledImage,
  FlexContainer,
  StyledButton,
} from '../../../../utils/StyledComponents';
import {
  ActionCell,
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
} from '../../../../utils/DataTable.styled';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Label from '../../../../components/Label/Label';
import { checkAccess } from '../../../../utils/Auth';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import {
  setAffectedCategoryPageIndex,
  setAffectedCategoryPageSize,
} from '../../../../redux/features/IncidentManagement/incidentCategorySlice';
import {
  useDeleteAffectedCategoryMutation,
  useDownloadAffectedCategoryMutation,
  useGetAllAffectedCategoryQuery,
} from '../../../../redux/RTK/IncidentManagement/incidentCategoryApi';
import formatDate from '../../../../utils/FormatDate';
import AddEditAffectedCategory from './AddEditAffectedCategory';
import { showSweetAlert } from '../../../../utils/SweetAlert';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';

const AffectedCategory = ({ labels, fieldAccess }) => {
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
    regionCode,
    roleFacilities,
  } = useSelector((state) => state.auth);

  const {
    affectedCategoryPageIndex: pageIndex,
    affectedCategoryPageSize: pageSize,
  } = useSelector((state) => state.IncidentCategory.affectedCategory);

  //* State variables
  const [showAffectedCategoryModal, setShowAffectedCategoryModal] =
    useState(false);
  const [selectedAffectedCategoryId, setSelectedAffectedCategoryId] =
    useState(null);
  const [fieldLabels, setFieldLabels] = useState([]);
  const [roleMenu, setRoleMenu] = useState();
  const [totalRecords, setTotalRecords] = useState(0);
  const [filteredFacility, setFilteredFacility] = useState(null);
  const [affectedCategoryList, setAffectedCategoryList] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [pageFields, setPageFields] = useState([]);
  const [facilityList, setFacilityList] = useState([]);

  //* Handlers for pagination
  const handleOnPageChange = (event, newPage) => {
    dispatch(setAffectedCategoryPageIndex(newPage));
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(setAffectedCategoryPageSize(parseInt(event.target.value, 10)));
    dispatch(setAffectedCategoryPageIndex(0));
  };

  //* Sorting table columns
  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const orderedAffectedCategoryList = [...affectedCategoryList].sort((a, b) => {
    const aValue = a[orderBy]?.toString().toLowerCase();
    const bValue = b[orderBy]?.toString().toLowerCase();

    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  //* Use Effects to bind data
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
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  //* Filtering fields access data
  useEffect(() => {
    if (fieldAccess?.Data) {
      const pageFields = fieldAccess?.Data?.Menus?.find(
        (section) => section?.MenuId === selectedMenu?.id
      )?.Sections?.find(
        (sectionName) => sectionName?.SectionName === 'Affected Category-Page'
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

  //RTK Queries

  const [triggerDownloadData] = useDownloadAffectedCategoryMutation();
  const [triggerDeleteAffectedCategory] = useDeleteAffectedCategoryMutation();

  const {
    data: affectedCategoryDetails,
    isFetching,
    refetch,
  } = useGetAllAffectedCategoryQuery(
    {
      payload: {
        pageIndex: pageIndex + 1,
        pageSize: pageSize,
        headerFacilityId: filteredFacility || selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
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
    if (affectedCategoryDetails?.Records) {
      setAffectedCategoryList(affectedCategoryDetails?.Records);
      setTotalRecords(affectedCategoryDetails?.TotalRecords);
    }
  }, [affectedCategoryDetails]);

  //* Variables declaration
  const tableColumnList = [
    {
      id: 'Facility',
      translationId: 'IM_IC_AC_Facility',
      isShow: pageFields?.find((x) => x.FieldId === 'IC_AC_P_Facility')?.IsShow,
    },
    {
      id: 'AffectedCategoryCode',
      translationId: 'IM_IC_AC_AffectedCategoryCode',
      isShow: pageFields?.find(
        (x) => x.FieldId === 'IC_AC_P_AffectedCategoryCode'
      )?.IsShow,
    },
    {
      id: 'AffectedCategory',
      translationId: 'IM_IC_AC_AffectedCategory',
      isShow: pageFields?.find((x) => x.FieldId === 'IC_AC_P_AffectedCategory')
        ?.IsShow,
    },
    {
      id: 'AddedEditedBy',
      translationId: 'IM_IC_AC_AddedEditedBy',
      isShow: pageFields?.find((x) => x.FieldId === 'IC_AC_P_AddedEditedBy')
        ?.IsShow,
    },
    {
      id: 'AddedEditedDate',
      translationId: 'IM_IC_AC_AddedEditedDate',
      isShow: pageFields?.find((x) => x.FieldId === 'IC_AC_P_AddedEditedDate')
        ?.IsShow,
    },
  ];

  //* Edit main factor details
  const editAffectedCategory = (id) => {
    setSelectedAffectedCategoryId(id);
    setShowAffectedCategoryModal(true);
  };

  //* Download data
  const handleOnDownload = async (fileType) => {
    try {
      const blob = await triggerDownloadData({
        downloadType: fileType,
        payload: {
          pageIndex,
          pageSize,
          headerFacilityId: filteredFacility || selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
          facilityIds:
            filteredFacility?.toString() || selectedFacility?.id?.toString(),
        },
      }).unwrap();
      if (fileType === 'pdf') {
        saveAs(blob, 'Affected Category.pdf');
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  //* Delete Affected category
  const deleteAffectedCategory = (affCatId) => {
    const callback = async () => {
      try {
        await triggerDeleteAffectedCategory({
          affectedCategoryId: affCatId,
          loginUserId: userDetails?.UserId,
          menuId: selectedMenu?.id,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Affected Category has been deleted.',
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
        sx={{ border: '5px', borderColor: '#0083c0', marginBottom: '1rem' }}
      >
        <AccordionSummary
          style={{ padding: '0 10px' }}
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
              'IM_IC_AC_AffectedCategory',
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
                      (x) => x.TranslationId === 'IM_IC_AC_Facility'
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
                    )
                      ?.filter((facility) => facility?.RegionCode === 'ABD')
                      ?.map((facility) => ({
                        text: facility.FacilityName,
                        value: facility.FacilityId,
                      })) || []),
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
                      setShowAffectedCategoryModal(true);
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
                    {t('AddAffectedCategory')}
                  </StyledButton>
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
                          roleMenu?.IsEdit || roleMenu?.IsDelete
                        ) && (
                          <StyledTableHeaderCell>
                            {t('Actions')}
                          </StyledTableHeaderCell>
                        )}
                      </TableRow>
                    </StyledTableHead>
                    <TableBody>
                      {orderedAffectedCategoryList?.length > 0 ? (
                        orderedAffectedCategoryList?.map((row, rowIndex) => (
                          <StyledTableRow key={rowIndex} borderColor="#0083c0">
                            <StyledTableBodyCell>
                              {pageIndex * pageSize + rowIndex + 1}
                            </StyledTableBodyCell>
                            {tableColumnList
                              ?.filter((x) => x.isShow)
                              ?.map((column) => (
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
                              ))}
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
                                          editAffectedCategory(
                                            row?.AffectedCategoryId
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
                                          deleteAffectedCategory(
                                            row?.AffectedCategoryId
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
      {showAffectedCategoryModal && (
        <AddEditAffectedCategory
          showAffectedCategoryModal={showAffectedCategoryModal}
          setShowAffectedCategoryModal={setShowAffectedCategoryModal}
          selectedAffectedCategoryId={selectedAffectedCategoryId}
          setSelectedAffectedCategoryId={setSelectedAffectedCategoryId}
          facilityList={
            userDetails?.ApplicableFacilities?.filter((facility) => {
              if (!facility.IsActive) return false;
              if (isSuperAdmin) return true;
              const facilityItem = roleFacilities
                ?.find((role) => role.FacilityId === facility.FacilityId)
                ?.Menu?.find(
                  (MenuItem) => MenuItem.MenuId === selectedMenu?.id
                );
              return facilityItem?.IsAdd;
            }).map((facility) => ({
              text: facility.FacilityName,
              value: facility.FacilityId,
            })) || []
          }
          labels={labels}
          refetch={refetch}
          fieldAccess={fieldAccess}
        />
      )}
    </>
  );
};

export default AffectedCategory;
