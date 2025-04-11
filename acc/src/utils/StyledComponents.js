import styled from 'styled-components';

import {
  Typography,
  Button,
  AccordionSummary,
  Tab,
  TextField,
} from '@mui/material';

const reduceFontSize = (fontSize) => {
  if (!fontSize) return '';
  const pxValue = parseFloat(fontSize);
  return `${(pxValue * 0.8).toFixed(2)}px`;
};

export const FlexContainer = styled.div`
  display:${(props) => props.display || 'flex'};  !important;
  justify-content: ${(props) => props.justifyContent};
  flex-direction: ${(props) => props.flexDirection};
  align-items: ${(props) => props.alignItems};
  padding: ${(props) => props.padding};
  flex: ${(props) => props.flex};
  margin: ${(props) => props.margin};
  margin-top: ${(props) => props.marginTop};
  margin-left: ${(props) => props.marginLeft};
  margin-right: ${(props) => props.marginRight};

  height: ${(props) => props.height};
  width: ${(props) => props.width};
  text-align: ${(props) => props.textAlign};
  border-bottom: ${(props) => props.borderBottom};
  border-left: ${(props) => props.borderLeft};  
  border-right: ${(props) => props.borderRight};  
  border-radius: ${(props) => props.borderRadius};  
  flex-wrap: ${(props) => props.flexWrap};
  gap: ${(props) => props.gap};
  row-gap: ${(props) => props.rowGap};
  column-gap: ${(props) => props.columnGap};
  order: ${(props) => props.order};
  min-height: ${(props) => props.minHeight};
  max-height: ${(props) => props.maxHeight};
  background-image: ${(props) => props.backgroundImage};
  background-size: ${(props) => props.backgroundSize};
  background-position: ${(props) => props.backgroundPosition};
  position: ${(props) => props.position};
  max-width: ${(props) => props.maxWidth};
  color: ${(props) => props.color}  !important ;
  background-color: ${(props) => props.backgroundColor};
  border: ${(props) => props.border};
  box-shadow: ${(props) => props.boxShadow};
  border-radius: ${(props) => props.borderRadius};
  opacity: ${(props) => props.Opacity};
  line-height: ${(props) => props.lineHeight};
  font-weight: ${(props) => props.fontWeight};
  overflow: ${(props) => props.overFlow};
   overflowX: ${(props) => (props.overflowX ? props.overflowX : 'none')};
  overflowY: ${(props) => (props.overflowY ? props.overflowY : 'none')};
  cursor: ${(props) => props.cursor || ''};
  margin-inline-start: ${(props) => props.marginInlineStart || ''};
  margin-block-start: ${(props) => props.marginBlockTop || ''};
`;

/* Custom Scrollbar */
// &::-webkit-scrollbar {
//   width: 8px; /* Width of the scrollbar */
// }

// &::-webkit-scrollbar-track {
//   background: #f0f0f0; /* Track background */
//   border-radius: 4px;
// }

// &::-webkit-scrollbar-thumb {
//   background: #888; /* Scrollbar handle color */
//   border-radius: 4px;
// }

// &::-webkit-scrollbar-thumb:hover {
//   background: #555; /* Darker handle on hover */
// }

export const StyledSpan = styled.span`
  color: red;
  margin-left: 4px;
`;

export const StyledLink = styled.a`
  cursor: pointer;
  text-decoration: none;
  color: inherit;
`;

export const StyledTypography = styled(Typography)`
  font-family: Lato !important;
  text-align: ${(props) => props.textAlign};
  margin-top: ${(props) => props.marginTop};
  margin-bottom: ${(props) => props.marginBottom};
  font-size: ${(props) => props.fontSize};
  font-weight: ${(props) => props.fontWeight};
  color: ${(props) => props.color || '#000000'};
  line-height: ${(props) => props.lineHeight};
  white-space: ${(props) => props.whiteSpace};
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  margin-left: ${(props) => props.marginLeft};
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  padding: ${(props) => props.padding};
  display: ${(props) => props.display};
  align-items: ${(props) => props.alignItems};
  justify-content: ${(props) => props.justifyContent};
  background-color: ${(props) => props.backgroundColor};
  border-radius: ${(props) => props.borderRadius};
  letter-spacing: ${(props) => props.letterSpacing};
  cursor: ${(props) => (props.cursor ? props.cursor : '')};
  transition: ${(props) =>
    props.transition || 'all 0.3s ease'}; // Transition for smooth effects

  &:hover {
    color: ${(props) =>
      props.hoverColor || props.color || '#000000'}; // Change color on hover
    background-color: ${(props) =>
      props.hoverBackgroundColor || props.backgroundColor};
  }
  @media (max-width: 1024px) {
    font-size: ${(props) => reduceFontSize(props.fontSize)} !important;
  }
`;

export const StyledButton = styled(Button)`
  cursor: pointer;
  font-family: Lato !important;
  font-weight: ${(props) => props.fontWeight || 700} !important;
  font-size: ${(props) => props.fontSize || '14px'} !important;
  width: ${(props) => props.width};
  gap: ${(props) => props.gap};
  height: ${(props) => props.height};
  border-radius: ${(props) => props.borderRadius};
  border: ${(props) => props.border};
  background-color: ${(props) => props.backgroundColor || '#0083c0'} !important;
  display: ${(props) => props.display};
  justify-content: ${(props) => props.justifyContent};
  align-items: ${(props) => props.alignItems};
  color: ${(props) => props.colour || '#fff'} !important;
  padding: ${(props) => props.padding} !important;
  margin: ${(props) => props.margin} !important;
  text-transform: ${(props) => props.textTransform || 'none'} !important;
  white-space: ${(props) => props.whiteSpace};
  text-transform: ${(props) => props.textTransform || 'none'} !important;
  gap: ${(props) => props.gap} !important;
  text-align: ${(props) => props.textAlign || 'center'};

  &:hover {
    transform: scale(1.05) !important;
    transition: transform 0.3s ease !important;
    color: ${(props) => props.hoverColor || props.color || '#000000'};
    background-color: ${(props) => props.hoverBackgroundColor || '#f0f0f0'};
  }
  &:disabled {
    opacity: 50%;
    cursor: not-allowed !important;
    pointer-events: auto !important;
  }

  @media (max-width: 1024px) {
    font-size: ${(props) =>
      reduceFontSize(props.fontSize || '14px')} !important;
  }
`;

export const StyledAccordionSummary = styled(AccordionSummary)`
  background-color: ${(props) => props.backgroundColor};
  border-radius: ${(props) => props.borderRadius};
  height: ${(props) => props.height};
  width: ${(props) => props.width};
  border: ${(props) => props.border};
  gap: ${(props) => props.gap};
`;

export const StyledImage = styled.img.attrs((props) => ({
  title: props.tooltip,
}))`
  height: ${(props) => props.height || 'auto'};
  width: ${(props) => props.width || 'auto'};
  gap: ${(props) => props.gap || '0'};
  cursor: ${(props) => props.cursor || 'pointer'};
  border-radius: ${(props) => props.borderRadius || '0'};
  transform: scaleX(${(props) => (props.rtl ? '-1' : '1')});
  margin: ${(props) => props.margin || '0'};
  margin-top: ${(props) => props.margin || '0'};
  margin-top: ${(props) => props.marginTop || '0px'} !important;
  margin-bottom: ${(props) => props.marginBottom || '0px'} !important;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)} !important;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};
  justify-content: ${(props) => props.justifyContent || 'center'};
  &:hover {
    transform: ${(props) =>
      props.animate && !props.disabled ? 'scale(1.2)' : 'none'} !important;
    transition: ${(props) =>
      props.animate && !props.disabled
        ? 'transform 0.3s ease'
        : 'none'} !important;
  }
`;

export const StyledTab = styled(Tab)`
  border-radius: 4px !important;
  border-bottom: 2px solid
    ${(props) => (props.borderColor ? props.borderColor : '#0083c0')} !important;
  background: ${(props) =>
    props.selected
      ? props.customBackgroundcolor || '#205475'
      : '#E8EDEF'} !important;
  color: ${(props) => (props.selected ? '#ffffff' : '#000000')} !important;
  font-family: Lato !important;
  font-size: 18px !important;
  font-weight: 700 !important;
  line-height: 20px !important;
  text-align: center !important;
  padding: 8px, 10px, 8px, 10px !important;
  text-transform: none !important;

  @media (max-width: 1024px) {
    font-size: ${(props) => reduceFontSize('18px')} !important;
  }
`;

export const StyledSearch = styled(TextField)`
  margin-bottom: 16px;
  width: ${(props) => props.width || '250px'} !important;
  height: 40px !important;
  color: #666666 !important;
`;

export const CommonStyledButton = styled(Button)`
  color: ${({ textColor }) => textColor};
  background-color: ${({ backgroundColor }) => backgroundColor};
  disabled: ${({ disabled }) => disabled};
  gap: ${({ gap }) => gap};
  box-shadow: 0px 4px 4px 0px #00000040;
  display: flex;
  align-items: center;
  text-transform: none !important;
  &:hover {
    transform: scale(1.1) !important;
    transition: transform 0.3s ease !important;
  }
`;

export const StyledTextField = styled(TextField)({
  '& .MuiInputBase-input': {
    height: '48px',
    padding: '13px 16px 13px 16px',
    // background: "#F2F3F4",
    // border: "1px solid #E0E0F1",
  },
  '& .MuiInputBase-input::placeholder': {
    height: '48px',
    color: '#444444',
    opacity: 1,
  },
});

export const SuccessMessage = styled.div`
  position: fixed;
  bottom: 55px;
  left: 90%;
  transform: translateX(-94%);
  background-color: ${(props) => (props.show ? props.color : '')};
  color: white;
  padding: 10px 15px;
  border-radius: 4px;
  opacity: ${(props) => (props.show ? 1 : 0)}
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  opacity: ${(props) => (props.show ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
  z-index: 1000;
  white-space: nowrap;
`;
export const FormLabel = styled(Typography)`
  font-weight: 400 !important;
  color: #0083c0;
`;
