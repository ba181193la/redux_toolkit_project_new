import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Paper,
  Tooltip,
  TableSortLabel,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  IconButton,
  TextareaAutosize,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import EditIcon from '../../../../assets/Icons/EditIcon.png';
import DeleteIcon from '../../../../assets/Icons/DeleteIcon.png';
import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
  FormLabel,
} from '../../../../utils/DataTable.styled';
import {
  FlexContainer,
  StyledImage,
  StyledButton,
  StyledTypography,
} from '../../../../utils/StyledComponents';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import { useTranslation } from 'react-i18next';
import { getlabel } from '../../../../utils/language';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../../../../redux/features/mainMaster/staffMasterSlice';
import { useDeleteStaffMutation } from '../../../../redux/RTK/staffMasterApi';
import formatDate from '../../../../utils/FormatDate';
import { Link } from 'react-router-dom';
import { checkAccess } from '../../../../utils/Auth';
import DeleteUserGif from '../../../../assets/Gifs/DeleteuserGif.gif';
import SuccessGif from '../../../../assets/Gifs/SuccessGif.gif';
import LockIcon from '@mui/icons-material/Lock';

import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '../../../../assets/Icons/CloseIcon.png';
import DoneIcon from '../../../../assets/Icons/DoneIcon.png';
import DndIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Label from '../../../../components/Label/Label';
import { TextField } from '../../../../components/TextField/TextField';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import Scrollbars from 'react-custom-scrollbars-2';
import { showSweetAlert, showToastAlert } from '../../../../utils/SweetAlert';
import Error from '../../../../assets/Gifs/error.gif';
import {
  useGetActionCompletedQuery,
  useGetCompletedPrintActionMutation,
  useGetRejectionHistoryByIdQuery,
  useGetActionsAttachmentByIdQuery,
} from '../../../../redux/RTK/IncidentManagement/ActionsApi';

import { useGetAttachmentDownloadQuery } from '../../../../redux/RTK/incidentInvestigationApi';
import AttachmentDialog from './AttachmentDialog.js';
import jsPDF from 'jspdf';
import ActionDetailCompletedPdf from './ActionDetailCompletedPdf';
import Logo from '../../../../assets/Icons/Logo.png';
import format24HrTime from '../../../../utils/Format24HrTime';

const styles = {
  wrapText: {
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
    whiteSpace: 'normal',
  },
};

const DataTable = ({ columns = [], records, totalRecords, labels, isView }) => {
  const { i18n, t } = useTranslation();
  const dispatch = useDispatch();
  const pdfSectionRef = useRef(null);

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [attachmentLinks, setAttachmentLinks] = useState([]);

  const { pageSize, pageIndex } = useSelector(
    (state) => state.staffMaster.filters
  );
  const {
    userDetails,
    selectedMenu,
    roleFacilities,
    isSuperAdmin,
    selectedFacility,
    selectedModuleId,
  } = useSelector((state) => state.auth);
  const filters = useSelector((state) => state.staffMaster.filters);

  const [deleteStaff, { isLoading: isDeleting }] = useDeleteStaffMutation();
  const [selectedIncident, setSelectedIncident] = useState([]);
  const handleClosePopup = () => setOpenPopup(false);
  const handleCloseViewAttachment = () => setViewAttachment(false);

  const [openPopup, setOpenPopup] = useState(false);
  const [viewAttachment, setViewAttachment] = useState(false);

  const [actiontype, setActiontype] = useState(false);
  const [remarks, setRemark] = useState(false);

  const [message, setMessage] = useState('');
  const [color, setColor] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [triggerDownloadData] = useGetCompletedPrintActionMutation();

  const currentItems = [];
  const isIncidentFetching = false;

  const handleOnPageChange = (event, newPage) => {
    dispatch(
      setFilters({
        ...filters,
        pageIndex: newPage,
      })
    );
  };

  const handleOnPageSizeChange = (event) => {
    dispatch(
      setFilters({
        ...filters,
        pageIndex: 0,
        pageSize: parseInt(event.target.value, 10),
      })
    );
  };

  const handleOnDelete = async (row) => {
    const callback = async () => {
      try {
        await deleteStaff({
          userId: row.UserId,
          loginUserId: userDetails?.UserId,
          menuId: selectedMenu?.id,
        }).unwrap();

        showSweetAlert({
          type: 'success',
          title: 'Deleted!',
          text: 'Your staff has been deleted.',
          timer: 3000,
          gif: SuccessGif,
          height: 250,
          width: 250,
        });
      } catch (error) {
        console.log({ error });
      }
    };
    showSweetAlert({
      type: 'delete',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      gif: DeleteUserGif,
      callback,
      cancelButtonText: 'No, Keep it',
      confirmButtonText: 'Yes, delete it!',
    });
  };

  const handleSortRequest = (column) => {
    const isAsc = orderBy === column && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(column);
  };

  const handleActionchange = (event) => {
    setActiontype(event.target.value);
  };

  const handleRemark = (event) => {
    setRemark(event.target.value);
  };

  const sortedRecords = [...records].sort((a, b) => {
    const aValue = a[orderBy]?.toString().toLowerCase();
    const bValue = b[orderBy]?.toString().toLowerCase();
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  const handleOpenPopup = (row) => {
    setSelectedIncident(row);
    setOpenPopup(true);
  };
  const handleViewAttachment = (row) => {
    setSelectedIncident(row);
    setViewAttachment(true);
  };

  const rejectionHistory = [
    {
      fieldId: `A_RH_RejectedBy`,
      translationId: 'IM_A_RejectedBy',
      label: 'Department',
      name: 'Department',
    },
    {
      fieldId: `A_RH_RejectedDate`,
      translationId: 'IM_A_RejectedDate',
      label: 'Designation',
      name: 'Designation',
    },
    {
      fieldId: `A_RH_ApproverRemarks`,
      translationId: 'IM_A_ApproverRemarks',
      label: 'StaffName',
      name: 'StaffName',
    },
  ];

  const handleReassign = async (e) => {
    e.preventDefault();

    if (!remarks || remarks == '') {
      setOpenPopup(false);

      showSweetAlert({
        type: 'warning',
        title: 'Oops!',
        text: 'Please Enter Remarks',
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

    try {
      const response = await triggerReassignAction({
        payload: {
          reAssignedActionsLogId: 0,
          incidentId: selectedIncident?.IncidentId,
          actionsId: selectedIncident?.ActionsId,
          incidentClosureId: selectedIncident?.IncidentClosureId,
          closureActionId: selectedIncident?.ClosureActionId,
          responsibleUserId: selectedIncident?.ResponsibleStaffId,
          reAssignedResponsibleUserId: tableData[0]?.UserId,
          reAssignedRemarks: remarks,
          createdBy: 1,
          headerFacilityId: selectedFacility?.id,
          loginUserId: userDetails?.UserId,
          moduleId: selectedModuleId,
          menuId: selectedMenu?.id,
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
      navigate('/IncidentManagement/Actions');
    } catch (error) {
      if (error && error.data) {
        setOpenPopup(false);
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

  const handlePrint = async (row) => {
    const send_data = {
      headerFacilityId: selectedFacility?.id,
      actionId: row?.ActionsId,
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
    };

    try {
      setIsLoading(true);
      setColor('#4caf50');
      setMessage('Downloading ...');
      const blob = await triggerDownloadData({
        headerFacilityId: selectedFacility?.id,
        actionId: row?.ActionsId,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      }).unwrap();

      saveAs(blob, 'Action Completed file.pdf');
      setMessage('Download completed');
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      setColor('#e63a2e');
      setMessage('Download Failed');
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  const { data: attachments = [] } = useGetActionsAttachmentByIdQuery({
    loginUserId: userDetails?.UserId,
    moduleId: selectedModuleId,
    menuId: selectedMenu?.id,
    actionId: selectedIncident?.ActionsId,
  });

  const actionAttachments = Array.isArray(attachments?.Data)
    ? attachments.Data
    : [];

  const { data: rejection = [], isFetching: isrejection } =
    useGetRejectionHistoryByIdQuery({
      loginUserId: userDetails?.UserId,
      moduleId: selectedModuleId,
      menuId: selectedMenu?.id,
      actionId: selectedIncident?.ActionsId,
    });

  const rej_history = rejection?.Data || [];

  const handleActionPrint = async (row) => {
    let pdfData;

    const doc = new jsPDF();
    try {
      const response = await triggerDownloadData({
        headerFacilityId: selectedFacility?.id,
        actionId: row?.ActionsId,
        loginUserId: userDetails?.UserId,
        moduleId: selectedModuleId,
        menuId: selectedMenu?.id,
      }).unwrap();
      pdfData = response?.Data[0];
    } catch (error) {
      console.error('Failed to fetch PDF data:', error);
      alert('An error occurred while generating the PDF. Please try again.');
      return;
    }
    const safeText = (value) =>
      value !== null && value !== undefined ? String(value) : '';

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const borderMargin = 10;
    const margin = 12;

    let totalPages = 1;

    const drawPageBorder = () => {
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.rect(
        borderMargin,
        borderMargin,
        pageWidth - 2 * borderMargin,
        pageHeight - 2 * borderMargin
      );
    };

    const addFooter = (pageNumber, totalPages) => {
      const footerLineY = pageHeight - borderMargin - 10;
      const footerTextY = footerLineY + 10;

      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(
        borderMargin,
        footerLineY,
        pageWidth - borderMargin,
        footerLineY
      );

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Confidential Information', pageWidth / 2, footerTextY - 4, {
        align: 'center',
      });

      doc.setFont('helvetica', 'normal');
      doc.text(
        `Page ${pageNumber} of ${totalPages}`,
        pageWidth - margin,
        footerTextY - 4,
        { align: 'right' }
      );
    };

    drawPageBorder();

    const logoWidth = 60;
    const logoHeight = 20;
    const logoX = margin;
    const logoY = margin;
    const imgElement = document.getElementById('logo');
    const logoSrc = imgElement.src;

    doc.addImage(logoSrc, 'PNG', logoX, logoY, logoWidth, logoHeight);
    doc.setFontSize(12);
    doc.text(`${selectedFacility?.name}`, pageWidth - margin, margin + 10, {
      align: 'right',
    });
    doc.text(
      `${getlabel('IM_A_IncidentNumber', labels, i18n.language)} :  ${safeText(pdfData?.IncidentNo)}`,
      pageWidth - margin,
      margin + 20,
      { align: 'right' }
    );
    const headerLineY = logoY + logoHeight + 5;

    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(borderMargin, headerLineY, pageWidth - borderMargin, headerLineY);

    const sectionStartY = margin + 25.5;
    const sectionHeight = 8;
    const reduction = 0.3;
    doc.setFillColor(200, 200, 200);

    doc.rect(
      borderMargin + reduction,
      sectionStartY,
      pageWidth - 2 * (borderMargin + reduction),
      sectionHeight,
      'F'
    );
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text('Action Detail - Completed', pageWidth / 2, sectionStartY + 5, {
      align: 'center',
    });

    let y = sectionStartY + 15;
    let currentPage = 1;

    const details = [
      [
        getlabel('IM_A_IncidentNumber', labels, i18n.language),
        safeText(pdfData?.IncidentNo) || '-',
        getlabel('IM_A_IncidentDate', labels, i18n.language),
        formatDate(pdfData?.IncidentDateTime) || '-',
      ],
      [
        getlabel('IM_A_TaskAssigned', labels, i18n.language),
        safeText(pdfData?.TaskAssigned) || '-',
        getlabel('IM_A_TargetDate', labels, i18n.language),
        formatDate(pdfData?.TargetDate) || '-',
      ],
      [
        getlabel('IM_A_Comments', labels, i18n.language),
        safeText(pdfData?.Comments) || '-',
        getlabel('IM_A_SubmittedDate', labels, i18n.language),
        formatDate(pdfData?.SubmittedDate) || '-',
      ],
      [
        getlabel('IM_A_SubmittedBy', labels, i18n.language),
        safeText(pdfData?.SubmittedBy) || '-',
        getlabel('IM_A_Department', labels, i18n.language),
        safeText(pdfData?.DepartmentName) || '-',
      ],
      [
        getlabel('IM_A_ApprovedBy', labels, i18n.language),
        safeText(pdfData?.ApprovedBy) || '-',
        getlabel('IM_A_ApprovedDate', labels, i18n.language),
        formatDate(pdfData?.ApprovedDate) || '-',
      ],
      [
        getlabel('IM_A_ApproverRemarks', labels, i18n.language),
        safeText(pdfData?.ApproverRemarks) || '-',
        '',
        '',
      ],
    ];
    const filteredDetails = details.map((row) =>
      row.map((cell) => (cell === '' ? ' ' : cell))
    );
    filteredDetails.forEach(([label1, value1, label2, value2]) => {
      if (y + 10 > pageHeight - margin - 20) {
        addFooter(currentPage, totalPages);
        doc.addPage();
        drawPageBorder();
        currentPage++;
        totalPages++;
        y = margin + 10;
      }
      doc.setFontSize(10);

      const labelWidth = 50;
      const valueWidth = 55;
      const lineHeight = 6;

      const wrappedLabel1 = doc.splitTextToSize(label1, labelWidth);
      const wrappedValue1 = doc.splitTextToSize(value1, valueWidth);
      const wrappedLabel2 = doc.splitTextToSize(label2, labelWidth);
      const wrappedValue2 = doc.splitTextToSize(value2, valueWidth);

      const maxLines = Math.max(
        wrappedLabel1.length,
        wrappedValue1.length,
        wrappedLabel2.length,
        wrappedValue2.length
      );

      for (let i = 0; i < maxLines; i++) {
        const label1Text = wrappedLabel1[i] || '';
        const value1Text = wrappedValue1[i] || '';
        const label2Text = wrappedLabel2[i] || '';
        const value2Text = wrappedValue2[i] || '';

        doc.setFont('helvetica', 'bold');
        doc.text(label1Text, margin, y);
        if (i === 0) doc.text(':', margin + labelWidth - 5, y);
        doc.setFont('helvetica', 'normal');
        doc.text(value1Text, margin + labelWidth, y, { maxWidth: valueWidth });

        if (label2Text.trim() !== '' || value2Text.trim() !== '') {
          doc.setFont('helvetica', 'bold');
          doc.text(label2Text, margin + 100, y);
          if (i === 0 && label2Text.trim() !== '') {
            doc.text(':', margin + 95 + labelWidth, y);
          }
          doc.setFont('helvetica', 'normal');
          doc.text(value2Text, margin + 100 + labelWidth, y, {
            maxWidth: valueWidth,
          });
        }

        y += lineHeight;
      }
    });

    if (y + 30 > pageHeight - margin - 20) {
      addFooter(currentPage, totalPages);
      doc.addPage();
      drawPageBorder();
      currentPage++;
      totalPages++;
      y = margin + 10;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text(
      `${getlabel('IM_A_Attachment(s)', labels, i18n.language)}`,
      margin,
      y + 2
    );

    const tableBody = pdfData?.ActionAttachmentList.map((item, index) => [
      index + 1,
      item?.OriginalFileName,
    ]);
    doc.autoTable({
      startY: y + 8,
      head: [
        ['S.No', `${getlabel('IM_A_Attachment(s)', labels, i18n.language)}`],
      ],
      body: tableBody,
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
        fillStyle: 'DF',
      },
      headStyles: {
        textColor: [0, 0, 0],
        fontStyle: 'bold',
        fillColor: false,
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontStyle: 'normal',
        fillColor: [255, 255, 255],
      },
      willDrawCell: function (data) {
        if (data.section === 'body') {
          let cell = data.cell;
          cell.styles.fillColor = false;
        }
      },
      margin: { left: margin, right: margin },
    });

    const boxX = margin;
    const boxWidth = 186;
    const boxHeight = 20;
    let finalY = doc.lastAutoTable.finalY || y + 8;
    const boxY = finalY + 5;
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    doc.rect(boxX, boxY, boxWidth, boxHeight);

    doc.setFont('helvetica', 'bold');
    doc.text('Generated By', boxX + 2, boxY + 6);
    doc.text('Designation', boxX + 105, boxY + 6);

    doc.setFont('helvetica', 'normal');
    doc.text(`: ${userDetails?.UserName}`, boxX + 35, boxY + 6);
    doc.text(`: ${userDetails?.DesignationName}`, boxX + 140, boxY + 6);

    doc.setFont('helvetica', 'bold');
    doc.text('Generated Date', boxX + 2, boxY + 12);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `: ${formatDate(date) + ' ' + hours + ':' + minutes} `,
      boxX + 35,
      boxY + 12
    );

    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      addFooter(i, totalPages);
    }

    doc.save('Action_Details_Completed.pdf');
  };

  return (
    <FlexContainer flexDirection="column">
      <TableContainer component={Paper}>
        <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
          <StyledTableHead>
            <TableRow>
              <StyledTableHeaderCell>{t('SNo')}</StyledTableHeaderCell>
              {columns
                ?.filter((col) => col.isSelected)
                ?.map((column) => (
                  <StyledTableHeaderCell key={column.id}>
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSortRequest(column.id)}
                    >
                      {getlabel(column.translationId, labels, i18n.language)}
                    </TableSortLabel>
                  </StyledTableHeaderCell>
                ))}
              {checkAccess(isSuperAdmin, isView, true) && (
                <StyledTableHeaderCell>Actions</StyledTableHeaderCell>
              )}
            </TableRow>
          </StyledTableHead>
          <TableBody>
            {sortedRecords?.length > 0 ? (
              sortedRecords?.map((row, rowIndex) => {
                const menu = roleFacilities?.find(
                  (role) => role.FacilityName === row.Facility
                )?.Menu;
                const role = menu?.find(
                  (item) => item.MenuId === selectedMenu?.id
                );
                return (
                  <StyledTableRow key={rowIndex}>
                    <StyledTableBodyCell>
                      {pageIndex * pageSize + rowIndex + 1}
                    </StyledTableBodyCell>
                    {columns
                      ?.filter((col) => col.isSelected)
                      .map((column) => (
                        <StyledTableBodyCell
                          key={column.id}
                          style={{
                            maxWidth:
                              column.id === 'SecondaryDesignation'
                                ? '150px'
                                : 'auto',
                            wordWrap: 'break-word',
                            overflowWrap: 'break-word',
                            whiteSpace: 'normal',
                          }}
                          status={column.id === 'Status' ? row[column.id] : ''}
                        >
                          {column.id === 'Added_EditedDate' ||
                          column.id === 'IncidentDateTime' ||
                          column.id === 'TargetDate' ||
                          column.id === 'SubmittedDate' ||
                          (column.id === 'ApprovedDate' && row[column.id]) ? (
                            <div
                              style={{
                                backgroundColor:
                                  (column.id === 'TargetDate' ||
                                    column.id === 'SubmittedDate') &&
                                  row.ColorCode
                                    ? row.ColorCode
                                    : 'transparent',
                                color:
                                  column.id === 'TargetDate' ||
                                  column.id === 'SubmittedDate'
                                    ? '#ffffff'
                                    : 'inherit',
                                fontWeight:
                                  column.id === 'TargetDate' ||
                                  column.id === 'SubmittedDate'
                                    ? 'bold'
                                    : 'normal',

                                borderRadius: '4px',
                                textAlign: 'center',
                              }}
                            >
                              {formatDate(row[column.id])}
                            </div>
                          ) : column.id === 'SecondaryDesignation' ? (
                            <div style={styles.wrapText}>
                              {row[column.id] ?? null}
                            </div>
                          ) : column.id === 'Attachment(s)' &&
                            row[column.id] ? (
                            <Tooltip title="View" arrow>
                              <Button
                                style={{ marginRight: '5px' }}
                                variant="contained"
                                color="warning"
                                startIcon={<VisibilityIcon />}
                                onClick={() => handleOpenPopup(row)}
                              >
                                View
                              </Button>
                            </Tooltip>
                          ) : (
                            (row[column.id] ?? null)
                          )}
                          {column.id === 'Attachment' ? (
                            <ActionCell>
                              <FlexContainer className="action-icons">
                                <Tooltip title="View Attachment" arrow>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleViewAttachment(row)}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '10px',
                                      padding: '6px 12px',
                                      marginLeft: '10px',
                                    }}
                                  >
                                    <i className="fas fa-eye"></i>
                                    <span>View</span>
                                  </Button>
                                </Tooltip>
                                <Tooltip title="Print" arrow>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    // disabled={isPdfDataFetching}
                                    onClick={() => handleActionPrint(row)}
                                    style={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '10px',
                                      padding: '6px 12px',
                                      marginLeft: '10px',
                                    }}
                                    startIcon={<PrintIcon />}
                                  >
                                    {/* <i className="fas fa-eye"></i> */}
                                    <span>Print</span>
                                  </Button>
                                </Tooltip>
                              </FlexContainer>
                            </ActionCell>
                          ) : null}
                        </StyledTableBodyCell>
                      ))}
                    {checkAccess(
                      isSuperAdmin,
                      isView,
                      role?.isView || role?.IsPrint
                    ) && (
                      <ActionCell>
                        <FlexContainer className="action-icons">
                          {/* View Button */}
                          <Tooltip title="View" arrow>
                            <Button
                              style={{ marginRight: '5px' }}
                              variant="contained"
                              color="warning"
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleOpenPopup(row)}
                            >
                              View
                            </Button>
                          </Tooltip>

                          {/* Print Button */}
                          <Tooltip title="Print" arrow>
                            <Button
                              style={{ marginRight: '5px' }}
                              variant="contained"
                              color="primary"
                              startIcon={<PrintIcon />}
                              onClick={() => handlePrint(row)}
                            >
                              Print
                            </Button>
                          </Tooltip>
                        </FlexContainer>
                      </ActionCell>
                    )}
                    {userDetails?.StaffCategoryName ===
                      'module admin incident' && (
                      <ActionCell>
                        <FlexContainer className="action-icons">
                          {/* View Button */}
                          <Tooltip title="View" arrow>
                            <Button
                              style={{ marginRight: '5px' }}
                              variant="contained"
                              color="warning"
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleOpenPopup(row)}
                            >
                              View
                            </Button>
                          </Tooltip>

                          {/* Print Button */}
                          <Tooltip title="Print" arrow>
                            <Button
                              style={{ marginRight: '5px' }}
                              variant="contained"
                              color="primary"
                              startIcon={<PrintIcon />}
                              onClick={() => handlePrint(row)}
                            >
                              Print
                            </Button>
                          </Tooltip>
                        </FlexContainer>
                      </ActionCell>
                    )}
                  </StyledTableRow>
                );
              })
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
      <Dialog
        open={openPopup}
        onClose={handleClosePopup}
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
            Rejected Action
          </StyledTypography>
          <IconButton
            onClick={handleClosePopup}
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
                marginTop: `50px`,
                marginBottom: `50px`,
              }}
            >
              <Table stickyHeader style={{ borderCollapse: 'collapse' }}>
                <StyledTableHead backgroundColor="#3C8DBC">
                  <StyledTableRow>
                    <StyledTableHeaderCell color="#fff" width="40px">
                      {t('SNo')}
                    </StyledTableHeaderCell>
                    {rejectionHistory?.map((column) => (
                      <StyledTableHeaderCell color="#fff" key={column.name}>
                        {getlabel(column.translationId, labels, i18n.language)}
                      </StyledTableHeaderCell>
                    ))}
                    {/* <StyledTableHeaderCell>Actions</StyledTableHeaderCell> */}
                  </StyledTableRow>
                </StyledTableHead>
                <TableBody style={{ marginTop: `5px`, marginBottom: `5px` }}>
                  {rej_history.length > 0 ? (
                    rej_history.map((incident, index) => (
                      <StyledTableRow key={incident.IncidentId}>
                        <StyledTableBodyCell>{index + 1}</StyledTableBodyCell>
                        <StyledTableBodyCell>
                          {incident.RejectedName}
                        </StyledTableBodyCell>
                        <StyledTableBodyCell>
                          {incident.RejectedDate}
                        </StyledTableBodyCell>
                        <StyledTableBodyCell>
                          {incident.RejectedReason}
                        </StyledTableBodyCell>
                        {/* <StyledTableBodyCell></StyledTableBodyCell> */}
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow>
                      <StyledTableBodyCell
                        colSpan={4}
                        style={{ textAlign: 'center' }}
                      >
                        {isIncidentFetching
                          ? 'Loading...'
                          : 'No data available'}
                      </StyledTableBodyCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </FlexContainer>
        </DialogContent>
      </Dialog>

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
      <div
        ref={pdfSectionRef}
        id="pdfSectionRef"
        className="no-print"
        style={{ display: 'none' }}
      >
        <>
          <img id="logo" src={Logo} />
        </>
        {/* <ActionDetailCompletedPdf /> */}
      </div>
      {totalRecords?.length > 0 && (
        <CustomPagination
          totalRecords={totalRecords}
          page={pageIndex}
          pageSize={pageSize}
          handleOnPageChange={handleOnPageChange}
          handleOnPageSizeChange={handleOnPageSizeChange}
        />
      )}
    </FlexContainer>
  );
};

export default DataTable;
