import React, { useEffect, useState } from 'react';
import Label from '../../../../../components/Label/Label';
import styled from 'styled-components';
import InfoIcon from '@mui/icons-material/Info';
import {
  Box,
  Grid,
  Button,
  Select,
  MenuItem,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  Divider,
  Typography,
  Tabs,
  FormLabel,
  Checkbox,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Formik, Field, Form, useFormikContext } from 'formik';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTab,
  StyledTypography,
} from '../../../../../utils/StyledComponents';
import AddSubMaster from '../../../../../assets/Icons/AddSubMaster.png';
import Attach from '../../../../../assets/Icons/Attach.png';
import AdditionalStaff from './AdditionalStaff';
import { column } from 'stylis';
import TabPanel from '../../../../../components/Tabpanel/Tabpanel';
import Staff from './TabsPersonInvoled/Staff';
import Patient from './TabsPersonInvoled/Patient';
import Companion from './TabsPersonInvoled/Companion ';
import Visitor from './TabsPersonInvoled/Visitor';
import OutsourcedStaff from './TabsPersonInvoled/OutsourcedStaff';
import Others from './TabsPersonInvoled/Others';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux'
import { getIncidentlabel } from '../../../../../utils/language';
import SearchDropdown from '../../../../../components/SearchDropdown/SearchDropdown';
import {
  setIncidentStaffInvolved,
  setIncidentPatientInvolved,
  setIncidentVisitorInvolved,
  setIncidentRelativeInvolved,
  setIncidentOutStaffInvolved,
  setIncidentOthersInvolved
} from '../../../../../redux/features/IncidentManagement/reportIncidentSlice'

import ImmediateActionTakenTable from '../IncidentCategoryTab/ImmediateActionTakenTable';
import WitnessedByTable from '../PersonsinvolvedTab/WitnessedByTable';
import LoadingGif from '../../../../../assets/Gifs/LoadingGif.gif';
import HarmLevel from '../Modal/HarmLevelModal';
import { useDispatch } from 'react-redux';
import { map } from 'lodash';
const FormContainer = styled(Box)`
  margin: 20px;
  background-color: #fff;
`;

const StyledGridItem = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const PersonInvolvedForm = ({
  labels,
  fields,
  pageLoadData,
  isLoading,
  id,
  IncidentData,
  staffTabChecked,
  setStaffTabChecked,
  patientTabChecked,
  setPatientTabChecked,
  companionTabChecked,
  setCompanionTabChecked,
  visitorTabChecked,
  setVisitorTabChecked,
  outsourcedTabChecked,
  setOutsourcedTabChecked,
  setOthersTabChecked,
  othersTabChecked,
}) => {
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch()
  const [tabValue, setTabValue] = useState(0);
  const [isHarmLevelModalOpen, setIsHarmLevelModalOpen] = useState(false);
  const { i18n } = useTranslation();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const openHarmLevelModal = () => setIsHarmLevelModalOpen(true);
  const closeHarmLevelModal = () => setIsHarmLevelModalOpen(false);
  const { values, handleChange, setFieldValue, errors, handleBlur, touched } =
    useFormikContext();
  const { staffDetails } = useSelector(state => state.reportIncident)
  const additionalStaffNotified = values.additionalStaffNotified === 'yes';
  const configData = [
    {
      fieldId: 'RI_P_PersonInvolvedintheIncident',
      translationId: 'IM_RI_PersonInvolvedintheIncident',
      component: 'Tabs',
    },
    {
      fieldId: 'RI_P_WitnessedBy',
      translationId: 'IM_RI_WitnessedBy',
      component: 'Table',
    },
    {
      fieldId: 'RI_P_Attachment(s)',
      translationId: 'IM_RI_Attachment(s)',
      component: 'Upload',
    },
    {
      fieldId: 'RI_P_HarmLevel',
      translationId: 'IM_RI_HarmLevel',
      component: 'Dropdown',
      name: 'incidentHarmLevelId',
      options: pageLoadData?.Data.HarmLevelList?.map((harmLevel) => ({
        text: harmLevel.IncidentHarmLevel,
        value: harmLevel.IncidentHarmLevelId,
      })),
    },
    {
      fieldId: 'RI_P_Anyadditionalstaffyouwishtobenotified',
      translationId: 'IM_RI_Anyadditionalstaffyouwishtobenotified',
      component: 'Radio',
      name: 'additionalStaffNotified',
      options: [
        { value: 'Yes', text: 'Yes' },
        { value: 'No', text: 'No' },
      ],
    },
    {
      fieldId: 'RI_P_Anyadditionalstaffyouwishtobenotified',
      component: 'Table',
    },
  ];

  useEffect(() => {
    if (IncidentData) {
     const incidentHarmLevel=  pageLoadData?.Data.HarmLevelList?.find(item=>item.IncidentHarmLevelId===IncidentData?.reportIncident?.IncidentHarmLevelId)?.IncidentHarmLevel     
      setFieldValue( 'incidentHarmLevelId',IncidentData?.reportIncident?.IncidentHarmLevelId || '' );
      setFieldValue( 'incidentHarmLevel',incidentHarmLevel || '' );
      setFieldValue( 'additionalStaffNotified',IncidentData?.reportIncident?.AdditionalStaffNotify || 'No' );
      setFieldValue(
        'incidentAdditionalNotifyStaff', IncidentData?.incidentAdditionalNotifyStaff?.map((item, i) => {
          const filterData = staffDetails?.find(staff => staff.UserId === item.StaffId)
          // const filterData = staffDetails?.find(staff => staff.UserId === 243)
          return {
            rowNo:item.RowNo,
            staffId: filterData?.UserId || 0,
            staffName: filterData?.StaffName || '',
            department: filterData?.Department || '',
            designation: filterData?.PrimaryDesignation || '',
            isDelete: item.IsDelete || false,
            isEditing: false,
            isNewRow:false
          }
        })
      );
      setFieldValue(
        'incidentWitnessedBy', IncidentData?.incidentWitnessedBy?.map((item) => {
           const filterData = staffDetails?.find(staff => staff.UserId === item.StaffId)
          // const filterData = staffDetails?.find(staff => staff.UserId === 243)
         
          return {
            rowNo:item.RowNo,
            staffId: filterData?.UserId || '',
            staffName: filterData?.StaffName || '',
            department: filterData?.Department || '',
            designation: filterData?.PrimaryDesignation || '',
            isDelete: item.IsDelete||false,
            isEditing: false,
            isNewRow:false
          }
        })
      );
    }
  }, [IncidentData, staffDetails,pageLoadData]);
  
  useEffect(() => {
    if(IncidentData?.incidentStaffInvolved?.length>0){
      dispatch(setIncidentStaffInvolved(IncidentData?.incidentStaffInvolved.map((item)=>{        
        const filterData = staffDetails?.find(staff => staff.UserId === item.StaffId)        
        //  const filterData = staffDetails?.find(staff => staff.UserId === 243)        
        return{ 
          staffId: filterData?.UserId || '',
          employeeId: filterData?.EmployeeId || '',
          staffName: filterData?.StaffName || '',
          department: filterData?.Department || '',
          designation: filterData?.PrimaryDesignation || '',
          staffCategory: filterData?.StaffCategory || '',
          isDelete: item.IsDelete||false
        }
      })))
    }
    if(IncidentData?.incidentPatientInvolved?.length>0){
     dispatch(setIncidentPatientInvolved(IncidentData?.incidentPatientInvolved.map((item)=>{            
      const PhysicianUserDetails = staffDetails?.find(staff => staff.UserId === item.PhysicianUserId)        
      const notifiedPhysicianUserDetails=staffDetails?.find(staff => staff.UserId === item.NotifiedPhysicianUserId)              
      return{
        rowNo:item.RowNo,
        patientId: item?.PatientId || '',
        patientName: item?.PatientName ||'',
        roomNo: item?.RoomNo || '',
        age: item?.Age || '',
        gender: item?.Gender ||'',
        diagnosis: item?.diagnosis ||'',
        visitId: item?.VisitId || '',
        physicianUserId:item?.PhysicianUserId||'',
        physicianName: PhysicianUserDetails?.StaffName ||  '',
        isPhysicianNotified: item?.IsPhysicianNotified?'Yes':'No' ||'No',
        NotifiedPhysician: notifiedPhysicianUserDetails?.StaffName ||'',
        designation:notifiedPhysicianUserDetails?.PrimaryDesignation||'',
        notifiedPhysicianUserId:item?.NotifiedPhysicianUserId||'',
        departmentId: item?.DepartmentId || '',  
        PhysicianDepartmentName:item?.DepartmentId||'',
        isNewRow:false,
        isEditing: false,
        isSaved: true,
        isDelete: item.Isdelete||false
      }
     })))
    }
    if(IncidentData?.incidentRelativeInvolved?.length>0){
      dispatch(setIncidentRelativeInvolved(IncidentData?.incidentRelativeInvolved?.map((item)=>{
        return{
        rowNo:item.RowNo,
        "patientId": item.PatientId || '',
        "patientName": item.PatientName || '',
        "relativeName": item.RelativeName || '',
        "relativeAge": item.RelativeAge || '',
        "relativeGender": item.RelativeGender || '',
        "departmentId": item.DepartmentId || '',
        "roomNo": item.RoomNo || '',
        "relationship": item.Relationship || '',
        isDelete: item.Isdelete||false,
        isNewRow:false,
        }
      })))
    }
    if(IncidentData?.incidentVisitorInvolved?.length>0){
      dispatch(setIncidentVisitorInvolved(IncidentData?.incidentVisitorInvolved.map((item)=>{
        return{
           rowNo:item.RowNo,
          visitorName: item.VisitorName || '',
          visitorAge: item.VisitorAge || '',
          visitorGender: item.VisitorGender || '',
          departmentId: item.DepartmentId || '',
          reasonforVisit: item.ReasonforVisit || '',
          isEditing: false,  // Set isEditing to false when adding new row
          isSaved: true,
          isDelete: item.IsDelete||false,
          isNewRow:false,
        }
      })))
    }
    if(IncidentData?.incidentOutStaffInvolved?.length>0){
      dispatch(setIncidentOutStaffInvolved(IncidentData?.incidentOutStaffInvolved.map((item)=>{
      return{
       rowNo:item.RowNo,
      outStaffId: item.OutStaffId || '',
      outStaffName: item.OutStaffName || '',
      outStaffAge: item.OutStaffAge || '',
      outStaffGender: item.OutStaffGender || '',
      departmentId: item.DepartmentId || '',
      companyName: item.CompanyName || '',
      isEditing: false,
      isSaved: true,
      isDelete: item.IsDelete||false,
      isNewRow:false,
      }
      })))
    }
    if(IncidentData?.incidentOthersInvolved?.length>0){
      dispatch(setIncidentOthersInvolved(IncidentData?.incidentOthersInvolved.map((item)=>{
        return{
          rowNo:item.RowNo,
          name: item.Name || '',
          age: item.Age || '',
          gender: item.Gender || '',
          details: item.Details || '',
          isDelete: item.Isdelete||false,
          isNewRow:false,
        }
      })))
    }
  }, [IncidentData,staffDetails]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // const handleFileChange = (event) => {
  //   const files = Array.from(event.target.files);
  //   setFiles((prevFiles) => [...prevFiles, ...files]);
  // };

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //   }
  // };
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to Array
    setSelectedFiles(files);
  };

  const handleUploadClick = () => {
    document.getElementById('fileInput').click(); // Trigger file input
  };

  const handleDeleteClick = (e, file) => {
    setFiles(files?.filter((item) => item.name !== file.name));
  };

  const getGridColumns = (fieldConfig) => {
    if (
      fieldConfig.component === 'Upload' ||
      fieldConfig.component === 'Dropdown'
    )
      return 6;
    if (fieldConfig.component === 'Tabs' || fieldConfig.component === 'Table' || fieldConfig.component === "Radio")
      return 12;
    return 4;
  };
  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return isLoading ? (
    <FlexContainer justifyContent="center">
      <StyledImage src={LoadingGif} alt="LoadingGif" />
    </FlexContainer>
  ) : (
    <FormContainer>
      <Grid container spacing={2} display={'flex'}>
        {configData?.map((fieldConfig) => {
          const field = fields?.find((i) => i.FieldId === fieldConfig.fieldId);
          const translatedLabel = getIncidentlabel(
            fieldConfig?.translationId,
            labels,
            i18n.language
          );
          const handleRadioChange = (event) => {
            setFieldValue('additionalStaffNotified', event.target.value);
          };
          if (field?.IsShow) {
            return (
              <Grid
                item
                xs={12}
                sm={12}
                padding={'10px'}
                md={getGridColumns(fieldConfig)}
                lg={getGridColumns(fieldConfig)}
                key={field.fieldId}
              >
                {
                  fieldConfig.name !== 'incidentHarmLevelId' && fieldConfig.component !== 'Radio' &&
                  <Label
                    value={translatedLabel}
                    isRequired={
                      fieldConfig.component === 'Table' &&
                        fieldConfig.fieldId ===
                        'RI_P_Anyadditionalstaffyouwishtobenotified'
                        ? null
                        : field.IsMandatory
                    }
                  />
                }
                {
                  fieldConfig.name === 'incidentHarmLevelId' &&
                  <Box display={'flex'} alignItems={'center'} gap={2} >
                    <Label
                      value={translatedLabel}
                      isRequired={
                        fieldConfig.component === 'Table' &&
                          fieldConfig.fieldId ===
                          'RI_P_Anyadditionalstaffyouwishtobenotified'
                          ? null
                          : field.IsMandatory
                      }
                    />
                    <Tooltip title="View Harm Level">
                      <IconButton
                        size="small"
                        onClick={() => openHarmLevelModal()}
                        style={{
                          color: '#007bff',
                        }}
                      >
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>

                }

                {/* {(fieldConfig.fieldId==="RI_P_Anyadditionalstaffyouwishtobenotified"&& additionalStaffNotified) &&(
                <Label value={translatedLabel} isRequired={field.IsMandatory} />)} */}
                {fieldConfig.component === 'Tabs' && (
                  <FlexContainer flexDirection="column">
                    <Tabs
                      value={tabValue}
                      onChange={handleTabChange}
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
                      {/* <StyledTab
                        label="Staff"
                        customBackgroundcolor="#3F5197"
                      ></StyledTab> */}
                      <StyledTab
                        label={
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <Checkbox
                              iconStyle={{ fill: 'white' }}
                              inputStyle={{ color: 'white' }}
                              style={{ color: 'white' }}
                              checked={staffTabChecked}
                              onChange={(event) =>
                                setStaffTabChecked(event.target.checked)
                              }
                            />
                            <span>Staff</span>
                          </div>
                        }
                        customBackgroundcolor="#3F5197"
                      />
                      <StyledTab
                        label={
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <Checkbox
                              //  iconStyle={{ fill: 'white' }}
                              inputStyle={{ color: 'white' }}
                              style={{ color: 'white' }}
                              checked={patientTabChecked}
                              onChange={(event) =>
                                setPatientTabChecked(event.target.checked)
                              }
                            />
                            <span>Patient</span>
                          </div>
                        }
                        customBackgroundcolor="#3F5197"
                      ></StyledTab>
                      <StyledTab
                        label={
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <Checkbox
                              iconStyle={{ fill: 'white' }}
                              inputStyle={{ color: 'white' }}
                              checked={companionTabChecked}
                              onChange={(event) =>
                                setCompanionTabChecked(event.target.checked)
                              }
                              style={{ color: 'white' }}
                            />
                            <span>Companion</span>
                          </div>
                        }
                        customBackgroundcolor="#3F5197"
                      ></StyledTab>
                      <StyledTab
                        label={
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <Checkbox
                              iconStyle={{ fill: 'white' }}
                              inputStyle={{ color: 'white' }}
                              checked={visitorTabChecked}
                              onChange={(event) =>
                                setVisitorTabChecked(event.target.checked)
                              }
                              style={{ color: 'white' }}
                            />
                            <span>Visitor</span>
                          </div>
                        }
                        customBackgroundcolor="#3F5197"
                      ></StyledTab>
                      <StyledTab
                        label={
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <Checkbox
                              iconStyle={{ fill: 'white' }}
                              inputStyle={{ color: 'white' }}
                              checked={outsourcedTabChecked}
                              onChange={(event) =>
                                setOutsourcedTabChecked(event.target.checked)
                              }
                              style={{ color: 'white' }}
                            />
                            <span>Outsourced Staff</span>
                          </div>
                        }
                        customBackgroundcolor="#3F5197"
                      ></StyledTab>
                      <StyledTab
                        label={
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                          >
                            <Checkbox
                              iconStyle={{ fill: 'white' }}
                              inputStyle={{ color: 'white' }}
                              checked={othersTabChecked}
                              onChange={(event) =>
                                setOthersTabChecked(event.target.checked)
                              }
                              style={{ color: 'white' }}
                            />
                            <span>Others</span>
                          </div>
                        }
                        customBackgroundcolor="#3F5197"
                      ></StyledTab>
                    </Tabs>
                    <TabPanel value={tabValue} index={0}>
                      <Staff
                        pageLoadData={pageLoadData}
                        labels={labels}
                        id={id}
                        IncidentData={IncidentData}
                        staffTabChecked={staffTabChecked}
                      />
                    </TabPanel>
                    <TabPanel value={tabValue} index={1}>
                      <Patient
                        pageLoadData={pageLoadData}
                        labels={labels}
                        id={id}
                        IncidentData={IncidentData}
                        patientTabChecked={patientTabChecked}
                      />
                    </TabPanel>

                    <TabPanel value={tabValue} index={2}>
                      <Companion
                        pageLoadData={pageLoadData}
                        labels={labels}
                        id={id}
                        companionTabChecked={companionTabChecked}
                      />
                    </TabPanel>
                    <TabPanel
                      value={tabValue}
                      index={3}
                      visitorTabChecked={visitorTabChecked}
                    >
                      <Visitor
                        pageLoadData={pageLoadData}
                        labels={labels}
                        id={id}
                        visitorTabChecked={visitorTabChecked}
                      />
                    </TabPanel>
                    <TabPanel
                      value={tabValue}
                      index={4}
                      outsourcedTabChecked={outsourcedTabChecked}
                    >
                      <OutsourcedStaff
                        pageLoadData={pageLoadData}
                        outsourcedTabChecked={outsourcedTabChecked}
                        labels={labels}
                        id={id}
                      />
                    </TabPanel>
                    <TabPanel
                      value={tabValue}
                      index={5}
                      othersTabChecked={outsourcedTabChecked}
                    >
                      <Others
                        pageLoadData={pageLoadData}
                        labels={labels}
                        id={id}
                        othersTabChecked={othersTabChecked}
                      />
                    </TabPanel>
                  </FlexContainer>
                )}
                {fieldConfig.component === 'Dropdown' && (
                  <SearchDropdown
                    name={fieldConfig.name}
                    options={[
                      { text: 'Select', value: '' },
                      ...(fieldConfig.options || []),
                    ]}
                    onChange={(event, value) => {
                      if (fieldConfig.name = "incidentHarmLevelId") {
                        setFieldValue(fieldConfig.name, value?.value);
                        setFieldValue('incidentHarmLevel', value?.text);
                      } else {
                        setFieldValue(fieldConfig.name, value?.value);
                      }
                    }}
                    value={
                      fieldConfig?.options?.find(
                        (option) => option.value === values[fieldConfig.name]
                      ) || null
                    }
                  />
                )}
                {fieldConfig.component === 'Radio' && (
                  <Grid item container xs={12} md={6} lg={6} alignItems={'center'}>
                    <Grid item md={6} lg={6}>
                      <Label
                        value={translatedLabel}
                        isRequired={
                          fieldConfig.component === 'Table' &&
                            fieldConfig.fieldId ===
                            'RI_P_Anyadditionalstaffyouwishtobenotified'
                            ? null
                            : field.IsMandatory
                        }
                      />
                    </Grid>
                    <Grid item md={6} lg={6}>
                      <RadioGroup row defaultValue={fieldConfig.defaultValue}>
                        {fieldConfig.options?.map((i) => (
                          <FormControlLabel
                            value={i.value}
                            control={<Radio />}
                            label={i.text}
                            checked={values?.additionalStaffNotified === i.value}
                            onChange={handleRadioChange}
                            sx={{
                              '& .MuiFormControlLabel-label': { fontSize: '12px' },
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </Grid>
                  </Grid>

                )}

                {fieldConfig.component === 'Table' &&
                  fieldConfig.fieldId !==
                  'RI_P_Anyadditionalstaffyouwishtobenotified' && (
                    <>
                      <WitnessedByTable IncidentData={IncidentData} />
                      <Divider sx={{ marginY: '20px' }} />
                    </>
                  )}

                {fieldConfig.component === 'Table' &&
                  fieldConfig.fieldId ===
                  'RI_P_Anyadditionalstaffyouwishtobenotified' &&
                  values.additionalStaffNotified === "Yes" && (
                    <>
                      <Divider sx={{ marginY: '20px' }} />
                      <AdditionalStaff IncidentData={IncidentData} />
                    </>
                  )}

                {/* {(fieldConfig.component === 'Table' && fieldConfig.fieldId === 'RI_P_Anyadditionalstaffyouwishtobenotified')&&(
                  <>
                    <ImmediateActionTakenTable />
                    <Divider sx={{ marginY: '20px' }} />
                  </>
                )} */}
                {/* {fieldConfig.component === 'Upload' && (
                  <FlexContainer flexDirection="column">
                    <div
                      style={{
                        border: '1px rgba(197, 197, 197, 1)',
                        padding: '20px',
                        borderRadius: 'Top-left 4px Top-right 4px',
                        background: 'rgba(230, 243, 249, 1)',
                        height: '140px',
                      }}
                    >
                      {files?.length > 0 ? (
                        <FlexContainer flexDirection="column">
                          {files?.map((file) => (
                            <FlexContainer justifyContent="space-between">
                              <StyledTypography
                                fontSize={'14px'}
                                fontWeight="400"
                                lineHeight="20px"
                              >
                                {file.name}
                              </StyledTypography>
                              <StyledImage
                                src={DeleteIcon}
                                alt="Delete Icon"
                                style={{
                                  cursor: 'pointer',
                                  width: '18px',
                                  height: '18px',
                                  zIndex: 1,
                                }}
                                onClick={(e) => handleDeleteClick(e, file)}
                              />
                            </FlexContainer>
                          ))}
                        </FlexContainer>
                      ) : (
                        <FlexContainer
                          justifyContent="center"
                          alignItems="center"
                          style={{
                            background: 'rgba(255, 255, 255, 1)',
                            height: '140px',
                          }}
                        >
                          <StyledTypography
                            fontSize={'14px'}
                            fontWeight="400"
                            lineHeight="20px"
                          >
                            No attachments added!
                          </StyledTypography>
                        </FlexContainer>
                      )}
                    </div>
                    <Button variant="contained" onClick={handleUploadClick}>
                      Upload Attachment(s)
                    </Button>
                    <input
                      id="fileInput"
                      type="file"
                      multiple
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <Typography
                      variant="body2"
                      color="error"
                      style={{ marginTop: '8px' }}
                      fontSize="10px"
                      lineHeight="16px"
                      fontWeight="400"
                    >
                      Note: Maximum File Upload Limit is 100MB (Images, PDF,
                      Word Files, Excel Files Only)
                    </Typography>
                  </FlexContainer>
                )} */}
                {fieldConfig.component === 'Upload' && (
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
                      <Button variant="contained" onClick={handleUploadClick}>
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
                        {selectedFiles.map((file, index) => (
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
                      Note: Maximum File Upload Limit is 100MB (Images, PDF,
                      Word Files, Excel Files Only)
                    </Typography>
                  </div>
                )}

                {errors[fieldConfig.name] && touched[fieldConfig.name] && (
                  <div style={{ color: 'red', fontSize: '11px' }}>
                    {errors[fieldConfig.name]}
                  </div>
                )}
              </Grid>
            );
          }
          return null;
        })}
      </Grid>
      <HarmLevel
        isHarmLevelModalOpen={isHarmLevelModalOpen}
        closeHarmLevelModal={closeHarmLevelModal}
      />
    </FormContainer>
  );
};

export default PersonInvolvedForm;
