import React, { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Accordion, AccordionSummary, Divider } from '@mui/material';
import {
  FlexContainer,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import formatTime from '../../../../utils/FormatTime';
import ExpandIcon from '../../../../assets/Icons/ExpandIcon.png';
import IncidentDetailsForm from './IncidentDetailsForm';
import IncidentCategoryForm from './IncidentCategoryTab/IncidentCategoryForm';
import PersonInvolvedForm from './PersonsinvolvedTab/PersonInvolvedForm';
import { ActionButton } from '../../IncidentInvestigation/IncidentInvestigation.styled';
import DoNotDisturbAltIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import SaveIcon from '../../../../assets/Icons/SaveIcon.png';
import SubmitTik from '../../../../assets/Icons/SubmitTik.png';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import ErrorGif from '../../../../assets/Gifs/error.gif';
import { useGetFieldsQuery } from '../../../../redux/RTK/moduleDataApi';
import DeleteUserGif from '../../../../assets/Gifs/DeleteuserGif.gif';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import {
  useAddReportMutation,
  useDeleteReportMutation,
  useGetIncidentByIdQuery,
  useGetReportPageLoadDataQuery,
  useUpdateReportMutation,
} from '../../../../redux/RTK/IncidentManagement/reportincidentApi';
import {
  setIncidentData,
  setPageLoadData,
  setStaffDetails,
} from '../../../../redux/features/IncidentManagement/reportIncidentSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { showSweetAlert } from '../../../../utils/SweetAlert';
import { showToastAlert } from '../../../../utils/SweetAlert';
import { useGetStaffUserDetailsQuery } from '../../../../redux/RTK/userAssignmentApi';
import { getIncidentlabel } from '../../../../utils/language';
import { loginApi } from '../../../../redux/RTK/loginApi';

// const validationSchema = Yup.object().shape({
//   //incident Category form
//   mainCategory: Yup.string().required('Main Category is required'),
//   subCategory: Yup.string().required('Sub Category is required'),
//   incidentDetails: Yup.string().required('Incident Details are required'),
//   remarks: Yup.string(),
//   briefDescriptionOfIncident: Yup.string().required(
//     'Brief Description of Incident is required'
//   ),
//   immediateActionTaken: Yup.string().required(
//     'Immediate Action Taken is required'
//   ),
//   // incidentDepartment: Yup.string().required('Incident Department is required'),
//   locationDetails: Yup.string()
//     .max(100, 'Location Details must be at most 100 characters')
//     .required('Location Details are required'),

//   //incident Details
//   facilityId: Yup.string().required('facility is required'),
//   anonymous: Yup.string().required('anonymous is required'),
//   incidentType: Yup.string().required('incident Type are required'),
//   clinicalType: Yup.string().required('clinical Type are required'),
//   incidentDateTime: Yup.string().required(
//     'Incident Date is required'
//   ),

// });

const ReportIncidentForm = ({ labels }) => {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(true);
  const [validationSchema, setValidationSchema] = useState({});

  const [incidentStatusId, setIncidentStatusId] = useState(1);
  const [staffTabChecked, setStaffTabChecked] = useState(false);
  const [patientTabChecked, setPatientTabChecked] = useState(false);
  const [companionTabChecked, setCompanionTabChecked] = useState(false);
  const [visitorTabChecked, setVisitorTabChecked] = useState(false);
  const [outsourcedTabChecked, setOutsourcedTabChecked] = useState(false);
  const [othersTabChecked, setOthersTabChecked] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [incidentStatusButton, setIncidentStatusButton] = useState(0);
  const {
    incidentStaffInvolved,
    incidentPatientInvolved,
    incidentVisitorInvolved,
    incidentRelativeInvolved,
    incidentOutStaffInvolved,
    incidentOthersInvolved,
    IncidentData,
  } = useSelector((state) => state.reportIncident);
  const initialValues = {
    //INCIDENT DEATILS
    facilityId: '',
    incidentReportNo: '',
    anonymous: 'Yes',
    incidentTypeId: null, // value bind as id
    incidentType: null,
    reportingEmployeeId: userDetails?.EmployeeID,
    reportingEmployeeName: userDetails?.UserName,
    reportStaffDepartment: userDetails?.DepartmentName,

    clinicalType: 'Clinical',
    incidentDate: '',
    incidentTime: '',
    reportingDateTime: '',
    reportingDay: '',
    isSentinel: false,

    //INCIDENT CATEGOREY
    mainCategoryCode: null,
    subCategoryCode: null,
    incidentDetailsCode: null,

    affectedCategoryId: 1,
    affectedCategory: 'PATIENT',
    mainCategoryId: null,
    mainCategory: null,
    subCategoryId: null,
    subCategory: null,
    incidentDetailId: null,
    incidentDetails: null,
    medicationBrandNameInvolvedIfApplicable: '',
    medicationGenricNameInvolvedIfApplicable: '',
    medicationRoute: '',
    medicationDose: '',
    medicationForm: '',
    reactionCode: '',
    reactionName: '',
    medicationInvolvedGeneric: '',
    medicationInvolvedBrand: '',
    consentSinged: 'Yes',

    actionTaken: '',
    remarks: '',
    briefDescriptionOfIncident: '',
    incidentDepartmentId: '',
    incidentDepartmentName: '',
    isActionTakenTable: false,
    incidentActionTaken: [],
    locationDetails: '',
    incidentDepartment: null,

    //Persons Involved
    personInvolved: '',
    incidentHarmLevelId: null,
    incidentHarmLevel: null,
    additionalStaffNotified: 'No',
    attachment: null,
    incidentWitnessedBy: [],

    //staff involved
    facility: null,
    staffId: null,
    employeeId: null,
    staffName: null,
    department: '',
    designation: '',
    staffCategory: '',
    incidentStaffInvolved: [],

    //  Patient
    patientId: '',
    patientName: '',
    PatientAge: null,
    PatientGender: '',
    patientDesignation: '',
    department: '',
    PatientRoomNo: '',
    physician: '',
    visitId: '',
    diagnosis: '',
    isPhysicianNotified: '',
    NotifiedPhysician: '',
    notifiedPhysicianUserId: '',
    PhysicianDepartment: '',
    PhysicianDepartmentName: '',
    incidentPatientInvolved: [],

    // Visitor
    visitorRowNo: '',
    visitorName: '',
    visitorGender: '',
    visitorAge: '',
    visitorDepartmentId: '',
    visitorDepartmentName: '',
    reasonforVisit: '',
    incidentVisitorInvolved: [],

    //outsourcedStaff
    outStaffId: '',
    outStaffName: '',
    outStaffAge: '',
    outStaffGender: '',
    outStaffDepartmentId: '',
    outStaffDepartmentName: '',
    companyName: '',
    incidentOutStaffInvolved: [],

    // companion
    relativePatientId: '',
    relativePatientName: '',
    relativeName: '',
    relativeAge: '',
    relativeGender: '',
    relativedepartmentId: '',
    relativedepartmentName: '',
    relativeRoomNo: '',
    relationship: '',
    incidentRelativeInvolved: [],

    // incidentOthers
    othersName: '',
    othersAge: '',
    othersGender: '',
    othersDetails: '',
    othersRowNo: '',
    incidentOthersInvolved: [],

    incidentAdditionalNotifyStaff: new Array(),
  };

  const [fields, setFields] = useState([]);
  const {
    selectedMenu,
    selectedModuleId,
    userDetails,
    selectedFacility,
    regionCode,
  } = useSelector((state) => state.auth);
  const { filters } = useSelector((state) => state.userStaff);

  const {
    data: getStaffData = [],
    refetch,
    isFetching: isStaffFetching,
  } = useGetStaffUserDetailsQuery(
    {
      payload: {
        ...filters,
        pageIndex: filters?.pageIndex + 1,
        headerFacility: selectedFacility?.id,
        loginUserId: userDetails?.UserId,
        moduleId: 1,
        menuId: 10,
      },
    },
    {
      skip: selectedFacility === '',
    }
  );

  useEffect(() => {
    if (getStaffData?.records?.length > 0) {
      const activeRecords = getStaffData?.records?.filter(
        (record) => record.Status === 'Active'
      );
      dispatch(setStaffDetails(activeRecords));
    }
  }, [getStaffData]);
  const { data: incidentApiData, isFetching: isFacilityLoading } =
    useGetIncidentByIdQuery(
      {
        incidentId: id,
        loginUserId: userDetails?.UserId,
        moduleId: 2,
        menuId: 24,
      },
      { skip: !id }
    );
  const {
    data: pageLoadData,
    error,
    isLoading,
  } = useGetReportPageLoadDataQuery({
    moduleId: selectedModuleId,
    menuId: selectedMenu?.id,
    loginUserId: userDetails?.UserId,
    facilityId: selectedFacility?.id,
  });

  const { data: fieldsData = [], isFetching: isFetching } = useGetFieldsQuery({
    menuId: selectedMenu?.id,
    moduleId: selectedModuleId,
  });

  useEffect(() => {
    if (id && incidentApiData?.Data) {
      if (incidentApiData?.Data?.reportIncident) {
        setStaffTabChecked(
          incidentApiData?.Data?.reportIncident?.StaffInvolved
        );
        setPatientTabChecked(
          incidentApiData?.Data?.reportIncident?.PatientInvolved
        );
        setCompanionTabChecked(
          incidentApiData?.Data?.reportIncident?.CompanionInvolved
        );
        setVisitorTabChecked(
          incidentApiData?.Data?.reportIncident?.VisitorInvolved
        );
        setOutsourcedTabChecked(
          incidentApiData?.Data?.reportIncident?.OutSourcedStaffInvolved
        );
        setOthersTabChecked(
          incidentApiData?.Data?.reportIncident?.OthersInvolved
        );
      }
      dispatch(setIncidentData(incidentApiData?.Data));
    }
    if (pageLoadData) {
      dispatch(setPageLoadData(pageLoadData));
    }
  }, [incidentApiData?.Data, pageLoadData]);

  useEffect(() => {
    const pageFields = fieldsData?.Data?.Menus?.[0]?.Sections?.find(
      (i) => i.SectionName === 'Page'
    );
    const abdFields =
      pageFields?.Regions?.find((i) => i.RegionCode === 'ABD')?.Fields || [];
    const allFields =
      pageFields?.Regions?.find((region) => region.RegionCode === 'ALL')
        ?.Fields || [];
    if (regionCode === 'ABD') {
      setFields([...abdFields, ...allFields]);
    } else if (regionCode === 'ALL') {
      setFields(allFields);
    }
  }, [fieldsData, regionCode]);

  const [triggerAddReport] = useAddReportMutation();
  const [triggerUpdateReport] = useUpdateReportMutation();
  const [deleteReport] = useDeleteReportMutation();

  const handleOnDelete = async (id) => {
    const callback = async () => {
      try {
        await deleteReport({
          incidentId: id,
          loginUserId: userDetails?.UserId,
          menuId: selectedMenu?.id,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Your report has been deleted.',
          timer: 3000,
          gif: SuccessGif,
          height: 250,
          width: 250,
        });
      } catch (error) {}
    };
    showSweetAlert({
      type: 'delete',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      gif: DeleteUserGif,
      callback,
      cancelButtonText: 'No, Keep it',
      confirmButtonText: 'Yes, delete it!',
    });
    navigate('/IncidentManagement/ReportIncident');
  };

  const combineDateTime = (dateStr, timeStr) => {
    // Parse date
    if (dateStr != '' && timeStr != '') {
      let date = new Date(dateStr);

      // Parse time (Extract hours and minutes)
      let [time, period] = timeStr?.split(' ');
      let [hours, minutes] = time?.split(':').map(Number);

      // Convert 12-hour format to 24-hour format
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      // Set hours and minutes in the date object
      date.setUTCHours(hours, minutes, 0, 0);

      // Convert to ISO string
      return date.toISOString();
    } else {
      let date = new Date();
      date.setUTCHours(0, 0, 0, 0);
      return date.toISOString();
    }
  };

  const validateFields = (values) => {
    try {
      const errors = {};
      if (!values?.isActionTakenTable) {
        errors.message = 'FIll Immediate Action Taken';
        return errors;
      }
      if (
        values?.isActionTakenTable &&
        values?.incidentActionTaken?.length > 0
      ) {
        const checkImdiateTaken = values?.incidentActionTaken?.find(
          (item) => !item.immediateActionTaken
        );
        if (checkImdiateTaken) {
          errors.message = 'FIll Immediate Action Taken  Field';
          return errors;
        }
        const checkStaff = values?.incidentActionTaken?.find(
          (item) => !item.responsibleStaffName
        );
        if (checkStaff) {
          errors.message = 'FIll Immediate Action Taken Staff Field';
          return errors;
        }
      }
      if (!staffTabChecked) {
        errors.message = 'Specify Staff Involved Details';
        return errors;
      }
      if (!patientTabChecked) {
        errors.message = 'Specify Patient Involved Details';
        return errors;
      }
      if (!companionTabChecked) {
        errors.message = 'Specify Companion Involved Details';
        return errors;
      }
      if (!visitorTabChecked) {
        errors.message = 'Specify Visitor Involved Details';
        return errors;
      }
      if (!outsourcedTabChecked) {
        errors.message = 'Specify Outsourced Staff Involved Details';
        return errors;
      }
      if (!othersTabChecked) {
        errors.message = 'Specify Others Involved Details';
        return errors;
      }
      if (values?.incidentWitnessedBy?.length > 0) {
        const checkStaff = values?.incidentWitnessedBy?.find(
          (item) => !item.staffName
        );
        if (checkStaff) {
          errors.message = 'Select Witness Staff';
          return errors;
        }
      }
      if (values?.incidentWitnessedBy?.length > 0) {
        const checkStaff = values?.incidentWitnessedBy?.find(
          (item) => !item.staffName
        );
        if (checkStaff) {
          errors.message = 'Select Witness Staff';
          return errors;
        }
      }
      if (values?.additionalStaffNotified === 'Yes') {
        if (
          !values?.incidentAdditionalNotifyStaff ||
          values?.incidentAdditionalNotifyStaff?.length === 0
        ) {
          errors.message = 'Add Aditional Staff';
          return errors;
        }
        const checkStaff = values?.incidentAdditionalNotifyStaff?.find(
          (item) => !item.staffName
        );
        if (checkStaff) {
          errors.message = 'Select Aditional Staff';
          return errors;
        }
      }
      return errors;
    } catch (err) {
      console.log(err);
    }
  };
  const handleSubmit = async (values) => {
    try {
      const validateError = validateFields(values);
      if (Object.keys(validateError).length > 0) {
        showSweetAlert({
          type: 'success',
          title: 'Error!',
          text: validateError?.message || 'Fill All Fields',
          timer: 3000,
          gif: ErrorGif,
          height: 100,
          width: 100,
        });
        return false;
      }
      const combineReportDateTime = combineDateTime(
        values?.reportingDateTime,
        formatTime(values?.reportingDateTime)
      );
      const combinedDateTime = combineDateTime(
        values?.incidentDate,
        formatTime(values?.incidentDate)
      );

      const createFormData = new FormData();
      const updateFormdata = new FormData();
      let response;
      if (id) {
        alert(incidentStatusId);
        const updatePayLoad = {
          reportIncident: {
            incidentId: id,
            incidentNo: values?.incidentReportNo,
            facilityId: values?.facilityId,
            isBriefIncident: false,
            reportedUserId: userDetails?.UserId,
            anonymous: values?.anonymous,
            incidentTypeId: values?.incidentTypeId, // value bind as id
            incidentType: values?.incidentType,
            clinicalType: values?.clinicalType,
            incidentDateTime: combinedDateTime,
            reportingDateTime: combineReportDateTime,
            // "incidentDateTime": "2024-12-06T10:05:25.194Z",
            // "reportingDateTime": "2024-12-07T10:05:25.194Z",

            //INCIDENT SUB CATEGOERY
            AffectedCategoryId: values?.affectedCategoryId,
            AffectedCategory: values?.affectedCategory,
            mainCategoryId: values?.mainCategoryId,
            mainCategory: values?.mainCategory,
            subCategoryId: values?.subCategoryId,
            subCategory: values?.subCategory,
            incidentDetailId: values?.incidentDetailId,
            incidentDetail: values?.incidentDetails,
            remarks: values?.remarks,
            briefDescriptionOfIncident: values?.briefDescriptionOfIncident,
            actionTaken: values?.actionTaken,
            locationDetails: values?.locationDetails,
            departmentId: values?.incidentDepartmentId,
            departmentName: values?.incidentDepartmentName,
            medicationBrandNameInvolvedIfApplicable:
              values?.medicationBrandNameInvolvedIfApplicable,
            medicationGenricNameInvolvedIfApplicable:
              values?.medicationGenricNameInvolvedIfApplicable,
            medicationRoute: values?.medicationRoute,
            medicationDose: values?.medicationDose,
            medicationForm: values?.medicationForm,
            reactionCode: values?.reactionCode,
            reactionName: values?.reactionName,
            medicationInvolvedGeneric: values?.medicationInvolvedGeneric,
            medicationInvolvedBrand: values?.medicationInvolvedBrand,
            consentSinged: values?.consentSinged,
            isActionTakenTable: true,
            //   // incidentDescription: 'Inc description',

            // PERSON INVOLVED
            othersName: '',
            incidentHarmLevelId: values?.incidentHarmLevelId,
            incidentHarmLevel: values?.incidentHarmLevel,
            additionalStaffNotify: values?.additionalStaffNotified,
            staffInvolved: staffTabChecked,
            patientInvolved: patientTabChecked,
            companionInvolved: companionTabChecked,
            visitorInvolved: visitorTabChecked,
            outSourcedStaffInvolved: outsourcedTabChecked,
            othersInvolved: othersTabChecked,

            isWitnessedBy: true,
            incidentStatusId: incidentStatusId,
            reportingStaffName: userDetails?.UserName,
            reportingStaffFacilityId: userDetails?.DefaultFacilityId,
            reportingStaffDepartmentId: userDetails?.DepartmentId,
            reportingStaffDesignationId: userDetails?.DesignationId,
            mailId: '',
            isSentinel: false,
            createdBy: 1,
            createdDate: '2024-12-07T10:05:25.194Z',
            modifiedBy: 1,
            modifiedDate: '2024-12-07T10:05:25.194Z',
            loginUserId: userDetails?.UserId,
            moduleId: 2,
            menuId: 24,
          },
          incidentStaffInvolved: incidentStaffInvolved?.map((item) => {
            return {
              staffId: item?.staffId,
              isDelete: item?.isDelete,
            };
          }),
          incidentPatientInvolved: incidentPatientInvolved?.map((item) => {
            return {
              rowNo: item.rowNo,
              patientId: item.patientId,
              patientName: item.patientName,
              age: parseInt(item.age),
              gender: item.gender,
              departmentId: item.departmentId,
              roomNo: item.roomNo,
              physicianUserId: item.notifiedPhysicianUserId,
              diagnosis: item.diagnosis,
              visitId: item.visitId,
              isPhysicianNotified:
                item.isPhysicianNotified === 'Yes' ? true : false,
              notifiedPhysicianUserId: item.notifiedPhysicianUserId,
              isDelete: item?.isDelete,
            };
          }),
          incidentVisitorInvolved: incidentVisitorInvolved?.map((item) => {
            return {
              rowNo: item.rowNo,
              visitorName: item.visitorName,
              visitorAge: parseInt(item.visitorAge),
              visitorGender: item.visitorGender,
              departmentId: item.departmentId,
              reasonforVisit: item?.reasonforVisit,
              isDelete: item?.isDelete,
            };
          }),
          incidentRelativeInvolved: incidentRelativeInvolved?.map((item) => {
            return {
              rowNo: item.rowNo,
              patientId: item.patientId,
              patientName: item.patientName,
              relativeName: item.relativeName,
              relativeAge: parseInt(item.relativeAge),
              relativeGender: item.relativeGender,
              departmentId: item.departmentId,
              roomNo: item.roomNo,
              relationship: item.relationship,
              isDelete: item?.isDelete,
            };
          }),
          incidentOutStaffInvolved: incidentOutStaffInvolved?.map((item) => {
            return {
              rowNo: item.rowNo,
              outStaffId: item.outStaffId,
              outStaffName: item.outStaffName,
              outStaffAge: parseInt(item.outStaffAge),
              outStaffGender: item.outStaffGender,
              departmentId: item.departmentId,
              companyName: item.companyName,
              isDelete: item?.isDelete,
            };
          }),
          incidentOthersInvolved: incidentOthersInvolved?.map((item) => {
            return {
              rowNo: item.rowNo,
              name: item.name,
              age: parseInt(item.age),
              gender: item.gender,
              details: item.details,
              isDelete: item?.isDelete,
            };
          }),
          incidentActionTaken: values?.incidentActionTaken?.map(
            ({
              rowNo,
              immediateActionTaken,
              responsibleStaffId,
              isDelete,
            }) => ({
              rowNo,
              immediateActionTaken,
              responsibleStaffId,
              isDelete,
            })
          ),
          incidentWitnessedBy: values?.incidentWitnessedBy?.map(
            ({ rowNo, staffId, isDelete }) => ({
              rowNo,
              staffId,
              isDelete,
            })
          ),
          incidentAdditionalNotifyStaff:
            values?.incidentAdditionalNotifyStaff?.map((item, index) => {
              return {
                rowNo: index + 1,
                staffId: item?.staffId,
                isDelete: item.isDelete,
              };
            }),
          reportIncidentAttachment: [
            // {
            //   "IncidentAttachmentId": 14,
            //   "rowNo": 1,
            //   "AutogenFileName": "f2b6d309-d8e6-483c-86e8-3f35ca9f7422.xlsx",
            //   "OriginalFileName": "Department (1).xlsx",
            //   "isDelete": false
            // }
          ],
        };
        updateFormdata.append(
          'reportIncidentSave',
          JSON.stringify(updatePayLoad)
        );
        response = await triggerUpdateReport({
          payload: updateFormdata,
        });
      } else {
        const createPayLoad = {
          reportIncident: {
            //INCIDENT DETAILS
            incidentId: 0,
            incidentNo: '',
            facilityId: values?.facilityId,
            isBriefIncident: false,
            reportedUserId: userDetails?.UserId,
            anonymous: values?.anonymous,
            incidentTypeId: values?.incidentTypeId, // value bind as id
            incidentType: values?.incidentType,
            clinicalType: values?.clinicalType,
            // incidentDateTime: combinedDateTime,
            // reportingDateTime: combineReportDateTime,
            incidentDateTime: '2024-12-06T10:05:25.194Z',
            reportingDateTime: '2024-12-07T10:05:25.194Z',

            //INCIDENT SUB CATEGOERY
            AffectedCategoryId: values?.affectedCategoryId,
            AffectedCategory: values?.affectedCategory,
            mainCategoryId: values?.mainCategoryId,
            mainCategory: values?.mainCategory,
            subCategoryId: values?.subCategoryId,
            subCategory: values?.subCategory,
            incidentDetailId: values?.incidentDetailId,
            incidentDetail: values?.incidentDetails,
            remarks: values?.remarks,
            briefDescriptionOfIncident: values?.briefDescriptionOfIncident,
            actionTaken: values?.actionTaken,
            locationDetails: values?.locationDetails,
            departmentId: values?.incidentDepartmentId,
            departmentName: values?.incidentDepartmentName,
            medicationBrandNameInvolvedIfApplicable:
              values?.medicationBrandNameInvolvedIfApplicable,
            medicationGenricNameInvolvedIfApplicable:
              values?.medicationGenricNameInvolvedIfApplicable,
            medicationRoute: values?.medicationRoute,
            medicationDose: values?.medicationDose,
            medicationForm: values?.medicationForm,
            reactionCode: values?.reactionCode,
            reactionName: values?.reactionName,
            medicationInvolvedGeneric: values?.medicationInvolvedGeneric,
            medicationInvolvedBrand: values?.medicationInvolvedBrand,
            consentSinged: values?.consentSinged,
            isActionTakenTable: true,

            othersName: '',
            incidentHarmLevelId: values?.incidentHarmLevelId,
            incidentHarmLevel: values?.incidentHarmLevel,
            additionalStaffNotify: values?.additionalStaffNotified,
            staffInvolved: staffTabChecked,
            patientInvolved: patientTabChecked,
            companionInvolved: companionTabChecked,
            visitorInvolved: visitorTabChecked,
            outSourcedStaffInvolved: outsourcedTabChecked,
            othersInvolved: othersTabChecked,

            isWitnessedBy: true,
            incidentStatusId: incidentStatusId,
            reportingStaffName: userDetails?.UserName,
            reportingStaffFacilityId: userDetails?.DefaultFacilityId,
            reportingStaffDepartmentId: userDetails?.DepartmentId,
            reportingStaffDesignationId: userDetails?.DesignationId,
            mailId: '',
            isSentinel: false,
            createdBy: 1,
            createdDate: '2024-12-07T10:05:25.194Z',
            modifiedBy: 1,
            modifiedDate: '2024-12-07T10:05:25.194Z',
            loginUserId: userDetails?.UserId,
            moduleId: 2,
            menuId: 24,
          },

          incidentStaffInvolved: incidentStaffInvolved?.map((item) => {
            return {
              staffId: item?.staffId,
              isDelete: false,
            };
          }),

          incidentPatientInvolved: incidentPatientInvolved?.map((item) => {
            return {
              rowNo: item.rowNo,
              patientId: item.patientId,
              patientName: item.patientName,
              age: parseInt(item.age),
              gender: item.gender,
              departmentId: item.departmentId,
              roomNo: item.roomNo,
              physicianUserId: item.notifiedPhysicianUserId,
              diagnosis: item.diagnosis,
              visitId: item.visitId,
              isPhysicianNotified:
                item.isPhysicianNotified === 'Yes' ? true : false,
              notifiedPhysicianUserId: item.notifiedPhysicianUserId,
            };
          }),
          incidentVisitorInvolved: incidentVisitorInvolved?.map((item) => {
            return {
              rowNo: item.rowNo,
              visitorName: item.visitorName,
              visitorAge: parseInt(item.visitorAge),
              visitorGender: item.visitorGender,
              departmentId: item.departmentId,
              reasonforVisit: item?.reasonforVisit,
            };
          }),
          incidentRelativeInvolved: incidentRelativeInvolved?.map((item) => {
            return {
              rowNo: item.rowNo,
              patientId: item.patientId,
              patientName: item.patientName,
              relativeName: item.relativeName,
              relativeAge: parseInt(item.relativeAge),
              relativeGender: item.relativeGender,
              departmentId: item.departmentId,
              roomNo: item.roomNo,
              relationship: item.relationship,
            };
          }),
          incidentOutStaffInvolved: incidentOutStaffInvolved?.map((item) => {
            return {
              rowNo: item.rowNo,
              outStaffId: item.outStaffId,
              outStaffName: item.outStaffName,
              outStaffAge: parseInt(item.outStaffAge),
              outStaffGender: item.outStaffGender,
              departmentId: item.departmentId,
              companyName: item.companyName,
            };
          }),
          incidentOthersInvolved: incidentOthersInvolved?.map((item) => {
            return {
              rowNo: item.rowNo,
              name: item.name,
              age: parseInt(item.age),
              gender: item.gender,
              details: item.details,
            };
          }),
          incidentActionTaken: values?.incidentActionTaken?.map(
            ({ rowNo, immediateActionTaken, responsibleStaffId }) => ({
              rowNo,
              immediateActionTaken,
              responsibleStaffId,
            })
          ),
          incidentWitnessedBy: values?.incidentWitnessedBy?.map(
            ({ rowNo, staffId }) => ({
              rowNo,
              staffId,
            })
          ),
          incidentAdditionalNotifyStaff:
            values?.incidentAdditionalNotifyStaff?.map((item, index) => {
              return {
                rowNo: index + 1,
                staffId: item?.staffId,
              };
            }),
        };
        createFormData.append(
          'reportIncidentSave',
          JSON.stringify(createPayLoad)
        );
        response = await triggerAddReport({
          payload: createFormData,
        });
      }

      if (response && response?.data?.Message !== 'Record Already Exist') {
        showToastAlert({
          type: 'custom_success',
          text: response?.data?.Message,
          gif: 'SuccessGif',
        });
      }
      if (response && response?.data?.Message === 'Record Already Exist') {
        showToastAlert({
          type: 'custom_info',
          text: response?.data?.Message,
          gif: 'InfoGif',
        });
      }
    } catch (error) {
      console.log('...errr', error);
      showToastAlert({
        type: 'custom_info',
        text: 'Server Error',
        gif: 'InfoGif',
      });
    }
  };

  // const validationSchema = Yup.object({
  //   outsourcedStaffId: Yup.string()
  //     .required('Outsourced Staff ID is required')
  //     .min(3, 'Staff ID must be at least 3 characters'),
  //   outsourcedStaffName: Yup.string().required('Name is required'),
  //   age: Yup.number()
  //     .required('Age is required')
  //     .positive('Age must be a positive number')
  //     .integer('Age must be an integer'),
  //   gender: Yup.string().required('Gender is required'),
  //   department: Yup.string().required('Department is required'),
  //   companyName: Yup.string().required('Company name is required'),
  // });
  const pageFields = [
    {
      fieldId: 'RI_P_FacilityName',
      translationId: 'IM_RI_FacilityName',
      name: 'facilityId',
    },
    {
      fieldId: 'RI_P_BeAnonymous',
      translationId: 'IM_RI_BeAnonymous',
      name: 'anonymous',
    },
    {
      fieldId: 'RI_P_IncidentType',
      translationId: 'IM_RI_IncidentType',
      name: 'incidentTypeId',
    },
    {
      fieldId: 'RI_P_Clinical/NonClinical',
      translationId: 'IM_RI_Clinical/NonClinical',
      name: 'clinicalType',
    },
    {
      fieldId: 'RI_P_IncidentDate',
      translationId: 'IM_RI_IncidentDate',
      name: 'incidentDate',
    },
    {
      fieldId: 'RI_P_Day',
      translationId: 'IM_RI_Day',
      name: 'incidentDay',
    },
    {
      fieldId: 'RI_P_Time',
      translationId: 'IM_RI_Time',
      name: 'incidentTime',
    },
    {
      fieldId: 'RI_P_ReportingDate',
      translationId: 'IM_RI_ReportingDate',
      name: 'reportingDateTime',
    },
    {
      fieldId: 'RI_P_ReportedDay',
      translationId: 'IM_RI_ReportedDay',
      name: 'reportingDay',
    },
    {
      fieldId: 'RI_P_ReportedTime',
      translationId: 'IM_RI_ReportedTime',
      name: 'reportedTime',
    },
    {
      fieldId: 'RI_P_IncidentMainCategory',
      translationId: 'IM_RI_IncidentMainCategory',
      name: 'mainCategory',
    },

    {
      fieldId: 'RI_P_IncidentSubCategory',
      translationId: 'IM_RI_IncidentSubCategory',
      name: 'subCategory',
    },
    {
      fieldId: 'RI_P_IncidentDetail',
      translationId: 'IM_RI_IncidentDetail',
      name: 'incidentDetails',
    },
    {
      fieldId: 'RI_P_MedicationBrandNameInvolvedIfApplicable',
      translationId: 'IM_RI_MedicationBrandNameInvolvedIfApplicable',
      name: 'medicationBrandNameInvolvedIfApplicable',
    },
    {
      fieldId: 'RI_P_MedicationGenricNameInvolvedIfApplicable',
      translationId: 'IM_RI_MedicationGenricNameInvolvedIfApplicable',
      name: 'medicationGenricNameInvolvedIfApplicable',
    },
    {
      fieldId: 'RI_P_MedicationRoute',
      translationId: 'IM_RI_MedicationRoute',
      name: 'medicationRoute',
    },
    {
      fieldId: 'RI_P_MedicationDose',
      translationId: 'IM_RI_MedicationDose',
      name: 'medicationDose',
    },
    {
      fieldId: 'RI_P_MedicationForm',
      translationId: 'IM_RI_MedicationForm',
      name: 'medicationForm',
    },
    {
      fieldId: 'RI_P_Medication(s)InvolvedGeneric',
      translationId: 'IM_RI_Medication(s)InvolvedGeneric',
      name: 'medicationInvolvedGeneric',
    },
    {
      fieldId: 'RI_P_Medication(s)InvolvedBrand',
      translationId: 'IM_RI_Medication(s)InvolvedBrand',
      name: 'medicationInvolvedBrand',
    },
    {
      fieldId: 'RI_P_ReactionCode',
      translationId: 'IM_RI_ReactionCode',
      name: 'reactionCode',
    },
    {
      fieldId: 'RI_P_ReactionName',
      translationId: 'IM_RI_ReactionName',
      name: 'reactionName',
    },
    {
      fieldId: 'RI_P_ConsentSinged?',
      translationId: 'IM_RI_ConsentSinged?',
      name: 'consentSinged',
    },
    {
      fieldId: 'RI_P_Remarks',
      translationId: 'IM_RI_Remarks',
      name: 'remarks',
    },
    {
      fieldId: 'RI_P_BriefDescriptionofIncident',
      translationId: 'IM_RI_BriefDescriptionofIncident',
      name: 'briefDescriptionOfIncident',
    },
    {
      fieldId: 'RI_P_ImmediateActionTaken',
      translationId: 'IM_RI_ImmediateActionTaken',
      name: 'actionTaken',
    },
    {
      fieldId: 'RI_P_IncidentDepartment',
      translationId: 'IM_RI_IncidentDepartment',
      name: 'incidentDepartmentId',
    },
    {
      fieldId: 'RI_P_LocationDetails(Roomnoetc)',
      translationId: 'IM_RI_LocationDetails(Roomnoetc)',
      name: 'locationDetails',
    },
    {
      fieldId: 'RI_P_HarmLevel',
      translationId: 'IM_RI_HarmLevel',
      name: 'incidentHarmLevelId',
    },
    {
      fieldId: 'RI_P_Anyadditionalstaffyouwishtobenotified',
      translationId: 'IM_RI_Anyadditionalstaffyouwishtobenotified',
      name: 'additionalStaffNotified',
    },
  ];
  useEffect(() => {
    const schemaFields = {};
    fields?.forEach((field) => {
      if (field.IsShow && field.IsMandatory) {
        const fieldConfig = pageFields?.find(
          (config) => config.fieldId === field.FieldId
        );
        const translatedLabel = getIncidentlabel(
          fieldConfig?.translationId,
          labels,
          i18n.language
        );
        switch (fieldConfig?.name) {
          case 'facilityId':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'anonymous':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'incidentTypeId':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'clinicalType':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;

          case 'incidentDate':
            schemaFields[fieldConfig?.name] = Yup.date().required(
              `${translatedLabel} is required`
            );
            break;
          case 'incidentDay':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'incidentTime':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          // case 'reportingDateTime':
          //   schemaFields[fieldConfig?.name] = Yup.string().required(
          //     `${translatedLabel} is required`
          //   );
          //   break;
          // case 'reportingDay':
          //   schemaFields[fieldConfig?.name] = Yup.string().required(
          //     `${translatedLabel} is required`
          //   );
          //   break;
          // case 'reportedTime':
          //   schemaFields[fieldConfig?.name] = Yup.string().required(
          //     `${translatedLabel} is required`
          //   );
          //   break;

          // INCIDENT CATEGORY//
          case 'mainCategory':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'subCategory':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'incidentDetails':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          // case 'medicationBrandNameInvolvedIfApplicable':
          //   schemaFields[fieldConfig?.name] = Yup.string().required(
          //     `${translatedLabel} is required`
          //   );
          //   break;
          // case 'medicationGenricNameInvolvedIfApplicable':
          //   schemaFields[fieldConfig?.name] = Yup.string().required(
          //     `${translatedLabel} is required`
          //   );
          //   break;
          // case 'medicationRoute':
          //   schemaFields[fieldConfig?.name] = Yup.string().required(
          //     `${translatedLabel} is required`
          //   );
          //   break;
          // case 'medicationDose':
          //   schemaFields[fieldConfig?.name] = Yup.string().required(
          //     `${translatedLabel} is required`
          //   );
          //   break;
          // case 'medicationForm':
          //   schemaFields[fieldConfig?.name] = Yup.string().required(
          //     `${translatedLabel} is required`
          //   );
          //   break;
          // case 'medicationInvolvedGeneric':
          //   schemaFields[fieldConfig?.name] = Yup.string().required(
          //     `${translatedLabel} is required`
          //   );
          //   break;
          // case 'medicationInvolvedBrand':
          //   schemaFields[fieldConfig?.name] = Yup.string().required(
          //     `${translatedLabel} is required`
          //   );
          //   break;
          case 'remarks':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'briefDescriptionOfIncident':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'actionTaken':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'incidentDepartmentId':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'locationDetails':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'incidentHarmLevelId':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          case 'additionalStaffNotified':
            schemaFields[fieldConfig?.name] = Yup.string().required(
              `${translatedLabel} is required`
            );
            break;
          default:
            break;
        }
      }
    });
    setValidationSchema(schemaFields);
  }, [fields, fieldsData]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={Yup.object().shape(validationSchema)}
    >
      {({
        values,
        handleChange,
        handleBlur,
        setFieldValue,
        errors,
        resetForm,
      }) => {
        useEffect(() => {
          const schemaFields = {};
          fields?.forEach((field) => {
            if (field.IsShow && field.IsMandatory) {
              const fieldConfig = pageFields?.find(
                (config) => config.fieldId === field.FieldId
              );
              const translatedLabel = getIncidentlabel(
                fieldConfig?.translationId,
                labels,
                i18n.language
              );
              switch (fieldConfig?.name) {
                case 'medicationBrandNameInvolvedIfApplicable':
                  if (values.mainCategory === 'Medication Error') {
                    schemaFields[fieldConfig?.name] = Yup.string().required(
                      `${translatedLabel} is required`
                    );
                  }
                  break;
                case 'medicationGenricNameInvolvedIfApplicable':
                  if (values.mainCategory === 'Medication Error') {
                    schemaFields[fieldConfig?.name] = Yup.string().required(
                      `${translatedLabel} is required`
                    );
                  }
                  break;
                case 'medicationRoute':
                  if (values.mainCategory === 'Medication Error') {
                    schemaFields[fieldConfig?.name] = Yup.string().required(
                      `${translatedLabel} is required`
                    );
                  }
                  break;
                case 'medicationDose':
                  if (values.mainCategory === 'Medication Error') {
                    schemaFields[fieldConfig?.name] = Yup.string().required(
                      `${translatedLabel} is required`
                    );
                  }
                  break;
                case 'medicationForm':
                  if (values.mainCategory === 'Medication Error') {
                    schemaFields[fieldConfig?.name] = Yup.string().required(
                      `${translatedLabel} is required`
                    );
                  }
                case 'medicationInvolvedBrand':
                  if (values.mainCategory === 'Medication Error') {
                    schemaFields[fieldConfig?.name] = Yup.string().required(
                      `${translatedLabel} is required`
                    );
                  }
                  break;
                case 'medicationInvolvedGeneric':
                  if (values.mainCategory === 'Medication Error') {
                    schemaFields[fieldConfig?.name] = Yup.string().required(
                      `${translatedLabel} is required`
                    );
                  }
                  break;
                case 'reactionCode':
                  if (values.subCategory === 'Adverse Drug Reaction') {
                    schemaFields[fieldConfig?.name] = Yup.string().required(
                      `${translatedLabel} is required`
                    );
                  }
                case 'reactionName':
                  if (values.subCategory === 'Adverse Drug Reaction') {
                    schemaFields[fieldConfig?.name] = Yup.string().required(
                      `${translatedLabel} is required`
                    );
                  }
                case 'consentSinged':
                  if (values.incidentDetails === 'Against Medical Advice') {
                    schemaFields[fieldConfig?.name] = Yup.string().required(
                      `${translatedLabel} is required`
                    );
                  }
                default:
                  break;
              }
            }
          });
          setValidationSchema({ ...validationSchema, ...schemaFields });
        }, [values?.mainCategory, fields]);
        return (
          <Form>
            <Accordion
              expanded={true}
              sx={{
                borderColor: 'rgb(15, 30, 240)',
                marginBottom: '10px',
                border: '1px solid rgb(15, 30, 240)',
                borderRadius: '8px 8px 0px 0px',
              }}
            >
              <AccordionSummary
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  backgroundColor: 'rgb(15, 30, 240)',
                  width: '100%',
                }}
              >
                <StyledTypography
                  fontSize="17px"
                  fontWeight="700"
                  lineHeight="20px"
                  textAlign="center"
                  color="#FFFFFF"
                >
                  Incident Details
                </StyledTypography>
              </AccordionSummary>

              <IncidentDetailsForm
                labels={labels}
                fields={fields}
                IncidentData={IncidentData}
                isLoading={isLoading}
                pageLoadData={pageLoadData}
                isFetching={isFetching}
              />
            </Accordion>
            <Accordion
              expanded={true}
              sx={{
                borderColor: 'rgba(0, 131, 192, 1)',
                marginBottom: '10px',
                border: '1px solid rgba(0, 131, 192, 1)',
                borderRadius: '8px 8px 0px 0px',
              }}
            >
              <AccordionSummary
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  backgroundColor: 'rgba(0, 131, 192, 1)',
                  width: '100%',
                }}
              >
                <StyledTypography
                  fontSize="17px"
                  fontWeight="700"
                  lineHeight="20px"
                  textAlign="center"
                  color="#FFFFFF"
                >
                  Incident Category
                </StyledTypography>
              </AccordionSummary>
              <IncidentCategoryForm
                labels={labels}
                fields={fields}
                IncidentData={IncidentData}
                isLoading={isLoading}
                isFetching={isFetching}
                pageLoadData={pageLoadData}
              />
            </Accordion>
            <Accordion
              expanded={true}
              sx={{
                borderColor: 'rgba(63, 81, 151, 1)',
                marginBottom: '10px',
                border: '1px solid rgba(63, 81, 151, 1)',
                borderRadius: '8px 8px 0px 0px',
              }}
            >
              <AccordionSummary
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  backgroundColor: 'rgba(63, 81, 151, 1)',
                  width: '100%',
                }}
              >
                <StyledTypography
                  fontSize="17px"
                  fontWeight="700"
                  lineHeight="20px"
                  textAlign="center"
                  color="#FFFFFF"
                >
                  Person Involved
                </StyledTypography>
              </AccordionSummary>
              <PersonInvolvedForm
                labels={labels}
                fields={fields}
                id={id}
                IncidentData={IncidentData}
                isLoading={isLoading}
                pageLoadData={pageLoadData}
                staffTabChecked={staffTabChecked}
                setStaffTabChecked={setStaffTabChecked}
                patientTabChecked={patientTabChecked}
                setPatientTabChecked={setPatientTabChecked}
                companionTabChecked={companionTabChecked}
                setCompanionTabChecked={setCompanionTabChecked}
                visitorTabChecked={visitorTabChecked}
                setVisitorTabChecked={setVisitorTabChecked}
                outsourcedTabChecked={outsourcedTabChecked}
                setOutsourcedTabChecked={setOutsourcedTabChecked}
                setOthersTabChecked={setOthersTabChecked}
                othersTabChecked={othersTabChecked}
              />
            </Accordion>
            <Divider sx={{ marginY: '20px' }} />

            <FlexContainer padding="10px" justifyContent="center" gap="24px">
              <ActionButton
                variant="outlined"
                type="submit"
                name="saveAction"
                onClick={() => setIncidentStatusId(1)}
                sx={{
                  boxShadow: '0px 4px 4px 0px #00000040',
                  '&:hover': {
                    transform: 'scale(1.05) !important',
                    transition: 'transform 0.3s ease !important',
                  },
                }}
                startIcon={
                  <StyledImage
                    src={SaveIcon}
                    style={{
                      marginBottom: '1px',
                      marginInlineEnd: 8,
                    }}
                  />
                }
              >
                <StyledTypography
                  textTransform="none"
                  marginTop="1px"
                  color="rgba(0, 131, 192, 1)"
                >
                  Save Incident
                </StyledTypography>
              </ActionButton>
              <ActionButton
                style={{ backgroundColor: 'rgba(0, 131, 192, 1)' }}
                name="submitAction"
                type="submit"
                variant="outlined"
                onClick={() => setIncidentStatusId(2)}
                sx={{
                  boxShadow: '0px 4px 4px 0px #00000040',
                  '&:hover': {
                    transform: 'scale(1.05) !important',
                    transition: 'transform 0.3s ease !important',
                  },
                }}
                startIcon={
                  <StyledImage
                    src={SubmitTik}
                    style={{
                      marginBottom: '1px',
                      marginInlineEnd: 8,
                      color: '#FFFFFF',
                    }}
                  />
                }
              >
                <StyledTypography
                  textTransform="none"
                  marginTop="1px"
                  color="#ffff"
                >
                  Submit Incident
                </StyledTypography>
              </ActionButton>
              {id && (
                <ActionButton
                  variant="outlined"
                  // onClick={resetForm}
                  onClick={() => handleOnDelete(id)}
                  sx={{
                    boxShadow: '0px 4px 4px 0px #00000040',
                    '&:hover': {
                      transform: 'scale(1.05) !important',
                      transition: 'transform 0.3s ease !important',
                    },
                  }}
                  startIcon={
                    <StyledImage
                      src={DoNotDisturbAltIcon}
                      style={{
                        marginBottom: '1px',
                        marginInlineEnd: 8,
                      }}
                    />
                  }
                >
                  <StyledTypography
                    textTransform="none"
                    marginTop="1px"
                    // onClick={handleOnDelete}
                    color="rgba(0, 131, 192, 1)"
                  >
                    discard
                  </StyledTypography>
                </ActionButton>
              )}
              <ActionButton
                variant="outlined"
                sx={{
                  boxShadow: '0px 4px 4px 0px #00000040',
                  '&:hover': {
                    transform: 'scale(1.05) !important',
                    transition: 'transform 0.3s ease !important',
                  },
                }}
                startIcon={
                  <StyledImage
                    src={DoNotDisturbAltIcon}
                    style={{
                      marginBottom: '1px',
                      marginInlineEnd: 8,
                    }}
                  />
                }
              >
                <StyledTypography
                  textTransform="none"
                  marginTop="1px"
                  color="rgba(0, 131, 192, 1)"
                >
                  Cancel
                </StyledTypography>
              </ActionButton>
            </FlexContainer>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ReportIncidentForm;
