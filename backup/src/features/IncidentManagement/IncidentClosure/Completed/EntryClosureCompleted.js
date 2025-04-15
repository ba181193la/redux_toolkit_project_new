import React, { useRef } from 'react';
import { Box, Grid, Accordion, AccordionSummary } from '@mui/material';
import styled from 'styled-components';
import {
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import Logo from '../../../../assets/Icons/Logo.png';
import ArrowBackIcon from '../../../../assets/Icons/ArrowBackIcon.png';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// import IncidentDetailTable from './IncidentDetailTable';
// import PatientTable from './PatientTable';
// import AssignedInvestorTable from './AssignedInvestorTable';
// import AttachmentTable from './AttachmentTable';
import Label from '../../../../components/Label/Label';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import IncidentDetails from '../../IncidentCommon/IncidentDetails';
import IncidentApprovalDetails from '../../IncidentCommon/IncidentApprovalDetails';
import {
  useGetIncidentDetailsPendingByIdQuery,
  useGetDefinitionQuery,
} from '../../../../redux/RTK/incidentInvestigationApi';
// import { useGetIncidentClosureCompletedQuery} from '../../../../redux/RTK/incidentClosureApi';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import IncidentDetailPdf from '../../IncidentCommon/Pdf Section/IncidentDetailPdf';
import IncidentClosure from './ClosureEntry';
import EditClosureEntry from './EditClosureEntry';

// Styled Components

const StyledGridContainer = styled(Grid)`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  padding: 20px;
`;

const StyledGridItem = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const FormContainer = styled(Box)`
  margin: 20px;
  background-color: #fff;
`;

const ReadOnlyText = styled(StyledTypography)`
  font-weight: 300 !important;
  font-size: 12px !important;
`;

const EntryClosureCompleted = ({ setIsEdit }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const sectionRef = useRef();

  const pdfSectionRef = useRef(null);
  const { id } = useParams();
  const { data: incidentData, isFetching: isFetchingData } =
    useGetIncidentDetailsPendingByIdQuery(
      {
        menuId: 26,
        loginUserId: 1,
        incidentId: id,
        moduleId: 2,
      },
      { skip: !id }
    );

  const { reportIncident, incidentStaffInvolved, incidentPatientInvolved } =
    incidentData?.Data || {};
  var reportIncidentSafe = reportIncident || {};
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
      const pdfFileName = 'Incident_Closure_Completed.pdf';
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

          case 'Container':
            Object.assign(tableConfig, { 
              headStyles: { 
                fillColor: [192, 192, 192], 
                textColor: [0, 0, 0], 
                fontStyle: 'bold', 
                halign: 'center',
                lineColor: [255, 255, 255], 
                lineWidth: 0,
              }, 
              styles: { 
                fontSize: 10, 
                cellPadding: 10, 
                lineColor: [255, 255, 255], 
                overflow: 'linebreak', 
                textColor: [0, 0, 0], 
                fontStyle: 'bold', 
                lineWidth: 0, 
                halign: 'left', 
              }, 
              tableLineWidth: 0.5, 
              tableLineColor: [0, 0, 0], 
              didParseCell: (data) => { 
                if (data.cell.raw.classList.contains('bold-cell')) { 
                  data.cell.styles.textColor = [0, 0, 0]; 
                  data.cell.styles.fontStyle = 'bold'; 
                } 
              }, 
              didDrawPage: (data) => { 
                const doc = data.doc; 
                const pageWidth = doc.internal.pageSize.width; 
                const pageHeight = doc.internal.pageSize.height; 
                const margin = 10; 
            
                doc.setLineWidth(0.5); 
                doc.setDrawColor(0, 0, 0); 
                doc.rect( 
                  margin, 
                  margin, 
                  pageWidth - 2 * margin, 
                  pageHeight - 2 * margin 
                ); 
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
    <>
      <style>
        {`
          @media print {
            .no-print {
              display: none !important;
            }
          }
        `}
      </style>

      <div ref={sectionRef}>
        <FlexContainer flexDirection="column" width="100%">
          <FlexContainer
            className="no-print"
            marginBottom={'30px'}
            justifyContent={'space-between'}
            style={{ paddingBottom: '15px' }}
          >
            <StyledTypography
              className="no-print"
              fontSize="30px"
              fontWeight="900"
              lineHeight="44px"
              color="#0083C0"
              whiteSpace={'nowrap'}
            >
              {t('MM_SM_IncidentClosure')}
            </StyledTypography>
          </FlexContainer>

          <Box p={3} paddingTop={0} width={'100%'} backgroundColor="#fff">
            {/* Incident Detail */}

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
                  className="no-print"
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
                  onClick={() =>
                    navigate('/IncidentManagement/IncidentClosure')
                  }
                >
                  « Previous{' '}
                </button>
              </FlexContainer>

              <StyledImage
                className="no-print"
                height="40px"
                width="40px"
                gap="10px"
                cursor="pointer"
                borderRadius="40px"
                src={PrintFileIcon}
                alt="Print"
                animate={true}
                onClick={handlePrint}
              />
            </FlexContainer>

            <IncidentDetails style={{ marginTop: '20px' }} />

            <IncidentApprovalDetails />
            {setIsEdit ? <EditClosureEntry /> : <IncidentClosure />}
          </Box>
        </FlexContainer>
      </div>

      {/* Below Div for PDF Print Content */}
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
          searchView={true}
          RCAView={true}
          closureView={true}
        />{' '}
      </div>
    </>
  );
};

export default EntryClosureCompleted;
