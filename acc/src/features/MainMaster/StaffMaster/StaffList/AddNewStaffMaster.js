import React from 'react';
import { Divider, Tooltip } from '@mui/material';
import BackArrowGif from '../../../../assets/Gifs/BackArrowGif.gif';
import {
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import StaffMasterForm from './StaffMasterForm';

const AddNewStaffMaster = () => {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  return (
    <FlexContainer width="100%" height="100%" flexDirection="column">
      <FlexContainer
        style={{ paddingBottom: '15px' }}
      >
        <StyledTypography
          fontSize="36px"
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('MM_StaffMaster')}
        </StyledTypography>
      </FlexContainer>

      <FlexContainer width="100%" height="auto" flex="1" flexDirection="column">
        <FlexContainer
          height="100%"
          width="100%"
          padding="25px 15px 0px 25px"
          borderRadius="8px"
          flexDirection="column"
          backgroundColor="#fff"
        >
          <FlexContainer alignItems="center" gap="8px">
            <StyledTypography
              fontSize="20px"
              fontWeight="600"
              lineHeight="24px"
              textAlign="left"
              color="#205475"
            >
              {t('AddNewStaffEntry')}
            </StyledTypography>
          </FlexContainer>
          <Divider sx={{ marginY: '20px' }} />
          <StaffMasterForm />
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default AddNewStaffMaster;
