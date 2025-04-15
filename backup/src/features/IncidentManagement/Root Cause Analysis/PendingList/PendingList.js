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
  Tooltip,
} from '@mui/material';
import { getlabel } from '../../../../utils/language';
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
import PendingIncidentTable from './PendingIncidentTable';
import { useGetPageLoadDataQuery } from '../../../../redux/RTK/staffMasterApi';
import { media } from '../../../../utils/Breakpoints';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import FilterPendingFields from './FilterPendingFields';
import DataTable from './DataTable';
import { columnsMapping } from './ColumnsMapping';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { skipToken } from '@reduxjs/toolkit/query';
import {
  useGetDownloadDataIncidentRCAPendingMutation,
  useGetRCAPendingQuery,
} from '../../../../redux/RTK/IncidentManagement/incidentRcaAPI';
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
    `};
`;

const locationTypeColumnsList = [
  {
    id: 'Location_Type',
    translationId: 'MM_DM_LocationType',
    isSelected: true,
  },
  {
    id: 'Facility',
    translationId: 'MM_DM_Facility',
    isSelected: true,
  },
  {
    id: 'AddedEditedBy',
    translationId: 'MM_DM_AddedEditedBy',
    isSelected: true,
  },
  {
    id: 'AddedEditedDate',
    translationId: 'MM_DM_AddedEditedDate',
    isSelected: true,
  },
];

const PendingList = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { isMobile } = useWindowDimension();
  const [columnEl, setColumnEl] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);
  const [roleMenu, setRoleMenu] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationTypeSearchKeyword, setLocationTypeKeyword] = useState('');
  const [openLocationTypeFilter, setOpenLocationTypeFilter] = useState(false);
  const [selectedLocationTypeColumns, setselectedLocationTypeColumns] =
    useState(locationTypeColumnsList);
  const [locationTypeColumnEl, setLocationTypeColumnEl] = useState(null);
  const [showLocationTypeModal, setShowLocationTypeModal] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState(columnsMapping);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [color, setColor] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [filteredRecords, setFilteredRecords] = useState([]);
  const [locationFilterInitialValues, setLocationFilterInitialValues] =
    useState({
      locationId: '',
      facilityId: '',
    });

  const formikRef = useRef(null);
  const regionCode = useSelector((state) =>
    state.auth.regionCode?.toUpperCase()
  );

  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
  } = useSelector((state) => state.auth);

  const { filters, isFilterApplied } = useSelector(
    (state) => state.incidentRca
  );

  const [triggerDownloadData] = useGetDownloadDataIncidentRCAPendingMutation();

  const handleOnDownloadOrPrint = async (fileType) => {
    if (filteredRecords?.length > 0) {
      try {
        setIsLoading(true);
        setColor('#4caf50');
        setMessage('Downloading ...');
        const blob = await triggerDownloadData({
          downloadType: fileType,
          payload: {
            pageIndex: filters.pageIndex + 1,
            pageSize: filters.pageSize,
            headerFacilityID: selectedFacility?.id,
            loginUserId: userDetails?.UserId,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
          },
        }).unwrap();
        if (fileType === 'Pdf') {
          saveAs(blob, 'Incident RCA Pending.pdf');
          setMessage('Download completed');
          setTimeout(() => {
            setIsLoading(false);
          }, 2000);
        } else {
          saveAs(blob, 'Incident RCA Pending.xlsx');
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

  const {
    data: getIncidentRcaPending = [],
    isFetching,
    refetch,
  } = useGetRCAPendingQuery(
    {
      payload: {
        ...filters,
        pageIndex: filters.pageIndex + 1,
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

  const { totalRecords, records } = getIncidentRcaPending || {
    totalRecords: 0,
    records: [],
  };

  useEffect(() => {
    setFilteredRecords([...(records || [])]);
  }, [records]);

  useEffect(() => {
    if (selectedFacility?.id) refetch();
  }, [selectedFacility?.id]);

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

  const clearFilterLocationType = () => {
    setLocationFilterInitialValues({
      locationId: 0,
      facilityId: '',
    });
    setIsFilterApplied(false);
  };



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

  const handleOpen = (event) => {
    setColumnEl(event.currentTarget);
  };

  const { data: labelsData = [], isFetching: isLabelsFetching } =
    useGetLabelsQuery({
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
    });

  const { data: fieldsData = [], isFetching: isFieldsFetching } =
    useGetFieldsQuery({
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
    });

  const labels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 31)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'ALL')
        .flatMap((region) => region.Labels || [])
    );
  const filterLabels = { Data: labels };

  const fields =
    fieldsData?.Data?.Menus?.filter((item) => item.MenuId === 31) || [];

  useEffect(() => {
    if (fields?.length > 0) {
      const pageFields = fields[0]?.Sections?.find(
        (section) => section.SectionName === 'Page'
      )?.Regions?.find((region) => region.RegionCode === 'ALL')?.Fields;

      if (pageFields) {
        const updatedColumns = selectedColumns.map((column) => ({
          ...column,
          isShow:
            pageFields.find((col) => col.FieldId === column.fieldId)?.IsShow ??
            column.isShow,
        }));

        setSelectedColumns(updatedColumns);
      }
    }
  }, [fields[0]]);

  // const foundItem = labels.Data?.find((item) => item.MenuId === selectedMenu?.id);
  // if (foundItem) {
  //   foundItem.Regions?.forEach((region) => {
  //     if (regionCode === 'ABD') {
  //       if (region.RegionCode === 'ABD' || region.RegionCode === 'ALL') {
  //         labelsData.push(...(region.Labels || []));
  //       }
  //     } else if (regionCode === 'ALL' && region.RegionCode === 'ALL') {
  //       labelsData.push(...(region.Labels || []));
  //     }
  //   });
  // }
  // let alteredLabels = { Data: [] };
  // labelsData.forEach((label) => {
  //   const foundLabel = fieldLabels.find((fieldLabel) => fieldLabel === label.FieldEnglishLabel);
  //   if (foundLabel) {
  //     alteredLabels.Data.push(label);
  //   }
  // });

  // const menuData = fields.Data?.Menus || [];
  // const LabelData = labels.Data || [];
  // const pendingMenuFields = menuData.find(menu => menu.MenuId === selectedMenu?.id);
  // const pendingMenuLabels = LabelData.find(menu => menu.MenuId === selectedMenu?.id);

  return (
    <FlexContainer flexDirection="column">
      {isFetching || isLabelsFetching || isFieldsFetching ? (
        <FlexContainer justifyContent="center">
          <StyledImage src={LoadingGif} alt="LoadingGif" />
        </FlexContainer>
      ) : (
        <>
          <StyledFlexContainer style={{ justifyContent: 'end' }}>
            <FlexContainer
              gap="10px"
              alignItems="center"
              margin="0 0 16px 0"
              justifyContent="right"
              padding="10px 20px 0 0"
            >
              <Badge
                color="primary"
                overlap="circular"
                variant="dot"
                invisible={!isFilterApplied}
              ></Badge>
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
              <StyledDivider />

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

                <FilterPendingFields
                  handleToggleFilter={handleToggleFilter}
                  fields={fields[0]}
                  labels={filterLabels}
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
                  // backgroundColor: 'white',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid #0264AB',
                }}
              >
                <div className="modal-content">
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
            records={filteredRecords}
            totalRecords={totalRecords}
            columns={selectedColumns}
            labels={filterLabels}
            isView={roleMenu?.IsView}
          />
        </>
      )}
    </FlexContainer>
  );
};

export default PendingList;
