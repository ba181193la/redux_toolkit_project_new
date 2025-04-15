import React, { useState } from 'react';
import { Grid, TextField, FormLabel, Accordion, AccordionSummary } from '@mui/material';
import { FlexContainer, StyledTypography } from '../../../../utils/StyledComponents';
import { ActionButton, FormContainer } from '../../IncidentInvestigation/IncidentInvestigation.styled';
import { useRequestInformationMutation } from '../../../../redux/RTK/IncidentManagement/incidentApprovalApi';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { showSweetAlert,showToastAlert } from '../../../../utils/SweetAlert';
import Error from '../../../../assets/Gifs/error.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';

const RequestInformation = ({entryData}) => {
  const { id } = useParams();
  const [triggerRequestInformation] = useRequestInformationMutation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');

  // State to manage remarks input and error
  const [requestRemarks, setRequestRemarks] = useState('');
  const [error, setError] = useState('');

  const {
    selectedMenu,
    userDetails,
    selectedFacility,
    selectedModuleId,
  } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!requestRemarks) {
      setError('Remarks are required');
      return; 
    }

    setError(''); 

    try {
      const response = await triggerRequestInformation({
        payload: {
          incidentId: id,
          facilityId: selectedFacility?.id,
          approverUserId: userDetails?.UserId,
          approverStatus: 'Requested',
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
          loginUserId: userDetails?.UserId,
          requestRemarks: requestRemarks,
          departmentId: entryData?.id,
          departmentName: entryData?.name,
          incidentApproval_ReoccurrenceLog: [],
          incidentApproval_AdditionalNotifyStaff: [],
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
          Request More Information
        </StyledTypography>
      </AccordionSummary>

      <FormContainer style={{ marginBottom: '10px', paddingLeft: '0px' }}>
        <FlexContainer flexDirection="column" gap="16px">
          {/* Remarks Field */}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormLabel style={{ marginBottom: '8px', display: 'block' }}>
                Remarks
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
                value={requestRemarks}
                onChange={(e) => setRequestRemarks(e.target.value)}
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
                backgroundColor: '#f0ad4e',
                color: 'white',
              }}
              startIcon={<i className="fas fa-save" style={{ marginInlineEnd: 8 }} />}
              onClick={handleSubmit} 
            >
              Request
            </ActionButton>
          </FlexContainer>
        </FlexContainer>
      </FormContainer>
    </Accordion>
  );
};

export default RequestInformation;
