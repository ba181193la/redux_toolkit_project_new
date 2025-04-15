import {
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Autocomplete,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import Label from '../../../../components/Label/Label';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  useAddDepartmentGroupMutation,
  useGetDepartmentGroupDataByIdQuery,
  useUpdateDepartmentGroupMutation,
  useGetDepartmentPageLoadDataQuery,
} from '../../../../redux/RTK/departmentMasterApi';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import { getlabel } from '../../../../utils/language';
import { useTranslation } from 'react-i18next';
import { showToastAlert } from '../../../../utils/SweetAlert';
import { useGetFieldsQuery } from '../../../../redux/RTK/moduleDataApi';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';

const AddEditDepartmentGroup = ({
  showDepartmentGroupModal,
  selectedDepartmentGroupId,
  setSelectedDepartmentGroupId,
  setShowDepartmentGroupModal,
  labels,
  refetch,
}) => {
  //* Hooks Declaration
  const { i18n, t } = useTranslation();

  //* Selectors
  const {
    selectedModuleId,
    userDetails,
    selectedMenu,
    selectedFacility,
    isSuperAdmin,
    roleFacilities,
  } = useSelector((state) => state.auth);

  //* State variables
  const [newDepartmentGroup, setNewDepartmentGroup] = useState({
    departmentGroupId: 0,
    facility: '',
    departmentGroupName: '',
    departments: '',
  });
  const [facilityId, setFacilityId] = useState('');

  //* RTK Queries
  const [triggerAddDepartmentGroup, { isLoading: isAdding }] =
    useAddDepartmentGroupMutation();
  const [triggerUpdateDeprtmentGroup, { isLoading: isUpdating }] =
    useUpdateDepartmentGroupMutation();

  //* Get page load data

  const { data: fields = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  const pageFields = fields?.Data?.Sections?.find(
    (section) => section?.SectionName === 'Page'
  )?.Fields;

  const { data: pageLoadData, refetch: refetchDepartmentGroupData } =
    useGetDepartmentPageLoadDataQuery({
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
      headerFacilityId: facilityId || selectedFacility?.id,
    });

  //* Department group modal Validation
  const departmentGroupValidation = Yup.object().shape({
    facility: Yup.number().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'DM_P_Facility')?.IsMandatory ===
        true,
      then: (schema) =>
        schema
          .required(
            `${getlabel('MM_DM_Facility', labels, i18n.language)} ${t('IsRequired')}`
          )
          .test(
            'is-zero',
            `${getlabel('MM_DM_Facility', labels, i18n.language)} ${t('IsRequired')}`,
            (value) => {
              return value !== 0;
            }
          ),
      otherwise: (schema) => schema.notRequired(),
    }),

    departmentGroupName: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'DM_P_DepartmentUnitGroup')
          ?.IsMandatory === true,
      then: (schema) =>
        schema.required(
          `${getlabel('MM_DM_DepartmentGroup', labels, i18n.language)} ${t('IsRequired')}`
        ),
      otherwise: (schema) => schema.notRequired(),
    }),
    departments: Yup.array().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'DM_P_DepartmentUnit')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel('MM_DM_Department', labels, i18n.language)} ${t('IsRequired')}`
          )
          .min(
            1,
            `${getlabel('MM_DM_Department', labels, i18n.language)} ${t('IsRequired')}`
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  //* Get Designation By Id
  const { data: deptRecords } = useGetDepartmentGroupDataByIdQuery(
    {
      departmentGroupId: selectedDepartmentGroupId,
      loginUserId: userDetails?.UserId,
      menuId: selectedMenu?.id,
    },
    { skip: !selectedDepartmentGroupId }
  );

  useEffect(() => {
    if (deptRecords?.Data && selectedDepartmentGroupId) {
      setNewDepartmentGroup({
        departmentGroupId: deptRecords?.Data?.DepartmentGroupId,
        facility: deptRecords?.Data?.FacilityId,
        departmentGroupName: deptRecords?.Data?.DepartmentGroupName,
        departments: deptRecords?.Data?.DepartmentIds.split(','),
      });
    }
  }, [deptRecords]);

  //* Submit Department Group Modal
  const submitDepartmentGroup = async (values) => {
    try {
      let response;
      if (newDepartmentGroup?.departmentGroupId === 0) {
        response = await triggerAddDepartmentGroup({
          payload: {
            departmentGroupName: values?.departmentGroupName,
            facilityId: values?.facility,
            departmentIds: values?.departments
              ? values?.departments?.join(',')
              : '',
            moduleId: selectedModuleId,
            menuId: selectedMenu.id,
            loginUserId: userDetails?.UserId,
            headerFacilityId: selectedFacility?.id,
          },
        }).unwrap();
      } else if (newDepartmentGroup?.departmentGroupId) {
        response = await triggerUpdateDeprtmentGroup({
          payload: {
            departmentGroupId: values?.departmentGroupId,
            departmentGroupName: values?.departmentGroupName,
            facilityId: values?.facility,
            departmentIds: values?.departments
              ? values?.departments?.join(',')
              : '',
            moduleId: selectedModuleId,
            menuId: selectedMenu.id,
            loginUserId: userDetails?.UserId,
            headerFacilityId: selectedFacility?.id,
          },
        }).unwrap();
        refetchDepartmentGroupData();
      }
      if (response && response.Message !== 'Record Already Exist') {
        showToastAlert({
          type: 'custom_success',
          text: response.Message,
        });
      }
      if (response && response.Message === 'Record Already Exist') {
        showToastAlert({
          type: 'custom_info',
          text: response.Message,
        });
      }
      setNewDepartmentGroup({
        departmentGroupId: 0,
        facility: '',
        departmentGroupName: '',
        departments: '',
      });
      refetch();
      setSelectedDepartmentGroupId(null);
      setShowDepartmentGroupModal(false);
    } catch (error) {
      console.error('Failed to add/update department group', error);
    }
  };

  //* Cancel department group modal
  const handleOnCancel = () => {
    setNewDepartmentGroup({
      departmentGroupId: 0,
      facility: '',
      departmentGroupName: '',
      departments: '',
    });
    setSelectedDepartmentGroupId(null);
    setShowDepartmentGroupModal(false);
  };

  return (
    <Dialog
      open={showDepartmentGroupModal}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      maxWidth={'sm'}
      fullWidth={true}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#205475',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
        }}
      >
        <StyledTypography
          fontSize="20px"
          fontWeight="300"
          lineHeight="18px"
          color="#fff"
        >
          {getlabel('MM_DM_DepartmentGroup', labels, i18n.language)}
        </StyledTypography>
        <IconButton
          onClick={handleOnCancel}
          style={{
            padding: '0.7rem',
          }}
          sx={{
            color: '#fff',
            '&:hover': {
              transform: 'scale(1.05)',
              backgroundColor: 'color(srgb 0.75 0.74 0.74 / 0.15)',
            },
          }}
        >
          <img src={CloseIcon} alt="Close Icon" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FlexContainer flexWrap="wrap">
          <Formik
            enableReinitialize={true}
            initialValues={newDepartmentGroup}
            validateOnBlur={false}
            validationSchema={departmentGroupValidation}
            onSubmit={(values) => submitDepartmentGroup(values)}
          >
            {({ values, errors, handleSubmit, resetForm, setFieldValue }) => (
              <Form style={{ width: '100%' }}>
                {pageFields?.find((x) => x.FieldId === 'DM_P_Facility')
                  ?.IsShow && (
                  <Grid
                    container
                    display={'flex'}
                    width="100%"
                    flexWrap={'wrap'}
                    justifyContent={'space-between'}
                    item
                    xs={12}
                    spacing={2}
                    alignItems={'center'}
                    marginTop={'1rem'}
                  >
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <Label
                        value={getlabel(
                          'MM_DM_Facility',
                          labels,
                          i18n.language
                        )}
                        isRequired={
                          pageFields?.find((x) => x.FieldId === 'DM_P_Facility')
                            ?.IsMandatory
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                      <SearchDropdown
                        disableClearable={true}
                        name={'facility'}
                        disabled={selectedDepartmentGroupId}
                        options={[
                          { text: 'Select', value: '' },
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
                        ]}
                        getOptionLabel={(option) => option.text}
                        dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
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
                              fontSize: '13px',
                              minHeight: '30px',
                              display: 'flex',
                              alignItems: 'center',
                            },
                          },
                        }}
                        value={
                          pageLoadData?.Data?.FacilityList?.filter(
                            (facility) => {
                              if (isSuperAdmin) return true;
                              const facilityItem = roleFacilities?.find(
                                (role) =>
                                  role.FacilityId === facility.FacilityId
                              )?.Menu?.[selectedMenu?.id];
                              return facilityItem?.IsAdd;
                            }
                          )
                            .map((facility) => ({
                              text: facility.FacilityName,
                              value: facility.FacilityId,
                            }))
                            ?.find(
                              (option) => option.value === values['facility']
                            ) || null
                        }
                        onChange={(event, value) => {
                          setFieldValue('facility', value?.value);
                          setFieldValue('departments', '');
                          setFacilityId(value?.value);
                        }}
                      />
                      <ErrorMessage
                        name="facility"
                        component="div"
                        style={{
                          color: 'red',
                          fontSize: '12px',
                          marginTop: '4px',
                        }}
                      />
                    </Grid>
                  </Grid>
                )}

                {pageFields?.find(
                  (x) => x.FieldId === 'DM_P_DepartmentUnitGroup'
                )?.IsShow && (
                  <Grid
                    container
                    display={'flex'}
                    width="100%"
                    flexWrap={'wrap'}
                    justifyContent={'space-between'}
                    item
                    xs={12}
                    spacing={2}
                    alignItems={'center'}
                    marginTop={'0.2rem'}
                  >
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <Label
                        value={getlabel(
                          'MM_DM_DepartmentGroup',
                          labels,
                          i18n.language
                        )}
                        isRequired={
                          pageFields?.find(
                            (x) => x.FieldId === 'DM_P_DepartmentUnitGroup'
                          )?.IsMandatory
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                      <Field name="departmentGroupName">
                        {({ field }) => (
                          <TextField
                            {...field}
                            id="departmentGroupName"
                            autoComplete="off"
                            values={values.departmentGroupName}
                            fullWidth={true}
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="departmentGroupName"
                        component="div"
                        style={{
                          color: 'red',
                          fontSize: '12px',
                          marginTop: '4px',
                        }}
                      />
                    </Grid>
                  </Grid>
                )}

                {pageFields?.find((x) => x.FieldId === 'DM_P_DepartmentUnit')
                  ?.IsShow && (
                  <Grid
                    container
                    display={'flex'}
                    width="100%"
                    flexWrap={'wrap'}
                    justifyContent={'space-between'}
                    item
                    xs={12}
                    spacing={2}
                    alignItems={'center'}
                    marginTop={'0.2rem'}
                  >
                    <Grid item xs={12} sm={12} md={6} lg={4}>
                      <Label
                        value={getlabel(
                          'MM_DM_Department',
                          labels,
                          i18n.language
                        )}
                        isRequired={
                          pageFields?.find(
                            (x) => x.FieldId === 'DM_P_DepartmentUnit'
                          )?.IsMandatory
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={8}>
                      <Field name="departments">
                        {({ ...field }) => (
                          <MultiSelectDropdown
                            {...field}
                            name="departments"
                            disabled={!values?.facility}
                            options={
                              pageLoadData?.Data?.DepartmentList.map(
                                (department) => ({
                                  text: department.DepartmentName,
                                  value: department.DepartmentId,
                                })
                              ) || []
                            }
                          />
                        )}
                      </Field>
                      <ErrorMessage
                        name="departments"
                        component="div"
                        style={{
                          color: 'red',
                          fontSize: '12px',
                          marginTop: '4px',
                        }}
                      />
                    </Grid>
                  </Grid>
                )}
                <Grid
                  display={'flex'}
                  width="100%"
                  justifyContent={'center'}
                  gap={'10px'}
                  marginTop={'1rem'}
                >
                  <StyledButton
                    borderRadius="6px"
                    gap="4px"
                    padding="6px 10px"
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isAdding || isUpdating}
                    onClick={handleSubmit}
                    style={{ display: 'inline-flex', gap: '5px' }}
                    startIcon={
                      <StyledImage
                        height="16px"
                        width="16px"
                        src={DoneIcon}
                        alt="WhiteSearch"
                      />
                    }
                  >
                    {t('Submit')}
                  </StyledButton>
                  <StyledButton
                    variant="outlined"
                    border="1px solid #0083c0"
                    backgroundColor="#ffffff"
                    type="button"
                    colour="#0083c0"
                    borderRadius="6px"
                    disabled={isAdding || isUpdating}
                    sx={{ marginLeft: '10px' }}
                    style={{ display: 'inline-flex', gap: '5px' }}
                    onClick={handleOnCancel}
                    startIcon={
                      <StyledImage
                        height="16px"
                        width="16px"
                        src={DndIcon}
                        alt="WhiteSearch"
                      />
                    }
                  >
                    {t('Cancel')}
                  </StyledButton>
                </Grid>
              </Form>
            )}
          </Formik>
        </FlexContainer>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditDepartmentGroup;
