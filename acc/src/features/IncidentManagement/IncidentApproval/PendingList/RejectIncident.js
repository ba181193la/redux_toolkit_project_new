import { Grid, TextField, FormLabel, Accordion, AccordionSummary } from '@mui/material';
import React, { useState } from 'react';
import { FlexContainer, StyledTypography } from '../../../../utils/StyledComponents';
import { ActionButton, FormContainer } from '../../IncidentInvestigation/IncidentInvestigation.styled';
import { useRejectIncidentMutation } from '../../../../redux/RTK/IncidentManagement/incidentApprovalApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { showSweetAlert,showToastAlert } from '../../../../utils/SweetAlert';
import Error from '../../../../assets/Gifs/error.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';

const RejectIncident = ({entryData}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [triggerRejectIncident] = useRejectIncidentMutation();

const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');

  const {
    selectedMenu,
    userDetails,
    selectedFacility,
    selectedModuleId,
  } = useSelector((state) => state.auth);

  const [rejectionReason, setRejectionReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rejectionReason) {
      setError('Reason for rejection is required');
      return;
    }

    setError(''); 

    try {
      const response = await triggerRejectIncident({
        payload: {
          "incidentId": id,
           "facilityId": selectedFacility?.id,
           "approverUserId": userDetails?.UserId,
           "incidentTypeId": entryData?.IncidentTypeId,
           "incidentType":entryData?.IncidentType,
           "clinicalType": entryData?.ClinicalType,
           "affectedCategoryId": entryData?.AffectedCategoryId,
           "affectedCategory": entryData?.AffectedCategory,
           "mainCategoryId": entryData?.MainCategoryId,
           "mainCategory": entryData?.MainCategory,
           "subCategoryId": entryData?.SubCategoryId,
           "subCategory": entryData?.SubCategory,
           "incidentDetailId": entryData?.IncidentDetailId,
           "incidentDetail": entryData?.IncidentDetail,
           "departmentId": entryData?.DepartmentId,
           "departmentName": entryData?.DepartmentName,
           "incidentHarmLevelId": entryData?.IncidentHarmLevelId,
           "incidentHarmLevel": entryData?.IncidentHarmLevel,
           "incidentReoccurence": "no",
           "incidentClosureTATId": 1,
           "closureTATDays": 1,
           "locationDetials": "",
           "additionalStaffNotify": entryData?.AdditionalStaffNotify,
           "approverStatus": "Rejected",
           "isSentinel": true,
           "slaPriority": "",
           "rejectedReason" : rejectionReason,
           "moduleId": selectedModuleId,
           "menuId": selectedMenu?.id,
           "loginUserId": userDetails?.UserId,
           "othersName": "",
           "incidentApproval_ReoccurrenceLog": [],
           "incidentApproval_AdditionalNotifyStaff": []
          },
      }).unwrap();

      showToastAlert({
        type: 'custom_success',
        text: response.Message,
        gif: SuccessGif,
      });
      setMessage(response.Message);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      navigate("/IncidentManagement/IncidentApproval");

    } catch (error) {

      if (error && error.data) {
        showSweetAlert({
          type: 'warning',
          title: 'Oops!',
          text: error.data,
          gif: Error,
          showConfirmButton: true, 
        confirmButtonText: 'Close', 
        });
        setColor('#e63a2e');
        setMessage('Failed');
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      }

    }
  };

  return (
    <Accordion
      sx={{
        borderColor: '#3498db',
        marginBottom: '10px',
        border: '1px solid #3498db',
        borderRadius: '8px 8px 0px 0px',
      }}
      expanded={true}
    >
      <AccordionSummary
        aria-controls="panel1-content"
        id="panel1-header"
        sx={{
          backgroundColor: '#3498db',
          width: '100%',
        }}
      >
        <StyledTypography
          fontSize="16px"
          fontWeight="700"
          lineHeight="20px"
          textAlign="center"
          color="#FFFFFF"
          border={'1px solid #3498db'}
        >
          Reject Incident
        </StyledTypography>
      </AccordionSummary>

      <FormContainer style={{ marginBottom: '10px', paddingLeft: '0px' }}>
        <FlexContainer flexDirection="column" gap="16px">
          {/* Reason for rejection input field */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormLabel style={{ marginBottom: '8px', display: 'block' }}>
                Reason for rejection
                {<span style={{ color: 'red' }}> *</span>}:
              </FormLabel>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Enter your remarks here"
                sx={{
                  '& .MuiInputBase-input': {
                    fontWeight: 'bold',
                  },
                }}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                error={!!error}
                helperText={error} 
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
                backgroundColor: '#d9534f',
                color: 'white',
              }}
              startIcon={<i className="fas fa-save" style={{ marginInlineEnd: 8 }} />}
              onClick={handleSubmit} 
            >
              Reject
            </ActionButton>
          </FlexContainer>
        </FlexContainer>
      </FormContainer>
    </Accordion>
  );
};

export default RejectIncident;
