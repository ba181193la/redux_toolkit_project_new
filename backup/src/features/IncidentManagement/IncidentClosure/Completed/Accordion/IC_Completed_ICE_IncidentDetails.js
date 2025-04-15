import { Box } from '@mui/material';
import { FlexContainer } from '../../../../../utils/StyledComponents';
import {
  FormContainer,
  StyledGridContainer,
  StyledGridItem,
  ReadOnlyText,
} from '../../IncidentClosure.styled';
import IC_Completed_ImmediateActionTable from '../DataTable/IC_Completed_ImmediateActionTable';
import IC_Completed_PatientTable from '../DataTable/IC_Completed_PatientTable';
import IC_Completed_AttachmentTable from '../DataTable/IC_Completed_AttachmentTable';
import Label from '../../../../../components/Label/Label';
import IC_Completed_WitnessTable from '../DataTable/IC_Completed_WitnessTable';
import IC_Completed_AdditionalStaffTable from '../DataTable/IC_Completed_AdditionalStaffTable';

const IC_Completed_ICE_IncidentDetails = () => {
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
            <Label bold value={'Incident Type'} />
            <ReadOnlyText> Adverse Event</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Clinical/Non Clinical'} />
            <ReadOnlyText> Clinical</ReadOnlyText>
          </StyledGridItem>
        </StyledGridContainer>

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
            <Label bold value={'Incident Sub Category'} />
            <ReadOnlyText> General /Assault & Harassment </ReadOnlyText>
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
            <ReadOnlyText> incident... </ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Immediate Action Taken'} />
            <ReadOnlyText> incident </ReadOnlyText>
          </StyledGridItem>
        </StyledGridContainer>

        <FlexContainer flexDirection="column" margin="10px 0px 10px 20px">
          <Label bold value={'Immediate Action Taken:'} />
          <IC_Completed_ImmediateActionTable />
        </FlexContainer>

        <StyledGridContainer>
          <StyledGridItem>
            <Label bold value={'Incident Department'} />
            <ReadOnlyText> Security</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Location Details (Room no etc)'} />
            <ReadOnlyText> Not Applicable </ReadOnlyText>
          </StyledGridItem>
        </StyledGridContainer>

        <FlexContainer flexDirection="column" margin="10px 0px 10px 20px">
          <Label
            bold
            value={'Person Involved in the Incident:'}
            marginBottom={'20px'}
          />
          <Label bold value={'Patient(s) :'} />
          <IC_Completed_PatientTable />
        </FlexContainer>

        <FlexContainer flexDirection="column" margin="10px 0px 10px 20px">
          <Label bold value={'Witnessed By :'} />
          <IC_Completed_WitnessTable />
        </FlexContainer>

        <FlexContainer flexDirection="column" margin="10px 0px 10px 20px">
          <Label bold value={'Attachment(s) :'} />
          <IC_Completed_AttachmentTable />
        </FlexContainer>

        <StyledGridContainer>
          <StyledGridItem>
            <Label bold value={'Harm Level '} />
            <ReadOnlyText> Minor</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label
              bold
              value={'Any additional staff you wish to be notified?'}
            />
            <ReadOnlyText> No </ReadOnlyText>
          </StyledGridItem>
        </StyledGridContainer>
        <FlexContainer flexDirection="column" margin="10px 0px 10px 20px">
          <Label bold value={'Additional Staff Details:'} />
          <IC_Completed_AdditionalStaffTable />
        </FlexContainer>
      </FlexContainer>
    </FormContainer>
  );
};

export default IC_Completed_ICE_IncidentDetails;
