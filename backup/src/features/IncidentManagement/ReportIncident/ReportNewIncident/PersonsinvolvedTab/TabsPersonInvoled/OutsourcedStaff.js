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
import {setIncidentOutStaffInvolved} from '../../../../../../redux/features/IncidentManagement/reportIncidentSlice'
import { useGetFieldsQuery } from '../../../../../../redux/RTK/moduleDataApi';
import { useTranslation } from 'react-i18next';
import SearchDropdown from '../../../../../../components/SearchDropdown/SearchDropdown';
import { getIncidentlabel } from '../../../../../../utils/language';
import { TextField } from '../../../../../../components/TextField/TextField';
import OutSourcedStaffTable from './outSourcedStaffTable';
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
const OutsourcedStaff = ({
  labels,
  outsourcedTabChecked,
  id,
}) => {
  const [fields, setFields] = useState([]);
  const dispatch=useDispatch()
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    regionCode,
  } = useSelector((state) => state.auth);
  const {incidentOutStaffInvolved,IncidentData,pageLoadData}=useSelector(state=>state.reportIncident) 
  const { i18n } = useTranslation();
  const [errors,setErrors]=useState({})
  const [outStaffData, setOutStaffData] = useState(false);
  const [editOutstaffData, setEditOutStaffData] = useState(false);
  const { values, handleChange, setFieldValue,  handleBlur, touched } =
    useFormikContext();

  const { data: fieldsData = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  // const handleFieldChange = (e) => {
  //   handleChange(e); // Call the original handleChange to update Formik state
  // };

  useEffect(() => {
    const pageFields = fieldsData?.Data?.Menus?.[0]?.Sections?.find(
      (i) => i.SectionName === 'Outsourced Staff'
    );
    const allFields =
      pageFields?.Regions?.find((region) => region.RegionCode === 'ALL')
        ?.Fields || [];

    setFields(allFields);
  }, [fieldsData, regionCode]);

  const configData = [
    {
      fieldId: 'RI_OS_OutsourcedStaffId',
      translationId: 'IM_RI_OutsourcedStaffId',
      component: 'TextField',
      name: 'outStaffId',
      grid:1
    },
    {
      fieldId: 'RI_OS_OutsourcedStaffName',
      translationId: 'IM_RI_OutsourcedStaffName',
      component: 'TextField',
      name: 'outStaffName',
      grid:1
    },
    {
      fieldId: 'RI_OS_OutsourcedStaffAge',
      translationId: 'IM_RI_OutsourcedStaffAge',
      component: 'TextField',
      name: 'outStaffAge',
      grid:1
    },
    {
      fieldId: 'RI_OS_OutsourcedStaffGender',
      translationId: 'IM_RI_OutsourcedStaffGender',
      component: 'Dropdown',
      name: 'outStaffGender',
      options: pageLoadData?.Data?.GenderList?.map((gender) => ({
        text: gender.Gender,
        value: gender.Gender,
      })),
      grid:1
    },
    {
      fieldId: 'RI_OS_Department',
      translationId: 'IM_RI_Department',
      component: 'Dropdown',
      name: 'outStaffDepartmentId',
      options: pageLoadData?.Data?.DepartmentList.map((department) => ({
        text: department.DepartmentName,
        value: department.DepartmentId,
      })),
      grid:2
    },
    {
      fieldId: 'RI_OS_CompanyName',
      translationId: 'IM_RI_CompanyName',
      component: 'TextField',
      name: 'companyName',
      grid:2
    },
    {
      fieldId: 'RI_OS_OutsourcedStaffName',
      component: 'Table',
    },
  ];

  // useEffect(()=>{
  //   if(IncidentData?.incidentOutStaffInvolved?.length>0){
  //     dispatch(setIncidentOutStaffInvolved(IncidentData?.incidentOutStaffInvolved.map((item)=>{
  //     return{
  //      rowNo:item.RowNo,
  //     outStaffId: item.OutStaffId || '',
  //     outStaffName: item.OutStaffName || '',
  //     outStaffAge: item.OutStaffAge || '',
  //     outStaffGender: item.OutStaffGender || '',
  //     departmentId: item.DepartmentId || '',
  //     companyName: item.CompanyName || '',
  //     isEditing: false,
  //     isSaved: true,
  //     isDelete: item.IsDelete||false,
  //     }
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
      outStaffId: values?.outStaffId || '',
      outStaffName: values?.outStaffName || '',
      outStaffAge: values?.outStaffAge || '',
      outStaffGender: values?.outStaffGender || '',
      departmentId: values?.outStaffDepartmentId || '',
      departmentName: values?.outStaffDepartmentName || '',
      companyName: values?.companyName || '',
      isEditing: false,
      isSaved: true,
      isDelete: false,
      isNewRow:true,
    };


    const updatedRows = incidentOutStaffInvolved?.length
      ? incidentOutStaffInvolved.map((item) => {
        if (item.outStaffId === values?.outStaffId) {
          return {
            ...item,
            outStaffId: values?.outStaffId || item?.outStaffId,
            outStaffName: values?.outStaffName || item?.outStaffName,
            outStaffAge: values?.outStaffAge || item?.outStaffAge,
            departmentId: values?.outStaffDepartmentId || item?.departmentId,
            departmentName: values?.outStaffDepartmentName || item?.departmentName,
            outStaffGender: values?.outStaffGender || item?.outStaffGender,
            companyName: values?.companyName || item?.companyName,
            isEditing: false,  // Set isEditing to false when adding new row
            isSaved: true,
            isDelete: false
          };
        } else {
          return {
            ...item,
          }
        }
      })
      : [];
    // If no rows are being edited, add a new entry at the beginning
    if (!updatedRows.find((item) => item.outStaffId === values?.outStaffId)) {
      newEntry['rowNo'] = updatedRows?.length + 1
      updatedRows.push(newEntry);
    }    
    dispatch(setIncidentOutStaffInvolved(updatedRows))
    setFieldValue('outStaffId', '')
    setFieldValue('outStaffName', '')
    setFieldValue('outStaffAge', '')
    setFieldValue('outStaffDepartmentId', '')
    setFieldValue('outStaffGender', '')
    setFieldValue('companyName', '')
    setOutStaffData(true);
  };
  const getGridColumns=(fieldConfig,gridWindow)=>{
    if(gridWindow==="md" || gridWindow==="lg"){
     if(fieldConfig.grid===1)  return 3
     else return 6
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
        Outsourced Staff
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
                      disabled={!outsourcedTabChecked}
                      options={[
                        { text: 'Select', value: '' },
                        ...(fieldConfig.options || []),
                      ]}
                      onChange={(event, value) => {
                        if(errors[fieldConfig.name]){
                          delete errors[fieldConfig.name];
                        }
                        if(fieldConfig.name==="outStaffDepartmentId"){
                          setFieldValue('outStaffDepartmentName',value?.text)
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
                      disabled={!outsourcedTabChecked}
                      value={values[fieldConfig.name] || ''}
                      onChange={(e) => {
                        if(errors[fieldConfig.name]){
                          delete errors[fieldConfig.name];
                        }
                        if (
                          fieldConfig.name === 'age' ||
                          fieldConfig.name === 'outsourcedStaffId'
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
          marginBottom:"20px",
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <StyledButton
          variant="contained"
          marginTop={'10px'}
          onClick={handleSave}
          disabled={!outsourcedTabChecked}
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
          Save Outsourced Staff Details
        </StyledButton>
      </FlexContainer>
      <Divider sx={{ marginY: '20px' }} />
      {configData.some((field) => field.component === 'Table') && (
          <OutSourcedStaffTable setEditOutStaffData={setEditOutStaffData} />
        )}
    </FlexContainer>
  );
};

export default OutsourcedStaff;
