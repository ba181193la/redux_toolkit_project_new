import DataTable from './DataTable';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import SearchIcon from '../../../../assets/Icons/Search.png';
import FilterIcon from '../../../../assets/Icons/FilterIcon.png';
import FilterTable from '../../../../assets/Icons/FilterTable.png';
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
import { useDispatch, useSelector } from 'react-redux';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../../utils/IncidentLabels';
import { useTranslation } from 'react-i18next';
import FilterFormFields from './FilterFormFields';
import FilterCloseIcon from '../../../../assets/Icons/FilterCloseIcon.png';
import { useGetAllNotificationQuery } from '../../../../redux/RTK/notificationMasterApi';
import { resetFilters } from '../../../../redux/features/mainMaster/notificationMasterSlice';
import { media } from '../../../../utils/Breakpoints';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import formatDate from '../../../../utils/FormatDate';
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

export const columns = [
  {
    id: 'PageName',
    translationId: 'IM_NM_PageName',
    fieldId: 'NM_P_PageName',
    isSelected: true,
  },
  {
    id: 'MailTask',
    translationId: 'IM_NM_Task',
    fieldId: 'NM_P_Task',
    isSelected: true,
  },
  {
    id: 'Role',
    translationId: 'IM_NM_DefaultRoles',
    fieldId: 'NM_P_DefaultRoles',
    isSelected: true,
  },
  {
    id: 'Staff',
    translationId: 'IM_NM_Staff',
    fieldId: 'NM_P_Staff',
    isSelected: true,
  },
  {
    id: 'Added_EditedBy',
    translationId: 'IM_NM_AddedEditedBy',
    fieldId: 'NM_P_AddedEditedBy',
    isSelected: true,
  },
  {
    id: 'Added_EditedDate',
    translationId: 'IM_NM_AddedEditedDate',
    fieldId: 'NM_P_AddedEditedDate',
    isSelected: true,
  },
];

const NoficationMasterList = () => {
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();

  const { isMobile } = useWindowDimension();

  const [selectedColumns, setSelectedColumns] = useState(columns);
  const [openFilter, setOpenFilter] = useState(false);
  const [columnEl, setColumnEl] = useState(null);
  const [roleMenu, setRoleMenu] = useState();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);

  const { selectedRoleFacility, selectedMenu, selectedModuleId, userDetails } =
    useSelector((state) => state.auth);

  const { filters, isFilterApplied } = useSelector(
    (state) => state.notificationMaster
  );

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

  const {
    data: getNotificationData = [],
    isFetching: isFetchingNotificationData,
  } = useGetAllNotificationQuery(
    {
      payload: {
        ...filters,
        pageIndex: filters?.pageIndex + 1,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    },
    {
      skip: !selectedModuleId || !selectedMenu?.id,
    }
  );

  const { TotalRecords, Records } = getNotificationData || {
    TotalRecords: 0,
    Records: [],
  };

  useEffect(() => {
    setFilteredRecords([...(Records || [])]);
  }, [Records]);

  // useEffect(() => {
  //   const pageFields = fields?.Data?.Sections?.find(
  //     (section) => section.SectionName === 'Page'
  //   )?.Fields;
  //   setSelectedColumns((prevColumns) =>
  //     prevColumns?.map((column) => {
  //       return {
  //         ...column,
  //         isShow: pageFields?.find((col) => col.FieldId === column.fieldId)
  //           ?.IsShow,
  //       };
  //     })
  //   );
  // }, [fields]);

  useEffect(() => {
    const pageFields =
      Array.isArray(fields?.Data?.Menus?.[0]?.Sections) &&
      fields?.Data?.Menus?.[0]?.Sections.find(
        (section) => section.SectionName === 'Page'
      )?.Regions?.[0]?.Fields;
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
  const notificationMasterLabels =
    labels?.Data?.[0]?.Regions?.[0]?.Labels || [];

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="space-between"
      padding={isMobile ? '15px' : '0'}
    >
      <FlexContainer
        marginBottom={isMobile ? '20px' : '0'}
        marginTop={isMobile ? '20px' : '0'}
        justifyContent={isMobile ? 'center' : 'space-between'}
        padding="0 0 15px 0"
        style={{ paddingBottom: '15px' }}
      >
        <StyledTypography
          fontSize={isMobile ? '24px' : '36px'}
          fontWeight="900"
          lineHeight={isMobile ? '32px' : '44px'}
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('MM_NotificationMaster')}
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
            isFetchingNotificationData ? (
              <FlexContainer justifyContent="center">
                <StyledImage src={LoadingGif} alt="LoadingGif" />
              </FlexContainer>
            ) : (
              <>
                <StyledFlexContainer style={{ justifyContent: 'flex-end' }}>
                  <FlexContainer
                    gap="10px"
                    alignItems="center"
                    margin="0 0 16px 0"
                    flexWrap={isMobile ? 'wrap' : ''}
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
                    <Tooltip title="Configure Columns">
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
                          height: '250px',
                        },
                      }}
                    >
                      {selectedColumns
                        ?.filter((col) => col.isShow)
                        ?.map((column) => (
                          <MenuItem>
                            <FormControlLabel
                              style={{ padding: '0px 0px 0px 10px' }}
                              key={column.id}
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
                                notificationMasterLabels,
                                i18n.language
                              )}
                            />
                          </MenuItem>
                        ))}
                    </Menu>
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
                      <FilterFormFields
                        handleToggleFilter={handleToggleFilter}
                        fields={fields}
                        labels={notificationMasterLabels}
                        records={filteredRecords}
                      />
                    </FlexContainer>
                  </BorderBox>
                </StyledCollapse>

                <DataTable
                  columns={selectedColumns}
                  records={filteredRecords}
                  totalRecords={TotalRecords}
                  labels={notificationMasterLabels}
                  isView={roleMenu?.IsView}
                  isEdit={roleMenu?.IsEdit}
                  isDelete={roleMenu?.IsDelete}
                />
              </>
            )}
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default NoficationMasterList;
