import styled from 'styled-components';
import { media } from '../../utils/Breakpoints';

export const HeaderContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 70px;
  padding: 0 15px;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px 2px 4px 0px #00000026;
  position: sticky;
  top: 0;
  background-color:${(props)=>props.backgroundColor?props.backgroundColor:"#fff"};
  z-index: 1000;

  ${media.screen.xSmall`
    padding: 0 25px;
    `}
`;