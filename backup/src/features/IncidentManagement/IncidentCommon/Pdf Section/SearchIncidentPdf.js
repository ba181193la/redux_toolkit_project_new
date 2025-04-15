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
import { useGetHistoryIncidentQuery} from '../../../../redux/RTK/IncidentManagement/searchIncidentApi';
import { useGetReportIncidentQuery} from '../../../../redux/RTK/IncidentManagement/incidentApprovalApi';

export default function searchIncidentPdf({reportCustomize}) {
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

  const NotificationConfig = [
    {
      fieldId: `SI_NH_Task`,
      translationId: 'IM_SI_Task',
      label: 'Task',
      name: 'Task',
    },
    {
      fieldId: `SI_NH_MailSubject`,
      translationId: 'IM_SI_MailSubject',
      label: 'Mail Subject',
      name: 'MailSubject',
    },
    {
      fieldId: `SI_NH_MailId`,
      translationId: 'IM_SI_MailId',
      label: 'Mail Id',
      name: 'MailId',
    },
    {
      fieldId: `SI_NH_StaffName`,
      translationId: 'IM_SI_StaffName',
      label: 'User Name',
      name: 'UserName',
    },
    {
      fieldId: `SI_NH_Data_SubmittedBy`,
      translationId: 'IM_SI_Data_SubmittedBy',
      label: 'Data_Submitted By',
      name: 'SubmittedBy',
    },
    {
      fieldId: `SI_NH_SentDate&Time`,
      translationId: 'IM_SI_SentDate&Time',
      label: 'Sent Date & Time',
      name: 'SentDateTime',
    },
    {
      fieldId: `SI_NH_NotificationRemarks`,
      translationId: 'IM_SI_NotificationRemarks',
      label: 'Notification Remarks',
      name: 'Remarks',
    },
  ];

  const IncidentHistoryConfig = [
    {
      fieldId: `SI_IH_Task`,
      translationId: 'IM_SI_Task',
      label: 'Task',
      name: 'Task',
    },
    {
      fieldId: `SI_IH_ResponsibleStaff`,
      translationId: 'IM_SI_ResponsibleStaff',
      label: 'Responsible Staff',
      name: 'ResponsibleStaff',
    },
    {
      fieldId: `SI_IH_Department`,
      translationId: 'IM_SI_IncidentDepartment',
      label: 'Incident Department',
      name: 'Department',
    },
    {
      fieldId: `SI_IH_RequestReceivedDate`,
      translationId: 'IM_SI_RequestReceivedDate',
      label: 'Request Received Date',
      name: 'RequestReceivedDate',
    },
    {
      fieldId: `SI_IH_CompletedDate`,
      translationId: 'IM_SI_CompletedDate',
      label: 'Completed Date',
      name: 'CompletedDate',
    },
  ];

  const HistoryTitle = [
    {
      translationId: 'IM_SI_NotificationHistory',
      label: 'Notification History',
      name: 'NotificationHistory',
    },
    {
      translationId: 'IM_SI_IncidentHistory',
      label: 'Incident History',
      name: 'IncidentHistory',
    },
  ];

  const { data: getReportIncident } = useGetHistoryIncidentQuery(
    {
      menuId: 25,
      loginUserId: 1,
      incidentId: id,
      moduleId: 2,
    },
    { skip: !id }
  );

  const { IncidentHistoryList, NotificationList } =
    getReportIncident?.Data.Result || {};

  const IncidntHistoryArray = IncidentHistoryList || {};
  const NotificationListArray = NotificationList || {};

  const { data: labelsData = [], isFetching: isLabelsFetching } =
    useGetLabelsQuery({
      menuId: 25,
      moduleId: 2,
    });
  const { data: fieldsData = [], isFetching: isFieldsFetching } =
    useGetFieldsQuery({
      menuId: 25,
      moduleId: 2,
    });

  const fields =
    fieldsData?.Data?.Menus?.filter((item) => item.MenuId === 25) || [];

  const incidentLabels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 25)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'ALL')
        .flatMap((region) => region.Labels || [])
    );
  const filteredIncidentLabel = { Data: incidentLabels };

  const incidentApprovalLabels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 26)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'ALL')
        .flatMap((region) => region.Labels || [])
    );

  const Historylabels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 25)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'A')
        .flatMap((region) => region.Labels || [])
    );
  const HistoryfilterLabels = { Data: Historylabels };

  const { data: recordss = [], isFetching: isRecordFetching } =
    useGetReportIncidentQuery({
      moduleId: 2,
      menuId: 26,
      incidentId: id,
      loginUserId: userDetails?.UserId,
    });

  const [configs, setConfigs] = useState({
    IncidentHistoryConfig,
    NotificationConfig,
  });

  useEffect(() => {
    if (fields?.length > 0) {
      const matchingSections = fields[0]?.Sections?.filter(
        (section) =>
          section.SectionName === 'Notification History' ||
          section.SectionName === 'Incident History'
      );

      const pageFields = matchingSections?.flatMap(
        (section) =>
          section?.Regions?.find((region) => region.RegionCode === 'All')
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
    <>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', padding: 2, gap: 3 }}
      >
      
      <Box sx={{ position: 'relative', minHeight: '100vh' }}>


      {reportCustomize?.find(item => item.ListOfValueId === 26)?.IsEnabled && (

        <ApproveIncidentPdf
          columns={configs.IncidentHistoryConfig}
          labels={HistoryfilterLabels}
          data={IncidntHistoryArray}
          title={'Incident History'}
          styles={{
            border: '1px solid #ccc',
            margin: '16px',
          }}
        />
        )}
      </Box>

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
        >
                {reportCustomize?.find(item => item.ListOfValueId === 27)?.IsEnabled && (

 <ApproveIncidentPdf
          columns={configs.NotificationConfig}
          labels={HistoryfilterLabels}
          data={NotificationListArray}
          title={'Notification History'}
          styles={{
            border: '1px solid #ccc',
            margin: '16px',
          }}
        />
                )}
        </Box>
      </Box>
    </>
  );
}
