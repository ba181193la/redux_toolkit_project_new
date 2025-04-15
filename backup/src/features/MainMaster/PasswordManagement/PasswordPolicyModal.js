import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
  Tooltip,
} from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../utils/StyledComponents';
import CloseIcon from '../../../assets/Icons/CloseIcon.png';
import Label from '../../../components/Label/Label';
import styled from 'styled-components';

import EditIconWhite from '../../../assets/Icons/EditIconWhite.png';
import DoneIcon from '../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../assets/Icons/DoNotDisturbIcon.png';
import LoadingGif from '../../../assets/Gifs/LoadingGif.gif';

import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import {
  useAddPasswordPolicyMutation,
  useGetPasswordPolicyQuery,
  useUpdatePasswordPolicyMutation,
} from '../../../redux/RTK/passwordManagementApi';
import { useSelector } from 'react-redux';
import { showToastAlert } from '../../../utils/SweetAlert';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../utils/language';
import { useGetFieldsQuery } from '../../../redux/RTK/moduleDataApi';

//Blue color label
const PasswordPolicySubText = styled.span`
  color: #0083c0;
  text-align: left;
  font-weight: 600;
  font-size: 0.8rem;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const PasswordPolicyModal = ({
  showPasswordPolicyModal,
  setShowPasswordPolicyModal,
  labels,
}) => {
  //* Hooks declaration
  const { t, i18n } = useTranslation();

  //* Selectors
  const {
    selectedFacility,
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedRoleFacility,
  } = useSelector((state) => state.auth);

  //* State variables
  const [isEdit, setIsEdit] = useState(false);
  const [roleMenu, setRoleMenu] = useState();
  const [passwordPolicyInitialValues, setPasswordPolicyInitialValues] =
    useState({
      minLength: '',
      minLowercase: '',
      minUppercase: '',
      minDigits: '',
      expiryDays: '',
      wrongEntryLimit: '',
      mailFactor: false,
    });

  const { data: fields = [] } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  const pageFields = fields?.Data?.Sections?.find(
    (section) => section?.SectionName === 'Page'
  )?.Fields;

  useEffect(() => {
    const roleMenu = selectedRoleFacility?.Menu.find(
      (item) => item.MenuId === selectedMenu?.id
    );
    setRoleMenu(roleMenu);
  }, [selectedRoleFacility, selectedMenu]);

  const [triggerAddPasswordPolicy] = useAddPasswordPolicyMutation();
  const [triggerUpdatePasswordPolicy] = useUpdatePasswordPolicyMutation();

  const {
    data: passwordPolicy,
    refetch,
    isFetching,
  } = useGetPasswordPolicyQuery(
    {
      loginUserId: userDetails?.UserId,
      headerFacilityId: selectedFacility?.id,
    },
    {
      skip: !userDetails?.UserId || !selectedFacility?.id,
      refetchOnMountOrArgChange: true,
    }
  );

  useEffect(() => {
    if (passwordPolicy?.Data) {
      setPasswordPolicyInitialValues({
        minLength: passwordPolicy?.Data?.MinLength,
        minLowercase: passwordPolicy?.Data?.MinLowerAlphabets,
        minUppercase: passwordPolicy?.Data?.MinUpperAlphabets,
        minDigits: passwordPolicy?.Data?.MinDigits,
        expiryDays: passwordPolicy?.Data?.PasswordExpiryDays,
        wrongEntryLimit: passwordPolicy?.Data?.WrongPasswordAttempt,
        mailFactor: passwordPolicy?.Data?.IsMailTwoFactor,
      });
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [passwordPolicy]);

  const passwordPolicyValidation = Yup.object().shape({
    minLength: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'PM_P_MinimumLength')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel('MM_PM_MinimumLength', labels, i18n.language)} ${t('IsRequired')}`
          )
          .test(
            'is-not-zero',
            `${getlabel('MM_PM_MinimumLength', labels, i18n.language)} ${t('CannotBeZero')}`,
            (value) => value !== '0'
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    minLowercase: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'PM_P_MinimumLowercaseAlphabets')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel('MM_PM_MinimumLowercaseAlphabets', labels, i18n.language)} ${t('IsRequired')}`
          )
          .test(
            'is-not-zero',
            `${getlabel('MM_PM_MinimumLowercaseAlphabets', labels, i18n.language)} ${t('CannotBeZero')}`,
            (value) => value !== '0'
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    minUppercase: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'PM_P_MinimumUppercaseAlphabets')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel('MM_PM_MinimumUppercaseAlphabets', labels, i18n.language)} ${t('IsRequired')}`
          )
          .test(
            'is-not-zero',
            `${getlabel('MM_PM_MinimumUppercaseAlphabets', labels, i18n.language)} ${t('CannotBeZero')}`,
            (value) => value !== '0'
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    minDigits: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'PM_P_MinimumDigits')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel('MM_PM_MinimumDigits', labels, i18n.language)} ${t('IsRequired')}`
          )
          .test(
            'is-not-zero',
            `${getlabel('MM_PM_MinimumDigits', labels, i18n.language)} ${t('CannotBeZero')}`,
            (value) => value !== '0'
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    expiryDays: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'PM_P_ExpiryDays')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel('MM_PM_ExpiryDays', labels, i18n.language)} ${t('IsRequired')}`
          )
          .test(
            'is-not-zero',
            `${getlabel('MM_PM_ExpiryDays', labels, i18n.language)} ${t('CannotBeZero')}`,
            (value) => value !== '0'
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
    wrongEntryLimit: Yup.string().when([], {
      is: () =>
        pageFields?.find((x) => x.FieldId === 'PM_P_PasswordWrongEntryLimit')
          ?.IsMandatory === true,
      then: (schema) =>
        schema
          .required(
            `${getlabel('MM_PM_PasswordWrongEntryLimit', labels, i18n.language)} ${t('IsRequired')}`
          )
          .test(
            'is-not-zero',
            `${getlabel('MM_PM_PasswordWrongEntryLimit', labels, i18n.language)} ${t('CannotBeZero')}`,
            (value) => value !== '0'
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const closePasswordPolicyModal = () => {
    setShowPasswordPolicyModal(false);
    setPasswordPolicyInitialValues({
      minLength: '',
      minLowercase: '',
      minUppercase: '',
      minDigits: '',
      expiryDays: '',
      wrongEntryLimit: '',
      mailFactor: false,
    });
    setIsEdit(false);
  };

  const submitPasswordPolicy = async (values) => {
    try {
      let response;
      if (!passwordPolicy?.Data?.PasswordPolicyId) {
        response = await triggerAddPasswordPolicy({
          payload: {
            minLength: Number(values?.minLength) || '',
            minLowerAlphabets: Number(values?.minLowercase) || '',
            minUpperAlphabets: Number(values?.minUppercase) || '',
            minDigits: Number(values?.minDigits) || '',
            passwordExpiryDays: Number(values?.expiryDays) || '',
            wrongPasswordAttempt: Number(values?.wrongEntryLimit) || '',
            isMailTwoFactor: values?.mailFactor || false,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
            facilityId: selectedFacility?.id,
          },
        }).unwrap();
      } else {
        response = await triggerUpdatePasswordPolicy({
          payload: {
            passwordPolicyId: Number(passwordPolicy?.Data?.PasswordPolicyId),
            minLength: Number(values?.minLength) || '',
            minLowerAlphabets: Number(values?.minLowercase) || '',
            minUpperAlphabets: Number(values?.minUppercase) || '',
            minDigits: Number(values?.minDigits) || '',
            passwordExpiryDays: Number(values?.expiryDays) || '',
            wrongPasswordAttempt: Number(values?.wrongEntryLimit) || '',
            isMailTwoFactor: values?.mailFactor || false,
            moduleId: selectedModuleId,
            menuId: selectedMenu?.id,
            loginUserId: userDetails?.UserId,
            facilityId: selectedFacility?.id,
          },
        }).unwrap();
      }
      if (response && response.Message) {
        showToastAlert({
          type: 'custom_success',
          text: response.Message,
          gif: 'SuccessGif',
        });
      }
      setPasswordPolicyInitialValues({
        minLength: '',
        minLowercase: '',
        minUppercase: '',
        minDigits: '',
        expiryDays: '',
        wrongEntryLimit: '',
        mailFactor: false,
      });
      refetch();
      setIsEdit(false);
      setShowPasswordPolicyModal(false);
    } catch (error) {
      showToastAlert({
        type: 'custom_info',
        text: 'Failed to add/update password policy',
        gif: 'ErrorGif',
      });
      console.error('Failed to add/update password policy', error);
    }
  };

  return (
    <Dialog
      open={showPasswordPolicyModal}
      dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
      maxWidth={'md'}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
          height: isFetching ? '350px' : 'auto',
          width: isFetching ? '350px' : 'auto',
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#205475',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          height: 50,
          alignItems: 'center',
          padding: '20px 20px',
        }}
      >
        <StyledTypography
          fontSize="20px"
          fontWeight="300"
          lineHeight="18px"
          color="#fff"
        >
          {t('PasswordPolicy')}
        </StyledTypography>

        <IconButton
          onClick={closePasswordPolicyModal}
          style={{
            padding: '0.7rem',
          }}
          sx={{
            color: '#fff',
            '&:hover': {
              transform: 'scale(1.05)',
              backgroundColor: 'color(srgb 0.75 0.74 0.74 / 0.15)',
            },
          }}
        >
          <Tooltip title="Close" arrow>
            <StyledImage src={CloseIcon} alt="Close Icon" tooltip="Close" />
          </Tooltip>
        </IconButton>
      </DialogTitle>
      <DialogContent padding="0px">
        {isFetching ? (
          <FlexContainer
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="100%"
            position="absolute"
            style={{ top: '0', left: '0' }}
          >
            <StyledImage src={LoadingGif} alt="LoadingGif" />
          </FlexContainer>
        ) : (
          <FlexContainer paddingTop="20px" flexWrap="wrap">
            <FlexContainer width="100%" flexWrap="wrap">
              <PasswordPolicySubText>
                {t('PasswordCompositionAndStrength')}
              </PasswordPolicySubText>
            </FlexContainer>
            <Formik
              initialValues={passwordPolicyInitialValues}
              validationSchema={passwordPolicyValidation}
              enableReinitialize={true}
              onSubmit={(values) => {
                submitPasswordPolicy(values);
              }}
            >
              {({ values }) => (
                <Form style={{ width: '100%' }}>
                  <Grid
                    container
                    display={'flex'}
                    width="100%"
                    flexWrap={'wrap'}
                    justifyContent={'space-between'}
                    item
                    xs={12}
                    spacing={2}
                    alignItems={'center'}
                  >
                    {pageFields?.find((x) => x.FieldId === 'PM_P_MinimumLength')
                      ?.IsShow && (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={3}
                          xl={3}
                          padding={'10px'}
                        >
                          <Label
                            value={getlabel(
                              'MM_PM_MinimumLength',
                              labels,
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'PM_P_MinimumLength'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={3}
                          xl={3}
                          padding={'10px'}
                        >
                          <Field name="minLength">
                            {({ field, form }) => (
                              <TextField
                                {...field}
                                id="minLength"
                                autoComplete="off"
                                values={values.minLength}
                                fullWidth={true}
                                disabled={!isEdit}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*$/.test(value)) {
                                    form.setFieldValue(field.name, value);
                                  }
                                }}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="minLength"
                            component="div"
                            style={{
                              color: 'red',
                              fontSize: '12px',
                              marginTop: '4px',
                            }}
                          />
                        </Grid>
                      </>
                    )}
                    {pageFields?.find(
                      (x) => x.FieldId === 'PM_P_MinimumLowercaseAlphabets'
                    )?.IsShow && (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={3}
                          xl={3}
                          padding={'10px'}
                        >
                          <Label
                            value={getlabel(
                              'MM_PM_MinimumLowercaseAlphabets',
                              labels,
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) =>
                                  x.FieldId === 'PM_P_MinimumLowercaseAlphabets'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={3}
                          xl={3}
                          padding={'10px'}
                        >
                          <Field name="minLowercase">
                            {({ field, form }) => (
                              <TextField
                                {...field}
                                id="minLowercase"
                                autoComplete="off"
                                fullWidth={true}
                                values={values.minLowercase}
                                disabled={!isEdit}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*$/.test(value)) {
                                    form.setFieldValue(field.name, value);
                                  }
                                }}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="minLowercase"
                            component="div"
                            style={{
                              color: 'red',
                              fontSize: '12px',
                              marginTop: '4px',
                            }}
                          />
                        </Grid>
                      </>
                    )}
                    {pageFields?.find(
                      (x) => x.FieldId === 'PM_P_MinimumUppercaseAlphabets'
                    )?.IsShow && (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={3}
                          xl={3}
                          padding={'10px'}
                        >
                          <Label
                            value={getlabel(
                              'MM_PM_MinimumUppercaseAlphabets',
                              labels,
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) =>
                                  x.FieldId === 'PM_P_MinimumUppercaseAlphabets'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={3}
                          xl={3}
                          padding={'10px'}
                        >
                          <Field name="minUppercase">
                            {({ field, form }) => (
                              <TextField
                                {...field}
                                id="minUppercase"
                                autoComplete="off"
                                fullWidth={true}
                                values={values.minUppercase}
                                disabled={!isEdit}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*$/.test(value)) {
                                    form.setFieldValue(field.name, value);
                                  }
                                }}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="minUppercase"
                            component="div"
                            style={{
                              color: 'red',
                              fontSize: '12px',
                              marginTop: '4px',
                            }}
                          />
                        </Grid>
                      </>
                    )}
                    {pageFields?.find((x) => x.FieldId === 'PM_P_MinimumDigits')
                      ?.IsShow && (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={3}
                          xl={3}
                          padding={'10px'}
                        >
                          <Label
                            value={getlabel(
                              'MM_PM_MinimumDigits',
                              labels,
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'PM_P_MinimumDigits'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={3}
                          xl={3}
                          padding={'10px'}
                        >
                          <Field name="minDigits">
                            {({ field, form }) => (
                              <TextField
                                {...field}
                                id="minDigits"
                                autoComplete="off"
                                fullWidth={true}
                                values={values.minDigits}
                                disabled={!isEdit}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*$/.test(value)) {
                                    form.setFieldValue(field.name, value);
                                  }
                                }}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="minDigits"
                            component="div"
                            style={{
                              color: 'red',
                              fontSize: '12px',
                              marginTop: '4px',
                            }}
                          />
                        </Grid>
                      </>
                    )}
                    {pageFields?.find((x) => x.FieldId === 'PM_P_ExpiryDays')
                      ?.IsShow && (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={3}
                          xl={3}
                          padding={'10px'}
                        >
                          <Label
                            value={getlabel(
                              'MM_PM_ExpiryDays',
                              labels,
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) => x.FieldId === 'PM_P_ExpiryDays'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={3}
                          xl={3}
                          padding={'10px'}
                        >
                          <Field name="expiryDays">
                            {({ field, form }) => (
                              <TextField
                                {...field}
                                id="expiryDays"
                                autoComplete="off"
                                fullWidth={true}
                                values={values.expiryDays}
                                disabled={!isEdit}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*$/.test(value)) {
                                    form.setFieldValue(field.name, value);
                                  }
                                }}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="expiryDays"
                            component="div"
                            style={{
                              color: 'red',
                              fontSize: '12px',
                              marginTop: '4px',
                            }}
                          />
                        </Grid>
                      </>
                    )}
                    {pageFields?.find(
                      (x) => x.FieldId === 'PM_P_PasswordWrongEntryLimit'
                    )?.IsShow && (
                      <>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={3}
                          xl={3}
                          padding={'10px'}
                        >
                          <Label
                            value={getlabel(
                              'MM_PM_PasswordWrongEntryLimit',
                              labels,
                              i18n.language
                            )}
                            isRequired={
                              pageFields?.find(
                                (x) =>
                                  x.FieldId === 'PM_P_PasswordWrongEntryLimit'
                              )?.IsMandatory
                            }
                          />
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          sm={12}
                          md={6}
                          lg={3}
                          xl={3}
                          padding={'10px'}
                        >
                          <Field name="wrongEntryLimit">
                            {({ field, form }) => (
                              <TextField
                                {...field}
                                id="wrongEntryLimit"
                                autoComplete="off"
                                fullWidth={true}
                                values={values.wrongEntryLimit}
                                disabled={!isEdit}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  if (/^\d*$/.test(value)) {
                                    form.setFieldValue(field.name, value);
                                  }
                                }}
                              />
                            )}
                          </Field>
                          <ErrorMessage
                            name="wrongEntryLimit"
                            component="div"
                            style={{
                              color: 'red',
                              fontSize: '12px',
                              marginTop: '4px',
                            }}
                          />
                        </Grid>
                      </>
                    )}
                    {pageFields?.find(
                      (x) =>
                        x.FieldId === 'PM_P_EnableTwoFactorEMailAuthentication'
                    )?.IsShow && (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        style={{ paddingTop: '10px', paddingInline: '5px' }}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              size="small"
                              id="enableMailFactor"
                              checked={values.mailFactor}
                              disabled={!isEdit}
                              onChange={() => {
                                setPasswordPolicyInitialValues({
                                  minLength: values.minLength,
                                  minLowercase: values.minLowercase,
                                  minUppercase: values.minUppercase,
                                  minDigits: values.minDigits,
                                  expiryDays: values.expiryDays,
                                  wrongEntryLimit: values.wrongEntryLimit,
                                  mailFactor: !values.mailFactor,
                                });
                              }}
                            />
                          }
                          label={getlabel(
                            'MM_PM_EnableTwoFactorEMailAuthentication',
                            labels,
                            i18n.language
                          )}
                          sx={{
                            '& .MuiFormControlLabel-label': {
                              fontSize: '12px',
                              fontWeight: '600',
                              paddingTop: '0',
                            },
                            '&.Mui-disabled .MuiFormControlLabel-label': {
                              color: 'black',
                              opacity: '0.9',
                            },
                          }}
                        />
                      </Grid>
                    )}
                  </Grid>
                  <Grid
                    display={'flex'}
                    width="100%"
                    justifyContent={'center'}
                    gap={'10px'}
                    margin={'10px'}
                  >
                    {!isEdit && roleMenu?.IsEdit && (
                      <StyledButton
                        borderRadius="6px"
                        variant="contained"
                        color="primary"
                        type="button"
                        onClick={() => setIsEdit(true)}
                        style={{ display: 'inline-flex', gap: '5px' }}
                        startIcon={
                          <StyledImage
                            height="12px"
                            width="12px"
                            src={EditIconWhite}
                            alt="WhiteSearch"
                          />
                        }
                      >
                        {t('Edit')}
                      </StyledButton>
                    )}
                    {isEdit && (
                      <>
                        <StyledButton
                          borderRadius="6px"
                          padding="6px 10px"
                          variant="contained"
                          color="primary"
                          type="submit"
                          sx={{ marginLeft: '10px' }}
                          style={{ display: 'inline-flex', gap: '5px' }}
                          startIcon={
                            <StyledImage
                              height="16px"
                              width="16px"
                              src={DoneIcon}
                              alt="WhiteSearch"
                            />
                          }
                        >
                          {t('Submit')}
                        </StyledButton>

                        <StyledButton
                          variant="outlined"
                          border="1px solid #0083c0"
                          backgroundColor="#ffffff"
                          type="button"
                          colour="#0083c0"
                          borderRadius="6px"
                          sx={{ marginLeft: '10px' }}
                          style={{ display: 'inline-flex', gap: '5px' }}
                          onClick={closePasswordPolicyModal}
                          startIcon={
                            <StyledImage
                              height="16px"
                              width="16px"
                              src={DndIcon}
                              alt="WhiteSearch"
                            />
                          }
                        >
                          {t('Cancel')}
                        </StyledButton>
                      </>
                    )}
                  </Grid>
                </Form>
              )}
            </Formik>
          </FlexContainer>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PasswordPolicyModal;
