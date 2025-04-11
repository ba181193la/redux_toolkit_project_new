import React, { useRef, useState, useEffect } from 'react';
import {
  Modal,
  Backdrop,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import { useTranslation } from 'react-i18next';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
// import { getlabel } from '../../../utils/language';
import { useGetIncidentInvestigationCompletedByIdQuery } from '../../../../redux/RTK/incidentInvestigationApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import formatDate from '../../../../utils/FormatDate';
import LastApproveIncidentTable from './MultiTables/LastApproved';
import ApproveIncidentPdf from './MultiTables/ApproveIncidentPdf';

export default function InvestigationDetailsPdf({reportCustomize}) {
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
      },
      { skip: !id }
    );

  const { Investigation, ActionTaken, Attachments, EventSequence, Opinions } =
    investigationData?.Data || {};

  const InvestigationSafe = Investigation || {};
  const ActionTakensafe = ActionTaken?.slice(0, 5) || [];
  const EventSequencesafe = EventSequence?.slice(0, 5) || [];
  const AttachmentSafe = Attachments || [];
  const OpinionsSafe = Opinions || [];

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
    attachmentConfig,
    additionalConfig,
    opinionsExchanged,
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

  if (investigationData?.Data) {
  return (
    <>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', padding: 2, gap: 3 }}
      >
        <TableContainer sx={{ width: '100%', maxWidth: 1200 }}>
          <Table id="textTable">
            <TableHead>
              <TableRow style={{ backgroundColor: '#c0c0c0' }}>
                <TableCell
                  colSpan={12}
                  align="center"
                  sx={{
                    border: '1px solid black',
                    width: '100%',
                    padding: '8px',
                  }}
                >
                  <Typography variant="h6">Incident Investigation</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        <Table
          id="Approval"
          sx={{
            border: '1px solid black',
            borderCollapse: 'collapse',
            width: '100%',
            marginBottom: '120px',
          }}
        >
          {/* Header */}
          <TableHead>
            <TableRow sx={{ backgroundColor: '#c0c0c0' }}></TableRow>
          </TableHead>

          <TableBody>
            {[
              [
                'InvestigatorName:',
                InvestigationSafe.InvestigatorName,
                'DepartmentName:',
                InvestigationSafe.DepartmentName,
              ],
              [
                'DesignationName:',
                InvestigationSafe.DesignationName,
                'Recommendation:',
                InvestigationSafe.Recommendation,
              ],
              [
                'Comments:',
                InvestigationSafe.Comments,
                'AssignedBy:',
                InvestigationSafe.AssignedBy,
              ],
              [
                'Assigned Date:',
                formatDate(InvestigationSafe.AsssignedDate),
                'Reported Date:',
                formatDate(InvestigationSafe.ReportedDate),
              ],
            ].map((row, index) => (
              <TableRow key={index}>
                {row.map((cell, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    className={cellIndex % 2 === 0 ? 'bold-cell' : ''}
                    sx={{
                      border: '1px solid black',
                      padding: '8px',
                      fontWeight: cellIndex % 2 === 0 ? 'bold' : 'normal',
                      backgroundColor:
                        cellIndex % 2 === 0 ? '#f5f5f5' : 'white',
                      width: cellIndex % 2 === 0 ? '25%' : '25%',
                    }}
                    colSpan={cellIndex % 2 === 0 ? 3 : 3}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>


        {reportCustomize?.find(item => item.ListOfValueId === 25)?.IsEnabled && (

        <ApproveIncidentPdf
          columns={configs.tableLabels}
          labels={filterLabels}
          data={ActionTakensafe}
          title={
            titleConfig.find(
              (config) =>
                config.name === 'actionsTakenforPreventionOfIncidentAgain'
            )
              ? 'Actions Taken for Prevention Of Incident Again'
              : ''
          }
          styles={{
            border: '1px solid #ccc',
            margin: '16px',
          }}  
        />
        )}
        <ApproveIncidentPdf
          columns={configs.opinionsExchanged}
          labels={filterLabels}
          data={OpinionsSafe}
          title={
            titleConfig.find(
              (config) =>
                config.name === 'actionsTakenforPreventionOfIncidentAgain'
            )
              ? 'Opinions Exchanged'
              : ''
          }
          styles={{
            border: '1px solid #ccc',
            margin: '16px',
          }}  
        />

        {/* Footer */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            borderTop: '1px solid black',
          }}
        ></Box>
      </Box>
    </>
  );
}
}