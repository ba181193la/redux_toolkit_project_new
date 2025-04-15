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
import { useGetIncidentApprovalPendingByIdQuery } from '../../../../redux/RTK/incidentInvestigationApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import formatDate from '../../../../utils/FormatDate';
import LastApproveIncidentTable from './MultiTables/LastApproved';
import {
  useGetClosureEntryDataQuery,
  useSaveRCAMutation,
  useGetClosureEntryDraftDataQuery,
  useGetPageLoadDataQuery,
  useGetIncidentClosurePendingQuery,
  useGetClosureViewDataQuery
} from '../../../../redux/RTK/incidentClosureApi';
import ApproveIncidentPdf from './MultiTables/ApproveIncidentPdf';

export default function IncidentClosurePdf(closureDraft) {
  const { i18n, t } = useTranslation();
  const { id, closureID } = useParams();

  const {
    selectedMenu,
    userDetails,
    selectedFacility,
    selectedModuleId,
    roleFacilities,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

  let entrydetails = null;
  let isEntrydetails = false;

  if (closureDraft === true) {
    ({ data: entrydetails = [], isFetching: isEntrydetails } =
    useGetClosureViewDataQuery({
        incidentId: id,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: 30,
      }))
  }
  else{
    ({ data: entrydetails = [], isFetching: isEntrydetails } =
    useGetClosureViewDataQuery({
        incidentId: id,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: 30,
      }))
  }

   
   

  const entryData = entrydetails?.Data;


  const attachmentTable = [
    {
      fieldId: `IC_P_Attachment(s)`,
      translationId: 'IM_IC_Attachment(s)',
      label: 'Attachment',
      name: 'Attachment',
    },
  ];

  const incidentLevel = [
    {
      fieldId: `IC_IL_IncidentLevel`,
      translationId: 'IM_IC_IncidentLevel',
      label: 'Incident Level',
      name: 'IncidentLevel',
    },
    {
      fieldId: `IC_IL_ActionTobeTaken`,
      translationId: 'IM_IC_ActionTobeTaken',
      label: 'Action To beTaken',
      name: 'ActionTobeTaken',
    },
    {
      fieldId: `IC_IL_RCARequired`,
      translationId: 'IM_IC_RCARequired',
      label: 'RCA Required',
      name: 'RCARequired',
    },
    {
      fieldId: `IC_IL_RCAStatus`,
      translationId: 'IM_IC_RCAStatus',
      label: 'RCA Status',
      name: 'RCAStatus',
    },
  ];

  const otherslabels = [
    {
      translationId: 'IM_IC_ContributingFactors',
      label: 'Contributing Factors',
      name: 'ContributingFactors',
    },
    {
      translationId: 'IM_IC_ContributingDepartment',
      label: 'Contributing Department',
      name: 'ContributingDepartment',
    },
    {
      translationId: 'IM_IC_IncidentReoccurrence',
      label: 'Incident Reoccurrence',
      name: 'IncidentReoccurrence',
    },
    {
      translationId: 'IM_IC_Re-AssignedActionResponsibleStaff(s)History',
      label: 'Re-Assigned Action Responsible Staff(s) History',
      name: 'Re-AssignedActionResponsibleStaff(s)History',
    },
  ];

  const additionalstaffLabels = [
    // {
    //   fieldId: `IC_NFS_Facility`,
    //   translationId: 'IM_IC_Facility',
    //   label: 'StaffName',
    //   name: 'StaffName',
    // },
    // {
    //   fieldId: `IC_NFS_EmployeeId`,
    //   translationId: 'IM_IC_EmployeeId',
    //   label: 'Employee Id',
    //   name: 'EmployeeId',
    // },
    {
      fieldId: `IC_NFS_StaffName`,
      translationId: 'IM_IC_StaffName',
      label: 'StaffName',
      name: 'StaffName',
    },
    {
      fieldId: `IC_NFS_Department`,
      translationId: 'IM_IC_Department',
      label: 'Department',
      name: 'Department',
    },
    {
      fieldId: `IC_NFS_Designation`,
      translationId: 'IM_IC_Designation',
      label: 'Designation',
      name: 'Designation',
    },
    {
      fieldId: `IC_NFS_LevelofStaffNegligence`,
      translationId: 'IM_IC_LevelofStaffNegligence',
      label: 'Level of Staff Negligence',
      name: 'LevelofStaffNegligence',
    },
  ];

  const FurtherActionsLabels = [
    {
      fieldId: `IC_FATBA_TaskAssigned`,
      translationId: 'IM_IC_TaskAssigned',
      label: 'Task Assigned',
      name: 'TaskAssigned',
    },
    {
      fieldId: `IC_FATBA_ResponsibleStaff`,
      translationId: 'IM_IC_ResponsibleStaff',
      label: 'Responsible Staff',
      name: 'ResponsibleStaff',
    },
    {
      fieldId: `IC_FATBA_Department`,
      translationId: 'IM_IC_Department',
      label: 'Department',
      name: 'Department',
    },
    {
      fieldId: `IC_FATBA_TargetDate`,
      translationId: 'IM_IC_TargetDate',
      label: 'Target Date',
      name: 'TargetDate',
    },
  ];

  const IncidentReoccurrence = [
    {
      fieldId: `IC_IR_IncidentNumber`,
      translationId: 'IM_IC_IncidentNumber',
      label: 'Incident Number',
      name: 'IncidentNumber',
    },
    {
      fieldId: `IC_IR_IncidentDetails`,
      translationId: 'IM_IC_IncidentDetails',
      label: 'Incident Details',
      name: 'IncidentDetails',
    },
    {
      fieldId: `IC_IR_IncidentDate`,
      translationId: 'IM_IC_IncidentHistory',
      label: 'Incident History',
      name: 'IncidentHistory',
    },
    {
      fieldId: `IC_IR_LocationDetails(Roomnoetc)`,
      translationId: 'IM_IC_LocationDetails(Roomnoetc)',
      label: 'Location Details(Room no etc)',
      name: 'LocationDetails(Room no etc)',
    },
    {
      fieldId: `IC_IR_RootCauses`,
      translationId: 'IM_IC_RootCauses',
      label: 'Root Causes',
      name: 'RootCauses',
    },
    {
      fieldId: `IC_IR_Recommendation(s)ForPreventiveAction`,
      translationId: 'IM_IC_Recommendation(s)ForPreventiveAction',
      label: 'Recommendation(s) For Preventive Action',
      name: 'Recommendation(s)ForPreventiveAction',
    },
  ];

  const ReAssigned = [
    {
      fieldId: `IC_RARSH_Re-AssignedBy`,
      translationId: 'IM_IC_Re-AssignedBy',
      label: 'Re-Assigned By',
      name: 'Re-AssignedBy',
    },
    {
      fieldId: `IC_RARSH_Re-AssignedDate`,
      translationId: 'IM_IC_Re-AssignedDate',
      label: 'Re-Assigned Date',
      name: 'Re-AssignedDate',
    },
    {
      fieldId: `IC_RARSH_FromResponsibleStaff`,
      translationId: 'IM_IC_FromResponsibleStaff',
      label: 'From Responsible Staff',
      name: 'FromResponsibleStaff',
    },
    {
      fieldId: `IC_RARSH_ToResponsibleStaff`,
      translationId: 'IM_IC_ToResponsibleStaff',
      label: 'To Responsible Staff',
      name: 'ToResponsibleStaff',
    },
    {
      fieldId: `IC_RARSH_PreviousTargetDate`,
      translationId: 'IM_IC_PreviousTargetDate',
      label: 'Previous Target Date',
      name: 'PreviousTargetDate',
    },
    {
      fieldId: `IC_RARSH_TargetDate`,
      translationId: 'IM_IC_TargetDate',
      label: 'Target Date',
      name: 'TargetDate',
    },
    {
      fieldId: `IC_RARSH_Re-AssignRemarks`,
      translationId: 'IM_IC_Re-AssignRemarks',
      label: 'Re-Assign Remarks',
      name: 'Re-AssignRemarks',
    },
  ];

  const FactorsLable = [
    {
      fieldId: `IC_CF_MainFactor(s)`,
      translationId: 'IM_IC_MainFactor(s)',
      label: 'MainFactor(s)',
      name: 'MainFactor(s)',
    },
    {
      fieldId: `IC_CF_SubFactor(s)`,
      translationId: 'IM_IC_SubFactor(s)',
      label: 'SubFactor(s)',
      name: 'SubFactor(s)',
    },
  ];

  const IncidentApproval = [
    {
      fieldId: `IC_P_IncidentMainCategory`,
      translationId: 'IM_IC_IncidentMainCategory',
      label: 'Incident Main Category',
      name: 'MainCategory',
    },
    {
      fieldId: `IC_P_IncidentSubCategory`,
      translationId: 'IM_IC_IncidentSubCategory',
      label: 'Incident Sub Category',
      name: 'SubCategory',
    },
    {
      fieldId: `IC_P_IncidentDetails`,
      translationId: 'IM_IC_IncidentDetails',
      label: 'Incident Details',
      name: 'IncidentDetail',
    },
    {
      fieldId: `IC_P_IncidentType`,
      translationId: 'IM_IC_IncidentType',
      label: 'Incident Type',
      name: 'IncidentType',
    },
    {
      fieldId: `IC_P_Clinical/NonClinical`,
      translationId: 'IM_IC_Clinical/NonClinical',
      label: 'Clinical/Non-Clinical',
      name: 'ClinicalType',
    },
    {
      fieldId: `IC_P_IncidentDepartment`,
      translationId: 'IM_IC_IncidentDepartment',
      label: 'Incident Department',
      name: 'IncidentDepartment',
    },
    {
      fieldId: `IC_P_TobeDiscussedinCommittee`,
      translationId: 'IM_IC_TobeDiscussedinCommittee',
      label: 'To be Discussed in Committee',
      name: 'TobeDiscussedinCommittee',
    },
    {
      fieldId: `IC_P_HarmLevel`,
      translationId: 'IM_IC_HarmLevel',
      label: 'Harm Level',
      name: 'IncidentHarmLevel',
    },
    {
      fieldId: `IC_P_NegligenceFromStaff`,
      translationId: 'IM_IC_NegligenceFromStaff',
      label: 'Negligence From Staff',
      name: 'NegligenceFromStaff',
    },
    {
      fieldId: `IC_P_FurtherActionsTakenByApprover`,
      translationId: 'IM_IC_FurtherActionsTakenByApprover',
      label: 'Further Actions Taken By Approver',
      name: 'FurtherActionsTakenByApprover',
    },
    {
      fieldId: `IC_P_MedicationIncidentHarmLevel`,
      translationId: 'IM_IC_MedicationIncidentHarmLevel',
      label: 'Medication Incident Harm Level',
      name: 'MedicationIncidentHarmLevel',
    },
    {
      fieldId: `IC_P_ContributingFactors`,
      translationId: 'IM_IC_ContributingFactors',
      label: 'Contributing Factors',
      name: 'ContributingFactors',
    },
    {
      fieldId: `IC_P_ContributingDepartment`,
      translationId: 'IM_IC_ContributingDepartment',
      label: 'Contributing Department',
      name: 'ContributingDepartment',
    },
    {
      fieldId: `IC_P_IncidentReoccurrence`,
      translationId: 'IM_IC_IncidentReoccurrence',
      label: 'Incident Reoccurrence',
      name: 'IncidentReoccurrence',
    },
    {
      fieldId: `IC_P_ReporttoExternalBody`,
      translationId: 'IM_IC_ReporttoExternalBody',
      label: 'Report to External Body',
      name: 'ReportExternalBody',
    },
    {
      fieldId: `IC_P_Remarks`,
      translationId: 'IM_IC_Remarks',
      label: 'Remarks',
      name: 'Remarks',
    },
    {
      fieldId: `IC_P_Attachment(s)`,
      translationId: 'IM_IC_Attachment(s)',
      label: 'Attachment',
      name: 'Attachment',
    },
    {
      fieldId: `IC_P_ExistingAttachment(s)`,
      translationId: 'IM_IC_ExistingAttachment(s)',
      label: 'Existing Attachment',
      name: 'ExistingAttachment',
    },
    {
      fieldId: `IC_P_IncidentLevel(s)`,
      translationId: 'IM_IC_IncidentLevel',
      label: 'Incident Level',
      name: 'IncidentLevel',
    },
    {
      fieldId: `IC_P_CategoryAffected`,
      translationId: 'IM_IC_CategoryAffected',
      label: 'Category Affected',
      name: 'CategoryAffected',
    },
    {
      fieldId: `IC_P_Consequence`,
      translationId: 'IM_IC_Consequence',
      label: 'Consequence',
      name: 'Consequence',
    },
    {
      fieldId: `IC_P_Likelihood`,
      translationId: 'IM_IC_Likelihood',
      label: 'Likelihood',
      name: 'Likelihood',
    },
    {
      fieldId: `IC_P_SubmittedBy`,
      translationId: 'IM_IC_SubmittedBy',
      label: 'Submitted By',
      name: 'SubmittedBy',
    },
    {
      fieldId: `IC_P_DepartmentName`,
      translationId: 'IM_IC_DepartmentName',
      label: 'Department Name',
      name: 'DepartmentName',
    },
    {
      fieldId: `IC_IH_Designation`,
      translationId: 'IM_IC_Designation',
      label: 'Designation',
      name: 'Designation',
    },
    {
      fieldId: `IC_P_SubmittedDate`,
      translationId: 'IM_IC_SubmittedDate',
      label: 'Submitted Date',
      name: 'SubmittedDate',
    },
    {
      fieldId: `IC_P_IncidentHistory`,
      translationId: 'IM_IC_IncidentHistory',
      label: 'IncidentHistory',
      name: 'IncidentHistory',
    },
    {
      fieldId: `IC_P_NotificationHistory`,
      translationId: 'IM_IC_NotificationHistory',
      label: 'Notification History',
      name: 'NotificationHistory',
    },
    {
      fieldId: `IC_P_IncidentReason/RootCause`,
      translationId: 'IM_IC_IncidentReason/RootCause',
      label: 'IncidentReason/RootCause',
      name: 'IncidentReason/RootCause',
    },
    {
      fieldId: `IC_P_LessonsLearned`,
      translationId: 'IM_IC_LessonsLearned',
      label: 'Lessons Learned',
      name: 'LessonLearned',
    },
    {
      fieldId: `IC_P_JAWDAIncidentLevel`,
      translationId: 'IM_IC_JAWDAIncidentLevel',
      label: 'JAWDA Incident Level',
      name: 'JAWDALevel',
    },
  ];

  const IncidentHistorylabel = [
    {
      fieldId: `IC_IH_RequestReceivedDate`,
      translationId: 'IM_IC_RequestReceivedDate',
      label: 'RequestReceivedDate',
      name: 'RequestReceivedDate',
    },
    {
      fieldId: `IC_IH_CompletedDate`,
      translationId: 'IM_IC_CompletedDate',
      label: 'CompletedDate',
      name: 'CompletedDate',
    },
    {
      fieldId: `IC_IH_Department`,
      translationId: 'IM_IC_Department',
      label: 'Incident Main Category',
      name: 'IncidentMainCategory',
    },
    {
      fieldId: `IC_IH_Designation`,
      translationId: 'IM_IC_Designation',
      label: 'Designation',
      name: 'Designation',
    },
    {
      fieldId: `IC_IH_ResponsibleStaff`,
      translationId: 'IM_IC_ResponsibleStaff',
      label: 'ResponsibleStaff',
      name: 'ResponsibleStaff',
    },
    {
      fieldId: `IC_IH_Task`,
      translationId: 'IM_IC_Task',
      label: 'Task',
      name: 'Task',
    },
  ];

  const NotificationHistorylabel = [
    {
      fieldId: `IC_NH_StaffName`,
      translationId: 'IM_IC_StaffName',
      label: 'Staff Name',
      name: 'StaffName',
    },
    {
      fieldId: `IC_NH_SubmittedBy`,
      translationId: 'IM_IC_SubmittedBy',
      label: 'Submitted By',
      name: 'SubmittedBy',
    },
    {
      fieldId: `IC_NH_Task`,
      translationId: 'IM_IC_Task',
      label: 'Task',
      name: 'Task',
    },
    {
      fieldId: `IC_NH_MailSubject`,
      translationId: 'IM_IC_MailSubject',
      label: 'Mail Subject',
      name: 'MailSubject',
    },
    {
      fieldId: `IC_NH_MailId`,
      translationId: 'IM_IC_MailId',
      label: 'Mail Id',
      name: 'MailId',
    },
    {
      fieldId: `IC_NH_SentDate&Time`,
      translationId: 'IM_IC_SentDate&Time',
      label: 'Sent Date & Time',
      name: 'SentDate&Time',
    },
    {
      fieldId: `IC_NH_Data_SubmittedBy`,
      translationId: 'IM_IC_Data_SubmittedBy',
      label: 'Data Submitted By',
      name: 'Data_SubmittedBy',
    },
    {
      fieldId: `IC_NH_NotificationRemarks`,
      translationId: 'IM_IC_NotificationRemarks',
      label: 'Notification Remarks',
      name: 'NotificationRemarks',
    },
  ];
  const ContriDepartment = [
    {
      fieldId: `IC_P_ContributingDepartment`,
      translationId: 'IM_IC_ContributingDepartment',
      label: 'Contributing Department',
      name: 'ContributingDepartment',
    },
  ];
  const AffectedCategory = [
    {
      fieldId: `IC_P_CategoryAffected`,
      translationId: 'IM_IC_CategoryAffected',
      label: 'CategoryAffected',
      name: 'CategoryAffected',
    },
    {
      fieldId: `IC_P_Consequence`,
      translationId: 'IM_IC_Consequence',
      label: 'Consequence',
      name: 'Consequence',
    },
  ];

  const { data: labelsData = [], isFetching: isLabelsFetching } =
    useGetLabelsQuery({
      menuId: 30,
      moduleId: 2,
    });
  const { data: fieldsData = [], isFetching: isFieldsFetching } =
    useGetFieldsQuery({
      menuId: 30,
      moduleId: 2,
    });

  const menuData = fieldsData.Data?.Menus || [];

  const filteredFields = menuData?.find(
    (menu) => menu.MenuId === selectedMenu?.id
  );

  const incidentApprovalLabels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 30)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'ALL')
        .flatMap((region) => region.Labels || [])
    );

  const filterLabels = { Data: incidentApprovalLabels };

  const [configs, setConfigs] = useState({
    IncidentApproval,
    incidentLevel,
    additionalstaffLabels,
    FurtherActionsLabels,
    IncidentReoccurrence,
    ReAssigned,
    FactorsLable,
    IncidentHistorylabel,
    NotificationHistorylabel,
    ContriDepartment,
    AffectedCategory,
  });

  useEffect(() => {
    if (filteredFields) {
      const matchingSections = filteredFields?.Sections?.filter(
        (section) =>
          section.SectionName === 'Page' ||
          section.SectionName === 'Accordion-Incident Level' ||
          section.SectionName ===
            'Accordion-Further Actions Taken By Approver' ||
          section.SectionName ===
            'Accordion-Re-Assigned Action Responsible Staff(s) History' ||
          section.SectionName === 'Accordion-Contributing Factors' ||
          section.SectionName === 'Accordion-Incident History' ||
          section.SectionName === 'Accordion-Notification History' ||
          section.SectionName === 'Accordion-Negligence From Staff' ||
          section.SectionName === 'Accordion-Incident Reoccurrence'
      );

      const pageFields = matchingSections
        ?.flatMap((section) => section.Regions)
        ?.filter((region) => region.RegionCode === 'ALL')
        ?.flatMap((region) => region.Fields);

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
  }, [filteredFields]);

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
                  <Typography variant="h6">Incident Closure</Typography>
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
              ['Incident Type:', entryData?.IncidentType, '', ''],
              [
                'Incident Main Category:',
                entryData?.MainCategory,
                'Incident Sub Category:',
                entryData?.SubCategory,
              ],
              ['Incident Details:', entryData?.IncidentDetail, '', ''],
              ['Clinical/Non Clinical:', entryData?.ClinicalType, '', ''],
              [
                'Incident Reason/ Root cause:',
                entryData?.IncidentReason,
                'Leasons Learned:',
                entryData?.LeasonsLearned,
              ],
              [
                'Harm Level:',
                entryData?.IncidentHarmLevel,
                'Medication Incident Harm level:',
                entryData?.MedicationIncidentHarmLevel,
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

      <ApproveIncidentPdf
        columns={configs.FactorsLable}
        labels={filterLabels}
        title={'Contributing Factors'}

        // data={incidentApprovalInvestigatorsSafe}
      />
      <ApproveIncidentPdf
        columns={configs.ContriDepartment}
        labels={filterLabels}
        title={'Contributing Department'}

        // data={incidentApprovalInvestigatorsSafe}
      />
      <ApproveIncidentPdf
        columns={configs.IncidentReoccurrence}
        labels={filterLabels}
        title={'Incident Reoccurrence'}

        // data={incidentApprovalInvestigatorsSafe}
      />
      <ApproveIncidentPdf
        columns={configs.additionalstaffLabels}
        labels={filterLabels}
        title={'Negligence From Staff'}

        // data={incidentApprovalInvestigatorsSafe}
      />
      <ApproveIncidentPdf
        columns={configs.FurtherActionsLabels}
        labels={filterLabels}
        title={'Further Actions Taken By Approver'}

        // data={incidentApprovalInvestigatorsSafe}
      />
      <ApproveIncidentPdf
        columns={configs.ReAssigned}
        labels={filterLabels}
        title={'Re-Assigned Action Responsible Staff(s) History'}

        // data={incidentApprovalInvestigatorsSafe}
      />
      <ApproveIncidentPdf
        columns={attachmentTable}
        labels={filterLabels}
        title={'Attachment'}

        // data={incidentApprovalInvestigatorsSafe}
      />

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
          {[['Likelihood:', entryData?.Likelihood, '', '']].map(
            (row, index) => (
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
            )
          )}
        </TableBody>
      </Table>
      <ApproveIncidentPdf
        columns={configs.AffectedCategory}
        labels={filterLabels}
        title={'Affected Category and Factor(s)'}

        // data={incidentApprovalInvestigatorsSafe}
      />
      <Table
        id="Container"
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
              'Submitted by:',
              entryData?.SubmittedBy,
              'Department:',
              entryData?.Department,
            ],
            [
              'Designation:',
              entryData?.Designation,
              'Submitted Date:',
              entryData?.SubmittedDate,
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
                    backgroundColor: cellIndex % 2 === 0 ? '#f5f5f5' : 'white',
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
     
    </>
  );
}
