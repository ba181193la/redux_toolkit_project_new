import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import CloseIcon from '../../../assets/Icons/CloseIcon.png';
import { StyledImage, StyledTypography } from '../../../utils/StyledComponents';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PopupTable from './PopupTable';
import { useGetAuditLogByIdQuery } from '../../../redux/RTK/auditLogApi';

const AuditLogModalPopup = ({ open, onClose, eventId }) => {
  const { t } = useTranslation();

  const { userDetails } = useSelector((state) => state.auth);

  const { data: getAuditLogData = [], isFetching: isFetchingAuditLogData } =
    useGetAuditLogByIdQuery(
      {
        eventId: eventId,
        loginUserId: userDetails?.UserId,
      },
      {
        skip: !eventId || !userDetails?.UserId,
      }
    );

  const columns = [
    {
      id: 'FieldName',
      translationId: 'FieldName',
    },
    {
      id: 'OldValue',
      translationId: 'OldValue',
    },
    {
      id: 'NewValue',
      translationId: 'NewValue',
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: '900px',
          maxWidth: 'none',
          borderRadius: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
        },
      }}
    >
      <Box>
        <DialogTitle
          sx={{
            backgroundColor: '#205475',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            height: 40,
            alignItems: 'center',
            padding: '0 8px',
          }}
        >
          <StyledTypography
            fontSize="18px"
            fontWeight="300"
            lineHeight="18px"
            padding="0 12px"
            color="#fff"
          >
            {t('MM_AuditLog')}
          </StyledTypography>
          <Tooltip title="close" arrow>
            <IconButton
              onClick={onClose}
              sx={{
                color: '#fff',
                '&:hover': {
                  transform: 'scale(1.05)',
                  transition: 'transform 0.3s ease',
                  backgroundColor: 'rgba(15, 108, 189, 0.2)',
                },
              }}
            >
              <Tooltip title="Close" arrow>
                <StyledImage src={CloseIcon} alt="Close Icon" />
              </Tooltip>
            </IconButton>
          </Tooltip>
        </DialogTitle>


          <DialogContent sx={{ border: '4px solid #205475' }}>
            <Box sx={{ padding: '20px' }}>
              <PopupTable data={getAuditLogData?.Data} columns={columns} isFetchingAuditLogData={isFetchingAuditLogData}/>
            </Box>
          </DialogContent>
        
      </Box>
    </Dialog>
  );
};

export default AuditLogModalPopup;
