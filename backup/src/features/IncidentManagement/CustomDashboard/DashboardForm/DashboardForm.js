import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  Tooltip,
  Box,
  Select,
  Grid,
  Collapse,
  TextField,
} from '@mui/material';
import {
  FlexContainer,
  StyledImage,
  StyledButton,
} from '../../../../utils/StyledComponents';
import {
  ActionCell,
  StyledTableBodyCell,
  StyledTableHead,
  StyledTableHeaderCell,
  StyledTableRow,
  FormLabel,
  ActionButton,
} from '../../../../utils/DataTable.styled';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import { Formik, Form } from 'formik';
import {
  useGetPageLoadDataQuery,
  useGetCustomDashboardReportsMutation,
  useCreateCustomDashboardMutation,
} from '../../../../redux/RTK/IncidentManagement/CustomDashboardApi';
import { useDispatch, useSelector } from 'react-redux';
import { IosShareTwoTone } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import { showSweetAlert, showToastAlert } from '../../../../utils/SweetAlert';
import Error from '../../../../assets/Gifs/error.gif';

const DashboardForm = ({
  chartData,
  show,
  dashboardId,
  year,
  departmentId,
  facilityId,
}) => {
  const dispatch = useDispatch();

  const [selectedDashboard, setSelectedDashboard] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [facility, setFacility] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dashboardName, setDashboardName] = useState('');

  const [triggerGetCustomDashboardReport] =
    useGetCustomDashboardReportsMutation();
  const [triggerCreateDashboardName] = useCreateCustomDashboardMutation();

  const handleClearAll = () => {
    setSelectedDashboard(null);
    setFacility(null);
    setSelectedDepartment(null);
    setSelectedYear(null);
    setReportDetails(null);
    show(false);
  };

  // useEffect(() => {
  //   const fetchReportDetails = async () =>

  //   fetchReportDetails();
  // }, [selectedDashboard, selectedDepartment, selectedYear, facility]);

  const handleSubmit = async (values) => {
    if (
      values.customDashboardId &&
      values.departmentId &&
      values?.year &&
      values?.facilityId
    ) {
      try {
        const response = await triggerGetCustomDashboardReport({
          customDashboardId: values?.customDashboardId,
          dashboardName: '',
          facilityId: values?.facilityId,
          departmentId: Array.isArray(values.departmentId)
            ? values.departmentId.join(',')
            : values.departmentId,
          year: values?.year,
          headerFacilityId: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: 33,
        });

        const rawReports = response?.data?.Data?.Reports || [];

        const groupedReportsObj = rawReports?.reduce((acc, report) => {
          const key = report.CustomDashboardDetailId;

          if (!acc[key]) {
            acc[key] = [];
          }

          acc[key].push(report);
          return acc;
        }, {});

        const groupedReports = Object.values(groupedReportsObj);
        setReportDetails(groupedReports);
        chartData(groupedReports);
        show(true);
        dashboardId(values?.customDashboardId);
        year(values?.year);
        departmentId(values?.departmentId);
        facilityId(values?.facilityId);

        console.log('Report Details:', groupedReports);
      } catch (error) {
        console.error('Error fetching report details:', error);
      }
    }
  };

  const handleDashboardNameSubmit = async () => {
    if (!dashboardName) {
      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: 'Type the report name',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      setIsModalOpen(false);

      return;
    }
    const payload = {
      customDashboardId: 0,
      dashboardName: dashboardName,
      facilityId: selectedFacility?.id,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: 33,
      customDashboardDetails: [],
    };

    try {
      const response = await triggerCreateDashboardName(payload).unwrap();
      setIsModalOpen(false);
      setDashboardName(null);
      showToastAlert({
        type: 'custom_success',
        text: response?.Message,
        gif: SuccessGif,
      });
      await refetch();

      if (response && response.Data) {
        console.log('Parsed response data:', response.Data);
        setIsModalOpen(false);
        showToastAlert({
          type: 'custom_success',
          text: response?.Message || 'Submitted successfully!',
          gif: SuccessGif,
        });
      } else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error during submission:', {
        errormessage: error.message,
        errorStack: error.stack,
      });
      console.error('Error details:', error);
      setIsModalOpen(false);
      setDashboardName(null);

      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: error,
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
    }
  };

  const { selectedMenu, selectedModuleId, userDetails, selectedFacility } =
    useSelector((state) => state.auth);

  const { data: pageLoadData, refetch } = useGetPageLoadDataQuery({
    moduleId: selectedModuleId,
    menuId: 33,
    loginUserId: userDetails?.UserId,
    facilityId: selectedFacility?.id,
  });

  console.log('pageLoadData', pageLoadData);

  const departmentOptions = pageLoadData?.Data?.Result.DepartmentList?.map(
    (item) => ({
      text: item.DepartmentName,
      value: item.DepartmentId,
    })
  );
  const facilityOptions = pageLoadData?.Data?.Result.FacilityList?.map(
    (item) => ({
      text: item.FacilityName,
      value: item.FacilityId,
    })
  );
  const yearOptions = pageLoadData?.Data?.Result.YearList?.map((item) => ({
    text: String(item.Year),
    value: String(item.Year),
  }));

  const dashboardOptions = pageLoadData?.Data?.Result.DashboardName?.map(
    (item) => ({
      text: item.DashboardName,
      value: item.CustomDashboardId,
    })
  );

  return (
    <FlexContainer justifyContent="center" style={{ marginTop: '20px' }}>
      <Formik
        initialValues={{
          customDashboardId: '',
          facilityId: null,
          departmentId: '',
          year: '',
        }}
        onSubmit={(values) => {
          console.log('Form Submitted with values:', values);
          handleSubmit(values);
        }}
      >
        {({ handleSubmit, setFieldValue, values, resetForm }) => (
          <Form onSubmit={handleSubmit}>
            <Tooltip title="Create Dashboard" arrow>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '16px',
                }}
              >
                <button
                  style={{
                    backgroundColor: 'rgb(76, 174, 76)',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                  onClick={() => setIsModalOpen(true)}
                >
                  <i className="fas fa-plus" style={{ fontSize: '16px' }} />
                </button>
              </div>
            </Tooltip>

            <Grid container spacing={2} sx={{ maxWidth: 600 }}>
              <Grid item xs={12} container alignItems="center" spacing={2}>
                <Grid item xs={4}>
                  <FormLabel>Select Dashboard Name:</FormLabel>
                </Grid>
                <Grid item xs={8}>
                  <SearchDropdown
                    name="dashboardOptions"
                    options={dashboardOptions}
                    onChange={(event, value) =>
                      setFieldValue('customDashboardId', value?.value)
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} container alignItems="center" spacing={2}>
                <Grid item xs={4}>
                  <FormLabel>Facility:</FormLabel>
                </Grid>
                <Grid item xs={8}>
                  <SearchDropdown
                    name="facility"
                    options={facilityOptions}
                    fullWidth
                    onChange={(event, value) =>
                      setFieldValue('facilityId', value?.value)
                    }
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} container alignItems="center" spacing={2}>
                <Grid item xs={4}>
                  <FormLabel>Department:</FormLabel>
                </Grid>
                <Grid item xs={8}>
                  <MultiSelectDropdown
                    name="department"
                    options={departmentOptions}
                    setSelectedIds={(selectedValues) =>
                      setFieldValue('departmentId', selectedValues)
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid item xs={12} container alignItems="center" spacing={2}>
                <Grid item xs={4}>
                  <FormLabel>Year:</FormLabel>
                </Grid>
                <Grid item xs={8}>
                  <SearchDropdown
                    name="year"
                    options={yearOptions}
                    onChange={(event, value) =>
                      setFieldValue('year', value?.value)
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>

              <Grid
                item
                xs={12}
                display="flex"
                justifyContent="center"
                gap={2}
                mt={2}
              >
                <ActionButton
                  type="submit"
                  style={{
                    backgroundColor: 'rgb(76, 174, 76)',
                    color: 'white',
                    border: '2px solid rgb(76, 174, 76)',
                  }}
                  startIcon={
                    <i
                      className="fas fa-eye"
                      style={{ fontSize: '16px', marginRight: '8px' }}
                    />
                  }
                  sx={{ maxWidth: 200 }}
                  onClick={handleSubmit}
                >
                  View
                </ActionButton>

                <ActionButton
                  type="reset"
                  sx={{
                    backgroundColor: 'white',
                    color: 'black !important',
                    border: '1px solid #1976d2',
                    '&:hover': { backgroundColor: 'white' },
                    maxWidth: 200,
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
                  onClick={handleClearAll}
                >
                  Clear All
                </ActionButton>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
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
              width: '50%',
              maxWidth: '700px',
              zIndex: 1400,
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: '1px solid #0264AB',
                }}
              >
                <h5 className="modal-title" style={{ margin: 0 }}>
                  Add Dashboard Name
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
                  <i className="fas fa-times" style={{ fontSize: '16px' }}></i>
                </button>
              </div>

              <div
                className="modal-body"
                style={{
                  padding: '20px',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '20px',
                  }}
                >
                  <label
                    htmlFor="reminderRemarks"
                    style={{
                      marginRight: '10px',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Dashboard Name:
                  </label>
                  <TextField
                    variant="outlined"
                    rows={2}
                    sx={{
                      '& .MuiInputBase-input.Mui-disabled': {
                        opacity: 1,
                        fontWeight: 'bold',
                        color: 'black',
                        WebkitTextFillColor: 'black',
                      },
                    }}
                    onChange={(e) => {
                      setDashboardName(e.target.value);
                    }}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                  }}
                >
                  <ActionButton
                    style={{
                      backgroundColor: '#1976d2',
                      color: 'white',
                    }}
                    startIcon={<CheckIcon sx={{ fontSize: 18, mr: 0.5 }} />}
                    onClick={handleDashboardNameSubmit}
                    // disabled={isActionDisabled}
                  >
                    Submit
                  </ActionButton>

                  <ActionButton
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
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </ActionButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Collapse>
    </FlexContainer>
  );
};

export default DashboardForm;
