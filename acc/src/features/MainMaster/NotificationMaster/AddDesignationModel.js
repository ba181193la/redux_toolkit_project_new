import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloseIcon from '../../../assets/Icons/CloseIcon.png';
import {
  CommonStyledButton,
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import Label from '../../../components/Label/Label';
import Dropdown from '../../../components/Dropdown/Dropdown';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useUpdateRoleCategoryMappingMutation } from '../../../redux/RTK/applicationRoleApi';
import {
  useGetAllDesignationQuery,
  useGetAllFacilityQuery,
} from '../../../redux/RTK/notificationMasterApi';
import DesignationPopupTable from './DesignationPopupTable';
import { useGetLabelsQuery } from '../../../redux/RTK/moduleDataApi';
import DoNotDisturbIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';
import { getlabel } from '../../../utils/language';

const popupTableColumns = [
  {
    id: 'Department',
    translationId: 'MM_NM_Department',
    fieldId: 'NM_P_Department',
    isSelected: true,
  },
  {
    id: 'DesignationName',
    translationId: 'MM_NM_Designation',
    fieldId: 'NM_P_Designation',
    isSelected: true,
  },
];

const AddDesignationModel = ({
  open,
  onClose,
  setIsDesignationModel,
  setDesignationFacilityId,
  designationFacilityId,
}) => {
  const validationSchema = Yup.object().shape({
    facility: Yup.string().required('Facility is required'),
    staffCategory: Yup.string().required('Staff Category is required'),
    applicationRole: Yup.array()
      .of(Yup.string())
      .min(1, 'At least one application role must be selected')
      .required('Application Role is required'),
  });
  const { t, i18n } = useTranslation();

  const { selectedMenu, userDetails, selectedModuleId, selectedFacility,roleFacilities,isSuperAdmin } =
    useSelector((state) => state.auth);
    const { pageSize, pageIndex } = useSelector(
      (state) => state?.notificationMaster?.filters
    );
  const [selectedFacilityId, setSelectedFacilityId] = useState('');
  const [facilityDesignations, setFacilityDesignations] = useState([]);
  const [designationDataTotalRecords, setDesignationDataTotalRecords] = useState({ TotalRecords: [] });
  const [triggerUpdateRoleCategoryMapping] =
    useUpdateRoleCategoryMappingMutation();
  const { data: labels = [] } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  const fieldConfig =  
    {
      fieldId: 'NM_P_Facility',
      translationId: 'MM_NM_Facility',
      component: 'Dropdown',
      name: 'facility',
      options: [
        ...(userDetails?.ApplicableFacilities?.filter(
          (facility) => {
            if (!facility.IsActive) return false;
            if (isSuperAdmin) return true;
            const facilityItem = roleFacilities
              ?.find(
                (role) =>
                  role.FacilityId === facility.FacilityId
              )
              ?.Menu?.find(
                (MenuItem) =>
                  MenuItem.MenuId === selectedMenu?.id
              );
            return facilityItem?.IsAdd;
          }
        ).map((facility) => ({
          text: facility.FacilityName,
          value: facility.FacilityId,
        })) || []),
      ]
    }
   
  const { data: designationData = [], isFetching: designationFetching } =
    useGetAllDesignationQuery(
      {
        payload: {
          pageIndex: pageIndex + 1,
          pageSize: pageSize,
          headerFacilityId: selectedFacilityId,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
        },
      },
      {
        skip: !selectedFacilityId || !selectedModuleId || !selectedMenu?.id,
      }
    );
    
  useEffect(() => {
    if (selectedFacilityId) {
      setFacilityDesignations(designationData?.Records || []);
      setDesignationDataTotalRecords(designationData?.TotalRecords || [])
    }
  }, [designationData?.Records, selectedFacilityId]);

  const handleFacilityChange = (facilityId) => {
    setSelectedFacilityId(facilityId);
    setDesignationFacilityId(facilityId);
  };

  const handleOnClose = () => {
    onClose();
    setFacilityDesignations([]);
    setSelectedFacilityId('');
    setDesignationDataTotalRecords({ TotalRecords: [] });
  };

  const handleSubmit = async (values, { resetForm }) => {
    const roleIdsString = Array.isArray(selectedIds)
      ? selectedIds.join(',')
      : '';
    await triggerUpdateRoleCategoryMapping({
      payload: {
        roleCategoryMappingId: 0,
        roleId: roleIdsString,
        staffCategoryId: selectedStaffCategoryId,
        facilityId: selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      },
    }).unwrap();
    resetForm();
    navigate(-1);
  };
  return (
    <Dialog
      open={open}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      onClose={handleOnClose}
      PaperProps={{
        sx: {
          width: '900px',
          maxWidth: 'none',
          borderRadius: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <Box>
        <DialogTitle
          sx={{
            backgroundColor: '#205475',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            height: 40,
            alignItems: 'center',
            padding: '0 8px',
          }}
        >
          <StyledTypography
            fontSize="18px"
            fontWeight="300"
            lineHeight="18px"
            padding="0 12px"
            color="#fff"
          >
            {t('Designation')}
          </StyledTypography>
          <IconButton
            onClick={handleOnClose}
            sx={{
              color: '#fff',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: 'transform 0.3s ease',
                backgroundColor: 'rgba(15, 108, 189, 0.2)',
              },
            }}
          >
            <Tooltip title="Close" arrow>
              <StyledImage src={CloseIcon} alt="Close Icon" />
            </Tooltip>
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ border: '4px solid #205475' }}>
          <Formik
            initialValues={{
              staffCategory: '',
              applicationRole: [],
              facility: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, errors, touched, values }) => (
              <Form>
                <Box
                  sx={{
                    marginBottom: 2,
                    display: 'block',
                    alignItems: 'center',
                  }}
                >
                  <FlexContainer padding="20px 20px 20px 0" alignItems="center">
                    <FlexContainer width="50%" gap="0px" alignItems="center">
                      <Box>
                        <Label
                          value={getlabel(
                            fieldConfig?.translationId,
                            labels,
                            i18n.language
                          )}
                          isRequired={true}
                        />
                      </Box>
                      <Box sx={{ padding: '0 0 0 20px', width: '60%' }}>
                        {fieldConfig.component === 'Dropdown' &&
                          (
                            <SearchDropdown
                          disableClearable={true}
                           name={fieldConfig.name}
                           options={[
                          { text: 'Select', value: '' },
                          ...(fieldConfig.options || []),
                        ]}
                          required={true}
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
                            <TextField
                              {...params}
                              variant="outlined"
                              placeholder="Select"
                            />
                          )}
                          ListboxProps={{
                            sx: {
                              '& .MuiAutocomplete-option': {
                                fontSize: '14px',
                                minHeight: '30px',
                                display: 'flex',
                                alignItems: 'center',
                              },
                            },
                          }}
                          value={
                            userDetails?.ApplicableFacilities?.map(
                              (facility) => ({
                                text: facility.FacilityName,
                                value: facility.FacilityId,
                              })
                            )?.find(
                              (option) => option.value === values['facility']
                            ) || null
                          }
                          onChange={(event, selectFiledValue) => {
                            setFieldValue('facility', selectFiledValue?.value);
                            handleFacilityChange(
                              selectFiledValue ? selectFiledValue.value : null
                            );
                          }}
                        /> 
                          )}
                        {errors.facility && touched.facility && (
                          <FlexContainer
                            style={{ color: 'red', fontSize: '11px' }}
                          >
                            {errors.facility}
                          </FlexContainer>
                        )}
                      </Box>
                    </FlexContainer>
                  </FlexContainer>
                  <DesignationPopupTable
                    TotalRecords={designationDataTotalRecords || 0}
                    rowsData={facilityDesignations}
                    designationFetching={designationFetching}
                    columns={popupTableColumns}
                    labels={labels}
                    setFacilityDesignations={setFacilityDesignations}
                    setIsDesignationModel={setIsDesignationModel}
                    setSelectedFacilityId={setSelectedFacilityId}
                    selectedFacilityId={selectedFacilityId}
                    setDesignationFacilityId={setDesignationFacilityId}
                    designationFacilityId={designationFacilityId}
                    setDesignationDataTotalRecords={
                      setDesignationDataTotalRecords
                    }
                  />
                </Box>
                <FlexContainer
                  gap="16px"
                  justifyContent="center"
                  padding="0px 15px 15px 0px"
                >
                  <CommonStyledButton
                    gap="8px"
                    variant="outlined"
                    startIcon={<StyledImage src={DoNotDisturbIcon} />}
                    onClick={handleOnClose}
                  >
                    <StyledTypography marginTop="1px">
                      {t('Cancel')}
                    </StyledTypography>
                  </CommonStyledButton>
                </FlexContainer>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default AddDesignationModel;
