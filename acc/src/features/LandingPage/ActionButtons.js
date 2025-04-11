import { Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {  useNavigate } from 'react-router-dom';

import GoToIcon from '../../assets/Icons/doubleArrow.png';
import { FlexContainer, StyledImage ,StyledTypography} from '../../utils/StyledComponents';
import useWindowDimension from '../../hooks/useWindowDimension';
import {
  setSelectedMenu,
  setSelectedModuleId,
} from '../../redux/features/auth/authSlice';
const ActionButtons = () => {
  const { isMobile } = useWindowDimension();
  const navigate=useNavigate()
  const dispatch = useDispatch()
  const {
    menuListFavourites
  } = useSelector((state) => state.landingPage);   
  return (
    <FlexContainer
    height={menuListFavourites?.length>4? "270px":"150px"}
    width={isMobile?"100%":"70%"}
    display="flex"
    flexWrap="wrap"
    padding="15px"
    gap= {isMobile?"7px":"15px"} 
    justifyContent="flex-start"
    style={{
      overflowY: 'auto',
    }}
  
  >
  {menuListFavourites?.length > 0 ? menuListFavourites.map((menuItem, index) => (
    <StyledTypography
    backgroundColor="#FAFAFA"
      key={index}
      width={isMobile ? "100%" : "45%"}
      borderRadius={"10px 10px 10px 10px"}
      // minHeight={isMobile?"50px":"50px"}
      height={isMobile?"65px": "50px"}
      padding= {isMobile?"5px 15px":"10px 15px"} 
      textAlign="left"
      cursor="pointer"
    //   sx={{ 
    //     display: "flex",     
    //      cursor:"pointer",
    //     alignItems: "center",
    //     justifyContent: "space-between",
    //     color:"#0083c0",
    //     transition: "border-bottom 0.3s ease-in-out", // Smooth effect
    //     "&:hover": {
    //   borderBottom: "2px solid #0083c0",
    //   boxShadow:"0px 2px 0px 0px rgb(32, 84, 117)"
    // }
    // }}
    sx={{ 
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      color: "#0083c0",
      position: "relative",
      transition: "color 0.3s ease-in-out",
      "&:hover": {
        color: "#005A80",
      },
      "&::after": {
        content: '""',
        position: "absolute",
        bottom: "0px",
        left: "0",
        width: "0%",
        height: "2px",
        backgroundColor: "#0083c0",
        transition: "width 0.3s ease-in-out",
      },
      "&:hover::after": {
        width: "100%",
      }
    }}
//     sx={{ 
//   display: "flex",     
//   cursor: "pointer",
//   alignItems: "center",
//   justifyContent: "space-between",
//   color: "#0083c0",
//   position: "relative",
//   "&::after": {
//     content: '""',
//     position: "absolute",
//     bottom: 0,
//     left: 0,
//     width: "0%",
//     height: "2px",
//     backgroundColor: "#0083c0",
//     transition: "width 0.3s ease-in-out",
//   },
//   "&:hover::after": {
//     width: "100%",
//   },
//   // "&:hover": {
//   //   boxShadow: "0px 1px 0px 0px rgb(32, 84, 117)", // Reduced shadow
//   // }
// }}

      
      onClick={()=>{ 
        dispatch( setSelectedMenu({ id: menuItem?.MenuId, name: menuItem?.MenuName }) )
        dispatch(setSelectedModuleId(menuItem?.ModuleId));
        window.open(menuItem?.MenuLink, '_blank')
      }
       }>
      {menuItem?.MenuName}
      <StyledImage
        height={isMobile ? "16px" : "18px"}
        width={isMobile ? "16px" : "18px"}
        src={GoToIcon}
        alt="Go to icon"
      />
    </StyledTypography>
  ))
    : ""}
  </FlexContainer>
   
   
   // <FlexContainer
    //   flexDirection="column"
    //   flexWrap="wrap"
    //   justifyContent="flex-start"
    //   alignItems="center"
    //   width={isMobile ? '100%' : '50%'}
    //   padding={isMobile ? '10px' : '20px'}
    //   gap="20px"
    //   borderRadius="8px"
     
    // >
      
    //   {menuListFavourites?.length > 0? menuListFavourites.map(
    //     (menuItem, index) => (
    //       <FlexContainer key={index} width="100%">
    //         <Button
    //           variant="outlined"
    //           onClick={()=>{ 
    //             dispatch( setSelectedMenu({ id: menuItem?.MenuId, name: menuItem?.MenuName }) )
    //             dispatch(setSelectedModuleId(menuItem?.ModuleId));
    //             window.open(menuItem?.MenuLink, '_blank')
    //           }
    //            }
               
    //           sx={{
    //             padding: isMobile ? '8px' : '10px',
    //             fontSize: isMobile ? '14px' : '16px',
    //             backgroundColor: '#EAF7FF',
    //             color: '#0083C0',
    //             border: 'none',
    //             '&:hover': {
    //               backgroundColor: '#CCE5FF',
    //             },
    //             width: '100%',
    //             boxSizing: 'border-box',
    //             textAlign: 'left',
    //             whiteSpace: 'nowrap',
    //             display: 'flex',
    //             justifyContent: 'space-between',
    //             alignItems: 'center',
    //           }}
    //           endIcon={
    //             <StyledImage
    //               height={isMobile ? '16px' : '18px'}
    //               width={isMobile ? '16px' : '18px'}
    //               src={GoToIcon}
    //               alt="Go to icon"
    //             />
    //           }
    //         >
    //           {menuItem?.MenuName}
    //         </Button>
    //       </FlexContainer>
    //     )
    //   ):""}
    // </FlexContainer>

  );
};

export default ActionButtons;
