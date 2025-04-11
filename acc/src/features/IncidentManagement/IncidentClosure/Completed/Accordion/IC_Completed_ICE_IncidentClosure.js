import React from 'react';
import {
  FormContainer,
  ReadOnlyText,
  StyledGridContainer,
  StyledGridItem,
} from '../../IncidentClosure.styled';
import { FlexContainer } from '../../../../../utils/StyledComponents';
import Label from '../../../../../components/Label/Label';
import IC_Completed_ContributingFactorsTable from '../DataTable/IC_Completed_ContributingFactorsTable';
import IC_Completed_ContributingDepartmentsTable from '../DataTable/IC_Completed_ContributingDepartmentsTable';
import IC_Completed_NegligencefromStaffTable from '../DataTable/IC_Completed_NegligencefromStaffTable';
import IC_Completed_FurtherActionTable from '../DataTable/IC_Completed_FurtherActionTable';
import IC_Completed_IC_AttachmentTable from '../DataTable/IC_Completed_IC_AttachmentTable';

const IC_Completed_ICE_IncidentClosure = () => {
  return (
    <FormContainer>
      <FlexContainer flexDirection={'column'}>
        <StyledGridContainer>
          {/* Row 1 */}
          <StyledGridItem>
            <Label bold value={'Incident Type : '} />
            <ReadOnlyText> Apollo - Chennai</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Incident Main Category :'} />
            <ReadOnlyText> Test and Test Results </ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Incident Sub Category :'} />
            <ReadOnlyText> Blood samples </ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Incident Details :'} />
            <ReadOnlyText> Mislabeling of blood samples </ReadOnlyText>
          </StyledGridItem>

          {/* Row 2 */}
          <StyledGridItem>
            <Label bold value={'Clinical/Non Clinical :'} />
            <ReadOnlyText> Clinical</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'JAWDA Incident Level :'} />
            <ReadOnlyText> Level 1 </ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Incident Reason / Root Cause :'} />
            <ReadOnlyText> misunderstood</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Lessons Learned :'} />
            <ReadOnlyText>Not Applicable </ReadOnlyText>
          </StyledGridItem>

          {/* Row 3 */}
          <StyledGridItem>
            <Label bold value={'Harm Level : '} />
            <ReadOnlyText> No Harm Level </ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Medication Incident Harm level : '} />
            <ReadOnlyText> Not Applicable </ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Incident Reoccurrence : '} />
            <ReadOnlyText> Not Applicable </ReadOnlyText>
          </StyledGridItem>
        </StyledGridContainer>
        <FlexContainer flexDirection="column" margin="10px 0px 10px 20px">
          <Label bold value={'Contributing Factors :'} />
          <IC_Completed_ContributingFactorsTable />
        </FlexContainer>
        <FlexContainer flexDirection="column" margin="10px 0px 10px 20px">
          <Label bold value={'Contributing Departments :'} />
          <IC_Completed_ContributingDepartmentsTable />
        </FlexContainer>
        <FlexContainer flexDirection="column" margin="10px 0px 10px 20px">
          <Label bold value={'Negligence from Staff :'} />
          <IC_Completed_NegligencefromStaffTable />
        </FlexContainer>
        <FlexContainer flexDirection="column" margin="10px 0px 10px 20px">
          <Label bold value={'Further Actions Taken By Approver :'} />
          <IC_Completed_FurtherActionTable />
        </FlexContainer>
        <StyledGridContainer>
          {/* Row 1 */}
          <StyledGridItem>
            <Label bold value={'To be Discussed in Committee : '} />
            <ReadOnlyText> Not Applicable </ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Report to External Body :'} />
            <ReadOnlyText> No </ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Remarks :'} />
            <ReadOnlyText> Not Applicable </ReadOnlyText>
          </StyledGridItem>
        </StyledGridContainer>
        <FlexContainer flexDirection="column" margin="10px 0px 10px 20px">
          <Label bold value={'Attachment(s) :'} />
          <IC_Completed_IC_AttachmentTable />
        </FlexContainer>
      </FlexContainer>
    </FormContainer>
  );
};

export default IC_Completed_ICE_IncidentClosure;
