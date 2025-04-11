import React from 'react';
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
import { useNavigate } from 'react-router-dom';
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
  FormLabel
} from '../../../../utils/DataTable.styled';
import { getlabel } from '../../../../utils/language';

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

const PendingApproval = () => {


  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

    const fieldsConfig = [
    {
      fieldId: `RI_P_FacilityName`,
      translationId: 'IM_RI_FacilityName',
      label: 'Facility Name',
      name: 'facilityName',
    },
    {
      fieldId: `RI_P_IncidentNumber`,
      translationId: 'IM_RI_IncidentNumber',
      label: 'Incident Number',
      name: 'incidentNumber',
    },
    {
      fieldId: `RI_P_BeAnonymous`,
      translationId: 'IM_RI_BeAnonymous',
      label: 'Be Anonymous',
      name: 'beAnonymous',
    },
    {
      fieldId: `RI_P_IncidentDate`,
      translationId: 'IM_RI_IncidentDate',
      label: 'Incident Date',
      name: 'incidentDate',
  
    },
    {
      fields: `RI_P_Day`,
      translationId: 'IM_RI_Day',
      label: 'Incident Day',
      name: 'incidentDay',
   
    },
    {
      fieldId: `RI_P_Time`,
      translationId: 'IM_RI_Time',
      label: 'Incident Type',
      name: 'incidentType',
 
    },
    {
      fieldId: `RI_P_ReportedDate`,
      translationId: 'IM_RI_ReportedDate',
      label: 'Reported Date',
      name: 'reportedDate',
 
    },
    {
      fieldId: `RI_P_ReportedDay`,
      translationId: 'IM_RI_ReportedDay',
      label: 'Reported Date',
      name: 'reportedDay',
  
    },
    {
      fieldId: `RI_P_ReportedTime`,
      translationId: 'IM_RI_ReportedTime',
      label: 'Reported Time',
      name: 'reportedTime',
  
    },
    {
      fieldId: `RI_P_IncidentType`,
      translationId: 'IM_RI_IncidentType',
      label: 'Incident Type',
      name: 'incidentType',
  
    },
    {
      fieldId: `IA_P_Anyadditionalstaffyouwishtobenotified`,
      translationId: 'IM_IA_Anyadditionalstaffyouwishtobenotified',
      label: 'Any Additional Staff You Wish To Be Notified',
      name: 'anyAdditionalStaffYouWishToBeNotified',
  
    },
    {
      fieldId: `RI_P_Clinical/NonClinical`,
      translationId: 'IM_RI_Clinical/NonClinical',
      label: 'Clinical/Non Clinical',
      name: 'clinical/NonClinical',
  
    },

   
  ];

  const incidentConfig = [
    {
      fieldId: `RI_P_IncidentMainCategory`,
      translationId: 'IM_RI_IncidentMainCategory',
      label: 'Incident Main Category',
      name: 'incidentMainCategory',
    },
    {
      fieldId: `RI_P_IncidentSubCategory`,
      translationId: 'IM_RI_IncidentSubCategory',
      label: 'Incident Sub Category',
      name: 'incidentSubCategory',
    },
    {
      fieldId: `RI_P_IncidentDetail`,
      translationId: 'IM_RI_IncidentDetail',
      label: 'Incident Detail',
      name: 'incidentDetail',
    },
    {
      fieldId: `RI_P_Remarks`,
      translationId: 'IM_RI_Remarks',
      label: 'Remarks',
      name: 'remarks',
    },
    {
      fieldId: `RI_P_BriefDescriptionofIncident`,
      translationId: 'IM_RI_BriefDescriptionofIncident',
      label: 'Brief Description of Incident',
      name: 'briefDescriptionofIncident',
    },
    {
      fieldId: `RI_P_IncidentDepartment`,
      translationId: 'IM_RI_IncidentDepartment',
      label: 'Incident Department',
      name: 'incidentDepartment',
    },
    {
      fieldId: `RI_P_LocationDetails(Roomnoetc)`,
      translationId: 'IM_RI_LocationDetails(Roomnoetc)',
      label: 'Location Details(Room no etc)',
      name: 'locationDetails(Room no etc)',
    },
    {
      fieldId: `RI_P_ImmediateActionTaken`,
      translationId: 'IM_RI_ImmediateActionTaken',
      label: 'Immediate Action Taken',
      name: 'immediateActionTaken',
    },
  ]

  const immediateActionTakenConfig = [
    {
      fieldId: `RI_IAT_ImmediateActionTaken`,
      translationId: 'IM_RI_ImmediateActionTaken',
      label: 'Immediate Action Taken',
      name: 'immediateActionTaken',
  
    },
    {
      fieldId: `RI_IAT_ResponsibleStaff`,
      translationId: 'IM_RI_ResponsibleStaff',
      label: 'Responsible Staff',
      name: 'responsibleStaff',
  
    },
    {
      fieldId: `RI_IAT_Department`,
      translationId: 'IM_RI_Department',
      label: 'Department',
      name: 'department',
  
    },
    {
      fieldId: `RI_IAT_Designation`,
      translationId: 'IM_RI_Designation',
      label: 'Designation',
      name: 'designation',
  
    },
  

  ]

  const attachmentConfig = [
    {
      fieldId: `RI_P_Attachment`,
      translationId: 'IM_RI_Attachment(s)',
      label: 'Attachment(s)',
      name: 'attachment(s)',
  
    },  

  ]

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

  ]
  const staffConfig = [
    {
      fieldId: `RI_S_EmployeeId`,
      translationId: 'IM_RI_EmployeeId',
      label: 'Immediate Action Taken',
      name: 'immediateActionTaken',
  
    },
    {
      fieldId: `RI_S_StaffName`,
      translationId: 'IM_RI_StaffName',
      label: 'Responsible Staff',
      name: 'responsibleStaff',
  
    },
    {
      fieldId: `RI_S_Department`,
      translationId: 'IM_RI_Department',
      label: 'Department',
      name: 'department',
  
    },
    {
      fieldId: `RI_S_Designation`,
      translationId: 'IM_RI_Designation',
      label: 'Designation',
      name: 'designation',
  
    },
    {
      fieldId: `RI_S_StaffCategory`,
      translationId: 'IM_RI_StaffCategory',
      label: 'Staff Category',
      name: 'StaffCategory',
  
    },

  ]
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
      translationId: 'IM_RI_StaffCategory',
      label: 'Staff Category',
      name: 'StaffCategory',
  
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

  ]
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

  ]

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
  ]

  const othersConfig = [
    {
      fieldId: `RI_O_OtherName`,
      translationId: 'IM_RI_OtherName',
      label: 'Other Name',
      name: 'OtherName',
  
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
  ]

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

  ]

  const IncidentApproval = [
    {
      fieldId: `IA_P_IncidentMainCategory`,
      translationId: 'IM_IA_IncidentMainCategory',
      label: 'Incident Main Category',
      name: 'IncidentMainCategory',
    },
    {
      fieldId: `IA_P_IncidentSubCategory`,
      translationId: 'IM_IA_IncidentSubCategory',
      label: 'Incident Sub Category',
      name: 'IncidentSubCategory',
  
    },
    {
      fields: `IA_P_IncidentDetails`,
      translationId: 'IM_IA_IncidentDetails',
      label: 'Incident Details',
      name: 'IncidentDetails',
   
    },
    {
      fieldId: `IA_P_IncidentType`,
      translationId: 'IM_IA_IncidentType',
      label: 'Incident Type',
      name: 'IncidentType',
 
    },
    {
      fieldId: `IA_P_Clinical/NonClinical`,
      translationId: 'IM_IA_Clinical/NonClinical',
      label: 'Clinical/Non-Clinical',
      name: 'Clinical/NonClinical',
 
    },
    {
      fieldId: `IA_P_IncidentDepartment`,
      translationId: 'IM_IA_IncidentDepartment',
      label: 'Incident Department',
      name: 'IncidentDepartment',
  
    },
    {
      fieldId: `IA_P_LocationDetails(Roomnoetc)`,
      translationId: 'IM_IA_LocationDetails(Roomnoetc)',
      label: 'Location Details/Room No etc',
      name: 'LocationDetails(Roomnoetc)',
  
    },
    {
      fieldId: `IA_P_HarmLevel`,
      translationId: 'IM_IA_HarmLevel',
      label: 'Harm Level',
      name: 'HarmLevel',
  
    },
    {
      fieldId: `IA_P_Anyadditionalstaffyouwishtobenotified`,
      translationId: 'IM_IA_Anyadditionalstaffyouwishtobenotified',
      label: 'Any Additional Staff You Wish To Be Notified',
      name: 'AnyAdditionalStaffYouWishToBeNotified',
  
    },
   
  ];
  const titleConfig = [
    {
      translationId: 'IM_RI_IncidentTitle',
      label: 'Incident Title',
      name: 'IncidentTitle',
  
    },  
    {
      translationId: 'IM_RI_ImmediateActionTaken',
      label: 'Immediate Action Taken',
      name: 'ImmediateActionTaken',
  
    },  
    {
      translationId: 'IM_RI_PersonInvolvedintheIncident',
      label: 'Person Involved in the Incident',
      name: 'PersonInvolvedintheIncident',
  
    },  
    {
      translationId: 'IM_RI_Visitor',
      label: 'Visitor',
      name: 'Visitor',
  
    },  
    {
      translationId: 'IM_RI_WitnessedBy',
      label: 'Witnessed By',
      name: 'WitnessedBy',
  
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
      translationId: 'IM_RI_Others',
      label: 'Others',
      name: 'Others',
  
    },  

  ]
  const { data: labelsData = [], isFetching: isLabelsFetching } = useGetLabelsQuery(
    {
      menuId: 26,
      moduleId: 2,
    }
  );
  const { data: fieldsData = [], isFetching: isFieldsFetching } = useGetFieldsQuery(
    {
      menuId: 26,
      moduleId: 2,
    }
  );

  const incidentLabels = (labelsData.Data || [])
  .filter((item) => item.MenuId === 24) 
  .flatMap((item) =>
    (item.Regions || [])
      .filter((region) => region.RegionCode === "ALL") 
      .flatMap((region) => region.Labels || [])
  );
  const filteredIncidentLabel = { Data: incidentLabels};

  const incidentApprovalLabels = (labelsData.Data || [])
  .filter((item) => item.MenuId === 26) 
  .flatMap((item) =>
    (item.Regions || [])
      .filter((region) => region.RegionCode === "ALL") 
      .flatMap((region) => region.Labels || [])
  );

  const filterIncidentApprovalLabels = { Data: incidentApprovalLabels};

  const filteredFieldsConfig = fieldsConfig.filter((field) =>
    incidentLabels.some((label) => label.TranslationId === field.translationId)
  );
  const filteredIncidentConfig = incidentConfig.filter((field) =>
    incidentLabels.some((label) => label.TranslationId === field.translationId)
  );

  const filteredAdditionalConfig = additionalConfig.filter((field) =>
    incidentLabels.some((label) => label.TranslationId === field.translationId)
  );
  const filteredIncidentApprovalConfig = IncidentApproval.filter((field) =>
    incidentApprovalLabels.some((label) => label.TranslationId === field.translationId)
  );
  const filteredTitleConfig = titleConfig.filter((field) =>
    incidentLabels.some((label) => label.TranslationId === field.translationId)
  );

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
          {t('MM_SM_IncidentApproval')}
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
              backgroundColor: '#4CAF50',
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
            onClick={() => navigate('/IncidentManagement/IncidentApproval')}

          >
            <span style={{ marginRight: '4px', fontSize: '12px' }}>{`<<`}</span> Previous
          </button>


              {/* <StyledTypography
                fontSize="20px"
                fontWeight="600"
                lineHeight="24px"
                textAlign="left"
                color="#205475"
              >
                {t('MM_IncidentApproval')}
              </StyledTypography> */}
            </FlexContainer>

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

          <Accordion
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
                
              >
                Incident Details
              </StyledTypography>
            </AccordionSummary>
            <FormContainer>
              <FlexContainer flexDirection={'column'}>
                
                {/* <SectionHeader>Incident Details</SectionHeader> */}

                <StyledGridContainer>

                {filteredFieldsConfig?.map((fieldConfig) => {
                return (
                <StyledGridItem key={filteredFieldsConfig.fieldId}>
                    <FormLabel>
                      {getlabel(fieldConfig?.translationId, filteredIncidentLabel, i18n.language)}
                      </FormLabel>
                        <StyledTypography> N/A </StyledTypography>
                </StyledGridItem>
                );
                })}
                </StyledGridContainer>

                {/* Incident Title */}
                <Box
                  style={{
                    fontWeight: '600',
                    fontSize: '16px',
                    lineHeight: '19.2px',
                    color: '#F47721',
                    padding: '0 20px',
                  }}
                >
     {getlabel(filteredTitleConfig.find((config) => config.name === 'IncidentTitle')?.translationId, filteredIncidentLabel, i18n.language)}
                                  
                </Box>
            <StyledGridContainer>
                    {filteredIncidentConfig?.map((fieldConfig) => {
                return (
                  <StyledGridItem item xs={4} key={filteredIncidentConfig.fieldId}>
                    <FormLabel>
                    {getlabel(fieldConfig?.translationId, filteredIncidentLabel, i18n.language)} 

                    </FormLabel>

                    <StyledTypography> N/A </StyledTypography>
                  </StyledGridItem>
                );
              })}
              </StyledGridContainer>
                <FlexContainer flexDirection="column">
                <FormLabel>
                {getlabel(filteredTitleConfig.find((config) => config.name === 'ImmediateActionTaken')?.translationId, filteredIncidentLabel, i18n.language)}

                 </FormLabel>  
                                  
               <IncidentDetailTable
                    columns = {immediateActionTakenConfig}
                    labels = {filteredIncidentLabel}
                  />
                </FlexContainer>

                <Box
                  style={{
                    fontWeight: '600',
                    fontSize: '16px',
                    lineHeight: '19.2px',
                    margin: '10px 0px 10px 0px',
                    padding: '0 20px',
                    color: '#F47721',

                  }}
                >
                    {getlabel(filteredTitleConfig.find((config) => config.name === 'PersonInvolvedintheIncident')?.translationId, filteredIncidentLabel, i18n.language)}
               </Box>
                <FlexContainer flexDirection="column" margin="10px 0">
                <FormLabel>
                {getlabel(filteredTitleConfig.find((config) => config.name === 'Staff')?.translationId, filteredIncidentLabel, i18n.language)}

                </FormLabel>
                    <IncidentDetailTable 
                  columns = {staffConfig}
                  labels = {filteredIncidentLabel}
                  />
                </FlexContainer>

                <FlexContainer flexDirection="column" margin="10px 0">
                <FormLabel>
                 
        {getlabel(filteredTitleConfig.find((config) => config.name === 'Patient')?.translationId, filteredIncidentLabel, i18n.language)}

                
                     </FormLabel>
                  <IncidentDetailTable 
                  columns = {patientConfig}
                  labels = {filteredIncidentLabel}
                  />
                </FlexContainer>

                <FlexContainer flexDirection="column" margin="10px 0">
                <FormLabel>
                {getlabel(filteredTitleConfig.find((config) => config.name === 'Companion')?.translationId, filteredIncidentLabel, i18n.language)} 

                </FormLabel>
                  <IncidentDetailTable 
                  columns = {companionConfig}
                  labels = {filteredIncidentLabel}
                  />
                </FlexContainer>

                <FlexContainer flexDirection="column" margin="10px 0">
                <FormLabel>
                {getlabel(filteredTitleConfig.find((config) => config.name === 'Visitor')?.translationId, filteredIncidentLabel, i18n.language)}

                </FormLabel>

                  <IncidentDetailTable 
                  columns = {visitorConfig}
                  labels = {filteredIncidentLabel}
                  />
                  </FlexContainer>

                <FlexContainer flexDirection="column" margin="10px 0">
                  <FormLabel>
                  {getlabel(filteredTitleConfig.find((config) => config.name === 'OutsourcedStaff')?.translationId, filteredIncidentLabel, i18n.language)} 

                  </FormLabel>

                  <IncidentDetailTable 
                  columns = {outSourcedConfig}
                  labels = {filteredIncidentLabel}
                  />
                  </FlexContainer>

                <FlexContainer flexDirection="column" margin="10px 0">
                  <FormLabel>
                  {getlabel(filteredTitleConfig.find((config) => config.name === 'Others')?.translationId, filteredIncidentLabel, i18n.language)}
                  </FormLabel>

                  <IncidentDetailTable 
                  columns = {othersConfig}
                  labels = {filteredIncidentLabel}
                  />
                  </FlexContainer>

                <FlexContainer flexDirection="column" margin="10px 0">
                <FormLabel>
                {getlabel(filteredTitleConfig.find((config) => config.name === 'Attachment(s)')?.translationId, filteredIncidentLabel, i18n.language)}
                </FormLabel>

                  <AttachmentTable 
                  columns = {attachmentConfig}
                  labels = {filteredIncidentLabel}
                  />
                </FlexContainer>
                <StyledGridContainer>
                {filteredAdditionalConfig?.map((fieldConfig) => {
                return (
                <StyledGridItem key={filteredAdditionalConfig.fieldId}>
                  <FormLabel>
                  {getlabel(fieldConfig?.translationId, filteredIncidentLabel, i18n.language)}
                  </FormLabel>

                        <StyledTypography> N/A </StyledTypography>
                </StyledGridItem>
                );
                })}
                </StyledGridContainer>
              </FlexContainer>
            </FormContainer>
          </Accordion>

          {/* Incident Approval Detail Section */}

          <Accordion
            sx={{
              marginBottom: '10px',
              border: '1px solid  #406883',
              borderRadius: '8px 8px 0px 0px',
            }}
            expanded={true}
          >
            <AccordionSummary
              // expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                backgroundColor: '#406883',
                width: '100%',
              }}
            >
              <StyledTypography
                fontSize="16px"
                fontWeight="700"
                lineHeight="20px"
                textAlign="center"
                color="#FFFFFF"
              >
                {/* Incident Approval Details */}
                {t('MM_SM_SearchIncident')}
              </StyledTypography>
            </AccordionSummary>
            <FormContainer style={{ marginBottom: '20px' }}>
              <FlexContainer flexDirection={'column'}>
                {/* <SectionHeader>Incident Approval Entry</SectionHeader> */}
                <Grid container spacing={2} p={2}>
                  <StyledGrid item xs={4}>
                  <FormLabel>
                  {getlabel(filteredTitleConfig.find((config) => config.name === 'IncidentTitle')?.translationId, filteredIncidentLabel, i18n.language)}
                  </FormLabel>

                  </StyledGrid>

      {['IncidentMainCategory', 'IncidentSubCategory', 'IncidentDetails'].map((name) => {

       const field = filteredIncidentApprovalConfig.find((f) => f.name === name);  
            if(field){
              return (
                <Grid item xs={4} key={name}>
                  <FormLabel>
                  {getlabel(field?.translationId, filterIncidentApprovalLabels, i18n.language)}
                  </FormLabel>
                  <TextField
                    fullWidth
                    defaultValue={
                      name === 'IncidentMainCategory'
                        ? 'Accommodation Related Issues'
                        : name === 'IncidentSubCategory'
                        ? 'Arrival Of Candidates to Accommodate'
                        : name === 'IncidentDetails'
                        ? ''
                        : ''
                    }
                    slotProps={{ htmlInput: { maxLength: 200 } }}
                    disabled
                  />
                </Grid>
              );}
  })}

     
                <Grid item xs={4}>
                <FormLabel>
                {getlabel(filteredIncidentApprovalConfig.find((config) => config.name === 'IncidentType')?.translationId, filterIncidentApprovalLabels, i18n.language)}
                </FormLabel>
                    <Dropdown
                      name="incidenttype"
                      value="1"
                      options={[
                        { key: '1', value: 'Near Miss' },
                        { key: '2', value: 'Incident' },
                        { key: '3', value: 'Adverse Event' },
                      ]}
                    />
                  </Grid>

                  <Grid item xs={4}>
                  <FormLabel>
                 {getlabel(filteredIncidentApprovalConfig.find((config) => config.name === 'Clinical/NonClinical')?.translationId, filterIncidentApprovalLabels, i18n.language)}

                  </FormLabel>
                  
                    <RadioGroup row defaultValue="Clinical">
                      <FormControlLabel
                        value="Clinical"
                        control={<Radio />}
                        label="Clinical"
                      />
                      <FormControlLabel
                        value="Non-Clinical"
                        control={<Radio />}
                        label="Non-Clinical"
                      />
                    </RadioGroup>
                  </Grid>

                  <Grid item xs={4}>
                  <FormLabel>
                  {getlabel(filteredIncidentApprovalConfig.find((config) => config.name === 'IncidentDepartment')?.translationId, filterIncidentApprovalLabels, i18n.language)}
                  </FormLabel>
                     
                    <Dropdown
                      name="incidentDept"
                      value={'1'}
                      options={[{ key: '1', value: 'Accounts' }]}
                    />
                  </Grid>

                  <Grid item xs={4}>
                  <FormLabel>
                  {getlabel(filteredIncidentApprovalConfig.find((config) => config.name === 'LocationDetails(Roomnoetc)')?.translationId, filterIncidentApprovalLabels, i18n.language)}
                  </FormLabel>
                    <TextField
                      fullWidth
                      placeholder=" "
                      slotProps={{ htmlInput: { maxLength: 100 } }}
                    />
                  </Grid>

                  <Grid item xs={4}>
                  <FormLabel>
                  {getlabel(filteredIncidentApprovalConfig.find((config) => config.name === 'HarmLevel')?.translationId, filterIncidentApprovalLabels, i18n.language)}
                  </FormLabel>
                   
                    <Dropdown
                      name="harm"
                      value={'1'}
                      options={[{ key: '1', value: 'Moderate' }]}
                    />
                  </Grid>

                  <Grid item xs={4}>
                  <FormLabel>
                  {getlabel(filteredIncidentApprovalConfig.find((config) => config.name === 'AnyAdditionalStaffYouWishToBeNotified')?.translationId, filterIncidentApprovalLabels, i18n.language)}

                  </FormLabel>
                  
                    <RadioGroup row defaultValue="Yes">
                      <FormControlLabel
                        value="Yes"
                        control={<Radio />}
                        label={t('Yes')}
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label={t('No')}
                      />
                    </RadioGroup>
                  </Grid>
                  <Grid item xs={4}>
                    <FormLabel>
                    Action
                    </FormLabel>
                    <Dropdown
                      options={[
                        { key: 'merge', value: 'Merge Incident' },
                        { key: 'skip', value: 'Skip Investigation' },
                        { key: 'fill', value: 'Fill RCA' },
                        {
                          key: 'approve',
                          value: 'Approve Incident and assign Investigators',
                        },
                        {
                          key: 'reject',
                          value: 'Reject Incident',
                        },
                      ]}
                    />
                  </Grid>
                </Grid>
              </FlexContainer>
              <FlexContainer padding="10px" justifyContent="center" gap="20px">
                <ActionButton
                  style={{ backgroundColor: 'rgba(0, 131, 192, 1)' }}
                  variant="outlined"
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
                    {/* Submit */}
                    {t('Submit')}
                  </StyledTypography>
                </ActionButton>
                <ActionButton
                  variant="outlined"
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
              {/* </Box> */}
            </FormContainer>
          </Accordion>
        </Box>
      </FlexContainer>
    </FlexContainer>
  );
};

export default PendingApproval;
