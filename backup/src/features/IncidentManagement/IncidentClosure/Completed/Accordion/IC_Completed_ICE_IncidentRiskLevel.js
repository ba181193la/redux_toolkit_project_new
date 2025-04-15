import React from 'react';
import {
  FormContainer,
  ReadOnlyText,
  StyledGridContainer,
  StyledGridItem,
} from '../../IncidentClosure.styled';
import { FlexContainer } from '../../../../../utils/StyledComponents';
import Label from '../../../../../components/Label/Label';
import IC_Completed_AffectedCategoryTable from '../DataTable/IC_Completed_AffectedCategoryTable';
import IC_Completed_IncidentHistoryTable from '../DataTable/IC_Completed_IncidentHistoryTable';
import IC_Completed_NotificationHistoryTable from '../DataTable/IC_Completed_NotificationHistoryTable';

const IC_Completed_ICE_IncidentRiskLevel = () => {
  return (
    <FormContainer>
      <FlexContainer flexDirection={'column'}>
        <FlexContainer flexDirection="column" margin="10px 0px 10px 20px">
          <Label bold value={'Affected Category and Factor(s) :'} />
          <IC_Completed_AffectedCategoryTable />
        </FlexContainer>
        <StyledGridContainer>
          {/* Row 1 */}
          <StyledGridItem>
            <Label bold value={'Likelihood  : '} />
            <ReadOnlyText> Rare </ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Submitted By : '} />
            <ReadOnlyText> Dr. Sujitha </ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Department / Speciality :'} />
            <ReadOnlyText> Cardiology </ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Designation :'} />
            <ReadOnlyText> Head of Department Cardiology </ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Submitted Date :'} />
            <ReadOnlyText> 25-06-2024 </ReadOnlyText>
          </StyledGridItem>
        </StyledGridContainer>

        <FlexContainer flexDirection="column" margin="10px 0px 10px 20px">
          <Label bold value={'Incident History :'} />
          <IC_Completed_IncidentHistoryTable />
        </FlexContainer>
        <FlexContainer flexDirection="column" margin="10px 0px 10px 20px">
          <Label bold value={'Notification History :'} />
          <IC_Completed_NotificationHistoryTable />
        </FlexContainer>
      </FlexContainer>
    </FormContainer>
  );
};

export default IC_Completed_ICE_IncidentRiskLevel;
