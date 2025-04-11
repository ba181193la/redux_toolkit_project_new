import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers';
import { moduleDataApi } from './RTK/moduleDataApi';
import { staffMasterApi } from './RTK/staffMasterApi';
import { userAssignmentApi } from './RTK/userAssignmentApi';
import { applicationRoleApi } from './RTK/applicationRoleApi';
import { departmentMasterApi } from './RTK/departmentMasterApi';
import { staffSubMasterApi } from './RTK/staffSubMasterApi';
import { mailCredentialApi } from './RTK/mailCredentialApi';
import { pageUtilitiesApi } from './RTK/pageUtilitiesApi';
import { notificationMasterApi } from './RTK/notificationMasterApi';
import { formBuilderApi } from './RTK/formBuilderApi';
import { passwordManagementApi } from './RTK/passwordManagementApi';
import { mailLogApi } from './RTK/mailLogApi';
import { groupConfigApi } from './RTK/groupConfigApi';
import { adMasterApi } from './RTK/adMasterApi';
import { auditLogApi } from './RTK/auditLogApi';
import { loginApi } from './RTK/loginApi';
import { contactInformationApi } from './RTK/contactInformationApi';
import { licenseGenerateApi } from './RTK/licenseGenerateApi';
import { incidentSubMasterApi } from './RTK/IncidentManagement/incidentSubMasterApi';
import { incidentCategoryApi } from './RTK/IncidentManagement/incidentCategoryApi';
import { reportIncidentApi } from './RTK/IncidentManagement/reportincidentApi';
import { incidentInvestigationApprovalApi } from './RTK/IncidentManagement/incidentInvestigationApprovalApi';
import { landingPageApi } from './RTK/home/landingPageApi';
import { incidentRiskLevelApi } from './RTK/incidentRiskLevelApi';
import { incidentOpinionApi } from './RTK/IncidentOinionApi';
import { userDataApi } from './RTK/userDataApi';
import { incidentApprovalApi } from './RTK/IncidentManagement/incidentApprovalApi';
import { incidentInvestigationApi } from './RTK/incidentInvestigationApi';
import { incidentDashboardApi } from './RTK/IncidentManagement/IncidentDashboardApi';
import { CustomReportsApi } from './RTK/IncidentManagement/CustomReportsApi';
import { searchIncidentApi } from './RTK/IncidentManagement/searchIncidentApi';
import { ActionsApi } from './RTK/IncidentManagement/ActionsApi';

import { homePageSettingsApi } from './RTK/homePageSettingsApi';
import { resetPasswordApi } from './RTK/resetPasswordApi';

import { reportGeneratorApi } from './RTK/reportGeneratorApi';

import { staffDemographyApi } from './RTK/staffDemographyApi';
import { incidentRcaAPI } from './RTK/IncidentManagement/incidentRcaAPI';
import { incidentClosureApi } from './RTK/incidentClosureApi';
import { customDashboardApi } from './RTK/IncidentManagement/CustomDashboardApi';
import { integrationLogApi } from './RTK/integrationLogApi';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [
    'auth',
    'wrongLoginAttempts',
    'staffMaster',
    'userAssignment',
    'applicationRole',
    'department',
    'locationType',
    'designation',
    'departmentGroup',
    'staffSubMaster',
    'contactInformationMaster',
    'common',
    'mailCredential',
    'pageUtilities',
    'passwordManagement',
    'notificationMaster',
    'mailLog',
    'groupConfig',
    'adMaster',
    'auditLog',
    'licenseGenerate',
    'incidentSubMaster',
    'incidentCategory',
    'staffMaster',
    'incidentInvestigationApproval',
    'incidentRiskLevel',
    'incidentOpinion',
    'staffDemography',
    'resetPassword',
    'reportGenerator',
    'integrationLog'
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(moduleDataApi.middleware)
      .concat(userDataApi.middleware)
      .concat(incidentApprovalApi.middleware)
      .concat(searchIncidentApi.middleware)
      .concat(incidentRcaAPI.middleware)
      .concat(ActionsApi.middleware)
      .concat(incidentClosureApi.middleware)
      .concat(customDashboardApi.middleware)
      .concat(staffMasterApi.middleware)
      .concat(userAssignmentApi.middleware)
      .concat(incidentInvestigationApi.middleware)
      .concat(incidentDashboardApi.middleware)
      .concat(CustomReportsApi.middleware)
      .concat(applicationRoleApi.middleware)
      .concat(mailCredentialApi.middleware)
      .concat(notificationMasterApi.middleware)
      .concat(departmentMasterApi.middleware)
      .concat(staffSubMasterApi.middleware)
      .concat(pageUtilitiesApi.middleware)
      .concat(formBuilderApi.middleware)
      .concat(loginApi.middleware)
      .concat(passwordManagementApi.middleware)
      .concat(mailLogApi.middleware)
      .concat(groupConfigApi.middleware)
      .concat(adMasterApi.middleware)
      .concat(auditLogApi.middleware)
      .concat(contactInformationApi.middleware)
      .concat(licenseGenerateApi.middleware)
      .concat(reportIncidentApi.middleware)
      .concat(landingPageApi.middleware)
      .concat(incidentSubMasterApi.middleware)
      .concat(reportIncidentApi.middleware)
      .concat(incidentRiskLevelApi.middleware)
      .concat(incidentOpinionApi.middleware)
      .concat(homePageSettingsApi.middleware)
      .concat(incidentCategoryApi.middleware)
      .concat(reportIncidentApi.middleware)
      .concat(incidentInvestigationApprovalApi.middleware)
      .concat(reportIncidentApi.middleware)
      .concat(resetPasswordApi.middleware)
      .concat(reportGeneratorApi.middleware)
      .concat(staffDemographyApi.middleware)
      .concat(integrationLogApi.middleware)
      
});

export const persistor = persistStore(store);
