import { Grid, TextField, Typography, Button, TableContainer, Table, Paper, TableBody } from '@mui/material';
import {
  FlexContainer,
  StyledButton,
  StyledImage,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import {
  FormContainer,
  StyledGridContainer,
  StyledGridItem,
} from '../IncidentClosure.styled';
import AddSubMaster from '../../../../assets/Icons/AddSubMaster.png';
import DoNotDisturbAltIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import Label from '../../../../components/Label/Label';
import SearchIcon from '../../../../assets/Icons/SearchWhite.png';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import styled from 'styled-components';
import TextArea from '../../../../components/TextArea/TextArea';
import NegligenceFromStaffTable from './Datatable/NegligenceFromStaffTable';
import FurtherActionTable from './Datatable/FurtherActionTable';
import Attach from '../../../../assets/Icons/Attach.png';
import { StyledTableBodyCell, StyledTableHead, StyledTableHeaderCell, StyledTableRow } from '../../../../utils/DataTable.styled';
import { ActionButton } from '../../IncidentInvestigation/IncidentInvestigation.styled'
import SaveIcon from '../../../../assets/Icons/SaveIcon.png';
import SubmitTik from '../../../../assets/Icons/SubmitTik.png';

const ReadOnlyText = styled(StyledTypography)`
  font-weight: 500 !important;
  font-size: 14px !important;
`;

const IC_Pending_ICE_IncidentClosure = () => {
  return (
    <FormContainer style={{ marginBottom: '20px' }}>
      <StyledGridContainer style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StyledGridItem>
          <Label bold value={'Incident Main Category'} />
          <StyledButton
            variant="contained"
            color="success"
            padding="6px 16px"
            height="32px"
            startIcon={
              <StyledImage
                height="16px"
                width="16px"
                src={SearchIcon}
                alt="Add New Icon"
                style={{ marginInlineEnd: 8 }}
              />
            }
          >
            Select from list
          </StyledButton>
        </StyledGridItem>
        <StyledGridItem>
          <Label bold value="Incident Title" isRequired />
          <Dropdown
            name={'incidentNumber'}
            options={[
              { text: 'One', value: '1' },
              { text: 'Two', value: '2' },
              { text: 'Three', value: '3' },
            ]}
            onChange={(e) => setFieldValue('incidentNumber', e.target.value)}
          />
        </StyledGridItem>
      </StyledGridContainer>

      <StyledGridContainer>
        <StyledGridItem>
          <Label bold value={'Incident Main Category'} />
          <ReadOnlyText> Accommodation related issues</ReadOnlyText>
        </StyledGridItem>
        <StyledGridItem>
          <Label bold value={'Incident Sub Category:'} />
          <ReadOnlyText>
            {' '}
            The Arrival of candidates to accommodation without prior Notice form
            HR/Recruitment
          </ReadOnlyText>
        </StyledGridItem>
        <StyledGridItem>
          <Label bold value={'Incident Details:'} />
          <ReadOnlyText> -</ReadOnlyText>
        </StyledGridItem>
        <StyledGridItem>
          <Label bold value={'Clinical/Non Clinical'} />
          <ReadOnlyText> Clinical</ReadOnlyText>
        </StyledGridItem>
        <StyledGridItem>
          <Label bold value="JAWDA Incident Level" isRequired />
          <Dropdown
            name={'incidentNumber'}
            options={[
              { text: 'One', value: '1' },
              { text: 'Two', value: '2' },
              { text: 'Three', value: '3' },
            ]}
            onChange={(e) => setFieldValue('incidentNumber', e.target.value)}
          />
        </StyledGridItem>
        <StyledGridItem>
          <Label bold value={'Incident Reason / Root Cause:'} />
          <TextArea />
        </StyledGridItem>
        <StyledGridItem>
          <Label bold value={'Lessons Learned :'} />
          <TextArea />
        </StyledGridItem>
        <StyledGridItem>
          <Label bold value="Harm Level" isRequired />
          <Dropdown
            name={'incidentNumber'}
            options={[
              { text: 'One', value: '1' },
              { text: 'Two', value: '2' },
              { text: 'Three', value: '3' },
            ]}
            onChange={(e) => setFieldValue('incidentNumber', e.target.value)}
          />
        </StyledGridItem>
        <StyledGridItem>
          <Label
            bold
            value={'Medication Incident Harm level :'}
            isRequired={true}
          />
          <ReadOnlyText> Not Applicable</ReadOnlyText>
        </StyledGridItem>
        <StyledGridItem>
          <Label bold value="Contributing Factors:" isRequired />
          <Dropdown
            name={'incidentNumber'}
            options={[
              { text: 'One', value: '1' },
              { text: 'Two', value: '2' },
              { text: 'Three', value: '3' },
            ]}
            onChange={(e) => setFieldValue('incidentNumber', e.target.value)}
          />
        </StyledGridItem>
        <StyledGridItem>
          <Label bold value="Contributing Departments:" isRequired />
          <Dropdown
            name={'incidentNumber'}
            options={[
              { text: 'One', value: '1' },
              { text: 'Two', value: '2' },
              { text: 'Three', value: '3' },
            ]}
            onChange={(e) => setFieldValue('incidentNumber', e.target.value)}
          />
        </StyledGridItem>
        <StyledGridItem>
          <Label bold value="Incident Reoccurrence:" isRequired />
          <Dropdown
            disabled={'true'}
            name={'incidentNumber'}
            options={[
              { text: 'One', value: '1' },
              { text: 'Two', value: '2' },
              { text: 'Three', value: '3' },
            ]}
            onChange={(e) => setFieldValue('incidentNumber', e.target.value)}
          />
        </StyledGridItem>
        
      </StyledGridContainer>
      <FlexContainer padding={'0 20px'} flexDirection={'column'}>
          <Label bold value={'Negligence from Staff:'} isRequired={true} />
      <NegligenceFromStaffTable />
      
      <FlexContainer
          style={{
            marginTop: '20px',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <StyledButton
            variant="contained"
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
          >
            Add More
          </StyledButton>
        </FlexContainer>
        </FlexContainer>

        <FlexContainer padding={'0 20px'} flexDirection={'column'}>
          <Label bold value={'Further Actions Taken By Approver:'} isRequired={true} />
      <FurtherActionTable />
      
      <FlexContainer
          style={{
            marginTop: '20px',
            justifyContent: 'flex-end',
            gap: '10px',
          }}
        >
          <StyledButton
            variant="contained"
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
          >
            Add More
          </StyledButton>
        </FlexContainer>
        </FlexContainer>   
        <StyledGridContainer style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StyledGridItem item xs={12} sm={4}>
          <Label bold value="To be Discussed in Committee:" isRequired />
          <TextField
            name="branchName"
          />
        </StyledGridItem>
        <StyledGridItem>
          <Label bold value="Report to External Body:" isRequired />
          <Dropdown
            name={'incidentNumber'}
            options={[
              { text: 'One', value: '1' },
              { text: 'Two', value: '2' },
              { text: 'Three', value: '3' },
            ]}
            onChange={(e) => setFieldValue('incidentNumber', e.target.value)}
          />
        </StyledGridItem>
        <StyledGridItem item xs={12} sm={4}>
          <Label bold value="Remark:" isRequired />
          <TextField
            name="branchName"
          />
        </StyledGridItem>
          </StyledGridContainer>   
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
          <Label bold value="Existing Attachment(s):" isRequired />
          <TableContainer component={Paper}>
        <Table>
          <StyledTableHead backgroundColor="#BE86FF73">
            <StyledTableRow>
              <StyledTableHeaderCell color="#000000A6">
                Attachments
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Actions
              </StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableBodyCell>No data Found</StyledTableBodyCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
        </Grid>
      </Grid>          

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

export default IC_Pending_ICE_IncidentClosure;
