import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import {
    FlexContainer,
    StyledImage,
    StyledTypography,
} from '../../../utils/StyledComponents';
import useWindowDimension from '../../../hooks/useWindowDimension';

function MenuHeader({ changeMenuHeader, handleChangeMenuHeader, setChangeMenuHeader }) {
    const { isMobile } = useWindowDimension();
    const { t } = useTranslation();
    const [activeLabel, setActiveLabel] = useState('IncidentManagement'); // Track the active button
    return (
        <FlexContainer
            width="100%"
            minHeight="50px"
            backgroundColor="#fff"
            display="flex"
            flexWrap="wrap"
            gap="10px"
            style={{
                borderBottom: "2px solid black",
            }}
        >
            {[
                'IncidentManagement',
                // 'MainMaster',
                // 'Clinical Privileges',
                // 'Document Library',
                // 'Document Manager',
                // 'Training',
                // 'User Manual',
            ]
                .map((label, index) => {
                    const isActive = activeLabel === label;
                    return (
                        <StyledTypography
                            color={isActive ? "#1474B9" : "#8D8A8A"}
                            padding="0px 20px"
                            as="button"
                            key={index}
                            transition="all 0.3s ease"
                            hoverColor="#1474B9"
                            hoverBackgroundColor="#f0f8ff"
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                border: "none",
                                background: "transparent",
                                // position: "relative",
                                fontSize: "20px"
                            }}
                            onClick={() => {
                                setActiveLabel(label); // Set active state
                                setChangeMenuHeader(label)
                                handleChangeMenuHeader(label)
                            }}
                        >
                            {t(label)}
                           
                        </StyledTypography>
                    )
                })}
        </FlexContainer>
)}

export default MenuHeader   