import React, { useEffect, useState } from 'react';
import {
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import useWindowDimension from '../../../hooks/useWindowDimension';
import Label from '../../../components/Label/Label';
import styled from 'styled-components';
import { Box, Button, Grid, Typography } from '@mui/material';
import { Formik } from 'formik';
import Dropdown from '../../../components/Dropdown/Dropdown';
import TextArea from '../../../components/TextArea/TextArea';
import ImmediateActionTakenTable from './BI_ImmediateActionTakenTable';
import { TextField } from '../../../components/TextField/TextField';
import { ActionButton } from '../../IncidentManagement/IncidentInvestigation/IncidentInvestigation.styled';
import SaveIcon from '../../../assets/Icons/SaveIcon.png';
import DoneIcon from '../../../assets/Icons/DoneIcon.png';
import DoNotDisturbIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import CustomScrollbars from '../../../components/CustomScrollbars/CustomScrollbars';
import {
  useGetBriefPageLoadDataQuery,
  useLazyGetDesignationQuery,
  useCreateBriefIncidentMutation,
} from '../../../redux/RTK/loginApi';
import DeleteIcon from '../../../assets/Icons/ImageUploadDelete.png';
import CustomTimePicker from '../../../components/Date/CustomTimePicker';
import CustomTimePickerAlone from '../../../components/Date/CustomTimePickerAlone';
import CustomDatePicker from '../../../components/Date/Date';
import { showToastAlert } from '../../../utils/SweetAlert';
import formatTime from '../../../utils/FormatTime';
import { setIsBriefIncident } from '../../../redux/features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import BriefIncidentSubmittedModal from './BriefIncidentSubmittedModal';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';

const FormContainer = styled(Box)`
  padding: 10px;
  background-color: #fff;
`;

const StyledGridContainer = styled(Grid)`
  display: grid;
`;

const initialValues = {
  incidentDay: null,
  // incidentDateTime: '',
  incidentDate: '',
  incidentTime: '',
  briefDescription: '',
  immediateAction: '',
  incidentFacility: '',
  incidentDepartment: '',
  locationDetails: '',
  reportingEmpName: '',
  reportingFacility: '',
  reportingDepartment: '',
  designation: '',
  email: '',
  attachments: [],
  incidentActionTaken: [
    {
      immediateActionId: '',
      immediateActionTaken: '',
      incidentId: '',
      rowNo: '',
      responsibleStaffId: '',
      responsibleStaffName: '',
      department: '',
      designation: '',
      isEditing: true,
      isSaved: false,
    },
  ],
};

const validationSchema = Yup.object().shape({
  // incidentDate: Yup.string().required('Incident date is required'),
  incidentDate: Yup.string()
    .test('is-valid-date', 'Invalid date format', (value) => {
      return !isNaN(new Date(value).getTime());
    })
    .test('is-not-future', 'Future dates are not allowed', (value) => {
      return new Date(value) <= new Date();
    })
    .required('Incident date is required'),
  incidentTime: Yup.string()
    .matches(
      /^(\d{1,2}):(\d{2})\s?(AM|PM)$/i,
      'Invalid time format (e.g. 10:30 AM)'
    )
    .required('Incident time is required'),
  briefDescription: Yup.string().required('Brief description is required'),
  // immediateAction: Yup.string().required('Immediate action is required'),
  incidentFacility: Yup.string().required('Incident facility is required'),
  incidentDepartment: Yup.string().required('Incident department is required'),
  locationDetails: Yup.string().required('Location details are required'),
  reportingEmpName: Yup.string().required(
    'Reporting employee name is required'
  ),
  reportingFacility: Yup.string().required('Reporting facility is required'),
  reportingDepartment: Yup.string().required(
    'Reporting department is required'
  ),
  designation: Yup.string().required('Designation is required'),
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  // attachments: Yup.array().of(Yup.mixed()), // No specific validation for files
  // incidentActionTaken: Yup.array().of(
  //   Yup.object().shape({
  //     immediateActionTaken: Yup.string().required('Immediate action is required'),
  //     responsibleStaffId: Yup.string().required('Responsible staff ID is required'),
  //     responsibleStaffName: Yup.string().required('Responsible staff name is required'),
  //     department: Yup.string().required('Department is required'),
  //     designation: Yup.string().required('Designation is required'),
  //   })
  // ),
});

const BriefIncident = () => {
  const { isMobile } = useWindowDimension();
  const { data: pageLoadData } = useGetBriefPageLoadDataQuery();
  const [triggerGetDesignation] = useLazyGetDesignationQuery();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [incidentNo, setIncidentNo] = useState('');

  const [files, setFiles] = useState([]);
  const [designationList, setDesignationlist] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const { Data: { FacilityList, DepartmentList } = [] } = pageLoadData || {};
  const [triggerCreateBriefIncident,{isLoading} ] = useCreateBriefIncidentMutation();

  // const handleFileChange = (event) => {
  //   const files = Array.from(event.target.files);
  //   setFiles((prevFiles) => [...prevFiles, ...files]);
  // };
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to Array
    setSelectedFiles(files);
  };

  const handleUploadClick = () => {
    document.getElementById('fileInput').click(); // Trigger file input
  };

  const handleDeleteClick = (e, file) => {
    setFiles(files?.filter((item) => item?.name !== file?.name));
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  function combineDateTime(incidentDate, incidentTime) {
  
    if (!incidentDate || !incidentTime) {
      console.error('Invalid input: incidentDate or incidentTime is missing');
      return null;
    }

    // Convert incidentDate to a Date object
    const dateObj = new Date(incidentDate);
    if (isNaN(dateObj.getTime())) {
      console.error('Invalid date format:', incidentDate);
      return null;
    }

    // Extract hours and minutes from incidentTime
    const timeParts = incidentTime.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (!timeParts) {
      console.error('Invalid time format:', incidentTime);
      return null;
    }

    let [, hours, minutes, period] = timeParts;
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);

    // Convert 12-hour format to 24-hour format
    if (period.toUpperCase() === 'PM' && hours !== 12) hours += 12;
    if (period.toUpperCase() === 'AM' && hours === 12) hours = 0;

    // Set the time to the date object
    dateObj.setUTCHours(hours, minutes, 0, 0);

    // Convert to ISO string
    return dateObj.toISOString();
  }

  return (
    <CustomScrollbars>
      <FlexContainer
        width="100%"
        flexDirection="column"
        height="auto"
        padding="50px"
        alignItems={'center'}
        backgroundColor={'#eef1f6'}
      >
        <FlexContainer
          style={{ maxWidth: '1024px' }}
          height="auto"
          backgroundColor="#fff"
          flexDirection="column"
        >
          <FlexContainer
            justifyContent={'center'}
            alignItems="center"
            padding={'10px'}
            width={'100%'}
            height="auto"
            backgroundColor="rgb(52, 152, 219)"
            flexDirection="column"
          >
            <StyledTypography
              fontSize={isMobile ? '12px' : '18px'}
              fontWeight="700"
              lineHeight="44px"
              
              color="#ffff"
              justifyContent="center"
              whiteSpace={'nowrap'}
            >
              Report Incident – Brief
            </StyledTypography>
          </FlexContainer>
          <FormContainer>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values, { resetForm }) => {
                const {
                  incidentDate,
                  incidentTime,
                  briefDescription,
                  immediateAction,
                  incidentFacility,
                  incidentDepartment,
                  locationDetails,
                  reportingEmpName,
                  reportingFacility,
                  reportingDepartment,
                  designation,
                  email,
                  incidentActionTaken,
                } = values;
                let response;

                const combinedDateTime = combineDateTime(
                  incidentDate,
                  incidentTime
                );

                try {
                  const formData = new FormData();
                  formData.append(
                    'briefIncidentSave',
                    JSON.stringify({
                      reportIncident: {
                        incidentId: 0,
                        incidentNo: '',
                        facilityId: incidentFacility,
                        isBriefIncident: true,
                        incidentDateTime: combinedDateTime,
                        briefDescriptionOfIncident: briefDescription,
                        locationDetails,
                        departmentId: incidentDepartment,
                        departmentName: '',
                        isActionTakenTable: true,
                        actionTaken: immediateAction,
                        staffInvolved: false,
                        patientInvolved: false,
                        companionInvolved: false,
                        visitorInvolved: false,
                        outSourcedStaffInvolved: false,
                        othersInvolved: false,
                        isWitnessedBy: false,
                        reportingStaffName: reportingEmpName,
                        reportingStaffFacilityId: reportingFacility,
                        reportingStaffDepartmentId: reportingDepartment,
                        reportingStaffDesignationId: designation,
                        mailId: email,
                      },
                      incidentActionTaken: incidentActionTaken?.map(
                        (item, index) => ({
                          immediateActionId: 0,
                          incidentId: 0,
                          rowNo: index + 1,
                          responsibleStaffId: item.responsibleStaffId,
                          immediateActionTaken: item.immediateActionTaken,
                        })
                      ),
                    })
                  );
                  files.forEach((file, index) => {
                    formData.append(`attachments[${index}]`, file);
                  });

                  response = await triggerCreateBriefIncident({
                    payload: formData,
                  }).unwrap();
                  if (
                    response &&
                    !response.Message.includes('Record Already Exist')
                  ) {
                    // showToastAlert({
                    //   type: 'custom_success',
                    //   text: response.Message,
                    //   gif: 'SuccessGif',
                    // });

                    // 🔹 Open modal & set incident number after successful submission
                    setIsModalOpen(true);
                    setIncidentNo(response?.Data?.IncidentNo);
                  }

                  if (
                    response &&
                    response.Message.includes('Record Already Exist')
                  ) {
                    showToastAlert({
                      type: 'custom_info',
                      text: response.Message,
                      gif: 'InfoGif',
                    });
                    return;
                  }
                  resetForm();
                  // navigate('/login');
                } catch (error) {
                  showToastAlert({
                    type: 'custom_error',
                    text: 'Something went wrong. Please try again later.',
                    gif: 'ErrorGif',
                  });
                }
              }}
            >
              {({
                values,
                setFieldValue,
                handleSubmit,
                isSubmitting,
                errors,
                handleBlur,
                resetForm,
                setFieldTouched,
                touched,
              }) => {
                useEffect(() => {
                  if (values.incidentDate) {
                    const incidentDate = new Date(values?.incidentDate);
                    const daysOfWeek = [
                      'Sunday',
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                    ];
                    const incidentDayName = daysOfWeek[incidentDate.getDay()];

                    setFieldValue('incidentDay', incidentDayName || '');
                  }
                }, [values.incidentDate, setFieldValue]);
                // navigate("/login")
                const handleCancel=()=>{
                  resetForm();
                  navigate("/login")
                }
                return (
                  <>
                    <StyledGridContainer
                      container
                      spacing={2}
                      justifyContent="space-between"
                    >
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        padding={1}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          flex: 1,
                        }}
                      >
                        <Label bold value="Incident Date" />
                        <CustomDatePicker
                          name={'incidentDate'}
                          value={values['incidentDate']}
                          onChange={(date) =>{
                            setFieldValue('incidentDate', date)
                            setFieldTouched('incidentDate', true);
                          }}
                        />
                        {errors.incidentDate && touched.incidentDate && (
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors.incidentDate}
                          </div>
                        )}
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        padding={1}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          flex: 1,
                        }}
                      >
                        <Label bold value="Incident Time (24 hrs)" />
                        <CustomTimePickerAlone
                          name={'incidentTime'}
                          value={values['incidentTime']}
                          onChange={(time) => {
                            const formattedTime = formatTime(time, 'HH:mm'); // 24-hour format
                            setFieldValue('incidentTime', formattedTime);
                          }}
                        />
                        {errors.incidentTime && touched.incidentTime && (
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors.incidentTime}
                          </div>
                        )}
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={4}
                        lg={4}
                        padding={1}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          flex: 1,
                        }}
                      >
                        <Label bold value="Day" isRequired />
                        <TextField
                          name={'incidentDay'}
                          value={values?.incidentDay}
                          disabled
                          sx={{
                            '& .MuiInputBase-input.Mui-disabled': {
                              color: '#000 !important', // Force text to be black
                              WebkitTextFillColor: '#000 !important', // Ensures dark text in WebKit browsers
                              opacity: 10, // Ensures full visibility
                            },
                          }}
                        />
                        {errors.incidentDay && touched.incidentDay && (
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors.incidentDay}
                          </div>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} padding={1}>
                        <Label bold value={'Brief Description of Incident:'} />
                        <TextArea
                          name="briefDescription"
                          value={values?.briefDescription}
                          onChange={(e) =>
                            setFieldValue('briefDescription', e.target.value)
                          }
                          onBlur={handleBlur}
                        />
                        {errors.briefDescription &&
                          touched.briefDescription && (
                            <div style={{ color: 'red', fontSize: '11px' }}>
                              {errors.briefDescription}
                            </div>
                          )}
                      </Grid>
                      {/* <Grid item xs={12} sm={12} md={12} lg={12} padding={1}>
                        <Label bold value={'Immediate Action Taken :'} />
                        <TextArea
                          name={'immediateAction'}
                          value={values?.immediateAction}
                          onChange={(e) =>
                            setFieldValue('immediateAction', e.target.value)
                          }
                        />
                        {errors.immediateAction && touched.immediateAction && (
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors.immediateAction}
                          </div>
                        )}
                      </Grid> */}
                    </StyledGridContainer>
                    <FlexContainer
                      padding={'20px 8px'}
                      flexDirection={'column'}
                    >
                      <Label
                        bold
                        value={'Immediate Action Taken :'}
                        isRequired={true}
                      />
                      <ImmediateActionTakenTable />
                    </FlexContainer>
                    <StyledGridContainer container>
                      <Grid item xs={12} sm={4} md={4} lg={4} padding={1}>
                        <Label bold value="Incident Facility:" isRequired />
                        {/* <Dropdown
                          name={'incidentFacility'}
                          options={
                            Array.isArray(FacilityList) &&
                            FacilityList.length > 0
                              ? FacilityList.map((facility) => ({
                                  text: facility?.FacilityName,
                                  value: facility?.FacilityId,
                                }))
                              : []
                          }
                          onChange={(e) =>
                            setFieldValue('incidentFacility', e.target.value)
                          }
                        /> */}
                        <SearchDropdown
  disableClearable={true}
  name={'incidentFacility'}
  options={[
    { text: 'Select', value: '' },
    ...(FacilityList?.map((facility) => ({
      text: facility?.FacilityName,
      value: facility?.FacilityId,
    })) || []),
  ]}
  // disabled={!values?.reportingFacility}
  getOptionLabel={(option) => option.text}
  // dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
  sx={{
    '& .MuiAutocomplete-inputRoot': {
      fontSize: '13px',
      height: '100%',
    },
    '& .MuiOutlinedInput-root': {
      height: '34px',
      '& .MuiAutocomplete-input': {
        height: '34px',
        fontSize: '13px',
      },
    },
  }}
  renderInput={(params) => (
    <TextField {...params} variant="outlined" placeholder="Select" />
  )}
  ListboxProps={{
    sx: {
      '& .MuiAutocomplete-option': {
        fontSize: '13px',
        minHeight: '30px',
        display: 'flex',
        alignItems: 'center',
      },
    },
  }}
  // value={
  //   FacilityList?.find((option) => option.value === values['incidentFacility']) || null
  // }
  onChange={(event, value) => {
    setFieldValue('incidentFacility', value?.value);
  }}
/>

                        {errors.incidentFacility &&
                          touched.incidentFacility && (
                            <div style={{ color: 'red', fontSize: '11px' }}>
                              {errors.incidentFacility}
                            </div>
                          )}
                      </Grid>
                      <Grid item xs={12} sm={4} md={4} lg={4} padding={1}>
                        <Label bold value="Incident Department:" isRequired />
                        {/* <Dropdown
                          name={'incidentDepartment'}
                          options={DepartmentList?.filter(
                            (department) =>
                              department?.FacilityId ===
                              values?.incidentFacility
                          )?.map((dept) => ({
                            text: dept.DepartmentName,
                            value: dept.DepartmentId,
                          }))}
                          disabled={!values?.incidentFacility}
                          // onChange={async (e) => {
                          //   setFieldValue('incidentDepartment', e.target.value);
                          //   const response = await triggerGetDesignation({
                          //     deptId: e.target.value,
                          //   });
                          //   setDesignationlist(
                          //     response?.data?.Data?.DesignationList || []
                          //   );
                          // }}
                          onChange={(e) =>
                            setFieldValue('incidentDepartment', e.target.value)
                          }
                        /> */}
                        <SearchDropdown
  disableClearable={true}
  name={'incidentDepartment'}
  options={[
    { text: 'Select', value: '' },
    ...(DepartmentList?.filter(
      (department) => department?.FacilityId === values?.incidentFacility
    )?.map((dept) => ({
      text: dept.DepartmentName,
      value: dept.DepartmentId,
    })) || []),
  ]}
  disabled={!values?.incidentFacility}
  getOptionLabel={(option) => option.text}
  sx={{
    '& .MuiAutocomplete-inputRoot': {
      fontSize: '13px',
      height: '100%',
    },
    '& .MuiOutlinedInput-root': {
      height: '34px',
      '& .MuiAutocomplete-input': {
        height: '34px',
        fontSize: '13px',
      },
    },
  }}
  renderInput={(params) => (
    <TextField {...params} variant="outlined" placeholder="Select" />
  )}
  ListboxProps={{
    sx: {
      '& .MuiAutocomplete-option': {
        fontSize: '13px',
        minHeight: '30px',
        display: 'flex',
        alignItems: 'center',
      },
    },
  }}
  // value={
  //   DepartmentList?.find((option) => option.value === values['incidentDepartment']) || null
  // }
  onChange={async (event, value) => {
    setFieldValue('incidentDepartment', value?.value);
    
    if (value?.value) {
      const response = await triggerGetDesignation({ deptId: value?.value });
      setDesignationlist(response?.data?.Data?.DesignationList || []);
    } else {
      setDesignationlist([]);
    }
  }}
/>

                        {errors.incidentDepartment &&
                          touched.incidentDepartment && (
                            <div style={{ color: 'red', fontSize: '11px' }}>
                              {errors.incidentDepartment}
                            </div>
                          )}
                      </Grid>
                      <Grid item xs={12} sm={4} md={4} lg={4} padding={1}>
                        <Label
                          bold
                          value="Location Details (Room no etc):"
                          isRequired
                        />
                        <TextField
                          name="locationDetails"
                          value={values?.locationDetails}
                          onChange={(e) =>
                            setFieldValue('locationDetails', e.target.value)
                          }
                        />
                        {errors.locationDetails && touched.locationDetails && (
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors.locationDetails}
                          </div>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={4} md={4} lg={4} padding={1}>
                        <Label
                          bold
                          value="Reporting Employee Name:"
                          isRequired
                        />
                        <TextField
                          name="reportingEmpName"
                          value={values?.reportingEmpName}
                          onChange={(e) =>
                            setFieldValue('reportingEmpName', e.target.value)
                          }
                        />
                        {errors.reportingEmpName &&
                          touched.reportingEmpName && (
                            <div style={{ color: 'red', fontSize: '11px' }}>
                              {errors.reportingEmpName}
                            </div>
                          )}
                      </Grid>
                      <Grid item xs={12} sm={4} md={4} lg={4} padding={1}>
                        <Label bold value="Reporting Employee Facility:" isRequired />
                        {/* <Dropdown
                          name={'reportingFacility'}
                          options={FacilityList?.map((facility) => ({
                            text: facility?.FacilityName,
                            value: facility?.FacilityId,
                          }))}
                          onChange={(e) =>
                            setFieldValue('reportingFacility', e.target.value)
                          }
                        /> */}
                        <SearchDropdown
  disableClearable={true}
  name={'reportingFacility'}
  options={[
    { text: 'Select', value: '' },
    ...(FacilityList?.map((facility) => ({
      text: facility?.FacilityName,
      value: facility?.FacilityId,
    })) || []),
  ]}
  getOptionLabel={(option) => option.text}
  sx={{
    '& .MuiAutocomplete-inputRoot': {
      fontSize: '13px',
      height: '100%',
    },
    '& .MuiOutlinedInput-root': {
      height: '34px',
      '& .MuiAutocomplete-input': {
        height: '34px',
        fontSize: '13px',
      },
    },
  }}
  renderInput={(params) => (
    <TextField {...params} variant="outlined" placeholder="Select" />
  )}
  ListboxProps={{
    sx: {
      '& .MuiAutocomplete-option': {
        fontSize: '13px',
        minHeight: '30px',
        display: 'flex',
        alignItems: 'center',
      },
    },
  }}
  // value={
  //   FacilityList?.find((option) => option.value === values['reportingFacility']) || null
  // }
  onChange={(event, value) => {
    setFieldValue('reportingFacility', value?.value);
  }}
/>

                        {errors.reportingFacility &&
                          touched.reportingFacility && (
                            <div style={{ color: 'red', fontSize: '11px' }}>
                              {errors.reportingFacility}
                            </div>
                          )}
                      </Grid>
                      <Grid item xs={12} sm={4} md={4} lg={4} padding={1}>
                        <Label bold value="Reporting Employee Department:" isRequired />
                        {/* <Dropdown
                          name={'reportingDepartment'}
                          options={DepartmentList?.filter(
                            (department) =>
                              department?.FacilityId ===
                              values?.reportingFacility
                          )?.map((dept) => ({
                            text: dept?.DepartmentName,
                            value: dept?.DepartmentId,
                          }))}
                          disabled={!values?.reportingFacility}
                          // onChange={(e) =>
                          //   setFieldValue('reportingDepartment', e.target.value)
                          // }
                          onChange={async (e) => {
                            setFieldValue('reportingDepartment', e.target.value);
                            const response = await triggerGetDesignation({
                              deptId: e.target.value,
                            });
                            setDesignationlist(
                              response?.data?.Data?.DesignationList || []
                            );
                          }}
                        /> */}
                        <SearchDropdown
  disableClearable={true}
  name={'reportingDepartment'}
  options={[
    { text: 'Select', value: '' },
    ...(DepartmentList?.filter(
      (department) => department?.FacilityId === values?.reportingFacility
    )?.map((dept) => ({
      text: dept?.DepartmentName,
      value: dept?.DepartmentId,
    })) || []),
  ]}
  disabled={!values?.reportingFacility}
  getOptionLabel={(option) => option.text}
  sx={{
    '& .MuiAutocomplete-inputRoot': {
      fontSize: '13px',
      height: '100%',
    },
    '& .MuiOutlinedInput-root': {
      height: '34px',
      '& .MuiAutocomplete-input': {
        height: '34px',
        fontSize: '13px',
      },
    },
  }}
  renderInput={(params) => (
    <TextField {...params} variant="outlined" placeholder="Select" />
  )}
  ListboxProps={{
    sx: {
      '& .MuiAutocomplete-option': {
        fontSize: '13px',
        minHeight: '30px',
        display: 'flex',
        alignItems: 'center',
      },
    },
  }}
  // value={
  //   DepartmentList?.find((option) => option.value === values['reportingDepartment']) || null
  // }
  // onChange={async (event, value) => {
  //   setFieldValue('reportingDepartment', value?.value);
    
  //   if (value?.value) {
  //     const response = await triggerGetDesignation({ deptId: value?.value });
  //     setDesignationlist(response?.data?.Data?.DesignationList || []);
  //   } else {
  //     setDesignationlist([]);
  //   }
  // }}
  onChange={async (e, value) => {
    setFieldValue('reportingDepartment', value?.value);
    const response = await triggerGetDesignation({
      deptId: value?.value,
    });
    setDesignationlist(
      response?.data?.Data?.DesignationList || []
    );
  }}
/>

                        {errors.reportingDepartment &&
                          touched.reportingDepartment && (
                            <div style={{ color: 'red', fontSize: '11px' }}>
                              {errors.reportingDepartment}
                            </div>
                          )}
                      </Grid>
                      <Grid item xs={12} sm={4} md={4} lg={4} padding={1}>
                        <Label bold value="Reporting Employee Designation:" isRequired />
                        {/* <Dropdown
                          name={'designation'}
                          options={designationList?.map((desg) => ({
                            text: desg?.DesignationName,
                            value: desg?.DesignationId,
                          }))}
                          disabled={!values?.incidentDepartment}
                          onChange={async (e) => {
                            setFieldValue('designation', e.target.value);
                          }}
                        /> */}
                        <SearchDropdown
  disableClearable={true}
  name={'designation'}
  options={[
    { text: 'Select', value: '' },
    ...(designationList?.map((desg) => ({
      text: desg?.DesignationName,
      value: desg?.DesignationId,
    })) || []),
  ]}
  disabled={!values?.incidentDepartment}
  getOptionLabel={(option) => option.text}
  sx={{
    '& .MuiAutocomplete-inputRoot': {
      fontSize: '13px',
      height: '100%',
    },
    '& .MuiOutlinedInput-root': {
      height: '34px',
      '& .MuiAutocomplete-input': {
        height: '34px',
        fontSize: '13px',
      },
    },
  }}
  renderInput={(params) => (
    <TextField {...params} variant="outlined" placeholder="Select" />
  )}
  ListboxProps={{
    sx: {
      '& .MuiAutocomplete-option': {
        fontSize: '13px',
        minHeight: '30px',
        display: 'flex',
        alignItems: 'center',
      },
    },
  }}
  // value={
  //   designationList?.find((option) => option.value === values['designation']) || null
  // }
  onChange={(event, value) => {
    setFieldValue('designation', value?.value);
  }}
/>

                        {errors.designation && touched.designation && (
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors.designation}
                          </div>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={4} md={4} lg={4} padding={1}>
                        <Label bold value="Email Id::" isRequired />
                        <TextField
                          name="email"
                          value={values?.email}
                          onChange={(e) =>
                            setFieldValue('email', e.target.value)
                          }
                        />
                        {errors.email && touched.email && (
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors.email}
                          </div>
                        )}
                      </Grid>
                    </StyledGridContainer>
                    <Grid container>
                      <Grid item xs={6} sm={12} md={12} lg={6} padding={1}>
                        <FlexContainer flexDirection="column">
                          <Label bold value="Attachments:"  />
                          <div>
                            <div
                              style={{
                                border: '1px dashed gray',
                                padding: '50px',
                                borderRadius: '4px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                              }}
                            >
                              <Button
                                variant="contained"
                                onClick={handleUploadClick}
                              >
                                Upload
                              </Button>
                              <input
                                id="fileInput"
                                type="file"
                                multiple
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
                              />
                            </div>

                            {/* Display Selected Files */}
                            {selectedFiles.length > 0 && (
                              <div
                                style={{
                                  marginTop: '10px',
                                  maxHeight: '120px',
                                  overflowY: 'auto',
                                }}
                              >
                                {selectedFiles?.map((file, index) => (
                                  <div
                                    key={index}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'space-between',
                                      background: '#f9f9f9',
                                      padding: '8px',
                                      borderRadius: '4px',
                                      marginBottom: '5px',
                                    }}
                                  >
                                    <span
                                      style={{
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        color: '#1155cc',
                                      }}
                                    >
                                      {file.name}
                                    </span>
                                    <i
                                      className="fas fa-trash-alt"
                                      style={{
                                        cursor: 'pointer',
                                        color: '#4679bd',
                                        fontSize: '16px',
                                        marginLeft: '10px',
                                      }}
                                      onClick={() => handleRemoveFile(index)}
                                    ></i>
                                  </div>
                                ))}
                              </div>
                            )}

                            <Typography
                              variant="body2"
                              color="error"
                              style={{ marginTop: '8px' }}
                            >
                              Note: Maximum File Upload Limit is 100MB (Images,
                              PDF, Word Files, Excel Files Only)
                            </Typography>
                          </div>
                        </FlexContainer>
                      </Grid>
                    </Grid>
                    <FlexContainer
                      padding="10px"
                      justifyContent="center"
                      gap="24px"
                    >
                      {/* <ActionButton
                        variant="outlined"
                        sx={{
                          boxShadow: '0px 4px 4px 0px #00000040',
                          '&:hover': {
                            transform: 'scale(1.05) !important',
                            transition: 'transform 0.3s ease !important',
                          },
                        }}
                        startIcon={
                          <StyledImage
                            src={SaveIcon}
                            style={{
                              marginBottom: '1px',
                              marginInlineEnd: 8,
                            }}
                          />
                        }
                      >
                        <StyledTypography
                          textTransform="none"
                          marginTop="1px"
                          color="rgba(0, 131, 192, 1)"
                        >
                          Save Incident
                        </StyledTypography>
                      </ActionButton> */}
                      <ActionButton
                        style={{ backgroundColor: 'rgba(0, 131, 192, 1)' }}
                        variant="outlined"
                        onClick={handleSubmit}
                        sx={{
                          boxShadow: '0px 4px 4px 0px #00000040',
                          '&:hover': {
                            transform: 'scale(1.05) !important',
                            transition: 'transform 0.3s ease !important',
                          },
                        }}
                        startIcon={
                          <StyledImage
                            src={DoneIcon}
                            style={{
                              marginBottom: '1px',
                              marginInlineEnd: 8,
                              color: '#FFFFFF',
                            }}
                          />
                        }
                        disabled={isSubmitting}
                      >
                        <StyledTypography
                          textTransform="none"
                          marginTop="1px"
                          color="#ffff"
                        >
                         {isLoading ? "Submitting..." :  "Submit Incident"}
                        </StyledTypography>
                      </ActionButton>
                      <ActionButton
                        variant="outlined"
                        onClick={handleCancel}
                        sx={{
                          boxShadow: '0px 4px 4px 0px #00000040',
                          '&:hover': {
                            transform: 'scale(1.05) !important',
                            transition: 'transform 0.3s ease !important',
                          },
                        }}
                        startIcon={
                          <StyledImage
                            src={DoNotDisturbIcon}
                            style={{
                              marginBottom: '1px',
                              marginInlineEnd: 8,
                            }}
                          />
                        }
                      >
                        <StyledTypography
                          textTransform="none"
                          marginTop="1px"
                          color="rgba(0, 131, 192, 1)"
                        >
                          Cancel
                        </StyledTypography>
                      </ActionButton>
                    </FlexContainer>
                  </>
                );
              }}
            </Formik>
          </FormContainer>
          <BriefIncidentSubmittedModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            incidentNo={incidentNo}
          />
        </FlexContainer>
      </FlexContainer>
    </CustomScrollbars>
  );
};

export default BriefIncident;
