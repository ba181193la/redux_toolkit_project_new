import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
  SuccessMessage,
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
import { showSweetAlert } from '../../../../utils/SweetAlert';
import { Formik, Form } from 'formik';
import {  useGetLabelsQuery } from '../../../../redux/RTK/moduleDataApi';
import PlusIcon from '../../../../assets/Icons/AddSubMaster.png';
import SearchIcon from '../../../../assets/Icons/Search.png';
import FilterIcon from '../../../../assets/Icons/FilterIcon.png';
import FilterTable from '../../../../assets/Icons/FilterTable.png';
import DownloadFileIcon from '../../../../assets/Icons/DownloadFileIcon.png';
import UploadFileIcon from '../../../../assets/Icons/UploadFileIcon.png';
import FilterCloseIcon from '../../../../assets/Icons/FilterCloseIcon.png';
import WhiteSearch from '../../../../assets/Icons/WhiteSearch.png';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import Eraser from '../../../../assets/Icons/Eraser.png';
import Error from '../../../../assets/Gifs/error.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import Label from '../../../../components/Label/Label';
import {
  resetDepartmentFilters,
  setDepartmentFilters,
  setIsDepartmentFilterApplied,
} from '../../../../redux/features/mainMaster/departmentMasterSlice';

import {
  useDownloadDepartmentDataMutation,
  useGetDepartmentPageLoadDataQuery,
  useGetDepartmentDetailsQuery,
  useUploadDepartmentDataMutation,
} from '../../../../redux/RTK/departmentMasterApi';
import { showToastAlert } from '../../../../utils/SweetAlert';
import DepartmentDataTable from './DepartmentDataTable';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import formatDate from '../../../../utils/FormatDate';
import { checkFileFormat } from '../../../../utils/FileUploadFormat';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import { saveAs } from 'file-saver';
import ExcelImportModal from '../../../../components/FileUpload.js/ExcelImportModal';

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

const DepartmentList = ({ fields, tabs }) => {
  //* Department table column list
  const departmentColumnsList = [
    {
      id: 'Facility',
      translationId: 'MM_DM_Facility',
      fieldId: 'DM_P_Facility',
      isSelected: true,
      orderNo: 1,
    },
    {
      id: 'Department',
      translationId: 'MM_DM_Department',
      fieldId: 'DM_P_DepartmentUnit',
      isSelected: true,
      orderNo: 2,
    },

    {
      id: 'HOD_Name',
      translationId: 'MM_DM_HODName',
      fieldId: 'DM_P_HODName',
      isSelected: true,
      orderNo: 3,
    },
    {
      id: 'Incharge_Name',
      translationId: 'MM_DM_InchargeName',
      fieldId: 'DM_P_InchargeName',
      isSelected: true,
      orderNo: 4,
    },
    {
      id: 'Location_Type',
      translationId: 'MM_DM_LocationType',
      fieldId: 'DM_P_LocationType',
      isSelected: true,
      orderNo: 5,
    },
    {
      id: 'Added_EditedBy',
      translationId: 'MM_DM_AddedEditedBy',
      fieldId: 'DM_P_AddedEditedBy',
      isSelected: true,
      orderNo: 6,
    },
    {
      id: 'Added_EditedDate',
      translationId: 'MM_DM_AddedEditedDate',
      fieldId:'DM_P_AddedEditedDate',
      isSelected: true,
      orderNo: 7,
    },
  ];

  //*Hooks declaration
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isMobile, isTablet } = useWindowDimension();
  const [uploadPopUp, setUploadPopUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const departmentSampleData = [
    {
      DepartmentName: 'DPT0502_10',
      FacilityCode: 'Health Center - CBE-Madurai',
      LocationName: 'Emergency Room',
      Description: 'Test',
    },
  ];

  //* Selectors
  const { departmentFilters, isDepartmentFilterApplied } = useSelector(
    (state) => state.departmentMaster
  );
  const { pageIndex, pageSize } = useSelector(
    (state) => state.departmentMaster.departmentFilters
  );
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    roleFacilities,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

  //* State Variables
  const formikRef = useRef(null);
  const fileInputRef = useRef(null); // Create a ref for the file input
  const [roleMenu, setRoleMenu] = useState();
  const [departmentSearchKeyword, setDepartmentSearchKeyword] = useState('');
  const [openDepartmentFilter, setOpenDepartmentFilter] = useState(false);
  const [departmentColumnEl, setDepartmentColumnEl] = useState(null);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(departmentColumnsList);
  const [isColumnToggled, setIsColumnToggled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');
  
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

  //*  RTK Queries
  const [triggerDownloadData] = useDownloadDepartmentDataMutation();
  const [triggerUploadDepartmentData] = useUploadDepartmentDataMutation();

  const { data: labels = [] } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  //* Effect to set role menu
  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  //* Fetch page load data
  const { data: pageLoadData } = useGetDepartmentPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const searchFields = fields?.Data?.Sections?.find(
    (section) => section?.SectionName === 'Search'
  )?.Fields;

  //* Department filter fields
  const departmentFilterFields = [
    {
      fieldId: 'DM_S_DepartmentUnit',
      translationId: 'MM_DM_Department',
      label: 'DepartmentName',
      component: 'Dropdown',
      name: 'departmentId',
      options: pageLoadData?.Data?.DepartmentList.map((department) => ({
        text: department.DepartmentName,
        value: department.DepartmentId,
      })),
      isShow: searchFields?.find((x) => x.FieldId === 'DM_S_DepartmentUnit')
        ?.IsShow,
      IsMandatory: searchFields?.find(
        (x) => x.FieldId === 'DM_S_DepartmentUnit'
      )?.IsMandatory,
    },
    {
      fieldId: 'DM_P_HODName',
      translationId: 'MM_DM_HODName',
      label: 'HodName',
      component: 'Dropdown',
      name: 'hodId',
      options: pageLoadData?.Data?.StaffList.map((staff) => ({
        text: staff.UserName,
        value: staff.UserId,
      })),
      isShow: searchFields?.find((x) => x.FieldId === 'DM_P_HODName')?.IsShow,
      IsMandatory: searchFields?.find((x) => x.FieldId === 'DM_P_HODName')
        ?.IsMandatory,
    },
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

  //* Fetch department details
  const {
    data: getDepartmentData = [],
    isFetching,
    refetch,
  } = useGetDepartmentDetailsQuery(
    {
      payload: {
        ...departmentFilters,
        pageIndex: pageIndex + 1,
        pageSize,
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
  //* Destructure the department data
  const { TotalRecords, Records } = getDepartmentData || {
    TotalRecords: 0,
    Records: [],
  };

  useEffect(() => {
    setFilteredRecords([...(Records || [])]);
  }, [Records]);

  //* Toggle filter section
  const toggleDepartmentFilter = () => {
    setOpenDepartmentFilter(!openDepartmentFilter);
  };

  const handleUploadIconClick = () => {
    setUploadPopUp(true);
  };

  //import file
  const handleFileUploadChange = async (event) => {
    let file = event.target.files[0];
    setLoading(true);
    try {
      setColor('#4caf50');
      setMessage('Uploading ...');
      if (file) {
        if (!checkFileFormat(file)) {
          setColor('#e63a2e');
          setMessage('Invalid File Format');
          setTimeout(() => {
            setLoading(false);
          }, 2000);
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        const response = await triggerUploadDepartmentData({
          payload: formData,
        }).unwrap();
        if (response && response.Message) {
          showToastAlert({
            type: 'custom_success',
            text: response.Message,
            gif: SuccessGif,
          });
          refetch();
          setMessage('Upload completed');
          setTimeout(() => {
            setLoading(false);
          }, 2000);
        }
      }
    } catch (error) {
      if (error && error.data) {
        showSweetAlert({
          type: 'warning',
          title: 'Oops!',
          text: error.data,
          gif: Error,
          showConfirmButton: true, // Show the close button
          confirmButtonText: 'Close', // Customize the close button text
        });
        setColor('#e63a2e');
        setMessage('Upload Failed');
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset the input value
      }
    }
  };

  //* Download excel data
  const handleOnDownload = async (fileType) => {
    try {
      setLoading(true);
      setMessage('Downloading ...');
      setColor('#4caf50');
      const blob = await triggerDownloadData({
        downloadType: fileType,
        payload: {
          pageIndex,
          pageSize,
          headerFacilityId: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
          departmentId: departmentFilters.departmentId || 0,
          locationId: departmentFilters.locationId || 0,
          hodId: departmentFilters.hodId || 0,
          facilityIds: departmentFilters?.facilityIds || '',
        },
      }).unwrap();
      if (fileType === 'pdf') {
        saveAs(blob, 'Department.pdf');
      } else {
        saveAs(blob, 'Department.xlsx');
      }
      setColor('#4caf50');
      setMessage('Download completed');
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    } catch (error) {
      setMessage('Download Failed');
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  //* Table columns toggle
  const handleSelectColumns = (event, column) => {
    const columnId = event.target.name;
    setSelectedColumns((prevSelectedColumns) => {
      const newSelectedColumns = prevSelectedColumns.some(
        (col) => col.id === columnId
      )
        ? prevSelectedColumns.filter((col) => col.id !== columnId)
        : [...prevSelectedColumns, column];
      return newSelectedColumns.sort((a, b) => a.orderNo - b.orderNo);
    });
  };

  useEffect(() => {
    if (selectedColumns?.length !== departmentColumnsList?.length) {
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
      style={{
        padding: '1rem',
        border: '1px solid #E0E0E0',
        borderBottomLeftRadius: '5px',
        borderBottomRightRadius: '5px',
      }}
    >
      {roleMenu?.IsView && (
        <FlexContainer
          display="flex"
          justifyContent="flex-end"
          width="100%"
          gap="10px"
          flexWrap="wrap"
        >
          {roleMenu?.IsAdd && (
            <StyledButton
              onClick={() => {
                window.open(
                  `/MainMaster/DepartmentGroup?menuId=${selectedMenu?.id}`,
                  '_blank'
                );
              }}
              style={{ display: 'inline-flex', gap: '10px' }}
            >
              <StyledImage src={PlusIcon} height={'0.8rem'} width={'0.8rem'} />
              {t('AddDepartmentGrouping')}
            </StyledButton>
          )}
          {roleMenu?.IsAdd && (
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
          )}
          {roleMenu?.IsAdd && (
            <StyledButton
              onClick={() => {
                setShowDepartmentModal(true);
              }}
              style={{ display: 'inline-flex', gap: '10px' }}
            >
              <StyledImage src={PlusIcon} height={'0.8rem'} width={'0.8rem'} />
              {t('AddDepartment')}
            </StyledButton>
          )}
        </FlexContainer>
      )}
      <FlexContainer display="flex" justifyContent="space-between" width="100%">
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
            value={departmentSearchKeyword}
            onChange={(event) => {
              const searchTerm = event.target.value?.toLowerCase();
              setDepartmentSearchKeyword(event.target.value);
              if (searchTerm?.length < 1) {
                setFilteredRecords(Records);
                return;
              }

              setFilteredRecords(
                Records?.filter(
                  (item) =>
                    item.Department?.toLowerCase().includes(searchTerm) ||
                    item.Facility?.toLowerCase().includes(searchTerm) ||
                    item.HOD_Name?.toLowerCase().includes(searchTerm) ||
                    item.Incharge_Name?.toLowerCase().includes(searchTerm) ||
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
                setOpenDepartmentFilter(false);
                setIsDepartmentFilterApplied(false);
                formikRef.current.resetForm();
                dispatch(resetDepartmentFilters());
              }}
            >
              {t('ClearAll')}
            </StyledButton>
            <Badge
              color="primary"
              overlap="circular"
              variant="dot"
              invisible={!isDepartmentFilterApplied}
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
                  onClick={toggleDepartmentFilter}
                  animate={true}
                />
              </Tooltip>
            </Badge>
            <StyledDivider />
            <StyledButton
              backgroundColor="#ffffff"
              colour="#000000"
              onClick={() => {
                setSelectedColumns(departmentColumnsList);
              }}
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
                    setDepartmentColumnEl(event.currentTarget)
                  }
                  animate={true}
                />
              </Tooltip>
            </Badge>
            <Menu
              anchorEl={departmentColumnEl}
              open={Boolean(departmentColumnEl)}
              onClose={() => setDepartmentColumnEl(null)}
              sx={{
                '& .MuiPaper-root': {
                  width: '220px',
                },
              }}
            >
              {departmentColumnsList?.map((column) => (
                <MenuItem>
                  <FormControlLabel
                    style={{ padding: '0px 0px 0px 10px' }}
                    key={column.id}
                    control={
                      <Checkbox
                        style={{ padding: '2px 5px 2px 2px' }}
                        checked={selectedColumns.some(
                          (col) => col.id === column.id
                        )}
                        onChange={(e) => handleSelectColumns(e, column)}
                        name={column.id}
                      />
                    }
                    label={getlabel(
                      column.translationId,
                      labels,
                      i18n.language
                    )}
                  />
                </MenuItem>
              ))}
            </Menu>
            <StyledDivider />
            {roleMenu?.IsView && roleMenu?.IsAdd && (
              <>
                <Tooltip title="Upload" arrow>
                  <label>
                    <StyledImage
                      height="40px"
                      width="40px"
                      gap="10px"
                      marginTop="10px"
                      cursor="pointer"
                      borderRadius="40px"
                      onClick={handleUploadIconClick}
                      disabled={!(TotalRecords !== 0)}
                      src={UploadFileIcon}
                      alt="Upload"
                      animate={true}
                    />
                    {/* <input
                        type="file"
                        // accept=".xls,.xlsx"
                        disabled={!(TotalRecords !== 0)}
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={(event)=>{
                          handleFileUploadChange(event)
                        }}
                      /> */}
                  </label>
                </Tooltip>
                <StyledDivider />
              </>
            )}
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
                <StyledDivider />
                <Tooltip title="Print" arrow>
                  <StyledImage
                    height="40px"
                    width="40px"
                    gap="10px"
                    cursor="pointer"
                    borderRadius="40px"
                    src={PrintFileIcon}
                    disabled={!(TotalRecords !== 0 && roleMenu?.IsPrint)}
                    alt="Print"
                    animate={true}
                    onClick={() => handleOnDownload('pdf')}
                  />
                </Tooltip>
              </>
            )}
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
      <StyledCollapse
        in={openDepartmentFilter}
        openFilter={openDepartmentFilter}
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
                onClick={toggleDepartmentFilter}
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
                initialValues={departmentFilters}
                onSubmit={async (values) => {
                  dispatch(
                    setDepartmentFilters({
                      pageIndex: pageIndex,
                      pageSize: pageSize,
                      headerFacilityId: selectedFacility?.id,
                      loginUserId: userDetails?.UserId,
                      moduleId: selectedModuleId,
                      menuId: selectedMenu?.id,
                      departmentId: values?.departmentId || 0,
                      locationId: values?.locationId || 0,
                      hodId: values?.hodId || 0,
                      facilityIds: Array.isArray(values?.facilityIds)
                        ? values?.facilityIds.join(',')
                        : values?.facilityIds.toString(),
                    })
                  );
                  dispatch(setIsDepartmentFilterApplied(true));
                  setOpenDepartmentFilter(false);
                }}
              >
                {({ values, handleSubmit, resetForm, setFieldValue }) => (
                  <Grid container spacing={2} display={'flex'}>
                    {departmentFilterFields.map((field) => {
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
                            padding={'10px'}
                            key={field.fieldId}
                          >
                            <Form>
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
                                  required={field.IsMandatory}
                                />
                              )}
                            </Form>
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
                        type="submit"
                        onClick={handleSubmit}
                        style={{ display: 'inline-flex', gap: '5px' }}
                        startIcon={
                          <StyledImage
                            height="16px"
                            width="16px"
                            src={WhiteSearch}
                            alt="WhiteSearch"
                          />
                        }
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
                          dispatch(resetDepartmentFilters());
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

      <DepartmentDataTable
        columns={selectedColumns}
        records={filteredRecords}
        totalRecords={TotalRecords}
        labels={labels}
        isEdit={roleMenu?.IsEdit}
        isDelete={roleMenu?.IsDelete}
        isView={roleMenu?.IsView}
        showDepartmentModal={showDepartmentModal}
        setShowDepartmentModal={setShowDepartmentModal}
        refetch={refetch}
        tabs={tabs}
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
      <SuccessMessage color={color} show={loading}>
        {message}
      </SuccessMessage>
      <ExcelImportModal
        isOpen={uploadPopUp}
        setIsLoading={setIsLoading}
        setMessage={setMessage}
        setColor={setColor}
        checkFileFormat={checkFileFormat}
        message={message}
        isLoading={isLoading}
        staffSampleData={departmentSampleData}
        triggerUploadData={triggerUploadDepartmentData}
        onClose={() => setUploadPopUp(false)}
        filteredRecords={filteredRecords}
      />
    </FlexContainer>
  );
};

export default DepartmentList;
