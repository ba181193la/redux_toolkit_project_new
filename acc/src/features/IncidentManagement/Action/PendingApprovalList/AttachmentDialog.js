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
} from '../../../../utils/StyledComponents';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
} from '../../../../utils/DataTable.styled';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import { useGetAttachmentDownloadQuery } from '../../../../redux/RTK/incidentInvestigationApi';

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
    if (isSuccess && attachmentData) {
      window.open(attachmentData, '_blank');
      setDownloadParams(null);
    }
  }, [isSuccess, attachmentData]);

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
          Attachment(s) Details
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
        <FlexContainer flexWrap="wrap">
          <TableContainer
            component={Paper}
            style={{
              border: '1px solid #99cde6',
              marginTop: '5px',
              marginBottom: '5px',
            }}
          >
            <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
              <StyledTableHead backgroundColor="#3C8DBC">
                <StyledTableRow>
                  <StyledTableHeaderCell color="#fff" width="40px">
                    {t('SNo')}
                  </StyledTableHeaderCell>
                  <StyledTableHeaderCell color="#fff">
                    {getlabel('IM_A_Attachment(s)', labels, i18n.language)}
                  </StyledTableHeaderCell>
                </StyledTableRow>
              </StyledTableHead>
              <TableBody style={{ marginTop: '5px', marginBottom: '5px' }}>
                {actionAttachments?.length > 0 ? (
                  actionAttachments?.map((attachment, index) => (
                    <StyledTableRow key={index}>
                      <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
                      <StyledTableBodyCell
                        style={{
                          textAlign: 'center',
                        }}
                      >
                        <span
                          style={{ cursor: 'pointer', color: '#337ab7' }}
                          onClick={() => getAttachmentLink(attachment)}
                        >
                          {attachment.OriginalFileName || ''}
                        </span>
                      </StyledTableBodyCell>
                    </StyledTableRow>
                  ))
                ) : (
                  <StyledTableRow>
                    <StyledTableBodyCell
                      colSpan={4}
                      style={{ textAlign: 'center' }}
                    >
                      {isIncidentFetching ? 'Loading...' : 'No data available'}
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
