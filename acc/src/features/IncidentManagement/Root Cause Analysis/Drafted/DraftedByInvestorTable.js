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
} from '../../../../utils/DataTable.styled';
import { FlexContainer } from '../../../../utils/StyledComponents';
import styled from 'styled-components';
import SearchIcon from '../../../../assets/Icons/Search.png';
import TextArea from '../../../../components/TextArea/TextArea';
import { TextField } from '../../../../components/TextField/TextField';

const StyledTableHead = styled(TableHead)`
  th {
    background-color: ${(props) =>
      props.backgroundColor || '#0083c0'} !important;
  }
`;

const RejectedByInvestorTable = () => {
  return (
    <FlexContainer flexDirection="column" width="100%" margin="0 0 10px 0">
      <TableContainer component={Paper}>
        <Table>
          <StyledTableHead backgroundColor="#e16d2a">
            <StyledTableRow>
              <StyledTableHeaderCell color="#000000A6">
                S.No
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Investigator Name
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Remarks
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Replace
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Department/Speciality
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Designation
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#000000A6">
                Comments
              </StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableBodyCell>1</StyledTableBodyCell>
              <StyledTableBodyCell>T.library1 </StyledTableBodyCell>
              <StyledTableBodyCell>
                rejct test data for approval process
              </StyledTableBodyCell>
              <StyledTableBodyCell>
                <TextField placeholder="Serach Here"></TextField>
                {/* <img src={SearchIcon} alt="Search Icon" width="50px" /> */}
              </StyledTableBodyCell>
              <StyledTableBodyCell>Not Applicable </StyledTableBodyCell>
              <StyledTableBodyCell>Not Applicable </StyledTableBodyCell>
              <StyledTableBodyCell>
                <TextField
                  fullWidth
                  placeholder=" "
                  slotProps={{ htmlInput: { maxLength: 100 } }}
                />{' '}
              </StyledTableBodyCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </FlexContainer>
  );
};

export default RejectedByInvestorTable;
