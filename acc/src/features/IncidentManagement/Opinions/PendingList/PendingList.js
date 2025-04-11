import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { useEffect, useRef, useState } from 'react';
import {
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
} from '@mui/material';
import { getCustomlabel, getlabel } from '../../../../utils/language';
import { Formik } from 'formik';
import PlusIcon from '../../../../assets/Icons/AddSubMaster.png';
import Search from '../../../../assets/Icons/Search.png';
import FilterIcon from '../../../../assets/Icons/FilterIcon.png';
import FilterTable from '../../../../assets/Icons/FilterTable.png';
import DownloadFileIcon from '../../../../assets/Icons/DownloadFileIcon.png';
import FilterCloseIcon from '../../../../assets/Icons/FilterCloseIcon.png';
import WhiteSearch from '../../../../assets/Icons/WhiteSearch.png';
import Eraser from '../../../../assets/Icons/Eraser.png';
import UploadFileIcon from '../../../../assets/Icons/UploadFileIcon.png';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import styled from 'styled-components';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import { useTranslation } from 'react-i18next';
import Label from '../../../../components/Label/Label';
import { useDispatch, useSelector } from 'react-redux';
import { saveAs } from 'file-saver';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
//   import PendingIncidentTable from './PendingIncidentTable';
import { media } from '../../../../utils/Breakpoints';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import PendingOpinionTable from './PendingOpinionTable';
import FilterPendingFields from './FilterpendingFields';
import {
  useGetOpinionDetailsQuery,
  usePrintPendingOpinionListMutation,
} from '../../../../redux/RTK/IncidentOinionApi';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { resetPendingFilters } from '../../../../redux/features/mainMaster/opinionSlice';
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

const StyledFlexContainer = styled(FlexContainer)`
  flex-direction: column;
  ${media.screen.small`
      flex-direction: row;
      `}
`;

//* Location table column list
const pendingColumns = [
  {
    id: 'FacilityName',
    translationId: 'IM_O_Facility',
    fieldId: 'O_P_OpinionId',
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
];

const PendingList = () => {
  //*Hooks declaration
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const [color, setColor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { isMobile } = useWindowDimension();
  const [columnEl, setColumnEl] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);
  const { t } = useTranslation();

  //* Variables Declaration
  const [roleMenu, setRoleMenu] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationTypeSearchKeyword, setLocationTypeKeyword] = useState('');
  const [openLocationTypeFilter, setOpenLocationTypeFilter] = useState(false);
  const [locationTypeColumnEl, setLocationTypeColumnEl] = useState(null);
  const [showLocationTypeModal, setShowLocationTypeModal] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(pendingColumns);
  const [triggerDownloadData] = usePrintPendingOpinionListMutation();
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
  } = useSelector((state) => state.auth);

  const { pendingFilters, isPendingFilterApplied } = useSelector(
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

  const searchLabels = (labels.Data || [])
    .filter((item) => item.MenuId === 28)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region?.RegionCode === 'ALL')
        .flatMap((region) => region?.Labels || [])
    );
  const filteredIncidentLabel = { Data: searchLabels };

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

  const [locationFilterInitialValues, setLocationFilterInitialValues] =
    useState({
      locationId: '',
      facilityId: '',
    });
  const formikRef = useRef(null);

  const handleSelectColumns = (event, column, checked) => {
    const columnId = event.target.name;
    setSelectedColumns((prevSelectedColumns) =>
      prevSelectedColumns.map((col) =>
        col.id === columnId ? {...col, isSelected: checked } : col
      )
    );
  };

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

 
  useEffect(() => {}, [dispatch, selectedFacility?.id, showLocationTypeModal]);

  const locationTypeToggleFilter = () => {
    setOpenLocationTypeFilter(!openLocationTypeFilter);
  };

  const filterLocationType = (values) => {
    setLocationFilterInitialValues({
      locationId: values?.locationId,
      facilityId: values?.facilityId || '',
    });
    setIsFilterApplied(true);
    setOpenLocationTypeFilter(false);
  };

  //* Reset filter location Type table
  const clearFilterLocationType = () => {
    setLocationFilterInitialValues({
      locationId: 0,
      facilityId: '',
    });
    setIsFilterApplied(false);
  };

  const {
    data: getPendingData = [],
    error,
    isFetching,
  } = useGetOpinionDetailsQuery(
    {
      payload: {
        ...pendingFilters,
        pageIndex: pendingFilters.pageIndex + 1,
        headerFacilityId: selectedFacility?.id,
        loginUserId: 1,
        moduleId: 2,
        menuId: 28,
      },
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const { totalRecords, records } = getPendingData || {
    totalRecords: 0,
    records: [],
  };
  

  //* Download excel data
  const handleOnDownload = async () => {
    try {
      setIsLoading(true);
      setColor('#4caf50');
      setMessage('Downloading ...');
  
      const blob = await triggerDownloadData({
        downloadType: 'Pdf', 
        payload: {
          ...pendingFilters,
          pageIndex: pendingFilters.pageIndex + 1,
          pageSize: pendingFilters.pageSize,
          headerFacilityId: 2,
          loginUserId: 1,
          moduleId: 2,
          menuId: 28,
        },
      }).unwrap();
  
      saveAs(blob, 'Incident Opinion.pdf');
      setMessage('Download completed');
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setColor('#e63a2e');
      setMessage('Download Failed');
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      console.error('Download failed:', error);
    }
  };
  

  const handleToggleFilter = () => {
    setOpenFilter(!openFilter);
  };

  return (
    <FlexContainer
      flexDirection="column"
      style={{
        padding: '10px',
        border: '1px solid #E0E0E0',
      }}
    >
      <StyledFlexContainer style={{ justifyContent: 'end' }}>
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
            onClick={() => dispatch(resetPendingFilters())}
          >
            {t('ClearAll')}
          </StyledButton>
          <Badge
            color="primary"
            overlap="circular"
            variant="dot"
            invisible={!isPendingFilterApplied}
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
          <StyledDivider />
          <StyledButton
            fontSize="12px"
            backgroundColor="#fff"
            colour="#000"
            onClick={() => {
              setSelectedColumns(pendingColumns);
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
              onClick={() => handleOnDownload('pdf')}
              
            />
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
            <FilterPendingFields
              handleToggleFilter={handleToggleFilter}
              fields={fields}
              searchLabels={searchLabels}
            />
          </FlexContainer>
        </BorderBox>
      </StyledCollapse>
      {isFetching ? (
        <FlexContainer justifyContent="center">
          <StyledImage src={LoadingGif} alt="LoadingGif" />
        </FlexContainer>
      ) : (
        <PendingOpinionTable
          TotalRecords={totalRecords}
          Records={records}
          columns={selectedColumns}
          searchLabels={searchLabels}
        />
      )}
    </FlexContainer>
  );
};

export default PendingList;
