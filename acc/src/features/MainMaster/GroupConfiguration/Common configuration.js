import React from 'react';
import { Form, useFormikContext } from 'formik';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Checkbox,
  Typography,
} from '@mui/material';
import {
  FlexContainer,
  StyledTypography,
} from '../../../utils/StyledComponents';
import Label from '../../../components/Label/Label';
import { TextField as CustomTextField } from '../../../components/TextField/TextField';
import { useSelector } from 'react-redux';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../utils/language';
import { useTranslation } from 'react-i18next';
import Dropdown from '../../../components/Dropdown/Dropdown';
import useWindowDimension from '../../../hooks/useWindowDimension';
import SearchDropdown from '../../../components/SearchDropdown/SearchDropdown';
import { useDispatch } from 'react-redux';
import { setMailType } from '../../../redux/features/mainMaster/groupConfigSlice';

export default function CommonConfiguration({ pageLoadData, isEditable }) {
  const { t, i18n } = useTranslation();
  const { isMobile } = useWindowDimension();
  const dispatch = useDispatch();
  const { setFieldValue, values, errors, touched } = useFormikContext();
  dispatch(setMailType(values?.mailType))
  const pagesConfigData = [
    {
      fieldId: 'GC_P_SessionIdleTime',
      translationId: 'MM_GC_SessionIdleTime',
      component: 'TextField',
      name: 'sessionIdleTime',
    },
    {
      fieldId: 'GC_P_MailType',
      translationId: 'MM_GC_MailType',
      component: 'Dropdown',
      name: 'mailType',
      options: pageLoadData?.Data?.MailTypeList?.map((mailType) => ({
        text: mailType.MailType,
        value: mailType.MailType,
      })),
    },
    {
      fieldId: 'GC_P_EnableSameEmailinStaffMasterEntry',
      translationId: 'MM_GC_EnableSameEmailinStaffMasterEntry',
      component: 'Checkbox',
      name: 'emailInStaffMasterEntry',
    },
    {
      fieldId: 'GC_P_EnableStaffDemographicToAllStaff',
      translationId: 'MM_GC_EnableStaffDemographicToAllStaff',
      component: 'Checkbox',
      name: 'staffDemographic',
    },
    {
      fieldId: 'GC_P_EnableGroupSpecificSMTPMailConfiguration',
      translationId: 'MM_GC_EnableGroupSpecificSMTPMailConfiguration',
      component: 'Checkbox',
      name: 'isGroupwiseMailConfig',
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
          gap: isMobile ? '16px' : '24px',
        }}
      >
        <StyledTypography
          fontSize={isMobile ? '14px' : '16px'}
          fontWeight="700"
          lineHeight="20px"
          textAlign="center"
          color="#FFFFFF"
        >
          {t('CommonConfigurationMainMaster')}
        </StyledTypography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          width: '100%',
          height: '100%',
          gap: '24px',
          border: '1px solid #0083C0',
        }}
      >
        <Form noValidate autoComplete="off">
          <Grid
            container
            spacing={isMobile ? 2 : 4}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
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
                  <Grid
                    item
                    xs={12}
                    sm={isMobile ? 12 : 6}
                    md={isMobile ? 12 : 4}
                    key={field.fieldId}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      marginBottom: isMobile ? '10px' : '20px',
                    }}
                  >
                    <FlexContainer
                      alignItems="center"
                      gap="8px"
                      flexWrap={isMobile ? 'wrap' : 'nowrap'}
                      justifyContent={isMobile ? 'center' : 'flex-start'}
                    >
                      {(fieldConfig?.name === 'sessionIdleTime' ||
                        fieldConfig?.name === 'mailType') && (
                        <Label
                          value={translatedLabel}
                          required={field?.IsMandatory}
                        />
                      )}
                      {fieldConfig?.component === 'TextField' && (
                        <>
                          <CustomTextField
                            name={fieldConfig?.name}
                            value={values[fieldConfig?.name]}
                            onChange={(e) => {
                              setFieldValue(fieldConfig?.name, e.target.value);
                            }}
                            onBlur={() =>
                              setFieldValue(
                                fieldConfig?.name,
                                values[fieldConfig?.name]
                              )
                            }
                            disabled={!isEditable}
                            width={isMobile ? '100%' : '80%'}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              marginLeft: '8px',
                              fontSize: '10px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            In Minutes
                          </Typography>
                        </>
                      )}

                      {fieldConfig?.component === 'Dropdown' && (
                        // <Dropdown
                        //   name={fieldConfig?.name}
                        //   options={fieldConfig?.options}
                        //   onChange={(e) => {
                        //     setFieldValue(fieldConfig?.name, e.target.value);
                        //   }}
                        //   disabled={!isEditable}
                        //   sx={{ width: isMobile ? '100%' : '80%' }}
                        // />
                        <div style={{ width: '200px' }}>
                          <SearchDropdown
                            disableClearable={true}
                            name={fieldConfig?.name}
                            disabled={!isEditable}
                            options={[
                              { text: 'Select', value: '' },
                              ...(fieldConfig.options || []),
                            ]}
                            getOptionLabel={(option) => option.text}
                            dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
                            sx={{
                              '& .MuiAutocomplete-inputRoot': {
                                fontSize: '13px',
                                height: '100%',
                              },
                              '& .MuiOutlinedInput-root': {
                                height: '34px',
                                '& .MuiAutocomplete-input': {
                                  height: '34px',
                                  fontSize: '13px',
                                },
                              },
                            }}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Select"
                                width={isMobile ? '100%' : '80%'}
                              />
                            )}
                            ListboxProps={{
                              sx: {
                                '& .MuiAutocomplete-option': {
                                  fontSize: '14px',
                                  minHeight: '30px',
                                  display: 'flex',
                                  alignItems: 'center',
                                },
                              },
                            }}
                            value={
                              fieldConfig?.options?.find(
                                (option) =>
                                  option.value === values[fieldConfig.name]
                              ) || null
                            }
                            onChange={(event, value) => {
                              setFieldValue(fieldConfig?.name, value?.value);
                            }}
                          />
                        </div>
                      )}
                      {fieldConfig?.component === 'Checkbox' && (
                        <>
                          <Checkbox
                            name={fieldConfig?.name}
                            checked={
                              values[fieldConfig.name] !== undefined
                                ? values[fieldConfig.name]
                                : false
                            }
                            onChange={(e) => {
                              setFieldValue(
                                fieldConfig?.name,
                                e.target.checked
                              );
                            }}
                            disabled={!isEditable}
                            sx={{
                              padding: '0px 9px',
                              marginLeft: isMobile ? '4px' : '8px',
                            }}
                          />
                          <Label
                            value={translatedLabel}
                            isRequired={field?.IsMandatory}
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
        </Form>
      </AccordionDetails>
    </Accordion>
  );
}
