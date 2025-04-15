import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  TableContainer,
  Table,
  TableBody,
  Paper,
} from '@mui/material';
import {
  FlexContainer,
  StyledTypography,
} from '../../../../../utils/StyledComponents';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
} from '../../../../../utils/DataTable.styled';
import CloseIcon from '../../../../../assets/Icons/CloseIcon.png';
import { useGetAttachmentDownloadQuery } from '../../../../../redux/RTK/incidentInvestigationApi';

const AttachmentDialog = ({
  viewAttachment,
  handleCloseViewAttachment,
  actionAttachments,
  isIncidentFetching,
  t,
  getlabel,
  labels,
  i18n,
}) => {
  const [attachmentLinks, setAttachmentLinks] = useState({});

  const [downloadParams, setDownloadParams] = useState(null);

 const { data: attachmentData, isSuccess } = useGetAttachmentDownloadQuery(
     downloadParams,
     { 
       skip: !downloadParams,
     }
   );
 
   useEffect(() => {
     if (isSuccess && attachmentData && downloadParams) {
       const url = window.URL.createObjectURL(attachmentData);
       const a = document.createElement('a');
       a.href = url;
       a.download = downloadParams.OriginalFileName || 'download';
       document.body.appendChild(a);
       a.click();
       document.body.removeChild(a);
       window.URL.revokeObjectURL(url);
       setDownloadParams(null);
     }
   }, [isSuccess, attachmentData, downloadParams]);
 
   const getAttachmentLink = (row) => {
     setDownloadParams({
       AutogenFileURL: row?.AutogenFilePath,
       OriginalFileName: row?.OriginalFileName,
     });
   };

  return (
    <Dialog
      open={viewAttachment}
      onClose={handleCloseViewAttachment}
      dir={'ltr'}
      maxWidth={'sm'}
      fullWidth={true}
      PaperProps={{
        sx: {
          borderRadius: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#205475',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
        }}
      >
        <StyledTypography
          fontSize="20px"
          fontWeight="300"
          lineHeight="18px"
          color="#fff"
        >
          Attachment(s)
        </StyledTypography>
        <IconButton
          onClick={handleCloseViewAttachment}
          style={{ padding: '0.7rem' }}
          sx={{
            color: '#fff',
            '&:hover': {
              transform: 'scale(1.05)',
              backgroundColor: 'color(srgb 0.75 0.74 0.74 / 0.15)',
            },
          }}
        >
          <img src={CloseIcon} alt="Close Icon" />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <FlexContainer flexDirection="column" width="100%">
          <TableContainer component={Paper}>
            <Table>
              <StyledTableHead backgroundColor="#3C8DBC">
                <StyledTableRow>
                  <StyledTableHeaderCell color="#fff" width="40px">
                    {t('SNo')}
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell color="#fff">
                    {getlabel('IM_II_Attachment(s)', labels, i18n.language)}
                  </StyledTableHeaderCell>
                </StyledTableRow>
              </StyledTableHead>

              <TableBody>
                {actionAttachments && actionAttachments.length > 0 ? (
                  actionAttachments.map((row, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>

                      <StyledTableBodyCell
                        style={{
                          textAlign: 'center',
                        }}
                      >
                        <span
                          style={{ cursor: 'pointer', color: 'blue' }}
                          onClick={() => getAttachmentLink(row)}
                        >
                          {row.OriginalFileName || ''}
                        </span>
                      </StyledTableBodyCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableBodyCell
                      colSpan={1}
                      style={{ textAlign: 'center' }}
                    >
                      {t('NoDataAvailable')}
                    </StyledTableBodyCell>
                  </StyledTableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </FlexContainer>
      </DialogContent>
    </Dialog>
  );
};

export default AttachmentDialog;
