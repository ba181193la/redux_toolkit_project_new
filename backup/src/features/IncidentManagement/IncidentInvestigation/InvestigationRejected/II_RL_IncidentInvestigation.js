import { Grid, TextField, Typography, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../../utils/StyledComponents';
import {
  ActionButton,
  FormContainer,
  FormLabel,
  StyledGridContainer,
  StyledGridItem,
} from '../../IncidentInvestigation.styled';
import II_PL_ActionTable from './Datatable/II_Completed_ActionsTakenTable';
import AddSubMaster from '../../../../../assets/Icons/AddSubMaster.png';
import RejectIcon from '../../../../../assets/Icons/RejectIcon.png';
import DoNotDisturbAltIcon from '../../../../../assets/Icons/DoNotDisturbIcon.png';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../../../utils/language';
import Label from '../../../../../components/Label/Label';
import { useTranslation } from 'react-i18next';
import { useGetIncidentInvestigationCompletedByIdQuery } from '../../../../../redux/RTK/incidentInvestigationApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AttachmentTable from './Datatable/II_Completed_AttachmentTable';

const IncidentInvestigationDetails = () => {
  
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

  const { data: investigationData, isFetching: isFetchingData } =
    useGetIncidentInvestigationCompletedByIdQuery(
      {
        menuId: 27,
        loginUserId: userDetails?.UserId,
        incidentId: id,
        //  moduleId: 2
      },
      { skip: !id }
    );

  const { Investigation, ActionTaken } = investigationData?.Data || {};

  const InvestigationSafe = Investigation || {};
  const ActionTakensafe = ActionTaken || [];

  const fieldsConfig = [
    {
      fieldId: `II_P_ApproverComment`,
      translationId: 'IM_II_ApproverComment',
      label: 'ApproverComment',
      name: 'ApproverComment',
    },
    {
      fieldId: `II_P_IncidentReason/RootCause`,
      translationId: 'IM_II_IncidentReason/RootCause',
      label: 'IncidentReason/RootCause',
      name: 'IncidentReason',
    },
    {
      fieldId: `II_P_RecommendationtoPreventSimilarIncident`,
      translationId: 'IM_II_RecommendationtoPreventSimilarIncident',
      label: 'RecommendationtoPreventSimilarIncident',
      name: 'RecommendationtoPreventSimilarIncident',
    },
  ];
  const additionalConfig = [
    {
      fieldId: `II_P_SubmittedBy`,
      translationId: 'IM_II_SubmittedBy',
      label: 'SubmittedBy',
      name: 'SubmittedBy',
    },
    {
      fieldId: `II_P_Department`,
      translationId: 'IM_II_Department',
      label: 'Department',
      name: 'Department',
    },
    {
      fieldId: `II_OE_Designation`,
      translationId: 'IM_II_Designation',
      label: 'Designation',
      name: 'Designation',
    },
    {
      fieldId: `II_P_SubmittedDate`,
      translationId: 'IM_II_SubmittedDate',
      label: 'SubmittedDate',
      name: 'SubmittedDate',
    },
  ];

  const attachmentConfig = [
    {
      fieldId: `RI_P_Attachment`,
      translationId: 'IM_II_Attachment(s)',
      label: 'Attachment(s)',
      name: 'attachment(s)',
    },
  ];

  const titleConfig = [
    {
      fields: `II_P_ApproverComment`,
      translationId: 'IM_II_ApproverComment',
      label: 'Approver Comment',
      name: 'approverComment',
    },
    {
      fieldId: `II_P_IncidentReason/RootCause`,
      translationId: 'IM_II_IncidentReason/RootCause',
      label: 'Incident Reason / Root Cause',
      name: 'incidentReasonRootCause',
    },
    {
      fieldId: `II_P_RecommendationtoPreventSimilarIncident`,
      translationId: 'IM_II_RecommendationtoPreventSimilarIncident',
      label: 'Recommendation to Prevent Similar Incident',
      name: 'recommendationToPreventSimilarIncident',
    },
    {
      fieldId: `II_P_ActionsTakenforPreventionOfIncidentAgain`,
      translationId: 'IM_II_ActionsTakenforPreventionOfIncidentAgain',
      label: 'Actions Taken for Prevention Of Incident Again',
      name: 'actionsTakenforPreventionOfIncidentAgain',
    },
    {
      fieldId: `II_P_Attachment(s)`,
      translationId: 'IM_II_Attachment(s)',
      label: 'Attachment(s)',
      name: 'Attachment(s)',
    },
  ];

  const tableLabels = [
    {
      fieldId: `II_ATfPOIA_ResponsibleStaff`,
      translationId: 'IM_II_ResponsibleStaff',
      label: 'Responsible Staff',
      name: 'ResponsibleStaffName',
    },
    {
      fieldId: `II_ATfPOIA_Department`,
      translationId: 'IM_II_Department',
      label: 'Department',
      name: 'DepartmentName',
    },
    {
      fieldId: `II_ATfPOIA_TaskAssigned`,
      translationId: 'IM_II_TaskAssigned',
      label: 'Task Assigned',
      name: 'TaskAssigned',
    },

    {
      fieldId: `II_ATfPOIA_TargetDate`,
      translationId: 'IM_II_TargetDate',
      label: 'TargetDate',
      name: 'TargetDate',
    },
  ];

  const { data: labelsData = [], isFetching: isLabelsFetching } =
    useGetLabelsQuery({
      menuId: 27,
      moduleId: 2,
    });
  const { data: fieldsData = [], isFetching: isFieldsFetching } =
    useGetFieldsQuery({
      menuId: 27,
      moduleId: 2,
    });

  const fields =
    fieldsData?.Data?.Menus?.filter((item) => item.MenuId === 27) || [];

  const labels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 27)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'ALL')
        .flatMap((region) => region.Labels || [])
    );

  const filterLabels = { Data: labels };
  const [configs, setConfigs] = useState({
    fieldsConfig,
    tableLabels,
    titleConfig,
    attachmentConfig,
    additionalConfig
  });

  useEffect(() => {
    if (fields?.length > 0) {
      const matchingSections = fields[0]?.Sections?.filter(
        (section) =>
          section.SectionName ===
            'Actions Taken for Prevention Of Incident Again' ||
          section.SectionName === 'Accordion-Page' ||
          section.SectionName === 'Opinion(s) Exchanged'
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
        <StyledGridContainer>
          {configs?.fieldsConfig?.map((fieldConfig) => {
            const fieldValue = InvestigationSafe[fieldConfig.name] ?? '';
            return (
              <StyledGridItem item xs={3} key={fieldConfig.fieldId}>
                <FormLabel>
                  {getlabel(
                    fieldConfig?.translationId,
                    filterLabels,
                    i18n.language
                  )}
                </FormLabel>
                <StyledTypography>{fieldValue || ''}</StyledTypography>
              </StyledGridItem>
            );
          })}
        </StyledGridContainer>

        {/* <FormLabel style={{ marginBottom: '10px' }}>
          {getlabel(
            'IM_II_ActionsTakenforPreventionOfIncidentAgain',
            filterLabels,
            i18n.language
          )}
          :
        </FormLabel> */}
        {/* <II_PL_ActionTable
          columns={configs.tableLabels}
          labels={filterLabels}
          data={ActionTakensafe}
        /> */}

        <FormLabel>
          {getlabel('IM_II_Attachment(s)', filterLabels, i18n.language)}:
        </FormLabel>
        {/* <AttachmentTable columns={attachmentConfig} labels={filterLabels} /> */}
{/* 
        <StyledGridContainer>
          {configs?.additionalConfig?.map((fieldConfig) => {
            const fieldValue = InvestigationSafe[fieldConfig.name] ?? '';
            return (
              <StyledGridItem item xs={3} key={fieldConfig.fieldId}>
                <FormLabel>
                  {getlabel(
                    fieldConfig?.translationId,
                    filterLabels,
                    i18n.language
                  )}
                </FormLabel>
                <StyledTypography>{fieldValue || ''}</StyledTypography>
              </StyledGridItem>
            );
          })}
        </StyledGridContainer> */}
      </FlexContainer>

      {/* </Box> */}
    </FormContainer>
  );
};

export default IncidentInvestigationDetails;
