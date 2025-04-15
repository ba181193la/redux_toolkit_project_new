import React, { useState, useEffect, useMemo } from 'react';
import {
    Accordion,
    AccordionSummary,

  } from '@mui/material';
import {
  FlexContainer,
  StyledTab,
  StyledImage,
  StyledTypography,
  FormLabel,
} from '../../../utils/StyledComponents';
import Introduction from './Introduction';
import ViewTable from './Datatable/ViewTable';
import AttachmentTable from './Datatable/AttachmentTable';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetIncidentRCAViewDataQuery } from '../../../redux/RTK/IncidentManagement/incidentRcaAPI';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../redux/RTK/moduleDataApi';
import { useDispatch, useSelector } from 'react-redux';
import { getlabel } from '../../../utils/language';
import { useTranslation } from 'react-i18next';
import ExpandIcon from '../../../assets/Icons/ExpandIcon.png';

const PreviewIncidentRCA = () => {

  const { id, rcaid } = useParams();
  const { i18n, t } = useTranslation();


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
      name: 'UserName',
    },
    {
      fieldId: `RCA_TiipRCA_Department`,
      translationId: 'IM_RCA_Department',
      label: 'Designation',
      name: 'Department',
    },
    {
      fieldId: `RCA_TiipRCA_Designation`,
      translationId: 'IM_RCA_Designation',
      label: 'Staff Category',
      name: 'Designation',
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
    // {
    //   fieldId: `RCA_MT_Facility`,
    //   translationId: 'IM_RCA_Facility',
    //   label: 'Department',
    //   name: 'DepartmentName',
    // },
    // {
    //   fieldId: `RCA_MT_EmployeeId`,
    //   translationId: 'IM_RCA_EmployeeId',
    //   label: 'Designation',
    //   name: 'DesignationName',
    // },
    {
      fieldId: `RCA_MT_StaffName`,
      translationId: 'IM_RCA_StaffName',
      label: 'Staff Category',
      name: 'StaffCategoryName',
    },
    {
      fieldId: `RCA_MT_Department`,
      translationId: 'IM_RCA_Department',
      label: 'Staff Category',
      name: 'StaffCategoryName',
    },
    {
      fieldId: `RCA_MT_Designation`,
      translationId: 'IM_RCA_Designation',
      label: 'Staff Category',
      name: 'StaffCategoryName',
    },
   
  ];
  const attachmentConfig = [
    {
      fieldId: `RI_P_Attachment`,
      translationId: 'IM_RI_Attachment(s)',
      label: 'Attachment(s)',
      name: 'attachment(s)',
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
        mailToConfig
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
          section.SectionName === "Accordion-Team involved in preparing Root Cause Analysis" ||
          section.SectionName === "Accordion-Events Sequence" || 
          section.SectionName === "Accordion-Root Cause" ||
          section.SectionName === "Accordion-Mail To"

 );
  
      const pageFields = matchingSections?.flatMap(
        (section) =>
          section?.Regions?.filter((region) => region.RegionCode === "ALL"
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


  const { data: entryData, isFetching: isFetchingData } =
  useGetIncidentRCAViewDataQuery(
    {
      incidentId: id,
      loginUserId: 1,
      moduleId: 2,
      menuId: 31,
    },
    { skip: !id }
  );

  
  const introData = entryData?.Data?.Introduction;
  const incidentId = entryData?.Data?.IncidentId;
  const ActionPlanData = entryData?.Data?.ActionPlan;
  const teamMembersRCA = entryData?.Data?.teamMembersRCA;
  const RCAEventSequence = entryData?.Data?.RCAEventSequence;
  const rcaActions = entryData?.Data?.rcaActions;
  const mailToStaffs = entryData?.Data?.mailToStaffs;
  const incidentRCA_Attachments = entryData?.Data?.incidentRCA_Attachments;
  const formattedAttachments = incidentRCA_Attachments?.map((item) => ({
    AutogenFileName: item?.AutogenFileName, 
    OriginalFileName: item?.OriginalFileName,
    AutogenFilePath: item?.AutogenFilePath, 
    FilePath: item?.FilePath || {},
    IsDelete: false,
  }));
  const FishboneAttachments = [
    {
        OriginalFileName: entryData?.Data?.FishboneOriginalFileName,
        AutogenFilePath: entryData?.Data?.FishboneAutogenFilePath,

  }
]
const mappedEventData = RCAEventSequence?.map((event, index) => {
  let eventDate = event?.EventDate || '';
  let eventTime = '';
  if (eventDate) {
    const parts = eventDate.split('T');
    eventDate = parts[0]; 
    eventTime = parts[1] || ''; 
  }
  return {
    EventDate: eventDate,
    EventActivity: event?.EventActivity || '',
    EventTime: eventTime,
    isEditable: false,
  };
});
    return(
    <FlexContainer flexDirection="column" width="100%"
    style={{ backgroundColor: '#fff' }} padding = "20px"
    >
<Introduction 
        data = {introData}
        />
        

  <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
          {getlabel(
            "IM_RCA_TeamInvolvedinPreparingRootCauseAnalysis",
            filterLabels,
            i18n.language
          )}
          :
        </FormLabel>

<ViewTable
          columns={configs.teamMemberConfig}
          labels={filterLabels}
          data={teamMembersRCA}
        />
  <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
          {getlabel(
            "IM_RCA_EventsSequence",
            filterLabels,
            i18n.language
          )}
          :
        </FormLabel>

<ViewTable
          columns={configs.eventSequenceConfig}
          labels={filterLabels}
          data={mappedEventData}
        />
          <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
          {getlabel(
            "IM_RCA_ActionPlan",
            filterLabels,
            i18n.language
          )}
          :
        </FormLabel>
        <Introduction 
        data = {ActionPlanData}
        />
        <ViewTable
          columns={configs.rootCauseConfig}
          labels={filterLabels}
          data={rcaActions}
        />
<FlexContainer style={{ marginTop: "20px", gap: "20px", display: "flex" }}>
  <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
    <FormLabel style={{ margin: '10px 0px' }}>
      {getlabel("IM_RCA_ExistingAttachment(s)", filterLabels, i18n.language)}:
    </FormLabel>
    <AttachmentTable
      columns={attachmentConfig}
      labels={filterLabels}
      data={formattedAttachments}
    />
  </div>

  <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
    <FormLabel style={{ margin: '10px 0px' }}>
      {getlabel("IM_RCA_ExistingFishBone", filterLabels, i18n.language)}:
    </FormLabel>
    <AttachmentTable
      columns={attachmentConfig}
      labels={filterLabels}
      data={FishboneAttachments}
    />
  </div>
</FlexContainer>





           <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
          {getlabel(
            "IM_RCA_MailTo",
            filterLabels,
            i18n.language
          )}
          :
        </FormLabel>
        <ViewTable
          columns={configs.teamMemberConfig}
          labels={filterLabels}
          data={mailToStaffs}
        />

</FlexContainer>
    )
};

export default PreviewIncidentRCA;
