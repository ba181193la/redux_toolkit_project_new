import Eraser from '../../../../assets/Icons/Eraser.png';
import WhiteSearch from '../../../../assets/Icons/WhiteSearch.png';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import { Formik } from 'formik';
import Label from '../../../../components/Label/Label';
import { Autocomplete, Grid, TextField } from '@mui/material';
import { getlabel } from '../../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { StyledButton, StyledImage } from '../../../../utils/StyledComponents';
import { useGetUserPageLoadDataQuery } from '../../../../redux/RTK/userAssignmentApi';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import {
  resetFilters,
  setFilters,
  setIsFilterApplied,
} from '../../../../redux/features/mainMaster/userAssignmentSlice';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';

export default function FilterFormField({
  fields,
  handleToggleFilter,
  labels,
}) {
  const { i18n, t } = useTranslation();
  const { selectedMenu, selectedModuleId, userDetails, selectedFacility,roleFacilities,isSuperAdmin } =
    useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const { isMobile } = useWindowDimension();

  const {
    pageSize,
    pageIndex,
    facilityId,
    searchStaffId,
    departmentId,
    employeeId,
    designationId,
    staffCategoryId,
    activeStatus,
    applicationRole,
  } = useSelector((state) => state?.userAssignment?.filters || {});

  const { data: pageLoadData } = useGetUserPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const initialValues = {
    facility: Array.isArray(facilityId)
      ? facilityId.join(',')
      : facilityId || '',
    searchStaffId: searchStaffId || 0,
    department: departmentId || 0,
    employeeId: employeeId || '',
    designation: designationId || 0,
    staffCategory: staffCategoryId || 0,
    applicationRole: applicationRole || '',
    status: activeStatus || '',
  };

  const fieldsConfig = [
    {
      fieldId: 'UA_S_DepartmentUnit',
      translationId: 'MM_UA_Department',
      label: 'Department',
      component: 'Dropdown',
      name: 'department',
      options: pageLoadData?.Data.DepartmentList?.map((department) => ({
        text: department.DepartmentName,
        value: department.DepartmentId,
      })),
    },
    {
      fieldId: 'UA_S_Facility',
      translationId: 'MM_UA_Facility',
      label: 'Facility',
      component: 'MultiSelectDropdown',
      name: 'facility',
      options: userDetails?.ApplicableFacilities?.filter((facility) => {
        if (!facility.IsActive) return false;
        if (isSuperAdmin) return true;
        const facilityItem = roleFacilities?.find(
          (role) => role.FacilityId === facility.FacilityId
        )?.Menu?.find(MenuItem=>MenuItem.MenuId===selectedMenu?.id)         
        return facilityItem?.IsView;
      }).map((facility) => ({
        text: facility.FacilityName,
        value: facility.FacilityId,
      }))
      // pageLoadData?.Data.FacilityList?.map((facility) => ({
      //   text: facility.FacilityName,
      //   value: facility.FacilityId,
      // })),
    },
    {
      fieldId: 'UA_S_Designation',
      translationId: 'MM_UA_Designation',
      label: 'Designation',
      component: 'Dropdown',
      name: 'designation',
      options: pageLoadData?.Data.DesignationList?.map((designation) => ({
        text: designation.DesignationName,
        value: designation.DesignationId,
      })),
    },
    {
      fieldId: 'UA_S_StaffName',
      translationId: 'MM_UA_StaffName',
      label: 'Staff Name',
      component: 'Dropdown',
      name: 'searchStaffId',
      options: pageLoadData?.Data.StaffList?.map((staffName) => ({
        text: staffName.UserName,
        value: staffName.UserId,
      })),
    },
    {
      fieldId: 'UA_S_EmployeeID',
      translationId: 'MM_UA_EmployeeID',
      label: 'Employee ID',
      component: 'Dropdown',
      name: 'employeeId',
      options: pageLoadData?.Data.StaffList?.map((employeeId) => ({
        text: employeeId.EmployeeID,
        value: employeeId.EmployeeID,
      })),
    },
    {
      fieldId: 'UA_S_ApplicationRole',
      translationId: 'MM_UA_ApplicationRole',
      label: 'Application Role',
      component: 'Dropdown',
      name: 'applicationRole',
      options: pageLoadData?.Data.ApplicationRoleList?.map(
        (applicationRole) => ({
          text: applicationRole.ApplicationRole,
          value: applicationRole.RoleId,
        })
      ),
    },
    {
      fieldId: 'UA_S_Status',
      translationId: 'MM_UA_Status',
      label: 'Status',
      component: 'Dropdown',
      name: 'status',
      options: pageLoadData?.Data.StatusList?.map((status) => ({
        text: status.Status,
        value: status.Status,
      })),
    },
    {
      fieldId: 'UA_S_StaffCategory',
      translationId: 'MM_UA_StaffCategory',
      label: 'Staff Category',
      component: 'Dropdown',
      name: 'staffCategory',
      options: pageLoadData?.Data.StaffCategoryList?.map((staffCategory) => ({
        text: staffCategory.StaffCategoryName,
        value: staffCategory.StaffCategoryId,
      })),
    },
  ];

  // const searchFields = fields?.Data?.Sections?.find(
  //   (section) => section.SectionName === 'Search'
  // )?.Fields;
  const searchFields = Array.isArray(fields?.Data?.Sections)
  ? fields.Data.Sections.find((section) => section.SectionName === 'Search')?.Fields
  : [];

  return (
    <>
      <Label>{t('SelectFilter')}</Label>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values) => {
          dispatch(
            setFilters({
              pageIndex: pageIndex,
              pageSize: pageSize,
              headerFacility: selectedFacility?.id,
              loginUserId: userDetails.UserId,
              moduleId: selectedModuleId,
              menuId: selectedMenu?.id,
              facilityId: Array.isArray(values.facility)
                ? values.facility.join(',')
                : values.facility || '',
              searchStaffId: values.searchStaffId,
              employeeId: values.employeeId,
              designationId: values.designation,
              departmentId: values.department,
              staffCategoryId: values.staffCategory,
              activeStatus: values.status,
              applicationRole:
                values.applicationRole === '' ? 0 : values.applicationRole,
            })
          );
          dispatch(setIsFilterApplied(true));

          handleToggleFilter();
        }}
      >
        {({values, handleSubmit, resetForm, setFieldValue }) => (
          <Grid container spacing={2} display={'flex'}>
            {searchFields?.map((field) => {
              const fieldConfig = fieldsConfig.find(
                (config) => config.fieldId === field.FieldId
              );
              const translatedLabel = getlabel(
                fieldConfig?.translationId,
                labels,
                i18n.language
              );

              if (field.IsShow && fieldConfig) {
                return (
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    padding={'10px'}
                    md={3}
                    key={field.fieldId}
                  > <Label value={translatedLabel} />
                   {fieldConfig.component === 'Dropdown' && (
                      <SearchDropdown
                        name={fieldConfig.name}
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
                    {fieldConfig.component === 'MultiSelectDropdown' && (
                      <MultiSelectDropdown
                        name={fieldConfig.name}
                        options={fieldConfig.options}
                        required={field.IsMandatory}
                      />
                    )}
                  </Grid>
                );
              }
              return null;
            })}
            <Grid
              padding="10px"
              item
              xs={12}
              display="flex"
              // justifyContent="flex-end"
              flexDirection={isMobile ? 'column' : 'row'}
              justifyContent={isMobile ? 'center' : 'flex-end'}
              gap="8px"
            >
              <StyledButton
                borderRadius="6px"
                gap="8px"
                padding="6px 10px"
                variant="contained"
                color="primary"
                startIcon={
                  <StyledImage
                    height="16px"
                    width="16px"
                    src={WhiteSearch}
                    alt="WhiteSearch"
                  />
                }
                onClick={handleSubmit}
              >
                {t('Search')}
              </StyledButton>
              <StyledButton
                variant="outlined"
                border="1px solid #0083c0"
                backgroundColor="#ffffff"
                colour="#0083c0"
                borderRadius="6px"
                gap="8px"
                sx={{ marginLeft: '10px' }}
                startIcon={
                  <StyledImage
                    height="16px"
                    width="16px"
                    src={Eraser}
                    alt="Eraser"
                  />
                }
                onClick={() => {
                  dispatch(resetFilters());
                  resetForm();
                }}
              >
                {t('ClearAll')}
              </StyledButton>
            </Grid>
          </Grid>
        )}
      </Formik>
    </>
  );
}
