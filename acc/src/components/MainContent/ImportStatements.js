import { lazy } from 'react';

export const LandingPage = lazy(
  () => import('../../features/LandingPage/LandingPage')
);
export const StaffMaster = lazy(
  () => import('../../features/MainMaster/StaffMaster/StaffMaster')
);
export const ReportIncident = lazy(
  () =>
    import('../../features/IncidentManagement/ReportIncident/ReportIncident')
);
export const ReportNewIncident = lazy(
  () =>
    import(
      '../../features/IncidentManagement/ReportIncident/ReportNewIncident/ReportNewIncident'
    )
);
export const Login = lazy(() => import('../../features/Login/LoginPage'));
export const BriefIncident = lazy(
  () => import('../../features/Login/Briefincident/BriefIncident')
);
export const EmailEditor = lazy(() => import('../EmailEditor/EmailEditor'));
export const FormBuilder = lazy(() => import('../FormBuilder/FormBuilder'));

export const ContactInfo = lazy(
  () => import('../../features/MainMaster/ContactInformationMaster/ContactInfo')
);

export const ReportGenerator = lazy(
  () => import('../../features/MainMaster/ReportGenerator/ReportGenerator')
);

export const MailCredendial = lazy(
  () => import('../../features/MainMaster/MailCredential/MailCredential')
);
export const AddNewStaffMaster = lazy(
  () =>
    import('../../features/MainMaster/StaffMaster/StaffList/AddNewStaffMaster')
);

export const StaffSubMaster = lazy(
  () =>
    import(
      '../../features/MainMaster/StaffMaster/StaffSubMaster/StaffSubMaster'
    )
);
export const PasswordManagement = lazy(
  () =>
    import('../../features/MainMaster/PasswordManagement/PasswordManagement')
);

export const ChangePassword = lazy(
  () => import('../../features/ChangePassword/ChangePassword')
);
export const DepartmentMaster = lazy(
  () => import('../../features/MainMaster/DepartmentMaster/DepartmentMaster')
);
export const DepartmentGroup = lazy(
  () =>
    import(
      '../../features/MainMaster/DepartmentMaster/DepartmentGroup/DepartmentGroupList'
    )
);
export const UserAssignment = lazy(
  () => import('../../features/MainMaster/UserAssignment/UserAssignment')
);
export const NewUserAssignment = lazy(
  () =>
    import(
      '../../features/MainMaster/UserAssignment/NewUserAssignment/NewUserAssignment'
    )
);
export const NotificationMaster = lazy(
  () => import('../../features/MainMaster/NotificationMaster/NoficationMaster')
);
export const PageUtilities = lazy(
  () => import('../../features/MainMaster/PageUtilities/PageUtilities')
);
export const ApplicationRoles = lazy(
  () => import('../../features/MainMaster/ApplicationRoles/ApplicationRoles')
);
export const AddNewApplicationRole = lazy(
  () =>
    import('../../features/MainMaster/ApplicationRoles/AddNewRole/AddNewRole')
);

export const ApprovalList = lazy(
  () =>
    import('../../features/IncidentManagement/IncidentApproval/ApprovalList')
);

export const SearchIncident = lazy(
  () =>
    import('../../features/IncidentManagement/SearchIncident/SearchIncident')
);

export const SearchDeleteDetail = lazy(
  () =>
    import(
      '../../features/IncidentManagement/SearchIncident/DeletedIncident/DeletedIncidentTable'
    )
);

export const SearchSubmitDetail = lazy(
  () =>
    import(
      '../../features/IncidentManagement/SearchIncident/SubmittedByMe/SubmittedDetailTable'
    )
);

export const IC_IncidentClosure = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentClosure/IC_IncidentClosure'
    )
);

export const CompleteDetailClosure = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentClosure/Completed/CompleteDetail'
    )
);

export const DraftedDetailClosure = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentClosure/Drafted/IC_DraftedEditButton'
    )
);

export const ClosureCompleted = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentClosure/Completed/IC_CompletedPage'
    )
);

export const PendingDetailApproval = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentClosure/Pending/PendingDetailApproval'
    )
);
export const ActionPending = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentApproval/CompletedList/CompletedActionPending'
    )
);

export const ContactInformationMaster = lazy(
  () =>
    import(
      '../../features/MainMaster/ContactInformationMaster/ContactInformationMaster'
    )
);

export const ContactInfoForm = lazy(
  () =>
    import(
      '../../features/MainMaster/ContactInformationMaster/ContactInformationMaster'
    )
);

export const NotificationMasterList = lazy(
  () =>
    import(
      '../../features/MainMaster/NotificationMaster/NotificationMasterList/NotificationMasterList'
    )
);

export const MailLogList = lazy(
  () => import('../../features/MainMaster/MailLog/MailLogList')
);

export const GroupConfiguration = lazy(
  () =>
    import('../../features/MainMaster/GroupConfiguration/GroupConfiguration')
);

export const AdMaster = lazy(
  () => import('../../features/MainMaster/AdMaster/AdMaster')
);
export const AuditLogList = lazy(
  () => import('../../features/MainMaster/AuditLog/AuditLogList')
);
export const UserSessionLogList = lazy(
  () =>
    import('../../features/MainMaster/AuditLog/userSessionLog/UserSessionLog')
);

export const LicenseGenerator = lazy(
  () => import('../../features/MainMaster/LicenceGenerator/LicenseGenerator')
);

export const IncidentInvestigation = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentInvestigation/IncidentInvestigation'
    )
);

export const HomePageSettings = lazy(
  () => import('../../features/MainMaster/HomePageSettings/FavouritesList')
);
export const OrganizationLevel = lazy(
  () =>
    import(
      '../../features/MainMaster/HomePageSettings/OrganizationLevel/OrganizationLevelFavList'
    )
);
export const OrganizationLevelFavDetails = lazy(
  () =>
    import(
      '../../features/MainMaster/HomePageSettings/OrganizationLevel/OrganizationLevelFavDetails'
    )
);

export const UserLevel = lazy(
  () =>
    import(
      '../../features/MainMaster/HomePageSettings/UserLevel/UserLevelFavList'
    )
);
export const UserLevelFavDetails = lazy(
  () =>
    import(
      '../../features/MainMaster/HomePageSettings/UserLevel/UserLevelFavDetails'
    )
);
export const IncidentSubMaster = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentSubMaster/IncidentSubMaster'
    )
);
export const ActionList = lazy(
  () => import('../../features/IncidentManagement/Action/Actions')
);
export const IncidentTypeReorder = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentSubMaster/IncidentType/ReorderIncidentType'
    )
);

export const RootCauseAnalyses = lazy(
  () =>
    import(
      '../../features/IncidentManagement/Root Cause Analysis/RootCauseAnalysis'
    )
);
export const MedicationHarmLevelReorder = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentSubMaster/MedicationIncidentHarmLevel/ReorderMedcationHarmLevel'
    )
);
export const HarmLevelReorder = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentSubMaster/HarmLevel/ReorderHarmLevel'
    )
);
export const MainFactorReorder = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentSubMaster/ContributingMainFactor/ReorderMainFactor'
    )
);
export const SubFactorReorder = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentSubMaster/ContributingSubFactor/ReorderSubFactor'
    )
);
export const RCAQuestionsReorder = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentSubMaster/RCAQuestions/ReorderRCAQuestions'
    )
);
export const LevelOfNegligenceReorder = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentSubMaster/LevelOfStaffNegligence/ReorderLevelOfNegeligence'
    )
);
export const ExternalBodyReorder = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentSubMaster/ReportToExternalBody/ReorderExternalBody'
    )
);
export const JwadaIncidentLevelReorder = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentSubMaster/JAWDAIncidentLevel/ReorderJawdaLevel'
    )
);
export const IncidentRisklevelCalculation = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentRiskLevelCalculation/IncidentRiskLevelMain'
    )
);

export const ReorderTable = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentRiskLevelCalculation/CategoryAffected/ReorderTable'
    )
);
export const ConsequenceLevelReorder = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentRiskLevelCalculation/ConsequenceLevel/consequenceLevelReorder'
    )
);
export const LikelihoodReorder = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentRiskLevelCalculation/Likelihood/LikelihoodReorder'
    )
);
export const IncidentRiskLevelReorder = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentRiskLevelCalculation/IncidentRiskLevel/IncidentRiskLevelReorder'
    )
);
export const ConsequenceReorder = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentRiskLevelCalculation/Consequence/ConsequenceReorder'
    )
);

export const IncidentNotificationMasterList = lazy(
  () =>
    import(
      '../../features/IncidentManagement/NotificationMaster/NotificationMasterList/NotificationMasterList'
    )
);
export const IncidentNotificationMaster = lazy(
  () =>
    import(
      '../../features/IncidentManagement/NotificationMaster/NoficationMaster'
    )
);

export const Opinions = lazy(
  () => import('../../features/IncidentManagement/Opinions/Opinions')
);

export const OpinionEntry = lazy(
  () =>
    import(
      '../../features/IncidentManagement/Opinions/PendingList/PendingOpinionEntry'
    )
);
export const CompletedOpinionEntry = lazy(
  () =>
    import(
      '../../features/IncidentManagement/Opinions/CompletedList/CompletedOpinionEntry'
    )
);
export const IncidentCategory = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentCategory/IncidentCategory'
    )
);
export const MainCategoryQuestions = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentCategory/MainCategory/MainCategoryQuestions'
    )
);
export const SubCategoryQuestions = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentCategory/SubCategory/SubCategoryQuestions'
    )
);
export const IncidentDetailQuestions = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentCategory/IncidentDetails/IncidentDetailQuestions'
    )
);
export const IncidentInvestigationApproval = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentInvestigationApproval/IncidentInvestigationApproval'
    )
);
export const InvestigationApprovalPending = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentInvestigationApproval/PendingList/InvestigationPendingDetails'
    )
);
export const InvestigationApprovalCompleted = lazy(
  () =>
    import(
      '../../features/IncidentManagement/IncidentInvestigationApproval/CompletedList/InvestigationCompletedView'
    )
);
export const ResetPassword = lazy(
  () => import('../../features/ResetPassword/ResetPassword')
);
export const StaffDemography = lazy(
  () => import('../../features/MainMaster/StaffDemography/StaffDemography')
);
export const StaffDemographySubMaster = lazy(
  () =>
    import(
      '../../features/MainMaster/StaffDemography/StaffDemographySubMaster/SubMaster'
    )
);
export const IntegrationLog = lazy(
  () => import('../../features/MainMaster/IntegrationLog/IntegrationLog')
);
