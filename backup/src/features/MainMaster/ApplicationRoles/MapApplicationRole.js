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
import MultiSelectDropdown from '../../../components/Dropdown/MultiSelectDropdown';
import DoneIcon from '../../../assets/Icons/DoneIcon.png';
import DoNotDisturbIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import Dropdown from '../../../components/Dropdown/Dropdown';
import * as Yup from 'yup';
import { useGetLabelsQuery } from '../../../redux/RTK/moduleDataApi';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLazyGetRoleCategoryMapingQuery } from '../../../redux/RTK/applicationRoleApi';
import { useUpdateRoleCategoryMappingMutation } from '../../../redux/RTK/applicationRoleApi';

import { getlabel } from '../../../utils/language';
import { showToastAlert } from '../../../utils/SweetAlert';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';

const MapApplicationRole = ({ open, onClose, isMobile, isTablet }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();

  const [selectedIds, setSelectedIds] = useState();
  const [selectedStaffCategoryId, setSelectedStaffCategoryId] = useState();
  const [filteredStaffCategories, setFilteredStaffCategories] = useState([]);

  const { selectedMenu, userDetails, selectedModuleId, selectedFacility, isSuperAdmin, roleFacilities } =
    useSelector((state) => state.auth);

  const initialValues = {
    staffCategory: null,
    applicationRole: null,
    facility: null,
  };

  const validationSchema = Yup.object().shape({
    facility: Yup.string().required('Facility is required'),
    staffCategory: Yup.string().required('Staff Category is required'),
    applicationRole: Yup.array()
      .of(Yup.string())
      .min(1, 'At least one application role must be selected')
      .required('Application Role is required'),
  });

  const { data: labels = [] } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  const [triggerGetRoleCategoryMaping, { data: recordsData }] =
    useLazyGetRoleCategoryMapingQuery();

  const [triggerUpdateRoleCategoryMapping] =
    useUpdateRoleCategoryMappingMutation();

  useEffect(() => {
    triggerGetRoleCategoryMaping({
      loginUserId: userDetails.UserId,
      menuId: selectedMenu?.id,
    });
  }, [dispatch]);

  const handleFacilityChange = (selectedFacilityId, setFieldValue) => {
    const filteredCategories =
      recordsData?.Data?.StaffCategoryList?.filter((category) => {
        return category.FacilityId === selectedFacilityId;
      }) || [];
    setFilteredStaffCategories(filteredCategories);
    setFieldValue('staffCategory', '');
    setFieldValue('applicationRole', []);
  };

  const handleStaffCategoryChange = (
    selectedStaffCategoryId,
    setFieldValue
  ) => {
    setSelectedStaffCategoryId(selectedStaffCategoryId);
    const selectedMapping =
      recordsData?.Data?.ApplicationRoleCategoryList?.filter(
        (mapping) => mapping.StaffCategoryId === selectedStaffCategoryId
      );
    const selectedRoleIds = selectedMapping.flatMap((mapping) =>
      mapping.RoleId.split(',')
    );
    setFieldValue(
      'applicationRole',
      selectedRoleIds.filter((role) => role)
    );
  };

  const handleSubmit = async ({ resetForm }) => {
    const roleIdsString = Array.isArray(selectedIds)
      ? selectedIds.join(',')
      : '';
    let response;
    try {
      response = await triggerUpdateRoleCategoryMapping({
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
      if (response && response.Message) {
        showToastAlert({
          type: 'custom_success',
          text: response.Message,
          gif: 'SuccessGif'
        });
      }
    } catch (error) {
      showToastAlert({
        type: 'custom_error',
        text: response.Message,
        gif: 'InfoGif'
      });
    } finally {
      onClose();
      resetForm();
    }
  };

  return (
    <Dialog
      open={open}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile || isTablet ? '100%' : 'auto',
          borderRadius: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <Box sx={{ width: isMobile || isTablet ? '100%' : '430px' }}>
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
            {t('MapApplicationRole')}
          </StyledTypography>
          <IconButton
            onClick={onClose}
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
        <DialogContent
          sx={{
            border: '4px solid #205475',
            padding: isMobile || isTablet ? '8px' : '16px',
          }}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, errors, touched, values }) => {
              return (
                <Form>
                  <Box
                    sx={{
                      marginBottom: 2,
                      marginRight: i18n.language === 'ar' ? 6 : 0,
                      display: 'block',
                      alignItems: 'center',
                    }}
                  >
                    <FlexContainer
                      width="100%"
                      padding="20px"
                      gap="20px"
                      alignItems="center"
                      flexDirection="column"
                    >
                      <FlexContainer
                        width="100%"
                        justifyContent="end"
                        alignItems="center"
                        gap="20px"
                      >
                        <Box sx={{ flex: 1 }}>
                          <Label
                            value={getlabel(
                              'MM_AR_Facility',
                              labels,
                              i18n.language
                            )}
                            isRequired={true}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Dropdown
                            name="facility"
                            options={
                              userDetails?.ApplicableFacilities?.filter((facility) => {
                                if (!facility.IsActive) return false;
                                if (isSuperAdmin) return true;
                                const facilityItem = roleFacilities?.find(
                                  (role) => role.FacilityId === facility.FacilityId
                                )?.Menu?.find(MenuItem=>MenuItem.MenuId===selectedMenu?.id)       
                                return facilityItem?.IsAdd;
                              }).map((facility) => ({
                                text: facility.FacilityName,
                                value: facility.FacilityId,
                              }))
                            }
                            width="155px"
                            required={true}
                            onChange={(e) =>
                              handleFacilityChange(
                                e.target.value,
                                setFieldValue
                              )
                            }
                          />
                          {/* <SearchDropdown
                      disableClearable={true}
                      name={'facility'}
                      options={[
                        { text: 'Select', value: '' },
                        ...(recordsData?.Data?.FacilityList?.map(
                          (facility) => ({
                            text: facility.FacilityName,
                            value: facility.FacilityId,
                          })
                         ) || []),
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
                            fontSize: '14px',
                            minHeight: '30px',
                            display: 'flex',
                            alignItems: 'center',
                          },
                        },
                      }}
                      value={
                        recordsData?.Data?.FacilityList?.map(
                          (facility) => ({
                            text: facility.FacilityName,
                            value: facility.FacilityId,
                          })
                        )?.find(
                          (option) => option.value === values['facility']
                        ) || null
                      }
                      onChange={(event, value) => {
                        setFieldValue('facility', value?.value);
                      }}
                    /> */}
                          {errors.facility && touched.facility && (
                            <FlexContainer
                              style={{ color: 'red', fontSize: '11px' }}
                            >
                              {errors.facility}
                            </FlexContainer>
                          )}
                        </Box>
                      </FlexContainer>

                      <FlexContainer
                        width="100%"
                        justifyContent="space-between"
                        gap="20px"
                      >
                        <Box sx={{ flex: 1 }}>
                          <Label
                            value={getlabel(
                              'MM_AR_StaffCategory',
                              labels,
                              i18n.language
                            )}
                            isRequired={true}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Dropdown
                            name="staffCategory"
                            options={filteredStaffCategories?.map(
                              (category) => ({
                                text: category.StaffCategoryName,
                                value: category.StaffCategoryId,
                              })
                            )}
                            width="155px"
                            required={true}
                            onChange={(e) => {
                              handleStaffCategoryChange(
                                e.target.value,
                                setFieldValue
                              );
                            }}
                          />
                          {/* <SearchDropdown
                      disableClearable={true}
                      name={'staffCategory'}
                      options={[
                        { text: 'Select', value: '' },
                        ...(filteredStaffCategories?.map((category) => ({
                          text: category.StaffCategoryName,
                          value: category.StaffCategoryId,
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
                            fontSize: '14px',
                            minHeight: '30px',
                            display: 'flex',
                            alignItems: 'center',
                          },
                        },
                      }}
                      value={
                        filteredStaffCategories?.map((category) => ({
                          text: category.StaffCategoryName,
                          value: category.StaffCategoryId,
                        }))?.find(
                          (option) => option.value === values['staffCategory']
                        ) || null
                      }
                      onChange={(e) => {
                        handleStaffCategoryChange(
                          e.target.value,
                          setFieldValue
                        );
                      }}
                    /> */}
                          {errors.staffCategory && touched.staffCategory && (
                            <FlexContainer
                              style={{ color: 'red', fontSize: '11px' }}
                            >
                              {errors.staffCategory}
                            </FlexContainer>
                          )}
                        </Box>
                      </FlexContainer>
                      <FlexContainer
                        width="100%"
                        justifyContent="space-between"
                        alignItems="center"
                        gap="20px"
                      >
                        <Box sx={{ flex: 1 }}>
                          <Label
                            value={getlabel(
                              'MM_AR_ApplicationRole',
                              labels,
                              i18n.language
                            )}
                            isRequired={true}
                          />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <MultiSelectDropdown
                            name="applicationRole"
                            options={recordsData?.Data?.ApplicationRoleList?.map(
                              (applicationRole) => ({
                                text: applicationRole.ApplicationRole,
                                value: applicationRole.RoleId,
                              })
                            )}
                            width="155px"
                            required={true}
                            setSelectedIds={setSelectedIds}
                          />
                          {errors.applicationRole &&
                            touched.applicationRole && (
                              <FlexContainer
                                style={{ color: 'red', fontSize: '11px' }}
                              >
                                {errors.applicationRole}
                              </FlexContainer>
                            )}
                        </Box>
                      </FlexContainer>
                    </FlexContainer>
                  </Box>
                  <FlexContainer
                    gap="16px"
                    justifyContent="center"
                    padding="0px 15px 15px 0px"
                  >
                    <CommonStyledButton
                      type="submit"
                      variant="contained"
                      text-color="#0083C0"
                      gap="8px"
                      // disabled={
                      //   !values.facility ||
                      //   !values.staffCategory ||
                      //   !values.applicationRole?.length > 0
                      // }
                      startIcon={
                        <StyledImage
                          src={DoneIcon}
                          sx={{
                            marginBottom: '1px',
                            color: '#FFFFFF',
                          }}
                        />
                      }
                    >
                      <StyledTypography marginTop="1px" color="#FFFFFF">
                        {t('Submit')}
                      </StyledTypography>
                    </CommonStyledButton>
                    <CommonStyledButton
                      variant="outlined"
                      gap="8px"
                      onClick={onClose}
                      startIcon={<StyledImage src={DoNotDisturbIcon} />}
                    >
                      <StyledTypography marginTop="1px">
                        {t('Cancel')}
                      </StyledTypography>
                    </CommonStyledButton>
                  </FlexContainer>
                </Form>
              );
            }}
          </Formik>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default MapApplicationRole;
