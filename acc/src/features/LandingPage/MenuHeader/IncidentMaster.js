import React, { useEffect, useState } from 'react'
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import {
    setSelectedMenu,
    setSelectedModuleId,
} from '../../../redux/features/auth/authSlice';
import { FlexContainer, StyledTypography, StyledImage } from '../../../utils/StyledComponents';
import IncidentApproval from '../../../assets/Icons/incident-approval.png';
import WhiteSearch from '../../../assets/Icons/SearchWhite.png';
import IncidentInvestigationApproval from '../../../assets/Icons/incident-investigation-approval.png';
import Options from '../../../assets/Icons/opinion.png';
import IncidentClosure from '../../../assets/Icons/incident-closure.png';
import Actions from '../../../assets/Icons/actions.png';
import ActionApproval from '../../../assets/Icons/action-approval.png';
import RootCauseAnalysis from '../../../assets/Icons/root-cause-analysis.png';
import useWindowDimension from '../../../hooks/useWindowDimension';
import Investication from '../../../assets/Icons/investication.png';

import styled from 'styled-components';

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


let incidentMenuList = [
    {
        "MenuId": 26,
        "MenuName": "Incident Approval",
        "moduleId": 2,
        icon: IncidentApproval,
        color: '#575b85',
    },
    {
        "MenuId": 27,
        "MenuName": "Incident Investigation",
        "moduleId": 2,
        icon: Investication,

        color: '#dc5182',
    },
    {
        "MenuId": 28,
        "MenuName": "Opinions",
        "ModuleId": 2,
        icon: Options,
        color: '#ff9800'
    },
    {
        "MenuId": 29,
        "MenuName": "Incident Investigation Approval",
        "ModuleId": 2,
        icon: IncidentInvestigationApproval,
        color: '#0e6b24',
    },

    {
        "MenuId": 30,
        "MenuName": "Incident Closure",
        "ModuleId": 2,
        icon: IncidentClosure,
        color: '#ba68c8',
    },
    {
        "MenuId": 31,
        "MenuName": "Root Cause Analysis",
        "ModuleId": 2,
        icon: RootCauseAnalysis,
        color: '#ff6361',
    },
    {
        "MenuId": 32,
        "MenuName": "Actions",
        "ModuleId": 2,
        icon: Actions,
        color: '#5d4037'
    },
    {
        "MenuId": 32,
        "MenuName": 'Action Approval',
        "ModuleId": 2,
        icon: ActionApproval,
        color: '#00acc1',
    }
]



function IncidentMaster({ incidentMangement }) {
    const { t } = useTranslation();
    const dispatch = useDispatch()
    const { isMobile } = useWindowDimension();
    const [incidentMenu, setIncidentMenu] = useState(incidentMenuList)
    useEffect(() => {
        if (incidentMangement?.length > 0) {
            const incidentData = incidentMenu?.length > 0 && incidentMenu.filter(incident =>
                incidentMangement.some(data => data.MenuId === incident.MenuId)
            ).map((item) => {
                let matchData = incidentMangement.find(details => details.MenuId === item.MenuId)
                return {
                    ...item,
                    TranslationId: matchData.TranslationId,
                    MenuLink: matchData.MenuLink,
                    NoOfRecords: matchData.NoOfRecords
                }
            })
            setIncidentMenu(incidentData)
        }
    }, [incidentMangement])

    return (
        <FlexContainer
            width="100%"
            minHeight="100px"
            display="flex"
            flexWrap="wrap"
            padding="10px 0px"
            justifyContent="flex-start"
            gap="15px"
        >
            {incidentMenu?.map((menuItemStatus, index) => (                
                <StyledFlexContainer
                    style={{
                        display: 'flex',
                        backgroundColor: menuItemStatus?.color,
                        borderRadius: '8px',
                        overflow: 'hidden',
                       cursor:"pointer"
                    }}
                    onClick={() =>{
                        dispatch( setSelectedMenu({ id: menuItemStatus?.MenuId, name: menuItemStatus?.MenuName }) )
                        dispatch(setSelectedModuleId(menuItemStatus?.moduleId));
                         window.open(menuItemStatus.MenuLink, '_blank')
                      } }
                >
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
                        <div style={{ fontSize: '18px',textAlign:'center' }}>{menuItemStatus.NoOfRecords}</div>
                        <div style={{ fontWeight: 'bold', fontSize:isMobile? '12px':"16px", textAlign:'center' }}>{t(menuItemStatus.TranslationId)}</div>
                    </div>
                    <div
                        style={{
                            backgroundColor: menuItemStatus?.color,
                            flex: '1',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '100%',
                        }}
                    >
                        <StyledImage
                            src={menuItemStatus.icon}
                            alt="New Decorative"
                            width={'40px'}
                            style={{
                                padding:'5px',
                                borderRadius: '50%',                          
                                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Soft shadow effect
                            }}
                        />
                    </div>
                  
                </StyledFlexContainer>
            ))}
        </FlexContainer>

        // <FlexContainer
        //     gap="10px"
        //     padding="20px 0 33px 0"
        //     flexWrap="wrap"
        //     justifyContent="center"
        //     overflow="auto"
        //     alignItems="center"
        // >
        //     <Grid
        //         container
        //         spacing={2}
        //         overflow="auto"
        //         justifyContent="flex-start"
        //     >
        //         {incidentMenu?.map((status, index) => 
        //             <Grid key={index} item xs={12} sm={6} md={6} lg={4}>
        //                 <StatusBox
        //                 status={status}
        //                     label={t(status.TranslationId)}
        //                     bgColor={status.color}
        //                     icon={status.icon}
        //                     MenuLink={status.MenuLink}
        //                     count={status.NoOfRecords}
        //                 />
        //             </Grid>
        //         )}
        //     </Grid>
        // </FlexContainer>
    )
}

export default IncidentMaster