import React from 'react';
import styled from 'styled-components';
import { StyledTypography } from '../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';

const RedAsterisk = styled.span`
  color: red;
  margin-left: 4px;
`;

export default function Label({
  value,
  isRequired = false,
  color,
  bold,
  marginBottom,
  fontSize,
}) {
  const { i18n } = useTranslation();
  return (
    <StyledTypography
      fontSize={fontSize?fontSize:'13px'}
      fontWeight={bold ? 'bold' : '500'}
      lineHeight="16px"
      color={color || '#000'}
      marginBottom={marginBottom || '4px'}
      whiteSpace={'break-spaces'}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
    >
      {value}
      {isRequired && <RedAsterisk>*</RedAsterisk>}
    </StyledTypography>
  );
}
