import React, { useEffect, useState } from 'react';
import { Grid, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Formik, Form, Field, useFormikContext } from 'formik';

import {
  FlexContainer,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { FormLabel, ReadOnlyText } from '../StyledComponents';
import TextArea from '../../../../components/TextArea/TextArea';
import { getlabel } from '../../../../utils/IncidentLabels';
import { useGetIncidentOpinionPendingByIdQuery } from '../../../../redux/RTK/IncidentOinionApi';
import * as Yup from 'yup';

function OpinionRequest({ searchFields, pagesConfigData, searchLabels, id, OpinionRequests }) {
  const { t, i18n } = useTranslation();
  const { values, handleChange, setFieldValue, errors, touched } =
    useFormikContext();

  useEffect(() => {
    if (OpinionRequests?.Data) {
      // Ensure OpinionRequest and Data exist
      const {
        DepartmentName,
        DesignationName,
        EmployeeName,
        EmployeeID,
        WebsiteURL,
        ContactPersonName,
        Comments,
        OpinionNo,
        RequestedDate,
        Response,
      } = OpinionRequests.Data;

      const dateStr = RequestedDate;
      const date = new Date(dateStr);
      const formattedDate =
        date.getDate().toString().padStart(2, '0') +
        '-' +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        date.getFullYear();

      setFieldValue('opinionId', OpinionNo || '');
      setFieldValue('requestedDate', formattedDate || '');
      setFieldValue('Comments', Comments || ''); 
      setFieldValue('EmployeeId', EmployeeID || '');
      setFieldValue('EmployeeName', EmployeeName || '');
      setFieldValue('department', DepartmentName || '');
      setFieldValue('response', Response || '');
    }
  }, [OpinionRequests, setFieldValue]);

  // const responseValidationSchema = Yup.object({
  //   Response: Yup.string()
  //     .required('Response is required')
  //     .min(10, 'Response must be at least 10 characters'),
  // });

  return (
    <FlexContainer flexDirection="column">
      {/* Section Header */}
      <StyledTypography
        variant="h5"
        fontWeight="bold"
        sx={{ marginBottom: '20px' }}
      >
        {t('OpinionRequested')}
      </StyledTypography>

      {/* Grid for Details */}
      <Grid container spacing={2} p={2}>
        {searchFields?.map((field) => {
          const fieldConfig = pagesConfigData?.find(
            (config) => config.fieldId === field.FieldId
          );
          const translatedLabel = getlabel(
            fieldConfig?.translationId,
            searchLabels,
            i18n.language
          );

          if (field.IsShow && fieldConfig) {
            return (
              <Grid item xs={fieldConfig.component === 'TextArea' ? 12 : 4} key={field.FieldId}>
                <FormLabel>{translatedLabel}</FormLabel>
                {fieldConfig.component === 'ReadOnlyText' && (
                  <ReadOnlyText>{values[fieldConfig.name] || ''}</ReadOnlyText>
                )}
                {fieldConfig.component === 'TextArea' && (
                  <>
                    {/* <Field
                          as={TextArea}
                          name={fieldConfig.name}
                          // onChange={handleChange}
                          // name={"Response"}
                          sx={{
                            width: '100%',
                            height: '100px',
                            padding: '10px',
                            maxWidth: '200px',
                          }}
                        /> */}
                    <FlexContainer
                      position="relative"
                      width="100%"
                      display="flex"
                      flexGrow={1} // Allows full expansion
                      flexDirection="column" // Ensures it aligns properly
                      alignItems="stretch" // Makes child elements stretch
                      justifyContent="center"
                      margin="0 auto"
                    >
                      {/* <TextArea
                       sx={{
                        // width: '100%',  // Makes it take full width of the parent container
                        padding: '10px',
                        maxWidth: '1000px', // Increase max width to match the sample
                        
                      }}
                        name={fieldConfig.name}
                        value={values[fieldConfig.name] || ''}
                        onChange={handleChange}
                      /> */}
                      <Field
    name={fieldConfig.name}
    as={TextField}
    fullWidth
    variant="outlined"
    multiline
    rows={4}
    value={values[fieldConfig.name] || ''}
    onChange={handleChange}
    sx={{
      width: '100%', // Ensures it takes full width
      flexGrow: 1, // Allows it to expand in a flex container
    }}
  />
                    </FlexContainer>

                    {errors.Response && touched.Response && (
                      <div style={{ color: 'red', fontSize: '12px' }}>
                        {errors.Response}
                      </div>
                    )}
                  </>
                )}
              </Grid>
            );
          }
          return null;
        })}
      </Grid>
    </FlexContainer>
  );
}

export default OpinionRequest;
