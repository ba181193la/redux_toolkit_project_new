import React, { useState } from 'react';

import { Table, TableHead, 
  TableRow, TableCell, TableBody, Select, MenuItem, FormControl, InputLabel,TableContainer,Paper,Button, Box  } from '@mui/material';

import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
  ActionButton,
} from '../../../../utils/DataTable.styled';
import { FlexContainer, StyledImage,StyledTypography } from '../../../../utils/StyledComponents';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import ViewOnlyIcon from '../../../../assets/Icons/ViewOnlyIcon.png';
import { useNavigate } from 'react-router-dom';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
import Stack from '@mui/material/Stack';
import { useTranslation } from 'react-i18next';

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';

import DoNotDisturbAltIcon from '../../../../assets/Icons/DoNotDisturbIcon.png';



const CompletedIncidentTable = () => {
  const navigate = useNavigate();
    const { i18n, t } = useTranslation();
  

  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    // borderCollapse: 'collapse',
  width: '100%',
  '& th, & td': {
    border: '1px solid #ddd', 
    padding: theme.spacing(1), 
    textAlign: 'left',  
    borderBottom: '2px solid #ddd',
  },
  '& th': {
    backgroundColor: '#36a2da',
    color: '#ffff', 
    fontWeight: 'bold',          
  },
  }));


  const [open, setOpen] = React.useState(false);  
  const [openAction, setOpenAction] = React.useState(false);  
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenAction = () => {
    setOpenAction(true);
  };
  const handleClosAction = () => {
    setOpenAction(false);
  };


  const dummyData = {
    data: [
      {
        sNo: 1,
        facility: 'Apollo - Chennai',
        incidentDate: '24-06-2024',
        reportedDate: '24-06-2024',
        incidentNumber: 'NRC-IR-24062024-001',
        incidentDetail: 'Needle Stick',
        incidentType: 'Incident',
        departmentUnit: 'Security',
        approvedRejectedDate: '25-06-2024',
        approvedRejectedBy: 'Physician',
        addedEditedDate: '25-06-2024',
        remarks: 'Not Applicable',
        approvalType: 'Assigned',
        overallTAT: 60,
        overallTATCompliance: 'Yes',
        specificTAT: 20,
        specificTATCompliance: 'No',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 2,
        facility: 'Apollo - Trichy',
        incidentDate: '24-06-2024',
        reportedDate: '24-06-2024',
        incidentNumber: 'NRC-IR-24062024-002',
        incidentDetail: 'Clinical Administration',
        incidentType: 'Adverse Event',
        departmentUnit: 'Accounts',
        approvedRejectedDate: '25-06-2024',
        approvedRejectedBy: 'Physician',
        addedEditedDate: '25-06-2024',
        remarks: 'Not Applicable',
        approvalType: 'Rejected',
        overallTAT: 60,
        overallTATCompliance: 'Yes',
        specificTAT: 20,
        specificTATCompliance: 'No',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 3,
        facility: 'Apollo - Delhi',
        incidentDate: '20-05-2024',
        reportedDate: '21-05-2024',
        incidentNumber: 'NRC-IR-20052024-001',
        incidentDetail: 'Blood Spill',
        incidentType: 'Incident',
        departmentUnit: 'Emergency',
        approvedRejectedDate: '22-05-2024',
        approvedRejectedBy: 'Nurse',
        addedEditedDate: '22-05-2024',
        remarks: 'Under Review',
        approvalType: 'Pending',
        overallTAT: 48,
        overallTATCompliance: 'Yes',
        specificTAT: 12,
        specificTATCompliance: 'Yes',
        incidentStatus: 'Pending Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 4,
        facility: 'Apollo - Bangalore',
        incidentDate: '10-05-2024',
        reportedDate: '11-05-2024',
        incidentNumber: 'NRC-IR-10052024-003',
        incidentDetail: 'Slippery Floor',
        incidentType: 'Near Miss',
        departmentUnit: 'Housekeeping',
        approvedRejectedDate: '12-05-2024',
        approvedRejectedBy: 'Safety Officer',
        addedEditedDate: '12-05-2024',
        remarks: 'No Injury',
        approvalType: 'Assigned',
        overallTAT: 24,
        overallTATCompliance: 'No',
        specificTAT: 8,
        specificTATCompliance: 'No',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 5,
        facility: 'Apollo - Mumbai',
        incidentDate: '01-04-2024',
        reportedDate: '02-04-2024',
        incidentNumber: 'NRC-IR-01042024-002',
        incidentDetail: 'Medication Error',
        incidentType: 'Adverse Event',
        departmentUnit: 'Pharmacy',
        approvedRejectedDate: '03-04-2024',
        approvedRejectedBy: 'Doctor',
        addedEditedDate: '03-04-2024',
        remarks: 'Under Investigation',
        approvalType: 'Rejected',
        overallTAT: 72,
        overallTATCompliance: 'No',
        specificTAT: 24,
        specificTATCompliance: 'No',
        incidentStatus: 'Rejected',
        action: 'Approve/Reject',
      },
    ],
  };

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const handleOnPageChange = (newPage) => {
    setPageIndex(newPage);
  };

  const handleOnPageSizeChange = (newPageSize) => {
    setPageSize(newPageSize);
    setPageIndex(1);
  };

  const paginatedData = dummyData.data.slice(
    (pageIndex - 1) * pageSize,
    pageIndex * pageSize
  );

  // const handleClick = () => {
  //   navigate('/IncidentManagement/IncidentApprovalCompleted');
  // };

  return (
    <FlexContainer flexDirection="column" width="100%">
      <TableContainer component={Paper} style={{ border: '1px solid #99cde6' }}>
        <CustomScrollbars
          style={{ height: '350px' }}
          // rtl={i18n.language === 'ar'}
        >
          <Table>
            <StyledTableHead>
              <StyledTableRow>
                <StyledTableHeaderCell>S.No</StyledTableHeaderCell>
                <StyledTableHeaderCell>Incident Number</StyledTableHeaderCell>
                <StyledTableHeaderCell>Incident Date</StyledTableHeaderCell>
                <StyledTableHeaderCell>Brief Description of Incident </StyledTableHeaderCell>
                <StyledTableHeaderCell>Task Assigned</StyledTableHeaderCell>
                <StyledTableHeaderCell>Target Date</StyledTableHeaderCell>
                <StyledTableHeaderCell>Comments</StyledTableHeaderCell>
                <StyledTableHeaderCell>Submitted Date</StyledTableHeaderCell>
                <StyledTableHeaderCell>
                Submitted By
                </StyledTableHeaderCell>
                <StyledTableHeaderCell>
                Department
                </StyledTableHeaderCell>
                <StyledTableHeaderCell>Attachment(s)</StyledTableHeaderCell>
                <StyledTableHeaderCell>Approved By</StyledTableHeaderCell>
                <StyledTableHeaderCell>Approved Date</StyledTableHeaderCell>
                <StyledTableHeaderCell>Approver Remarks</StyledTableHeaderCell>
                <StyledTableHeaderCell>Action</StyledTableHeaderCell>
              </StyledTableRow>
            </StyledTableHead>
            <TableBody>
              {dummyData.data.map((incident, index) => (
                <StyledTableRow key={index}>
                  <StyledTableBodyCell>{incident.sNo}</StyledTableBodyCell>
                  <StyledTableBodyCell>{incident.facility}</StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {incident.incidentDate}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {incident.reportedDate}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {incident.incidentNumber}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {incident.incidentDetail}
                  </StyledTableBodyCell>

                  <StyledTableBodyCell>
                    {incident.incidentType}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {incident.departmentUnit}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {incident.approvedRejectedDate}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {incident.approvedRejectedBy}
                  </StyledTableBodyCell>

                  <StyledTableBodyCell>
                     <Stack spacing={2} direction="row">
                     <Button variant="outlined" startIcon={
                          <StyledImage
                            cursor="pointer"
                            height="10px"
                            width="14.6px"
                            src={ViewOnlyIcon}
                            alt="View"
                          />
                        }
                        onClick={handleClickOpen} 
                        >
                           View
                        </Button>
                    </Stack>
                  </StyledTableBodyCell>

                  <StyledTableBodyCell>{incident.remarks}</StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {incident.approvalType}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {incident.overallTAT}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell style={{ textAlign: 'center' }}>
                    <StyledImage
                      cursor="pointer"
                      height="10px"
                      width="14.6px"
                      src={ViewOnlyIcon}
                      onClick={handleOpenAction}
                      alt="View"
                    />
                  </StyledTableBodyCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </CustomScrollbars>
      </TableContainer>

      <CustomPagination
        totalRecords={dummyData.totalRecords}
        page={pageIndex}
        pageSize={pageSize}
        handleOnPageChange={handleOnPageChange}
        handleOnPageSizeChange={handleOnPageSizeChange}
      />


      {/* model */}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle sx={{ m: 0, p: 2, backgroundColor: '#0083c0', color: 'white',  }} id="customized-dialog-title">
          Attachment(s) Detais
        </DialogTitle>
        <DialogContent sx={{ width: '500px',  mt: '15px',  }}>
        <Table sx={{ borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow>
            <TableCell><strong>sNo</strong></TableCell>
            <TableCell><strong>Attachment(s)</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>1</TableCell>
            <TableCell>Text.doc</TableCell>
          </TableRow>
        </TableBody>
      </Table>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </BootstrapDialog>

       {/* model */}
       <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={openAction}
      >
        <DialogTitle sx={{ m: 0, p: 2, backgroundColor: '#0083c0', color: 'white',  }} id="customized-dialog-title">
          Attachment(s) Detais
        </DialogTitle>
        <DialogContent sx={{ width: '500px',  mt: '15px',  }}>
          <h6><strong>Rejected History :</strong></h6>
        <Table sx={{ borderCollapse: 'collapse' }}>
        <TableHead>
          <TableRow>
            <TableCell><strong>S.No</strong></TableCell>
            <TableCell><strong>Rejected By</strong></TableCell>
            <TableCell><strong>Rejected Date</strong></TableCell>
            <TableCell><strong>Remarks</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell  colSpan={4}  sx={{ textAlign: 'center' }} >No Data Found</TableCell>
          </TableRow>
        </TableBody>
      </Table>
       {/* Dropdown field */}
       <FormControl fullWidth sx={{ mt: 2 }}>
        <lable><strong>Action :*</strong></lable>
        <Select
          defaultValue=""
          fullWidth
          sx={{ height:'30px' }}
        >
          <MenuItem>Option 1</MenuItem>
          <MenuItem>Option 2</MenuItem>
          <MenuItem>Option 3</MenuItem>
        </Select>
        <label htmlFor="unique-id" style={{marginTop: '5px'}} ><strong>Remarks :*</strong></label>
          <textarea
            slotProps={{
              textarea: {
                id: 'unique-id',
              }
            }}
          ></textarea>
      </FormControl>
        </DialogContent>
        <DialogActions sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: 2, 
      }}>

        <Button 
          variant="contained" 
          color="primary" 
          // onClick={handleSubmitAction}
        >
          Submit
        </Button>
        <ActionButton
  variant="outlined"
  sx={{
    boxShadow: '0px 4px 4px 0px #00000040',
    '&:hover': {
      transform: 'scale(1.05)', // Removed !important
      transition: 'transform 0.3s ease',
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
    onClick={handleClosAction}  // Fixed function name
  >
    {t('Cancel')}
  </StyledTypography>
</ActionButton>

    </DialogActions>
      </BootstrapDialog>
    </FlexContainer>
  );
};

export default CompletedIncidentTable;
