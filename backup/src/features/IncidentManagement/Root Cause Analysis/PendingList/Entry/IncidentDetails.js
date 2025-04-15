import React, { useRef } from 'react';
import {
  Box,
  Grid,
  Accordion,
  AccordionSummary,
} from '@mui/material';
import styled from 'styled-components';
import {
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../../../utils/StyledComponents';
import ExpandIcon from '../../../../../assets/Icons/ExpandIcon.png';
import Logo from '../../../../../assets/Icons/Logo.png';
import { useNavigate,useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PrintFileIcon from '../../../../../assets/Icons/PrintFileIcon.png';
import IncidentDetails from '../../../IncidentCommon/IncidentDetails';
import IncidentApprovalDetails from '../../../IncidentCommon/IncidentApprovalDetails';
import IncidentInvestigationDetails from '../../../IncidentCommon/IncidentInvestigationDetails';
import { useGetIncidentDetailsPendingByIdQuery, useGetDefinitionQuery } from '../../../../../redux/RTK/incidentInvestigationApi';

import {jsPDF} from 'jspdf';
import 'jspdf-autotable';
import IncidentDetailPdf from '../../../IncidentCommon/Pdf Section/IncidentDetailPdf';


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



const IncidentDetailsTab = (id) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const sectionRef = useRef();



  const pdfSectionRef = useRef(null);  

  
  const { data: incidentData, isFetching: isFetchingData } =
  useGetIncidentDetailsPendingByIdQuery(
    {
      menuId: 25,
      loginUserId: 1,
      incidentId: id,
      moduleId: 2
    },
    { skip: !id }
  );
  
  const { reportIncident, incidentStaffInvolved, incidentPatientInvolved } =
  incidentData?.Data || {};


  return (
      <>
   

    <div ref={sectionRef}>  
    <FlexContainer flexDirection="column" width="100%">
      
      <FlexContainer style={{ backgroundColor: '#fff' }}>

        <Box p={3} paddingTop={0} style={{ width: '-webkit-fill-available' }} >

                 
         <IncidentDetails/>

          <IncidentApprovalDetails/>

          <IncidentInvestigationDetails/>
      </Box>
    </FlexContainer>
    </FlexContainer>
    </div>


      
 </>
  );
};

export default IncidentDetailsTab;
