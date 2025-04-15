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
  Table,
  // TextField
} from '@mui/material';
import Label from '../../../../../../components/Label/Label';
import { Field, useFormikContext } from 'formik';
import styled from 'styled-components';
import AddSubMaster from '../../../../../../assets/Icons/AddSubMaster.png';
import { useGetFieldsQuery } from '../../../../../../redux/RTK/moduleDataApi';
import { useSelector, useDispatch } from 'react-redux';
import { setIncidentStaffInvolved } from '../../../../../../redux/features/IncidentManagement/reportIncidentSlice'
import { getIncidentlabel } from '../../../../../../utils/language';
import SearchDropdown from '../../../../../../components/SearchDropdown/SearchDropdown';
import { useTranslation } from 'react-i18next';
import StaffDetailsList from '../../IncidentCategoryTab/StaffDetailsList';
import StaffDetailsListPopup from './StaffDetailsListPopup';
import Search from '../../../../../../assets/Icons/Search.png';
import StaffTable from './StaffTable';
import { TextField } from '../../../../../../components/TextField/TextField';

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
const Staff = ({ pageLoadData, labels, staffTabChecked, id }) => {
  const [fields, setFields] = useState([]);
  const dispatch = useDispatch()
  const [openStaffModal, setOpenStaffModal] = useState(false);
  const [StaffDataTable, setStaffDataTable] = useState(false)
  const [showStaffTable, setShowStaffTable] = useState(StaffDataTable);
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    regionCode,
    isSuperAdmin,
  } = useSelector((state) => state.auth);
  const { incidentStaffInvolved,staffDetails ,IncidentData} = useSelector(state => state.reportIncident)
  const { i18n } = useTranslation();
  const [errors,setErrors]=useState({})
  const { values, handleChange, setFieldValue, setValues, handleBlur, touched } =
    useFormikContext();
  // const isPhysicianN

  const { data: fieldsData = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  useEffect(() => {
    const pageFields = fieldsData?.Data?.Menus?.[0]?.Sections?.find(
      (i) => i.SectionName === 'Staff'
    );
    const allFields =
      pageFields?.Regions?.find((region) => region.RegionCode === 'ALL')
        ?.Fields || [];

    setFields(allFields);
  }, [fieldsData, regionCode]);

  const configData = [
    {
      fieldId: 'RI_S_StaffName',
      translationId: 'IM_RI_StaffName',
      component: 'TextField',
      name: 'staffName',
      maxLength: 20,
    },
    {
      fieldId: 'RI_S_Facility',
      translationId: 'IM_RI_FacilityName',
      component: 'TextField',
      name: 'facility'
    },
    {
      fieldId: 'RI_S_EmployeeId',
      translationId: 'IM_RI_EmployeeId',
      component: 'TextField',
      name: 'employeeId',
    },

    {
      fieldId: 'RI_S_Department',
      translationId: 'IM_RI_Department',
      component: 'TextField',
      name: 'department',
    },
    {
      fieldId: 'RI_S_Designation',
      translationId: 'IM_RI_Designation',
      component: 'TextField',
      name: 'designation',
    },

    {
      fieldId: 'RI_S_StaffCategory',
      translationId: 'IM_RI_StaffCategory',
      component: 'TextField',
      name: 'staffCategory',
    },
    {
      component: 'Table',
    },
  ];

  // useEffect(() => {
  //   if(IncidentData?.incidentStaffInvolved?.length>0){
  //     dispatch(setIncidentStaffInvolved(IncidentData?.incidentStaffInvolved.map((item)=>{
  //       const filterData = staffDetails?.find(staff => staff.UserId === item.StaffId)        
  //       //  const filterData = staffDetails?.find(staff => staff.UserId === 243)        
  //       return{ 
  //         staffId: filterData?.UserId || '',
  //         employeeId: filterData?.EmployeeId || '',
  //         staffName: filterData?.StaffName || '',
  //         department: filterData?.Department || '',
  //         designation: filterData?.PrimaryDesignation || '',
  //         staffCategory: filterData?.StaffCategory || '',
  //         isDelete: item.IsDelete||false
  //       }
  //     })))
  //   }
  // }, [IncidentData,staffDetails]);

  const handleStaffModal = () => {
    setOpenStaffModal(true);
  };

  const toggleStaffTable = () => {
    setShowStaffTable((prev) => !prev);
  };

  const handleSelectRow = (row) => {
    setFieldValue('staffName', row?.StaffName);
    setFieldValue('department', row?.Department);
    setFieldValue('staffId', row?.UserId);
    setFieldValue('employeeId', row?.EmployeeId);
    setFieldValue('facility', row?.Facility);
    setFieldValue('designation', row?.PrimaryDesignation);
    setFieldValue('staffCategory', row?.StaffCategory);
    setErrors({})
  };

  const validationError=(values)=>{
    let validateError={}
    configData?.map((fieldConfig) => {
      const field = fields?.find((i) => i.FieldId === fieldConfig.fieldId);
      const translatedLabel = getIncidentlabel(
        fieldConfig?.translationId,
        labels,
        i18n.language
      )      
      if(!values[fieldConfig.name] &&fieldConfig.component!="Table"){
        validateError[fieldConfig.name]=`${translatedLabel} is required`
      }
    });

    return validateError
  }

  const handleSaveStaff = () => {

    const validateError=validationError(values)    
    if(Object.keys(validateError).length>0){
      setErrors(validateError)
      return false
    }else{
    const newEntry = {
      staffId: values?.staffId || '',
      employeeId: values?.employeeId || '',
      staffName: values?.staffName || '',
      department: values?.department || '',
      designation: values?.designation || '',
      staffCategory: values?.staffCategory || '',
      isEditing: false,  // Set isEditing to false when adding new row
      isSaved: true,
      isDelete: false
    };
    // const personInvolved=[];
    // const index=values?.incidentStaffInvolved?.findIndex((staff)=>staff.staffId===values?.staffId) 
    // if(index!=-1){
    //   values.incidentStaffInvolved[index]={ ...values?.incidentStaffInvolved[index], ...newEntry }
    // }else{
    //   values?.incidentStaffInvolved.push(newEntry)
    // }
    const updatedRows = incidentStaffInvolved?.length
      ? incidentStaffInvolved.map((item) => {
        if (item.staffId === values?.staffId) {
          return {
            ...item,
            staffId: values?.staffId || item?.staffId,
            employeeId: values?.employeeId || item?.employeeId,
            staffName: values?.staffName || item?.staffName,
            department: values?.department || item?.department,
            designation: values?.designation || item?.designation,
            staffCategory: values?.staffCategory || item?.staffCategory,
            isEditing: false,  // Set isEditing to false when adding new row
            isSaved: true,
            isDelete: false,
            isNewRow:true,

          };
        } else {
          return item;
        }
      })
      : []; // Return empty array if there are no existing entries

    // If `incidentPatientInvolved` is empty or no updates are made, push a new object
    if (!updatedRows.find((item) => item.staffId === values?.staffId)) {
      newEntry['rowNo'] = updatedRows?.length + 1
      updatedRows.push(newEntry);
    }
    dispatch(setIncidentStaffInvolved(updatedRows))
    setFieldValue('facility', '');
    setFieldValue('employeeId', '');
    setFieldValue('staffName', '');
    setFieldValue('department', '');
    setFieldValue('designation', '');
    setFieldValue('staffCategory', '');
    // setStaffDataTable(true); 
  }
  };
  
  // useEffect(() => {
  //   if (IncidentData?.incidentActionTaken?.length > 0) {
  //     setFieldValue((prevValues) => ({
  //       ...prevValues,
  //       incidentActionTaken: IncidentData.incidentActionTaken.map((item) => ({
  //         immediateActionTaken: item.immediateActionTaken || '',
  //         responsibleStaffName: item.responsibleStaffName || '',
  //         department: item.department || '',
  //         designation: item.designation || '',
  //         isEditing: false, // Ensure editing is disabled by default
  //       })),
  //     }));
  //   }
  //   // Code to run on mount and updates
  // }, [IncidentData]);



  return (
    <FlexContainer border="1px solid #3F5197" flexDirection="column" width="100%" padding="20px" margin="10px 0 0 0">
      <StyledTypography
        fontSize="18px"
        fontWeight="700"
        lineHeight="22px"
        color="rgba(0, 131, 192, 1)"
        whiteSpace={'nowrap'}
      // textAlign={'center'}
      // padding='20px'
      >
        Staff
      </StyledTypography>
      <Divider
        sx={{ marginY: '20px' }}
        border="1px solid rgba(63, 81, 151, 1)"
      />
      <Grid container spacing={2} display={'flex'}>
        {configData?.map((fieldConfig) => {
          const field = fields?.find((i) => i.FieldId === fieldConfig.fieldId);
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
                md={4}
                lg={4}
                key={field.fieldId}
              >
                <Label value={translatedLabel} isRequired={field.IsMandatory} />

                {fieldConfig.component === 'Dropdown' && (
                  <SearchDropdown
                    name={fieldConfig.name}
                    disabled={staffTabChecked}
                    options={[
                      { text: 'Select', value: '' },
                      ...(fieldConfig.options || []),
                    ]}
                    onChange={(event, value) => {
                      setFieldValue(fieldConfig.name, value?.value);
                    }}
                    value={
                      fieldConfig?.options?.find(
                        (option) => option.value === values[fieldConfig.name]
                      ) || null
                    }
                  />
                )}

                {fieldConfig.name === 'staffName' ? (
                  <>  
                  <TextField    
                    name={fieldConfig.name}
                    value={values[fieldConfig.name]}
                    // sx={{ width: '300px' }}
                    disabled={true}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="start">
                          <StyledImage
                            src={Search}
                            alt="Search Icon"
                            onClick={handleStaffModal}
                          />
                        </InputAdornment>
                      )
                    }}
                  />
                 
                  </>
                ) : (
                  <TextField     
                    name={fieldConfig.name}
                    value={values[fieldConfig.name]}
                    // sx={{ width: '300px' }} 
                    disabled
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
      <FlexContainer
        style={{
          marginTop: '20px',
          marginBottom: '20px',
          justifyContent: 'center',
          gap: '10px',
        }}
      >
        <StyledButton
          variant="contained"
          marginTop={'10px'}
          disabled={!staffTabChecked}
          onClick={handleSaveStaff}
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
          Save Staff Details
        </StyledButton>
        {/* {StaffDataTable&&(
        <StyledButton onClick={toggleStaffTable}>
        {showStaffTable ? "Hide Staff Table" : "Show Staff Table"}
      </StyledButton>)} */}
      </FlexContainer>
      {
        configData.some((field) => field.component === 'Table') &&
        <StaffTable IncidentData={IncidentData} />
      }
      {/* <Divider sx={{ marginY: '20px' }} /> */}
      {/* {((configData.some((field) => field.component === 'Table') )||id)&&(
     
)} */}
      <StaffDetailsListPopup
        openStaffModal={openStaffModal}
        IncidentData={IncidentData}
        setOpenStaffModal={setOpenStaffModal}
        handleSelectRow={handleSelectRow}
      />
    </FlexContainer>
  );
};

export default Staff;
