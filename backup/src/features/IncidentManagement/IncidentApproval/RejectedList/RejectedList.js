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
  Tooltip
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


import { useGetUserDetailQuery } from '../../../../redux/RTK/userDataApi';
import { skipToken } from '@reduxjs/toolkit/query';
import { useGetIncidentApprovalRejectedQuery,useGetDownloadDataApprovalRejectMutation } from '../../../../redux/RTK/IncidentManagement/incidentApprovalApi'


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
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');
  const [triggerDownloadData] = useGetDownloadDataApprovalRejectMutation();
  


  //* Variables Declaration
  const [designationSearchKeyword, setDesignationSearchKeyword] = useState('');
  const [openDesignationFilter, setOpenDesignationFilter] = useState(false);

  const [columnEl, setColumnEl] = useState(null);
  const [showDesignationModal, setShowDesignationModal] = useState(false);
  const [designationFilterInitialValues, setDesignationFilterInitialValues] =
    useState({
      departmentId: '',
      designationId: '',
      hodId: '',
      facilityId: '',
    });
  const formikRef = useRef(null);
  const [selectedColumns, setSelectedColumns] = useState(columnsMapping);
  const [employeeID, setEmployeeID] = useState(null);

  const regionCode = useSelector((state) => state.auth.regionCode?.toUpperCase());
  const [isModalOpen, setIsModalOpen] = useState(false);


  //* Get page load data
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
  } = useSelector((state) => state.auth);

  const { filters, isFilterApplied } = useSelector(
    (state) => state.incidentApproval || []
  );

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

  
  const { data: labels = [], isFetching: isLabelsFetching } = useGetLabelsQuery({
    moduleId: selectedModuleId,
    menuId: selectedMenu?.id,

  });

  const { data: fields = [], isFetching: isFieldsFetching } = useGetFieldsQuery({
    moduleId: selectedModuleId,
    menuId: selectedMenu?.id,
  });

  

  

  let labelsData = [];
  const foundItem = labels.Data?.find((item) => item.MenuId === selectedMenu?.id);
  if (foundItem) {
    foundItem.Regions?.forEach((region) => {
      if (regionCode === 'ABD') {
        if (region.RegionCode === 'ABD' || region.RegionCode === 'ALL') {
          labelsData.push(...(region.Labels || []));
        }
      } else if (regionCode === 'ALL' && region.RegionCode === 'ALL') {
        labelsData.push(...(region.Labels || []));
      }
    });
  }
  let alteredLabels = { Data: [] };
  labelsData.forEach((label) => {
      alteredLabels.Data.push(label);
    
  });

  const menuData = fields.Data?.Menus || []; 
  const LabelData = labels.Data || []; 
  const pendingMenuFields = menuData.find(menu => menu.MenuId === selectedMenu?.id);
  const pendingMenuLabels = LabelData.find(menu => menu.MenuId === selectedMenu?.id);


  const {
    data: getIncidentApprovalPending = [],
    isFetching,
    refetch,
  } = useGetIncidentApprovalRejectedQuery(
    {
      payload: {
        ...filters,
        pageIndex: filters.pageIndex + 1 || 1, 
        pageSize: filters.pageSize || 25,     
        headerFacilityId: selectedFacility?.id || 0,
        loginUserId: userDetails?.UserId || 0,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    },
    {
      skip: !selectedFacility?.id || !selectedModuleId || !selectedMenu?.id,
      refetchOnMountOrArgChange: true,
    }
  );
  
  const { totalRecords, records } = getIncidentApprovalPending || {
    totalRecords: 0,
    records: [],
  };

  useEffect(() => {
    setFilteredRecords([...(records || [])]);
  }, [records]);

   

  
    const handleOnDownloadOrPrint = async (fileType) => {
      if (filteredRecords?.length > 0) {
        try {
  
  
          setIsLoading(true);
          setColor('#4caf50');
          setMessage('Downloading ...');
          const blob = await triggerDownloadData({
            downloadType: fileType,
            payload: {
              // ...filters,
              headerFacilityID: selectedFacility?.id,
              loginUserId: userDetails?.UserId,
              moduleId: selectedModuleId,
              menuId: selectedMenu?.id,
            },
          }).unwrap();
          if (fileType === 'Pdf') {
            saveAs(blob, 'Incident Approval Rejected.pdf');
            setMessage('Download completed');
            setTimeout(() => {
              setIsLoading(false);
            }, 2000);
          } else {
            saveAs(blob, 'Incident Approval Rejected.xlsx');
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
  
    const selectFileType = () => {
      setIsModalOpen(true);
    };
    
  const handleOpen = (event) => {
    setColumnEl(event.currentTarget);
  };

      

  return (
    <FlexContainer
      flexDirection="column"
      width="100%"
      height="100%"
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
          {/* <StyledButton
            fontSize="12px"
            backgroundColor="#fff"
            colour="#000"
            onClick={() => dispatch(resetFilters())}
          >
            Clear All
          </StyledButton> */}
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

          <Tooltip title="Clear All" arrow>
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
          </Tooltip>
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
                  ?.filter((col) => col.isShow !== false) 
                  ?.map((column) => (
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
                              label={column.id} 
                          />
                      </MenuItem>
                  ))}
          </Menu>
          <StyledDivider />
          {roleMenu?.IsPrint && roleMenu?.IsView && (
            <>
            <Tooltip title="Download" arrow>
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
                onClick={selectFileType}
              />
              </Tooltip>
              <Tooltip title="Print" arrow>
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
              </Tooltip>
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
            <FilterRejectedFields
            handleToggleFilter={handleToggleFilter}
            fields={pendingMenuFields}
            labels={pendingMenuLabels}
          />
          </FlexContainer>
        </BorderBox>
      </StyledCollapse>

      <Collapse in={isModalOpen}>
            <div
              style={{
                position: 'fixed',
                top: '0',
                left: '0',
                bottom: '0',
                right: '0',
                zIndex: 1300,
              }}
            >
              {/* Overlay */}
              <div
                id="overlay"
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100vw',
                  height: '100vh',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  backdropFilter: 'blur(5px)',
                }}
              ></div>
              {/* Modal Dialog */}
              <div
                className="modal-dialog"
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '30%',
                  maxWidth: '500px',
                  zIndex: 1400,
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #0264AB',
                }}
              >
                <div className="modal-content">
                  {/* Modal Header */}
                  <div
                    className="modal-header"
                    style={{
                      backgroundColor: '#0264AB',
                      color: 'white',
                      // padding: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid #0264AB',
                    }}
                  >
                    <h5 className="modal-title" style={{ margin: 0 }}>
                      Select File Type
                    </h5>
                    {/* Custom Close Button */}
                    <button
                      onClick={() => setIsModalOpen(false)}
                      style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        color: 'white',
                        fontWeight: 'bold',
                        borderRadius: '50%',
                        border: 'none',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <i
                        className="fas fa-times"
                        style={{ fontSize: '16px' }}
                      ></i>
                    </button>
                  </div>
                  {/* Modal Body */}
                  <div
                    className="modal-body"
                    style={{
                      padding: '20px',
                      textAlign: 'center',
                    }}
                  >
                    <div className="form-actions text-center">
                      <button
                        className="btn btn-primary btn-flat"
                        style={{
                          marginRight: '10px',
                          backgroundColor: '#337ab7',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          padding: '10px 20px',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleOnDownloadOrPrint('Pdf')}
                      >
                        PDF
                      </button>
                      <button
                        className="btn btn-primary btn-flat"
                        style={{
                          backgroundColor: '#337ab7',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: 'bold',
                          padding: '10px 20px',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                        }}
                        onClick={() => handleOnDownloadOrPrint('Excel')}
                      >
                      Excel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </Collapse>   


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
