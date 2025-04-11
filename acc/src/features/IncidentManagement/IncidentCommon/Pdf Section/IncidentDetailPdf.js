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
import React, { useState, useEffect } from 'react';
import {
  FlexContainer,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import Approved from '../Pdf Section/MultiTables/ApprovedPdf';
import InvestigationDetails from './InvestigationDetailsPdf';
import SearchIncidentPdf from './SearchIncidentPdf';
import RootCauseAnalysisPdf from './RootCauseAnalysisPdf';
import IncidentClosurePdf from './IncidentClosurePdf';
import OpinionCompletedViewPdf from './OPinionCompletedViewPdf'

import {
  FormContainer,
  FormLabel,
  StyledGridContainer,
  StyledGridItem,
} from '../../IncidentCommon/IncidentInvestigation.styled';
import ApproveIncidentTable from '../../IncidentCommon/Datatable/ApproveIncidentTable';
import ApproveIncidentPdf from '../Pdf Section/MultiTables/ApproveIncidentPdf';
import VisitorTable from '../../IncidentCommon/Datatable/II_PL_VisitorTable';
import WitnessTable from '../../IncidentCommon/Datatable/II_PL_WitnessTable';
import AttachmentTable from '../../IncidentCommon/Datatable/II_PL_AttachmentTable';
import { useTranslation } from 'react-i18next';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';

import { getlabel } from '../../../../utils/language';
import {
  useGetIncidentDetailsPendingByIdQuery,
  useGetDefinitionQuery,
  useGetReportCustomizeMutation
} from '../../../../redux/RTK/incidentInvestigationApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
// import InfoIcon from '@mui/icons-material/Info';
// import CloseIcon from '@mui/icons-material/Close';
import formatDate from '../../../../utils/FormatDate';
import { useGetReportIncidentQuery } from '../../../../redux/RTK/IncidentManagement/incidentApprovalApi';
import { useGetHistoryIncidentQuery } from '../../../../redux/RTK/IncidentManagement/searchIncidentApi';
import { width } from '@mui/system';
import { useMutation } from "@reduxjs/toolkit/query/react";


const IncidentDetails = ({ approvalviewstatus, investigationView, searchView, RCAView, RCAData, closureView, RCADraft, closureDraft, IncidentCompletedOpinionView  }) => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const {
    selectedMenu,
    userDetails,
    selectedFacility,
    selectedModuleId,
    roleFacilities,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

  const authState = useSelector((state) => state);

  const [getReportCustomize] = useGetReportCustomizeMutation();
const [extractedData, setExtractedData] = useState([]);
  const [incidentDateTime, setIncidentDateTime] = useState(null);
  const [incidentReportDateTime, setIncidentReportDateTime] = useState(null);

useEffect(() => {
  getReportCustomize({
    payload: {
      pageIndex: 1,
      pageSize: 25,
      headerFacility: selectedFacility?.id,
      loginUserId: userDetails?.id,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
    },
  })
    .unwrap()
    .then((response) => {
      console.log("Report Data:", response);
      const data = response.Data.Records.map(({ ListOfValueId, ListOfValue, IsEnabled }) => ({
        ListOfValueId,
        ListOfValue,
        IsEnabled
      }));
      setExtractedData(data);
    })
      // .unwrap()
      // .then((response) => {
      //   const data = response.Data.Records.map(
      //     ({ ListOfValueId, ListOfValue, IsEnabled }) => ({
      //       ListOfValueId,
      //       ListOfValue,
      //       IsEnabled,
      //     })
      //   );
      //   setExtractedData(data);
      // })
      .catch((error) => {
        console.error('Error fetching report:', error);
      });
  }, []);

  const { data: definitionData } = useGetReportIncidentQuery(
    {
      menuId: 24,
      loginUserId: 1,
      incidentId: id,
      moduleId: 2,
    },
    { skip: !id }
  );

  const { incidentTypeDefinition, clinicalDefinition } =
    definitionData?.Data || {};


  const { data: incidentData, isFetching: isFetchingData } =
    useGetIncidentDetailsPendingByIdQuery(
      {
        menuId: 24,
        loginUserId: userDetails?.UserId,
        incidentId: id,
        moduleId: 2,
      },
      { skip: !id }
    );

  const { reportIncident, incidentStaffInvolved, incidentPatientInvolved, incidentActionTaken, incidentOutStaffInvolved,
    incidentWitnessedBy, incidentVisitorInvolved, incidentRelativeInvolved, reportIncidentAttachment
    ,incidentOthersInvolved
   } =
    incidentData?.Data || {};

  const reportIncidentSafe = reportIncident || {};
  const incidentStaffInvolvedsafe = incidentStaffInvolved || [];
  const incidentPatientInvolvedSafe = incidentPatientInvolved || [];
  const incidentActionTakenSafe = incidentActionTaken || [];
  const incidentWitnessedBySafe = incidentWitnessedBy || [];
  const incidentVisitorInvolvedSafe = incidentVisitorInvolved || [];
  const incidentRelativeInvolvedSafe = incidentRelativeInvolved || [];
  const incidentOutStaffInvolvedSafe = incidentOutStaffInvolved || [];
  const incidentOthersInvolvedSafe = incidentOthersInvolved || [];
  const reportIncidentAttachmentSafe = reportIncidentAttachment || [];
console.log("incidentActionTakenSafe",incidentData)
  const fieldsConfig = [
    {
      fieldId: `RI_P_FacilityName`,
      translationId: 'IM_RI_FacilityName',
      label: 'Facility Name',
      name: 'FacilityName',
    },
    {
      fieldId: `RI_P_IncidentNumber`,
      translationId: 'IM_RI_IncidentNumber',
      label: 'Incident Number',
      name: 'IncidentNo',
    },
    {
      fieldId: `RI_P_BeAnonymous`,
      translationId: 'IM_RI_BeAnonymous',
      label: 'Be Anonymous',
      name: 'Anonymous',
    },
    {
      fieldId: `RI_P_IncidentDate`,
      translationId: 'IM_RI_IncidentDate',
      label: 'Incident Date',
      name: 'IncidentDate',
    },
    {
      fieldId: `RI_P_Day`,
      translationId: 'IM_RI_Day',
      label: 'Incident Day',
      name: 'IncidentDay',
    },
    {
      fieldId: `RI_P_Time`,
      translationId: 'IM_RI_Time',
      label: 'Incident Type',
      name: 'IncidentTime',
    },
    {
      fieldId: `RI_P_ReportedDate`,
      translationId: 'IM_RI_ReportedDate',
      label: 'Reported Date',
      name: 'ReportDate',
    },
    {
      fieldId: `RI_P_ReportedDay`,
      translationId: 'IM_RI_ReportedDay',
      label: 'Reported Date',
      name: 'ReportDay',
    },
    {
      fieldId: `RI_P_ReportedTime`,
      translationId: 'IM_RI_ReportedTime',
      label: 'Reported Time',
      name: 'ReportTime',
    },
    {
      fieldId: `RI_P_IncidentType`,
      translationId: 'IM_RI_IncidentType',
      label: 'Incident Type',
      name: 'IncidentTypeName',
    },

    {
      fieldId: `RI_P_Clinical/NonClinical`,
      translationId: 'IM_RI_Clinical/NonClinical',
      label: 'Clinical/Non Clinical',
      name: 'ClinicalType',
    },
  ];

  const incidentConfig = [
    {
      fieldId: `RI_P_IncidentMainCategory`,
      translationId: 'IM_RI_IncidentMainCategory',
      label: 'Incident Main Category',
      name: 'MainCategory',
    },
    {
      fieldId: `RI_P_IncidentSubCategory`,
      translationId: 'IM_RI_IncidentSubCategory',
      label: 'Incident Sub Category',
      name: 'SubCategory',
    },
    {
      fieldId: `RI_P_IncidentDetail`,
      translationId: 'IM_RI_IncidentDetail',
      label: 'Incident Detail',
      name: 'IncidentDetail',
    },
    {
      fieldId: `RI_P_Remarks`,
      translationId: 'IM_RI_Remarks',
      label: 'Remarks',
      name: 'Remarks',
    },
    {
      fieldId: `RI_P_BriefDescriptionofIncident`,
      translationId: 'IM_RI_BriefDescriptionofIncident',
      label: 'Brief Description of Incident',
      name: 'BriefDescriptionOfIncident',
    },
    {
      fieldId: `RI_P_IncidentDepartment`,
      translationId: 'IM_RI_IncidentDepartment',
      label: 'Incident Department',
      name: 'DepartmentName',
    },
    {
      fieldId: `RI_P_LocationDetails(Roomnoetc)`,
      translationId: 'IM_RI_LocationDetails(Roomnoetc)',
      label: 'Location Details(Room no etc)',
      name: 'LocationDetails',
    },
  ];

  const immediateActionTakenConfig = [
    {
      fieldId: `RI_IAT_ImmediateActionTaken`,
      translationId: 'IM_RI_ImmediateActionTaken',
      label: 'Immediate Action Taken',
      name: 'ImmediateActionTaken',
    },
    {
      fieldId: `RI_IAT_ResponsibleStaff`,
      translationId: 'IM_RI_ResponsibleStaff',
      label: 'Responsible Staff',
      name: 'ResponsibleStaffName',
    },
    {
      fieldId: `RI_IAT_Department`,
      translationId: 'IM_RI_Department',
      label: 'Department',
      name: 'DepartmentName',
    },
    {
      fieldId: `RI_IAT_Designation`,
      translationId: 'IM_RI_Designation',
      label: 'Designation',
      name: 'DesignationName',
    },
  ];
  const visitorConfig = [
    {
      fieldId: `RI_V_VisitorName`,
      translationId: 'IM_RI_VisitorName',
      label: 'Immediate Action Taken',
      name: 'immediateActionTaken',
    },
    {
      fieldId: `RI_V_VisitorAge`,
      translationId: 'IM_RI_VisitorAge',
      label: 'Responsible Staff',
      name: 'responsibleStaff',
    },
    {
      fieldId: `RI_V_VisitorGender`,
      translationId: 'IM_RI_VisitorGender',
      label: 'Designation',
      name: 'designation',
    },
    {
      fieldId: `RI_V_Department`,
      translationId: 'IM_RI_Department',
      label: 'Department',
      name: 'department',
    },
    {
      fieldId: `RI_V_ReasonForVisit`,
      translationId: 'IM_RI_ReasonForVisit',
      label: 'Reason For Visit',
      name: 'reasonForVisit',
    },
  ];
  const witnessConfig = [
    {
      fieldId: `RI_WB_StaffName`,
      translationId: 'IM_RI_StaffName',
      label: 'Staff Name',
      name: 'staffName',
    },
    {
      fieldId: `RI_WB_Department`,
      translationId: 'IM_RI_Department',
      label: 'Department',
      name: 'department',
    },
    {
      fieldId: `RI_WB_Designation`,
      translationId: 'IM_RI_Designation',
      label: 'Designation',
      name: 'designation',
    },
  ];
  const attachmentConfig = [
    {
      fieldId: `RI_P_Attachment`,
      translationId: 'IM_RI_Attachment(s)',
      label: 'Attachment(s)',
      name: 'OriginalFileName',
    },
  ];

  const historyConfig = [
    {
      fieldId: `RI_P_RequestInformationHistory`,
      translationId: 'IM_RI_RequestInformationHistory(s)',
      label: 'IncidentHistory',
      name: 'IncidentHistory',
    },
  ];

  const additionalConfig = [
    {
      fieldId: `RI_P_HarmLevel`,
      translationId: 'IM_RI_HarmLevel',
      label: 'Harm Level',
      name: 'harmLevel',
    },
    {
      fieldId: `RI_P_Anyadditionalstaffyouwishtobenotified`,
      translationId: 'IM_RI_Anyadditionalstaffyouwishtobenotified',
      label: 'anyadditionalstaffyouwishtobenotified',
      name: 'anyAdditionalstaffyouwishtobenotified',
    },
  ];
  const titleConfig = [
    {
      fieldId: `RI_P_IncidentTitle`,
      translationId: 'IM_RI_IncidentTitle',
      label: 'Incident Title',
      name: 'incidentTitle',
    },
    {
      fieldId: `RI_P_PersonInvolvedintheIncident`,
      translationId: 'IM_RI_PersonInvolvedintheIncident',
      label: 'Person Involved in the Incident',
      name: 'personInvolvedintheIncident',
    },
    {
      fieldId: `RI_PIitI_Visitor`,
      translationId: 'IM_RI_Visitor',
      label: 'Visitor',
      name: 'visitor',
    },
    {
      fieldId: `RI_P_WitnessedBy`,
      translationId: 'IM_RI_WitnessedBy',
      label: 'Witnessed By',
      name: 'witnessedBy',
    },
    {
      translationId: 'IM_RI_Staff',
      label: 'Staff',
      name: 'Staff',
    },
    {
      translationId: 'IM_RI_Patient',
      label: 'Patient',
      name: 'Patient',
    },
    {
      translationId: 'IM_RI_Attachment(s)',
      label: 'Attachment(s)',
      name: 'Attachment(s)',
    },
    {
      translationId: 'IM_RI_Companion',
      label: 'Companion',
      name: 'Companion',
    },
    {
      translationId: 'IM_RI_OutsourcedStaff',
      label: 'Outsourced Staff',
      name: 'OutsourcedStaff',
    },

    {
      fieldId: `RI_P_ImmediateActionTaken`,
      translationId: 'IM_RI_ImmediateActionTaken',
      label: 'Immediate Action Taken',
      name: 'immediateActionTaken',
    },
    {
      translationId: 'IM_SI_IncidentHistory',
      label: 'Incident History',
      name: 'IncidentHistory',
    },
    {
      translationId: 'IM_SI_NotificationHistory',
      label: 'Notification History',
      name: 'NotificationHistory',
    },
    {
      translationId: 'IM_RI_Others',
      label: 'Others',
      name: 'Others',
    },
  ];
  const patientConfig = [
    {
      fieldId: `RI_P_PatientId`,
      translationId: 'IM_RI_PatientId',
      label: 'Patient Id',
      name: 'PatientId',
    },
    {
      fieldId: `RI_P_PatientName`,
      translationId: 'IM_RI_PatientName',
      label: 'Patient Name',
      name: 'PatientName',
    },
    {
      fieldId: `RI_P_PatientAge`,
      translationId: 'IM_RI_PatientAge',
      label: 'Patient Age',
      name: 'PatientAge',
    },
    {
      fieldId: `RI_P_PatientGender`,
      translationId: 'IM_RI_Designation',
      label: 'Patient Gender',
      name: 'PatientGender',
    },
    {
      fieldId: `RI_P_Department`,
      translationId: 'IM_RI_Department',
      label: 'Department',
      name: 'Department',
    },
    {
      fieldId: `RI_P_PatientRoomNo/Details`,
      translationId: 'IM_RI_PatientRoomNo/Details',
      label: 'Patient Room No / Details',
      name: 'PatientRoomNo/Details',
    },
    {
      fieldId: `RI_P_PhysicianName`,
      translationId: 'IM_RI_PhysicianName',
      label: 'Physician Name',
      name: 'PhysicianName',
    },
    {
      fieldId: `RI_P_PhysicianDepartment`,
      translationId: 'IM_RI_PhysicianDepartment',
      label: 'PhysicianDepartment',
      name: 'PhysicianDepartment',
    },
    {
      fieldId: `RI_P_Diagnosis`,
      translationId: 'IM_RI_Diagnosis',
      label: 'Diagnosis',
      name: 'Diagnosis',
    },
    {
      fieldId: `RI_P_VisitId`,
      translationId: 'IM_RI_StaffCategory',
      label: 'Staff Category',
      name: 'StaffCategory',
    },
    {
      fieldId: `RI_P_PhysicianNotified`,
      translationId: 'IM_RI_PhysicianNotified',
      label: 'Physician Notified',
      name: 'PhysicianNotified',
    },
    {
      fieldId: `RI_P_NotifiedPhysician`,
      translationId: 'IM_RI_NotifiedPhysician',
      label: 'Notified Physician',
      name: 'NotifiedPhysician',
    },
    {
      fieldId: `RI_P_NotifiedPhysicianDepartment`,
      translationId: 'IM_RI_NotifiedPhysicianDepartment',
      label: 'Notified Physician Department',
      name: 'NotifiedPhysicianDepartment',
    },
  ];
  const companionConfig = [
    {
      fieldId: `RI_C_PatientId`,
      translationId: 'IM_RI_PatientId',
      label: 'Patient Id',
      name: 'PatientId',
    },
    {
      fieldId: `RI_C_PatientName`,
      translationId: 'IM_RI_PatientName',
      label: 'Patient Name',
      name: 'PatientName',
    },
    {
      fieldId: `RI_P_Department`,
      translationId: 'IM_RI_Department',
      label: 'Department',
      name: 'Department',
    },
    {
      fieldId: `RI_C_PatientRoomNo/Details`,
      translationId: 'IM_RI_PatientRoomNo/Details',
      label: 'Patient RoomNo / Details',
      name: 'PatientRoomNo/Details',
    },
    {
      fieldId: `RI_C_CompanionName`,
      translationId: 'IM_RI_CompanionName',
      label: 'Companion Name',
      name: 'CompanionName',
    },
    {
      fieldId: `RI_C_CompanionAge`,
      translationId: 'IM_RI_CompanionAge',
      label: 'Companion Age',
      name: 'CompanionAge',
    },
    {
      fieldId: `RI_C_CompanionGender`,
      translationId: 'IM_RI_CompanionGender',
      label: 'Companion Gender',
      name: 'CompanionGender',
    },
    {
      fieldId: `RI_C_Relationship`,
      translationId: 'IM_RI_Relationship',
      label: 'Relationship',
      name: 'Relationship',
    },
  ];

  const outSourcedConfig = [
    {
      fieldId: `RI_OS_OutsourcedStaffId`,
      translationId: 'IM_RI_OutsourcedStaffId',
      label: 'Outsourced Staff Id',
      name: 'OutsourcedStaffId',
    },
    {
      fieldId: `RI_OS_OutsourcedStaffName`,
      translationId: 'IM_RI_OutsourcedStaffName',
      label: 'Outsourced Staff Name',
      name: 'OutsourcedStaffName',
    },
    {
      fieldId: `RI_OS_OutsourcedStaffAge`,
      translationId: 'IM_RI_OutsourcedStaffAge',
      label: 'Outsourced Staff Age',
      name: 'OutsourcedStaffAge',
    },
    {
      fieldId: `RI_OS_OutsourcedStaffGender`,
      translationId: 'IM_RI_OutsourcedStaffGender',
      label: 'Outsourced Staff Gender',
      name: 'OutsourcedStaffGender',
    },
    {
      fieldId: `RI_OS_Department`,
      translationId: 'IM_RI_Department',
      label: 'Department',
      name: 'Department',
    },
    {
      fieldId: `RI_OS_CompanyName`,
      translationId: 'IM_RI_CompanyName',
      label: 'Company Name',
      name: 'CompanyName',
    },
  ];
  const staffConfig = [
    {
      fieldId: `RI_S_EmployeeId`,
      translationId: 'IM_RI_EmployeeId',
      label: 'StaffInvolvedId',
      name: 'StaffInvolvedId',
    },
    {
      fieldId: `RI_S_StaffName`,
      translationId: 'IM_RI_StaffName',
      label: 'StaffName',
      name: 'StaffName',
    },
    {
      fieldId: `RI_S_Department`,
      translationId: 'IM_RI_Department',
      label: 'Department',
      name: 'DepartmentName',
    },
    {
      fieldId: `RI_S_Designation`,
      translationId: 'IM_RI_Designation',
      label: 'Designation',
      name: 'DesignationName',
    },
    {
      fieldId: `RI_S_StaffCategory`,
      translationId: 'IM_RI_StaffCategory',
      label: 'Staff Category',
      name: 'StaffCategoryName',
    },
  ];

  const incidentHistoryConfig = [
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
      name: 'IM_SI_ResponsibleStaff',
    },
    {
      fieldId: `SI_IH_Department`,
      translationId: 'IM_SI_Department',
      label: 'Department',
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

  const OthersConfig = [
    {
      fieldId: `RI_O_OtherName`,
      translationId: 'IM_RI_Others',
      label: 'Others',
      name: 'Others',
    },
    {
      fieldId: `RI_O_OtherAge`,
      translationId: 'IM_RI_OtherAge',
      label: 'Other Age',
      name: 'OtherAge',
    },
    {
      fieldId: `RI_O_OtherGender`,
      translationId: 'IM_RI_OtherGender',
      label: 'Other Gender',
      name: 'OtherGender',
    },
    {
      fieldId: `RI_O_Details`,
      translationId: 'IM_RI_Details',
      label: 'Details',
      name: 'Details',
    },
  ];

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
    fieldsData?.Data?.Menus?.filter((item) => item.MenuId === 24) || [];

  const historyfields =
    fieldsData?.Data?.Menus?.filter((item) => item.MenuId === 25) || [];

  const labels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 24)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'ALL')
        .flatMap((region) => region.Labels || [])
    );
  const filterLabels = { Data: labels };

  const Historylabels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 25)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'ALL')
        .flatMap((region) => region.Labels || [])
    );
  const HistoryfilterLabels = { Data: Historylabels };

  const [configs, setConfigs] = useState({
    staffConfig,
    outSourcedConfig,
    companionConfig,
    patientConfig,
    titleConfig,
    additionalConfig,
    attachmentConfig,
    witnessConfig,
    visitorConfig,
    immediateActionTakenConfig,
    incidentConfig,
    fieldsConfig,
    incidentHistoryConfig,
    historyConfig,
    OthersConfig,
  });

  useEffect(() => {
    if (fields?.length > 0) {
      const matchingSections = fields[0]?.Sections?.filter(
        (section) =>
          section.SectionName === 'Accordion-Immediate Action Taken' ||
          section.SectionName === 'Accordion-Page' ||
          section.SectionName === 'Accordion-Witnessed By' ||
          section.SectionName === 'Accordion-Visitor' ||
          section.SectionName === 'Accordion-Staff' ||
          section.SectionName === 'Accordion-Outsourced Staff' ||
          section.SectionName === 'Accordion-Companion' ||
          section.SectionName === 'Accordion-Patient' ||
          section.SectionName === 'Accordion-Others'
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

   useEffect(() => {
      const incidentDateTimeValue = reportIncidentSafe['IncidentDateTime'];
      const reportingDateTimeValue = reportIncidentSafe['ReportingDateTime'];
      if (incidentDateTimeValue && incidentDateTimeValue !== incidentDateTime) {
        setIncidentDateTime(incidentDateTimeValue);
      }
      if (reportingDateTimeValue && reportingDateTimeValue !== incidentReportDateTime) {
        setIncidentReportDateTime(reportingDateTimeValue);
      }
    }, [reportIncidentSafe]); 

  return (
    <>
      <style>
        {`
          .noBottomBorder {
            border-bottom: none !important;
            line-height: 0 !important;
          }
        `}
      </style>
      <Box
        sx={{ display: 'flex', justifyContent: 'center', padding: 2, gap: 3 }}
      >
        <TableContainer sx={{ width: '100%', maxWidth: 1200 }}>
          <Table id="textTable">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#c0c0c0' }}>
                <TableCell
                  colSpan={12}
                  align="center"
                  sx={{ border: '1px solid black', padding: '8px' }}
                >
                  <Typography variant="h6">Incident Report Details</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>

          <Table id="Approval">
            <TableBody>
            {[
  [
    'FacilityName:',
    reportIncidentSafe?.FacilityName,
    'IncidentNo:',
    reportIncidentSafe?.IncidentNo,
  ],
  [
    'Incident Type:',
    reportIncidentSafe?.IncidentType,
    'Be Anonymous:',
    reportIncidentSafe?.Anonymous,
  ],
  [
    'Incident Date:',
    formatDate(reportIncidentSafe?.IncidentDateTime),
    'Incident Day:',
    reportIncidentSafe?.IncidentDateTime
      ? new Date(reportIncidentSafe.IncidentDateTime).toLocaleDateString(
          i18n.language,
          { weekday: 'long' }
        )
      : '',
  ],
  [
    'Incident Time:',
    reportIncidentSafe?.IncidentDateTime
      ? reportIncidentSafe.IncidentDateTime.split('T')[1].slice(0, 5)
      : '',
    'Report Date:',
    formatDate(reportIncidentSafe?.ReportingDateTime),
  ],
  [
    'Report Day:',
    reportIncidentSafe?.ReportingDateTime
      ? new Date(reportIncidentSafe.ReportingDateTime).toLocaleDateString(
          i18n.language,
          { weekday: 'long' }
        )
      : '',
    'Report Time:',
    reportIncidentSafe?.ReportingDateTime
      ? reportIncidentSafe.ReportingDateTime.split('T')[1].slice(0, 5)
      : '',
  ],
  [
    'Clinical/Non Clinical:',
    reportIncidentSafe.ClinicalType,
    '',
    '',
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
        colSpan={cellIndex % 2 === 0 ? 3 : 6}
      >
        {cell}
      </TableCell>
    ))}
  </TableRow>
))}

            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Incident Title */}

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: 2,
          gap: 3,
          flexDirection: 'column',
        }}
      >
        <TableContainer sx={{ width: '100%' }}>
          <Table id="MainTitle">
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <Typography variant="h6">Incident Title</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>
          <Table id="Approval">
            <TableBody>
              {/* Row with two key-value pairs */}
              {[
                [
                  'Incident Main Category:',
                  reportIncidentSafe.BriefDescriptionOfIncident,
                  '',
                  '',
                ],
                [
                  'Incident Sub Category:',
                  reportIncidentSafe.SubCategory,
                  '',
                  '',
                ],
                [
                  'Incident Details:',
                  reportIncidentSafe.IncidentDetail,
                  '',
                  '',
                ],
                [
                  
                  'Remarks:',
                  reportIncidentSafe.Remarks,
                  '',
                  ''
                ],
                [
                  'Brief Description of Incident:',
                  reportIncidentSafe.BriefDescriptionOfIncident,
                  '',
                  '',
                ],
                [
                  'Incident Department:',
                  reportIncidentSafe.DepartmentName,
                  'Location Details (Room No etc):',
                  reportIncidentSafe.LocationDetails,
                ],
              ].map((row, index) => (
                <TableRow key={index}>
                  {row.map((cell, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      className={
                        cellIndex % 2 === 0 ? 'bold-cell' : 'noBottomBorder'
                      }
                      sx={{
                        fontWeight: cellIndex % 2 === 0 ? 'bold' : 'normal',
                        padding: '8px',
                        backgroundColor:
                          cellIndex % 2 === 0 ? '#f5f5f5' : 'white',
                        border: '1px solid black',
                        width: '25%',
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
        </TableContainer>

        <Box>
          {
            incidentActionTakenSafe.length > 0 && (
        <ApproveIncidentPdf
                    columns={configs.immediateActionTakenConfig}
                    labels={filterLabels}
                    title={
                      titleConfig.find(
                        (config) => config.name === 'immediateActionTaken'
                      )
                        ? 'Immediate Action Taken'
                        : ''
                    }
                    data = {incidentActionTakenSafe}
              />
            )
          }
          
        </Box>
      </Box>

      <ApproveIncidentPdf
        columns={configs.staffConfig}
        labels={filterLabels}
        data={incidentStaffInvolvedsafe}
        title={
          titleConfig.find((config) => config.name === 'Staff') ? 'Staff' : ''
        }
      />

<TableContainer sx={{ width: '100%' }}>
  <Table id="MainTitle">
    <TableHead>
      <TableRow>
        <TableCell align="left">
          <Typography variant="h6">Patient(s)</Typography>
        </TableCell>
      </TableRow>
    </TableHead>
  </Table>
  <Table id="Patient">
    <TableBody>
    {incidentPatientInvolvedSafe.map((patient, index) => (
  <TableContainer key={index} sx={{ width: '100%', marginBottom: 2 }}>
    <Table id="MainTitle">
      <TableHead>
        <TableRow>
          <TableCell align="left">
            <Typography variant="h6"> Patient No.{index+1}  </Typography>
          </TableCell>
        </TableRow>
      </TableHead>
    </Table>
    <Table id="Patient">
      <TableBody>
        {[
          ['Patient ID:', patient.PatientId, 'Patient Name:', patient.PatientName],
          ['Age:', patient.Age, 'Gender:', patient.Gender],
          ['Department:', patient.DepartmentId, 'Room No:', patient.RoomNo],
          [
            'Diagnosis:', patient.Diagnosis, 
            'Physician Notified:', patient.IsPhysicianNotified ? 'Yes' : 'No'
          ],
        ].map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TableCell
                key={cellIndex}
                className={cellIndex % 2 === 0 ? 'normal' : 'noBottomBorder'}
                sx={{
                  fontWeight: cellIndex % 2 === 0 ? 'normal' : 'normal',
                  padding: '8px',
                  backgroundColor: cellIndex % 2 === 0 ? '#f5f5f5' : 'white',
                  border: '1px solid black',
                  width: '25%',
                }}
                colSpan={3}
              >
                {cell}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
    {/* Separator Line */}
    {index < incidentPatientInvolvedSafe.length - 1 && (
      <hr style={{ border: '1px solid black', margin: '10px 0' }} />
    )}
  </TableContainer>
))}


    </TableBody>
  </Table>
</TableContainer>

      {incidentRelativeInvolvedSafe?.length > 0 && (<ApproveIncidentPdf
        columns={configs.companionConfig}
        labels={filterLabels}
        data={incidentRelativeInvolvedSafe}
        title={
          titleConfig.find((config) => config.name === 'Companion')
            ? 'Companion'
            : ''
        }
      />)}

     {incidentVisitorInvolvedSafe?.length > 0 && ( <ApproveIncidentPdf
        columns={configs.visitorConfig}
        labels={filterLabels}
        data={incidentVisitorInvolvedSafe}
        title={
          titleConfig.find((config) => config.name === 'visitor')
            ? 'Visitor'
            : ''
        }
      />)}

      {incidentOutStaffInvolvedSafe.length > 0 && (<ApproveIncidentPdf
        columns={configs.outSourcedConfig}
        labels={filterLabels}
        data={incidentOutStaffInvolvedSafe}
        title={
          titleConfig.find((config) => config.name === 'OutsourcedStaff')
            ? 'Outsourced Staff'
            : ''
        }
      />)}

     {incidentOthersInvolvedSafe?.length > 0 && ( <ApproveIncidentPdf
        columns={configs.OthersConfig}
        labels={filterLabels}
        data={incidentOthersInvolvedSafe}
        title={
          titleConfig.find((config) => config.name === 'Others') ? 'Others' : ''
        }
      />)}

     {incidentWitnessedBySafe?.length > 0 && ( <ApproveIncidentPdf
        columns={configs.OthersConfig}
        labels={filterLabels}
        data={incidentWitnessedBySafe}
        title={
          titleConfig.find((config) => config.name === 'witnessedBy')
            ? 'Witnessed By'
            : ''
        }
      />)}


 {reportIncidentAttachmentSafe?.length > 0 && (
   <ApproveIncidentPdf
    columns={attachmentConfig}
    labels={filterLabels}
    data={reportIncidentAttachmentSafe}
    title={
      titleConfig.find((config) => config.name === 'Attachment(s)')
        ? 'Attachment(s)'
        : ''
    }
  />
)}
      <Box>
        {approvalviewstatus && <Approved reportCustomize={extractedData}/>}
        {investigationView && <InvestigationDetails reportCustomize={extractedData}/>}
        {RCAView && <RootCauseAnalysisPdf RCADraft={RCADraft} reportCustomize={extractedData}/>}
        {closureView && <IncidentClosurePdf closureDraft={closureDraft} reportCustomize={extractedData}/>}
        {searchView && <SearchIncidentPdf reportCustomize={extractedData}/>}
        {IncidentCompletedOpinionView && <OpinionCompletedViewPdf/>}
        

      </Box>
    </>
  );
};
export default IncidentDetails;
