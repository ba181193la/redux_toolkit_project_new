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
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../../utils/language';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import FilterCloseIcon from '../../../../assets/Icons/FilterCloseIcon.png';
import {
    useGenerateIncidentDashBoardFilterReportMutation,
    useGetIncidentDetailsMutation,
} from '../../../../redux/RTK/IncidentManagement/IncidentDashboardApi';
import { resetFilters } from '../../../../redux/features/mainMaster/IncidentDashboardSlice';
import DownloadFileIcon from '../../../../assets/Icons/DownloadFileIcon.png';
// import formatDate from '../../../../utils/FormatDate';
import { saveAs } from 'file-saver';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import FilterFormField from './FilterFormFields';
import IncidentDashboards from './DetailsDataTable';

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

const IncidentDashboardView = () => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const [openFilter, setOpenFilter] = useState(true);
  const [columnEl, setColumnEl] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [roleMenu, setRoleMenu] = useState();
  const [userSearchKeyword, setUserSearchKeyword] = useState('');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const { isMobile, isTablet } = useWindowDimension();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [color, setColor] = useState('')
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

  const { data: labels = [] } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  const { data: fields = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

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

  const handleToggleFilter = () => {
    setOpenFilter(openFilter);
  };

  

 

  return (
    <>
    <FlexContainer flexDirection="column">
      {/* {isUserFetching ? (
        <FlexContainer justifyContent="center">
          <StyledImage src={LoadingGif} alt="LoadingGif" />
        </FlexContainer>
      ) : ( */}
        <>

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
                />{' '}
              </FlexContainer>
            </BorderBox>
          </StyledCollapse>
          
         
        </>
     
    </FlexContainer>
    <FlexContainer>

    </FlexContainer>
    </>

  );
};
export default IncidentDashboardView;
