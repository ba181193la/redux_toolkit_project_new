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
import {setIncidentOthersInvolved} from '../../../../../../redux/features/IncidentManagement/reportIncidentSlice'
import { useGetFieldsQuery } from '../../../../../../redux/RTK/moduleDataApi';
import { useTranslation } from 'react-i18next';
import { getIncidentlabel } from '../../../../../../utils/language';
import SearchDropdown from '../../../../../../components/SearchDropdown/SearchDropdown';
import TextArea from '../../../../../../components/TextArea/TextArea';
import { TextField } from '../../../../../../components/TextField/TextField';
import OutSourcedStaffTable from './outSourcedStaffTable';
import OthersTable from './OthersTable';
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
const Others = ({  labels, othersTabChecked, id }) => {
  const [fields, setFields] = useState([]);
  const dispatch=useDispatch()
  const [errors,setErrors]=useState({})
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    regionCode,
  } = useSelector((state) => state.auth);
  const {incidentOthersInvolved,IncidentData,pageLoadData}=useSelector(state=>state.reportIncident) 
  const { i18n } = useTranslation();
  const [othersData, setOthersData] = useState(false)
  const [editOthersData, setEditOthersData] = useState(false)
  const { values, handleChange, setFieldValue,  handleBlur, touched } =
    useFormikContext();

  const { data: fieldsData = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  useEffect(() => {
    const pageFields = fieldsData?.Data?.Menus?.[0]?.Sections?.find(
      (i) => i.SectionName === 'Others'
    );
    const allFields =
      pageFields?.Regions?.find((region) => region.RegionCode === 'ALL')
        ?.Fields || [];

    setFields(allFields);
  }, [fieldsData, regionCode]);

  const configData = [
    {
      fieldId: 'RI_O_OtherName',
      translationId: 'IM_RI_OtherName',
      component: 'TextField',
      name: 'othersName',
      grid:1
    },
    {
      fieldId: 'RI_O_OtherAge',
      translationId: 'IM_RI_OtherAge',
      component: 'TextField',
      name: 'othersAge',
      grid:1
    },
    {
      fieldId: 'RI_O_OtherGender',
      translationId: 'IM_RI_OtherGender',
      component: 'Dropdown',
      name: 'othersGender',
      options: pageLoadData?.Data?.GenderList?.map((gender) => ({
        text: gender.Gender,
        value: gender.Gender,
      })),
      grid:1
    },
    {
      fieldId: 'RI_O_Details',
      translationId: 'IM_RI_Details',
      component: 'Textarea',
      name: 'othersDetails',
      grid:2
    },
    {
      fieldId: 'RI_OS_OtherName',
      component: 'Table',
    },
  ];

  // useEffect(()=>{
  //   if(IncidentData?.incidentOthersInvolved?.length>0){
  //     dispatch(setIncidentOthersInvolved(IncidentData?.incidentOthersInvolved.map((item)=>{
  //       return{
  //         rowNo:item.RowNo,
  //         name: item.Name || '',
  //         age: item.Age || '',
  //         gender: item.Gender || '',
  //         details: item.Details || '',
  //         isDelete: item.Isdelete||false
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
  const handleSave = () => {
    const validateError=validateFields(values)
    if(Object.keys(validateError).length>0){
      setErrors(validateError)
      return false
    }
    const newEntry = {
      name: values?.othersName || '',
      age: values?.othersAge || '',
      gender: values?.othersGender || '',
      details: values?.othersDetails || '',
      isDelete:false,
      isNewRow:true
    };


    // Check if any row is being edited
    const updatedRows = incidentOthersInvolved?.length ? incidentOthersInvolved?.map((item) => {
      if (item.rowNo === values?.othersRowNo) {
        return {
          ...item,
          name: values?.othersName || item.name,
          age: values?.othersAge || item.age,
          gender: values?.othersGender || item.gender,
          details: values?.othersDetails || item.details,
        };
      }
       else {
          return {
            ...item,
          }
        }
    }) : [];

    // If no rows are being edited, add a new entry at the beginning
    if (!updatedRows.find((item) => item.rowNo === values?.othersRowNo)) {
      newEntry['rowNo'] = updatedRows?.length + 1
      updatedRows.push(newEntry);
    }
    dispatch(setIncidentOthersInvolved(updatedRows))
    // Update the form values
    setFieldValue('incidentOthersInvolved', updatedRows);
    setFieldValue('othersRowNo','')
    setFieldValue('othersName', '');
    setFieldValue('othersAge', '');
    setFieldValue('othersGender', '');
    setFieldValue('othersDetails', '');
    setOthersData(true);
  };
  const getGridColumns=(fieldConfig,gridWindow)=>{
    if(gridWindow==="md" || gridWindow==="lg"){
     if(fieldConfig.grid===1)  return 4
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
        Others
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
                      disabled={!othersTabChecked}
                      options={[
                        { text: 'Select', value: '' },
                        ...(fieldConfig.options || []),
                      ]}
                      onChange={(event, value) => {
                        if(errors[fieldConfig.name]){
                          delete errors[fieldConfig.name];
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
                      disabled={!othersTabChecked}
                      value={values[fieldConfig.name] || ''}
                      onChange={(e) => {
                        if(errors[fieldConfig.name]){
                          delete errors[fieldConfig.name];
                        }
                        if (
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
                  {fieldConfig.component === 'Textarea' && (
                    <TextArea
                      name={fieldConfig.name}
                      disabled={!othersTabChecked}
                      value={values[fieldConfig.name] || ''}
                      onChange={(e)=>{
                        if(errors[fieldConfig.name]){
                          delete errors[fieldConfig.name];
                        }
                        handleChange(e)
                      }}
                    />
                  )}
                  {errors[fieldConfig.name] && (
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
          disabled={!othersTabChecked}
          onClick={handleSave}
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
          Save Others Detail
        </StyledButton>
      </FlexContainer>
      <Divider sx={{ marginY: '20px' }} />
      {configData.some((field) => field.component === 'Table') && (
        <OthersTable setEditOthersData={setEditOthersData} />
      )}
    </FlexContainer>
  );
};

export default Others;
