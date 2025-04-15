import React, { useState, useEffect, useMemo } from 'react';
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
} from '../../../../../utils/StyledComponents';
import EventSequence from './EventSequence';
import Introduction from './Introduction';
import ActionPlan from './ActionPlan';
import TeamInvolved from './TeamInvolved';
import IncidentDetails from './IncidentDetails.js' 
import PrintFileIcon from '../../../../../assets/Icons/PrintFileIcon.png';
import { useNavigate,useParams } from 'react-router-dom';
import { useGetIncidentRCAEntryDataByIdQuery } from '../../../../../redux/RTK/IncidentManagement/incidentRcaAPI';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../../redux/RTK/moduleDataApi';
import { useDispatch, useSelector } from 'react-redux';
import {
  setTeamTableData,
  setEventTableData
} from '../../../../../redux/features/mainMaster/incidentRcaSlice.js';
import { useGetIncidentDetailsPendingByIdQuery } from '../../../../../redux/RTK/incidentInvestigationApi';
import IncidentDetailPdf from '../../../IncidentCommon/Pdf Section/IncidentDetailPdf';
import Logo from '../../../../../assets/Icons/Logo.png';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const { id, rcaid } = useParams();
  const dispatch = useDispatch();

 
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
      name: 'OutsourcedStaffId',
    },
    {
      fieldId: `RCA_ES_Time`,
      translationId: 'IM_RCA_Time',
      label: 'Outsourced Staff Name',
      name: 'OutsourcedStaffName',
    },
    {
      fieldId: `RCA_ES_Activity`,
      translationId: 'IM_RCA_Activity',
      label: 'Outsourced Staff Age',
      name: 'OutsourcedStaffAge',
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
      name: 'DepartmentName',
    },
    {
      fieldId: `RCA_TiipRCA_Department`,
      translationId: 'IM_RCA_Department',
      label: 'Designation',
      name: 'DesignationName',
    },
    {
      fieldId: `RCA_TiipRCA_Designation`,
      translationId: 'IM_RCA_Designation',
      label: 'Staff Category',
      name: 'StaffCategoryName',
    },
  ];
  const rootCauseConfig = [
   
    {
      fieldId: `RCA_RC_RootCauseFindings`,
      translationId: 'IM_RCA_RootCauseFindings',
      label: 'Designation',
      name: 'DesignationName',
    },
    {
      fieldId: `RCA_RC_RootCauseReference`,
      translationId: 'IM_RCA_RootCauseReference',
      label: 'Staff Category',
      name: 'StaffCategoryName',
    },
    {
      fieldId: `RCA_RC_TaskAssigned`,
      translationId: 'IM_RCA_TaskAssigned',
      label: 'Staff Category',
      name: 'StaffCategoryName',
    },
    {
      fieldId: `RCA_RC_ResponsibleStaff`,
      translationId: 'IM_RCA_ResponsibleStaff',
      label: 'Staff Category',
      name: 'StaffCategoryName',
    },
    {
      fieldId: `RCA_RC_Department`,
      translationId: 'IM_RCA_Department',
      label: 'Department',
      name: 'DepartmentName',
    },
    {
      fieldId: `RCA_RC_TargetDate`,
      translationId: 'IM_RCA_TargetDate',
      label: 'Staff Category',
      name: 'StaffCategoryName',
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
 useGetIncidentRCAEntryDataByIdQuery(
    {
      RCAId: rcaid,
      loginUserId: 1,
      moduleId: 2,
      menuId: 31,
    },
    { skip: !id }
  );

  
  // const Introduction =  entryData?.Data?.RCAId
  
  const introData = entryData?.Data?.Introduction;
  const incidentId = entryData?.Data?.IncidentId;
  const ActionPlanData = entryData?.Data?.ActionPlan;


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
            .map(child => extractText(child))
            .filter(text => text.length > 0)
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
           const pdfFileName = 'Incident_RCA_Drafted.pdf';
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
             const tableText = htmlToText(table.innerHTML)
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
   
                 case 'IntroContainer':
                   Object.assign(tableConfig, {
                     headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold', halign: 'left', lineWidth: 0 },
                     styles: { fontSize: 10, cellPadding: 10, overflow: 'linebreak', textColor: [0, 0, 0], lineWidth: 0, halign: 'left' },
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
     
              //  case 'Patient':
              //    Object.assign(tableConfig, {
              //      headStyles: {
              //        fillColor: [192, 192, 192],
              //        textColor: [0, 0, 0],
              //        fontStyle: 'bold',
              //        halign: 'center',
              //      },
              //      styles: {
              //        fontSize: 10,
              //        cellPadding: 10,
              //        textColor: [0, 0, 0],
              //        lineWidth: 0,
              //        align: 'left',
              //      },
              //      didParseCell: (data) => {
              //        if (data.cell.raw.classList.contains('bold-cell')) {
              //          data.cell.styles.textColor = [0, 0, 0];
              //          data.cell.styles.fontStyle = 'bold';
              //        }
              //      },
              //      didDrawPage: addHeaderFooter,
              //      didDrawCell: (data) => {
              //        const { doc, table, row } = data;
     
              //        const currentPatientID =
              //          table.body[row.index]?.raw?.dataset?.patientId;
              //        const nextPatientID =
              //          table.body[row.index + 1]?.raw?.dataset?.patientId;
     
              //        if (
              //          currentPatientID &&
              //          (!nextPatientID || currentPatientID !== nextPatientID)
              //        ) {
              //          const startX = table.settings.margin.left;
              //          const endX =
              //            doc.internal.pageSize.width - table.settings.margin.right;
              //          const lineY = data.cursor.y + 5;
     
              //          doc.setLineWidth(0.5);
              //          doc.line(startX, lineY, endX, lineY);
              //        }
              //      },
              //    });
     
              //    doc.autoTable(tableConfig);
              //    break;
     
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
    <FlexContainer style={{ flexDirection: 'column', width: '100%' }}>
      <FlexContainer
        marginBottom={'30px'}
        marginTop={'65px'}
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
          {('Root Causes Analysis')}
        </StyledTypography>
        <StyledImage
              height="40px"
              width="40px"
              gap="10px"
              cursor="pointer"
              borderRadius="40px"
              src={PrintFileIcon}
              alt="Print"
              animate={true}
            />

      </FlexContainer>
    
    <FlexContainer
    height="100%"
    width="100%"
    padding="35px 15px 0"
    flexDirection="column"
    backgroundColor="#fff"
    boxShadow="0px 4px 4px 0px #00000029"
  >
    <Box sx={{ width: '100%' }} >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Introduction" {...a11yProps(0)} />
          <Tab label="Incident Details" {...a11yProps(1)} />
          <Tab label="Team Members" {...a11yProps(2)} />
          <Tab label="Event Sequence" {...a11yProps(3)} />
          <Tab label=" Question/Answers" {...a11yProps(4)} />
          <Tab label=" Action Plan" {...a11yProps(5)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Introduction 
        data = {introData}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <IncidentDetails
        id = {incidentId}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
       <TeamInvolved
          columns={configs.teamMemberConfig}
          labels={filterLabels}
          data= {[]}
       />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <EventSequence 
        columns={configs.eventSequenceConfig}
        labels={filterLabels}
        data= {[]}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={4}>
        Question/Answers
      </CustomTabPanel>
      <CustomTabPanel value={value} index={5}>
        <ActionPlan 
      FullData = {entryData?.Data}
      textData = {ActionPlanData}
      rootCauseData = {[]}
      rootCauseColumns = {configs.rootCauseConfig}
      mailToData = {[]}
      mailToColumns = {configs.mailToConfig}
      labels = {filterLabels}

        />
      </CustomTabPanel>
    </Box>
    </FlexContainer>
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
              searchView={false}
              RCAView={true}
            />
          </div>
    </FlexContainer>
  );
}




