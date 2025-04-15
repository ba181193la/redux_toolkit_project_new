import {
  Modal,
  Backdrop,
  Box,
  Typography,
  IconButton, 
  Tooltip,
  Grid,
} from '@mui/material';     
import React, { useState, useEffect } from 'react';
import {
  FlexContainer,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { FormContainer, FormLabel } from '../IncidentInvestigation.styled';
import ApproveIncidentTable from './Datatable/ApproveIncidentTable';
import { useTranslation } from 'react-i18next';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../../utils/language';
import { useGetIncidentApprovalPendingByIdQuery, useGetDefinitionQuery } from '../../../../redux/RTK/incidentInvestigationApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import formatDate from '../../../../utils/FormatDate';

const IncidentApprovalDetails = () => {
  const { i18n, t } = useTranslation();
  const { id } = useParams();

  const {
    selectedMenu,
    userDetails,
    selectedFacility,
    selectedModuleId,
    roleFacilities,
    isSuperAdmin,
  } = useSelector((state) => state.auth);

 const regionCode = useSelector((state) =>
    state.auth.regionCode?.toUpperCase()
  );

 const [modalData, setModalData] = React.useState({ title: '', data: [] });
  const [isModalOpen, setModalOpen] = React.useState(false);

  const handleModalOpen = (title, data) => {
    setModalData({ title, data });
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const { data: definitionData } = useGetDefinitionQuery(
    {
      menuId: selectedMenu?.id,
      loginUserId: userDetails?.UserId,
      incidentId: id,
      moduleId: selectedModuleId,
    },
    { skip: !id }
  );

  const { incidentTypeDefinition, clinicalDefinition, harmLevelDefinition } =
    definitionData?.Data || {};

  const { data: approvalData, isFetching: isFetchingData } =
    useGetIncidentApprovalPendingByIdQuery(
      {
        menuId: 26,
        loginUserId: userDetails?.UserId,
        incidentId: id,
         moduleId: selectedModuleId
      },
      { skip: !id }
    );




  const incidentApprovalSafe = approvalData?.Data || {};



  const fieldsConfig = [
    {
      fieldId: `IA_P_IncidentMainCategory`,
      translationId: 'IM_IA_IncidentMainCategory',
      label: 'Incident Main Category',
      name: 'MainCategory',
    },
    {
      fieldId: `IA_P_IncidentSubCategory`,
      translationId: 'IM_IA_IncidentSubCategory',
      label: 'Incident Sub Category',
      name: 'SubCategory',
    },
    {
      fields: `IA_P_IncidentDetails`,
      translationId: 'IM_IA_IncidentDetails',
      label: 'Incident Details',
      name: 'IncidentDetail',
    },
    {
      fieldId: `IA_P_IncidentType`,
      translationId: 'IM_IA_IncidentType',
      label: 'Incident Type',
      name: 'IncidentType',
    },
    {
      fieldId: `IA_P_Clinical/NonClinical`,
      translationId: 'IM_IA_Clinical/NonClinical',
      label: 'Clinical/Non-Clinical',
      name: 'ClinicalType',
    },
    {
      fieldId: `IA_P_IncidentDepartment`,
      translationId: 'IM_IA_IncidentDepartment',
      label: 'Incident Department',
      name: 'DepartmentName',
    },
    {
      fieldId: `IA_P_LocationDetails(Roomnoetc)`,
      translationId: 'IM_IA_LocationDetails(Roomnoetc)',
      label: 'Location Details/Room No etc',
      name: 'LocationDetials',
    },
    {
      fieldId: `IA_P_HarmLevel`,
      translationId: 'IM_IA_HarmLevel',
      label: 'Harm Level',
      name: 'IncidentHarmLevel',
    },
    {
      fieldId: `IA_P_Anyadditionalstaffyouwishtobenotified`,
      translationId: 'IM_IA_Anyadditionalstaffyouwishtobenotified',
      label: 'Any Additional Staff You Wish To Be Notified',
      name: 'AdditionalStaffNotify',
    },
    {
      fieldId: `IA_P_ApprovedBy`,
      translationId: 'IM_IA_ApprovedBy',
      label: 'Approved By',
      name: 'ApprovedBy',
    },
    {
      fieldId: `IA_P_ApprovedDate`,
      translationId: 'IM_IA_ApprovedDate',
      label: 'Approved Date',
      name: 'ApprovalDate',
    },
    {
      fieldId: `IA_P_ApprovedTime`,
      translationId: 'IM_IA_ApprovedTime',
      label: 'Approved Time',
      name: 'ApprovalTime',
    },
    {
      fieldId: `IA_P_IncidentStatus`,
      translationId: 'IM_IA_IncidentStatus',
      label: 'Status',
      name: 'ApproverStatus',
    },
    {
      fieldId: `IA_P_AffectedCategory`,
      translationId: 'IM_IA_AffectedCategory',
      label: 'AffectedCategory',
      name: 'AffectedCategory',
    },
    {
      fieldId: `IA_P_AffectedCategoryCode`,
      translationId: 'IM_IA_AffectedCategoryCode',
      label: 'AffectedCategoryCode',
      name: 'AffectedCategoryCode',
    },
    {
      fieldId: `IA_P_MainCategoryCode`,
      translationId: 'IM_IA_MainCategoryCode',
      label: 'MainCategoryCode',
      name: 'MainCategoryCode',
    },
    {
      fieldId: `IA_P_SubCategoryCode`,
      translationId: 'IM_IA_SubCategoryCode',
      label: 'SubCategoryCode',
      name: 'SubCategoryCode',
    },
    {
      fieldId: `IA_P_IncidentDetailsCode`,
      translationId: 'IM_IA_IncidentDetailsCode',
      label: 'IncidentDetailsCode',
      name: 'IncidentDetailCode',
    },
  
  ];

  const AssignedInvestigator = [
    {
      fieldId: `IA_P_AssignedInvestigator(s)`,
      translationId: 'IM_IA_InvestigatorName',
      label: 'Name',
      name: 'UserName',
    },
    {
      fieldId: `IA_AI_Department`,
      translationId: 'IM_IA_Department',
      label: 'Department',
      name: 'Department',
    },
    {
      fieldId: `IA_AI_Designation`,
      translationId: 'IM_IA_Designation',
      label: 'Designation',
      name: 'Designation',
    },
    {
      fieldId: `IA_AI_InvestigationComments`,
      translationId: 'IM_IA_InvestigationComments',
      label: 'Investigation Comments',
      name: 'Comments',
    },
    {
      fieldId: `IA_AI_AssignedBy`,
      translationId: 'IM_IA_AssignedBy',
      label: 'Assigned By',
      name: 'AssignedBy',
    },
    {
      fieldId: `IA_AI_AssignedOn`,
      translationId: 'IM_IA_AssignedOn',
      label: 'Assigned On',
      name: 'AssignOn',
    },
  ];
  const opinionsExchangedConfig = [
    {
      fieldId: `IA_OE_Facility`,
      translationId: 'IM_IA_Facility',
      label: 'Name',
      name: 'UserName',
    },
    {
      fieldId: `IA_OE_EmployeeId`,
      translationId: 'IM_IA_EmployeeId',
      label: 'Department',
      name: 'DepartmentName',
    },
    {
      fieldId: `IA_OE_StaffName`,
      translationId: 'IM_IA_StaffName',
      label: 'Designation',
      name: 'DesignationName',
    },
    {
      fieldId: `IA_OE_Department`,
      translationId: 'IM_IA_Department',
      label: 'Investigation Comments',
      name: 'Comments',
    },
    {
      fieldId: `IA_OE_Designation`,
      translationId: 'IM_IA_Designation',
      label: 'Assigned By',
      name: 'AssignedBy',
    },
    {
      fieldId: `IA_OE_OpinionComments`,
      translationId: 'IM_IA_OpinionComments',
      label: 'Assigned On',
      name: 'AssignOn',
    },
  ];
  const rejectionHistoryConfig = [
    {
      fieldId: `IA_RH_RejectedBy`,
      translationId: 'IM_IA_RejectedBy',
      label: 'Name',
      name: 'UserName',
    },
    {
      fieldId: `IA_RH_Department`,
      translationId: 'IM_IA_Department',
      label: 'Department',
      name: 'DepartmentName',
    },
    {
      fieldId: `IA_RH_RejectedDate`,
      translationId: 'IM_IA_RejectedDate',
      label: 'Designation',
      name: 'DesignationName',
    },
    {
      fieldId: `IA_RH_ReasonforRejection`,
      translationId: 'IM_IA_ReasonforRejection',
      label: 'Assigned By',
      name: 'AssignedBy',
    },
 
  ];
  const reAssignedInvestigatorHistoryConfig = [
    {
      fieldId: `IA_RIH_Re-Assigned_InvestigatorBy`,
      translationId: 'IM_IA_Re-Assigned_InvestigatorBy',
      label: 'Name',
      name: 'UserName',
    },
    {
      fieldId: `IA_RIH_Re-Assigned_InvestigatorDate`,
      translationId: 'IM_IA_Re-Assigned_InvestigatorDate',
      label: 'Department',
      name: 'DepartmentName',
    },
    {
      fieldId: `IA_RIH_FromInvestigator`,
      translationId: 'IM_IA_FromInvestigator',
      label: 'Designation',
      name: 'DesignationName',
    },
    {
      fieldId: `IA_RIH_ToInvestigator`,
      translationId: 'IM_IA_ToInvestigator',
      label: 'Investigation Comments',
      name: 'Comments',
    },
    {
      fieldId: `Remarks`,
      translationId: 'IM_IA_Remarks',
      label: 'Assigned By',
      name: 'AssignedBy',
    },
  ];
  const requestInformationHistoryConfig = [
    {
      fieldId: `IA_RIH_Requested_HistoryDate`,
      translationId: 'IM_IA_Requested_HistoryDate',
      label: 'Name',
      name: 'RequestedDate',
    },
    {
      fieldId: `IA_RIH_RequestedBy`,
      translationId: 'IM_IA_RequestedBy',
      label: 'Department',
      name: 'DepartmentName',
    },
    {
      fieldId: `IA_RIH_Department`,
      translationId: 'IM_IA_Department',
      label: 'Designation',
      name: 'Department',
    },
    {
      fieldId: `IA_RIH_Designation`,
      translationId: 'IM_IA_Designation',
      label: 'Investigation Comments',
      name: 'Designation',
    },
    {
      fieldId: `Remarks`,
      translationId: 'IM_IA_Remarks',
      label: 'Assigned By',
      name: 'RequestedRemarks',
    },
  ];
  const reAssignedOpinionrespondentsConfig = [
    {
      fieldId: `IA_RORH_OpinionId`,
      translationId: 'IM_IA_OpinionId',
      label: 'Name',
      name: 'UserName',
    },
    {
      fieldId: `IA_RORH_Re-Assigned_OpinionBy`,
      translationId: 'IM_IA_Re-Assigned_OpinionBy',
      label: 'Department',
      name: 'DepartmentName',
    },
    {
      fieldId: `IA_RORH_Re-Assigned_OpinionDate`,
      translationId: 'IM_IA_Re-Assigned_OpinionDate',
      label: 'Designation',
      name: 'DesignationName',
    },
    {
      fieldId: `IA_RORH_PreviousRespondentName`,
      translationId: 'IM_IA_PreviousRespondentName',
      label: 'Investigation Comments',
      name: 'Comments',
    },
    {
      fieldId: `IA_RORH_RespondentName`,
      translationId: 'IM_IA_RespondentName',
      label: 'Assigned By',
      name: 'AssignedBy',
    },
    {
      fieldId: `IA_RORH_ReasonForChange`,
      translationId: 'IM_IA_ReasonForChange',
      label: 'Assigned By',
      name: 'AssignedBy',
    },
  ];

  const { data: labelsData = [], isFetching: isLabelsFetching } =
    useGetLabelsQuery({
      menuId: 26,
      moduleId: 2,
    });
  const { data: fieldsData = [], isFetching: isFieldsFetching } =
    useGetFieldsQuery({
      menuId: 26,
      moduleId: 2,
    });

  const fields =
    fieldsData?.Data?.Menus?.filter((item) => item.MenuId === 26) || [];

    const labels = (labelsData.Data || [])
    .filter((item) => item.MenuId === 26)
    .flatMap((item) =>
      (item.Regions || [])
        .filter((region) => {
          if (regionCode === 'ALL') {
            return region.RegionCode === 'ALL';
          } else if (regionCode === 'ABD') {
            return region.RegionCode === 'ABD' || region.RegionCode === 'ALL';
          }
        })
        .flatMap((region) => region.Labels || [])
    );

  const filterLabels = { Data: labels };

  const initialConfigs = {
    fieldsConfig,
    AssignedInvestigator,
    opinionsExchangedConfig,
    rejectionHistoryConfig,
    reAssignedInvestigatorHistoryConfig,
    requestInformationHistoryConfig,
    reAssignedOpinionrespondentsConfig,
  }
 
  const [configs, setConfigs] = useState(initialConfigs);

 useEffect(() => {
    setConfigs(initialConfigs);
  }, [regionCode]);


  useEffect(() => {
    if (fields?.length > 0) {
      const matchingSections = fields[0]?.Sections?.filter(
        (section) =>
          section.SectionName === 'Accordion-Assigned Investigator(s)' ||
        section.SectionName === 'Accordion-Page' ||
        section.SectionName === 'Accordion-Opinion(s) Exchanged' ||
        section.SectionName === 'Accordion-Rejection History' ||
        section.SectionName === 'Accordion-Re-Assigned Investigator(s) History' ||
        section.SectionName === 'Accordion-Request Information History' ||
        section.SectionName === 'Accordion-Re-Assigned Opinion Respondent(s) History'
      );

      const pageFields = matchingSections?.flatMap(
        (section) =>
          section?.Regions?.filter((region) => {
            const isIncluded =
              regionCode === 'ABD'
                ? region.RegionCode === 'ABD' || region.RegionCode === 'ALL'
                : 
                  region.RegionCode === 'ALL';
            return isIncluded;
          }).flatMap((region) => region.Fields || []) || []
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
  }, [fields[0]], regionCode);

  const DynamicModal = ({ open, onClose, title, data }) => (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 50,
        style: { backdropFilter: 'blur(8px)' },
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          maxHeight: '90vh',
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          outline: 'none',
          borderColor: 'black',
          overflow: 'auto',
        }}
      >

        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '50%',
            border: 'none',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <i className="fas fa-times" style={{ fontSize: '16px' }}></i>
        </button>

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            background: '#0264AB',
            color: 'white',
            padding: '8px',
            borderRadius: '8px 8px 0 0',
          }}
        >
          {title}
        </Typography>

        <div
          style={{
            maxHeight: 'calc(90vh - 96px)',
            overflowY: 'auto',
            padding: '16px',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              margin: '0 auto',
            }}
          >
            <tbody>
              {data?.map((item, index) => (
                <tr key={index}>
                  <td
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      backgroundColor: '#d8280b',
                      fontWeight: '600',
                      color: 'white',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      textTransform: 'capitalize',
                    }}
                  >
                    {item.Type || 'N/A'}
                  </td>
                  <td
                    style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      backgroundColor: index % 2 === 0 ? '#e3e1e1' : 'white',
                      textAlign: 'center',
                      verticalAlign: 'middle',
                      textTransform: 'capitalize',
                    }}
                  >
                    {item.Definition || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Box>
    </Modal>
  );

  return (
    <FormContainer style={{ marginBottom: '20px' }}>
      <FlexContainer flexDirection={'column'}>
        <Grid container spacing={2} p={0} mb={5}>
          {configs.fieldsConfig?.map((fieldConfig) => {
            const fieldValue = incidentApprovalSafe[fieldConfig.name] ?? '';

            const getFormattedValue = (value, name) => {
              if (name === 'ApprovalDate' && value) {
                return formatDate(value);
              }
              if (name === 'ApprovalTime' && value) {
                const [hours, minutes] = value.split(':');
                return `${hours}:${minutes}`;
              }
              return value;
            };
            const openModalForField = () => {
              const modalConfig = {
                ClinicalType: {
                  title: 'Clinical/Non Clinical Definition',
                  data: clinicalDefinition,
                },
                IncidentTypeName: {
                  title: 'Incident Type',
                  data: incidentTypeDefinition,
                },
                IncidentHarmLevel: {
                  title: 'Harm Level',
                  data: harmLevelDefinition,
                }
              };

              const { title, data } = modalConfig[fieldConfig.name] || {};
              if (title && data) {
                handleModalOpen(title, data);
              }
            };


            return (
              <Grid item xs={4} key={fieldConfig.fieldId}>
                <FormLabel>
                  {getlabel(
                    fieldConfig?.translationId,
                    filterLabels,
                    i18n.language
                  )}
                    {(fieldConfig.name === 'ClinicalType' ||
                    fieldConfig.name === 'IncidentTypeName' ||
                    fieldConfig.name === 'IncidentHarmLevel') && (
                    <Tooltip title="View Definition">
                      <IconButton
                        size="small"
                        onClick={openModalForField}
                        style={{
                          marginLeft: '8px',
                          padding: '2px',
                          color: '#3498DB', 
                        }}
                      >
                        <i className="fas fa-info-circle"></i>{' '}
                      </IconButton>
                    </Tooltip>
                  )}
                  
                </FormLabel>
                <StyledTypography>
                  {getFormattedValue(fieldValue, fieldConfig.name) || ''}
                </StyledTypography>
              </Grid>
            );
          })}
        </Grid>
        <DynamicModal
          open={isModalOpen}
          onClose={handleModalClose}
          title={modalData.title}
          data={modalData.data}
        />
      </FlexContainer>
      <FormLabel style={{ marginBottom: '10px', marginTop: '10px' }}>
        {getlabel('IM_IA_AssignedInvestigator(s)', filterLabels, i18n.language)}
      </FormLabel>
      <ApproveIncidentTable
        columns={configs.AssignedInvestigator}
        labels={filterLabels}
        data={incidentApprovalSafe?.assignedInvestigatorList}
      />
      <FormLabel style={{ marginBottom: '10px', marginTop: '10px' }}>
        {getlabel('IM_IA_Opinion(s)Exchanged', filterLabels, i18n.language)}
      </FormLabel>
      <ApproveIncidentTable
        columns={configs.opinionsExchangedConfig}
        labels={filterLabels}
      />
      <FormLabel style={{ marginBottom: '10px', marginTop: '10px' }}>
        {getlabel('IM_IA_RejectionHistory', filterLabels, i18n.language)}
      </FormLabel>
      <ApproveIncidentTable
        columns={configs.rejectionHistoryConfig}
        labels={filterLabels}
      />
      <FormLabel style={{ marginBottom: '10px', marginTop: '10px' }}>
        {getlabel('IM_IA_Re-AssignedInvestigator(s)History', filterLabels, i18n.language)}
      </FormLabel>
      <ApproveIncidentTable
        columns={configs.reAssignedInvestigatorHistoryConfig}
        labels={filterLabels}
      />
      <FormLabel style={{ marginBottom: '10px', marginTop: '10px' }}>
        {getlabel('IM_IA_RequestInformationHistory', filterLabels, i18n.language)}
      </FormLabel>
      <ApproveIncidentTable
        columns={configs.requestInformationHistoryConfig}
        labels={filterLabels}
        data={incidentApprovalSafe?.requestedHistory}

      />
      <FormLabel style={{ marginBottom: '10px', marginTop: '10px' }}>
        {getlabel('IM_IA_Re-AssignedOpinionRespondent(s)History', filterLabels, i18n.language)}
      </FormLabel>
      <ApproveIncidentTable
        columns={configs.reAssignedOpinionrespondentsConfig}
        labels={filterLabels}
      />

    </FormContainer>
    
  );

};

export default IncidentApprovalDetails;
