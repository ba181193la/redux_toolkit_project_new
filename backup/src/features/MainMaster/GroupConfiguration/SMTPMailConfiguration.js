import React from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  Grid,
} from '@mui/material';
import {
  FlexContainer,
  StyledTypography,
} from '../../../utils/StyledComponents';
import { TextField } from '../../../components/TextField/TextField';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../redux/RTK/moduleDataApi';
import { useSelector } from 'react-redux';
import { getlabel } from '../../../utils/language';
import Label from '../../../components/Label/Label';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import useWindowDimension from '../../../hooks/useWindowDimension';

export default function SMTPMailConfiguration({ isEditable }) {
  const { t, i18n } = useTranslation();
  const { isMobile, isTablet } = useWindowDimension();
  const pagesConfigData = [
    {
      fieldId: 'GC_P_MailHostingAddress',
      translationId: 'MM_GC_MailHostingAddress',
      component: 'TextField',
      name: 'mailHostingServer',
    },
    {
      fieldId: 'GC_P_MailType',
      translationId: 'MM_GC_MailPortNumber',
      component: 'TextField',
      name: 'mailPortNumber',
    },
    {
      fieldId: 'GC_P_EnableSecureSocketLayer',
      translationId: 'MM_GC_EnableSecureSocketLayer',
      component: 'Checkbox',
      name: 'enableSSSL',
    },
    {
      fieldId: 'GC_P_EnableTransportationSecurity',
      translationId: 'MM_GC_EnableTransportationSecurity',
      component: 'Checkbox',
      name: 'enableTLS',
    },
  ];
  const { selectedMenu, selectedModuleId } = useSelector((state) => state.auth);
  const { data: fields = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });
  const pageFields = Array.isArray(fields?.Data?.Sections)
    ? fields?.Data?.Sections?.find((section) => section.SectionName === 'Page')
        ?.Fields || []
    : [];
  const { data: labels = [] } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  const { setFieldValue, values, errors, touched } = useFormikContext();

  return (
    <Accordion
      sx={{
        border: '5px',
        borderColor: '#0083C0',
        marginBottom: '16px',
      }}
    >
      <AccordionSummary
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          backgroundColor: '#0083C0',
          borderRadius: '8px 8px 0px 0px',
          width: '100%',
          border: '1px solid #0083C0',
          gap: isMobile || isTablet ? '16px' : '24px',
        }}
      >
        <StyledTypography
          fontSize={isMobile || isTablet? '14px' : '16px'}
          fontWeight="700"
          lineHeight={isMobile || isTablet ? '18px' : '20px'}
          textAlign="center"
          color="#FFFFFF"
        >
          {t('SMTPMailConfiguration')}
        </StyledTypography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          width: '100%',
          height: '100%',
          padding: isMobile || isTablet ? '0px 0px 10px 0px' : '0px 0px 20px 0px',
          gap: '24px',
          border: '1px solid #0083C0',
        }}
      >
        <FlexContainer
          padding={isMobile || isTablet ? '10px' : '15px'}
          flexDirection="column"
        >
          <Grid
            container
            spacing={isMobile || isTablet ? 4 : 8}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
            }}
          >
            {pageFields?.map((field) => {
              const fieldConfig = pagesConfigData.find(
                (config) => config.fieldId === field.FieldId
              );
              if (field.IsShow && fieldConfig) {
                const translatedLabel = getlabel(
                  fieldConfig?.translationId,
                  labels,
                  i18n.language
                );
                return (
                  <Grid item xs={12} sm={isMobile || isTablet ? 12 : 3} key={field.FieldId}>
                    <FlexContainer
                      alignItems="center"
                      flexDirection={isMobile || isTablet? 'column' : 'row'}
                    >
                      {(fieldConfig?.name === 'mailHostingServer' ||
                        fieldConfig?.name === 'mailPortNumber') && (
                        <Label
                          value={translatedLabel}
                          isRequired={field?.IsMandatory}
                        />
                      )}
                      {fieldConfig?.component === 'TextField' && (
                        <TextField
                          name={fieldConfig?.name}
                          value={values[fieldConfig?.name]}
                          onBlur={() => {}}
                          sx={{
                            marginLeft: isMobile || isTablet? '4px' : '8px',
                          }}
                          disabled={!isEditable}
                          onChange={(e) =>
                            setFieldValue(fieldConfig.name, e.target.value)
                          }
                        />
                      )}
                      {fieldConfig?.component === 'Checkbox' && (
                        <>
                          <Checkbox
                            name={fieldConfig?.name}
                            checked={values[fieldConfig?.name]}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFieldValue(fieldConfig.name, checked);
                            }}
                            sx={{
                              padding: '0px 9px',
                              marginLeft: isMobile || isTablet? '4px' : '8px',
                            }}
                            disabled={!isEditable}
                          />
                          <Label
                            value={translatedLabel}
                            isRequired={field?.isMandatory}
                          />
                        </>
                      )}
                    </FlexContainer>
                    {errors[fieldConfig.name] && touched[fieldConfig.name] && (
                      <div style={{ color: 'red', fontSize: '11px' }}>
                        {errors[fieldConfig.name]}
                      </div>
                    )}
                  </Grid>
                );
              }
              return null;
            })}
          </Grid>
        </FlexContainer>
      </AccordionDetails>
    </Accordion>
  );
}
