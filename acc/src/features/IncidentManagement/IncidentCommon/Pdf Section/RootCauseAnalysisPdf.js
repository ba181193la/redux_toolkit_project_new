import React, { useRef, useState, useEffect, useMemo } from 'react';
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
import {
  useGetIncidentRCAViewDataQuery,
  useGetIncidentRCADraftDataQuery,
} from '../../../../redux/RTK/IncidentManagement/incidentRcaAPI';

export default function RCAPdf(RCADraft) {
  const { i18n, t } = useTranslation();
  const { rcaid, id } = useParams();
  const {
    selectedMenu,
    userDetails,
    selectedFacility,
    selectedModuleId,
    roleFacilities,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

  const eventSequenceConfig = [
    {
      fieldId: `RCA_ES_Date`,
      translationId: 'IM_RCA_Date',
      label: 'Outsourced Staff Id',
      name: 'EventDate',
    },
    {
      fieldId: `RCA_ES_Time`,
      translationId: 'IM_RCA_Time',
      label: 'Outsourced Staff Name',
      name: 'EventTime',
    },
    {
      fieldId: `RCA_ES_Activity`,
      translationId: 'IM_RCA_Activity',
      label: 'Outsourced Staff Age',
      name: 'EventActivity',
    },
  ];
  const teamMemberConfig = [
    // {
    //   fieldId: `RCA_TiipRCA_Facility`,
    //   translationId: 'IM_RCA_Facility',
    //   label: 'StaffInvolvedId',
    //   name: 'StaffInvolvedId',
    // },
    // {
    //   fieldId: `RCA_TiipRCA_EmployeeId`,
    //   translationId: 'IM_RCA_EmployeeId',
    //   label: 'StaffName',
    //   name: 'StaffName',
    // },
    {
      fieldId: `RCA_TiipRCA_StaffName`,
      translationId: 'IM_RCA_StaffName',
      label: 'Department',
      name: 'Department',
    },
    {
      fieldId: `RCA_TiipRCA_Department`,
      translationId: 'IM_RCA_Department',
      label: 'Designation',
      name: 'Designation',
    },
    {
      fieldId: `RCA_TiipRCA_Designation`,
      translationId: 'IM_RCA_Designation',
      label: 'Staff Category',
      name: 'UserName',
    },
  ];
  const rootCauseConfig = [
    {
      fieldId: `RCA_RC_RootCauseFindings`,
      translationId: 'IM_RCA_RootCauseFindings',
      label: 'Designation',
      name: 'RootCauseFinding',
    },
    {
      fieldId: `RCA_RC_RootCauseReference`,
      translationId: 'IM_RCA_RootCauseReference',
      label: 'Staff Category',
      name: 'RootCauseReference',
    },
    {
      fieldId: `RCA_RC_TaskAssigned`,
      translationId: 'IM_RCA_TaskAssigned',
      label: 'Staff Category',
      name: 'AssignedTask',
    },
    {
      fieldId: `RCA_RC_ResponsibleStaff`,
      translationId: 'IM_RCA_ResponsibleStaff',
      label: 'Staff Category',
      name: 'UserName',
    },
    {
      fieldId: `RCA_RC_Department`,
      translationId: 'IM_RCA_Department',
      label: 'Department',
      name: 'Department',
    },
    {
      fieldId: `RCA_RC_TargetDate`,
      translationId: 'IM_RCA_TargetDate',
      label: 'Staff Category',
      name: 'TargetDate',
    },
  ];
  const mailToConfig = [
    {
      fieldId: `RCA_MT_StaffName`,
      translationId: 'IM_RCA_StaffName',
      label: 'Staff Category',
      name: 'UserName',
    },
    {
      fieldId: `RCA_MT_Department`,
      translationId: 'IM_RCA_Department',
      label: 'Staff Category',
      name: 'Department',
    },
    {
      fieldId: `RCA_MT_Designation`,
      translationId: 'IM_RCA_Designation',
      label: 'Staff Category',
      name: 'Designation',
    },
  ];

  const { data: labelsData = [], isFetching: isLabelsFetching } =
    useGetLabelsQuery({
      menuId: 31,
      moduleId: 2,
    });
  const { data: fieldsData = [], isFetching: isFieldsFetching } =
    useGetFieldsQuery({
      menuId: 31,
      moduleId: 2,
    });

  const fields =
    fieldsData?.Data?.Menus?.filter((item) => item.MenuId === 31) || [];

  const labels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 31)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'ALL')
        .flatMap((region) => region.Labels || [])
    );

  const filterLabels = { Data: labels };

  const initialConfigs = {
    eventSequenceConfig,
    teamMemberConfig,
    rootCauseConfig,
    mailToConfig,
  };

  const [configs, setConfigs] = useState(initialConfigs);

  const stableFields = useMemo(() => fields, [fields]);

  useEffect(() => {
    setConfigs(initialConfigs);
  }, []);

  useEffect(() => {
    if (stableFields?.length > 0) {
      const matchingSections = stableFields[0]?.Sections?.filter(
        (section) =>
          section.SectionName ===
            'Accordion-Team involved in preparing Root Cause Analysis' ||
          section.SectionName === 'Accordion-Events Sequence' ||
          section.SectionName === 'Accordion-Root Cause' ||
          section.SectionName === 'Accordion-Mail To'
      );

      const pageFields = matchingSections?.flatMap(
        (section) =>
          section?.Regions?.filter(
            (region) => region.RegionCode === 'ALL'
          ).flatMap((region) => region.Fields || []) || []
      );

      if (pageFields && pageFields.length > 0) {
        setConfigs((prevConfigs) => {
          const newConfigs = Object.entries(prevConfigs).reduce(
            (acc, [key, config]) => {
              const filteredColumns = config.filter((column) => {
                const pageField = pageFields.find(
                  (col) => col.FieldId === column.fieldId
                );
                return pageField && pageField.IsShow === true;
              });
              return { ...acc, [key]: filteredColumns };
            },
            {}
          );

          if (JSON.stringify(prevConfigs) !== JSON.stringify(newConfigs)) {
            return newConfigs;
          }
          return prevConfigs;
        });
      }
    }
  }, [stableFields]);

  let entryData = null;
  let isFetchingData = false;

  if (RCADraft === true) {
    ({ data: entryData, isFetching: isFetchingData } =
      useGetIncidentRCADraftDataQuery(
        {
          RCAId: rcaid,
          loginUserId: 1,
          moduleId: 2,
          menuId: 31,
        },
        { skip: !id }
      ));
  } else {
    ({ data: entryData, isFetching: isFetchingData } =
      useGetIncidentRCAViewDataQuery(
        {
          incidentId: id,
          loginUserId: 1,
          moduleId: 2,
          menuId: 31,
        },
        { skip: !id }
      ));
  }

  const introData = entryData?.Data?.Introduction || '';

  const incidentId = entryData?.Data?.IncidentId;
  const ActionPlanData = entryData?.Data?.ActionPlan || '';

  const teamTableData = useSelector((state) => state.incidentRca.teamTableData);
  const eventTableData = useSelector(
    (state) => state.incidentRca.eventTableData
  );
  const rootTableData = useSelector((state) => state.incidentRca.rootTableData);

  const mailToTableData = useSelector(
    (state) => state.incidentRca.mailToTableData
  );

  const rcaActions = entryData?.Data?.rcaActions;
  const mailToStaffs = entryData?.Data?.mailToStaffs;
  const incidentRCA_Attachments = entryData?.Data?.incidentRCA_Attachments;
  const teamMembersRCA = entryData?.Data?.teamMembersRCA;
  const RCAEventSequence = entryData?.Data?.RCAEventSequence;
  const rcaQuestions = entryData?.Data?.rCAQuestionAnswers;

  console.log("rcaQuestions",rcaQuestions)
  console.log('entryData?.Data', entryData?.Data);
  if (entryData?.Data) {
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
                  <Typography variant="h6">Root Cause Analysis</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
        </TableContainer>
      </Box>
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>
        <Table
          id="IntroContainer"
          sx={{
            borderCollapse: 'collapse',
            width: '100%',
            marginBottom: '120px',
          }}
        >
          <TableBody>
            {/* Heading Row */}
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: '#f5f5f5',
                  padding: '8px',
                  border: 'none',
                  textAlign: 'left',
                }}
              >
                Introduction:
              </TableCell>
            </TableRow>

            {/* Paragraph Row */}
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 'normal',
                  padding: '8px',
                  border: 'none',
                  textAlign: 'left',
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: introData }} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Box sx={{ position: 'relative', minHeight: '100vh' }}>
          <ApproveIncidentPdf
            columns={configs.teamMemberConfig}
            labels={filterLabels}
            data={teamTableData?.length ? teamTableData : teamMembersRCA}
            title={'Team Table'}
            styles={{
              border: '1px solid #ccc',
              margin: '16px',
            }}
          />
        </Box>
        <Box sx={{ position: 'relative', minHeight: '100vh' }}>
          <ApproveIncidentPdf
            columns={configs.eventSequenceConfig}
            labels={filterLabels}
            data={eventTableData?.length ? eventTableData : RCAEventSequence}
            title={'Event Table'}
            styles={{
              border: '1px solid #ccc',
              margin: '16px',
            }}
          />
        </Box>
        
        <Table
  id="Questions"
  sx={{
    borderCollapse: 'collapse',
    width: '100%',
    marginBottom: '120px',
  }}
>
  <TableBody>
  <TableRow>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: '#f5f5f5',
                  padding: '8px',
                  border: 'none',
                  textAlign: 'left',
                }}
              >
                Question/Answer
              </TableCell>
            </TableRow>
    {rcaQuestions?.map((question, index) => (
      <React.Fragment key={index}>
        <TableRow>
          <TableCell
            sx={{
              fontWeight: 'bold',
              backgroundColor: 'rgb(192, 192, 192)',
              padding: '8px',
              border: 'none',
              textAlign: 'left',
            }}
          >
            {question?.Questions}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell
            sx={{
              fontWeight: 'normal',
              padding: '8px',
              border: 'none',
              textAlign: 'left',
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: question?.QuestionsContent }} />
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell
            sx={{
              fontWeight: 'normal',
              padding: '8px',
              border: 'none',
              textAlign: 'left',
            }}
          >
            <strong>Root Cause Findings: </strong> {question?.RootCauseFinding}
          </TableCell>

          <TableCell
            sx={{
              fontWeight: 'normal',
              padding: '8px',
              border: 'none',
              textAlign: 'right', 
            }}
          >
            <strong>Is Not Applicable: </strong> {question?.IsNotApplicable ? 'Yes' : 'No'}
          </TableCell>
        </TableRow>

        <TableRow>
          <TableCell
            sx={{
              fontWeight: 'normal',
              padding: '8px',
              border: 'none',
              textAlign: 'left',
            }}
          >
            <strong>Root Cause: </strong> {question?.RootCause}
          </TableCell>
        </TableRow>
      </React.Fragment>
    ))}
  </TableBody>
</Table>


        <Table
          id="IntroContainer"
          sx={{
            borderCollapse: 'collapse',
            width: '100%',
            marginBottom: '120px',
          }}
        >
          <TableBody>
            {/* Heading Row */}
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  backgroundColor: '#f5f5f5',
                  padding: '8px',
                  border: 'none',
                  textAlign: 'left',
                }}
              >
                Action Plan:
              </TableCell>
            </TableRow>

            {/* Paragraph Row */}
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: 'normal',
                  padding: '8px',
                  border: 'none',
                  textAlign: 'left',
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: ActionPlanData }} />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <Box sx={{ position: 'relative', minHeight: '100vh' }}>
          <ApproveIncidentPdf
            columns={configs.rootCauseConfig}
            labels={filterLabels}
            data={rootTableData?.length ? rootTableData : rcaActions}
            title={''}
            styles={{
              border: '1px solid #ccc',
              margin: '16px',
            }}
          />
        </Box>
        <Box sx={{ position: 'relative', minHeight: '100vh' }}>
          <ApproveIncidentPdf
            columns={configs.mailToConfig}
            labels={filterLabels}
            data={mailToTableData?.length ? mailToTableData : mailToStaffs} 
            title={'Mail To'}
            styles={{
              border: '1px solid #ccc',
              margin: '16px',
            }}
          />
        </Box>

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
