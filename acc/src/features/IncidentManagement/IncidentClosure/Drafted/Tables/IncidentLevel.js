import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
  Button,
} from '@mui/material';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
} from '../../../../../utils/DataTable.styled';
import DoNotDisturbAltIcon from '../../../../../assets/Icons/DoNotDisturbIcon.png';
import SubmitTik from '../../../../../assets/Icons/SubmitTik.png';
import { FlexContainer, StyledImage, StyledTypography } from '../../../../../utils/StyledComponents';
import { getlabel } from '../../../../../utils/language'; 
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { useNavigate,useParams } from 'react-router-dom';
import { useGetIncidentLevelDataQuery } from '../../../../../redux/RTK/incidentClosureApi'
import { useSaveRCAMutation, useClosureFillRCAMutation } from '../../../../../redux/RTK/incidentClosureApi'
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { showSweetAlert,showToastAlert } from '../../../../../utils/SweetAlert';


const ActionButton = styled(Button)`
  color: #fff !important;
  border-radius: 6px !important;
  text-transform: none !important;
  box-shadow: 0px 4px 4px 0px #00000040 !important;

  &:hover {
    transform: scale(1.05) !important;
    transition: transform 0.3s ease !important;
  }
`;

const IncidentLevel = ({columns, labels, likelihoodId, consequenceLevelId, incidentNo, commondata}) => {

   const [order, setOrder] = useState('asc');
       const [orderBy, setOrderBy] = useState('');
         const navigate = useNavigate();
       
       const { i18n, t } = useTranslation();
         const [message, setMessage] = useState('');
         const [isLoading, setIsLoading] = useState(false);
           const [color, setColor] = useState('');
           const [openSecondPopup, setOpenSecondPopup] = useState(false);
         
       
       const [openRCAPopup, setOpenRCAPopup] = useState(false);
       const [isRCAActionSelected, setIsRCAActionSelected] = useState(null);


       const [triggerFillRCA] = useClosureFillRCAMutation();
       const [triggerSaveRCA] = useSaveRCAMutation();
       
       const handleSecondPopupCancel = () => {
        setOpenSecondPopup(false); 
      };

      const handleSecondPopupOpen = () => {
        setOpenSecondPopup(true); 
      };

       const handleRCASubmit =  async (values) => {
        setOpenRCAPopup(false); 
      try {
        const response = await triggerFillRCA({
          payload: {
            ...commondata,
           },
        }).unwrap();
        navigate("/IncidentManagement/IncidentClosure");
      }
        catch (error) {
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
            setMessage('Upload Failed');
            setTimeout(() => {
              setIsLoading(false);
            }, 2000);
          }
        }
      
      };

      const handleSkipRca =  async (values) => {
        setOpenRCAPopup(false); 
        try {
          const response = await triggerSaveRCA({
            payload: {
              ...commondata,
              "SkipRCA": true,
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
          navigate("/IncidentManagement/IncidentClosure");
          
        }
        catch (error) {
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
            setMessage('Upload Failed');
            setTimeout(() => {
              setIsLoading(false);
            }, 2000);
          }
        }
      };

       const handleFillRCA = (type) => {
        setOpenRCAPopup(true);
      };
      
      const handleRCACancel = () => {
        setOpenRCAPopup(false);
      };
       const {
             data: getIncidentLevelData = [],
             isFetching,
             refetch,
           } = useGetIncidentLevelDataQuery(
             {
               payload: {
                headerFacilityId: 2,
                consequenceLevelId: consequenceLevelId,
                likelihoodId: likelihoodId,
                incidentNo: incidentNo,
                moduleId: 2,
                menuId: 30,
                loginUserId: 1
               },
             },
           );
         const data = getIncidentLevelData?.Data?.incidentRiskLevelClosure

  return (
        <FlexContainer flexDirection="column" width="100%">
        <TableContainer component={Paper}>
          <Table>
            <StyledTableHead backgroundColor="#191970" style={{borderLeft: 'none'}}>
              <StyledTableRow>
                {columns?.map((column) => (
                  <StyledTableHeaderCell color="#fff" key={column.name} style={{textAlign: 'center'}}>
       <TableSortLabel
                        active={orderBy === column.name}
                        direction={orderBy === column.name ? order : 'asc'}
                      >
                        {getlabel(column.translationId, labels, i18n.language)}
                      </TableSortLabel>   
                 </StyledTableHeaderCell>
                ))}
              </StyledTableRow>
            </StyledTableHead>
            <TableBody>
                  {data ? (
                    <StyledTableRow key={data.IncidentRiskLevelId}>
                      {columns.map((column) => (
                        <StyledTableBodyCell key={column.name}>
                        {column.name === 'IsRCARequired' ? (
                          data[column.name] ? (
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
                              <ActionButton
                                style={{
                                  backgroundColor: '#5cb85c',
                                  color: 'white',
                                }}
                                startIcon={
                                  <i className="fas fa-save" style={{ marginInlineEnd: 8 }} />
                                }
                                onClick={() => {
                                  setIsRCAActionSelected('fill');
                                  handleFillRCA();
                                }}
                                // disabled={isActionDisabled || showAccordion}
                              >
                                Fill RCA
                              </ActionButton>
                              <ActionButton
                                style={{
                                  backgroundColor: '#5cb85c',
                                  color: 'white',
                                }}
                                startIcon={
                                  <i className="fas fa-save" style={{ marginInlineEnd: 8 }} />
                                }
                                onClick={() => {
                                  setIsRCAActionSelected('skip');
                                  handleFillRCA();
                                }}
                                // disabled={isActionDisabled || showAccordion} // Add your condition here for disabling
                              >
                                Skip RCA
                              </ActionButton>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
                              <ActionButton
                                style={{
                                  backgroundColor: '#5cb85c',
                                  color: 'white',
                                }}
                                startIcon={
                                  <i className="fas fa-save" style={{ marginInlineEnd: 8 }} />
                                }
                                disabled={true} 
                              >
                                Fill RCA
                              </ActionButton>
                              <ActionButton
                                style={{
                                  backgroundColor: '#5cb85c',
                                  color: 'white',
                                }}
                                startIcon={
                                  <i className="fas fa-save" style={{ marginInlineEnd: 8 }} />
                                }
                                disabled={true}
                              >
                                Skip RCA
                              </ActionButton>
                            </div>
                          )
                        ) : (
                          data[column.name] || 'N/A'
                        )}
                      </StyledTableBodyCell>
                      ))}
                    </StyledTableRow>
                  ) : (
                    <StyledTableRow>
                      <StyledTableBodyCell colSpan={columns.length}>
                        {t('NoDataAvailable')}
                      </StyledTableBodyCell>
                    </StyledTableRow>
                  )}
                </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={openRCAPopup} onClose={handleRCACancel} PaperProps={{
                  style: { width: '360px' },
                        }}>
          <DialogTitle></DialogTitle>
          <DialogContent sx={{ textAlign: 'center', padding: 0 }}>
                {isRCAActionSelected === 'fill' ? (
                    <h3 style={{ color: '#575757' }}><strong>Confirm to Draft Incident Closure & Fill RCA</strong></h3>
                  ) : isRCAActionSelected === 'skip' ? (
                    <p style={{ color: '#575757' }}>
                      Skipping RCA will delete any drafted RCA for the Incident
                    </p>
                  ) : isRCAActionSelected === 'success' ? (
                    <p style={{ color: '#28a745' }}>
                      <strong>RCA Successfully Filled!</strong>
                    </p>
                  ) : null}
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', gap: 2, marginBottom: '12px' }}>
            <ActionButton
              variant="outlined"
              sx={{
                boxShadow: '0px 4px 4px 0px #00000040',
                '&:hover': {
                  transform: 'scale(1.05) !important',
                  transition: 'transform 0.3s ease !important',
                },
              }}
              startIcon={<StyledImage src={DoNotDisturbAltIcon} style={{ marginBottom: '1px', marginInlineEnd: 8 }} />}
              onClick={handleRCACancel}
            >
              <StyledTypography textTransform="none" marginTop="1px" color="rgba(0, 131, 192, 1)">
                Cancel
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
                    style={{ marginBottom: '1px', marginInlineEnd: 8, color: '#FFFFFF' }}
                  />
                }
                onClick={isRCAActionSelected === 'fill' ? handleSecondPopupOpen : handleSkipRca} 
              >
                <StyledTypography textTransform="none" marginTop="1px" color="#ffff">
                  Yes
                </StyledTypography>
              </ActionButton>
          </DialogActions>
        </Dialog>

      <Dialog open={openSecondPopup} onClose={handleSecondPopupCancel} PaperProps={{ style: { width: '360px' } }}>
        <DialogTitle></DialogTitle>
        <DialogContent sx={{ textAlign: 'center', padding: 0, margin: 2 }}>
          <p style={{ color: '#575757' }}>Don't have Access to RCA Incident Closure</p>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2, marginBottom: '12px' }}>
          {/* <Button variant="outlined" onClick={handleSecondPopupCancel}>Close</Button> */}
          <Button variant="outlined" sx={{
              backgroundColor: '#28a745', 
              color: 'white', 
              '&:hover': {
                backgroundColor: '#218838', 
              },
            }} 
             onClick={handleRCASubmit}>OK</Button>
        </DialogActions>
      </Dialog>

      </FlexContainer>
    

  

  );
};

export default IncidentLevel;
