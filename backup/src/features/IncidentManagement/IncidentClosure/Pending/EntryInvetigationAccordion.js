import React, { useState, useEffect, useRef } from 'react';
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
  AccordionDetails,
  TableContainer,
  Table,
  Paper,
  TableBody,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import styled from 'styled-components';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledSearch,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import ArrowBackIcon from '../../../../assets/Icons/ArrowBackIcon.png';
import DoNotDisturbAltIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import SkipIcon from '../../../../assets/Icons/SkipIcon.png';
import FillIcon from '../../../../assets/Icons/FillIcon.png';
import ApproveIncidentIcon from '../../../../assets/Icons/ApproveIncidentIcon.png';
import RejectIcon from '../../../../assets/Icons/RejectIcon.png';
import MergeIcon from '../../../../assets/Icons/RejectIcon.png';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import SubmitTik from '../../../../assets/Icons/SubmitTik.png';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { showSweetAlert, showToastAlert } from '../../../../utils/SweetAlert';
import Error from '../../../../assets/Gifs/error.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import { useTranslation } from 'react-i18next';
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
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
  FormLabel,
} from '../../../../utils/DataTable.styled';
import { getlabel } from '../../../../utils/language';

// import IncidentDetails from '../../IncidentInvestigation/InvestigationPending/II_PL_IncidentDetails';
import { Formik, Form } from 'formik';

import IncidentDetails from '../../IncidentCommon/IncidentDetails';
import SearchIcon from '@mui/icons-material/Search';
import {
  useGetClosureEntryDataQuery,
  useGetPageLoadDataQuery,
} from '../../../../redux/RTK/incidentClosureApi';
import {
  useSkipInvestigationMutation,
  useFillRCAMutation,
  useGetReportIncidentPageloadQuery,
  useGetApprovalEntryDataQuery,
  useAssignInvestigatorMutation,
  useOpinionMutation,
} from '../../../../redux/RTK/IncidentManagement/incidentApprovalApi';
import { ConnectingAirportsOutlined } from '@mui/icons-material';
import AdditionalStafftable from './AdditionalStafftable';
import { fontSize } from '@mui/system';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import IncidentDetailPdf from '../../IncidentCommon/Pdf Section/IncidentDetailPdf';
import { useGetIncidentDetailsPendingByIdQuery, useGetIncidentInvestigationPendingByIdQuery } from '../../../../redux/RTK/incidentInvestigationApi';
import Logo from '../../../../assets/Icons/Logo.png';
import DataTable from './Tables/DataTable';

// Styled Components
const StyledGridContainer = styled(Grid)`
  display: grid;
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

const ReadOnlyText = styled(StyledTypography)`
  font-weight: 500 !important;
  font-size: 14px !important;
`;

const StyledGrid = styled(Grid)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  text-align: left;
`;

const EntryInvestigationAccordion = () => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { id } = useParams();

  const [categorylist, setCategorylist] = useState([]);

  // Get Reoprt Incident
  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
  } = useSelector((state) => state.auth);

  // Accordians
  const { data: entrydetails = [], isFetching: isEntrydetails } =
    useGetClosureEntryDataQuery({
      incidentClosureId: 25, //change dynamic
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
    });

  const entryData = entrydetails?.Data;

  const { data: investigationData } =
      useGetIncidentInvestigationPendingByIdQuery(
        {
          menuId: 27,
          loginUserId: userDetails?.UserId,
          incidentId: id,
          moduleId: 2,
        },
        { skip: !id }
      );
  
    const { Investigation, ActionTaken, Opinions, EventSequence, Attachments } =
      investigationData?.Data || {};

      console.log("investigationData",investigationData?.Data)
  
    const InvestigationSafe = Investigation || {};
    const AttachmentSafe = Attachments || [];
    const ActionTakensafe = ActionTaken || [];
    const OpinionsSafe = Opinions || [];
    

  // const labels = [
  //   {
  //     translationId: 'IM_II_ActionsTakenforPreventionOfIncidentAgain',
  //     label: 'Actions Taken for Prevention Of Incident Again',
  //     name: 'ActionsTakenforPreventionOfIncidentAgain',
  //   },

  //   {
  //     translationId: 'IM_II_Opinion(s)Exchanged',
  //     label: 'Opinion(s) Exchanged',
  //     name: 'Opinion(s)Exchanged',
  //   },
  // ];

    

  const Opinion = [
    {
      fieldId: `II_OE_OpinionId`,
      translationId: 'IM_II_OpinionId',
      label: 'OpinionId',
      name: 'OpinionId',
    },
    {
      fieldId: `II_OE_RespondentName`,
      translationId: 'IM_II_RespondentName',
      label: 'RespondentName',
      name: 'RespondentName',
    },
    {
      fieldId: `II_OE_Department`,
      translationId: 'IM_II_Department',
      label: 'Department',
      name: 'DepartmentName',
    },
    {
      fieldId: `II_OE_Designation`,
      translationId: 'IM_II_Designation',
      label: 'Designation',
      name: 'DesignationName',
    },
    {
      fieldId: `II_OE_Request`,
      translationId: 'IM_II_Request',
      label: 'Request',
      name: 'RequestorName',
    },
    {
      fieldId: `II_OE_Response`,
      translationId: 'IM_II_Response',
      label: 'Response',
      name: 'Response',
    },
    {
      fieldId: `II_OE_Requested_OpinionDate`,
      translationId: 'IM_II_Requested_OpinionDate',
      label: 'Requested_OpinionDate',
      name: 'RequestedDate',
    },
    {
      fieldId: `II_OE_ResponseDate`,
      translationId: 'IM_II_ResponseDate',
      label: 'ResponseDate',
      name: 'ResponseDate',
    },
  ];

  const ActionTakenIncident = [
    {
      fieldId: `II_ATfPOIA_ResponsibleStaff`,
      translationId: 'IM_II_ResponsibleStaff',
      label: 'Responsible Staff',
      name: 'Responsiblestaff',
    },
    {
      fieldId: `II_ATfPOIA_Department`,
      translationId: 'IM_II_Department',
      label: 'Department',
      name: 'DepartmentName',
    },
    {
      fieldId: `II_ATfPOIA_TaskAssigned`,
      translationId: 'IM_II_TaskAssigned',
      label: 'Task Assigned',
      name: 'TaskAssigned',
    },

    {
      fieldId: `II_ATfPOIA_TargetDate`,
      translationId: 'IM_II_TargetDate',
      label: 'TargetDate',
      name: 'TargetDate',
    },
  ];


  const InvestigatorsInput = [
    {
      fieldId: `II_P_InvestigatorName`,
      translationId: 'IM_II_InvestigatorName',
      label: 'Task Assigned',
      name: 'InvestigatorName',
    },
    {
      fieldId: `II_P_RequestReceivedDate`,
      translationId: 'IM_II_RequestReceivedDate',
      label: 'Request Received Date',
      name: 'RequestReceivedDate',
    },
    {
      fieldId: `II_P_Department`,
      translationId: 'IM_II_Department',
      label: 'Department',
      name: 'DepartmentName',
    },
    {
      fieldId: `II_OE_Designation`,
      translationId: 'IM_II_Designation',
      label: 'Designation',
      name: 'DesignationName',
    },
    {
      fieldId: `II_P_IncidentReason/RootCause`,
      translationId: 'IM_II_IncidentReason/RootCause',
      label: 'IncidentReason/RootCause',
      name: 'IncidentReason',
    },
    {
      fieldId: `II_P_RecommendationtoPreventSimilarIncident`,
      translationId: 'IM_II_RecommendationtoPreventSimilarIncident',
      label: 'Recommendation to Prevent Similar Incident',
      name: 'Recommendation',
    },
    {
      fieldId: `II_P_ApproverComment`,
      translationId: 'IM_II_ApproverComment',
      label: 'Approver Comment',
      name: 'Comments',
    },
    {
      fieldId: `II_P_ApprovedBy`,
      translationId: 'IM_II_ApprovedBy',
      label: 'Approved By',
      name: 'AssignedByApprover',
    },

    {
      fieldId: `II_P_ApprovedDate`,
      translationId: 'IM_II_ApprovedDate',
      label: 'Approved Date',
      name: 'ApprovedDate',
    },
    {
      fieldId: `II_P_ApproverRemarks`,
      translationId: 'IM_II_ApproverRemarks',
      label: 'Approver Remarks',
      name: 'ApproverRemarks',
    },
    {
      fieldId: `II_P_Attachment(s)`,
      translationId: 'IM_II_Attachment(s)',
      label: 'Attachment',
      name: 'Attachments',
    },
    {
      fieldId: `II_P_RejectionHistory`,
      translationId: 'IM_II_RejectionHistory',
      label: 'Rejection History',
      name: 'RejectionHistory',
    },
  ];

  const { data: labelsData = [], isFetching: isLabelsFetching } =
    useGetLabelsQuery({
      menuId: 27,
      moduleId: 2,
    });
  const { data: fieldsData = [], isFetching: isFieldsFetching } =
    useGetFieldsQuery({
      menuId: 27,
      moduleId: 2,
    });

  const menuData = fieldsData.Data?.Menus || [];

  const filteredFields = menuData?.find(
    (menu) => menu.MenuId === 27
  );
  // console.log("filteredFieldsssss",filteredFields);
  console.log("labelsDatassssssss",labelsData)


  const incidentLabels = (labelsData?.Data || [])
    .filter((item) => item.MenuId === 27)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'ALL')
        .flatMap((region) => region.Labels || [])
    );
  const filteredIncidentLabel = { Data: incidentLabels };


 console.log("filteredIncidentLabel",filteredIncidentLabel)
 


   const [configs, setConfigs] = useState({
    InvestigatorsInput,
    Opinion,
    ActionTakenIncident
    });
  
    useEffect(() => {
      if (filteredFields) {
        console.log("filteredFieldsssss",filteredFields);
        const matchingSections = filteredFields?.Sections?.filter(
          (section) => section.SectionName === 'Opinion(s) Exchanged' ||
           section.SectionName === 'Accordion-Page'  ||
           section.SectionName === 'Actions Taken for Prevention Of Incident Again'  
        );
        console.log("matchingSections",matchingSections);
        const pageFields = matchingSections
          ?.flatMap((section) => section.Regions)
          ?.filter((region) => region.RegionCode === 'ALL')
          ?.flatMap((region) => region.Fields);


    
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
          console.log('updatedConfigssssss', updatedConfigs);
          setConfigs(updatedConfigs);
        }
      }
    }, [filteredFields]);

  const { data: pageloadData = [], isFetching: ispageloadData } =
    useGetPageLoadDataQuery({
      headerFacilityId: selectedFacility?.id,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
    });

  useEffect(() => {
    if (entrydetails?.Data) {
      setIncidentMainCategory({
        id: entrydetails.Data.MainCategoryId,
        name: entrydetails.Data.MainCategory,
      });
      setIncidentSubCategory({
        id: entrydetails.Data.SubCategoryId,
        name: entrydetails.Data.SubCategory,
      });
      setIncidentDetails({
        id: entrydetails.Data.IncidentDetailId,
        name: entrydetails.Data.IncidentDetail,
      });

      setIncidentType({
        id: entrydetails.Data.IncidentTypeId,
        name: entrydetails.Data.IncidentType,
      });
      setIncidentDepartment({
        id: entrydetails.Data.DepartmentId,
        name: entrydetails.Data.DepartmentName,
      });
      setHarmLevel({
        id: entrydetails.Data.IncidentHarmLevelId,
        name: entrydetails.Data.IncidentHarmLevel,
      });
      setLocationDetails(entrydetails.Data.LocationDetials);
    }
  }, [entrydetails]);

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



  return (
    <>
{investigationData?.Data && (
      <FlexContainer style={{ flexDirection: 'column', width: '100%' }}>
        <FlexContainer style={{ backgroundColor: '#fff' }}>
          <Box paddingTop={0} style={{ width: '-webkit-fill-available' }}>
            {/* INCIDENT INVESTIGATION */}
            <Accordion
              sx={{
                border: '1px solid #29a720',
                borderRadius: '8px 8px 0px 0px',
              }}
              style={{ marginTop: '10px' }}
              // expanded={true}
            >
              <AccordionSummary
                expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  backgroundColor: '#29a720',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center', 
                  alignItems: 'center', 
                }}
              >
                <StyledTypography
                  fontSize="18px"
                  fontWeight="700"
                  lineHeight="20px"
                  textAlign="center"
                  color="#FFFFFF"
                  sx={{
                    width: '100%', // Ensure full width usage
                    textAlign: 'center', // Ensures text is centered inside
                    display: 'flex',
                    justifyContent: 'center', // Centers text in flexbox
                    alignItems: 'center', // Centers text vertically
                  }}
                >
                  {t('IM_IncidentInvestigation')}
                </StyledTypography>
              </AccordionSummary>

              <FormContainer style={{ marginBottom: '20px' }}>
                <FlexContainer flexDirection={'column'}>
                  <Grid
                    container
                    spacing={2}
                    p={2}
                    style={{ padding: '0px' }}
                  ></Grid>

                  <FlexContainer
                    flexDirection={'column'}
                    style={{ marginBottom: '20px', marginTop: '10px' }}
                  >
                    <Box
                    sx={{
                      width: "100%",
                      backgroundColor: "#8D6E63",
                      color: "#FFFFFF",
                      padding: "10px",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "16px",
                      borderRadius: "4px",
                    }}
                  >
                    {InvestigationSafe?.InvestigatorName || ""}
                  </Box>

                    <FormLabel
                      style={{ marginBottom: '10px', marginTop: '10px' }}
                    >
                      Investigators and Input : 
                    </FormLabel>
                    <DataTable
                      columns={configs.InvestigatorsInput}
                      labels={filteredIncidentLabel}
                      records={InvestigationSafe}
                      attachments={AttachmentSafe}
                    />

                    <FormLabel
                      style={{ marginBottom: '10px', marginTop: '10px' }}
                    >
                      {getlabel(
                                  'IM_II_ActionsTakenforPreventionOfIncidentAgain',
                                  filteredIncidentLabel,
                                  i18n.language
                                )}
                                
                    </FormLabel>

                    <DataTable
                      columns={configs.ActionTakenIncident}
                      labels={filteredIncidentLabel}
                      records={ActionTakensafe}

                    />

                    <FormLabel style={{ marginBottom: '10px', marginTop: '10px' }}>
                              {getlabel('IM_II_Opinion(s)Exchanged', filteredIncidentLabel, i18n.language)}
                            </FormLabel>

                    <DataTable
                      columns={configs.Opinion}
                      labels={filteredIncidentLabel}
                      records={OpinionsSafe}

                    />
                  </FlexContainer>
                </FlexContainer>
              </FormContainer>
            </Accordion>
          </Box>
        </FlexContainer>
         
      </FlexContainer>
    )}
    </>
  );
};

export default EntryInvestigationAccordion;
