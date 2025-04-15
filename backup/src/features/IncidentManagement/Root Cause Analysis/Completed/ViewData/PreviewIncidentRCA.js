import React, { useState, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TabPanel from '../../../../../components/Tabpanel/Tabpanel';
import useWindowDimension from '../../../../../hooks/useWindowDimension';
import {
  FlexContainer,
  StyledTab,
  StyledImage,
  StyledTypography,
  FormLabel,
} from '../../../../../utils/StyledComponents';
import EventSequence from './EventSequence';
import Introduction from './Introduction';
import ActionPlan from './ActionPlan';
import TeamInvolved from './TeamInvolved';
import ViewTable from './ViewTable';
import AttachmentTable from './AttachmentTable';
import PrintFileIcon from '../../../../../assets/Icons/PrintFileIcon.png';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetIncidentRCAViewDataQuery } from '../../../../../redux/RTK/IncidentManagement/incidentRcaAPI';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../../redux/RTK/moduleDataApi';
import { useDispatch, useSelector } from 'react-redux';
import IncidentDetails from '../../../IncidentCommon/IncidentDetails';
import IncidentApprovalDetails from '../../../IncidentCommon/IncidentApprovalDetails';
import IncidentInvestigationDetails from '../../../IncidentCommon/IncidentInvestigationDetails';
import { getlabel } from '../../../../../utils/language';
import { useTranslation } from 'react-i18next';
import { useGetIncidentDetailsPendingByIdQuery } from '../../../../../redux/RTK/incidentInvestigationApi';
import IncidentDetailPdf from '../../../IncidentCommon/Pdf Section/IncidentDetailPdf';
import Logo from '../../../../../assets/Icons/Logo.png';
import { jsPDF } from 'jspdf';
import RCAQuestions from './RCAQuestions';
import 'jspdf-autotable';

const PreviewIncidentRCA = () => {
  const { id, rcaid } = useParams();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const pdfSectionRef = useRef(null);

  const { data: incidentData } = useGetIncidentDetailsPendingByIdQuery(
    {
      menuId: 27,
      loginUserId: 1,
      incidentId: id,
      moduleId: 2,
    },
    { skip: !id }
  );

  const { reportIncident, incidentStaffInvolved, incidentPatientInvolved } =
    incidentData?.Data || {};
  var reportIncidentSafe = reportIncident || {};

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
  const rCAQuestionAnswers = entryData?.Data?.rCAQuestionAnswers;
  const rcaActions = entryData?.Data?.rcaActions;
  const mailToStaffs = entryData?.Data?.mailToStaffs;
  const incidentRCA_Attachments = entryData?.Data?.incidentRCA_Attachments;
  const FishboneAttachments = [
    {
      OriginalFileName: entryData?.Data?.FishboneOriginalFileName || '',
      AutogenFilePath: entryData?.Data?.FishboneAutogenFilePath || '',
    },
  ];
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
  const htmlToText = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    const extractText = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.trim();
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const nodeName = node.nodeName.toLowerCase();
        const childTexts = Array.from(node.childNodes)
          .map((child) => extractText(child))
          .filter((text) => text.length > 0)
          .join(' '); // Join with space to prevent words merging

        switch (nodeName) {
          case 'h1':
          case 'h2':
          case 'h3':
          case 'h4':
          case 'h5':
          case 'h6':
            return `\n\n${childTexts.toUpperCase()}\n\n`; // Add spacing for readability
          case 'p':
            return `\n${childTexts}\n`; // Ensure paragraphs have space
          case 'ul':
            return `\n${childTexts}\n`; // Newline before and after unordered lists
          case 'li':
            return `\n• ${childTexts}`; // Add bullets for list items
          case 'br':
            return '\n'; // New line for line breaks
          case 'strong':
          case 'b':
            return `**${childTexts}**`; // Bold text
          case 'em':
          case 'i':
            return `_${childTexts}_`; // Italic text
          case 'a':
            return `[${childTexts}](${node.href})`; // Keep links
          default:
            return childTexts;
        }
      }
      return '';
    };

    return extractText(tempDiv)
      .replace(/\n{3,}/g, '\n\n') // Ensure no excessive newlines
      .trim();
  };

  const handlePrint = () => {
    try {
      const doc = new jsPDF('p', 'pt', 'a4');
      const pdfFileName = 'Incident_RCA_Completed.pdf';
      const margin = 40;
      let isFirstPage = true;
      let currentPage = 1;
      let totalPages = 0;
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      const logoWidth = 40;
      const logoHeight = 40;
      const headerY = margin + 10;
      const footerY = pageHeight - margin - 15;

      const addHeaderFooter = (data) => {
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const headerY = margin + 10;
        const footerY = pageHeight - margin - 15;

        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(
          margin,
          margin,
          pageWidth - 2 * margin,
          pageHeight - 2 * margin
        );

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);

        const logoX = margin + 10;
        const logoY = headerY + 5;

        const incidentIdX = pageWidth - margin - 200;
        const incidentIdY = logoY + logoHeight / 2;

        const tableStartY = headerY + logoHeight + 30;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        doc.text(``, margin + 5, footerY);

        doc.setLineWidth(0.5);
        doc.line(margin, footerY - 20, pageWidth - margin, footerY - 20);
      };

      const tables = pdfSectionRef.current?.querySelectorAll('table') || [];

      let startY = headerY + logoHeight + 30;

      const innerMargin = 10;
      const effectiveMargin = margin + innerMargin;
      const effectiveWidth = pageWidth - 2 * effectiveMargin;

      tables.forEach((table) => {
        const tableText = htmlToText(table.innerHTML);
        const tableConfig = {
          html: table,
          startY,
          theme: 'grid',
          margin: {
            left: effectiveMargin,
            right: effectiveMargin,
            top: 150,
            bottom: 100,
          },
          tableWidth: effectiveWidth,
          pageBreak: 'auto',
          didDrawPage: addHeaderFooter,
          styles: {
            fontSize: 10,
            cellPadding: 4,
            lineWidth: 0.1,
            lineColor: [0, 0, 0],
            overflow: 'linebreak',
          },
        };

        switch (table.id) {
          case 'textTable':
            Object.assign(tableConfig, {
              headStyles: {
                fillColor: [192, 192, 192],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'center',
                cellPadding: 8,
                fontSize: 12,
              },
              columnStyles: {
                cellPadding: 1,
              },
              bodyStyles: {
                textColor: [0, 0, 0],
              },
              didParseCell: (data) => {
                if (data.cell.raw.classList.contains('bold-cell')) {
                  data.cell.styles.textColor = [0, 0, 0];
                  data.cell.styles.fontStyle = 'bold';
                }
              },
            });
            break;

          case 'Approval':
            Object.assign(tableConfig, {
              headStyles: {
                fillColor: [192, 192, 192],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'center',
              },
              styles: {
                fontSize: 10,
                cellPadding: 10,
                lineColor: [0, 0, 0],
                overflow: 'linebreak',
                textColor: [0, 0, 0],
                lineWidth: 0,
                align: 'left',
              },
              didParseCell: (data) => {
                if (data.cell.raw.classList.contains('bold-cell')) {
                  data.cell.styles.textColor = [0, 0, 0];
                  data.cell.styles.fontStyle = 'bold';
                }
              },
            });
            break;

            case 'Questions':
              Object.assign(tableConfig, {
                headStyles: { 
                  fillColor: [255, 255, 255], 
                  textColor: [0, 0, 0], 
                  fontStyle: 'bold', 
                  halign: 'left', 
                  lineWidth: 0 
                },
                styles: { 
                  fontSize: 10, 
                  cellPadding: 10, 
                  overflow: 'linebreak', 
                  textColor: [0, 0, 0], 
                  lineWidth: 0, 
                  halign: 'left' 
                },
                tableLineWidth: 0,
                didParseCell: (data) => {
                  if (data.row.index === 0 || data.row.index === 1) {
                    data.cell.styles.fontStyle = 'bold';
                  }
                  if ((data.row.index - 1) % 4 === 0 && data.column.index === 0) {
                    data.cell.styles.fillColor = [192, 192, 192];
                    data.cell.styles.fontStyle = 'bold';
                    const serialNumber = Math.floor((data.row.index) / 4) + 1;
                    data.cell.text = serialNumber + ') ' + data.cell.text;
                  }
                  
                  
                  
                },
              });
              break;
            

            

          case 'IntroContainer':
            Object.assign(tableConfig, {
              headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'left',
                lineWidth: 0,
              },
              styles: {
                fontSize: 10,
                cellPadding: 10,
                overflow: 'linebreak',
                textColor: [0, 0, 0],
                lineWidth: 0,
                halign: 'left',
              },
              tableLineWidth: 0,
              didParseCell: (data) => {
                if (data.row.index === 0) {
                  data.cell.styles.fontStyle = 'bold';
                }
              },
            });
            break;

          case 'table':
            const space = doc.lastAutoTable.finalY + 5;
            Object.assign(tableConfig, {
              padding: 100,
              headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'center',
                lineWidth: 0.5,
                lineColor: [0, 0, 0],
              },
              style: {
                padding: 40,
              },
              bodyStyles: {
                halign: 'center',
                lineWidth: 0.5,
                lineColor: [0, 0, 0],
                textColor: [0, 0, 0],
              },
              alternateRowStyles: {
                fillColor: [255, 255, 255],
              },
              columnStyles: {
                0: { cellWidth: 'auto' },
              },
              startY: space,
            });
            break;

          // case 'Patient':
          //   Object.assign(tableConfig, {
          //     headStyles: {
          //       fillColor: [192, 192, 192],
          //       textColor: [0, 0, 0],
          //       fontStyle: 'bold',
          //       halign: 'center',
          //     },
          //     styles: {
          //       fontSize: 10,
          //       cellPadding: 10,
          //       textColor: [0, 0, 0],
          //       lineWidth: 0,
          //       align: 'left',
          //     },
          //     didParseCell: (data) => {
          //       if (data.cell.raw.classList.contains('bold-cell')) {
          //         data.cell.styles.textColor = [0, 0, 0];
          //         data.cell.styles.fontStyle = 'bold';
          //       }
          //     },
          //     didDrawPage: addHeaderFooter,
          //     didDrawCell: (data) => {
          //       const { doc, table, row } = data;

          //       const currentPatientID =
          //         table.body[row.index]?.raw?.dataset?.patientId;
          //       const nextPatientID =
          //         table.body[row.index + 1]?.raw?.dataset?.patientId;

          //       if (
          //         currentPatientID &&
          //         (!nextPatientID || currentPatientID !== nextPatientID)
          //       ) {
          //         const startX = table.settings.margin.left;
          //         const endX =
          //           doc.internal.pageSize.width - table.settings.margin.right;
          //         const lineY = data.cursor.y + 5;

          //         doc.setLineWidth(0.5);
          //         doc.line(startX, lineY, endX, lineY);
          //       }
          //     },
          //   });

          //   doc.autoTable(tableConfig);
          //   break;

          case 'MainTitle':
            const startY = doc.lastAutoTable.finalY + 5;
            Object.assign(tableConfig, {
              headStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'left',
                cellPadding: 8,
                lineWidth: 0,
              },
              styles: {
                fontSize: 12,
                cellPadding: 2,
                lineWidth: 0,
              },
              bodyStyles: {
                fillColor: [255, 255, 255],
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'left',
              },
              startY: startY,
            });
            break;

          default:
            Object.assign(tableConfig, {
              headStyles: { fillColor: [255, 255, 255] },
            });
        }

        doc.autoTable(tableConfig);
        startY = doc.lastAutoTable.finalY + 20;
      });

      if (!doc.internal.pages) return;
      if (doc.internal.pages && doc.internal.pages.length > 0) {
        totalPages = doc.internal.pages.length;

        for (let i = 1; i <= totalPages - 1; i++) {
          const page = doc.internal.pages[i];
          const pageWidth = doc.internal.pageSize.width;
          const pageHeight = doc.internal.pageSize.height;
          const footerY = pageHeight - margin - 15;

          const logoWidth = 150;
          const logoHeight = 40;
          const logoX = margin + 10;
          const logoY = headerY + 5;

          const imgElement = document.getElementById('logo');
          const logoSrc = imgElement.src;

          doc.addImage(logoSrc, 'PNG', logoX, logoY, logoWidth, logoHeight);

          const facilityNameX = pageWidth - margin - 20;
          const facilityNameY = logoY + 15;

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(14);
          doc.text(
            `${reportIncidentSafe.FacilityName}`,
            facilityNameX,
            facilityNameY,
            { align: 'right' }
          );

          const incidentIdY = facilityNameY + 25;
          doc.text(
            `Incident No: ${reportIncidentSafe.IncidentNo}`,
            facilityNameX,
            incidentIdY,
            { align: 'right' }
          );

          const linePadding = 20;

          const headerBottomY = incidentIdY + 10;
          doc.setLineWidth(0.5);
          doc.line(
            margin + linePadding,
            headerBottomY,
            pageWidth - margin - linePadding,
            headerBottomY
          );

          doc.setPage(i);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.text(
            `Page ${i} of ${totalPages - 1}`,
            pageWidth - margin - 25,
            footerY,
            { align: 'right' }
          );
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text(`Confidential Information`, pageWidth / 2, footerY, {
            align: 'center',
          });
        }
      }

      doc.save(pdfFileName);
    } catch (error) {
      console.error('PDF generation error:', error);
    }
  };

  return (
    <FlexContainer
      flexDirection="column"
      width="100%"
      style={{ backgroundColor: '#fff' }}
      padding="20px"
    >
      <FlexContainer
        marginBottom={'30px'}
        justifyContent={'space-between'}
        style={{ paddingBottom: '15px' }}
      >
        <StyledTypography
          fontSize="30px"
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {'Root Causes Analysis'}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer
        style={{
          padding: '20px 15px',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
        }}
      >
        <FlexContainer>
          <button
            style={{
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '8px 16px',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px',
              display: 'block',
              fontSize: '13px',
            }}
            onClick={() => navigate('/IncidentManagement/RootCauseAnalysis')}
          >
            « Previous
          </button>
        </FlexContainer>
        <StyledImage
          height="40px"
          width="40px"
          gap="10px"
          cursor="pointer"
          borderRadius="40px"
          src={PrintFileIcon}
          onClick={() => handlePrint()}
          alt="Print"
          animate={true}
        />
      </FlexContainer>
      <Introduction data={introData} />

      <IncidentDetails />

      <IncidentApprovalDetails />

      <IncidentInvestigationDetails />

      <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
        {getlabel(
          'IM_RCA_TeamInvolvedinPreparingRootCauseAnalysis',
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
        {getlabel('IM_RCA_EventsSequence', filterLabels, i18n.language)}:
      </FormLabel>

      <ViewTable
        columns={configs.eventSequenceConfig}
        labels={filterLabels}
        data={mappedEventData}
      />
      <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
        {getlabel('IM_RCA_Question/Answer', filterLabels, i18n.language)}:
      </FormLabel>
      <RCAQuestions questions={rCAQuestionAnswers} />

      <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
        {getlabel('IM_RCA_ActionPlan', filterLabels, i18n.language)}:
      </FormLabel>
      <Introduction data={ActionPlanData} />
      <ViewTable
        columns={configs.rootCauseConfig}
        labels={filterLabels}
        data={rcaActions}
      />
      <FlexContainer
        style={{ marginTop: '20px', gap: '20px', display: 'flex' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <FormLabel style={{ margin: '10px 0px' }}>
            {getlabel(
              'IM_RCA_ExistingAttachment(s)',
              filterLabels,
              i18n.language
            )}
            :
          </FormLabel>
          <AttachmentTable
            columns={attachmentConfig}
            labels={filterLabels}
            data={incidentRCA_Attachments}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <FormLabel style={{ margin: '10px 0px' }}>
            {getlabel('IM_RCA_ExistingFishBone', filterLabels, i18n.language)}:
          </FormLabel>
          <AttachmentTable
            columns={attachmentConfig}
            labels={filterLabels}
            data={FishboneAttachments}
          />
        </div>
      </FlexContainer>

      <FormLabel style={{ margin: '10px 0px 10px 0px' }}>
        {getlabel('IM_RCA_MailTo', filterLabels, i18n.language)}:
      </FormLabel>
      <ViewTable
        columns={configs.teamMemberConfig}
        labels={filterLabels}
        data={mailToStaffs}
      />
      <div
        ref={pdfSectionRef}
        id="pdfSectionRef"
        className="no-print"
        style={{ display: 'none' }}
      >
        <>
          <img id="logo" src={Logo} />
        </>
        <IncidentDetailPdf
          approvalviewstatus={true}
          investigationView={true}
          RCAView={true}
          RCADraft={false}
          searchView={false}
        />
      </div>
    </FlexContainer>
  );
};

export default PreviewIncidentRCA;
