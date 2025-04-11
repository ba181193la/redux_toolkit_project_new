import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../utils/StyledComponents';
import FilterIcon from '../../../assets/Icons/FilterIcon.png';
import FilterTable from '../../../assets/Icons/FilterTable.png';
import { useEffect, useState } from 'react';
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
  CircularProgress,
  Badge,
  Tooltip,
} from '@mui/material';
import { getlabel } from '../../../utils/language';
import FilterCloseIcon from '../../../assets/Icons/FilterCloseIcon.png';
import { resetFilters } from '../../../redux/features/mainMaster/mailLogSlice';
import { useTranslation } from 'react-i18next';
import useWindowDimension from '../../../hooks/useWindowDimension';
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../redux/RTK/moduleDataApi';
import {
  useDownloadMailLogListDataMutation,
  useGetAllMailLogsQuery,
} from '../../../redux/RTK/mailLogApi';
import DataTable from './DataTable';
import FilterFormFields from './FilterFormFields';
import DownloadFileIcon from '../../../assets/Icons/DownloadFileIcon.png';
import { saveAs } from 'file-saver';
import SearchIcon from '../../../assets/Icons/Search.png';
import formatDate from '../../../utils/FormatDate';
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
    translationId: 'MM_ML_Facility',
    fieldId: 'ML_P_Facility',
    isSelected: true,
  },
  {
    id: 'ModuleName',
    translationId: 'MM_ML_ModuleName',
    fieldId: 'ML_P_ModuleName',
    isSelected: true,
  },

  {
    id: 'MenuName',
    translationId: 'MM_ML_PageName',
    fieldId: 'ML_P_PageName',
    isSelected: true,
  },
  {
    id: 'MailSubject',
    translationId: 'MM_ML_MailSubject',
    fieldId: 'ML_P_MailSubject',
    isSelected: true,
  },
  {
    id: 'FromMailId',
    translationId: 'MM_ML_FromMailID',
    fieldId: 'ML_P_FromMailID',
    isSelected: true,
  },
  {
    id: 'ToMailId',
    translationId: 'MM_ML_ToMailID',
    fieldId: 'ML_P_ToMailID',
    isSelected: true,
  },
  {
    id: 'ReferenceNo',
    translationId: 'MM_ML_ReferenceNumber',
    fieldId: 'ML_P_ReferenceNumber',
    isSelected: true,
  },
  {
    id: 'ToMailStaffName',
    translationId: 'MM_ML_ToMailStaffName',
    fieldId: 'ML_P_ToMailStaffName',
    isSelected: true,
  },
  {
    id: 'UserName',
    translationId: 'MM_ML_SubmittedBy',
    fieldId: 'ML_P_SubmittedBy',
    isSelected: true,
  },
  {
    id: 'CreatedDate',
    translationId: 'MM_ML_SendDateTime',
    fieldId: 'ML_P_SendDateTime',
    isSelected: true,
  },
];

const MailLogList = () => {
  const { i18n, t } = useTranslation();
  const { isMobile, isTablet } = useWindowDimension();
  const [selectedColumns, setSelectedColumns] = useState(columns);
  const [openFilter, setOpenFilter] = useState(false);
  const [columnEl, setColumnEl] = useState(null);
  const dispatch = useDispatch();
  const [userSearchKeyword, setUserSearchKeyword] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [roleMenu, setRoleMenu] = useState();

  const { filters, isFilterApplied } = useSelector((state) => state.mailLog);

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

  const { data: mailLogData = [], isFetching: isFetchingMailLogData } =
    useGetAllMailLogsQuery({
      payload: {
        ...filters,
        headerFacility: selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    });

  const { totalRecords: TotalRecords, records: Records } = mailLogData || {
    TotalRecords: 0,
    Records: [],
  };

  useEffect(() => {
    setFilteredRecords([...(Records || [])]);
  }, [Records]);

  const handleSelectColumns = (event, column, checked) => {
    const columnId = event.target.name;
    setSelectedColumns((prevSelectedColumns) =>
      prevSelectedColumns.map((col) =>
        col.id === columnId ? { ...col, isSelected: checked } : col
      )
    );
  };

  const [triggerDownloadData] = useDownloadMailLogListDataMutation();

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
          sendDateFrom: filters?.sendDateFrom,
          sendDateTO: filters?.sendDateTO,
          toUserId: filters?.toUserId,
          referenceNo: filters?.referenceNo,
        },
      }).unwrap();

      saveAs(blob, 'MailLog.xlsx');
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
        marginBottom={isMobile || isTablet ? '15px' : '0'}
        marginTop={isMobile || isTablet ? '30px' : '0'}
        justifyContent="space-between"
        style={{ paddingBottom: isMobile || isTablet ? '10px' : '15px' }}
      >
        <StyledTypography
          fontSize={isMobile || isTablet ? '24px' : '36px'}
          fontWeight="900"
          lineHeight={isMobile || isTablet ? '32px' : '44px'}
          color="#0083C0"
          whiteSpace="nowrap"
        >
          {t('MM_MailLog')}
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
            isFetchingMailLogData ? (
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
                          const submittedBy = String(
                            item.UserName
                          ).toLowerCase();
                          const createdDate =
                            formatDate(item.CreatedDate)?.toLowerCase() || '';
                          const toMailStaffName =
                            item.ToMailStaffName?.toLowerCase() || '';
                          const referenceNo =
                            item.ReferenceNo?.toLowerCase() || '';
                          const toMailId = item.ToMailId?.toLowerCase() || '';
                          const fromMailId =
                            item.FromMailId?.toLowerCase() || '';
                          const mailSubject =
                            item.MailSubject?.toLowerCase() || '';
                          const menuName = item.MenuName?.toLowerCase() || '';
                          const moduleName =
                            item.ModuleName?.toLowerCase() || '';
                          const facility = item.Facility?.toLowerCase();
                          return (
                            createdDate.includes(searchTerm) ||
                            toMailStaffName.includes(searchTerm) ||
                            submittedBy.includes(searchTerm) ||
                            referenceNo.includes(searchTerm) ||
                            toMailId.includes(searchTerm) ||
                            fromMailId.includes(searchTerm) ||
                            mailSubject.includes(searchTerm) ||
                            menuName.includes(searchTerm) ||
                            moduleName.includes(searchTerm) ||
                            facility.includes(searchTerm)
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
                    gap="8px"
                    alignItems="center"
                    margin="0 0 16px 0"
                    flexWrap={isMobile || isTablet ? 'wrap' : ''}
                    justifyContent={isMobile || isTablet ? 'center' : ''}
                  >
                    <StyledButton
                      fontSize={isMobile || isTablet ? '10px' : '12px'}
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
                      fontSize={isMobile || isTablet ? '10px' : '12px'}
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
                          width: isMobile || isTablet ? '180px' : '220px',
                          height: isMobile || isTablet ? '300px' : '400px',
                        },
                      }}
                    >
                      {selectedColumns?.map((column) => (
                        <MenuItem key={column.id}>
                          {' '}
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
                      {selectedColumns?.length ===
                        0 && <MenuItem disabled>No columns available</MenuItem>}
                    </Menu>
                    <StyledDivider />
                    {roleMenu?.IsPrint && roleMenu?.IsView && (
                      <Tooltip title="Download" arrow>
                        <StyledImage
                          height={isMobile || isTablet ? '30px' : '40px'}
                          width={isMobile || isTablet ? '30px' : '40px'}
                          gap="10px"
                          cursor="pointer"
                          borderRadius="40px"
                          src={DownloadFileIcon}
                          disabled={!(filteredRecords?.length > 0)}
                          alt="Download"
                          animate={true}
                          onClick={handleOnDownload}
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
                          <StyledImage
                            src={FilterCloseIcon}
                            alt="Filter Close Icon"
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
                      <FilterFormFields
                        handleToggleFilter={handleToggleFilter}
                        fields={fields}
                        labels={labels}
                      />
                    </FlexContainer>
                  </BorderBox>
                </StyledCollapse>

                <DataTable
                  columns={selectedColumns}
                  mailLogData={filteredRecords}
                  totalRecords={TotalRecords}
                  labels={labels}
                />
              </>
            )}
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default MailLogList;
