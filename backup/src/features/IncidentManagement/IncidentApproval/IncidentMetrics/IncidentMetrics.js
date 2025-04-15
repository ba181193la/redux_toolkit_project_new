import React from 'react';
import { FlexContainer, StyledImage } from '../../../../utils/StyledComponents';
import PendingIcon from '../../../../assets/Icons/2XPendingIcon.png';
import CompletedIcon from '../../../../assets/Icons/2XCompletedIcon.png';
import GraphIcon from '../../../../assets/Icons/2XGraphIcon.png';
import RejectedIcon from '../../../../assets/Icons/2XRejectIcon.png';
import styled from 'styled-components';
import useWindowDimension from '../../../../hooks/useWindowDimension';
import { useDispatch, useSelector } from 'react-redux';
import { useGetPageLoadDataQuery } from '../../../../redux/RTK/IncidentManagement/incidentApprovalApi';

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

const IncidentMetrics = () => {
  const { isMobile, isTablet } = useWindowDimension();
  const { selectedMenu, selectedModuleId, userDetails, selectedFacility } =
  useSelector((state) => state.auth);

  const { data: pageLoadData } = useGetPageLoadDataQuery({
    moduleId: selectedModuleId,
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    headerFacilityId: selectedFacility?.id,
  });
  const { Pending, Completed, Rejected, LastWeekRecord } = pageLoadData?.Data || {};


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
        <div style={{ fontSize: '18px',  }}>{Pending}</div>
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
        <div style={{ fontSize: '18px',  }}>{Completed}</div>
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
        <div style={{ fontSize: '18px', }}>{Rejected}</div>
        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Rejected</div>
      </div>
    </StyledFlexContainer>
    
    <StyledFlexContainer
      style={{
        display: 'flex',
        backgroundColor: '#3498db',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          backgroundColor: '#2c81bf',
          flex: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <i
          className="fa fa-chart-area dashicon"
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
        <div style={{ fontSize: '18px',  }}>{LastWeekRecord}</div>
        <div style={{ fontWeight: 'bold', fontSize: '16px' }}>New Last 7 Days</div>
      </div>
    </StyledFlexContainer>
    
        </FlexContainer>
  );
};

export default IncidentMetrics;
