import React from 'react';
import {
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import { Divider, Tooltip } from '@mui/material';
import NotificationMasterTable from './NotificationMasterTable';
import BackArrowGif from '../../../assets/Gifs/BackArrowGif.gif';
import i18n from '../../../i18n/i18n';
import { useNavigate } from 'react-router-dom';
import useWindowDimension from '../../../hooks/useWindowDimension';

const NotificationMaster = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isMobile } = useWindowDimension();

  return (
    <FlexContainer
      width="100%"
      height="100%"
      flexDirection="column"
      justifyContent="space-between"
      padding={isMobile ? '15px' : '0'}
    >
      <FlexContainer
        marginBottom={isMobile ? '20px' : '0'}
        marginTop={isMobile ? '20px' : '0'}
        justifyContent={isMobile ? 'center' : 'space-between'}
        style={{ paddingBottom: '15px' }}
      >
        <StyledTypography
          fontSize={isMobile ? '24px' : '36px'}
          fontWeight="900"
          lineHeight={isMobile ? '32px' : '44px'}
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('MM_NotificationMaster')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer width="100%" height="auto" flex="1" flexDirection="column">
        <FlexContainer
          height="100%"
          width="100%"
          padding={isMobile ? '10px' : '15px 15px 0'}
          borderRadius="8px"
          flexDirection="column"
          backgroundColor="#fff"
          boxShadow="0px 4px 4px 0px #00000029"
        >
          <FlexContainer alignItems="center" gap={isMobile ? '4px' : '8px'}>
            <FlexContainer>
              <Tooltip title="Go back" arrow>
                <button
                  style={{
                    backgroundColor: 'rgb(52 152 219)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '8px 16px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '10px',
                    display: 'block',
                    fontSize: '13px',
                  }}
                  onClick={() => navigate('/MainMaster/NotificationMaster')}
                >
                  <span
                    style={{ marginRight: '4px', fontSize: '12px' }}
                  >{`<<`}</span>{' '}
                  Previous
                </button>
              </Tooltip>
            </FlexContainer>
            <StyledTypography
              fontSize={isMobile ? '16px' : '20px'}
              fontWeight="600"
              lineHeight={isMobile ? '20px' : '24px'}
              textAlign="left"
              color="#205475"
            >
              {t('EditNotificationMaster')}
            </StyledTypography>
          </FlexContainer>
          <Divider sx={{ marginTop: isMobile ? '10px' : '20px' }} />
          <NotificationMasterTable />
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default NotificationMaster;
