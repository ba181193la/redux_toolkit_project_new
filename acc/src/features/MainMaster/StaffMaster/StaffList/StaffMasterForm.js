import React, { useEffect, useState } from 'react';
import { Formik } from 'formik';
import Label from '../../../../components/Label/Label';
import {
  CommonStyledButton,
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DoNotDisturbIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import { TextField } from '../../../../components/TextField/TextField';
import Date from '../../../../components/Date/Date';
import MultiSelectDropdown from '../../../../components/Dropdown/MultiSelectDropdown';
import ImageUpload from '../../../../components/ImageUpload/ImageUpload';
import {
  useAddStaffMutation,
  useGetStaffByIdQuery,
  useLazyGetPageLoadDataQuery,
  useUpdateStaffMutation,
} from '../../../../redux/RTK/staffMasterApi';
import { useSelector } from 'react-redux';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../../utils/language';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { ReactFormGenerator } from 'react-form-builder2';
import { useGetFormBuilderByIdQuery } from '../../../../redux/RTK/formBuilderApi';
import { showToastAlert } from '../../../../utils/SweetAlert';
import LoadingGif from '../../../../assets/Gifs/LoadingGif.gif';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import { Grid } from '@mui/material';
 
export default function StaffMasterForm() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
 
  const [validationSchema, setValidationSchema] = useState();
  const [pagesConfigData, setPagesConfigData] = useState([]);
  const [pageFields, setPageFields] = useState([]);
  const [data, setData] = useState([]);
  const [initialValues, setInitialValues] = useState({
    staffName: '',
    employeeId: '',
    defaultFacility: '',
    gender: '',
    emailId: '',
    dateOfBirth: null,
    dateOfHire: null,
    employmentType: '',
    staffCategory: '',
    department: '',
    primaryDesignation: '',
    reportingTo: '',
    secondaryDesignation: [],
    physicianLevel: '',
    employeeSubtype: '',
    adUserLogonName: '',
    hod: [],
    departmentIncharge: [],
    status: '',
    employeeImage: null,
    uploadSignature: null,
    formBuilderData: null,
  });
 
  const {
    selectedMenu,
    userDetails,
    selectedFacility,
    selectedModuleId,
    roleFacilities,
    isSuperAdmin,
  } = useSelector((state) => state.auth);
 
  const { data: dynamicFormData } = useGetFormBuilderByIdQuery(
    {
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      headerFacilityId: selectedFacility?.id,
      tabs: 0,
    },
    { skip: !selectedMenu?.id || !userDetails?.UserId || !selectedModuleId }
  );
 
  const [triggerAddStaff] = useAddStaffMutation();
  const [triggerUpdateStaff] = useUpdateStaffMutation();
  const [triggerGetpageLoadData, { data: pageLoadData, isLoading, isError }] =
    useLazyGetPageLoadDataQuery();
 
  const { data: fields = [], isFetching: isFieldsFetching } = useGetFieldsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );
 
  const { data: labels = [], isFetching: isLabelsFetching } = useGetLabelsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );
 
  const { data: staffData, isFetching: isFetchingStaffData } =
    useGetStaffByIdQuery(
      {
        menuId: selectedMenu?.id,
        loginUserId: userDetails?.UserId,
        userId: id,
      },
      { skip: !id }
    );
 
  useEffect(() => {
    setPagesConfigData([
      {
        fieldId: 'SM_P_StaffName',
        translationId: 'MM_SM_StaffName',
        component: 'TextField',
        name: 'staffName',
        maxLength: 100,
      },
      {
        fieldId: 'SM_P_EmployeeID',
        translationId: 'MM_SM_EmployeeID',
        component: 'TextField',
        name: 'employeeId',
        maxLength: 100,
      },
      {
        fieldId: 'SM_P_DefaultFacility',
        translationId: 'MM_SM_DefaultFacility',
        component: 'Dropdown',
        name: 'defaultFacility',
        options: userDetails?.ApplicableFacilities?.filter((facility) => {
          if (isSuperAdmin) return true;
          if (!facility.IsActive) return false;
          const facilityItem = roleFacilities?.find(
            (role) => role.FacilityId === facility.FacilityId
          )?.Menu?.[selectedMenu?.id];
          return facilityItem?.IsAdd;
        }).map((facility) => ({
          text: facility.FacilityName,
          value: facility.FacilityId,
        })),
      },
      {
        fieldId: 'SM_P_Gender',
        translationId: 'MM_SM_Gender',
        component: 'Dropdown',
        name: 'gender',
        options: pageLoadData?.Data?.GenderList?.map((gender) => ({
          text: gender.Gender,
          value: gender.Gender,
        })),
      },
      {
        fieldId: 'SM_P_EmailID',
        translationId: 'MM_SM_EmailID',
        component: 'TextField',
        name: 'emailId',
        maxLength: 100,
      },
      {
        fieldId: 'SM_P_DateofBirth',
        translationId: 'MM_SM_DateofBirth',
        component: 'DatePicker',
        name: 'dateOfBirth',
      },
      {
        fieldId: 'SM_P_DateofHire',
        translationId: 'MM_SM_DateofHire',
        component: 'DatePicker',
        name: 'dateOfHire',
      },
      {
        fieldId: 'SM_P_EmployeeType',
        translationId: 'MM_SM_EmploymentType',
        component: 'Dropdown',
        name: 'employmentType',
        options: pageLoadData?.Data.EmployeeTypeList?.map((employmentType) => ({
          text: employmentType.EmploymentType,
          value: employmentType.EmploymentTypeId,
        })),
      },
      {
        fieldId: 'SM_P_StaffCategory',
        translationId: 'MM_SM_StaffCategory',
        component: 'Dropdown',
        name: 'staffCategory',
        options: pageLoadData?.Data.StaffCategoryList?.map((staffCategory) => ({
          text: staffCategory.StaffCategoryName,
          value: staffCategory.StaffCategoryId,
        })),
      },
      {
        fieldId: 'SM_P_Department',
        translationId: 'MM_SM_Department',
        component: 'Dropdown',
        name: 'department',
        options: pageLoadData?.Data.DepartmentList?.map((department) => ({
          text: department.DepartmentName,
          value: department.DepartmentId,
        })),
      },
      {
        fieldId: 'SM_P_PrimaryDesignation',
        translationId: 'MM_SM_PrimaryDesignation',
        component: 'Dropdown',
        name: 'primaryDesignation',
        options: pageLoadData?.Data.DesignationList?.map((designation) => ({
          text: designation.DesignationName,
          value: designation.DesignationId,
        })),
      },
      {
        fieldId: 'SM_P_SecondaryDesignation',
        translationId: 'MM_SM_SecondaryDesignation',
        component: 'MultiSelectDropdown',
        name: 'secondaryDesignation',
        options: pageLoadData?.Data.DesignationList?.map((designation) => ({
          text: designation.DesignationName,
          value: designation.DesignationId,
        })),
      },
      {
        fieldId: 'SM_P_ReportingTo',
        translationId: 'MM_SM_ReportingTo',
        component: 'Dropdown',
        name: 'reportingTo',
        options: pageLoadData?.Data.DesignationList?.map((department) => ({
          text: department.DesignationName,
          value: department.DesignationId,
        })),
      },
      {
        fieldId: 'SM_P_Physicianlevel',
        translationId: 'MM_SM_Physicianlevel',
        component: 'Dropdown',
        name: 'physicianLevel',
        options: pageLoadData?.Data?.PhysicianLevelList?.map(
          (physicianLevel) => ({
            text: physicianLevel.PhysicianLevel,
            value: physicianLevel.PhysicianLevelId,
          })
        ),
      },
      {
        fieldId: 'SM_P_EmployeeSubtype',
        translationId: 'MM_SM_EmployeeSubtype',
        component: 'Dropdown',
        name: 'employeeSubtype',
        options: pageLoadData?.Data?.EmployeeSubTypeList?.map(
          (employeeSubtype) => ({
            text: employeeSubtype.EmployeeSubType,
            value: employeeSubtype.EmployeeSubTypeId,
          })
        ),
      },
      {
        fieldId: 'SM_P_ADULName',
        translationId: 'MM_SM_ADULName',
        component: 'TextField',
        name: 'adUserLogonName',
        maxLength: 100,
      },
      {
        fieldId: 'SM_P_HOD',
        translationId: 'MM_SM_HOD',
        component: 'MultiSelectDropdown',
        name: 'hod',
        options: pageLoadData?.Data?.HODDepartmentList?.filter(
          (item) =>
            (item.DataVisible === 'Show' && item.DepartmentName) ||
            item.DepartmentId.toString() === staffData?.Data?.DepartmentHod
        )?.map((hod) => ({
          text: hod.DepartmentName,
          value: hod.DepartmentId,
        })),
      },
      {
        fieldId: 'SM_P_Departmentincharge',
        translationId: 'MM_SM_Departmentincharge',
        component: 'MultiSelectDropdown',
        name: 'departmentIncharge',
        options: pageLoadData?.Data?.HODDepartmentList?.map(
          (departmentIncharge) => ({
            text: departmentIncharge.DepartmentName,
            value: departmentIncharge.DepartmentId,
          })
        ),
      },
      {
        fieldId: 'SM_P_Status',
        translationId: 'MM_SM_Status',
        component: 'Dropdown',
        name: 'status',
        options: pageLoadData?.Data.StatusList?.map((status) => ({
          text: status.Status,
          value: status.Status,
        })),
      },
      {
        fieldId: 'SM_P_Inactive',
        translationId: 'MM_SM_Inactive',
        component: 'DatePicker',
        name: 'inActiveDate',
      },
      {
        fieldId: 'SM_P_UploadSignatureL',
        translationId: 'MM_SM_UploadSignatureL',
        component: 'ImageUpload',
        name: 'uploadSignature',
      },
      {
        fieldId: 'SM_P_EmployeeImage',
        translationId: 'MM_SM_EmployeeImage',
        component: 'ImageUpload',
        name: 'employeeImage',
      },
    ]);
  }, [pageLoadData?.Data, staffData]);
 
  useEffect(() => {
    const pageFieldsData = fields?.Data?.Sections?.find(
      (section) => section.SectionName === 'Page'
    )?.Fields;

    // setPageFields(moveFieldsToEnd(pageFieldsData));
    setPageFields(pageFieldsData);
  }, [fields?.Data?.Sections]);
 
  useEffect(() => {
    if (selectedFacility?.id && userDetails?.UserId && selectedMenu?.id) {
      triggerGetpageLoadData({
        menuId: selectedMenu?.id,
        loginUserId: userDetails?.UserId,
        headerFacilityId: selectedFacility?.id,
      });
    }
  }, [userDetails?.UserId, selectedMenu?.id]);
 
  useEffect(() => {
    const {
      UserName,
      EmployeeID,
      DefaultFacilityId,
      Gender,
      MailId,
      Dob,
      Doh,
      EmploymentTypeId,
      StaffCategoryId,
      DepartmentId,
      DesignationId,
      SecondaryDesignationID,
      ReportingTo,
      PhysicianLevelId,
      EmployeeSubTypeId,
      ADUserLogonName,
      DepartmentHod,
      DepartmentIncharge,
      ActiveStatus,
      UserImage,
      EmpSignature,
      InActiveDate,
    } = staffData?.Data || {};
 
    setInitialValues({
      staffName: UserName,
      employeeId: EmployeeID,
      defaultFacility: DefaultFacilityId,
      gender: Gender,
      emailId: MailId,
      dateOfBirth: Dob,
      dateOfHire: Doh,
      employmentType: EmploymentTypeId,
      staffCategory: StaffCategoryId,
      department: DepartmentId,
      primaryDesignation: DesignationId,
      reportingTo: ReportingTo,
      secondaryDesignation: SecondaryDesignationID?.split(','),
      physicianLevel: PhysicianLevelId,
      employeeSubtype: EmployeeSubTypeId,
      adUserLogonName: ADUserLogonName,
      hod: DepartmentHod?.split(','),
      departmentIncharge: DepartmentIncharge?.split(','),
      status: ActiveStatus,
      employeeImage: UserImage,
      uploadSignature: EmpSignature,
      inActiveDate: InActiveDate,
    });
  }, [staffData]);
 
  useEffect(() => {
    const schemaFields = {};
    pageFields?.forEach((field) => {
      if (field.IsShow && field.IsMandatory) {
        const fieldConfig = pagesConfigData?.find(
          (config) => config.fieldId === field.FieldId
        );
        const translatedLabel =
          field.FieldId === 'SM_P_Inactive'
            ? 'Inactive Date'
            : getlabel(fieldConfig?.translationId, labels, i18n.language);
 
        switch (fieldConfig?.name) {
          case 'staffName':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'employeeId':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'defaultFacility':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'gender':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'emailId':
            schemaFields[fieldConfig?.name] = Yup.string()
              .matches(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                'Invalid email address'
              )
              .required(`${translatedLabel} is required`);
            break;
          case 'dateOfBirth':
            schemaFields[fieldConfig?.name] = Yup.date().required(
              `${translatedLabel} is required`
            );
            break;
          case 'dateOfHire':
            schemaFields[fieldConfig?.name] = Yup.date().required(
              `${translatedLabel} is required`
            );
            break;
          case 'employmentType':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'staffCategory':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'department':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'primaryDesignation':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'reportingTo':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'secondaryDesignation':
            schemaFields[fieldConfig?.name] = Yup.array()
              .required(`${translatedLabel} is required`)
              .min(1, 'At least one value should be selected');
            break;
          case 'physicianLevel':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'employeeSubtype':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'adUserLogonName':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'hod':
            schemaFields[fieldConfig?.name] = Yup.array()
              .required(`${translatedLabel} is required`)
              .min(1, 'At least one value should be selected');
            break;
          case 'departmentIncharge':
            schemaFields[fieldConfig?.name] = Yup.array()
              .required(`${translatedLabel} is required`)
              .min(1, 'At least one value should be selected');
            break;
          case 'status':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'employeeImage':
            schemaFields[fieldConfig?.name] = Yup.mixed().required(
              `${translatedLabel} is required`
            );
            break;
          case 'uploadSignature':
            schemaFields[fieldConfig?.name] = Yup.mixed().required(
              `${translatedLabel} is required`
            );
            break;
          default:
            break;
        }
      }
    });
    setValidationSchema(Yup.object().shape(schemaFields));
  }, [pageFields]);
  const shouldRender = (name, values) => {
    if (name === 'physicianLevel' || name === 'departmentIncharge')
      return (
        pageLoadData?.Data.StaffCategoryList?.find(
          (item) => item.StaffCategoryId === values.staffCategory
        )?.IsPhysician || false
      );
    else return true;
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnChange={true}
      validateOnMount={true}
      validateOnBlur={true}
      enableReinitialize={true}
      onSubmit={async (values, { resetForm }) => {
        const {
          staffName,
          employeeId,
          defaultFacility,
          gender,
          emailId,
          dateOfBirth,
          dateOfHire,
          employmentType,
          staffCategory,
          department,
          primaryDesignation,
          reportingTo,
          secondaryDesignation,
          employeeSubtype,
          adUserLogonName,
          hod,
          departmentIncharge,
          status,
          physicianLevel,
          employeeImage,
          uploadSignature,
        } = values;
        let response;
        if (id) {
          response = await triggerUpdateStaff({
            payload: {
              userId: id,
              userName: staffName,
              defaultFacilityId: defaultFacility,
              employeeID: employeeId,
              mobileNumber: '9047288004',
              mailId: emailId,
              dob: dateOfBirth,
              departmentId: department,
              designationId: primaryDesignation,
              gender,
              employmentTypeId: employmentType,
              physicianLevelId: physicianLevel,
              staffCategoryId: staffCategory,
              isPhysician:
                pageLoadData?.Data.StaffCategoryList?.find(
                  (item) => item.StaffCategoryId === staffCategory
                )?.IsPhysician || false,
              employeeSubTypeId: employeeSubtype,
              userImage: employeeImage,
              doh: dateOfHire,
              activeStatus: status,
              departmentHod: hod?.join(','),
              departmentIncharge: departmentIncharge?.join(','),
              secondaryDesignationID: secondaryDesignation?.join(','),
              reportingTo: reportingTo,
              empSignature: uploadSignature,
              adUserLogonName,
              moduleId: selectedModuleId,
              menuId: selectedMenu?.id,
              loginUserId: userDetails?.UserId,
              formData: null,
              formBuilderData: values?.formBuilderData,
            },
          }).unwrap();
        } else {
          response = await triggerAddStaff({
            payload: {
              userName: staffName,
              defaultFacilityId: defaultFacility,
              employeeID: employeeId,
              mobileNumber: '9047288004',
              mailId: emailId,
              dob: dateOfBirth,
              departmentId: department,
              designationId: primaryDesignation,
              gender,
              employmentTypeId: employmentType,
              physicianLevelId: physicianLevel,
              staffCategoryId: staffCategory,
              isPhysician:
                pageLoadData?.Data.StaffCategoryList?.find(
                  (item) => item.StaffCategoryId === staffCategory
                )?.IsPhysician || false,
              employeeSubTypeId: employeeSubtype,
              userImage: employeeImage,
              doh: dateOfHire,
              activeStatus: status,
              departmentHod: hod?.join(','),
              departmentIncharge: departmentIncharge?.join(','),
              secondaryDesignationID: secondaryDesignation?.join(','),
              reportingTo: reportingTo,
              empSignature: uploadSignature,
              adUserLogonName,
              moduleId: selectedModuleId,
              menuId: selectedMenu?.id,
              loginUserId: userDetails?.UserId,
              formBuilderData: values?.formBuilderData,
            },
          }).unwrap();
        }
 
        if (response && !response.Message.includes('Record Already Exist')) {
          showToastAlert({
            type: 'custom_success',
            text: response.Message,
            gif: 'SuccessGif',
          });
        }
        if (response && response.Message.includes('Record Already Exist')) {
          showToastAlert({
            type: 'custom_info',
            text: response.Message,
            gif: 'InfoGif',
          });
          return;
        }
        resetForm();
        navigate('/MainMaster/StaffMaster');
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
        isSubmitting,
      }) => {
        useEffect(() => {
          setPagesConfigData([
            ...pagesConfigData?.filter(
              (i) => i.fieldId !== 'SM_P_PrimaryDesignation'
            ),
            {
              fieldId: 'SM_P_PrimaryDesignation',
              translationId: 'MM_SM_PrimaryDesignation',
              component: 'Dropdown',
              name: 'primaryDesignation',
              options: pageLoadData?.Data.DesignationList?.filter((item) => {
                return item.DepartmentId === values.department;
              })?.map((designation) => ({
                text: designation.DesignationName,
                value: designation.DesignationId,
              })),
            },
          ]);
        }, [values]);
 
        useEffect(() => {
          if (values.status === 'Inactive') {
            setPageFields((prevItems) => {
              const index = prevItems.findIndex(
                (item) => item.FieldId === 'SM_P_Status'
              );
 
              if (index !== -1) {
                const updatedItems = [
                  ...prevItems.slice(0, index + 1),
                  {
                    FieldId: 'SM_P_Inactive',
                    IsShow: true,
                    IsMandatory: true,
                  },
                  ...prevItems.slice(index + 1),
                ];
                return updatedItems;
              }
              return prevItems;
            });
          } else {
            const pageFieldsData = fields?.Data?.Sections?.find(
              (section) => section.SectionName === 'Page'
            )?.Fields;
 
            setPageFields(pageFieldsData);
          }
        }, [values.status]);

        const imageUploadFields = (pageFields ?? [])
          .map((f) => ({
            field: f,
            config: pagesConfigData?.find(
              (config) => config.fieldId === f.FieldId
            ),
          }))
          .filter(
            ({ config }) =>
              config?.component === 'ImageUpload' &&
              (config?.translationId?.includes('MM_SM_UploadSignatureL') ||
                config?.translationId?.includes('MM_SM_EmployeeImage'))
          );

          return isFetchingStaffData || isLabelsFetching || isFieldsFetching ? (
          <FlexContainer justifyContent="center">
            <StyledImage src={LoadingGif} alt="LoadingGif" />
          </FlexContainer>
        ) : (
          <Grid container spacing={2} display={'flex'}>
            {pageFields?.map((field) => {
              const fieldConfig = pagesConfigData.find(
                (config) => config.fieldId === field.FieldId
              );
              const translatedLabel =
                field.FieldId === 'SM_P_Inactive'
                  ? 'Inactive Date'
                  : getlabel(fieldConfig?.translationId, labels, i18n.language);
 
              if (
                field.IsShow &&
                fieldConfig &&
                shouldRender(fieldConfig.name, values) &&
                fieldConfig.component !== 'ImageUpload'
              ) {
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
                    <Label
                      value={translatedLabel}
                      isRequired={field.IsMandatory}
                    />
                    {fieldConfig.component === 'TextField' && (
                      <TextField
                        name={fieldConfig.name}
                        value={values[fieldConfig.name] || ''}
                        onChange={handleChange}
                        slotProps={{
                          htmlInput: { maxLength: fieldConfig.maxLength },
                        }}
                      />
                    )}
                    {fieldConfig.component === 'Dropdown' && (
                      <SearchDropdown
                        name={fieldConfig.name}
                        options={[
                          { text: 'Select', value: '' },
                          ...(fieldConfig.options || []),
                        ]}
                        onChange={(event, value) => {
                          setFieldValue(fieldConfig.name, value?.value);
                          if (
                            fieldConfig.name === 'defaultFacility' &&
                            value?.value
                          ) {
                            triggerGetpageLoadData({
                              menuId: selectedMenu?.id,
                              loginUserId: userDetails?.UserId,
                              headerFacilityId: value?.value,
                            });
                          }
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
                        name={fieldConfig.name}
                        options={fieldConfig.options}
                      />
                    )}
 
                    {fieldConfig.component === 'DatePicker' && (
                      <Date
                        name={fieldConfig.name}
                        value={values[fieldConfig.name]}
                        onChange={(date) => {
                          setFieldValue(fieldConfig.name, date);
                        }}
                      />
                    )}
                    {errors[fieldConfig.name] && touched[fieldConfig.name] && (
                      <div style={{ color: 'red', fontSize: '11px' }}>
                        {errors[fieldConfig.name]}
                      </div>
                    )}
                  </Grid>
                );
              }
              return null;
            })}
            {imageUploadFields.length > 0 && (
              <Grid container item xs={12} spacing={2}>
                {imageUploadFields.map(
                  ({ field, config }) =>
                    field?.IsShow && (
                      <Grid
                        item
                        xs={12}
                        sm={6}
                        md={4}
                        lg={4}
                        key={field.FieldId}
                      >
                        <Label
                          value={getlabel(
                            config?.translationId,
                            labels,
                            i18n.language
                          )}
                          isRequired={field.IsMandatory}
                        />

                        <ImageUpload
                          name={config?.name}
                          imagetext="Image Area"
                          imagebutton={config?.label || ''}
                          value={values[config?.name]}
                          onChange={(event) => {
                            const fileInput = event.currentTarget;
                            const file = fileInput?.files[0];

                            if (file) {
                              const reader = new FileReader();
                              reader.readAsArrayBuffer(file);
                              reader.onload = () => {
                                const binaryData = reader.result;
                                const base64String = btoa(
                                  new Uint8Array(binaryData).reduce(
                                    (data, byte) =>
                                      data + String.fromCharCode(byte),
                                    ''
                                  )
                                );
                                setFieldValue(
                                  config?.name,
                                  `data:${file.type};base64,${base64String}`
                                );
                              };
                              fileInput.value = '';
                              reader.onerror = (error) => {
                                console.error('Error reading file:', error);
                              };
                            }
                          }}
                          onDelete={() => setFieldValue(config?.name, '')}
                        />

                        {errors[config?.name] && touched[config?.name] && (
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors[config?.name]}
                          </div>
                        )}
                      </Grid>
                    )
                )}
              </Grid>
            )}
            {dynamicFormData?.Data &&
              Array.isArray(dynamicFormData.Data) &&
              dynamicFormData.Data.length > 0 && (
                <Grid item xs={12} sm={12} padding={'10px'} md={12}>
                  <FlexContainer
                    className="staffmaster-wrapper"
                    flexDirection="column"
                  >
                    {/* <Label bold value={'Custom fields:'} /> */}
                    <ReactFormGenerator
                      key={JSON.stringify(
                        staffData?.Data?.FormBuilderData || []
                      )}
                      width="100%"
                      className="custom-width"
                      data={dynamicFormData?.Data || []}
                      onChange={(event) => {
                        setFieldValue('formBuilderData', event ? event : null);
                      }}
                      answer_data={
                        staffData?.Data?.FormBuilderData
                          ? staffData?.Data?.FormBuilderData
                          : null
                      }
                    />
                  </FlexContainer>
                </Grid>
              )}
 
            <FlexContainer
              gap="16px"
              justifyContent="flex-end"
              padding="25px 15px 40px 0px"
              width="100%"
            >
              <CommonStyledButton
                onClick={handleSubmit}
                variant="contained"
                text-color="#0083C0"
                startIcon={
                  <StyledImage
                    src={DoneIcon}
                    style={{ marginInlineEnd: 8 }}
                    sx={{
                      marginBottom: '1px',
                      color: '#FFFFFF',
                    }}
                  />
                }
              >
                <StyledTypography marginTop="1px" color="#FFFFFF">
                  {isSubmitting
                    ? id
                      ? t('Updating...')
                      : t('Submitting...')
                    : id
                      ? t('Update')
                      : t('Submit')}
                </StyledTypography>
              </CommonStyledButton>
              <CommonStyledButton
                type="button"
                variant="outlined"
                onClick={() => {
                  if (id) {
                    navigate('/MainMaster/StaffMaster');
                  } else {
                    resetForm();
                  }
                }}
                startIcon={
                  <StyledImage
                    src={DoNotDisturbIcon}
                    style={{ marginInlineEnd: 8 }}
                  />
                }
              >
                <StyledTypography marginTop="1px">
                  {t('Cancel')}
                </StyledTypography>
              </CommonStyledButton>
            </FlexContainer>
          </Grid>
        );
      }}
    </Formik>
  );
}
 
 