import React from 'react';
import {
  FlexContainer,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import UserAssignmentList from './UserAssignmentList/UserAssignmentList';
import useWindowDimension from '../../../hooks/useWindowDimension';

const StaffMaster = () => {
  const { t } = useTranslation();
  const { isMobile } = useWindowDimension();
  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="space-between"
    >
      <FlexContainer
        justifyContent={'space-between'}
        style={{ paddingBottom: '15px' }}
      >
        <StyledTypography
           fontSize={isMobile ? '24px' : '36px'}
           fontWeight="900"
           lineHeight={isMobile ? '32px' : '44px'}
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('MM_UserAssignment')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer height="auto" flex="1" flexDirection="column">
        <FlexContainer
          height="100%"
          width="100%"
          padding="25px"
          borderRadius="8px"
          flexDirection="column"
          backgroundColor="#fff"
        >
          <UserAssignmentList />
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default StaffMaster;
