import React from 'react';
import { Divider, Tooltip } from '@mui/material';
import BackArrowGif from '../../../assets/Gifs/BackArrowGif.gif';
import {
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import ContactInfoForm from './ContactInfoForm';
import { useNavigate, useParams } from 'react-router-dom';
import useWindowDimension from '../../../hooks/useWindowDimension';

const ContactInfo = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isMobile } = useWindowDimension();
  const { id } = useParams();

  return (
    <FlexContainer width="100%" height="100%" flexDirection="column">
      <FlexContainer
        marginBottom={isMobile ? '20px' : '30px'}
        marginTop={isMobile ? '20px' : '65px'}
        justifyContent={isMobile ? 'center' : 'space-between'}
        padding="0 0 15px 0"
      >
        <StyledTypography
          fontSize={isMobile ? '24px' : '36px'}
          fontWeight="900"
          lineHeight={isMobile ? '32px' : '44px'}
          color="#0083C0"
          whiteSpace={isMobile ? 'wrap' : 'nowrap'}
        >
          {t('MM_ContactInformationMaster')}
        </StyledTypography>
      </FlexContainer>

      <FlexContainer
        width="calc(100% - 30px)"
        height="auto"
        flex="1"
        flexDirection="column"
      >
        <FlexContainer
          height="100%"
          width="100%"
          padding="25px 15px 0px 25px"
          borderRadius="8px"
          flexDirection="column"
          backgroundColor="#fff"
        >
          <FlexContainer alignItems="center">
            
              <FlexContainer >
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
                  onClick={() =>
                    navigate('/MainMaster/ContactInformationMaster', {
                      state: { activeTab: 'facility' },
                    })
                  }
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
              {id ? t('EditContactInformation') : t('AddNewContactInformation')}
            </StyledTypography>
          </FlexContainer>
          <Divider sx={{ marginY: '20px' }} />
          <ContactInfoForm id={id} />
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default ContactInfo;
