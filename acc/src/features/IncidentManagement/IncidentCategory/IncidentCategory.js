import React from 'react';
import {
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../redux/RTK/moduleDataApi';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';
import Subcategory from './SubCategory/SubCategory';
import MainCategory from './MainCategory/MainCategory';
import AffectedCategory from './AffectedCategory/AffectedCategory';
import IncidentDetails from './IncidentDetails/IncidentDetails';

const IncidentCategory = () => {
  //* Hooks declaration
  const { t, i18n } = useTranslation();

  //* Selectors
  const { selectedMenu, selectedModuleId, regionCode, roleFacilities } =
    useSelector((state) => state.auth);

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
      height="auto"
      flexDirection="column"
      justifyContent="center"
    >
      <FlexContainer justifyContent={'space-between'} padding="0 0 15px 0">
        <StyledTypography
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
          sx={{
            fontSize: {
              xs: '1.5rem',
              sm: '1.75rem',
              md: '2rem',
              lg: '2rem',
            },
          }}
        >
          {t('IM_IncidentCategory')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer width="100%" height="auto" flex="1" flexDirection="column">
        <FlexContainer
          height="100%"
          width="100%"
          padding="30px 15px 30px 15px"
          borderRadius="8px"
          flexDirection="column"
          backgroundColor="#fff"
          boxShadow="0px 4px 4px 0px #00000029"
        >
          {labelsFetching || accessFetching ? (
            <FlexContainer
              width="100%"
              height="65vh"
              justifyContent="center"
              alignItems="center"
            >
              <StyledImage src={LoadingGif} alt="LoadingGif" />
            </FlexContainer>
          ) : (
            <>
              {regionCode === 'ABD' && (
                <AffectedCategory labels={labels} fieldAccess={fieldAccess} />
              )}
              <MainCategory labels={labels} fieldAccess={fieldAccess} />
              <Subcategory labels={labels} fieldAccess={fieldAccess} />
              <IncidentDetails labels={labels} fieldAccess={fieldAccess} />
            </>
          )}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default IncidentCategory;
