import {
  FormControlLabel,
  Modal,
  Box,
  Grid,
  Backdrop,
  IconButton,
  Typography, 
  Tooltip,
  Button,
  Accordion,
  AccordionSummary,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import {
  FlexContainer,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import { FormContainer, FormLabel } from '../../IncidentCommon/IncidentInvestigation.styled';
import ApproveIncidentTable from '../../IncidentCommon/Datatable/ApproveIncidentTable';
import { useTranslation } from 'react-i18next';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { getlabel } from '../../../../utils/language';
import {  useGetDefinitionQuery } from '../../../../redux/RTK/incidentInvestigationApi';

import { useGetApprovalviewDataQuery } from '../../../../redux/RTK/IncidentManagement/incidentApprovalApi'

import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import formatDate from '../../../../utils/FormatDate';
import RejectedByInvestigatorTable from './RejectedByInvestigatorTable';

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
  useGetApprovalviewDataQuery(
      {
        menuId: 26,
        loginUserId: userDetails?.UserId,
        incidentId: id,
         moduleId: selectedModuleId
      },
      { skip: !id }
    );




  const incidentApprovalSafe = approvalData?.Data || {};

  const rejectedHistory = approvalData?.Data.rejectedHistory || [];


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
      name: 'IncidentTypeName',
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
      name: 'DepartmentName',
    },
    {
      fieldId: `IA_AI_Designation`,
      translationId: 'IM_IA_Designation',
      label: 'Designation',
      name: 'DesignationName',
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

  const rejectedByInvestigator = [
    {
      fieldId: `IA_RbI_InvestigatorName`,
      translationId: 'IM_IA_InvestigatorName',
      label: 'InvestigatorName',
      name: 'InvestigatorName',
    },
    {
      fieldId: `IA_RbI_Remarks`,
      translationId: 'IM_IA_Remarks',
      label: 'Remarks',
      name: 'Remarks',
    },
    {
      fieldId: `IA_RbI_Replace`,
      translationId: 'IM_IA_Replace',
      label: 'Replace',
      name: 'Replace',
    },
    {
      fieldId: `IA_RbI_Department`,
      translationId: 'IM_IA_Department',
      label: 'Department',
      name: 'Department',
    },
    {
      fieldId: `IA_RbI_Designation`,
      translationId: 'IM_IA_Designation',
      label: 'Designation',
      name: 'AssignOn',
    },
    {
      fieldId: `IA_RbI_InvestigationComments`,
      translationId: 'IM_IA_InvestigationComments',
      label: 'InvestigationComments',
      name: 'InvestigationComments',
    },
  ]

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
        .filter((region) => region.RegionCode === 'ALL')
        .flatMap((region) => region.Labels || [])
    );

  const filterLabels = { Data: labels };

 
  const [configs, setConfigs] = useState({
    fieldsConfig,
    AssignedInvestigator,
    opinionsExchangedConfig,
    rejectedByInvestigator
  });

  useEffect(() => {
    if (fields?.length > 0) {
      const matchingSections = fields[0]?.Sections?.filter(
        (section) =>
          section.SectionName === 'Accordion-Assigned Investigator(s)' ||
          section.SectionName === 'Accordion-Page' ||
          section.SectionName === 'Accordion-Opinion(s) Exchanged' ||
          section.SectionName === 'Rejected by Investigator(s)' 

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
        <Grid container spacing={2} p={0}>
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
      />

<FormLabel style={{ marginBottom: '10px', marginTop: '10px' }}>
          {getlabel(
            'IM_IA_RejectedbyInvestigator(s)',
            filterLabels,
            i18n.language
          )}
          :
        </FormLabel>
        <RejectedByInvestigatorTable
          columns={configs.rejectedByInvestigator}
          labels={filterLabels}
        data={rejectedHistory}
        viewData={approvalData?.Data}
        />

    </FormContainer>
    
  );

};

export default IncidentApprovalDetails;
