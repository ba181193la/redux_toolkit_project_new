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
import DislikeIcon from '../../../../assets/Icons/DislikeIcon.png';
import { useNavigate } from 'react-router-dom';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';

const PendingIncidentTables = () => {
  const navigate = useNavigate();
  const dummyData = {
    data: [
      {
        sNo: 1,
        facility: 'Facility A',
        incidentDate: '13-06-2024',
        reportedDate: '13-06-2024',
        incidentNumber: 'NRC-IR-13062024-002',
        incidentDetail: '-',
        briefDescription: 'ukkhkh',
        incidentType: 'Not Applicable',
        departmentUnit: 'Cardiology',
        reportedBy: 'Not Applicable',
        overallTAT: '24h',
        overallTATCompliance: 'Yes',
        specificTAT: '2h',
        specificTATCompliance: 'No',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 2,
        facility: 'Facility B',
        incidentDate: '13-06-2024',
        reportedDate: '13-06-2024',
        incidentNumber: 'NRC-IR-13062024-001',
        incidentDetail: '-',
        briefDescription: 'kkjh',
        incidentType: 'Not Applicable',
        departmentUnit: 'Administration',
        reportedBy: 'Not Applicable',
        overallTAT: '48h',
        overallTATCompliance: 'Yes',
        specificTAT: '1h',
        specificTATCompliance: 'Yes',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 3,
        facility: 'Facility C',
        incidentDate: '07-05-2024',
        reportedDate: '08-05-2024',
        incidentNumber: 'NRC-IR-07052024-001',
        incidentDetail:
          'The Arrival of candidates to accommodation without prior Notice from HR/Recruitment',
        briefDescription: 'test',
        incidentType: 'Near Miss',
        departmentUnit: 'Accounts',
        reportedBy: 'DEMO USER 1',
        overallTAT: '72h',
        overallTATCompliance: 'No',
        specificTAT: '3h',
        specificTATCompliance: 'No',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 4,
        facility: 'Facility D',
        incidentDate: '05-05-2024',
        reportedDate: '02-05-2024',
        incidentNumber: 'NRC-IR-05052024-001',
        incidentDetail: 'Fire and Safety hazards',
        briefDescription: '-',
        incidentType: 'Adverse Event',
        departmentUnit: 'Administration',
        reportedBy: 'Melissa Ragadio',
        overallTAT: '36h',
        overallTATCompliance: 'Yes',
        specificTAT: '4h',
        specificTATCompliance: 'Yes',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 5,
        facility: 'Facility A',
        incidentDate: '13-03-2024',
        reportedDate: '13-03-2024',
        incidentNumber: 'NRC-IR-13032024-001',
        incidentDetail:
          'The Arrival of candidates to accommodation without prior Notice from HR/Recruitment',
        briefDescription: 'Report Incident - Location Test',
        incidentType: 'Near Miss',
        departmentUnit: 'Accounts',
        reportedBy: 'Dr. Sujitha',
        overallTAT: '24h',
        overallTATCompliance: 'No',
        specificTAT: '5h',
        specificTATCompliance: 'No',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 6,
        facility: 'Facility B',
        incidentDate: '12-03-2024',
        reportedDate: '11-03-2024',
        incidentNumber: 'NRC-IR-11032024-001',
        incidentDetail: 'Furniture misuse',
        briefDescription: 'Incident accident',
        incidentType: 'Near Miss',
        departmentUnit: 'Accounts',
        reportedBy: 'Dr. Sujitha',
        overallTAT: '48h',
        overallTATCompliance: 'Yes',
        specificTAT: '1h',
        specificTATCompliance: 'Yes',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 7,
        facility: 'Facility C',
        incidentDate: '08-03-2024',
        reportedDate: '07-03-2024',
        incidentNumber: 'NRC-IR-07032024-001',
        incidentDetail: 'Disruptive behaviors',
        briefDescription: 'Near Miss Incident',
        incidentType: 'Near Miss',
        departmentUnit: 'Ambulance',
        reportedBy: 'Not Applicable',
        overallTAT: '72h',
        overallTATCompliance: 'No',
        specificTAT: '2h',
        specificTATCompliance: 'No',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 8,
        facility: 'Facility D',
        incidentDate: '04-03-2024',
        reportedDate: '29-02-2024',
        incidentNumber: 'NRC-IR-29022024-003',
        incidentDetail: 'Lack of Laundromat Facilities',
        briefDescription: 'rtrt',
        incidentType: 'Adverse Event',
        departmentUnit: 'Admission',
        reportedBy: 'Dr. Sujitha',
        overallTAT: '24h',
        overallTATCompliance: 'Yes',
        specificTAT: '3h',
        specificTATCompliance: 'Yes',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 9,
        facility: 'Facility A',
        incidentDate: '01-03-2024',
        reportedDate: '29-02-2024',
        incidentNumber: 'NRC-IR-29022024-002',
        incidentDetail: 'Noncompliant/Uncooperative/ Inappropriate Behavior',
        briefDescription: 'fg',
        incidentType: 'Incident',
        departmentUnit: 'Administration',
        reportedBy: 'Not Applicable',
        overallTAT: '36h',
        overallTATCompliance: 'Yes',
        specificTAT: '5h',
        specificTATCompliance: 'No',
        incidentStatus: 'Waiting for Incident Approval',
        action: 'Approve/Reject',
      },
      {
        sNo: 10,
        facility: 'Facility B',
        incidentDate: '14-02-2024',
        reportedDate: '13-02-2024',
        incidentNumber: 'NRC-IR-13022024-001',
        incidentDetail:
          'Fire - The Environment of tree sometimes it can cause fire because of climate changes or humans trespassing. by the cause of fire animals can be harmed',
        briefDescription: 'spill',
        incidentType: 'Adverse Event',
        departmentUnit: 'Biomedical Engineering',
        reportedBy: 'aly',
        overallTAT: '48h',
        overallTATCompliance: 'Yes',
        specificTAT: '4h',
        specificTATCompliance: 'Yes',
        incidentStatus: 'Waiting for Incident Approval',
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

  // const handleAction = (incidentNumber) => {
  //   // Here you can add logic to navigate to the appropriate page
  //   // or trigger a dialog for approval/rejection
  // };

  const handleClick = () => {
    navigate('/IncidentManagement/RootCauseAnalysisEntry');
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
                <StyledTableHeaderCell>
                  Brief Description of Incident
                </StyledTableHeaderCell>
                <StyledTableHeaderCell>Incident Type</StyledTableHeaderCell>
                <StyledTableHeaderCell>Department/Unit</StyledTableHeaderCell>
                <StyledTableHeaderCell>Reported By</StyledTableHeaderCell>
                <StyledTableHeaderCell>Overall TAT</StyledTableHeaderCell>

                <StyledTableHeaderCell>
                  Overall TAT Compliance
                </StyledTableHeaderCell>

                <StyledTableHeaderCell>Specific TAT</StyledTableHeaderCell>

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
                    {incident.briefDescription}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {incident.incidentType}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {incident.departmentUnit}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {incident.reportedBy}
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
                  <StyledTableBodyCell>
                    <FlexContainer
                      style={{ gap: '10px' }}
                      className="action-icons"
                    >
                      <StyledImage
                        cursor="pointer"
                        height="18.5px"
                        width="18.5px"
                        src={LikeIcon}
                        onClick={handleClick}
                        alt="Edit"
                      />

                      {/* <StyledImage
                        cursor="pointer"
                        height="12.5px"
                        width="12.5px"
                        src={DislikeIcon}
                        alt="Delete"
                      /> */}
                    </FlexContainer>
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

export default PendingIncidentTables;
