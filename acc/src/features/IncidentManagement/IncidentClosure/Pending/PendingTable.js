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
import {
  FlexContainer,
  StyledButton,
  StyledImage,
} from '../../../../utils/StyledComponents';
import CustomPagination from '../../../../components/Pagination/CustomPagination';
import LikeIcon from '../../../../assets/Icons/LikeIcon.png';
import DislikeIcon from '../../../../assets/Icons/DislikeIcon.png';
import { useNavigate } from 'react-router-dom';
import CustomScrollbars from '../../../../components/CustomScrollbars/CustomScrollbars';

const PendingTable = () => {
  const navigate = useNavigate();
  const dummyData = {
    data: [
      {
        sNo: 1,
        incidentDate: '28-06-2024',
        reportedDate: '28-06-2024',
        incidentNumber: 'NRC-IR-28062024-001',
        incidentDetail:
          'The Arrival of candidates to accommodation without prior Notice from HR/Recruitment',
        incidentType: 'Near Miss',
        departmentUnit: 'Accounts',
        requestReceivedDate: '29-08-2024',
        rcaStatus: 'Not Scored',
        incidentStatus: 'Waiting for Incident Closure',
        action: 'Edit',
      },
      {
        sNo: 2,
        incidentDate: '05-06-2023',
        reportedDate: '05-06-2023',
        incidentNumber: 'INC-1-05062023-002',
        incidentDetail: 'test data 102 - Test the incident detail',
        incidentType: 'Incident',
        departmentUnit: 'T.library1',
        requestReceivedDate: '04-07-2024',
        rcaStatus: 'Not Scored',
        incidentStatus: 'Waiting for Incident Closure',
        action: 'Edit',
      },
      {
        sNo: 3,
        incidentDate: '13-10-2023',
        reportedDate: '13-10-2023',
        incidentNumber: 'NRC-IR-13102023-002',
        incidentDetail: 'Unauthorized design modification',
        incidentType: 'Incident',
        departmentUnit: 'Accounts',
        requestReceivedDate: '25-06-2024',
        rcaStatus: 'Not Scored',
        incidentStatus: 'Waiting for Incident Closure',
        action: 'Edit',
      },
      {
        sNo: 4,
        incidentDate: '24-06-2024',
        reportedDate: '24-06-2024',
        incidentNumber: 'NRC-IR-24062024-001',
        incidentDetail: 'Inconsiderate/Rude/Hostile Behavior',
        incidentType: 'Incident',
        departmentUnit: 'Accounts',
        requestReceivedDate: '24-06-2024',
        rcaStatus: 'Not Scored',
        incidentStatus: 'Waiting for Incident Closure',
        action: 'Edit',
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
  //   navigate('/IncidentManagement/IncidentClosureDetail');
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
                <StyledTableHeaderCell>Incident Date</StyledTableHeaderCell>
                <StyledTableHeaderCell>Reported Date</StyledTableHeaderCell>
                <StyledTableHeaderCell>Incident Number</StyledTableHeaderCell>
                <StyledTableHeaderCell>Incident Detail</StyledTableHeaderCell>
                <StyledTableHeaderCell>Incident Type</StyledTableHeaderCell>
                <StyledTableHeaderCell>Department/Unit</StyledTableHeaderCell>
                <StyledTableHeaderCell>
                  Request Received Date
                </StyledTableHeaderCell>
                <StyledTableHeaderCell>RCA Status</StyledTableHeaderCell>
                <StyledTableHeaderCell>Incident Status</StyledTableHeaderCell>
                <StyledTableHeaderCell>Action</StyledTableHeaderCell>
              </StyledTableRow>
            </StyledTableHead>
            <TableBody>
              {dummyData.data.map((incident, index) => (
                <StyledTableRow key={index}>
                  <StyledTableBodyCell>{incident.sNo}</StyledTableBodyCell>
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
                    {incident.requestReceivedDate}
                  </StyledTableBodyCell>
                  <StyledTableBodyCell>
                    {incident.rcaStatus}
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
                        height="12.5px"
                        width="12.5px"
                        src={LikeIcon}
                        // onClick={handleClick}
                        alt="Edit"
                      />

                      <StyledImage
                        cursor="pointer"
                        height="12.5px"
                        width="12.5px"
                        src={DislikeIcon}
                        alt="Delete"
                      />
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

export default PendingTable;
