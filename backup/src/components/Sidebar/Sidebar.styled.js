import styled from 'styled-components';
import { ListItemButton } from '@mui/material';

export const CustomListItem = styled(ListItemButton)`
  height: 40px;
  padding: 0 !important;
`;

export const SidebarContainer = styled.div`
  width: ${(props) =>
    props.isSidebarCollapsed ? (props.isMobile ? '50px' : '80px') : '280px'};
  transition: width 0.3s;
  z-index: 1;
  box-shadow: 2px 0px 8px 0px rgba(0, 0, 0, 0.15);
  background-color:${(props)=>props.sidebarSkinColor?props.sidebarSkinColor:"#0083c0"};
`;
  // background-color: #0083c0;
export const SidebarIcon = styled.img`
  height: 20px;
  width: 20px;
  margin-inline-end: 10px;
  cursor: pointer;
  &:hover {
    transform: scale(1.2) !important;
    transition: transform 0.3s ease !important;
  }
`;

export const SelectedTabHighlight = styled.div`
  background: ${(props) => (props.ishighlighted ? `${props.sidebarSkinColor?props.sidebarSkinColor:'rgba(0, 131, 192, 1)'}` : '')};
  height: 24px;
  width: 4px;
  margin-inline-end: 10px;
`;

export const VerticalLine = styled.div`
  width: 3px;
  height: 100%;
  background: ${(props) => (props.isLinkSelected ? '#fff' : '#99CDE6')};
`;

export const DotTextWrapper = styled.div`
  display: flex;
  align-items: center;
  background: ${(props) => (props.isLinkSelected ? (props.sidebarSkinColor?props.sidebarSkinColor:'#fff') : '')};
  box-sizing: border-box !important;
  height: 40px;
  width: 100%;
  padding: 12px 10px 12px 10px;
  gap: 8px;
  border-radius: 4px;
  margin-inline-start: 20px;
`;

export const DotSymbol = styled.div`
  width: 6px;
  height: 6px;
  background: ${(props) =>
    props.isLinkSelected ? 'rgba(0, 131, 192, 1)' : '#fff'};
  border-radius: 50%;
  margin-right: 8px;
`;

export const ArrowSymbol = styled.div`
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: ${(props) =>
    props.isLinkSelected ? `6px solid ${props.sidebarSkinColor?props.sidebarSkinColor:'rgba(0, 131, 192, 1)'}` : '6px solid #fff'};
  margin-right: 8px;
`;
