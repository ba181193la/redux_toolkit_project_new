import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
  Accordion,
  AccordionSummary,
  TableContainer,
  Table,
  Paper,
  TableBody,
  AccordionDetails,
  Tooltip,
} from '@mui/material';
import styled from 'styled-components';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { FormContainer, ActionButton } from '../StyledComponents';
import ArrowBackIcon from '../../../../assets/Icons/ArrowBackIcon.png';
import SearchIcon from '../../../../assets/Icons/Search.png';
import DoNotDisturbAltIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import SkipIcon from '../../../../assets/Icons/SkipIcon.png';
import FillIcon from '../../../../assets/Icons/FillIcon.png';
import ApproveIncidentIcon from '../../../../assets/Icons/ApproveIncidentIcon.png';
import RejectIcon from '../../../../assets/Icons/RejectIcon.png';
import MergeIcon from '../../../../assets/Icons/RejectIcon.png';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import SubmitTik from '../../../../assets/Icons/SubmitTik.png';
import { Form, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import IncidentDeatils from '../../IncidentCommon/IncidentDetails';
// import IncidentApprovalDetails from './incidentApproval';
import IncidentApprovalDetails from '../../IncidentCommon/IncidentApprovalDetails';
import OpinionRequest from './OpinionRequest';
import IncidentDetailTable from '../../IncidentApproval/CompletedList/IncidentDetailTable';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import Label from '../../../../components/Label/Label';
import { TextField } from '../../../../components/TextField/TextField';
import AttachmentTable from '../../IncidentApproval/PendingList/AttachmentTable';
import PrintFileIcon from '../../../../assets/Icons/PrintFileIcon.png';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { useSelector } from 'react-redux';
import { getlabel } from '../../../../utils/IncidentLabels';
import formatDate from '../../../../utils/FormatDate';
import {
  useGetOpinionByIdQuery,
  useGetIncidentApprovalPendingByIdQuery,
  useUpdateOpinionMutation,
  useGetIncidentOpinionPendingByIdQuery,
} from '../../../../redux/RTK/IncidentOinionApi';
import { Formik } from 'formik';
import { showToastAlert } from '../../../../utils/SweetAlert';
import IncidentDetails from '../../IncidentCommon/IncidentDetails';
import * as Yup from 'yup';
import IncidentDetailPdf from '../../IncidentCommon/Pdf Section/IncidentDetailPdf';
import Logo from '../../../../assets/Icons/Logo.png';
import { jsPDF } from "jspdf";
import OpinionAccess from './OpinionAccess';
import { useGetIncidentDetailsPendingByIdQuery } from '../../../../redux/RTK/incidentInvestigationApi';
import "jspdf-autotable";

useUpdateOpinionMutation;

const PendingOpinionEntry = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [triggerUpdateOpinion] = useUpdateOpinionMutation();
  const { id, opID } = useParams();
  const [opinionAccessModal, setOpinionAccessModal] = useState(false);
  const opinionID = Number(opID);
  const IncidentID = Number(id);
  const initialValues = {
    opinionId: '',
    requestedDate: '',
    Comments: '',
    EmployeeId: '',
    EmployeeName: '',
    department: '',
    Response: '',
  };

  const validationSchema = Yup.object().shape({
    Response: Yup.string().required('Response is required'),
  });

  const { data: fields = [], isFetching: isFieldsFetching } = useGetFieldsQuery(
    {
      menuId: 28,
      moduleId: 2,
    }
  );

  const {
    selectedMenu,
    userDetails,
    selectedFacility,
    selectedModuleId,
    roleFacilities,
    isSuperAdmin,
  } = useSelector((state) => state.auth);
  const pdfSectionRef = useRef(null);

  const { data: OpinionRequests, isFetching: isFetchingStaffData } =
    useGetIncidentOpinionPendingByIdQuery(
      {
        opinionId: opID,
        loginUserId: userDetails?.UserId,
        menuId: selectedMenu?.id,
        moduleId: selectedModuleId,
      }
      // { skip: !id }
    );

  const currentOpinionUser = userDetails?.EmployeeID;

  const selectedOpinionUser = OpinionRequests?.Data?.EmployeeID;

  
  const opinionResponsibleUser = currentOpinionUser === selectedOpinionUser;

  const searchFields = fields?.Data?.Menus?.find(
    (menu) => menu.MenuId === selectedMenu?.id
  )
    ?.Sections?.find((sec) => sec.SectionName === 'Page')
    ?.Regions?.[0]?.Fields?.filter(
      (field, index, self) =>
        index === self.findIndex((f) => f.FieldId === field.FieldId)
    );

  const { data: labels = [], isFetching: isLabelsFetching } = useGetLabelsQuery(
    {
      menuId: 28,
      moduleId: 2,
    }
  );

  const searchLabels = labels?.Data?.filter(
    (menu) => menu.MenuId === selectedMenu?.id
  )[0].Regions?.[0]?.Labels;

  const { data: opinionDetailsdata } = useGetOpinionByIdQuery(
    {
      opinionId: id,
      loginUserId: userDetails?.UserId,
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    },
    { skip: !id }
  );

  const { Data: opinionData } = opinionDetailsdata || {};
  const { data: opinionApprovalDetailsData } =
    useGetIncidentApprovalPendingByIdQuery(
      {
        incidentId: id,
        loginUserId: userDetails?.UserId,
        menuId: selectedMenu?.id,
        moduleId: selectedModuleId,
      },
      { skip: !id }
    );
  const { Data: opinionApproval } = opinionApprovalDetailsData || {};

  const pagesConfigData = [
    {
      fieldId: 'O_P_OpinionId',
      translationId: 'IM_O_OpinionId',
      component: 'ReadOnlyText',
      name: 'opinionId',
      maxLength: 100,
    },
    {
      fieldId: 'O_P_Requested_OpinionDate',
      translationId: 'IM_O_Requested_OpinionDate',
      component: 'ReadOnlyText',
      name: 'requestedDate',
      maxLength: 100,
    },
    {
      fieldId: 'O_P_OpinionComments',
      translationId: 'IM_O_OpinionComments',
      component: 'ReadOnlyText',
      name: 'Comments',
    },
    {
      fieldId: 'O_P_EmployeeId',
      translationId: 'IM_O_EmployeeId',
      component: 'ReadOnlyText',
      name: 'EmployeeId',
      maxLength: 100,
    },
    {
      fieldId: 'O_P_StaffName',
      translationId: 'IM_O_StaffName',
      component: 'ReadOnlyText',
      name: 'EmployeeName',
    },
    {
      fieldId: 'O_P_Department',
      translationId: 'IM_O_Department',
      component: 'ReadOnlyText',
      name: 'department',
    },
    {
      fieldId: 'O_P_Response',
      translationId: 'IM_O_Response',
      component: 'TextArea',
      name: 'Response',
    },
  ];

  useEffect(() => {
    if (opinionDetailsdata) {
      const {
        FacilityCode,
        FacilityName,
        Email,
        TelephoneNumber,
        WebsiteURL,
        ContactPersonName,
        MobileNumber,
        ContactPersonEmail,
        ContactPersonMobile,
        MailPortNumber,
        Address,
        EnableSSL,
        EnableTLS,
        status,
        CompanyId,
        MailHost,
        LogoPath,
        IsActive,
        RegionId,
      } = opinionDetailsdata?.Data || {};

      setInitialValues({
        opinionId: CompanyId || '',
        requestedDate: FacilityCode,
        Comments: FacilityName,
        EmployeeId: Email,
        EmployeeName: TelephoneNumber,
        department: WebsiteURL,
        Response: ContactPersonName,
      });
    }
  }, [opinionDetailsdata]);
  const handleSubmit = (values) => {
    console.log('SubmittedOpinionss', values);
  };

  const handleFacilitySubmit = async (values, { resetForm, setSubmitting }) => {
    try {
      const {
        companyName,
        facilityCode,
        facilityName,
        email,
        telephoneNumber,
        websiteUrl,
        contactPersonName,
        mobileNumber,
        contactPersonEmailId,
        contactPersonMobileNumber,
        mailPortNumber,
        address,
        mailhostingserver,
        enablesecuresocketlayer,
        enabletransportationsecurity,
        status,
        region,
        logo,
      } = values;

      if (id) {
        const response = await triggerUpdateOpinion({
          payload: {
            OpinionId: 1,
            OpinionNo: 1,
            incidentId: 14,
            facilityId: 2,
            requestedUserId: 2,
            requestorType: 'Investigators',
            requestedDate: '2024-12-16T08:59:40.059Z',
            requestorComments: 'check',
            opinionUserId: 3,
            responseDate: '2025-02-18T08:59:40.059Z',
            opinionComments: 'ok',
            isDelete: false,
            opinionStatus: 'Pending',
            moduleId: 1,
            menuId: 1,
            loginUserId: 1,
          },
        }).unwrap();

        if (response && response.Message !== 'Record Already Exist') {
          showToastAlert({
            type: 'custom_success',
            text: response.Message,
            gif: 'SuccessGif',
          });
        }
        if (response && response.Message === 'Record Already Exist') {
          showToastAlert({
            type: 'custom_info',
            text: response.Message,
            gif: 'InfoGif',
          });
        }
      }

      resetForm();
      navigate('/MainMaster/ContactInformationMaster', {
        state: { activeTab: 'facility' },
      });
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  const { data: incidentData, isFetching: isFetchingData } =
      useGetIncidentDetailsPendingByIdQuery(
        {
          menuId: 26,
          loginUserId: 1,
          incidentId: id,
          // moduleId: 2
        },
        { skip: !id }
      );
  
    const { reportIncident, incidentStaffInvolved, incidentPatientInvolved } =
      incidentData?.Data || {};

  const handlePrint = () => {
    try {
      const doc = new jsPDF('l', 'pt', 'a4');
      const pdfFileName = 'Incident_Report.pdf';
      const margin = 40;
      let isFirstPage = true;
      let currentPage = 1; // Initialize currentPage
      let totalPages = 0; // Will be updated after the document is fully generated
      const headerY = margin + 10; // Header starting Y position
      const footerY = pageHeight - margin - 15; // Footer Y position
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const logoHeight = 30;

      var reportIncidentSafe = reportIncident || {};

      // Global header and footer configuration
      const addHeaderFooter = (data) => {
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        const headerY = margin + 10; // Header starting Y position
        const footerY = pageHeight - margin - 15; // Footer Y position

        // Page border
        doc.setDrawColor(0);
        doc.setLineWidth(0.5);
        doc.rect(
          margin,
          margin,
          pageWidth - 2 * margin,
          pageHeight - 2 * margin
        );

        // Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);

        const logoWidth = 100;
        const logoHeight = 30;
        const logoX = margin + 5;
        const logoY = headerY;

        const incidentIdX = pageWidth - margin - 200;
        const incidentIdY = logoY + logoHeight / 2;

        doc.setLineWidth(0.5);
        doc.line(
          margin,
          headerY + logoHeight + 30,
          pageWidth - margin,
          headerY + logoHeight + 30
        ); // Adjust separator Y position

        const tableStartY = headerY + logoHeight + 30;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        doc.text(``, margin + 5, footerY);

        doc.setLineWidth(0.5);
        doc.line(margin, footerY - 20, pageWidth - margin, footerY - 20);
      };

      const tables = pdfSectionRef.current?.querySelectorAll('table') || [];
      let startY = headerY + logoHeight + 30;

      tables.forEach((table) => {
        const tableConfig = {
          html: table,
          startY,
          theme: 'grid',
          margin: { top: 150, bottom: 100 },
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

        const logoWidth = 130;
        const logoHeight = 50;
        const logoX = margin + 10;
        const logoY = headerY;

        const imgElement = document.getElementById('logo');
        const logoSrc = imgElement.src;
        doc.addImage(logoSrc, 'PNG', logoX, logoY, logoWidth, logoHeight);

        const accerHealthX = pageWidth - margin - 200;
        const accerHealthY = logoY + logoHeight - 3;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(14);
        doc.text(
          `${reportIncidentSafe.IncidentNo}`,
          accerHealthX,
          accerHealthY
        );

        const incidentIdX = pageWidth - margin - 250;
        const incidentIdY = logoY + logoHeight / 5;
        doc.setFont('helvetica', 'normal');
        doc.text(
          `Incident ID: ${reportIncidentSafe.IncidentNo}`,
          incidentIdX,
          incidentIdY
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
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values, { resetForm, setSubmitting }) => {
        try {
          const {
            requestedDate,
            opinionId,
            Comments,
            O_P_Response,
            Response,
          } = values;
          function convertToISO(dateString) {
            const [day, month, year] = dateString.split('-');
            const date = new Date(`${year}-${month}-${day}T08:59:40.059Z`);
            return date.toISOString();
          }
          const requestedDateFormat = convertToISO(requestedDate);
          if (id && opinionResponsibleUser) {
            const response = await triggerUpdateOpinion({
              payload: {
                OpinionId: opinionID,
                OpinionNo: opinionId,
                incidentId: IncidentID,
                facilityId: OpinionRequests?.Data?.FacilityId,
                requestedUserId: OpinionRequests?.Data?.RequestedUserId || '',
                requestorType: OpinionRequests?.Data?.RequestorType || '',
                requestedDate: requestedDateFormat,
                requestorComments: Response,
                opinionUserId: OpinionRequests?.Data?.OpinionUserId || '',
                opinionComments: OpinionRequests?.Data?.Comments,
                isDelete: false,
                moduleId: selectedModuleId,
                menuId: selectedMenu?.id,
                loginUserId: userDetails?.UserId,
              },
            }).unwrap();

            if (response && response.Message !== 'Record Already Exist') {
              showToastAlert({
                type: 'custom_success',
                text: response.Message,
                gif: 'SuccessGif',
              });
            }
            if (response && response.Message === 'Record Already Exist') {
              showToastAlert({
                type: 'custom_info',
                text: response.Message,
                gif: 'InfoGif',
              });
            }

            resetForm();
            navigate('/IncidentManagement/Opinions');
          } else {
            setOpinionAccessModal(true);
          }
        } catch (error) {
          console.log('ErrorOpinion', error);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      {({
        errors,
        touched,
        values,
        handleSubmit,
        resetForm,
        setFieldValue,
        isSubmitting,
      }) => {
        return (
          <FlexContainer
            style={{
              flexDirection: 'column',
              width: '100%',
              maxWidth: '100vw',
              overflowX: 'hidden',
            }}
          >
            <FlexContainer
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
                {t('OpinionEntry')}
              </StyledTypography>
            </FlexContainer>

            <FlexContainer style={{ backgroundColor: '#fff', width: '100%' }}>
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
                    <FlexContainer>
                      <Tooltip title="Go back" arrow>
                        <button
                          style={{
                            backgroundColor: '#3498DB',
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
                            navigate('/IncidentManagement/Opinions')
                          }
                        >
                          <span
                            style={{ marginRight: '4px', fontSize: '12px' }}
                          >{`<<`}</span>{' '}
                          {t('Previous')}
                        </button>
                      </Tooltip>
                    </FlexContainer>

                    
                  </FlexContainer>

                  <StyledImage
                    height="40px"
                    width="40px"
                    gap="10px"
                    cursor="pointer"
                    borderRadius="40px"
                    src={PrintFileIcon}
                    onClick={handlePrint}
                    alt="Print"
                    animate={true}
                  />
                </FlexContainer>

                <FlexContainer flexDirection="column" width="100%">
                  <IncidentDetails />
                  <IncidentApprovalDetails />
                </FlexContainer>

                <FormContainer style={{ marginBottom: '20px', width: '100%' }}>
                  <OpinionRequest
                    searchFields={searchFields}
                    pagesConfigData={pagesConfigData}
                    searchLabels={searchLabels}
                    OpinionRequests={OpinionRequests}
                    id={opID}
                  />

                  {/* Action Buttons */}
                  <FlexContainer
                    padding="10px"
                    justifyContent="center"
                    gap="20px"
                  >
                    <ActionButton
                      style={{ backgroundColor: 'rgba(0, 131, 192, 1)' }}
                      variant="outlined"
                      // type="submit"
                      onClick={handleSubmit}
                      sx={{
                        boxShadow: '0px 4px 4px 0px #00000040',
                        '&:hover': {
                          transform: 'scale(1.05) !important',
                          transition: 'transform 0.3s ease !important',
                        },
                      }}
                      startIcon={
                        <StyledImage
                          src={SubmitTik}
                          style={{
                            marginBottom: '1px',
                            marginInlineEnd: 8,
                            color: '#FFFFFF',
                          }}
                        />
                      }
                    >
                      <StyledTypography
                        textTransform="none"
                        marginTop="1px"
                        color="#ffff"
                      >
                        {isSubmitting ? 'Submitting...' : t('Submit')}
                      </StyledTypography>
                    </ActionButton>
                    <ActionButton
                      variant="outlined"
                      // onClick={()=>resetForm()}
                      onClick={() => navigate('/IncidentManagement/Opinions')}
                      sx={{
                        boxShadow: '0px 4px 4px 0px #00000040',
                        '&:hover': {
                          transform: 'scale(1.05) !important',
                          transition: 'transform 0.3s ease !important',
                        },
                      }}
                      startIcon={
                        <StyledImage
                          src={DoNotDisturbAltIcon}
                          style={{
                            marginBottom: '1px',
                            marginInlineEnd: 8,
                          }}
                        />
                      }
                    >
                      <StyledTypography textTransform="none" marginTop="1px">
                        {t('Cancel')}
                      </StyledTypography>
                    </ActionButton>
                  </FlexContainer>
                  <OpinionAccess
                    opinionAccessModal={opinionAccessModal}
                    onClose={() => setOpinionAccessModal(false)}
                  />
                </FormContainer>
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
              <IncidentDetailPdf approvalviewstatus={true} IncidentOpinionView ={true}/>
            </div>
          </FlexContainer>
        );
      }}
    </Formik>
  );
};

export default PendingOpinionEntry;
