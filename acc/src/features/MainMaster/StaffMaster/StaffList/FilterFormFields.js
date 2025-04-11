import { Formik } from 'formik';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import Label from '../../../../components/Label/Label';
import { StyledButton, StyledImage } from '../../../../utils/StyledComponents';
import WhiteSearch from '../../../../assets/Icons/WhiteSearch.png';
import Eraser from '../../../../assets/Icons/Eraser.png';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useGetPageLoadDataQuery } from '../../../../redux/RTK/staffMasterApi';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import {
  resetFilters,
  setFilters,
  setIsFilterApplied,
} from '../../../../redux/features/mainMaster/staffMasterSlice';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import { Grid } from '@mui/material';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';

const FilterFormField = ({ fields, handleToggleFilter, labels }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const { isMobile } = useWindowDimension();

  const { selectedMenu, selectedModuleId, roleFacilities,isSuperAdmin,userDetails, selectedFacility } =
    useSelector((state) => state.auth);
  const {
    pageSize,
    pageIndex,
    facilityId,
    searchStaffId,
    employmentTypeId,
    departmentId,
    employeeId,
    designationId,
    staffCategoryId,
    activeStatus,
    adUserLogonName,
  } = useSelector((state) => state.staffMaster.filters);

  const { data: pageLoadData } = useGetPageLoadDataQuery({
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });

  const initialValues = {
    facility: facilityId?.split(',') || [],
    searchStaffId: searchStaffId || 0,
    employeeType: employmentTypeId || 0,
    department: departmentId || 0,
    employeeId: employeeId || '',
    designation: designationId || 0,
    staffCategory: staffCategoryId || 0,
    adUserLogonName: adUserLogonName || '',
    status: activeStatus || '',
  };
  const fieldsConfig = [
    {
      fieldId: 'SM_S_StaffName',
      translationId: 'MM_SM_StaffName',
      label: 'Staff Name',
      component: 'Dropdown',
      name: 'searchStaffId',
      options: pageLoadData?.Data.StaffList?.map((staff) => ({
        text: staff.UserName,
        value: staff.UserId,
      })),
    },
    {
      fieldId: 'SM_S_EmployeeID',
      translationId: 'MM_SM_EmployeeID',
      label: 'Employee ID',
      component: 'Dropdown',
      name: 'employeeId',
      options: pageLoadData?.Data.StaffList?.map((employeeId) => ({
        text: employeeId.EmployeeID,
        value: employeeId.EmployeeID,
      })),
    },
    {
      fieldId: 'SM_S_EmployeeType',
      translationId: 'MM_SM_EmploymentType',
      label: 'Employment Type',
      component: 'Dropdown',
      name: 'employeeType',
      options: pageLoadData?.Data.EmployeeTypeList?.map((employmentType) => ({
        text: employmentType.EmploymentType,
        value: employmentType.EmploymentTypeId,
      })),
    },
    {
      fieldId: 'SM_S_StaffCategory',
      translationId: 'MM_SM_StaffCategory',
      label: 'Staff Category',
      component: 'Dropdown',
      name: 'staffCategory',
      options: pageLoadData?.Data.StaffCategoryList?.map((staffCategory) => ({
        text: staffCategory.StaffCategoryName,
        value: staffCategory.StaffCategoryId,
      })),
    },
    {
      fieldId: 'SM_S_Department',
      translationId: 'MM_SM_Department',
      label: 'Department',
      component: 'Dropdown',
      name: 'department',
      options: pageLoadData?.Data.DepartmentList?.map((department) => ({
        text: department.DepartmentName,
        value: department.DepartmentId,
      })),
    },
    {
      fieldId: 'SM_S_PrimaryDesignation',
      translationId: 'MM_SM_PrimaryDesignation',
      label: 'Designation',
      component: 'Dropdown',
      name: 'designation',
      options: pageLoadData?.Data.DesignationList?.map((designation) => ({
        text: designation.DesignationName,
        value: designation.DesignationId,
      })),
    },
    {
      fieldId: 'SM_S_Status',
      translationId: 'MM_SM_Status',
      label: 'Status',
      component: 'Dropdown',
      name: 'status',
      options: pageLoadData?.Data.StatusList?.map((status) => ({
        text: status.Status,
        value: status.Status,
      })),
    },
    {
      fieldId: 'SM_S_Facility',
      translationId: 'MM_SM_Facility',
      label: 'Facility',
      component: 'MultiSelectDropdown',
      name: 'facility',
      options: userDetails?.ApplicableFacilities?.filter((facility) => {
        if (!facility.IsActive) return false;   
        if (isSuperAdmin) return true;
        const facilityItem = roleFacilities?.find(
          (role) => role.FacilityId === facility.FacilityId
        )?.Menu?.[selectedMenu?.id];        
        return facilityItem?.IsView;
      }).map((facility) => ({
        text: facility.FacilityName,
        value: facility.FacilityId,
      }))
      // options: pageLoadData?.Data.FacilityList?.map((facility) => ({
      //   text: facility.FacilityName,
      //   value: facility.FacilityId,
      // })),
    },
    {
      fieldId: 'SM_S_ADULName',
      translationId: 'MM_SM_ADULName',
      label: 'AD User Logon Name',
      component: 'Dropdown',
      name: 'adUserLogonName',
      options: pageLoadData?.Data.StaffList?.filter(
        (item) => item.ADUserLogonName
      )?.map((employeeId) => {
        return {
          text: employeeId.ADUserLogonName,
          value: employeeId.ADUserLogonName,
        };
      }),
    },
  ];

  const searchFields = fields?.Data?.Sections?.find(
    (section) => section.SectionName === 'Search'
  )?.Fields;

  const validationSchema = Yup.object().shape(
    searchFields?.reduce((schema, field) => {
      if (field.IsMandatory) {
        schema[field.FieldId] = Yup.string().required(
          `${field.FieldId} is required`
        );
      }
      return schema;
    }, {})
  );

  return (
    <>
      <Label>{t('SelectFilter')}</Label>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={async (values) => {
          dispatch(
            setFilters({
              pageIndex: pageIndex,
              pageSize,
              headerFacility: selectedFacility?.id,
              loginUserId: userDetails.UserId,
              moduleId: selectedModuleId,
              menuId: selectedMenu?.id,
              facilityId: values.facility?.join(','),
              searchStaffId: values.searchStaffId,
              employmentTypeId: values.employeeType,
              departmentId: values.department,
              employeeId: values.employeeId,
              designationId: values.designation,
              staffCategoryId: values.staffCategory,
              activeStatus: values.status,
              adUserLogonName: values.adUserLogonName,
            })
          );
          dispatch(setIsFilterApplied(true));

          handleToggleFilter();
        }}
      >
        {({ values, handleSubmit, setFieldValue, resetForm }) => (
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
                  >
                    <Label value={translatedLabel} />
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
                            (option) =>
                              option.value === values[fieldConfig.name]
                          ) || null
                        }
                      />
                    )}
                    {fieldConfig.component === 'MultiSelectDropdown' && (
                      <MultiSelectDropdown
                        name={fieldConfig?.name}
                        options={fieldConfig?.options}
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
              justifyContent="flex-end"
              gap={'10px'}
              flexWrap={'wrap'}
            >
              <StyledButton
                borderRadius="6px"
                padding="6px 10px"
                variant="contained"
                color="primary"
                width={isMobile ? '100%' : ''}
                startIcon={
                  <StyledImage
                    height="16px"
                    width="16px"
                    src={WhiteSearch}
                    alt="WhiteSearch"
                    style={{ marginInlineEnd: 5 }}
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
                width={isMobile ? '100%' : ''}
                startIcon={
                  <StyledImage
                    height="16px"
                    width="16px"
                    src={Eraser}
                    alt="Eraser"
                    style={{ marginInlineEnd: 5 }}
                  />
                }
                onClick={() => {
                  resetForm();
                  dispatch(resetFilters());
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
};

export default FilterFormField;
