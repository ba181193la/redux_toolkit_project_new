import React from 'react';
import { FlexContainer, StyledImage } from '../../../../utils/StyledComponents';
import PendingIcon from '../../../../assets/Icons/PendingIcon.png';
import CompletedIcon from '../../../../assets/Icons/CompletedIcon.png';
import GraphIcon from '../../../../assets/Icons/GraphIcon.png';
import RejectedIcon from '../../../../assets/Icons/RejectedIcon.png';
import styled from 'styled-components';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import { useGetPageLoadDataQuery } from '../../../../redux/RTK/incidentClosureApi';
import { useDispatch, useSelector } from 'react-redux';

const StyledFlexContainer = styled(FlexContainer)`
  flex-direction: row;
  border-radius: 15px;
  width: 257px;
  height: 86px;
  justify-content: space-evenly;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  color: #000000;
  box-shadow: 0px 4px 4px 0px #00000040 !important;

  &:hover {
    transform: scale(1.05) !important;
    transition: transform 0.3s ease !important;
  }
`;

const IC_IncidentMetrics = () => {
  const { isMobile, isTablet } = useWindowDimension();

  const { selectedMenu, selectedModuleId, userDetails, selectedFacility } =
    useSelector((state) => {
      return state.auth;
    });

  const { data: pageLoadData } = useGetPageLoadDataQuery({
    menuId: 30,
    moduleId: 2,
    loginUserId: userDetails?.UserId, // 1
    headerFacilityId: selectedFacility?.id, // 2
  });

  const { Pending, Completed, Rejected, LastWeekRecord } =
    pageLoadData?.Data || {};

  return (
    <FlexContainer
      width="100%"
      justifyContent={isMobile ? 'center' : 'space-between'}
      padding={isMobile ? '0 0 10px 0' : '20px'}
      flexWrap={isMobile || isTablet ? 'wrap' : ''}
      gap="20px"
    >
      <StyledFlexContainer
        style={{
          display: 'flex',
          backgroundColor: '#d81010',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            backgroundColor: '#b50e0e',
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <i
            className="fa fa-chart-line dashicon"
            style={{
              fontSize: '24px',
              color: '#ffffff',
            }}
          ></i>
        </div>
        <div
          style={{
            flex: '2',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: '#ffffff',
          }}
        >
          <div style={{ fontSize: '18px' }}>{Pending}</div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Pending</div>
        </div>
      </StyledFlexContainer>

      <StyledFlexContainer
        style={{
          display: 'flex',
          backgroundColor: '#7ed320',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            backgroundColor: '#72bf1d',
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <i
            className="fa fa-chart-pie dashicon"
            style={{
              fontSize: '24px',
              color: '#ffffff',
            }}
          ></i>
        </div>
        <div
          style={{
            flex: '2',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: '#ffffff',
          }}
        >
          <div style={{ fontSize: '18px' }}>{Completed}</div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Completed</div>
        </div>
      </StyledFlexContainer>

      <StyledFlexContainer
        style={{
          display: 'flex',
          backgroundColor: '#7266ba',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            backgroundColor: '#604fa7',
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
        >
          <i
            className="fa fa-chart-bar dashicon"
            style={{
              fontSize: '24px',
              color: '#ffffff',
            }}
          ></i>
        </div>
        <div
          style={{
            flex: '2',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            color: '#ffffff',
          }}
        >
          <div style={{ fontSize: '18px' }}>{LastWeekRecord}</div>
          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
            Last Week Record
          </div>
        </div>
      </StyledFlexContainer>
    </FlexContainer>
  );
};

export default IC_IncidentMetrics;
