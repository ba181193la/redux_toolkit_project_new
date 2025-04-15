import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  Tooltip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  IconButton,
} from '@mui/material';
import EditIcon from '../../../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../../../assets/Icons/DeleteIcon.png';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
} from '../../../../../utils/DataTable.styled';
import {
  FlexContainer,
  StyledImage,
} from '../../../../../utils/StyledComponents';
import CustomPagination from '../../../../../components/Pagination/CustomPagination';
import CustomScrollbars from '../../../../../components/CustomScrollbars/CustomScrollbars';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../../../../redux/features/mainMaster/incidentApprovalSlice';
import { useDeleteStaffMutation } from '../../../../../redux/RTK/staffMasterApi';
import formatDate from '../../../../../utils/FormatDate';
import { Link } from 'react-router-dom';
import { checkAccess } from '../../../../../utils/Auth';
import { showSweetAlert } from '../../../../../utils/SweetAlert';
import DeleteUserGif from '../../../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../../../assets/Gifs/SuccessGif.gif';
import AttachmentDialog from './AttachmentDialog.js';
import VisibilityIcon from '@mui/icons-material/Visibility';

const styles = {
  wrapText: {
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
  },
};

const DataTable = ({ columns = [], records, labels, attachments }) => {
  console.log('DataTableecords:', attachments);
  const actionAttachments = Array.isArray(attachments) ? attachments : [];
  const isIncidentFetching = false;

  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const [viewAttachment, setViewAttachment] = useState(false);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [selectedIncident, setSelectedIncident] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);

  const { pageSize, pageIndex } = useSelector(
    (state) => state.incidentApproval.filters
  );
  const { userDetails, selectedMenu, roleFacilities, isSuperAdmin } =
    useSelector((state) => state.auth);
  const filters = useSelector((state) => state.incidentApproval.filters);

  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };
  const handleClosePopup = () => setOpenPopup(false);

  const handleViewAttachment = () => {
    setViewAttachment(true);
  };
  const handleCloseViewAttachment = () => setViewAttachment(false);

  const extractedRecords = records;

  return (
    <FlexContainer flexDirection="column">
      <TableContainer component={Paper}>
        <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
          <StyledTableHead>
            <TableRow>
              <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
              {columns?.map((column) => (
                <StyledTableHeaderCell key={column.name}>
                  {getlabel(column.translationId, labels, i18n.language)}
                </StyledTableHeaderCell>
              ))}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {Array.isArray(extractedRecords) ? (
              extractedRecords.length > 0 ? (
                extractedRecords.map((row, rowIndex) => {
                  return (
                    <StyledTableRow key={rowIndex}>
                      <StyledTableBodyCell>
                        {pageIndex * pageSize + rowIndex + 1}
                      </StyledTableBodyCell>
                      {columns?.map((column) => {
                        const cellValue = row[column.name];
                        const isDateColumn = [
                          'TargetDate',
                          'ResponseDate',
                          'RequestedDate',
                          'ApprovedDate',
                          'RequestReceivedDate',
                        ].includes(column.name);

                        return (
                          <StyledTableBodyCell key={column.name}>
                            {isDateColumn && cellValue
                              ? formatDate(cellValue)
                              : (cellValue ?? '')}
                          </StyledTableBodyCell>
                        );
                      })}
                    </StyledTableRow>
                  );
                })
              ) : (
                <TableRow>
                  <StyledTableBodyCell colSpan={columns.length} align="center">
                    {t('NoDataAvailable')}
                  </StyledTableBodyCell>
                </TableRow>
              )
            ) : extractedRecords && typeof extractedRecords === 'object' ? (
              <StyledTableRow>
                <StyledTableBodyCell>1</StyledTableBodyCell>
                {columns?.map((column) => {
                  const cellValue = extractedRecords[column.name];
                  const isDateColumn = [
                    'TargetDate',
                    'ResponseDate',
                    'RequestedDate',
                    'ApprovedDate',
                    'RequestReceivedDate',
                  ].includes(column.name);

                  return (
                    <StyledTableBodyCell key={column.name}>
                      {column.name === 'Attachments' ? (
                        <>
                         
                          <Tooltip title="View" arrow>
                            <Button
                              style={{ marginRight: '5px' }}
                              variant="contained"
                              color="warning"
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleViewAttachment()}
                            >
                              View
                            </Button>
                          </Tooltip>
                        </>
                      ) : isDateColumn && cellValue ? (
                        formatDate(cellValue)
                      ) : (
                        (cellValue ?? '')
                      )}
                    </StyledTableBodyCell>
                  );
                })}
              </StyledTableRow>
            ) : (
              <TableRow>
                <StyledTableBodyCell colSpan={columns.length} align="center">
                  {t('NoDataAvailable')}
                </StyledTableBodyCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <AttachmentDialog
        viewAttachment={viewAttachment}
        handleCloseViewAttachment={handleCloseViewAttachment}
        actionAttachments={actionAttachments}
        isIncidentFetching={isIncidentFetching}
        t={t}
        getlabel={getlabel}
        labels={labels}
        i18n={i18n}
      />
    </FlexContainer>
  );
};

export default DataTable;
