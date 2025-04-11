import { useTranslation } from 'react-i18next';
import {
  FlexContainer,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
} from '@mui/material';
import Label from '../../../../components/Label/Label';
import {
  useGetFieldsQuery,
  useGetLabelsQuery,
} from '../../../../redux/RTK/moduleDataApi';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getlabel } from '../../../../utils/language';
import { useGetApprovalDetailsByIdQuery } from '../../../../redux/RTK/IncidentManagement/incidentInvestigationApprovalApi';
import formatDate from '../../../../utils/FormatDate';
import { useParams } from 'react-router-dom';

const InvestigationCompletedDetails = ({ incidentId }) => {
  //* Hooks Declaration
  const { t, i18n } = useTranslation();
  const { id } = useParams();

  //* Selectors
  const { selectedMenu, regionCode, selectedModuleId, userDetails } =
    useSelector((state) => state.auth);

  //* State variables
  const [fieldLabels, setFieldLabels] = useState([]);
  const [pageFields, setPageFields] = useState([]);
  const [invApprovalDetails, setInvApprovalDetails] = useState({
    action: '',
    department: '',
    approvedDate: '',
    approverRemarks: '',
    submittedBy: '',
  });

  //* RTK Queries

  const { data: labels = [], isFetching: labelsFetching } = useGetLabelsQuery({
    menuId: selectedMenu?.id,
    moduleId: 2,
    // moduleId: selectedModuleId,
  });

  const { data: fieldAccess = [], isFetching: accessFetching } =
    useGetFieldsQuery({
      menuId: selectedMenu?.id,
      moduleId: 2,
      // moduleId: selectedModuleId,
    });

  const { data: approvalDetails } = useGetApprovalDetailsByIdQuery({
    incidentId: incidentId || id,
    loginUserId: userDetails?.UserId,
    menuId: selectedMenu?.id,
  });

  //* Field access checking
  useEffect(() => {
    if (fieldAccess?.Data) {
      const allFieldsData = fieldAccess?.Data?.Menus?.find(
        (section) => section?.MenuId === selectedMenu?.id
      );

      const pageFields = allFieldsData?.Sections?.find(
        (section) => section.SectionName === 'Page'
      );

      if (pageFields) {
        const allFields =
          pageFields?.Regions.find((region) => region?.RegionCode === 'ALL')
            ?.Fields || [];
        const regionBasedFields =
          regionCode === 'ABD'
            ? pageFields?.Regions.find((region) => region?.RegionCode === 'ABD')
                ?.Fields || []
            : [];
        const combinedFields =
          regionBasedFields.length > 0
            ? [...allFields, ...regionBasedFields]
            : allFields;

        setPageFields(combinedFields);
      }
    }
  }, [fieldAccess, regionCode]);

  //* Use Effects to bind values
  useEffect(() => {
    if (labels?.Data) {
      const filteredLabels = labels?.Data?.find(
        (x) => x.MenuId === selectedMenu?.id
      )?.Regions;

      const allLabels =
        filteredLabels?.find((x) => x.RegionCode === 'ALL')?.Labels || [];

      const regionBasedLabels =
        regionCode === 'ABD'
          ? filteredLabels?.find((x) => x.RegionCode === 'ABD')?.Labels || []
          : [];
      const combinedLabels =
        regionBasedLabels.length > 0
          ? [...allLabels, ...regionBasedLabels]
          : allLabels;

      setFieldLabels(combinedLabels);
    }
  }, [labels, regionCode]);

  useEffect(() => {
    if (approvalDetails) {
      setInvApprovalDetails({
        action: approvalDetails?.Data?.ApproverStatus || '',
        department: approvalDetails?.Data?.DepartmentName || '',
        approvedDate: formatDate(approvalDetails?.Data?.SubmittedDate) || '',
        approverRemarks: approvalDetails?.Data?.ApproverRemarks || '',
        submittedBy: approvalDetails?.Data?.SubmittedBy || '',
      });
    }
  }, [approvalDetails]);

  return (
    <FlexContainer
      alignItems="center"
      width="100%"
      flexWrap="wrap"
      style={{
        padding: '15px 0 20px 0',
      }}
    >
      <Accordion
        sx={{
          margin: '10px',
          border: '1px solid  #406883',
          borderRadius: '8px 8px 0px 0px',
          width: '100%',
        }}
        expanded={true}
      >
        <AccordionSummary
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            backgroundColor: '#406883',
            width: '100%',
          }}
        >
          <StyledTypography
            fontSize="18px"
            fontWeight="700"
            lineHeight="20px"
            textAlign="center"
            color="#FFFFFF"
          >
            {t('IM_IncidentInvestigationApproval')}
          </StyledTypography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2} alignItems={'flex-start'}>
            {pageFields?.find((x) => x.FieldId === 'IIA_P_Action')?.IsShow && (
              <Grid item xs={12} sm={12} md={6} lg={3}>
                <Label
                  value={getlabel(
                    'IM_IIA_Action',
                    {
                      Data: fieldLabels,
                      Status: labels?.Status,
                    },
                    i18n.language
                  )}
                  bold={true}
                  isRequired={false}
                />
                <Label
                  value={invApprovalDetails?.action}
                  isRequired={false}
                  bold={true}
                  color={
                    invApprovalDetails?.action === 'Approved' ? 'green' : 'red'
                  }
                />
              </Grid>
            )}
            {pageFields?.find((x) => x.FieldId === 'IIA_P_SubmittedBy')
              ?.IsShow && (
              <Grid item xs={12} sm={12} md={6} lg={3}>
                <Label
                  value={getlabel(
                    'IM_IIA_SubmittedBy',
                    {
                      Data: fieldLabels,
                      Status: labels?.Status,
                    },
                    i18n.language
                  )}
                  bold={true}
                  isRequired={false}
                />
                <Label
                  value={invApprovalDetails?.submittedBy}
                  isRequired={false}
                />
              </Grid>
            )}
            {pageFields?.find((x) => x.FieldId === 'IIA_P_IncidentDepartment')
              ?.IsShow && (
              <Grid item xs={12} sm={12} md={6} lg={3}>
                <Label
                  value={getlabel(
                    'IM_IIA_IncidentDepartment',
                    {
                      Data: fieldLabels,
                      Status: labels?.Status,
                    },
                    i18n.language
                  )}
                  bold={true}
                  isRequired={false}
                />
                <Label
                  value={invApprovalDetails?.department}
                  isRequired={false}
                />
              </Grid>
            )}
            {pageFields?.find((x) => x.FieldId === 'IIA_P_ApprovedDate')
              ?.IsShow && (
              <Grid item xs={12} sm={12} md={6} lg={3}>
                <Label
                  value={getlabel(
                    'IM_IIA_ApprovedDate',
                    {
                      Data: fieldLabels,
                      Status: labels?.Status,
                    },
                    i18n.language
                  )}
                  bold={true}
                  isRequired={false}
                />
                <Label
                  value={invApprovalDetails?.approvedDate}
                  isRequired={false}
                />
              </Grid>
            )}
            {pageFields?.find((x) => x.FieldId === 'IIA_P_ApproverRemarks')
              ?.IsShow && (
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Label
                  value={getlabel(
                    'IM_IIA_ApproverRemarks',
                    {
                      Data: fieldLabels,
                      Status: labels?.Status,
                    },
                    i18n.language
                  )}
                  bold={true}
                  isRequired={false}
                />
                <Label
                  value={invApprovalDetails?.approverRemarks}
                  isRequired={false}
                />
              </Grid>
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>
    </FlexContainer>
  );
};

export default InvestigationCompletedDetails;
