import {
    FormControlLabel,
    Grid,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
  } from '@mui/material';
  import React, { useState, useEffect } from 'react';
  import {
    FlexContainer,
    StyledTypography,
  } from '../../../../utils/StyledComponents';
  import { FormContainer, FormLabel } from '../../IncidentCommon/IncidentInvestigation.styled';
  import ApproveIncidentTable from '../../IncidentCommon/Datatable/ApproveIncidentTable';
  import { useTranslation } from 'react-i18next';
  import {
    useGetFieldsQuery,
    useGetLabelsQuery,
  } from '../../../../redux/RTK/moduleDataApi';
  import { getlabel } from '../../../../utils/language';
  import { useGetIncidentApprovalPendingByIdQuery } from '../../../../redux/RTK/incidentInvestigationApi';
  import {  useParams } from 'react-router-dom';
  import { useSelector } from 'react-redux';
  import formatDate from '../../../../utils/FormatDate';
  
  const IncidentApprovalDetails = () => {
    const { i18n, t } = useTranslation();
    const { id } = useParams();
  
    const {
      selectedMenu,
      userDetails,
      selectedFacility,
      selectedModuleId,
      roleFacilities,
      isSuperAdmin,
    } = useSelector((state) => state.auth);
  
    const { data: approvalData, isFetching: isFetchingData } =
      useGetIncidentApprovalPendingByIdQuery(
        {
          menuId: 28,
          loginUserId: userDetails?.UserId,
          incidentId: id,
          //  moduleId: 2
        },
        { skip: !id }
      );
  
    const { incidentApproval, incidentApprovalInvestigators } =
      approvalData?.Data || {};
  
    const incidentApprovalSafe = incidentApproval || {};
    const incidentApprovalInvestigatorsSafe = incidentApprovalInvestigators || [];
      
    const fieldsConfig = [
      {
        fieldId: `IA_P_IncidentMainCategory`,
        translationId: 'IM_IA_IncidentMainCategory',
        label: 'Incident Main Category',
        name: 'IncidentMainCategory',
      },
      {
        fieldId: `IA_P_IncidentSubCategory`,
        translationId: 'IM_IA_IncidentSubCategory',
        label: 'Incident Sub Category',
        name: 'SubCategory',
      },
      {
        fields: `IA_P_IncidentDetails`,
        translationId: 'IM_IA_IncidentDetails',
        label: 'Incident Details',
        name: 'IncidentDetail',
      },
      {
        fieldId: `IA_P_IncidentType`,
        translationId: 'IM_IA_IncidentType',
        label: 'Incident Type',
        name: 'IncidentTypeName',
      },
      {
        fieldId: `IA_P_Clinical/NonClinical`,
        translationId: 'IM_IA_Clinical/NonClinical',
        label: 'Clinical/Non-Clinical',
        name: 'ClinicalType',
      },
      {
        fieldId: `IA_P_IncidentDepartment`,
        translationId: 'IM_IA_IncidentDepartment',
        label: 'Incident Department',
        name: 'DepartmentName',
      },
      {
        fieldId: `IA_P_LocationDetails(Roomnoetc)`,
        translationId: 'IM_IA_LocationDetails(Roomnoetc)',
        label: 'Location Details/Room No etc',
        name: 'LocationDetials',
      },
      {
        fieldId: `IA_P_HarmLevel`,
        translationId: 'IM_IA_HarmLevel',
        label: 'Harm Level',
        name: 'IncidentHarmLevel',
      },
      {
        fieldId: `IA_P_Anyadditionalstaffyouwishtobenotified`,
        translationId: 'IM_IA_Anyadditionalstaffyouwishtobenotified',
        label: 'Any Additional Staff You Wish To Be Notified',
        name: 'AdditionalStaffNotify',
      },
      {
        fieldId: `IA_P_ApprovedBy`,
        translationId: 'IM_IA_ApprovedBy',
        label: 'Approved By',
        name: 'ApprovedBy',
      },
      {
        fieldId: `IA_P_ApprovedDate`,
        translationId: 'IM_IA_ApprovedDate',
        label: 'Approved Date',
        name: 'ApprovalDate',
      },
      {
        fieldId: `IA_P_ApprovedTime`,
        translationId: 'IM_IA_ApprovedTime',
        label: 'Approved Time',
        name: 'ApprovalTime',
      },
      {
        fieldId: `IA_P_IncidentStatus`,
        translationId: 'IM_IA_IncidentStatus',
        label: 'Status',
        name: 'ApproverStatus',
      },
    ];
  
    const AssignedInvestigator = [
      {
        fieldId: `IA_P_AssignedInvestigator(s)`,
        translationId: 'IM_IA_InvestigatorName',
        label: 'Name',
        name: 'UserName',
      },
      {
        fieldId: `IA_AI_Department`,
        translationId: 'IM_IA_Department',
        label: 'Department',
        name: 'DepartmentName',
      },
      {
        fieldId: `IA_AI_Designation`,
        translationId: 'IM_IA_Designation',
        label: 'Designation',
        name: 'DesignationName',
      },
      {
        fieldId: `IA_AI_InvestigationComments`,
        translationId: 'IM_IA_InvestigationComments',
        label: 'Investigation Comments',
        name: 'Comments',
      },
      {
        fieldId: `IA_AI_AssignedBy`,
        translationId: 'IM_IA_AssignedBy',
        label: 'Assigned By',
        name: 'AssignedBy',
      },
      {
        fieldId: `IA_AI_AssignedOn`,
        translationId: 'IM_IA_AssignedOn',
        label: 'Assigned On',
        name: 'AssignOn',
      },
    ];
  
    const { data: labelsData = [], isFetching: isLabelsFetching } =
      useGetLabelsQuery({
        menuId: 28,
        moduleId: 2,
      });
    const { data: fieldsData = [], isFetching: isFieldsFetching } =
      useGetFieldsQuery({
        menuId: 28,
        moduleId: 2,
      });      
    const fields =
      fieldsData?.Data?.Menus?.filter((item) => item.MenuId === 26) || [];

    const labels = (labelsData.Data || [])
      .filter((item) => item.MenuId === 26)
      .flatMap((item) =>
        (item.Regions || [])
          .filter((region) => region.RegionCode === 'ALL')
          .flatMap((region) => region.Labels || [])
      );
    const filterLabels = { Data: labels };
  
    const filteredFieldsConfig = fieldsConfig.filter((field) =>
      labels.some((label) => label.TranslationId === field.translationId)
    );
    const [configs, setConfigs] = useState({
      fieldsConfig,
      AssignedInvestigator,
    });
  
    useEffect(() => {
      if (fields?.length > 0) {
        const matchingSections = fields[0]?.Sections?.filter(
          (section) =>
            section.SectionName === 'Accordion-Assigned Investigator(s)' ||
            section.SectionName === 'Accordion-Page'
        );
  
        const pageFields = matchingSections?.flatMap(
          (section) =>
            section?.Regions?.find((region) => region.RegionCode === 'ALL')
              ?.Fields || []
        );
  
        if (pageFields && pageFields.length > 0) {
          const updatedConfigs = Object.entries(configs).reduce(
            (acc, [key, config]) => ({
              ...acc,
              [key]: config.filter((column) => {
                const pageField = pageFields.find(
                  (col) => col.FieldId === column.fieldId
                );
  
                return pageField && pageField.IsShow === true;
              }),
            }),
            {}
          );
  
          setConfigs(updatedConfigs);
        }
      }
    }, [fields[0]]);
  
    return (
      <FormContainer style={{ marginBottom: '20px' }}>
        <FlexContainer flexDirection={'column'}>
          <Grid container spacing={2} p={0}>
            {configs.fieldsConfig?.map((fieldConfig) => {
              const fieldValue = incidentApprovalSafe[fieldConfig.name] ?? '';                
              const getFormattedValue = (value, name) => {
                if (name === 'ApprovalDate') {
                  return formatDate(value);
                }
                if (name === 'ApprovalTime') {
                  const [hours, minutes] = value.split(':');
                  return `${hours}:${minutes}`;
                }
                return value;
              };
  
              return (
                <Grid item xs={4} key={fieldConfig.fieldId}>
                  <FormLabel>
                    {getlabel(
                      fieldConfig?.translationId,
                      filterLabels,
                      i18n.language
                    )}
                  </FormLabel>
                  <StyledTypography>
                    {getFormattedValue(fieldValue, fieldConfig.name) || ''}
                  </StyledTypography>
                </Grid>
              );
            })}
          </Grid>
        </FlexContainer>
  
        <FormLabel style={{ marginBottom: '10px', marginTop: '10px' }}>
          {getlabel('IM_IA_AssignedInvestigator(s)', filterLabels, i18n.language)}
        </FormLabel>
        <ApproveIncidentTable
          columns={configs.AssignedInvestigator}
          labels={filterLabels}
          data={incidentApprovalInvestigatorsSafe}
        />
      </FormContainer>
    );
  };
  
  export default IncidentApprovalDetails;
  