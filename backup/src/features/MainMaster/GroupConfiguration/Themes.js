
import React, { useCallback, useEffect, useState } from 'react';
import { SketchPicker } from "react-color";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Box,
  Typography,
  Tooltip,
  Button
} from '@mui/material';
import {
  FlexContainer,
  StyledImage,
  StyledTypography,
  StyledButton

} from '../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import { useSelector } from 'react-redux'
import TickMarkIcon from '../../../assets/Icons/TickMarkIcon.png';
import useWindowDimension from '../../../hooks/useWindowDimension';

export default function Themes({ isEditable }) {
  const { t } = useTranslation();
  const { values, setFieldValue } = useFormikContext();
  const { isMobile } = useWindowDimension();
  const { groupConfigData } = useSelector((state) => state.groupConfig);
  const [color, setColor] = useState(''); // Main color state
  const [isChangeColor, setIsChangeColor] = useState(false)
  const [componetName, setComponetName] = useState('SIDEBAR')

  useEffect(() => {
    setFieldValue('headerSkinColor', groupConfigData?.headerSkinColor);
    setFieldValue('sidebarSkinColor', groupConfigData?.sidebarSkinColor);
    setColor(groupConfigData?.sidebarSkinColor)
  }, [groupConfigData]);



  const renderColorOptions = (color, selectedColor) => {
    return (


      <FlexContainer
        width={isMobile ? '25px' : '30px'}
        height={isMobile ? '25px' : '30px'}
        borderRadius="50%"
        alignItems="center"
        justifyContent="center"
        position="relative"
        style={{
          marginBottom: "25px",
          backgroundColor: color,
          border: color === '#ffffff' ? '1px solid #ccc' : 'none',
          transform: selectedColor === color ? 'scale(1.2)' : 'scale(1)',
          transition: 'transform 0.3s ease',
        }}
      >
        {selectedColor === color && (
          <span
            style={{
              color: color === '#ffffff' ? '#000' : '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
              position: 'absolute',
            }}
          >
            <StyledImage
              src={TickMarkIcon}
              alt="TickMarkIcon"
              width="12px"
              height="12px"
            />
          </span>
        )}
      </FlexContainer>

    );
  };

  const handleChange = (coponentName) => {
    setIsChangeColor(true)
    setComponetName(coponentName)
    setColor(groupConfigData?.headerSkinColor)
  }
  const handleThemeColorChange = useCallback((newColor) => {
    if (componetName === "SIDEBAR") {
      setFieldValue("sidebarSkinColor", newColor.hex);
      setColor(newColor.hex)
    } else if (componetName === "HEADER") {
      setFieldValue("headerSkinColor", newColor.hex);
      setColor(newColor.hex)
    }
  }, [componetName, setFieldValue]);

  return (
    <Accordion sx={{ marginBottom: '16px' }}>
      <AccordionSummary
        aria-controls="panel2-content"
        id="panel2-header"
        sx={{
          backgroundColor: '#0083C0',
          borderRadius: '8px 8px 0 0',
          width: '100%',
          border: '1px solid #0083C0',
          gap: '24px',
        }}
      >
        <StyledTypography
          fontSize={isMobile ? '14px' : '16px'}
          fontWeight="700"
          lineHeight={isMobile ? '18px' : '20px'}
          textAlign={isMobile ? 'center' : 'center'}
          color="#FFFFFF"
          margin={isMobile ? '0 0 0 59px' : "0"}
        >
          {t('Themes')}
        </StyledTypography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: isMobile ? '12px' : '20px',
          border: '1px solid #0083C0',
          backgroundColor: '#F8FAFC',
          opacity: isEditable ? 1 : 0.5,
          pointerEvents: isEditable ? 'auto' : 'none',
        }}
      >

        <FlexContainer
          display="flex"
          width="100%"
          flexDirection={isMobile ? 'column' : 'row'}
          gap={isMobile ? '16px' : '24px'}
          flexWrap={isMobile ? 'wrap' : 'nowrap'}
          sx={{
            padding: isMobile ? '8px' : '16px', // Adjust padding based on screen size
          }}
        >
          {/* Left Section */}
          <FlexContainer
            display="flex"
            justifyContent="flex-start"
            width={isMobile ? '100%' : '400px'} // Use 100% width on mobile
          >
            <FlexContainer flexDirection="column" gap="16px">
              {/* HEADER SKINS */}
              <FlexContainer flexDirection="column">
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: '8px', color: '#333' }}>
                  {t("HeaderSkins")}
                </Typography>

                {/* HEADER BUTTONS */}
                <FlexContainer flexDirection="column">
                  {renderColorOptions(values.headerSkinColor, values.headerSkinColor, "headerSkinColor", "header")}

                  <FlexContainer display="flex" gap="6px">
                    <StyledButton
                      sx={{
                        borderRadius: '4px',
                        backgroundColor: '#0083C0',
                        color: '#fff',
                      }}
                      onClick={() => handleChange("HEADER")}
                    >
                      {t('ChooseColor')}
                    </StyledButton>

                    <StyledButton
                      sx={{ borderRadius: '4px', backgroundColor: '#0083C0', color: '#fff' }}
                      onClick={() => {
                        setColor('#ffffff');
                        setComponetName("HEADER")
                        setFieldValue('headerSkinColor', '#ffffff');
                        setIsChangeColor(false);
                      }}
                    >
                      {t('SetDefaultTheme')}
                    </StyledButton>
                  </FlexContainer>
                </FlexContainer>
              </FlexContainer>

              {/* SIDEBAR SKINS */}
              <FlexContainer flexDirection="column">
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: '8px', color: '#333' }}>
                  {t("SidebarSkins")}
                </Typography>

                {/* SIDEBAR BUTTONS */}
                <FlexContainer flexDirection="column">
                  {renderColorOptions(values.sidebarSkinColor, values.sidebarSkinColor, "sidebarSkinColor", "sidebar")}

                  <FlexContainer display="flex" gap="6px">
                    <StyledButton
                      sx={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        backgroundColor: '#0083C0',
                        color: '#fff',
                      }}
                      onClick={() => handleChange("SIDEBAR")}
                    >
                      {t('ChooseColor')}
                    </StyledButton>

                    <StyledButton
                      sx={{
                        padding: '6px 12px',
                        borderRadius: '4px',
                        backgroundColor: '#0083C0',
                        color: '#fff',
                      }}
                      onClick={() => {
                        setColor('#0083c0');
                        setComponetName("SIDEBAR")
                        setFieldValue('sidebarSkinColor', '#0083c0');
                        setIsChangeColor(false);
                      }}
                    >
                      {t('SetDefaultTheme')}
                    </StyledButton>
                  </FlexContainer>
                </FlexContainer>
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>

          {/* Right Section */}
          <FlexContainer
            display="flex"
            justifyContent="center"
            alignItems="center"
            width={isMobile ? '100%' : '550px'} // Use 100% width on mobile
            Opacity={isChangeColor ? 1 : 0.5}
            sx={{
              // opacity: isChangeColor ? 0.5 : 0.5,
              padding: '8px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            }}
          >
            <FlexContainer flexDirection="column" gap="16px">
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: '12px', color: '#333' }}>
                {componetName === 'SIDEBAR' ? t('SidebarSkins') : t('HeaderSkins')}
              </Typography>

              <SketchPicker
                color={color}
                onChange={(newColor) => {
                  if (isChangeColor) {
                    handleThemeColorChange(newColor);
                  }
                }}
              />

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: '12px', color: color }}>
                {t('ColorCode')}: {color}
              </Typography>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </AccordionDetails>
    </Accordion>
  );
}
