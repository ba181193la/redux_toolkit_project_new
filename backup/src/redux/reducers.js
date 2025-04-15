import { combineReducers } from 'redux';
import authReducer from './features/auth/authSlice';
import wrongLoginAttemptsReducer from './features/auth/wrongLoginAttemptsSlice';
import staffMasterReducer from './features/mainMaster/staffMasterSlice';
import opinionReducer from './features/mainMaster/opinionSlice';
import userAssignmentReducer from './features/mainMaster/userAssignmentSlice';
import applicationRoleReducer from './features/mainMaster/applicationRoleSlice';
import notificationMasterReducer from './features/mainMaster/notificationMasterSlice';
import departmentMasterReducer from './features/mainMaster/departmentMasterSlice';
import staffSubMasterReducer from './features/mainMaster/staffSubMasterSlice';
import contactInformationReducer from './features/mainMaster/contactInformationSlice';
import pageUtilitiesReducer from './features/mainMaster/pageUtilitiesSlice';
import commonReducer from './features/common/commonSlice';
import passwordManagementReducer from './features/mainMaster/passwordManagementSlice';
import mailLogReducer from './features/mainMaster/mailLogSlice';
import groupConfigReducer from './features/mainMaster/groupConfigSlice';
import adMasterReducer from './features/mainMaster/adMasterSlice';
import auditLogReducer from './features/mainMaster/auditLogSlice';
import userStaffReducer from './features/mainMaster/userStaffSlice';
import incidentRiskLevelReducer from './features/mainMaster/incidentRiskLevelSlice';
import landingPageReducer from './features/home/landingPageSlice';
import reportIncidentReducer from './features/IncidentManagement/reportIncidentSlice'
import incidentSubMasterReducer from './features/IncidentManagement/incidentSubMasterSlice';
import incidentCategoryReducer from './features/IncidentManagement/incidentCategorySlice';
import investigationApprovalReducer from './features/IncidentManagement/incidentInvestigationApprovalSlice';
import homePageSettingReducer from './features/mainMaster/homePageSettingSlice';
import staffDemographyReducer from './features/mainMaster/staffDemographySlice';
import resetPasswordReducer from './features/auth/resetPasswordSlice';
import incidentInvestigationSliceReducer from './features/mainMaster/incidentInvestigationSlice';
import incidentDashboardSliceReducer from './features/mainMaster/IncidentDashboardSlice';
import CustomReportsSliceReducer from './features/mainMaster/CustomReportsSlice';
import incidentApprovalSliceReducer from './features/mainMaster/incidentApprovalSlice';
import incidentClosureSliceReducer from './features/mainMaster/incidentClosureSlice';
import reportGeneratorReducer from './features/mainMaster/ReportGeneratorSlice';
import customDashboardSliceReducer from './features/mainMaster/CustomDashboardSlice';
import integrationLogReducer from './features/mainMaster/integrationLogSlice';

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
import { staffDemographyApi } from './RTK/staffDemographyApi';
import { searchIncidentApi } from './RTK/IncidentManagement/searchIncidentApi';
import searchIncidentReducer from './features/mainMaster/searchIncidentSlice';
import { resetPasswordApi } from './RTK/resetPasswordApi';
import ActionIncidentReducer from './features/mainMaster/ActionIncidentSlice';
import { homePageSettingsApi } from './RTK/homePageSettingsApi';
import { ActionsApi } from './RTK/IncidentManagement/ActionsApi';
import { incidentRcaAPI } from './RTK/IncidentManagement/incidentRcaAPI';
import incidentRcaSliceReducer from './features/mainMaster/incidentRcaSlice';
import { incidentClosureApi } from './RTK/incidentClosureApi';
import { incidentDashboardApi } from './RTK/IncidentManagement/IncidentDashboardApi';
import { customDashboardApi } from './RTK/IncidentManagement/CustomDashboardApi';
import { CustomReportsApi } from './RTK/IncidentManagement/CustomReportsApi';
import { integrationLogApi } from './RTK/integrationLogApi';

const appReducer = combineReducers({
  [moduleDataApi.reducerPath]: moduleDataApi.reducer,
  [userDataApi.reducerPath]: userDataApi.reducer,
  [staffMasterApi.reducerPath]: staffMasterApi.reducer,
  [incidentInvestigationApi.reducerPath]: incidentInvestigationApi.reducer,
  [userAssignmentApi.reducerPath]: userAssignmentApi.reducer,
  [applicationRoleApi.reducerPath]: applicationRoleApi.reducer,
  [departmentMasterApi.reducerPath]: departmentMasterApi.reducer,
  [staffSubMasterApi.reducerPath]: staffSubMasterApi.reducer,
  [mailCredentialApi.reducerPath]: mailCredentialApi.reducer,
  [pageUtilitiesApi.reducerPath]: pageUtilitiesApi.reducer,
  [notificationMasterApi.reducerPath]: notificationMasterApi.reducer,
  [formBuilderApi.reducerPath]: formBuilderApi.reducer,
  [passwordManagementApi.reducerPath]: passwordManagementApi.reducer,
  [mailLogApi.reducerPath]: mailLogApi.reducer,
  [groupConfigApi.reducerPath]: groupConfigApi.reducer,
  [adMasterApi.reducerPath]: adMasterApi.reducer,
  [auditLogApi.reducerPath]: auditLogApi.reducer,
  [loginApi.reducerPath]: loginApi.reducer,
  [contactInformationApi.reducerPath]: contactInformationApi.reducer,
  [licenseGenerateApi.reducerPath]: licenseGenerateApi.reducer,
  [incidentSubMasterApi.reducerPath]: incidentSubMasterApi.reducer,
  [incidentCategoryApi.reducerPath]: incidentCategoryApi.reducer,
  [reportIncidentApi.reducerPath]: reportIncidentApi.reducer,
  [incidentInvestigationApprovalApi.reducerPath]:
    incidentInvestigationApprovalApi.reducer,
  [incidentRiskLevelApi.reducerPath]: incidentRiskLevelApi.reducer,
  [incidentOpinionApi.reducerPath]: incidentOpinionApi.reducer,
  [incidentApprovalApi.reducerPath]: incidentApprovalApi.reducer,
  [searchIncidentApi.reducerPath]: searchIncidentApi.reducer,
  [ActionsApi.reducerPath]:ActionsApi.reducer,
  [incidentRcaAPI.reducerPath]: incidentRcaAPI.reducer,

  [landingPageApi.reducerPath]: landingPageApi.reducer,
  [homePageSettingsApi.reducerPath]: homePageSettingsApi.reducer,
  [resetPasswordApi.reducerPath]: resetPasswordApi.reducer,
  [staffDemographyApi.reducerPath]: staffDemographyApi.reducer,
  [incidentClosureApi.reducerPath]: incidentClosureApi.reducer,
  [incidentDashboardApi.reducerPath]: incidentDashboardApi.reducer,
  [customDashboardApi.reducerPath]: customDashboardApi.reducer,
  [CustomReportsApi.reducerPath]: CustomReportsApi.reducer,
  [integrationLogApi.reducerPath]: integrationLogApi.reducer,

  auth: authReducer,
  wrongLoginAttempts: wrongLoginAttemptsReducer,
  common: commonReducer,
  staffMaster: staffMasterReducer,
  userAssignment: userAssignmentReducer,
  applicationRole: applicationRoleReducer,
  notificationMaster: notificationMasterReducer,
  departmentMaster: departmentMasterReducer,
  staffSubMaster: staffSubMasterReducer,
  pageUtilites: pageUtilitiesReducer,
  passwordManagement: passwordManagementReducer,
  mailLog: mailLogReducer,
  groupConfig: groupConfigReducer,
  adMaster: adMasterReducer,
  auditLog: auditLogReducer,
  contactInformationMaster: contactInformationReducer,
  incidentRiskLevel: incidentRiskLevelReducer,
  reportIncident:reportIncidentReducer,
  opinion: opinionReducer,
  incidentSubMaster: incidentSubMasterReducer,
  IncidentCategory: incidentCategoryReducer,
  userStaff: userStaffReducer,
  investigationApproval: investigationApprovalReducer,
  landingPage: landingPageReducer,
  incidentInvestigation: incidentInvestigationSliceReducer,
  incidentDashboard: incidentDashboardSliceReducer,
  CustomDashboard: customDashboardSliceReducer,
  CustomReports: CustomReportsSliceReducer,
  searchIncident: searchIncidentReducer,
  ActionIncidentSlice: ActionIncidentReducer,
  incidentApproval: incidentApprovalSliceReducer,
  incidentRca: incidentRcaSliceReducer,
  landingPage: landingPageReducer,
  incidentSubMaster: incidentSubMasterReducer,
  homePageSetting: homePageSettingReducer,
  staffDemography: staffDemographyReducer,
  resetPassword: resetPasswordReducer,
  incidentClosure: incidentClosureSliceReducer,
  reportGenerator: reportGeneratorReducer,
  integrationLog: integrationLogReducer,
});

const rootReducer = (state, action) => {
  if (action.type === 'auth/logout') {
    state = { wrongLoginAttempts: state?.wrongLoginAttempts };
  }
  return appReducer(state, action);
};

export default rootReducer;
