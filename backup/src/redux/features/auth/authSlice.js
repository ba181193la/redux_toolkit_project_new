import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchData, postData } from '../../../services/baseService';
import {
  showToastAlert,
  showPasswordExpiryAlert,
} from '../../../utils/SweetAlert';
import { increment } from './wrongLoginAttemptsSlice';
import { decryptAES, encryptAES } from '../../../utils/Auth';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    sessionExpiryTime: null,
    employeeID: '',
    refreshToken: '',
    tokenExpiry: null,
    userDetails: null,
    roleFacilities: [],
    selectedFacility: null,
    regionCode: '',
    selectedRoleFacility: null,
    menuDetails: [],
    selectedMenu: null,
    licenseDetails: null,
    selectedModuleId: null,
    selectedLanguage: 'English',
    openMenus: {},
    isSuperAdmin: false,
    msalConfig: null,
    msalInstance: null,
    loginCompany: '',
    sessionExpirySeconds: null,
    isSwitchUser: false,
    isPreviousUser: null,
    isNewSwitchedUser: null,
    mailTwoFactorAuthentication: false,
    isWarning: true,
    otp: '',
    decryptedOtp: '',
    OTPFieldValidation: false,
    callAPIs: false,
    responseData: {},
  },
  reducers: {
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.sessionExpiryTime = null;
      state.error = null;
      state.loading = false;
    },
    setIsWarning: (state, { payload }) => {
      state.isWarning = payload;
    },
    setSelectedFacility: (state, { payload }) => {
      state.selectedFacility = { id: payload.id, name: payload.name };
      state.regionCode = payload.regionCode;
    },
    setSelectedRoleFacility: (state) => {
      state.selectedRoleFacility = state.roleFacilities?.find(
        (facility) => facility.FacilityId === state.selectedFacility?.id
      );
    },
    setSelectedMenu: (state, { payload }) => {
      state.selectedMenu = { id: payload.id, name: payload.name };
    },
    setSelectedModuleId: (state, { payload }) => {
      state.selectedModuleId = payload;
    },
    setSelectedlanguage: (state, { payload }) => {
      state.selectedLanguage = payload;
    },
    setOpenMenus: (state, { payload }) => {
      state.openMenus = payload;
    },
    setMsalConfig: (state, { payload }) => {
      state.msalConfig = payload;
    },
    setMsalInstance: (state, { payload }) => {
      state.msalInstance = payload;
    },
    setLoginCompany: (state, { payload }) => {
      state.loginCompany = payload;
    },
    setToken: (state, { payload }) => {
      state.token = payload;
    },
    setIsSwitchUser: (state, { payload }) => {
      state.isSwitchUser = payload;
    },
    setIsPreviousUser: (state, { payload }) => {
      state.isPreviousUser = payload;
    },
    setIsNewSwitchedUser: (state, { payload }) => {
      state.isNewSwitchedUser = payload;
    },
    setMailTwoFactorAuthentication: (state, { payload }) => {
      state.mailTwoFactorAuthentication = payload;
    },
    setOtp: (state, { payload }) => {
      state.otp = payload;
    },
    setDecryptedOtp: (state, { payload }) => {
      state.decryptedOtp = payload;
    },

    setOTPFieldValidation: (state, { payload }) => {
      state.OTPFieldValidation = payload;
    },

    setCallAPIs: (state, { payload }) => {
      state.callAPIs = payload;
    },

    setResponseData: (state, { payload }) => {
      state.responseData = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.otp = action.payload?.otp;
        state.token = action.payload?.accessToken;
        state.isAuthenticated = true;
        state.sessionExpiryTime =
          Date.now() + action.payload?.sessionExpiryTime;
        state.sessionExpirySeconds = action.payload?.sessionExpiryTime;
        state.tokenExpiry = action.payload?.tokenExpiry;
        state.employeeID = action.payload?.employeeID;
        state.refreshToken = action.payload?.refreshToken;
      })
      .addCase(fetchCalls.fulfilled, (state, action) => {
        state.loading = false;
        state.otp = action.payload?.otp;
        state.token = action.payload?.accessToken;
        state.isAuthenticated = true;
        state.sessionExpiryTime =
          Date.now() + action.payload?.sessionExpiryTime;
        state.sessionExpirySeconds = action.payload?.sessionExpiryTime;
        state.tokenExpiry = action.payload?.tokenExpiry;
        state.employeeID = action.payload?.employeeID;
        state.refreshToken = action.payload?.refreshToken;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = true;
        state.userDetails = action.payload;
        state.isSuperAdmin = action.payload?.ApplicableRoles?.some(
          (role) => role.RoleId === 1 || role.RoleId === 2
        );
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFacilityRBACDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFacilityRBACDetails.fulfilled, (state, action) => {
        state.loading = true;
        state.roleFacilities = action.payload.facilities;
      })
      .addCase(fetchFacilityRBACDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMenuDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenuDetails.fulfilled, (state, action) => {
        state.loading = true;
        state.menuDetails = action.payload.menuDetails;
      })
      .addCase(fetchMenuDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchLicenseDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLicenseDetails.fulfilled, (state, action) => {
        state.loading = true;
        state.licenseDetails = action.payload;
      })
      .addCase(fetchLicenseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

const getPayload = (provider, credentials, IsAccreAdmin) => {
  switch (provider) {
    case 'DB':
      return {
        employeeID: credentials.employeeID,
        password: credentials.password,
        IsAccreAdmin: IsAccreAdmin,
      };
    case 'Windows':
      return {
        adUserLogonName: credentials.adUserLogonName,
        password: credentials.password,
        IsAccreAdmin: IsAccreAdmin,
      };
    case 'Azure':
      return {
        mailId: credentials.mailId,
        IsAccreAdmin: IsAccreAdmin,
      };
    default:
      throw new Error('Unsupported provider');
  }
};

export const fetchCalls = createAsyncThunk(
  '',
  async ({}, { dispatch, rejectWithValue, getState }) => {
    const state = getState();
    await dispatch(
      fetchUserDetails({
        employeeID: state.auth.responseData.Data?.[0]?.EmployeeId,
        token: state.auth.responseData?.AccessToken,
      })
    );
    return {
      accessToken: state.auth.responseData?.AccessToken,
      tokenExpiry: state.auth.responseData.ExpiryDate,
      employeeID: state.auth.responseData.Data?.[0]?.EmployeeId,
      refreshToken: state.auth.responseData.RefreshTok,
      sessionExpiryTime: state.auth.responseData.SessionTimeout,
    };
  }
);
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    { credentials, provider, employeeID, IsAccreAdmin },
    { dispatch, rejectWithValue, getState }
  ) => {
    const state = getState();
    const wrongAttempts = state.wrongLoginAttempts[employeeID] || 0;
    const secretKey = process.env.REACT_APP_SECRET_KEY;
    const generateOTP = () => {
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let otp = '';
      for (let i = 0; i < 8; i++) {
        otp += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      const encryptedOtp = encryptAES(otp, secretKey);
      // dispatch(setCheckOTP(otp))
      dispatch(setOtp(otp));
      return encryptedOtp;
    };
    try {
      const payload = getPayload(provider, credentials, IsAccreAdmin);
      const response = await postData('/Login/Login', '', payload);
      dispatch(setResponseData(response));
      if (!response?.Data) {
        if (provider === 'DB') await dispatch(increment(employeeID));
        await dispatch(logout());
        if (wrongAttempts <= 1) {
          showToastAlert({ type: 'custom_error', text: response?.Message });
        }
        return rejectWithValue(response?.Message);
      }
      const state = getState();
      if (
        state.auth.mailTwoFactorAuthentication &&
        response?.Status === 'Success'
      ) {
        if (
          response?.Status === 'Success' &&
          state.auth.mailTwoFactorAuthentication
        ) {
          const OTPValue = generateOTP();
          const otpResponse = await postData(
            '/Login/TriggerOTPMail',
            response.AccessToken,
            {
              EmployeeId: response.Data[0].EmployeeId,
              OTP: OTPValue,
            }
          );

          if (otpResponse?.Status === 'Success') {
          } else {
            showToastAlert({
              type: 'custom_error',
              text: otpResponse?.Message,
            });
          }
          state.auth.isAuthenticated = false;
          return Promise.resolve();
        }
      } else {
        if (response?.Passwordflag) {
          const empId = btoa(response.Data[0].EmployeeId);
          showPasswordExpiryAlert({
            link: response?.ResetLink,
            userId: empId,
          });
          state.auth.isAuthenticated = false;
        } else {
          await dispatch(
            fetchUserDetails({
              employeeID: response.Data?.[0]?.EmployeeId,
              token: response?.AccessToken,
            })
          );

          return {
            accessToken: response?.AccessToken,
            tokenExpiry: response.ExpiryDate,
            employeeID: response.Data?.[0]?.EmployeeId,
            refreshToken: response.RefreshTok,
            sessionExpiryTime: response.SessionTimeout,
          };
        }
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  'auth/fetchUserDetails',
  async ({ employeeID, token }, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetchData(
        `/Login/getUserDetail/${employeeID}`,
        token
      );

      await dispatch(
        fetchFacilityRBACDetails({
          employeeID,
          token,
        })
      );
      await dispatch(fetchMenuDetails({ employeeID, token }));
      await dispatch(
        fetchLicenseDetails({
          companyCode: response?.Data?.CompanyCode,
          token,
        })
      );
      return {
        ...response?.Data,
      };
    } catch (error) {
      dispatch(logout());
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchLicenseDetails = createAsyncThunk(
  'auth/fetchLicenseDetails',
  async ({ companyCode, token }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const response = await fetchData(
        `/Login/getLicenseDetail/${companyCode}`,
        token
      );
      return {
        ...response?.Data,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchFacilityRBACDetails = createAsyncThunk(
  'auth/getFacilityRBAC',
  async ({ employeeID, token }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const response = await fetchData(
        `/Login/getFacilityRBAC/${employeeID}`,
        token
      );

      return {
        facilities: response?.Data?.Facilities,
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchMenuDetails = createAsyncThunk(
  'auth/getMenuDetails',
  async ({ employeeID, token }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const response = await fetchData(
        `/Login/getAllMenu?EmployeeId=${employeeID}`,
        token
      );
      return {
        menuDetails: response?.Data || [],
      };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const {
  logout,
  setSelectedFacility,
  setSelectedRoleFacility,
  useFetchSwitchUserDetailsQuery,
  setSelectedMenu,
  setIsNewSwitchedUser,
  setSelectedModuleId,
  setSelectedlanguage,
  setOpenMenus,
  setMsalConfig,
  setMsalInstance,
  setLoginCompany,
  setToken,
  setOtp,
  setIsSwitchUser,
  setMailTwoFactorAuthentication,
  setIsPreviousUser,
  setDecryptedOtp,
  setOTPFieldValidation,
  setCallAPIs,
  setResponseData,
  setIsWarning,
} = authSlice.actions;
export default authSlice.reducer;
