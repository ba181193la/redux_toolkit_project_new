import { Grid, TextField, Typography, Button } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import {
  ActionButton,
  FormContainer,
  FormLabel,
  StyledGridContainer,
  StyledGridItem,
} from '../IncidentInvestigation.styled';
import II_PL_ActionTable from './Datatable/II_PL_ActionTable';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';
import RejectIcon from '../../../../assets/Icons/RejectIcon.png';
import DoNotDisturbAltIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../../utils/language';
import Label from '../../../../components/Label/Label';
import { useTranslation } from 'react-i18next';
import {
  useGetIncidentInvestigationPendingByIdQuery,
  useCreateRejectInvestigationMutation,
} from '../../../../redux/RTK/incidentInvestigationApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Margin } from '@mui/icons-material';
import AddStaffModel from './AddStaffModel';
import { data } from 'jquery';
import { showSweetAlert, showToastAlert } from '../../../../utils/SweetAlert';
import Error from '../../../../assets/Gifs/error.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import CancelIcon from '@mui/icons-material/Cancel';

const II_PL_Reject_Investigation = ({ onCancelClick, data, comments }) => {
  const { i18n, t } = useTranslation();
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const [isStaffModel, setIsStaffModel] = useState(false);
  const [staffFacilityId, setStaffFacilityId] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [staffData, setStaffData] = useState({});
  const navigate = useNavigate();
  const [rejectionComments, setRejectionComments] = useState();

  const {
    selectedMenu,
    userDetails,
    selectedFacility,
    selectedModuleId,
    roleFacilities,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

  const { data: investigationData, isFetching: isFetchingData } =
    useGetIncidentInvestigationPendingByIdQuery(
      {
        menuId: 27,
        loginUserId: userDetails?.UserId,
        incidentId: id,
         moduleId: 2
      },
      { skip: !id }
    );

  const { Investigation, ActionTaken } = investigationData?.Data || {};

  const InvestigationSafe = Investigation || {};
  const ActionTakensafe = ActionTaken || [];

  const fieldsConfig = [
    {
      fieldId: `II_P_InvestigatorName`,
      translationId: 'IM_II_InvestigatorName',
      label: 'Investigator Name',
      name: 'StaffName',
    },
    {
      fieldId: `II_OE_Designation`,
      translationId: 'IM_II_Designation',
      label: 'Designation',
      name: 'PrimaryDesignation',
    },
    {
      fieldId: `II_OE_Department`,
      translationId: 'IM_II_Department',
      label: 'Department',
      name: 'Department',
    },
  ];

  const titleConfig = [
    {
      fields: `II_P_ApproverComment`,
      translationId: 'IM_II_ApproverComment',
      label: 'Approver Comment',
      name: 'approverComment',
    },
    {
      fieldId: `II_P_IncidentReason/RootCause`,
      translationId: 'IM_II_IncidentReason/RootCause',
      label: 'Incident Reason / Root Cause',
      name: 'incidentReasonRootCause',
    },
    {
      fieldId: `II_P_RecommendationtoPreventSimilarIncident`,
      translationId: 'IM_II_RecommendationtoPreventSimilarIncident',
      label: 'Recommendation to Prevent Similar Incident',
      name: 'recommendationToPreventSimilarIncident',
    },
    {
      fieldId: `II_P_ActionsTakenforPreventionOfIncidentAgain`,
      translationId: 'IM_II_ActionsTakenforPreventionOfIncidentAgain',
      label: 'Actions Taken for Prevention Of Incident Again',
      name: 'actionsTakenforPreventionOfIncidentAgain',
    },
    {
      fieldId: `II_P_Attachment(s)`,
      translationId: 'IM_II_Attachment(s)',
      label: 'Attachment(s)',
      name: 'Attachment(s)',
    },
    {
      fieldId: `II_P_ExpertDetails`,
      translationId: 'IM_II_ExpertDetails',
      label: 'ExpertDetails',
      name: 'ExpertDetails',
    },
  ];

  const { data: labelsData = [], isFetching: isLabelsFetching } =
    useGetLabelsQuery({
      menuId: 27,
      moduleId: 2,
    });
  const { data: fieldsData = [], isFetching: isFieldsFetching } =
    useGetFieldsQuery({
      menuId: 27,
      moduleId: 2,
    });

  const fields =
    fieldsData?.Data?.Menus?.filter((item) => item.MenuId === 27) || [];

  const labels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 27)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => region.RegionCode === 'ALL')
        .flatMap((region) => region.Labels || [])
    );

  const filterLabels = { Data: labels };
  const [configs, setConfigs] = useState({
    fieldsConfig,
    titleConfig,
  });

  useEffect(() => {
    if (fields?.length > 0) {
      const matchingSections = fields[0]?.Sections?.filter(
        (section) =>
          section.SectionName ===
            'Actions Taken for Prevention Of Incident Again' ||
          section.SectionName === 'Accordion-Page' ||
          section.SectionName === 'Opinion(s) Exchanged'
      );

      const pageFields = matchingSections?.flatMap(
        (section) =>
          section?.Regions?.find((region) => region.RegionCode === 'ALL')
            ?.Fields || []
      );

      if (pageFields && pageFields.length > 0) {
        const updatedConfigs = Object.entries(configs).reduce(
          (acc, [key, config]) => ({
            ...acc,
            [key]: config.filter((column) => {
              const pageField = pageFields.find(
                (col) => col.FieldId === column.fieldId
              );

              return pageField && pageField.IsShow === true;
            }),
          }),
          {}
        );

        setConfigs(updatedConfigs);
      }
    }
  }, [fields[0]]);

  const handleOnRowClick = (row) => {
    setIsStaffModel(true);
    setStaffFacilityId(row.StaffFacilityId);

    const formattedRow = {
      StaffName: row.StaffName || '',
      Department: row.Department || '',
      PrimaryDesignation: row.PrimaryDesignation || '',
    };
    setStaffData(formattedRow);
    setIsStaffModel(false);
  };

  const [triggerCreateRejectInvestigation] =
    useCreateRejectInvestigationMutation();

  const handleSubmit = async () => {

    const todayDate = new Date().toISOString();

     if (!rejectionComments) {
          showSweetAlert({
            type: 'warning',
            title: 'Oops!',
            text: 'Type Reason for Rejection',
            gif: Error,
            showConfirmButton: true,
            confirmButtonText: 'Close',
          });
          return
        }
    
    const payload = {
      "incidentInvestigationId": data.IncidentInvestigationId,
      "incidentId": id,
      "facilityId": data.FacilityId,
      "incidentApprovalId": data.IncidentApprovalId,
      "investigatorId": data.InvestigatorId,
      "asssignedDate": todayDate,
      "assignedBy": data.InvestigatorId ?? 0,
      "comments": rejectionComments || '',
      "createdBy": userDetails?.UserId,
      "createdDate": todayDate,
      "modifiedBy": data.ModifiedBy,
      "modifiedDate": todayDate,
      "isDelete": data.IsDelete,
      "investigationStatus": 'Completed',
      "isRejected": true,
      "formData": '',
      "formValue": '',
      "loginUserId": userDetails?.UserId,
      "moduleId": selectedModuleId,
      "menuId": selectedMenu?.id,
      "incidentDate": data.IncidentDate,
      "reportedDate": data.ReportedDate,
      "assignedOn": todayDate,
      "incidentNumber": data.IncidentNo,
      "incidentDetail": data.IncidentDetail,
      "incidentType": data.IncidentType,
      "departmentName": data.DepartmentName,
      "assignedByApprover": '',
      "incidentStatus": data.IncidentStatus,
      "investigatorName": data.InvestigatorName,
      "staffInvolved": true,
      "facilityName": data.FacilityName,
      "incidentNo": data.IncidentNo,
      "tatDays": data.TATDays,
      "tatCompliance": data.TATCompliance,
    };

    try {
      const response = await triggerCreateRejectInvestigation(payload).unwrap();

      if (response && response.Data) {
        showToastAlert({
          type: 'custom_success',
          text: response.Message || 'Action completed successfully!',
          gif: SuccessGif,
        });
        navigate("/IncidentManagement/IncidentInvestigation");

      } 
      else {
        console.error('Unexpected response format:', response);
      }
    } catch (error) {
      console.error('Error during submission:', {
        errormessage: error.message,
        errorStack: error.stack,
      });
      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: error.data,
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
    }
  };

  return (
    <FormContainer
      style={{ marginBottom: '20px', paddingLeft: '0px' }}
      onSubmit={handleSubmit}
    >

      <FlexContainer flexDirection="column" gap="16px">
        <Grid container spacing={2} style={{ paddingLeft: '0px' }}>
          <Grid item xs={12}>
            
          <Label 
  value={getlabel('IM_II_ReasonforRejection', filterLabels, i18n.language)} 
  isRequired={true} 
/>

            
            <TextField multiline rows={4} variant="outlined" fullWidth 
            
            onChange={(e) => { setRejectionComments(e.target.value); }}
            />
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <FlexContainer
          style={{
            gap: '20px',
            marginTop: '10px',
            marginLeft: '0px',
            justifyContent: 'center',
          }}
        >
          <ActionButton
  style={{
    backgroundColor: '#1976d2',
    color: 'white',
  }}
  startIcon={<CancelIcon sx={{ fontSize: 18, mr: 1 }} />}
  onClick={handleSubmit}
>
  Reject
</ActionButton>

          <ActionButton
            sx={{
              backgroundColor: 'white',
              color: 'black !important',
              border: '1px solid #1976d2',
              '&:hover': {
                backgroundColor: 'white',
              },
            }}
            startIcon={
              <i
                className="fas fa-ban"
                style={{
                  color: '#1976d2',
                  marginInlineEnd: 8,
                  fontSize: '16px',
                }}
              />
            }
            onClick={() => onCancelClick?.(false)}
          >
            {t('Cancel')}
          </ActionButton>
        </FlexContainer>
      </FlexContainer>
    </FormContainer>
  );
};

export default II_PL_Reject_Investigation;
