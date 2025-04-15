import React, { useEffect, useState } from 'react';
import Label from '../../../../../components/Label/Label';
import styled from 'styled-components';
import {
  Box,
  Grid,
  Select,
  MenuItem,
  Divider,
  Tooltip,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import { Field, useFormikContext } from 'formik';
import { useParams } from 'react-router-dom';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
} from '../../../../../utils/StyledComponents';
import { TextField } from '../../../../../components/TextField/TextField';
import SearchIcon from '@mui/icons-material/Search';
import AddSubMaster from '../../../../../assets/Icons/AddSubMaster.png';
import { useTranslation } from 'react-i18next';
import TextArea from '../../../../../components/TextArea/TextArea';
import { getIncidentlabel } from '../../../../../utils/language';
import SearchDropdown from '../../../../../components/SearchDropdown/SearchDropdown';
import ImmediateActionTakenTable from './ImmediateActionTakenTable';
import { useSelector } from 'react-redux';
import LoadingGif from '../../../../../assets/Gifs/LoadingGif.gif';
import Incidentcategorylist from './Incidentcategorylist';
import { useGetFormBuilderByIdQuery } from '../../../../../redux/RTK/formBuilderApi';
import { ReactFormGenerator } from 'react-form-builder2';
import { useLazyGetMCFormBuilderByIdQuery } from '../../../../../redux/RTK/IncidentManagement/incidentCategoryApi';
import { useGetReportPageLoadDataQuery } from '../../../../../redux/RTK/IncidentManagement/reportincidentApi';
import { map } from 'lodash';

const FormContainer = styled(Box)`
  margin: 20px;
  background-color: #fff;
`;

const StyledGridItem = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const IncidentCategoryForm = ({
  labels,
  fields,
  pageLoadData,
  isFetching,
  isLoading,
  IncidentData,
}) => {
  const { i18n } = useTranslation();
  const { id } = useParams();

  const firstGridConfig = [
    {
      fieldId: 'RI_P_IncidentTitle',
      translationId: 'IM_RI_IncidentTitle',
      component: 'Button',
      name: '',
      showFieldName: '',
      isFieldShow: true,
    },
  ];

  const secondGridConfigData = [
    {
      fieldId: 'RI_P_IncidentTitle',
      translationId: 'IM_RI_IncidentTitle',
      component: 'Button',
      name: '',
      grid: 2,
      showFieldName: '',
      isFieldShow: true,
    },
    {
      fieldId: 'RI_P_AffectedCategory',
      translationId: 'IM_RI_AffectedCategory',
      component: 'TextField',
      name: 'affectedCategory',
      showFieldName: '',
      isFieldShow: true,
      grid: 2,
      disabled: true,
    },
    {
      fieldId: 'RI_P_AffectedCategoryCode',
      translationId: 'IM_RI_AffectedCategoryCode',
      component: 'TextField',
      name: 'affectedCategoryCode',
      showFieldName: '',
      isFieldShow: true,
      grid: 2,
      disabled: true,
    },
    {
      fieldId: 'RI_P_IncidentMainCategory',
      translationId: 'IM_RI_IncidentMainCategory',
      component: 'TextField',
      name: 'mainCategory',
      showFieldName: '',
      isFieldShow: true,
      grid: 2,
      disabled: true,
    },
    {
      fieldId: 'RI_P_MainCategoryCode',
      translationId: 'IM_RI_MainCategoryCode',
      component: 'TextField',
      name: 'mainCategoryCode',
      showFieldName: '',
      isFieldShow: true,
      grid: 2,
      disabled: true,
    },
    {
      fieldId: 'RI_P_IncidentSubCategory',
      translationId: 'IM_RI_IncidentSubCategory',
      component: 'TextField',
      name: 'subCategory',
      showFieldName: '',
      isFieldShow: true,
      grid: 2,
      disabled: true,
    },
    {
      fieldId: 'RI_P_SubCategoryCode',
      translationId: 'IM_RI_SubCategoryCode',
      component: 'TextField',
      name: 'subCategoryCode',
      showFieldName: '',
      grid: 2,
      isFieldShow: true,
    },

    {
      fieldId: 'RI_P_IncidentDetail',
      translationId: 'IM_RI_IncidentDetail',
      component: 'TextField',
      name: 'incidentDetails',
      showFieldName: '',
      isFieldShow: true,
      grid: 2,
      disabled: true,
    },
    {
      fieldId: `RI_P_IncidentDetailsCode`,
      translationId: 'IM_RI_IncidentDetailsCode',
      component: 'TextField',
      name: 'incidentDetailsCode',
      showFieldName: '',
      isFieldShow: true,
      grid: 2,
      disabled: true,
    },
    {
      fieldId: 'RI_P_MedicationBrandNameInvolvedIfApplicable',
      translationId: 'IM_RI_MedicationBrandNameInvolvedIfApplicable',
      component: 'TextField',
      name: 'medicationBrandNameInvolvedIfApplicable',
      showFieldName: 'Medication Error',
      isFieldShow: false,
      grid: 2,
      disabled: false,
    },
    {
      fieldId: 'RI_P_MedicationGenricNameInvolvedIfApplicable',
      translationId: 'IM_RI_MedicationGenricNameInvolvedIfApplicable',
      component: 'TextField',
      name: 'medicationGenricNameInvolvedIfApplicable',
      showFieldName: 'Medication Error',
      isFieldShow: false,
      grid: 2,
      disabled: false,
    },
    {
      fieldId: 'RI_P_MedicationRoute',
      translationId: 'IM_RI_MedicationRoute',
      component: 'TextField',
      name: 'medicationRoute',
      showFieldName: 'Medication Error',
      isFieldShow: false,
      grid: 2,
      disabled: false,
    },
    {
      fieldId: 'RI_P_MedicationDose',
      translationId: 'IM_RI_MedicationDose',
      component: 'TextField',
      name: 'medicationDose',
      showFieldName: 'Medication Error',
      isFieldShow: false,
      grid: 2,
      disabled: false,
    },
    {
      fieldId: 'RI_P_MedicationForm',
      translationId: 'IM_RI_MedicationForm',
      component: 'TextField',
      name: 'medicationForm',
      showFieldName: 'Medication Error',
      isFieldShow: false,
      grid: 2,
      disabled: false,
    },
    {
      fieldId: 'RI_P_Medication(s)InvolvedGeneric',
      translationId: 'IM_RI_Medication(s)InvolvedGeneric',
      component: 'TextField',
      name: 'medicationInvolvedGeneric',
      showFieldName: 'Medication Error',
      isFieldShow: false,
      grid: 2,
      disabled: false,
    },
    {
      fieldId: 'RI_P_Medication(s)InvolvedBrand',
      translationId: 'IM_RI_Medication(s)InvolvedBrand',
      component: 'TextField',
      name: 'medicationInvolvedBrand',
      showFieldName: 'Medication Error',
      isFieldShow: false,
      grid: 2,
      disabled: false,
    },
    {
      fieldId: 'RI_P_ReactionCode',
      translationId: 'IM_RI_ReactionCode',
      component: 'Dropdown',
      name: 'reactionCode',
      options: [],
      showFieldName: 'Adverse Drug Reaction',
      isFieldShow: false,
      grid: 2,
      disabled: false,
    },
    {
      fieldId: 'RI_P_ReactionName',
      translationId: 'IM_RI_ReactionName',
      component: 'Dropdown',
      name: 'reactionName',
      options: [],
      showFieldName: 'Adverse Drug Reaction',
      isFieldShow: false,
      grid: 2,
      disabled: false,
    },
    {
      fieldId: 'RI_P_ConsentSinged?',
      translationId: 'IM_RI_ConsentSinged?',
      component: 'Radio',
      name: 'consentSinged',
      options: [
        { value: 'Yes', text: 'Yes' },
        { value: 'No', text: 'No' },
      ],
      showFieldName: 'Against Medical Advice',
      isFieldShow: false,
      grid: 2,
      disabled: false,
    },
    {
      fieldId: 'RI_P_Remarks',
      translationId: 'IM_RI_Remarks',
      component: 'TextField',
      name: 'remarks',
      showFieldName: '',
      isFieldShow: true,
      grid: 3,
      disabled: false,
    },
    {
      fieldId: 'RI_P_Dynamic_Questions',
      translationId: 'IM_RI_Dynamic_Questions',
      component: 'DynamicForm',
      name: 'dynamicQuestions',
      showFieldName: '',
      isFieldShow: true,
      grid: 3,
      disabled: false,
    },
    {
      fieldId: 'RI_P_BriefDescriptionofIncident',
      translationId: 'IM_RI_BriefDescriptionofIncident',
      component: 'Textarea',
      name: 'briefDescriptionOfIncident',
      showFieldName: '',
      isFieldShow: true,
      grid: 4,
      disabled: false,
    },
    {
      fieldId: 'RI_P_ImmediateActionTaken',
      translationId: 'IM_RI_ImmediateActionTaken',
      component: 'Textarea',
      name: 'actionTaken',
      showFieldName: '',
      isFieldShow: true,
      grid: 5,
      disabled: false,
    },
    {
      fieldId: 'RI_P_ImmediateActionTaken',
      translationId: 'IM_RI_ImmediateActionTaken',
      component: 'Table',
      showFieldName: '',
      isFieldShow: true,
      grid: 6,
      disabled: false,
    },
    {
      fieldId: 'RI_P_IncidentDepartment',
      translationId: 'IM_RI_IncidentDepartment',
      component: 'Dropdown',
      name: 'incidentDepartmentId',
      options: [],
      showFieldName: '',
      isFieldShow: true,
      grid: 7,
      disabled: false,
    },
    {
      fieldId: 'RI_P_LocationDetails(Roomnoetc)',
      translationId: 'IM_RI_LocationDetails(Roomnoetc)',
      component: 'TextField',
      name: 'locationDetails',
      maxLength: 100,
      showFieldName: '',
      isFieldShow: true,
      grid: 7,
      disabled: false,
    },
  ];

  const [secondFieldConfigData, setSecondFieldConfigData] =
    useState(secondGridConfigData);
  const [questionsData, setQuestionsData] = useState([]);
  const [isIncidentCategoryModel, setIsIncidentCategoryModel] = useState(false);
  const {
    selectedMenu,
    selectedModuleId,
    selectedFacility,
    userDetails,
    isSuperAdmin,
    roleFacilities,
  } = useSelector((state) => state.auth);
  const {
    values,
    handleChange,
    setFieldValue,
    errors,
    setErrors,
    handleBlur,
    touched,
  } = useFormikContext();
  const [triggerGetFormBuilderData] = useLazyGetMCFormBuilderByIdQuery();

  const { data: incidentMainData, isFetching: isFetchingData } =
    useLazyGetMCFormBuilderByIdQuery({
      headerFacilityId: 2,
      loginUserId: userDetails?.UserId,
      pageModuleId: 2,
      // pageModuleId: selectedModuleId,
      pageMenuId: 21,
      facilityId: 2,
      menuId: 24,
      mainCategoryId: values?.incidentMainCategory,
    });

  const { data: ReactionDetails = [], isFetching: isIncidentFetching } =
    useGetReportPageLoadDataQuery({
      facilityId: selectedFacility?.id,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
    });

  const staffData = [];

  const dynamicFormData = incidentMainData?.Data?.incidentFormBuilderData;

  const mainCategoryMetaData = dynamicFormData?.mainCategoryMetaData || [];
  const subCategoryMetaData = dynamicFormData?.subCategoryMetaData || [];
  const incidentDetailMetaData = dynamicFormData?.incidentDetailMetaData || [];

  const ABDRegionList = userDetails.ApplicableFacilities.find(
    (facility) => facility.RegionCode === 'ABD'
  );
  const ABDRegion = selectedFacility.name === ABDRegionList?.FacilityName;

  // const { data: dynamicFormData } = useGetFormBuilderByIdQuery(
  //   {
  //     menuId: selectedMenu?.id,
  //     loginUserId: userDetails?.UserId,
  //     moduleId: selectedModuleId,
  //     headerFacilityId: selectedFacility?.id,
  //     tabs:tabs?tabs:0
  //   },
  //   { skip: !selectedMenu?.id || !userDetails?.UserId || !selectedModuleId }
  // );

  useEffect(() => {
    if (id && IncidentData) {
      setFieldValue(
        'mainCategoryId',
        IncidentData?.reportIncident?.MainCategoryId
      );
      setFieldValue(
        'subCategoryId',
        IncidentData?.reportIncident?.SubCategoryId
      );
      setFieldValue(
        'incidentDetailId',
        IncidentData?.reportIncident?.IncidentDetailId
      );
      setFieldValue(
        'mainCategory',
        IncidentData?.reportIncident?.MainCategory || ''
      );
      setFieldValue(
        'subCategory',
        IncidentData?.reportIncident?.SubCategory || ''
      );
      setFieldValue(
        'incidentDetails',
        IncidentData?.reportIncident?.IncidentDetail || ''
      );

      setFieldValue(
        'medicationBrandNameInvolvedIfApplicable',
        IncidentData?.reportIncident?.MedicationBrandNameInvolvedIfApplicable ||
          ''
      );
      setFieldValue(
        'medicationGenricNameInvolvedIfApplicable',
        IncidentData?.reportIncident
          ?.MedicationGenricNameInvolvedIfApplicable || ''
      );
      setFieldValue(
        'medicationRoute',
        IncidentData?.reportIncident?.MedicationRoute || ''
      );
      setFieldValue(
        'medicationDose',
        IncidentData?.reportIncident?.MedicationDose || ''
      );
      setFieldValue(
        'medicationForm',
        IncidentData?.reportIncident?.MedicationForm || ''
      );
      setFieldValue(
        'medicationInvolvedGeneric',
        IncidentData?.reportIncident?.MedicationInvolvedGeneric || ''
      );
      setFieldValue(
        'medicationInvolvedBrand',
        IncidentData?.reportIncident?.MedicationInvolvedBrand || ''
      );
      setFieldValue(
        'reactionCode',
        parseInt(IncidentData?.reportIncident?.ReactionCode) || ''
      );
      setFieldValue(
        'reactionName',
        IncidentData?.reportIncident?.ReactionName || ''
      );
      setFieldValue(
        'consentSinged',
        IncidentData?.reportIncident?.consentSinged || 'Yes'
      );

      setFieldValue('remarks', IncidentData?.reportIncident?.Remarks || '');
      setFieldValue(
        'briefDescriptionOfIncident',
        IncidentData?.reportIncident?.BriefDescriptionOfIncident || ''
      );
      setFieldValue(
        'actionTaken',
        IncidentData?.reportIncident?.ActionTaken || ''
      );
      setFieldValue(
        'locationDetails',
        IncidentData?.reportIncident?.LocationDetails || ''
      );
      setFieldValue(
        'incidentDepartmentId',
        IncidentData?.reportIncident?.DepartmentId || ''
      );
    }
  }, [IncidentData]);

  const handleClose = () => {
    setIsIncidentCategoryModel(false);
  };

  useEffect(() => {
    if (
      pageLoadData?.Data?.DepartmentList.length > 0 ||
      pageLoadData?.Data?.ReactionCodeList.length > 0
    ) {
      const updateConfig = secondFieldConfigData.map((item) => {
        if (item.name === 'incidentDepartmentId') {
          return {
            ...item,
            options:
              pageLoadData?.Data?.DepartmentList?.map((department) => ({
                text: department.DepartmentName,
                value: department.DepartmentId,
              })) || [],
          };
        }
        if (item.name === 'reactionName') {
          return {
            ...item,
            options:
              pageLoadData?.Data?.ReactionCodeList?.map((ReactionCode) => {
                return {
                  text: ReactionCode.ReactionName,
                  value: ReactionCode.ReactionName,
                };
              }) || [],
          };
        }
        if (item.name === 'reactionCode') {
          return {
            ...item,
            options:
              pageLoadData?.Data?.ReactionCodeList?.map((ReactionCode) => {
                return {
                  text: ReactionCode.ReactionCode,
                  value: ReactionCode.ReactionId,
                };
              }) || [],
          };
        }
        return item;
      });
      setSecondFieldConfigData(updateConfig);
    }
  }, [pageLoadData]);

  useEffect(() => {
    if (
      values?.mainCategory === 'Medication Error' ||
      values?.subCategory === 'Adverse Drug Reaction'
    ) {
      const newFieldConfigData = secondFieldConfigData.map((item) =>
        item.showFieldName === 'Medication Error' ||
        item.showFieldName === values?.subCategory ||
        item.showFieldName === 'Against Medical Advice'
          ? { ...item, isFieldShow: true }
          : item
      );
      setSecondFieldConfigData(newFieldConfigData);
    }
  }, [values?.mainCategory, values?.subCategory]);

  useEffect(() => {
    const getFormBuilderData = async () => {
      if (values?.facilityId && values?.incidentDetailId) {
        const response = await triggerGetFormBuilderData({
          payload: {
            headerFacilityId: selectedFacility?.id,
            loginUserId: userDetails?.UserId,
            pageModuleId: selectedModuleId,
            pageMenuId: selectedMenu?.id,
            facilityId: values?.facilityId,
            menuId: selectedMenu?.id,
            incidentDetailId: values?.incidentDetailId,
          },
        });
        if (response?.data) {
          setQuestionsData(response?.data?.Data);
        }
      }
    };
    getFormBuilderData();
  }, [values?.facilityId, values?.incidentDetailId]);

  const handleSelectRow = (incident) => {
    setFieldValue('mainCategoryId', incident?.MainCategoryId);
    setFieldValue('subCategoryId', incident?.SubCategoryId);
    setFieldValue('incidentDetailId', incident?.IncidentDetailId);

    // setFieldValue('mainCategory', 'Medication Error');
    // setFieldValue('subCategory', 'Adverse Drug Reaction');
    // setFieldValue('incidentDetails', 'Against Medical Advice');

    setFieldValue('mainCategory', incident?.MainCategory);
    setFieldValue('subCategory', incident?.SubCategory);
    setFieldValue('incidentDetails', incident?.IncidentDetail);
    handleClose();
  };
  const handleSearch = () => {
    setIsIncidentCategoryModel(true);
  };

  const getGridColumns = (fieldConfig) => {
    if (fieldConfig.component === 'Button' || fieldConfig.component === 'Table')
      return 12;
    if (
      fieldConfig.fieldId === 'RI_P_IncidentDepartment' ||
      fieldConfig.fieldId === 'RI_P_LocationDetails(Roomnoetc)'
    )
      return 6;
    return 4;
  };

  const updatedFacilities =
    userDetails?.ApplicableFacilities?.filter((facility) => {
      if (!facility.IsActive) return false;
      if (isSuperAdmin) return true;
      const facilityItem = roleFacilities
        ?.find((role) => role.FacilityId === facility.FacilityId)
        ?.Menu?.find((MenuItem) => MenuItem.MenuId === selectedMenu?.id);
      return facilityItem?.IsAdd;
    }).map((facility) => ({
      FacilityName: facility.FacilityName,
      FacilityId: facility.FacilityId,
    })) || [];

  const handleRadioChange = (event) => {
    setFieldValue('consentSinged', event.target.value);
  };
  return isLoading ? (
    <FlexContainer justifyContent="center">
      <StyledImage src={LoadingGif} alt="LoadingGif" />
    </FlexContainer>
  ) : (
    <FormContainer>
      <Grid container xs={12} spacing={2}>
        <Grid item xs={12} container spacing={2} alignItems={'center'}>
          {secondFieldConfigData?.map((fieldConfig, index) => {
            const field = fields?.find(
              (i) => i.FieldId === fieldConfig.fieldId
            );

            const translatedLabel = getIncidentlabel(
              fieldConfig?.translationId,
              labels,
              i18n.language
            );
            return (
              <>
                {fieldConfig.grid === 2 &&
                  fieldConfig.isFieldShow &&
                  fieldConfig.component === 'Button' && (
                    <Grid item xs={12} md={4} lg={4}>
                      <Box display={'flex'} alignItems={'center'} gap={2}>
                        <Label
                          value={translatedLabel}
                          // isRequired={field.IsMandatory}
                        />
                        <Tooltip title="View Category">
                          <IconButton
                            size="small"
                            sx={{
                              padding: '5px',
                              color: '#fff',
                              borderRadius: '5px',
                              background: 'green',
                            }}
                            onClick={handleSearch}
                          >
                            <SearchIcon sx={{ fontSize: 20 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                  )}
                {fieldConfig.grid === 2 &&
                  fieldConfig.isFieldShow &&
                  fieldConfig.component === 'TextField' &&
                  !(
                    selectedFacility?.id === 3 &&
                    [
                      'RI_P_AffectedCategoryCode',
                      'RI_P_MainCategoryCode',
                      'RI_P_SubCategoryCode',
                      'RI_P_IncidentDetailsCode',
                      'RI_P_AffectedCategory',
                    ].includes(fieldConfig.fieldId)
                  ) && (
                    <Grid key={index} item xs={12} md={4} lg={4}>
                      <Label
                        value={translatedLabel}
                        isRequired={field?.IsMandatory}
                      />
                      <TextField
                        fullWidth
                        name={fieldConfig.name}
                        value={values[fieldConfig.name] || ''}
                        onChange={handleChange}
                        disabled={fieldConfig.disabled}
                        slotProps={{
                          htmlInput: { maxLength: fieldConfig.maxLength },
                        }}
                      />
                      {errors[fieldConfig.name] &&
                        touched[fieldConfig.name] && (
                          //  (values[fieldConfig.name]==="Medication Error" ||values[fieldConfig.name]==="Adverse Drug Reaction" ||values[fieldConfig.name]==="Against Medical Advice")
                          //  &&errors[fieldConfig.name]&&touched[fieldConfig.name]
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors[fieldConfig.name]}
                          </div>
                        )}
                    </Grid>
                  )}
              </>
            );
          })}
        </Grid>
        <Grid item xs={12} container spacing={2} alignItems={'center'}>
          {secondFieldConfigData?.map((fieldConfig, index) => {
            const field = fields?.find(
              (i) => i.FieldId === fieldConfig.fieldId
            );
            const translatedLabel = getIncidentlabel(
              fieldConfig?.translationId,
              labels,
              i18n.language
            );
            return (
              <>
                {fieldConfig.grid === 2 &&
                  fieldConfig?.isFieldShow &&
                  fieldConfig.component === 'Dropdown' && (
                    <Grid key={index} item xs={12} md={4} lg={4}>
                      <Label
                        value={translatedLabel}
                        isRequired={field?.IsMandatory}
                      />
                      <SearchDropdown
                        name={fieldConfig.name}
                        options={[
                          { text: 'Select', value: '' },
                          ...(fieldConfig.options || []),
                        ]}
                        onChange={(event, value) => {
                          if (fieldConfig.name === 'incidentDepartmentId') {
                            setFieldValue('incidentDepartmentId', value?.value);
                            setFieldValue(
                              'incidentDepartmentName',
                              value?.text
                            );
                          } else {
                            setFieldValue(fieldConfig.name, value?.value);
                          }
                        }}
                        value={
                          fieldConfig?.options?.find(
                            (option) =>
                              option.value === values[fieldConfig.name]
                          ) || null
                        }
                      />
                      {errors[fieldConfig.name] &&
                        touched[fieldConfig.name] && (
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors[fieldConfig.name]}
                          </div>
                        )}
                    </Grid>
                  )}
                {fieldConfig.grid === 2 &&
                  fieldConfig?.isFieldShow &&
                  fieldConfig.component === 'Radio' && (
                    <Grid key={index} item xs={12} md={4} lg={4}>
                      <Label
                        value={translatedLabel}
                        isRequired={field?.IsMandatory}
                      />
                      <RadioGroup row defaultValue={fieldConfig.defaultValue}>
                        {fieldConfig.options?.map((i) => (
                          <FormControlLabel
                            value={i.value}
                            control={<Radio />}
                            label={i.text}
                            checked={values?.consentSinged == i.value}
                            onChange={handleRadioChange}
                            sx={{
                              '& .MuiFormControlLabel-label': {
                                fontSize: '12px',
                              },
                            }}
                          />
                        ))}
                      </RadioGroup>
                      {errors[fieldConfig.name] &&
                        touched[fieldConfig.name](
                          <div style={{ color: 'red', fontSize: '11px' }}>
                            {errors[fieldConfig.name]}
                          </div>
                        )}
                    </Grid>
                  )}
              </>
            );
          })}
        </Grid>
        <Grid item xs={12} container spacing={2} alignItems={'center'}>
          {secondFieldConfigData?.map((fieldConfig, index) => {
            const field = fields?.find(
              (i) => i.FieldId === fieldConfig.fieldId
            );
            console.log('field.gee', field);
            const translatedLabel = getIncidentlabel(
              fieldConfig?.translationId,
              labels,
              i18n.language
            );
            if (
              fieldConfig.grid === 3 &&
              fieldConfig?.isFieldShow &&
              fieldConfig.component === 'TextField'
            ) {
              return (
                <Grid key={index} item xs={12}>
                  <Label
                    value={translatedLabel}
                    isRequired={field?.IsMandatory}
                  />
                  <TextField
                    fullWidth
                    name={fieldConfig.name}
                    value={values[fieldConfig.name] || ''}
                    onChange={handleChange}
                    disabled={fieldConfig.disabled}
                    slotProps={{
                      htmlInput: { maxLength: fieldConfig.maxLength },
                    }}
                  />
                  {errors[fieldConfig.name] && touched[fieldConfig.name] && (
                    <div style={{ color: 'red', fontSize: '11px' }}>
                      {errors[fieldConfig.name]}
                    </div>
                  )}
                </Grid>
              );
            }
          })}
        </Grid>
        <Grid item xs={12} container spacing={2} alignItems={'center'}>
          {secondFieldConfigData?.map((fieldConfig, index) => {
            const field = fields?.find(
              (i) => i.FieldId === fieldConfig.fieldId
            );
            if (
              fieldConfig.grid === 3 &&
              fieldConfig?.isFieldShow &&
              questionsData &&
              Array.isArray(questionsData) &&
              questionsData.length > 0 &&
              fieldConfig.component === 'DynamicForm'
            ) {
              return (
                <Grid key={index} item xs={12}>
                  <Label value={'Questions'} />
                  <FlexContainer
                    className="incident-category-form-wrapper"
                    flexDirection="column"
                  >
                    <ReactFormGenerator
                      width="100%"
                      className="custom-width"
                      data={questionsData || []}
                      onChange={(event) => {
                        setFieldValue('formBuilderData', event ? event : null);
                      }}
                    />
                  </FlexContainer>
                </Grid>
              );
            }
          })}
        </Grid>
        <Grid item xs={12} container spacing={2} alignItems={'center'}>
          {secondFieldConfigData?.map((fieldConfig, index) => {
            const field = fields?.find(
              (i) => i.FieldId === fieldConfig.fieldId
            );
            const translatedLabel = getIncidentlabel(
              fieldConfig?.translationId,
              labels,
              i18n.language
            );
            if (
              fieldConfig.grid === 4 &&
              fieldConfig?.isFieldShow &&
              fieldConfig.component === 'Textarea'
            ) {
              return (
                <Grid key={index} item xs={12}>
                  <Label
                    value={translatedLabel}
                    isRequired={field?.IsMandatory}
                  />
                  <TextArea
                    name={fieldConfig.name}
                    value={values[fieldConfig.name] || ''}
                    onChange={handleChange}
                  />
                  {errors[fieldConfig.name] && touched[fieldConfig.name] && (
                    <div style={{ color: 'red', fontSize: '11px' }}>
                      {errors[fieldConfig.name]}
                    </div>
                  )}
                </Grid>
              );
            }
          })}
        </Grid>
        <Grid item xs={12} container spacing={2} alignItems={'center'}>
          {secondFieldConfigData?.map((fieldConfig, index) => {
            const field = fields?.find(
              (i) => i.FieldId === fieldConfig.fieldId
            );
            const translatedLabel = getIncidentlabel(
              fieldConfig?.translationId,
              labels,
              i18n.language
            );
            if (
              fieldConfig.grid === 5 &&
              fieldConfig?.isFieldShow &&
              fieldConfig.component === 'Textarea'
            ) {
              return (
                <Grid key={index} item xs={12}>
                  <Label
                    value={translatedLabel}
                    isRequired={field?.IsMandatory}
                  />
                  <TextArea
                    name={fieldConfig.name}
                    value={values[fieldConfig.name] || ''}
                    onChange={handleChange}
                  />
                  {errors[fieldConfig.name] && touched[fieldConfig.name] && (
                    <div style={{ color: 'red', fontSize: '11px' }}>
                      {errors[fieldConfig.name]}
                    </div>
                  )}
                </Grid>
              );
            }
          })}
        </Grid>
        <Grid item xs={12} container spacing={2} alignItems={'center'}>
          {secondFieldConfigData?.map((fieldConfig, index) => {
            const field = fields?.find(
              (i) => i.FieldId === fieldConfig.fieldId
            );
            const translatedLabel = getIncidentlabel(
              fieldConfig?.translationId,
              labels,
              i18n.language
            );
            if (
              fieldConfig.grid === 6 &&
              fieldConfig?.isFieldShow &&
              fieldConfig.component === 'Table'
            ) {
              return (
                <Grid key={index} item xs={12}>
                  <Label
                    value={translatedLabel}
                    // isRequired={field?.IsMandatory}
                  />
                  <ImmediateActionTakenTable IncidentData={IncidentData} />
                  <Divider sx={{ marginY: '20px' }} />
                </Grid>
              );
            }
          })}
        </Grid>
        <Grid item xs={12} container spacing={2} alignItems={'center'}>
          {secondFieldConfigData?.map((fieldConfig, index) => {
            const field = fields?.find(
              (i) => i.FieldId === fieldConfig.fieldId
            );
            const translatedLabel = getIncidentlabel(
              fieldConfig?.translationId,
              labels,
              i18n.language
            );
            if (
              fieldConfig.grid === 7 &&
              fieldConfig?.isFieldShow &&
              fieldConfig.component === 'Dropdown'
            ) {
              return (
                <Grid key={index} item xs={12} md={6} lg={6}>
                  <Label
                    value={translatedLabel}
                    isRequired={field?.IsMandatory}
                  />
                  <SearchDropdown
                    name={fieldConfig.name}
                    options={[
                      { text: 'Select', value: '' },
                      ...(fieldConfig.options || []),
                    ]}
                    onChange={(event, value) => {
                      if (fieldConfig.name === 'incidentDepartmentId') {
                        setFieldValue('incidentDepartmentId', value?.value);
                        setFieldValue('incidentDepartmentName', value?.text);
                      } else {
                        setFieldValue(fieldConfig.name, value?.value);
                      }
                    }}
                    value={
                      fieldConfig?.options?.find(
                        (option) => option.value === values[fieldConfig.name]
                      ) || null
                    }
                  />
                  {errors[fieldConfig.name] && touched[fieldConfig.name] && (
                    <div style={{ color: 'red', fontSize: '11px' }}>
                      {errors[fieldConfig.name]}
                    </div>
                  )}
                </Grid>
              );
            }
            if (
              fieldConfig.grid === 7 &&
              fieldConfig?.isFieldShow &&
              fieldConfig.component === 'TextField'
            ) {
              return (
                <Grid key={index} item xs={12} md={6} lg={6}>
                  <Label
                    value={translatedLabel}
                    isRequired={field?.IsMandatory}
                  />
                  <TextField
                    fullWidth
                    name={fieldConfig.name}
                    value={values[fieldConfig.name] || ''}
                    onChange={handleChange}
                    disabled={fieldConfig.disabled}
                    slotProps={{
                      htmlInput: { maxLength: fieldConfig.maxLength },
                    }}
                  />
                  {errors[fieldConfig.name] && touched[fieldConfig.name] && (
                    <div style={{ color: 'red', fontSize: '11px' }}>
                      {errors[fieldConfig.name]}
                    </div>
                  )}
                </Grid>
              );
            }
          })}
        </Grid>

        <Grid item xs={12} container spacing={2} alignItems={'center'}></Grid>
        <Incidentcategorylist
          isIncidentCategoryModel={isIncidentCategoryModel}
          handleSelectRow={handleSelectRow}
          handleClose={handleClose}
          pageloadData={pageLoadData}
        />
      </Grid>
    </FormContainer>
  );
};

export default IncidentCategoryForm;
