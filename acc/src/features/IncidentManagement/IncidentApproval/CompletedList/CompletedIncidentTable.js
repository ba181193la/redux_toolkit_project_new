import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';

import {
  StyledTableBodyCell,
  StyledTableHeaderCell,
  StyledTableRow,
  ActionCell,
  StyledTableHead,
} from '../../../../utils/DataTable.styled';
import { FlexContainer, StyledImage } from '../../../../utils/StyledComponents';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import LikeIcon from '../../../../assets/Icons/LikeIcon.png';
import ViewOnlyIcon from '../../../../assets/Icons/ViewOnlyIcon.png';
import { useNavigate } from 'react-router-dom';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';
const CompletedIncidentTable = () => {
  const navigate = useNavigate();
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

  const handleClick = () => {
    navigate('/IncidentManagement/IncidentApprovalCompleted');
  };

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
                <StyledTableHeaderCell>Facility</StyledTableHeaderCell>
                <StyledTableHeaderCell>Incident Date</StyledTableHeaderCell>
                <StyledTableHeaderCell>Reported Date</StyledTableHeaderCell>
                <StyledTableHeaderCell>Incident Number</StyledTableHeaderCell>
                <StyledTableHeaderCell>Incident Detail</StyledTableHeaderCell>
                <StyledTableHeaderCell>Incident Type</StyledTableHeaderCell>
                <StyledTableHeaderCell>Department/Unit</StyledTableHeaderCell>
                <StyledTableHeaderCell>
                  Approved/Rejected Date
                </StyledTableHeaderCell>
                <StyledTableHeaderCell>
                  Approved/Rejected By
                </StyledTableHeaderCell>
                <StyledTableHeaderCell>Added/Edited Date</StyledTableHeaderCell>
                <StyledTableHeaderCell>Remarks</StyledTableHeaderCell>
                <StyledTableHeaderCell>Approval Type</StyledTableHeaderCell>
                <StyledTableHeaderCell>Overall TAT</StyledTableHeaderCell>
                <StyledTableHeaderCell>
                  Overall TAT Compliance
                </StyledTableHeaderCell>
                <StyledTableHeaderCell>Specific TAT </StyledTableHeaderCell>
                <StyledTableHeaderCell>
                  Specific TAT Compliance
                </StyledTableHeaderCell>

                <StyledTableHeaderCell>Incident Status</StyledTableHeaderCell>
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
                    {incident.addedEditedDate}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>{incident.remarks}</StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {incident.approvalType}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {incident.overallTAT}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {incident.overallTATCompliance}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {incident.specificTAT}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {incident.specificTATCompliance}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {incident.incidentStatus}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell style={{ textAlign: 'center' }}>
                    <StyledImage
                      cursor="pointer"
                      height="10px"
                      width="14.6px"
                      src={ViewOnlyIcon}
                      onClick={handleClick}
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
    </FlexContainer>
  );
};

export default CompletedIncidentTable;
