import { useNavigate } from 'react-router-dom';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
  SuccessMessage,
} from '../../../../utils/StyledComponents';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';
import SearchIcon from '../../../../assets/Icons/Search.png';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import FilterIcon from '../../../../assets/Icons/FilterIcon.png';
import FilterTable from '../../../../assets/Icons/FilterTable.png';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  Badge,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import DataTable from './DataTable';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../../utils/language';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import FilterFormField from './FilterFormFIeld';
import FilterCloseIcon from '../../../../assets/Icons/FilterCloseIcon.png';
import {
  useDownloadUserAssignmentDataMutation,
  useGetUADetailsQuery,
} from '../../../../redux/RTK/userAssignmentApi';
import { resetFilters } from '../../../../redux/features/mainMaster/userAssignmentSlice';
import DownloadFileIcon from '../../../../assets/Icons/DownloadFileIcon.png';
// import formatDate from '../../../../utils/FormatDate';
import { saveAs } from 'file-saver';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';

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

const columns = [
  {
    id: 'FacilityName',
    translationId: 'MM_UA_Facility',
    fieldId: 'UA_P_Facility',
    isSelected: true,
  },
  {
    id: 'UserName',
    translationId: 'MM_UA_StaffName',
    fieldId: 'UA_P_StaffName',
    isSelected: true,
  },
  {
    id: 'EmployeeID',
    translationId: 'MM_UA_EmployeeID',
    fieldId: 'UA_P_EmployeeID',
    isSelected: true,
  },
  {
    id: 'DepartmentName',
    translationId: 'MM_UA_Department',
    fieldId: 'UA_P_DepartmentUnit',
    isSelected: true,
  },
  {
    id: 'DesignationName',
    translationId: 'MM_UA_Designation',
    fieldId: 'UA_P_Designation',
    isSelected: true,
  },
  {
    id: 'StaffCategoryName',
    translationId: 'MM_UA_StaffCategory',
    fieldId: 'UA_P_StaffCategory',
    isSelected: true,
  },
  {
    id: 'AssignedRoles',
    translationId: 'MM_UA_AssignedRoles',
    fieldId: 'UA_P_AssignedRoles',
    isSelected: true,
  },
  {
    id: 'CreatedUser',
    translationId: 'MM_UA_AddedEditedBy',
    fieldId: 'UA_P_AddedEditedBy',
    isSelected: true,
  },
  {
    id: 'ModifiedDate',
    translationId: 'MM_UA_AddedEditedDate',
    fieldId: 'UA_P_AddedEditedDate',
    isSelected: true,
  },
  {
    id: 'ActiveStatus',
    translationId: 'MM_UA_Status',
    fieldId: 'UA_P_Status',
    isSelected: true,
  },
];

const UserAssignMentList = () => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const [openFilter, setOpenFilter] = useState(false);
  const [columnEl, setColumnEl] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState(columns);
  const [roleMenu, setRoleMenu] = useState();
  const [userSearchKeyword, setUserSearchKeyword] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const { isMobile, isTablet } = useWindowDimension();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [color, setColor] = useState('');
  const {
    selectedRoleFacility,
    selectedFacility,
    selectedModuleId,
    selectedMenu,
    userDetails,
  } = useSelector((state) => state.auth);

  const { filters, isFilterApplied } = useSelector(
    (state) => state.userAssignment
  );

  const { data: getUserData, isFetching: isUserFetching } =
    useGetUADetailsQuery(
      {
        payload: {
          ...filters,
          pageIndex: filters?.pageIndex + 1,
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

  const { TotalRecords, Records } = getUserData || {
    TotalRecords: 0,
    Records: [],
  };

  useEffect(() => {
    setFilteredRecords([...(Records || [])]);
  }, [Records]);

  const { data: labels = [] } = useGetLabelsQuery({
    menuId: 10,
    moduleId: 1,
  });

  const { data: fields = [] } = useGetFieldsQuery({
    menuId: 10,
    moduleId: 1,
  });

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  const handleToggleFilter = () => {
    setOpenFilter(!openFilter);
  };

  // const handleSelectColumns = (event, column, checked) => {
  //   const columnId = event.target.name;
  //   setSelectedColumns((prevSelectedColumns) =>
  //     prevSelectedColumns.map((col) =>
  //       col.id === columnId ? { ...col, isSelected: checked } : col
  //     )
  //   );
  // };
  const handleSelectColumns = (event, column, checked) => {
    setSelectedColumns((prevSelectedColumns) => {
      const updatedColumns = prevSelectedColumns.map((col) =>
        col.id === column.id // ✅ Ensure correct comparison
          ? { ...col, isSelected: checked }
          : col
      );

      return updatedColumns;
    });
  };

  const [triggerDownloadData] = useDownloadUserAssignmentDataMutation();

  const handleOnDownload = async (fileType) => {
    try {
      setIsLoading(true);
      setColor('#4caf50');
      setMessage('Downloading ...');
      const blob = await triggerDownloadData({
        downloadType: fileType,
        payload: {
          pageIndex: filters?.pageIndex,
          pageSize: filters?.pageSize,
          headerFacility: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
          facilityId: filters?.facilityId,
          searchStaffId: filters?.searchStaffId,
          employeeId: filters?.employeeId,
          designationId: filters?.designationId,
          departmentId: filters?.departmentId,
          staffCategoryId: filters?.staffCategoryId,
          activeStatus: filters?.activeStatus,
          applicationRole: filters?.applicationRole,
        },
      }).unwrap();
      if (fileType === 'pdf') {
        saveAs(blob, 'UserAssignment.pdf');
        setMessage('Download completed');
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      } else {
        saveAs(blob, 'UserAssignment.xlsx');
        setMessage('Download completed');
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      setColor('#e63a2e');
      setMessage('Download failed');
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <FlexContainer flexDirection="column">
      <FlexContainer
        justifyContent={isMobile ? 'space-between' : 'end'}
        padding={isMobile ? '0 0px 10px 0' : '0 0px 20px 0'}
        gap="10px"
      >
        {roleMenu?.IsAdd && (
          <StyledButton
            variant="contained"
            gap="8px"
            padding={isMobile ? '6px 10px' : '6px 16px'}
            width={isMobile ? '100%' : ''}
            startIcon={
              <StyledImage
                height="14px"
                width="14px"
                src={AddSubMaster}
                alt="Add New Icon"
              />
            }
            onClick={() => {
              navigate('/MainMaster/NewUserAssignment');
            }}
          >
            {t('Add')}
          </StyledButton>
        )}
      </FlexContainer>
      {isUserFetching ? (
        <FlexContainer justifyContent="center">
          <StyledImage src={LoadingGif} alt="LoadingGif" />
        </FlexContainer>
      ) : (
        <>
          <FlexContainer
            style={{
              justifyContent: isMobile ? 'center' : 'flex-end',
              flexDirection: isMobile ? 'column' : 'row',
            }}
          >
            {/* <StyledSearch
              variant="outlined"
              placeholder={t('SearchByKeywords')}
              value={userSearchKeyword}
              onChange={(event) => {
                const searchTerm = event.target.value?.toLowerCase();
                setUserSearchKeyword(event.target.value);
                if (searchTerm?.length < 2) {
                  setFilteredRecords(Records);
                  return;
                }

                setFilteredRecords(
                  Records?.filter((item) => {
                    const modifiedBy = String(item.ModifiedBy).toLowerCase();
                    const modifiedDate =
                      formatDate(item.ModifiedDate)?.toLowerCase() || '';
                    const facilityMatches =
                      item.Facilities?.some((facility) => {
                        const facilityStr = String(
                          facility.FacilityName
                        ).toLowerCase();
                        return facilityStr.includes(searchTerm);
                      }) || false;
                    const assignedRolesArray =
                      item.AssignedRoles?.split(',').map((role) =>
                        role.trim().toLowerCase()
                      ) || [];
                    const roleMatches = assignedRolesArray.some((role) =>
                      role.includes(searchTerm)
                    );
                    const staffName = item.UserName?.toLowerCase() || '';
                    const employeeID = item.EmployeeID?.toLowerCase() || '';
                    const department = item.DepartmentName?.toLowerCase() || '';
                    const designation =
                      item.DesignationName?.toLowerCase() || '';
                    const staffCategory =
                      item.StaffCategoryName?.toLowerCase() || '';
                    const modifiedUser = item.ModifiedUser?.toLowerCase() || '';
                    const activeStatus = item.ActiveStatus?.toLowerCase();
                    return (
                      modifiedBy.includes(searchTerm) ||
                      modifiedDate.includes(searchTerm) ||
                      item.AssignedRoles?.toLowerCase().includes(searchTerm) ||
                      facilityMatches ||
                      staffName.includes(searchTerm) ||
                      employeeID.includes(searchTerm) ||
                      department.includes(searchTerm) ||
                      designation.includes(searchTerm) ||
                      staffCategory.includes(searchTerm) ||
                      modifiedUser.includes(searchTerm) ||
                      roleMatches ||
                      activeStatus.includes(searchTerm)
                    );
                  }) || []
                );
              }}
              width={isMobile ? '100%' : '250px'}
              fullWidth={isMobile}
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
              style={{
                marginTop: isMobile ? '16px' : '0',
                flexDirection: isMobile ? 'column' : 'row',
              }}
            >
              <FlexContainer
                gap="10px"
                alignItems="center"
                flexWrap={isMobile || isTablet ? 'wrap' : 'nowrap'}
                justifyContent={isMobile ? 'center' : 'space-between'}
                padding={isMobile ? '0 0px 10px 0' : '0 0px 20px 0'}
              >
                <StyledButton
                  fontSize="12px"
                  backgroundColor="#fff"
                  width={isMobile ? '100%' : 'auto'}
                  colour="#000"
                  onClick={() => dispatch(resetFilters())}
                >
                  {t('ClearAll')}
                </StyledButton>
                <Badge
                  color="primary"
                  overlap="circular"
                  variant="dot"
                  invisible={!isFilterApplied}
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
                      onClick={handleToggleFilter}
                      animate={true}
                    />
                  </Tooltip>
                </Badge>
                <StyledDivider />
                <StyledButton
                  fontSize="12px"
                  backgroundColor="#fff"
                  width={isMobile ? '100%' : 'auto'}
                  colour="#000"
                  onClick={() => {
                    setSelectedColumns((prev) => {
                      return prev.map((item) => ({
                        ...item,
                        isSelected: true,
                      }));
                    });
                  }}
                >
                  {t('ClearAll')}
                </StyledButton>
                <Tooltip title="Configure Columns" arrow>
                  <StyledImage
                    height="40px"
                    width="40px"
                    gap="10px"
                    cursor="pointer"
                    borderRadius="40px"
                    src={FilterTable}
                    alt="Toggle Columns"
                    animate={true}
                    onClick={(event) => setColumnEl(event.currentTarget)}
                  />
                </Tooltip>

                <Menu
                  anchorEl={columnEl}
                  open={Boolean(columnEl)}
                  onClose={() => setColumnEl(null)}
                  sx={{
                    '& .MuiPaper-root': {
                      width: '220px',
                    },
                  }}
                >
                  {selectedColumns?.map((column) => (
                    <MenuItem key={column.id}>
                      <FormControlLabel
                        style={{ padding: '0px 0px 0px 10px' }}
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
                  ))}
                </Menu>

                <StyledDivider />
                {roleMenu?.IsPrint && roleMenu?.IsView && (
                  <Tooltip title="Download" arrow>
                    <StyledImage
                      height="40px"
                      width="40px"
                      gap="10px"
                      cursor="pointer"
                      borderRadius="40px"
                      disabled={!(filteredRecords?.length > 0)}
                      src={DownloadFileIcon}
                      onClick={() => handleOnDownload('excel')}
                      alt="Download"
                      animate={true}
                    />
                  </Tooltip>
                )}
                <StyledDivider />
                {roleMenu?.IsPrint && roleMenu?.IsView && (
                  <Tooltip title="Print" arrow>
                    <StyledImage
                      height="40px"
                      width="40px"
                      gap="10px"
                      cursor="pointer"
                      borderRadius="40px"
                      src={PrintFileIcon}
                      alt="Print"
                      disabled={!(filteredRecords?.length > 0)}
                      animate={true}
                      onClick={() => handleOnDownload('pdf')}
                    />
                  </Tooltip>
                )}
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>

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
                    <Tooltip title="Close" arrow>
                      <StyledImage
                        src={FilterCloseIcon}
                        alt="Filter Close Icon"
                      />
                    </Tooltip>
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
                />{' '}
              </FlexContainer>
            </BorderBox>
          </StyledCollapse>

          <DataTable
            columns={selectedColumns}
            data={filteredRecords}
            labels={labels}
            isView={roleMenu?.IsView}
            isEdit={roleMenu?.IsEdit}
            isDelete={roleMenu?.IsDelete}
            TotalRecords={TotalRecords}
          />
          <SuccessMessage show={isLoading} color={color}>
            {message}
          </SuccessMessage>
        </>
      )}
    </FlexContainer>
  );
};
export default UserAssignMentList;
