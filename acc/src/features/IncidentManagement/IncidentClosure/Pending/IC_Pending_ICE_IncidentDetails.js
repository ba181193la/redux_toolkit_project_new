import { Box, TextField, Grid } from '@mui/material';
import {
  FlexContainer,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { FormContainer, FormLabel } from '../IncidentClosure.styled';
import IncidentDetailTable from './Datatable/IncidentDetailTable';
import WitnessTable from './Datatable/WitnessTable';
import AttachmentTable from './Datatable/AttachmentTable';
import Label from '../../../../components/Label/Label';
import styled from 'styled-components';
import IC_Pending_StaffTable from './Datatable/IC_Pending_StaffTable';

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
const ReadOnlyText = styled(StyledTypography)`
  font-weight: 500 !important;
  font-size: 14px !important;
`;
const IC_Pending_ICE_IncidentDetails = () => {
  return (
    <FormContainer>
      <FlexContainer flexDirection={'column'}>
        {/* <SectionHeader>Incident Details</SectionHeader> */}

        <StyledGridContainer>
          {/* Row 1 */}
          <StyledGridItem>
            <Label bold value={'Facility Name'} />
            <ReadOnlyText> Apollo - Chennai</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Branch Name'} />
            <ReadOnlyText> Dubai</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Incident No'} />
            <ReadOnlyText> NRC-IR-22062024-001</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Be Anonymous'} />
            <ReadOnlyText> Yes</ReadOnlyText>
          </StyledGridItem>

          {/* Row 2 */}
          <StyledGridItem>
            <Label bold value={'Incident Date'} />
            <ReadOnlyText> 01-03-2024</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Incident Day'} />
            <ReadOnlyText> Friday</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Incident Time'} />
            <ReadOnlyText> 23:30</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Reported Date'} />
            <ReadOnlyText> 22-06-2024</ReadOnlyText>
          </StyledGridItem>

          {/* Row 3 */}
          <StyledGridItem>
            <Label bold value={'Reported Day'} />
            <ReadOnlyText> Sunday</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Reported Time'} />
            <ReadOnlyText> 00:58</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Reported Time'} />
            <ReadOnlyText> 00:58</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Reporting Employee Id'} />
            <ReadOnlyText> 345</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Reporting Employee Name'} />
            <ReadOnlyText> Test1</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Staff Category'} />
            <ReadOnlyText> Administration</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Department/Speciality'} />
            <ReadOnlyText> Quality Improvement and Development</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Designation'} />
            <ReadOnlyText> Quality Assurance Officer</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Incident Type '} />
            <ReadOnlyText> Near Miss</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Clinical/Non Clinical'} />
            <ReadOnlyText> Clinical</ReadOnlyText>
          </StyledGridItem>
        </StyledGridContainer>

        {/* Incident Title */}
        <Box
          style={{
            fontWeight: '600',
            fontSize: '16px',
            lineHeight: '19.2px',
            padding: '0 20px',
          }}
        >
          Incident Title
        </Box>
        <StyledGridContainer>
          <StyledGridItem>
            <Label bold value={'Incident Main Category'} />
            <ReadOnlyText> Infection Control</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Incident Details'} />
            <ReadOnlyText> Needle Stick</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Remarks'} />
            <ReadOnlyText> - </ReadOnlyText>
          </StyledGridItem>

          <StyledGridItem>
            <Label bold value={'Brief Description of Incident'} />
            <ReadOnlyText> Old needle stick</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Immediate Action Taken'} />
            <ReadOnlyText>need a action quickly</ReadOnlyText>
          </StyledGridItem>
        </StyledGridContainer>
        <FlexContainer flexDirection="column" padding="0 20px">
          <Label bold value={'Immediate Action Taken'} />
          <IncidentDetailTable />
        </FlexContainer>
        <StyledGridContainer>
          <StyledGridItem>
            <Label bold value={'Incident Department'} />
            <ReadOnlyText> Admission</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Location Details (Room no etc)'} />
            <ReadOnlyText>Not Applicable</ReadOnlyText>
          </StyledGridItem>
        </StyledGridContainer>

        <Box
          style={{
            fontWeight: '600',
            fontSize: '16px',
            lineHeight: '19.2px',
            margin: '10px 0px 10px 0px',
            padding: '0 20px',
          }}
        >
          Person Involved in the Incident
        </Box>
        <FlexContainer flexDirection="column" margin="10px 0" padding="0 20px">
          <Label bold value={'Staff(s):'} />
          <IC_Pending_StaffTable />
        </FlexContainer>
        <FlexContainer flexDirection="column" margin="10px 0" padding="0 20px">
          <Label bold value={'Attachment(s):'} />
          <AttachmentTable />
        </FlexContainer>
        <StyledGridContainer>
          <StyledGridItem>
            <Label bold value={'Harm Level '} />
            <ReadOnlyText> Moderate</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label
              bold
              value={'Any additional staff you wish to be notified?'}
            />
            <ReadOnlyText>No</ReadOnlyText>
          </StyledGridItem>
        </StyledGridContainer>
      </FlexContainer>
    </FormContainer>
  );
};

export default IC_Pending_ICE_IncidentDetails;
