import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { useEffect, useRef, useState } from 'react';
import {
  Badge,
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { getCustomlabel, getlabel } from '../../../../utils/language';
import FilterIcon from '../../../../assets/Icons/FilterIcon.png';
import FilterTable from '../../../../assets/Icons/FilterTable.png';
import DownloadFileIcon from '../../../../assets/Icons/DownloadFileIcon.png';
import FilterCloseIcon from '../../../../assets/Icons/FilterCloseIcon.png';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CompletedIncidentTable from './CompletedOpinionTable';
import { useGetPageLoadDataQuery } from '../../../../redux/RTK/staffMasterApi';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import UploadFileIcon from '../../../../assets/Icons/UploadFileIcon.png';
import FilterCompletedFields from './FilterCompletedFields';
import {
  useGetOpinionCompleteDetailsQuery,
  usePrintCompletedOpinionListMutation,
} from '../../../../redux/RTK/IncidentOinionApi';
import { useGetFieldsQuery, useGetLabelsQuery } from '../../../../redux/RTK/moduleDataApi';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';

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

const pendingCompletedColumns = [
  {
    id: 'FacilityName',
    translationId: 'IM_O_Facility',
    fieldId: 'O_P_Facility',
    isSelected: true,
  },
  {
    id: 'OpinionNo',
    translationId: 'IM_O_OpinionId',
    fieldId: 'O_P_OpinionId',
    isSelected: true,
  },
  {
    id: 'IncidentDate',
    translationId: 'IM_O_IncidentDate',
    fieldId: 'O_P_IncidentDate',
    isSelected: true,
  },
  {
    id: 'IncidentNumber',
    translationId: 'IM_O_IncidentNumber',
    fieldId: 'O_P_IncidentNumber',
    isSelected: true,
  },
  {
    id: 'IncidentDetail',
    translationId: 'IM_O_IncidentDetails',
    fieldId: 'O_P_IncidentDetails',
    isSelected: true,
  },
  {
    id: 'InformationRequested',
    translationId: 'IM_O_InformationRequested',
    fieldId: 'O_P_InformationRequested',
    isSelected: true,
  },
  {
    id: 'RequestorType',
    translationId: 'IM_O_RequestorType',
    fieldId: 'O_P_RequestorType',
    isSelected: true,
  },
  {
    id: 'RequestorName',
    translationId: 'IM_O_RequestorName',
    fieldId: 'O_P_RequestorName',
    isSelected: true,
  },
  {
    id: 'RequestedDate',
    translationId: 'IM_O_RequestReceivedDate',
    fieldId: 'O_P_RequestReceivedDate',
    isSelected: true,
  },
  {
    id: 'ReplyStatus',
    translationId: 'IM_O_ReplyStatus',
    fieldId: 'O_P_ReplyStatus',
    isSelected: true,
  },
  {
    id: 'SubmittedDate',
    translationId: 'IM_O_SubmittedDate',
    fieldId: 'O_P_SubmittedDate',
    isSelected: true,
  },
];

const CompletedList = () => {
  //*Hooks declaration
  const [roleMenu, setRoleMenu] = useState();
  const { i18n, t } = useTranslation();

  const [openFilter, setOpenFilter] = useState(false);
  const { isMobile } = useWindowDimension();
  const [columnEl, setColumnEl] = useState(null);
  const [isPrintLoading, setIsPrintLoading] = useState(false);
  const [color, setColor] = useState('');
  const [message, setMessage] = useState('');
  const [selectedColumns, setSelectedColumns] = useState(
    pendingCompletedColumns
  );

  //* Variables Declaration
  const [departmentSearchKeyword, setDepartmentSearchKeyword] = useState('');
  const [openDepartmentFilter, setOpenDepartmentFilter] = useState(false);
  const [selectedDepartmentColumns, setselectedDepartmentColumns] = useState(
    pendingCompletedColumns
  );
  const [departmentColumnEl, setDepartmentColumnEl] = useState(null);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [triggerDownloadData] = usePrintCompletedOpinionListMutation();
  const [departmentFilterInitialValues, setDepartmentFilterInitialValues] =
    useState({
      departmentId: '',
      locationId: '',
      hodId: '',
      facilityId: '',
    });
  const formikRef = useRef(null);

  const handleToggleFilter = () => {
    setOpenFilter(!openFilter);
  };

  //* Get page load data
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
  } = useSelector((state) => state.auth);
  const { completedFilters, isCompletedFilterApplied } = useSelector(
    (state) => state.opinion
  );

  const { data: labels = [], isFetching: isLabelsFetching } = useGetLabelsQuery(
    {
      menuId: 28,
      moduleId: 2,
    }
  );

  const { data: fields = [] } = useGetFieldsQuery({
      menuId: 28,
      moduleId: 2,
    });

  // const searchLabels = labels?.Data?.filter((menu) => menu.MenuId === selectedMenu?.id)[0].Regions?.[0]?.Labels

  const searchLabels = (labels.Data || [])
    .filter((item) => item.MenuId === 28)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'ALL')
        .flatMap((region) => region.Labels || [])
    );
  const filteredIncidentLabel = { Data: searchLabels };
  const {
    data: pageLoadData,
    error,
    isLoading,
  } = useGetPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  //* Table columns toggle
  // const handleSelectColumns = (event, column, checked) => {
  //   const columnId = event.target.name;
  //   setSelectedColumns((prevSelectedColumns) =>
  //     prevSelectedColumns.some((col) => col.id === columnId)
  //       ? prevSelectedColumns.filter((col) => col.id !== columnId)
  //       : [...prevSelectedColumns, column]
  //   );
  // };
  const handleSelectColumns = (event, column, checked) => {
    const columnId = event.target.name;
    setSelectedColumns((prevSelectedColumns) =>
      prevSelectedColumns.map((col) =>
        col.id === columnId ? {...col, isSelected: checked } : col
      )
    );
  };

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
  //* Toggle filter section
  const departmentFilterToggle = () => {
    setOpenDepartmentFilter(!openDepartmentFilter);
  };

  //* Department table column list

  //* Filter department table
  const filterDepartment = (values) => {
    setDepartmentFilterInitialValues({
      departmentId: values?.departmentId,
      locationId: values?.locationId,
      hodId: values?.hodId,
      facilityId: values?.facilityId,
    });
    setIsFilterApplied(true);
    setOpenDepartmentFilter(false);
  };

  const { data: getCompletedData = [], isFetching } =
    useGetOpinionCompleteDetailsQuery({
      payload: {
        ...completedFilters,
        pageIndex: completedFilters.pageIndex + 1,
        headerFacilityId: selectedFacility?.id,
        loginUserId: 1,
        moduleId: 2,
        menuId: 28,
      },
    });

  const { totalRecords, records } = getCompletedData || {
    totalRecords: 0,
    records: [],
  };

  //* Download excel data
  // const handleOnDownload = async () => {
  //   try {
  //     const blob = await triggerDownloadData({
  //       payload: {
  //         pageIndex,
  //         pageSize,
  //         headerFacility: selectedFacility?.id,
  //         loginUserId: userDetails?.UserId,
  //         moduleId: selectedModuleId,
  //         menuId: selectedMenu?.id,
  //         departmentId: departmentFilterInitialValues.departmentId || 0,
  //         locationId: departmentFilterInitialValues.locationId || 0,
  //         hodId: departmentFilterInitialValues.hodId || 0,
  //         facilityIds:
  //           departmentFilterInitialValues?.facilityId?.join(',') || '',
  //       },
  //     }).unwrap();

  //     saveAs(blob, 'Department.xlsx');
  //   } catch (error) {
  //     console.error('Download failed:', error);
  //   }
  // };
  const handleOnDownload = async () => {
    try {
      setIsPrintLoading(true);
      setColor('#4caf50');
      setMessage('Downloading ...');

      const blob = await triggerDownloadData({
        downloadType: 'Pdf', 
        payload: {
          ...completedFilters,
          pageIndex: completedFilters.pageIndex + 1,
          pageSize: completedFilters.pageSize,
          headerFacilityId: 2,
          loginUserId: 1,
          moduleId: 2,
          menuId: 28,
        },
      }).unwrap();

      saveAs(blob, 'Incident Opinion.pdf');
      setMessage('Download completed');
      setTimeout(() => {
        setIsPrintLoading(false);
      }, 2000);
    } catch (error) {
      setColor('#e63a2e');
      setMessage('Download Failed');
      setTimeout(() => {
        setIsPrintLoading(false);
      }, 2000);
      console.error('Download failed:', error);
    }
  };

  return (
    <FlexContainer
      flexDirection="column"
      width="100%"
      height="100%"
      // flexWrap="wrap"
      style={{
        padding: '10px',
        border: '1px solid #E0E0E0',
        // borderBottomLeftRadius: '5px',
        // borderBottomRightRadius: '5px',
      }}
    >
      <FlexContainer
        flexDirection={isMobile ? 'column' : 'row'}
        style={{ justifyContent: 'end' }}
      >
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
            // onClick={() => dispatch(resetFilters())}
          >
            {t('ClearAll')}
          </StyledButton>
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
              onClick={departmentFilterToggle}
              animate={true}
            />
          </Badge>
          <StyledDivider />
          <StyledButton
            fontSize="12px"
            backgroundColor="#fff"
            colour="#000"
            onClick={() => {
              setSelectedColumns(pendingCompletedColumns);
            }}
          >
            {t('ClearAll')}
          </StyledButton>
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
              ?.filter((col) => col.isShow !== false)
              ?.map((column) => (
                <MenuItem>
                  <FormControlLabel
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
                    // label={getlabel(
                    //   column.translationId,
                    //   labels,
                    //   i18n.language
                    // )}
                    label={getCustomlabel(
                                          column.translationId,
                                          labels,
                                          i18n.language,
                                          selectedMenu?.id
                                        )}
                  />
                </MenuItem>
              ))}
          </Menu>
          <StyledDivider />
          {roleMenu?.IsPrint && roleMenu?.IsView && (
            <StyledImage
              height="40px"
              width="40px"
              gap="10px"
              cursor="pointer"
              borderRadius="40px"
              src={PrintFileIcon}
              alt="Print"
              animate={true}
              onClick={handleOnDownload}
            />
          )}
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
                onClick={departmentFilterToggle}
                sx={{
                  color: '#205475',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease',
                    backgroundColor: 'rgba(15, 108, 189, 0.2)',
                  },
                }}
              >
                <StyledImage src={FilterCloseIcon} alt="Filter Close Icon" />
              </IconButton>
            </FlexContainer>
            <Divider
              sx={{
                marginY: '15px',
                borderColor: '#0083C0',
                width: 'calc(100% - 10px)',
              }}
            />
            <FilterCompletedFields
              handleToggleFilter={handleToggleFilter}
              searchLabels={searchLabels}
              // fields={fields}
              // labels={labels}
            />
          </FlexContainer>
        </BorderBox>
      </StyledCollapse>

      {isFetching ? (
        <FlexContainer justifyContent="center">
          <StyledImage src={LoadingGif} alt="LoadingGif" />
        </FlexContainer>
      ) : (
        <CompletedIncidentTable
          totalRecords={totalRecords}
          records={records}
          columns={selectedColumns}
          searchLabels={searchLabels}
        />
      )}
    </FlexContainer>
  );
};

export default CompletedList;
