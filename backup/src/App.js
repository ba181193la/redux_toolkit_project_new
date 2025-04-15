import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainContent from './components/MainContent/MainContent';
import LoadingGif from './assets/Gifs/LoadingGif.gif';
import {
  LandingPage,
  Login,
  StaffMaster,
  ReportIncident,
  EmailEditor,
  MailCredendial,
  AddNewStaffMaster,
  ChangePassword,
  FormBuilder,
  DepartmentMaster,
  ContactInfo,
  UserAssignment,
  NewUserAssignment,
  NotificationMaster,
  PageUtilities,
  ApplicationRoles,
  AddNewApplicationRole,
  NotificationMasterList,
  DepartmentGroup,
  StaffSubMaster,
  MailLogList,
  AuditLogList,
  UserSessionLogList,
  ApprovalList,
  PasswordManagement,
  GroupConfiguration,
  IC_IncidentClosure,
  ContactInformationMaster,
  LicenseGenerator,
  IncidentInvestigation,
  AdMaster,
  CompleteDetailClosure,
  DraftedDetailClosure,
  PendingDetailClosure,
  DeletedIncidentTable,
  SearchDeleteDetail,
  SearchSubmitDetail,
  ReportNewIncident,
  PendingDetailApproval,
  HomePageSettings,
  OrganizationLevel,
  OrganizationLevelFavDetails,
  UserLevel,
  UserLevelFavDetails,
  BriefIncident,
  IncidentSubMaster,
  IncidentTypeReorder,
  IncidentCategory,
  JwadaIncidentLevelReorder,
  MainCategoryQuestions,
  SubCategoryQuestions,
  IncidentDetailQuestions,
  IncidentInvestigationApproval,
  InvestigationApprovalPending,
  InvestigationApprovalCompleted,
  ActionList,
  RootCauseAnalyses,
  HarmLevelReorder,
  MedicationHarmLevelReorder,
  LevelOfNegligenceReorder,
  ExternalBodyReorder,
  IncidentRisklevelCalculation,
  ReorderTable,
  ConsequenceLevelReorder,
  LikelihoodReorder,
  IncidentRiskLevelReorder,
  ConsequenceReorder,
  IncidentNotificationMasterList,
  IncidentNotificationMaster,
  Opinions,
  OpinionEntry,
  CompletedOpinionEntry,
  MainFactorReorder,
  SubFactorReorder,
  RCAQuestionsReorder,
  ResetPassword,
  StaffDemographySubMaster,
  StaffDemography,
  ReportGenerator,
  IntegrationLog
} from './components/MainContent/ImportStatements';
import ProtectedRoute from './components/MainContent/ProtectedRoute';
import { FlexContainer, StyledImage } from './utils/StyledComponents';
import { CircularProgress } from '@mui/material';
import ActionPending from './features/IncidentManagement/IncidentApproval/CompletedList/CompletedActionPending';
import IC_Pending_EditAction from './features/IncidentManagement/IncidentClosure/Pending/IC_Pending_EditAction';
import II_PendingList_Edit from './features/IncidentManagement/IncidentInvestigation/InvestigationPending/II_PendingList_Edit';
import II_Completed_ViewButton from './features/IncidentManagement/IncidentInvestigation/InvestigationCompleted/II_Completed_ViewButton';
import { useIdleTimer } from 'react-idle-timer';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from './redux/features/auth/authSlice';
import { setGroupConfigData } from './redux/features/mainMaster/groupConfigSlice';
import { useLazyRegenerateTokenQuery } from './redux/RTK/loginApi';
import { useGetGroupConfigDataQuery } from './redux/RTK/groupConfigApi';
import SearchIncident from './features/IncidentManagement/SearchIncident/SearchIncident';
import NotFoundPage from './components/NotFoundPage/NotFoundPage';
import DeletedIncidentDetail from './features/IncidentManagement/SearchIncident/DeletedIncident/DeletedIncidentDetail';
import EditSubmittedByMe from './features/IncidentManagement/SearchIncident/SubmittedByMe/EditSubmittedByMe';

import SubmittedDetailTable from './features/IncidentManagement/SearchIncident/SubmittedByMe/SubmittedDetailTable';
import RejectDetail from './features/IncidentManagement/IncidentApproval/RejectedList/RejectDetail';
import CompleteDetail from './features/IncidentManagement/IncidentClosure/Completed/CompleteDetail';
import EditActionPendingClosure from './features/IncidentManagement/IncidentClosure/Pending/IC_Pending_EditAction';
import ClosureCompleted from './features/IncidentManagement/IncidentClosure/Completed/IC_CompletedPage';
import PendingApproval from './features/IncidentManagement/IncidentApproval/PendingList/PendingApproval';
import II_Rejected_EditButton from './features/IncidentManagement/IncidentInvestigation/InvestigationRejected/II_Rejected_EditButton';
import IC_Completed_ViewAction from './features/IncidentManagement/IncidentClosure/Completed/IC_Completed_ViewAction';
import IC_DraftedEditButton from './features/IncidentManagement/IncidentClosure/Drafted/IC_DraftedEditButton';

import RcaEntry from './features/IncidentManagement/Root Cause Analysis/PendingList/Entry/Entry';
import PreviewIncidentRCA from './features/IncidentManagement/Root Cause Analysis/PendingList/Entry/PreviewIncidentRCA';
import RcaView from './features/IncidentManagement/Root Cause Analysis/Completed/ViewData/PreviewIncidentRCA';
import DraftEntry from './features/IncidentManagement/Root Cause Analysis/Drafted/Entry/Entry';

import DetailSubmittedTableEntry from './features/IncidentManagement/SearchIncident/SubmittedByMe/DetailedSubmittedEntry';
import DetailAllincidentTableEntry from './features/IncidentManagement/SearchIncident/AllIncident/DetailedAllincidentEntry';
import SearchIncidentEntry_Deleted from './features/IncidentManagement/SearchIncident/DeletedIncident/DetailDeleted';
import EntryClosurePending from './features/IncidentManagement/IncidentClosure/Pending/EntryClosurePending';
import EntryClosureDraft from './features/IncidentManagement/IncidentClosure/Drafted/EntryClosureDraft';
import EntryClosureCompleted from './features/IncidentManagement/IncidentClosure/Completed/EntryClosureCompleted';
import EditClosureEntry from './features/IncidentManagement/IncidentClosure/Completed/EditClosureEntry';

import IncidentDashBoard from './features/IncidentManagement/IncidentDashboardFilter/IncidentDashBoard';
import { CustomReports } from './features/IncidentManagement/CustomReports/CustomReports';
import { CustomDashboard } from './features/IncidentManagement/CustomDashboard/CustomDashboard';
import ChartView from './features/IncidentManagement/CustomDashboard/CustomDashboardCharts/ChartView';

const App = () => {
  const dispatch = useDispatch();
  const {
    sessionExpirySeconds,
    employeeID,
    isAuthenticated,
    sessionExpiryTime,
    selectedMenu,
    selectedFacility,
    userDetails,
  } = useSelector((state) => state.auth);
  const [triggerRegenerateToken] = useLazyRegenerateTokenQuery();

  const { data: pageLoadData, refetch = { loadAppData } } =
    useGetGroupConfigDataQuery({
      menuId: selectedMenu?.id || 4,
      loginUserId: userDetails?.UserId,
      headerFacilityId: selectedFacility?.id,
    });
  const handleOnIdle = () => {
    dispatch(logout());
  };

  const handleOnActive = async () => {
    if (
      isAuthenticated &&
      sessionExpiryTime &&
      Date.now() > sessionExpiryTime
    ) {
      const response = await triggerRegenerateToken({ employeeID });
    }
  };

  useIdleTimer(
    sessionExpirySeconds && sessionExpirySeconds > 0
      ? {
          timeout: sessionExpirySeconds,
          onIdle: handleOnIdle,
          onActive: handleOnActive,
          debounce: 500,
          promptBeforeIdle: 0,
        }
      : {}
  );

  useEffect(() => {
    const configVal = pageLoadData?.Data?.GroupConfig?.[0] || {};
    dispatch(setGroupConfigData(configVal));
    if (pageLoadData) {
      refetch();
    }
  }, [pageLoadData]);
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <FlexContainer
            height="100%"
            justifyContent="center"
            alignItems="center"
          >
            {/* <CircularProgress
              size={25}
              color="primary"
              style={{ marginRight: 10 }}
            /> */}
            <FlexContainer justifyContent="center">
              <StyledImage src={LoadingGif} alt="LoadingGif" />
            </FlexContainer>
          </FlexContainer>
        }
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/login/BriefIncident" element={<BriefIncident />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          <Route path="/ResetPassword/:id" element={<ResetPassword />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainContent />
              </ProtectedRoute>
            }
          >
            {/* MainMaster Routes */}
            <Route
              index
              element={
                <ProtectedRoute>
                  <LandingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/StaffMaster"
              element={
                <ProtectedRoute>
                  <StaffMaster />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/DepartmentMaster"
              element={
                <ProtectedRoute>
                  <DepartmentMaster />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ChangePassword"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />

            <Route
              path="/MainMaster/DepartmentGroup"
              element={
                <ProtectedRoute>
                  <DepartmentGroup />
                </ProtectedRoute>
              }
            />
            <Route
              path="/email-editor"
              element={
                <ProtectedRoute>
                  <EmailEditor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/form-builder"
              element={
                <ProtectedRoute>
                  <FormBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/form-builder/:id"
              element={
                <ProtectedRoute>
                  <FormBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/Contact Information Master"
              element={
                <ProtectedRoute>
                  <ContactInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/MailCredential"
              element={
                <ProtectedRoute>
                  <MailCredendial />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/AddNewStaffMaster"
              element={
                <ProtectedRoute>
                  <AddNewStaffMaster />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/StaffSubMaster"
              element={
                <ProtectedRoute>
                  <StaffSubMaster />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/AddNewStaffMaster/:id"
              element={
                <ProtectedRoute>
                  <AddNewStaffMaster />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/UserAssignment"
              element={
                <ProtectedRoute>
                  <UserAssignment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/NewUserAssignment"
              element={
                <ProtectedRoute>
                  <NewUserAssignment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/NotificationMaster"
              element={
                <ProtectedRoute>
                  <NotificationMasterList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/NotificationMaster"
              element={
                <ProtectedRoute>
                  <IncidentNotificationMasterList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/EditNotificationMaster/:id"
              element={
                <ProtectedRoute>
                  <NotificationMaster />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/EditNotificationMaster/:id"
              element={
                <ProtectedRoute>
                  <IncidentNotificationMaster />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/PageUtilities"
              element={
                <ProtectedRoute>
                  <PageUtilities />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/ContactInformationMaster"
              element={
                <ProtectedRoute>
                  {userDetails?.StaffCategoryId === 1 ||
                  userDetails?.StaffCategoryId === 2 ? (
                    <ContactInformationMaster />
                  ) : (
                    <LandingPage />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/ApplicationRoles"
              element={
                <ProtectedRoute>
                  <ApplicationRoles />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/PasswordManagement"
              element={
                <ProtectedRoute>
                  <PasswordManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/AddNewRole"
              element={
                <ProtectedRoute>
                  <AddNewApplicationRole />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/AddNewRole/:id"
              element={
                <ProtectedRoute>
                  <AddNewApplicationRole />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/LicenseGenerator"
              element={
                <ProtectedRoute>
                  {userDetails?.StaffCategoryId === 1 ? (
                    <LicenseGenerator />
                  ) : (
                    <LandingPage />
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/AddNewContactInfo"
              element={
                <ProtectedRoute>
                  <ContactInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/AddNewContactInfo/:id"
              element={
                <ProtectedRoute>
                  <ContactInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/MailLog"
              element={
                <ProtectedRoute>
                  <MailLogList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/NewUserAssignment/:id"
              element={
                <ProtectedRoute>
                  <NewUserAssignment />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/ADMaster"
              element={
                <ProtectedRoute>
                  <AdMaster />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/AuditLog"
              element={
                <ProtectedRoute>
                  <AuditLogList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/AuditLog/UserSessionLogList"
              element={
                <ProtectedRoute>
                  <UserSessionLogList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/GroupConfiguration"
              element={
                <ProtectedRoute>
                  <GroupConfiguration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/MailLog"
              element={
                <ProtectedRoute>
                  <MailLogList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/HomePageSettings"
              element={
                <ProtectedRoute>
                  <HomePageSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/HomePageSettings/OrganizationLevel"
              element={
                <ProtectedRoute>
                  <OrganizationLevel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/HomePageSettings/OrganizationLevelFavDetails"
              element={
                <ProtectedRoute>
                  <OrganizationLevelFavDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/HomePageSettings/UserLevel"
              element={
                <ProtectedRoute>
                  <UserLevel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/HomePageSettings/UserLevelFavDetails"
              element={
                <ProtectedRoute>
                  <UserLevelFavDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/StaffDemography"
              element={
                <ProtectedRoute>
                  <StaffDemography />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/ReportGenerator"
              element={
                <ProtectedRoute>
                  <ReportGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/MainMaster/StaffDemography/SubMaster"
              element={
                <ProtectedRoute>
                  <StaffDemographySubMaster />
                </ProtectedRoute>
              }
            />
             <Route
              path="/MainMaster/IntegrationLog"
              element={
                <ProtectedRoute>
                  <IntegrationLog />
                </ProtectedRoute>
              }
            />
            {/* Incident management Routes */}
            <Route
              path="/IncidentManagement/IncidentSubMaster"
              element={
                <ProtectedRoute>
                  <IncidentSubMaster />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/ReorderIncidentType"
              element={
                <ProtectedRoute>
                  <IncidentTypeReorder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/ReorderHarmLevel"
              element={
                <ProtectedRoute>
                  <HarmLevelReorder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/ReorderMedicationHarmLevel"
              element={
                <ProtectedRoute>
                  <MedicationHarmLevelReorder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/ReorderMainFactor"
              element={
                <ProtectedRoute>
                  <MainFactorReorder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/ReorderSubFactor"
              element={
                <ProtectedRoute>
                  <SubFactorReorder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/ReorderRCAQuestion"
              element={
                <ProtectedRoute>
                  <RCAQuestionsReorder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/ReorderLevelOfNegligence"
              element={
                <ProtectedRoute>
                  <LevelOfNegligenceReorder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/ReorderExternalBody"
              element={
                <ProtectedRoute>
                  <ExternalBodyReorder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/ReorderJawdaIncidentLevel"
              element={
                <ProtectedRoute>
                  <JwadaIncidentLevelReorder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/IncidentCategory"
              element={
                <ProtectedRoute>
                  <IncidentCategory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/MainCategoryQuestions"
              element={
                <ProtectedRoute>
                  <MainCategoryQuestions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/SubCategoryQuestions"
              element={
                <ProtectedRoute>
                  <SubCategoryQuestions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/IncidentDetailQuestions"
              element={
                <ProtectedRoute>
                  <IncidentDetailQuestions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/IncidentApprovalCompleted/:id"
              element={
                <ProtectedRoute>
                  <ActionPending />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/IncidentApprovalEntry/:id"
              element={
                <ProtectedRoute>
                  <PendingApproval />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/IncidentApprovalRejected/:id"
              element={
                <ProtectedRoute>
                  <RejectDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/RootCauseAnalysis"
              element={
                <ProtectedRoute>
                  <RootCauseAnalyses />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/RootCauseAnalysisEntry/:id/:rcaid"
              element={
                <ProtectedRoute>
                  <RcaEntry />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/RootCauseAnalysisView/:id/:rcaid"
              element={
                <ProtectedRoute>
                  <RcaView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/RootCauseAnalysisDraftEntry/:id/:rcaid"
              element={
                <ProtectedRoute>
                  <DraftEntry />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/RootCauseAnalysisEntry/:id/:rcaid/PreviewIncidentRCA"
              element={
                <ProtectedRoute>
                  <PreviewIncidentRCA />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/RootCauseAnalysisDraftEntry/:id/:rcaid/PreviewIncidentRCA"
              element={
                <ProtectedRoute>
                  <PreviewIncidentRCA />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/IncidentPendingDetail"
              element={
                <ProtectedRoute>
                  <EditActionPendingClosure />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/IncidentCompleted"
              element={
                <ProtectedRoute>
                  <CompleteDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/ReportIncident"
              element={
                <ProtectedRoute>
                  <ReportIncident />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/ReportIncident/ReportNewIncident/:id"
              element={
                <ProtectedRoute>
                  <ReportNewIncident />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/ReportIncident/ReportNewIncident"
              element={
                <ProtectedRoute>
                  <ReportNewIncident />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/IncidentApproval"
              element={
                <ProtectedRoute>
                  <ApprovalList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/Actions"
              element={
                <ProtectedRoute>
                  <ActionList />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/IncidentClosure"
              element={
                <ProtectedRoute>
                  <IC_IncidentClosure />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/IncidentClosureEntryPending/:id/:closureID"
              element={
                <ProtectedRoute>
                  {/* <IC_Pending_EditAction /> */}
                  <EntryClosurePending />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/IncidentClosureCompleted/:id/:closureID"
              element={
                <ProtectedRoute>
                  {/* <ClosureCompleted /> */}
                  <EntryClosureCompleted setIsEdit={false} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/IncidentClosureCompletedEdit/:id/:closureID"
              element={
                <ProtectedRoute>
                  <EntryClosureCompleted setIsEdit={true} />
                  {/* <EditClosureEntry /> */}
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/IncidentClosureEntryDrafted/:id/:closureID"
              element={
                <ProtectedRoute>
                  <EntryClosureDraft />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/IncidentInvestigation"
              element={
                <ProtectedRoute>
                  <IncidentInvestigation />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/DashboardFilter"
              element={
                <ProtectedRoute>
                  <IncidentDashBoard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/CustomReports"
              element={
                <ProtectedRoute>
                  <CustomReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/CustomDashboard"
              element={
                <ProtectedRoute>
                  <CustomDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/CustomDashboard/ChartFullView"
              element={
                <ProtectedRoute>
                  <ChartView />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/IncidentInvestigationEntry_Pending/:id"
              element={
                <ProtectedRoute>
                  <II_PendingList_Edit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/IncidentInvestigationCompleted/:id"
              element={
                <ProtectedRoute>
                  <II_Completed_ViewButton />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/IncidentInvestigationRejected/:id"
              element={
                <ProtectedRoute>
                  <II_Rejected_EditButton />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/SearchIncident"
              element={
                <ProtectedRoute>
                  <SearchIncident />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/SearchIncidentEntry_Submitted/:id"
              element={
                <ProtectedRoute>
                  <DetailSubmittedTableEntry />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/SearchIncidentEntry_All/:id"
              element={
                <ProtectedRoute>
                  <DetailAllincidentTableEntry />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/SearchIncidentEntry_Deleted/:id"
              element={
                <ProtectedRoute>
                  <SearchIncidentEntry_Deleted />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/DeleteIncidentDetail"
              element={
                <ProtectedRoute>
                  <DeletedIncidentDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/SubmittedIncidentDetail"
              element={
                <ProtectedRoute>
                  <EditSubmittedByMe />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/IncidentInvestigationApproval"
              element={
                <ProtectedRoute>
                  <IncidentInvestigationApproval />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/Opinions"
              element={
                <ProtectedRoute>
                  <Opinions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/PendingOpinionEntry/:id"
              element={
                <ProtectedRoute>
                  <OpinionEntry />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/IncidentRisklevelCalculation"
              element={
                <ProtectedRoute>
                  <IncidentRisklevelCalculation />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/ReorderTable"
              element={
                <ProtectedRoute>
                  <ReorderTable />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/LikelihoodReorder"
              element={
                <ProtectedRoute>
                  <LikelihoodReorder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/IncidentRiskLevelReorder"
              element={
                <ProtectedRoute>
                  <IncidentRiskLevelReorder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/ConsequenceLevelReorder"
              element={
                <ProtectedRoute>
                  <ConsequenceLevelReorder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/ConsequenceReorder"
              element={
                <ProtectedRoute>
                  <ConsequenceReorder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/InvestigationApproval/PendingDetails/:id"
              element={
                <ProtectedRoute>
                  <InvestigationApprovalPending />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/IncidentRisklevelCalculation"
              element={
                <ProtectedRoute>
                  <IncidentRisklevelCalculation />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/ReorderTable"
              element={
                <ProtectedRoute>
                  <ReorderTable />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/ConsequenceLevelReorder"
              element={
                <ProtectedRoute>
                  <ConsequenceLevelReorder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/LikelihoodReorder"
              element={
                <ProtectedRoute>
                  <LikelihoodReorder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/IncidentRiskLevelReorder"
              element={
                <ProtectedRoute>
                  <IncidentRiskLevelReorder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/IncidentManagement/ConsequenceReorder"
              element={
                <ProtectedRoute>
                  <ConsequenceReorder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/Opinions/Opinions"
              element={
                <ProtectedRoute>
                  <Opinions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/Opinions/PendingList/PendingOpinionEntry/:id/:opID"
              element={
                <ProtectedRoute>
                  <OpinionEntry />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/Opinions/CompletedList/CompletedOpinionEntry/:id/:opID"
              element={
                <ProtectedRoute>
                  <CompletedOpinionEntry />
                </ProtectedRoute>
              }
            />
            <Route
              path="/IncidentManagement/InvestigationApproval/CompletedDetails/:id"
              element={
                <ProtectedRoute>
                  <InvestigationApprovalCompleted />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <NotFoundPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
