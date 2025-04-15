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
    <FlexContainer flexDirection="column" width="100%" margin="0 0 10px 0" >
      <TableContainer component={Paper} style={{ padding: '0px' }}>
        <Table>
          <StyledTableHead backgroundColor="#e16d2a">
            <StyledTableRow>
              <StyledTableHeaderCell color="#fff">
                S.No
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#fff">
                Investigator Name
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#fff">
                Remarks
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#fff">
                Replace
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#fff">
                Department
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#fff">
                Designation
              </StyledTableHeaderCell>
              <StyledTableHeaderCell color="#fff">
                Comments
              </StyledTableHeaderCell>
            </StyledTableRow>
          </StyledTableHead>
          <TableBody>
            <StyledTableRow>
              <StyledTableBodyCell>1</StyledTableBodyCell>
              <StyledTableBodyCell>T.library1 </StyledTableBodyCell>
              <StyledTableBodyCell>
                rejct test data for approval process.
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
