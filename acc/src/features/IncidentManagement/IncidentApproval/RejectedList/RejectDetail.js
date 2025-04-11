import React, { useState, useEffect, useRef } from 'react';
import { Box, Grid, Button, Accordion, AccordionSummary } from '@mui/material';
import styled from 'styled-components';
import {
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import ArrowBackIcon from '../../../../assets/Icons/ArrowBackIcon.png';
import DoNotDisturbAltIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import IncidentDetailTable from '../../IncidentApproval/CompletedList/IncidentDetailTable';
import Label from '../../../../components/Label/Label';
import AttachmentTable from './AttachmentTable';
import StaffTable from './StaffTable';
import { TextField } from '../../../../components/TextField/TextField';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import SubmitTik from '../../../../assets/Icons/SubmitTik.png';
import AssignedInvestorTable from './AssignedInvestorTable';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import IncidentDetails from '../../IncidentCommon/IncidentDetails';
import IncidentApprovalDetails from './IncidentApprovalDetails';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import IncidentDetailPdf from '../../IncidentCommon/Pdf Section/IncidentDetailPdf';
import { useGetIncidentDetailsPendingByIdQuery } from '../../../../redux/RTK/incidentInvestigationApi';
import Logo from '../../../../assets/Icons/Logo.png';

// Styled Components
const SectionHeader = styled(Box)`
  background-color: #da83c3;
  padding: 10px 20px;
  font-weight: bold;
  color: #fff;
`;

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

const ActionButton = styled(Button)`
  color: #fff !important;
  border-radius: 6px !important;
  text-transform: none !important;
  box-shadow: 0px 4px 4px 0px #00000040 !important;

  &:hover {
    transform: scale(1.05) !important;
    transition: transform 0.3s ease !important;
  }
`;

const CancelButton = styled(Button)`
  margin-left: 10px;
  border-color: #007bba;
`;

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  text-align: left;
`;
const ReadOnlyText = styled(StyledTypography)`
  font-weight: 500 !important;
  font-size: 14px !important;
`;

const RejectDetail = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { id } = useParams();

  const pdfSectionRef = useRef(null);

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

   const handlePrint = () => {
            try {
              const doc = new jsPDF('p', 'pt', 'a4');
              const pdfFileName = 'Incident_Approval_Rejected.pdf';
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
        
              // Define inner margins to keep tables from touching the border
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
                          
                    //       const currentPatientID = table.body[row.index]?.raw?.dataset?.patientId;
                    //       const nextPatientID = table.body[row.index + 1]?.raw?.dataset?.patientId;
                    
                    //       if (currentPatientID && (!nextPatientID || currentPatientID !== nextPatientID)) {
                    //         const startX = table.settings.margin.left;
                    //         const endX = doc.internal.pageSize.width - table.settings.margin.right;
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

      <FlexContainer style={{ flexDirection: 'column', width: '100%' }}>
        <FlexContainer
          className="no-print"
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
            {t('MM_SM_SearchIncident')}
          </StyledTypography>
        </FlexContainer>

        <FlexContainer style={{ backgroundColor: '#fff' }}>
          <Box p={3} paddingTop={0} style={{ width: '100%' }}>
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
                  style={{
                    backgroundColor: 'rgb(52 152 219)',
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
                    navigate('/IncidentManagement/IncidentApproval')
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
            {/* <Accordion
            sx={{
              borderColor: '#3498db',
              marginBottom: '10px',
              border: '1px solid #3498db',
              borderRadius: '8px 8px 0px 0px',
            }}
            expanded={true}
          >
            <AccordionSummary
              // expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                backgroundColor: '#3498db',
                width: '100%',
              }}
            >
              <StyledTypography
                fontSize="16px"
                fontWeight="700"
                lineHeight="20px"
                textAlign="center"
                color="#FFFFFF"
                border={'1px solid #3498db'}
              >
                Incident Details
              </StyledTypography>
            </AccordionSummary>
              
          </Accordion> */}

            <IncidentDetails />

            {/* Incident Approval Detail Section */}

            <Accordion
              sx={{
                marginBottom: '10px',
                border: '1px solid #406883',
                borderRadius: '8px 8px 0px 0px',
              }}
              expanded={true}
            >
              <AccordionSummary
                expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  backgroundColor: '#0d22bb',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <StyledTypography
                  fontSize="18px"
                  fontWeight="700"
                  lineHeight="20px"
                  color="#FFFFFF"
                  sx={{ flexGrow: 1, textAlign: 'center' }}
                >
                  Incident Approval Details
                </StyledTypography>
              </AccordionSummary>

              <IncidentApprovalDetails />
            </Accordion>
          </Box>
        </FlexContainer>
      </FlexContainer>

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
        <IncidentDetailPdf approvalviewstatus={false} />
      </div>
    </>
  );
};

export default RejectDetail;
