import React, { useEffect, useState } from 'react';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../../../utils/StyledComponents';
import {
  Box,
  Divider,
  MenuItem,
  Select,
  Grid,
  InputAdornment,
} from '@mui/material';
import Label from '../../../../../../components/Label/Label';
import { Field, useFormikContext } from 'formik';
import styled from 'styled-components';
import AddSubMaster from '../../../../../../assets/Icons/AddSubMaster.png';
import { useTranslation } from 'react-i18next';
import { useGetFieldsQuery } from '../../../../../../redux/RTK/moduleDataApi';
import { useSelector,useDispatch } from 'react-redux';
import {setIncidentPatientInvolved} from '../../../../../../redux/features/IncidentManagement/reportIncidentSlice'
import { getIncidentlabel } from '../../../../../../utils/language';
import SearchDropdown from '../../../../../../components/SearchDropdown/SearchDropdown';
import TextArea from '../../../../../../components/TextArea/TextArea';
import { TextField } from '../../../../../../components/TextField/TextField';
import Search from '../../../../../../assets/Icons/Search.png';
import StaffDetailsListPopup from './StaffDetailsListPopup';
import PatientTable from './PatientTable';
import { grid } from '@mui/system';

const FormContainer = styled(Box)`
  background-color: #fff;
`;
const StyledGridContainer = styled(Grid)`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 5px;
`;

const StyledGridItem = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
const Patient = ({  labels, patientTabChecked, id }) => {
  const fieldConfigData = [
    {
      fieldId: 'RI_P_PatientId',
      translationId: 'IM_RI_PatientId',
      component: 'TextField',
      name: 'patientId',
      grid:1,
      isFieldShow:true,
      disabled:false
    },
    {
      fieldId: 'RI_P_PatientName',
      translationId: 'IM_RI_PatientName',
      component: 'TextField',
      name: 'patientName',
      grid:1,
      isFieldShow:true,
      disabled:false

    },
    {
      fieldId: 'RI_P_PatientAge',
      translationId: 'IM_RI_PatientAge',
      component: 'TextField',
      name: 'age',
      grid:1,
      isFieldShow:true,
      disabled:false
    },
    {
      fieldId: 'RI_P_PatientGender',
      translationId: 'IM_RI_PatientGender',
      component: 'Dropdown',
      name: 'gender',
      options:[],
      grid:1,
      isFieldShow:true,
      disabled:false
    },
    {
      fieldId: 'RI_P_PhysicianDepartment',
      translationId: 'IM_RI_PhysicianDepartment',
      component: 'Dropdown',
      name: 'PhysicianDepartment',
      options: [],
      grid:2,
      isFieldShow:true,
      disabled:false
    },
    {
      fieldId: 'RI_P_PatientRoomNo/Details',
      translationId: 'IM_RI_PatientRoomNo/Details',
      component: 'TextField',
      name: 'PatientRoomNo',
      grid:2,
      isFieldShow:true,
      disabled:false
    },
    {
      fieldId: 'RI_P_PhysicianName',
      translationId: 'IM_RI_PhysicianName',
      component: 'TextField',
      name: 'physicianName',
      grid:3,
      isFieldShow:true,
      disabled:false
    },
    {
      fieldId: 'RI_P_VisitId',
      translationId: 'IM_RI_VisitId',
      component: 'TextField',
      name: 'visitId',
      grid:3,
      isFieldShow:true,
      disabled:false
    },
    {
      fieldId: 'RI_P_Diagnosis',
      translationId: 'IM_RI_Diagnosis',
      component: 'Textarea',
      name: 'diagnosis',
      grid:4,
      isFieldShow:true,
      disabled:false
    },
    
    {
      fieldId: 'RI_P_PhysicianNotified',
      translationId: 'IM_RI_PhysicianNotified',
      component: 'Dropdown',
      name: 'isPhysicianNotified',
      options:[],
      grid:5,
      isFieldShow:true,
      disabled:false

    },
    {
      fieldId: 'RI_P_NotifiedPhysician',
      translationId: 'IM_RI_NotifiedPhysician',
      component: 'TextField',
      name: 'NotifiedPhysician',
      grid:5,
      isFieldShow:false,
      isPhysicianNotified:'Yes',
      disabled:true
    },
    {
      fieldId: 'RI_P_Department',
      translationId: 'IM_RI_Designation',
      component: 'TextField',
      name: 'designation',
      grid:5,
      isFieldShow:false,
      isPhysicianNotified:'Yes',
      disabled:true
    },
    {
      component: 'Table',
    },
    // {
    //   fieldId: 'RI_P_PhysicianDesignation',
    //   translationId: 'IM_RI_PhysicianDesignation',
    //   component: 'TextField',
    //   name: 'PhysicianDesignation',
    // },
  ];
  const [configData,setConfigData] = useState(fieldConfigData)
  const [fields, setFields] = useState([]);
  const dispatch=useDispatch()
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    regionCode,
  } = useSelector((state) => state.auth);
  
  const { i18n } = useTranslation();
  const [errors,setErrors]=useState({})
  const [openPatientStaffModal, setOpenPatientStaffModal] = useState(false);
  const [showPatientTable, setShowPatientTable] = useState(false);
  const {incidentPatientInvolved,IncidentData,pageLoadData,staffDetails} = useSelector(state => state.reportIncident)
  const { values, handleChange, setFieldValue, handleBlur, touched } =
    useFormikContext();
  // const isPhysicianNotified = values?.isPhysicianNotified === 'Yes';

  const { data: fieldsData = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  const handleStaffModal = () => {
    setOpenPatientStaffModal(true);
  };

  const handleSelectRow = (row) => {         
    setFieldValue('NotifiedPhysician', row?.StaffName);
    setFieldValue('notifiedPhysicianUserId', row?.UserId);
    setFieldValue('designation', row?.PrimaryDesignation);
  };
  

  useEffect(() => {
    const pageFields = fieldsData?.Data?.Menus?.[0]?.Sections?.find(
      (i) => i.SectionName === 'Patient'
    );
    const allFields =
      pageFields?.Regions?.find((region) => region.RegionCode === 'ALL')
        ?.Fields || [];

    setFields(allFields);
  }, [fieldsData, regionCode]);

 
  useEffect(() => {
    if (pageLoadData?.Data?.DepartmentList.length > 0 ||
      pageLoadData?.Data?.IsPhysicianNotifiedList.length > 0) {
      const updateConfig = configData.map((item) => {
        if (item.name === "PhysicianDepartment") {          
          return {
            ...item,
            options:pageLoadData?.Data?.DepartmentList?.map((department) => ({
              text: department.DepartmentName,
              value: department.DepartmentId,
            })) || [],
          };
        }
        if (item.name === "isPhysicianNotified") {
          return {
            ...item,
            options: pageLoadData?.Data?.IsPhysicianNotifiedList?.map((item) => {
              return {
                text: item.Status,
                value: item.Status,
              };
            }) || [],
          };
        }
        if (item.name === "gender") {
          return {
            ...item,
            options:  pageLoadData?.Data?.GenderList?.map((gender) => ({
              text: gender.Gender,
              value: gender.Gender,
            })) || [],
          };
        }
        return item;
      });      
      setConfigData(updateConfig)
    }
  }, [pageLoadData])

  useEffect(()=>{
    if (values?.isPhysicianNotified === "Yes" || values?.isPhysicianNotified === "No") {
      const newFieldConfigData = configData?.map((item) =>
        (item.isPhysicianNotified === "Yes" ) ? { 
          ...item, 
          isFieldShow:values?.isPhysicianNotified==="Yes"?true:false  } : item
      );
      setConfigData(newFieldConfigData)
    }
  },[values?.isPhysicianNotified])
  


  const validationError=(values)=>{
    let validateError={}
    configData?.map((fieldConfig) => {
      const translatedLabel = getIncidentlabel(
        fieldConfig?.translationId,
        labels,
        i18n.language
      )      
      if(fieldConfig.isFieldShow&&!values[fieldConfig.name]&&fieldConfig.component!="Table"){
        validateError[fieldConfig.name]=`${translatedLabel} is required`
      }
    });
    return validateError
  }

  const handlesavePatients = () => {
    try{
      const validateError=validationError(values)      
      if(Object.keys(validateError).length>0){
        setErrors(validateError)
        return false
      }
      const newEntry = {
        patientId: values?.patientId || '',
        patientName: values?.patientName ||'',
        designation: values?.designation || '',
        roomNo: values?.PatientRoomNo || '',
        age: values?.age || '',
        gender: values?.gender ||'',
        diagnosis: values?.diagnosis ||'',
        visitId: values?.visitId || '',
        physicianName: values?.physicianName ||  '',
        isPhysicianNotified: values?.isPhysicianNotified ||'',
        NotifiedPhysician: values?.NotifiedPhysician ||'',
        physicianUserId:values?.notifiedPhysicianUserId||'',
        notifiedPhysicianUserId:values?.notifiedPhysicianUserId||'',
        departmentId: values?.PhysicianDepartment || '',  
        PhysicianDepartmentName:values?.PhysicianDepartmentName||'',
        isNewRow:true,
        isEditing: false,
        isSaved: true,
        isDelete: false,
};
      
      const updatedRows = incidentPatientInvolved?.length
      ? incidentPatientInvolved.map((item) => {
          if (item.patientId === values?.patientId) {
            return {
              ...item,
              patientId: values?.patientId || item.patientId,
              patientName: values?.patientName || item.patientName,
              designation: values?.designation || item.designation,
              roomNo: values?.PatientRoomNo || item.roomNo,
              age: values?.age || item.age,
              gender: values?.gender || item.gender,
              diagnosis: values?.diagnosis || item.diagnosis,
              visitId: values?.visitId || item.visitId,
              physicianName: values?.physicianName || item.physicianName || '',
              isPhysicianNotified: values?.isPhysicianNotified ||item.isPhysicianNotified,
              NotifiedPhysician: values?.NotifiedPhysician || item.NotifiedPhysician,
              physicianUserId:values?.notifiedPhysicianUserId||item.notifiedPhysicianUserId,
              notifiedPhysicianUserId: values?.notifiedPhysicianUserId || item.notifiedPhysicianUserId,
              departmentId: values?.PhysicianDepartment || item.departmentId,
              PhysicianDepartmentName:values?.PhysicianDepartmentName||item.PhysicianDepartmentName,
              isEditing: false,
              isSaved: true,
              isDelete: false,
            };
          }else{
            return item;
          }
        })
      : []; // Return empty array if there are no existing entries
      
    // If `incidentPatientInvolved` is empty or no updates are made, push a new object
    if (!updatedRows.find((item) => item.patientId === values?.patientId)) {
      newEntry['rowNo'] = updatedRows?.length + 1
      updatedRows.push(newEntry);
    }
         dispatch(setIncidentPatientInvolved(updatedRows))
        setFieldValue('patientId', '') 
        setFieldValue('designation', '') 
        setFieldValue('patientName', '') 
        setFieldValue('PatientRoomNo', '') 
        setFieldValue('age', '') 
        setFieldValue('gender', '') 
        setFieldValue('diagnosis', '') 
        setFieldValue('visitId', '') 
        setFieldValue('physicianName', '') 
        setFieldValue('isPhysicianNotified', '') 
        setFieldValue('NotifiedPhysician', '') 
        setFieldValue('PhysicianDepartment','')
        setFieldValue('PhysicianDepartmentName','')
        setErrors({})
        // setShowPatientTable(true);
    }catch(err){
      console.log("...errrr",err);
    }
   
  };

 
  // useEffect(()=>{
  //   if(IncidentData?.incidentPatientInvolved?.length>0){
  //    dispatch(setIncidentPatientInvolved(IncidentData?.incidentPatientInvolved.map((item)=>{      
      
  //     const PhysicianUserDetails = staffDetails?.find(staff => staff.UserId === item.PhysicianUserId)        
  //     const notifiedPhysicianUserDetails=staffDetails?.find(staff => staff.UserId === item.NotifiedPhysicianUserId)        
  //     return{
  //       rowNo:item.RowNo,
  //       patientId: item?.PatientId || '',
  //       patientName: item?.PatientName ||'',
  //       roomNo: item?.RoomNo || '',
  //       age: item?.Age || '',
  //       gender: item?.Gender ||'',
  //       diagnosis: item?.diagnosis ||'',
  //       visitId: item?.VisitId || '',
  //       physicianName: item?.PhysicianName ||  '',
  //       isPhysicianNotified: item?.IsPhysicianNotified?'Yes':'No' ||'No',
  //       NotifiedPhysician: item?.NotifiedPhysician ||'',
  //       physicianUserId:item?.PhysicianUserId||'',
  //       notifiedPhysicianUserId:item?.NotifiedPhysicianUserId||'',
  //       departmentId: item?.DepartmentId || '',  
  //       PhysicianDepartmentName:item?.DepartmentId||'',
  //       isEditing: false,
  //       isSaved: true,
  //       isDelete: item.Isdelete||false
  //     }
  //    })))
  //   }
  // },[IncidentData,staffDetails])
  const getGridColumns=(fieldConfig,gridWindow)=>{
    if(gridWindow==="md" || gridWindow==="lg"){
     if(fieldConfig.grid===1)  return 3
     if(fieldConfig.grid===2)  return 6
     if(fieldConfig.grid===3)  return 6
     if(fieldConfig.grid===4)  return 12
     if(fieldConfig.grid===5) {
       if(values?.isPhysicianNotified==='Yes') 
        return 4 
      else 
       return 6
    }
     else return 12
    } 
  }
  return (
    <FlexContainer 
    flexDirection="column"
     width="100%" 
     margin="10px 0 0 0"
     border="1px solid #3F5197"
     padding="20px"
     >
      <StyledTypography
        fontSize="18px"
        fontWeight="700"
        lineHeight="22px"
        color="rgba(0, 131, 192, 1)"
        whiteSpace={'nowrap'}
      >
        Patient
      </StyledTypography>
      <Divider
        sx={{ marginY: '20px' }}
        border="1px solid rgba(63, 81, 151, 1)"
      />

      <FormContainer>
        <Grid container spacing={2} display={'flex'}>
          {configData?.filter(item=>item.isFieldShow==true)?.map((fieldConfig) => {
            const field = fields?.find(
              (i) => i.FieldId === fieldConfig.fieldId
            );
            const translatedLabel = getIncidentlabel(
              fieldConfig?.translationId,
              labels,
              i18n.language
            );

            if(field?.IsShow){
              return (
                <Grid
                  item
                  xs={12}
                  sm={12}
                  padding={'10px'}
                  md={getGridColumns(fieldConfig,'md')}
                  lg={getGridColumns(fieldConfig,'lg')}
                  key={field.fieldId}
                >
                  <Label
                    value={translatedLabel}
                    isRequired={field.IsMandatory}
                  />

                  {fieldConfig.component === 'Dropdown' && (
                    <SearchDropdown
                      name={fieldConfig.name}
                      disabled={!patientTabChecked}
                      options={[
                        { text: 'Select', value: '' },
                        ...(fieldConfig.options || []),
                      ]}
                      onChange={(event, value) => {
                        if(fieldConfig.name=== "PhysicianDepartment"){
                          setFieldValue('PhysicianDepartment', value?.value);
                          setFieldValue('PhysicianDepartmentName', value?.text);
                        } else{
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
                  {/* {fieldConfig.component === 'TextField' && (
                    <TextField
                      name={fieldConfig.name}
                      value={values[fieldConfig.name] || ''}
                      onChange={handleChange}
                      slotProps={{
                        htmlInput: { maxLength: fieldConfig.maxLength },
                      }}
                    />
                  )} */}
                  {fieldConfig.component === 'TextField' &&
                    (fieldConfig.name === 'NotifiedPhysician' ? (
                      <TextField
                        name={fieldConfig.name}
                        value={values[fieldConfig.name]}
                        //sx={{ width: '300px' }}
                        disabled={fieldConfig.disabled}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="start">
                              <StyledImage
                                src={Search}
                                alt="Search Icon"
                                onClick={handleStaffModal} // Replace with your actual function
                                style={{ cursor: 'pointer' }}
                              />
                            </InputAdornment>
                          ),
                        }}
                      />
                    ) : (
                      <TextField
                        name={fieldConfig.name}
                        disabled={fieldConfig.name==="designation"?fieldConfig.disabled :!patientTabChecked}
                        value={values[fieldConfig.name] || ''}
                        onChange={(e) => {
                          if (
                            fieldConfig.name === 'patientId' ||
                            fieldConfig.name === 'age'
                          ) {
                            const numericValue = e.target.value.replace(
                              /\D/g,
                              ''
                            );
                            handleChange({
                              target: {
                                name: fieldConfig.name,
                                value: numericValue,
                              },
                            });
                          } else {
                            handleChange(e);
                          }
                        }}
                        slotProps={{
                          htmlInput: { maxLength: fieldConfig.maxLength },
                        }}
                      />
                    ))}

                  {fieldConfig.component === 'Textarea' && (
                    <TextArea
                      name={fieldConfig.name}
                      disabled={!patientTabChecked}
                      value={values[fieldConfig.name] || ''}
                      onChange={handleChange}
                    />
                  )}
                  {errors[fieldConfig.name]  && (
                    <div style={{ color: 'red', fontSize: '11px' }}>
                      {errors[fieldConfig.name]}
                    </div>
                  )}
                </Grid>
              );
            }
          
            else return null;
          })}
        </Grid>
      </FormContainer>

      <FlexContainer
        style={{
          marginTop: '20px',
          justifyContent: 'center',
          marginBottom:'20px',
          gap: '10px',
        }}
      >
        <StyledButton
          variant="contained"
          marginTop={'10px'}
          onClick={handlesavePatients}
          disabled={!patientTabChecked}
          startIcon={
            <StyledImage
              height="14px"
              width="14px"
              src={AddSubMaster}
              alt="Add New Icon"
              style={{ marginInlineEnd: 8 }}
            />
          }
        >
          Save Patient Details
        </StyledButton>
      </FlexContainer>
      <Divider sx={{ marginY: '20px' }} />
      {configData.some((field) => field.component === 'Table') &&
        <PatientTable IncidentData={IncidentData}/>}
      <StaffDetailsListPopup
        openStaffModal={openPatientStaffModal}
        setOpenStaffModal={setOpenPatientStaffModal}
        handleSelectRow={handleSelectRow}
      />
    </FlexContainer>
  );
};

export default Patient;
