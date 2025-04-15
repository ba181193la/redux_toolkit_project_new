import React, { useEffect, useState } from 'react';
import Label from '../../../../components/Label/Label';
import styled from 'styled-components';
import {
  Box,
  Grid,
  RadioGroup,
  Radio,
  FormControlLabel,
  IconButton,
  FormControl,
  Tooltip,
  Modal,
  Backdrop,
  Typography,
  InputAdornment,
  Divider,
} from '@mui/material';
import { useFormikContext } from 'formik';
import {  useParams } from 'react-router-dom';
import { TextField } from '../../../../components/TextField/TextField';
import CustomTimePicker from '../../../../components/Date/CustomTimePicker';
import { getIncidentlabel, getlabel } from '../../../../utils/language';
import { useTranslation } from 'react-i18next';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import { useSelector } from 'react-redux';
import CustomTimePickerAlone from '../../../../components/Date/CustomTimePickerAlone';
import formatTime from '../../../../utils/FormatTime';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import { FlexContainer, StyledImage } from '../../../../utils/StyledComponents';
import CustomDatePicker from '../../../../components/Date/Date';
import { useGetAllSentinelEventQuery } from '../../../../redux/RTK/IncidentManagement/incidentSubMasterApi';

const FormContainer = styled(Box)`
  margin: 20px;
  background-color: #fff;
`;

const StyledGridContainer = styled(Grid)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 5px;
`;

const IncidentDetailsForm = ({
  labels,
  fields,
  pageLoadData,
  isLoading,
  IncidentData
}) => {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const [isClinicalModalOpen, setClinicalModalOpen] = useState(false);
  const [isIncidentModalOpen, setIncidentModalOpen] = useState(false);
  const [abdRegion, setAbdRegion] = useState('')
  const [isIncidentSentinelModalOpen, setIncidentSentinelModalOpen] =
    useState(false);
  const openClinicalModal = () => setClinicalModalOpen(true);
  const closeClinicalModal = () => {
    setClinicalModalOpen(false);
  };
  const openIncidentModal = () => setIncidentModalOpen(true);
  const openIncidentSentinelModal = () => setIncidentSentinelModalOpen(true);
  const closeIncidentModal = () => setIncidentModalOpen(false);
  const closeIncidentSentinelModal = () => setIncidentSentinelModalOpen(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const { values, handleChange, setFieldValue, errors, touched } =
    useFormikContext();
  // const incidentDateTime=values?.incidentDate.split('T')[0].concat(values?.incidentTime)

  // function convertToISO(input) {
  //   // Insert a space before the time to properly parse the format
  //   const formattedInput = input.replace(
  //     /(\d{4}-\d{2}-\d{2})(\d{2}:\d{2} [APM]+)/,
  //     '$1 $2'
  //   );

  //   // Convert to a JavaScript Date object
  //   const date = new Date(formattedInput);

  //   // Convert to ISO format
  //   return date.toISOString();
  // }

  // // Example Usage
  // const input = '2025-02-0603:00 AM';
  // const output = convertToISO(input);

  const incidentDateTime = IncidentData?.Data?.reportIncident?.IncidentDateTime;
  let formattedDate
  let formattedTime

  // Validate incidentDateTime
  if (incidentDateTime && !isNaN(Date.parse(incidentDateTime))) {
    const [date, time] = incidentDateTime.split("T");

    // Convert to Date object safely
    const dateObj = new Date(incidentDateTime);

    formattedDate = dateObj.toISOString().split("T")[0]; // "2025-02-14"
    formattedTime = dateObj.toTimeString().split(" ")[0]; // "20:40:00"

  } else {
    console.error("Error: Invalid or missing IncidentDateTime");
  }

  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    roleFacilities,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

 

  const firstGridConfig = [
    {
      fieldId: 'RI_P_FacilityName',
      translationId: 'IM_RI_FacilityName',
      component: 'Dropdown',
      name: 'facilityId',
      options: userDetails?.ApplicableFacilities?.filter((facility) => {
        if (!facility.IsActive) return false;
        if (isSuperAdmin) return true;
        const facilityItem = roleFacilities
          ?.find((role) => role.FacilityId === facility.FacilityId)
          ?.Menu?.find((MenuItem) => MenuItem.MenuId === selectedMenu?.id);
        return facilityItem?.IsView;
      }).map((facility) => ({
        text: facility.FacilityName,
        value: facility.FacilityId,
      })),
    },
    {
      fieldId: 'RI_P_IncidentReportNo',
      translationId: 'IM_RI_IncidentReportNo',
      component: 'TextField',
      name: 'incidentReportNo',
      maxLength: 100,
    }
  ]

  const secondGridConfig = [
    {
      fieldId: 'RI_P_BeAnonymous',
      translationId: 'IM_RI_BeAnonymous',
      component: 'Radio',
      name: 'anonymous',
      options: [
        { value: 'Yes', text: 'Yes' },
        { value: 'No', text: 'No' },
      ],
    },
    {
      fieldId: 'RI_P_IM_IR_ReportingEmployeeId',
      translationId: 'IM_RI_EmployeeId',
      component: 'TextField',
      name: 'reportingEmployeeId',
      maxLength: 100,
    },
    {
      fieldId: 'RI_P_ReportingStaffName',
      translationId: 'IM_RI_StaffName',
      component: 'TextField',
      name: 'reportingEmployeeName',
      maxLength: 100,
    },
    {
      fieldId: 'RI_P_DepartmentName',
      translationId: 'IM_RI_DepartmentName',
      component: 'TextField',
      name: 'reportStaffDepartment',
      maxLength: 100,
    },
    {
      fieldId: 'RI_P_IncidentType',
      translationId: 'IM_RI_IncidentType',
      component: 'Dropdown',
      name: 'incidentTypeId',
      options: pageLoadData?.Data.IncidentTypeList?.map((type) => ({
        text: type.IncidentTypeName,
        value: type.IncidentTypeId,
      })),
    },
    {
      fieldId: 'RI_P_Clinical/NonClinical',
      translationId: 'IM_RI_Clinical/NonClinical',
      component: 'Radio',
      name: 'clinicalType',
      options: [
        { value: 'Clinical', text: 'Clinical' },
        { value: 'Non-Clinical', text: 'Non-Clinical' },
      ],
    },
  ]

  const thirdGridConfig = [
    {
      fieldId: 'RI_P_IncidentDate',
      translationId: 'IM_RI_IncidentDate',
      component: 'DateTimePicker',
      name: 'incidentDate',
      disabled: false,
    },
    {
      fieldId: 'RI_P_Day',
      translationId: 'IM_RI_Day',
      component: 'TextField',
      name: 'incidentDay',
      maxLength: 100,
      disabled:true,
    },
    {
      fieldId: 'RI_P_Time',
      translationId: 'IM_RI_Time',
      component: 'TimePicker',
      name: 'incidentTime',
      disabled: false,
    },
    {
      fieldId: 'RI_P_ReportingDate',
      translationId: 'IM_RI_ReportingDate',
      component: 'DateTimePicker',
      name: 'reportingDateTime',
      disabled: true,
    },
    {
      fieldId: 'RI_P_ReportedDay',
      translationId: 'IM_RI_ReportedDay',
      component: 'TextField',
      name: 'reportingDay',
      disabled: true,
    },
    {
      fieldId: 'RI_P_ReportedTime',
      translationId: 'IM_RI_ReportedTime',
      component: 'TimePicker',
      name: 'reportedTime',
      disabled: true,
    },
  ]

    const convertDay=(date)=>{
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const dateAndTime = new Date(date);
    const dayName = daysOfWeek[dateAndTime.getDay()];
    return dayName
    }
   
    useEffect(()=>{
    const currentDate=new Date();
    setFieldValue('reportingDateTime',currentDate)
    setFieldValue('reportedTime', currentDate)
    const reportingDayName =convertDay(currentDate);
    setFieldValue('reportingDay', reportingDayName);
    // let combineDate=combineDateTime(currentDate,formatTime(currentDate))    
    },[])
  
    useEffect(() => {
      if (values.incidentDate) {
        const incidentDate = new Date(values.incidentDate);
        const incidentDayName =convertDay(incidentDate);
        setFieldValue('incidentDay', incidentDayName || '');
      }
    }, [values.incidentDate]);
  useEffect(() => {
    const facilityId = IncidentData?.reportIncident?.FacilityId || selectedFacility?.id
    setFieldValue('facilityId', facilityId)
    const checkRegion = userDetails?.ApplicableFacilities?.find((facility) => facility.FacilityId === facilityId)?.RegionCode
    if (checkRegion) {
      setAbdRegion(checkRegion)
    }
    if (IncidentData?.reportIncident) {
      const reportIncident = IncidentData?.reportIncident 
      setFieldValue('incidentReportNo', reportIncident?.IncidentNo)
      setFieldValue('anonymous', reportIncident?.Anonymous)
      setFieldValue('incidentType',reportIncident?.IncidentType)
      setFieldValue('incidentTypeId', reportIncident?.IncidentTypeId)
      setFieldValue('clinicalType', reportIncident?.ClinicalType)
      setFieldValue('reportingEmployeeId', userDetails?.EmployeeID);
      setFieldValue('reportingEmployeeName', userDetails?.UserName);
      setFieldValue('reportStaffDepartment', userDetails?.DepartmentName);
    }
  }, [IncidentData])

  const tableColumnList = [
    {
      id: 'SentinelDefinition',
    },
    {
      id: 'Inclusion',
    },
    {
      id: 'Exclusion',
    },
  ];

  const {
    data: sentinelEventDetails,
    isFetching,
    refetch,
  } = useGetAllSentinelEventQuery(
    {
      payload: {
        pageIndex: 1,
        pageSize: 100,
        headerFacility: selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: 2,
        // moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    },
    {
      skip: !selectedFacility?.id || !selectedModuleId || !selectedMenu?.id,
      refetchOnMountOrArgChange: true,
    }
  );
 
  //* Use Effects to bind data
  useEffect(() => {
    if (sentinelEventDetails?.Records) {
      setTotalRecords(sentinelEventDetails?.TotalRecords);
    }
  }, [sentinelEventDetails]);
  const handleRadioChange = (event,name) => {
    if(name==="anonymous"){
      setFieldValue('anonymous', event.target.value);
      setFieldValue('reportingEmployeeId', userDetails?.EmployeeID);
      setFieldValue('reportingEmployeeName', userDetails?.UserName);
      setFieldValue('reportStaffDepartment', userDetails?.DepartmentName);
    }else{
      setFieldValue(name, event.target.value);
    }
    
  };
  const handleModalOpenForField = (fieldConfigName) => {
    if (fieldConfigName === 'clinicalType') {
      setClinicalModalOpen(true);
    } else if (fieldConfigName === 'incidentTypeId') {
      setIncidentModalOpen(true);
    }
  };
  const handleIncidentTypeSentinelModal = () => {
    setIncidentSentinelModalOpen(true);
  };
  return isLoading ? (
    <FlexContainer justifyContent="center">
      <StyledImage src={LoadingGif} alt="LoadingGif" />
    </FlexContainer>
  ) : (
    <FormContainer>
      <Grid container spacing={2}>
        {/* First Row: Dropdown + Two Text Fields (Labels Below) */}
        <Grid item xs={12} container spacing={2}>
          {firstGridConfig.map((fieldConfig, index) => {
            const field = fields?.find((i) => i.FieldId === fieldConfig.fieldId);
            const translatedLabel = getIncidentlabel(
              fieldConfig?.translationId,
              labels,
              i18n.language
            );
            return (
              <Grid key={index} item xs={12} md={4} >
                {fieldConfig.component === 'Dropdown' ? (
                  <>
                    <Label
                      value={translatedLabel}
                    // isRequired={field.IsMandatory}
                    />
                    <SearchDropdown
                      name={fieldConfig.name}
                      options={[
                        { text: 'Select', value: '' },
                        ...(fieldConfig.options || []),
                      ]}
                      onChange={(event, value) => {
                        if (fieldConfig.name === "clinicalType") {
                          setFieldValue(fieldConfig.name, value?.value);
                        }
                        if (fieldConfig.name === "facilityId") {
                          setFieldValue(fieldConfig.name, value?.value);
                          const checkRegion = userDetails?.ApplicableFacilities?.find((facility) => facility.FacilityId === value?.value)?.RegionCode
                          if (checkRegion) {
                            setAbdRegion(checkRegion)
                          }
                        }
                        if (fieldConfig.name === "incidentTypeId") {
                          setFieldValue(fieldConfig.name, value?.value);
                          setFieldValue('incidentType', value?.text)

                        }
                      }}
                      value={
                        fieldConfig?.options?.find(
                          (option) => option.value === values[fieldConfig.name]
                        ) || null
                      }
                    />
                     {errors[fieldConfig.name] && touched[fieldConfig.name] && (
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors[fieldConfig.name]}
                          </div>
                        )}
                  </>
                ) : (
                  <>
                    <Label
                      value={translatedLabel}
                    // isRequired={field.IsMandatory}
                    />
                    <TextField
                      name={fieldConfig.name}
                      value={values[fieldConfig.name] || ''}
                      onChange={handleChange}
                      disabled={true}
                      slotProps={{
                        htmlInput: { maxLength: fieldConfig.maxLength },
                      }}
                    />
                    {errors[fieldConfig.name] && touched[fieldConfig.name] && (
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors[fieldConfig.name]}
                          </div>
                        )}
                  </>
                )}
              </Grid>
            )
          }
          )}
        </Grid>

        {/* Second Row: Radio Button + Three Text Fields (Labels Below) */}
        <Grid item xs={12} container spacing={2}>
          {
            secondGridConfig?.map((fieldConfig, index) => {
              const field = fields?.find((i) => i.FieldId === fieldConfig.fieldId);              
              const translatedLabel = getIncidentlabel(
                fieldConfig.translationId,
                labels,
                i18n.language
              );
              return (
                <Grid key={index} container spacing={2} item xs={12} alignItems={"center"} >
                  {
                    fieldConfig.name === 'anonymous' && fieldConfig.component === 'Radio' &&
                    <>
                      <Grid item xs={12} md={3} lg={3}>
                        <Label
                          value={translatedLabel}
                        isRequired={field?.IsMandatory}
                        />
                      </Grid>
                      <Grid item xs={12} md={3} lg={3}>
                        <RadioGroup row defaultValue={fieldConfig.defaultValue}>
                          {fieldConfig.options?.map((i) => (
                            <FormControlLabel
                              value={i.value}
                              control={<Radio />}
                              label={i.text}
                              checked={i.value === values?.anonymous}
                              onChange={(e)=>handleRadioChange(e,fieldConfig.name)}
                              sx={{
                                '& .MuiFormControlLabel-label': { fontSize: '12px' },
                              }}
                            />
                          ))}
                        </RadioGroup>
                        {errors[fieldConfig.name] && touched[fieldConfig.name] && (
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors[fieldConfig.name]}
                          </div>
                        )}
                      </Grid>
                    </>
                  }
                </Grid>
              )
            })
          }
          {
            values?.anonymous === 'No' && (
              <Grid container spacing={2} item xs={12} alignItems={"center"}>
                {
                  secondGridConfig?.map((fieldConfig, index) => {
                    const field = fields?.find((i) => i.FieldId === fieldConfig.fieldId);
                    const translatedLabel = getIncidentlabel(
                      fieldConfig?.translationId,
                      labels,
                      i18n.language
                    );

                    return (
                      <>
                        {
                          fieldConfig.component === 'TextField' &&
                          <Grid key={index} item xs={12} md={3} lg={3}>
                            <Label
                              value={translatedLabel}
                            // isRequired={field.IsMandatory}
                            />
                            <TextField
                              name={fieldConfig.name}
                              value={values[fieldConfig.name] || ''}
                              onChange={handleChange}
                              disabled={true}
                              slotProps={{
                                htmlInput: { maxLength: fieldConfig.maxLength },
                              }}
                            />
                            {errors[fieldConfig.name] && touched[fieldConfig.name] && (
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors[fieldConfig.name]}
                          </div>
                        )}
                          </Grid>

                        }
                      </>
                    )
                  })
                }
              </Grid>
            )
          }
          {/* <Grid item xs={12} container spacing={2} alignItems={'center'}> */}
          {secondGridConfig.map((fieldConfig, index) => {
            const field = fields?.find((i) => i.FieldId === fieldConfig.fieldId);
            const translatedLabel = getIncidentlabel(
              fieldConfig?.translationId,
              labels,
              i18n.language
            );
            return (
              <>
                {
                  fieldConfig.component === 'Dropdown' && (
                    <>
                      <Grid key={index} item xs={12} md={3} >
                        <Box display={'flex'} alignItems={'center'} gap={2}>
                          <Label
                            value={translatedLabel}
                          // isRequired={field.IsMandatory}
                          />
                          <Tooltip title="View Definition">
                            <IconButton
                              size="small"
                              onClick={() => handleModalOpenForField(fieldConfig.name)}
                              style={{
                                padding: '2px',
                                color: '#007bff',
                              }}
                            >
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                          {
                            abdRegion === "ABD" &&
                            <Tooltip title="View Sentinel Events">
                              <IconButton
                                size="small"
                                onClick={handleIncidentTypeSentinelModal}
                                style={{
                                  padding: '2px',
                                  color: '#007bff',
                                }}
                              >
                                <InfoIcon />
                              </IconButton>
                            </Tooltip>
                          }
                        </Box>
                      </Grid>
                      <Grid key={index} item xs={12} md={4} >
                        <SearchDropdown
                          name={fieldConfig.name}
                          options={[
                            { text: 'Select', value: '' },
                            ...(fieldConfig.options || []),
                          ]}
                          onChange={(event, value) => {
                            if (fieldConfig.name === "clinicalType") {
                              setFieldValue(fieldConfig.name, value?.value);
                            }
                            if (fieldConfig.name === "facilityId") {
                              setFieldValue(fieldConfig.name, value?.value);
                              const checkRegion = userDetails?.ApplicableFacilities?.find((facility) => facility.FacilityId === value?.value)?.RegionCode
                              if (checkRegion) {
                                setAbdRegion(checkRegion)
                              }
                            }
                            if (fieldConfig.name === "incidentTypeId") {
                              setFieldValue(fieldConfig.name, value?.value);
                              setFieldValue('incidentType', value?.text)

                            }
                          }}
                          value={
                            fieldConfig?.options?.find(
                              (option) => option.value === values[fieldConfig.name]
                            ) || null
                          }
                        />
                         {errors[fieldConfig.name] && touched[fieldConfig.name] && (
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors[fieldConfig.name]}
                          </div>
                        )} 
                      </Grid>
                    </>
                  )
                }
              </>
            )
          }
          )}
          {
            secondGridConfig?.map((fieldConfig, index) => {
              const field = fields?.find((i) => i.FieldId === fieldConfig.fieldId);
              const translatedLabel = getIncidentlabel(
                fieldConfig?.translationId,
                labels,
                i18n.language
              );
              return (
                <Grid key={index} container spacing={2} item xs={12} alignItems={"center"} >
                  {
                    fieldConfig.name === 'clinicalType' && fieldConfig.component === 'Radio' &&
                    <>
                      <Grid item xs={12} md={3} lg={3}>
                        <Box display={'flex'} alignItems={'center'} gap={2}>
                          <Label
                            value={translatedLabel}
                          // isRequired={field.IsMandatory}
                          />
                          <Tooltip title="View Definition">
                            <IconButton
                              size="small"
                              onClick={() => handleModalOpenForField(fieldConfig.name)}
                              style={{
                                padding: '2px',
                                color: '#007bff',
                              }}
                            >
                              <InfoIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3} lg={3}>
                        <RadioGroup row defaultValue={fieldConfig.defaultValue}>
                          {fieldConfig.options?.map((i) => (
                            <FormControlLabel
                              value={i.value}
                              control={<Radio />}
                              label={i.text}
                              checked={i.value === values?.clinicalType}
                              onChange={(e)=>handleRadioChange(e,fieldConfig.name)}
                              sx={{
                                '& .MuiFormControlLabel-label': { fontSize: '12px' },
                              }}
                            />
                          ))}
                        </RadioGroup>
                        {errors[fieldConfig.name] && touched[fieldConfig.name] && (
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors[fieldConfig.name]}
                          </div>
                        )}
                      </Grid>
                    </>
                  }
                </Grid>
              )
            })
          }
        </Grid>

        <Grid item xs={12} container spacing={2} alignItems={'center'}>
          {thirdGridConfig?.map((fieldConfig, index) => {
            const field = fields?.find((i) => i.FieldId === fieldConfig.fieldId);
            const translatedLabel = getIncidentlabel(
              fieldConfig?.translationId,
              labels,
              i18n.language
            );
            return (
              <>
                {
                  (fieldConfig.name === 'incidentDate' || fieldConfig.name === 'reportingDateTime') && fieldConfig.component === 'DateTimePicker' &&
                  <Grid key={index} item xs={12} md={4}>
                    <Label
                      value={translatedLabel}
                    isRequired={field?.IsMandatory}
                    />
                    <CustomDatePicker
                      name={fieldConfig.name}
                      value={values[fieldConfig.name]}
                      disabled={fieldConfig.disabled}
                      // onChange={(date) => {
                      //   setFieldValue(fieldConfig.name, date);
                      // }}
                      onChange={(date) => {
                        setFieldValue(fieldConfig.name, date);
                      }}
                    />
                    {errors[fieldConfig.name] && touched[fieldConfig.name] && (
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors[fieldConfig.name]}
                          </div>
                        )}
                  </Grid>
                }
                {
                  (fieldConfig.name === 'incidentDay' || fieldConfig.name === 'reportingDay') && fieldConfig.component === 'TextField' &&
                  <Grid key={index} item xs={12} md={4}>
                    <Label
                      value={translatedLabel}
                    isRequired={field?.IsMandatory}
                    />
                    <TextField
                      name={fieldConfig.name}
                      value={values[fieldConfig.name] || ''}
                      onChange={handleChange}
                      disabled={fieldConfig.disabled}
                      slotProps={{
                        htmlInput: { maxLength: fieldConfig.maxLength },
                      }}
                    />
                    {errors?.[fieldConfig.name]&&touched[fieldConfig.name]&& (
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors[fieldConfig.name]}
                          </div>
                        )}
                  </Grid>
                }
                {
                  (fieldConfig.name === "incidentTime" || fieldConfig.name === "reportedTime") && fieldConfig.component === 'TimePicker' && (
                    <Grid key={index} item xs={12} md={4}>
                      <Label
                        value={translatedLabel}
                      isRequired={field?.IsMandatory}
                      />
                      <CustomTimePickerAlone
                        name={fieldConfig.name}
                        value={values[fieldConfig.name]}
                        disabled={fieldConfig.disabled}
                        // onChange={(time) => {
                        //   const formattedTime = formatTime(time, 'HH:mm'); // 24-hour format
                        //   setFieldValue(fieldConfig.name, formattedTime);
                        // }}
                        onChange={(time) => {
                          const formattedTime = formatTime(time, 'HH:mm'); // 24-hour format                      
                          setFieldValue(fieldConfig.name, formattedTime);
                        }}
                      // Ensures it stretches fully
                      />
                      {errors[fieldConfig.name]&&touched[fieldConfig.name] && (
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors[fieldConfig.name]}
                          </div>
                        )}
                    </Grid>
                  )

                }
              </>
            )
          }
          )}
        </Grid>
      </Grid>
{/* ************************************************MODAL****************************************************************** */}
      {/* MOADL */}
      <Modal
        open={isClinicalModalOpen}
        onClose={closeClinicalModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          style: { backdropFilter: 'blur(8px)' },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '50%',
            bgcolor: 'white',
            boxShadow: 24,
            borderRadius: '8px',
            outline: 'none',
          }}
        >
          <button
            onClick={closeClinicalModal}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: '#ccc',
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
              padding: '5px',
            }}
          >
            <i className="fas fa-times" style={{ fontSize: '16px' }}></i>
          </button>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              background: '#0264AB',
              color: 'white',
              padding: '8px',
              borderRadius: '8px 8px 0 0',
            }}
          >
            Clinical/Non Clinical Definition
          </Typography>
          <div style={{ padding: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      backgroundColor: '#d8280b',
                      color: 'white',
                    }}
                  >
                    Clinical
                  </td>
                  <td
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    Long Term or High Intensity Care
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      backgroundColor: '#d8280b',
                      color: 'white',
                    }}
                  >
                    Non Clinical
                  </td>
                  <td
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      backgroundColor: 'white',
                    }}
                  >
                    Short Term Care
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Box>
      </Modal>
      <Modal
        open={isIncidentModalOpen}
        onClose={closeIncidentModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          style: { backdropFilter: 'blur(8px)' },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            bgcolor: 'white',
            boxShadow: 24,
            borderRadius: '8px',
            outline: 'none',
          }}
        >
          <IconButton
            onClick={closeIncidentModal}
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: '#ccc',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '50%',
              padding: '5px',
              '&:hover': {
                backgroundColor: '#999',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              background: '#0264AB',
              color: 'white',
              padding: '8px',
              borderRadius: '8px 8px 0 0',
            }}
          >
            Incident Type Definitions
          </Typography>
          <div style={{ padding: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      backgroundColor: '#d8280b',
                      color: 'white',
                    }}
                  >
                    Incident
                  </td>
                  <td
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    An event or circumstance that harmed or has the potential to
                    harm a person or property in relation to the organization,
                    resulting from human behavior and/or system failure.
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      backgroundColor: '#d8280b',
                      color: 'white',
                    }}
                  >
                    Adverse Event
                  </td>
                  <td
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      backgroundColor: 'white',
                    }}
                  >
                    An event that results in unintended harm to the patient by
                    an act of commission or omission rather than by the
                    underlying disease or condition of the patient.
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      backgroundColor: '#d8280b',
                      color: 'white',
                    }}
                  >
                    Near Miss
                  </td>
                  <td
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      backgroundColor: '#f5f5f5',
                    }}
                  >
                    An event that did not reach the patient but may harm if
                    reached or happened.
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      backgroundColor: '#d8280b',
                      color: 'white',
                    }}
                  >
                    Accident
                  </td>
                  <td
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      backgroundColor: 'white',
                    }}
                  >
                    Fire accident.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Box>
      </Modal>
      <Modal
        open={isIncidentSentinelModalOpen}
        onClose={closeIncidentSentinelModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          style: { backdropFilter: 'blur(8px)' },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '60%',
            bgcolor: 'white',
            boxShadow: 24,
            borderRadius: '8px',
            outline: 'none',
          }}
        >
          <IconButton
            onClick={closeIncidentSentinelModal}
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              backgroundColor: '#ccc',
              color: 'white',
              fontWeight: 'bold',
              borderRadius: '50%',
              padding: '5px',
              '&:hover': {
                backgroundColor: '#999',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              background: '#0264AB',
              color: 'white',
              padding: '8px',
              borderRadius: '8px 8px 0 0',
            }}
          >
            Sentinel Events
          </Typography>
          <div style={{ padding: '16px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {tableColumnList.map((column) => (
                    <th
                      key={column.id}
                      style={{
                        border: '1px solid #ccc',
                        padding: '8px',
                        backgroundColor: '#0264AB',
                        color: 'white',
                        textAlign: 'left',
                      }}
                    >
                      {column.id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sentinelEventDetails?.Records?.map((record, rowIndex) => (
                  <tr key={rowIndex}>
                    {tableColumnList.map((column) => (
                      <td
                        key={column.id}
                        style={{
                          border: '1px solid #ccc',
                          padding: '8px',
                          backgroundColor:
                            rowIndex % 2 === 0 ? '#f5f5f5' : 'white',
                        }}
                      >
                        {record[column.id] || 'N/A'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Box>
      </Modal>
    </FormContainer>
  );
};

export default IncidentDetailsForm;
