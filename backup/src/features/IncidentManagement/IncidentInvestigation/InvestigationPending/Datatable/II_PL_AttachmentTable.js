import React, { useState, useEffect, useRef } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  StyledTableHead,
} from '../../../../../utils/DataTable.styled';
import { FlexContainer } from '../../../../../utils/StyledComponents';
import { useTranslation } from 'react-i18next';
import { useGetAttachmentDownloadQuery } from '../../../../../redux/RTK/incidentInvestigationApi';

const AttachmentTable = ({ labels, data }) => {
  const { t } = useTranslation();
  
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
    <FlexContainer flexDirection="column" width="100%">
      <TableContainer component={Paper}>
        <Table>
          <StyledTableHead backgroundColor="#3C8DBC">
            <StyledTableRow>
              <StyledTableHeaderCell color="#fff">
                {t('Attachment(s)')}
              </StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>

          <TableBody>
            {data && data.length > 0 ? (
              data.map((row, index) => (
                <StyledTableRow key={index}>
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
  );
};

export default AttachmentTable;
