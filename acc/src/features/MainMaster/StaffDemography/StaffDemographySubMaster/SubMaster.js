import { useTranslation } from 'react-i18next';
import {
  FlexContainer,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMediaQuery } from '@mui/system';
import { useSelector } from 'react-redux';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import BackArrowGif from '../../../../assets/Gifs/BackArrowGif.gif';
import Tabs from './Tabs/Tabs';
import License from './License/License';
import AdditionalTab from './AdditionalTab/AdditionalTab';
import LifeSupportCertification from './LifeSupportCertification/LifeSupportCertification';
import VerificationStatus from './VerificationStatus/VerificationStatus';
import PassedByHR from './VerificationPassedByHR/PassedByHr';

const SubMaster = () => {
  //* Hooks Declaration
  const { t } = useTranslation();
  const navigate = useNavigate();

  //* Selectors
  const { selectedMenu, selectedModuleId } = useSelector((state) => state.auth);

  //* RTK Queries
  const { data: labels = [], isFetching: labelsFetching } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  const { data: fieldAccess = [], isFetching: accessFetching } =
    useGetFieldsQuery({
      menuId: selectedMenu?.id,
      moduleId: selectedModuleId,
    });

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="space-between"
    >
      <FlexContainer justifyContent="space-between">
        <StyledTypography
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace="nowrap"
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2rem' },
          }}
        >
          {t('MM_StaffDemographySubMaster')}
        </StyledTypography>
      </FlexContainer>

      <FlexContainer width="100%" height="auto" flex="1" flexDirection="column">
        <FlexContainer
          height="100%"
          width="100%"
          padding="15px"
          borderRadius="8px"
          flexDirection="column"
          backgroundColor="#fff"
          boxShadow="0px 4px 4px 0px #00000029"
        >
          <FlexContainer alignItems="center" width="100%" flexWrap="wrap">
            <img
              src={BackArrowGif}
              alt="BackArrowGif"
              style={{
                width: '70px',
                height: '60px',
                marginRight: '8px',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/MainMaster/StaffDemography')}
            />
            <StyledTypography
              fontSize="25px"
              fontWeight="600"
              lineHeight="24px"
              textAlign="left"
              color="#205475"
            >
              {t('MM_SM_SubMaster')}
            </StyledTypography>
          </FlexContainer>

          <Tabs labels={labels} fieldAccess={fieldAccess} />
          <License labels={labels} fieldAccess={fieldAccess} />
          <AdditionalTab labels={labels} fieldAccess={fieldAccess} />
          <LifeSupportCertification labels={labels} fieldAccess={fieldAccess} />
          <VerificationStatus labels={labels} fieldAccess={fieldAccess} />
          <PassedByHR labels={labels} fieldAccess={fieldAccess} />
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default SubMaster;
