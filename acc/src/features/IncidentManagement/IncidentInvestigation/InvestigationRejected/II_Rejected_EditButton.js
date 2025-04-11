import {
  Modal,
  Backdrop,
  Box,
  Typography,
  IconButton,
  Tooltip,
  Grid,
  Accordion,
  AccordionSummary,
  Table,
  TableBody,
  TableContainer,
  Paper,
} from '@mui/material';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
} from '../../../../utils/DataTable.styled';
import {
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import React, { useState, useEffect, useRef } from 'react';
import ArrowBackIcon from '../../../../assets/Icons/ArrowBackIcon.png';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import { useTranslation } from 'react-i18next';
import IncidentApprovalDetails from '../../IncidentCommon/IncidentApprovalDetails';
// import IncidentDetails from './Accordion/II_RL_IncidentDetails';
// import IncidentDetails from '../InvestigationPending/II_PL_IncidentDetails';
import IncidentDetails from '../../IncidentCommon/IncidentDetails';

import IncidentInvestigationDetails from './Accordion/II_RL_IncidentInvestigation';
import SearchIcon from '../../../../assets/Icons/Search.png';
import SkipIcon from '../../../../assets/Icons/SkipIcon.png';
import FillIcon from '../../../../assets/Icons/FillIcon.png';
import ApproveIncidentIcon from '../../../../assets/Icons/ApproveIncidentIcon.png';
import MergeIcon from '../../../../assets/Icons/RejectIcon.png';
import { useGetRejectionHistoryQuery } from '../../../../redux/RTK/incidentInvestigationApi';
import { useSelector } from 'react-redux';
import { getlabel } from '../../../../utils/language';
import ApproveIncidentTable from './Datatable/ApproveIncidentTable';
import Logo from '../../../../assets/Icons/Logo.png';
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';
import IncidentDetailPdf from '../../IncidentCommon/Pdf Section/IncidentDetailPdf';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import { useGetIncidentDetailsPendingByIdQuery } from '../../../../redux/RTK/incidentInvestigationApi';
import { useNavigate,useParams } from 'react-router-dom';

const II_Rejected_EditButton = () => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { id } = useParams();
  const [labelData, setLabelData] = useState([]);
  const [columnsData, setColumnsData] = useState([]);
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const pdfSectionRef = useRef(null); 

  const { selectedMenu, userDetails } = useSelector((state) => state.auth);

  const { data: rejectionHistory, isFetching: isFetchingData } =
    useGetRejectionHistoryQuery(
      {
        menuId: selectedMenu?.id,
        loginUserId: userDetails?.UserId,
        incidentId: id,
      },
      { skip: !id }
    );

  useEffect(() => {
    if (rejectionHistory?.Data) {
      setData(rejectionHistory.Data);
    }
  }, [rejectionHistory]);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleLabelChange = (updatedData) => {
    setLabelData(updatedData);
  };
  const handleColumnChange = (updatedData) => {
    setColumnsData(updatedData);
  };

  const DynamicModal = ({ open, onClose, title }) => (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        style: { backdropFilter: 'blur(8px)' },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          maxHeight: '90vh',
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          outline: 'none',
          borderColor: 'black',
          overflow: 'auto',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '50%',
            border: 'none',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <i className="fas fa-times" style={{ fontSize: '16px' }}></i>
        </button>

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            background: '#0264AB',
            color: 'white',
            padding: '8px',
            borderRadius: '8px 8px 0 0',
          }}
        >
          {title}
        </Typography>

        <div
          style={{
            maxHeight: 'calc(90vh - 96px)',
            overflowY: 'auto',
            padding: '16px',
          }}
        >
          <FlexContainer flexDirection="column" width="100%">
            <TableContainer component={Paper}>
              <Table>
                <StyledTableHead backgroundColor="#3C8DBC">
                  <StyledTableRow>
                    <StyledTableHeaderCell color="#fff">
                      {t('SNo')}
                    </StyledTableHeaderCell>
                    {columnsData?.map((column) => (
                      <StyledTableHeaderCell color="#fff" key={column.name}>
                        {getlabel(
                          column.translationId,
                          labelData,
                          i18n.language
                        )}
                      </StyledTableHeaderCell>
                    ))}
                  </StyledTableRow>
                </StyledTableHead>
                <TableBody>
                  {data?.length && data.length > 0 ? (
                    data.map((row, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
                        {columnsData.map((column) => (
                          <StyledTableBodyCell key={column.name}>
                            {row[column.name] ?? ''}
                          </StyledTableBodyCell>
                        ))}
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableBodyCell colSpan={columnsData.length + 1}>
                        {t('NoDataAvailable')}
                      </StyledTableBodyCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </FlexContainer>
        </div>
      </Box>
    </Modal>
  );

   const { data: incidentData, } =
    useGetIncidentDetailsPendingByIdQuery(
      {
        menuId: 27,
        loginUserId: 1,
        incidentId: id,
        moduleId: 2
      },
      { skip: !id }
    );
    
    const { reportIncident, incidentStaffInvolved, incidentPatientInvolved } =
       incidentData?.Data || {};
       var reportIncidentSafe = reportIncident || {};
   
       const handlePrint = () => {
           try {
             const doc = new jsPDF('p', 'pt', 'a4');
             const pdfFileName = 'Incident_Investigation_Rejected.pdf';
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
                         
                  //        const currentPatientID = table.body[row.index]?.raw?.dataset?.patientId;
                  //        const nextPatientID = table.body[row.index + 1]?.raw?.dataset?.patientId;
                   
                  //        if (currentPatientID && (!nextPatientID || currentPatientID !== nextPatientID)) {
                  //          const startX = table.settings.margin.left;
                  //          const endX = doc.internal.pageSize.width - table.settings.margin.right;
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
    <FlexContainer style={{ flexDirection: 'column', width: '100%' }}>
      <DynamicModal
        open={isModalOpen}
        onClose={handleModalClose}
        title={`${getlabel('IM_II_RejectionHistory', labelData, i18n.language)}`}
      />
      <FlexContainer
        // marginBottom={'30px'}
        // marginTop={'65px'}
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
          {t('MM_SM_IncidentInvestigation')}
        </StyledTypography>
      </FlexContainer>

      <FlexContainer style={{ backgroundColor: '#fff' }}>
        <Box p={3} paddingTop={0} style={{ width: '-webkit-fill-available' }}>
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
                             navigate('/IncidentManagement/IncidentInvestigation')
                           }
                         >
                           « Previous
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

        
        <IncidentDetails sx={{ marginBottom: '10px' }} />         
        <IncidentApprovalDetails sx={{ marginBottom: '10px' }} />                 

          {/* Incident Investigation*/}
          <Accordion
            sx={{
              marginBottom: '10px',
              border: '1px solid  #BE86FF73',
              borderRadius: '8px 8px 0px 0px',
            }}
            expanded={true}
          >
            <AccordionSummary
              // expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                backgroundColor: '#18bb0d',
                width: '100%',
              }}
            >
              <StyledTypography
                fontSize="18px"
                fontWeight="700"
                lineHeight="20px"
                textAlign="center"
                color="#FFFFFF"
                sx={{
                  flexGrow: 1, 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                Incident Investigation
              </StyledTypography>
            </AccordionSummary>
            <IncidentInvestigationDetails
              labelChange={handleLabelChange}
              columnChange={handleColumnChange}
            />
          </Accordion>
        </Box>
      </FlexContainer>
      <div ref={pdfSectionRef} id='pdfSectionRef' className="no-print" style={{ display: 'none'}} >
<>
  <img id="logo" src={Logo}  />
      </>
<IncidentDetailPdf approvalviewstatus={true} />

</div>
    </FlexContainer>
  );
};

export default II_Rejected_EditButton;
