import {
  Grid,
  TextField,
  Typography,
  Button,
    Box,
  
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import {
  FormContainer,
  FormLabel,
} from '../IncidentCommon/IncidentInvestigation.styled';
import ApproveIncidentTable from './Datatable/ApproveIncidentTable';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../utils/language';
import { useTranslation } from 'react-i18next';
import { useGetIncidentInvestigationCompletedByIdQuery, 
  useGetIncidentApprovalPendingByIdQuery,

 } from '../../../redux/RTK/incidentInvestigationApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AttachmentTable from './Datatable/AttachmentTable';
import ExpandIcon from '../../../assets/Icons/ExpandIcon.png';
import DynamicViewFormBuilder from './DynamicViewFormBuilder';
import {
  useLazyGetMCFormBuilderByIdQuery,
  useLazyGetSCFormBuilderByIdQuery,
  useLazyGetIDFormBuilderByIdQuery,
} from '../../../redux/RTK/IncidentManagement/incidentCategoryApi';


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

     const [questionsData, setQuestionsData] = useState([]);
     console.log('questionsData', questionsData);
      const [subCategoryQuestionsData, setSubCategoryQuestionsData] = useState([]);
      const [incidentQuestionsData, setIncidentQuestionsData] = useState([]);
  
        const [triggerGetFormBuilderData] = useLazyGetMCFormBuilderByIdQuery();
        const [triggerGetSubCategoryFormBuilderData] =
          useLazyGetSCFormBuilderByIdQuery();
        const [triggerGetIncidentFormBuilderData] =
          useLazyGetIDFormBuilderByIdQuery();


            const { data: approvalData } =
              useGetIncidentApprovalPendingByIdQuery(
                {
                  menuId: 26,
                  loginUserId: userDetails?.UserId,
                  incidentId: id,
                  moduleId: 2,
                },
                { skip: !id }
              );
          
            const incidentApprovalSafe = approvalData?.Data || {};
            const mainCategoryFormValueDataSafe =
            incidentApprovalSafe?.incidentFormBuilderData?.mainCategoryFormValue || [];
            
          const subCategoryFormValueDataSafe =
          incidentApprovalSafe?.incidentFormBuilderData?.subCategoryFormValue || [];
          const incidentFormValueDataSafe =
          incidentApprovalSafe?.incidentFormBuilderData?.incidentDetailFormValue || [];

const getFormBuilderData = async (id) => {
    let response;
    try {
      response = await triggerGetFormBuilderData({
        payload: {
          headerFacilityId: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          pageModuleId: selectedModuleId,
          pageMenuId: 27,
          facilityId: 2,
          menuId: 27,
          mainCategoryId: id,
        },
      });
      if (response?.data) {
        setQuestionsData(response?.data?.Data);
      }
    } catch (e) {
      console.error('Failed to get Main Category question', e);
    }
  };

  const getFormSubCatBuilderData = async (id) => {
    let response;
    try {
      response = await triggerGetSubCategoryFormBuilderData({
        payload: {
          headerFacilityId: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          pageModuleId: selectedModuleId,
          pageMenuId: 27,
          facilityId: 2,
          menuId: 27,
          subCategoryId: id,
        },
      });
      if (response?.data) {
        setSubCategoryQuestionsData(response?.data?.Data);
      }
    } catch (e) {
      console.error('Failed to get Main Category question', e);
    }
  };

  const getIncidentFormBuilderData = async (id) => {
    let response;
    try {
      response = await triggerGetIncidentFormBuilderData({
        payload: {
          headerFacilityId: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          pageModuleId: selectedModuleId,
          pageMenuId: 27,
          facilityId: 2,
          menuId: 27,
          incidentDetailId: id,
        },
      });
      if (response?.data) {
        setIncidentQuestionsData(response?.data?.Data);
      }
    } catch (e) {
      console.error('Failed to get Main Category question', e);
    }
  };

  useEffect(() => {
    if (incidentApprovalSafe) {
      const { MainCategoryId, SubCategoryId, IncidentDetailId } =
      incidentApprovalSafe || {};

      if (MainCategoryId) {
        getFormBuilderData(MainCategoryId);
      }

      if (SubCategoryId) {
        getFormSubCatBuilderData(SubCategoryId);
      }

      if (IncidentDetailId) {
        getIncidentFormBuilderData(IncidentDetailId);
      }
    }
  }, [incidentApprovalSafe]);

  

  const { data: investigationData, isFetching: isFetchingData } =
    useGetIncidentInvestigationCompletedByIdQuery(
      {
        menuId: 27,
        loginUserId: userDetails?.UserId,
        incidentId: id,
         moduleId: 2
      },
      { skip: !id }
    );

  const { Investigation, ActionTaken, Attachments,
    EventSequence, Opinions

   } =
    investigationData?.Data || {};

  const InvestigationSafe = Investigation || {};
  // const ActionTakensafe = ActionTaken?.slice(0, 5) || [];
  const ActionTakensafe = ActionTaken|| [];
  const EventSequenceSafe = EventSequence || [];
  const OpinionsSafe = Opinions || [];
  const AttachmentSafe = Attachments || [];

  const fieldsConfig = [
    {
      fieldId: `II_P_ApproverComment`,
      translationId: 'IM_II_ApproverComment',
      label: 'ApproverComment',
      name: 'Comments',
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
      name: 'Recommendation',
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
      name: 'Attachments',
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
      name: 'Attachments',
    },
  ];

  const tableLabels = [
    {
      fieldId: `II_ATfPOIA_ResponsibleStaff`,
      translationId: 'IM_II_ResponsibleStaff',
      label: 'Responsible Staff',
      name: 'Responsiblestaff',
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
  const eventsLabels = [
    {
      fieldId: `II_ES_Date`,
      translationId: 'IM_II_Date',
      label: 'Date',
      name: 'EventDate',
    },
    {
      fieldId: `II_ES_Time`,
      translationId: 'IM_II_Time',
      label: 'Time',
      name: 'EventTime',
    },
    {
      fieldId: `II_ES_Activity`,
      translationId: 'IM_II_Activity',
      label: 'Activity',
      name: 'Activity',
    },
  ];

  const opinionsExchanged = [
    {
      fieldId: `II_OE_OpinionId`,
      translationId: 'IM_II_OpinionId',
      label: 'OpinionId',
      name: 'OpinionId',
    },
    {
      fieldId: `II_OE_RespondentName`,
      translationId: 'IM_II_RespondentName',
      label: 'RespondentName',
      name: 'RespondentName',
    },
    {
      fieldId: `II_OE_Department`,
      translationId: 'IM_II_Department',
      label: 'Department',
      name: 'DepartmentName',
    },
    {
      fieldId: `II_OE_Designation`,
      translationId: 'IM_II_Designation',
      label: 'Designation',
      name: 'DesignationName',
    },
    {
      fieldId: `II_OE_Request`,
      translationId: 'IM_II_Request',
      label: 'Request',
      name: 'RequestorName',
    },
    {
      fieldId: `II_OE_Response`,
      translationId: 'IM_II_Response',
      label: 'Response',
      name: 'Response',
    },
    {
      fieldId: `II_OE_Requested_OpinionDate`,
      translationId: 'IM_II_Requested_OpinionDate',
      label: 'Requested_OpinionDate',
      name: 'RequestedDate',
    },
    {
      fieldId: `II_OE_ResponseDate`,
      translationId: 'IM_II_ResponseDate',
      label: 'ResponseDate',
      name: 'ResponseDate',
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
    eventsLabels,
    opinionsExchanged,
    attachmentConfig,
    additionalConfig,
  });

  useEffect(() => {
    if (fields?.length > 0) {
      const matchingSections = fields[0]?.Sections?.filter(
        (section) =>
          section.SectionName ===
            'Actions Taken for Prevention Of Incident Again' ||
          section.SectionName === 'Accordion-Page' ||
          section.SectionName === 'Opinion(s) Exchanged' ||
          section.SectionName === 'Accordion-Events Sequence'
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
    //  <FlexContainer
    //     flexDirection={'column'}
    //     alignItems="center"
    //     width="100%"
    //     flexWrap="wrap"
    //   >
    <Accordion
      sx={{
        borderColor: '#18bb0d',
        // marginBottom: '10px',
        border: '1px solid #18bb0d',
        borderRadius: '8px 8px 0px 0px',
        marginTop: '10px;',
        width: '100%',
      }}
      // expanded={true}
    >
      <AccordionSummary
        expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          backgroundColor: '#18bb0d',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '8px 8px 0px 0px',
        }}
      >
        <StyledTypography
          fontSize="18px"
          fontWeight="700"
          lineHeight="20px"
          textAlign="center"
          color="#FFFFFF"
          sx={{
            flexGrow: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {t('IM_IncidentInvestigation')}
        </StyledTypography>
      </AccordionSummary>

      <FormContainer>
        <FlexContainer flexDirection={'column'}>
          <Grid container spacing={2} p={0}>
            {configs?.fieldsConfig?.map((fieldConfig) => {
              const fieldValue = InvestigationSafe[fieldConfig.name] ?? '';
              return (
                <Grid item xs={4} key={fieldConfig.fieldId}>
                  <FormLabel>
                    {getlabel(
                      fieldConfig?.translationId,
                      filterLabels,
                      i18n.language
                    )}
                  </FormLabel>
                  <StyledTypography>{fieldValue || ''}</StyledTypography>
                </Grid>
              );
            })}
          </Grid>

           {questionsData?.length > 0 && (
                       <Grid item xs={12} mt={2}>
                         <FormLabel
                           style={{
                             whiteSpace: 'nowrap',
                             minWidth: '150px',
                             marginBottom: '8px',
                           }}
                         >
                           Questions:
                         </FormLabel>
                         <Box mb={2}>
                           <DynamicViewFormBuilder
                             formData={questionsData}
                             formValues={mainCategoryFormValueDataSafe}
                           />
                         </Box>
                         <Box mb={2}>
                           <DynamicViewFormBuilder
                             formData={subCategoryQuestionsData}
                             formValues={subCategoryFormValueDataSafe}
                           />
                         </Box>
                         <Box mb={2}>
                           <DynamicViewFormBuilder
                             formData={incidentQuestionsData}
                             formValues={incidentFormValueDataSafe}
                           />
                         </Box>
                       </Grid>
                     )}

          <FormLabel style={{ marginBottom: '10px' }}>
            {getlabel(
              'IM_II_ActionsTakenforPreventionOfIncidentAgain',
              filterLabels,
              i18n.language
            )}
            :
          </FormLabel>
          <ApproveIncidentTable
            columns={configs.tableLabels}
            labels={filterLabels}
            data={ActionTakensafe}
          />
          <FormLabel style={{ marginBottom: '10px' }}>
            {getlabel(
              'IM_II_EventsSequence',
              filterLabels,
              i18n.language
            )}
            :
          </FormLabel>
          <ApproveIncidentTable
            columns={configs.eventsLabels}
            labels={filterLabels}
            data={EventSequenceSafe}
          />
          <FormLabel style={{ marginBottom: '10px' }}>
            {getlabel(
              'IM_II_Opinion(s)Exchanged',
              filterLabels,
              i18n.language
            )}
            :
          </FormLabel>
          <ApproveIncidentTable
            columns={configs.opinionsExchanged}
            labels={filterLabels}
            data={OpinionsSafe}
          />

          <FormLabel style={{ marginTop: '10px' }}>
            {getlabel('IM_II_Attachment(s)', filterLabels, i18n.language)}:
          </FormLabel>
          <AttachmentTable
            columns={attachmentConfig}
            labels={filterLabels}
            data={AttachmentSafe}
          />

          <Grid container spacing={2} p={0} mt={4} mb={4}>
            {configs?.additionalConfig?.map((fieldConfig) => {
              const fieldValue = InvestigationSafe[fieldConfig.name] ?? '';
              return (
                <Grid item xs={3} key={fieldConfig.fieldId}>
                  <FormLabel>
                    {getlabel(
                      fieldConfig?.translationId,
                      filterLabels,
                      i18n.language
                    )}
                  </FormLabel>
                  <StyledTypography>{fieldValue || ''}</StyledTypography>
                </Grid>
              );
            })}
          </Grid>
        </FlexContainer>

        {/* </Box> */}
      </FormContainer>
    </Accordion>

    // </FlexContainer>
  );
};

export default IncidentInvestigationDetails;
