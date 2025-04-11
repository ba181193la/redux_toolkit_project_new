import {
  Grid,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  setLoginCompany,
  setMsalConfig,
  setOtp,
} from '../../redux/features/auth/authSlice';
import ForgotPasswordPopup from '../ForgotPassword/ForgotPasswordPopup';
import {
  StyledTypography,
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledLink,
  StyledTextField,
} from '../../utils/StyledComponents';
import { media } from '../../../src/utils/Breakpoints';
import LoginBgImage from '../../assets/images/loginbgcolor.png';
import AzureIcon from '../../assets/images/azure.png';
import MicrosoftIcon from '../../assets/images/microsoft.png';
import AccrehealthIcon from '../../assets/images/accrehealthIcon.png';
import MedasIcon from '../../assets/images/MedasIcon.png';
import EyeIcon from '../../assets/Icons/EyeIcon.png';
import VisibilityOff from '../../assets/Icons/VisibilityOff.png';
import HeadsetIcon from '../../assets/Icons/Headset.png';
import UserIcon from '../../assets/Icons/UserIcon.png';
import LockIcon from '../../assets/Icons/LockIcon.png';
import EditIcon from '../../assets/Images/edit.png';

import BriefIncidentIcon from '../../assets/images/Hospital-brief-incident-icon.png';

import styled from 'styled-components';
import CustomScrollbars from '../../components/CustomScrollbars/CustomScrollbars';
import useWindowDimension from '../../hooks/useWindowDimension';
import { useTranslation } from 'react-i18next';
import { useMsal } from '@azure/msal-react';
import {
  useGetLoginPageLoadDataQuery,
  useLazyGetAzureDetailsQuery,
  useLazyStaffLockQuery,
} from '../../redux/RTK/loginApi';
import Dropdown from '../../components/Dropdown/Dropdown';
import { decryptAES, encryptAES } from '../../utils/Auth';
import { reset } from '../../redux/features/auth/wrongLoginAttemptsSlice';
import { showToastAlert } from '../../utils/SweetAlert';
import {
  setMailTwoFactorAuthentication,
  logout,
  setOTPFieldValidation,
  setCallAPIs,
  fetchCalls,
} from '../../redux/features/auth/authSlice';
import { ErrorMessage } from 'formik';
const CustomButton = styled(Button)`
  ${media.screen.xSmall`
       display: flex;
       flex-wrap: wrap;
      `}
`;

const StyledFlexContainer = styled(FlexContainer)`
  ${media.screen.small`
      flex-direction: column;
      `}
`;

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { instance } = useMsal();
  const { isTablet, isMobile, isDesktop } = useWindowDimension();
  const secretKey = process.env.REACT_APP_SECRET_KEY;

  const { isAuthenticated, loading, loginCompany } = useSelector(
    (state) => state.auth
  );
  const wrongLoginAttempts = useSelector((state) => state.wrongLoginAttempts);

  const [employeeID, setEmployeeID] = useState('');

  const [otpValue, setOtpValue] = useState('');

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [interactionInProgress, setInteractionInProgress] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [otpEnable, setOtpEnable] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isADIdentityProvider, setIsADIdentityProvider] = useState(true);
  const [triggerGetAzureDetails] = useLazyGetAzureDetailsQuery();
  const [triggerStaffLock] = useLazyStaffLockQuery();
  const { otp, mailTwoFactorAuthentication, decryptedOtp, OTPFieldValidation } =
    useSelector((state) => state.auth);
  const {
    data: loginPageData,
    refetch,
    isFetching,
  } = useGetLoginPageLoadDataQuery();

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (loginPageData?.Data?.MailTwoFactorAuthentication) {
      dispatch(setOtp(''));
      dispatch(setMailTwoFactorAuthentication(true));
    }
  }, [loginPageData]);
  useEffect(() => {
    if (!loginPageData) refetch();
  }, [loginPageData]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.shiftKey && event.code === 'KeyS') {
        if (loginPageData?.Data?.ADData?.ADIdentityProvider !== 'DB') {
          setIsADIdentityProvider(false);
        } else {
          return;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    const countLimit = loginPageData?.Data?.WrongPasswordCount;
    if (wrongLoginAttempts[employeeID] > countLimit) {
      setTimeout(() => {
        showToastAlert({
          type: 'custom_error',
          text: 'Your account has been blocked!',
        });
      }, 1000);
      triggerStaffLock({ employeeId: employeeID });
      // dispatch(reset(employeeID));
      setEmployeeID('');
      setPassword('');
    }
  }, [wrongLoginAttempts]);

  const handleForgotPasswordClick = () => setOpen(true);
  const handleEnterKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (employeeID && password) {
        handleSubmit(e);
      } else if (e.target.id === 'forgotPassword') {
        handleForgotPasswordClick();
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mailTwoFactorAuthentication && otpValue && otp) {
      if (otp && otpValue && otpValue === otp) {
        setIsLoading(true);
        await dispatch(fetchCalls({}));
        setIsLoading(false);
      } else {
        setIsError(true);
        setErrorMessage('Invalid Otp');
      }
    } else {
      if (mailTwoFactorAuthentication) {
        setOtpEnable(true);
      }
      dispatch(
        loginUser({
          credentials: {
            employeeID: encryptAES(employeeID, secretKey),
            password: encryptAES(password, secretKey),
          },
          employeeID,
          provider: 'DB',
          IsAccreAdmin: !isADIdentityProvider ? true : false,
        })
      );
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);

  const handleAzureLogin = async () => {
    const data = await response.json(); // Parse the response as JSON
    return data;

    const activeAccount = instance.getActiveAccount();
    if (activeAccount) {
      return;
    }
    if (interactionInProgress) {
      return;
    }
    setInteractionInProgress(true);

    instance
      .loginPopup({
        scopes: ['User.Read'],
      })
      .then((response) => {
        const email = response.account.username;
        dispatch(
          loginUser({
            credentials: { mailId: encryptAES(email, secretKey) },
            provider: 'Azure',
          })
        );
      })
      .catch((error) => {
        dispatch(logout());
      })
      .finally(() => {
        setInteractionInProgress(false);
      });
  };

  const handleOnChange = async (event) => {
    dispatch(setLoginCompany(event.target.value));
    const azureDetails = await triggerGetAzureDetails({
      companyCode: event.target.value,
    }).unwrap();
    const clientId = decryptAES(
      azureDetails?.Data?.AzureData?.ClientId,
      secretKey
    );
    const tenantId = decryptAES(
      azureDetails?.Data?.AzureData?.TenantId,
      secretKey
    );

    dispatch(
      setMsalConfig({
        tenantId: tenantId,
        clientId: clientId,
        redirectUrl: azureDetails?.Data?.AzureData?.PostLogoutURL,
      })
    );
  };

  return (
    <CustomScrollbars style={{ height: '100%' }} rtl={i18n.language === 'ar'}>
      <StyledFlexContainer
        width="100%"
        height="100%"
        backgroundImage={`url(${LoginBgImage}); background-size: cover; background-repeat: no-repeat`}
        justifyContent="center"
        alignItems="center"
      >
        {isFetching ? (
          <CircularProgress
            size={25}
            color="primary"
            style={{ marginRight: 10 }}
          />
        ) : (
          <Grid
            container
            sx={{
              width: { xs: '90%', md: '50%', lg: '50%' },
              backgroundColor: '#fff',
              borderRadius: '8px',
            }}
          >
            <Grid item xs={12} sm={5} display="flex">
              <FlexContainer
                width="100%"
                backgroundColor="#E6F3F9"
                alignItems="center"
                justifyContent="center"
                borderRadius="8px"
              >
                <StyledImage
                  src={MedasIcon}
                  alt="MedasIcon"
                  height={isMobile || isTablet ? '80px' : 'auto'}
                  width={isMobile || isTablet ? '80px' : 'auto'}
                />
              </FlexContainer>
            </Grid>
            <Grid item xs={12} sm={7}>
              <FlexContainer
                width="100%"
                height="100%"
                flexDirection="column"
                alignItems="center"
                padding={isMobile || isTablet ? '20px' : '25px 55px'}
                position="relative"
              >
                <Tooltip title="Brief Incident" arrow>
                  <StyledImage
                    src={BriefIncidentIcon}
                    alt="BriefIncidentIcon"
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '5px',
                      padding: '5px',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate('/login/BriefIncident')}
                  />
                </Tooltip>

                <StyledImage
                  src={AccrehealthIcon}
                  alt="Accrehealth Icon"
                  style={{ marginBottom: '40px' }}
                />

                <StyledTypography
                  color="#0083C0"
                  fontSize="20px"
                  align="center"
                  fontWeight="600"
                  lineHeight="24px"
                  padding="0 0 20px 0"
                >
                  Login to your Account
                </StyledTypography>
                {loginPageData?.Data?.ADData?.ADRequired &&
                  isADIdentityProvider &&
                  loginPageData?.Data?.ADData?.ADIdentityProvider ===
                    'Azure' && (
                    <FlexContainer flexDirection="column" padding="0 0 20px 0">
                      <StyledTypography
                        variant="body2"
                        textAlign="center"
                        marginBottom="10px"
                        fontSize="14px"
                        color="#000000"
                      >
                        Please select company
                      </StyledTypography>
                      <Dropdown
                        label={'Company'}
                        value={loginCompany}
                        options={loginPageData?.Data?.CompanyList?.map(
                          (company) => ({
                            text: company?.CompanyName,
                            value: company?.CompanyCode,
                          })
                        )}
                        onChange={handleOnChange}
                      />
                    </FlexContainer>
                  )}
                {(loginPageData?.Data?.ADData?.ADIdentityProvider === 'DB' ||
                  !isADIdentityProvider) && (
                  <Grid container spacing={2} justifyContent="flex-end">
                    <Grid item xs={12} sx={{ display: 'flex' }}>
                      <StyledImage
                        src={UserIcon}
                        alt="User Icon"
                        style={{ padding: '0 10px 0 0' }}
                      />
                      <StyledTextField
                        autoFocus
                        onKeyDown={handleEnterKeyDown}
                        placeholder="Employee ID"
                        fullWidth
                        disabled={otp !== ''}
                        value={employeeID}
                        slotProps={{ htmlInput: { maxLength: 100 } }}
                        onChange={(e) => setEmployeeID(e.target.value)}
                        sx={{
                          '& .MuiInputBase-input::placeholder': {
                            color: '#444444',
                            fontSize: '14px',
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex' }}>
                      <StyledImage
                        src={LockIcon}
                        alt="Lock Icon"
                        style={{ padding: '0 10px 0 0' }}
                      />
                      <StyledTextField
                        onKeyDown={handleEnterKeyDown}
                        placeholder="Password"
                        sx={{
                          '& .MuiInputBase-input::placeholder': {
                            color: '#444444',
                            fontSize: '14px',
                            fontWeight: 500,
                            lineHeight: '16.8px',
                            textAlign: 'left',
                            fontFamily: 'Lato',
                          },
                        }}
                        disabled={otp !== ''}
                        fullWidth
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        slotProps={{ htmlInput: { maxLength: 100 } }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                              >
                                <img
                                  src={showPassword ? VisibilityOff : EyeIcon}
                                  style={{ width: '22px', height: '15px' }}
                                  alt="Toggle Password Visibility"
                                />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    {((!otpEnable && otp == '') ||
                      (!isADIdentityProvider && !otpEnable && otp == '')) && (
                      <FlexContainer
                        justifyContent="right"
                        margin="10px 0 0"
                        color="#0083C0"
                        fontWeight="500"
                      >
                        <StyledLink
                          id="forgotPassword"
                          onKeyDown={handleEnterKeyDown}
                          onClick={handleForgotPasswordClick}
                          tabIndex={0}
                        >
                          Forgot Password?
                        </StyledLink>
                        <ForgotPasswordPopup
                          open={open}
                          onClose={() => setOpen(false)}
                        />
                      </FlexContainer>
                    )}
                    {((!otpEnable && otp == '') ||
                      (!isADIdentityProvider && !otpEnable && otp == '')) && (
                      <Grid
                        item
                        xs={12}
                        style={{ display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <StyledButton
                          id="loginButton"
                          width={isMobile ? '100%' : '80%'}
                          height="48px"
                          onClick={handleSubmit}
                          onKeyDown={handleEnterKeyDown}
                          disabled={!employeeID || !password}
                        >
                          {loading && (
                            <CircularProgress
                              size={25}
                              color="inherit"
                              style={{ marginRight: 10 }}
                            />
                          )}
                          Login
                        </StyledButton>
                      </Grid>
                    )}
                    {otpEnable && mailTwoFactorAuthentication && (
                      <Grid item xs={10} md={10} lg={10}>
                        <StyledTextField
                          placeholder="Enter OTP"
                          fullWidth
                          value={otpValue}
                          slotProps={{ htmlInput: { maxLength: 8 } }}
                          onChange={(e) => setOtpValue(e.target.value)}
                          sx={{
                            '& .MuiInputBase-input::placeholder': {
                              color: '#444444',
                              fontSize: '14px',
                            },
                          }}
                        />
                      </Grid>
                    )}
                    {otpEnable && mailTwoFactorAuthentication && (
                      <Grid item xs={12} md={10}>
                        <Grid
                          item
                          xs={12}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: '2px',
                          }}
                        >
                          <StyledButton
                            width={isMobile ? '70%' : '45%'}
                            height="45px"
                            onClick={handleSubmit}
                            disabled={!otpValue}
                          >
                            Submit
                          </StyledButton>
                          <StyledButton
                            width={isMobile ? '70%' : '45%'}
                            height="45px"
                            onClick={() => dispatch(logout())}
                          >
                            Cancel
                          </StyledButton>
                        </Grid>
                      </Grid>
                    )}
                    <Grid item xs={12}>
                      <StyledTypography
                        color="red"
                        fontSize="16px"
                        align="center"
                        fontWeight="300"
                        lineHeight="20px"
                        padding="0 0 1px 0"
                      >
                        {isError ? errorMessage : ''}
                      </StyledTypography>
                    </Grid>
                  </Grid>
                )}

                <FlexContainer
                  justifyContent="space-between"
                  gap="10px"
                  margin="20px 0 !important"
                  flexWrap="wrap"
                >
                  {loginPageData?.Data?.ADData?.ADIdentityProvider ===
                    'Windows' &&
                    isADIdentityProvider && (
                      <CustomButton
                        startIcon={<img src={MicrosoftIcon} alt="Microsoft" />}
                        sx={{
                          width: '100%',
                          height: '50px',
                          borderRadius: '25px',
                          border: '1px solid #d3d3d3',
                          backgroundColor: 'transparent',
                          fontWeight: 500,
                          fontSize: '11px',
                          display: 'flex',
                          gap: 1,
                          justifyContent: 'center',
                          color: '#747272',
                        }}
                      >
                        Sign in with Microsoft
                      </CustomButton>
                    )}
                  {loginPageData?.Data?.ADData?.ADIdentityProvider ===
                    'Azure' &&
                    isADIdentityProvider && (
                      <CustomButton
                        startIcon={<img src={AzureIcon} alt="Azure" />}
                        sx={{
                          width: '100%',
                          height: '50px',
                          borderRadius: '25px',
                          border: '1px solid #d3d3d3',
                          backgroundColor: 'transparent',
                          fontWeight: 500,
                          fontSize: '11px',
                          display: 'flex',
                          gap: 1,
                          justifyContent: 'center',
                          color: '#747272',
                        }}
                        disabled={!loginCompany}
                        onClick={handleAzureLogin}
                      >
                        Sign in with Azure
                      </CustomButton>
                    )}
                </FlexContainer>
              </FlexContainer>
            </Grid>
          </Grid>
        )}
      </StyledFlexContainer>
    </CustomScrollbars>
  );
};

export default LoginPage;
