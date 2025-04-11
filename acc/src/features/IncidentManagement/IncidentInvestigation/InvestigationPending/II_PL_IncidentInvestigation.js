import { Grid, TextField, Typography, Button, MenuItem } from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import {
  ActionButton,
  FormContainer,
  StyledGridContainer,
  StyledGridItem,
  ReadOnlyText,
} from '../IncidentInvestigation.styled';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';
import DoNotDisturbAltIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import Label from '../../../../components/Label/Label';
import TextArea from '../../../../components/TextArea/TextArea';
import II_PL_ActionTable from './Datatable/II_PL_ActionTable';
import II_PL_OpnionExchangeTable from './Datatable/II_PL_OpnionExchangeTable';
import Attach from '../../../../assets/Icons/Attach.png'
import SaveIcon from '../../../../assets/Icons/SaveIcon.png'
import SubmitTik from '../../../../assets/Icons/SubmitTik.png'

const II_PL_IncidentInvestigation = () => {
  return (
    <FormContainer style={{ marginBottom: '20px' }}>
      <FlexContainer flexDirection={'column'}>
        {/* <SectionHeader>Incident Approval Entry</SectionHeader> */}
        <StyledGridContainer>
          {/* Row 1 */}
          <StyledGridItem>
            <Label bold value={'Investigator Name :'} />
            <ReadOnlyText> Dr. Mohamed</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Department/speciality :'} />
            <ReadOnlyText> Obstetrics and Gynecology</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Designation :'} />
            <ReadOnlyText> Consultant Obstetrics and Gynecology</ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Approver comment'} />
            <ReadOnlyText> plz check </ReadOnlyText>
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Incident Reason / Root Cause:'} />
            <TextArea />
          </StyledGridItem>
          <StyledGridItem>
            <Label bold value={'Lessons Learned :'} />
            <TextArea />
          </StyledGridItem>
        </StyledGridContainer>

        <FlexContainer flexDirection="column" margin="10px 0px 10px 20px">
          <Label bold value={'Actions taken for Prevention of Incident again*:'} marginBottom={'20px'} />
          <II_PL_ActionTable />
        </FlexContainer>

        <FlexContainer
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
        <FlexContainer flexDirection="column" margin="10px 0px 10px 20px">
          <Label bold value={'Opinion(s) Exchanged :'} marginBottom={'20px'} />
          <II_PL_OpnionExchangeTable />
        </FlexContainer>

        <Grid container spacing={2} p={2}>
        <Grid item xs={6} md={6}>
          <FlexContainer flexDirection="column">
            <Label bold value="Attachments:" isRequired />
            <div
              style={{
                border: '1px rgba(197, 197, 197, 1)',
                padding: '20px',
                borderRadius: 'Top-left 4px Top-right 4px',
                background: 'rgba(230, 243, 249, 1)',
                height: '140px',
              }}
            >
              <div
                style={{
                  background: 'rgba(255, 255, 255, 1)',
                  height: '140px',
                }}
              >
                <StyledTypography
                  fontSize={'14px'}
                  fontWeight="400"
                  lineHeight="20px"
                >
                  <StyledImage src={Attach} alt="file attachment" />
                  Attachment(s)
                </StyledTypography>
              </div>
            </div>
            <Button variant="contained">Upload Attachment(s)</Button>
            <Typography
              variant="body2"
              color="error"
              style={{ marginTop: '8px' }}
              fontSize="10px"
              lineHeight="16px"
              fontWeight="400"
            >
              Note: Maximum File Upload Limit is 100MB (Images, PDF, Word Files,
              Excel Files Only)
            </Typography>
          </FlexContainer>
        </Grid>
        <Grid item xs={6} md={6}>
        <Label bold value="Comments:" isRequired />
        <TextArea />
        </Grid>
      </Grid>
      </FlexContainer>
      <FlexContainer padding="10px" justifyContent="center" gap="24px">
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

    </FormContainer>
  );
};

export default II_PL_IncidentInvestigation;
