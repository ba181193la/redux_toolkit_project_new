import { Grid, TextField, Typography, Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
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
import IncidentDetailTable from './Datatable/IncidentDetailTable';
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


const IncidentInvestigationDetails = () => {

  const { i18n, t } = useTranslation();

  const fieldsConfig = [
    {
      fieldId: `II_P_InvestigatorName`,
      translationId: 'IM_II_InvestigatorName',
      label: 'Investigator Name',
      name: 'investigatorName',
    },
    {
      fieldId: `II_OE_Designation`,
      translationId: 'IM_II_Designation',
      label: 'Designation',
      name: 'designation',
  
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

  ];

  const tableLabels = [
    
    {
      fieldId: `II_ATfPOIA_ResponsibleStaff`,
      translationId: 'IM_II_ResponsibleStaff',
      label: 'Responsible Staff',
      name: 'responsibleStaff',
      
    },
    {
      fieldId: `II_ATfPOIA_Department`,
      translationId: 'IM_II_Department',
      label: 'Department',
      name: 'Department',
      
    },
    {
      fieldId: `II_ATfPOIA_TaskAssigned`,
      translationId: 'IM_II_TaskAssigned',
      label: 'Task Assigned',
      name: 'taskAssigned',
      
    },
    {
      fieldId: `II_ATfPOIA_Department`,
      translationId: 'IM_II_Designation',
      label: 'Designation',
      name: 'designation',
  
    },
  
   
  ];
  


  const { data: labelsData = [], isFetching: isLabelsFetching } = useGetLabelsQuery(
    {
      menuId: 27,
      moduleId: 2,
    }
  );
  const { data: fieldsData = [], isFetching: isFieldsFetching } = useGetFieldsQuery(
    {
      menuId: 27,
      moduleId: 2,
    }
  );

  const fields = fieldsData?.Data?.Menus?.filter((item) => item.MenuId === 27) || [];


  const labels = (labelsData.Data || [])
  .filter((item) => item.MenuId === 27) 
  .flatMap((item) =>
    (item.Regions || [])
      .filter((region) => region.RegionCode === "ALL") 
      .flatMap((region) => region.Labels || [])
  );

  const filterLabels = { Data: labels} 
     const [configs, setConfigs] = useState({
        fieldsConfig,
        tableLabels,
        titleConfig
      });
      
      useEffect(() => {
        if (fields?.length > 0) {
          const matchingSections = fields[0]?.Sections?.filter(
            (section) =>
              section.SectionName === "Actions Taken for Prevention Of Incident Again" ||
            section.SectionName === "Accordion-Page" ||
            section.SectionName === "Opinion(s) Exchanged" 
          );
      
          const pageFields = matchingSections?.flatMap(
            (section) => section?.Regions?.find((region) => region.RegionCode === "ALL")?.Fields || []
          );
      
          if (pageFields && pageFields.length > 0) {
            const updatedConfigs = Object.entries(configs).reduce(
              (acc, [key, config]) => ({
                ...acc,
                [key]: config.filter((column) => {
                  const pageField = pageFields.find((col) => col.FieldId === column.fieldId);
                  
                  return pageField && pageField.IsShow === true;
                }),
              }),
              {}
            );
            
      
            setConfigs(updatedConfigs);
          }
        }
      }, [fields[0]]);


  


    return (
    <FormContainer style={{ marginBottom: '20px' }}>

      <FlexContainer flexDirection={'column'}>
      

        <Grid container spacing={2} p={2}>
        {configs.fieldsConfig?.map((field) => {
      return (
        <Grid item xs={4} key={field.fieldId}>

          <FormLabel>
  {getlabel(field?.translationId, filterLabels, i18n.language)}*:
            </FormLabel>
          <TextField
            fullWidth
            defaultValue={
              field.name === 'investigatorName'
                ? 'Dr. Mohamed'
                : field.name === 'Department'
                ? 'Department/speciality'
                : field.name === 'designation'
                ? 'Consultant Obstetrics and Gynecology'
                : ''
            }
            disabled
          />
        </Grid>
      );
})}
  
</Grid>

        <StyledGridContainer>
          {/* Row 1 */}
          <StyledGridItem>
            <FormLabel>
              {/* {translatedFields.find((f) => f.name === "approverComment")?.translatedLabel} */}
               {getlabel('IM_II_ApproverComment', filterLabels, i18n.language)}*:
             
            </FormLabel>
            <StyledTypography></StyledTypography>
          </StyledGridItem>
        </StyledGridContainer>

                  {['incidentReasonRootCause', 'recommendationToPreventSimilarIncident'].map((name) => {
            const field = configs?.titleConfig.find((f) => f.name === name);
            if (field) {
              return (
                <FormContainer style={{ marginBottom: '20px' }} key={field.name}>
                  <FlexContainer flexDirection={'column'}>
                    <FormLabel>
                    {getlabel(field?.translationId, filterLabels, i18n.language)}*:

                      </FormLabel>
                    <TextField
                      multiline
                      variant="outlined"
                      fullWidth
                      rows={4}
                    />
                  </FlexContainer>
                </FormContainer>
              );
            }
            return null;
          })}


        <FormLabel style={{ marginBottom: '10px' }}>
        {getlabel('IM_II_ActionsTakenforPreventionOfIncidentAgain', filterLabels, i18n.language)}*:

        </FormLabel>
        <IncidentDetailTable
        columns={configs.tableLabels}
        labels={filterLabels}
        />
        <FlexContainer
          // justifyContent={isMobile ? 'space-between' : 'end'}
          // padding={isMobile ? '0 0px 10px 0' : '0 0px 20px 0'}
          style={{
            marginTop: '20px',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <StyledButton
            variant="contained"
            // padding={isMobile ? '6px 10px' : '6px 16px'}
            marginTop={'10px'}
            startIcon={
              <StyledImage
                height="14px"
                width="14px"
                src={AddSubMaster}
                alt="Add New Icon"
                style={{ marginInlineEnd: 8 }}
              />
            }
            // onClick={() => {
            //   navigate('/MainMaster/StaffSubMaster');
            // }}
          >
            Add More
          </StyledButton>
        </FlexContainer>

        <FormContainer style={{ marginBottom: '20px' }}>
          <FlexContainer flexDirection={'column'}>
            <Grid container spacing={2} p={2}>
              <Grid item xs={6}>
                <FormLabel>{getlabel('IM_II_Attachment(s)', filterLabels, i18n.language)}:</FormLabel>
                <div
                  style={{
                    border: '1px dashed gray',
                    padding: '43px',
                    borderRadius: '4px',
                  }}
                >
                  <Button variant="contained">
                  {getlabel('IM_II_Attachment(s)', filterLabels, i18n.language)}
                  </Button>
                </div>
                <Typography
                  variant="body2"
                  color="error"
                  style={{ marginTop: '8px' }}
                >
                  Note: Maximum File Upload Limit is 100MB (Images, PDF, Word
                  Files, Excel Files Only)
                </Typography>
              </Grid>

              {/* Comments Section */}
              <Grid item xs={6}>
                <FormLabel>Comments:</FormLabel>

                <TextField multiline rows={4} variant="outlined" fullWidth />
              </Grid>
            </Grid>

            <FlexContainer padding="10px" justifyContent="space-evenly">
              <ActionButton
                style={{
                  backgroundColor: '#E8BD11',
                }}
                startIcon={
                  <StyledImage
                    //src={MergeIcon}
                    style={{
                      marginBottom: '1px',
                      marginInlineEnd: 8,
                    }}
                  />
                }
              >
                {t('Submit')}
              </ActionButton>
              <ActionButton
                style={{ backgroundColor: '#E8BD11' }}
                startIcon={
                  <StyledImage
                    // src={SkipIcon}
                    style={{
                      marginBottom: '1px',
                      marginInlineEnd: 8,
                    }}
                  />
                }
              >
                Request Opinion
              </ActionButton>

              <ActionButton
                style={{ backgroundColor: '#C11919' }}
                startIcon={
                  <StyledImage
                    src={RejectIcon}
                    style={{
                      marginBottom: '1px',
                      marginInlineEnd: 8,
                    }}
                  />
                }
              >
                Reject Investigation
              </ActionButton>
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
                <StyledTypography textTransform="none" marginTop="1px">
                {t('Cancel')}
                </StyledTypography>
              </ActionButton>
            </FlexContainer>
          </FlexContainer>
        </FormContainer>
      </FlexContainer>

      {/* </Box> */}
    </FormContainer>
  );
};

export default IncidentInvestigationDetails;
