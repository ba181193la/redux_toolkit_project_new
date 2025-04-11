import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import {
  Autocomplete,
  Badge,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from '@mui/material';
import { getlabel } from '../../../../utils/language';
import { Formik } from 'formik';
import PlusIcon from '../../../../assets/Icons/AddSubMaster.png';
import SearchIcon from '../../../../assets/Icons/Search.png';
import FilterIcon from '../../../../assets/Icons/FilterIcon.png';
import FilterTable from '../../../../assets/Icons/FilterTable.png';
import DownloadFileIcon from '../../../../assets/Icons/DownloadFileIcon.png';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import FilterCloseIcon from '../../../../assets/Icons/FilterCloseIcon.png';
import WhiteSearch from '../../../../assets/Icons/WhiteSearch.png';
import Eraser from '../../../../assets/Icons/Eraser.png';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Label from '../../../../components/Label/Label';
import {
  useDownloadLocationTypeDataMutation,
  useGetLocationTypeDetailsQuery,
  useGetLocationPageLoadDataQuery,
} from '../../../../redux/RTK/departmentMasterApi';
import { useGetLabelsQuery } from '../../../../redux/RTK/moduleDataApi';
import LocationTypesDataTable from './LocationTypesDataTable';
import { saveAs } from 'file-saver';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import {
  resetLocationTypeFilters,
  setLocationTypeFilters,
  setIsLocationTypeFilterApplied,
} from '../../../../redux/features/mainMaster/departmentMasterSlice';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import formatDate from '../../../../utils/FormatDate';
import UploadFileIcon from '../../../../assets/Icons/UploadFileIcon.png';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import ExcelImportModal from '../../../../components/FileUpload.js/ExcelImportModal';
import { checkFileFormat } from '../../../../utils/FileUploadFormat';

const StyledCollapse = styled(Collapse)`
  padding: ${(props) => (props.openFilter ? '0 0 20px 0' : '0')};
`;

export const StyledDivider = styled(Divider)`
  width: 0px !important;
  height: 30px !important;
  border-left: 1px solid #99cde6 !important;
  opacity: 1 !important;
`;

const BorderBox = styled.div`
  border: 1px solid #0083c0;
  padding: 6px 8px 8px 8px;
  border-radius: 4px;
`;

const LocationTypesList = ({ fields }) => {
  const locationTypeColumnsList = [
    {
      id: 'Facility',
      translationId: 'MM_DM_Facility',
      fieldId: 'DM_P_Facility',
      isSelected: true,
      orderNo: 1,
    },
    {
      id: 'Location_Type',
      translationId: 'MM_DM_LocationType',
      fieldId: 'DM_P_LocationType',
      isSelected: true,
      orderNo: 2,
    },

    {
      id: 'Added_EditedBy',
      translationId: 'MM_DM_AddedEditedBy',
      fieldId: 'DM_P_AddedEditedBy',
      isSelected: true,
      orderNo: 3,
    },
    {
      id: 'Added_EditedDate',
      translationId: 'MM_DM_AddedEditedDate',
      fieldId:'DM_P_AddedEditedDate',
      isSelected: true,
      orderNo: 4,
    },
  ];

  //*Hooks declaration
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const { isMobile, isTablet } = useWindowDimension();
  const [uploadPopUp, setUploadPopUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');

  const locationSampleData = [
    {
      DepartmentName: 'DPT0502_10',
      FacilityCode: 'Health Center - CBE-Madurai',
      LocationName: 'Emergency Room',
      Description: 'Test',
    },
  ];

  //* Selectors
  const { pageIndex, pageSize } = useSelector(
    (state) => state.departmentMaster.locationTypeFilters
  );

  const { locationTypeFilters, isLocationTypeFilterApplied } = useSelector(
    (state) => state.departmentMaster
  );

  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    isSuperAdmin,
    roleFacilities,
  } = useSelector((state) => state.auth);

  //* State Variables
  const formikRef = useRef(null);
  const [roleMenu, setRoleMenu] = useState();
  const [locationTypeSearchKeyword, setLocationTypeKeyword] = useState('');
  const [openLocationTypeFilter, setOpenLocationTypeFilter] = useState(false);
  const [locationTypeColumnEl, setLocationTypeColumnEl] = useState(null);
  const [showLocationTypeModal, setShowLocationTypeModal] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(
    locationTypeColumnsList
  );
  const [isColumnToggled, setIsColumnToggled] = useState(false);

  //* RTK Queries
  const [triggerDownloadData] = useDownloadLocationTypeDataMutation();
  // const [triggerUploadLocationData] = useUploadLocationDataMutation()

  const { data: labels = [] } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });
  const { data: pageLoadData } = useGetLocationPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const searchFields = fields?.Data?.Sections?.find(
    (section) => section?.SectionName === 'Search'
  )?.Fields;

  useEffect(() => {
    const pageFields =
      Array.isArray(fields?.Data?.Sections) &&
      fields.Data.Sections.find((section) => section.SectionName === 'Page')
        ?.Fields;
    setSelectedColumns((prevColumns) =>
      prevColumns?.map((column) => {
        return {
          ...column,
          isShow: Array.isArray(pageFields)
            ? pageFields.find((col) => col.FieldId === column.fieldId)?.IsShow
            : false,
        };
      })
    );
  }, [fields]);

  //* Variables Declaration
  const locationFilterFields = [
    {
      fieldId: 'DM_S_LocationType',
      translationId: 'MM_DM_LocationType',
      label: 'LocationType',
      component: 'Dropdown',
      name: 'locationId',
      options: pageLoadData?.Data?.LocationList.map((location) => ({
        text: location.LocationName,
        value: location.LocationId,
      })),
      isShow: searchFields?.find((x) => x.FieldId === 'DM_S_LocationType')
        ?.IsShow,
      IsMandatory: searchFields?.find((x) => x.FieldId === 'DM_S_LocationType')
        ?.IsMandatory,
    },
    {
      fieldId: 'DM_S_Facility',
      translationId: 'MM_DM_Facility',
      label: 'FacilityName',
      component: 'MultiSelect',
      name: 'facilityIds',
      options: userDetails?.ApplicableFacilities?.filter((facility) => {
        if (!facility.IsActive) return false;
        if (isSuperAdmin) return true;
        const facilityItem = roleFacilities
          ?.find((role) => role.FacilityId === facility.FacilityId)
          ?.Menu?.find((MenuItem) => MenuItem.MenuId === selectedMenu?.id);
        return facilityItem?.IsView;
      }).map((facility) => ({
        text: facility.FacilityName,
        value: facility.FacilityId,
      })),
      isShow: searchFields?.find((x) => x.FieldId === 'DM_S_Facility')?.IsShow,
      IsMandatory: searchFields?.find((x) => x.FieldId === 'DM_S_Facility')
        ?.IsMandatory,
    },
  ];

  //* Effect to set role menu
  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  //* Fetch location type details
  const {
    data: getLocationTypeData = [],
    isFetching,
    refetch,
  } = useGetLocationTypeDetailsQuery(
    {
      payload: {
        ...locationTypeFilters,
        pageIndex: pageIndex + 1,
        pageSize: pageSize,
        headerFacilityId: selectedFacility?.id,
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

  const { TotalRecords, Records } = getLocationTypeData || {
    TotalRecords: 0,
    Records: [],
  };

  useEffect(() => {
    setFilteredRecords([...(Records || [])]);
  }, [Records]);

  //* Toggle filter section
  const toggleLocationTypeFilter = () => {
    setOpenLocationTypeFilter(!openLocationTypeFilter);
  };

  const handleUploadIconClick = () => {
    setUploadPopUp(true);
  };

  //* Download excel data
  const handleOnDownload = async (fileType) => {
    try {
      const blob = await triggerDownloadData({
        downloadType: fileType,
        payload: {
          headerFacilityId: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
          locationId: locationTypeFilters?.locationId || 0,
          facilityIds: locationTypeFilters?.facilityIds || '',
        },
      }).unwrap();
      if (fileType === 'pdf') {
        saveAs(blob, 'LocationType.pdf');
      } else {
        saveAs(blob, 'LocationType.xlsx');
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  //* Table columns toggle
  const handleSelectColumns = (event, column) => {
    const columnId = event.target.name;
    setSelectedColumns((prevSelectedColumns) => {
      const newSelectedColumns = prevSelectedColumns?.some(
        (col) => col.id === columnId
      )
        ? prevSelectedColumns.filter((col) => col.id !== columnId)
        : [...prevSelectedColumns, column];
      return newSelectedColumns.sort((a, b) => a.orderNo - b.orderNo);
    });
  };

  useEffect(() => {
    if (selectedColumns?.length !== locationTypeColumnsList?.length) {
      setIsColumnToggled(true);
    } else {
      setIsColumnToggled(false);
    }
  }, [selectedColumns]);

  return isFetching ? (
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
    <FlexContainer
      width="100%"
      height="100%"
      flexWrap="wrap"
      flexDirection="column"
      style={{
        padding: '1rem',
        border: '1px solid #E0E0E0',
        borderBottomLeftRadius: '5px',
        borderBottomRightRadius: '5px',
      }}
    >
      {roleMenu?.IsAdd && roleMenu?.IsView && (
        <FlexContainer display="flex" justifyContent="flex-end" width="100%">
          <StyledButton
            onClick={() => {
              setShowLocationTypeModal(true);
            }}
            style={{ display: 'inline-flex', gap: '10px' }}
          >
            <StyledImage src={PlusIcon} height={'0.8rem'} width={'0.8rem'} />
            {t('AddLocationType')}
          </StyledButton>
        </FlexContainer>
      )}

      <FlexContainer
        display="flex"
        justifyContent="flex-end"
        flexWrap="wrap"
        width="100%"
        margin="10px 0"
      >
        {/* <StyledSearch
          variant="outlined"
          placeholder={t('SearchByKeywords')}
          value={locationTypeSearchKeyword}
          onChange={(event) => {
            const searchTerm = event.target.value?.toLowerCase();
            setLocationTypeKeyword(event.target.value);

            if (searchTerm?.length < 1) {
              setFilteredRecords(Records);
              return;
            }
            setFilteredRecords(
              Records?.filter(
                (item) =>
                  item.Facility?.toLowerCase().includes(searchTerm) ||
                  item.Location_Type?.toLowerCase().includes(searchTerm) ||
                  item.Added_EditedBy?.toLowerCase().includes(searchTerm) ||
                  formatDate(item.Added_EditedDate)
                    ?.toLowerCase()
                    .includes(searchTerm)
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
        <FlexContainer
          gap="0.8rem"
          alignItems="center"
          display="flex"
          flexWrap={isMobile || isTablet ? 'wrap' : ''}
          justifyContent={isMobile ? 'center' : ''}
        >
          <StyledButton
            backgroundColor="#ffffff"
            colour="#000000"
            onClick={() => {
              setOpenLocationTypeFilter(false);
              setIsLocationTypeFilterApplied(false);
              formikRef.current.resetForm();
              dispatch(resetLocationTypeFilters());
            }}
          >
            {t('ClearAll')}
          </StyledButton>
          <Badge
            color="primary"
            overlap="circular"
            variant="dot"
            invisible={!isLocationTypeFilterApplied}
          >
            <Tooltip title="Filter" arrow>
              <StyledImage
                height="40px"
                width="40px"
                gap="10px"
                borderRadius="40px"
                cursor="pointer"
                src={FilterIcon}
                alt="Filter"
                onClick={toggleLocationTypeFilter}
                animate={true}
              />
            </Tooltip>
          </Badge>
          <StyledDivider />
          <StyledButton
            backgroundColor="#ffffff"
            colour="#000000"
            onClick={() => setSelectedColumns(locationTypeColumnsList)}
          >
            {t('ClearAll')}
          </StyledButton>
          <Badge
            color="primary"
            overlap="circular"
            variant="dot"
            invisible={!isColumnToggled}
          >
            <Tooltip title="Configure Columns" arrow>
              <StyledImage
                height="40px"
                width="40px"
                gap="10px"
                borderRadius="40px"
                cursor="pointer"
                src={FilterTable}
                alt="Filter"
                onClick={(event) =>
                  setLocationTypeColumnEl(event.currentTarget)
                }
                animate={true}
              />
            </Tooltip>
          </Badge>
          <Menu
            anchorEl={locationTypeColumnEl}
            open={Boolean(locationTypeColumnEl)}
            onClose={() => setLocationTypeColumnEl(null)}
            sx={{
              '& .MuiPaper-root': {
                width: '220px',
              },
            }}
          >
            {locationTypeColumnsList?.map((column) => (
              <MenuItem>
                <FormControlLabel
                  style={{ padding: '0px 0px 0px 10px' }}
                  key={column.id}
                  control={
                    <Checkbox
                      style={{ padding: '2px 5px 2px 2px' }}
                      checked={selectedColumns?.some(
                        (col) => col.id === column.id
                      )}
                      onChange={(e) => handleSelectColumns(e, column)}
                      name={column.id}
                    />
                  }
                  label={getlabel(column.translationId, labels, i18n.language)}
                />
              </MenuItem>
            ))}
          </Menu>
          <StyledDivider />
          {roleMenu?.IsView && roleMenu?.IsPrint && (
            <>
              <Tooltip title="Download" arrow>
                <StyledImage
                  height="40px"
                  width="40px"
                  gap="10px"
                  cursor="pointer"
                  borderRadius="40px"
                  src={DownloadFileIcon}
                  disabled={!(TotalRecords !== 0)}
                  alt="Download"
                  animate={true}
                  onClick={() => handleOnDownload('excel')}
                />
              </Tooltip>
              <Tooltip title="Upload" arrow>
                <StyledImage
                  height="40px"
                  width="40px"
                  gap="10px"
                  cursor="pointer"
                  borderRadius="40px"
                  src={UploadFileIcon}
                  disabled={!(TotalRecords !== 0)}
                  alt="Download"
                  animate={true}
                  onClick={handleUploadIconClick}
                />
              </Tooltip>
              <StyledDivider />
              <Tooltip title="Print" arrow>
                <StyledImage
                  height="40px"
                  width="40px"
                  gap="10px"
                  cursor="pointer"
                  borderRadius="40px"
                  src={PrintFileIcon}
                  disabled={!(TotalRecords !== 0)}
                  alt="Print"
                  animate={true}
                  onClick={() => handleOnDownload('pdf')}
                />
              </Tooltip>
            </>
          )}
        </FlexContainer>
      </FlexContainer>
      <StyledCollapse
        in={openLocationTypeFilter}
        openFilter={openLocationTypeFilter}
        style={{ width: '100%' }}
      >
        <BorderBox>
          <FlexContainer flexDirection="column" style={{ padding: '10px' }}>
            <FlexContainer
              style={{
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <StyledTypography
                fontSize={'18px'}
                color="#205475"
                padding="2px 0 2px 0"
                fontWeight="700"
                lineHeight="21.6px"
              >
                {t('SelectFilter')}
              </StyledTypography>
              <IconButton
                onClick={toggleLocationTypeFilter}
                sx={{
                  color: '#205475',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease',
                    backgroundColor: 'rgba(15, 108, 189, 0.2)',
                  },
                }}
              >
                <StyledImage
                  src={FilterCloseIcon}
                  alt="Filter Close Icon"
                  tooltip="Close"
                />
              </IconButton>
            </FlexContainer>
            <Divider
              sx={{
                marginY: '15px',
                borderColor: '#0083C0',
                width: 'calc(100% - 10px)',
              }}
            />
            <FlexContainer>
              <Formik
                innerRef={formikRef}
                enableReinitialize={true}
                initialValues={locationTypeFilters}
                onSubmit={async (values) => {
                  dispatch(
                    setLocationTypeFilters({
                      pageIndex: pageIndex,
                      pageSize: pageSize,
                      headerFacilityId: selectedFacility?.id,
                      moduleId: selectedModuleId,
                      loginUserId: userDetails?.UserId,
                      menuId: selectedMenu?.id,
                      locationId: values?.locationId || 0,
                      facilityIds: values?.facilityIds
                        ? values?.facilityIds.join(',').toString()
                        : '',
                    })
                  );
                  dispatch(setIsLocationTypeFilterApplied(true));
                  setOpenLocationTypeFilter(false);
                }}
              >
                {({ values, handleSubmit, resetForm, setFieldValue }) => (
                  <Grid container spacing={2} display={'flex'}>
                    {locationFilterFields.map((field) => {
                      const translatedLabel = getlabel(
                        field?.translationId,
                        labels,
                        i18n.language
                      );
                      return (
                        field?.isShow && (
                          <Grid
                            item
                            xs={12}
                            sm={12}
                            md={6}
                            lg={3}
                            xl={3}
                            key={field?.fieldId}
                            padding={'10px'}
                          >
                            <Label value={translatedLabel} />
                            {field.component === 'Dropdown' && (
                              <SearchDropdown
                                disableClearable={true}
                                name={field.name}
                                options={[
                                  { text: 'Select', value: '' },
                                  ...(field.options || []),
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
                                value={
                                  field?.options?.find(
                                    (option) =>
                                      option.value === values[field.name]
                                  ) || null
                                }
                                onChange={(event, value) => {
                                  setFieldValue(field.name, value?.value);
                                }}
                              />
                            )}
                            {field.component === 'MultiSelect' && (
                              <MultiSelectDropdown
                                name={field.name}
                                options={field.options}
                              />
                            )}
                          </Grid>
                        )
                      );
                    })}
                    <Grid
                      padding="10px"
                      item
                      xs={12}
                      display="flex"
                      justifyContent="flex-end"
                      gap="10px"
                      flexWrap="wrap"
                    >
                      <StyledButton
                        borderRadius="6px"
                        gap="4px"
                        padding="6px 10px"
                        variant="contained"
                        color="primary"
                        style={{ display: 'inline-flex', gap: '5px' }}
                        startIcon={
                          <StyledImage
                            height="16px"
                            width="16px"
                            src={WhiteSearch}
                            alt="WhiteSearch"
                          />
                        }
                        onClick={handleSubmit}
                      >
                        {t('Search')}
                      </StyledButton>
                      <StyledButton
                        variant="outlined"
                        border="1px solid #0083c0"
                        backgroundColor="#ffffff"
                        colour="#0083c0"
                        borderRadius="6px"
                        sx={{ marginLeft: '10px' }}
                        style={{ display: 'inline-flex', gap: '5px' }}
                        startIcon={
                          <StyledImage
                            height="16px"
                            width="16px"
                            src={Eraser}
                            alt="Eraser"
                          />
                        }
                        onClick={() => {
                          dispatch(resetLocationTypeFilters());
                          resetForm();
                        }}
                      >
                        {t('ClearAll')}
                      </StyledButton>
                    </Grid>
                  </Grid>
                )}
              </Formik>
            </FlexContainer>
          </FlexContainer>
        </BorderBox>
      </StyledCollapse>
      <LocationTypesDataTable
        columns={selectedColumns}
        records={filteredRecords}
        totalRecords={TotalRecords}
        labels={labels}
        isEdit={roleMenu?.IsEdit}
        isDelete={roleMenu?.IsDelete}
        isView={roleMenu?.IsView}
        showLocationTypeModal={showLocationTypeModal}
        setShowLocationTypeModal={setShowLocationTypeModal}
        locationList={pageLoadData?.Data?.LocationList.map((location) => ({
          text: location.LocationName,
          value: location.LocationId,
        }))}
        refetch={refetch}
        fieldAccess={fields}
        facilityList={userDetails?.ApplicableFacilities?.filter((facility) => {
          if (!facility.IsActive) return false;
          if (isSuperAdmin) return true;
          const facilityItem = roleFacilities
            ?.find((role) => role.FacilityId === facility.FacilityId)
            ?.Menu?.find((MenuItem) => MenuItem.MenuId === selectedMenu?.id);
          return facilityItem?.IsAdd;
        }).map((facility) => ({
          text: facility.FacilityName,
          value: facility.FacilityId,
        }))}
      />
      <ExcelImportModal
        isOpen={uploadPopUp}
        setIsLoading={setIsLoading}
        setMessage={setMessage}
        setColor={setColor}
        checkFileFormat={checkFileFormat}
        message={message}
        isLoading={isLoading}
        staffSampleData={locationSampleData}
        // triggerUploadData={triggerUploadDepartmentData}
        onClose={() => setUploadPopUp(false)}
        filteredRecords={filteredRecords}
      />
    </FlexContainer>
  );
};

export default LocationTypesList;
