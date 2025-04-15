import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import { showToastAlert } from '../../../../utils/SweetAlert';

import {
  FlexContainer,
  CommonStyledButton,
  StyledTypography,
  StyledImage,
} from '../../../../utils/StyledComponents';
import Label from '../../../../components/Label/Label';
import DoNotDisturbIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';
import { useGetLabelsQuery } from '../../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../../utils/language';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import i18n from '../../../../i18n/i18n';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import { useTranslation } from 'react-i18next';
import { setUserAssignmentList } from '../../../../redux/features/mainMaster/userAssignmentSlice';
import { useDispatch, useSelector } from 'react-redux';
import useWindowDimension from '../../../../hooks/useWindowDimension';

const validationSchema = Yup.object({
  roleId: Yup.string().required('Application Role is required'),
  additionalFacilityId: Yup.array()
    .of(Yup.string())
    .required('Facility is required')
    .min(1, 'At least one value should be selected'),
});

const AssignRoles = ({
  open,
  onClose,
  pageLoadData,
  isEditModal,
  selectedEditRow,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const initialValues = {
    roleId: isEditModal ? selectedEditRow?.roleId : '',
    additionalFacilityId: isEditModal
      ? selectedEditRow?.additionalFacilityId?.split(',').map(Number)
      : [],
  };
  const [optionArray, setOptionArray] = useState();
  const [filteredOptions, setFilteredOptions] = useState([]);
  const { isMobile } = useWindowDimension();

  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    isSuperAdmin,
    roleFacilities,
  } = useSelector((state) => state.auth);
  const userAssignmentList = useSelector(
    (state) => state.userAssignment.userAssignmentList
  );

  const { data: labels = [] } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  const pagesConfigData = [
    {
      fieldId: 'UA_P_ApplicationRole',
      translationId: 'MM_UA_ApplicationRole',
      label: 'Application Role',
      component: 'Dropdown',
      name: 'roleId',
      options: pageLoadData?.Data?.ApplicationRoleList?.filter(
        (applicationRole) =>
          applicationRole?.RoleId !== 1 && applicationRole?.RoleId !== 2
      ).map((applicationRole) => ({
        text: applicationRole.ApplicationRole,
        value: applicationRole.RoleId,
      })),
    },
    {
      fieldId: 'UA_P_Facility',
      translationId: 'MM_UA_Facility',
      label: 'Facility',
      component: 'MultiSelectDropdown',
      name: 'additionalFacilityId',
      options:
        userDetails?.ApplicableFacilities?.filter((facility) => {
          if (!facility.IsActive) return false;
          if (isSuperAdmin) return true;
          const facilityItem = roleFacilities
            ?.find((role) => role.FacilityId === facility.FacilityId)
            ?.Menu?.find((MenuItem) => MenuItem.MenuId === selectedMenu?.id);
          return facilityItem?.IsAdd;
        }).map((facility) => ({
          text: facility.FacilityName,
          value: facility.FacilityId,
        })) || [],
      // pageLoadData?.Data?.FacilityList?.map((facility) => ({
      //   text: facility.FacilityName,
      //   value: facility.FacilityId,
      // })),
    },
  ];

  const handleSubmit = (values) => {
    const userAssignmentListData = userAssignmentList?.find(
      (item) => item.roleId === values.roleId
    );
    if (userAssignmentListData) {
      const isMatching = (item, target) => {
        const ids = item.additionalFacilityId.split(',').map(Number);
        return (
          target.every((id) => ids.includes(id)) && ids.length === target.length
        );
      };
      const result = isMatching(
        userAssignmentListData,
        values?.additionalFacilityId
      );
      if (!result) {
        const findndex = userAssignmentList?.findIndex(
          (item) => item.roleId === values.roleId
        );
        const additionalFacilityId = values.additionalFacilityId?.join(',');
        const newUserAssignmentList = userAssignmentList.map((item, index) =>
          index === findndex ? { ...item, additionalFacilityId } : item
        );
        dispatch(setUserAssignmentList([...newUserAssignmentList]));
        onClose(true);
      } else {
        showToastAlert({
          type: 'custom_error',
          text: ' Changes make in facility ',
        });
      }
    } else {
      dispatch(
        setUserAssignmentList([
          ...userAssignmentList,
          {
            roleId: values.roleId,
            additionalFacilityId: values.additionalFacilityId?.join(','),
            isDelete: 0,
          },
        ])
      );
      onClose(true);
    }
  };

  const handleRoleChange = (selectedRole, setFieldError, validateForm) => {
    const isExist = userAssignmentList?.some((role) => {
      return role.roleId === selectedRole;
    });
    if (isExist) {
      setFieldError('roleId', 'This Application Role is already exist');
    } else {
      setFieldError('roleId', undefined);
    }
    if (validateForm) {
      setTimeout(() => validateForm(), 100);
    }
  };

  useEffect(() => {
    if (pageLoadData?.Data?.ApplicationRoleList) {
      const updatedOptions = pageLoadData.Data.ApplicationRoleList.filter(
        (option) =>
          !userAssignmentList.some(
            (assignment) => assignment.roleId === option.RoleId
          )
      ).map((option) => ({
        text: option.ApplicationRole,
        value: option.RoleId,
      }));

      setFilteredOptions(updatedOptions);
    }
  }, [userAssignmentList, pageLoadData]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
          width: isMobile ? '100%' : 'auto',
        },
      }}
    >
      <Box sx={{ width: isMobile ? '100%' : '430px' }}>
        <DialogTitle
          sx={{
            backgroundColor: '#205475',
            color: '#fff',
            display: 'flex',
            justifyContent: isMobile ? 'space-between' : 'space-between',
            alignItems: isMobile ? 'space-between' : 'center',
            height: 40,
            padding: '0 8px',
            flexDirection: isMobile ? 'row' : 'row',
          }}
        >
          <StyledTypography
            fontSize={isMobile ? '16px' : '18px'}
            fontWeight="300"
            lineHeight={isMobile ? '16px' : '18px'}
            padding="0 12px"
            color="#fff"
            textAlign={isMobile ? 'left' : 'left'}
            sx={{
              marginTop: isMobile ? '8px' : '0',
            }}
          >
            {t('AssignRoles')}
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
              marginTop: isMobile ? '8px' : '0',
              marginLeft: isMobile ? '-40px' : '0',
              marginTop: isMobile ? '8px' : '0',
            }}
          >
            <Tooltip title="Close" arrow>
              <StyledImage src={CloseIcon} alt="Close Icon" />
            </Tooltip>
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ border: '4px solid #205475' }}>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            validateOnBlur={false}
            validateOnChange={false}
          >
            {({ errors, setFieldError, validateForm, values }) => (
              <Form>
                <Box
                  sx={{
                    marginBottom: 2,
                    display: 'block',
                    alignItems: 'center',
                  }}
                >
                  <FlexContainer
                    width={isMobile ? '50%' : '100%'}
                    padding="20px"
                    gap="20px"
                    alignItems={isMobile ? 'flex-start' : 'center'}
                    flexDirection="column"
                  >
                    {pagesConfigData?.map((data) => {
                      const translatedLabel = getlabel(
                        data?.translationId,
                        labels,
                        i18n.language
                      );
                      return (
                        <FlexContainer
                          width="100%"
                          justifyContent="space-between"
                          alignItems="center"
                          gap="20px"
                          key={data.fieldId}
                          flexDirection={isMobile ? 'column' : 'row'}
                        >
                          <Box
                            sx={{ flex: 1, width: isMobile ? '100%' : 'auto' }}
                          >
                            <Label value={translatedLabel} isRequired={true} />
                          </Box>
                          <Box
                            sx={{ flex: 1, width: isMobile ? '100%' : 'auto' }}
                          >
                            {data.component === 'Dropdown' && (
                              <Dropdown
                                name={data.name}
                                options={
                                  isEditModal
                                    ? pageLoadData?.Data?.ApplicationRoleList?.map(
                                        (applicationRole) => ({
                                          text: applicationRole.ApplicationRole,
                                          value: applicationRole.RoleId,
                                        })
                                      )
                                    : filteredOptions
                                }
                                required
                                width="155px"
                                onChange={(e) => {
                                  handleRoleChange(
                                    e.target.value,
                                    setFieldError,
                                    validateForm
                                  );
                                }}
                                disabled={isEditModal}
                              />
                            )}
                            {data.component === 'MultiSelectDropdown' && (
                              <MultiSelectDropdown
                                name={data.name}
                                options={data.options}
                                required
                                width="155px"
                                setOptionArray={setOptionArray}
                                optionArray={optionArray}
                                validateForm={validateForm}
                              />
                            )}
                            {errors[data.name] && (
                              <FlexContainer
                                style={{ color: 'red', fontSize: '11px' }}
                              >
                                {errors[data.name]}
                              </FlexContainer>
                            )}
                          </Box>
                        </FlexContainer>
                      );
                    })}
                  </FlexContainer>
                </Box>
                <FlexContainer
                  gap="16px"
                  justifyContent={isMobile ? 'flex-start' : 'center'}
                  padding="0px 15px 15px 0px"
                >
                  <FlexContainer
                    gap="16px"
                    justifyContent={isMobile ? 'flex-start' : 'center'}
                    padding="25"
                    textAlign={isMobile ? 'center' : ''}
                  >
                    <CommonStyledButton
                      variant="contained"
                      text-color="#0083C0"
                      gap="8px"
                      disabled={Object.keys(errors).length > 0}
                      style={{ width: isMobile ? '100%' : 'auto' }}
                      startIcon={
                        <StyledImage
                          src={AddSubMaster}
                          sx={{
                            marginBottom: '1px',
                            color: '#FFFFFF',
                          }}
                        />
                      }
                      type="submit"
                    >
                      <StyledTypography marginTop="1px" color="#FFFFFF">
                        {t('Add')}
                      </StyledTypography>
                    </CommonStyledButton>
                    <CommonStyledButton
                      variant="outlined"
                      gap="8px"
                      startIcon={<StyledImage src={DoNotDisturbIcon} />}
                      onClick={onClose}
                      style={{ width: isMobile ? '100%' : 'auto' }}
                    >
                      <StyledTypography marginTop="1px">
                        {t('Cancel')}
                      </StyledTypography>
                    </CommonStyledButton>
                  </FlexContainer>
                </FlexContainer>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default AssignRoles;
