import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import PlusIcon from '../../../assets/Icons/AddSubMaster.png';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const StaffDemography = () => {
  //* Hooks declaration
  const { t, i18n } = useTranslation();

  //* Selectors
  const { selectedMenu, selectedModuleId } = useSelector((state) => state.auth);

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="space-between"
    >
      <FlexContainer justifyContent="space-between" padding="0 0 15px 0">
        <StyledTypography
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace="nowrap"
          sx={{
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2rem' },
          }}
        >
          {t('MM_StaffDemography')}
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
          <FlexContainer
            alignItems="center"
            width="100%"
            flexWrap="wrap"
            justifyContent="flex-end"
          >
            <StyledButton
              variant="contained"
              padding={'6px 10px'}
              startIcon={
                <StyledImage
                  height="14px"
                  width="14px"
                  src={PlusIcon}
                  alt="Add New Icon"
                  style={{ marginInlineEnd: 8 }}
                />
              }
              onClick={() => {
                window.open(`/MainMaster/StaffDemography/SubMaster`, '_blank');
              }}
            >
              {t('AddSubMaster')}
            </StyledButton>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default StaffDemography;
