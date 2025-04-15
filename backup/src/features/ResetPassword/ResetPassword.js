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
  CircularProgress,
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
import PasswordRequirements from '../ChangePassword/PasswordRequirement';
import DoneIcon from '../../assets/Icons/DoneIcon.png';
import DoNotDisturbAltIcon from '../../assets/Icons/DoNotDisturbIcon.png';
import { useSelector } from 'react-redux';
import { showToastAlert } from '../../utils/SweetAlert';
import styled from 'styled-components';
import { media } from '../../../src/utils/Breakpoints';
import LoginBgImage from '../../assets/images/loginbgcolor.png';
import {
  useGetPasswordPolicyResetQuery,
  useLazyGetResetPasswordUserDetailQuery,
  useResetPasswordMutation,
} from '../../redux/RTK/resetPasswordApi';
import { useNavigate } from 'react-router-dom';
import SuccessGif from '../../assets/Gifs/SuccessGif.gif';
import { useParams } from 'react-router-dom';
import { setResetPasswordUserDetail } from '../../redux/features/auth/resetPasswordSlice';
import { useDispatch } from 'react-redux';

const StyledFlexContainer = styled(FlexContainer)`
  ${media.screen.small`
      flex-direction: column;
      `}
`;
const ResetPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [triggerResetPasswordUserDetails] =
    useLazyGetResetPasswordUserDetailQuery();
  const [showPasswords, setShowPasswords] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (id) {
        try {
          let userDetailResponse = await triggerResetPasswordUserDetails({
            employeeId: id,
          });
          dispatch(setResetPasswordUserDetail(userDetailResponse?.data.Data));
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };
    fetchUserDetails();
  }, [id, dispatch]);

  const employeeDetails = useSelector((state) => state.resetPassword);

  const [passwordPolicyInitialValues, setPasswordPolicyInitialValues] =
    useState({
      minLength: '',
      minLowercase: '',
      minUppercase: '',
      minDigits: '',
    });

  const { data: passwordPolicy, isFetching: isPasswordPolicyFetching } =
    useGetPasswordPolicyResetQuery(
      {
        loginUserId: employeeDetails?.data.UserId,
        headerFacilityId: employeeDetails?.data.DefaultFacilityId,
      },
      {
        skip: !employeeDetails?.data.UserId,
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

  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const encodeBase64 = (plainText) => {
    try {
      return btoa(plainText);
    } catch (error) {
      return null;
    }
  };

  const [triggerResetPassword, { isLoading }] = useResetPasswordMutation();
  const handleSubmit = async (values, { resetForm }) => {
    // const encryptedPassword = encryptAES(values?.confirmPassword, secretKey);
    const encryptedPassword = encodeBase64(values?.confirmPassword);

    let response = await triggerResetPassword({
      payload: {
        employeeId: employeeDetails?.data.EmployeeID,
        password: encryptedPassword,
      },
    }).unwrap();

    if (response && response.message) {
      showToastAlert({
        type: 'custom_success',
        text: 'Your password has been successfully reset',
        gif: SuccessGif,
      });
      navigate('/login');
    }
    resetForm();
  };
  const handleCancel = (resetForm) => {
    resetForm();
    navigate('/login');
  };

  return (
    <StyledFlexContainer
      width="100%"
      height="100%"
      backgroundImage={`url(${LoginBgImage}); background-size: cover; background-repeat: no-repeat`}
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <Grid
        container
        sx={{
          width: { xs: '90%', md: '50%', lg: '50%' },
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '20px',
          alignItems: 'center',
        }}
      >
        <Grid item xs={12} sx={{ textAlign: 'center' }}>
          <StyledTypography
            fontSize="28px"
            fontWeight="600"
            lineHeight="44px"
            color="#0083C0"
            whiteSpace={'nowrap'}
          >
            {t('ResetPassword')}
          </StyledTypography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ padding: '30px' }}>
          <FlexContainer justifyContent="center" flexDirection="column">
            <Formik
              initialValues={{
                newPassword: '',
                confirmPassword: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleChange, errors, touched, resetForm }) => {
                return (
                  <Form>
                    <FlexContainer
                      justifyContent="center"
                      alignItems="center"
                      flexDirection="column"
                    >
                      <Avatar
                        src={employeeDetails?.data.UserImage || ''}
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
                        {employeeDetails?.data.UserName || 'User'}
                      </Typography>
                    </FlexContainer>

                    {[
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
                            {({ field }) => (
                              <TextField
                                {...field}
                                fullWidth
                                variant="outlined"
                                onChange={handleChange}
                                // onBlur={handleBlur}
                                type={showPasswords[name] ? 'text' : 'password'}
                                error={Boolean(errors[name] && touched[name])}
                                helperText={touched[name] && errors[name]}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <IconButton
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleClickShowPassword(name);
                                        }}
                                      >
                                        <StyledImage
                                          src={
                                            showPasswords[name]
                                              ? VisibilityOff
                                              : EyeIcon
                                          }
                                          width="22px"
                                          height="15px"
                                        />
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

                    <FlexContainer
                      gap="16px"
                      justifyContent="center"
                      padding="10px 15px 10px 0px"
                      alignItems="center"
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isLoading}
                        sx={{
                          color: '#0083C0',
                          gap: '8px',
                          boxShadow: '0px 4px 4px 0px #00000040;',
                          '&:hover': {
                            transform: 'scale(1.05) !important',
                            transition: 'transform 0.3s ease !important',
                          },
                        }}
                        startIcon={
                          isLoading ? (
                            <CircularProgress
                              size={25}
                              color="inherit"
                              style={{ marginRight: 10 }}
                            />
                          ) : (
                            <StyledImage src={DoneIcon} />
                          )
                        }
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
                );
              }}
            </Formik>
          </FlexContainer>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <PasswordRequirements
            passwordPolicyInitialValues={passwordPolicyInitialValues}
            isPasswordPolicyFetching={isPasswordPolicyFetching}
          />
        </Grid>
      </Grid>
    </StyledFlexContainer>
  );
};

export default ResetPassword;
