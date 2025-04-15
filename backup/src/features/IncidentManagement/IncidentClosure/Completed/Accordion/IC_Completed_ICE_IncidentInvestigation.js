import React from 'react';
import { FlexContainer, StyledTypography } from '../../../../../utils/StyledComponents';
import { FormContainer } from '../../IncidentClosure.styled';
import Label from '../../../../../components/Label/Label';
import IC_Completed_InvestigatorTable from '../DataTable/IC_Completed_InvestigatorTable';
import IC_Completed_ActionTable from '../DataTable/IC_Completed_ActionTable';
import IC_Completed_OpnionTablejs from '../DataTable/IC_Completed_OpnionTable';

const IC_Completed_ICE_IncidentInvestigation = () => {
  return (
    <FormContainer>
      <FlexContainer backgroundColor={'#8D6E63'} width={'100%'} height={'50px'} justifyContent={'center'} alignItems='center'> 
      <StyledTypography>Dr Gia</StyledTypography>
      </FlexContainer>
      <FlexContainer flexDirection={'column'}>
        <FlexContainer flexDirection="column" margin="10px 0px 10px 20px">
          <Label bold value={'Investigators and Input :'} />
          <IC_Completed_InvestigatorTable />
        </FlexContainer>
        <FlexContainer flexDirection="column" margin="10px 0px 10px 20px">
          <Label
            bold
            value={'Actions taken for Prevention of Incident again :'}
          />
          <IC_Completed_ActionTable />
        </FlexContainer>
        <FlexContainer flexDirection="column" margin="10px 0px 10px 20px">
          <Label
            bold
            value={'Opinion(s) Exchanged :'}
          />
          <IC_Completed_OpnionTablejs />
        </FlexContainer>
      </FlexContainer>
    </FormContainer>
  );
};

export default IC_Completed_ICE_IncidentInvestigation;
