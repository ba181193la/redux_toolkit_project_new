import React, { useEffect, useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Grid,
  IconButton,
  Avatar,
  InputAdornment,
  Button,
} from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../utils/StyledComponents';
import EyeIcon from '../../assets/Icons/EyeIcon.png';
import VisibilityOff from '../../assets/Icons/VisibilityOff.png';
import { useTranslation } from 'react-i18next';
import PasswordRequirements from './PasswordRequirement';
import AvatarIcon from '../../assets/Icons/avatar.png';
import DoneIcon from '../../assets/Icons/DoneIcon.png';
import DoNotDisturbAltIcon from '../../assets/Icons/DoNotDisturbIcon.png';
import { useSelector } from 'react-redux';
import {
  useGetPasswordPolicyQuery,
  useUpdateStaffPasswordMutation,
} from '../../redux/RTK/passwordManagementApi';
import { showToastAlert } from '../../utils/SweetAlert';
import { encryptAES } from '../../utils/Auth';
import { useNavigate } from 'react-router-dom';
import SuccessGif from '../../assets/Gifs/SuccessGif1.gif';

const ChangePassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [passwordPolicyInitialValues, setPasswordPolicyInitialValues] =
    useState({
      minLength: '',
      minLowercase: '',
      minUppercase: '',
      minDigits: '',
    });

  const { userDetails, selectedModuleId, selectedMenu, selectedFacility } =
    useSelector((state) => state.auth);
  const { data: passwordPolicy, isFetching: isPasswordPolicyFetching } =
    useGetPasswordPolicyQuery(
      {
        loginUserId: userDetails?.UserId,
        headerFacilityId: selectedFacility?.id,
      },
      {
        skip: !userDetails?.UserId,
      }
    );

  useEffect(() => {
    if (passwordPolicy?.Data) {
      setPasswordPolicyInitialValues({
        minLength: passwordPolicy?.Data?.MinLength,
        minLowercase: passwordPolicy?.Data?.MinLowerAlphabets,
        minUppercase: passwordPolicy?.Data?.MinUpperAlphabets,
        minDigits: passwordPolicy?.Data?.MinDigits,
      });
    }
  }, [passwordPolicy]);

  const passwordValidationRegex = new RegExp(
    `^(?=(?:[^a-z]*[a-z]){${passwordPolicyInitialValues?.minLowercase}})(?=(?:[^A-Z]*[A-Z]){${passwordPolicyInitialValues?.minUppercase}})(?=(?:[^0-9]*[0-9]){${passwordPolicyInitialValues?.minDigits}}).{${passwordPolicyInitialValues?.minLength},}$`
  );

  const validationSchema = Yup.object({
    oldPassword: Yup.string().required('Old password is required'),
    newPassword: Yup.string()
      .required('New password is Required')
      .matches(
        passwordValidationRegex,
        'Password does not match with password policy.'
      )
      .matches(
        /(?=.*[@$!%*?&#])/,
        'Must contain at least one special character'
      ),
    confirmPassword: Yup.string()
      .required('Confirm Password is Required')
      .oneOf(
        [Yup.ref('newPassword'), null],
        "Password and Confirm Password doesn't match"
      )
      .matches(
        passwordValidationRegex,
        'Password does not match with password policy.'
      )
      .matches(
        /(?=.*[@$!%*?&#])/,
        'Must contain at least one special character'
      ),
  });

  const handleClickShowPassword = (field) => {
    setShowPasswords((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const [triggerUpdatePasswordDetails, { isLoading }] =
    useUpdateStaffPasswordMutation();
  const secretKey = process.env.REACT_APP_SECRET_KEY;
  const handleSubmit = async (values, { resetForm }) => {
    let response;
    const encryptedPassword = encryptAES(values?.confirmPassword, secretKey);
    response = await triggerUpdatePasswordDetails({
      payload: {
        userId: userDetails?.UserId,
        password: encryptedPassword,
        moduleId: 1,
        menuId: 1,
        loginUserId: userDetails?.UserId,
      },
    }).unwrap();
    if (response && response.Message) {
      showToastAlert({
        type: 'custom_success',
        text: response.Message,
        gif: SuccessGif,
      });
    }
    resetForm();
  };

  const handleCancel = (resetForm) => {
    resetForm();
    navigate('/');
  };

  return (
    <FlexContainer width="100%" height="100%" flexDirection="column">
      <FlexContainer justifyContent={'space-between'}>
        <StyledTypography
          fontSize="28px"
          fontWeight="600"
          lineHeight="44px"
          color="#0083C0"
          whiteSpace={'nowrap'}
        >
          {t('ChangePassword')}
        </StyledTypography>
      </FlexContainer>
      <FlexContainer
        width="calc(100% - 30px)"
        height="auto"
        flex="1"
        flexDirection="column"
      >
        <FlexContainer
          height="100%"
          width="100%"
          padding="30px 15px 0px 25px"
          borderRadius="8px"
          flexDirection="row"
          backgroundColor="#fff"
        >
          <Grid
            container
            justifyContent="center"
            style={{ height: '100%' }}
            alignItems={'center'}
            marginLeft={'200px'}
          >
            <Grid item xs={12} md={4}>
              <Formik
                initialValues={{
                  oldPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {({
                  values,
                  handleChange,
                  handleBlur,
                  errors,
                  touched,
                  resetForm,
                }) => (
                  <Form>
                    <Grid container spacing={2}>
                      <FlexContainer
                        justifyContent="center"
                        alignItems="center"
                        flexDirection="column"
                        width="100%"
                      >
                        <Avatar
                          src={userDetails?.UserImage || ''}
                          alt="Avatar Icon"
                          sx={{
                            width: 80,
                            height: 80,
                            marginBottom: '16px',
                          }}
                        />
                        <Typography
                          variant="h6"
                          sx={{
                            marginBottom: '20px',
                            fontWeight: 'bold',
                            color: '#333',
                          }}
                        >
                          {userDetails?.UserName || 'User'}
                        </Typography>
                      </FlexContainer>

                      {[
                        { label: 'OldPassword', name: 'oldPassword' },
                        { label: 'NewPassword', name: 'newPassword' },
                        { label: 'ConfirmPassword', name: 'confirmPassword' },
                      ].map(({ label, name }, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '15px',
                            width: '100%',
                            justifyContent: 'center',
                          }}
                        >
                          <Grid item xs={12}>
                            <StyledTypography
                              fontSize="12px"
                              fontWeight="1000"
                              lineHeight="14.4px"
                              textAlign="left"
                              color="#666666"
                            >
                              {t(label)}
                            </StyledTypography>
                            <Field name={name}>
                              {() => (
                                <TextField
                                  fullWidth
                                  variant="outlined"
                                  type={
                                    showPasswords[name] ? 'text' : 'password'
                                  }
                                  name={name}
                                  value={values[name]}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  error={touched[name] && Boolean(errors[name])}
                                  helperText={touched[name] && errors[name]}
                                  slotProps={{ htmlInput: { maxLength: 100 } }}
                                  InputProps={{
                                    endAdornment: (
                                      <InputAdornment position="end">
                                        <IconButton
                                          aria-label={`toggle ${name} visibility`}
                                          onClick={() =>
                                            handleClickShowPassword(name)
                                          }
                                          edge="end"
                                        >
                                          {showPasswords[name] ? (
                                            <StyledImage
                                              src={VisibilityOff}
                                              style={{
                                                color: '#0F6CBD',
                                                width: '22px',
                                                height: '15px',
                                              }}
                                            />
                                          ) : (
                                            <StyledImage
                                              src={EyeIcon}
                                              style={{
                                                color: '#0F6CBD',
                                                width: '22px',
                                                height: '15px',
                                              }}
                                            />
                                          )}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                />
                              )}
                            </Field>
                          </Grid>
                        </Box>
                      ))}
                    </Grid>

                    <FlexContainer
                      gap="16px"
                      justifyContent="center"
                      padding="10px 15px 10px 0px"
                      alignItems="center"
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          color: '#0083C0',
                          gap: '8px',
                          boxShadow: '0px 4px 4px 0px #00000040;',
                          '&:hover': {
                            transform: 'scale(1.05) !important',
                            transition: 'transform 0.3s ease !important',
                          },
                        }}
                        startIcon={<StyledImage src={DoneIcon} />}
                        disabled={isLoading}
                      >
                        <StyledTypography
                          textTransform="none"
                          marginTop="1px"
                          color="#FFFFFF"
                        >
                          {t('Submit')}
                        </StyledTypography>
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => handleCancel(resetForm)}
                        sx={{
                          gap: '8px',
                          boxShadow: '0px 4px 4px 0px #00000040',
                          '&:hover': {
                            transform: 'scale(1.05) !important',
                            transition: 'transform 0.3s ease !important',
                          },
                        }}
                        startIcon={<StyledImage src={DoNotDisturbAltIcon} />}
                      >
                        <StyledTypography textTransform="none" marginTop="1px">
                          {t('Cancel')}
                        </StyledTypography>
                      </Button>
                    </FlexContainer>
                  </Form>
                )}
              </Formik>
            </Grid>

            <Grid item xs={12} md={5} sx={{ padding: '70px 0 70px 70px' }}>
              <PasswordRequirements
                passwordPolicyInitialValues={passwordPolicyInitialValues}
                isPasswordPolicyFetching={isPasswordPolicyFetching}
              />
            </Grid>
          </Grid>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default ChangePassword;
