import DataTable from './DataTable';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
  SuccessMessage,
} from '../../../../utils/StyledComponents';
import Error from '../../../../assets/Gifs/error.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';
import DownloadFileIcon from '../../../../assets/Icons/DownloadFileIcon.png';
import FilterIcon from '../../../../assets/Icons/FilterIcon.png';
import FilterTable from '../../../../assets/Icons/FilterTable.png';
import UploadFileIcon from '../../../../assets/Icons/UploadFileIcon.png';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import { useEffect, useState,useRef } from 'react';
import styled from 'styled-components';
import {
  Collapse,
  Divider,
  InputAdornment,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
  Badge,
  Tooltip,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../../utils/language';
import { useTranslation } from 'react-i18next';
import FilterFormField from './FilterFormFields';
import FilterCloseIcon from '../../../../assets/Icons/FilterCloseIcon.png';
import {
  useDownloadStaffDataMutation,
  useGetStaffDetailsQuery,
  useUploadStaffDataMutation,
} from '../../../../redux/RTK/staffMasterApi';
import { showSweetAlert,showToastAlert } from '../../../../utils/SweetAlert';
import { saveAs } from 'file-saver';
import { columnsMapping } from './ColumnsMapping';
import { resetFilters } from '../../../../redux/features/mainMaster/staffMasterSlice';
import { media } from '../../../../utils/Breakpoints';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import SearchIcon from '../../../../assets/Icons/Search.png';
import formatDate from '../../../../utils/FormatDate';
import { checkFileFormat } from '../../../../utils/FileUploadFormat';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';

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
const StyledCollapse = styled(Collapse)`
  padding: ${(props) => (props.openFilter ? '0 0 20px 0' : '0')};
`;

const StyledFlexContainer = styled(FlexContainer)`
  flex-direction: column;
  ${media.screen.small`
    flex-direction: row;
    `}
`;

const StaffList = () => {
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();
  const fileInputRef = useRef(null); // Create a ref for the file input
  const { isMobile, isTablet } = useWindowDimension();
  const [userSearchKeyword, setUserSearchKeyword] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState(columnsMapping);
  const [openFilter, setOpenFilter] = useState(false);
  const [columnEl, setColumnEl] = useState(null);
  const [roleMenu, setRoleMenu] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');

  const {
    selectedFacility,
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
  } = useSelector((state) => state.auth);
  const { filters, isFilterApplied } = useSelector(
    (state) => state.staffMaster
  );

  const [triggerDownloadData] = useDownloadStaffDataMutation();
  const [triggerUploadData] = useUploadStaffDataMutation();

  const { data: labels = [], isFetching: isLabelsFetching } = useGetLabelsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );


  const { data: fields = [], isFetching: isFieldsFetching } = useGetFieldsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );



  const {
    data: getStaffData = [],
    isFetching,
    refetch,
  } = useGetStaffDetailsQuery(
    {
      payload: {
        ...filters,
        pageIndex: filters.pageIndex + 1,
        headerFacility: selectedFacility?.id,
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
  const { totalRecords, records } = getStaffData || {
    totalRecords: 0,
    records: [],
  };

  useEffect(() => {
    setFilteredRecords([...(records || [])]);
  }, [records]);

  useEffect(() => {
    const pageFields = fields?.Data?.Sections?.find(
      (section) => section.SectionName === 'Page'
    )?.Fields;
    setSelectedColumns((prevColumns) =>
      prevColumns?.map((column) => {
        return {
          ...column,
          isShow: pageFields?.find((col) => col.FieldId === column.fieldId)
            ?.IsShow,
        };
      })
    );
  }, [fields]);

  useEffect(() => {
    if (selectedFacility?.id) refetch();
  }, [selectedFacility?.id]);

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  const handleToggleFilter = () => {
    setOpenFilter(!openFilter);
  };

  const handleSelectColumns = (event, column, checked) => {
    const columnId = event.target.name;
    setSelectedColumns((prevSelectedColumns) =>
      prevSelectedColumns.map((col) =>
        col.id === columnId ? { ...col, isSelected: checked } : col
      )
    );
  };

  const handleFileUploadChange = async (event) => {
    try {
      //file
      let file = event.target.files[0];
      setColor('#4caf50');
      setIsLoading(true);
      setMessage('Uploading ...');
      if (file) {
        if (!checkFileFormat(file)) {
          setColor('#e63a2e');
          setMessage('Invalid File Format');
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        const response = await triggerUploadData({
          payload: formData,
        }).unwrap();
        if (response && response.Message) {
          showToastAlert({
            type: 'custom_success',
            text: response.Message,
            gif: SuccessGif,
          });
          refetch()
          setMessage('Upload completed');
          setTimeout(() => {
            setIsLoading(false);
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
          setIsLoading(false);
        }, 2000);
      }
    }finally{
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the input value
      } 
    }
  };
  const handleOnDownloadOrPrint = async (fileType) => {
    if (filteredRecords?.length > 0) {
      try {
        setIsLoading(true);
        setColor('#4caf50');
        setMessage('Downloading ...');
        const blob = await triggerDownloadData({
          downloadType: fileType,
          payload: {
            ...filters,
            headerFacility: selectedFacility?.id,
            loginUserId: userDetails?.UserId,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
          },
        }).unwrap();
        if (fileType === 'pdf') {
          saveAs(blob, 'Staff.pdf');
          setMessage('Download completed');
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        } else {
          saveAs(blob, 'Staff.xlsx');
          setMessage('Download completed');
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        }
      } catch (error) {
        setColor('#e63a2e');
        setMessage('Download Failed');
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    }
  };

  const handleOpen = (event) => {
    setColumnEl(event.currentTarget);
  };


  return (
    <FlexContainer flexDirection="column">
      {roleMenu?.IsView && roleMenu?.IsAdd && (
        <FlexContainer
          justifyContent={isMobile ? 'space-between' : 'end'}
          padding={isMobile ? '0 0px 10px 0' : '0 0px 20px 0'}
          gap="10px"
          flexWrap="wrap"
        >
          <StyledButton
            variant="contained"
            color="success"
            padding={isMobile ? '6px 10px' : '6px 16px'}
            width={isMobile ? '100%' : ''}
            onClick={() => {
              window.open(`/form-builder/${selectedMenu?.id}`, '_blank');
            }}
            startIcon={
              <StyledImage
                height="14px"
                width="14px"
                src={AddSubMaster}
                alt="Add New Icon"
                style={{ marginInlineEnd: 8 }}
              />
            }
          >
            {t('AddCustomForm')}
          </StyledButton>
          <StyledButton
            variant="contained"
            padding={isMobile ? '6px 10px' : '6px 16px'}
            width={isMobile ? '100%' : ''}
            startIcon={
              <StyledImage
                height="14px"
                width="14px"
                src={AddSubMaster}
                alt="Add New Icon"
                style={{ marginInlineEnd: 8 }}
              />
            }
            onClick={() => {
              window.open(
                `/MainMaster/StaffSubMaster?menuId=${selectedMenu?.id}`,
                '_blank'
              );
            }}
          >
            {t('AddSubMaster')}
          </StyledButton>
          <StyledButton
            variant="contained"
            width={isMobile ? '100%' : ''}
            startIcon={
              <StyledImage
                height="14px"
                width="14px"
                src={AddSubMaster}
                alt="Add New Icon"
                style={{ marginInlineEnd: 8 }}
              />
            }
            onClick={() => {
              window.open(
                `/MainMaster/AddNewStaffMaster?menuId=${selectedMenu?.id}`,
                '_blank'
              );
            }}
          >
            {t('AddNew')}
          </StyledButton>
        </FlexContainer>
      )}
      {isFetching || isLabelsFetching || isFieldsFetching ? (
        <FlexContainer justifyContent="center">
          <StyledImage src={LoadingGif} alt="LoadingGif" />
        </FlexContainer>
      ) : (
        <>
          <StyledFlexContainer style={{ justifyContent: 'space-between' }}>
            <div></div>
            {/* <StyledSearch
              variant="outlined"
              width={isMobile ? '100%' : ''}
              placeholder={t('SearchByKeywords')}
              value={userSearchKeyword}
              onChange={(event) => {
                const searchTerm = event.target.value?.toLowerCase();
                setUserSearchKeyword(event.target.value);
                if (searchTerm?.length < 2) {
                  setFilteredRecords(records);
                  return;
                }

                setFilteredRecords(
                  records?.filter((item) => {
                    const submittedBy = String(
                      item.Added_EditedBy
                    ).toLowerCase();
                    const createdDate =
                      formatDate(item.Added_EditedDate)?.toLowerCase() || '';
                    const department = item.Department?.toLowerCase() || '';
                    const employeeId = item.EmployeeId?.toLowerCase() || '';
                    const employeeType = item.EmployeeType?.toLowerCase() || '';
                    const facility = item.Facility?.toLowerCase();
                    const designation =
                      item.PrimaryDesignation?.toLowerCase() || '';
                    const secondaryDesignation =
                      item.SecondaryDesignation?.toLowerCase() || '';
                    const staffCategory =
                      item.StaffCategory?.toLowerCase() || '';
                    const staffName = item.StaffName?.toLowerCase() || '';
                    const status = item.Status?.toLowerCase() || '';
                    return (
                      submittedBy.includes(searchTerm) ||
                      createdDate.includes(searchTerm) ||
                      department.includes(searchTerm) ||
                      employeeId.includes(searchTerm) ||
                      employeeType.includes(searchTerm) ||
                      facility.includes(searchTerm) ||
                      designation.includes(searchTerm) ||
                      secondaryDesignation.includes(searchTerm) ||
                      staffCategory.includes(searchTerm) ||
                      staffName.includes(searchTerm) ||
                      status.includes(searchTerm)
                    );
                  }) || []
                );
              }}
              fullWidth={false}
              margin="normal"
              autoComplete="off"
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    style={{ paddingInlineStart: '10px' }}
                  >
                    <StyledImage src={SearchIcon} alt="Search Icon" />
                  </InputAdornment>
                ),
              }}
            /> */}
            <FlexContainer
              gap="10px"
              alignItems="center"
              margin="0 0 16px 0"
              flexWrap={isMobile || isTablet ? 'wrap' : ''}
              justifyContent={isMobile ? 'center' : ''}
            >
              <StyledButton
                fontSize="12px"
                backgroundColor="#fff"
                colour="#000"
                onClick={() => dispatch(resetFilters())}
              >
                {t('ClearAll')}
              </StyledButton>
              <Tooltip title="Filter" arrow>
                <Badge
                  color="primary"
                  overlap="circular"
                  variant="dot"
                  invisible={!isFilterApplied}
                >
                  <StyledImage
                    height="40px"
                    width="40px"
                    gap="10px"
                    borderRadius="40px"
                    cursor="pointer"
                    src={FilterIcon}
                    alt="Filter"
                    onClick={handleToggleFilter}
                    animate={true}
                  />
                </Badge>
              </Tooltip>
              <StyledDivider />
              <StyledButton
                fontSize="12px"
                backgroundColor="#fff"
                colour="#000"
                onClick={() => {
                  setSelectedColumns((prev) => {
                    return prev.map((item) => ({ ...item, isSelected: true }));
                  });
                }}
              >
                {t('ClearAll')}
              </StyledButton>
              <Tooltip title="Toggle Columns" arrow>
                <StyledImage
                  height="40px"
                  width="40px"
                  gap="10px"
                  cursor="pointer"
                  borderRadius="40px"
                  src={FilterTable}
                  alt="Toggle Columns"
                  animate={true}
                  onClick={handleOpen}
                />
              </Tooltip>
              <Menu
                anchorEl={columnEl}
                open={Boolean(columnEl)}
                onClose={() => setColumnEl(null)}
                sx={{
                  '& .MuiPaper-root': {
                    width: 'auto',
                    height: '400px',
                  },
                }}
              >
                {selectedColumns
                  ?.filter((col) => col.isShow)
                  ?.map((column) => {
                    return (
                      <MenuItem key={column.id}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              style={{ padding: '2px 5px 2px 2px' }}
                              checked={column.isSelected}
                              onChange={(e, checked) =>
                                handleSelectColumns(e, column, checked)
                              }
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
                    );
                  })}
              </Menu>
              <StyledDivider />
              {roleMenu?.IsPrint && roleMenu?.IsView && (
                <Tooltip title="Download" arrow>
                  <StyledImage
                    height="40px"
                    width="40px"
                    gap="10px"
                    cursor={
                      filteredRecords?.length > 0 ? 'pointer' : 'not-allowed'
                    }
                    borderRadius="40px"
                    disabled={!(filteredRecords?.length > 0)}
                    src={DownloadFileIcon}
                    alt="Download"
                    animate={true}
                    onClick={() => handleOnDownloadOrPrint('excel')}
                  />
                </Tooltip>
              )}
              {roleMenu?.IsAdd && roleMenu?.IsView && (
                <Tooltip title="Upload" arrow>
                  <label>
                    <StyledImage
                      height="40px"
                      width="40px"
                      gap="10px"
                      marginTop="10px"
                      cursor="pointer"
                      borderRadius="40px"
                      src={UploadFileIcon}
                      disabled={!(filteredRecords?.length > 0)}
                      alt="Upload"
                      animate={true}
                    />
                    <input
                      type="file"
                      // accept=".xls,.xlsx"
                      ref={fileInputRef}
                      disabled={!(filteredRecords?.length > 0)}
                      style={{ display: 'none' }}
                      onChange={handleFileUploadChange}
                    />
                  </label>
                </Tooltip>
              )}

              {roleMenu?.IsAdd && roleMenu?.IsView && (
                <Tooltip title="Print" arrow>
                  <StyledImage
                    height="40px"
                    width="40px"
                    gap="10px"
                    cursor={
                      filteredRecords?.length > 0 ? 'pointer' : 'not-allowed'
                    }
                    borderRadius="40px"
                    src={PrintFileIcon}
                    disabled={!(filteredRecords?.length > 0)}
                    alt="Print"
                    animate={true}
                    onClick={() => handleOnDownloadOrPrint('pdf')}
                  />
                </Tooltip>
              )}
            </FlexContainer>
          </StyledFlexContainer>

          <StyledCollapse in={openFilter} openFilter={openFilter}>
            <BorderBox>
              <FlexContainer flexDirection="column" padding="0 8px">
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
                    onClick={handleToggleFilter}
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
                <FilterFormField
                  handleToggleFilter={handleToggleFilter}
                  fields={fields}
                  labels={labels}
                />
              </FlexContainer>
            </BorderBox>
          </StyledCollapse>

          <DataTable
            columns={selectedColumns}
            records={filteredRecords}
            totalRecords={totalRecords}
            labels={labels}
            isView={roleMenu?.IsView}
          />
          <SuccessMessage show={isLoading} color={color}>
            {message}
          </SuccessMessage>
        </>
      )}
    </FlexContainer>
  );
};

export default StaffList;
