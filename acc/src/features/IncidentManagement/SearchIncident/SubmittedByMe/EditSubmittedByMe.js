import React, { useState, useEffect } from 'react';
import { Box, Accordion, AccordionSummary } from '@mui/material';
import {
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import ArrowBackIcon from '../../../../assets/Icons/ArrowBackIcon.png';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import IncidentApprovalDetails from './IncidentApprovalDetails';
import IncidentDetails from './IncidentDetails';
// import IncidentInvestigationDetails from './IncidentInvestigationDetails';
import SearchIcon from '../../../../assets/Icons/Search.png';
import SkipIcon from '../../../../assets/Icons/SkipIcon.png';
import FillIcon from '../../../../assets/Icons/FillIcon.png';
import ApproveIncidentIcon from '../../../../assets/Icons/ApproveIncidentIcon.png';
import MergeIcon from '../../../../assets/Icons/RejectIcon.png';
import SubmittedByMeTable from './Datatable/SubmittedByMeTable';
import {
    useGetFieldsQuery,
    useGetLabelsQuery,
  } from '../../../../redux/RTK/moduleDataApi';
  import { getlabel } from '../../../../utils/language'; 
  import { useDispatch, useSelector } from 'react-redux';




const EditSubmittedByMe = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();


  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
  } = useSelector((state) => state.auth);

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
      name: 'ResponsibleStaff',
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
      label: 'RequestReceivedDate',
      name: 'RequestReceivedDate',
  
    },
    {
        fieldId: `SI_IH_CompletedDate`,
      translationId: 'IM_SI_CompletedDate',
      label: 'CompletedDate',
      name: 'CompletedDate',
   
    },
   
  ];

  const notificationHistoryConfig = [
    {
      fieldId: `SI_NH_Task`,
      translationId: 'IM_SI_Task',
      label: 'Task',
      name: 'Task',
  
    },
    {
      fieldId: `SI_NH_MailSubject`,
      translationId: 'IM_SI_MailSubject',
      label: 'Mail Subject',
      name: 'MailSubject',
  
    },
    {
      fieldId: `SI_NH_MailId`,
      translationId: 'IM_SI_MailId',
      label: 'Mail Id',
      name: 'MailId',
  
    },
    {
      fieldId: `SI_NH_StaffName`,
      translationId: 'IM_SI_StaffName',
      label: 'Staff Name',
      name: 'StaffName',
  
    },
    {
      fieldId: `SI_NH_Data_SubmittedBy`,
      translationId: 'IM_SI_Data_SubmittedBy',
      label: 'Data_Submitted By',
      name: 'Data_SubmittedBy',
  
    },
    {
      fieldId: `SI_NH_SentDate&Time`,
      translationId: 'IM_SI_SentDate&Time',
      label: 'Sent Date & Time',
      name: 'SentDate&Time',
  
    },
    {
      fieldId: `SI_NH_NotificationRemarks`,
      translationId: 'IM_SI_NotificationRemarks',
      label: 'Notification Remarks',
      name: 'NotificationRemarks',
  
    },
 

  ]

    const { data: labelsData = [], isFetching: isLabelsFetching } = useGetLabelsQuery(
      {
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      }
    );
    const { data: fieldsData = [], isFetching: isFieldsFetching } = useGetFieldsQuery(
      {
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      }
    );
  
    const fields = fieldsData?.Data?.Menus?.find((item) => item.MenuId === selectedMenu?.id) || [];
  
    
    const labels = (labelsData.Data || [])
    .find((item) => item.MenuId === selectedMenu?.id) 
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === "ALL") 
        .flatMap((region) => region.Labels || [])
    );
    const filterLabels = { Data: labels};
  
    const [configs, setConfigs] = useState({
        incidentHistoryConfig,
        notificationHistoryConfig
    });
    
    useEffect(() => {
      if (fields?.length > 0) {
        const matchingSections = fields[0]?.Sections?.find(
          (section) =>
            section.SectionName === "Notification History" ||
          section.SectionName === "Incident History" 
        );
    
        const pageFields = matchingSections?.flatMap(
          (section) => section?.Regions?.find((region) => region.RegionCode === "ALL")?.Fields || []
        );
    
    
        if (pageFields && pageFields.length > 0) {
          const updatedConfigs = Object.entries(configs).reduce(
            (acc, [key, config]) => ({
              ...acc,
              [key]: config.find((column) => {
                const pageField = pageFields.find((col) => col.FieldId === column.fieldId);
                
                return pageField && pageField.IsShow === true;
              }),
            }),
            {}
          );
          
          
    
          setConfigs(updatedConfigs);
        }
      }
    }, [fields[0]]);
    
  
    
  

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
          Search Incident


        </StyledTypography>
      </FlexContainer>

      <FlexContainer style={{ backgroundColor: '#fff' }}>
        
        <Box p={3} paddingTop={0} style={{ width: '-webkit-fill-available' }} >
          {/* Incident Detail */}

          <FlexContainer
            style={{
              padding: '20px 15px',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'flex-start',
            }}
          >
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
            onClick={() =>
              navigate('/IncidentManagement/SearchIncident')
            }
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
              {t('IM_IncidentInvestigation')}
            </StyledTypography> */}
          </FlexContainer>

          <Accordion
            sx={{
              borderColor: '#3498db',
              marginBottom: '10px',
              border: '1px solid #3498db',
              borderRadius: '8px 8px 0px 0px',
            }}
          >
            <AccordionSummary
              expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
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
            <IncidentDetails />
          </Accordion>

          {/* Incident Approval Detail Section */}

          <Accordion
            sx={{
              marginBottom: '10px',
              border: '1px solid  #0d22bb',
              borderRadius: '8px 8px 0px 0px',
            }}
          >
            <AccordionSummary
              expandIcon={<StyledImage src={ExpandIcon} alt="Expand Icon" />}
              aria-controls="panel1-content"
              id="panel1-header"
              sx={{
                backgroundColor: '#0d22bb',
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
                {t('MM_SM_SearchIncident')}
              </StyledTypography>
            </AccordionSummary>
            <IncidentApprovalDetails />
          </Accordion>
          <StyledTypography
                fontSize="16px"
                fontWeight="700"
                lineHeight="20px"
                textAlign="left"
                color="#000"
                marginBottom="20px"
                marginTop="20px"
              >
                Incident History
              </StyledTypography>
              <SubmittedByMeTable 
            columns={configs.incidentHistoryConfig} 
            labels={filterLabels} 
            colour="#fd7272" 
            showAction={true} 
            />
          <StyledTypography
                fontSize="16px"
                fontWeight="700"
                lineHeight="20px"
                textAlign="left"
                color="#000"
                marginBottom="20px"
                marginTop="20px"
              >
                Notification History
              </StyledTypography>
              <SubmittedByMeTable 
            columns={configs.notificationHistoryConfig} 
            labels={filterLabels} 
            colour="#1ca775" 
            showAction={true} 
            />

        </Box>
      </FlexContainer>
    </FlexContainer>
  );
};

export default EditSubmittedByMe;
