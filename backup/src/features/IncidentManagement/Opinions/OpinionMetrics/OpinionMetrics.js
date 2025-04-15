import React, { useTransition } from 'react';
import { FlexContainer, StyledImage } from '../../../../utils/StyledComponents';
import PendingIcon from '../../../../assets/Icons/2XPendingIcon.png';
import CompletedIcon from '../../../../assets/Icons/2XCompletedIcon.png';
import GraphIcon from '../../../../assets/Icons/2XGraphIcon.png';
import RejectedIcon from '../../../../assets/Icons/2XRejectIcon.png';
import styled from 'styled-components';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import { useGetOpinionPageLoadDataQuery } from '../../../../redux/RTK/IncidentOinionApi';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const StyledFlexContainer = styled(FlexContainer)`
  flex-direction: row;
  border-radius: 10px;
  width: 257px;
  height: 86px;
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  box-shadow: 0px 4px 4px 0px #00000040 !important;

  &:hover {
    transform: scale(1.05) !important;
    transition: transform 0.3s ease !important;
  }
`;

const OpinionMetrics = () => {
  const { isMobile, isTablet } = useWindowDimension();
  const {t} =useTranslation();

  const {
    selectedRoleFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
  } = useSelector((state) => state.auth);

  const { data } = useGetOpinionPageLoadDataQuery({
    menuId: selectedMenu.id,
    moduleId: selectedModuleId,
    loginUserId: 1,
    facilityId: selectedFacility?.id,
  });

  const pendingValue = data?.Data?.Result?.Pending || 0;
  const completedValue = data?.Data?.Result?.Completed || 0;

  return (
    <FlexContainer
      width="100%"
      justifyContent={isMobile ? 'center' : 'center'}
      padding={isMobile ? '0 0 10px 0' : '20px 20px 40px 20px'}
      flexWrap={isMobile || isTablet ? 'wrap' : ''}
      gap="20px"
    >
      <StyledFlexContainer
        style={{
          backgroundColor: 'rgb(241, 21, 21)',
        }}
      >
        <FlexContainer
          backgroundColor="rgba(0, 0, 0, 0.1)"
          width="80px"
          height="86px"
        >
          <StyledImage
            cursor="pointer"
            height="40px"
            width="40px"
            margin="20px"
            marginTop="20px"
            style={{
              padding: '5px',
              alignItems: 'center',
            }}
            src={PendingIcon}
            alt="Pending"
          />
        </FlexContainer>
        <div
          style={{
            padding: '10px 0 20px 20px',
            color: 'rgb(255, 255, 255)',
          }}
        >
          <div>{pendingValue}</div>
          <div>{t('Pending')}</div>
        </div>
      </StyledFlexContainer>

      <StyledFlexContainer
        style={{
          backgroundColor: 'rgb(126, 211, 32)',
        }}
      >
        <FlexContainer
          backgroundColor="rgba(0, 0, 0, 0.1)"
          width="80px"
          height="86px"
        >
          <StyledImage
            cursor="pointer"
            height="40px"
            width="40px"
            margin="20px"
            marginTop="20px"
            style={{
              alignItems: 'center',
              padding: '5px',
            }}
            src={CompletedIcon}
            alt="Completed"
          />
        </FlexContainer>
        <div
          style={{
            padding: '10px 0 20px 20px',
            color: 'rgb(255, 255, 255)',
          }}
        >
          <div>{completedValue}</div>
          <div>{t('Completed')}</div>
        </div>
      </StyledFlexContainer>

      {/* <StyledFlexContainer
        style={{
          backgroundColor: 'rgb(114, 102, 186)',
        }}
      >
        <FlexContainer backgroundColor="rgba(0, 0, 0, 0.1)" width="80px" height='86px' >
        <StyledImage
          cursor="pointer"
          height="40px"
          width="40px"
          margin="20px"
          style={{
            padding: '5px'
          }}
          src={RejectedIcon}
          alt="Rejected"
        />
        </FlexContainer>
        <div style={{
            padding:'10px 0 20px 20px',
            color:'rgb(255, 255, 255)'}}>
            <div>2</div>
            <div>Rejected</div>
        </div>
      </StyledFlexContainer> */}
      {/* <StyledFlexContainer
        style={{
          backgroundColor: 'rgb(52, 152, 219)',
        }}
      >
      <FlexContainer backgroundColor="rgba(0, 0, 0, 0.1)" width="80px" height='86px' >
        <StyledImage
          cursor="pointer"
          height="40px"
          width="40px"
          margin="20px"
          style={{
            padding: '5px'
          }}
          src={GraphIcon}
          alt="New Last 7 Days"
        />
                </FlexContainer>
        <div style={{
            padding:'10px 0 20px 20px',
            color:'rgb(255, 255, 255)'}}>
            <div>0</div>
            <div>New Last 7 Days</div>
        </div>
      </StyledFlexContainer> */}
    </FlexContainer>
  );
};

export default OpinionMetrics;
