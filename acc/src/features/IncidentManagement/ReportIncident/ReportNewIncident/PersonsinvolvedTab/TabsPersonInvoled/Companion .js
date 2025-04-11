import React, { useEffect, useState } from 'react';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../../../utils/StyledComponents';
import { Box, Divider, Grid, MenuItem, Select } from '@mui/material';
import Label from '../../../../../../components/Label/Label';
import { Field, useFormikContext } from 'formik';
import styled from 'styled-components';
import AddSubMaster from '../../../../../../assets/Icons/AddSubMaster.png';
import { useSelector,useDispatch } from 'react-redux';
import {setIncidentRelativeInvolved} from '../../../../../../redux/features/IncidentManagement/reportIncidentSlice'
import { useTranslation } from 'react-i18next';
import { useGetFieldsQuery } from '../../../../../../redux/RTK/moduleDataApi';
import { getIncidentlabel } from '../../../../../../utils/language';
import SearchDropdown from '../../../../../../components/SearchDropdown/SearchDropdown';
import { TextField } from '../../../../../../components/TextField/TextField';
import CompanionTable from './CompanionTable';

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
const Companion = ({  labels, companionTabChecked, id }) => {
  const [fields, setFields] = useState([]);
  const [errors,setErrors]=useState({})
  const dispatch=useDispatch()
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    regionCode,
  } = useSelector((state) => state.auth);
  const {incidentRelativeInvolved,IncidentData,pageLoadData}=useSelector(state=>state.reportIncident) 
  const { i18n } = useTranslation();
  const { values, handleChange, setFieldValue, handleBlur, touched } =
    useFormikContext();

  const [companionData, setCompanionData] = useState(false)

  const { data: fieldsData = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  useEffect(() => {
    const pageFields = fieldsData?.Data?.Menus?.[0]?.Sections?.find(
      (i) => i.SectionName === 'Companion'
    );
    const allFields =
      pageFields?.Regions?.find((region) => region.RegionCode === 'ALL')
        ?.Fields || [];

    setFields(allFields);
  }, [fieldsData, regionCode]);

  const configData = [
    {
      fieldId: 'RI_C_PatientId',
      translationId: 'IM_RI_PatientId',
      component: 'TextField',
      name: 'relativePatientId',
      grid:1,
    },
    {
      fieldId: 'RI_C_PatientName',
      translationId: 'IM_RI_PatientName',
      component: 'TextField',
      name: 'relativePatientName',
      grid:1,
    },
    {
      fieldId: 'RI_C_Department',
      translationId: 'IM_RI_Department',
      component: 'Dropdown',
      name: 'relativedepartmentId',
      options: pageLoadData?.Data?.DepartmentList.map((department) => ({
        text: department.DepartmentName,
        value: department.DepartmentId,
      })),
      grid:2
    },
    {
      fieldId: 'RI_C_PatientRoomNo/Details',
      translationId: 'IM_RI_PatientRoomNo/Details',
      component: 'TextField',
      name: 'relativeRoomNo',
      grid:2
    },
    {
      fieldId: 'RI_C_CompanionName',
      translationId: 'IM_RI_CompanionName',
      component: 'TextField',
      name: 'relativeName',
      grid:3
    },
    {
      fieldId: 'RI_C_CompanionAge',
      translationId: 'IM_RI_CompanionAge',
      component: 'TextField',
      name: 'relativeAge',
      grid:3
    },
    {
      fieldId: 'RI_C_CompanionGender',
      translationId: 'IM_RI_CompanionGender',
      component: 'Dropdown',
      name: 'relativeGender',
      options: pageLoadData?.Data?.GenderList?.map((gender) => ({
        text: gender.Gender,
        value: gender.Gender,
      })),
      grid:3
    },
    {
      fieldId: 'RI_C_Relationship',
      translationId: 'IM_RI_Relationship',
      component: 'TextField',
      name: 'relationship',
      grid:3
    },
    {
      component: 'Table',
    },
  ];

  // useEffect(()=>{
  //   if(IncidentData?.incidentRelativeInvolved?.length>0){
  //     dispatch(setIncidentRelativeInvolved(IncidentData?.incidentRelativeInvolved?.map((item)=>{
  //       return{
  //       rowNo:item.RowNo,
  //       "patientId": item.PatientId || '',
  //       "patientName": item.PatientName || '',
  //       "relativeName": item.RelativeName || '',
  //       "relativeAge": item.RelativeAge || '',
  //       "relativeGender": item.RelativeGender || '',
  //       "departmentId": item.DepartmentId || '',
  //       "roomNo": item.RoomNo || '',
  //       "relationship": item.Relationship || '',
  //       isDelete: item.Isdelete||false
  //       }
  //     })))
  //   }
  //   // if(IncidentData)
  // },[IncidentData])

  const validateFields=(values)=>{
    let validateError={}
    configData?.map((fieldConfig) => {
      const translatedLabel = getIncidentlabel(
        fieldConfig?.translationId,
        labels,
        i18n.language
      )      
      if(!values[fieldConfig.name]&&fieldConfig.component!="Table"){
        validateError[fieldConfig.name]=`${translatedLabel} is required`
      }
    });
    return validateError
  }

  const handleSave = () => {
    try {
      const validateError=validateFields(values)
      if(Object.keys(validateError).length>0){
        setErrors(validateError)
        return false
      }
      const newEntry = {
        "patientId": values?.relativePatientId || '',
        "patientName": values?.relativePatientName || '',
        "relativeName": values?.relativeName || '',
        "relativeAge": values?.relativeAge || '',
        "relativeGender": values?.relativeGender || '',
        "departmentId": values?.relativedepartmentId || '',
        'departmentName':values?.relativedepartmentName||'',
        "roomNo": values?.relativeRoomNo || '',
        "relationship": values?.relationship || '',
        isEditing: false,  // Set isEditing to false when adding new row
        isDelete: false,
        isNewRow:true,
      }
      const updatedRows = incidentRelativeInvolved?.length
        ? incidentRelativeInvolved.map((item, index) => {

          if (item.patientId === values?.relativePatientId) {
            return {
              ...item,
              "patientId": values?.relativePatientId || item.patientId,
              "patientName": values?.relativePatientName || item.patientName,
              "relativeName": values?.relativeName || item.relativeName,
              "relativeAge": values?.relativeAge || item.relativeAge,
              "relativeGender": values?.relativeGender || item.relativeGender,
              "departmentId": values?.relativedepartmentId || item.departmentId,
              'departmentName':values?.relativedepartmentName||item.departmentName,
              "roomNo": values?.relativeRoomNo || item.roomNo,
              "relationship": values?.relationship || item.relationship,
            };
          } else {
            return {
              ...item,
            }
          }
        })
        : [];
      if (!updatedRows.find((item) => item.patientId === values?.relativePatientId)) {
        newEntry['rowNo'] = updatedRows?.length + 1
        updatedRows.push(newEntry);
      }
      dispatch(setIncidentRelativeInvolved(updatedRows))
      setFieldValue('relativePatientId', '')
      setFieldValue('relativePatientName', '')
      setFieldValue('relativeName', '')
      setFieldValue('relativeAge', '')
      setFieldValue('relativeGender', '')
      setFieldValue('relativedepartmentId', '')
      setFieldValue('relativedepartmentName', '')
      setFieldValue('relativeRoomNo', '')
      setFieldValue('relationship', '')
      setErrors({})
      //setCompanionData(true);  // You can use this flag for additional actions, if needed
    } catch (err) {
      console.log("...err", err);

    }
  };
  const getGridColumns=(fieldConfig,gridWindow)=>{
    if(gridWindow==="md" || gridWindow==="lg"){
     if(fieldConfig.grid===1 || fieldConfig.grid===2 )  return 6
     else if(fieldConfig.grid===3) return 3
     else return 12
    } 
  }
  return (
    <FlexContainer 
    flexDirection="column"
     width="100%" 
     margin="10px 0 0 0"
     padding="20px"
     border="1px solid #3F5197"
     >
      <StyledTypography
        fontSize="18px"
        fontWeight="700"
        lineHeight="22px"
        color="rgba(0, 131, 192, 1)"
        whiteSpace={'nowrap'}
      // padding='20px'
      >
        Companion
      </StyledTypography>
      <Divider
        sx={{ marginY: '20px' }}
        border="1px solid rgba(63, 81, 151, 1)"
      />

      <FormContainer>
        <Grid container spacing={2} display={'flex'}>
          {configData?.map((fieldConfig) => {
            const field = fields?.find(
              (i) => i.FieldId === fieldConfig.fieldId
            );
            const translatedLabel = getIncidentlabel(
              fieldConfig?.translationId,
              labels,
              i18n.language
            );

            if (field?.IsShow) {
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
                      disabled={!companionTabChecked}
                      options={[
                        { text: 'Select', value: '' },
                        ...(fieldConfig.options || []),
                      ]}
                      onChange={(event, value) => {
                        if(errors[fieldConfig.name]){
                          delete errors[fieldConfig.name];
                        }
                        if(fieldConfig.name==="relativedepartmentId"){
                          setFieldValue('relativedepartmentName', value?.text);
                        }
                        setFieldValue(fieldConfig.name, value?.value);
                      }}
                      value={
                        fieldConfig?.options?.find(
                          (option) => option.value === values[fieldConfig.name]
                        ) || null
                      }
                    />
                  )}
                  {fieldConfig.component === 'TextField' && (
                    <TextField
                      name={fieldConfig.name}
                      disabled={!companionTabChecked}
                      value={values[fieldConfig.name] || ''}
                      onChange={(e) => {
                        if(errors[fieldConfig.name]){
                          delete errors[fieldConfig.name];
                        }
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
                  )}
                  {errors[fieldConfig.name]  && (
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
      </FormContainer>
      <FlexContainer
        style={{
          marginTop: '20px',
          justifyContent: 'center',
          gap: '10px',
          marginBottom:"20px"
        }}
      >
        <StyledButton
          variant="contained"
          marginTop={'10px'}
          onClick={handleSave}
          disabled={!companionTabChecked}
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
          Save Companion Details
        </StyledButton>
      </FlexContainer>
      <Divider sx={{ marginY: '20px' }} />
      {configData.some((field) => field.component === 'Table') && (
        <CompanionTable 
        department={pageLoadData?.Data?.DepartmentList||[]}
        />
      )}
    </FlexContainer>
  );
};

export default Companion;
