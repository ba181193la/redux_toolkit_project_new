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
import { getlabel } from '../../../../utils/IncidentLabels';
import {
  resetCompletedFilters,
  setCompletedFilters,
  setIsCompletedFilterApplied,
} from '../../../../redux/features/mainMaster/opinionSlice';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import { Grid, InputAdornment, TextField } from '@mui/material';
import SearchDropdown from '../../../../components/SearchDropdown/SearchDropdown';
import Search from '../../../../assets/Icons/Search.png';
import {
  useGetOpinionByIdQuery,
  useGetOpinionPageLoadDataQuery,
} from '../../../../redux/RTK/IncidentOinionApi';
import { useGetFieldsQuery } from '../../../../redux/RTK/moduleDataApi';
import Date from '../../../../components/Date/Date';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import EmployeeNameModel from './EmployeeNameModel';

const FilterCompletedFields = ({ handleToggleFilter, searchLabels }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const { isMobile } = useWindowDimension();
  const [isEmployeeModel, setIsEmployeeModel] = useState(false);
  const { id } = useParams();
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [selectedFacilityId, setSelectedFacilityId] = useState('');

  const {
    selectedMenu,
    selectedModuleId,
    roleFacilities,
    isSuperAdmin,
    userDetails,
    selectedFacility,
  } = useSelector((state) => state.auth);
  const { pageSize, pageIndex, IncidentDetailId, IncidentId, ReportedUserId, facilityId } =
    useSelector((state) => state.opinion.completedFilters);

  const { data: fields = [], isFetching: isFieldsFetching } = useGetFieldsQuery(
    {
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    }
  );

  const searchFields = fields?.Data?.Menus?.find(
    (menu) => menu.MenuId === selectedMenu?.id
  )?.Sections?.find((sec) => sec.SectionName === 'Search')?.Regions?.[0]
    ?.Fields;


  const updatedFacilities =
    userDetails?.ApplicableFacilities?.filter((facility) => {
      return facility.FacilityName !== 'All';
    }) || [];

  const { data } = useGetOpinionPageLoadDataQuery({
    menuId: 28,
    moduleId: 2,
    loginUserId: 1,
    facilityId: selectedFacility?.id,
  });

  const initialValues = {
    // facilityId: facilityId || [],
    IncidentDetailId: IncidentDetailId || 0,
    IncidentId: IncidentId || 0,
    ReportedUserId: ReportedUserId || 0,
  };
  const fieldsConfig = [
    {
      fieldId: 'O_S_Facility',
      translationId: 'IM_O_Facility',
      component: 'Dropdown',
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
      })),
    },
    {
      fieldId: 'O_S_IncidentFromDate',
      translationId: 'IM_O_IncidentFromDate',
      component: 'Date',
      name: 'incidentFromDate',
      maxLength: 100,
    },
    {
      fieldId: 'O_S_IncidentToDate',
      translationId: 'IM_O_IncidentToDate',
      component: 'Date',
      name: 'incidentToDate',
      maxLength: 100,
    },
    {
      fieldId: 'O_S_IncidentNumber',
      translationId: 'IM_O_IncidentNumber',
      component: 'Dropdown',
      name: 'incidentNumber',
      options: data?.Data?.Result?.IncidentNumberCompleted?.map((incidentNo) => ({
        text: incidentNo.IncidentNo,
        value: incidentNo.IncidentId,
      })),
    },
    {
      fieldId: 'O_S_IncidentDetails',
      translationId: 'IM_O_IncidentDetails',
      component: 'Dropdown',
      name: 'incidentDetails',
      options: data?.Data?.Result?.IncidentDetailPending?.map(
        (incidentDetails) => ({
          text: incidentDetails.IncidentDetail,
          value: incidentDetails.IncidentDetailId,
        })
      ),
    },
    {
      fieldId: 'O_S_RequestedBy',
      translationId: 'IM_O_RequestedBy',
      component: 'TextField',
      name: 'RequestedBy',
      maxLength: 100,
    },
  ];

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

  const handleEmployeeModel = () => {
    setIsEmployeeModel(true);
  };

  const handleEmployeModelClose = () => {
    setIsEmployeeModel(false);
    setSelectedFacilityId('');
  };

  return (
    <>
      <Label>{t('SelectFilter')}</Label>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={async (values) => {
          try {        
            dispatch(
              setCompletedFilters({
                // pageIndex: pageIndex,
                // pageSize,
                // headerFacility: selectedFacility?.id,
                // loginUserId: userDetails.UserId,
                // moduleId: selectedModuleId,
                // menuId: selectedMenu?.id,
                // facilityId: Array.isArray(values.facility) ? values.facility.join(',') : values.facility,
                // incidentId: values.IncidentId,
                // requestedUserId: values.ReportedUserId,
                // loginUserId: userDetails?.UserId,
                // moduleId: selectedModuleId,
                // menuId: selectedMenu?.id,
                // incidentDetailId: values.IncidentDetailId,
                pageIndex: pageIndex,
                pageSize,
                headerFacility: selectedFacility?.id,
                loginUserId: userDetails.UserId,
                moduleId: selectedModuleId,
                menuId: selectedMenu?.id,
                facilityId: Array.isArray(values.facility)
                  ? values.facility.join(',')
                  : values.facility,
                incidentId: values.incidentNumber,
                requestedUserId: values.requestedUserId,
                loginUserId: userDetails?.UserId,
                moduleId: selectedModuleId,
                menuId: selectedMenu?.id,
                incidentFromDate: values?.incidentFromDate,
                incidentToDate: values?.incidentToDate,
                incidentDetailId: values.incidentDetails,
              })
            );
        
            dispatch(setIsCompletedFilterApplied(true));
        
            handleToggleFilter();
          } catch (error) {
            console.error("Error in onSubmit:", error);
            alert("An error occurred while submitting the form. Please try again.");
          }
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
                searchLabels,
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
                    {fieldConfig.component === 'Date' && (
                      <Date
                        name={fieldConfig.name}
                        value={values[fieldConfig.name]}
                        onChange={(date) => {
                          setFieldValue(fieldConfig.name, date);
                        }}
                      />
                    )}
                    {/* {fieldConfig.component === 'TextField' && (
                      <TextField
                      name={fieldConfig.name}
                      value={
                        (id
                          ? userAssignmentData?.Data?.UserName
                          : selectedRowData?.StaffName) || ''
                      }
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="start">
                            <StyledImage
                              src={Search}
                              alt="Search Icon"
                              cursor={
                                id ? 'not-allowed' : 'pointer'
                              }
                              onClick={
                                id
                                  ? undefined
                                  : handleEmployeeModel
                              }
                              style={{ opacity: id ? 0.5 : 1 }}
                            />
                          </InputAdornment>
                        ),
                      }}
                    />
                    )} */}
                    {fieldConfig.component === 'TextField' && (
                      <TextField
                        name={fieldConfig.name}
                        value={
                          (id
                            ? userAssignmentData?.Data?.UserName
                            : selectedRowData?.StaffName) || ''
                        }
                        sx={{ width: '260px' }}
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="start">
                              <StyledImage
                                src={Search}
                                alt="Search Icon"
                                cursor={id ? 'not-allowed' : 'pointer'}
                                onClick={id ? undefined : handleEmployeeModel}
                                style={{ opacity: id ? 0.5 : 1 }}
                              />
                            </InputAdornment>
                          ),
                        }}
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
                  dispatch(resetCompletedFilters());
                  setSelectedRowData(null);
                }}
              >
                {t('ClearAll')}
              </StyledButton>
              <EmployeeNameModel
                open={isEmployeeModel}
                onClose={handleEmployeModelClose}
                // pageLoadData={pageLoadData}
                allFacilities={updatedFacilities}
                setSelectedRowData={setSelectedRowData}
                selectedRowData={selectedRowData}
                setIsEmployeeModel={setIsEmployeeModel}
                selectedFacilityId={selectedFacilityId}
                setSelectedFacilityId={setSelectedFacilityId}
              />
            </Grid>
          </Grid>
        )}
      </Formik>
    </>
  );
};

export default FilterCompletedFields;
