import React, { useEffect } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
} from '@mui/material';
import {
  FlexContainer,
  StyledTypography,
} from '../../../utils/StyledComponents';
import Label from '../../../components/Label/Label';
import { TextField } from '../../../components/TextField/TextField';
import { useSelector } from 'react-redux';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../utils/language';
import i18n from '../../../i18n/i18n';
import { useTranslation } from 'react-i18next';
import { useFormikContext } from 'formik';
import useWindowDimension from '../../../hooks/useWindowDimension';

export default function AzureGraphAPIConfiguration({
  pageLoadData,
  isEditable,
  isReset,
}) {
  const { t } = useTranslation();
  const { isMobile } = useWindowDimension();

  const { values, handleChange, handleBlur, resetForm, errors, touched } =
    useFormikContext();

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

  const pagesConfigData = [
    {
      fieldId: 'GC_P_ClientID',
      translationId: 'MM_GC_ClientID',
      component: 'TextField',
      name: 'clientID',
    },
    {
      fieldId: 'GC_P_TenantID',
      translationId: 'MM_GC_TenantID',
      component: 'TextField',
      name: 'applicationID',
    },
    {
      fieldId: 'GC_P_ClientSecret',
      translationId: 'MM_GC_ClientSecret',
      component: 'TextField',
      name: 'clientSecret',
    },
  ];

  useEffect(() => {
    if (isReset) {
      resetForm();
    }
  }, [isReset]);

  return (
    <Accordion
      sx={{ border: '5px', borderColor: '#0083C0', marginBottom: '16px' }}
    >
      <AccordionSummary
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          backgroundColor: '#0083C0',
          borderRadius: '8px 8px 0px 0px',
          width: '100%',
          border: '1px solid #0083C0',
          gap: '24px',
        }}
      >
        <StyledTypography
          fontSize="16px"
          fontWeight="700"
          lineHeight="20px"
          textAlign="center"
          color="#FFFFFF"
        >
          {t('AzureGraphAPIConfiguration')}
        </StyledTypography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          width: '100%',
          height: '100%',
          padding: '0px 0px 20px 0px',
          gap: '24px',
          border: '1px solid #0083C0',
        }}
      >
        <FlexContainer padding="15px">
          <Grid
            container
            spacing={8}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
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
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    key={fieldConfig?.fieldId}
                    sx={{ width: '100%' }}
                  >
                    <FlexContainer
                      alignItems="center"
                      flexDirection={isMobile ? 'column' : 'row'}
                    >
                      <Label
                        value={translatedLabel}
                        isRequired={field?.IsMandatory}
                      />
                      <TextField
                        name={fieldConfig?.name}
                        value={values[fieldConfig?.name]}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        sx={{ marginLeft: '8px' }}
                        disabled={!isEditable}
                      />
                    </FlexContainer>
                    {errors[fieldConfig.name] && touched[fieldConfig.name] && (
                      <div
                        style={{
                          color: 'red',
                          fontSize: '11px',
                          marginLeft: '60px',
                        }}
                      >
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
