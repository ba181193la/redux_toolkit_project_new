import { Grid, TextField, Typography, Button } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../../utils/StyledComponents';
import {
  ActionButton,
  FormContainer,
  FormLabel,
  StyledGridContainer,
  StyledGridItem,
} from '../../IncidentInvestigation.styled';
import AddSubMaster from '../../../../../assets/Icons/AddSubMaster.png';
import RejectIcon from '../../../../../assets/Icons/RejectIcon.png';
import DoNotDisturbAltIcon from '../../../../../assets/Icons/DoNotDisturbIcon.png';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../../../utils/language';
import Label from '../../../../../components/Label/Label';
import { useTranslation } from 'react-i18next';
import {
  useGetIncidentInvestigationPendingByIdQuery,
  useCreateRequestOpinionMutation,
} from '../../../../../redux/RTK/incidentInvestigationApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Margin } from '@mui/icons-material';
import AddStaffModel from './AddStaffModel';
import SuccessGif from '../../../../../assets/Gifs/SuccessGif.gif';
import Error from '../../../../../assets/Gifs/error.gif';
import {
  showSweetAlert,
  showToastAlert,
} from '../../../../../utils/SweetAlert';
import CheckIcon from '@mui/icons-material/Check';

const II_PL_RequestOpinion = ({ onCancelClick, data }) => {
  const { i18n, t } = useTranslation();
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const [isStaffModel, setIsStaffModel] = useState(false);
  const [staffFacilityId, setStaffFacilityId] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [staffData, setStaffData] = useState({});
  const [opinionComments, setOpinionComments] = useState('');
  const navigate = useNavigate();

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
        //  moduleId: 2
      },
      { skip: !id }
    );

  const { Investigation, ActionTaken } = investigationData?.Data || {};

  const InvestigationSafe = Investigation || {};
  const ActionTakensafe = ActionTaken || [];

  const fieldsConfig = [
    {
      fieldId: `II_OE_RespondentName`,
      translationId: 'IM_II_RespondentName',
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
            })
            .map((column) => {
              const pageField = pageFields.find(
                (col) => col.FieldId === column.fieldId
              );
              return {
                ...column,
                IsMandatory: pageField?.IsMandatory || false,
              };
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
      UserId: row.UserId || '',
    };
    setStaffData(formattedRow);
    setIsStaffModel(false);
  };

  const [triggerCreateRequestOpinion] = useCreateRequestOpinionMutation();

  const handleSubmit = async () => {
    const todayDate = new Date().toISOString();

    if (!staffData || !staffData.UserId) {
      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: 'Select staff data',
        gif: Error,
        showConfirmButton: true,
        confirmButtonText: 'Close',
      });
      return;
    }

    const payload = {
      incidentId: id,
      facilityId: selectedFacility?.id,
      requestedUserId: userDetails?.UserId,
      requestorType: 'Investigator',
      requestedDate: todayDate,
      requestorComments: opinionComments,
      opinionUserId: staffData?.UserId,
      responseDate: todayDate,
      opinionComments: '',
      OpinionStatus: 'Pending',
      isDelete: false,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
    };

    try {
      const response = await triggerCreateRequestOpinion(payload).unwrap();

      if (response && response.Data) {
        showToastAlert({
          type: 'custom_success',
          text: response.Message || 'Action completed successfully!',
          gif: SuccessGif,
        });
        navigate('/IncidentManagement/IncidentInvestigation');
      }
    } catch (error) {
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
        <FormLabel style={{ marginBottom: '8px', display: 'block' }}>
          {getlabel('IM_II_ExpertDetails', filterLabels, i18n.language)}
        </FormLabel>

        <div style={{ marginLeft: '0px' }}>
          <ActionButton
            style={{
              backgroundColor: '#5cb85c',
              color: 'white',
            }}
            startIcon={
              <i className="fas fa-users" style={{ marginInlineEnd: 8 }} />
            }
            onClick={() => setIsStaffModel(true)}
          >
            Fetch Staff Details
          </ActionButton>
        </div>

        {isStaffModel && (
          <AddStaffModel
            open={isStaffModel}
            onClose={() => setIsStaffModel(false)}
            setIsStaffModel={setIsStaffModel}
            setStaffFacilityId={setStaffFacilityId}
            onSelectRow={handleOnRowClick}
          />
        )}

        <Grid container spacing={2} style={{ paddingLeft: '0px' }}>
          {configs.fieldsConfig?.map((field) => {
            const fieldValue = (() => {
              if (field.name === 'StaffName') return staffData?.StaffName || '';
              if (field.name === 'Department')
                return staffData?.Department || '';
              if (field.name === 'PrimaryDesignation')
                return staffData?.PrimaryDesignation || '';
              return '';
            })();
            const translatedLabel = getlabel(
                                              field?.translationId,
                                              filterLabels,
                                              i18n.language
                                            );

            return (
              <Grid item xs={4} key={field.fieldId}>
                            <Label value={translatedLabel} isRequired={field.IsMandatory} />
                
                <TextField
                  fullWidth
                  value={fieldValue}
                  disabled
                  sx={{
                    '& .MuiInputBase-input.Mui-disabled': {
                      opacity: 1,
                      fontWeight: 'bold',
                      color: 'black',
                      WebkitTextFillColor: 'black',
                    },
                  }}
                />
              </Grid>
            );
          })}
        </Grid>

        {/* Comments Section */}
        <Grid container spacing={2} style={{ paddingLeft: '0px' }}>
          <Grid item xs={12}>
            <FormLabel style={{ marginBottom: '8px', display: 'block' }}>
              Comments:
            </FormLabel>
            <TextField
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              onChange={(e) => {
                setOpinionComments(e.target.value);
              }}
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
            startIcon={<CheckIcon sx={{ fontSize: 18, mr: 0.5 }} />}
            onClick={handleSubmit}
          >
            {t('Submit')}
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

export default II_PL_RequestOpinion;
