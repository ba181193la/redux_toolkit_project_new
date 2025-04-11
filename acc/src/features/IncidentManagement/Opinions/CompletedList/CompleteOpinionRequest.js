import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
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
import {
  useGetIncidentOpinionCompletedByIdQuery,
  useGetIncidentOpinionPendingByIdQuery,
} from '../../../../redux/RTK/IncidentOinionApi';

function CompleteOpinionRequest({
  searchFields,
  pagesConfigData,
  searchLabels,
  opID,
  CompletedOpinionRequest
}) {
  const { t, i18n } = useTranslation();
  const { values, handleChange, setFieldValue, errors, touched } =
    useFormikContext();
  const { selectedMenu, userDetails, selectedModuleId } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (CompletedOpinionRequest?.Data) {
      // Ensure OpinionRequest and Data exist
      const {
        DepartmentName,
        DesignationName,
        EmployeeName,
        OpinionComments,
        EmployeeID,
        WebsiteURL,
        ContactPersonName,
        Comments,
        OpinionNo,
        RequestedDate,
        Response,
        SubmittedBy,
        SubmittedDate,
      } = CompletedOpinionRequest.Data;

      const dateStr = RequestedDate;
      const date = new Date(dateStr);
      const formattedDate =
        date.getDate().toString().padStart(2, '0') +
        '-' +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        date.getFullYear();

      const dateStr2 = SubmittedDate;
      const date2 = new Date(dateStr);
      const formattedDate2 =
        date.getDate().toString().padStart(2, '0') +
        '-' +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        date.getFullYear();

      setFieldValue('opinionId', OpinionNo || '');
      setFieldValue('requestedDate', formattedDate || '');
      setFieldValue('Comments', Response || ''); 
      setFieldValue('EmployeeId', EmployeeID || '');
      setFieldValue('submittedBy', SubmittedBy || '');
      setFieldValue('submittedDate', formattedDate2 || '');
      setFieldValue('EmployeeName', EmployeeName || '');
      setFieldValue('department', DepartmentName || '');
      setFieldValue('Response', Comments || '');
    }
  }, [CompletedOpinionRequest, setFieldValue]);

  return (
    <FlexContainer flexDirection="column">
      {/* Section Header for Opinion Requested */}
      <StyledTypography
        variant="h5"
        fontWeight="bold"
        sx={{ marginBottom: '20px' }}
      >
        Opinion Requested
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
              <Grid item xs={4} key={field.FieldId}>
                <FormLabel>{translatedLabel}</FormLabel>
                {fieldConfig.component === 'ReadOnlyText' && (
                  <ReadOnlyText>{values[fieldConfig.name] || ''}</ReadOnlyText>
                )}
                {fieldConfig.component === 'TextArea' && (
                  <Field
                    as={TextArea}
                    name={field.FieldId}
                    sx={{
                      width: '100%',
                      height: '100px',
                      padding: '10px',
                      maxWidth: '200px',
                    }}
                    // onChange={handleChange}
                    // onBlur={handleBlur}
                  />
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

export default CompleteOpinionRequest;
