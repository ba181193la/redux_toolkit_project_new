import React from 'react';
import styled from 'styled-components';
import { StyledImage, StyledTypography } from '../../utils/StyledComponents';
import FooterImg from '../../assets/Icons/medas_logo_footer.png';

const Footer = () => {
  const FooterContainer = styled.div`
    display: flex;
    height: 40px;
    width: 100%;
    align-items: center;
    justify-content: center;
    position: sticky; /* Makes the header sticky */
    bottom: 0; /* Sticks the header to the top of the viewport */
    z-index: 1000; /* Keeps the header above other content */
    border: 1px, 0px, 0px, 0px;
    box-shadow: 0px -2px 4px 0px rgba(0, 0, 0, 0.15);
    background: rgba(242, 242, 242, 1);
  `;

  return (
    <FooterContainer>
      <StyledImage
        height="20px"
        src={FooterImg}
        alt="footer Img"
        style={{ marginRight: 15 }}
      />
      <StyledTypography
        fontSize="12px"
        fontWeight="300"
        lineHeight="18px"
        marginRight="5px"
        color="rgba(102, 102, 102, 1)"
      >
        Copyright © 2024
      </StyledTypography>
      <StyledTypography
        fontSize="12px"
        fontWeight="600"
        lineHeight="18px"
        color="rgba(102, 102, 102, 1)"
      >
        Medas Solutions
      </StyledTypography>
    </FooterContainer>
  );
};

export default Footer;
