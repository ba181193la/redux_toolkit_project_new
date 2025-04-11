import React, { useEffect, useState } from 'react';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTab,
  StyledTypography,
  FormLabel,
} from '../../../utils/StyledComponents';
import {
  Tabs,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  IconButton,
  Tooltip,
  Divider,
  Button,
} from '@mui/material';
import { ActionButton } from '../../../utils/DataTable.styled';
import { useTranslation } from 'react-i18next';
import TabPanel from '../../../components/Tabpanel/Tabpanel';
import useWindowDimension from '../../../hooks/useWindowDimension';
import AddIcon from '../../../assets/Icons/AddSubMaster.png';
import { useSelector, useDispatch } from 'react-redux';
import { useGetLabelsQuery } from '../../../redux/RTK/moduleDataApi';
import { useNavigate } from 'react-router-dom';
import { useGetAllFacilitiesQuery } from '../../../redux/RTK/userAssignmentApi';
import DashboardForm from './DashboardForm/DashboardForm';
import { Formik, Form } from 'formik';
import CloseIcon from '../../../assets/Icons/CloseIcon.png';
import Incidentcategorylist from './CategoryList';
import { TextField } from '../../../components/TextField/TextField';
import { setFilters } from '../../../redux/features/mainMaster/incidentApprovalSlice';
import Dropdown from '../../../components/Dropdown/Dropdown';
import CustomDashboardCharts from './CustomDashboardCharts/CustomDashboardCharts';
import { border } from '@mui/system';
import {
  useSaveCustomDashboardDetailsMutation,
  useDeleteCustomDashboardDetailsByIdMutation,
  useDeleteCustomDashboardByIdMutation,
} from '../../../redux/RTK/IncidentManagement/CustomDashboardApi';
import SuccessGif from '../../../assets/Gifs/SuccessGif.gif';
import { showSweetAlert, showToastAlert } from '../../../utils/SweetAlert';
import Error from '../../../assets/Gifs/error.gif';

export const CustomDashboard = () => {
  const { t } = useTranslation();
  const { isMobile } = useWindowDimension();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const iconButtonStyle = {
    width: '30px',
    height: '30px',
    backgroundColor: '#337ab7',
    borderColor: '#337ab7',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    cursor: 'pointer',
  };
  const iconButtonStyle2 = {
    width: '30px',
    height: '30px',
    backgroundColor: '#5cb85c',
    borderColor: '#5cb85c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    cursor: 'pointer',
  };

  const iconStyle = { color: '#fff' };

  const [tabValue, setTabValue] = useState(0);
  const [labels, setLabels] = useState([]);
  const [isIncidentCategoryModel, setIsIncidentCategoryModel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chartType, setChartType] = useState('');
  const [IsShow, setIsShow] = useState(null);
  const [dashboardId, setDashboardId] = useState(null);
  const [year, setYear] = useState(null);
  const [departmentId, setDepartmentId] = useState(null);
  const [facilityId, setFacilityId] = useState(null);
  const [incidentDetails, setIncidentDetails] = useState({ id: '', name: '' });
  const [detailName, setDetailName] = useState('');
  const [reportDetails, setReportDetails] = useState(null);
  const [currentEditingIndex, setCurrentEditingIndex] = useState(null);
  const [visibleChart, setVisibleChart] = useState(null);
  const [visibleChartTypes, setVisibleChartTypes] = useState({});
  const [triggerSaveCustomDashboard] = useSaveCustomDashboardDetailsMutation();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);
  const [selectedChartIndex, setSelectedChartIndex] = useState(null);
  const [openSecondDialog, setOpenSecondDialog] = useState(false);
  const [openThirdDialog, setOpenThirdDialog] = useState(false);

  console.log('reportDetailsssa', IsShow);
  const { filters, isFilterApplied } = useSelector(
    (state) => state.incidentApproval || []
  );
  const { selectedModuleId, userDetails, selectedFacility, selectedMenu } =
    useSelector((state) => state.auth);

  const { data: allFacilities = [] } = useGetAllFacilitiesQuery({
    payload: {
      pageIndex: 1,
      pageSize: 100,
      headerFacility: selectedFacility?.id,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
    },
  });

  const handleClose = () => {
    setIsIncidentCategoryModel(false);
    setSearchQuery('');
    dispatch(
      setFilters({
        ...filters,
        pageIndex: 0,
        pageSize: 25,
      })
    );
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  const handleSelectRow = (selectedIncident) => {
    console.log('Selected Incident:', selectedIncident);
    console.log('Current Editing Index:', currentEditingIndex);

    if (currentEditingIndex !== null) {
      setReportDetails((prevDetails) => {
        const updatedDetails = JSON.parse(JSON.stringify(prevDetails));

        const isDuplicate = updatedDetails.some(
          (group, index) =>
            index !== currentEditingIndex &&
            group?.[0]?.IncidentDetailId === selectedIncident?.IncidentDetailId
        );

        if (isDuplicate) {
          showSweetAlert({
            type: 'warning',
            title: 'Oops!',
            text: 'This Incident is already selected in another chart.',
            gif: Error,
            showConfirmButton: true,
            confirmButtonText: 'Close',
          });
          return prevDetails;
        }

        if (
          !updatedDetails[currentEditingIndex] ||
          updatedDetails[currentEditingIndex].length === 0
        ) {
          const months = [
            { name: 'January', number: 1 },
            { name: 'February', number: 2 },
            { name: 'March', number: 3 },
            { name: 'April', number: 4 },
            { name: 'May', number: 5 },
            { name: 'June', number: 6 },
            { name: 'July', number: 7 },
            { name: 'August', number: 8 },
            { name: 'September', number: 9 },
            { name: 'October', number: 10 },
            { name: 'November', number: 11 },
            { name: 'December', number: 12 },
          ];

          updatedDetails[currentEditingIndex] = months.map(
            ({ name, number }) => ({
              CustomDashboardId: dashboardId,
              IncidentDetailName: selectedIncident?.IncidentDetail,
              IncidentDetailId: selectedIncident?.IncidentDetailId,
              MonthName: name,
              MonthNumber: number,
            })
          );
        } else {
          updatedDetails[currentEditingIndex].forEach((detail) => {
            detail.IncidentDetailName = selectedIncident?.IncidentDetail;
            detail.IncidentDetailId = selectedIncident?.IncidentDetailId;
          });
        }

        console.log('Updated Report Details:', updatedDetails);
        return updatedDetails;
      });

      handleClose();
    }
  };

  const handleChartTypeChange = (newChartType, index) => {
    setReportDetails((prevReportDetails) => {
      const updatedDetails = JSON.parse(JSON.stringify(prevReportDetails));

      const rowIndex = Math.floor(index / 2);
      const colIndex = index % 2;

      if (
        updatedDetails.length > index &&
        Array.isArray(updatedDetails[index])
      ) {
        updatedDetails[index] = updatedDetails[index].map((item) => ({
          ...item,
          ChartType: newChartType,
        }));
      }
      console.log('Updated Report Details:', updatedDetails);

      return updatedDetails;
    });
  };
  const [deleteCustomDashboardDetailsById] =
    useDeleteCustomDashboardDetailsByIdMutation();

  const handleRemoveReport = async () => {
    const item = reportDetails[selectedChartIndex]?.[0];
    const customDashboardDetailsId = item?.CustomDashboardDetailId;

    if (!customDashboardDetailsId) {
      console.warn('No CustomDashboardDetailId found for this report');
      setReportDetails((prevDetails) => {
        const updatedDetails = [...prevDetails];
        updatedDetails.splice(selectedChartIndex, 1);
        return updatedDetails;
      });
      return;
    }

    try {
      const response = await deleteCustomDashboardDetailsById({
        customDashboardDetailsId: customDashboardDetailsId,
        loginUserId: userDetails?.UserId,
        menuId: 33,
      }).unwrap();

      showToastAlert({
        type: 'custom_success',
        text: response?.Message || 'Report deleted successfully!',
        gif: SuccessGif,
      });

      setReportDetails((prevDetails) => {
        const updatedDetails = [...prevDetails];
        updatedDetails.splice(selectedChartIndex, 1);
        return updatedDetails;
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      showToastAlert({
        type: 'error',
        text: 'Failed to delete report.',
      });
    }
  };

  const handleSaveClick = () => {
    setOpenDialog(true);
    setDialogAction('save');
  };
  const handleDeleteClick = () => {
    setOpenDialog(true);
    setDialogAction('delete');
  };
  const handleChartDeleteClick = (index) => {
    setOpenDialog(true);
    setDialogAction('deleteChart');
    setSelectedChartIndex(index);
  };
  const handleSecondDialogClose = () => {
    setOpenSecondDialog(false);
    window.location.reload();
  };
  const handleThirdDialogClose = () => {
    setOpenThirdDialog(false);
    window.location.reload();
  };
  const [deleteCustomDashboardById, { isLoading, isError, isSuccess }] =
    useDeleteCustomDashboardByIdMutation();

  const handleDeleteDashboard = async () => {
    try {
      const response = await deleteCustomDashboardById({
        customDashboardId: dashboardId,
        loginUserId: userDetails?.UserId,
        menuId: 33,
      }).unwrap();

      console.log('Delete success:', response);

      showToastAlert({
        type: 'custom_success',
        text: response?.Message || 'Dashboard deleted successfully!',
        gif: SuccessGif,
      });
      setOpenThirdDialog(true);
    } catch (error) {
      console.error('Delete failed:', error);

      showToastAlert({
        type: 'error',
        text: 'Failed to delete dashboard.',
      });
    }
  };

  const handleSave = async () => {
    console.log('Saving values:', reportDetails);

    const flattened = reportDetails.flat();

    const isInvalid = flattened.some(
      (item) => !item?.IncidentDetailId || !item?.ChartType
    );

    if (isInvalid) {
      showToastAlert({
        type: 'warning',
        text: 'Please make sure all blocks have a valid Incident and Chart Type selected.',
      });
      return;
    }

    const transformedDetails = Object.values(
      flattened.reduce((acc, item) => {
        const key = item.IncidentDetailId;
        if (!acc[key]) {
          acc[key] = {
            customDashboardDetailId: item?.CustomDashboardDetailId || 0,
            customDashboardId: dashboardId,
            departmentId: Array.isArray(departmentId)
              ? departmentId.join(',')
              : departmentId,
            incidentDetailId: key,
            chartType: item?.ChartType === 'Run Chart' ? 1 : 2,
            isDelete: false,
          };
        }
        return acc;
      }, {})
    );

    console.log('Transformed Details:', transformedDetails);

    try {
      const response = await triggerSaveCustomDashboard({
        customDashboardId: dashboardId,
        facilityId: facilityId,
        headerFacilityId: selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: 33,
        customDashboardDetails: transformedDetails,
      });
      console.log('Save response:', response);
      setOpenDialog(false);
      setOpenSecondDialog(true);

      showToastAlert({
        type: 'custom_success',
        text: response?.Message || 'Dashboard saved successfully!',
        gif: SuccessGif,
      });
    } catch (error) {
      console.error('Error saving report details:', error);
      showToastAlert({
        type: 'error',
        text: 'Something went wrong while saving.',
      });
    }
  };

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent=""
    >
      <FlexContainer
        justifyContent={'space-between'}
        style={{ paddingBottom: '' }}
      >
        <StyledTypography
          fontSize={isMobile ? '24px' : '30px'}
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          Custom Dashboard
        </StyledTypography>
      </FlexContainer>
      <FlexContainer
        width="100%"
        height="auto"
        flex="1"
        flexDirection="column"
        style={{ backgroundColor: '#ffffff' }}
      >
        <FlexContainer
          width="100%"
          height="auto"
          flex="1"
          flexDirection="column"
          padding="2rem"
          gap="15px"
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            orientation={isMobile ? 'vertical' : 'horizontal'}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <StyledTab label=" Dashboard Form"></StyledTab>
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <DashboardForm
              chartData={setReportDetails}
              show={setIsShow}
              dashboardId={setDashboardId}
              year={setYear}
              departmentId={setDepartmentId}
              facilityId={setFacilityId}
            />
          </TabPanel>
        </FlexContainer>
      </FlexContainer>
      {IsShow && (
        <>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '10px',
              marginTop: '20px',
            }}
          >
            <button
              style={{
                padding: '6px 12px',
                backgroundColor: '#337ab7',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
              onClick={() => {
                setReportDetails((prev) => [...prev, []]);
              }}
            >
              + Add More
            </button>
          </div>

          {console.log(
            'Rendering reportDetails:',
            JSON.stringify(reportDetails)
          )}

          {(Array.isArray(reportDetails) && reportDetails.length > 0
            ? reportDetails
            : [[]]
          )
            .reduce((rows, item, idx) => {
              if (idx % 2 === 0) rows.push([item]);
              else rows[rows.length - 1].push(item);
              return rows;
            }, [])
            .map((row, rowIndex) => (
              <div
                key={rowIndex}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '4%',
                  marginBottom: '20px',
                }}
              >
                {row.map((incidentData, indexInRow) => {
                  const globalIndex = rowIndex * 2 + indexInRow;

                  // Log the current data for this item
                  console.log(
                    `Item at index ${globalIndex}:`,
                    JSON.stringify(incidentData)
                  );

                  const incidentName =
                    incidentData?.[0]?.IncidentDetailName || '';
                  const chart = incidentData?.[0]?.ChartType || '';

                  console.log(
                    `Incident Name: ${incidentName}, Chart Type: ${chart}`
                  );

                  return (
                    <FlexContainer
                      key={globalIndex}
                      width="48%"
                      flexDirection="column"
                      gap="6px"
                      style={{ marginBottom: '20px' }}
                    >
                      <FlexContainer
                        backgroundColor="#fff"
                        padding="20px"
                        borderRadius="8px"
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-start"
                        alignItems="stretch"
                        style={{ height: '500px' }}
                      >
                        {/* Title and Year Row */}
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '15px',
                          }}
                        >
                          <span
                            style={{
                              color: '#606369',
                              fontSize: '18px',
                              fontWeight: 'bold',
                            }}
                          >
                            Year - {year}{' '}
                          </span>
                          <h3
                            style={{
                              flex: 1,
                              textAlign: 'center',
                              fontSize: '18px',
                              fontWeight: 'bold',
                              margin: 0,
                              color: '#606369',
                            }}
                          >
                            {incidentName || ''}
                          </h3>
                         
                          <Tooltip title="Full View chart" arrow>
                          <div
                            style={{
                              ...iconButtonStyle2,
                              cursor: 'pointer',
                            }}
                            onClick={() => {
                              const chartData = encodeURIComponent(
                                JSON.stringify(incidentData || [])
                              );
                              const chartType = encodeURIComponent(
                                chart || 'Run Chart'
                              );
                              const title = encodeURIComponent(
                                incidentName || 'Chart'
                              );

                              window.open(
                                `/IncidentManagement/CustomDashboard/ChartFullView?data=${chartData}&type=${chartType}&title=${title}&year=${year}`,
                                '_blank'
                              );
                            }}
                          >
                            <i className="fa fa-eye" style={iconStyle} />
                          </div>
                          </Tooltip>

                          {/* <div style={{ width: '70px' }} /> */}
                        </div>

                        <Divider
                          sx={{ backgroundColor: '#ddd', marginBottom: '20px' }}
                        />

                        {/* Search + Dropdown + Buttons */}
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '20px',
                          }}
                        >
                          <div style={{ flex: 1, position: 'relative' }}>
                            <TextField
                              fullWidth
                              disabled
                              // sx={{
                              //   '& .MuiInputBase-root': {
                              //     backgroundColor: '#eee',
                              //     paddingRight: '48px',
                              //     height: '30px',
                              //   },
                              //   input: {
                              //     color: 'black',
                              //     fontWeight: 'bold',
                              //     fontSize: '15px',
                              //   },
                              // }}
                              value={incidentName || ''}
                            />
                            <Tooltip title="Search Incident" arrow>
                           
                            <div
                              style={{
                                position: 'absolute',
                                top: 0,
                                bottom: 0,
                                right: 0,
                                width: '30px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: '#337ab7',
                                borderRight: '2px',
                                borderLeft: '1px solid #ccc',
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                console.log(
                                  'Setting current editing index to:',
                                  globalIndex
                                );
                                setCurrentEditingIndex(globalIndex);
                                setIsIncidentCategoryModel(true);
                              }}
                            >
                              <i
                                className="fa fa-search"
                                style={{ fontSize: '15px', color: '#fff' }}
                              />
                            </div>
                          </Tooltip>
                          </div>

                          <div style={{ minWidth: '200px' }}>
                            <Dropdown
                              options={[
                                { value: 'Run Chart', text: 'Run Chart' },
                                { value: 'Bar Chart', text: 'Bar Chart' },
                              ]}
                              value={chart}
                              onChange={(e) =>
                                handleChartTypeChange(
                                  e.target.value,
                                  globalIndex
                                )
                              }
                            />
                          </div>

                          <Tooltip title="View Chart" arrow>
                            <div
                              style={iconButtonStyle}
                              onClick={() => {
                                setVisibleChartTypes((prev) => ({
                                  ...prev,
                                  [globalIndex]: chart,
                                }));
                              }}
                            >
                              <i className="fa fa-eye" style={iconStyle} />
                            </div>
                          </Tooltip>
                          <Tooltip title="Delete Chart" arrow>
                            <div
                              style={iconButtonStyle}
                              onClick={() => {
                                handleChartDeleteClick(globalIndex);
                              }}
                            >
                              <i className="fa fa-trash" style={iconStyle} />
                            </div>
                          </Tooltip>
                        </div>
                        {(visibleChartTypes.hasOwnProperty(globalIndex) ||
                          chart) && (
                          <CustomDashboardCharts
                            data={incidentData}
                            chartType={
                              visibleChartTypes.hasOwnProperty(globalIndex)
                                ? visibleChartTypes[globalIndex]
                                : chart
                            }
                          />
                        )}
                      </FlexContainer>
                    </FlexContainer>
                  );
                })}
              </div>
            ))}
          {/* Common Save & Delete Buttons at bottom of dashboard */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              padding: '20px',
            }}
          >
            <ActionButton
              style={{
                backgroundColor: 'rgb(76, 174, 76)',
                color: 'white',
                border: '2px solid rgb(76, 174, 76)',
              }}
              startIcon={
                <i
                  className="fas fa-check"
                  style={{ fontSize: '16px', marginRight: '8px' }}
                />
              }
              sx={{ maxWidth: 200 }}
              onClick={handleSaveClick}
            >
              Save
            </ActionButton>

            <ActionButton
              style={{
                backgroundColor: '#6c757d',
                color: 'white',
                border: '2px solid #6c757d',
              }}
              startIcon={
                <i
                  className="fas fa-ban"
                  style={{ fontSize: '16px', marginRight: '8px' }}
                />
              }
              sx={{ maxWidth: 200 }}
              onClick={handleDeleteClick}
            >
              Delete
            </ActionButton>
          </div>
        </>
      )}
      <>
        <Dialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          sx={{
            '& .MuiDialog-paper': {
              width: '400px',
              padding: '20px',
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '2rem',
              color: '#575757',
            }}
          >
            {dialogAction === 'save' ? 'Confirm Save' : 'Confirm Delete'}
          </DialogTitle>

          <DialogActions sx={{ justifyContent: 'center', gap: 3 }}>
            <ActionButton
              onClick={() => setOpenDialog(false)}
              sx={{
                backgroundColor: 'white',
                color: 'black !important',
                border: '1px solid #1976d2',
                '&:hover': {
                  backgroundColor: 'white',
                },
              }}
              startIcon={
                <i
                  className="fas fa-ban"
                  style={{
                    color: '#1976d2',
                    marginInlineEnd: 8,
                    fontSize: '16px',
                  }}
                />
              }
            >
              Cancel
            </ActionButton>

            <ActionButton
              onClick={() => {
                setOpenDialog(false);
                if (dialogAction === 'save') {
                  handleSave();
                } else if (dialogAction === 'delete') {
                  handleDeleteDashboard();
                } else if (dialogAction === 'deleteChart') {
                  handleRemoveReport();
                }
              }}
              sx={{
                backgroundColor:
                  dialogAction === 'save' ? '#3085d6' : '#d9534f',
                color: '#fff',
                fontWeight: '600',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor:
                    dialogAction === 'save' ? '#2672b5' : '#c9302c',
                },
              }}
            >
              Yes
            </ActionButton>
          </DialogActions>
        </Dialog>

        <Dialog
          open={isIncidentCategoryModel}
          onClose={handleClose}
          PaperProps={{
            sx: {
              width: '900px',
              maxWidth: 'none',
              borderRadius: '8px',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
            },
          }}
        >
          <Box>
            <DialogTitle
              sx={{
                backgroundColor: '#205475',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                height: 40,
                alignItems: 'center',
                padding: '0 8px',
              }}
            >
              <StyledTypography
                fontSize="18px"
                fontWeight="300"
                lineHeight="18px"
                padding="0 12px"
                color="#fff"
              >
                Category Detail List
              </StyledTypography>
              <IconButton
                onClick={handleClose}
                sx={{
                  color: '#fff',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.3s ease',
                    backgroundColor: 'rgba(15, 108, 189, 0.2)',
                  },
                }}
              >
                <Tooltip title="Close" arrow>
                  <StyledImage
                    src={CloseIcon}
                    alt="Close Icon"
                    tooltip="Close"
                  />
                </Tooltip>
              </IconButton>
            </DialogTitle>
            <DialogContent sx={{ border: '4px solid #205475' }}>
              <Formik>
                <Form>
                  <Box
                    sx={{
                      marginBottom: 2,
                      display: 'block',
                      alignItems: 'center',
                    }}
                  >
                    <FlexContainer
                      padding="20px 20px 20px 0"
                      alignItems="center"
                    >
                      <FlexContainer width="50%" gap="0px" alignItems="center">
                        <Box sx={{ padding: '0 0 0 20px', width: '60%' }}>
                          <FormLabel>Search Category</FormLabel>
                          <TextField
                            fullWidth
                            placeholder="Search Category"
                            value={searchQuery}
                            onChange={(event) =>
                              setSearchQuery(event.target.value)
                            }
                          />
                        </Box>
                      </FlexContainer>
                    </FlexContainer>
                    <Incidentcategorylist
                      staffFetching={false}
                      searchQuery={searchQuery}
                      onSelectRow={handleSelectRow}
                    />
                  </Box>
                </Form>
              </Formik>
            </DialogContent>
          </Box>
        </Dialog>
        <Dialog
          open={openSecondDialog}
          onClose={handleSecondDialogClose}
          sx={{
            '& .MuiDialog-paper': {
              width: '400px',
              padding: '20px',
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '2rem',
              color: '#575757',
            }}
          >
            Dashboard Saved Successfully
          </DialogTitle>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button
              onClick={handleSecondDialogClose}
              sx={{
                backgroundColor: '#3085d6',
                color: '#fff',
                fontWeight: '600',
                fontSize: '1rem',
                padding: '8px 20px',
                '&:hover': {
                  backgroundColor: '#2672b5',
                },
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openThirdDialog}
          onClose={handleThirdDialogClose}
          sx={{
            '& .MuiDialog-paper': {
              width: '400px',
              padding: '20px',
            },
          }}
        >
          <DialogTitle
            sx={{
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '2rem',
              color: '#575757',
            }}
          >
            Dashboard Deleted Successfully
          </DialogTitle>
          <DialogActions sx={{ justifyContent: 'center' }}>
            <Button
              onClick={handleThirdDialogClose}
              sx={{
                backgroundColor: '#3085d6',
                color: '#fff',
                fontWeight: '600',
                fontSize: '1rem',
                padding: '8px 20px',
                '&:hover': {
                  backgroundColor: '#2672b5',
                },
              }}
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </>
    </FlexContainer>
  );
};
