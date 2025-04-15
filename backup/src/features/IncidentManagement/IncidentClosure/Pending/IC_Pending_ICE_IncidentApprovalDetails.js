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
const IC_Pending_ICE_IncidentApprovalDetails = () => {
  return (
    <FormContainer>
      <FlexContainer flexDirection={'column'}>
        {/* <SectionHeader>Incident Details</SectionHeader> */}

        <StyledGridContainer>
          {/* Row 1 */}
          <StyledGridItem>
            <Label bold value={'Incident Main Category'} />
            <ReadOnlyText> Accommodation related issues</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Incident Details'} />
            <ReadOnlyText>
              {' '}
              The Arrival of candidates to accommodation without prior Notice
              form HR/Recruitment
            </ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Incident Type '} />
            <ReadOnlyText> Near Miss</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Clinical/Non Clinical'} />
            <ReadOnlyText> Clinical</ReadOnlyText>
          </StyledGridItem>

          {/* Row 2 */}
          <StyledGridItem>
            <Label bold value={'Incident Department'} />
            <ReadOnlyText> Accounts</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Location Details (Room no etc)'} />
            <ReadOnlyText> Not Applicable</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Harm Level'} />
            <ReadOnlyText> Moderate</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label
              bold
              value={'Any additional staff you wish to be notified?'}
            />
            <ReadOnlyText> No</ReadOnlyText>
          </StyledGridItem>

          {/* Row 3 */}
          <StyledGridItem>
            <Label bold value={'Approval Status'} />
            <ReadOnlyText> Assigned</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Approval Remarks'} />
            <ReadOnlyText> Not Applicable</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Approved By'} />
            <ReadOnlyText> Super Admin</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Approval Date'} />
            <ReadOnlyText> 29-08-2024</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Approval Time'} />
            <ReadOnlyText> 15:58</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Department/Speciality'} />
            <ReadOnlyText> Not Applicable</ReadOnlyText>
          </StyledGridItem>
        </StyledGridContainer>
      </FlexContainer>
    </FormContainer>
  );
};

export default IC_Pending_ICE_IncidentApprovalDetails;
