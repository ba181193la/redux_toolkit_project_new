import React from 'react';
import {
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../utils/StyledComponents';
import {
  setSelectedMenu,
  setSelectedModuleId,
} from '../../redux/features/auth/authSlice';
import useWindowDimension from '../../hooks/useWindowDimension';
import { useTranslation } from 'react-i18next';
import {useDispatch} from 'react-redux'

const StatusBox = ({ status, label, count, bgColor, icon, circleColor, MenuLink }) => {
  const { isMobile } = useWindowDimension();
  const {t}=useTranslation()
  const dispatch=useDispatch()
  return (
    <FlexContainer
      backgroundColor={bgColor}
      padding={isMobile ? '10px' : '15px 10px'}
      borderRadius="8px"
      width={isMobile ? '100%' : '300px'}
      height={isMobile ? 'auto' : '100px'}
      boxShadow="0px 4px 4px 0px #00000029"
      alignItems="center"
      justifyContent="flex-start"
      margin={isMobile ? '10px 0' : '0'}
      style={{ cursor: 'pointer' }} // Change cursor to pointer to indicate it's clickable
      onClick={() =>{
        dispatch( setSelectedMenu({ id: status?.MenuId, name: status?.MenuName }) )
        dispatch(setSelectedModuleId(status?.moduleId));
         window.open(MenuLink, '_blank')
      } }
    >
      <FlexContainer
        width={isMobile ? '35px' : '45px'}
        height={isMobile ? '35px' : '45px'}
        borderRadius="50%"
        backgroundColor={circleColor || bgColor}
        justifyContent="center"
        alignItems="center"
        margin={isMobile ? '0 10px' : '0 15px 0 0'}
      >
        <StyledImage
          src={icon}
          alt={`${label} Icon`}
          width={isMobile ? '25px' : '35px'}
          height={isMobile ? '25px' : '35px'}
        />
      </FlexContainer>

      <FlexContainer flexDirection="column" alignItems="flex-start">
        {status.MenuName === "Action Approval" ? (
          <StyledTypography
            fontSize={isMobile ? '14px' : '17px'}
            fontWeight="bold"
            color="#FFFFFF"
          >
            {t( "ActionApproval")} <span>{`(${count})`}</span>
          </StyledTypography>) :
          <StyledTypography
            fontSize={isMobile ? '14px' : '17px'}
            fontWeight="bold"
            color="#FFFFFF"
          >
            {label} <span>{`(${count})`}</span>
          </StyledTypography>
        }

      </FlexContainer>
    </FlexContainer>
  );
};

export default StatusBox;
