import React, { useEffect, useState } from 'react';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../../../utils/StyledComponents';
import { Box, Divider, MenuItem, Select, Grid } from '@mui/material';
import Label from '../../../../../../components/Label/Label';
import { Field, useFormikContext } from 'formik';
import styled from 'styled-components';
import AddSubMaster from '../../../../../../assets/Icons/AddSubMaster.png';
import { useSelector,useDispatch } from 'react-redux';
import {setIncidentVisitorInvolved} from '../../../../../../redux/features/IncidentManagement/reportIncidentSlice'
import { useTranslation } from 'react-i18next';
import { useGetFieldsQuery } from '../../../../../../redux/RTK/moduleDataApi';
import { getIncidentlabel } from '../../../../../../utils/language';
import SearchDropdown from '../../../../../../components/SearchDropdown/SearchDropdown';
import TextArea from '../../../../../../components/TextArea/TextArea';
import { TextField } from '../../../../../../components/TextField/TextField';
import IncidentVisitorTable from './incidentVisitorTable';


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
const Visitor = ({  labels, visitorTabChecked, id }) => {
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
  const {incidentVisitorInvolved,IncidentData,pageLoadData}=useSelector(state=>state.reportIncident) 
  const { i18n } = useTranslation();
  const [openAlertMessage, setOpenAlertMessage] = useState(false)
  const [openVisitortable, setOpenVisitorTable] = useState(false)
  const { values, handleChange, setFieldValue,  handleBlur, touched } =
    useFormikContext();

  const { data: fieldsData = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  useEffect(() => {
    const pageFields = fieldsData?.Data?.Menus?.[0]?.Sections?.find(
      (i) => i.SectionName === 'Visitor'
    );
    const allFields =
      pageFields?.Regions?.find((region) => region.RegionCode === 'ALL')
        ?.Fields || [];

    setFields(allFields);
  }, [fieldsData, regionCode]);

  const configData = [
    {
      fieldId: 'RI_V_VisitorName',
      translationId: 'IM_RI_VisitorName',
      component: 'TextField',
      name: 'visitorName',
      grid:1,
    },
    {
      fieldId: 'RI_V_VisitorAge',
      translationId: 'IM_RI_VisitorAge',
      component: 'TextField',
      name: 'visitorAge',
      grid:1,
    },
    {
      fieldId: 'RI_V_VisitorGender',
      translationId: 'IM_RI_VisitorGender',
      component: 'Dropdown',
      name: 'visitorGender',
      options: pageLoadData?.Data?.GenderList?.map((gender) => ({
        text: gender.Gender,
        value: gender.Gender,
      })),
      grid:1,
    },
    {
      fieldId: 'RI_V_Department',
      translationId: 'IM_RI_Department',
      component: 'Dropdown',
      name: 'visitorDepartmentId',
      options: pageLoadData?.Data?.DepartmentList.map((department) => ({
        text: department.DepartmentName,
        value: department.DepartmentId,
      })),
      grid:1,
    },
    {
      fieldId: 'RI_V_ReasonForVisit',
      translationId: 'IM_RI_ReasonForVisit',
      component: 'Textarea',
      name: 'reasonforVisit',
      grid:2
    },
    {
      component: 'Table',
    },
  ];

  // useEffect(()=>{
  //   if(IncidentData?.incidentVisitorInvolved?.length>0){
  //     dispatch(setIncidentVisitorInvolved(IncidentData?.incidentVisitorInvolved.map((item)=>{
  //       return{
  //          rowNo:item.RowNo,
  //         visitorName: item.VisitorName || '',
  //         visitorAge: item.VisitorAge || '',
  //         visitorGender: item.VisitorGender || '',
  //         departmentId: item.DepartmentId || '',
  //         reasonforVisit: item.ReasonforVisit || '',
  //         isEditing: false,  // Set isEditing to false when adding new row
  //         isSaved: true,
  //         isDelete: item.IsDelete||false
  //       }
  //     })))
  //   }
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
  const handleSaveStaff = () => {
    const validateError=validateFields(values)
    if(Object.keys(validateError).length>0){
      setErrors(validateError)
      return false
    }
    const newEntry = {
      visitorName: values?.visitorName || '',
      visitorAge: values?.visitorAge || '',
      visitorGender: values?.visitorGender || '',
      departmentId: values?.visitorDepartmentId || '',
      departmentName:values?.visitorDepartmentName||'',
      reasonforVisit: values?.reasonforVisit || '',
      isEditing: false,  // Set isEditing to false when adding new row
      isSaved: true,
      isDelete: false
    };

    const updatedRows = incidentVisitorInvolved?.length
      ? incidentVisitorInvolved.map((item) => {

        if (item.rowNo === values?.visitorRowNo) {
          return {
            ...item,
            visitorName: values?.visitorName || item?.visitorName,
            visitorAge: values?.visitorAge || item?.visitorAge,
            visitorGender: values?.visitorGender || item?.visitorGender,
            departmentId: values?.visitorDepartmentId || item?.departmentId,
            departmentName:values?.visitorDepartmentName||item?.departmentName,
            reasonforVisit: values?.reasonforVisit || item?.reasonforVisit,
            isEditing: false,  // Set isEditing to false when adding new row
            isSaved: true,
            isDelete: false,
            isNewRow:true,

          };
        } else {
          return {
            ...item,
          }
        }
      })
      : [];
      
    if (!updatedRows.find((item) => item.rowNo === values?.visitorRowNo)) {
      newEntry['rowNo'] = updatedRows?.length + 1
      updatedRows.push(newEntry);
    }
    dispatch(setIncidentVisitorInvolved(updatedRows))
    setFieldValue('visitorRowNo','')
    setFieldValue('visitorName', '')
    setFieldValue('visitorAge', '')
    setFieldValue('visitorGender', '')
    setFieldValue('visitorDepartmentId', '')
    setFieldValue('reasonforVisit', '')
  };

  const getGridColumns=(fieldConfig,gridWindow)=>{
    if(gridWindow==="md" || gridWindow==="lg"){
     if(fieldConfig.grid===1)  return 3
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
        Visitor
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
                      disabled={!visitorTabChecked}
                      options={[
                        { text: 'Select', value: '' },
                        ...(fieldConfig.options || []),
                      ]}
                      onChange={(event, value) => {
                        if(errors[fieldConfig.name]){
                          delete errors[fieldConfig.name];
                        }
                        setFieldValue(fieldConfig.name, value?.value);
                        setFieldValue('visitorDepartmentName', value?.text);
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
                      value={values[fieldConfig.name] || ''}
                        disabled={!visitorTabChecked}
                      onChange={(e) => {
                        if(errors[fieldConfig.name]){
                          delete errors[fieldConfig.name];
                        }
                        if (
                          fieldConfig.name === 'visitorAge'
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
                  {fieldConfig.component === 'Textarea' && (
                    <TextArea
                      name={fieldConfig.name}
                      value={values[fieldConfig.name] || ''}
                      disabled={!visitorTabChecked}
                      onChange={(event)=>{
                        if(errors[fieldConfig.name]){
                          delete errors[fieldConfig.name];
                        }
                        handleChange(event)
                      } }
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
          marginBottom:"20px",
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <StyledButton
          variant="contained"
          marginTop={'10px'}
          onClick={handleSaveStaff}
          disabled={!visitorTabChecked}
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
          Save vistor Details
        </StyledButton>
      </FlexContainer>
      <Divider sx={{ marginY: '20px' }} />
      {configData.some((field) => field.component === 'Table') && (
        <IncidentVisitorTable />
      )}
    </FlexContainer>
  );
};

export default Visitor;
