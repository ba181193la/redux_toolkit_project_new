import React, { useEffect, useState } from 'react';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import { Divider, Tooltip } from '@mui/material';
import BackArrowGif from '../../../../assets/Gifs/BackArrowGif.gif';
import { useNavigate, useParams } from 'react-router-dom';
import ReportIncidentForm from './ReportIncidentForm';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import { useSelector } from 'react-redux';
import { useGetLabelsQuery } from '../../../../redux/RTK/moduleDataApi';
import BackArrow from '../../../../assets/Icons/white/left-arrow.png';

const ReportNewIncident = () => {
  const { t } = useTranslation();
  const { isMobile } = useWindowDimension();
  const navigate = useNavigate();
  const { id } = useParams();

  const [labels, setLabels] = useState([]);

  const { selectedMenu, selectedModuleId, regionCode } = useSelector(
    (state) => state.auth
  );

  const { data: labelsData = [] } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  useEffect(() => {
    const abdLabels =
      labelsData?.Data?.[0]?.Regions?.find((i) => i.RegionCode === 'ABD')
        ?.Labels || [];
    const allRegion =
      labelsData?.Data?.[0]?.Regions?.find(
        (region) => region.RegionCode === 'ALL'
      )?.Labels || [];
    if (regionCode === 'ABD') {
      setLabels([...abdLabels, ...allRegion]);
    } else if (regionCode === 'ALL') {
      setLabels(allRegion);
    }
  }, [labelsData, regionCode]);
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
          fontSize={isMobile ? '24px' : '30px'}
          fontWeight="900"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('IM_ReportIncidentEntry')}
        </StyledTypography>
      </FlexContainer>

      <FlexContainer width="100%" height="auto" flex="1" flexDirection="column">
        <FlexContainer
          height="100%"
          width="100%"
          padding="15px 20px 0px 20px"
          // padding="0px 15px"

          borderRadius="8px"
          flexDirection="column"
          backgroundColor="#fff"
        >
          <FlexContainer
            alignItems="center"
            flexWrap="wrap"
            justifyContent="space-between"
            style={{
              margin: '0px 0px 20px 0',
            }}
          >
            <StyledButton
              borderRadius="6px"
              gap="4px"
              padding="6px 10px"
              variant="contained"
              backgroundColor="#3498db"
              type="button"
              style={{
                display: 'inline-flex',
                gap: '5px',
              }}
              onClick={() => navigate('/IncidentManagement/ReportIncident')}
              startIcon={
                <StyledImage
                  height="20px"
                  width="20px"
                  src={BackArrow}
                  alt="WhiteSearch"
                />
              }
            >
              {t('Previous')}
            </StyledButton>
          </FlexContainer>
          <ReportIncidentForm labels={labels} id={id} />
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default ReportNewIncident;
