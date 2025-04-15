import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { useEffect, useState, useRef } from 'react';
import {
  Checkbox,
  Collapse,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Badge,
} from '@mui/material';
import { Formik, Form } from 'formik';
//* Icons import
import SearchIcon from '../../../../assets/Icons/Search.png';
import FilterIcon from '../../../../assets/Icons/FilterIcon.png';
import FilterTable from '../../../../assets/Icons/FilterTable.png';
import DownloadFileIcon from '../../../../assets/Icons/DownloadFileIcon.png';
import FilterCloseIcon from '../../../../assets/Icons/FilterCloseIcon.png';
import WhiteSearch from '../../../../assets/Icons/WhiteSearch.png';
import Eraser from '../../../../assets/Icons/Eraser.png';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import Label from '../../../../components/Label/Label';
import RejectedIncidentTable from './RejectedIncidentTable';
import { useGetPageLoadDataQuery } from '../../../../redux/RTK/staffMasterApi';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import FilterRejectedFields from './FilterRejectedFields';
import UploadFileIcon from '../../../../assets/Icons/UploadFileIcon.png';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import { media } from '../../../../utils/Breakpoints';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { columnsMapping } from './ColumnsMapping';
import DataTable from './DataTable';


import { skipToken } from '@reduxjs/toolkit/query';


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

const RejectedList = () => {
  //*Hooks declaration
  const [roleMenu, setRoleMenu] = useState();
  const [openFilter, setOpenFilter] = useState(false);
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isMobile } = useWindowDimension();
  const [filteredRecords, setFilteredRecords] = useState([]);
  //* Variables Declaration
  const [designationSearchKeyword, setDesignationSearchKeyword] = useState('');
  const [openDesignationFilter, setOpenDesignationFilter] = useState(false);
  const [selectedDesignationColumns, setselectedDesignationColumns] = useState(
    designationColumnsList
  );
  const [designationColumnEl, setDesignationColumnEl] = useState(null);
  const [showDesignationModal, setShowDesignationModal] = useState(false);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [designationFilterInitialValues, setDesignationFilterInitialValues] =
    useState({
      departmentId: '',
      designationId: '',
      hodId: '',
      facilityId: '',
    });
  const formikRef = useRef(null);
  const [selectedColumns, setSelectedColumns] = useState(columnsMapping);


  //* Get page load data
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  const handleToggleFilter = () => {
    setOpenFilter(!openFilter);
  };
  //* Department table column list
  const designationColumnsList = [
    {
      id: 'DesignationName',
      translationId: 'MM_DM_DesignationName',
      isSelected: true,
    },
    { id: 'Facility', translationId: 'MM_DM_Facility', isSelected: true },
    {
      id: 'Department',
      translationId: 'MM_DM_Department',
      isSelected: true,
    },
    {
      id: 'Added_EditedBy',
      translationId: 'MM_DM_AddedEditedBy',
      isSelected: true,
    },
    {
      id: 'Added_EditedDate',
      translationId: 'MM_DM_AddedEditedDate',
      isSelected: true,
    },
  ];


  

  //* Filter designation table
  const filterDesignation = (values) => {
    setDesignationFilterInitialValues({
      departmentId: values?.departmentId || 0,
      designationId: values?.designationId || 0,
      hodId: values?.hodId || 0,
      facilityIds: values?.facilityId || '',
    });
    setIsFilterApplied(true);
    setOpenDesignationFilter(false);
  };
  const { data: labels = [], isFetching: isLabelsFetching } = useGetLabelsQuery(
    {
      menuId: 26,
      moduleId: 2,
    }
  );


  const { data: fields = [], isFetching: isFieldsFetching } = useGetFieldsQuery(
    {
      menuId: 26,
      moduleId: 2,
    }
  );

  

  const fieldLabels = [
    "Facility", 
    "Incident Date", 
    "Reported Date", 
    "Incident Number", 
    "Incident Details", 
    "Incident Type", 
    "Department",  
    "Approved Date",
    "Approved By",
    "Rejected Date",
    "Rejected By",
    "Approval Type",
    "TAT",
    "TAT Compliance",
    "Incident Status", 
    'AffectedCategory',
    'Affected Category Code',
    'Main Category Code',
    'Sub Category Code',
    'Incident Details Code'
  ];

  const regionCodes = localStorage.getItem('regionCode')?.toUpperCase() || 'ALL'; 
  
  let labelsData = [];
  const filteredData = labels.Data?.filter((item) => item.MenuId === 26) || [];
  
  filteredData.forEach((item) => {
    item.Regions?.forEach((region) => {
      if (regionCodes === 'ABD') {
        if (region.RegionCode === 'ABD' || region.RegionCode === 'ALL') {
          labelsData.push(...(region.Labels || []));
        }
      } else if (regionCodes === 'ALL' && region.RegionCode === 'ALL') {

        labelsData.push(...(region.Labels || []));
      }
    });
  });
  
  const alteredLabels = {
    Data: labelsData.filter((label) => fieldLabels.includes(label.FieldEnglishLabel)),
  };


  const totalRecords = 0;

  const menuData = fields.Data?.Menus || []; 
  const LabelData = labels.Data || []; 

  const pendingMenuFields = menuData.find(menu => menu.MenuId === 26);
  const pendingMenuLabels = LabelData.find(menu => menu.MenuId === 26);




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
            onClick={() => dispatch(resetFilters())}
          >
            Clear All
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
              setSelectedColumns(columnsMapping);
            }}
          >
            Clear All
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
            // onClick={(event) => setColumnEl(event.currentTarget)}
          />
          <Menu
            // anchorEl={columnEl}
            // open={Boolean(columnEl)}
            // onClose={() => setColumnEl(null)}
            sx={{
              '& .MuiPaper-root': {
                width: 'auto',
                height: '400px',
              },
            }}
          >
            {selectedColumns
              ?.filter((col) => col.isShow)
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
            <>
              <StyledImage
                height="40px"
                width="40px"
                gap="10px"
                cursor="pointer"
                borderRadius="40px"
                src={DownloadFileIcon}
                alt="Download"
                animate={true}
                // onClick={handleOnDownload}
              />
              {/* <StyledImage
                height="40px"
                width="40px"
                gap="10px"
                cursor="pointer"
                borderRadius="40px"
                src={UploadFileIcon}
                alt="Upload"
                animate={true}
              /> */}
              <StyledImage
                height="40px"
                width="40px"
                gap="10px"
                cursor="pointer"
                borderRadius="40px"
                src={PrintFileIcon}
                alt="Print"
                animate={true}
              />
            </>
          )}
        </FlexContainer>
      </StyledFlexContainer>
      <StyledCollapse
        in={openFilter} openFilter={openFilter}
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
                Select Filter
              </StyledTypography>
              <IconButton
                sx={{
                  color: '#205475',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease',
                    backgroundColor: 'rgba(15, 108, 189, 0.2)',
                  },
                }}
              >
                <StyledImage src={FilterCloseIcon} alt="Filter Close Icon" onClick={handleToggleFilter} />
              </IconButton>
            </FlexContainer>
            <Divider
              sx={{
                marginY: '15px',
                borderColor: '#0083C0',
                width: 'calc(100% - 10px)',
              }}
            />
            <FilterRejectedFields
            handleToggleFilter={handleToggleFilter}
            fields={pendingMenuFields}
            labels={pendingMenuLabels}
          />
          </FlexContainer>
        </BorderBox>
      </StyledCollapse>
      <DataTable
            columns={selectedColumns}
            records={filteredRecords}
            totalRecords={totalRecords}
            labels={alteredLabels}  
            isView={roleMenu?.IsView}
          /> 
      {/* <RejectedIncidentTable /> */}
    </FlexContainer>
  );
};

export default RejectedList;
