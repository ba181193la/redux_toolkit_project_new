import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../utils/StyledComponents';
import EyeIcon from '../../../assets/Icons/EyeIcon.png';
import FilterIcon from '../../../assets/Icons/FilterIcon.png';
import FilterTable from '../../../assets/Icons/FilterTable.png';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import {
  Collapse,
  Divider,
  InputAdornment,
  Menu,
  MenuItem,
  Checkbox,
  FormControlLabel,
  IconButton,
  CircularProgress,
  Badge,
  Tooltip,
} from '@mui/material';
import { getlabel } from '../../../utils/language';
import FilterCloseIcon from '../../../assets/Icons/FilterCloseIcon.png';
import { resetFilters } from '../../../redux/features/mainMaster/auditLogSlice';
import { useTranslation } from 'react-i18next';
import useWindowDimension from '../../../hooks/useWindowDimension';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../redux/RTK/moduleDataApi';
import {
  useDownloadAuditLogListDataMutation,
  useGetAllAuditLogsQuery,
} from '../../../redux/RTK/auditLogApi';
import DataTable from './DataTable';
import FilterFormFields from './FilterFormFields';
import formatDate from '../../../utils/FormatDate';
import AuditLogModalPopup from './AuditLogModalPopup';
import DownloadFileIcon from '../../../assets/Icons/DownloadFileIcon.png';
import { saveAs } from 'file-saver';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';

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

export const columns = [
  {
    id: 'Facility',
    translationId: 'MM_AL_Facility',
    fieldId: 'AL_P_Facility',
    isSelected: true,
  },
  {
    id: 'DateTime',
    translationId: 'MM_AL_DateandTime',
    fieldId: 'AL_P_DateandTime',
    isSelected: true,
  },
  {
    id: 'UserName',
    translationId: 'MM_AL_StaffName',
    fieldId: 'AL_P_StaffName',
    isSelected: true,
  },
  {
    id: 'ModuleName',
    translationId: 'MM_AL_ModuleName',
    fieldId: 'AL_P_ModuleName',
    isSelected: true,
  },
  {
    id: 'PageName',
    translationId: 'MM_AL_PageName',
    fieldId: 'AL_P_PageName',
    isSelected: true,
  },
  {
    id: 'ReferenceNo',
    translationId: 'MM_AL_ReferenceNumber',
    fieldId: 'AL_P_MM_ML_ReferenceNumber',
    isSelected: true,
  },
  {
    id: 'Activity',
    translationId: 'MM_AL_Activity',
    fieldId: 'AL_P_Activity',
    isSelected: true,
  },
];

const AuditLogList = () => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { isMobile, isTablet } = useWindowDimension();
  const [selectedColumns, setSelectedColumns] = useState(columns);
  const [openFilter, setOpenFilter] = useState(false);
  const [columnEl, setColumnEl] = useState(null);
  const dispatch = useDispatch();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [isViewModal, setIsViewModal] = useState(false);
  const [eventId, setEventId] = useState(null);
  const [roleMenu, setRoleMenu] = useState();

  const { filters, isFilterApplied } = useSelector((state) => state.auditLog);

  const {
    selectedFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedRoleFacility,
  } = useSelector((state) => state.auth);

  const handleToggleFilter = () => {
    setOpenFilter(!openFilter);
  };

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  const { data: labels = [], isFetching: isFetchingLabelsData } =
    useGetLabelsQuery({
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    });

  const { data: fields = [], isFetching: isFetchingFieldsData } =
    useGetFieldsQuery({
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    });

  const { data: auditLogData = [], isFetching: isFetchingAuditLogData } =
    useGetAllAuditLogsQuery(
      {
        payload: {
          ...filters,
          moduleName: filters?.moduleName || 0,
          pageName: filters?.pageName || 0,
          fromDate: filters?.fromDate,
          toDate: filters?.toDate || '',
          facilityId: filters?.facilityId || '',
          referenceNo: filters?.referenceNo || '',
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

  const { totalRecords: TotalRecords, records: Records } = auditLogData || {
    TotalRecords: 0,
    Records: [],
  };

  useEffect(() => {
    setFilteredRecords([...(Records || [])]);
  }, [Records]);

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

  const handleSelectColumns = (event, column) => {
    const columnId = event.target.name;
    setSelectedColumns((prevSelectedColumns) =>
      prevSelectedColumns.some((col) => col.id === columnId)
        ? prevSelectedColumns.filter((col) => col.id !== columnId)
        : [...prevSelectedColumns, column]
    );
  };

  const [triggerDownloadData] = useDownloadAuditLogListDataMutation();

  const handleOnDownload = async () => {
    try {
      const blob = await triggerDownloadData({
        payload: {
          pageIndex: filters?.pageIndex,
          pageSize: filters?.pageSize,
          headerFacility: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
          moduleName: filters?.moduleName,
          pageName: filters?.pageName,
          from: filters?.from,
          to: filters?.to,
          logUserId: filters?.logUserId,
        },
      }).unwrap();

      saveAs(blob, 'AuditLog.xlsx');
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="space-between"
    >
      <FlexContainer
        justifyContent={'space-between'}
        style={{ paddingBottom: '15px' }}
      >
        <StyledTypography
          fontSize="36px"
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('MM_AuditLog')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer width="100%" height="auto" flex="1" flexDirection="column">
        <FlexContainer
          height="100%"
          width="100%"
          padding="15px 15px 0"
          borderRadius="8px"
          flexDirection="column"
          backgroundColor="#fff"
          boxShadow="0px 4px 4px 0px #00000029"
        >
          <FlexContainer flexDirection="column">
            {isFetchingFieldsData ||
            isFetchingLabelsData ||
            isFetchingAuditLogData ? (
              <FlexContainer justifyContent="center">
                <StyledImage src={LoadingGif} alt="LoadingGif" />
              </FlexContainer>
            ) : (
              <>
                <FlexContainer
                  style={{ justifyContent: 'space-between' }}
                  flexDirection={isMobile || isTablet ? 'column' : 'row'}
                >
                  {/* <StyledSearch
                    variant="outlined"
                    placeholder={t('SearchByKeywords')}
                    value={searchKeyword}
                    onChange={(event) => {
                      const searchTerm = event.target.value?.toLowerCase();
                      setSearchKeyword(event.target.value);
                      if (searchTerm?.length < 2) {
                        setFilteredRecords(Records);
                        return;
                      }

                      setFilteredRecords(
                        Records?.filter((item) => {
                          const pageName = item.PageName?.toLowerCase() || '';
                          const moduleName =
                            item.ModuleName?.toLowerCase() || '';
                          const activity = item.Activity?.toLowerCase() || '';
                          const dateTime =
                            formatDate(item.DateTime)?.toLowerCase() || '';
                          const userName = item.UserName?.toLowerCase() || '';
                          const referenceNo =
                            item.ReferenceNo?.toLowerCase() || '';
                          const facility = item.Facility?.toLowerCase() || '';
                          return (
                            pageName.includes(searchTerm) ||
                            moduleName.includes(searchTerm) ||
                            activity.includes(searchTerm) ||
                            dateTime.includes(searchTerm) ||
                            referenceNo.includes(searchTerm) ||
                            facility.includes(searchTerm) ||
                            userName.includes(searchTerm)
                          );
                        }) || []
                      );
                    }}
                    width={isMobile || isTablet? '100%' : '250px'}
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
                  <div></div>
                  <FlexContainer
                    gap="10px"
                    alignItems="center"
                    margin="0 0 16px 0"
                    flexWrap={isMobile || isTablet ? 'wrap' : ''}
                    justifyContent={
                      isMobile || isTablet ? 'center' : 'flex-start'
                    }
                  >
                    <StyledButton
                      height="35px"
                      fontSize="12px"
                      variant="contained"
                      // startIcon={
                      //   <StyledImage
                      //     height="14px"
                      //     width="14px"
                      //     src={FilterIcon}
                      //     alt="Add New Icon"
                      //     style={{ marginInlineEnd: 8,
                      //       display: 'inline-block',
                      //      }}
                      //   />
                      // }
                      onClick={() => {
                        navigate('/MainMaster/AuditLog/UserSessionLogList');
                      }}
                    >
                      {t('MM_UserSessionLog')}
                    </StyledButton>
                    <StyledButton
                      fontSize="12px"
                      backgroundColor="#fff"
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
                          height={isMobile || isTablet ? '30px' : '40px'}
                          width={isMobile || isTablet ? '30px' : '40px'}
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
                      colour="#000"
                      onClick={() => {
                        setSelectedColumns(columns);
                      }}
                    >
                      {t('ClearAll')}
                    </StyledButton>
                    <Tooltip title="Toggle Columns" arrow>
                      <StyledImage
                        height={isMobile || isTablet ? '30px' : '40px'}
                        width={isMobile || isTablet ? '30px' : '40px'}
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
                    {roleMenu?.IsView && roleMenu?.IsPrint && (
                      <Tooltip title="Download" arrow>
                        <StyledImage
                          height={isMobile || isTablet ? '30px' : '40px'}
                          width={isMobile || isTablet ? '30px' : '40px'}
                          gap="10px"
                          borderRadius="40px"
                          src={DownloadFileIcon}
                          disabled={!(TotalRecords > 0)}
                          alt="Download"
                          animate={true}
                          onClick={handleOnDownload}
                          style={{
                            cursor:
                              TotalRecords > 0 ? 'pointer' : 'not-allowed',
                            pointerEvents: TotalRecords > 0 && 'auto',
                          }}
                        />
                      </Tooltip>
                    )}
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
                          <Tooltip title="Filter" arrow>
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
                      <FilterFormFields
                        handleToggleFilter={handleToggleFilter}
                        fields={fields}
                        labels={labels}
                      />
                    </FlexContainer>
                  </BorderBox>
                </StyledCollapse>
                <AuditLogModalPopup
                  open={isViewModal}
                  onClose={() => setIsViewModal(false)}
                  isViewModal={isViewModal}
                  setIsViewModal={setIsViewModal}
                  eventId={eventId}
                />
                <DataTable
                  columns={selectedColumns}
                  auditLogData={filteredRecords}
                  totalRecords={TotalRecords}
                  labels={labels}
                  isViewModal={isViewModal}
                  setIsViewModal={setIsViewModal}
                  setEventId={setEventId}
                  isView={roleMenu?.IsView}
                />
              </>
            )}
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default AuditLogList;
